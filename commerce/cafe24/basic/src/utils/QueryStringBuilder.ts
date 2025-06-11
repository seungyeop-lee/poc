export class QueryStringBuilder {
    private readonly baseUrl: string;
    private queryString: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
        this.queryString = '';
    }

    addQueryString(key: string, value: string): void {
        if (this.queryString !== '') {
            this.queryString += '&';
        }
        this.queryString += `${key}=${encodeURIComponent(value)}`;
    }

    build(): string {
        return this.baseUrl + '?' + this.queryString;
    }
}
