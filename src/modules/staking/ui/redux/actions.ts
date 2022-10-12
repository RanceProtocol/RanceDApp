import { Dispatch } from "react";
import { toast } from "react-toastify";
import CustomToast, { STATUS, TYPE } from "../../../../Components/CustomToast";
import { Staking1, Staking2 } from "../../../../typechain";
import { IStakingPool } from "../../domain/entities";
import { initializeStakingPools as initializeStakingPoolsUsecase } from "../../usecases/initialize";
import { getPool as getPoolUsecase } from "../../usecases/getPool";
import * as actionTypes from "./actionTypes";

export const initializeStakingPools =
    (
        contract1: Staking1,
        contract2: Staking2,
        userAddress: string | null | undefined
    ) =>
    async (
        dispatch: Dispatch<{ type: string; payload?: any }>
    ): Promise<void> => {
        dispatch({ type: actionTypes.GET__STAKING__POOLS });
        if (userAddress) {
            dispatch({
                type: actionTypes.GETTING__USER__STAKING__POOLS__EARNING,
            });
        }
        try {
            const pools: IStakingPool[] = await initializeStakingPoolsUsecase(
                contract1,
                contract2,
                userAddress
            );
            dispatch({
                type: actionTypes.GET__STAKING__POOLS__SUCCESS,
                payload: { pools },
            });
        } catch (error) {
            dispatch({
                type: actionTypes.GET__STAKING__POOLS__FAILLED,
            });
            const toastBody = CustomToast({
                message: "Error getting staking pools! Please reload the page",
                status: STATUS.ERROR,
                type: TYPE.ERROR,
            });
            toast(toastBody);
        }
    };

export const updateStakingPool =
    (
        contract: Staking1 | Staking2,
        pId: number,
        userAddress: string | null | undefined
    ) =>
    async (
        dispatch: Dispatch<{ type: string; payload?: any }>
    ): Promise<void> => {
        try {
            const pool = await getPoolUsecase({ contract, pId, userAddress });
            dispatch({
                type: actionTypes.SET__STAKING__POOL,
                payload: { pool },
            });
        } catch (error) {
            console.error(error);
        }
    };
