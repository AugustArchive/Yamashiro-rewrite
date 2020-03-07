import { Document, Schema, model as __model__ } from 'mongoose';

export interface UserModel extends Document {
    userID: string;
    premium: boolean;
    backgroundUrl: string;
    tier: number;
    blacklisted: boolean;
}

const schema = new Schema({
    userID: String,
    premium: {
        type: Boolean,
        default: false
    },
    backgroundUrl: {
        type: String,
        default: null
    },
    tier: {
        type: Number,
        default: 0
    },
    blacklisted: {
        type: Boolean,
        default: false
    }
});

export default __model__<UserModel>('users', schema, 'users');