# my_project
Basic nodejs project

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
```
# Install eksctl
```
curl --silent --location "https://github.com/weaveworks/eksctl/releases/latest/download/eksctl_$(uname -s)_amd64.tar.gz" | tar xz -C /tmp
sudo mv /tmp/eksctl /usr/local/bin
```
```
eksctl create cluster --name my-cluster --region us-east-1 --nodes 2 --node-type t3.micro
```

# Helm Install
```
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
```
# Cloud watch 

helm repo add aws-observability https://aws.github.io/eks-charts
helm repo update
helm install aws-cloudwatch-metrics   aws-observability/aws-cloudwatch-metrics   --namespace amazon-cloudwatch   --create-namespace   --set clusterName=my-cluster   --set region=us-east-1   --set serviceAccount.create=false   --set serviceAccount.name=cloudwatch-agent
kubectl get all -n amazon-cloudwatch

# using eksctl
eksctl utils associate-iam-oidc-provider   --region us-east-1   --cluster my-cluster   --approve
aws iam attach-role-policy   --role-name EKS-CloudWatchAgent-Role   --policy-arn arn:aws:iam::aws:policy/CloudWatchAgentServerPolicy
kubectl annotate serviceaccount cloudwatch-agent -n amazon-cloudwatch eks.amazonaws.com/role-arn=arn:aws:iam::141559732042:role/EKS-CloudWatchAgent-Role --overwrite
kubectl delete pod -n amazon-cloudwatch -l app.kubernetes.io/name=aws-cloudwatch-metrics

