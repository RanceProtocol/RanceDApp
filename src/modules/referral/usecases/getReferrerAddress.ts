import { IApiClientWrapper } from "../infrastructure/interfaces/apiClientWrapper";

export const getReferrerAddress = async (
    code: string,
    apiClient: IApiClientWrapper
): Promise<any> => {
    try {
        const response = await apiClient.get(
            `/api/referral/address?code=${code}`
        );
        return response.data.address;
    } catch (error: any) {
        throw error;
    }
};
