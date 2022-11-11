import { model, Schema } from "mongoose";
import { ICompany } from "../types";
import { MONGOOSE_REQUIRED_STRING } from "../utils/constants";

const companySchema = new Schema<ICompany>({
  name: { ...MONGOOSE_REQUIRED_STRING, unique: true },
  slogan: MONGOOSE_REQUIRED_STRING,
  description: MONGOOSE_REQUIRED_STRING,
  location: MONGOOSE_REQUIRED_STRING,
  logo: MONGOOSE_REQUIRED_STRING,
  pages: [{ type: Schema.Types.ObjectId, ref: "page" }],
  employees: [{ type: Schema.Types.ObjectId, ref: "user" }],
  plan: { type: Schema.Types.ObjectId, ref: "plan" },
});

export default model<ICompany>("company", companySchema);
