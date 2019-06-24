#!/usr/bin/env bash

clear

echo -e "\nTestando envio de arquivo de imagem:"

curl http://localhost:3000/upload/imagem \
    -X POST \
    -v \
    --data-binary @../util/imagem.jpg \
    -H "Content-type: application/octet-stream" \
    | json_pp
