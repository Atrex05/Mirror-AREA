#!/bin/bash

# Fonction pour vérifier si une commande existe
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Installer Minikube
install_minikube() {
  if ! command_exists minikube; then
    echo "Installation de Minikube..."
    curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
    sudo install minikube-linux-amd64 /usr/local/bin/minikube
  else
    echo "Minikube est déjà installé."
  fi
}

# Installer Docker
install_docker() {
  if ! command_exists docker; then
    echo "Installation de Docker..."
    sudo apt-get update
    sudo apt-get install -y docker.io
    sudo systemctl start docker
    sudo systemctl enable docker
  else
    echo "Docker est déjà installé."
  fi
}

# Installer Go
install_go() {
  if ! command_exists go; then
    echo "Installation de Go..."
    wget https://golang.org/dl/go1.17.linux-amd64.tar.gz
    sudo tar -C /usr/local -xzf go1.17.linux-amd64.tar.gz
    echo "export PATH=$PATH:/usr/local/go/bin" >> ~/.bashrc
    source ~/.bashrc
  else
    echo "Go est déjà installé."
  fi
}

# Installer Node.js et Vue CLI
install_vue() {
  if ! command_exists node; then
    echo "Installation de Node.js..."
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
  else
    echo "Node.js est déjà installé."
  fi

  if ! command_exists vue; then
    echo "Installation de Vue CLI..."
    sudo npm install -g @vue/cli
  else
    echo "Vue CLI est déjà installé."
  fi
}

# Exécuter les installations
install_minikube
install_docker
install_go
install_vue

echo "Configuration terminée. Vous pouvez maintenant lancer l'application avec Docker Compose."