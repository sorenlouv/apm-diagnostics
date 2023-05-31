import { Client, errors } from '@elastic/elasticsearch';
import {
  IndicesGetIndexTemplateRequest,
  IndicesGetIndexTemplateResponse,
} from '@elastic/elasticsearch/lib/api/types';

export async function getIndexTemplate(
  esClient: Client,
  params: IndicesGetIndexTemplateRequest
): Promise<IndicesGetIndexTemplateResponse> {
  try {
    return await esClient.indices.getIndexTemplate(params, {
      signal: new AbortController().signal,
    });
  } catch (e) {
    if (e instanceof errors.ResponseError && e.statusCode === 404) {
      return { index_templates: [] };
    }

    throw e;
  }
}
