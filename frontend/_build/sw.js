function e(e){return e()}let t;function n(e){t=e}function s(e){(function(){if(!t)throw new Error("Function called outside component initialization");return t})().$$.on_mount.push(e)}const a={'"':"&quot;","'":"&#39;","&":"&amp;","<":"&lt;",">":"&gt;"};function o(e){return String(e).replace(/["'&<>]/g,(e=>a[e]))}function i(e,t){if(!e||!e.$$render)throw"svelte:component"===t&&(t+=" this={...}"),new Error(`<${t}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);return e}let r;function l(s){function a(e,a,o,i){const l=t;n({$$:{on_destroy:r,context:new Map(l?l.$$.context:[]),on_mount:[],before_update:[],after_update:[],callbacks:Object.create(null)}});const d=s(e,a,o,i);return n(l),d}return{render:(t={},n={})=>{r=[];const s={title:"",head:"",css:new Set},o=a(s,t,{},n);return r.forEach(e),{html:o,css:{code:Array.from(s.css).map((e=>e.code)).join("\n"),map:null},head:s.title+s.head}},$$render:a}}function d(e,t,n){return null==t||n&&!t?"":` ${e}${!0===t?"":"="+("string"==typeof t?JSON.stringify(o(t)):`"${t}"`)}`}const c=l(((e,t,n,s)=>'<div class="columns"><div class="column col-12"><button class="btn btn-link loading loading-lg"></button></div></div>')),u=async e=>{if(e.ok){return await e.json()}{const t=await e.text();throw new Error(t)}},h=async(e,t)=>(async(e,t,n,s={})=>(s["Content-Type"]||(s["Content-Type"]="application/json; charset=utf-8"),fetch(t,{method:e,headers:s,body:n&&JSON.stringify(n),redirect:"follow",mode:"same-origin",credentials:"same-origin"}).then(u)))("GET",e,null,t),p=e=>("0"+e).slice(-2),v=e=>{const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return e.replace(/[&<>"']/g,(e=>t[e]))},f=l(((e,t,n,s)=>{let{email:a=""}=t,{feeds:i=[]}=t;const r=e=>null===e?"never":((e,t="YYYY-MM-DD hh:mm:ss")=>{const n=new Date(e),s=n.getFullYear(),a=n.getMonth()+1,o=n.getDate(),i=n.getHours(),r=n.getMinutes(),l=n.getSeconds(),d={YYYY:s,M:a,MM:p(a),D:o,DD:p(o),h:i,hh:p(i),m:r,mm:p(r),s:l,ss:p(l)};return t.replace(/YYYY|MM?|DD?|hh?|mm?|ss?/g,(e=>d[e]))})(e);return void 0===t.email&&n.email&&void 0!==a&&n.email(a),void 0===t.feeds&&n.feeds&&void 0!==i&&n.feeds(i),`<div class="columns"><div class="column col-12"><h1 class="d-inline-block" style="margin-bottom: 0">FeedBox</h1>\n        <span>${o(a)}</span>\n        <a href="/api/v1/feeds/export" target="_blank">OPML</a>\n        <a href="/api/logout">logout</a></div>\n    <div class="column col-12"><div class="divider"></div></div>\n\n    <div class="column col-12"><div class="input-group"><input class="form-input" type="text" placeholder="feed url"${d("value","",1)}>\n            <button type="button" class="${["btn btn-primary input-group-btn"," "].join(" ").trim()}">add\n            </button></div></div>\n    <div class="column col-12"><div class="divider"></div></div>\n\n    ${function(e,t){let n="";for(let s=0;s<e.length;s+=1)n+=t(e[s],s);return n}(i,(e=>`<div class="column col-12"><div class="tile"><div class="tile-content"><div class="tile-title text-break"><a target="_blank" rel="noopener"${d("href",v(e.url),0)}>${o(v(e.url))}\n                    </a></div>\n                <div class="tile-subtitle text-gray"><span>updated @ ${o(r(e.updated))}</span>\n                </div></div>\n            <div class="tile-action"><div><button type="button" class="${["btn btn-error",(e.loading?"loading":"")+" "+(e.loading?"disabled":"")].join(" ").trim()}">delete\n                    </button>\n                </div></div>\n        </div></div>\n    <div class="column col-12"><div class="divider"></div></div>`))}\n</div>`}));class m{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const g=l(((e,t,n,a)=>{const o=self.__STATE__||{};let{loaded:r=o.loaded||new m}=t,{email:l=o.email||""}=t,{feeds:d=o.feeds||[]}=t;return s((()=>{Promise.all([h("/api/v1/user"),h("/api/v1/feeds")]).then((([e,t])=>{l=e.addition.email,d=t,r.resolve&&r.resolve(!0)})).catch((e=>{console.error(e.stack),r.reject&&r.reject(e.message)}))})),void 0===t.loaded&&n.loaded&&void 0!==r&&n.loaded(r),void 0===t.email&&n.email&&void 0!==l&&n.email(l),void 0===t.feeds&&n.feeds&&void 0!==d&&n.feeds(d),`<div class="container grid-sm">${u=r.promise,(p=u)&&"object"==typeof p&&"function"==typeof p.then?`\n    ${i(c,"Loading").$$render(e,{},{},{})}\n    `:`\n    ${i(f,"List").$$render(e,{email:l,feeds:d},{},{})}\n    `}\n</div>`;var u,p}));class w{constructor(){this._route=this._newRoute()}_newRoute(){return{handler:null,static:new Map,parameter:new Map,wildcard:null}}_add(e,t,n){var s,a;if(0===e.length)n.handler=t;else{const o=e[0];if("*"===o)n.wildcard=t;else if(":"===o[0]){const a=o.slice(1),i=null!==(s=n.parameter.get(a))&&void 0!==s?s:this._newRoute();this._add(e.slice(1),t,i),n.parameter.set(a,i)}else{const s=null!==(a=n.static.get(o))&&void 0!==a?a:this._newRoute();this._add(e.slice(1),t,s),n.static.set(o,s)}}return this}add(e,t){return this._add(e,t,this._route)}_lookup(e,t,n){if(0===e.length){if(null!==n.handler)return{handler:n.handler,params:t}}else{const s=e[0],a=e.slice(1),o=n.static.get(s);if(void 0!==o){const e=this._lookup(a,t,o);if(null!==e.handler)return e}if(""!==s)for(const[e,o]of n.parameter){const n=this._lookup(a,t,o);if(null!==n.handler)return n.params.set(e,s),n}if(null!==n.wildcard)return t.set("*",e.join("/")),{handler:n.wildcard,params:t}}return{handler:null,params:t}}lookup(e){return this._lookup(e,new Map,this._route)}}const y=async(e,t)=>{const n=await e.match(t);return n||new Response("Cache Not Found",{status:404,statusText:"Not Found"})},_=async(e,t)=>{const n=await e.match(t);if(n)return n;return fetch(t).then((n=>(n.ok?e.put(t,n.clone()):e.delete(t),n)))},b=async(e,t)=>fetch(t);var $=Object.freeze({__proto__:null,cacheOnly:y,cacheFirst:_,networkOnly:b,networkFirst:async(e,t)=>{const n=e.match(t),s=fetch(t).then((n=>(n.ok?e.put(t,n.clone()):e.delete(t),n)));return s.catch((async e=>{const t=await n;if(t)return t;throw e}))},staleWhileRevalidate:async(e,t)=>{const n=fetch(t).then((n=>(n.ok?e.put(t,n.clone()):e.delete(t),n)));return await e.match(t)||n}});const k="cb3bbcc6a72c40a0",S=e=>async t=>{const n=await caches.open(k);return await $[e](n,t.request)},E=async e=>{const t=await caches.open(k),n=await b(0,e.request);return n.ok&&t.put("/api/v1/feeds",n.clone()),n},j=(new class{constructor(){this._router=new w}async defaultHandler(e,t){return new Response("Handler Not Found",{status:404,statusText:"Not Found"})}fallback(e){return this.defaultHandler=e,this}add(e,t,n){const s=[e.toUpperCase(),...t.split("/")];return this._router.add(s,n),this}all(e,t){return this.add(":METHOD",e,t)}head(e,t){return this.add("HEAD",e,t)}get(e,t){return this.add("GET",e,t)}post(e,t){return this.add("POST",e,t)}put(e,t){return this.add("PUT",e,t)}delete(e,t){return this.add("DELETE",e,t)}route(e){var t;const n=e.request,s=new URL(n.url),a=[n.method.toUpperCase(),...s.pathname.split("/")],o=this._router.lookup(a);return(null!==(t=o.handler)&&void 0!==t?t:this.defaultHandler)(e,o.params)}}).fallback(S("networkOnly")).get("/",(async e=>{const t=await caches.open(k),n=await _(t,e.request);return Promise.all([y(t,"/api/v1/user"),y(t,"/api/v1/feeds")]).then((async([e,t])=>{if(e&&t)return Promise.all([e.json(),t.json()]);throw new Error("cache missing")})).then((async([e,t])=>{const s={loaded:{promise:!0},email:e.addition.email,feeds:t},a=await n.clone().text(),o=g.render(s),i=a.replace('<div id="app"></div>',`<div id="app">${o.html}</div><script>window.__STATE__=${JSON.stringify(s)}<\/script>`);return new Response(i,n)})).catch((e=>(console.error(e.stack),n)))})).get("/api/v1/feeds",S("staleWhileRevalidate")).get("/api/v1/user",S("staleWhileRevalidate")).put("/api/v1/feeds/add",E).delete("/api/v1/feeds/remove",E).get("/sw.js",S("networkOnly")).get("/favicon.ico",S("cacheFirst")).get("/npm/*",S("cacheFirst")).get("/:file",((e,t)=>t.get("file").endsWith(".js")?S("cacheFirst")(e):S("networkOnly")(e)));console.log("[SW] current version",k),self.addEventListener("install",(e=>{console.log("[SW] install | start",k);const t=self.skipWaiting().then((()=>console.log("[SW] install | done",k)));e.waitUntil(t)})),self.addEventListener("activate",(e=>{console.log("[SW] activate | start",k);const t=self.clients.claim().then((()=>caches.keys())).then((e=>{const t=e.filter((e=>e!==k)).map((e=>caches.delete(e)));return Promise.all(t)})).then((()=>console.log("[SW] activate | done",k)));e.waitUntil(t)})),self.addEventListener("fetch",(e=>{console.log("[SW] fetch",e.request.url),e.respondWith(j.route(e))})),self.addEventListener("message",(e=>{if(console.log("[SW] message |",e.data),"logout"===e.data){const t=caches.open(k).then((e=>Promise.all([e.delete("/api/v1/user"),e.delete("/api/v1/feeds")]))).then((()=>console.log("[SW] message | done",e.data)));e.waitUntil(t)}}));
//# sourceMappingURL=sw.js.map
