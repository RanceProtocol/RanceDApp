export interface IApiClientWrapper {
    get(url: string, configs?: object): any;
    post(url: string, configs: object): any;
}
