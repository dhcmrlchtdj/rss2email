export class Deferred<T = void> {
    promise: Promise<T>
    // @ts-ignore
    resolve: (payload: T) => void
    // @ts-ignore
    reject: (err: Error) => void
    constructor() {
        this.promise = new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }
}

//

class Mutex {
    private locked: boolean
    private waiters: Deferred[]
    constructor() {
        this.locked = false
        this.waiters = []
    }
    async lock(): Promise<void> {
        if (this.locked) {
            const d = new Deferred()
            this.waiters.push(d)
            await d.promise
        } else {
            this.locked = true
        }
    }
    async unlock(): Promise<void> {
        if (this.locked) {
            if (this.waiters.length === 0) {
                this.locked = false
            } else {
                const waiter = this.waiters.shift()!
                waiter.resolve()
            }
        }
    }
    async withLock<T>(f: () => Promise<T>): Promise<T> {
        await this.lock()
        try {
            const x = await f()
            return x
        } finally {
            await this.unlock()
        }
    }
}

//

class Condition {
    private waiters: Deferred[]
    constructor() {
        this.waiters = []
    }
    async wait(lock: Mutex): Promise<void> {
        const waiter = new Deferred()
        this.waiters.push(waiter)
        await lock.unlock()
        await waiter.promise
        await lock.lock()
    }
    async signal(): Promise<void> {
        if (this.waiters.length > 0) {
            const waiter = this.waiters.shift()!
            waiter.resolve()
        }
    }
    async broadcast(): Promise<void> {
        this.waiters.forEach(waiter => waiter.resolve())
        this.waiters = []
    }
}

//

export class Semaphore {
    private n: number
    private lock: Mutex
    private cond: Condition
    constructor(n: number) {
        this.n = n
        this.lock = new Mutex()
        this.cond = new Condition()
    }
    async acquire(): Promise<void> {
        await this.lock.withLock(async () => {
            while (this.n < 1) {
                await this.cond.wait(this.lock)
            }
            this.n -= 1
        })
    }
    async release(): Promise<void> {
        await this.lock.withLock(async () => {
            this.n += 1
            await this.cond.signal()
        })
    }
    async withAcquire<T>(f: () => Promise<T>): Promise<T> {
        await this.acquire()
        try {
            const x = await f()
            return x
        } finally {
            await this.release()
        }
    }
}

//

export class RWLock {
    // read-preferring read-write-lock
    private globalLock: Mutex
    private readerLock: Mutex
    private reader: number
    constructor() {
        this.globalLock = new Mutex()
        this.readerLock = new Mutex()
        this.reader = 0
    }
    async lock(): Promise<void> {
        await this.globalLock.lock()
    }
    async unlock(): Promise<void> {
        await this.globalLock.unlock()
    }
    async withLock<T>(f: () => Promise<T>): Promise<T> {
        return this.globalLock.withLock(f)
    }
    async lockRead(): Promise<void> {
        await this.readerLock.withLock(async () => {
            this.reader += 1
            if (this.reader === 1) {
                await this.globalLock.lock()
            }
        })
    }
    async unlockRead(): Promise<void> {
        await this.readerLock.withLock(async () => {
            this.reader -= 1
            if (this.reader === 0) {
                await this.globalLock.unlock()
            }
        })
    }
    async withReadLock<T>(f: () => Promise<T>): Promise<T> {
        await this.lockRead()
        try {
            const x = await f()
            return x
        } finally {
            await this.unlockRead()
        }
    }
}

//

export class Channel<T> {
    private capacity: number
    private queue: T[]
    private lock: Mutex
    private cond: Condition
    constructor(capacity: number = 1) {
        if (capacity <= 0) throw new Error('capacity must greater than 0')
        this.capacity = capacity
        this.queue = []
        this.lock = new Mutex()
        this.cond = new Condition()
    }
    async send(x: T): Promise<void> {
        await this.lock.withLock(async () => {
            while (this.queue.length === this.capacity) {
                await this.cond.wait(this.lock)
            }
            this.queue.push(x)
            await this.cond.broadcast()
        })
    }
    async receive(): Promise<T> {
        return this.lock.withLock(async () => {
            while (this.queue.length === 0) {
                await this.cond.wait(this.lock)
            }
            const x = this.queue.shift()!
            await this.cond.broadcast()
            return x
        })
    }
    async peek(): Promise<T | undefined> {
        return this.lock.withLock(async () => {
            if (this.queue.length === 0) {
                return undefined
            } else {
                return this.queue[0]
            }
        })
    }
    async sendAll(xs: T[]): Promise<void> {
        for (const x of xs) {
            await this.send(x)
        }
    }
    private async onReceive(cb: (x: T) => void) {
        while (true) {
            const x = await this.receive()
            await cb(x)
        }
    }
    static setWorker<T>(ch: Channel<T>, n: number, worker: (x: T) => void) {
        for (let i = 0; i < n; i++) {
            ch.onReceive(worker)
        }
    }
}

//

export class Once {
    private done: boolean
    constructor() {
        this.done = false
    }
    once(f: () => void): void {
        if (this.done === false) {
            this.done = true
            f()
        }
    }
}

//

export class RateLimiter {
    // https://github.com/vitessio/vitess/blob/master/go/ratelimiter/ratelimiter.go
    private maxCount: number
    private interval: number
    private lock: Mutex
    private curCount: number
    private lastTime: number
    constructor(maxCount: number, interval: number) {
        this.maxCount = maxCount
        this.interval = interval
        this.lock = new Mutex()
        this.curCount = maxCount - 1
        this.lastTime = Date.now()
    }
    async allow(): Promise<boolean> {
        return this.lock.withLock(async () => {
            const now = Date.now()
            if (now - this.lastTime < this.interval) {
                if (this.curCount > 0) {
                    this.curCount--
                    return true
                } else {
                    return false
                }
            } else {
                this.curCount = this.maxCount - 1
                this.lastTime = now
                return true
            }
        })
    }
}
