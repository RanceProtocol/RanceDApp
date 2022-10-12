import * as actionTypes from "./actionTypes"

export interface ISharedState {
    walletModalOpened: boolean
    accountModalOpened: boolean
}

const initialState:ISharedState = {
    walletModalOpened: false,
    accountModalOpened: false
}

export const sharedReducer = (state = initialState, action:{type: string, payload?:any}):ISharedState => {
    const {type, payload} = action
    switch (type) {
        case actionTypes.TOGGLE_WALLET_MODAL:
            return {...state, walletModalOpened: !state.walletModalOpened}
        case actionTypes.TOGGLE_ACCOUNT_MODAL:
            return {...state, accountModalOpened: !state.accountModalOpened}
        default:
            return state;
    }
}