import { BigNumber } from "ethers";
import { stakingAddressToPool, tokens } from "../../../constants/addresses";
import { Erc20__factory, Staking1, Staking2 } from "../../../typechain";
import { structOutputToObject } from "../../../utils/helpers";
import { getRANCEPrice } from "../../../utils/price";
import { IStakingPool } from "../domain/entities";

export const initializeStakingPools = async (
    contract1: Staking1,
    contract2: Staking2,
    userAddress: string | null | undefined
): Promise<IStakingPool[]> => {
    const pool1 = await getstakingContract1Pools(contract1, userAddress);
    const pool2 = await getstakingContract2Pools(contract2, userAddress);
    return [pool1, pool2];
};

const getstakingContract1Pools = async (
    contract: Staking1,
    userAddress: string | null | undefined
): Promise<IStakingPool> => {
    const contractAddress = contract.address;
    const totalAllocPoint = Number(await contract.totalAllocPoint());

    const rancePrice = await getRANCEPrice(contract.provider);

    const poolInfo = structOutputToObject(
        await contract.poolInfo(stakingAddressToPool[contract.address])
    );

    const stakeToken = Erc20__factory.connect(
        poolInfo.lpToken,
        contract.provider
    );
    const stakeTokenDecimals = await stakeToken.decimals();
    const totalStaked = await stakeToken.balanceOf(contract.address);
    const rewardToken = Erc20__factory.connect(
        tokens[process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens]
            .RANCE,
        contract.provider
    );
    const rewardTokenDecimals = await rewardToken.decimals();
    const rewardTokenSymbol = await rewardToken.symbol();
    const rancePerBlock = (await contract.RANCEPerBlock()).mul(
        await contract.BONUS_MULTIPLIER()
    );
    const totalRANCEPerYr = rancePerBlock.mul(17280).mul(365);
    const poolRANCEPerYr = (poolInfo.allocPoint as BigNumber).mul(
        totalRANCEPerYr
    );
    const numerator = poolRANCEPerYr.mul(100);
    const denominator = totalStaked.mul(totalAllocPoint);
    const apr = denominator.eq(0)
        ? BigNumber.from(0)
        : numerator.div(denominator);

    const pool: IStakingPool = {
        id: stakingAddressToPool[contract.address],
        contractAddress,
        stakeTokenSymbol: "RANCE",
        stakeTokenAddress: poolInfo.lpToken,
        rewardTokenAddress:
            tokens[
                process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens
            ].RANCE,
        rewardTokenSymbol,
        apr,
        totalStaked,
        totalEarned: BigNumber.from(0),
        stakeTokenDecimals,
        rewardTokenDecimals,
        stakeTokenPrice: rancePrice,
        rewardTokenPrice: rancePrice,
    };

    if (userAddress) {
        pool.userStaked = (
            await contract.userInfo(
                stakingAddressToPool[contract.address],
                userAddress
            )
        ).amount;
        pool.userEarned = await contract.pendingRANCE(
            stakingAddressToPool[contract.address],
            userAddress
        );
    }

    return pool;
};

const getstakingContract2Pools = async (
    contract: Staking2,
    userAddress: string | null | undefined
): Promise<IStakingPool> => {
    const contractAddress = contract.address;
    const totalAllocPoint = Number(await contract.totalAllocPoint());
    const rancePrice = await getRANCEPrice(contract.provider);
    const poolInfo = structOutputToObject(
        await contract.poolInfo(stakingAddressToPool[contract.address])
    );
    const stakeToken = Erc20__factory.connect(
        poolInfo.lpToken,
        contract.provider
    );
    const stakeTokenDecimals = await stakeToken.decimals();
    const totalStaked = await stakeToken.balanceOf(contract.address);
    const rewardToken = Erc20__factory.connect(
        tokens[process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens]
            .MUSD,
        contract.provider
    );
    const rewardTokenDecimals = await rewardToken.decimals();
    const rewardTokenSymbol = await rewardToken.symbol();
    const musdPerBlock = (await contract.MUSDPerBlock()).mul(
        await contract.BONUS_MULTIPLIER()
    );
    const totalMUSDPerYr = musdPerBlock.mul(17280).mul(365);
    const poolMUSDPerYr = (poolInfo.allocPoint as BigNumber).mul(
        totalMUSDPerYr
    );
    const numerator = poolMUSDPerYr.mul(100);
    const denominator = totalStaked.mul(totalAllocPoint);
    const apr = denominator.eq(0)
        ? BigNumber.from(0)
        : numerator.div(denominator);

    const pool: IStakingPool = {
        id: stakingAddressToPool[contract.address],
        contractAddress,
        stakeTokenSymbol: "RANCE",
        stakeTokenAddress: poolInfo.lpToken,
        rewardTokenAddress:
            tokens[
                process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens
            ].MUSD,
        rewardTokenSymbol,
        apr,
        totalStaked,
        totalEarned: BigNumber.from(0),
        stakeTokenDecimals,
        rewardTokenDecimals,
        stakeTokenPrice: rancePrice,
        rewardTokenPrice: 1, //MUSD is equivilent to $
    };

    if (userAddress) {
        pool.userStaked = (
            await contract.userInfo(
                stakingAddressToPool[contract.address],
                userAddress
            )
        ).amount;
        pool.userEarned = await contract.pendingMUSD(
            stakingAddressToPool[contract.address],
            userAddress
        );
    }

    return pool;
};
