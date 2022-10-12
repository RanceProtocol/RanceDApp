import { Schema, model, models } from "mongoose";

const userReferralRecordSchema = new Schema({
    address: {
        type: String,
        required: [true, "user address cannot be blank"],
        unique: true,
        match: [/^0x[a-fA-F0-9]{40}$/, "invalid wallet address"],
    },
    code: {
        type: String,
        required: [true, "referral code cannot be blank"],
        unique: true,
        match: [/^[A-Za-z0-9_-]{15}$/, "invalid refferal code"],
    },
});

export default models.UserReferralRecord ||
    model("UserReferralRecord", userReferralRecordSchema);
