import { IApiClientWrapper } from "../infrastructure/interfaces/apiClientWrapper";

export const generateReferralLink = async (
    address: string,
    message: string,
    sign: (message: string) => Promise<string>,
    apiClient: IApiClientWrapper
): Promise<any> => {
    try {
        const signature = await sign(message);
        const response = await apiClient.post("/api/referral/code/create", {
            message,
            signature,
            address,
        });
        return `https://cronos.ranceprotocol.com?ref=${response.data.code}`;
    } catch (error: any) {
        throw error;
    }
};
