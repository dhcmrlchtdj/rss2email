import Feed from "../models/feed";
import fetch from "node-fetch";
import parseFeed, { FeedItem } from "../utils/parse-feed";
import sendEmail from "../utils/send-email";

type Tfeeds = {
    feed: Feed;
    prev: FeedItem[];
    curr: FeedItem[];
    currText: string;
};
type Tentries = {
    feed: Feed;
    entries: Array<{
        URL: string;
        title: string;
        content: string;
    }>;
};
type Tmail = {
    addr: string;
    subject: string;
    text: string;
};

const feed2feeds = async (feed: Feed): Promise<Tfeeds | null> => {
    const url = feed.url;
    const curr = await fetch(url).then(res => res.text());

    if (curr === feed.content) return null;

    let prevFeed: FeedItem[] = [];
    if (feed.content) prevFeed = await parseFeed(url, feed.content);
    const currFeed = await parseFeed(url, curr);
    return {
        feed,
        prev: prevFeed,
        curr: currFeed,
        currText: curr,
    };
};

const feeds2entries = async (feeds: Tfeeds): Promise<Tentries | null> => {
    const prevId = feeds.prev.map(m => [m.guid, m.date] as [string, Date]);
    const prevMap = new Map(prevId);
    const entries = feeds.curr
        .filter(m => {
            const date = prevMap.get(m.guid);
            if (!date) return true;
            if (date !== m.date) return true;
            return false;
        })
        .map(m => {
            const title = m.title || "unknown";
            const author = m.author || m.meta.author || "unknown";
            const site = m.meta.title || "unknown";
            return {
                URL: m.origlink || m.link || m.meta.link || feeds.feed.url,
                title: `${title} by ${author} at ${site}`,
                content: m.description || m.summary || "unknown content",
            };
        });
    if (entries.length === 0) return null;
    return { feed: feeds.feed, entries };
};

const entries2mails = async (entries: Tentries): Promise<Tmail[]> => {
    const users = entries.feed.users;
    const mails = entries.entries.map(entry => {
        const ms = users.map(user => ({
            addr: user.email,
            subject: entry.title,
            text: entry.content,
        }));
        return ms;
    });
    const flatten = ([] as Tmail[]).concat(...mails);
    return flatten;
};

export const cron = {
    auth: "cron",
    async handler(_request, _h) {
        const feeds = await Feed.takeAll();
        feeds.forEach(async feed => {
            // fetch feed
            const f = await feed2feeds(feed);
            if (!f) return;

            // save new feed
            feed.content = f.currText;
            feed.lastUpdated = new Date();
            if (f.prev.length === 0) {
                await feed.save();
                return;
            }

            // extract entry
            const e = await feeds2entries(f);
            if (!e) return;

            // send email
            const m = await entries2mails(e);
            const s = m.map(m => sendEmail(m.addr, m.subject, m.text));
            await Promise.all(s);

            await feed.save();
        });
        return 'ok';
    },
};