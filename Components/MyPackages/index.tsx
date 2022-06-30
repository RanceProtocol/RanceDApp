import React, { Fragment, useEffect, useState } from "react";
import MyPackageCard from "./myPackageCard";
import styles from "./styles.module.css";
import { insurancePackages } from "../../constants/dummyData";
import WithdrawInsuranceModal from "../WithdrawInsuranceModal";
import SuccessModal from "../SuccessModal";
import { useWeb3React } from "@web3-react/core";
import { useInsuranceViewModel } from "../../modules/insurance/controllers/insuranceViewModel";
import MyPackageCardSkeleton from "./myPackageCardSkeleton";
import { insuranceState } from "../../modules/insurance/ui/redux/state";

const MyPackages = () => {
    const [withdrawModalState, setWithdrawModalState] = useState<{
        open: boolean;
        id: string | null;
    }>({ open: false, id: null });
    const [showCancelSuccess, setShowCancelSuccess] = useState<boolean>(false);
    const [showWithdrawSuccess, setShowWithdrawSuccess] =
        useState<boolean>(false);

    const clickAction = (id: string) => {
        setWithdrawModalState({ open: true, id });
    };

    const showOutcomeModal = (type: "withdrawal" | "cancelation") => {
        if (type === "cancelation") return setShowCancelSuccess(true);

        setShowWithdrawSuccess(true);
    };

    const { account, library } = useWeb3React();

    const { intializeUserPackages, cancelInsurance, withdrawInsurance } = useInsuranceViewModel({
        address: account,
        provider: library,
    });

    useEffect(() => {
        intializeUserPackages();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account]);

    const state = insuranceState();

    const { loadingUserPackages, userPackages } = state;

    return (
        <Fragment>
            <div className={styles.root}>
                {!account ? (
                    <p className={styles.message}>
                        Connect wallet to manage your insurance packages
                    </p>
                ) : loadingUserPackages ? (
                    new Array(3)
                        .fill(undefined)
                        .map((item, index) => (
                            <MyPackageCardSkeleton key={index} />
                        ))
                ) : userPackages.length ? (
                    userPackages.map((item) => (
                        <MyPackageCard
                            key={item.packageId}
                            {...item}
                            clickAction={clickAction}
                        />
                    ))
                ) : (
                    <p className={styles.message}>
                        You do not have any active insurance package
                    </p>
                )}
            </div>
            {withdrawModalState.id && <WithdrawInsuranceModal
                state={withdrawModalState}
                cancelInsurance = {cancelInsurance}
                withdrawInsurance = {withdrawInsurance}
                onClose={() => setWithdrawModalState({ open: false, id: null })}
            />}

            <SuccessModal
                state={{
                    open: showWithdrawSuccess,
                    heading: "Withdrawal successfull",
                    text: "Your Insurance has been successfully withdrawn and your fund has been sent to your wallet",
                    buttonText: "Back to “My Packages”",
                }}
                action={() => setShowWithdrawSuccess(false)}
                onClose={() => setShowWithdrawSuccess(false)}
            />
            <SuccessModal
                state={{
                    open: showCancelSuccess,
                    heading: "Cancelled successfull",
                    text: "Your Insurance has been successfully cancelled and your fund has been sent to your wallet",
                    buttonText: "Back to “My Packages”",
                }}
                action={() => setShowCancelSuccess(false)}
                onClose={() => setShowCancelSuccess(false)}
            />
        </Fragment>
    );
};

export default MyPackages;
