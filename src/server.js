//* why is this in JavaScript?
//* because fastify's types are fucking disgusting to do
//* and TS can compile JS -> JS for some reason...
const { default: GuildModel } = require('./Models/GuildModel');
const { captureException }    = require('@sentry/node');
const { readFileSync }        = require('fs');
const { humanize }            = require('@yamashiro/modules');
const { safeLoad }            = require('js-yaml');
const { Logger }              = require('./Structures');
const { sep }                 = require('path');
const fastify                 = require('fastify');

const _yml   = readFileSync(`${process.cwd()}${sep}config.yml`);
/** @type {import('./Structures/Entities/Client').Configuration} */
const config = safeLoad(_yml.toString());
const logger = new Logger();
const server = fastify();

/**
 * Creates the server
 * @param {import('./Structures').YamashiroClient} bot The bot instance
 * @param {number} port The port to locate at
 */
const createServer = async(bot, port) => {
    logger.debug('Fastify server has been created~');
    server
        .get('/', (_, reply) => reply.send({ success: true, statusCode: 200, message: 'Hello! Why are you here?' }))
        .get('/guild/:id', (req, reply) => {
            if (!req.params.id) return reply.send({
                statusCode: 500,
                success: false,
                message: 'No "id" paramater was found.'
            });

            if (!req.headers['Authorization']) return reply.send({
                success: false,
                statusCode: 403,
                message: 'No "Authorization" header was not provided'
            });

            if (req.headers['Authorization'] !== bot.config.apiKey) return reply.send({
                success: false,
                statusCode: 401,
                message: 'Invalid key.'
            });

            const guild = bot.guilds.get(req.params.id);
            if (!guild) return reply.send({
                statusCode: 500,
                success: false,
                message: `No guild by id: "${req.params.id}" was not found.`
            });

            return reply.send({
                statusCode: 200,
                success: true,
                data: guild.toJSON()
            });
        })
        .get('/command/:name', (req, reply) => {
            if (!req.params.name) return reply.send({
                statusCode: 500,
                success: false,
                message: 'No "name" paramater was found.'
            });

            if (!req.headers['Authorization']) return reply.send({
                success: false,
                statusCode: 403,
                message: 'No "Authorization" header was not provided'
            });

            if (req.headers['Authorization'] !== bot.config.apiKey) return reply.send({
                success: false,
                statusCode: 401,
                message: 'Invalid key.'
            });

            const cmds = bot.manager.commands.filter(cmd =>
                cmd.name === req.params.name && cmd.module.id !== 'system'
            );

            if (!cmds.length) return reply.send({
                statusCode: 500,
                success: false,
                message: `Command "${req.params.name}" was not found.`
            });

            return reply.send({
                statusCode: 200,
                success: true,
                data: JSON.stringify(cmds[0])
            });
        })
        .get('/module/:name', (req, reply) => {
            if (!req.params.name) return reply.send({
                statusCode: 500,
                success: false,
                message: 'No "name" paramater was found.'
            });

            if (!req.headers['Authorization']) return reply.send({
                success: false,
                statusCode: 403,
                message: 'No "Authorization" header was not provided'
            });

            if (req.headers['Authorization'] !== bot.config.apiKey) return reply.send({
                success: false,
                statusCode: 401,
                message: 'Invalid key.'
            });

            const mods = bot.manager.modules.filter(mod =>
                mod.name !== 'system' && mod.name === req.params.name
            );

            if (!mods.length) return reply.send({
                statusCode: 500,
                success: false,
                message: `Module "${req.params.name}" was not found.`
            });

            return reply.send({
                statusCode: 200,
                success: true,
                data: JSON.stringify(mods[0])
            });
        })
        .get('/setting/:id', async(req, reply) => {
            if (!req.params.id) return reply.send({
                statusCode: 500,
                success: false,
                message: 'No "id" paramater was found.'
            });

            if (!req.headers['Authorization']) return reply.send({
                success: false,
                statusCode: 403,
                message: 'No "Authorization" header was not provided'
            });

            if (req.headers['Authorization'] !== bot.config.apiKey) return reply.send({
                success: false,
                statusCode: 401,
                message: 'Invalid key.'
            });

            const model = await GuildModel.findOne({ guildID: req.params.id }).exec();
            if (!model || model === null) return reply.send({
                statusCode: 500,
                success: false,
                message: `No guild by "${req.params.id}" was not found in the database.`
            });

            return reply.send({
                statusCode: 200,
                success: true,
                data: model
            });
        })
        .post('/setting/:id', async(req, reply) => {
            if (!req.params.id) return reply.send({
                statusCode: 500,
                success: false,
                message: 'No "id" paramater was found.'
            });

            if (!req.headers['Authorization']) return reply.send({
                statusCode: 500,
                success: false,
                message: 'No "Authorization" header was not provided.'
            });

            if (req.headers['Authorization'] !== config.apiKey) return reply.send({
                statusCode: 403,
                success: false,
                message: 'Invalid key.'
            });

            const guild = bot.guilds.get(req.params.id);

            if (!guild) return reply.send({
                statusCode: 500,
                success: false,
                message: `Unable to find guild: ${req.params.id}`
            });

            if (!req.body) return reply.send({
                statusCode: 500,
                success: false,
                message: 'No body was provided.'
            });

            //* Check for boolean values
            if (req.body.snipes && (req.body.snipes !== 'true' && req.body.snipes !== 'false')) return reply.send({
                statusCode: 500,
                success: false,
                message: 'Malformed body'
            });

            //todo: add this for subscriptions and autoroles
            await bot.settings.update(req.params.id, {
                $set: {
                    'snipes': req.body.snipes === 'true'
                }
            });

            return reply.send({
                statusCode: 200,
                success: true
            });
        })
        .get('/permissions/:guild/:user', (req, reply) => {
            if (!req.params.guild) return reply.send({
                success: false,
                statusCode: 500,
                message: 'No guild ID was not provided.'
            });

            if (!req.params.user) return reply.send({
                success: false,
                statusCode: 500,
                message: 'No user ID was not provided.'
            });

            if (!req.headers['Authorization']) return reply.send({
                success: false,
                statusCode: 403,
                message: 'No "Authorization" header was not provided'
            });

            if (req.headers['Authorization'] !== bot.config.apiKey) return reply.send({
                success: false,
                statusCode: 401,
                message: 'Invalid key.'
            });

            const guild = bot.guilds.get(req.params.guild);
            if (!guild) return reply.send({
                success: false,
                statusCode: 500,
                message: `Guild by "${req.params.guild}" was not found.`
            });

            const member = guild.members.get(req.params.user);
            if (!member) return reply.send({
                success: false,
                statusCode: 500,
                message: `Member by "${req.params.user}" doesn't exist in guild ${guild.name}`
            });

            const perms = member.permission.has('manageGuild');
            if (!perms) return reply.send({ success: false, statusCode: 401 });
            return reply.send({ success: true, statusCode: 200 });
        })
        .get('/statistics', (_, reply) => {
            const mostUsed = bot.statistics.getMostUsedCommand();
            return reply.send({
                guilds: bot.guilds.size,
                users: bot.users.size,
                channels: Object.keys(bot.channelGuildMap).size,
                shards: bot.shards.size,
                uptime: humanize(Date.now() - bot.startTime, { long: true }),
                avgShardLatency: `${bot.ping}ms`,
                mostUsedCommand: `${mostUsed.command} (${mostUsed.uses} executions)`,
                commandsExecuted: bot.statistics.commandsExecuted,
                messageSeen: bot.statistics.messagesSeen
            });
        })
        .get('/shards', (_, reply) => {
            const shards = bot.shards.map(shard => bot.getShardInfo(shard));
            return reply.send({
                success: true,
                statusCode: 200,
                data: shards
            });
        });

    server.listen(port, (error, address) => {
        if (error) {
            logger.error(`uh oh stinky!\n${error}`);
            captureException(error);
            return;
        }

        logger.debug(`Webserver is now located at ${address}`);
    });
};

module.exports = createServer;