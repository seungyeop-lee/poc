export interface IApi {
    get: (url: string) => Promise<any>;
    post: (url: string, data: any) => Promise<any>;
}

export interface IApiConstructor {
    new(): IApi;
}