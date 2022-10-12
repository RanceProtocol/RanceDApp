export interface IApiClient {
    get(url: string, configs?: object): Promise<any>;
    post(url: string, configs: object): Promise<any>;
}
