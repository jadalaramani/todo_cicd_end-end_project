It’s a full-stack To-Do list application designed primarily to demonstrate a complete DevOps CI/CD pipeline with Kubernetes deployment. Here's a breakdown 

of the project components and objective

# todo_cicd_end-end_project

 A full-stack To-Do List application using:

 Frontend: HTML/CSS/JS (index.html) -  Served from a public folder, with index.html as the main entry point.
 
 Backend: Node.js (Express.js framework)

 Database: SQLite (local .db file named todo.db)

 # Goal of project

 Containerize the application.
 
 Set up CI/CD pipeline using Jenkins.
 
 Push Docker image to Docker Hub.
 
 Deploy to AWS EKS using Helm.
 
 Use RBAC and ServiceAccount securely.
 
 Automate end-to-end workflow.

 Congifure Monitoring & Observability 
 
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

 # Jenkins with Below plugins : 

 Kubernetes CLI plugin

 Kubernetes

 Kubernetes client api

 Kubernetes credentials

 k8s credential provider

 Docker

 Docker Pipeline plugin

 Email Extention template

 Pipeline stage view

 Sonarqube Scanner 

# How to test locally or Manually ? 


Create  Amazon linux EC2 Instance to test it locally . 
```
yum install git -y
cd /opt
git clone https://github.com/jadalaramani/todo_cicd_end-end_project.git
cd todo_cicd_end-end_project/
cd backend/
```
```
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
yum install -y nodejs
npm install
npm start  ( optional ) 
node server.js & 
```

---> now access from browser with port 3000 ( PublicIP:3000 )
 
# How to containerize  Locally


# Docker Installation

```
yum install docker -y
systemctl start docker
systemctl enable docker
sudo usermod -aG docker jenkins
sudo chmod 666 /var/run/docker.sock
sudo systemctl restart docker
```
```
docker -v

cat Dockerfile

#### Build the Docker image
docker build -t todoimage:v1 .

docker images

##### Run the container in detached mode and map ports
docker run -itd -p 3001:3000 todoimage:v1

docker ps

##### Test the app from the host (browser or curl)

curl http://localhost:3001
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
# SonarQube Setup

* Ensure SonarQube is up and running (local or cloud).
```
docker run --itd --name sonar -p 9000:9000 sonarqube
```

#### In Jenkins:

* Install the SonarQube Scanner for Jenkins plugin.

* Add your SonarQube server in Manage Jenkins > Configure System > SonarQube servers.

* also update in Global tool settings of SonarQubeScanner ( Manage Jenkins > tools > add installation) 

* Add credentials (usually a Sonar token).

Name it like SonarQubeServer.

#### sonar-project.properties to Your GItHUb Repo Root location: 

```
sonar.projectKey=todo-node-app
sonar.projectName=Todo Node.js App
sonar.projectVersion=1.0
sonar.sources=.
sonar.language=js
sonar.sourceEncoding=UTF-8
```
#### Configure Quality Gate in SonarQube

Create or Edit a Quality Gate in SonarQube

Log in to SonarQube as an admin → Quality Gates tab.

Either edit “Sonar way” or click “Create” to build your own gate.

Click “Set as Default” so every new project—and therefore your todo-node-app—uses it automatically.

######  Add a Webhook for Jenkins in sonarqube

SonarQube pushes Quality Gate results back to Jenkins through a webhook call.

SonarQube → Administration ▶ Configuration ▶ Webhooks.

Click “Create”

Name: Jenkins

URL: http://<JENKINS_URL>/sonarqube-webhook/

Save.

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
trust-policy.json
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

# Alters


# Create an SNS Topic for Alert Notifications

```bash
aws sns create-topic --name eks-monitoring-alerts
```

Save the ARN it returns (e.g., `arn:aws:sns:us-east-1:123456789012:eks-monitoring-alerts`).


# Subscribe to the Topic (Email, SMS, etc.)

```bash
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:eks-monitoring-alerts \
  --protocol email \
  --notification-endpoint your-email@example.com
```
Go to your email and **confirm the subscription**.



# Choose Metric for Alert

You can alert on:

* **Node CPU Utilization**
* **Memory Utilization**
* **Container Restarts**
* **Pod not Ready count**
  
> **CloudWatch → Metrics → ContainerInsights → EKS Cluster Name**



# Create a CloudWatch Alarm for a Metric

Example: Alarm for CPU > 80% for 5 minutes

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "High-CPU-EKS" \
  --metric-name "node_cpu_utilization" \
  --namespace "ContainerInsights" \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:eks-monitoring-alerts \
  --dimensions Name=ClusterName,Value=my-cluster \
  --region us-east-1
```

```bash
aws cloudwatch list-metrics --namespace ContainerInsights --dimensions Name=ClusterName,Value=my-cluster
```


# Create a CloudWatch Alarm for CPU (Test)

```bash
aws cloudwatch put-metric-alarm \
  --alarm-name "EKS-HighCPU-Alert" \
  --metric-name node_cpu_utilization \
  --namespace ContainerInsights \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 1 \
  --dimensions Name=ClusterName,Value=my-cluster \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:eks-monitoring-alerts \
  --region us-east-1
```


# Force High CPU on a Node (For Test)

Deploy a stress pod to simulate high CPU:

```yaml
# stress-cpu.yaml
apiVersion: v1
kind: Pod
metadata:
  name: cpu-stress
spec:
  containers:
  - name: stress
    image: progrium/stress
    args: ["--cpu", "4", "--timeout", "600"]
```

Apply it:

```bash
kubectl apply -f stress-cpu.yaml
```


#  Check Alarm State

```bash
aws cloudwatch describe-alarms \
  --alarm-names "EKS-HighCPU-Alert" \
  --query "MetricAlarms[0].StateValue"
```

Expected: `ALARM` 

# Cleanup

```bash
kubectl delete pod cpu-stress
aws cloudwatch delete-alarms --alarm-names "EKS-HighCPU-Alert"
```





