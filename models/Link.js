import pkg from 'mongoose';
const { Schema, model, Types } = pkg;

const schema = new Schema({
	from: { type: String, required: false },
	to: { type: String, required: true, unique: true},
	code: { type: String, required: true, unique: true },
	date: { type: Date, default: Date.now },
	clicks: { type: Number, default: 0 },
	owner: { type: Types.ObjectId, ref: 'User'}
});

export default model('Link', schema);