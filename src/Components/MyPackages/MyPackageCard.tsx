import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { IoMdArrowDropup, IoMdArrowDropdown } from "react-icons/io";
import styles from "./styles.module.css";
import { Sparklines, SparklinesLine } from "react-sparklines";
import { getCoinPriceDataSinceInsured } from "../../utils/price";
import clsx from "clsx";
import { addressToCoinDetails } from "../../constants/dummyData";
import {
    getCurrentTimestamp,
    getDateStringFromTimstamp,
} from "../../utils/time";
import { utils } from "ethers";
import { useCountdown } from "../../hooks/useCountdown";
import { padZero } from "../../utils/helpers";
import { IInsurancePackage } from "../../modules/insurance/domain/entities";
import useLazyToken from "../../hooks/useLazyToken";

interface IProp extends IInsurancePackage {
    clickAction: (id: string) => void;
}

const MyPackageCard: FC<IProp> = (props) => {
    const {
        clickAction,
        duration,
        endTimestamp,
        initialDeposit,
        paymentToken,
        insureCoin,
        insureOutput,
        packageId,
        packagePlanName,
        startTimestamp,
        timeUnitFull,
    } = props;
    const [chartData, setChartData] = useState<number[]>([]);
    const [priceChange, setPriceChange] = useState<string>("0%");

    const [currentTimeStamp, setCurrentTimeStamp] = useState(0);
    const [paymentTokenDecimals, setPaymetTokenDecimals] = useState<
        number | null
    >(null);
    const [insureCoinDecimals, setInsureCoinDecimals] = useState<number | null>(
        null
    );

    const { getDecimal } = useLazyToken();
    useEffect(() => {
        (async () => {
            try {
                const decimals = await Promise.all([
                    await getDecimal(paymentToken),
                    await getDecimal(insureCoin),
                ]);
                setPaymetTokenDecimals(decimals[0]);
                setInsureCoinDecimals(decimals[1]);
            } catch (error) {
                // const toastBody = CustomToast({
                //     message:
                //         "An error occured, Please reload the page",
                //     status: STATUS.ERROR,
                //     type: TYPE.ERROR,
                // });
                // toast(toastBody);
            }
        })();
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
        (async () => {
            const coinPriceData = await getCoinPriceDataSinceInsured(
                addressToCoinDetails[
                    process.env
                        .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof addressToCoinDetails
                ][insureCoin].id,
                startTimestamp
            );
            setChartData(coinPriceData.sparklineData);
            setPriceChange(coinPriceData.priceChange);
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const { formatedTimeLeft: countdown } = useCountdown(endTimestamp);

    return (
        <div className={styles.my__package__card}>
            <div className={styles.head}>
                <span className={styles.balance}>
                    Current balance:{" "}
                    <span className={styles.amount}>{`$${Number(
                        utils.formatEther(initialDeposit)
                    )}`}</span>
                </span>
                {currentTimeStamp > (endTimestamp as number) && (
                    <span
                        className={clsx(styles.status, styles.status__expired)}
                    >
                        Expired{" "}
                        <IoMdArrowDropdown className={styles.status__icon} />
                    </span>
                )}
                {(endTimestamp as number) >= currentTimeStamp && (
                    <span
                        className={clsx(styles.status, styles.status__active)}
                    >
                        ACTIVE{" "}
                        <IoMdArrowDropup className={styles.status__icon} />
                    </span>
                )}
            </div>
            <div className={styles.body}>
                <div className={styles.name__section}>
                    <h2 className={styles.name}>{packagePlanName}</h2>
                    <span className={styles.dot}>.</span>
                </div>

                <div className={styles.package__details}>
                    <div className={styles.key__value}>
                        <span className={styles.value}>
                            {getDateStringFromTimstamp(startTimestamp)}
                        </span>
                        <span className={styles.key}>Package started</span>
                    </div>
                    <div className={styles.key__value}>
                        <span className={styles.value}>{`$${Number(
                            utils.formatEther(initialDeposit)
                        )}`}</span>
                        <span className={styles.key}>Initial amount</span>
                    </div>
                    <div className={styles.key__value}>
                        <span
                            className={styles.value}
                        >{`${duration} ${timeUnitFull}`}</span>
                        <span className={styles.key}>Duration</span>
                    </div>
                    <div className={styles.key__value}>
                        <span className={styles.value}>
                            {insureCoinDecimals
                                ? `${Number(
                                      utils.formatUnits(
                                          insureOutput,
                                          insureCoinDecimals
                                      )
                                  ).toFixed(2)} ${addressToCoinDetails[
                                      process.env
                                          .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof addressToCoinDetails
                                  ][insureCoin].symbol.toUpperCase()}`
                                : "..."}
                        </span>
                        <span className={styles.key}>To return</span>
                    </div>
                </div>
                <div className={styles.section__two}>
                    <div className={styles.coin__details}>
                        <div className={styles.coin}>
                            <div className={styles.icon__nd__name}>
                                <div className={styles.coin_logo__wrapper}>
                                    <Image
                                        src={`/token-icons/${addressToCoinDetails[
                                            process.env
                                                .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof addressToCoinDetails
                                        ][
                                            insureCoin
                                        ].symbol.toUpperCase()}.png`}
                                        alt={`${
                                            addressToCoinDetails[
                                                process.env
                                                    .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof addressToCoinDetails
                                            ][insureCoin].id
                                        } logo`}
                                        layout="fill"
                                    />
                                </div>
                                <span
                                    className={styles.coin__name}
                                >{`${addressToCoinDetails[
                                    process.env
                                        .NEXT_PUBLIC_DAPP_ENVIRONMENT as keyof typeof addressToCoinDetails
                                ][insureCoin].symbol.toUpperCase()}`}</span>
                            </div>
                            <div className={styles.price__change}>
                                <span
                                    className={clsx({
                                        [styles.increase__value]:
                                            priceChange.startsWith("+"),
                                        [styles.decrease__value]:
                                            priceChange.startsWith("-"),
                                    })}
                                >
                                    {priceChange}
                                </span>
                                <span className={styles.increase__key}>
                                    Since insured
                                </span>
                            </div>
                        </div>
                        <Sparklines data={chartData} height={40}>
                            <SparklinesLine color="#FFC043" />
                        </Sparklines>
                    </div>

                    {currentTimeStamp > (endTimestamp as number) && (
                        <p className={styles.expired__in__text}>
                            Access to this package ends in
                        </p>
                    )}
                    {(endTimestamp as number) >= currentTimeStamp && (
                        <p className={styles.expired__in__text}>
                            This package expires in
                        </p>
                    )}

                    <div className={styles.countdown__nd__button}>
                        <div className={styles.countdown__container}>
                            <span className={styles.countdown__group}>
                                <span className={styles.countdown__value}>
                                    {countdown?.weeks
                                        ? padZero(countdown?.weeks)
                                        : "00"}
                                </span>
                                <span className={styles.countdown__label}>
                                    WEEKS
                                </span>
                            </span>

                            <span className={styles.countdown__group}>
                                <span className={styles.countdown__value}>
                                    {countdown?.days
                                        ? padZero(countdown?.days)
                                        : "00"}
                                </span>
                                <span className={styles.countdown__label}>
                                    DAYS
                                </span>
                            </span>

                            <span className={styles.countdown__group}>
                                <span className={styles.countdown__value}>
                                    {countdown?.hours
                                        ? padZero(countdown?.hours)
                                        : "00"}
                                </span>
                                <span className={styles.countdown__label}>
                                    HOURS
                                </span>
                            </span>

                            <span className={styles.countdown__group}>
                                <span className={styles.countdown__value}>
                                    {countdown?.minutes
                                        ? padZero(countdown?.minutes)
                                        : "00"}
                                </span>
                                <span className={styles.countdown__label}>
                                    MINS
                                </span>
                            </span>
                        </div>

                        {currentTimeStamp > (endTimestamp as number) && (
                            <button
                                className={styles.withdraw__button}
                                onClick={() => clickAction(packageId)}
                            >
                                Withdraw insurance
                            </button>
                        )}
                        {(endTimestamp as number) >= currentTimeStamp && (
                            <button
                                className={styles.cancel__button}
                                onClick={() => clickAction(packageId)}
                            >
                                Cancel insurance
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyPackageCard;
