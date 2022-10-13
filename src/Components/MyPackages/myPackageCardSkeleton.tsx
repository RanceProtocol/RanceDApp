import clsx from "clsx";
import styles from "./skeletonStyles.module.css";

const MyPackageCardSkeleton = () => {
  return (
    <div className={styles.root}>
            <div className={clsx(styles.head, styles.bg__color)}>
            </div>
            <div className={styles.body}>
                <div className={clsx(styles.name__section, styles.bg__color)}></div>

                <div className={styles.package__details}>
                    <div className={styles.key__value}>
                        <span className={clsx(styles.value, styles.bg__color)}></span>
                        <span className={clsx(styles.key, styles.bg__color)}></span>
                    </div>
                    <div className={styles.key__value}>
                        <span className={clsx(styles.value, styles.bg__color)}></span>
                        <span className={clsx(styles.key, styles.bg__color)}></span>
                    </div>
                    <div className={styles.key__value}>
                        <span className={clsx(styles.value, styles.bg__color)}></span>
                        <span className={clsx(styles.key, styles.bg__color)}></span>
                    </div>
                </div>
                <div className={styles.section__two}>
                    <div className={clsx(styles.coin__details, styles.bg__color)}></div>
                    
                    <span className={clsx(styles.expired__in__text, styles.bg__color)}></span>

                    <div className={styles.countdown__nd__button}>
                        <div className = {clsx(styles.countdown__container, styles.bg__color)}></div>
                        <div className={clsx(styles.button, styles.bg__color)}></div>
                    </div>
                </div>
            </div>
        </div>
  )
}

export default MyPackageCardSkeleton