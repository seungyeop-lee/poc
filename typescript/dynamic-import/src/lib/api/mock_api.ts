import type { IApi } from '@/lib/api/types';

export class MockApi implements IApi {
    async get(url: string) {
        return { data: `get mock data, url: ${url}` };
    }
    
    async post(url: string, data: any) {
        return { data: `post mock data, url: ${url}, data: ${data}` };
    }
}