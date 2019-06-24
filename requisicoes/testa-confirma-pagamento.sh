#!/usr/bin/env bash

clear

echo -e "\nTestando confirmação de novo pagamento:"

curl http://localhost:3000/pagamentos/pagamento/12 \
    -X PUT \
    -v \
    | json_pp
