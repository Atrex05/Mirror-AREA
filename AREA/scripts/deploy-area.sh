#!/bin/bash

# Fonction pour déployer une application
deploy_app() {
    local app_name=$1
    local image_name=$2

    echo "Déploiement de $app_name..."

    # Pull de l'image
    echo "Pull de l'image $image_name..."
    docker pull $image_name

    # Patch du déploiement pour utiliser le secret
    echo "Patch du déploiement $app_name..."
    kubectl patch deployment $app_name -p '{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"dockercred"}]}}}}'

    # Redémarrage du déploiement
    echo "Redémarrage du déploiement $app_name..."
    kubectl rollout restart deployment $app_name

    # Attente que le déploiement soit prêt
    echo "Attente que $app_name soit prêt..."
    kubectl rollout status deployment $app_name --timeout=120s
}

# Démarrer Minikube si ce n'est pas déjà fait
minikube status || minikube start

# Configurer l'environnement Docker pour utiliser le Docker daemon de Minikube
eval $(minikube docker-env)

# Se connecter à Docker
echo "Connexion à Docker..."
docker login ghcr.io -u $DOCKER_USERNAME -p $DOCKER_PASSWORD

# Déployer les applications
deploy_app "area-backend" "ghcr.io/epitechpromo2027/area-backend:latest"
deploy_app "area-frontend" "ghcr.io/epitechpromo2027/area-frontend:latest"
deploy_app "area-database" "ghcr.io/epitechpromo2027/area-database:latest"

# Vérifier l'état final des pods
echo "État final des pods :"
kubectl get pods

echo "Déploiement terminé. Vérifiez manuellement si nécessaire."