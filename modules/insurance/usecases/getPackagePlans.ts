import { getDurationData } from "../../../constants/data";
import { RanceProtocol } from "../../../typechain";
import type { RanceProtocol as IRanceProtocol } from "../../../typechain/RanceProtocol";
import { structOutputToObject } from "../../../utils/helpers";
import IInsuranceStore from "../domain/insuranceStore";

export const getPackagePlans = async (
    contract: RanceProtocol
): Promise<
    Pick<IInsuranceStore, "packagePlans" | "insurableCoins" | "paymentTokens">
> => {
    try {
        const packagePlansLength = await contract.getPackagePlansLength();
        const plans: IRanceProtocol.PackagePlanStructOutput[] = (
            await contract.getAllPackagePlans(0, packagePlansLength)
        ).filter((plan) => plan.isActivated);

        const formatedObject = plans.map(
            (item: IRanceProtocol.PackagePlanStructOutput) =>
                structOutputToObject(item)
        );
        const packagePlansCompleteData = formatedObject.map((item) => {
            return { ...item, ...getDurationData(item.periodInSeconds) };
        });

        const insureCoinLength = await contract.getInsureCoinsLength();
        const insurableCoinsNames: string[] = await contract.getInsureCoins(
            0,
            insureCoinLength
        );

        const insurableCoinsEntries: string[][] = await Promise.all(
            insurableCoinsNames.map(async (name) => [
                name,
                await contract.insureCoinNameToAddress(name),
            ])
        );
        const insurableCoinsObject = Object.fromEntries(insurableCoinsEntries);

        const paymentTokenLength = await contract.getPaymentTokensLength();

        const paymentTokensNames: string[] = await contract.getPaymentTokens(
            0,
            paymentTokenLength
        );

        const paymentTokensEntries: string[][] = await Promise.all(
            paymentTokensNames.map(async (name) => [
                name,
                await contract.paymentTokenNameToAddress(name),
            ])
        );

        const paymentTokensObject = Object.fromEntries(paymentTokensEntries);

        return {
            insurableCoins: insurableCoinsObject,
            paymentTokens: paymentTokensObject,
            packagePlans: packagePlansCompleteData,
        };
    } catch (error: any) {
        console.log(error);
        throw new Error(error);
    }
};
