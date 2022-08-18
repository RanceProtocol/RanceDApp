import { IStakingPool } from "../../domain/entities";
import { IStakingStore } from "../../domain/stakingStore";
import * as actionTypes from "./actionTypes";

const initialState: IStakingStore = {
    loadingPools: false,
    loadingUserEarnings: false,
    pools: [],
};

export const stakingReducer = (
    state = initialState,
    action: { type: string; payload?: any }
): IStakingStore => {
    const { type, payload } = action;
    switch (type) {
        case actionTypes.GET__STAKING__POOLS:
            return { ...state, loadingPools: true };
        case actionTypes.GET__STAKING__POOLS__SUCCESS:
            return {
                ...state,
                pools: payload.pools,
                loadingPools: false,
                loadingUserEarnings: payload.pools[0].userEarned ? false : true,
                
            };
        case actionTypes.GET__STAKING__POOLS__FAILLED:
            return {
                ...state,
                loadingPools: false,
                loadingUserEarnings: false
            };
        case actionTypes.GETTING__USER__STAKING__POOLS__EARNING:
            return {...state, loadingUserEarnings: true}
        case actionTypes.SET__STAKING__POOL:
            const unChangedPools = state.pools.filter(
                (pool) =>
                    pool.id !== payload.pool.id &&
                    pool.contractAddress !== payload.pool.contractAddress
            );
            return { ...state, pools: [...unChangedPools, payload.pool].sort((a: IStakingPool, b: IStakingPool) => a.id - b.id) };
        default:
            return state;
    }
};
