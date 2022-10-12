import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

const DBConnection =
    (handler: any) => async (req: NextApiRequest, res: NextApiResponse) => {
        if (mongoose.connections[0].readyState) {
            // Use current db connection
            return handler(req, res);
        }
        // Use new db connection
        await mongoose.connect(process.env.db_connection_string as string);

        return handler(req, res);
    };

export default DBConnection;
