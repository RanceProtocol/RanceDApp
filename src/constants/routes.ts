export interface Iroutes {
    home: string;
    insurance: string;
    staking: string;
}

export interface IinsuranceTabs {
    myPackages: string;
    insurancePackages: string;
}

export const routes:Iroutes = {
    home: "/", //will render insurance
    insurance: "/insurance",
    staking: "/staking",
}


export const insurancePageTabs:IinsuranceTabs = {
    myPackages: "my-packages",
    insurancePackages: "insurance-packages",
};