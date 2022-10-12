import { SendParams } from "../../../hooks/useTransaction";
import { RanceProtocol } from "../../../typechain";

interface IClaimReferralRewardParams {
    contract: RanceProtocol;
    referralRewardIds: string[];
    send: (params: SendParams) => Promise<void>;
    callbacks: { [key: string]: (errorMessage?: string) => void };
}

export const claimReferralRewards = async (
    params: IClaimReferralRewardParams
): Promise<void> => {
    const { contract, referralRewardIds, send, callbacks } = params;
    const method = contract.claimReferralReward;
    const methodParams = [referralRewardIds];
    await send({ method, methodParams, callbacks });
};
