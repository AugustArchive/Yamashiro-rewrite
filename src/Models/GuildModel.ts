import { Schema, Document, model as __model__ } from 'mongoose';

export interface GuildModel extends Document {
    guildID: string;
    prefix: string;
    disabledCommands: string[];
    disabledModules: string[];
    autoroles: string[];
    subscriptionRoles: string[];
    snipes: boolean;
}

const schema = new Schema({
    guildID: String,
    prefix: String,
    disabledCommands: {
        type: Array,
        default: []
    },
    disabledModules: {
        type: Array,
        default: []
    },
    autoroles: {
        type: Array,
        default: []
    },
    subscriptionRoles: {
        type: Array,
        default: []
    },
    snipes: {
        type: Boolean,
        default: true
    }
});

export default __model__<GuildModel>('guilds', schema, 'guilds');