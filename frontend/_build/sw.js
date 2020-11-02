function e(){}function t(e){return e()}function n(t){let n;return function(t,...n){if(null==t)return e;const s=t.subscribe(...n);return s.unsubscribe?()=>s.unsubscribe():s}(t,(e=>n=e))(),n}let s;function o(e){s=e}function a(e){(function(){if(!s)throw new Error("Function called outside component initialization");return s})().$$.on_mount.push(e)}const r={'"':"&quot;","'":"&#39;","&":"&amp;","<":"&lt;",">":"&gt;"};function i(e){return String(e).replace(/["'&<>]/g,(e=>r[e]))}function l(e,t){let n="";for(let s=0;s<e.length;s+=1)n+=t(e[s],s);return n}function c(e,t){if(!e||!e.$$render)throw"svelte:component"===t&&(t+=" this={...}"),new Error(`<${t}> is not a valid SSR component. You may need to review your build config to ensure that dependencies are compiled, rather than imported as pre-compiled modules`);return e}let d;function u(e){function n(t,n,a,r){const i=s;o({$$:{on_destroy:d,context:new Map(i?i.$$.context:[]),on_mount:[],before_update:[],after_update:[],callbacks:Object.create(null)}});const l=e(t,n,a,r);return o(i),l}return{render:(e={},s={})=>{d=[];const o={title:"",head:"",css:new Set},a=n(o,e,{},s);return d.forEach(t),{html:a,css:{code:Array.from(o.css).map((e=>e.code)).join("\n"),map:null},head:o.title+o.head}},$$render:n}}function h(e,t,n){return null==t||n&&!t?"":` ${e}${!0===t?"":"="+("string"==typeof t?JSON.stringify(i(t)):`"${t}"`)}`}const p=u(((e,t,n,s)=>'<div class="columns"><div class="column col-12"><button class="btn btn-link loading loading-lg"></button></div></div>')),f=[];function v(t,n=e){let s;const o=[];function a(e){if(a=e,((n=t)!=n?a==a:n!==a||n&&"object"==typeof n||"function"==typeof n)&&(t=e,s)){const e=!f.length;for(let e=0;e<o.length;e+=1){const n=o[e];n[1](),f.push(n,t)}if(e){for(let e=0;e<f.length;e+=2)f[e][0](f[e+1]);f.length=0}}var n,a}return{set:a,update:function(e){a(e(t))},subscribe:function(r,i=e){const l=[r,i];return o.push(l),1===o.length&&(s=n(a)||e),r(t),()=>{const e=o.indexOf(l);-1!==e&&o.splice(e,1),0===o.length&&(s(),s=null)}}}}const m=v(""),g=v([]),w=v([]),b=u(((e,t,s,o)=>`<div class="column col-12"><h1 class="d-inline-block mb-0">FeedBox</h1>\n    <span>${i(n(m))}</span>\n    <a href="/api/v1/feeds/export" target="_blank">export</a>\n    <a href="/api/logout">logout</a></div>\n<div class="column col-12"><div class="divider"></div></div>`)),y=async e=>{if(e.ok){return await e.json()}{const t=await e.text();throw new Error(t)}},$=async(e,t)=>(async(e,t,n,s={})=>(s["Content-Type"]||(s["Content-Type"]="application/json; charset=utf-8"),fetch(t,{method:e,headers:s,body:n&&JSON.stringify(n),redirect:"follow",mode:"same-origin",credentials:"same-origin"}).then(y)))("GET",e,null,t),_=u(((e,t,n,s)=>`<div class="column col-12"><div class="input-group"><input class="form-input" type="text" placeholder="feed url"${h("value","",1)}>\n        <button type="button" class="${["btn btn-primary input-group-btn"," "].join(" ").trim()}">add\n        </button></div></div>\n<div class="column col-12"><div class="divider"></div></div>`)),k=e=>("0"+e).slice(-2),S=e=>{const t={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"};return e.replace(/[&<>"']/g,(e=>t[e]))},E=u(((e,t,s,o)=>{let a=n(g);const r=e=>null===e?"never":((e,t="YYYY-MM-DD hh:mm:ss")=>{const n=new Date(e),s=n.getFullYear(),o=n.getMonth()+1,a=n.getDate(),r=n.getHours(),i=n.getMinutes(),l=n.getSeconds(),c={YYYY:s,M:o,MM:k(o),D:a,DD:k(a),h:r,hh:k(r),m:i,mm:k(i),s:l,ss:k(l)};return t.replace(/YYYY|MM?|DD?|hh?|mm?|ss?/g,(e=>c[e]))})(e);return""+l(a,(e=>`<div class="column col-12"><div class="tile"><div class="tile-content"><div class="tile-title text-break"><a target="_blank" rel="noopener"${h("href",S(e.url),0)}>${i(S(e.url))}\n                </a></div>\n            <div class="tile-subtitle text-gray"><span>updated @ ${i(r(e.updated))}</span>\n            </div></div>\n        <div class="tile-action"><div><button type="button" class="${["btn btn-error",(e.loading?"loading":"")+" "+(e.loading?"disabled":"")].join(" ").trim()}">remove\n                </button>\n            </div></div>\n    </div></div>\n<div class="column col-12"><div class="divider"></div></div>`))})),j=u(((e,t,s,o)=>`<div class="p-absolute m2" style="\n        width: 10em;\n        right: 0.4rem;\n        top: 0.4rem;\n        z-index: 10;\n        contain: content;\n    ">${l(n(w),((e,t)=>`<div class="toast toast-success mb-2"><button class="btn btn-clear float-right"></button>\n        ${i(e.msg)}\n    </div>`))}\n</div>`));class x{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const M=u(((e,t,n,s)=>{const o=self.__STATE__||{};let{loaded:r=o.loaded||new x}=t,{email:i=o.email||""}=t,{feeds:l=o.feeds||[]}=t;return i&&m.set(i),l.length&&g.set(l),a((()=>{Promise.all([$("/api/v1/user"),$("/api/v1/feeds")]).then((([e,t])=>{m.set(e.addition.email),g.set(t),r.resolve&&r.resolve(!0)})).catch((e=>{console.error(e.stack),r.reject&&r.reject(e.message)}))})),void 0===t.loaded&&n.loaded&&void 0!==r&&n.loaded(r),void 0===t.email&&n.email&&void 0!==i&&n.email(i),void 0===t.feeds&&n.feeds&&void 0!==l&&n.feeds(l),`<div class="container grid-sm">${d=r.promise,(u=d)&&"object"==typeof u&&"function"==typeof u.then?`\n    ${c(p,"Loading").$$render(e,{},{},{})}\n    `:`\n    <div class="columns">${c(b,"Heading").$$render(e,{},{},{})}\n        ${c(_,"Add").$$render(e,{},{},{})}\n        ${c(E,"List").$$render(e,{},{},{})}</div>\n    ${c(j,"Notify").$$render(e,{},{},{})}\n    `}\n</div>`;var d,u}));class T{constructor(){this._route=this._newRoute()}_newRoute(){return{handler:null,static:new Map,parameter:new Map,wildcard:null}}_add(e,t,n){var s,o;if(0===e.length)n.handler=t;else{const a=e[0];if("*"===a)n.wildcard=t;else if(":"===a[0]){const o=a.slice(1),r=null!==(s=n.parameter.get(o))&&void 0!==s?s:this._newRoute();this._add(e.slice(1),t,r),n.parameter.set(o,r)}else{const s=null!==(o=n.static.get(a))&&void 0!==o?o:this._newRoute();this._add(e.slice(1),t,s),n.static.set(a,s)}}return this}add(e,t){return this._add(e,t,this._route)}_lookup(e,t,n){if(0===e.length){if(null!==n.handler)return{handler:n.handler,params:t}}else{const s=e[0],o=e.slice(1),a=n.static.get(s);if(void 0!==a){const e=this._lookup(o,t,a);if(null!==e.handler)return e}if(""!==s)for(const[e,a]of n.parameter){const n=this._lookup(o,t,a);if(null!==n.handler)return n.params.set(e,s),n}if(null!==n.wildcard)return t.set("*",e.join("/")),{handler:n.wildcard,params:t}}return{handler:null,params:t}}lookup(e){return this._lookup(e,new Map,this._route)}}const W=async(e,t)=>{const n=await e.match(t);return n||new Response("Cache Not Found",{status:404,statusText:"Not Found"})},Y=async(e,t)=>{const n=await e.match(t);if(n)return n;return fetch(t).then((n=>(n.ok?e.put(t,n.clone()):e.delete(t),n)))},O=async(e,t)=>fetch(t);var D=Object.freeze({__proto__:null,cacheOnly:W,cacheFirst:Y,networkOnly:O,networkFirst:async(e,t)=>{const n=e.match(t),s=fetch(t).then((n=>(n.ok?e.put(t,n.clone()):e.delete(t),n)));return s.catch((async e=>{const t=await n;if(t)return t;throw e}))},staleWhileRevalidate:async(e,t)=>{const n=fetch(t).then((n=>(n.ok?e.put(t,n.clone()):e.delete(t),n)));return await e.match(t)||n}});const F="69aa1bd5ff8e94b7",R=e=>async t=>{const n=await caches.open(F);return await D[e](n,t.request)},H=async e=>{const t=await caches.open(F),n=await O(0,e.request);return n.ok&&t.put("/api/v1/feeds",n.clone()),n},L=(new class{constructor(){this._router=new T}async defaultHandler(e,t){return new Response("Handler Not Found",{status:404,statusText:"Not Found"})}fallback(e){return this.defaultHandler=e,this}add(e,t,n){const s=[e.toUpperCase(),...t.split("/")];return this._router.add(s,n),this}all(e,t){return this.add(":METHOD",e,t)}head(e,t){return this.add("HEAD",e,t)}get(e,t){return this.add("GET",e,t)}post(e,t){return this.add("POST",e,t)}put(e,t){return this.add("PUT",e,t)}delete(e,t){return this.add("DELETE",e,t)}route(e){var t;const n=e.request,s=new URL(n.url),o=[n.method.toUpperCase(),...s.pathname.split("/")],a=this._router.lookup(o);return(null!==(t=a.handler)&&void 0!==t?t:this.defaultHandler)(e,a.params)}}).fallback(R("networkOnly")).get("/",(async e=>{const t=await caches.open(F),n=await Y(t,e.request);return Promise.all([W(t,"/api/v1/user"),W(t,"/api/v1/feeds")]).then((async([e,t])=>{if(e&&t)return Promise.all([e.json(),t.json()]);throw new Error("cache missing")})).then((async([e,t])=>{const s={loaded:{promise:!0},email:e.addition.email,feeds:t},o=await n.clone().text(),a=M.render(s),r=o.replace('<div id="app"></div>',`<div id="app">${a.html}</div><script>window.__STATE__=${JSON.stringify(s)}<\/script>`);return new Response(r,n)})).catch((e=>(console.error(e.stack),n)))})).get("/api/v1/feeds",R("staleWhileRevalidate")).get("/api/v1/user",R("staleWhileRevalidate")).put("/api/v1/feeds/add",H).delete("/api/v1/feeds/remove",H).get("/sw.js",R("networkOnly")).get("/favicon.ico",R("cacheFirst")).get("/npm/*",R("cacheFirst")).get("/:file",((e,t)=>t.get("file").endsWith(".js")?R("cacheFirst")(e):R("networkOnly")(e)));console.log("[SW] current version",F),self.addEventListener("install",(e=>{console.log("[SW] install | start",F);const t=self.skipWaiting().then((()=>console.log("[SW] install | done",F)));e.waitUntil(t)})),self.addEventListener("activate",(e=>{console.log("[SW] activate | start",F);const t=self.clients.claim().then((()=>caches.keys())).then((e=>{const t=e.filter((e=>e!==F)).map((e=>caches.delete(e)));return Promise.all(t)})).then((()=>console.log("[SW] activate | done",F)));e.waitUntil(t)})),self.addEventListener("fetch",(e=>{console.log("[SW] fetch",e.request.url),e.respondWith(L.route(e))})),self.addEventListener("message",(e=>{if(console.log("[SW] message |",e.data),"logout"===e.data){const t=caches.open(F).then((e=>Promise.all([e.delete("/api/v1/user"),e.delete("/api/v1/feeds")]))).then((()=>console.log("[SW] message | done",e.data)));e.waitUntil(t)}}));
//# sourceMappingURL=sw.js.map
