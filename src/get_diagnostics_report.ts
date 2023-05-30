import { type Client } from '@elastic/elasticsearch';
import { AxiosInstance } from 'axios';
import { getEsVerison } from './cluster_info/cluster_info';
import { getDataStreams } from './data_streams/get_data_streams';
import { getNonDataStreamIndices } from './data_streams/get_non_data_stream_indices';
import { getPackageInfo } from './get_package_info';
import { getIndexTemplatesByIndexPattern } from './index_pattern_settings/get_index_templates_by_index_pattern';
import { getApmIndexTemplates } from './index_templates/get_existing_index_templates';
import { getFieldCaps } from './indices/get_field_caps';
import { getIndicesAndIngestPipelines } from './indices/get_indices';
import { ApmIndicesConfig } from './types';

export async function getDiagnosticsReport(
  kibanaClient: AxiosInstance,
  esClient: Client,
  apmIndices: ApmIndicesConfig
) {
  const esVersion = await getEsVerison(esClient);
  const packageInfo = await getPackageInfo(kibanaClient);

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
    packageInfo,
    fieldCaps,
    indices,
    ingestPipelines,
    indexTemplatesByIndexPattern,
    existingIndexTemplates,
    dataStreams,
    nonDataStreamIndices,
  };
}
