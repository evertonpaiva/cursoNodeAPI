#!/usr/bin/env bash

clear

echo -e "\nTestando autorização de cartão:"

curl http://localhost:3001/cartoes/autoriza \
    -X POST \
    -v \
    -H "Content-type: application/json" \
    -d @../files/cartao.json\
    | json_pp
