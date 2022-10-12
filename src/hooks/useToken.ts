import { useWeb3React } from "@web3-react/core";
import { BigNumber } from "ethers";
import { useEffect, useState } from "react";
import { Erc20__factory } from "../typechain";
import { watchEvent } from "../utils/events";
import { getDefaultProvider } from "../wallet/utils";
import useTransaction from "./useTransaction";

const useToken = (address: string) => {
    const { library, active, account } = useWeb3React();
    const [balance, setBalance] = useState(BigNumber.from(0));
    const [allowances, setAllowance] = useState<{[key:string]:BigNumber}>({});
    const [symbol, setSymbol] = useState("");
    const [decimals, setDecimals] = useState(18);

    const contract = Erc20__factory.connect(
        address,
        library?.getSigner() || getDefaultProvider()
    );
    const { send } = useTransaction();

    const getSymbol = async () => {
        if (symbol !== "") return symbol;
        try {
            const result = await contract.symbol();
            setSymbol(result);
            return result;
        } catch (error: any) {
            console.error(error);
        }
    };

    const getDecimals = async () => {
        if (decimals !== 0) return decimals;
        try {
            const result = await contract.decimals();
            setDecimals(result);
            return result;
        } catch (error: any) {
            console.error(error);
        }
    };

    const getBalance = async () => {
        if (!active || !account) {
            throw new Error("Please connect your wallet");
        }

        try {
            const result = await contract.balanceOf(account);
            setBalance(result);
            return result;
        } catch (error: any) {
            console.error(error);
        }
    };

    const approve = async (
        spender: string,
        amount: string | BigNumber,
        callbacks?: { [key: string]: () => void }
    ): Promise<void> => {
        if (!active || !account) {
            throw new Error("Please connect your wallet");
        }
        try {
            const method = contract.approve;
            const methodParams = [spender, amount];
            await send({ method, methodParams, callbacks });
        } catch (error: any) {
            console.error(error);
        }
    };

    const getAllowance = async (spender: string) => {
        if (!active || !account) {
            throw new Error("Please connect your wallet");
        }
        try {
            const result = await contract.allowance(account, spender);
            setAllowance((allowances) => ({
                ...allowances,
                [spender]: result,
            }));
            return result;
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        if (!active || !contract) return;
        (async () => {
            await getDecimals();
            getBalance();
        })();

        //events
        watchEvent(
            contract,
            "Transfer",
            [account],
            (from, to, value, event) => {
                getBalance();
            }
        );
        watchEvent(
            contract,
            "Approval",
            [account],
            (owner, spender, value, event) => {
                getAllowance(spender);
            }
        );
        watchEvent(
            contract,
            "Transfer",
            [null, account],
            (from, to, value, event) => {
                getBalance();
            }
        );

        return () => {
            if (!active || !contract) return;
            contract.removeAllListeners();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, address]);

    return {
        getSymbol,
        getBalance,
        decimals,
        getAllowance,
        allowances,
        approve,
        balance,
        symbol,
    };
};

export default useToken;
