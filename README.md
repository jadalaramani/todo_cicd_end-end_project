# todo_cicd_end-end_project

 A full-stack To-Do List application using:

 Frontend: HTML/CSS/JS (index.html)
 
 Backend: Node.js + SQLite

 Database: SQLite (local file DB)

 # Goal of project

 Containerize the application.
 
 Set up CI/CD pipeline using Jenkins.
 
 Push Docker image to Docker Hub.
 
 Deploy to AWS EKS using Helm.
 
 Use RBAC and ServiceAccount securely.
 
 Automate end-to-end workflow.
 
# This project demonstrates a full DevOps workflow including:

 CI/CD automation
 
 Dockerization
 
 Kubernetes orchestration
 
 Helm packaging
 
 RBAC security
 
 Cloud deployment

 # Prerequisites
 Install the following tools on your system or Jenkins node:

 Docker

 kubectl

 eksctl

 Helm

 AWS CLI configured with IAM credentials

 Jenkins with:

 Docker installed

 Kubernetes CLI plugin

 Kubernetes

 Kubernetes client api

 Kubernetes credentials

 k8s credential provider

 Docker Pipeline plugin

 Pipeline stage view
 
# Install git
```
yum install git -y
```

# Jenkins Installation on Amazon Linux
```
sudo yum update -y
sudo wget -O /etc/yum.repos.d/jenkins.repo \
    https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io-2023.key
sudo yum upgrade
sudo yum install java-17-amazon-corretto -y
sudo yum install jenkins -y
sudo systemctl enable jenkins
systemctl start jenkins
```

# Docker Installation

```
yum install docker -y
systemctl start docker
systemctl enable docker
sudo usermod -aG docker jenkins
sudo chmod 666 /var/run/docker.sock
sudo systemctl restart docker
```

# Kubectl and eksctl
```
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --short --client
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```
```
eksctl create cluster --name my-cluster 
```

# Helm Install
```
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```
# Cloud watch 

# Create IAM Role with Trust Policy for IRSA
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::<ACCOUNT_ID>:oidc-provider/oidc.eks.us-east-1.amazonaws.com/id/<OIDC ID>"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "oidc.eks.us-east-1.amazonaws.com/id/<OIDC ID>:sub": "system:serviceaccount:amazon-cloudwatch:cloudwatch-agent"
        }
      }
    }
  ]
}
```
# <OIDC ID> check via
```
aws eks describe-cluster --name my-cluster --query "cluster.identity.oidc.issuer" --output text
```

Replace:

141559732042 with your AWS account id

FACB894DF2956E695370437D3A34FA24 with your OIDC ID

# Attach Policy to IAM Role
```
aws iam attach-role-policy \
  --role-name EKS-CloudWatchAgent-Role \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
  ```
# Install Helm Chart for CloudWatch Agent
```
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm upgrade --install aws-cloudwatch-metrics eks/aws-cloudwatch-metrics \
  --namespace amazon-cloudwatch \
  --create-namespace \
  --set clusterName=my-cluster \
  --set region=us-east-1 \
  --set serviceAccount.create=true \
  --set serviceAccount.name=cloudwatch-agent \
  --set serviceAccount.annotations."eks\\.amazonaws\\.com/role-arn"="arn:aws:iam::141559732042:role/EKS-CloudWatchAgent-Role"
```

# Restart DaemonSet
```
kubectl rollout restart daemonset aws-cloudwatch-metrics -n amazon-cloudwatch
```
# Verify Pod Logs
```

kubectl get pods -n amazon-cloudwatch

kubectl logs -n amazon-cloudwatch daemonset/aws-cloudwatch-metrics | head -n 50
```
