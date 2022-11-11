import { Schema, model } from "mongoose";
import { IPlan } from "../types";

const PlanSchema = new Schema<IPlan>({
  name: {
    type: String,
    required: true,
  },
  slogan: {
    type: String,
    required: true,
  },
  icon: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  include: [{
    icon: { type: String, required: true },
    description: { type: String, required: true },
  }],
});

export default model<IPlan>("plan", PlanSchema);
