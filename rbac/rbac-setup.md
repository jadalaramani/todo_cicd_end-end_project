 kubectl create ns todons
 
 kubectl -n todons create -f secret.yaml

 kubectl apply -f serviceaccount.yaml
 
 kubectl apply -f role.yaml
 
 kubectl apply -f rolebinding.yaml
 
 kubectl -n todons describe secret mysecretname
 

  
