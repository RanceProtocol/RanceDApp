import { BigNumber } from "ethers";
import useTransaction, { SendParams } from "../../../hooks/useTransaction";
import { Staking1, Staking2 } from "../../../typechain";

interface UnstakeParams {
    contract: Staking1 | Staking2;
    pId: number;
    amount: BigNumber;
    send: (params: SendParams) => Promise<void>;
    callbacks?: { [key: string]: () => void };
}

export const unstake = (params: UnstakeParams) => {
    const { contract, pId, amount, send, callbacks } = params;
    const method = contract.withdraw;
    const methodParams = [pId, amount];
    send({ method, methodParams, callbacks });
};
