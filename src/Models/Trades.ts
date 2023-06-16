import mongoose, { Schema, Document } from "mongoose";

interface Trade extends Document {
	type: string;
	user_id: number;
	symbol: string;
	shares: number;
	price: number;
	timestamp: number;
}

const TradeSchema: Schema = new Schema<Trade>({
	_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
	id: { type: Number, unique: true, default: 0 },
	type: { type: String, required: true },
	user_id: { type: Number, required: true },
	symbol: { type: String, required: true },
	shares: { type: Number, required: true },
	price: { type: Number, required: true },
	timestamp: { type: Number},
});

const TradeModel = mongoose.model<Trade>("Trade", TradeSchema);

export default TradeModel;
