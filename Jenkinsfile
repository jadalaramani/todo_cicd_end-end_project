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

    stage('Docker Run (optional)') {
      steps {
        script {
          sh "docker rm -f $CONTAINER_NAME || true"
          sh "docker run -d --name $CONTAINER_NAME -p $PORT:3000 $LOCAL_IMAGE"
        }
      }
    }
stage('eks deploy'){
 steps {
    withKubeConfig(
      credentialsId: 'kubeconfig',
      clusterName: 'my-cluster',
      contextName: 'my-cluster',
      namespace: 'todons',
      restrictKubeConfigAccess: false,
      serverUrl: 'https://71EBBEA6021B1F195E6BA6F54211B023.gr7.us-east-1.eks.amazonaws.com'
    ) {
      sh '''
        echo "🚀 Deploying application via Helm..."
        echo "📁 Current workspace: $(pwd)"
        echo "📂 Checking for Helm chart..."
        ls -l ./helm
        helm upgrade --install todo-release ./helm \
          --namespace todons \
          --set image.repository=${DOCKER_HUB_USER}/${IMAGE_BASE} \
          --set image.tag=${IMAGE_TAG} \
          --set service.type=LoadBalancer

        echo "✅ Deployment triggered"
        kubectl get svc -n todons
      '''
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
      always {
    emailext (
               subject: "${env.JOB_NAME} - Build #${env.BUILD_NUMBER} - ${currentBuild.currentResult}",
               body: "Build details: ${env.BUILD_URL}",
                to: 'mindcircuit2025@gmail.com',
                from: 'jenkins@example.com',
                replyTo: 'jenkins@example.com',
                
                
            )
      }
    
  }
}
