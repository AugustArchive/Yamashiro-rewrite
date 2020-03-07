import { YamashiroClient, Task } from '../Structures';

export default class GatewayPingTask extends Task {
    constructor(bot: YamashiroClient) {
        super(bot, {
            interval: 60000,
            name: 'gateway.ping'
        });
    }

    async run() {
        this.bot.logger.info(`Gateway Ping (sent to Prometheus): ${this.bot.ping}ms`);
        this.bot.prometheus.gatewayPing.set(this.bot.ping);
    }
}