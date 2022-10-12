import { userReferralInfoRepository } from "../../infrastructure/reposositories/userReferralInfoRepository";
import { IUserReferralInfoRepository } from "../interfaces/repositories/userReferralInfoRepository";
import { verifySignature } from "./utils.ts/signature";
import { nanoid } from "nanoid";
import { IuserReferralInfo } from "../entities/userReferralInfo";
import {
    formatMongoDBValidationError,
    formatMongoDBDuplicateKeyError,
} from "../../infrastructure/dataSource/mongodb/utils/errors";

class CreateUserReferralInfo {
    private userReferralInfoRepository: IUserReferralInfoRepository;
    constructor(userReferralInfoRepository: IUserReferralInfoRepository) {
        this.userReferralInfoRepository = userReferralInfoRepository;
    }

    async execute(
        message: string,
        signature: string,
        address: string
    ): Promise<IuserReferralInfo> {
        try {
            // verify  the 'address' is the signer of the 'signature'
            // generate a code
            // create save in the db through the repository
            const isVerified = verifySignature({
                signature,
                message,
                signerAddress: address,
            });
            if (!isVerified) {
                const err = {
                    message: "Signature and signer do not match",
                    code: 401,
                };
                throw err;
            }
            const refCode = `RP_${nanoid(12)}`;
            const result = await this.userReferralInfoRepository.create({
                address: address.toLocaleLowerCase(),
                code: refCode,
            });
            return {
                address: result.address,
                code: result.code,
            };
        } catch (error: any) {
            if (error.name === "ValidationError") {
                const err = formatMongoDBValidationError(error);
                throw err;
            } else if (error.code && error.code == 11000) {
                const err = formatMongoDBDuplicateKeyError(error);
                throw err;
            }
            throw error;
        }
    }
}

export const createUserReferralInfo = new CreateUserReferralInfo(
    userReferralInfoRepository
);
