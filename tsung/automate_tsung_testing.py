import subprocess
import os
import re
from threading import Thread, Lock
from time import sleep
import requests

app_instances = ['t3.micro', 't3.medium', 't3.xlarge', 'r5.large', 'r5.4xlarge', 'i3.large']
db_instances = ['db.t3.micro', 'db.t3.medium', 'db.t3.xlarge', 'db.r5.large', 'db.r5.4xlarge']

tsung_file_lock = Lock()
used_threads_lock = Lock()
used_threads = 0

def launch_instances(db_instances, app_instances):
    global used_threads, used_threads_lock
    max_threads = 1
    for app_instance in app_instances:
        for db_instance in db_instances:
            while True:
                if used_threads < max_threads:
                    instance_name = "%s%s" % (remove_special_chars(app_instance), remove_special_chars(db_instance))
                    t = Thread(target=launch_and_test, args=(db_instance, app_instance, instance_name))
                    t.start()
                    used_threads_lock.acquire()
                    used_threads += 1
                    used_threads_lock.release()
                    break
                sleep(2)

def launch_and_test(db_instance, app_instance, instance_name):
    global used_threads, used_threads_lock
    print("Launching EB instance: %s" % instance_name)
    launch_eb_instance(db_instance, app_instance, instance_name)
    print("Launched EB instance: %s" % instance_name)
    sleep(20)
    if eb_instance_deployed(instance_name):
        print("Launching Tsung instance: %s" % instance_name)
        tsung_instance_ip = str(launch_tsung_instance())
        print("Launched Tsung instance: %s | %s" % (instance_name, tsung_instance_ip))
        sleep(40)
        print("Running Tsung test: %s | %s" % (instance_name, tsung_instance_ip))
        launch_tsung_test(tsung_instance_ip, instance_name)
        print("Ran Tsung test: %s | %s" % (instance_name, tsung_instance_ip))
        sleep(20)
        print("Saving Tsung results: %s | %s" % (instance_name, tsung_instance_ip))
        save_tsung_results(tsung_instance_ip, instance_name)
        print("Saved Tsung results: %s | %s" % (instance_name, tsung_instance_ip))
        sleep(20)
        print("Deleting eb instance: %s" % instance_name)
        delete_eb_instance(instance_name)
        print("Deleted eb instance: %s" % instance_name)
    used_threads_lock.acquire()
    used_threads -= 1
    used_threads_lock.release()

def launch_eb_instance(db_instance, app_instance, instance_name):
    os.chdir("/home/TheOtherSock/RockPaperBazooka/backend")
    cmd = "eb create -db.engine postgres -db.i %s --database.password rockpaper -db.user u --envvars SECRET_KEY_BASE=RANDOM_SECRET --single %s -i %s" % (db_instance, instance_name, app_instance)
    subprocess.call(cmd, shell=True)

def launch_tsung_instance():
    def parse_tsung_launch_output(result):
        result = result.split('\n')
        at_loc = result[1].find('@')
        ip = result[1][at_loc+1:]
        return ip
    cmd = "/usr/local/bin/launch_tsung.sh"
    result = subprocess.check_output(cmd)
    ip = parse_tsung_launch_output(result)
    print("Tsung IP: %s" % ip)
    return ip

def launch_tsung_test(tsung_instance_ip, instance_name):
    def replace_tsung_url(instance_name):
        global tsung_file_lock
        server_url = "<server host='%s.2iscm2mqr5.us-west-2.elasticbeanstalk.com' port='80' type='tcp'></server>\n" % instance_name
        tsung_file_lock.acquire()
        with open('/home/TheOtherSock/RockPaperBazooka/tsung/tsung_simple.xml', 'r') as file:
            lines = file.readlines()
        lines[11] = server_url
        with open('/home/TheOtherSock/RockPaperBazooka/tsung/tsung_simple.xml', 'w') as file:
            file.writelines(lines)
        tsung_file_lock.release()

    os.chdir("/home/TheOtherSock")
    replace_tsung_url(instance_name)
    cmd = "scp -o StrictHostKeyChecking=no -i ~/TheOtherSock.pem /home/TheOtherSock/RockPaperBazooka/tsung/tsung_simple.xml ec2-user@%s:/home/ec2-user/tsung_simple.xml" % tsung_instance_ip
    subprocess.call(cmd, shell=True)
    cmd = "ssh -i ~/TheOtherSock.pem ec2-user@%s tsung -f tsung_simple.xml start" % tsung_instance_ip
    subprocess.call(cmd, shell=True)

def save_tsung_results(tsung_instance_ip, instance_name):
    save_dir = '/home/TheOtherSock/tsung_logs/%s' % instance_name
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
    cmd = "scp -r -i ~/TheOtherSock.pem ec2-user@%s:/home/ec2-user/.tsung/log %s" % (tsung_instance_ip, save_dir)
    cmd = cmd.split(' ')
    subprocess.call(cmd)

def delete_eb_instance(instance_name):
    os.chdir("/home/TheOtherSock/RockPaperBazooka/backend")
    cmd = "eb terminate %s --force" % instance_name
    subprocess.call(cmd, shell=True)

def eb_instance_deployed(instance_name):
    url = "http://%s.2iscm2mqr5.us-west-2.elasticbeanstalk.com/users" % instance_name
    response = requests.get(url)
    if response.status_code < 300:
        return True
    return False

def remove_special_chars(text):
    return re.sub('[^A-Za-z0-9]+', '', text)

if __name__ == "__main__":
    launch_instances(db_instances, app_instances)

