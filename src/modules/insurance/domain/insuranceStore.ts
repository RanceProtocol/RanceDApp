import { IInsurancePackage, IInsurancePackagePlan } from "./entities";

interface IInsuranceStore {
    loadingPackagePlans: boolean;
    loadingUserPackages: boolean;
    packagePlans: IInsurancePackagePlan[];
    userPackages: IInsurancePackage[];
    hasInsured: boolean | undefined;
    insurableCoins: { [key: string]: string };
    paymentTokens: { [key: string]: string };
}

export default IInsuranceStore;
