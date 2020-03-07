import { YamashiroClient, DerpyCommand } from '../../Structures';

export default class extends DerpyCommand {
    constructor(bot: YamashiroClient) {
        super(bot, 'takagi');
    }
}