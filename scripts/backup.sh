#!/bin/bash

# Set variables
WEEK=$(date +"%U") # week name
YEAR=$(date +"%Y") # year name
FILENAME="backup_${WEEK}_${YEAR}.sql" # set filename
LOCALPATH="/tmp/${FILENAME}"


# su postgres
# Backup database

docker exec -ti db1 pg_dump -U postgres -h localhost $1  > ${LOCALPATH}

# Gzip the backup
gzip -c ${LOCALPATH} > ${LOCALPATH}.gz

# Copy backup to remote
s3cmd sync ${LOCALPATH}.gz s3://archief/sql-backups/img/
s3cmd sync ${LOCALPATH} s3://archief/sql-backups/img/img-backup-latest.sql

s3cmd -c ~/.s3cfg-img sync ${LOCALPATH}.gz s3://img-dashboard-backups/dbs/
s3cmd -c ~/.s3cfg-img sync ${LOCALPATH} s3://img-dashboard-backups/dbs/img-backup-latest.sql

