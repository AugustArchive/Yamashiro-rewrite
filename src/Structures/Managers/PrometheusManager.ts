import { Gauge, Counter, register, collectDefaultMetrics } from 'prom-client';
import { Server, createServer } from 'http';
import { parse } from 'url';

export default class PrometheusManager {
    public commandsExecuted: Counter = new Counter({ name: 'yamashiro_commands_executed', help: 'How many commands were executed' });
    public playingPlayers: Gauge = new Gauge({ name: 'yamashiro_playing_players', help: 'How many players are playing a song' });
    public messageSeen: Counter = new Counter({ name: 'yamashiro_messages_seen', help: 'How many messages were seen by the bot' });
    public gatewayPing: Gauge = new Gauge({ name: 'yamashiro_gateway_ping', help: 'The gateway ping from Discord to Yamashiro' });
    public guildCount: Gauge = new Gauge({ name: 'yamashiro_guild_count', help: 'How many guilds Yamashiro is in' });
    public players: Gauge = new Gauge({ name: 'yamashiro_players', help: 'How many players were created or destroyed' });
    public server: Server = createServer((req, res) => {
        if (parse(req.url!).pathname === '/metrics') {
            res.writeHead(200, { 'Content-Type': register.contentType });
            res.write(register.metrics());
        }

        res.end();
    });

    constructor() { 
        collectDefaultMetrics();
    }
}