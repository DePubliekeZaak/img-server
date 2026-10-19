# img-server

Monorepo for the IMG (schadedoormijnbouw) backend, deployed to the `img` droplet.

| dir | what it is |
|---|---|
| `nginx/` | host nginx config — `setup.sh` installs conf.d into `/etc/nginx` |
| `docker/` | docker compose stack: postgres, postgrest APIs, swagger, importer |
| `node/` | node maintenance app (imports etc.), built into the `custom_node` image |
| `cli/` | `img` command-line tool (backup / prepare / import / stage / publish) |
| `deploy/` | one deploy script per layer |

## deploy

One command per layer:

```sh
npm run deploy:nginx    # rsync nginx/ to server + sudo nginx/setup.sh (installs + reloads)
npm run deploy:docker   # rsync docker/ to server + docker compose up -d
npm run deploy:node     # build node/dist, rsync node/, rebuild + restart importer
npm run deploy          # all three, in order: node -> docker -> nginx
```

Secrets on the server (`docker/.env`, `node/.env`) are never synced — the
server keeps its own copies.

Override the target host: `DEPLOY_HOST=user@host npm run deploy:nginx`

## nginx endpoints

| path | omschrijving |
|---|---|
| `/open-data/api/` | rest api live data |
| `/open-data/staging/` | rest api staging data |
| `/open-data/archives/v100/api/` | rest api v100 archive |
| `/open-data/archives/v001/api/` | rest api v001 archive |
| `/graphs/` | live dashboard |
| `/publieke-data/docs/` | swagger interface |
| `/pgadmin4/` | pgadmin interface |

## containers

| naam | omschrijving |
|---|---|
| `db2` | postgres 17 (img_v001 / img_v100 / public / staging) |
| `pgadmin2` | webinterface for postgres |
| `live-api` | postgrest: live data (public) |
| `staging-api` | postgrest: staging data |
| `archive-v100-api` | postgrest: v100 archive |
| `archive-v0-api` | postgrest: v001 archive |
| `public-server1` | postgrest: smaller public subset |
| `swagger1` | webinterface to query live data |
| `importer` | node app for maintenance/import tasks (built from `node/`) |

## CLI

`/usr/bin/img` -> command line interface to call methods on node application

```
Commands:

  img db:backup [db]        backup database to the spaces bucket in digital ocean
  img db:prepare [db]       prepare database for data entry
  img data:entry [week]     import data from csv
  img db:stage [db]         connect staging dashboard to this database
  img db:publish [db]       promote staging database to public
  img db:dev [db]           connect dev dashboard to this database
  img api:view [name] [db]  add the public read permissions for a new api endpoint
```
