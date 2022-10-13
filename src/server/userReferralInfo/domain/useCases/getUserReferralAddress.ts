import { userReferralInfoRepository } from "../../infrastructure/reposositories/userReferralInfoRepository";
import { IUserReferralInfoRepository } from "../interfaces/repositories/userReferralInfoRepository";

class GetUserReferralAddress {
    private userReferralInfoRepository: IUserReferralInfoRepository;
    constructor(userReferralInfoRepository: IUserReferralInfoRepository) {
        this.userReferralInfoRepository = userReferralInfoRepository;
    }

    async execute(code: string): Promise<string | null> {
        try {
            const isValidCode = /^[A-Za-z0-9_-]{15}$/.test(code);
            if (!isValidCode)
                throw {
                    code: 400,
                    message: "invalid referral code",
                };
            const referralInfo = await this.userReferralInfoRepository.get({
                code: code,
            });
            if (!referralInfo) return null;
            return referralInfo.address;
        } catch (error) {
            throw error;
        }
    }
}

export const getUserReferralAddress = new GetUserReferralAddress(
    userReferralInfoRepository
);
