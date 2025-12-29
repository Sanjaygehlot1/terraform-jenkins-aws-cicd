#!/bin/bash
set -euxo pipefail

dnf update -y

dnf install -y java-17-amazon-corretto
java -version

dnf install -y docker
systemctl enable docker
systemctl start docker
usermod -aG docker ec2-user

curl -fsSL https://pkg.jenkins.io/redhat-stable/jenkins.repo \
  -o /etc/yum.repos.d/jenkins.repo

curl -fsSL https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key \
  -o /etc/pki/rpm-gpg/jenkins.io-2023.key

rpm --import /etc/pki/rpm-gpg/jenkins.io-2023.key

dnf install -y jenkins
systemctl enable jenkins
systemctl start jenkins
