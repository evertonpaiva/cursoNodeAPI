#!/usr/bin/env bash

clear

echo -e "\nTestando confirmação de novo pagamento:"

curl http://localhost:3000/pagamentos/pagamento/11 \
    -X PUT \
    -v \
    -H "Content-type: application/json" \
    -d @../files/pagamento.json\
    | json_pp
