import 'dotenv/config';
import fs from 'fs/promises';
import { Client } from '@elastic/elasticsearch';
import axios from 'axios';
import { getApmIndices } from './get_apm_indices';
import { getDiagnosticsReport } from './get_diagnostics_report';

const ELASTICSEARCH_HOST = process.env.ELASTICSEARCH_HOST as string;
const KIBANA_HOST = process.env.KIBANA_HOST as string;
const USERNAME = process.env.USERNAME as string;
const PASSWORD = process.env.PASSWORD as string;

async function init() {
  const esClient = new Client({
    node: ELASTICSEARCH_HOST,
    auth: { username: USERNAME, password: PASSWORD },
  });

  const kibanaClient = axios.create({
    baseURL: KIBANA_HOST,
    auth: { username: USERNAME, password: PASSWORD },
  });

  const apmIndices = await getApmIndices(kibanaClient);
  const report = await getDiagnosticsReport(kibanaClient, esClient, apmIndices);
  await fs.writeFile(
    'diagnostics-report.json',
    JSON.stringify(report, null, 2),
    { encoding: 'utf8', flag: 'w' }
  );
}

init();
