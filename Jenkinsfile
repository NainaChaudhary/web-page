pipeline {
    agent any

    environment {
        LOGIN = 'nainachaudhary1107'
        CRED = 'docker'
        IMAGE_NAME = 'frontpage'
        IMAGE_TAG  = "${env.BUILD_NUMBER}"
        DOCKER_REGISTRY = 'nainachaudhary1107'
       
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh """
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                        docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                        
                    """
                }
            }
        }

        stage('Login to DOCKER HUB') {
            steps {
                script {
                    sh """
                        docker login -u  ${LOGIN} | \
                        docker login --password-stdin ${CRED}
                    """
                }
            }
        }

        stage('Push to DOCKER HUB') {
            steps {
                sh """
                    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                    
                """
            }
        }

        stage('Clean up Jenkins Server') {
            steps {
                script {
                    // Remove Docker images from Jenkins node to free space
                    sh """
                        docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
                        docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} || true
                        
                    """
                    // Clean workspace
                    deleteDir()
                }
            }
        }

    }

    post {
        success {
            echo "Docker image ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} pushed successfully and cleaned up!"
        }
        failure {
            echo "Pipeline failed. Check the logs!"
        }
    }
}
