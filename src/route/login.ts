import * as Joi from 'joi';
import * as JWT from 'jsonwebtoken';
import * as LRU from 'lru-cache';
import * as UserDB from '../lib/db/user';

const cache = new LRU({
    maxAge: 10 * 60 * 1000,
});

const route = [
    {
        path: '/login',
        method: 'post',
        options: {
            auth: {
                strategy: 'apiAuth',
                mode: 'try',
            },
            validate: {
                payload: Joi.object({
                    email: Joi.string()
                        .email()
                        .required(),
                }),
            },
        },
        async handler(req, h) {
            if (req.auth.isAuthenticated) {
                return h
                    .response({
                        message: 'you are logined already',
                    })
                    .code(400);
            } else {
                const email = req.payload.email;
                const token = JWT.sign(
                    { email },
                    process.env.JWT_LOGIN_HEX as string,
                    { expiresIn: '30m' },
                );
                cache.set(email, token);
                const loginLink = `https://abc/login?token=${token}`;
                console.log(loginLink);
                // TODO send email
                return h
                    .response({
                        message: 'login link is sent to your email',
                    })
                    .code(200);
            }
        },
    },

    {
        path: '/login',
        method: 'get',
        options: {
            auth: {
                strategy: 'apiAuth',
                mode: 'try',
            },
            validate: {
                query: Joi.object({
                    token: Joi.string().required(),
                }),
            },
        },
        async handler(req, h) {
            if (req.auth.isAuthenticated) {
                return h
                    .response()
                    .redirect('/dashboard')
                    .temporary();
            } else {
                const token = req.query.token as string;
                const { email } = JWT.verify(token, process.env
                    .JWT_LOGIN_HEX as string) as { email: string };
                if (cache.get(email) === token) {
                    const user = await UserDB.getByEmail(email);
                    const cookie = JWT.sign(
                        {
                            id: user.id,
                            email: user.email,
                        },
                        process.env.JWT_API_HEX as string,
                        { expiresIn: '7 days' },
                    );
                    return h
                        .response()
                        .state('token', cookie)
                        .redirect('/dashboard')
                        .temporary();
                } else {
                    cache.del(email);
                    return h.response().code(401);
                }
            }
        },
    },
];

export default route;
