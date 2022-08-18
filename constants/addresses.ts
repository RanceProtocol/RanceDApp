export const ranceProtocol = {
    staging: "0x080d599F2E2f86Ee7bE68f0d0Dcf352f11950ED4",
    mainnet: "0x48A3D687a79844C2CdBcE66b7Be12919840393F7",
};

export const stakingContractAddresses = {
    staging: [
        "0xB1ad1e8612C228e4A6C9cDed64d8A270157c9455",
        "0x1D17EE3b2eD935305b77D72Ab883D3827bC2E605",
    ],
    mainnet: [
        "0xB1ad1e8612C228e4A6C9cDed64d8A270157c9455",
        "0x1D17EE3b2eD935305b77D72Ab883D3827bC2E605",
    ],
};

export const tokens = {
    mainnet: {
        RANCE: "0x3915513CE08a56e3d9e99E31126AC71d96F61792",
        WBTC: "0x062E66477Faf219F25D27dCED647BF57C3107d52",
        WETH: "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
        WCRO: "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
        MMF: "0x97749c9B61F878a880DfE312d2594AE07AEd7656",
        MUSD: "0x95aEaF383E2e86A47c11CffdE1F7944eCB2C38C2",
        USDC: "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59",
    },
    staging: {
        RANCE: "0xDFe999B28A48BFb5DD674D3899B77fd4fF5CF46c",
        WBTC: "0x378520d445d3379497f991f7fef7E613014c20b2",
        WETH: "0x66963e06Bf63a08E7B23B31406dB4B6F529fcf82",
        CRO: "0x2c1ca1839893b21d9ead72c0bc1d1e05841bfd82",
        MUSD: "0x6cefffe285b0f883ec726f31bff5a188a60fc193",
    },
};

export const stakingAddressToPool: {[key: string]: number} = {
    "0xB1ad1e8612C228e4A6C9cDed64d8A270157c9455": 0, //staging
    "0x1D17EE3b2eD935305b77D72Ab883D3827bC2E605": 1, //staging
};

export const masterRanceWallet = {
    staging: "0x91A8BEF2bEBD46fBD079667DcE72865C1f015df0",
    mainnet: "0x91A8BEF2bEBD46fBD079667DcE72865C1f015df0" // replaced with mainnet wallet later
}

export const AUTOSHARK_ADDRESSES = "0xB0EeB0632bAB15F120735e5838908378936bd484";

// export const tokenAddressToName = Object.fromEntries(
//     Object.entries(tokens).map((entries: string[]) => [entries[1], entries[0]])
// );

export const tokenAddressToName = Object.fromEntries(
    Object.entries(
        tokens[process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens]
    ).map((entries: string[]) => [entries[1], entries[0]])
);
