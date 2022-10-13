import { ethers } from "ethers";

export interface SendParams {
    method: ethers.ContractFunction;
    methodParams?: any[];
    callbacks?: { [key: string]: (message?:string) => void };
}

const useTransaction = () => {
    const send = async (params: SendParams) => {
        const { method, methodParams, callbacks } = params;

        try {
            const txResponse = await method(
                ...(methodParams ? methodParams : []));
            callbacks && callbacks["sent"] && callbacks["sent"]();

            const txReceipt = await txResponse.wait();

            if (txReceipt.status === 1) {
                callbacks &&
                    callbacks["successfull"] &&
                    callbacks["successfull"]();
            } else {
                callbacks && callbacks["failed"] && callbacks["failed"]();
            }
        } catch (error: any) {
            if(error.message) {
                return callbacks && callbacks["failed"] && callbacks["failed"](error.message);
            }
            callbacks && callbacks["failed"] && callbacks["failed"]();
        }
    };

    return {send}
};

export default useTransaction;
