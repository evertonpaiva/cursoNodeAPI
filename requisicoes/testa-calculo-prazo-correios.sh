#!/usr/bin/env bash

clear

echo -e "\nTestando cálculo de prazo dos correios:"

curl http://localhost:3000/correios/calculo-prazo \
    -X POST \
    -v \
    -H "Content-type: application/json" \
    -d @../files/dados-entrega.json\
    | json_pp
