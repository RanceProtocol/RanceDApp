import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/staking.module.css";
import PoolCard from "../Components/StakingComponents/PoolCard";
// import type { IStakingPool } from "../constants/dummyData";
import { useStakingViewModel } from "../modules/staking/controllers/stakingViewModel";
import { useWeb3React } from "@web3-react/core";
import { useEffect } from "react";
import { IStakingPool } from "../modules/staking/domain/entities";
import { stakingState } from "../modules/staking/ui/redux/state";
import EarningCard from "../Components/StakingComponents/EarningCard";
import PoolCardSkeleton from "../Components/StakingComponents/PoolCardSkeleton";
import EarningSectionSkeleton from "../Components/StakingComponents/EarningSectionSkeleton";
import useToken from "../hooks/useToken";
import { tokens } from "../constants/addresses";

const Staking: NextPage = () => {
    const { account, library } = useWeb3React();

    const { initializeStakingPools, stake, harvest, unstake } =
        useStakingViewModel({
            address: account,
            provider: library,
        });

    const { loadingPools, pools, loadingUserEarnings } = stakingState();

    useEffect(() => {
        (async () => {
            initializeStakingPools();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    const RANCE = useToken(
        tokens[process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens]
            .RANCE
    );

    return (
        <div className={styles.container}>
            <Head>
                <title>Rance Protocol - Staking</title>
            </Head>
            <main className={styles.main}>
                <div className={styles.banner}>
                    <div className={styles.banner__container}>
                        <h1 className={styles.banner__header}>
                            Stake RANCE to earn RANCE or USD
                        </h1>
                        <p className={styles.banner__text}>
                            Staking is a way of earning interest on your RANCE
                            token by depositing it for a fixed period of time
                        </p>
                    </div>
                    <div className={styles.banner__image__container}>
                        <Image
                            src="/staking-banner-image.png"
                            alt="staking page banner"
                            layout="fill"
                            className={styles.banner__image}
                        />
                    </div>
                </div>

                <div className={styles.staking__card__wrapper}>
                    {pools.length !== 0 ? (
                        pools.map((pool: IStakingPool) => (
                            <PoolCard
                                key={pool.id}
                                {...pool}
                                ranceBalance={RANCE.balance}
                                stake={stake}
                                harvest={harvest}
                                unstake={unstake}
                            />
                        ))
                    ) : loadingPools ? (
                        new Array(2)
                            .fill(undefined)
                            .map((item, index) => (
                                <PoolCardSkeleton key={index} />
                            ))
                    ) : (
                        <p className={styles.message}>Could not get pools</p>
                    )}
                </div>

                {account &&
                    (loadingUserEarnings ? (
                        <EarningSectionSkeleton />
                    ) : (
                        pools[0]?.userEarned &&
                        pools[1]?.userEarned && (
                            <div className={styles.earning__section}>
                                <div className={styles.text__section}>
                                    <div className={styles.earning__heading}>
                                        Available Earnings
                                    </div>
                                    <p className={styles.earning__text}>
                                        Accumulated earnings available to
                                        harvest
                                    </p>
                                </div>
                                <div className={styles.cards__section}>
                                    {pools.length !== 0 &&
                                        pools.map((pool: IStakingPool) => (
                                            <EarningCard
                                                key={pool.id}
                                                id={pool.id}
                                                contractAddress={
                                                    pool.contractAddress
                                                }
                                                rewardTokenDecimals={
                                                    pool.rewardTokenDecimals
                                                }
                                                rewardTokenPrice={
                                                    pool.rewardTokenPrice
                                                }
                                                rewardTokenSymbol={
                                                    pool.rewardTokenSymbol
                                                }
                                                userEarned={pool.userEarned}
                                                harvest={harvest}
                                            />
                                        ))}
                                </div>
                            </div>
                        )
                    ))}
            </main>
        </div>
    );
};

export default Staking;
