import { userReferralInfoRepository } from "../../infrastructure/reposositories/userReferralInfoRepository";
import { IUserReferralInfoRepository } from "../interfaces/repositories/userReferralInfoRepository";

class GetUserreferralCode {
    private userReferralInfoRepository: IUserReferralInfoRepository;
    constructor(userReferralInfoRepository: IUserReferralInfoRepository) {
        this.userReferralInfoRepository = userReferralInfoRepository;
    }

    async execute(address: string): Promise<string | null> {
        try {
            const isValidAddress = /^0x[a-fA-F0-9]{40}$/.test(address);
            if (!isValidAddress)
                throw {
                    code: 400,
                    message: "invalid user address",
                };
            const referralInfo = await this.userReferralInfoRepository.get({
                address: address.toLowerCase(),
            });
            if (!referralInfo) return null;

            return referralInfo.code;
        } catch (error: any) {
            throw error;
        }
    }
}

export const getUserreferralCode = new GetUserreferralCode(
    userReferralInfoRepository
);
