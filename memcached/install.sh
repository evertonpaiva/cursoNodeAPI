#!/usr/bin/env bash

wget http://memcached.org/latest -O memcached-latest.tar.gz
tar -zxvf memcached-latest.tar.gz

echo -e "\ncd memcached-1.x.x"
echo -e "\nsudo su && ./configure && make && make test && sudo make install"
