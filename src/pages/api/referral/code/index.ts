import { NextApiRequest, NextApiResponse } from "next";
import { getUserreferralCode } from "../../../../server/userReferralInfo/domain/useCases/getUserReferralCode";
import DBConnection from "../../../../server/userReferralInfo/infrastructure/dataSource/mongodb/DBConnection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "GET") return res.status(404);
    const address = req.query.address as string;

    if (!address)
        return res.status(400).json({ message: "user address is required!" });

    try {
        const referralCode = await getUserreferralCode.execute(address);

        if (!referralCode)
            return res
                .status(404)
                .json({ message: "No Record found for this user address" });

        res.status(200).json({ code: referralCode });
    } catch (error: any) {
        res.status(error.code || 500).json({
            message: error.message || "An unknown error occured.",
        });
    }
};

export default DBConnection(handler);
