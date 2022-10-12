import { Web3Provider } from "@ethersproject/providers";
import { UnsupportedChainIdError } from "@web3-react/core";
import { ethers } from "ethers";
import { explorers } from "../constants/explorers";
import { RPC_URLS } from "../constants/rpcUrls";
import { chainIdToName, getChainId } from "../utils/helpers";
import {
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from "@web3-react/injected-connector";
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from "@web3-react/walletconnect-connector";

export const setupNetwork = async (
    provider: ethers.providers.ExternalProvider
): Promise<boolean> => {
    if (!provider.request) return false;
    const chainId = getChainId();
    try {
        await provider?.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
        return true;
    } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask.
        if (switchError?.code === 4902 || switchError?.code === -32603) {
            try {
                await provider?.request({
                    method: "wallet_addEthereumChain",
                    params: [
                        {
                            chainId: `0x${chainId.toString(16)}`,
                            chainName: chainIdToName[chainId],
                            rpcUrls: [RPC_URLS[chainId]],
                            blockExplorerUrls: [explorers[chainId]],
                            nativeCurrency: {
                                name: "Binance Coin",
                                symbol: "BNB", // 2-6 characters long
                                decimals: 18,
                            },
                        },
                    ],
                });
                return true;
            } catch (addError: any) {
                if (addError?.code === 4001) {
                    throw new Error("User rejected the request to add network");
                }
                console.error(addError);
                return false;
            }
        }
        if (switchError?.code === 4001) {
            throw new Error("User rejected the request to switch network");
        }
        console.error(switchError);
        return false;
    }
};

export const getLibrary = (provider: any): Web3Provider => {
    const library = new Web3Provider(provider);
    // library.pollingInterval = 12000
    return library;
};

export const getDefaultProvider = () => {
    return new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT === "mainnet" ||
        process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT === "staging"
            ? RPC_URLS[25]
            : RPC_URLS[338]
    );
};

export const getConnectionError = (err: any): string => {
    if (err instanceof NoEthereumProviderError)
        return "Non-Ethereum enabled browser detected, install MetaMask extension on desktop, or connect with walletConnect or visit from a DApp browser on mobile wallet";
    else if (err instanceof UnsupportedChainIdError) {
        const chainName = chainIdToName[getChainId()];
        return `You're connected to an unsupported network. switch to ${chainName}`;
    } else if (
        err instanceof UserRejectedRequestErrorInjected ||
        err instanceof UserRejectedRequestErrorWalletConnect
    )
        return "Please authorize your wallet connection to this DApp";
    else console.error("wallet connection error", err);
    return "An unknown error occured";
};
