#!/bin/bash
docker exec -i db1 psql --username "postgres" -d "img" -c "CREATE DATABASE "$1";"
docker exec -i db1 psql --username postgres $1 < /opt/backups/dump.sql