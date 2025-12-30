data "aws_ami" "amazon_linux" {
  most_recent = true
  owners      = ["amazon"]
  provider    = aws
  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }

  filter {
    name   = "state"
    values = ["available"]
  }
}

resource "aws_security_group" "issue_tracker_sg" {
  name = "issue_tracker_sg"
  ingress {
    from_port   = 3000
    to_port     = 3000
    cidr_blocks = ["0.0.0.0/0"]
    description = "Issue_Tracker"
    protocol    = "tcp"
  }
  ingress{
    from_port   = 8000
    to_port     = 8000
    cidr_blocks = ["0.0.0.0/0"]
    description = "Issue_Tracker"
    protocol    = "tcp"
  }
  ingress {
    from_port   = 22
    to_port     = 22
    description = "SSH"
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_iam_role" "issue_tracker_role" {
  name = "issue-tracker-ec2-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

resource "aws_iam_role_policy_attachment" "issue_tracker_ecr_access" {
  role       = aws_iam_role.issue_tracker_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
}

resource "aws_iam_instance_profile" "issue_tracker_profile" {
  name = "issue_tracker_instance_profile"
  role = aws_iam_role.issue_tracker_role.name
}

resource "aws_instance" "app_instance" {
  ami                         = data.aws_ami.amazon_linux.id
  instance_type               = "t3.medium"
  vpc_security_group_ids      = [aws_security_group.issue_tracker_sg.id]
  key_name                    = "demo-key"
  iam_instance_profile        = aws_iam_instance_profile.issue_tracker_profile.name
  user_data_replace_on_change = true
  user_data                   = file("${path.module}/user_data.sh")
  tags = {
    Name = "issue_tracker_app"
  }
}
