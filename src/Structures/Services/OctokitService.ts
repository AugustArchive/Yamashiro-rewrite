import { get } from 'wumpfetch';

interface Commits {
    sha: string;
    node_id: string;
    url: string;
    html_url: string;
    comments_url: string;
    commit: {
        message: string;
        url: string;
        comment_count: number;
        author: {
            name: string;
            email: string;
            date: string;
        }
        commiter: {
            name: string;
            email: string;
            date: string;
        }
        tree: {
            sha: string;
            url: string;
        }
        verification: {
            verified: boolean;
            reason: string;
            signature: string | null;
            payload: any;
        }
    }
    author: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    }
    commiter: {
        login: string;
        id: number;
        node_id: string;
        avatar_url: string;
        gravatar_id: string;
        url: string;
        html_url: string;
        followers_url: string;
        following_url: string;
        gists_url: string;
        starred_url: string;
        subscriptions_url: string;
        organizations_url: string;
        repos_url: string;
        events_url: string;
        received_events_url: string;
        type: string;
        site_admin: boolean;
    }
    parents: {
        sha: string;
        url: string;
        html_url: string;
    }[];
}

export default class OctokitService {
    public baseUrl: string = 'https://api.github.com';
    async getCommits(limit: number = 5) {
        try {
            const res  = await get(`${this.baseUrl}/repos/auguwu/Yamashiro/commits`)
                .header({
                    'Accept': 'application/json'
                })
                .send();

            const info = res.json<Commits[]>();
            return info.slice(0, limit);
        } catch(ex) {
            return null;
        }
    }
}