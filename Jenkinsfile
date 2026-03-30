pipeline {
    agent any

    environment {
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
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                    docker tag ${IMAGE_NAME}:${IMAGE_TAG} ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerr',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                sh """
                    docker push ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Clean up Jenkins Server') {
            steps {
                sh """
                    docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true
                    docker rmi ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} || true
                """
                deleteDir()
            }
        }

    }

    post {
        success {
            echo "Docker image ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} pushed successfully!"
        }
        failure {
            echo "Pipeline failed. Check the logs!"
        }
    }
}
