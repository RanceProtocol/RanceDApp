import { NextApiRequest, NextApiResponse } from "next";
import { createUserReferralInfo } from "../../../../server/userReferralInfo/domain/useCases/createUserReferralInfo";
import DBConnection from "../../../../server/userReferralInfo/infrastructure/dataSource/mongodb/DBConnection";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") return res.status(404);

    const { message, signature, address } = req.body;
    if (!message || !signature || !address)
        return res
            .status(400)
            .json({
                message: "message, signature and address are all required!",
            });

    try {
        const referralInfo = await createUserReferralInfo.execute(
            message,
            signature,
            address
        );
        return res.status(200).json(referralInfo);
    } catch (error: any) {
        res.status(error.code || 500).json({
            message: error.message || "An unknown error occured.",
        });
    }
};

export default DBConnection(handler);
