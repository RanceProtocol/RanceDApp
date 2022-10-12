import { SendParams } from "../../../hooks/useTransaction";
import { Staking1, Staking2 } from "../../../typechain";

interface HarvestParams {
    contract: Staking1 | Staking2;
    pId: number;
    send: (params: SendParams) => Promise<void>;
    callbacks?: { [key: string]: () => void };
}

export const harvest = (params: HarvestParams) => {
    const { contract, pId, send, callbacks } = params;
    const method = contract.withdraw;
    const methodParams = [pId, 0];
    send({ method, methodParams, callbacks });
};
