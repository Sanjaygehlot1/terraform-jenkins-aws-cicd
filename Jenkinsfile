pipeline{
    agent any
    tools{
        nodejs "node22"
    }
    environment{
        BACKEND_IMAGE_NAME = "issue-tracker-app-backend"
        FRONTEND_IMAGE_NAME = "issue-tracker-app-frontend"
        IMAGE_TAG = 1.0 
        AWS_REGION = "ap-south-1"
        ECR_REGISTRY = "511913187986.dkr.ecr.${AWS_REGION}.amazonaws.com"
        REPO_NAME =  "issue-tracker-app"
    }
    stages{
        stage("Test & Build"){
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
                                npm run build
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
                        docker build -t ${ECR_REGISTRY}/${BACKEND_IMAGE_NAME}:${IMAGE_TAG} .
                        docker push ${ECR_REGISTRY}/${BACKEND_IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }

        stage("Build and Push Frontend Docker Image"){
            steps{
                dir("frontend"){
                    sh """
                        docker build -t ${ECR_REGISTRY}/${FRONTEND_IMAGE_NAME}:${IMAGE_TAG} .
                        docker push ${ECR_REGISTRY}/${FRONTEND_IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
    }
}

