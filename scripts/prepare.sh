#!/bin/bash

if [ ! -f .env ]
then
  export $(cat ../docker/.env | xargs)
fi

docker exec -i db1 pg_dump --username "postgres" $LIVE > /opt/backups/switch_dump.sql
# ah ... werkt niet wanneer er een verbinding is via postgrest!
docker exec -i db1 psql --username "postgres" -d "img" -c "SELECT pg_terminate_backend (pg_stat_activity.pid) FROM pg_stat_activity WHERE pg_stat_activity.datname = '"$NEW"'"
docker exec -i db1 psql --username "postgres" -d "img" -c "DROP DATABASE "$NEW";"
docker exec -i db1 psql --username "postgres" -d "img" -c "CREATE DATABASE "$NEW";"
docker exec -i db1 psql --username "postgres" $NEW < /opt/backups/switch_dump.sql

