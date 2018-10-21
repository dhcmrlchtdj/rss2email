import {
    BaseEntity,
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToMany,
} from "typeorm";
import User from "./user";

@Entity()
class Feed extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createAt: Date;

    @UpdateDateColumn()
    updateAt: Date;

    @Column({ unique: true, length: 2048 })
    url: string;

    @ManyToMany(_type => User, user => user.feeds)
    users: User[];

    static async takeOne(query) {
        query.take = 1;
        const arr = await this.find(query);
        if (arr.length) {
            return arr[0];
        } else {
            return null;
        }
    }

    static async takeOrCreate(url: string) {
        let feed = await Feed.takeOne({ where: { url } });
        if (!feed) {
            feed = new Feed();
            feed.url = url;
            await feed.save();
        }
        return feed;
    }

    static async takeByUser(userId: number) {
        const feeds = await Feed.createQueryBuilder("feed")
            .select(["feed.id", "feed.url"])
            .innerJoin("feed.users", "user", "user.id = :userId", { userId })
            .getMany();
        return feeds;
    }
}

export default Feed;
