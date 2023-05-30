import { type Client } from '@elastic/elasticsearch';
import { getApmIndexPatterns } from '../indices/get_indices';
import { ApmIndicesConfig } from '../types';

export async function getDataStreams({
  esClient,
  apmIndices,
}: {
  esClient: Client;
  apmIndices: ApmIndicesConfig;
}) {
  const apmIndexPatterns = getApmIndexPatterns([
    apmIndices.error,
    apmIndices.metric,
    apmIndices.span,
    apmIndices.transaction,
  ]);

  // fetch APM data streams
  const { data_streams: dataStreams } = await esClient.indices.getDataStream({
    name: apmIndexPatterns,
    filter_path: ['data_streams.name', 'data_streams.template'],
  });

  return dataStreams;
}
