import { Staking1, Staking2 } from "../../../typechain";
import { getstakingContract1Pool, getstakingContract2Pool } from "./helpers";

interface StakeParams {
    contract: Staking1 | Staking2;
    pId: number;
    userAddress: string | null | undefined;
}

export const getPool = async (params: StakeParams) => {
    const { contract, pId, userAddress } = params;
    if(pId === 0) {
        return await getstakingContract1Pool(contract as Staking1, userAddress);
    } else {
        return await getstakingContract2Pool(contract as Staking2, userAddress);
    }
};