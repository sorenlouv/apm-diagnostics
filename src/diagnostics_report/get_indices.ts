import { type Client } from '@elastic/elasticsearch';
import { compact, uniq } from 'lodash';
import { ApmIndicesConfig } from '../types';

export function getApmIndexPatterns(indices: string[]) {
  return uniq(indices.flatMap((index): string[] => index.split(',')));
}

export async function getIndicesAndIngestPipelines({
  esClient,
  apmIndices,
}: {
  esClient: Client;
  apmIndices: ApmIndicesConfig;
}) {
  const indices = await esClient.indices.get({
    index: getApmIndexPatterns([
      apmIndices.error,
      apmIndices.metric,
      apmIndices.span,
      apmIndices.transaction,
    ]),
    filter_path: [
      '*.settings.index.default_pipeline',
      '*.data_stream',
      '*.settings.index.provided_name',
    ],
  });

  const pipelineIds = compact(
    uniq(
      Object.values(indices).map(
        (index) => index.settings?.index?.default_pipeline
      )
    )
  ).join(',');

  const ingestPipelines = await esClient.ingest.getPipeline({
    id: pipelineIds,
    filter_path: ['*.processors.grok.field', '*.processors.grok.patterns'],
  });

  return { indices, ingestPipelines };
}
