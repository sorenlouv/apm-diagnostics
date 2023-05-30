import { AxiosInstance } from 'axios';
import { ApmIndicesConfig } from './types';

export async function getApmIndices(kibanaClient: AxiosInstance) {
  type Response = {
    apmIndexSettings: Array<{
      configurationName: string;
      defaultValue: string;
      savedValue?: string;
    }>;
  };

  const res = await kibanaClient.get<Response>(
    '/internal/apm/settings/apm-index-settings'
  );

  return Object.fromEntries(
    res.data.apmIndexSettings.map(
      ({ configurationName, defaultValue, savedValue }) => [
        configurationName,
        savedValue ?? defaultValue,
      ]
    )
  ) as ApmIndicesConfig;
}
