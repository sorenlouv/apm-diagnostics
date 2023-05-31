import { Client } from '@elastic/elasticsearch';

export async function getEsVerison(esClient: Client) {
  const { version } = await esClient.info();
  return version.number;
}
