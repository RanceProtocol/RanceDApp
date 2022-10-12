import { BigNumber } from "ethers";

export enum PackageEnum {
    SILVER = "Silver",
    GOLD = "Gold",
    PLATINUM = "Platinum",
}

export interface IInsurancePackagePlan {
    planId: string;
    insuranceFee: number;
    unsureFee: BigNumber;
    isActivated: true;
    packageType: PackageEnum;
    name: string;
    duration: number;
    timeUnit: string;
    timeUnitFull: string;
}

export interface IInsurancePackage {
    user: string;
    planId: string;
    packageId: string;
    initialDeposit: BigNumber;
    insureOutput: BigNumber;
    startTimestamp: number;
    endTimestamp: number;
    isCancelled: boolean;
    isWithdrawn: boolean;
    insureCoin: string;
    paymentToken: string;
    unsureFee: BigNumber;
    packagePlanName: string;
    duration: string;
    timeUnitFull: string;
}
