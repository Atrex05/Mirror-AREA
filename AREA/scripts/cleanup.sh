#!/bin/bash

echo "Nettoyage de l'environnement..."

# Nettoyage de Kubernetes
echo "Suppression des ressources Kubernetes..."
kubectl delete deployments --all
kubectl delete services --all
kubectl delete pods --all
kubectl delete configmaps --all
kubectl delete pvc --all

# Nettoyage de Docker
# echo "Suppression des conteneurs et images Docker..."
# docker stop $(docker ps -aq)
# docker rm $(docker ps -aq)
# docker rmi $(docker images -q)
# docker volume prune -f
# docker network prune -f

# Nettoyage de Minikube (décommentez si nécessaire)
# echo "Suppression du cluster Minikube..."
# minikube stop
# minikube delete

echo "Nettoyage terminé. L'environnement est prêt pour une nouvelle installation."