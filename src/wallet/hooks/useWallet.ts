import { AbstractConnector } from "@web3-react/abstract-connector";
import { bitKeep, injected, walletConnect } from "../connnectors";
import { useWeb3React } from "@web3-react/core";
import {
    getSupportedChainsName,
    supportedChainIds,
} from "../../constants/chainIds";
import { setupNetwork } from "../utils";
import { useCallback, useEffect } from "react";
import CustomToast, { STATUS, TYPE } from "../../Components/CustomToast";
import { toast } from "react-toastify";
import { getChainId } from "../../utils/helpers";
import { walletLocalStorageKey, walletStrings } from "../constant";
import { isMobile, isDesktop } from "react-device-detect";

const useWallet = () => {
    const { activate, deactivate } = useWeb3React();

    const _ethereumListener = async () =>
        new Promise<void>((resolve) =>
            Object.defineProperty(window, "ethereum", {
                get() {
                    return this._eth;
                },
                set(_eth) {
                    this._eth = _eth;

                    resolve();
                },
            })
        );

    const _bitKeepListener = async () =>
        new Promise<void>((resolve) =>
            Object.defineProperty(window, "bitKeep", {
                get() {
                    return this._bitKeep;
                },
                set(_bitKeep) {
                    this._bitKeep = _bitKeep;
                    resolve();
                },
            })
        );

    useEffect(() => {
        const previouslyConnectedWallet = window.localStorage.getItem(
            walletLocalStorageKey
        );
        if (!!previouslyConnectedWallet) {
            if (
                [
                    walletStrings.metamask,
                    walletStrings.trustwallet,
                    walletStrings.safepal,
                ].includes(previouslyConnectedWallet)
            ) {
                const isEthereumDefined = Reflect.has(window, "ethereum");
                // wait until it is injected
                if (!isEthereumDefined) {
                    _ethereumListener().then(() =>
                        connectWallet(previouslyConnectedWallet)
                    );
                    return;
                }
                connectWallet(previouslyConnectedWallet);
            } else {
                if (
                    [walletStrings.bitkeep].includes(previouslyConnectedWallet)
                ) {
                    const isBitkeepDefined = Reflect.has(window, "bitkeep");
                    if (!isBitkeepDefined) {
                        _bitKeepListener().then(() =>
                            connectWallet(previouslyConnectedWallet)
                        );
                        return;
                    }
                    connectWallet(previouslyConnectedWallet);
                }
            }
        } else {
            if (isMobile && Reflect.has(window, "ethereum")) {
                // @ts-ignore
                if (window.ethereum?.isTrustWallet) {
                    connectWallet(walletStrings.trustwallet);
                    // @ts-ignore
                } else if (window.ethereum?.isSafePal) {
                    connectWallet(walletStrings.safepal);
                    // @ts-ignore
                } else if (window.ethereum.isBitKeep) {
                    connectWallet(walletStrings.bitkeep);
                } else connectWallet(walletStrings.metamask);
            }
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const connectWallet = useCallback(
        async (name: string) => {
            let connector: AbstractConnector;
            let walletName = name;
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
            // when user clicks to connect with a DApp browser while on Desktop, use WC
            if (
                (walletName === walletStrings.trustwallet ||
                    walletName === walletStrings.safepal) &&
                isDesktop
            ) {
                connector = walletConnect;
                walletName = walletStrings.walletconnect;
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
                        const hasSetup = await setupNetwork(provider);
                        if (hasSetup) {
                            activate(connector);
                        }
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
                window.localStorage.setItem(walletLocalStorageKey, walletName);
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
        window.localStorage.removeItem(walletLocalStorageKey);
        // This localStorage key is set by @web3-react/walletconnect-connector
        if (window?.localStorage?.getItem("walletconnect")) {
            walletConnect.close();
            walletConnect.walletConnectProvider = null;
        }
    };

    return { connectWallet, disconnectWallet };
};

export default useWallet;
