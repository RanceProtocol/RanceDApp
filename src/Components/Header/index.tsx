import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";
import styles from "./styles.module.css";
import clsx from "clsx";
import { routes } from "../../constants/routes";
import { useWeb3React } from "@web3-react/core";
import { shortenAddress } from "../../utils/helpers";
import { RiArrowDropDownLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { toggleAccountModal, toggleWalletModal } from "../../appState/shared/action";

interface IProp {}

const Header: FC<IProp> = () => {
    const router = useRouter();
    const { active, account } = useWeb3React();
    const dispatch = useDispatch()
    return (
        <header className={styles.root}>
            <Link href="/">
                <div className={styles.logo__wrapper}>
                    <Image
                        src="/rance-protocol-logo.png"
                        alt="Rance Logo"
                        layout="fill"
                    />
                </div>
            </Link>

            <nav className={styles.navigation}>
                <ul className={styles.nav__list__container}>
                    <li>
                        <Link href={routes.insurance}>
                            <a
                                className={clsx({
                                    [styles.link]: true,
                                    [styles.active__link]: [
                                        routes.home,
                                        routes.insurance,
                                    ].includes(router.pathname),
                                })}
                            >
                                Insurance
                            </a>
                        </Link>
                    </li>
                    <li>
                        <Link href={routes.staking}>
                            <a
                                className={clsx({
                                    [styles.link]: true,
                                    [styles.active__link]:
                                        router.pathname === routes.staking,
                                })}
                            >
                                Staking
                            </a>
                        </Link>
                    </li>
                </ul>
            </nav>
            {active ? (
                <div className={styles.connected}>
                    {window.localStorage.getItem(
                            "wallet"
                        )&& <div className={styles.connected__wallet}>
                        <div className={styles.connected__wallet__icon}>
                            <Image
                                src={`/icons/${window.localStorage.getItem(
                                    "wallet"
                                )}.png`}
                                alt="wallet Icon"
                                layout="fill"
                            />
                        </div>
                        <span>{`${window.localStorage.getItem(
                            "wallet"
                        )} connected`}</span>
                    </div>}
                    <button className={styles.connected__btn} onClick = {() => toggleAccountModal(dispatch)}>
                        <span>{shortenAddress(account as string)}</span>
                        <RiArrowDropDownLine
                            className={styles.connected__btn__dropdown__icon}
                        />
                    </button>
                </div>
            ) : (
                <button className={styles.connect__btn} onClick = {() => toggleWalletModal(dispatch)}>Connect wallet</button>
            )}
        </header>
    );
};

export default Header;
