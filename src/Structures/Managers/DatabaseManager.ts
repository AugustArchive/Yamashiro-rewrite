import { Admin } from 'mongodb';
import mongoose from 'mongoose';
import Logger from '../Logging/Logger';
import Users from '../Repositories/UserRepository';

interface BuildInfo {
    version: string;
    gitVersion: string;
    modules: any[];
    allocator: string;
    javascriptEngine: string;
    sysInfo: 'deprecated';
    versionArray: number[];
    debug: false;
    maxBsonObjectSize: number;
    storageEngines: string[];
    ok: number;
    openssl: { running: string; compiled: string; }
    buildEnvironment: {
        distmod: string;
        distarch: string;
        cc: string;
        ccflags: string;
        cxx: string;
        linkflags: string;
        target_arch: string;
        target_os: string;
    }
}

export default class DatabaseManager {
    public logger: Logger = new Logger();
    public build!: BuildInfo;
    public admin!: Admin;
    public url: string;
    public m!: typeof mongoose;

    constructor(url: string) {
        this.url = url;
    }

    get users() {
        return new Users();
    }

    async connect() {
        this.m = await mongoose.connect(this.url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            autoIndex: false
        });

        this.m.connection.on('error', (error) => this.logger.mongodb(error));
        this.logger.mongodb(`Established connection to MongoDB with url ${this.logger.colors.gray(this.url)}`);
    }

    async getBuild() {
        if (!this.admin) this.admin = this.m.connection.db.admin();
        if (!this.build) this.build = await this.admin.buildInfo();
        return this.build;
    }

    async disconnect() {
        try {
            this.logger.mongodb('Now disconnecting from MongoDB...');
            await this.m.disconnect();
        } catch(ex) {
            //* weird flex but ok
            this.logger.mongodb(`Unable to disconnect from MongoDB:\n${ex}`);
        }
    }
}