import { IInsurancePackage } from "../../domain/entities";
import IInsuranceStore from "../../domain/insuranceStore";
import * as actionTypes from "./actionTypes";

const initialState: IInsuranceStore = {
    loadingPackagePlans: false,
    loadingUserPackages: false,
    packagePlans: [],
    userPackages: [],
    insurableCoins: {},
    paymentTokens: {},
};

export const insuranceReducer = (
    state = initialState,
    action: { type: string; payload?: any }
): IInsuranceStore => {
    const { type, payload } = action;
    switch (type) {
        case actionTypes.GET__PACKAGE__PLANS:
            return { ...state, loadingPackagePlans: true };
        case actionTypes.GET__PACKAGE__PLANS__SUCCESS:
            return {
                ...state,
                packagePlans: payload.packagePlans,
                insurableCoins: payload.insurableCoins,
                paymentTokens: payload.paymentTokens,
                loadingPackagePlans: false,
            };
        case actionTypes.GET__PACKAGE__PLANS__FAILED:
            return { ...state, packagePlans: [], loadingPackagePlans: false };
        case actionTypes.GET__USER__PACKAGES:
            return { ...state, loadingUserPackages: true };
        case actionTypes.GET__USER__PACKAGES__SUCCESS:
            return {
                ...state,
                userPackages: payload.userPackages,
                loadingUserPackages: false,
            };
        case actionTypes.GET__USER__PACKAGES__FAILED:
            return { ...state, userPackages: [], loadingUserPackages: false };

        case actionTypes.REMOVE__USER__PACKAGE:
            const filteredPackages = state.userPackages.filter((item: IInsurancePackage) => item.packageId !== payload.packageId)
            return {...state, userPackages: filteredPackages}
        default:
            return state;
    }
};
