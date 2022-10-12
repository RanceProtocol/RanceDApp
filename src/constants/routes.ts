export interface Iroutes {
    home: string;
    insurance: string;
    staking: string;
    referral: string;
}

export interface IinsuranceTabs {
    myPackages: string;
    insurancePackages: string;
}

export const routes: Iroutes = {
    home: "/", //will render insurance
    insurance: "/insurance",
    staking: "/staking",
    referral: "/referral",
};

export const insurancePageTabs: IinsuranceTabs = {
    myPackages: "my-packages",
    insurancePackages: "insurance-packages",
};
