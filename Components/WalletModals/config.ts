import { walletStrings } from "../../wallet/constant";
import {
    BitKeep,
    Metamask,
    SafePal,
    TrustWallet,
    WalletConnect,
} from "../svgIcons";

export const walletConfig = [
    {
        title: "Metamask",
        icon: Metamask,
        walletName: walletStrings.metamask,
    },
    {
        title: "Bitkeep",
        icon: BitKeep,
        walletName: walletStrings.bitkeep,
    },
    {
        title: "Trustwallet",
        icon: TrustWallet,
        walletName: walletStrings.trustwallet,
    },
    {
        title: "Safepal",
        icon: SafePal,
        walletName: walletStrings.safepal,
    },
    {
        title: "WalletConnect",
        icon: WalletConnect,
        walletName: walletStrings.walletconnect,
    },
];
