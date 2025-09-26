# 📝 ToDo App – CI/CD on AWS EKS with GitHub Actions & Helm

## 📌 Project Overview
This project demonstrates an **end-to-end CI/CD pipeline** for deploying a ToDo application on **Amazon EKS (Elastic Kubernetes Service)** using:

- **GitHub Actions** → CI/CD pipeline  
- **DockerHub** → Image repository  
- **Helm** → Kubernetes packaging & deployment  
- **EKS** → Managed Kubernetes cluster on AWS  

---

## 🚀 Architecture Flow

1. Developer pushes code → GitHub repository.  
2. **GitHub Actions** triggers:
   - Build Docker image of the app.
   - Push image to DockerHub.  
   - Deploy app to EKS using Helm.  
3. EKS provisions Kubernetes resources:
   - Deployment (pods)  
   - Service (exposed as LoadBalancer)  
4. Application accessible via **AWS LoadBalancer DNS** 

---

## 🛠️ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/jadalaramani/todo_cicd_end-end_project.git
cd todo_cicd_end-end_project
```

### 2. Create EKS Cluster

 Install ekctl n kubectl 
 
```
curl -o kubectl https://amazon-eks.s3.us-west-2.amazonaws.com/1.19.6/2021-01-05/bin/linux/amd64/kubectl
chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin
kubectl version --short --client
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```
```
aws configure
```

```bash
eksctl create cluster --name todo-cluster --region us-east-1 --nodes 2 --node-type t3.medium
```

Verify:
```bash
kubectl get nodes
```

---

### 3. Configure GitHub Secrets
In your GitHub repo → **Settings → Secrets and Variables → Actions**, add:

- `AWS_ACCESS_KEY_ID`  
- `AWS_SECRET_ACCESS_KEY`  
- `DOCKER_USERNAME`  
- `DOCKER_PASSWORD`  

---

### 4. GitHub Actions Workflow
`.github/workflows/ci-cd.yml`

---

### 5. Helm Chart Structure
```
helm/
 ├── Chart.yaml
 ├── values.yaml
 ├── templates/
 │    ├── deployment.yaml
 │    ├── service.yaml
 │    
```

---

### 6. Access the Application
Check service:
```bash
kubectl get svc -n todo
```

You’ll see an **EXTERNAL-IP / DNS** from AWS LoadBalancer.  

Access the app in browser:
```
http://<EXTERNAL-IP>:3000
```

---

## 📊 CI/CD Pipeline Summary
- **Push Code → Build → Push Image → Deploy to EKS → Access via LoadBalancer**  

---
