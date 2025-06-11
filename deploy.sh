#!/bin/bash

set -e

echo "🚿 Usuwam stare deploymenty (jeśli istnieją)..."

for svc in frontend gateway user quiz session; do
  echo "❌ Deleting deployment: $svc (jeśli istnieje)..."
  kubectl delete deployment "$svc" --ignore-not-found
done

echo ""
echo "🚀 Deployuję wszystkie zasoby z katalogu k8s/..."

kubectl apply -f k8s/

echo ""
echo "⏳ Czekam na uruchomienie podów..."
kubectl wait --for=condition=Ready pods --all --timeout=120s

echo ""
echo "✅ Aktualny stan:"
kubectl get pods
echo ""
kubectl get svc
echo ""
kubectl get ingress

echo ""
echo "🌐 Jeżeli używasz Ingress, uruchamiam tunnel (CTRL+C by zakończyć)..."
minikube tunnel