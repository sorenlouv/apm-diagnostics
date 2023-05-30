## Install APM Diagnostics Tool

```
npm install -g apm-diagnostics
```

## Add credentials

Create `.env` file with the following options adapted to your cluster:

```
KIBANA_HOST="http://localhost:5601"
ELASTICSEARCH_HOST="http://localhost:9200"
USERNAME="elastic"
PASSWORD="changeme"
```

## Run

```
apm-diagnostics
```
