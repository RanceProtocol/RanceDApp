import { IReferralReward } from "../entities";

interface IReferralStore {
    loadingReferralRecord: boolean | undefined;
    loadingreferralLink: boolean | undefined;
    referralRecord: IReferralReward[];
    referralLink: string | null;
    referrerAddress: string | null;
}

export default IReferralStore;
