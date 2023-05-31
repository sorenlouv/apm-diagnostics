import { type Client } from '@elastic/elasticsearch';
import { getDataStreams } from './diagnostics_report/get_data_streams';
import { getEsVerison } from './diagnostics_report/get_es_version';
import { getApmIndexTemplates } from './diagnostics_report/get_existing_index_templates';
import { getFieldCaps } from './diagnostics_report/get_field_caps';
import { getIndexTemplatesByIndexPattern } from './diagnostics_report/get_index_templates_by_index_pattern';
import { getIndicesAndIngestPipelines } from './diagnostics_report/get_indices';
import { getNonDataStreamIndices } from './diagnostics_report/get_non_data_stream_indices';
import { ApmIndicesConfig } from './types';

export async function getDiagnosticsReport(
  esClient: Client,
  apmIndices: ApmIndicesConfig
) {
  const esVersion = await getEsVerison(esClient);

  const { indices, ingestPipelines } = await getIndicesAndIngestPipelines({
    esClient,
    apmIndices,
  });

  const indexTemplatesByIndexPattern = await getIndexTemplatesByIndexPattern({
    esClient,
    apmIndices,
  });

  const existingIndexTemplates = await getApmIndexTemplates({
    esClient,
  });

  const fieldCaps = await getFieldCaps({ esClient, apmIndices });

  const dataStreams = await getDataStreams({ esClient, apmIndices });
  const nonDataStreamIndices = await getNonDataStreamIndices({
    esClient,
    apmIndices,
  });

  return {
    esVersion,
    fieldCaps,
    indices,
    ingestPipelines,
    indexTemplatesByIndexPattern,
    existingIndexTemplates,
    dataStreams,
    nonDataStreamIndices,
  };
}
