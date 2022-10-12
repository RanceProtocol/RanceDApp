import Image from "next/image";
import { FC } from "react";
import styles from "./styles.module.css";

interface IProp {}

const NoCommisionsYet: FC<IProp> = () => {
    return (
        <div className={styles.root}>
            <div className={styles.wallet__image__container}>
                <Image
                    src="/wallet-icon.png"
                    alt="wallet"
                    layout="fill"
                    className={styles.wallet__image}
                />
            </div>
            <p className={styles.no__commissions__text}>
                Ooops, no commissions yet
            </p>
        </div>
    );
};

export default NoCommisionsYet;
