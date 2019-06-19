#!/usr/bin/env bash

clear

echo -e "\nTestando envio de novo pagamento:"

curl http://localhost:3000/pagamentos/pagamento \
    -X POST \
    -v \
    -H "Content-type: application/json" \
    -d @files/pagamento.json\
    | json_pp
