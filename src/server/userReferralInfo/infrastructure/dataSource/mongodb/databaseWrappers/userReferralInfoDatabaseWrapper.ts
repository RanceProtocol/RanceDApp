import { IDatabaseWrapper } from "../../../interfaces/databaseWrapper";
import UserReferralInfo from "../models/userReferralInfo";

export const userReferralInfoDatabase: IDatabaseWrapper = {
    find: (query) => UserReferralInfo.findOne(query),
    insertOne: (data) => new UserReferralInfo(data).save(),
};
