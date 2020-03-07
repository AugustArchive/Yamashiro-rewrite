import { TextChannel, Message, Emoji, Role } from 'eris';
import { Collection } from '@augu/immutable';

export default class ReactionEmoji {
    public animated: boolean;
    public message: Message;
    public roles: Collection<Role> = new Collection('emoji:roles');
    public name: string;
    public id: string;

    constructor(message: Message, base: Emoji) {
        this.animated = base.animated;
        this.message  = message;
        this.name     = base.name;
        this.id       = base.id;

        //* Add roles to the collection
        base.roles.forEach((roleID) => {
            const role = (message.channel as TextChannel).guild.roles.get(roleID);
            if (!role) return;

            this.roles.set(roleID, role);
        });
    }
}