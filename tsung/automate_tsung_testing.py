import subprocess
import os
import re
from threading import Thread, Lock
from time import sleep
import requests
import argparse

app_instances = ['t3.micro']#, 'r5.4xlarge']# ['t3.micro', 't3.medium', 't3.xlarge', 'r5.large', 'r5.4xlarge', 'i3.large']
db_instances = ['db.t3.micro']#, 'db.t3.xlarge']#, 'db.r5.4xlarge']# ['db.t3.micro', 'db.t3.medium', 'db.t3.xlarge', 'db.r5.large', 'db.r5.4xlarge']
num_instances = [2]#1, 2, 4, 8]
exclude_instances = {}#{'t3.micro': ['db.t3.micro', 'db.t3.medium', 'db.t3.xlarge', 'db.r5.large']}

tsung_file_lock = Lock()
shared_thread_memory = Lock()
used_threads_lock = Lock()
used_threads = 0

def launch_instances(db_instances, app_instances, num_instances, run_match_cache_test=False):
    global used_threads, used_threads_lock, exclude_instances
    max_threads = 12
    for app_instance in app_instances:
        for db_instance in db_instances:
            for num_instance in num_instances:
                if (app_instance not in exclude_instances) or (db_instance not in exclude_instances[app_instance]):
                    while True:
                        if used_threads < max_threads:
                            instance_name = "app%d%s%s" % (num_instance, remove_special_chars(app_instance), remove_special_chars(db_instance))
                            t = Thread(target=launch_and_test, args=(db_instance, app_instance, num_instance, instance_name, run_match_cache_test))
                            t.start()
                            used_threads_lock.acquire()
                            used_threads += 1
                            used_threads_lock.release()
                            break
                    sleep(5)

def launch_and_test(db_instance, app_instance, num_instance, instance_name, run_match_cache_test=False):
    global used_threads, used_threads_lock
    launch_eb_instance(db_instance, app_instance, num_instance, instance_name)
    if eb_instance_deployed(instance_name):
        main_instance_launched = list()
        main_thread = Thread(target=run_tsung_workflow, args=(instance_name, False, main_instance_launched))
        main_thread.start()
        if run_match_cache_test:
            main_instance_launched.append(False)
            match_cache_test = Thread(target=run_tsung_workflow, args=("%s_match_cache_test" % instance_name, run_match_cache_test, main_instance_launched))
            match_cache_test.start()
        main_thread.join()
        terminate_eb_instance(instance_name)
    used_threads_lock.acquire()
    used_threads -= 1
    used_threads_lock.release()

def run_tsung_workflow(instance_name, run_match_cache_test, main_instance_launched):
    tsung_instance_ip = launch_tsung_instance(instance_name)
    start_tsung_test(tsung_instance_ip, instance_name, run_match_cache_test, main_instance_launched)
    save_tsung_results(tsung_instance_ip, instance_name)

def launch_eb_instance(db_instance, app_instance, num_instance, instance_name):
    print("Launching EB instance: %s" % instance_name)
    os.chdir("/home/TheOtherSock/RockPaperBazooka/backend")
    cmd = ""
    if num_instance == 1:
        cmd = "eb create -db.engine postgres -db.i %s --database.password rockpaper -db.user u --envvars SECRET_KEY_BASE=RANDOM_SECRET --single %s -i %s --timeout 30" % (db_instance, instance_name, app_instance)
    else:
        cmd = "eb create -db.engine postgres -db.i %s --database.password rockpaper -db.user u --envvars SECRET_KEY_BASE=RANDOM_SECRET %s -i %s --scale %d --timeout 30" % (db_instance, instance_name, app_instance, num_instance)
    subprocess.call(cmd, shell=True)
    print("Launched EB instance: %s" % instance_name)
    sleep(20)

def launch_tsung_instance(instance_name):
    def parse_tsung_launch_output(result):
        result = result.split('\n')
        at_loc = result[1].find('@')
        ip = result[1][at_loc+1:]
        return ip

    print("Launching Tsung instance: %s" % instance_name)
    cmd = "/usr/local/bin/launch_tsung.sh"
    tsung_instance_ip = "null"
    while tsung_instance_ip in [None, "None", "null", "NULL", "Null"]:
        result = subprocess.check_output(cmd)
        tsung_instance_ip = parse_tsung_launch_output(result)
    print("Launched Tsung instance: %s | %s" % (instance_name, tsung_instance_ip))
    sleep(100)
    return tsung_instance_ip

def start_tsung_test(tsung_instance_ip, instance_name, run_match_cache_test=False, main_instance_launched=list()):
    def replace_tsung_url(filepath, instance_name):
        global tsung_file_lock
        name = instance_name if '_match_cache_test' not in instance_name else instance_name[:-17]
        server_url = "          <server host='%s.2iscm2mqr5.us-west-2.elasticbeanstalk.com' port='80' type='tcp'></server>\n" % name
        tsung_file_lock.acquire()
        with open(filepath, 'r') as file:
            lines = file.readlines()
        lines[11] = server_url
        with open(filepath, 'w') as file:
            file.writelines(lines)
        tsung_file_lock.release()

    print("Running Tsung test: %s | %s" % (instance_name, tsung_instance_ip))
    os.chdir("/home/TheOtherSock")
    filename = 'tsung_simple.xml' if not run_match_cache_test else 'tsung_match_cache_test.xml'
    filepath = '/home/TheOtherSock/RockPaperBazooka/tsung/%s' % filename
    replace_tsung_url(filepath, instance_name)
    cmd = "scp -o StrictHostKeyChecking=no -i ~/TheOtherSock.pem %s ec2-user@%s:/home/ec2-user/%s" % (filepath, tsung_instance_ip, filename)
    subprocess.call(cmd, shell=True)
    cmd = "ssh -i ~/TheOtherSock.pem ec2-user@%s tsung -f %s start" % (tsung_instance_ip, filename)

    global shared_thread_memory

    if run_match_cache_test:
        shared_thread_memory.acquire()
        main_instance_launched.append(False)
        shared_thread_memory.release()
        while not main_instance_launched[0]:
            sleep(5)
        sleep(30)
    elif len(main_instance_launched) == 1:
        while len(main_instance_launched) == 1:
            sleep(5)
        shared_thread_memory.acquire()
        main_instance_launched[0] = True
        shared_thread_memory.release()
    elif len(main_instance_launched) == 2:
        main_instance_launched[0] = True

    subprocess.call(cmd, shell=True)
    print("Ran Tsung test: %s | %s" % (instance_name, tsung_instance_ip))
    sleep(20)

def save_tsung_results(tsung_instance_ip, instance_name):
    print("Saving Tsung results: %s | %s" % (instance_name, tsung_instance_ip))
    save_dir = '/home/TheOtherSock/tsung_logs/%s' % instance_name
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    cmd = "scp -r -i ~/TheOtherSock.pem ec2-user@%s:/home/ec2-user/.tsung/log %s" % (tsung_instance_ip, save_dir)
    cmd = cmd.split(' ')
    subprocess.call(cmd)
    print("Saved Tsung results: %s | %s" % (instance_name, tsung_instance_ip))
    sleep(20)

def terminate_eb_instance(instance_name):
    print("Deleting eb instance: %s" % instance_name)
    os.chdir("/home/TheOtherSock/RockPaperBazooka/backend")
    cmd = "eb terminate %s --timeout 50 --force" % instance_name
    subprocess.call(cmd, shell=True)
    print("Deleted eb instance: %s" % instance_name)

def eb_instance_deployed(instance_name):
    url = "http://%s.2iscm2mqr5.us-west-2.elasticbeanstalk.com/users" % instance_name
    response = requests.get(url)
    if response.status_code < 300:
        return True
    return False

def remove_special_chars(text):
    return re.sub('[^A-Za-z0-9]+', '', text)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Tsung test execution script')
    parser.add_argument('--match', type=int, default=0, help='Run match test variation of Tsung test (default: exclude match test)')
    args = parser.parse_args()
    run_match_cache_test = False if args.match == 0 else True
    launch_instances(db_instances, app_instances, num_instances, run_match_cache_test)

