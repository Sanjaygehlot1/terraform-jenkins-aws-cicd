output "jenkins_ec2_public_ip" {
  value = aws_instance.jenkins_instance.public_ip
}

