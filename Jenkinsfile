pipeline{
    agent any
    tools{
        nodejs "node22"
    }
    environment{
        IMAGE_TAG = "${GIT_COMMIT}"
        IMAGE_OLD_TAG = "${GIT_PREVIOUS_COMMIT ?: ''}" 
        AWS_REGION = "ap-south-1"
        ECR_REGISTRY = "511913187986.dkr.ecr.${AWS_REGION}.amazonaws.com"
        FRONTEND_REPO_NAME =  "issue-tracker-app-frontend"
        BACKEND_REPO_NAME =  "issue-tracker-app-backend"
        APP_EC2_IP = "ec2-13-203-66-87.${AWS_REGION}.compute.amazonaws.com"
    }
    stages{
        stage("Test"){
            parallel{
                stage("Backend"){
                    steps{
                        dir("backend"){
                            sh """
                                npm ci
                                npm run test
                            """
                        }
                    }
                }
                stage("Frontend"){
                    steps{
                        dir("frontend"){
                            sh """
                                npm ci
                                npm run test
                            """
                        }
                    }
                }
            }
        }

        stage("Login to ECR"){
            steps{
                sh """
                    aws ecr get-login-password --region ${AWS_REGION} \
                    | docker login --username AWS --password-stdin ${ECR_REGISTRY} 
                """
            }
        }

        stage("Build and Push Backend Docker Image"){
            steps{
                dir("backend"){
                    sh """
                        docker build -t ${ECR_REGISTRY}/${BACKEND_REPO_NAME}:${IMAGE_TAG} .
                        docker push ${ECR_REGISTRY}/${BACKEND_REPO_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage("Build and Push Frontend Docker Image"){
            steps{
                dir("frontend"){
                    sh """
                        docker build \
                        --build-arg VITE_API_URL=http://${APP_EC2_IP}:8000 \
                        -t ${ECR_REGISTRY}/${FRONTEND_REPO_NAME}:${IMAGE_TAG} .
                        docker push ${ECR_REGISTRY}/${FRONTEND_REPO_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage("SSH into App EC2 Instance, Pull Image from ECR & Deploy on an EC2 Instance"){
            steps{
                sshagent(credentials:['app-ec2-key']){
                    sh """
ssh -o StrictHostKeyChecking=no ec2-user@${APP_EC2_IP} << EOF
cd /opt/issue-tracker
git pull origin master
export IMAGE_TAG=${IMAGE_TAG}
docker compose down
docker compose pull
docker compose up -d
EOF
"""
                }
            }
        }
    }

    post{
        failure {
            script {
                if (env.IMAGE_OLD_TAG?.trim()) {
                    sshagent(credentials: ['app-ec2-key']) {
                        sh """
ssh -o StrictHostKeyChecking=no ec2-user@${APP_EC2_HOST} << EOF
cd /opt/issue-tracker
export IMAGE_TAG=${IMAGE_OLD_TAG}
docker compose down
docker compose pull
docker compose up -d
EOF
"""
                    }
                } else {
                    echo "No previous commit available — skipping rollback"
                }
            }
        }
    }
}

