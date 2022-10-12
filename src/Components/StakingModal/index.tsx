import { BigNumber, utils } from "ethers";
import Image from "next/image";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { toast } from "react-toastify";
import useToken from "../../hooks/useToken";
// import { stake } from "../../modules/staking/usecases/stake";
import { isValidAmountValue, truncateString } from "../../utils/helpers";
import CustomToast, { STATUS, TYPE } from "../CustomToast";
import ModalWrapper from "../ModalWrapper";
import styles from "./styles.module.css";

interface IProps {
    open: boolean;
    action: "staking" | "unstaking";
    poolId: number;
    stakeTokenSymbol: string;
    rewardTokenSymbol: string;
    ranceBalance: BigNumber;
    userStake?: BigNumber;
    rewardTokenAddress: string;
    stakeTokenAddress: string;
    contractAddress: string;
    stake: (
        stakingAddress: string,
        pId: number,
        amount: BigNumber,
        callbacks: { [key: string]: (errorMessage?: string) => void }
    ) => void;
    unstake: (
        stakingAddress: string,
        pId: number,
        amount: BigNumber,
        callbacks: {
            [key: string]: (errorMessage?: string | undefined) => void;
        }
    ) => void;
    onClose: () => void;
}

const StakingModal: FC<IProps> = ({
    open,
    action,
    onClose,
    stakeTokenSymbol,
    rewardTokenSymbol,
    poolId,
    ranceBalance,
    userStake,
    contractAddress,
    stakeTokenAddress,
    stake,
    unstake,
}) => {
    const { allowances, getAllowance, approve } = useToken(stakeTokenAddress);

    useEffect(() => {
        (async () => {
            getAllowance(contractAddress);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const [amount, setAmount] = useState<string>("");
    const [sendingTx, setSendingTx] = useState<boolean>(false);

    const handleAmountChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!isValidAmountValue(event.target.value))
            return event.preventDefault();

        setAmount(event.target.value);
    };

    const onAfterCloseHandler = () => {
        setAmount("");
    };

    const stakeHandler = () => {
        if (amount === "0") return;
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `staking ${amount} RANCE in ${stakeTokenSymbol}/${rewardTokenSymbol} pool`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                const toastBody = CustomToast({
                    message: `Successfully staked ${amount} RANCE in ${stakeTokenSymbol}/${rewardTokenSymbol} pool`,
                    status: STATUS.SUCCESSFULL,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
                onClose();
            },
            failed: (errorMessage?: string) => {
                setSendingTx(false);
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "Error staking tokens",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
            },
        };

        stake(contractAddress, poolId, utils.parseEther(amount), callbacks);
    };

    const handleMaxClick = () => {
        if (action === "staking") {
            setAmount(utils.formatEther(ranceBalance));
        } else if (action === "unstaking") {
            setAmount(utils.formatEther(userStake as BigNumber));
        }
    };

    const unstakeHandler = () => {
        if (Number(amount) <= 0) {
            const toastBody = CustomToast({
                message: "You cannot unstake 0 RANCE",
                status: STATUS.ERROR,
                type: TYPE.ERROR,
            });
            return toast(toastBody);
        }

        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                setSendingTx(true);
                const toastBody = CustomToast({
                    message: `unstaking ${amount} RANCE from ${stakeTokenSymbol}/${rewardTokenSymbol} pool`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
            },
            successfull: async () => {
                const toastBody = CustomToast({
                    message: `Successfully staked ${amount} RANCE from ${stakeTokenSymbol}/${rewardTokenSymbol} pool`,
                    status: STATUS.SUCCESSFULL,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
                onClose();
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "Error unstaking tokens",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
            },
        };

        unstake(contractAddress, poolId, utils.parseEther(amount), callbacks);
    };

    const handleCloseModal = () => {
        // disallow clossing modal when transaction is ongoing
        !sendingTx && onClose();
    };

    const handleApprove = async () => {
        if (amount === "0") return;
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: "Approving RANCE for staking",
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                try {
                    await getAllowance(contractAddress);
                } catch (error) {
                    console.error(error);
                } finally {
                    setSendingTx(false);
                    toast.dismiss(pendingToastId);
                    const toastBody = CustomToast({
                        message: "RANCE approval successfull",
                        status: STATUS.SUCCESSFULL,
                        type: TYPE.TRANSACTION,
                    });
                    toast(toastBody);
                }
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "RANCE approval failed",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast(toastBody);
                setSendingTx(false);
            },
        };
        try {
            await approve(contractAddress, utils.parseEther(amount), callbacks);
        } catch (error: any) {
            console.error(error);
        }
    };
    return (
        <ModalWrapper
            open={open}
            label={`${action} modal`}
            onClose={handleCloseModal}
            onAfterClose={onAfterCloseHandler}
            contentClassName={styles.root}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>{action}</h1>
                <button
                    className={styles.close__btn}
                    onClick={handleCloseModal}
                >
                    <div className={styles.close__icon__wrapper}>
                        <Image
                            src={`/icons/close.svg`}
                            alt="modal close icon"
                            layout="fill"
                        />
                    </div>
                </button>
            </div>

            <div className={styles.tokens__logos__container}>
                <div className={styles.token__logo}>
                    <Image
                        src={`/token-icons/${stakeTokenSymbol}.png`}
                        alt={`${stakeTokenSymbol} logo`}
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

            <div className={styles.input__group}>
                <div className={styles.label__and__balance}>
                    <label className={styles.label} htmlFor="amount__input">
                        {action === "staking"
                            ? "Amount to stake"
                            : "Amount to unstake"}
                    </label>
                    <span className={styles.balance}>
                        {action === "staking"
                            ? `Available: ${Number(
                                  utils.formatEther(ranceBalance)
                              ).toFixed(2)} RANCE`
                            : `staked: ${Number(
                                  utils.formatEther(userStake as BigNumber)
                              ).toFixed(2)} RANCE`}
                    </span>
                </div>
                <div className={styles.input__container}>
                    <input
                        type="text"
                        placeholder={
                            action === "staking"
                                ? "enter an amount to stake"
                                : "enter an amount to unstake"
                        }
                        value={amount}
                        onChange={handleAmountChange}
                        className={styles.amount__input}
                        autoFocus
                    />
                    <button
                        className={styles.max__btn}
                        onClick={handleMaxClick}
                    >
                        MAX
                    </button>
                </div>
            </div>
            {action === "staking" ? (
                amount === "" ? (
                    <span className={styles.message}>Enter amount</span>
                ) : Number(amount) > Number(utils.formatEther(ranceBalance)) ? (
                    <span className={styles.message}>Insufficient balance</span>
                ) : allowances[contractAddress] &&
                  allowances[contractAddress].gte(utils.parseEther(amount)) ? (
                    <button
                        className={styles.action__button}
                        onClick={stakeHandler}
                        disabled={sendingTx}
                    >
                        Stake
                    </button>
                ) : (
                    <button
                        className={styles.action__button}
                        onClick={handleApprove}
                        disabled={sendingTx}
                    >
                        Approve RANCE
                    </button>
                )
            ) : amount === "" ? (
                <span className={styles.message}>Enter amount</span>
            ) : Number(amount) > Number(utils.formatEther(userStake!)) ? (
                <span className={styles.message}>
                    Insufficient stake balance
                </span>
            ) : (
                <button
                    className={styles.action__button}
                    onClick={unstakeHandler}
                    disabled={sendingTx}
                >
                    Unstake
                </button>
            )}
        </ModalWrapper>
    );
};

export default StakingModal;
