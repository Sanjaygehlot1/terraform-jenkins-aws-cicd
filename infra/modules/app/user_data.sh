#!/bin/bash
set -euxo pipefail

dnf update -y

dnf install -y docker 
systemctl start docker
systemctl enable docker

mkdir -p /usr/local/lib/docker/cli-plugins

curl -SL https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-linux-x86_64 \
  -o /usr/local/lib/docker/cli-plugins/docker-compose

chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

usermod -aG docker ec2-user

dnf install -y git

mkdir -p /opt/issue-tracker
chown ec2-user:ec2-user /opt/issue-tracker

su - ec2-user << EOF
cd /opt/issue-tracker
git clone https://github.com/Sanjaygehlot1/terraform-jenkins-aws-cicd.git .
EOF


