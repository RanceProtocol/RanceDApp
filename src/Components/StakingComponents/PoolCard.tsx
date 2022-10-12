import styles from "./poolCard.module.css";
import { FC, Fragment, useState } from "react";
import Image from "next/image";
import { AiOutlineInfoCircle } from "react-icons/ai";
import clsx from "clsx";
import StakingModal from "../StakingModal";
import type { IStakingPool } from "../../modules/staking/domain/entities";
import { BigNumber, utils } from "ethers";
import { useWeb3React } from "@web3-react/core";
import { toggleWalletModal } from "../../appState/shared/action";
import { useDispatch } from "react-redux";
import CustomToast, { STATUS, TYPE } from "../CustomToast";
import { toast } from "react-toastify";
import { truncateString } from "../../utils/helpers";
import ReactTooltip from "react-tooltip";

interface IProps extends IStakingPool {
    ranceBalance: BigNumber;
    stake: (
        stakingAddress: string,
        pId: number,
        amount: BigNumber,
        callbacks: { [key: string]: (errorMessage?: string) => void }
    ) => void;
    harvest: (
        stakingAddress: string,
        pId: number,
        callbacks: {
            [key: string]: (errorMessage?: string | undefined) => void;
        }
    ) => void;
    unstake: (
        stakingAddress: string,
        pId: number,
        amount: BigNumber,
        callbacks: {
            [key: string]: (errorMessage?: string | undefined) => void;
        }
    ) => void;
}

const PoolCard: FC<IProps> = (props) => {
    const {
        id,
        apr,
        contractAddress,
        rewardTokenAddress,
        rewardTokenDecimals,
        rewardTokenSymbol,
        rewardTokenPrice,
        stakeTokenSymbol,
        stakeTokenAddress,
        stakeTokenDecimals,
        stakeTokenPrice,
        potentialEarnings,
        totalStaked,
        userEarned,
        userStaked,
        ranceBalance,
        stake,
        harvest,
        unstake,
    } = props;

    const [modalState, setModalState] = useState<{
        open: boolean;
        action: "staking" | "unstaking";
    }>({ open: false, action: "staking" });
    const { account } = useWeb3React();

    const dispatch = useDispatch();

    const harvestHandler = () => {
        if (!userEarned?.gt(0)) {
            const toastBody = CustomToast({
                message: `You have no earnings to harvest in the ${stakeTokenSymbol}/${rewardTokenSymbol} pool`,
                status: STATUS.ERROR,
                type: TYPE.ERROR,
            });
            return toast(toastBody);
        }
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `Harvesting the earnings in the ${stakeTokenSymbol}/${rewardTokenSymbol} pool`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
            },
            successfull: async () => {
                const toastBody = CustomToast({
                    message: `Successfully harvested your earnings in ${stakeTokenSymbol}/${rewardTokenSymbol} pool`,
                    status: STATUS.SUCCESSFULL,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "Error harvesting earnings",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
            },
        };

        harvest(contractAddress, id, callbacks);
    };

    const tringerActionModal = (action: "staking" | "unstaking") => {
        setModalState({ open: true, action });
    };

    return (
        <Fragment>
            <div className={styles.root}>
                <div className={styles.tokens__logos__container}>
                    <div className={styles.token__logo}>
                        <Image
                            src="/token-icons/RANCE.png"
                            alt="RANCE logo"
                            layout="fill"
                        />
                    </div>
                    <div className={styles.token__logo}>
                        <Image
                            src={`/token-icons/${rewardTokenSymbol}.png`}
                            alt={`${rewardTokenSymbol} logo`}
                            layout="fill"
                        />
                    </div>
                </div>

                <h2
                    className={styles.pool__tokens}
                >{`${stakeTokenSymbol} - ${rewardTokenSymbol}`}</h2>
                <p
                    className={styles.pool__description}
                >{`Stake ${stakeTokenSymbol}, Earn ${rewardTokenSymbol}`}</p>

                <div className={styles.apr}>
                    <span className={styles.apr__text}>{`${apr}% APR`}</span>
                    <AiOutlineInfoCircle
                        className={styles.info__icon}
                        data-tip="The rewards from this pool doesn't auto-compound, so we show APR."
                    />
                </div>

                {account && userEarned !== undefined && (
                    <div className={styles.user__details}>
                        <div className={styles.key__values}>
                            <span className={styles.key}>Earnings</span>
                            <span className={styles.value}>
                                {`${Number(
                                    utils.formatUnits(
                                        userEarned!,
                                        rewardTokenDecimals
                                    )
                                ).toFixed(1)}`}{" "}
                                <span className={styles.dollar__value}>{`~$${(
                                    Number(
                                        utils.formatUnits(
                                            userEarned!,
                                            rewardTokenDecimals
                                        )
                                    ) * rewardTokenPrice
                                ).toFixed(1)}`}</span>
                            </span>
                        </div>

                        <div className={styles.key__values}>
                            <span className={styles.key}>Stake</span>
                            <span className={styles.value}>
                                {`${Number(
                                    utils.formatUnits(
                                        userStaked!,
                                        stakeTokenDecimals
                                    )
                                ).toFixed(1)}`}{" "}
                                <span className={styles.dollar__value}>{`~$${(
                                    Number(
                                        utils.formatUnits(
                                            userStaked!,
                                            stakeTokenDecimals
                                        )
                                    ) * stakeTokenPrice
                                ).toFixed(1)}`}</span>
                            </span>
                        </div>
                    </div>
                )}

                <div className={styles.pool__details}>
                    <div className={styles.key__values}>
                        <span className={styles.key}>Potential earnings</span>
                        <span className={styles.value}>
                            {`${Number(
                                utils.formatUnits(
                                    potentialEarnings,
                                    rewardTokenDecimals
                                )
                            ).toFixed(1)}`}{" "}
                            <span className={styles.dollar__value}>{`~$${(
                                Number(
                                    utils.formatUnits(
                                        potentialEarnings,
                                        rewardTokenDecimals
                                    )
                                ) * rewardTokenPrice
                            ).toFixed(1)}`}</span>
                        </span>
                    </div>

                    <div className={styles.key__values}>
                        <span className={styles.key}>Total Staked</span>
                        <span className={styles.value}>
                            {`${Number(
                                utils.formatUnits(
                                    totalStaked,
                                    stakeTokenDecimals
                                )
                            ).toFixed(1)}`}{" "}
                            <span className={styles.dollar__value}>{`~$${(
                                Number(
                                    utils.formatUnits(
                                        totalStaked,
                                        stakeTokenDecimals
                                    )
                                ) * stakeTokenPrice
                            ).toFixed(1)}`}</span>
                        </span>
                    </div>
                </div>

                {!account ? (
                    <button
                        className={clsx(styles.btn, styles.btn__solid)}
                        onClick={() => toggleWalletModal(dispatch)}
                    >
                        Connect wallet
                    </button>
                ) : (
                    <div className={styles.btn__group}>
                        <button
                            className={clsx(
                                styles.btn__small,
                                styles.btn__solid
                            )}
                            onClick={() => tringerActionModal("staking")}
                        >
                            Stake
                        </button>
                        <button
                            className={clsx(
                                styles.btn__small,
                                styles.btn__solid2
                            )}
                            onClick={() => tringerActionModal("unstaking")}
                            disabled={!userStaked}
                        >
                            Unstake
                        </button>
                        <button
                            className={clsx(
                                styles.btn__small,
                                styles.btn__hollow
                            )}
                            onClick={harvestHandler}
                        >
                            Harvest
                        </button>
                    </div>
                )}

                <a
                    className={styles.contract__link}
                    href={`https://cronoscan.com/address/${contractAddress}`}
                    target="_blank"
                    rel="noreferrer"
                >
                    view contract
                </a>
            </div>
            <ReactTooltip
                place="top"
                type="dark"
                effect="solid"
                className={styles.tooltip}
                clickable={true}
            />

            {account && (
                <StakingModal
                    open={modalState.open}
                    action={modalState.action}
                    onClose={() =>
                        setModalState((prev) => ({ ...prev, open: false }))
                    }
                    rewardTokenSymbol={rewardTokenSymbol}
                    stakeTokenSymbol={stakeTokenSymbol}
                    poolId={id}
                    rewardTokenAddress={rewardTokenAddress}
                    stakeTokenAddress={stakeTokenAddress}
                    ranceBalance={ranceBalance}
                    userStake={userStaked}
                    stake={stake}
                    unstake={unstake}
                    contractAddress={contractAddress}
                />
            )}
        </Fragment>
    );
};

export default PoolCard;
