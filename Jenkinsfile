pipeline {
  agent any

  environment {
    DOCKER_HUB_USER = 'ramanijadala'       
    IMAGE_BASE = 'todo-app'
    IMAGE_TAG = "build-${BUILD_NUMBER}"
    LOCAL_IMAGE = "${IMAGE_BASE}:${IMAGE_TAG}"
    REMOTE_IMAGE = "${DOCKER_HUB_USER}/${IMAGE_BASE}:${IMAGE_TAG}"
    CONTAINER_NAME = "todo-app-container"
    PORT = "3000"
  }

  stages {
    stage('Checkout') {
      steps {
        git branch: 'main', url: 'https://github.com/jadalaramani/my_project.git'
      }
    }

    stage('Install Dependencies') {
      steps {
        sh 'cd backend && npm install'
      }
    }
   
    stage('Docker Build') {
      steps {
        sh "docker build -t $LOCAL_IMAGE ."
      }
    }

    stage('Tag for Docker Hub') {
      steps {
        sh "docker tag $LOCAL_IMAGE $REMOTE_IMAGE"
      }
    }

    stage('Login to Docker Hub') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
        }
      }
    }

    stage('Push to Docker Hub') {
      steps {
        sh "docker push $REMOTE_IMAGE"
      }
    }

    stage('Docker Run') {
      steps {
        script {
          sh "docker rm -f $CONTAINER_NAME || true"
          sh "docker run -d --name $CONTAINER_NAME -p $PORT:3000 $LOCAL_IMAGE"
        }
      }
    }
  }

  post {
    success {
      echo "✅ Image pushed: $REMOTE_IMAGE"
    }
    failure {
      echo "❌ Build failed"
    }
  }
}
