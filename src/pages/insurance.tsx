import clsx from "clsx";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../styles/insurance.module.css";
import { insurancePageTabs as tabs } from "../constants/routes";
import { Fragment } from "react";
import InsurancePackagePlans from "../Components/InsurancePackagePlans";
import MyPackages from "../Components/MyPackages";

const Insurance: NextPage = () => {
    const router = useRouter();
    const tab = router.query.tab;

    return (
        <Fragment>
            <div className={styles.container}>
                <Head>
                    <title>Rance Protocol - Insurance</title>
                </Head>
                <main className={styles.main}>
                    <div className={styles.banner}>
                        <div className={styles.banner__container}>
                            <h1 className={styles.banner__header}>
                                Insurance Info
                            </h1>
                            <p className={styles.banner__text}>
                                Stabilise coins at your desired price with up to
                                2 years Insurance protection.
                            </p>
                        </div>
                        <div className={styles.banner__image__container}>
                            <Image
                                src="/insurance-banner-image.png"
                                alt="staking page banner"
                                layout="fill"
                                className={styles.banner__image}
                            />
                        </div>
                    </div>
                    <div className={styles.tab}>
                        <ul className={styles.tabs__container}>
                            <li>
                                <button
                                    onClick={() =>
                                        router.push(
                                            `${router.pathname}?tab=${tabs.insurancePackages}`
                                        )
                                    }
                                    className={clsx({
                                        [styles.active_tab]:
                                            String(tab).toLowerCase() !==
                                            tabs.myPackages,
                                        [styles.tab_btn]: true,
                                    })}
                                >
                                    Insurance Packages
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() =>
                                        router.push(
                                            `${router.pathname}?tab=${tabs.myPackages}`
                                        )
                                    }
                                    className={clsx({
                                        [styles.active_tab]:
                                            String(tab).toLowerCase() ===
                                            tabs.myPackages,
                                        [styles.tab_btn]: true,
                                    })}
                                >
                                    My Packages
                                </button>
                            </li>
                        </ul>
                    </div>
                    {String(tab).toLowerCase() !== tabs.myPackages ? (
                        <InsurancePackagePlans />
                    ) : (
                        <MyPackages />
                    )}
                </main>
            </div>
        </Fragment>
    );
};

export default Insurance;
