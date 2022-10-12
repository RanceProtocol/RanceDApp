import { configureStore } from "@reduxjs/toolkit";
import IInsuranceStore from "../modules/insurance/domain/insuranceStore";
import { insuranceReducer } from "../modules/insurance/infrastructure/redux/reducer";
import IReferralStore from "../modules/referral/domain/interfaces/referralStore";
import { referralReducer } from "../modules/referral/infrastructure/redux/reducer";
import { IStakingStore } from "../modules/staking/domain/stakingStore";
import { stakingReducer } from "../modules/staking/infrastructure/redux/reducer";
import { ISharedState, sharedReducer } from "./shared/reducer";

export const store = configureStore({
    reducer: {
        sharedState: sharedReducer,
        insurance: insuranceReducer,
        staking: stakingReducer,
        referral: referralReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
            immutableCheck: false,
        }),
});

export interface IAppState {
    sharedState: ISharedState;
    insurance: IInsuranceStore;
    staking: IStakingStore;
    referral: IReferralStore;
}
