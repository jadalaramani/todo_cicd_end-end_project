 kubectl create ns todons
 kubectl apply -f serviceaccount.yaml
 kubectl apply -f role.yaml 
 kubectl apply -f rolebinding.yaml 
 kubectl apply -f secret.yaml -n todons
 kubectl -n todons describe secret mysecretname
