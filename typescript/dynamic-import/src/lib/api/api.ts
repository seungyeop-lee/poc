import { MockApi } from '@/lib/api/mock_api';
import { RealApi } from '@/lib/api/real_api';
import { IApiConstructor } from '@/lib/api/types';
import { isProduction } from '@/lib/helper';

export const Api: IApiConstructor = isProduction() ? RealApi : MockApi;

console.log(`api.ts loaded: ${Api.name}`);