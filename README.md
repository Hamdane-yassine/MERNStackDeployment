# MERNStackDeployment

## Overview

MERNStackDeployment demonstrates the deployment and monitoring of a MERN (MongoDB, Express, React, Node.js) stack application in Kubernetes. This project showcases containerization, Kubernetes deployment, and monitoring setup using industry-standard tools.

## Features

- Kubernetes deployment manifests for MERN stack
- Monitoring setup with Prometheus and Grafana
- Logging with EFK (Elasticsearch, Fluentd, Kibana) stack
- Ingress configuration for external access
- Helm chart for easy deployment

## Prerequisites

- Kubernetes cluster (e.g., Minikube, Docker Desktop Kubernetes)
- kubectl
- Helm

## Project Structure

The relevant Kubernetes deployment directories:

```
.
├── exam-efk-manifests
│   ├── crds.yaml
│   ├── elastic.yaml
│   ├── fluentd.yaml
│   ├── kibana.yaml
│   └── operator.yaml
├── exam-kubernetes-manifests
│   ├── backend.yaml
│   ├── db.yaml
│   ├── exam-namespace.yaml
│   └── frontend.yaml
└── exam-kubernetes-mongodbcluster
    ├── backend.yaml
    ├── exam-namespace.yaml
    ├── frontend.yaml
    └── mongodbcluster.yaml
```

## Quick Start

1. Clone the repository:
   ```
   git clone https://github.com/Hamdane-yassine/MERNStackDeployment.git
   cd MERNStackDeployment
   ```

2. Deploy the application:
   ```
   kubectl apply -f exam-kubernetes-manifests/
   ```

3. Access the application:
   ```
   kubectl get ingress
   ```
   Use the provided IP/hostname to access the application in your browser.

## Monitoring

### Prometheus & Grafana

1. Install Prometheus and Grafana:
   ```
   helm install monitoring prometheus-community/kube-prometheus-stack
   ```

2. Access Grafana:
   ```
   kubectl port-forward service/monitoring-grafana 3000:80
   ```
   Visit `http://localhost:3000` and login with default credentials.

### EFK Stack

1. Deploy EFK stack:
   ```
   kubectl apply -f exam-efk-manifests/
   ```

2. Access Kibana:
   ```
   kubectl port-forward service/kibana 5601:5601
   ```
   Visit `http://localhost:5601` to view logs.

## Helm Chart

A Helm chart is available for easier deployment. The chart repository can be found here:

[MernStackHelm Repository](https://github.com/Hamdane-yassine/MernStackHelm)

To use the chart:

```
helm repo add mernstack-exam-app https://hamdane-yassine.github.io/MernStackHelm/
helm install mernapp mernstack-exam-app/mernstack-exam-app
```


