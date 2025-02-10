import type { IApi } from '@/lib/api/types';

export class RealApi implements IApi {
    async get(url: string) {
        return { data: `get real data, url: ${url}` };
    }
    
    async post(url: string, data: any) {
        return { data: `post real data, url: ${url}, data: ${data}` };
    }
}