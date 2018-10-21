import * as Wakeup from "./controllers/wakeup";
import * as User from "./controllers/user";
import * as Feed from "./controllers/feed";

const routes = [
    { path: "/api/v1/wakeup", method: "get", options: Wakeup.wakeup },

    { path: "/api/v1/feeds", method: "get", options: Feed.getAll },
    { path: "/api/v1/feeds/add", method: "put", options: Feed.add },
    { path: "/api/v1/feeds/remove", method: "delete", options: Feed.remove },
    { path: "/api/v1/feeds/import", method: "post", options: Feed.importFeeds },
    { path: "/api/v1/feeds/export", method: "get", options: Feed.exportFeeds },

    { path: "/api/v1/user", method: "get", options: User.info },
    { path: "/logout", method: "get", options: User.logout },
    { path: "/connect/github", method: "get", options: User.connectGithub },

    {
        path: "/favicon.ico",
        method: "get",
        async handler(request, h) {
            const icon = Buffer.from(
                "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAEElEQVR42gEFAPr/AP///wAI/AL+Sr4t6gAAAABJRU5ErkJggg",
                "base64",
            );
            return h.response(icon).type("image/png");
        },
    },
];

export default routes;