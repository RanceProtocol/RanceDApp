import clsx from "clsx";
import Image from "next/image";
import React, {
    ChangeEvent,
    FC,
    useCallback,
    useEffect,
    useState,
} from "react";
import { isValidAmountValue, truncateString } from "../../utils/helpers";
import ModalWrapper from "../ModalWrapper";
import styles from "./styles.module.css";
import Select, { GroupBase, OptionsOrGroups, SingleValue } from "react-select";
import { insuranceState } from "../../modules/insurance/ui/redux/state";
import useLazyToken from "../../hooks/useLazyToken";
import { ranceProtocol } from "../../constants/addresses";
import { BigNumber, utils } from "ethers";
import CustomToast, { STATUS, TYPE } from "../CustomToast";
import { toast } from "react-toastify";
import { useInsuranceViewModel } from "../../modules/insurance/controllers/insuranceViewModel";
import { useWeb3React } from "@web3-react/core";
import { pathObj } from "../../constants/path";

type addressType = keyof typeof ranceProtocol;

interface IProps {
    state: { open: boolean; planId: string };
    onClose: () => void;
    onSuccessfull: () => void;
}

const PackagePurchaseModal: FC<IProps> = ({
    state: { open, planId },
    onClose,
    onSuccessfull,
}) => {
    const state = insuranceState();
    const { packagePlans, insurableCoins, paymentTokens } = state;
    const targetPackageData = packagePlans.find((x) => x.planId === planId);

    const { approve, getAllowance, getBalance, getDecimal, getSymbol } =
        useLazyToken();
    const { account, library } = useWeb3React();
    const { insure } = useInsuranceViewModel({
        address: account,
        provider: library,
    });

    const [formDetails, setFormDetails] = useState<{
        coin: string | undefined;
        amount: string;
        insuranceFee: string;
        total: string;
        paymentToken: { value: string; label: string } | null;
    }>({
        coin: undefined,
        amount: "",
        insuranceFee: "0",
        total: "0",
        paymentToken: null,
    });

    const [paymentTokenOptions, setPaymentTokenOptions] = useState<
        | OptionsOrGroups<
              { value: string; label: string },
              GroupBase<{ value: string; label: string }>
          >
        | undefined
    >();
    const { amount, insuranceFee, total, paymentToken, coin } = formDetails;
    const [
        userSelectedPaymentTokenDetails,
        setUserSelectedPaymentTokenDetails,
    ] = useState<{
        symbol: string;
        balance: BigNumber | null;
        decimal: number | null;
        allowance: BigNumber | null;
    }>({
        symbol: "",
        balance: null,
        decimal: null,
        allowance: null,
    });
    const [sendingTx, setSendingTx] = useState(false);

    const handleCloseModal = () => {
        // disallow clossing modal when transaction is ongoing
        !sendingTx && onClose();
    };

    useEffect(() => {
        if (!insurableCoins || formDetails.coin) return;
        setFormDetails((prev) => ({
            ...prev,
            coin: Object.keys(insurableCoins)[0],
        }));
    }, [insurableCoins, formDetails.coin]);

    useEffect(() => {
        if (!paymentTokens) return;
        const entries = Object.entries(paymentTokens);
        const paymentTokenOptionsObject = entries.map((entry: string[]) => ({
            value: entry[1],
            label: entry[0],
        }));

        setPaymentTokenOptions(paymentTokenOptionsObject);
        if (!paymentTokenOptionsObject.length) return;
        setFormDetails((prev) => ({
            ...prev,
            paymentToken: paymentTokenOptionsObject[0],
        }));
    }, [paymentTokens]);

    useEffect(() => {
        if (!paymentToken?.value) return;
        // before fetching data for the new tokens, clear the state
        setUserSelectedPaymentTokenDetails({
            symbol: "",
            balance: null,
            decimal: null,
            allowance: null,
        });
        (async () => {
            try {
                const response = await Promise.all([
                    getSymbol(paymentToken.value),
                    getBalance(paymentToken.value),
                    getDecimal(paymentToken.value),
                    getAllowance(
                        paymentToken.value,
                        ranceProtocol[
                            process.env
                                .NEXT_PUBLIC_DAPP_ENVIRONMENT as addressType
                        ]
                    ),
                ]);

                setUserSelectedPaymentTokenDetails({
                    symbol: response[0],
                    balance: response[1],
                    decimal: response[2],
                    allowance: response[3],
                });
            } catch (error) {
                console.error(error);
                const toastBody = CustomToast({
                    message:
                        "Error getting payment token information! please reload",
                    status: STATUS.ERROR,
                    type: TYPE.ERROR,
                });
                toast(toastBody);
            }
        })(); // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paymentToken?.value]);

    const handleCoinChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            setFormDetails((prev) => ({
                ...prev,
                coin: event.target.value,
            }));
        },
        [setFormDetails]
    );

    const handlePaymentTokenChange = useCallback(
        (selectedOpt: SingleValue<{ value: string; label: string }>) => {
            setFormDetails((prev) => ({ ...prev, paymentToken: selectedOpt }));
        },
        [setFormDetails]
    );

    const handleAmountChange = useCallback(
        (event: ChangeEvent<HTMLInputElement>) => {
            if (!isValidAmountValue(event.target.value))
                return event.preventDefault();

            const calculatedInsuranceFee =
                Number(event.target.value) *
                (Number(targetPackageData?.insuranceFee) / 100);

            setFormDetails((prev) => ({
                ...prev,
                amount: event.target.value,
                insuranceFee: calculatedInsuranceFee.toString(),
                total: (
                    Number(event.target.value) + calculatedInsuranceFee
                ).toString(),
            }));
        },
        [targetPackageData?.insuranceFee]
    );

    //reset mmodal state after close
    const onAfterClose = () => {
        setFormDetails((prev) => ({
            ...prev,
            ...{
                coin: Object.keys(insurableCoins)[0],
                amount: "",
                insuranceFee: "0",
                total: "0",
            },
        }));
    };

    const handleApprove = async () => {
        if (formDetails.total === "0" || !paymentToken) return;
        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `Approving ${userSelectedPaymentTokenDetails.symbol} for insurance`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                try {
                    const newAllowance = await getAllowance(
                        paymentToken.value,
                        ranceProtocol[
                            process.env
                                .NEXT_PUBLIC_DAPP_ENVIRONMENT as addressType
                        ]
                    );
                    setUserSelectedPaymentTokenDetails((prev) => ({
                        ...prev,
                        allowance: newAllowance,
                    }));
                } catch (error) {
                    console.error(error);
                } finally {
                    toast.dismiss(pendingToastId);
                    const toastBody = CustomToast({
                        message: `${userSelectedPaymentTokenDetails.symbol} approval successfull`,
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
                        : `${userSelectedPaymentTokenDetails.symbol} approval failed`,
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast(toastBody);
                setSendingTx(false);
            },
        };
        try {
            await approve(
                paymentToken?.value,
                ranceProtocol[
                    process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as addressType
                ],
                utils.parseUnits(
                    formDetails.total,
                    userSelectedPaymentTokenDetails.decimal as number
                ),
                callbacks
            );
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleInsure = async () => {
        if (formDetails.total === "0" || !paymentToken) return;

        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message: `Buying a ${targetPackageData?.duration} ${targetPackageData?.timeUnitFull} insurance package for ${coin}`,
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
                setSendingTx(true);
            },
            successfull: async () => {
                try {
                    const newBalance = await getBalance(
                        ranceProtocol[
                            process.env
                                .NEXT_PUBLIC_DAPP_ENVIRONMENT as addressType
                        ]
                    );
                    setUserSelectedPaymentTokenDetails((prev) => ({
                        ...prev,
                        balance: newBalance,
                    }));
                } catch (error) {
                    console.error(error);
                } finally {
                    const toastBody = CustomToast({
                        message: `Successfully bought a ${targetPackageData?.duration} ${targetPackageData?.timeUnitFull} insurance package for ${coin}`,
                        status: STATUS.SUCCESSFULL,
                        type: TYPE.TRANSACTION,
                    });
                    toast.dismiss(pendingToastId);
                    toast(toastBody);
                    setSendingTx(false);
                    onSuccessfull();
                    onClose();
                }
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "Insurance package purchase failed",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
                setSendingTx(false);
            },
        };
        const paths =
            pathObj[
                process.env.NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof pathObj
            ];
        const path = Object.values(
            paths[`${paymentToken.label}-${coin}` as keyof typeof paths]
        );

        const amount = utils.parseUnits(
            total,
            userSelectedPaymentTokenDetails.decimal as number
        );
        const insureCoinName = coin as string;
        const paymentTokenName = paymentToken.label;

        await insure({
            planId,
            amount,
            path,
            insureCoin: insureCoinName,
            paymentToken: paymentTokenName,
            callbacks,
        });
    };

    const CustomTokenOption: FC<{ value: string; label: string }> = ({
        label,
    }) => {
        return (
            <div className={styles.token__custom__label}>
                <div className={styles.payment__token__dropdown__icon}>
                    <Image
                        src={`/token-icons/${label}.png`}
                        alt="mad usd token icon"
                        layout="fill"
                    />
                </div>
                <span className={styles.payment__token__icon__label}>
                    {label}
                </span>
            </div>
        );
    };

    return (
        <ModalWrapper
            open={open}
            label="Insurance Package Purchase Modal"
            onClose={handleCloseModal}
            onAfterClose={onAfterClose}
            contentClassName={styles.root}
        >
            <div className={styles.header}>
                <h1
                    className={styles.title}
                >{`${targetPackageData?.packageType} Package`}</h1>
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

            <div className={styles.notice}>
                <div className={styles.notice__text}>
                    <span className={styles.notice__key}>Notice:</span>
                    <p className={styles.notice__paragraph}>
                        To insure a particular coin, you must select the coin
                        and provide its equivalent in Mad USD (MUSD) or USDC.
                    </p>
                </div>
                <div className={styles.payment__token__icon}>
                    <Image
                        src={`/token-icons/MUSD.png`}
                        alt="mad usd token icon"
                        layout="fill"
                    />
                </div>
            </div>

            <form className={styles.form}>
                <div className={styles.coins__container}>
                    {Object.keys(insurableCoins).map((coin: string) => (
                        <label
                            htmlFor={coin}
                            key={coin}
                            className={clsx({
                                [styles.coin__wrapper]: true,
                                [styles.coin__wrapper__active]:
                                    formDetails.coin === coin,
                            })}
                        >
                            <input
                                type="radio"
                                id={coin}
                                name="coin_to_Insure"
                                value={coin}
                                className={styles.coin__radio__button__input}
                                onChange={handleCoinChange}
                            />
                            <div className={styles.coin__radio__button__image}>
                                <Image
                                    src={`/token-icons/${coin}.png`}
                                    alt={`${coin} logo`}
                                    layout="fill"
                                />
                            </div>
                        </label>
                    ))}
                </div>
                <div className={styles.input__group}>
                    <label
                        htmlFor="payment__token__dropdown"
                        className={styles.label}
                    >
                        Payment token
                    </label>
                    <Select
                        onChange={handlePaymentTokenChange}
                        placeholder="Select payment token"
                        options={paymentTokenOptions}
                        value={paymentToken}
                        name="payment__token__dropdown"
                        className={styles.payment__token__select__container}
                        classNamePrefix="payment__token__select"
                        formatOptionLabel={CustomTokenOption}
                    />
                </div>
                <div className={styles.input__group}>
                    <div className={styles.label__and__balance}>
                        <label className={styles.label} htmlFor="amount__input">
                            Amount to insure
                        </label>
                        {userSelectedPaymentTokenDetails.balance ? (
                            <span className={styles.balance}>
                                {`Available: ${Number(
                                    utils.formatUnits(
                                        userSelectedPaymentTokenDetails.balance,
                                        userSelectedPaymentTokenDetails.decimal as number
                                    )
                                )} ${userSelectedPaymentTokenDetails.symbol}`}
                            </span>
                        ) : (
                            <span className={styles.balance}>
                                Available: loading...
                            </span>
                        )}
                    </div>
                    <input
                        type="text"
                        placeholder="Enter an amount to insure"
                        value={amount}
                        onChange={handleAmountChange}
                        className={styles.amount__input}
                        autoFocus
                    />
                </div>

                <div className={styles.details}>
                    <div className={styles.key__value}>
                        <span className={styles.key}>Selected coin</span>
                        <span className={styles.value}>{coin}</span>
                    </div>
                    <div className={styles.key__value}>
                        <span className={styles.key}>Lock up period</span>
                        <span
                            className={styles.value}
                        >{`${targetPackageData?.duration} ${targetPackageData?.timeUnitFull}`}</span>
                    </div>

                    <div className={styles.key__value}>
                        <span className={styles.key}>Insurance fee</span>
                        <span
                            className={styles.value}
                        >{`$${insuranceFee}`}</span>
                    </div>

                    <div className={styles.key__value}>
                        <span className={styles.key}>Total</span>
                        <span className={styles.value}>{`$${total}`}</span>
                    </div>
                </div>

                {total !== "0" &&
                    userSelectedPaymentTokenDetails.balance &&
                    userSelectedPaymentTokenDetails.decimal &&
                    userSelectedPaymentTokenDetails.balance?.lt(
                        utils.parseUnits(
                            total,
                            userSelectedPaymentTokenDetails.decimal
                        )
                    ) && (
                        <span className={styles.message}>
                            Insufficient balance
                        </span>
                    )}

                {total !== "0" &&
                    userSelectedPaymentTokenDetails.balance &&
                    userSelectedPaymentTokenDetails.decimal &&
                    userSelectedPaymentTokenDetails.allowance &&
                    userSelectedPaymentTokenDetails.balance.gte(
                        utils.parseUnits(
                            total,
                            userSelectedPaymentTokenDetails.decimal
                        )
                    ) &&
                    userSelectedPaymentTokenDetails.allowance.lt(
                        utils.parseUnits(
                            total,
                            userSelectedPaymentTokenDetails.decimal
                        )
                    ) && (
                        <button
                            type="button"
                            onClick={handleApprove}
                            className={styles.Purchase__button}
                            disabled={sendingTx}
                        >
                            {sendingTx
                                ? "Approving..."
                                : `Approve ${paymentToken?.label}`}
                        </button>
                    )}

                {total !== "0" &&
                    userSelectedPaymentTokenDetails.balance &&
                    userSelectedPaymentTokenDetails.decimal &&
                    userSelectedPaymentTokenDetails.allowance &&
                    userSelectedPaymentTokenDetails.balance.gte(
                        utils.parseUnits(
                            total,
                            userSelectedPaymentTokenDetails.decimal
                        )
                    ) &&
                    userSelectedPaymentTokenDetails.allowance.gte(
                        utils.parseUnits(
                            total,
                            userSelectedPaymentTokenDetails.decimal
                        )
                    ) && (
                        <button
                            type="button"
                            className={styles.Purchase__button}
                            disabled={sendingTx}
                            onClick={handleInsure}
                        >
                            {sendingTx ? "Buying package..." : "Buy package"}
                        </button>
                    )}

                {total === "0" && (
                    <span className={styles.message}>Input amount</span>
                )}
            </form>
        </ModalWrapper>
    );
};

export default PackagePurchaseModal;
