import * as actionTypes from "./actionTypes";
import { Dispatch } from "react";

export const toggleWalletModal = (dispatch: Dispatch<{ type: string }>) => {
    dispatch({ type: actionTypes.TOGGLE_WALLET_MODAL });
};

export const toggleAccountModal = (dispatch: Dispatch<{ type: string }>) => {
    dispatch({ type: actionTypes.TOGGLE_ACCOUNT_MODAL });
};
