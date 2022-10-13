import { IApiClient } from "../../../domain/interfaces/apiClient";
import { IApiClientWrapper } from "../../interfaces/apiClientWrapper";
import { axios } from "../libraries/axios";
class ApiClient implements IApiClient {
    private client: IApiClientWrapper;
    constructor(client: IApiClientWrapper) {
        this.client = client;
    }

    async get(url: string, configs?: object): Promise<any> {
        try {
            const response = await this.client.get(url, configs);
            return response;
        } catch (error) {
            throw error;
        }
    }

    async post(url: string, configs: object): Promise<any> {
        try {
            const response = await this.client.post(url, configs);
            return response;
        } catch (error) {
            throw error;
        }
    }
}

export const apiClient = new ApiClient(axios);
