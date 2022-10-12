import { NextApiRequest, NextApiResponse } from "next";
import { getUserReferralAddress } from "../../../../server/userReferralInfo/domain/useCases/getUserReferralAddress";
import DBConnection from "../../../../server/userReferralInfo/infrastructure/dataSource/mongodb/DBConnection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(404);
    const code = req.query.code as string;
    if (!code)
        return res.status(400).json({ message: "referral code is required!" });

    try {
        const referralAddress = await getUserReferralAddress.execute(code);
        if (!referralAddress)
            return res
                .status(404)
                .json({ message: "No Record found for this code" });

        return res.status(200).json({ address: referralAddress });
    } catch (error: any) {
        res.status(error.status || 500).json({
            message: error.message || "An unknown error occured.",
        });
    }
};

export default DBConnection(handler);
