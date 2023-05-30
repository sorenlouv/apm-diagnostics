import 'dotenv/config';
import fs from 'fs/promises';
import { Client } from '@elastic/elasticsearch';
import axios from 'axios';
import { getApmIndices } from './get_apm_indices';
import { getDiagnosticsReport } from './get_diagnostics_report';
import { logger } from './logger';

const ELASTICSEARCH_HOST =
  process.env.ELASTICSEARCH_HOST ?? 'http://localhost:9200';
const KIBANA_HOST = process.env.KIBANA_HOST ?? 'http://localhost:5601';
const USERNAME = process.env.USERNAME ?? 'elastic';
const PASSWORD = process.env.PASSWORD ?? 'changeme';

async function init() {
  const esClient = new Client({
    node: ELASTICSEARCH_HOST,
    auth: { username: USERNAME, password: PASSWORD },
  });

  const kibanaClient = axios.create({
    baseURL: KIBANA_HOST,
    auth: { username: USERNAME, password: PASSWORD },
  });

  try {
    const apmIndices = await getApmIndices(kibanaClient);
    const report = await getDiagnosticsReport(
      kibanaClient,
      esClient,
      apmIndices
    );
    const filename = 'diagnostics-report.json';
    await fs.writeFile(filename, JSON.stringify(report, null, 2), {
      encoding: 'utf8',
      flag: 'w',
    });
    logger.info(`Diagnostics report written to "${filename}"`);
  } catch (e) {
    logger.error(e);
  }
}

init();
