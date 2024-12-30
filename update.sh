#!/bin/bash

# Parar e remover containers existentes
echo "Parando containers..."
docker-compose down

# Remover imagens antigas (opcional)
echo "Removendo imagens antigas..."
docker rmi $(docker images -q) --force

# Rebuildar as imagens do projeto
echo "Recriando containers e imagens..."
docker-compose build

# Subir novamente os containers com as atualizações
echo "Subindo containers atualizados..."
docker-compose up -d

echo "Atualização concluída!"