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

# EKS cluster setup using terraform and jenkins

github url for setup :
```
https://github.com/adarsh0331/Eks_Cluster_with_terraform.git
```

-  S3 BUCKET CREATION ( Some times you may get bucket name confilt , as s3 bucket name is globally unique ) 
-  DYNAMO  DB SETUP
-  aws eks update-kubeconfig --region us-east-1 --name my-eks-cluster
- RBAC SET UP IN RBAC FOLDER 

# Helm Install
```
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```

# Configuring Email in jenkins

##  Step 1: Install Required Plugin

1. Go to **Jenkins → Manage Jenkins → Plugins**
2. Install:

**Email Extension Plugin** 

##  Step 2: Enable App Password in Gmail

Since Gmail blocks less secure apps, you need to create an **App Password**:

1. Go to your Google Account → **Security**
2. Enable **2-Step Verification**
3. After that, go to **App passwords**
4. Generate an app password (e.g., for “Mail” on “Other (Custom)”)
5. Note the 16-character password (you’ll use this in Jenkins)

## Step 3: Configure Email Settings in Jenkins
* Firstly add in jenkins credentials: username and password
- username: your@gmail.com
- password: 16character password
- description:email-cred

### A. Go to:

**Jenkins → Manage Jenkins →  System**

###  B. Scroll to **Extended E-mail Notification** section and fill:

| Field                      | Value                                                    |
| -------------------------- | -------------------------------------------------------- |
| SMTP server                | `smtp.gmail.com`                                         |
| SMTP Port                  | `465`                                                    |
| Use SSL                    | ✅ checked                                               |
| Use TLS                    | ✅ Checked                                                |

* In Advance add credentials of email-cred 

### C. Next scroll down **E-mail Notification** section and fill 
| Field                      | Value                                                    |
| -------------------------- | -------------------------------------------------------- |
| SMTP server                | `smtp.gmail.com`                                         |
| Use SSL                    | ✅ checked                                               |
| Use TLS                    | ✅ Checked                                                |
| SMTP Authentication        | ✅ Checked                                                |
| SMTP Username              | your Gmail address (e.g., `your@gmail.com`)               |
| SMTP Password              | 16-digit App Password (not your Gmail password)          |

#### smtp port 465
#### reply to addresss: your@gmail.com

- test the mail

# Cloud watch 

 - kubectl create namespace amazon-cloudwatch


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

### ➤ Create IAM Role

```bash
aws iam create-role \
  --role-name EKS-CloudWatchAgent-Role \
  --assume-role-policy-document file://trust-policy.json
```

### ➤ Update Trust Policy (if needed)

```bash
aws iam update-assume-role-policy \
  --role-name EKS-CloudWatchAgent-Role \
  --policy-document file://trust-policy.json
```

### ➤ Attach CloudWatch Agent Policy

```bash
aws iam attach-role-policy \
  --role-name EKS-CloudWatchAgent-Role \
  --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
```


## Associate IAM OIDC Provider (One-time per cluster)

```bash
eksctl utils associate-iam-oidc-provider \
  --region us-east-1 \
  --cluster my-cluster \
  --approve
```

## Create IAM Service Account using IRSA

```bash
eksctl create iamserviceaccount \
  --name cloudwatch-agent \
  --namespace amazon-cloudwatch \
  --cluster my-cluster \
  --region us-east-1 \
  --attach-policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy \
  --approve \
  --override-existing-serviceaccounts
```
```
kubectl get sa cloudwatch-agent -n amazon-cloudwatch -o yaml | grep eks.amazonaws.com/role-arn
```


## 🟦 4. Install CloudWatch Agent using Helm

### ➤ Add and Update Helm Repo

```bash
helm repo add eks https://aws.github.io/eks-charts
helm repo update
```

### ➤ Install Helm Chart

```bash
helm upgrade --install aws-cloudwatch-metrics eks/aws-cloudwatch-metrics \
  --namespace amazon-cloudwatch \
  --set clusterName=my-cluster \
  --set region=us-east-1 \
  --set serviceAccount.create=false \
  --set serviceAccount.name=cloudwatch-agent
```


##  Verify Pod and Logs

### ➤ Check Pod

```bash
kubectl get pods -n amazon-cloudwatch
```

### ➤ Check Logs

```bash
kubectl logs -n amazon-cloudwatch daemonset/aws-cloudwatch-metrics | head -n 50
kubectl logs aws-cloudwatch-metrics-q5tg7 -n amazon-cloudwatch
```


##  Confirm Log Group in CloudWatch

```bash
aws logs describe-log-groups --log-group-name-prefix /aws/containerinsights/my-cluster
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








