import { useSelector } from "react-redux";


export const useSharedStore = () => {
    return useSelector((state:any) => state.sharedState)
}