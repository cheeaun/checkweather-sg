var e=Object.defineProperty,t=Object.defineProperties,s=Object.getOwnPropertyDescriptors,n=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,r=Object.prototype.propertyIsEnumerable,i=(t,s,n)=>s in t?e(t,s,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[s]=n;try{self["workbox:core:6.5.1"]&&_()}catch(le){}const c=(e,...t)=>{let s=e;return t.length>0&&(s+=` :: ${JSON.stringify(t)}`),s};class o extends Error{constructor(e,t){super(c(e,t)),this.name=e,this.details=t}}try{self["workbox:routing:6.5.1"]&&_()}catch(le){}const h=e=>e&&"object"==typeof e?e:{handle:e};class l{constructor(e,t,s="GET"){this.handler=h(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=h(e)}}class u extends l{constructor(e,t,s){super((({url:t})=>{const s=e.exec(t.href);if(s&&(t.origin===location.origin||0===s.index))return s.slice(1)}),t,s)}}class d{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",(e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(e=>{if(e.data&&"CACHE_URLS"===e.data.type){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map((t=>{"string"==typeof t&&(t=[t]);const s=new Request(...t);return this.handleRequest({request:s,event:e})})));e.waitUntil(s),e.ports&&e.ports[0]&&s.then((()=>e.ports[0].postMessage(!0)))}}))}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:a,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:n,url:s});let i=r&&r.handler;const c=e.method;if(!i&&this._defaultHandlerMap.has(c)&&(i=this._defaultHandlerMap.get(c)),!i)return;let o;try{o=i.handle({url:s,request:e,event:t,params:a})}catch(l){o=Promise.reject(l)}const h=r&&r.catchHandler;return o instanceof Promise&&(this._catchHandler||h)&&(o=o.catch((async n=>{if(h)try{return await h.handle({url:s,request:e,event:t,params:a})}catch(r){r instanceof Error&&(n=r)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw n}))),o}findMatchingRoute({url:e,sameOrigin:t,request:s,event:n}){const a=this._routes.get(s.method)||[];for(const r of a){let a;const i=r.match({url:e,sameOrigin:t,request:s,event:n});if(i)return a=i,(Array.isArray(a)&&0===a.length||i.constructor===Object&&0===Object.keys(i).length||"boolean"==typeof i)&&(a=void 0),{route:r,params:a}}return{}}setDefaultHandler(e,t="GET"){this._defaultHandlerMap.set(t,h(e))}setCatchHandler(e){this._catchHandler=h(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new o("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(!(t>-1))throw new o("unregister-route-route-not-registered");this._routes.get(e.method).splice(t,1)}}let p;function f(e,t,s){let n;if("string"==typeof e){const a=new URL(e,location.href);n=new l((({url:e})=>e.href===a.href),t,s)}else if(e instanceof RegExp)n=new u(e,t,s);else if("function"==typeof e)n=new l(e,t,s);else{if(!(e instanceof l))throw new o("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});n=e}return(p||(p=new d,p.addFetchListener(),p.addCacheListener()),p).registerRoute(n),n}const g={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},w=e=>[g.prefix,e,g.suffix].filter((e=>e&&e.length>0)).join("-"),m=e=>e||w(g.precache),y=e=>e||w(g.runtime);function b(e,t){const s=new URL(e);for(const n of t)s.searchParams.delete(n);return s.href}class v{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}const R=new Set;try{self["workbox:strategies:6.5.1"]&&_()}catch(le){}function x(e){return"string"==typeof e?new Request(e):e}class C{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new v,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let s=x(e);if("navigate"===s.mode&&t instanceof FetchEvent&&t.preloadResponse){const e=await t.preloadResponse;if(e)return e}const n=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const e of this.iterateCallbacks("requestWillFetch"))s=await e({request:s.clone(),event:t})}catch(r){if(r instanceof Error)throw new o("plugin-error-request-will-fetch",{thrownErrorMessage:r.message})}const a=s.clone();try{let e;e=await fetch(s,"navigate"===s.mode?void 0:this._strategy.fetchOptions);for(const s of this.iterateCallbacks("fetchDidSucceed"))e=await s({event:t,request:a,response:e});return e}catch(i){throw n&&await this.runCallbacks("fetchDidFail",{error:i,event:t,originalRequest:n.clone(),request:a.clone()}),i}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=x(e);let s;const{cacheName:n,matchOptions:a}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},a),{cacheName:n});s=await caches.match(r,i);for(const c of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await c({cacheName:n,matchOptions:a,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,t){const s=x(e);var n;await(n=0,new Promise((e=>setTimeout(e,n))));const a=await this.getCacheKey(s,"write");if(!t)throw new o("cache-put-with-no-response",{url:(r=a.url,new URL(String(r),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var r;const i=await this._ensureResponseSafeToCache(t);if(!i)return!1;const{cacheName:c,matchOptions:h}=this._strategy,l=await self.caches.open(c),u=this.hasCallback("cacheDidUpdate"),d=u?await async function(e,t,s,n){const a=b(t.url,s);if(t.url===a)return e.match(t,n);const r=Object.assign(Object.assign({},n),{ignoreSearch:!0}),i=await e.keys(t,r);for(const c of i)if(a===b(c.url,s))return e.match(c,n)}(l,a.clone(),["__WB_REVISION__"],h):null;try{await l.put(a,u?i.clone():i)}catch(p){if(p instanceof Error)throw"QuotaExceededError"===p.name&&await async function(){for(const e of R)await e()}(),p}for(const o of this.iterateCallbacks("cacheDidUpdate"))await o({cacheName:c,oldResponse:d,newResponse:i.clone(),request:a,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let n=e;for(const e of this.iterateCallbacks("cacheKeyWillBeUsed"))n=x(await e({mode:t,request:n,event:this.event,params:this.params}));this._cacheKeys[s]=n}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if("function"==typeof t[e]){const s=this._pluginStateMap.get(t),n=n=>{const a=Object.assign(Object.assign({},n),{state:s});return t[e](a)};yield n}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const n of this.iterateCallbacks("cacheWillUpdate"))if(t=await n({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&200!==t.status&&(t=void 0),t}}class E{constructor(e={}){this.cacheName=y(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s="string"==typeof e.request?new Request(e.request):e.request,n="params"in e?e.params:void 0,a=new C(this,{event:t,request:s,params:n}),r=this._getResponse(a,s,t);return[r,this._awaitComplete(r,a,s,t)]}async _getResponse(e,t,s){let n;await e.runCallbacks("handlerWillStart",{event:s,request:t});try{if(n=await this._handle(t,e),!n||"error"===n.type)throw new o("no-response",{url:t.url})}catch(a){if(a instanceof Error)for(const r of e.iterateCallbacks("handlerDidError"))if(n=await r({error:a,event:s,request:t}),n)break;if(!n)throw a}for(const r of e.iterateCallbacks("handlerWillRespond"))n=await r({event:s,request:t,response:n});return n}async _awaitComplete(e,t,s,n){let a,r;try{a=await e}catch(i){}try{await t.runCallbacks("handlerDidRespond",{event:n,request:s,response:a}),await t.doneWaiting()}catch(c){c instanceof Error&&(r=c)}if(await t.runCallbacks("handlerDidComplete",{event:n,request:s,response:a,error:r}),t.destroy(),r)throw r}}class q extends E{async _handle(e,t){let s,n=await t.cacheMatch(e);if(!n)try{n=await t.fetchAndCachePut(e)}catch(a){a instanceof Error&&(s=a)}if(!n)throw new o("no-response",{url:e.url,error:s});return n}}const L={cacheWillUpdate:async({response:e})=>200===e.status||0===e.status?e:null};class U extends E{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(L)}async _handle(e,t){const s=t.fetchAndCachePut(e).catch((()=>{}));t.waitUntil(s);let n,a=await t.cacheMatch(e);if(a);else try{a=await s}catch(r){r instanceof Error&&(n=r)}if(!a)throw new o("no-response",{url:e.url,error:n});return a}}function k(e){e.then((()=>{}))}let D,T;const N=new WeakMap,O=new WeakMap,P=new WeakMap,I=new WeakMap,M=new WeakMap;let S={get(e,t,s){if(e instanceof IDBTransaction){if("done"===t)return O.get(e);if("objectStoreNames"===t)return e.objectStoreNames||P.get(e);if("store"===t)return s.objectStoreNames[1]?void 0:s.objectStore(s.objectStoreNames[0])}return j(e[t])},set:(e,t,s)=>(e[t]=s,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function K(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(T||(T=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(W(this),t),j(N.get(this))}:function(...t){return j(e.apply(W(this),t))}:function(t,...s){const n=e.call(W(this),t,...s);return P.set(n,t.sort?t.sort():[t]),j(n)}}function A(e){return"function"==typeof e?K(e):(e instanceof IDBTransaction&&function(e){if(O.has(e))return;const t=new Promise(((t,s)=>{const n=()=>{e.removeEventListener("complete",a),e.removeEventListener("error",r),e.removeEventListener("abort",r)},a=()=>{t(),n()},r=()=>{s(e.error||new DOMException("AbortError","AbortError")),n()};e.addEventListener("complete",a),e.addEventListener("error",r),e.addEventListener("abort",r)}));O.set(e,t)}(e),t=e,(D||(D=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])).some((e=>t instanceof e))?new Proxy(e,S):e);var t}function j(e){if(e instanceof IDBRequest)return function(e){const t=new Promise(((t,s)=>{const n=()=>{e.removeEventListener("success",a),e.removeEventListener("error",r)},a=()=>{t(j(e.result)),n()},r=()=>{s(e.error),n()};e.addEventListener("success",a),e.addEventListener("error",r)}));return t.then((t=>{t instanceof IDBCursor&&N.set(t,e)})).catch((()=>{})),M.set(t,e),t}(e);if(I.has(e))return I.get(e);const t=A(e);return t!==e&&(I.set(e,t),M.set(t,e)),t}const W=e=>M.get(e);const B=["get","getKey","getAll","getAllKeys","count"],F=["put","add","delete","clear"],H=new Map;function $(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(H.get(t))return H.get(t);const s=t.replace(/FromIndex$/,""),n=t!==s,a=F.includes(s);if(!(s in(n?IDBIndex:IDBObjectStore).prototype)||!a&&!B.includes(s))return;const r=async function(e,...t){const r=this.transaction(e,a?"readwrite":"readonly");let i=r.store;return n&&(i=i.index(t.shift())),(await Promise.all([i[s](...t),a&&r.done]))[0]};return H.set(t,r),r}S=(e=>{return c=((e,t)=>{for(var s in t||(t={}))a.call(t,s)&&i(e,s,t[s]);if(n)for(var s of n(t))r.call(t,s)&&i(e,s,t[s]);return e})({},e),t(c,s({get:(t,s,n)=>$(t,s)||e.get(t,s,n),has:(t,s)=>!!$(t,s)||e.has(t,s)}));var c})(S);try{self["workbox:expiration:6.5.1"]&&_()}catch(le){}const Q=e=>{const t=new URL(e,location.href);return t.hash="",t.href};class V{constructor(e){this._db=null,this._cacheName=e}_upgradeDb(e){const t=e.createObjectStore("cache-entries",{keyPath:"id"});t.createIndex("cacheName","cacheName",{unique:!1}),t.createIndex("timestamp","timestamp",{unique:!1})}_upgradeDbAndDeleteOldDbs(e){this._upgradeDb(e),this._cacheName&&function(e,{blocked:t}={}){const s=indexedDB.deleteDatabase(e);t&&s.addEventListener("blocked",(()=>t())),j(s).then((()=>{}))}(this._cacheName)}async setTimestamp(e,t){const s={url:e=Q(e),timestamp:t,cacheName:this._cacheName,id:this._getId(e)},n=(await this.getDb()).transaction("cache-entries","readwrite",{durability:"relaxed"});await n.store.put(s),await n.done}async getTimestamp(e){const t=await this.getDb(),s=await t.get("cache-entries",this._getId(e));return null==s?void 0:s.timestamp}async expireEntries(e,t){const s=await this.getDb();let n=await s.transaction("cache-entries").store.index("timestamp").openCursor(null,"prev");const a=[];let r=0;for(;n;){const s=n.value;s.cacheName===this._cacheName&&(e&&s.timestamp<e||t&&r>=t?a.push(n.value):r++),n=await n.continue()}const i=[];for(const c of a)await s.delete("cache-entries",c.id),i.push(c.url);return i}_getId(e){return this._cacheName+"|"+Q(e)}async getDb(){return this._db||(this._db=await function(e,t,{blocked:s,upgrade:n,blocking:a,terminated:r}={}){const i=indexedDB.open(e,t),c=j(i);return n&&i.addEventListener("upgradeneeded",(e=>{n(j(i.result),e.oldVersion,e.newVersion,j(i.transaction))})),s&&i.addEventListener("blocked",(()=>s())),c.then((e=>{r&&e.addEventListener("close",(()=>r())),a&&e.addEventListener("versionchange",(()=>a()))})).catch((()=>{})),c}("workbox-expiration",1,{upgrade:this._upgradeDbAndDeleteOldDbs.bind(this)})),this._db}}class G{constructor(e,t={}){this._isRunning=!1,this._rerunRequested=!1,this._maxEntries=t.maxEntries,this._maxAgeSeconds=t.maxAgeSeconds,this._matchOptions=t.matchOptions,this._cacheName=e,this._timestampModel=new V(e)}async expireEntries(){if(this._isRunning)return void(this._rerunRequested=!0);this._isRunning=!0;const e=this._maxAgeSeconds?Date.now()-1e3*this._maxAgeSeconds:0,t=await this._timestampModel.expireEntries(e,this._maxEntries),s=await self.caches.open(this._cacheName);for(const n of t)await s.delete(n,this._matchOptions);this._isRunning=!1,this._rerunRequested&&(this._rerunRequested=!1,k(this.expireEntries()))}async updateTimestamp(e){await this._timestampModel.setTimestamp(e,Date.now())}async isURLExpired(e){if(this._maxAgeSeconds){const t=await this._timestampModel.getTimestamp(e),s=Date.now()-1e3*this._maxAgeSeconds;return void 0===t||t<s}return!1}async delete(){this._rerunRequested=!1,await this._timestampModel.expireEntries(1/0)}}class J{constructor(e={}){this.cachedResponseWillBeUsed=async({event:e,request:t,cacheName:s,cachedResponse:n})=>{if(!n)return null;const a=this._isResponseDateFresh(n),r=this._getCacheExpiration(s);k(r.expireEntries());const i=r.updateTimestamp(t.url);if(e)try{e.waitUntil(i)}catch(c){}return a?n:null},this.cacheDidUpdate=async({cacheName:e,request:t})=>{const s=this._getCacheExpiration(e);await s.updateTimestamp(t.url),await s.expireEntries()},this._config=e,this._maxAgeSeconds=e.maxAgeSeconds,this._cacheExpirations=new Map,e.purgeOnQuotaError&&function(e){R.add(e)}((()=>this.deleteCacheAndMetadata()))}_getCacheExpiration(e){if(e===y())throw new o("expire-custom-caches-only");let t=this._cacheExpirations.get(e);return t||(t=new G(e,this._config),this._cacheExpirations.set(e,t)),t}_isResponseDateFresh(e){if(!this._maxAgeSeconds)return!0;const t=this._getDateHeaderTimestamp(e);if(null===t)return!0;return t>=Date.now()-1e3*this._maxAgeSeconds}_getDateHeaderTimestamp(e){if(!e.headers.has("date"))return null;const t=e.headers.get("date"),s=new Date(t).getTime();return isNaN(s)?null:s}async deleteCacheAndMetadata(){for(const[e,t]of this._cacheExpirations)await self.caches.delete(e),await t.delete();this._cacheExpirations=new Map}}try{self["workbox:cacheable-response:6.5.1"]&&_()}catch(le){}class z{constructor(e={}){this._statuses=e.statuses,this._headers=e.headers}isResponseCacheable(e){let t=!0;return this._statuses&&(t=this._statuses.includes(e.status)),this._headers&&t&&(t=Object.keys(this._headers).some((t=>e.headers.get(t)===this._headers[t]))),t}}class X{constructor(e){this.cacheWillUpdate=async({response:e})=>this._cacheableResponse.isResponseCacheable(e)?e:null,this._cacheableResponse=new z(e)}}function Y(e,t){const s=t();return e.waitUntil(s),s}try{self["workbox:precaching:6.5.1"]&&_()}catch(le){}function Z(e){if(!e)throw new o("add-to-cache-list-unexpected-type",{entry:e});if("string"==typeof e){const t=new URL(e,location.href);return{cacheKey:t.href,url:t.href}}const{revision:t,url:s}=e;if(!s)throw new o("add-to-cache-list-unexpected-type",{entry:e});if(!t){const e=new URL(s,location.href);return{cacheKey:e.href,url:e.href}}const n=new URL(s,location.href),a=new URL(s,location.href);return n.searchParams.set("__WB_REVISION__",t),{cacheKey:n.href,url:a.href}}class ee{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if("install"===e.type&&t&&t.originalRequest&&t.originalRequest instanceof Request){const e=t.originalRequest.url;s?this.notUpdatedURLs.push(e):this.updatedURLs.push(e)}return s}}}class te{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:e,params:t})=>{const s=(null==t?void 0:t.cacheKey)||this._precacheController.getCacheKeyForURL(e.url);return s?new Request(s,{headers:e.headers}):e},this._precacheController=e}}let se,ne;async function ae(e,t){let s=null;if(e.url){s=new URL(e.url).origin}if(s!==self.location.origin)throw new o("cross-origin-copy-response",{origin:s});const n=e.clone(),a={headers:new Headers(n.headers),status:n.status,statusText:n.statusText},r=t?t(a):a,i=function(){if(void 0===se){const t=new Response("");if("body"in t)try{new Response(t.body),se=!0}catch(e){se=!1}se=!1}return se}()?n.body:await n.blob();return new Response(i,r)}class re extends E{constructor(e={}){e.cacheName=m(e.cacheName),super(e),this._fallbackToNetwork=!1!==e.fallbackToNetwork,this.plugins.push(re.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&"install"===t.event.type?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;const n=t.params||{};if(!this._fallbackToNetwork)throw new o("missing-precache-entry",{cacheName:this.cacheName,url:e.url});{const a=n.integrity,r=e.integrity,i=!r||r===a;s=await t.fetch(new Request(e,{integrity:r||a})),a&&i&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,s.clone()))}return s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();const s=await t.fetch(e);if(!(await t.cachePut(e,s.clone())))throw new o("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,n]of this.plugins.entries())n!==re.copyRedirectedCacheableResponsesPlugin&&(n===re.defaultPrecacheCacheabilityPlugin&&(e=s),n.cacheWillUpdate&&t++);0===t?this.plugins.push(re.defaultPrecacheCacheabilityPlugin):t>1&&null!==e&&this.plugins.splice(e,1)}}re.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:e})=>!e||e.status>=400?null:e},re.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:e})=>e.redirected?await ae(e):e};class ie{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new re({cacheName:m(e),plugins:[...t,new te({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){"string"==typeof s?t.push(s):s&&void 0===s.revision&&t.push(s.url);const{cacheKey:e,url:n}=Z(s),a="string"!=typeof s&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(n)&&this._urlsToCacheKeys.get(n)!==e)throw new o("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(n),secondEntry:e});if("string"!=typeof s&&s.integrity){if(this._cacheKeysToIntegrities.has(e)&&this._cacheKeysToIntegrities.get(e)!==s.integrity)throw new o("add-to-cache-list-conflicting-integrities",{url:n});this._cacheKeysToIntegrities.set(e,s.integrity)}if(this._urlsToCacheKeys.set(n,e),this._urlsToCacheModes.set(n,a),t.length>0){const e=`Workbox is precaching URLs without revision info: ${t.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(e)}}}install(e){return Y(e,(async()=>{const t=new ee;this.strategy.plugins.push(t);for(const[a,r]of this._urlsToCacheKeys){const t=this._cacheKeysToIntegrities.get(r),s=this._urlsToCacheModes.get(a),n=new Request(a,{integrity:t,cache:s,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:r},request:n,event:e}))}const{updatedURLs:s,notUpdatedURLs:n}=t;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(e){return Y(e,(async()=>{const e=await self.caches.open(this.strategy.cacheName),t=await e.keys(),s=new Set(this._urlsToCacheKeys.values()),n=[];for(const a of t)s.has(a.url)||(await e.delete(a),n.push(a.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new o("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}const ce=()=>(ne||(ne=new ie),ne);class oe extends l{constructor(e,t){super((({request:s})=>{const n=e.getURLsToCacheKeys();for(const a of function*(e,{ignoreURLParametersMatching:t=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:a}={}){const r=new URL(e,location.href);r.hash="",yield r.href;const i=function(e,t=[]){for(const s of[...e.searchParams.keys()])t.some((e=>e.test(s)))&&e.searchParams.delete(s);return e}(r,t);if(yield i.href,s&&i.pathname.endsWith("/")){const e=new URL(i.href);e.pathname+=s,yield e.href}if(n){const e=new URL(i.href);e.pathname+=".html",yield e.href}if(a){const e=a({url:r});for(const t of e)yield t.href}}(s.url,t)){const t=n.get(a);if(t){return{cacheKey:t,integrity:e.getIntegrityForCacheKey(t)}}}}),e.strategy)}}var he;(function(e){ce().precache(e)})([{"revision":null,"url":"assets/index-legacy.f82eeb8b.js"},{"revision":null,"url":"assets/index.6b91f11b.css"},{"revision":null,"url":"assets/index.9d67e87c.js"},{"revision":null,"url":"assets/maplibre-gl-legacy.77463ed6.js"},{"revision":null,"url":"assets/maplibre-gl.4d5de089.js"},{"revision":null,"url":"assets/polyfills-legacy.fc5b004d.js"},{"revision":null,"url":"assets/vendor-legacy.340bc714.js"},{"revision":null,"url":"assets/vendor.0eb47a7a.js"},{"revision":"495783fb3d8f0a424251634d0c4b4cc9","url":"index.html"},{"revision":"657a74e8ce15a4f6b093af495877d572","url":"mini/index.html"},{"revision":"84842868e9b60f1091de63505dedb900","url":"mini/mini.css"},{"revision":"1db3a2ea33bea97a08659d26790a1177","url":"mini/mini.js"},{"revision":"326bf7748add8a7794b0cfcb2e01cd57","url":"privacy-policy/index.html"},{"revision":"96b99a9ec369d0bd7ed7f60808824e88","url":"icons/maskable-icon.png"},{"revision":"ca338d044e97b97a64a9665c8fd9acda","url":"icons/icon-192.png"},{"revision":"09807a79039ecf49150d197976d6a944","url":"icons/icon-512.png"},{"revision":"404b74cf6fcdd5eceeef384fe3b17cba","url":"manifest.webmanifest"}]),function(e){const t=ce();f(new oe(t,e))}(he),f((({request:e})=>"style"===e.destination||"script"===e.destination),new U({cacheName:"static-resources",plugins:[new X({statuses:[0,200]}),new J({maxAgeSeconds:2592e3,purgeOnQuotaError:!0})]})),f((({request:e})=>"image"===e.destination||/\.(jpeg|jpg|gif|png|svg)$/i.test(e.url)),new q({cacheName:"images",plugins:[new J({maxEntries:60,maxAgeSeconds:2592e3,purgeOnQuotaError:!0}),new X({statuses:[0,200]})]})),f(/.*api\.mapbox\.com\/fonts/,new q({cacheName:"mapbox-fonts",plugins:[new J({maxEntries:10,purgeOnQuotaError:!0}),new X({statuses:[0,200]})]})),f(/.*(?:tiles\.mapbox|api\.mapbox)\.com.*$/,new U({cacheName:"mapbox",plugins:[new J({maxAgeSeconds:2592e3,purgeOnQuotaError:!0}),new X({statuses:[0,200]})]})),f(/.*api\.maptiler\.com\/fonts/,new q({cacheName:"maptiler-fonts",plugins:[new J({maxEntries:10,purgeOnQuotaError:!0}),new X({statuses:[0,200]})]})),f(/.*api\.maptiler\.com/,new q({cacheName:"maptiler",plugins:[new J({maxAgeSeconds:2592e3,purgeOnQuotaError:!0}),new X({statuses:[0,200]})]})),f(/.*api\.checkweather/,new class extends E{constructor(e={}){super(e),this.plugins.some((e=>"cacheWillUpdate"in e))||this.plugins.unshift(L),this._networkTimeoutSeconds=e.networkTimeoutSeconds||0}async _handle(e,t){const s=[],n=[];let a;if(this._networkTimeoutSeconds){const{id:r,promise:i}=this._getTimeoutPromise({request:e,logs:s,handler:t});a=r,n.push(i)}const r=this._getNetworkPromise({timeoutId:a,request:e,logs:s,handler:t});n.push(r);const i=await t.waitUntil((async()=>await t.waitUntil(Promise.race(n))||await r)());if(!i)throw new o("no-response",{url:e.url});return i}_getTimeoutPromise({request:e,logs:t,handler:s}){let n;return{promise:new Promise((t=>{n=setTimeout((async()=>{t(await s.cacheMatch(e))}),1e3*this._networkTimeoutSeconds)})),id:n}}async _getNetworkPromise({timeoutId:e,request:t,logs:s,handler:n}){let a,r;try{r=await n.fetchAndCachePut(t)}catch(i){i instanceof Error&&(a=i)}return e&&clearTimeout(e),!a&&r||(r=await n.cacheMatch(t)),r}}({cacheName:"api",plugins:[new X({statuses:[0,200]})]}));
//# sourceMappingURL=sw.js.map
