var e=Object.defineProperty,t=Object.defineProperties,o=Object.getOwnPropertyDescriptors,n=Object.getOwnPropertySymbols,a=Object.prototype.hasOwnProperty,i=Object.prototype.propertyIsEnumerable,r=(t,o,n)=>o in t?e(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,l=(e,t)=>{for(var o in t||(t={}))a.call(t,o)&&r(e,o,t[o]);if(n)for(var o of n(t))i.call(t,o)&&r(e,o,t[o]);return e},s=(e,n)=>t(e,o(n)),d=(e,t)=>{var o={};for(var r in e)a.call(e,r)&&t.indexOf(r)<0&&(o[r]=e[r]);if(null!=e&&n)for(var r of n(e))t.indexOf(r)<0&&i.call(e,r)&&(o[r]=e[r]);return o};export function __vite_legacy_guard(){import("data:text/javascript,")}import{j as c,a as h,i as p,P as u,p as m,n as g,r as y,c as f,v,k as x,x as w,w as b,S as P,m as F,_ as M,y as E,b as _,d as D,f as z,e as B}from"./vendor.0eb47a7a.js";import{m as C}from"./maplibre-gl.4d5de089.js";!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))t(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&t(e)})).observe(document,{childList:!0,subtree:!0})}function t(e){if(e.ep)return;e.ep=!0;const t=function(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),"use-credentials"===e.crossorigin?t.credentials="include":"anonymous"===e.crossorigin?t.credentials="omit":t.credentials="same-origin",t}(e);fetch(e.href,t)}}();function A(e,t,o){return[[e[0]*(1-o)+t[0]*o,e[1]*(1-o)+t[1]*o],[e[0]*o+t[0]*(1-o),e[1]*o+t[1]*(1-o)]]}function I(e,t=1,o=!0,n=.25){if(t>10&&(t=10),0==t)return e;if(o){const a=e.length,i=[];for(let t=0;t<a;t++){const o=e[t],r=e[(t+1)%a],[l,s]=A(o,r,n);i.push(l,s)}return I(i,t-1,o,n)}n>.5&&(n=1-n);for(let a=0;a<t;a++){let t=[];t.push(e[0]);for(let o=1;o<e.length;o++){let a=A(e[o-1],e[o],n);t=t.concat(a)}o?t=t.concat(A(e[e.length-1],e[0],n)):t.push(e[e.length-1]),e=t}return e}const L=c,S=h,{VITE_MAPTILER_KEY:j}={VITE_MAPTILER_KEY:"slFPXYgX9y4Pi5zhmMrK",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0},O=u(p({projectId:"check-weather-sg"})),R=Math.abs(104.13-103.565),T=Math.abs(1.475-1.156),k=m([[[-180,90],[180,90],[180,-90],[-180,-90],[-180,90]],[[103.565,1.475],[104.13,1.475],[104.13,1.156],[103.565,1.156],[103.565,1.475]]]),N=["#40FFFD","#3BEEEC","#32D0D2","#2CB9BD","#229698","#1C827D","#1B8742","#229F44","#27B240","#2CC53B","#30D43E","#38EF46","#3BFB49","#59FA61","#FEFB63","#FDFA53","#FDEB50","#FDD74A","#FCC344","#FAB03F","#FAA23D","#FB8938","#FB7133","#F94C2D","#F9282A","#DD1423","#BE0F1D","#B21867","#D028A6","#F93DF5"],V=N.length,$={type:"Polygon",coordinates:[[[103.56983184814452,1.1984523335134731],[103.71986389160156,1.1459349466540576],[104.13459777832031,1.2763684180848154],[104.0789794921875,1.3580576343735706],[104.09442901611328,1.3913503559342686],[104.08344268798828,1.4260154737416286],[104.04155731201172,1.4462651532861726],[103.97151947021484,1.4229265238497912],[103.9368438720703,1.4304772829308758],[103.89667510986328,1.4263586901405338],[103.86817932128906,1.4555318956783565],[103.81153106689452,1.4788701887242242],[103.75968933105469,1.4469515799492016],[103.72535705566406,1.4596504356431457],[103.67523193359375,1.4308204986633148],[103.65943908691406,1.4067952740787528],[103.61721038818358,1.323391529857783],[103.56983184814452,1.1984523335134731]]]};window.$map&&window.$map.remove();const H=[103.565,1.156,104.13,1.475],q=()=>({padding:window.innerWidth>640&&window.innerHeight>640?120:0}),K=window.$map=new C.Map({container:"map",center:[103.8475,1.3011],style:`https://api.maptiler.com/maps/aecd4cb7-a35b-4c10-89aa-0f4bd52ed1cb/style.json?key=${j}`,minZoom:8,maxZoom:14,renderWorldCopies:!1,boxZoom:!1,pitchWithRotate:!1,dragRotate:!1,touchPitch:!1,attributionControl:!1,bounds:H,fitBoundsOptions:q()});K.touchZoomRotate.disableRotation(),K.addControl(new C.NavigationControl({showCompass:!1}),"top-right"),K.addControl(new C.GeolocateControl({trackUserLocation:!0}),"top-right");K.addControl(new class{onAdd(e){this._map=e,this._container=document.createElement("div"),this._container.className="maplibregl-ctrl maplibregl-ctrl-group";const t=document.createElement("button");return t.type="button",t.title="Snap to boundary",t.innerHTML='<svg height="100%" width="100%" viewBox="0 0 24 24" fill="#333"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm-7 7H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4z"/></svg>',t.onclick=t=>{t.preventDefault(),this._container.hidden=!0,e.fitBounds(H,q(),{snap:!0})},this._container.appendChild(t),this._container.hidden=!0,e.on("moveend",(e=>{e.snap||(this._container.hidden=!1)})),this._container}onRemove(){this._container.parentNode.removeChild(this._container),this._map=void 0}},"top-right");const U=document.getElementById("loader");K.on("dataloading",(e=>{U.hidden=!1}));let X=null;K.on("data",(e=>{clearTimeout(X),X=setTimeout((()=>{U.hidden=!0}),500)}));const Z=document.getElementById("legend"),W=document.getElementById("info-button"),Y=document.getElementById("legend-close");W.onclick=e=>{e.preventDefault(),Z.hidden=!Z.hidden},Y.onclick=e=>{e.preventDefault(),Z.hidden=!0};const G=g((e=>(e.match(/\d{4}$/)||[""])[0].replace(/(\d{2})(\d{2})/,((e,t,o)=>{let n=parseInt(t,10);const a=n>=12?"PM":"AM";return 0==n&&(n=12),n>12&&(n-=12),n+":"+o+" "+a})))),J=g((e=>y(103.565+e/217*R,4))),Q=g((e=>y(1.475-e/120*T,4))),ee=new Array(26040).fill(0),te=g(((e,t)=>{const o=t.trimEnd().split(/\n/g),n=ee.slice();for(let a=0,i=o.length;a<i;a++){const e=o[a];for(let t=e.search(/[^\s]/),o=e.length;t<o;t++){const o=e[t];if(o&&" "!==o){const e=o.charCodeAt()-33;n[217*a+t]=e}}}return n}),{maxArgs:1}),oe=f().size([217,120]).thresholds([4,10,20,30,40,50,60,70,80,85,90,95,97.5]).smooth(!1),ne=g(((e,t)=>{const o=[],n=oe(t);for(let a=0,i=n.length;a<i;a++){const{type:t,value:i,coordinates:r}=n[a];r.length&&o.push({type:"Feature",properties:{intensity:i,id:e},geometry:{type:t,coordinates:r.map((e=>e.map((e=>(e.pop(),I(e).map((([e,t])=>[J(e),Q(t)])))))))}})}return o}),{maxArgs:1}),ae=g(((e,t,o)=>{const n=[];for(let a=0,i=t.length;a<i;a++)n[a]=(t[a]+o[a])/2;return n}),{maxArgs:1}),ie=()=>{fetch("https://api.checkweather.sg/v2/observations").then((e=>e.json())).then((e=>{const t=e.map((e=>{const t=e,{id:o,lng:n,lat:a}=t,i=d(t,["id","lng","lat"]);return D([n,a],i,{id:o})})),o=z(t);K.getSource("observations").setData(o)}))},re=(e,t,o=!1)=>{o&&e(),setTimeout(requestAnimationFrame,t,(()=>{e(),re(e,t)}))},le=e=>{var t=e,{values:o=[],maxValue:n=null,smoothIterations:a=1,style:i={}}=t,r=d(t,["values","maxValue","smoothIterations","style"]);if(!o.length)return null;const c=o.length-1,h=n||Math.max(...o);let p="";return I(o.map(((e,t)=>[Math.round(t/c*100),Math.round(e/h*100)])),a,!1).forEach(((e,t)=>{t>0&&(p+=","),p+=`${e[0]}% ${100-e[1]}%`})),L("div",s(l({},r),{style:s(l({},i),{clipPath:`polygon(0 100%, ${p}, 100% 100%)`})}))};const se=new Promise((e=>{K.once("styledata",e)})),de=v(b(O,"weather"),w("id","desc"),x(25));let ce=!0,he=!1;P(L((()=>{const[e,t]=F(!1),[o,n]=M(null),[a,i]=M([]),[r,l]=F(!1),[s,d]=F(!1),[c,h]=F(document.hidden);E((()=>{document.addEventListener("visibilitychange",(()=>{h(document.hidden)}),!1)}),[]);const p=function(e,t=1){let o;return function(...n){clearTimeout(o),o=setTimeout((()=>e.call(this,...n)),t)}}((e=>{ce&&console.timeEnd("Fetch Snapshots"),t(!1);const a=e.docs.map((e=>e.data().coverage_percentage.all)).reduce(((e,t)=>e+t))/e.docs.length;he=a>50;const r=()=>{console.time("Process Snapshots");const t=[],a=[],r=e.docs.reverse();r.forEach(((e,o)=>{const n=e.data(),i=te(n.id,n.radar),l=ne(n.id,i);a.push(...l);const s=r[o+1];if(s&&!he){const e=s.data(),t=te(e.id,e.radar),o=""+(Number(n.id)+Number(e.id))/2,r=ae(o,i,t),l=ne(o,r);a.push(...l)}t.push(n)}));const l=z(a);se.then((()=>{K.getFilter("rainradar")||K.setFilter("rainradar",["==","id",e.docs[0].data().id],{validate:!1}),K.getSource("rainradar").setData(l),o||n(t.length),i(t)})),console.timeEnd("Process Snapshots")};if(ce){const t=e.docs[0].data(),o=te(t.id,t.radar),n=ne(t.id,o);se.then((()=>{K.getSource("rainradar").setData(z(n)),ce=!1,K.once("idle",(()=>requestAnimationFrame(r)))}))}else r()}),300);E((()=>{let e=()=>{};return c?(l(!1),ce=!1):(console.log("Start Snapshots"),console.time("Fetch Snapshots"),t(!0),e=B(de,p)),()=>e()}),[c]);const u=a.length;if(u<=1)return null;E((()=>{if(o&&u){const e=Math.round(o),t=.5*Math.round(o/.5);let n=a[e-1].id;if(t!==e&&!he){const e=a[Math.floor(t)-1],o=a[Math.ceil(t)-1];if(e&&o){n=""+(e.dt+o.dt)/2}}d(!1),K.setFilter("rainradar",["==","id",n],{validate:!1});const i=o<u-1;K.setPaintProperty("tempreadings","text-opacity",i?.3:1),K.setPaintProperty("humidreadings","text-opacity",i?.3:1),K.setPaintProperty("rainreadings","text-opacity",i?.3:1),K.setPaintProperty("windirections","icon-opacity",i?.1:.3)}}),[o,a]),E((()=>{o<u&&!r&&d(!0)}),[a]);const{id:m}=a[Math.round(o)-1],g=a.map((e=>e.coverage_percentage.sg)),y=Math.max(...g);_((()=>{const e=o>=u;e&&y<5?l(!1):n(e?1:o+.5)}),r?o===u?2e3:100:null);const f=(o-1)/(u-1)*100,v=Math.max(y/100*24,16);return S("div",{id:"player-content",class:e?"loading":"",children:[L("div",{id:"player-button",class:r?"playing":"",onClick:()=>{s?n(u):(o!==u||r||n(1),l(!r))},children:L("div",{id:"player-icon",children:L("svg",{width:v,height:v,viewBox:"0 0 24 24",children:L("path",{d:s?"M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z":r?"M6 19h4V5H6v14zm8-14v14h4V5h-4z":"M8 5v14l11-7z"})})})}),S("div",{id:"player-range",children:[L("div",{id:"player-time",class:o===u?"now":"",style:{left:`${f}%`,transform:`translateX(-${f}%)`},children:G(m)}),L(le,{values:g,maxValue:100,smoothIterations:2,style:{height:40},id:"player-sparkline"}),L("progress",{value:o,max:u}),S("div",{id:"player-labels",children:[L("span",{children:G(a[0].id)}),L("span",{children:G(a[Math.round(u/2)-1].id)}),L("span",{children:G(a[u-1].id)})]}),L("input",{type:"range",min:"1",max:u,step:"any",value:o,onInput:e=>{l(!1),n(e.target.value)},onMouseUp:()=>n(Math.round(o)),onTouchEnd:e=>{n(Math.round(o));const t=e.changedTouches[0];if(t){const{width:e,x:o}=t.target.getBoundingClientRect(),a=8,i=e-2*a,r=(t.clientX-a-o)/i*(u-1)+1;n(Math.max(1,Math.min(u,Math.round(r))))}},onTouchCancel:()=>n(Math.round(o))})]})]})}),{}),document.getElementById("player")),(async()=>{await se,K.addSource("observations",{type:"geojson",data:{type:"FeatureCollection",features:[]},tolerance:5,buffer:0,maxzoom:14}),K.addSource("rainradar",{type:"geojson",data:{type:"FeatureCollection",features:[]},maxzoom:14});const e=K.getStyle().layers;let t;for(let a=0;a<e.length;a++){const{id:o,type:n,layout:i}=e[a];if("symbol"===n&&i["text-field"]&&(t||(t=e[a].id)),"symbol"===n){const e=K.getPaintProperty(o,"text-opacity");K.setPaintProperty(o,"text-opacity",["case",["within",$],e||1,0]);const t=K.getPaintProperty(o,"icon-opacity");"number"==typeof t&&K.setPaintProperty(o,"icon-opacity",["case",["within",$],t||1,0])}}const o=["interpolate-lab",["linear"],["number",["get","intensity"],0],0,"transparent",...N.reduce(((e,t,o)=>{const n=(o+1)/V*100;return e.push(n,t),e}),[])],n={"fill-extrusion-color":"#070707","fill-extrusion-opacity":.6,"fill-extrusion-height":101,"fill-extrusion-vertical-gradient":!1};K.addLayer({id:"water-overlay",type:"fill-extrusion",source:"openmaptiles","source-layer":"water",paint:n},t),K.addLayer({id:"rainradar",type:"fill-extrusion",source:"rainradar",paint:{"fill-extrusion-vertical-gradient":!1,"fill-extrusion-height":["number",["get","intensity"],0],"fill-extrusion-color":o,"fill-extrusion-opacity":["interpolate",["linear"],["zoom"],8,1,12,.15]}},"water-overlay"),K.addLayer({id:"tempreadings",type:"symbol",source:"observations",minzoom:8.5,filter:["all",["has","temp_celcius"],[">","temp_celcius",0]],layout:{"text-field":"{temp_celcius}°","text-allow-overlap":!0,"text-ignore-placement":!0,"text-size":["interpolate",["linear"],["zoom"],8,10,14,28],"text-padding":1,"text-font":["Noto Sans Regular"]},paint:{"text-color":"yellow","text-halo-color":"#000","text-halo-width":1.5}}),K.loadImage("/assets/arrow-down-white.a77103cb.png",((e,t)=>{K.addImage("arrow",t)})),K.addLayer({id:"windirections",type:"symbol",source:"observations",filter:["has","wind_direction"],layout:{"icon-image":"arrow","icon-rotate":["get","wind_direction"],"icon-allow-overlap":!0,"icon-ignore-placement":!0,"icon-size":["interpolate",["linear"],["zoom"],8,.05,14,.6]},paint:{"icon-opacity":.3}},"tempreadings"),K.addLayer({id:"humidreadings",type:"symbol",source:"observations",minzoom:10,filter:["all",["has","relative_humidity"],[">","relative_humidity",0]],layout:{"text-field":"{relative_humidity}%","text-ignore-placement":!0,"text-size":["interpolate",["linear"],["zoom"],8,8,14,14*1.1],"text-offset":[0,-1.2],"text-padding":0,"text-font":["Noto Sans Regular"]},paint:{"text-color":"orange","text-halo-color":"#000","text-halo-width":1.5}}),K.addLayer({id:"rainreadings",type:"symbol",source:"observations",minzoom:12,filter:["all",["has","rain_mm"],[">","rain_mm",0]],layout:{"text-field":"{rain_mm}mm","text-size":["interpolate",["linear"],["zoom"],8,8,14,14*1.1],"text-ignore-placement":!0,"text-offset":[0,1.2],"text-padding":0,"text-font":["Noto Sans Regular"]},paint:{"text-color":"aqua","text-halo-color":"#000","text-halo-width":1.5}}),re(ie,12e4,!0),K.addLayer({id:"bbox",type:"fill",source:{type:"geojson",tolerance:10,buffer:0,data:k,maxzoom:14},paint:{"fill-color":"rgba(0,0,0,.5)","fill-antialias":!1}},t)})();navigator.vendor&&-1!==navigator.vendor.indexOf("Apple")&&setTimeout((function(){const e=window.devicePixelRatio,t=document.createElement("canvas"),o=t.width=window.screen.width*e,n=t.height=window.screen.height*e,a=t.getContext("2d");a.fillStyle="#343332",a.fillRect(0,0,o,n);const i=new Image;i.onload=()=>{const e=i.width/i.height;i.width=o/2,i.height=o/2/e,a.drawImage(i,(o-i.width)/2,(n-i.height)/2,i.width,i.height),document.head.insertAdjacentHTML("beforeend",`<link rel="apple-touch-startup-image" href="${t.toDataURL()}">`)},i.src="/assets/icon-standalone.05748528.svg"}),5e3);
//# sourceMappingURL=index.9d67e87c.js.map
