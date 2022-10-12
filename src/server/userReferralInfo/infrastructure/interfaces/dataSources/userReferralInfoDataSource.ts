import { IuserReferralInfo } from "../../../domain/entities/userReferralInfo";

export interface IUserReferralInfoDataSource {
    create(userReferralInfo: IuserReferralInfo): Promise<any>;
    get(query: object): Promise<any>;
}
