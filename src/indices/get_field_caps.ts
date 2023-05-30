/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { type Client } from '@elastic/elasticsearch';
import { ApmIndicesConfig } from '../types';
import { getApmIndexPatterns } from './get_indices';

export function getFieldCaps({
  esClient,
  apmIndices,
}: {
  esClient: Client;
  apmIndices: ApmIndicesConfig;
}) {
  return esClient.fieldCaps({
    index: getApmIndexPatterns([apmIndices.metric, apmIndices.transaction]),
    fields: ['service.name'],
    filter_path: ['fields'],
    filters: '-parent',
    include_unmapped: true,
  });
}
