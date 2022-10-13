import { IApiClientWrapper } from "../infrastructure/interfaces/apiClientWrapper";

export const getReferralLink = async (
    address: string,
    apiClient: IApiClientWrapper
): Promise<any> => {
    try {
        const response = await apiClient.get(
            `/api/referral/code?address=${address}`
        );
        return `https://cronos.ranceprotocol.com?ref=${response.data.code}`;
    } catch (error: any) {
        throw error;
    }
};
