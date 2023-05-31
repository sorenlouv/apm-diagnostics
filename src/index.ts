import 'dotenv/config';
import fs from 'fs/promises';
import { Client } from '@elastic/elasticsearch';
import axios from 'axios';
import { getDiagnosticsReport } from './get_diagnostics_report';
import { getApmIndices } from './kibana/get_apm_indices';
import { getPackageInfo } from './kibana/get_package_info';
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
    const packageInfo = await getPackageInfo(kibanaClient);
    const report = await getDiagnosticsReport(esClient, apmIndices);
    const combinedReport = { ...report, packageInfo };
    await saveReportToFile(combinedReport);
  } catch (e) {
    logger.error(e);
  }
}

async function saveReportToFile(combinedReport: Record<string, any>) {
  const filename = 'diagnostics-report.json';
  await fs.writeFile(filename, JSON.stringify(combinedReport, null, 2), {
    encoding: 'utf8',
    flag: 'w',
  });
  logger.info(`Diagnostics report written to "${filename}"`);
}

init();
