import * as STREAM from 'stream';
import * as FeedParser from 'feedparser';
import axios from 'axios';

import { TFeed } from './types';

const _emptyDate = new Date();
const newEmptyFeed = (): TFeed => {
    return {
        title: '',
        link: '',
        website: '',
        date: _emptyDate,
        articles: {},
    };
};

const agent = axios.create({
    timeout: 10 * 1000,
    responseType: 'stream',
    headers: {
        'User-Agen': 'feedbox/WIP',
    },
    validateStatus(status) {
        return status === 200;
    },
});

const getLatestDate = (articles: TFeed['articles']): Date => {
    const dates = Object.values(articles).map(a => a.date);
    return dates.reduce((prev, next) => (prev > next ? prev : next));
};

export default async (url: string): Promise<TFeed> => {
    const resp = await agent.get(url);
    const data = resp.data as STREAM.Readable;

    const parser = new FeedParser({ feedurl: url });
    data.pipe(parser);

    const p: Promise<TFeed> = new Promise((resolve, reject) => {
        const feed = newEmptyFeed();

        parser.on('error', err => reject(err));

        parser.on('readable', () => {
            let item;
            while ((item = parser.read())) {
                feed.articles[item.guid] = {
                    guid: item.guid,
                    title: item.title,
                    link: item.origlink || item.link,
                    date: item.date,
                    description: '', //item.description,
                };
            }
        });

        parser.on('end', () => {
            const meta = parser.meta;
            feed.title = meta.title;
            feed.link = meta.xmlurl;
            feed.website = meta.link || meta.xmlurl;
            feed.date = meta.date || getLatestDate(feed.articles);

            resolve(feed);
        });
    });

    return p;
};