import Image from "next/image";
import { FC } from "react";
import styles from "./styles.module.css";
import { utils } from "ethers";
import type { IInsurancePackagePlan } from "../../modules/insurance/domain/entities";
import { useWeb3React } from "@web3-react/core";
import { toggleWalletModal } from "../../appState/shared/action";
import { useDispatch } from "react-redux";
import { referralState } from "../../modules/referral/infrastructure/redux/state";

interface IProp extends IInsurancePackagePlan {
    insurableCoins: string[];
    hasInsured: boolean;
    onClickAction: (data: {
        open: boolean;
        planId: string;
        referrer: string | null;
    }) => void;
}

const InsurancePackagePlanCard: FC<IProp> = (props) => {
    const {
        planId,
        name,
        duration,
        insuranceFee,
        timeUnit,
        unsureFee,
        onClickAction,
        insurableCoins,
        hasInsured,
    } = props;
    const { account } = useWeb3React();
    const { referrerAddress } = referralState();

    const dispatch = useDispatch();

    return (
        <div className={styles.insurance__package__card}>
            <h1 className={styles.name}>{name}</h1>
            <div className={styles.insurable__coins__wrapper}>
                <span className={styles.insurable__coins__key}>
                    Insurable coins
                </span>
                <div className={styles.insurable__coins__container}>
                    {insurableCoins.map((coniSymbol: string) => (
                        <div
                            className={styles.coin_logo__wrapper}
                            key={coniSymbol}
                        >
                            <Image
                                src={`/token-icons/${coniSymbol}.png`}
                                alt={`${coniSymbol} logo`}
                                layout="fill"
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.package__details}>
                <div className={styles.key__value}>
                    <span className={styles.value}>
                        {duration}{" "}
                        <span className={styles.value__unit}>{timeUnit}</span>
                    </span>
                    <span className={styles.key}>Duration</span>
                </div>
                <div className={styles.key__value}>
                    <span className={styles.value}>
                        {insuranceFee} <span>&#37;</span>
                    </span>
                    <span className={styles.key}>Insurance Fee</span>
                </div>
                <div className={styles.key__value}>
                    <span className={styles.value}>
                        {Number(utils.formatEther(0))}{" "}
                        <span className={styles.value__unit}>RANCE</span>
                    </span>
                    <span className={styles.key}>Unsurance Fee</span>
                </div>
            </div>

            {account ? (
                <button
                    className={styles.button}
                    onClick={() =>
                        onClickAction({
                            open: true,
                            planId,
                            referrer:
                                !hasInsured &&
                                !!referrerAddress &&
                                referrerAddress.toLocaleLowerCase() !==
                                    account.toLocaleLowerCase()
                                    ? referrerAddress
                                    : null,
                        })
                    }
                >
                    Buy package
                </button>
            ) : (
                <button
                    className={styles.button}
                    onClick={() => toggleWalletModal(dispatch)}
                >
                    Connect wallet
                </button>
            )}
        </div>
    );
};

export default InsurancePackagePlanCard;
