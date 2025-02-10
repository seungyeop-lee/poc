import { MockApi } from '@/lib/api/mock_api';
import { RealApi } from '@/lib/api/real_api';
import { IApiConstructor } from '@/lib/api/types';

export const Api: IApiConstructor = process.env.NODE_ENV === 'production' ? RealApi : MockApi;
