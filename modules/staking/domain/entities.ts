import { BigNumber } from "ethers";

export interface IStakingPool {
    id: number;
    contractAddress: string;
    stakeTokenSymbol: string;
    stakeTokenAddress: string;
    rewardTokenAddress: string;
    rewardTokenSymbol: string;
    apr: BigNumber;
    totalStaked: BigNumber;
    potentialEarnings: BigNumber;
    userStaked?: BigNumber;
    userEarned?: BigNumber;
    stakeTokenDecimals: number;
    rewardTokenDecimals: number;
    stakeTokenPrice: number;
    rewardTokenPrice: number;
}
