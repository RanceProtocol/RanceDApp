import { getDurationData } from "../../../constants/data";
import { RanceProtocol } from "../../../typechain";
import type {RanceProtocol as IRanceProtocol} from "../../../typechain/RanceProtocol"
import { structOutputToObject } from "../../../utils/helpers";
import { getCurrentTimestamp } from "../../../utils/time";
import { IInsurancePackage } from "../domain/entities";
import IInsuranceStore from "../domain/insuranceStore";

export const getUserPackages = async (contract: RanceProtocol, userAddress: string | null | undefined):Promise<Pick<IInsuranceStore, "userPackages">> => {

    if(!userAddress) return {userPackages: []} 

    try {
        const packagesLength = await contract.getUserPackagesLength(userAddress)
        const packages:IRanceProtocol.PackageStructOutput[] = await contract.getAllUserPackages(userAddress, 0, packagesLength)

        if(packages.length === 0) {
            return {userPackages: []}
        }
        const packagesPlansData:IRanceProtocol.PackagePlanStructOutput[] = await Promise.all(packages.map((item:IRanceProtocol.PackageStructOutput) => {
            return contract.planIdToPackagePlan(item.planId)
        }))

        const formatedObject = packages.map(
            (item: IRanceProtocol.PackageStructOutput) =>
                structOutputToObject(item)
        );

        const currentTimestamp = await getCurrentTimestamp()
        if(!currentTimestamp) {
            // if for some reason we can't get the current timeStamp (which is rare) theres no way to filter out packages that are still valid
            throw new Error("something went wrong whlle getting pack")
        }

        const userPackages = formatedObject.map((item:any, index:number):IInsurancePackage => {
            return {
                ...item,
                // endTimestamp: currentTimestamp,
                packagePlanName: getDurationData(packagesPlansData[index].periodInSeconds).name,
                duration: getDurationData(packagesPlansData[index].periodInSeconds).duration,
                timeUnitFull: getDurationData(packagesPlansData[index].periodInSeconds).timeUnitFull,
                uninsureFee: packagesPlansData[index].uninsureFee,
            }
        })

        const validUserPackages = userPackages.filter((item) =>  {
            const validUntil = item.endTimestamp +  (60 * 60 * 24 * 30) //additional 30 days
            return (validUntil > currentTimestamp && item.isCancelled === false)
        })
        
        return {userPackages: validUserPackages}

    } catch (error:any) {
        console.log("getUserPackages: ", error);
        throw new Error(error);
    }

}