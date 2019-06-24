#!/usr/bin/env bash

clear

echo -e "\nTestando remoção de pagamento:"

curl http://localhost:3000/pagamentos/pagamento/11 \
    -X DELETE \
    -v \
    | json_pp
