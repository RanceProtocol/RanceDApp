import { AbstractConnector } from "@web3-react/abstract-connector";
import { ethers } from "ethers";
import { hexlify, toUtf8Bytes } from "ethers/lib/utils";
import { toast } from "react-toastify";
import CustomToast, { STATUS, TYPE } from "../Components/CustomToast";

export interface IParams {
    library: any;
    connector: AbstractConnector | undefined;
    account: string;
}

const useSignature = (params: IParams) => {
    const { library, connector, account } = params;
    const sign = async (message: string): Promise<string> => {
        try {
            // if (window.BinanceChain && !!connector && connector instanceof BscConnector) {
            //   const { signature } = await window.BinanceChain.bnbSign(account, message)
            //   return signature
            // }

            /**
             * Wallet Connect does not sign the message correctly unless you use their method
             * @see https://github.com/WalletConnect/walletconnect-monorepo/issues/462
             */
            // @ts-ignore
            if (library.provider?.wc) {
                const wcMessage = hexlify(toUtf8Bytes(message));
                // @ts-ignore
                const signature =
                    await library.provider?.wc.signPersonalMessage([
                        wcMessage,
                        account,
                    ]);
                return signature;
            }

            return library.getSigner(account).signMessage(message);
        } catch (error: any) {
            const toastBody = CustomToast({
                message: error.message,
                status: STATUS.ERROR,
                type: TYPE.ERROR,
            });
            toast(toastBody);
            throw error;
        }
    };

    return { sign };
};

export default useSignature;
