#!/bin/bash

if [ ! -f .env ]
then
  export $(cat /srv/img-server/docker/.env | xargs)
fi


docker exec -i db1 pg_dump --username "postgres" $STAGING > /tmp/switch_dump.sql
# ah ... werkt niet wanneer er een verbinding is via postgrest!
#docker exec -i db1 psql --username "postgres" -d "img" -c "SELECT pg_terminate_backend (pg_stat_activity.pid) FROM pg_stat_activity >
docker exec -i db1 psql --username "postgres" -d "img" -c "DROP DATABASE IF EXISTS "$LIVE" WITH (FORCE);"
docker exec -i db1 psql --username "postgres" -d "img" -c "CREATE DATABASE "$LIVE";"
docker exec -i db1 psql --username "postgres" $LIVE < /tmp/switch_dump.sql

