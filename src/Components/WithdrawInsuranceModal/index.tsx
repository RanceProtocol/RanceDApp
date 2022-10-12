import clsx from "clsx";
import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import ModalWrapper from "../ModalWrapper";
import styles from "./styles.module.css";
import { BigNumber, utils } from "ethers";
import { insuranceState } from "../../modules/insurance/ui/redux/state";
import { IInsurancePackage } from "../../modules/insurance/domain/entities";
import { ranceProtocol, tokens } from "../../constants/addresses";
import { getCurrentTimestamp } from "../../utils/time";
import CustomToast, { STATUS, TYPE } from "../CustomToast";
import { toast } from "react-toastify";
import { truncateString } from "../../utils/helpers";
import useToken from "../../hooks/useToken";
import { addressToCoinDetails } from "../../constants/dummyData";

interface IProps {
    state: { open: boolean; id: string | null };
    cancelInsurance: ({
        packageId,
        callbacks,
    }: {
        packageId: string;
        callbacks: { [key: string]: (errorMessage?: string) => void };
    }) => Promise<void>;
    withdrawInsurance: ({
        packageId,
        callbacks,
    }: {
        packageId: string;
        callbacks: { [key: string]: (errorMessage?: string) => void };
    }) => Promise<void>;
    onClose: () => void;
    onSuccessFull: (type: "cancelation" | "withdrawal") => void;
}

const WithdrawInsuranceModal: FC<IProps> = ({
    state: { open, id },
    onClose,
    cancelInsurance,
    withdrawInsurance,
    onSuccessFull,
}) => {
    const state = insuranceState();
    const { userPackages } = state;

    const [selectedPackage, setSelectedPackage] = useState<IInsurancePackage>();
    const [sendingTx, setSendingTx] = useState(false);
    const [currentTimeStamp, setCurrentTimeStamp] = useState(0);

    const RANCEToken = useToken(
        tokens[process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof tokens]
            .RANCE
    );
    const insureCoin = useToken(
        userPackages.find((item) => item.packageId === id)?.insureCoin as string
    );
    const paymentToken = useToken(
        userPackages.find((item) => item.packageId === id)
            ?.paymentToken as string
    );

    const [RanceAllowance, setRanceAllowance] = useState<BigNumber>();
    const [insureCoinAllowance, setInsureCoinAllowance] = useState<BigNumber>();

    const getRanceAllowance = async () => {
        try {
            const rance = await RANCEToken.getAllowance(
                ranceProtocol[
                    process.env
                        .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof ranceProtocol
                ]
            );
            setRanceAllowance(rance);
        } catch (error: any) {
            console.error(error);
        }
    };

    const getInsureCoinAllowance = async () => {
        try {
            const coin = await insureCoin.getAllowance(
                ranceProtocol[
                    process.env
                        .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof ranceProtocol
                ]
            );

            setInsureCoinAllowance(coin);
        } catch (error: any) {
            console.error(error);
        }
    };

    useEffect(() => {
        getRanceAllowance();
        getInsureCoinAllowance();
        paymentToken.getSymbol();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        (async () => {
            const timestamp = await getCurrentTimestamp();
            if (!timestamp) return;
            setCurrentTimeStamp(timestamp);
        })();
    }, []);

    useEffect(() => {
        if (!id) return;
        const target = userPackages.find((item) => item.packageId === id);
        setSelectedPackage(target);
    }, [id, userPackages]);

    const handleCancel = async () => {
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `Cancelling insurance package...`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                const toastBody = CustomToast({
                    message: `Successfully cancelled your insurance package`,
                    status: STATUS.SUCCESSFULL,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
                onSuccessFull("cancelation");
                onClose();
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "Insurance package cancelation failed",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
            },
        };
        await cancelInsurance({ packageId: id as string, callbacks });
    };

    const handleWithdraw = async () => {
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `Withdrawing insurance package...`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                const toastBody = CustomToast({
                    message: `Successfully withdrawn your insurance package.`,
                    status: STATUS.SUCCESSFULL,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
                onSuccessFull("withdrawal");
                onClose();
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "Insurance package withdrawal failed",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
            },
        };

        await withdrawInsurance({ packageId: id as string, callbacks });
    };

    const handleApproveInsureCoin = async () => {
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `Approving ${insureCoin.symbol}`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                try {
                    await getInsureCoinAllowance();
                } catch (error: any) {
                    console.error(error);
                } finally {
                    toast.dismiss(pendingToastId);
                    const toastBody = CustomToast({
                        message: `${insureCoin.symbol} approval successfull`,
                        status: STATUS.SUCCESSFULL,
                        type: TYPE.TRANSACTION,
                    });
                    toast(toastBody);
                    setSendingTx(false);
                }
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : `${insureCoin.symbol} approval failed`,
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast(toastBody);
                setSendingTx(false);
            },
        };

        try {
            await insureCoin.approve(
                ranceProtocol[
                    process.env
                        .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof ranceProtocol
                ],
                selectedPackage?.insureOutput as BigNumber,
                callbacks
            );
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleCloseModal = () => {
        // disallow clossing modal when transaction is ongoing
        !sendingTx && onClose();
    };

    const handleApproveRance = async () => {
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: "Approving RANCE to pay for penalty fee",
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                try {
                    await getRanceAllowance();
                } catch (error: any) {
                    console.error(error);
                } finally {
                    toast.dismiss(pendingToastId);
                    const toastBody = CustomToast({
                        message: "RANCE approval successfull",
                        status: STATUS.SUCCESSFULL,
                        type: TYPE.TRANSACTION,
                    });
                    toast(toastBody);
                    setSendingTx(false);
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
            await RANCEToken.approve(
                ranceProtocol[
                    process.env
                        .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof ranceProtocol
                ],
                selectedPackage?.unsureFee as BigNumber,
                callbacks
            );
        } catch (error: any) {
            console.error(error);
        }
    };

    return (
        <ModalWrapper
            open={open}
            label="withdraw insurance Modal"
            onClose={handleCloseModal}
            contentClassName={styles.root}
        >
            <div className={styles.header}>
                <h1 className={styles.title}>
                    {currentTimeStamp !== 0 &&
                        (selectedPackage?.endTimestamp as number) >=
                            currentTimeStamp &&
                        "Remove insurance?"}
                    {currentTimeStamp !== 0 &&
                        currentTimeStamp >
                            (selectedPackage?.endTimestamp as number) &&
                        "Withdraw insurance"}
                </h1>
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

            {currentTimeStamp !== 0 && (
                <div
                    className={clsx({
                        [styles.notice]: true,
                        [styles.notice__negative]:
                            (selectedPackage?.endTimestamp as number) >=
                            currentTimeStamp,
                        [styles.notice__positive]:
                            currentTimeStamp >
                            (selectedPackage?.endTimestamp as number),
                    })}
                >
                    <div className={styles.notice__text}>
                        <span className={styles.notice__key}>Notice:</span>
                        <p className={styles.notice__paragraph}>
                            {(selectedPackage?.endTimestamp as number) >=
                                currentTimeStamp &&
                                "A % of un-insure fee is imposed if insurance package is cancelled before lock-up period is reached. If the fee cannot be provided, please wait till the insurance package expires then withdraw"}
                            {currentTimeStamp >
                                (selectedPackage?.endTimestamp as number) &&
                                "Your insured balance will be sent to your wallet when you provide an equal value for the initial amount, failure to provide this will lead to a loss of your insured balance in 30 days"}
                        </p>
                    </div>
                </div>
            )}

            <div className={styles.second__section}>
                <span className={styles.receive}>You will receive</span>
                <span className={styles.amount}>
                    {selectedPackage?.initialDeposit &&
                        `${Number(
                            utils.formatEther(selectedPackage?.initialDeposit)
                        )} ${paymentToken.symbol}`}
                </span>
                <span className={styles.insured__balance__text}>
                    Insured balance
                </span>
            </div>

            <div className={styles.details}>
                <div className={styles.key__value}>
                    <span className={styles.key}>Initial deposit</span>
                    {selectedPackage?.initialDeposit && (
                        <span className={styles.value}>
                            {`${Number(
                                utils.formatEther(
                                    selectedPackage?.initialDeposit
                                )
                            )} ${paymentToken.symbol}`}
                        </span>
                    )}
                </div>

                <div className={styles.key__value}>
                    <span className={styles.key}>Penalty fee</span>
                    <span className={styles.value}>
                        {currentTimeStamp >
                        (selectedPackage?.endTimestamp as number)
                            ? "0 RANCE"
                            : selectedPackage?.unsureFee &&
                              `${Number(
                                  utils.formatEther(selectedPackage?.unsureFee)
                              )} RANCE`}
                    </span>
                </div>
            </div>
            {currentTimeStamp !== 0 &&
                currentTimeStamp > (selectedPackage?.endTimestamp as number) &&
                insureCoinAllowance &&
                (insureCoinAllowance.lt(
                    selectedPackage?.insureOutput as BigNumber
                ) ? (
                    <button
                        className={clsx(
                            styles.action__btn,
                            styles.withdrawal__btn
                        )}
                        disabled={sendingTx}
                        onClick={handleApproveInsureCoin}
                    >{`Approve ${insureCoin.symbol}`}</button>
                ) : (
                    <button
                        className={clsx(
                            styles.action__btn,
                            styles.withdrawal__btn
                        )}
                        disabled={sendingTx}
                        onClick={handleWithdraw}
                    >
                        Withdraw
                    </button>
                ))}

            {currentTimeStamp !== 0 &&
                (selectedPackage?.endTimestamp as number) >= currentTimeStamp &&
                RanceAllowance &&
                (RanceAllowance.lt(selectedPackage?.unsureFee as BigNumber) ? (
                    <button
                        className={clsx(styles.action__btn, styles.cancel__btn)}
                        onClick={handleApproveRance}
                        disabled={sendingTx}
                    >
                        Approve RANCE
                    </button>
                ) : insureCoinAllowance &&
                  insureCoinAllowance.lt(
                      selectedPackage?.insureOutput as BigNumber
                  ) ? (
                    <button
                        className={clsx(styles.action__btn, styles.cancel__btn)}
                        onClick={handleApproveInsureCoin}
                        disabled={sendingTx}
                    >{`Approve ${addressToCoinDetails[
                        process.env
                            .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof addressToCoinDetails
                    ][
                        selectedPackage?.insureCoin as string
                    ].symbol.toUpperCase()}`}</button>
                ) : (
                    <button
                        className={clsx(styles.action__btn, styles.cancel__btn)}
                        onClick={handleCancel}
                        disabled={sendingTx}
                    >
                        Cancel insurance
                    </button>
                ))}
        </ModalWrapper>
    );
};

export default WithdrawInsuranceModal;
