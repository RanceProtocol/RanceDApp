import { useSelector } from "react-redux"
import { IAppState } from "../../../../appState"
import { IStakingStore } from "../../domain/stakingStore"

export const stakingState = ():IStakingStore => {
    return useSelector((state:IAppState) => state.staking)
}