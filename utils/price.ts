import axios from "axios";
import { BigNumber, ethers, utils } from "ethers";
import { AUTOSHARK_ADDRESSES, tokens } from "../constants/addresses";
import { AutoSharkRouter__factory, Erc20, Erc20__factory } from "../typechain";
import { getCurrentTimestamp, getDateFromTimstamp } from "./time";

export const getCoinPriceDataSinceInsured = async (
    coin_id: string,
    insuredStartTimestamp: number
): Promise<{ priceChange: string; sparklineData: number[] }> => {
    const currentTimestamp = await getCurrentTimestamp();
    if (!currentTimestamp)
        return { priceChange: "0%", sparklineData: new Array(2).fill(0) };
    const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin_id}/market_chart/range?vs_currency=usd&from=${insuredStartTimestamp}&to=${currentTimestamp}`
    );

    if (!res?.data?.prices || res?.data?.prices.length < 2) {
        console.log("no price change data data yet");
        return { priceChange: "0%", sparklineData: new Array(2).fill(0) };
    }

    const difference =
        res.data.prices[res.data.prices.length - 1][1] - res.data.prices[0][1];
    const percentageChange = (difference / res.data.prices[0][1]) * 100;

    const priceChange =
        Math.max(0, percentageChange) === 0
            ? `${percentageChange.toFixed(2)}%`
            : `+${percentageChange.toFixed(2)}%`;

    const sparklineData = res.data.prices.map(
        (priceArr: number[]) => priceArr[1]
    );

    return { priceChange, sparklineData };
};

const AutosharkRouter = (provider: ethers.providers.Provider | ethers.Signer) =>
    AutoSharkRouter__factory.connect(AUTOSHARK_ADDRESSES, provider);

const getPriceWithAutosharkRouter = async (
    path: string[],
    provider: ethers.providers.Provider | ethers.Signer
): Promise<number> => {
    const router = AutosharkRouter(provider);
    const amounts = await router.getAmountsOut(utils.parseEther("1"), path);
    const token: Erc20 = Erc20__factory.connect(
        path[path.length - 1],
        provider
    );
    const decimals = await token.decimals();

    return Number(utils.formatUnits(amounts[amounts.length - 1], decimals));
};

export const getRANCEPrice = async (
    provider: ethers.providers.Provider | ethers.Signer
): Promise<number> => {
    const path = [
        tokens[process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens]
            .RANCE,
        tokens[process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens]
            .MUSD,
    ];
    try {
        const price = await getPriceWithAutosharkRouter(path, provider);
        return price;
    } catch (error) {
        console.error(error);
        return 1;
    }
};
