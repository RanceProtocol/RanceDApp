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
    referrer?: string;
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
        referrer,
        send,
        callbacks,
    } = params;
    const method = referrer ? contract.insureWithReferrer : contract.insure;
    const methodParams = referrer
        ? [planId, amount, path, insureCoin, paymentToken, referrer]
        : [planId, amount, path, insureCoin, paymentToken];
    await send({ method, methodParams, callbacks });
};
