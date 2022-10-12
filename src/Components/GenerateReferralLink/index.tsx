import Image from "next/image";
import { FC } from "react";
import styles from "./styles.module.css";

interface IProp {
    generateLinkHandler: () => Promise<void>;
}

const GenerateReferralLink: FC<IProp> = ({ generateLinkHandler }) => {
    return (
        <div className={styles.root}>
            <div className={styles.no__ref__code__image__container}>
                <Image
                    src="/coin-on-hand.png"
                    alt="coins in the hand"
                    layout="fill"
                    className={styles.no__ref__code__image}
                />
            </div>
            <p className={styles.no__ref__code__text}>
                You do not have a referral link yet. Generate one to start
                earning commissions on referrals
            </p>
            <button
                className={styles.generate__link__button}
                onClick={generateLinkHandler}
            >
                Generate link
            </button>
        </div>
    );
};

export default GenerateReferralLink;
