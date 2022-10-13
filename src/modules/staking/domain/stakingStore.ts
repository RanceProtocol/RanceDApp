import { IStakingPool } from "./entities";

export interface IStakingStore {
    loadingPools: boolean;
    loadingUserEarnings: boolean;
    pools: IStakingPool[];
}
