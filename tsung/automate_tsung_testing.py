import subprocess
import os
import re
from threading import Thread, Lock
from time import sleep
import requests

app_instances = ['t3.micro', 't3.medium', 't3.xlarge', 'r5.large', 'r5.4xlarge', 'i3.large']
db_instances = ['db.t3.micro', 'db.t3.medium', 'db.t3.xlarge', 'db.r5.large', 'db.r5.4xlarge']
num_instances = [1, 2, 4]
exclude_instances = {} #{'t3.micro': ['db.t3.micro', 'db.t3.medium', 'db.t3.xlarge']}

tsung_file_lock = Lock()
used_threads_lock = Lock()
used_threads = 0

def launch_instances(db_instances, app_instances, num_instances):
    global used_threads, used_threads_lock, exclude_instances
    max_threads = 3
    for app_instance in app_instances:
        for db_instance in db_instances:
            for num_instance in num_instances:
                if (app_instance not in exclude_instances) or (db_instance not in exclude_instances[app_instance]):
                    while True:
                        if used_threads < max_threads:
                            instance_name = "app%d%s%s" % (num_instance, remove_special_chars(app_instance), remove_special_chars(db_instance))
                            t = Thread(target=launch_and_test, args=(db_instance, app_instance, num_instance, instance_name))
                            t.start()
                            used_threads_lock.acquire()
                            used_threads += 1
                            used_threads_lock.release()
                            break
                        sleep(2)

def launch_and_test(db_instance, app_instance, num_instance, instance_name):
    global used_threads, used_threads_lock
    launch_eb_instance(db_instance, app_instance, num_instance, instance_name)
    if eb_instance_deployed(instance_name):
        tsung_instance_ip = launch_tsung_instance(instance_name)
        run_tsung_test(tsung_instance_ip, instance_name)
        save_tsung_results(tsung_instance_ip, instance_name)
    used_threads_lock.acquire()
    used_threads -= 1
    used_threads_lock.release()
    if eb_instance_deployed(instance_name):
        terminate_eb_instance(instance_name)

def launch_eb_instance(db_instance, app_instance, num_instance, instance_name):
    print("Launching EB instance: %s" % instance_name)
    os.chdir("/home/TheOtherSock/RockPaperBazooka/backend")
    cmd = "eb create -db.engine postgres -db.i %s --database.password rockpaper -db.user u --envvars SECRET_KEY_BASE=RANDOM_SECRET --single %s -i %s --scale %d" % (db_instance, instance_name, app_instance, num_instance)
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
    result = subprocess.check_output(cmd)
    tsung_instance_ip = parse_tsung_launch_output(result)
    print("Launched Tsung instance: %s | %s" % (instance_name, tsung_instance_ip))
    sleep(100)
    return tsung_instance_ip

def run_tsung_test(tsung_instance_ip, instance_name):
    def replace_tsung_url(instance_name):
        global tsung_file_lock
        server_url = "          <server host='%s.2iscm2mqr5.us-west-2.elasticbeanstalk.com' port='80' type='tcp'></server>\n" % instance_name
        tsung_file_lock.acquire()
        with open('/home/TheOtherSock/RockPaperBazooka/tsung/tsung_simple.xml', 'r') as file:
            lines = file.readlines()
        lines[11] = server_url
        with open('/home/TheOtherSock/RockPaperBazooka/tsung/tsung_simple.xml', 'w') as file:
            file.writelines(lines)
        tsung_file_lock.release()

    print("Running Tsung test: %s | %s" % (instance_name, tsung_instance_ip))
    os.chdir("/home/TheOtherSock")
    replace_tsung_url(instance_name)
    cmd = "scp -o StrictHostKeyChecking=no -i ~/TheOtherSock.pem /home/TheOtherSock/RockPaperBazooka/tsung/tsung_simple.xml ec2-user@%s:/home/ec2-user/tsung_simple.xml" % tsung_instance_ip
    subprocess.call(cmd, shell=True)
    cmd = "ssh -i ~/TheOtherSock.pem ec2-user@%s tsung -f tsung_simple.xml start" % tsung_instance_ip
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
    cmd = "eb terminate %s --force" % instance_name
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
    launch_instances(db_instances, app_instances, num_instances)

