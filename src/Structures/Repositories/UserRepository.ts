import { captureException } from '@sentry/node';
import Logger from '../Logging/Logger';
import Model from '../../Models/UserModel';

export default class UserRepository {
    private logger: Logger = new Logger();

    async get(userID: string) {
        const user = await Model.findOne({ userID }).exec();
        if (!user || user === null) return this.create(userID);
        return user!;
    }

    create(userID: string) {
        const query = new Model({
            userID,
            premium: false,
            backgroundUrl: 'https://augu.dev/images/background.jpg',
            tier: 0,
            blacklisted: false,
            region: 'USA',
            navalBase: {
                name: null,
                description: null,
                members: [],
                ships: []
            }
        });

        query.save();
        return query;
    }

    update(userID: string, doc: { [x: string]: any }) {
        return Model.updateOne({ userID }, doc, (error) => {
            if (error) {
                this.logger.error(`Unable to update "${userID}"'s settings\n${error}`);
                captureException(error);
            }
        });
    }
}