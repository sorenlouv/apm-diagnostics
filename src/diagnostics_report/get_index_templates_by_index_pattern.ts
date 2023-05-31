import { type Client } from '@elastic/elasticsearch';
import { IndicesSimulateTemplateResponse } from '@elastic/elasticsearch/lib/api/types';
import { orderBy } from 'lodash';
import { getIndexTemplate } from '../diagnostics_report/get_index_template';
import { getApmIndexPatterns } from '../diagnostics_report/get_indices';
import { ApmIndicesConfig } from '../types';

export async function getIndexTemplatesByIndexPattern({
  esClient,
  apmIndices,
}: {
  esClient: Client;
  apmIndices: ApmIndicesConfig;
}) {
  const indexPatterns = getApmIndexPatterns([
    apmIndices.error,
    apmIndices.metric,
    apmIndices.span,
    apmIndices.transaction,
  ]);

  return Promise.all(
    indexPatterns.map(async (indexPattern) =>
      getSimulatedIndexTemplateForIndexPattern({ indexPattern, esClient })
    )
  );
}

async function getSimulatedIndexTemplateForIndexPattern({
  esClient,
  indexPattern,
}: {
  esClient: Client;
  indexPattern: string;
}) {
  const simulatedIndexTemplate =
    await esClient.transport.request<IndicesSimulateTemplateResponse>({
      method: 'POST',
      path: '/_index_template/_simulate',
      body: { index_patterns: [indexPattern] },
    });

  const indexTemplates = await Promise.all(
    (simulatedIndexTemplate.overlapping ?? []).map(
      async ({ index_patterns: templateIndexPatterns, name: templateName }) => {
        const priority = await getTemplatePriority(esClient, templateName);
        return {
          priority,
          templateIndexPatterns,
          templateName,
        };
      }
    )
  );

  return {
    indexPattern,
    indexTemplates: orderBy(indexTemplates, ({ priority }) => priority, 'desc'),
  };
}

async function getTemplatePriority(esClient: Client, name: string) {
  const res = await getIndexTemplate(esClient, { name });
  return res.index_templates[0]?.index_template?.priority;
}
