import clsx from "clsx";
import styles from "./skeletonStyles.module.css";

const InsurancePackagePlanCardSkeleton = () => {
  return (
    <div className={styles.root}>
            <div className={clsx(styles.name, styles.bg__color)}></div>
            <div className={clsx(styles.insurable__coins__wrapper)}>
                <span className={clsx(styles.insurable__coins__key, styles.bg__color)}></span>
                <div className={styles.insurable__coins__container}>
                    <div className={clsx(styles.coin_logo__wrapper, styles.bg__color)}></div>
                    <div className={clsx(styles.coin_logo__wrapper, styles.bg__color)}></div>
                    <div className={clsx(styles.coin_logo__wrapper, styles.bg__color)}></div>
                    <div className={clsx(styles.coin_logo__wrapper, styles.bg__color)}></div>
                </div>
            </div>
            <div className={clsx(styles.package__details, styles.bg__color)}>
            </div>
            <div className={clsx(styles.button, styles.bg__color)}></div>
        </div>
  )
}

export default InsurancePackagePlanCardSkeleton