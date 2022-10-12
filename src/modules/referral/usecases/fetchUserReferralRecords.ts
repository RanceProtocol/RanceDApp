import { BigNumber } from "ethers";
import { RanceProtocol } from "../../../typechain";
import { getMulticall } from "../../../utils/multicall";
import { IReferralReward } from "../domain/entities";
import erc20ABI from "../../../constants/abis/Erc20.json";

export const fetchUserReferralRecords = async (
    contract: RanceProtocol,
    userAddress: string
): Promise<IReferralReward[]> => {
    const { multicall } = getMulticall(contract.provider);
    const refLength = await contract.getUserReferralsLength(userAddress);
    if (refLength.toNumber() === 0) return [];

    const refRecord = await contract.getAllUserReferrals(
        userAddress,
        0,
        refLength
    );

    const rewardTokenSymbolCall = refRecord.map(
        (record: RanceProtocol.ReferralRewardStructOutput) => {
            return {
                address: record.token,
                name: "symbol",
            };
        }
    );

    const rewardTokenDecimalsCall = refRecord.map(
        (record: RanceProtocol.ReferralRewardStructOutput) => {
            return {
                address: record.token,
                name: "decimals",
            };
        }
    );

    const rewardTokenSymbolAndDecimalResult = await Promise.all([
        multicall(erc20ABI, rewardTokenSymbolCall),
        await multicall(erc20ABI, rewardTokenDecimalsCall),
    ]);
    const rewardTokenSymbolResult = rewardTokenSymbolAndDecimalResult[0];
    const rewardTokenDecimalsResult = rewardTokenSymbolAndDecimalResult[1];

    const formatedRefRecord = refRecord.map(
        (
            record: RanceProtocol.ReferralRewardStructOutput,
            index: number
        ): IReferralReward => {
            return {
                id: record.id,
                rewardAmount: record.rewardAmount,
                rewardToken: record.token,
                rewardTokenSymbol: rewardTokenSymbolResult[index][0],
                rewardTokenDecimals: rewardTokenDecimalsResult[index][0],
                date: formatRewardDate(record.timestamp),
                user: record.user,
                owner: record.referrer,
                claimed: record.claimed,
            };
        }
    );
    return formatedRefRecord;
};

const formatRewardDate = (timestamp: BigNumber): string => {
    const dateArray = new Date(timestamp.toNumber() * 1000)
        .toString()
        .split(" ");
    return `${dateArray[1]} ${dateArray[2]} ${dateArray[3]}`;
};
