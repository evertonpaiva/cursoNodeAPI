#!/usr/bin/env bash

clear

echo -e "\nTestando a consulta de pagamento:"

curl http://localhost:3000/pagamentos/pagamento/20 \
    -X GET \
    -v \
    | json_pp
