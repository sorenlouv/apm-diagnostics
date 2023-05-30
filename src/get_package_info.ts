import { AxiosInstance } from 'axios';

export async function getPackageInfo(kibanaClient: AxiosInstance) {
  const res = await kibanaClient.get('/api/fleet/epm/packages/apm');
  return {
    version: res.data.response.version,
    isInstalled: res.data.response.status,
  };
}
