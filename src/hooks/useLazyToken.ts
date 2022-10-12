import { useWeb3React } from '@web3-react/core';
import { BigNumber } from 'ethers';
import React, { useCallback } from 'react'
import { Erc20__factory } from '../typechain';
import { getDefaultProvider } from '../wallet/utils';
import useTransaction from './useTransaction';

const useLazyToken = () => {
    const { library, active, account } = useWeb3React();
    const { send } = useTransaction();

    const initContract = (tokenAddress: string) => {
        return Erc20__factory.connect(
            tokenAddress,
            library?.getSigner() || getDefaultProvider()
        );
    }

    const getBalance = useCallback(async (tokenAddress: string):Promise<BigNumber> => {
        if (!active || !account) throw new Error("Please connect your wallet");
        const contract = initContract(tokenAddress)
        try {
            return await contract.balanceOf(account)
        } catch (error: any) {
            throw new Error(error);
        }
    }, [account, active, initContract])

    const getAllowance = useCallback(async (tokenAddress: string, spender: string):Promise<BigNumber> => {
        if (!active || !account) throw new Error("Please connect your wallet");
        const contract = initContract(tokenAddress)
        try {
            return await contract.allowance(account, spender)
        } catch (error: any) {
            throw new Error(error);
            
        }
    },[account, active, initContract])

    const getSymbol = useCallback(async (tokenAddress: string):Promise<string> => {
        const contract = initContract(tokenAddress)
        try {
            return await contract.symbol()
        } catch (error: any) {
            throw new Error(error);
            
        }
    }, [initContract])

    const getDecimal = useCallback(async (tokenAddress: string):Promise<number> => {
        const contract = initContract(tokenAddress)
        try {
            return await contract.decimals()
        } catch (error: any) {
            throw new Error(error);
            
        }
    }, [initContract])

    const approve = useCallback(async (tokenAddress: string, spender: string, amount: BigNumber, callbacks?: {[key:string]: (errorMessage?: string) => void}):Promise<void> => {
        if (!active || !account) throw new Error("Please connect your wallet");
        const contract = initContract(tokenAddress)
        try {
            const method = contract.approve
            const methodParams = [spender, amount]
            await send({method, methodParams, callbacks})
        } catch (error: any) {
            throw new Error(error);
        }
    }, [account, active, initContract])

    return {getAllowance, getBalance, getDecimal, getSymbol, approve}
}

export default useLazyToken