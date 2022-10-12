import { IuserReferralInfo } from "../../entities/userReferralInfo";
export interface IUserReferralInfoRepository {
    create(userReferralInfo: IuserReferralInfo): Promise<any>;
    get(query: object): Promise<any>;
}
