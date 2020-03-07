import { captureException } from '@sentry/node';
import YamashiroClient from '../Entities/Client';
import Logger from '../Logging/Logger';
import Model from '../../Models/GuildModel';

export default class GuildRepository {
    private logger: Logger = new Logger();
    constructor(private bot: YamashiroClient) {}

    async get(id: string) {
        const model = await Model.findOne({ guildID: id }).exec();
        if (!model || model === null) return this.create(id);
        return model!;
    }

    create(id: string) {
        const query = new Model({
            guildID: id,
            prefix: this.bot.config.discord.prefix
        });

        this.logger.mongodb(`New configuration for guild ${id} has been created.`);
        query.save();
        return query;
    }

    remove(id: string) {
        return Model.findOne({ guildID: id }).remove().exec();
    }

    update(id: string, doc: { [x: string]: any }) {
        return Model.updateOne({ guildID: id }, doc, (error) => {
            if (error) {
                this.logger.error(`Unable to update guild ${id}'s configuration\n${error}`);
                captureException(error);
                return;
            }
        });
    }

    getDocuments() {
        return Model.find({}).exec();
    }
}