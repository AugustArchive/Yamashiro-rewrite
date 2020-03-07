import { Client as DiscordClient } from 'eris';
import CommandStatisticsManager from '../Managers/CommandStatisticsManager';
import RedisClient, { Redis } from 'ioredis';
import { COLOR, VERSION } from '../../Utils/Constants';
import PrometheusManager from '../Managers/PrometheusManager';
import DatabaseManager from '../Managers/DatabaseManager';
import GuildRepository from '../Repositories/GuildRepository';
import CommandManager from '../Managers/CommandManager';
import OctokitService from '../Services/OctokitService';
import WebhookClient from './WebhookClient';
import EventManager from '../Managers/EventManager';
import EmbedBuilder from './EmbedBuilder';
import { execSync } from 'child_process';
import SnipeService from '../Services/SnipeService';
import TaskManager from '../Managers/TaskManager';
import RESTClient from './RESTClient';
import Logger from '../Logging/Logger';

export interface Configuration {
    environment: 'dev' | 'prod';
    databaseUrl: string;
    webhookUrl: string;
    sentryDSN: string;
    apiKey: string;
    discord: {
        prefix: string;
        token: string;
    }
    redis: {
        host: string;
        port: number;
    }
    apis: {
        august: string;
        builder: string;
        chewey: string;
        omdb: string;
        ppy: string;
        twitch: string;
        igdb: string;
        wordnik: string;
    }
    botlists: {
        mythical: string;
        unto: string;
        oliy: string;
        luke: string;
        bfd: string;
        dbb: string;
    }
}

interface ShardInfo {
    latency: number;
    guilds: number;
    status: string;
    users: number;
    id: number;
}

export default class YamashiroClient extends DiscordClient {
    public statistics: CommandStatisticsManager;
    public prometheus: PrometheusManager;
    public database: DatabaseManager;
    public manager: CommandManager;
    public webhook: WebhookClient;
    public events: EventManager;
    public config: Configuration;
    public admins: string[] = ['280158289667555328', '130442810456408064'];
    public logger: Logger = new Logger();
    public tasks: TaskManager;
    public redis: Redis;
    public rest: RESTClient;

    constructor(config: Configuration) {
        super(config.discord.token, {
            maxShards: 'auto',
            disableEveryone: true,
            compress: true,
            defaultImageFormat: 'png',
            defaultImageSize: 1024
        });

        this.statistics = new CommandStatisticsManager();
        this.prometheus = new PrometheusManager();
        this.database   = new DatabaseManager(config.databaseUrl);
        this.manager    = new CommandManager(this);
        this.webhook    = new WebhookClient(config.webhookUrl);
        this.events     = new EventManager(this);
        this.config     = config;
        this.tasks      = new TaskManager(this);
        this.rest       = new RESTClient(this);

        this.redis = new RedisClient({
            port: config.redis.port,
            host: config.redis.host,
            db: 3
        });
    }

    get settings() {
        return new GuildRepository(this);
    }

    get ping() {
        return this.shards.reduce((prev, curr) => prev + curr.latency, 0);
    }

    get invite() {
        return `https://discordapp.com/oauth2/authorize?client_id=${this.user.id}&scope=bot`;
    }

    get avatar() {
        return this.user.dynamicAvatarURL('png', 1024);
    }

    get commit() {
        const txt = execSync('git rev-parse HEAD').toString().trim();
        return txt.slice(0, 7);
    }

    get snipes() {
        return new SnipeService(this);
    }

    get octokit() {
        return new OctokitService();
    }

    async start() {
        this.logger.info('Now starting Yamashiro...');
        await this.sleep(5000);

        this.manager.start();
        this.events.start();
        this.tasks.start();
        this.database.connect();
        this.redis.connect().catch(OwO => {});
        await super.connect()
            .then(() => this.logger.debug('Now connecting to Discord via WebSocket... See ya in a bit~'));
    }

    sleep(delay: number) {
        return new Promise((resolve) => setTimeout(resolve, delay));
    }

    getEmbed() {
        return new EmbedBuilder()
            .setColor(COLOR)
            .setFooter(`Created by auguwu#5820 | v${VERSION} (${this.commit})`);
    }

    getShardInfo(id: number): ShardInfo | null {
        const shard = this.shards.get(id);
        if (!shard) return null;

        const guilds = this.guilds.filter((guild) => guild.shard.id === shard.id);
        const users  = guilds.reduce((prev, curr) => prev + curr.memberCount, 0);
        let status: string = 'Disconnected';

        switch (shard.status) {
            case 'disconnected': {
                status = 'Disconnected';
                break;
            }

            case 'connecting':
            case 'handshaking': {
                status = 'Awaiting Connection';
                break;
            }

            case 'ready': {
                status = 'Connected';
                break;
            }
        }

        return {
            latency: shard.latency,
            guilds: guilds.length,
            status,
            users,
            id
        };
    }
}