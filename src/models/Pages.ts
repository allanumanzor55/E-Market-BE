import { Schema, model } from "mongoose";
import { IPage } from "../types";

const pageSchema = new Schema<IPage>({
  title: {
    type: String,
    required: true,
  },
  directoryName: { type: String, required: true },
  icon: String,
});

export default model<IPage>("page", pageSchema);
