import { BigNumber } from "ethers";
import useTransaction, { SendParams } from "../../../hooks/useTransaction";
import { Staking1, Staking2 } from "../../../typechain";

interface StakeParams {
    contract: Staking1 | Staking2;
    pId: number;
    amount: BigNumber;
    send: (params: SendParams) => Promise<void>;
    callbacks?: { [key: string]: () => void };
}
export const stake = (params: StakeParams) => {
    const { contract, pId, callbacks, send, amount } = params;
    const method = contract.deposit;
    const methodParams = [pId, amount];
    send({ method, methodParams, callbacks });
};
