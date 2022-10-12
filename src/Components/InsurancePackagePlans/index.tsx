import { FC, Fragment, useEffect, useState } from "react";
import styles from "./styles.module.css";
import InsurancePackagePlanCard from "./insurancePackagePlanCard";
import InsurancePackagePlanCardSkeleton from "./insurancePackagePlanCardSkeleton";
import PackagePurchaseModal from "../PackagePurchaseModal";
import { useWeb3React } from "@web3-react/core";
import { useInsuranceViewModel } from "../../modules/insurance/controllers/insuranceViewModel";
import { insuranceState } from "../../modules/insurance/ui/redux/state";
import { IInsurancePackagePlan } from "../../modules/insurance/domain/entities";
import SuccessModal from "../SuccessModal";
import { useRouter } from "next/router";
import { insurancePageTabs } from "../../constants/routes";

interface IProp {}

const InsurancePackagePlans: FC<IProp> = () => {
    const [packagePurchaseModal, setPackagePurchaseModal] = useState<{
        open: boolean;
        planId: string;
    }>({ open: false, planId: "" });

    const router = useRouter();

    const { account, library } = useWeb3React();

    const { initializePackagePlans } = useInsuranceViewModel({
        address: account,
        provider: library,
    });

    const state = insuranceState();

    const { loadingPackagePlans, packagePlans, insurableCoins } = state;

    useEffect(() => {
        initializePackagePlans();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    let insurableCoinsSymbols = Object.keys(insurableCoins)

    const [successModalOpen, setSuccessModalOpen] = useState(false)

    const [purchaseSuccessfull, setPurchaseSuccessfull] = useState(false)

    useEffect(() => {
        purchaseSuccessfull && setSuccessModalOpen(true)
    }, [purchaseSuccessfull])

    const handleSuccessModalAction = () => {
        setSuccessModalOpen(() => false)
        router.push(
            `${router.pathname}?tab=${insurancePageTabs.myPackages}`)

    }
    
    

    return (
        <Fragment>
            <div className={styles.root}>
                {loadingPackagePlans && !packagePlans.length
                    ? new Array(3)
                          .fill(undefined)
                          .map((item, index) => <InsurancePackagePlanCardSkeleton key = {index} />)
                    : packagePlans.map(
                          (insurancePackage: IInsurancePackagePlan) => (
                              <InsurancePackagePlanCard
                                  key={insurancePackage.planId}
                                  {...insurancePackage}
                                  insurableCoins={insurableCoinsSymbols}
                                  onClickAction={(data: {
                                      open: boolean;
                                      planId: string;
                                  }) => setPackagePurchaseModal(data)}
                              />
                          )
                      )}
            </div>
            {account && <PackagePurchaseModal
                state={packagePurchaseModal}
                onClose={() =>
                    setPackagePurchaseModal((prev) => ({
                        ...prev,
                        open: false,
                    }))
                }
                onSuccessfull = {() => setPurchaseSuccessfull(true)}
            />}

            <SuccessModal
                state={{
                    open: successModalOpen,
                    heading: "Success",
                    text: "Your insurance package is now active and the coin sent to your wallet, check “My Packages” to monitor progress",
                    buttonText: "Go to “My Packages”",
                }}
                action={handleSuccessModalAction}
                onClose={() => setSuccessModalOpen(false)}
            />
        </Fragment>
    );
};

export default InsurancePackagePlans;
