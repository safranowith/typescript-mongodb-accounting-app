import mongoose from 'mongoose';

const dataSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true }
});

const DataModel = mongoose.model('Data', dataSchema);

export { DataModel };