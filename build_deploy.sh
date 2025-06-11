#!/bin/bash

set -euo pipefail

echo "🔧 Switching Docker to Minikube daemon..."
eval "$(minikube docker-env)"

echo "🐳 Building local Docker images for Minikube..."

# Mapa usług i folderów
services=(
  "user:user_service"
  "quiz:quiz_service"
  "session:session_service"
  "gateway:gateway_service"
  "frontend:frontend"
)

for entry in "${services[@]}"; do
  name="${entry%%:*}"
  folder="${entry##*:}"
  echo "🔨 Building $name from $folder..."
  docker build -t "aoporski/${name}:latest" "./${folder}"
done

echo "✅ All images built."

echo "🚀 Redeploying to Kubernetes..."

for entry in "${services[@]}"; do
  name="${entry%%:*}"
  echo "♻️  Recreating deployment: $name"
  kubectl delete deployment "$name" --ignore-not-found
  kubectl apply -f "k8s/${name}-deployment.yaml"
done

echo "🌐 Applying Ingress..."
kubectl apply -f k8s/ingress.yaml

echo "📦 Applying ConfigMaps and Secrets (if present)..."
kubectl apply -f k8s/ || true  # Jeśli masz configmapy/secret w tym folderze

echo "📡 Checking cluster state:"
kubectl get pods
kubectl get svc
kubectl get ingress

echo "✅ Deployment complete."