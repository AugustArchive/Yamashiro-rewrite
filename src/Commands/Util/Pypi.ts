import { YamashiroClient, Command, Context } from '../../Structures';
import { DiscordEmoji, Colors } from '../../Utils/Constants';
import { captureException } from '@sentry/node';
import { get } from 'wumpfetch';

interface PypiPackage {
    info: {
        author: string;
        author_email: string;
        bugtrack_url: any;
        classifiers: string[];
        description: string;
        description_content_type: string;
        docs_url: string | null;
        download_url: string;
        home_page: string;
        keywords: string;
        license: string;
        maintainer: string;
        maintainer_email: string;
        name: string;
        package_url: string;
        platform: string;
        project_url: string;
        release_url: string;
        requires_dist: string[];
        required_python: string;
        summary: string;
        version: string;
        project_urls: {
            Homepage: string;
        }
        downloads: {
            last_day: number;
            last_month: number;
            last_week: number;
        }
    }
}

export default class extends Command {
    constructor(bot: YamashiroClient) {
        super(bot, {
            name: 'pypi',
            description: 'Grabs information on a Python package',
            moduleID: 'util',
            usage: '<package>'
        });
    } 

    async run(ctx: Context) {
        if (ctx.args.isEmpty(0)) return void ctx.send(`${DiscordEmoji.ERROR} **| Missing the \`package\` argument.**`);

        let json: PypiPackage;
        try {
            const pkg = ctx.args.raw.map(arg => encodeURIComponent(arg)).join('+');
            const res = await get(`https://pypi.org/pypi/${pkg}/json`).send();
            json = res.json<PypiPackage>();
        } catch(ex) {
            this.bot.logger.error(`Unable to fetch a package from "pypi.org":\n${ex}`);
            captureException(ex);
            return void ctx.send(`${DiscordEmoji.HUH} **| Unable to get the package you requested...**`);
        }

        const embed = this.bot.getEmbed()
            .setAuthor(`| Package "${json.info.name}"`, json.info.project_urls.Homepage, this.bot.avatar)
            .setDescription(json.info.summary)
            .setColor(Colors.PYPI)
            .addField('Author', json.info.author || '???', true)
            .addField('Documentation URL', json.info.docs_url || '???', true)
            .addField('License', json.info.license || '???', true)
            .addField('Maintainer', json.info.maintainer || '???', true);

        return void ctx.embed(embed.build());
    }
}