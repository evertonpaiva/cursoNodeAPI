#!/usr/bin/env bash

echo -e "\nIniciando stack de banco de dados"
docker-compose up -d

echo -e "\nExibindo logs, CTRL+C para cancelar"
docker-compose logs -f

