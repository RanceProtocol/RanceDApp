import { AbstractConnector } from "@web3-react/abstract-connector";
import { bitKeep, injected, walletConnect } from "../connnectors";
import { useWeb3React } from "@web3-react/core";
import {
    getSupportedChainsName,
    supportedChainIds,
} from "../../constants/chainIds";
import { addNetwork, getConnectionError } from "../utils";
import { useCallback, useEffect } from "react";
import CustomToast, { STATUS, TYPE } from "../../Components/CustomToast";
import { toast } from "react-toastify";
import { getChainId } from "../../utils/helpers";
import { walletStrings } from "../constant";

const useWallet = () => {
    const { activate, deactivate } = useWeb3React();

    useEffect(() => {
        setTimeout(() => {
            injected.isAuthorized().then(async (isAuthorized: boolean) => {
                if (
                    isAuthorized &&
                    [
                        walletStrings.metamask,
                        walletStrings.trustwallet,
                        walletStrings.safepal,
                    ].includes(window.localStorage.getItem("wallet") as string)
                ) {
                    try {
                        await activate(injected, undefined, true);
                    } catch (error) {
                        const errorMessage = getConnectionError(error);
                        const body = CustomToast({
                            message: errorMessage,
                            status: STATUS.ERROR,
                            type: TYPE.ERROR,
                        });
                        toast(body);
                    }
                } else {
                    bitKeep
                        .isAuthorized()
                        .then(async (isAuthorized: boolean) => {
                            if (
                                isAuthorized &&
                                [walletStrings.bitkeep].includes(
                                    window.localStorage.getItem(
                                        "wallet"
                                    ) as string
                                )
                            ) {
                                try {
                                    await activate(bitKeep, undefined, true);
                                } catch (error) {
                                    const errorMessage =
                                        getConnectionError(error);
                                    const body = CustomToast({
                                        message: errorMessage,
                                        status: STATUS.ERROR,
                                        type: TYPE.ERROR,
                                    });
                                    toast(body);
                                }
                            }
                        });
                }
            });
        }, 1000);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connectWallet = useCallback(
        async (name: string) => {
            let connector: AbstractConnector;
            const walletName = name;
            const injectedWallets = [
                walletStrings.metamask,
                walletStrings.trustwallet,
                walletStrings.safepal,
            ];
            if (injectedWallets.includes(name)) name = "injected";
            switch (name) {
                case "injected":
                    connector = injected;
                    break;
                case walletStrings.bitkeep:
                    connector = bitKeep;
                    break;
                case walletStrings.walletconnect:
                    connector = walletConnect;
                    break;
                default:
                    return;
            }

            try {
                await activate(connector);
                const chainId = await connector.getChainId();
                const provider = await connector.getProvider();
                if (
                    !Object.values(supportedChainIds).includes(
                        Number(chainId)
                    ) &&
                    (name === "injected" || name === walletStrings.bitkeep)
                ) {
                    try {
                        await addNetwork(provider);
                    } catch (error: any) {
                        const body = CustomToast({
                            message: error?.message,
                            status: STATUS.ERROR,
                            type: TYPE.ERROR,
                        });
                        toast(body);
                    }
                } else if (
                    !Object.values(supportedChainIds).includes(Number(chainId))
                ) {
                    const body = CustomToast({
                        message: `Unsupported network detected! please switch to ${getSupportedChainsName(
                            getChainId()
                        )}`,
                        status: STATUS.ERROR,
                        type: TYPE.ERROR,
                    });
                    toast(body);
                }
                window.localStorage.setItem("wallet", walletName);
            } catch (error: any) {
                console.error(error);
                let body;
                if (error.code === -32002) {
                    body = CustomToast({
                        message: "You have a pending connection request",
                        status: STATUS.ERROR,
                        type: TYPE.ERROR,
                    });
                } else if (error.name === "NoEthereumProviderError") {
                    body = CustomToast({
                        message:
                            "You are not on Ethereum enabled browser, Please use WalletConnect",
                        status: STATUS.ERROR,
                        type: TYPE.ERROR,
                    });
                } else {
                    body = CustomToast({
                        message: error.message,
                        status: STATUS.ERROR,
                        type: TYPE.ERROR,
                    });
                }
                toast(body);
            }
        },
        [activate]
    );

    const disconnectWallet = () => {
        deactivate();
        window.localStorage.removeItem("wallet");
    };

    return { connectWallet, disconnectWallet };
};

export default useWallet;
