import {
    UniswapPair,
    UniswapVersion,
    UniswapPairSettings,
    TradeDirection,
} from "simple-uniswap-sdk";
import { constants } from "ethers";

interface Params {
    fromTokenContractAddress: string;
    toTokenContractAddress: string;
    amount: string;
    provider: any;
}

export const findBestRoute = async (
    params: Params
): Promise<{ path: string[]; expectedOutput: string }> => {
    const {
        fromTokenContractAddress,
        toTokenContractAddress,
        amount,
        provider,
    } = params;

    const cloneUniswapContractDetails = {
        v2Override: {
            routerAddress: "0x145677FC4d9b8F19B5D56d1820c48e0443049a30",
            factoryAddress: "0xd590cC180601AEcD6eeADD9B7f2B7611519544f4",
            pairAddress: "0xd590cC180601AEcD6eeADD9B7f2B7611519544f4",
        },
    };

    const uniswapPair = new UniswapPair({
        fromTokenContractAddress,
        toTokenContractAddress,
        ethereumAddress: constants.AddressZero,
        ethereumProvider: provider,
        settings: new UniswapPairSettings({
            slippage: 0.001,
            deadlineMinutes: 20,
            disableMultihops: false,
            uniswapVersions: [UniswapVersion.v2],
            cloneUniswapContractDetails: cloneUniswapContractDetails,
            customNetwork: {
                nameNetwork: "Cronos Mainnet Beta",
                multicallContractAddress:
                    "0x5e954f5972EC6BFc7dECd75779F10d848230345F",
                nativeCurrency: {
                    name: "cro",
                    symbol: "CRO",
                },
                nativeWrappedTokenInfo: {
                    chainId: 25,
                    contractAddress:
                        "0x5C7F8A570d578ED84E63fdFA7b1eE72dEae1AE23",
                    decimals: 18,
                    symbol: "WCRO",
                    name: "Wrapped CRO",
                },
                baseTokens: {
                    dai: {
                        chainId: 25,
                        contractAddress:
                            "0x97749c9B61F878a880DfE312d2594AE07AEd7656",
                        decimals: 18,
                        symbol: "MMF",
                        name: "MMF",
                    },
                },
            },
        }),
    });

    try {
        const uniswapPairFactory = await uniswapPair.createFactory();
        const result = await uniswapPairFactory.findBestRoute(
            amount,
            TradeDirection.input
        );
        console.log(result.bestRouteQuote);

        return {
            path: result.bestRouteQuote.routePathArray,
            expectedOutput:
                result.bestRouteQuote
                    .expectedConvertQuoteOrTokenAmountInMaxWithSlippage,
        };
    } catch (error) {
        console.log("error: ", error);
        throw error;
    }
};
