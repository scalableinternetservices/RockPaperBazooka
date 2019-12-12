#!/bin/bash -e

instance_type=t3.xlarge

if [ -n "$1" ]; then
    instance_type="$1"
fi

username=$(whoami)

tag_specification='[{"ResourceType": "instance", "Tags": [{"Key": "Name", "Value": "tsung-'${username}'"}]}, {"ResourceType": "volume", "Tags": [{"Key": "Name", "Value": "tsung-'${username}'"}]}]'

instance_id=$(aws ec2 run-instances \
  --image-id ami-f62afe8e \
  --instance-type "${instance_type}" \
  --key-name ${username} \
  --security-group-ids sg-0ebf2c62af41a0eb1 \
  --tag-specifications "${tag_specification}" | jq -r .Instances[0].InstanceId)

if [ -z "$instance_id" ]; then
   echo "Shit the bed."
   exit 1
fi

echo "InstanceId: ${instance_id}"

sleep 2

public_ip=$(aws ec2 describe-instances --instance-ids "${instance_id}" | jq -r .Reservations[0].Instances[0].PublicIpAddress)

if [ -z "$public_ip" ]; then
    echo "Public IP not yet available."
    echo "Manually run: aws ec2 describe-instances --instance-ids ${instance_id} | jq -r .Reservations[0].Instances[0].PublicIpAddress"
   exit 1
fi


echo "    ssh command: ssh -i ~/${username}.pem ec2-user@${public_ip}"
echo "tsung dashboard: https://${public_ip}:8091  # only available when tsung is running"
~
~
exit 0

