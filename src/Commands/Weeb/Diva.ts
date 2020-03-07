import { YamashiroClient, MeekCommand } from '../../Structures';

export default class extends MeekCommand {
    constructor(bot: YamashiroClient) {
        super(bot, 'diva');
    }
}