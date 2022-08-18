import { SendParams } from "../../../hooks/useTransaction";
import { RanceProtocol } from "../../../typechain";

interface ICancelParams {
    contract: RanceProtocol;
    packageId: string;
    send: (params: SendParams) => Promise<void>;
    callbacks: { [key: string]: (errorMessage?: string) => void };
}

export const cancelInsurance = async (params: ICancelParams): Promise<void> => {
    const { packageId, contract, send, callbacks } = params;
    const method = contract.cancel;
    const methodParams = [packageId];
    await send({ method, methodParams, callbacks });
};
