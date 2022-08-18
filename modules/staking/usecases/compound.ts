import useTransaction, { SendParams } from "../../../hooks/useTransaction";
import { Staking1 } from "../../../typechain";

interface CompoundParams {
    contract: Staking1;
    send: (params: SendParams) => Promise<void>;
    callbacks?: { [key: string]: () => void };
}

export const compound = (params: CompoundParams) => {
    const { contract, send, callbacks } = params;
    const method = contract.compound;
    send({ method, callbacks });
};
