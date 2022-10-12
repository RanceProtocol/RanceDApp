import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/referral.module.css";
import { Fragment, useEffect } from "react";
import GenerateReferralLink from "../Components/GenerateReferralLink";
import NoCommisionsYet from "../Components/NoCommissionsYet";
import ReferralLink from "../Components/ReferralLink";
import ReferralsSummary from "../Components/ReferralsSummary";
import ReferralRecordTable from "../Components/ReferralRecordTable";
import { useWeb3React } from "@web3-react/core";
import ReferralBanner from "../Components/ReferralBanner";
import { useReferralViewModel } from "../modules/referral/controllers/referralController";
import { referralState } from "../modules/referral/infrastructure/redux/state";
import CustomToast, { STATUS, TYPE } from "../Components/CustomToast";
import { toast } from "react-toastify";
import { truncateString } from "../utils/helpers";
import Reactionloader from "../Components/SharedComponent/Reactionloader";
import clsx from "clsx";

const Referral: NextPage = () => {
    const { account, library, connector } = useWeb3React();

    const {
        loadingReferralRecord,
        loadingreferralLink,
        referralRecord,
        referralLink,
    } = referralState();

    const {
        initialize,
        genarateReferralLink,
        copyReferralLink,
        claimReferralReward,
    } = useReferralViewModel({
        address: account,
        provider: library,
        connector,
    });

    useEffect(() => {
        (async () => {
            initialize();
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    const claimReferralRewards = async (
        referralRewardIds: string[]
    ): Promise<void> => {
        if (referralRewardIds.length === 0) return;

        let pendingToastId: number | string = "";
        const callbacks = {
            sent: () => {
                const toastBody = CustomToast({
                    message:
                        referralRewardIds.length > 1
                            ? "Withdrawing all your referral rewards"
                            : "Withdrawing your referral reward",
                    status: STATUS.PENDING,
                    type: TYPE.TRANSACTION,
                });
                pendingToastId = toast(toastBody, { autoClose: false });
            },
            successfull: async () => {
                const toastBody = CustomToast({
                    message:
                        referralRewardIds.length > 1
                            ? "Referral rewards successfully withdrawn"
                            : "Referral reward successfully withdrawn",
                    status: STATUS.SUCCESSFULL,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
            },
            failed: (errorMessage?: string) => {
                const toastBody = CustomToast({
                    message: errorMessage
                        ? truncateString(errorMessage, 100)
                        : "Referral reward withdrawal failed",
                    status: STATUS.ERROR,
                    type: TYPE.TRANSACTION,
                });
                toast.dismiss(pendingToastId);
                toast(toastBody);
            },
        };

        await claimReferralReward({
            referralRewardIds,
            callbacks,
        });
    };

    return (
        <Fragment>
            <div className={styles.container}>
                <Head>
                    <title>Rance Protocol - Referral</title>
                </Head>
                <main className={styles.main}>
                    {!account ? (
                        <>
                            <ReferralBanner />
                            {/* this div is a workaround so that the component below to be the third grid iten */}
                            <div></div>
                            <div className={styles.message}>
                                <p>Please connect your wallet</p>
                            </div>
                        </>
                    ) : loadingreferralLink ? (
                        <>
                            <ReferralBanner />
                            <div></div>
                            <div className={styles.loading__icon__container}>
                                <Reactionloader />
                            </div>
                        </>
                    ) : referralLink ? (
                        <>
                            <ReferralBanner />
                            <ReferralLink
                                refLink={referralLink}
                                copyReferralLinkHandler={copyReferralLink}
                            />
                            {loadingReferralRecord ? (
                                <div
                                    className={clsx(
                                        styles.loading__icon__container,
                                        styles.record__table__loader
                                    )}
                                >
                                    <Reactionloader />
                                </div>
                            ) : !!referralRecord.length ? (
                                <ReferralRecordTable
                                    data={referralRecord}
                                    claimReferralRewards={claimReferralRewards}
                                />
                            ) : (
                                <NoCommisionsYet />
                            )}
                            <ReferralsSummary
                                referralRecord={referralRecord}
                                claimReferralRewards={claimReferralRewards}
                            />
                        </>
                    ) : (
                        <>
                            <ReferralBanner />
                            {/* this div is a workaround so that the component below to be the third grid iten */}
                            <div></div>
                            <GenerateReferralLink
                                generateLinkHandler={genarateReferralLink}
                            />
                        </>
                    )}
                </main>
            </div>
        </Fragment>
    );
};

export default Referral;
