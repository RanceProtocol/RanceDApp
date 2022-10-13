import { useSelector } from "react-redux";
import { IAppState } from "../../../../appState";
import IReferralStore from "../../domain/interfaces/referralStore";

export const referralState = (): IReferralStore => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector((state: IAppState) => state.referral);
};
