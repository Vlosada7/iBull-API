import mongoose, { Schema, Document } from "mongoose";

interface Trade extends Document {
  id: number;
  type: string;
  user_id: number;
  symbol: string;
  shares: number;
  price: number;
  timestamp: number;
}

const TradeSchema: Schema = new Schema<Trade>(
  {
    _id: { type: Number, default: 0 },
    id: { type: Number, unique: true, default: 0 },
    type: { type: String, required: true },
    user_id: { type: Number, required: true },
    symbol: { type: String, required: true },
    shares: { type: Number, required: true },
    price: { type: Number, required: true },
    timestamp: { type: Number },
  },
  { _id: false }
);

TradeSchema.pre("save", function (next) {
  if (!this._id) {
    this._id = this.get("id");
  }
  next();
});

const TradeModel = mongoose.model<Trade>("Trade", TradeSchema, "trades");

export default TradeModel;
