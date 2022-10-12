import { useSelector } from "react-redux";
import { IAppState } from "../../../../appState";
import IInsuranceStore from "../../domain/insuranceStore";

export const insuranceState = (): IInsuranceStore => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useSelector((state: IAppState) => state.insurance);
};
