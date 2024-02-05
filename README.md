
 cd docker
 docker-compose up -d 
 
### nginx
 nginx server that provides access through:
 
/open-data/api --> rest api live data 
/open-data/staging/api --> rest api staging data 
/open-data/dev/api --> rest api dev data 

/graphs/ --> live dashboard
/staging/ --> staging dashboard
/dev/ --> dev dashboard
/publieke-data/docs/ --> swagger interface 
/pgadmin4/ --> pgadmin interface 

### db1:
postgres databases 

### pgadmin1:
webinterface for postgres 

### server1:
rest api with complete live data 

### staging-server1:
rest api with complete staging data 

### dev-server1:
rest api with complete dev data 

### public-server1:
rest api with smaller relevent selection of live data 

### swagger1:
webinterface to query live data 

### node:
node js app;lication for maintenance tasks, like import scripts. 

### /usr/bin/img
command line interface to call methods on node application 

Commands:
  img db:create [db]         creates a new databas
  img db:drop [db]           deletes a database
  img db:update [db]         updates a database to latest backup
  img db:config              show databases
  img db:prepare [db]        prepare database for data entry
  img db:publish [db]        connect live dashboard to this database
  img db:stage [db]          connect staging dashboard to this database
  img db:backup [db] [name]  backup database to the spaces bucket in digital oce
                             an
  img data:entry [week]      import data from csv
  img api:view [name] [db]   add the public read permissions for a new api endpo
                             int

