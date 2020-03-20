const newRoute = () => {
    return {
        handler: null,
        static: new Map(),
        parameter: new Map(),
        any: undefined,
    }
}

const handleNotFound = async () => new Response('Not Found', { status: 404 })

export class Router {
    constructor() {
        this.routes = newRoute()
        this.defaultHandler = handleNotFound
    }
    fallback(handler) {
        this.defaultHandler = handler
        return this
    }
    _add(routes, segments, handler) {
        var _a, _b
        if (segments.length === 0) {
            routes.handler = handler
        } else {
            const seg = segments[0]
            if (seg === '*') {
                const r = newRoute()
                r.handler = handler
                routes.any = r
            } else if (seg[0] === ':') {
                const param = seg.slice(1)
                const r =
                    (_a = routes.parameter.get(param)) !== null && _a !== void 0
                        ? _a
                        : newRoute()
                this._add(r, segments.slice(1), handler)
                routes.parameter.set(param, r)
            } else {
                const r =
                    (_b = routes.static.get(seg)) !== null && _b !== void 0
                        ? _b
                        : newRoute()
                this._add(r, segments.slice(1), handler)
                routes.static.set(seg, r)
            }
        }
    }
    add(method, pathname, handler) {
        const segments = [method.toUpperCase(), ...pathname.split('/')]
        this._add(this.routes, segments, handler)
        return this
    }
    head(pathname, handler) {
        return this.add('HEAD', pathname, handler)
    }
    get(pathname, handler) {
        return this.add('GET', pathname, handler)
    }
    post(pathname, handler) {
        return this.add('POST', pathname, handler)
    }
    put(pathname, handler) {
        return this.add('PUT', pathname, handler)
    }
    delete(pathname, handler) {
        return this.add('DELETE', pathname, handler)
    }
    _route(routes, segments, params) {
        if (segments.length === 0) {
            return routes.handler
        } else {
            const seg = segments[0]
            const subSeg = segments.slice(1)
            const staticRoutes = routes.static.get(seg)
            if (staticRoutes) {
                const handler = this._route(staticRoutes, subSeg, params)
                if (handler !== null) return handler
            }
            if (seg !== '') {
                const paramRouters = routes.parameter.entries()
                for (const [param, paramRouter] of paramRouters) {
                    const handler = this._route(paramRouter, subSeg, params)
                    if (handler !== null) {
                        params.set(param, seg)
                        return handler
                    }
                }
            }
            if (routes.any !== undefined) {
                params.set('*', segments.join('/'))
                return routes.any.handler
            }
            return null
        }
    }
    route(event) {
        var _a
        const request = event.request
        const url = new URL(request.url)
        const segments = [
            request.method.toUpperCase(),
            ...url.pathname.split('/'),
        ]
        const params = new Map()
        const handler =
            (_a = this._route(this.routes, segments, params)) !== null &&
            _a !== void 0
                ? _a
                : this.defaultHandler
        const resp = handler(event, params)
        return resp
    }
}
