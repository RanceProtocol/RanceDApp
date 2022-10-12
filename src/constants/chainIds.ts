export const supportedChainIds = {
    Mainnet: 25,
    // Testnet: 338,
  }

  export const getSupportedChainsName = (chainId: number):string => {
    switch (chainId) {
      case 25:
        return "Cronos Mainnet Beta"
      case 338:
        return "Cronos Testnet"
      default:
        return "Cronos Mainnet Beta"
    }
  }