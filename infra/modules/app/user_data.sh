#!/bin/bash
set -euxo pipefail

dnf update -y

dnf install -y docker 
systemctl start docker
systemctl enable docker

dnf install -y docker-compose-plugin

usermod -aG docker ec2-user

dnf install -y git

mkdir -p /opt/issue-tracker
chown ec2-user:ec2-user /opt/issue-tracker

su - ec2-user << EOF
cd /opt/issue-tracker
git clone https://github.com/Sanjaygehlot1/terraform-jenkins-aws-cicd.git .
EOF


