import { SendParams } from "../../../hooks/useTransaction";
import { RanceProtocol } from "../../../typechain";

interface IWithdrawParams {
    contract: RanceProtocol;
    packageId: string;
    send: (params: SendParams) => Promise<void>;
    callbacks: { [key: string]: (errorMessage?: string) => void };
}

export const withdrawInsurance = async (params: IWithdrawParams): Promise<void> => {
    const { packageId, contract, send, callbacks } = params;
    const method = contract.withdraw;
    const methodParams = [packageId];
    await send({ method, methodParams, callbacks });
};
