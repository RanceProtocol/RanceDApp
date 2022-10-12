import { BigNumber } from "ethers";

export interface IReferralReward {
    id: string;
    rewardAmount: BigNumber;
    rewardToken: string;
    rewardTokenSymbol: string;
    rewardTokenDecimals: number;
    date: string;
    user: string;
    owner: string;
    claimed: boolean;
}
