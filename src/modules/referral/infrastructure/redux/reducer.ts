import IReferralStore from "../../domain/interfaces/referralStore";
import * as actionTypes from "./actionTypes";

const initialState: IReferralStore = {
    loadingReferralRecord: undefined,
    loadingreferralLink: undefined,
    referralRecord: [],
    referralLink: null,
    referrerAddress: null,
};

export const referralReducer = (
    state = initialState,
    action: { type: string; payload?: any }
): IReferralStore => {
    const { type, payload } = action;
    switch (type) {
        case actionTypes.GET__REFERRAL__LINK:
            return { ...state, loadingreferralLink: true };

        case actionTypes.GET__REFERRAL__LINK__SUCCESS:
            return {
                ...state,
                referralLink: payload.referralLink,
                loadingreferralLink: false,
            };

        case actionTypes.GET__REFERRAL__LINK__FAILED:
            return {
                ...state,
                loadingreferralLink: false,
            };

        case actionTypes.SET__REFERRER__ADDRESS:
            return {
                ...state,
                referrerAddress: payload.referrerAddress,
            };
        case actionTypes.GET__REFERRAL__RECORD:
            return { ...state, loadingReferralRecord: true };

        case actionTypes.GET__REFERRAL__RECORD__SUCCESS:
            return {
                ...state,
                referralRecord: payload.referralRecord,
                loadingReferralRecord: false,
            };
        case actionTypes.GET__REFERRAL__RECORD__FAILED:
            return { ...state, loadingReferralRecord: false };

        case actionTypes.UPDATE__CLAIMED__REWARD:
            const newReferralRecord = state.referralRecord.map((record) => {
                if (record.id === payload.id)
                    return { ...record, claimed: true };
                return record;
            });
            return { ...state, referralRecord: newReferralRecord };

        case actionTypes.GENERATING__REFERRAL__LINK:
            return { ...state, loadingreferralLink: true };

        case actionTypes.GENERATE__REFERRAL__LINK__SUCCESS:
            return {
                ...state,
                loadingreferralLink: false,
                referralLink: payload.referralLink,
            };

        case actionTypes.GENERATE__REFERRAL__LINK__FAILED:
            return { ...state, loadingreferralLink: false };

        default:
            return state;
    }
};
