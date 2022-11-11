import { Schema, model } from "mongoose";
import { IUser } from "../types";
import { MONGOOSE_REQUIRED_STRING } from "../utils/constants";

const userSchema = new Schema<IUser>({
  name: MONGOOSE_REQUIRED_STRING,
  company: {
    id: {
      type: Schema.Types.ObjectId,
      ref: "company",
    },
    name: String,
  },
  email: { ...MONGOOSE_REQUIRED_STRING, unique: true },
  profilePic: String,
  password: MONGOOSE_REQUIRED_STRING,
  role: MONGOOSE_REQUIRED_STRING,
  lastLogin: Number,
});

export default model<IUser>("user", userSchema);
