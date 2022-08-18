import clsx from "clsx";
import styles from "./earningSectionSkeleton.module.css";

const EarningSectionSkeleton = () => {
    return (
        <div className={styles.root}>
            <div className={styles.text__section}>
                <div className={clsx(styles.earning__heading, styles.bg__color)}></div>
                <div className={clsx(styles.earning__text, styles.bg__color)}></div>
                <div className={clsx(styles.earning__text, styles.bg__color)}></div>
            </div>
            <div className={styles.cards__section}>
                {new Array(2).fill(undefined).map((item, index) => (
                    <div key={index} className={clsx(styles.earning__card, styles.bg__color)}></div>
                ))}
            </div>
        </div>
    );
};

export default EarningSectionSkeleton;
