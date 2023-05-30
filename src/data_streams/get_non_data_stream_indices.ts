/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { type Client } from '@elastic/elasticsearch';
import { getApmIndexPatterns } from '../indices/get_indices';
import { ApmIndicesConfig } from '../types';

export async function getNonDataStreamIndices({
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

  // fetch non-data stream indices
  const nonDataStreamIndicesResponse = await esClient.indices.get({
    index: apmIndexPatterns,
    filter_path: ['*.data_stream', '*.settings.index.uuid'],
  });

  const nonDataStreamIndices = Object.entries(nonDataStreamIndicesResponse)
    .filter(([, { data_stream: dataStream }]): boolean => !dataStream)
    .map(([indexName]): string => indexName);

  return nonDataStreamIndices;
}
