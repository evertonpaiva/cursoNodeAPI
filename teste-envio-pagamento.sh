#!/usr/bin/env bash

clear

curl http://localhost:3000/pagamentos/pagamento \
    -X POST \
    -v \
    -H "Content-type: application/json" \
    -d @files/pagamento.json\
    ; echo
