#!/bin/bash

docker exec -i db1 psql --username "postgres" -d "img" -c "SELECT pg_terminate_backend (pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '"$1"'"
docker exec -i db1 psql --username "postgres" -d "img" -c "DROP DATABASE "$1";"



