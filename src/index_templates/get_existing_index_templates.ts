/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { type Client } from '@elastic/elasticsearch';
import { getIndexTemplate } from './get_index_template';

export type ApmIndexTemplateStates = Record<
  string,
  { exists: boolean; name?: string | undefined }
>;

// Check whether the default APM index templates exist
export async function getApmIndexTemplates({ esClient }: { esClient: Client }) {
  return getIndexTemplate(esClient, { name: '*-apm.*' });
}
