import { IuserReferralInfo } from "../../domain/entities/userReferralInfo";
import { IUserReferralInfoRepository } from "../../domain/interfaces/repositories/userReferralInfoRepository";
import { userReferralInfoDataSource } from "../dataSource/mongodb/userReferralInfoDataSource";
import { IUserReferralInfoDataSource } from "../interfaces/dataSources/userReferralInfoDataSource";

export class UserReferralInfoRepository implements IUserReferralInfoRepository {
    referralInfoDataSource: IUserReferralInfoDataSource;
    constructor(referralInfoDataSource: IUserReferralInfoDataSource) {
        this.referralInfoDataSource = referralInfoDataSource;
    }

    async get(query: object): Promise<any> {
        const result = await this.referralInfoDataSource.get(query);
        return result;
    }

    async create(userReferralInfo: IuserReferralInfo): Promise<any> {
        const result = await this.referralInfoDataSource.create(
            userReferralInfo
        );
        return result;
    }
}

export const userReferralInfoRepository = new UserReferralInfoRepository(
    userReferralInfoDataSource
);
