import { BigNumber } from "ethers";
import { SendParams } from "../../../hooks/useTransaction";
import { RanceProtocol } from "../../../typechain";

interface IinsureParams {
    contract: RanceProtocol;
    planId: string;
    amount: BigNumber;
    path: string[];
    insureCoin: string;
    paymentToken: string;
    send: (params: SendParams) => Promise<void>;
    callbacks: { [key: string]: (errorMessage?: string) => void };
}

export const insure = async (params: IinsureParams): Promise<void> => {
    const {
        contract,
        planId,
        amount,
        path,
        insureCoin,
        paymentToken,
        send,
        callbacks,
    } = params;
    const method = contract.insure;
    const methodParams = [planId, amount, path, insureCoin, paymentToken];
    await send({ method, methodParams, callbacks });
};
