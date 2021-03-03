import pkg from 'mongoose';
const { Schema, model, Types } = pkg;

const schema = new Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	link: [{ type: Types.ObjectId, ref: 'Link' }]
});

export default model('User', schema);