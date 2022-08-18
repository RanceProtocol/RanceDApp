import clsx from "clsx";
import styles from "./poolCardSkeleton.module.css";
const PoolCardSkeleton = () => {
    return (
        <div className={styles.root}>
            <div className={styles.tokens__logos__container}>
                <div
                    className={clsx(styles.token__logo, styles.bg__color)}
                ></div>
                <div
                    className={clsx(styles.token__logo, styles.bg__color)}
                ></div>
            </div>
            <div className={clsx(styles.pool__tokens, styles.bg__color)}></div>
            <div
                className={clsx(styles.pool__description, styles.bg__color)}
            ></div>
            <div className={clsx(styles.apr__text, styles.bg__color)}></div>
            <div className={styles.pool__details}>
                <div className={styles.key__values}>
                    <div className={clsx(styles.key, styles.bg__color)}></div>
                    <div className={clsx(styles.value, styles.bg__color)}></div>
                </div>

                <div className={styles.key__values}>
                    <div className={clsx(styles.key, styles.bg__color)}></div>
                    <div className={clsx(styles.value, styles.bg__color)}></div>
                </div>
            </div>
            <div className={clsx(styles.button, styles.bg__color)}></div>
            <div className={clsx(styles.contract__link, styles.bg__color)}></div>
        </div>
    );
};

export default PoolCardSkeleton;
