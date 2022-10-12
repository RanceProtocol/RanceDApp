import { IuserReferralInfo } from "../../../domain/entities/userReferralInfo";
import { IDatabaseWrapper } from "../../interfaces/databaseWrapper";
import { IUserReferralInfoDataSource } from "../../interfaces/dataSources/userReferralInfoDataSource";
import { userReferralInfoDatabase } from "./databaseWrappers/userReferralInfoDatabaseWrapper";

export class MongoDBUserReferralInfoDataSource
    implements IUserReferralInfoDataSource
{
    private db: IDatabaseWrapper;
    constructor(db: IDatabaseWrapper) {
        this.db = db;
    }

    async create(data: IuserReferralInfo): Promise<any> {
        try {
            const result = await this.db.insertOne(data);
            return result;
        } catch (error) {
            throw error;
        }
    }

    async get(query: object): Promise<any> {
        try {
            const result = await this.db.find(query);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export const userReferralInfoDataSource = new MongoDBUserReferralInfoDataSource(
    userReferralInfoDatabase
);
