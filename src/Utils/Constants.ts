//* Constants
export const VERSION: string        = require('../../package.json').version;
export const USER_AGENT: string     = `Yamashiro/DiscordBot (https://github.com/auguwu/Yamashiro, v${VERSION})`;
export const COLOR: number          = 12883440;
export const SUPPORT_SERVER: string = 'https://discord.gg/yDnbEDH';
export const GITHUB_URL: string     = 'https://github.com/auguwu/Yamashiro';

//* Enumeral Values
export enum DiscordEvent {
    READY               = 'ready',
    MESSAGE             = 'messageCreate',
    SHARD_READY         = 'shardReady',
    SHARD_RESUME        = 'shardResume',
    GUILD_JOINED        = 'guildCreate',
    GUILD_DELETED       = 'guildDelete',
    MESSAGE_DELETED     = 'messageDelete',
    SHARD_DISCONNECT    = 'shardDisconnect',
    GUILD_MEMBER_JOINED = 'guildMemberAdd'
}

export enum ActivityType {
    PLAYING,
    STREAMING,
    LISTENING,
    WATCHING
}

export enum Colors {
    OSU       = 16737962,
    AZUR_LANE = 11591910,
    TWITCH    = 6570405,
    GITHUB    = 819,
    KITSU     = 16614176,
    REDDIT    = 16729344,
    PYPI      = 16765506,
    PATREON   = 16345172,
    DERPY     = 3447003,
    BUILDER   = 16738740,
    SPEY      = 7589063,
    EMILLIA   = 6684876
}

export enum DiscordEmoji {
    ERROR   = '<:xmark:464708589123141634>',
    OK      = ':ok_hand:',
    SUCCESS = '<:success:464708611260678145>',
    HUH     = ':question:',
    MEMO    = ':pencil:',
    INFO    = ':information_source:',
    TADA    = ':tada:',
    LOADING = '<a:loading:642810145927331845>'
}

export enum ActivityStatus {
    ONLINE  = 'online',
    OFFLINE = 'offline',
    DND     = 'dnd',
    IDLE    = 'away'
}

export enum Permissions {
    createInstantInvite = 'Create Instant Invite',
    kickMembers = 'Kick Members',
    banMembers = 'Ban Members',
    administrator = 'Administrator',
    manageChannels = 'Manage Channels',
    manageGuild = 'Manage Server',
    addReactions = 'Add Reactions',
    viewAuditLogs = 'View Audit Log',
    voicePrioritySpeaker = 'Priority Speaker',
    readMessages = 'Read Messages',
    sendMessages = 'Send Messages',
    sendTTSMessages = 'Send TTS Messages',
    manageMessages = 'Manage Messages',
    embedLinks = 'Embed Links',
    attachFiles = 'Attach Files',
    readMessageHistory = 'Read Message History',
    mentionEveryone = 'Mention Everyone',
    externalEmojis = 'Use External Emojis',
    voiceConnect = 'Connect',
    voiceSpeak = 'Speak',
    voiceMuteMembers = 'Mute Members',
    voiceDeafenMembers = 'Deafen Members',
    voiceMoveMembers = 'Move Members',
    voiceUseVAD = 'Use Voice Activity',
    changeNickname = 'Change Nickname',
    manageNicknames = 'Manage Nicknames',
    manageRoles = 'Manage Roles',
    manageWebhooks = 'Manage Webhooks',
    manageEmojis = 'Manage Emojis',
    all = 'All',
    allGuild = 'All Server',
    allText = 'All Text',
    allVoice = 'All Voice'
}

//* Objects
export const GroupEmojis = {
    core: ':information_source:',
    fun: ':rofl:',
    misc: ':shield:',
    util: ':gear:',
    weeb: '<:SayoriDerp:592287016256012289>',
    system: ':wrench:',
    upvoter: '<:hmph:459410890802855936>',
    images: ':frame_photo: '
};