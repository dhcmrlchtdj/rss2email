import { model } from '../models'
import { getNewFeeds } from './get-new-feeds'
import type { Feed, GithubUser, TelegramUser } from '../models'
import type { FeedItem } from './parse-feed'
import { sendEmail } from './send-email'
import { telegramClient } from '../telegram/client'
import { extractSite } from './extract-site'
import { Channel } from './sync'

export const updateFeeds = async () => {
    const chFeed = new Channel<Feed>(300)
    const chFeedItem = new Channel<[Feed, FeedItem]>(20)
    const chEmail = new Channel<[Feed, FeedItem, GithubUser[]]>(20)
    const chTelegram = new Channel<[FeedItem, TelegramUser[]]>(20)

    const feeds = await model.getActiveFeeds()
    chFeed.sendAll(feeds).then(() => chFeed.close())

    // feed => update database
    // feed => feedItem
    chFeed
        .onReceive(10, async (feed) => {
            const resp = await getNewFeeds(feed)
            if (resp.isNone) return

            const { updated, newLinks, newItems } = resp.getExn()
            await model.addNewFeeds(feed.id, newLinks, updated)
            for (const item of newItems) {
                await chFeedItem.send([feed, item])
            }
        })
        .then(() => chFeedItem.close())

    // feedItem => email/telegram
    chFeedItem
        .onReceive(10, async ([feed, item]) => {
            const users = await model.getSubscribers(feed.id)
            const githubUsers = users.filter(
                (u) => u.platform === 'github',
            ) as GithubUser[]
            await chEmail.send([feed, item, githubUsers])

            const telegramUsers = users.filter(
                (u) => u.platform === 'telegram',
            ) as TelegramUser[]
            await chTelegram.send([item, telegramUsers])
        })
        .then(() => {
            chEmail.close()
            chTelegram.close()
        })

    const tEmail = chEmail.onReceive(3, async ([feed, item, users]) => {
        const title = item.title || 'unknown'
        const site = extractSite(feed.url)
        const subject = `"${title}" from "${site}"`

        const link = item.origlink || item.link || item.guid
        const tags = item.categories.map((tag) => `#${tag}`).join(' ')
        const content = item.description || item.summary || ''
        const text = [link, tags, content].filter(Boolean).join('<br><br>')

        for (const user of users) {
            await sendEmail(user.addition.email, subject, text)
        }
    })

    const tTG = chTelegram.onReceive(3, async ([item, users]) => {
        const text: string[] = []

        const link = item.origlink || item.link || item.guid
        text.push(link)

        if (item.categories.length > 0) {
            const tags = item.categories.map((tag) => `#${tag}`).join(' ')
            text.push(tags)
        }

        if (item.comments) {
            text.push(`comments: ${item.comments}`)
        }

        for (const user of users) {
            await telegramClient.send('sendMessage', {
                chat_id: Number(user.pid),
                text: text.join('\n\n'),
            })
        }
    })

    await Promise.all([tEmail, tTG])
}
