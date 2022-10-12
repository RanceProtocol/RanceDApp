import { utils } from "ethers";
interface IVerifySignatureParams {
    signature: string;
    message: string;
    signerAddress: string;
}
export const verifySignature = (params: IVerifySignatureParams): boolean => {
    try {
        const { message, signature, signerAddress } = params;
        const signer = utils.verifyMessage(message, signature);
        return signer.toLowerCase() === signerAddress.toLowerCase();
    } catch (error) {
        const err = {
            message: "Signature verification failed",
        };
        throw err;
    }
};

interface IGetSignatureSignerParams {
    signature: string;
    message: string;
}

export const getSignatureSigner = (
    params: IGetSignatureSignerParams
): string => {
    try {
        const { message, signature } = params;
        const signer = utils.verifyMessage(message, signature);
        return signer;
    } catch (error) {
        const err = {
            message: "Signature verification failed",
        };
        throw err;
    }
};
