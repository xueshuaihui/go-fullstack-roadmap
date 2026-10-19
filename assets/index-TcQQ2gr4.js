var Ec=Object.defineProperty;var yc=(e,n,t)=>n in e?Ec(e,n,{enumerable:!0,configurable:!0,writable:!0,value:t}):e[n]=t;var Xe=(e,n,t)=>yc(e,typeof n!="symbol"?n+"":n,t);(function(){const n=document.createElement("link").relList;if(n&&n.supports&&n.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))r(s);new MutationObserver(s=>{for(const o of s)if(o.type==="childList")for(const i of o.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(s){const o={};return s.integrity&&(o.integrity=s.integrity),s.referrerPolicy&&(o.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?o.credentials="include":s.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(s){if(s.ep)return;s.ep=!0;const o=t(s);fetch(s.href,o)}})();/**
* @vue/shared v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function po(e){const n=Object.create(null);for(const t of e.split(","))n[t]=1;return t=>t in n}const De={},vt=[],Gn=()=>{},na=()=>!1,os=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),is=e=>e.startsWith("onUpdate:"),rn=Object.assign,mo=(e,n)=>{const t=e.indexOf(n);t>-1&&e.splice(t,1)},Sc=Object.prototype.hasOwnProperty,ve=(e,n)=>Sc.call(e,n),ie=Array.isArray,gt=e=>yr(e)==="[object Map]",Qr=e=>yr(e)==="[object Set]",zo=e=>yr(e)==="[object Date]",de=e=>typeof e=="function",$e=e=>typeof e=="string",Qn=e=>typeof e=="symbol",Te=e=>e!==null&&typeof e=="object",ta=e=>(Te(e)||de(e))&&de(e.then)&&de(e.catch),ra=Object.prototype.toString,yr=e=>ra.call(e),bc=e=>yr(e).slice(8,-1),sa=e=>yr(e)==="[object Object]",Eo=e=>$e(e)&&e!=="NaN"&&e[0]!=="-"&&""+parseInt(e,10)===e,Xt=po(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"),as=e=>{const n=Object.create(null);return(t=>n[t]||(n[t]=e(t)))},xc=/-\w/g,Dn=as(e=>e.replace(xc,n=>n.slice(1).toUpperCase())),_c=/\B([A-Z])/g,Tt=as(e=>e.replace(_c,"-$1").toLowerCase()),oa=as(e=>e.charAt(0).toUpperCase()+e.slice(1)),Ds=as(e=>e?`on${oa(e)}`:""),Un=(e,n)=>!Object.is(e,n),Hr=(e,...n)=>{for(let t=0;t<e.length;t++)e[t](...n)},ia=(e,n,t,r=!1)=>{Object.defineProperty(e,n,{configurable:!0,enumerable:!1,writable:r,value:t})},yo=e=>{const n=parseFloat(e);return isNaN(n)?e:n};let Ko;const ls=()=>Ko||(Ko=typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{});function Wt(e){if(ie(e)){const n={};for(let t=0;t<e.length;t++){const r=e[t],s=$e(r)?Rc(r):Wt(r);if(s)for(const o in s)n[o]=s[o]}return n}else if($e(e)||Te(e))return e}const Cc=/;(?![^(]*\))/g,vc=/:([^]+)/,kc=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function Rc(e){const n={};return e.replace(kc,t=>t.startsWith("/*")?"":t).split(Cc).forEach(t=>{if(t){const r=t.split(vc);r.length>1&&(n[r[0].trim()]=r[1].trim())}}),n}function Ie(e){let n="";if($e(e))n=e;else if(ie(e))for(let t=0;t<e.length;t++){const r=Ie(e[t]);r&&(n+=r+" ")}else if(Te(e))for(const t in e)e[t]&&(n+=t+" ");return n.trim()}const wc="itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly",Tc=po(wc);function aa(e){return!!e||e===""}function Dc(e,n,t){if(e.length!==n.length)return!1;let r=!0;for(let s=0;r&&s<e.length;s++)r=cs(e[s],n[s],t);return r}function Jo(e,n,t){if(e.size!==n.size)return!1;const r=Array.from(n),s=new Uint8Array(r.length);for(const o of e){let i=-1;for(let a=0;a<r.length;a++)if(!s[a]&&cs(o,r[a],t)){i=a;break}if(i<0)return!1;s[i]=1}return!0}function Ac(e,n,t){let r=gt(e),s=gt(n);if(r||s||(r=Qr(e),s=Qr(n),r||s))return r&&s?Jo(e,n,t):!1;const o=Object.keys(e).length,i=Object.keys(n).length;if(o!==i)return!1;for(const a in e){const l=e.hasOwnProperty(a),c=n.hasOwnProperty(a);if(l&&!c||!l&&c||!cs(e[a],n[a],t))return!1}return String(e)===String(n)}function Vo(e,n,t,r){t||(t=[new Map,new Map]);const[s,o]=t;if(s.has(e)||o.has(n))return s.get(e)===n&&o.get(n)===e;s.set(e,n),o.set(n,e);const i=r(e,n,t);return s.delete(e),o.delete(n),i}function cs(e,n,t){if(e===n)return!0;let r=zo(e),s=zo(n);return r||s?r&&s?e.getTime()===n.getTime():!1:(r=Qn(e),s=Qn(n),r||s?e===n:(r=ie(e),s=ie(n),r||s?r&&s?Vo(e,n,t,Dc):!1:(r=Te(e),s=Te(n),r||s?!r||!s?!1:Vo(e,n,t,Ac):String(e)===String(n))))}const la=e=>!!(e&&e.__v_isRef===!0),R=e=>$e(e)?e:e==null?"":ie(e)||Te(e)&&(e.toString===ra||!de(e.toString))?la(e)?R(e.value):JSON.stringify(e,ca,2):String(e),ca=(e,n)=>la(n)?ca(e,n.value):gt(n)?{[`Map(${n.size})`]:[...n.entries()].reduce((t,[r,s],o)=>(t[As(r,o)+" =>"]=s,t),{})}:Qr(n)?{[`Set(${n.size})`]:[...n.values()].map(t=>As(t))}:Qn(n)?As(n):Te(n)&&!ie(n)&&!sa(n)?String(n):n,As=(e,n="")=>{var t;return Qn(e)?`Symbol(${(t=e.description)!=null?t:n})`:e};/**
* @vue/reactivity v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let tn;class Nc{constructor(n=!1){this.detached=n,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!n&&tn&&(tn.active?(this.parent=tn,this.index=(tn.scopes||(tn.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let n,t;if(this.scopes){const r=this.scopes.slice();for(n=0,t=r.length;n<t;n++)r[n].pause()}for(n=0,t=this.effects.length;n<t;n++)this.effects[n].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let n,t;if(this.scopes){const s=this.scopes.slice();for(n=0,t=s.length;n<t;n++)s[n].resume()}const r=this.effects.slice();for(n=0,t=r.length;n<t;n++)r[n].resume()}}run(n){if(this._active){const t=tn;try{return tn=this,n()}finally{tn=t}}}on(){++this._on===1&&(this.prevScope=tn,tn=this)}off(){if(this._on>0&&--this._on===0){if(tn===this)tn=this.prevScope;else{let n=tn;for(;n;){if(n.prevScope===this){n.prevScope=this.prevScope;break}n=n.prevScope}}this.prevScope=void 0}}stop(n){if(this._active){this._active=!1;let t,r;for(t=0,r=this.effects.length;t<r;t++)this.effects[t].stop();for(this.effects.length=0,t=0,r=this.cleanups.length;t<r;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){const s=this.scopes.slice();for(t=0,r=s.length;t<r;t++)s[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!n){const s=this.parent.scopes.pop();s&&s!==this&&(this.parent.scopes[this.index]=s,s.index=this.index)}this.parent=void 0}}}function Oc(){return tn}let Le;const Ns=new WeakSet;class ua{constructor(n){this.fn=n,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,tn&&(tn.active?tn.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ns.has(this)&&(Ns.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||fa(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Yo(this),ha(this);const n=Le,t=An;Le=this,An=!0;try{return this.fn()}finally{ga(this),Le=n,An=t,this.flags&=-3}}stop(){if(this.flags&1){for(let n=this.deps;n;n=n.nextDep)xo(n);this.deps=this.depsTail=void 0,Yo(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ns.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Zs(this)&&this.run()}get dirty(){return Zs(this)}}let da=0,Zt,er;function fa(e,n=!1){if(e.flags|=8,n){e.next=er,er=e;return}e.next=Zt,Zt=e}function So(){da++}function bo(){if(--da>0)return;if(er){let n=er;for(er=void 0;n;){const t=n.next;n.next=void 0,n.flags&=-9,n=t}}let e;for(;Zt;){let n=Zt;for(Zt=void 0;n;){const t=n.next;if(n.next=void 0,n.flags&=-9,n.flags&1)try{n.trigger()}catch(r){e||(e=r)}n=t}}if(e)throw e}function ha(e){for(let n=e.deps;n;n=n.nextDep)n.version=-1,n.prevActiveLink=n.dep.activeLink,n.dep.activeLink=n}function ga(e){let n,t=e.depsTail,r=t;for(;r;){const s=r.prevDep;r.version===-1?(r===t&&(t=s),xo(r),Lc(r)):n=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=s}e.deps=n,e.depsTail=t}function Zs(e){for(let n=e.deps;n;n=n.nextDep)if(n.dep.version!==n.version||n.dep.computed&&(pa(n.dep.computed)||n.dep.version!==n.version))return!0;return!!e._dirty}function pa(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===sr)||(e.globalVersion=sr,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Zs(e))))return;e.flags|=2;const n=e.dep,t=Le,r=An;Le=e,An=!0;try{ha(e);const s=e.fn(e._value);(n.version===0||Un(s,e._value))&&(e.flags|=128,e._value=s,n.version++)}catch(s){throw n.version++,s}finally{Le=t,An=r,ga(e),e.flags&=-3}}function xo(e,n=!1){const{dep:t,prevSub:r,nextSub:s}=e;if(r&&(r.nextSub=s,e.prevSub=void 0),s&&(s.prevSub=r,e.nextSub=void 0),t.subs===e&&(t.subs=r,!r&&t.computed)){t.computed.flags&=-5;for(let o=t.computed.deps;o;o=o.nextDep)xo(o,!0)}!n&&!--t.sc&&t.map&&t.map.delete(t.key)}function Lc(e){const{prevDep:n,nextDep:t}=e;n&&(n.nextDep=t,e.prevDep=void 0),t&&(t.prevDep=n,e.nextDep=void 0)}let An=!0;const ma=[];function zn(){ma.push(An),An=!1}function Kn(){const e=ma.pop();An=e===void 0?!0:e}function Yo(e){const{cleanup:n}=e;if(e.cleanup=void 0,n){const t=Le;Le=void 0;try{n()}finally{Le=t}}}let sr=0;class Ic{constructor(n,t){this.sub=n,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}}class _o{constructor(n){this.computed=n,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(n){if(!Le||!An||Le===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==Le)t=this.activeLink=new Ic(Le,this),Le.deps?(t.prevDep=Le.depsTail,Le.depsTail.nextDep=t,Le.depsTail=t):Le.deps=Le.depsTail=t,Ea(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){const r=t.nextDep;r.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=r),t.prevDep=Le.depsTail,t.nextDep=void 0,Le.depsTail.nextDep=t,Le.depsTail=t,Le.deps===t&&(Le.deps=r)}return t}trigger(n){this.version++,sr++,this.notify(n)}notify(n){So();try{for(let t=this.subs;t;t=t.prevSub)t.sub.notify()&&t.sub.dep.notify()}finally{bo()}}}function Ea(e){if(e.dep.sc++,e.sub.flags&4){const n=e.dep.computed;if(n&&!e.dep.subs){n.flags|=20;for(let r=n.deps;r;r=r.nextDep)Ea(r)}const t=e.dep.subs;t!==e&&(e.prevSub=t,t&&(t.nextSub=e)),e.dep.subs=e}}const eo=new WeakMap,kt=Symbol(""),no=Symbol(""),or=Symbol("");function an(e,n,t){if(An&&Le){let r=eo.get(e);r||eo.set(e,r=new Map);let s=r.get(t);s||(r.set(t,s=new _o),s.map=r,s.key=t),s.track()}}function ot(e,n,t,r,s,o){const i=eo.get(e);if(!i){sr++;return}const a=l=>{l&&l.trigger()};if(So(),n==="clear")i.forEach(a);else{const l=ie(e),c=l&&Eo(t);if(l&&t==="length"){const u=Number(r);i.forEach((d,m)=>{(m==="length"||m===or||!Qn(m)&&m>=u)&&a(d)})}else switch((t!==void 0||i.has(void 0))&&a(i.get(t)),c&&a(i.get(or)),n){case"add":l?c&&a(i.get("length")):(a(i.get(kt)),gt(e)&&a(i.get(no)));break;case"delete":l||(a(i.get(kt)),gt(e)&&a(i.get(no)));break;case"set":gt(e)&&a(i.get(kt));break}}bo()}function Ot(e){const n=ke(e);return n===e||(an(n,"iterate",or),Cn(e))?n:Jn(e)?pt(e)?n.map(t=>mt(vn(t))):n.map(mt):n.map(vn)}function us(e){return an(e=ke(e),"iterate",or),e}function Fn(e,n){return Jn(e)?mt(pt(e)?vn(n):n):vn(n)}const Mc={__proto__:null,[Symbol.iterator](){return Os(this,Symbol.iterator,e=>Fn(this,e))},concat(...e){return Ot(this).concat(...e.map(n=>ie(n)?Ot(n):n))},entries(){return Os(this,"entries",e=>(e[1]=Fn(this,e[1]),e))},every(e,n){return nt(this,"every",e,n,void 0,arguments)},filter(e,n){return nt(this,"filter",e,n,t=>t.map(r=>Fn(this,r)),arguments)},find(e,n){return nt(this,"find",e,n,t=>Fn(this,t),arguments)},findIndex(e,n){return nt(this,"findIndex",e,n,void 0,arguments)},findLast(e,n){return nt(this,"findLast",e,n,t=>Fn(this,t),arguments)},findLastIndex(e,n){return nt(this,"findLastIndex",e,n,void 0,arguments)},forEach(e,n){return nt(this,"forEach",e,n,void 0,arguments)},includes(...e){return Ls(this,"includes",e)},indexOf(...e){return Ls(this,"indexOf",e)},join(e){return Ot(this).join(e)},lastIndexOf(...e){return Ls(this,"lastIndexOf",e)},map(e,n){return nt(this,"map",e,n,void 0,arguments)},pop(){return Qt(this,"pop")},push(...e){return Qt(this,"push",e)},reduce(e,...n){return Zo(this,"reduce",e,n)},reduceRight(e,...n){return Zo(this,"reduceRight",e,n)},shift(){return Qt(this,"shift")},some(e,n){return nt(this,"some",e,n,void 0,arguments)},splice(...e){return Qt(this,"splice",e)},toReversed(){return Ot(this).toReversed()},toSorted(e){return Ot(this).toSorted(e)},toSpliced(...e){return Ot(this).toSpliced(...e)},unshift(...e){return Qt(this,"unshift",e)},values(){return Os(this,"values",e=>Fn(this,e))}};function Os(e,n,t){const r=us(e),s=r[n],o=s.call(r);if(r!==e&&!Cn(e)){if(o[Symbol.toStringTag]==="Array Iterator"){const i=Object.create(Object.getPrototypeOf(o));return i.next=()=>Xo(o.next(),t),s!==ya[n]&&Object.defineProperties(i,{return:{get(){const a=o.return;return typeof a=="function"?a.bind(o):a}},throw:{get(){const a=o.throw;return typeof a=="function"?a.bind(o):a}}}),i}o._next=o.next,o.next=()=>Xo(o._next(),t)}return o}function Xo(e,n){return e.done||(e.value=n(e.value)),e}const ya=Array.prototype;function nt(e,n,t,r,s,o){const i=us(e),a=i!==e&&!Cn(e),l=i[n];if(l!==ya[n]){const d=l.apply(e,o);return a?vn(d):d}let c=t;i!==e&&(a?c=function(d,m){return t.call(this,Fn(e,d),m,e)}:t.length>2&&(c=function(d,m){return t.call(this,d,m,e)}));const u=l.call(i,c,r);return a&&s?s(u):u}function Zo(e,n,t,r){const s=us(e),o=s!==e&&!Cn(e);let i=t,a=!1;s!==e&&(o?(a=r.length===0,i=function(c,u,d){return a&&(a=!1,c=Fn(e,c)),t.call(this,c,Fn(e,u),d,e)}):t.length>3&&(i=function(c,u,d){return t.call(this,c,u,d,e)}));const l=s[n](i,...r);return a?Fn(e,l):l}function Ls(e,n,t){const r=ke(e);an(r,"iterate",or);const s=r[n](...t);return(s===-1||s===!1)&&ko(t[0])?(t[0]=ke(t[0]),r[n](...t)):s}function Qt(e,n,t=[]){zn(),So();const r=ke(e)[n].apply(e,t);return bo(),Kn(),r}const Pc=po("__proto__,__v_isRef,__isVue"),Sa=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!=="arguments"&&e!=="caller").map(e=>Symbol[e]).filter(Qn));function Fc(e){Qn(e)||(e=String(e));const n=ke(this);return an(n,"has",e),n.hasOwnProperty(e)}class ba{constructor(n=!1,t=!1){this._isReadonly=n,this._isShallow=t}get(n,t,r){if(t==="__v_skip")return n.__v_skip;const s=this._isReadonly,o=this._isShallow;if(t==="__v_isReactive")return!s;if(t==="__v_isReadonly")return s;if(t==="__v_isShallow")return o;if(t==="__v_raw")return r===(s?o?zc:va:o?Ca:_a).get(n)||Object.getPrototypeOf(n)===Object.getPrototypeOf(r)?n:void 0;const i=ie(n);if(!s){let l;if(i&&(l=Mc[t]))return l;if(t==="hasOwnProperty")return Fc}const a=Reflect.get(n,t,ln(n)?n:r);if((Qn(t)?Sa.has(t):Pc(t))||(s||an(n,"get",t),o))return a;if(ln(a)){const l=i&&Eo(t)?a:a.value;return s&&Te(l)?ro(l):l}return Te(a)?s?ro(a):Ht(a):a}}class xa extends ba{constructor(n=!1){super(!1,n)}set(n,t,r,s){let o=n[t];const i=ie(n)&&Eo(t);if(!this._isShallow){const c=Jn(o);if(!Cn(r)&&!Jn(r)&&(o=ke(o),r=ke(r)),!i&&ln(o)&&!ln(r))return c||(o.value=r),!0}const a=i?Number(t)<n.length:ve(n,t),l=Reflect.set(n,t,r,ln(n)?n:s);return n===ke(s)&&l&&(a?Un(r,o)&&ot(n,"set",t,r):ot(n,"add",t,r)),l}deleteProperty(n,t){const r=ve(n,t);n[t];const s=Reflect.deleteProperty(n,t);return s&&r&&ot(n,"delete",t,void 0),s}has(n,t){const r=Reflect.has(n,t);return(!Qn(t)||!Sa.has(t))&&an(n,"has",t),r}ownKeys(n){return an(n,"iterate",ie(n)?"length":kt),Reflect.ownKeys(n)}}class Bc extends ba{constructor(n=!1){super(!0,n)}set(n,t){return!0}deleteProperty(n,t){return!0}}const qc=new xa,Uc=new Bc,Wc=new xa(!0);const to=e=>e,Ar=e=>Reflect.getPrototypeOf(e);function Hc(e,n,t){return function(...r){const s=this.__v_raw,o=ke(s),i=gt(o),a=e==="entries"||e===Symbol.iterator&&i,l=e==="keys"&&i,c=s[e](...r),u=t?to:n?mt:vn;return!n&&an(o,"iterate",l?no:kt),rn(Object.create(c),{next(){const{value:d,done:m}=c.next();return m?{value:d,done:m}:{value:a?[u(d[0]),u(d[1])]:u(d),done:m}}})}}function Nr(e){return function(...n){return e==="delete"?!1:e==="clear"?void 0:this}}function Gc(e,n){const t={get(s){const o=this.__v_raw,i=ke(o),a=ke(s);e||(Un(s,a)&&an(i,"get",s),an(i,"get",a));const{has:l}=Ar(i),c=n?to:e?mt:vn;if(l.call(i,s))return c(o.get(s));if(l.call(i,a))return c(o.get(a));o!==i&&o.get(s)},get size(){const s=this.__v_raw;return!e&&an(ke(s),"iterate",kt),s.size},has(s){const o=this.__v_raw,i=ke(o),a=ke(s);return e||(Un(s,a)&&an(i,"has",s),an(i,"has",a)),s===a?o.has(s):o.has(s)||o.has(a)},forEach(s,o){const i=this,a=i.__v_raw,l=ke(a),c=n?to:e?mt:vn;return!e&&an(l,"iterate",kt),a.forEach((u,d)=>s.call(o,c(u),c(d),i))}};return rn(t,e?{add:Nr("add"),set:Nr("set"),delete:Nr("delete"),clear:Nr("clear")}:{add(s){const o=ke(this),i=Ar(o),a=ke(s),l=!n&&!Cn(s)&&!Jn(s)?a:s;return i.has.call(o,l)||Un(s,l)&&i.has.call(o,s)||Un(a,l)&&i.has.call(o,a)||(o.add(l),ot(o,"add",l,l)),this},set(s,o){!n&&!Cn(o)&&!Jn(o)&&(o=ke(o));const i=ke(this),{has:a,get:l}=Ar(i);let c=a.call(i,s);c||(s=ke(s),c=a.call(i,s));const u=l.call(i,s);return i.set(s,o),c?Un(o,u)&&ot(i,"set",s,o):ot(i,"add",s,o),this},delete(s){const o=ke(this),{has:i,get:a}=Ar(o);let l=i.call(o,s);l||(s=ke(s),l=i.call(o,s)),a&&a.call(o,s);const c=o.delete(s);return l&&ot(o,"delete",s,void 0),c},clear(){const s=ke(this),o=s.size!==0,i=s.clear();return o&&ot(s,"clear",void 0,void 0),i}}),["keys","values","entries",Symbol.iterator].forEach(s=>{t[s]=Hc(s,e,n)}),t}function Co(e,n){const t=Gc(e,n);return(r,s,o)=>s==="__v_isReactive"?!e:s==="__v_isReadonly"?e:s==="__v_isShallow"?n:s==="__v_raw"?r:Reflect.get(ve(t,s)&&s in r?t:r,s,o)}const $c={get:Co(!1,!1)},jc={get:Co(!1,!0)},Qc={get:Co(!0,!1)};const _a=new WeakMap,Ca=new WeakMap,va=new WeakMap,zc=new WeakMap;function Kc(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}function Ht(e){return Jn(e)?e:vo(e,!1,qc,$c,_a)}function Jc(e){return vo(e,!1,Wc,jc,Ca)}function ro(e){return vo(e,!0,Uc,Qc,va)}function vo(e,n,t,r,s){if(!Te(e)||e.__v_raw&&!(n&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;const o=s.get(e);if(o)return o;const i=Kc(bc(e));if(i===0)return e;const a=new Proxy(e,i===2?r:t);return s.set(e,a),a}function pt(e){return Jn(e)?pt(e.__v_raw):!!(e&&e.__v_isReactive)}function Jn(e){return!!(e&&e.__v_isReadonly)}function Cn(e){return!!(e&&e.__v_isShallow)}function ko(e){return e?!!e.__v_raw:!1}function ke(e){const n=e&&e.__v_raw;return n?ke(n):e}function Vc(e){return!ve(e,"__v_skip")&&Object.isExtensible(e)&&ia(e,"__v_skip",!0),e}const vn=e=>Te(e)?Ht(e):e,mt=e=>Te(e)?ro(e):e;function ln(e){return e?e.__v_isRef===!0:!1}function $n(e){return Yc(e,!1)}function Yc(e,n){return ln(e)?e:new Xc(e,n)}class Xc{constructor(n,t){this.dep=new _o,this.__v_isRef=!0,this.__v_isShallow=!1,this._rawValue=t?n:ke(n),this._value=t?n:vn(n),this.__v_isShallow=t}get value(){return this.dep.track(),this._value}set value(n){const t=this._rawValue,r=this.__v_isShallow||Cn(n)||Jn(n);n=r?n:ke(n),Un(n,t)&&(this._rawValue=n,this._value=r?n:vn(n),this.dep.trigger())}}function F(e){return ln(e)?e.value:e}const Zc={get:(e,n,t)=>n==="__v_raw"?e:F(Reflect.get(e,n,t)),set:(e,n,t,r)=>{const s=e[n];return ln(s)&&!ln(t)?(s.value=t,!0):Reflect.set(e,n,t,r)}};function ka(e){return pt(e)?e:new Proxy(e,Zc)}class eu{constructor(n,t,r){this.fn=n,this.setter=t,this._value=void 0,this.dep=new _o(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=sr-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=r}notify(){if(this.flags|=16,!(this.flags&8)&&Le!==this)return fa(this,!0),!0}get value(){const n=this.dep.track();return pa(this),n&&(n.version=this.dep.version),this._value}set value(n){this.setter&&this.setter(n)}}function nu(e,n,t=!1){let r,s;return de(e)?r=e:(r=e.get,s=e.set),new eu(r,s,t)}const Or={},zr=new WeakMap;let Ct;function tu(e,n=!1,t=Ct){if(t){let r=zr.get(t);r||zr.set(t,r=[]),r.push(e)}}function ru(e,n,t=De){const{immediate:r,deep:s,once:o,scheduler:i,augmentJob:a,call:l}=t,c=S=>s?S:Cn(S)||s===!1||s===0?it(S,1):it(S);let u,d,m,f,g=!1,b=!1;if(ln(e)?(d=()=>e.value,g=Cn(e)):pt(e)?(d=()=>c(e),g=!0):ie(e)?(b=!0,g=e.some(S=>pt(S)||Cn(S)),d=()=>e.map(S=>{if(ln(S))return S.value;if(pt(S))return c(S);if(de(S))return l?l(S,2):S()})):de(e)?n?d=l?()=>l(e,2):e:d=()=>{if(m){zn();try{m()}finally{Kn()}}const S=Ct;Ct=u;try{return l?l(e,3,[f]):e(f)}finally{Ct=S}}:d=Gn,n&&s){const S=d,T=s===!0?1/0:s;d=()=>it(S(),T)}const _=Oc(),w=()=>{u.stop(),_&&_.active&&mo(_.effects,u)};if(o&&n){const S=n;n=(...T)=>{try{return S(...T)}finally{w()}}}let A=b?new Array(e.length).fill(Or):Or;const x=S=>{if(!(!(u.flags&1)||!u.dirty&&!S))if(n){const T=u.run();if(S||s||g||(b?T.some((C,k)=>Un(C,A[k])):Un(T,A))){const C=Ct;zn();try{m&&m(),Ct=u;const k=[T,A===Or?void 0:b&&A[0]===Or?[]:A,f];A=T,l?l(n,3,k):n(...k)}finally{Ct=C,Kn()}}}else u.run()};return a&&a(x),u=new ua(d),u.scheduler=i?()=>i(x,!1):x,f=S=>tu(S,!1,u),m=u.onStop=()=>{const S=zr.get(u);if(S){if(l)l(S,4);else for(const T of S)T();zr.delete(u)}},n?r?x(!0):A=u.run():i?i(x.bind(null,!0),!0):u.run(),w.pause=u.pause.bind(u),w.resume=u.resume.bind(u),w.stop=w,w}function it(e,n=1/0,t){if(n<=0||!Te(e)||e.__v_skip||(t=t||new Map,(t.get(e)||0)>=n))return e;if(t.set(e,n),n--,ln(e))it(e.value,n,t);else if(ie(e))for(let r=0;r<e.length;r++)it(e[r],n,t);else if(Qr(e)||gt(e))e.forEach(r=>{it(r,n,t)});else if(sa(e)){for(const r in e)it(e[r],n,t);for(const r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&it(e[r],n,t)}return e}/**
* @vue/runtime-core v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/function Sr(e,n,t,r){try{return r?e(...r):e()}catch(s){ds(s,n,t)}}function Nn(e,n,t,r){if(de(e)){const s=Sr(e,n,t,r);return s&&ta(s)&&s.catch(o=>{ds(o,n,t)}),s}if(ie(e)){const s=[];for(let o=0;o<e.length;o++)s.push(Nn(e[o],n,t,r));return s}}function ds(e,n,t,r=!0){const s=n?n.vnode:null,{errorHandler:o,throwUnhandledErrorInProduction:i}=n&&n.appContext.config||De;if(n){let a=n.parent;const l=n.proxy,c=`https://vuejs.org/error-reference/#runtime-${t}`;for(;a;){const u=a.ec;if(u){for(let d=0;d<u.length;d++)if(u[d](e,l,c)===!1)return}a=a.parent}if(o){zn(),Sr(o,null,10,[e,l,c]),Kn();return}}su(e,t,s,r,i)}function su(e,n,t,r=!0,s=!1){if(s)throw e;console.error(e)}const un=[];let Tn=-1;const Bn=[];let ft=null,It=0;const Ra=Promise.resolve();let Kr=null;function ir(e){const n=Kr||Ra;return e?n.then(this?e.bind(this):e):n}function ou(e){let n=Tn+1,t=un.length;for(;n<t;){const r=n+t>>>1,s=un[r],o=ar(s);o<e||o===e&&s.flags&2?n=r+1:t=r}return n}function Ro(e){if(!(e.flags&1)){const n=ar(e),t=un[un.length-1];!t||!(e.flags&2)&&n>=ar(t)?un.push(e):un.splice(ou(n),0,e),e.flags|=1,wa()}}function wa(){Kr||(Kr=Ra.then(Aa))}function iu(e){if(!ie(e))ft&&e.id===-1?ft.splice(It+1,0,e):e.flags&1||(Bn.push(e),e.flags|=1);else for(let n=0;n<e.length;n++)Bn.push(e[n]);wa()}function Ta(e,n,t,r=Tn+1){for(;r<un.length;r++){const s=un[r];if(s&&s.flags&2){if(e&&s.id!==e.uid||n!==void 0&&!(s.id>=n))continue;un.splice(r,1),r=e?r-1:Tn,s.flags&4&&(s.flags&=-2),s(),s.flags&4||(s.flags&=-2)}}}function Da(e,n,t=0){if(Bn.length){let r=Bn,s=0;if(n){r=[];for(let i=0;i<Bn.length;i++){const a=Bn[i];(a.i!==void 0?!a.i||a.i.uid<t:n.has(a))?Bn[s++]=a:r.push(a)}}const o=[...new Set(r)].sort((i,a)=>ar(i)-ar(a));if(Bn.length=s,ft){for(let i=0;i<o.length;i++)ft.push(o[i]);return}for(ft=o,It=0;It<ft.length;It++){const i=ft[It];i.flags&4&&(i.flags&=-2),i.flags&8||i(),i.flags&=-2}ft=null,It=0}}let Is=!1;function au(e,n){if(Is){e();return}const t=n===void 0?void 0:new Set(Bn);e(),Is=!0;try{Ta(void 0,n),Da(void 0,t,n)}finally{Is=!1}}const ar=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Aa(e){try{for(Tn=0;Tn<un.length;Tn++){const n=un[Tn];n&&!(n.flags&8)&&(n.flags&4&&(n.flags&=-2),Sr(n,n.i,n.i?15:14),n.flags&4||(n.flags&=-2))}}finally{for(;Tn<un.length;Tn++){const n=un[Tn];n&&(n.flags&=-2)}Tn=-1,un.length=0,Da(),Kr=null,(un.length||Bn.length)&&Aa()}}let _n=null,Na=null;function Jr(e){const n=_n;return _n=e,Na=e&&e.type.__scopeId||null,n}function lu(e,n=_n,t){if(!n||e._n)return e;const r=(...s)=>{r._d&&ui(-1);const o=Jr(n),i=Rt.length;let a;try{a=e(...s)}finally{for(let l=Rt.length;l>i;l--)el();Jr(o),r._d&&ui(1)}return a};return r._n=!0,r._c=!0,r._d=!0,r}function fs(e,n){if(_n===null)return e;const t=ys(_n),r=e.dirs||(e.dirs=[]);for(let s=0;s<n.length;s++){let[o,i,a,l=De]=n[s];o&&(de(o)&&(o={mounted:o,updated:o}),o.deep&&it(i),r.push({dir:o,instance:t,value:i,oldValue:void 0,arg:a,modifiers:l}))}return e}function bt(e,n,t,r){const s=e.dirs,o=n&&n.dirs;for(let i=0;i<s.length;i++){const a=s[i];o&&(a.oldValue=o[i].value);let l=a.dir[r];l&&(zn(),Nn(l,t,8,[e.el,a,e,n]),Kn())}}function cu(e,n){if(dn){let t=dn.provides;const r=dn.parent&&dn.parent.provides;r===t&&(t=dn.provides=Object.create(r)),t[e]=n}}function Gr(e,n,t=!1){const r=od();if(r||Pt){let s=Pt?Pt._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(s&&e in s)return s[e];if(arguments.length>1)return t&&de(n)?n.call(r&&r.proxy):n}}const uu=Symbol.for("v-scx"),du=()=>Gr(uu);function jn(e,n,t){return Oa(e,n,t)}function Oa(e,n,t=De){const{immediate:r,deep:s,flush:o,once:i}=t,a=rn({},t),l=n&&r||!n&&o!=="post";let c;if(ur){if(o==="sync"){const f=du();c=f.__watcherHandles||(f.__watcherHandles=[])}else if(!l){const f=()=>{};return f.stop=Gn,f.resume=Gn,f.pause=Gn,f}}const u=dn;a.call=(f,g,b)=>Nn(f,u,g,b);let d=!1;o==="post"?a.scheduler=f=>{f.i=u,fn(f,u&&u.suspense)}:o!=="sync"&&(d=!0,a.scheduler=(f,g)=>{g?f():Ro(f)}),a.augmentJob=f=>{n&&(f.flags|=4),d&&(f.flags|=2,u&&(f.id=u.uid,f.i=u))};const m=ru(e,n,a);return ur&&(c?c.push(m):l&&m()),m}function fu(e,n,t){const r=this.proxy,s=$e(e)?e.includes(".")?La(r,e):()=>r[e]:e.bind(r,r);let o;de(n)?o=n:(o=n.handler,t=n);const i=br(this),a=Oa(s,o.bind(r),t);return i(),a}function La(e,n){const t=n.split(".");return()=>{let r=e;for(let s=0;s<t.length&&r;s++)r=r[t[s]];return r}}const hu=Symbol("_vte"),hs=e=>e.__isTeleport,Ms=Symbol("_leaveCb");function gu(e){let n=e[0];if(e.length>1){for(const t of e)if(t.type!==On){n=t;break}}return n}function Ia(e){if(!wo(e))return hs(e.type)&&e.children?gu(e.children):e;if(e.component)return e.component.subTree;const{shapeFlag:n,children:t}=e;if(t){if(n&16)return t[0];if(n&32&&de(t.default))return t.default()}}function Vr(e,n){if(e.shapeFlag&6&&e.component){e.transition=n;const t=e.component.subTree;Vr(hs(t.type)&&Ia(t)||t,n)}else if(e.shapeFlag&128)e.ssContent.transition=n.clone(e.ssContent),e.ssFallback.transition=n.clone(e.ssFallback);else if(e.transition=n,e.type===Ae&&ie(e.children)){const t=Wa(e.children,!1);t&&Vr(t,n)}}function so(e){if(e.component)return so(e.component.subTree);if(e.type===Ae){const n=ie(e.children)&&Wa(e.children,!1);return n?so(n):void 0}if(e.type!==On)return e}function Ln(e,n){return de(e)?rn({name:e.name},n,{setup:e}):e}function Ma(e){e.ids=[e.ids[0]+e.ids[2]+++"-",0,0]}function ei(e,n){let t;return!!((t=Object.getOwnPropertyDescriptor(e,n))&&!t.configurable)}const Yr=new WeakMap;function nr(e,n,t,r,s=!1){if(ie(e)){e.forEach((b,_)=>nr(b,n&&(ie(n)?n[_]:n),t,r,s));return}if(tr(r)&&!s){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&nr(e,n,t,r.component.subTree);return}const o=r.shapeFlag&4?ys(r.component):r.el,i=s?null:o,{i:a,r:l}=e,c=n&&n.r,u=a.refs===De?a.refs={}:a.refs,d=a.setupState,m=ke(d),f=d===De?na:b=>ei(u,b)?!1:ve(m,b),g=(b,_)=>!(_&&ei(u,_));if(c!=null&&c!==l){if(ni(n),$e(c))u[c]=null,f(c)&&(d[c]=null);else if(ln(c)){const b=n;g(c,b.k)&&(c.value=null),b.k&&(u[b.k]=null)}}if(de(l))Sr(l,a,12,[i,u]);else{const b=$e(l),_=ln(l);if(b||_){const w=()=>{if(e.f){const A=b?f(l)?d[l]:u[l]:g()||!e.k?l.value:u[e.k];if(s)ie(A)&&mo(A,o);else if(ie(A))A.includes(o)||A.push(o);else if(b)u[l]=[o],f(l)&&(d[l]=u[l]);else{const x=[o];g(l,e.k)&&(l.value=x),e.k&&(u[e.k]=x)}}else b?(u[l]=i,f(l)&&(d[l]=i)):_&&(g(l,e.k)&&(l.value=i),e.k&&(u[e.k]=i))};if(i){const A=()=>{w(),Yr.delete(e)};A.id=-1,Yr.set(e,A),fn(A,t)}else ni(e),w()}}}function ni(e){const n=Yr.get(e);n&&(n.flags|=8,Yr.delete(e))}ls().requestIdleCallback;ls().cancelIdleCallback;const tr=e=>!!e.type.__asyncLoader,wo=e=>e.type.__isKeepAlive;function pu(e,n){Pa(e,"a",n)}function mu(e,n){Pa(e,"da",n)}function Pa(e,n,t=dn){const r=e.__wdc||(e.__wdc=()=>{let s=t;for(;s;){if(s.isDeactivated)return;s=s.parent}return e()});if(gs(n,r,t),t){let s=t.parent;for(;s&&s.parent;)wo(s.parent.vnode)&&Eu(r,n,t,s),s=s.parent}}function Eu(e,n,t,r){const s=gs(n,e,r,!0);ps(()=>{mo(r[n],s)},t)}function gs(e,n,t=dn,r=!1){if(t){const s=t[e]||(t[e]=[]),o=n.__weh||(n.__weh=(...i)=>{zn();const a=br(t),l=Nn(n,t,e,i);return a(),Kn(),l});return r?s.unshift(o):s.push(o),o}}const ct=e=>(n,t=dn)=>{(!ur||e==="sp")&&gs(e,(...r)=>n(...r),t)},yu=ct("bm"),To=ct("m"),Su=ct("bu"),bu=ct("u"),xu=ct("bum"),ps=ct("um"),_u=ct("sp"),Cu=ct("rtg"),vu=ct("rtc");function ku(e,n=dn){gs("ec",e,n)}const Ru=Symbol.for("v-ndc");function pn(e,n,t,r){let s;const o=t,i=ie(e);if(i||$e(e)){const a=i&&pt(e);let l=!1,c=!1;a&&(l=!Cn(e),c=Jn(e),e=us(e)),s=new Array(e.length);for(let u=0,d=e.length;u<d;u++)s[u]=n(l?c?mt(vn(e[u])):vn(e[u]):e[u],u,void 0,o)}else if(typeof e=="number")if(!Number.isInteger(e)||e<0)s=[];else{s=new Array(e);for(let a=0;a<e;a++)s[a]=n(a+1,a,void 0,o)}else if(Te(e))if(e[Symbol.iterator])s=Array.from(e,(a,l)=>n(a,l,void 0,o));else{const a=Object.keys(e);s=new Array(a.length);for(let l=0,c=a.length;l<c;l++){const u=a[l];s[l]=n(e[u],u,l,o)}}else s=[];return s}const oo=e=>e?sl(e)?ys(e):oo(e.parent):null,rr=rn(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>oo(e.parent),$root:e=>oo(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Ba(e),$forceUpdate:e=>e.f||(e.f=()=>{Ro(e.update)}),$nextTick:e=>e.n||(e.n=ir.bind(e.proxy)),$watch:e=>fu.bind(e)}),Ps=(e,n)=>e!==De&&!e.__isScriptSetup&&ve(e,n),wu={get({_:e},n){if(n==="__v_skip")return!0;const{ctx:t,setupState:r,data:s,props:o,accessCache:i,type:a,appContext:l}=e;if(n[0]!=="$"){const m=i[n];if(m!==void 0)switch(m){case 1:return r[n];case 2:return s[n];case 4:return t[n];case 3:return o[n]}else{if(Ps(r,n))return i[n]=1,r[n];if(s!==De&&ve(s,n))return i[n]=2,s[n];if(ve(o,n))return i[n]=3,o[n];if(t!==De&&ve(t,n))return i[n]=4,t[n];io&&(i[n]=0)}}const c=rr[n];let u,d;if(c)return n==="$attrs"&&an(e.attrs,"get",""),c(e);if((u=a.__cssModules)&&(u=u[n]))return u;if(t!==De&&ve(t,n))return i[n]=4,t[n];if(d=l.config.globalProperties,ve(d,n))return d[n]},set({_:e},n,t){const{data:r,setupState:s,ctx:o}=e;return Ps(s,n)?(s[n]=t,!0):r!==De&&ve(r,n)?(r[n]=t,!0):ve(e.props,n)||n[0]==="$"&&n.slice(1)in e?!1:(o[n]=t,!0)},has({_:{data:e,setupState:n,accessCache:t,ctx:r,appContext:s,props:o,type:i}},a){let l;return!!(t[a]||e!==De&&a[0]!=="$"&&ve(e,a)||Ps(n,a)||ve(o,a)||ve(r,a)||ve(rr,a)||ve(s.config.globalProperties,a)||(l=i.__cssModules)&&l[a])},defineProperty(e,n,t){return t.get!=null?e._.accessCache[n]=0:ve(t,"value")&&this.set(e,n,t.value,null),Reflect.defineProperty(e,n,t)}};function ti(e){return ie(e)?e.reduce((n,t)=>(n[t]=null,n),{}):e}let io=!0;function Tu(e){const n=Ba(e),t=e.proxy,r=e.ctx;io=!1,n.beforeCreate&&ri(n.beforeCreate,e,"bc");const{data:s,computed:o,methods:i,watch:a,provide:l,inject:c,created:u,beforeMount:d,mounted:m,beforeUpdate:f,updated:g,activated:b,deactivated:_,beforeDestroy:w,beforeUnmount:A,destroyed:x,unmounted:S,render:T,renderTracked:C,renderTriggered:k,errorCaptured:O,serverPrefetch:q,expose:X,inheritAttrs:ee,components:j,directives:M,filters:ce}=n;if(c&&Du(c,r,null),i)for(const be in i){const oe=i[be];de(oe)&&(r[be]=oe.bind(t))}if(s){const be=s.call(t,t);Te(be)&&(e.data=Ht(be))}if(io=!0,o)for(const be in o){const oe=o[be],Ue=de(oe)?oe.bind(t,t):de(oe.get)?oe.get.bind(t,t):Gn,Ke=!de(oe)&&de(oe.set)?oe.set.bind(t):Gn,We=_e({get:Ue,set:Ke});Object.defineProperty(r,be,{enumerable:!0,configurable:!0,get:()=>We.value,set:He=>We.value=He})}if(a)for(const be in a)Fa(a[be],r,t,be);if(l){const be=de(l)?l.call(t):l;Reflect.ownKeys(be).forEach(oe=>{cu(oe,be[oe])})}u&&ri(u,e,"c");function we(be,oe){ie(oe)?oe.forEach(Ue=>be(Ue.bind(t))):oe&&be(oe.bind(t))}if(we(yu,d),we(To,m),we(Su,f),we(bu,g),we(pu,b),we(mu,_),we(ku,O),we(vu,C),we(Cu,k),we(xu,A),we(ps,S),we(_u,q),ie(X))if(X.length){const be=e.exposed||(e.exposed={});X.forEach(oe=>{Object.defineProperty(be,oe,{get:()=>t[oe],set:Ue=>t[oe]=Ue,enumerable:!0})})}else e.exposed||(e.exposed={});T&&e.render===Gn&&(e.render=T),ee!=null&&(e.inheritAttrs=ee),j&&(e.components=j),M&&(e.directives=M),q&&Ma(e)}function Du(e,n,t=Gn){ie(e)&&(e=ao(e));for(const r in e){const s=e[r];let o;Te(s)?"default"in s?o=Gr(s.from||r,s.default,!0):o=Gr(s.from||r):o=Gr(s),ln(o)?Object.defineProperty(n,r,{enumerable:!0,configurable:!0,get:()=>o.value,set:i=>o.value=i}):n[r]=o}}function ri(e,n,t){Nn(ie(e)?e.map(r=>r.bind(n.proxy)):e.bind(n.proxy),n,t)}function Fa(e,n,t,r){let s=r.includes(".")?La(t,r):()=>t[r];if($e(e)){const o=n[e];de(o)&&jn(s,o)}else if(de(e))jn(s,e.bind(t));else if(Te(e))if(ie(e))e.forEach(o=>Fa(o,n,t,r));else{const o=de(e.handler)?e.handler.bind(t):n[e.handler];de(o)&&jn(s,o,e)}}function Ba(e){const n=e.type,{mixins:t,extends:r}=n,{mixins:s,optionsCache:o,config:{optionMergeStrategies:i}}=e.appContext,a=o.get(n);let l;return a?l=a:!s.length&&!t&&!r?l=n:(l={},s.length&&s.forEach(c=>Xr(l,c,i,!0)),Xr(l,n,i)),Te(n)&&o.set(n,l),l}function Xr(e,n,t,r=!1){const{mixins:s,extends:o}=n;o&&Xr(e,o,t,!0),s&&s.forEach(i=>Xr(e,i,t,!0));for(const i in n)if(!(r&&i==="expose")){const a=Au[i]||t&&t[i];e[i]=a?a(e[i],n[i]):n[i]}return e}const Au={data:si,props:oi,emits:oi,methods:Vt,computed:Vt,beforeCreate:cn,created:cn,beforeMount:cn,mounted:cn,beforeUpdate:cn,updated:cn,beforeDestroy:cn,beforeUnmount:cn,destroyed:cn,unmounted:cn,activated:cn,deactivated:cn,errorCaptured:cn,serverPrefetch:cn,components:Vt,directives:Vt,watch:Ou,provide:si,inject:Nu};function si(e,n){return n?e?function(){return rn(de(e)?e.call(this,this):e,de(n)?n.call(this,this):n)}:n:e}function Nu(e,n){return Vt(ao(e),ao(n))}function ao(e){if(ie(e)){const n={};for(let t=0;t<e.length;t++)n[e[t]]=e[t];return n}return e}function cn(e,n){return e?[...new Set([].concat(e,n))]:n}function Vt(e,n){return e?rn(Object.create(null),e,n):n}function oi(e,n){return e?ie(e)&&ie(n)?[...new Set([...e,...n])]:rn(Object.create(null),ti(e),ti(n??{})):n}function Ou(e,n){if(!e)return n;if(!n)return e;const t=rn(Object.create(null),e);for(const r in n)t[r]=cn(e[r],n[r]);return t}function qa(){return{app:null,config:{isNativeTag:na,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}let Lu=0;function Iu(e,n){return function(r,s=null){de(r)||(r=rn({},r)),s!=null&&!Te(s)&&(s=null);const o=qa(),i=new WeakSet,a=[];let l=!1;const c=o.app={_uid:Lu++,_component:r,_props:s,_container:null,_context:o,_instance:null,version:dd,get config(){return o.config},set config(u){},use(u,...d){return i.has(u)||(u&&de(u.install)?(i.add(u),u.install(c,...d)):de(u)&&(i.add(u),u(c,...d))),c},mixin(u){return o.mixins.includes(u)||o.mixins.push(u),c},component(u,d){return d?(o.components[u]=d,c):o.components[u]},directive(u,d){return d?(o.directives[u]=d,c):o.directives[u]},mount(u,d,m){if(!l){const f=c._ceVNode||me(r,s);return f.appContext=o,m===!0?m="svg":m===!1&&(m=void 0),e(f,u,m),l=!0,c._container=u,u.__vue_app__=c,ys(f.component)}},onUnmount(u){a.push(u)},unmount(){l&&(Nn(a,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(u,d){return o.provides[u]=d,c},runWithContext(u){const d=Pt;Pt=c;try{return u()}finally{Pt=d}}};return c}}let Pt=null;const Mu=(e,n)=>n==="modelValue"||n==="model-value"?e.modelModifiers:e[`${n}Modifiers`]||e[`${Dn(n)}Modifiers`]||e[`${Tt(n)}Modifiers`];function Pu(e,n,...t){if(e.isUnmounted)return;const r=e.vnode.props||De;let s=t;const o=n.startsWith("update:"),i=o&&Mu(r,n.slice(7));i&&(i.trim&&(s=t.map(u=>$e(u)?u.trim():u)),i.number&&(s=s.map(yo)));let a,l=r[a=Ds(n)]||r[a=Ds(Dn(n))];!l&&o&&(l=r[a=Ds(Tt(n))]),l&&Nn(l,e,6,s);const c=r[a+"Once"];if(c){if(!e.emitted)e.emitted={};else if(e.emitted[a])return;e.emitted[a]=!0,Nn(c,e,6,s)}}const Fu=new WeakMap;function Ua(e,n,t=!1){const r=t?Fu:n.emitsCache,s=r.get(e);if(s!==void 0)return s;const o=e.emits;let i={},a=!1;if(!de(e)){const l=c=>{const u=Ua(c,n,!0);u&&(a=!0,rn(i,u))};!t&&n.mixins.length&&n.mixins.forEach(l),e.extends&&l(e.extends),e.mixins&&e.mixins.forEach(l)}return!o&&!a?(Te(e)&&r.set(e,null),null):(ie(o)?o.forEach(l=>i[l]=null):rn(i,o),Te(e)&&r.set(e,i),i)}function ms(e,n){return!e||!os(n)?!1:(n=n.slice(2),n=n==="Once"?n:n.replace(/Once$/,""),ve(e,n[0].toLowerCase()+n.slice(1))||ve(e,Tt(n))||ve(e,n))}function ii(e){const{type:n,vnode:t,proxy:r,withProxy:s,propsOptions:[o],slots:i,attrs:a,emit:l,render:c,renderCache:u,props:d,data:m,setupState:f,ctx:g,inheritAttrs:b}=e,_=Jr(e);let w,A;try{if(t.shapeFlag&4){const S=s||r,T=S;w=qn(c.call(T,S,u,d,f,m,g)),A=a}else{const S=n;w=qn(S.length>1?S(d,{attrs:a,slots:i,emit:l}):S(d,null)),A=n.props?a:Bu(a)}}catch(S){Rt.length=0,ds(S,e,1),w=me(On)}let x=w;if(A&&b!==!1){const S=Object.keys(A),{shapeFlag:T}=x;S.length&&T&7&&(o&&S.some(is)&&(A=qu(A,o)),x=Bt(x,A,!1,!0))}if(t.dirs&&(x=Bt(x,null,!1,!0),x.dirs=x.dirs?x.dirs.concat(t.dirs):t.dirs),t.transition){const S=hs(x.type)&&Ia(x)||x;Vr(S,t.transition)}return w=x,Jr(_),w}function Wa(e,n=!0){let t;for(let r=0;r<e.length;r++){const s=e[r];if(No(s)){if(s.type!==On||s.children==="v-if"){if(t)return;t=s}}else return}return t}const Bu=e=>{let n;for(const t in e)(t==="class"||t==="style"||os(t))&&((n||(n={}))[t]=e[t]);return n},qu=(e,n)=>{const t={};for(const r in e)(!is(r)||!(r.slice(9)in n))&&(t[r]=e[r]);return t};function Uu(e,n,t){const{props:r,children:s,component:o}=e,{props:i,children:a,patchFlag:l}=n,c=o.emitsOptions;if(n.dirs||n.transition)return!0;if(t&&l>=0){if(l&1024)return!0;if(l&16)return r?ai(r,i,c):!!i;if(l&8){const u=n.dynamicProps;for(let d=0;d<u.length;d++){const m=u[d];if(Ha(i,r,m)&&!ms(c,m))return!0}}}else return(s||a)&&(!a||!a.$stable)?!0:r===i?!1:r?i?ai(r,i,c):!0:!!i;return!1}function ai(e,n,t){const r=Object.keys(n);if(r.length!==Object.keys(e).length)return!0;for(let s=0;s<r.length;s++){const o=r[s];if(!ve(e,o)||Ha(n,e,o)&&!ms(t,o))return!0}return!1}function Ha(e,n,t){const r=e[t],s=n[t];return t==="style"&&Te(r)&&Te(s)?!cs(r,s):r!==s}function Wu({vnode:e,parent:n,suspense:t},r){for(;n;){const s=n.subTree;if(s.suspense&&s.suspense.activeBranch===e&&(s.suspense.vnode.el=s.el=r,e=s),s===e)(e=n.vnode).el=r,n=n.parent;else break}t&&t.activeBranch===e&&(t.vnode.el=r)}const Ga={},$a=()=>Object.create(Ga),ja=e=>Object.getPrototypeOf(e)===Ga;function Hu(e,n,t,r=!1){const s={},o=$a();e.propsDefaults=Object.create(null),Qa(e,n,s,o);for(const i in e.propsOptions[0])i in s||(s[i]=void 0);t?e.props=r?s:Jc(s):e.type.props?e.props=s:e.props=o,e.attrs=o}function Gu(e,n,t,r){const{props:s,attrs:o,vnode:{patchFlag:i}}=e,a=ke(s),[l]=e.propsOptions;let c=!1;if((r||i>0)&&!(i&16)){if(i&8){const u=e.vnode.dynamicProps;for(let d=0;d<u.length;d++){let m=u[d];if(ms(e.emitsOptions,m))continue;const f=n[m];if(l)if(ve(o,m))f!==o[m]&&(o[m]=f,c=!0);else{const g=Dn(m);s[g]=lo(l,a,g,f,e,!1)}else f!==o[m]&&(o[m]=f,c=!0)}}}else{Qa(e,n,s,o)&&(c=!0);let u;for(const d in a)(!n||!ve(n,d)&&((u=Tt(d))===d||!ve(n,u)))&&(l?t&&(t[d]!==void 0||t[u]!==void 0)&&(s[d]=lo(l,a,d,void 0,e,!0)):delete s[d]);if(o!==a)for(const d in o)(!n||!ve(n,d))&&(delete o[d],c=!0)}c&&ot(e.attrs,"set","")}function Qa(e,n,t,r){const[s,o]=e.propsOptions;let i=!1,a;if(n)for(let l in n){if(Xt(l))continue;const c=n[l];let u;s&&ve(s,u=Dn(l))?!o||!o.includes(u)?t[u]=c:(a||(a={}))[u]=c:ms(e.emitsOptions,l)||(!(l in r)||c!==r[l])&&(r[l]=c,i=!0)}if(o){const l=ke(t),c=a||De;for(let u=0;u<o.length;u++){const d=o[u];t[d]=lo(s,l,d,c[d],e,!ve(c,d))}}return i}function lo(e,n,t,r,s,o){const i=e[t];if(i!=null){const a=ve(i,"default");if(a&&r===void 0){const l=i.default;if(i.type!==Function&&!i.skipFactory&&de(l)){const{propsDefaults:c}=s;if(t in c)r=c[t];else{const u=br(s);r=c[t]=l.call(null,n),u()}}else r=l;s.ce&&s.ce._setProp(t,r)}i[0]&&(o&&!a?r=!1:i[1]&&(r===""||r===Tt(t))&&(r=!0))}return r}const $u=new WeakMap;function za(e,n,t=!1){const r=t?$u:n.propsCache,s=r.get(e);if(s)return s;const o=e.props,i={},a=[];let l=!1;if(!de(e)){const u=d=>{l=!0;const[m,f]=za(d,n,!0);rn(i,m),f&&a.push(...f)};!t&&n.mixins.length&&n.mixins.forEach(u),e.extends&&u(e.extends),e.mixins&&e.mixins.forEach(u)}if(!o&&!l)return Te(e)&&r.set(e,vt),vt;if(ie(o))for(let u=0;u<o.length;u++){const d=Dn(o[u]);li(d)&&(i[d]=De)}else if(o)for(const u in o){const d=Dn(u);if(li(d)){const m=o[u],f=i[d]=ie(m)||de(m)?{type:m}:rn({},m),g=f.type;let b=!1,_=!0;if(ie(g))for(let w=0;w<g.length;++w){const A=g[w],x=de(A)&&A.name;if(x==="Boolean"){b=!0;break}else x==="String"&&(_=!1)}else b=de(g)&&g.name==="Boolean";f[0]=b,f[1]=_,(b||ve(f,"default"))&&a.push(d)}}const c=[i,a];return Te(e)&&r.set(e,c),c}function li(e){return e[0]!=="$"&&!Xt(e)}const Do=e=>e==="_"||e==="_ctx"||e==="$stable",Ao=e=>ie(e)?e.map(qn):[qn(e)],ju=(e,n,t)=>{if(n._n)return n;const r=lu((...s)=>Ao(n(...s)),t);return r._c=!1,r},Ka=(e,n,t)=>{const r=e._ctx;for(const s in e){if(Do(s))continue;const o=e[s];if(de(o))n[s]=ju(s,o,r);else if(o!=null){const i=Ao(o);n[s]=()=>i}}},Ja=(e,n)=>{const t=Ao(n);e.slots.default=()=>t},Va=(e,n,t)=>{for(const r in n)(t||!Do(r))&&(e[r]=n[r])},Qu=(e,n,t)=>{const r=e.slots=$a();if(e.vnode.shapeFlag&32){const s=n._;s?(Va(r,n,t),t&&ia(r,"_",s,!0)):Ka(n,r)}else n&&Ja(e,n)},zu=(e,n,t)=>{const{vnode:r,slots:s}=e;let o=!0,i=De;if(r.shapeFlag&32){const a=n._;a?t&&a===1?o=!1:Va(s,n,t):(o=!n.$stable,Ka(n,s)),i=n}else n&&(Ja(e,n),i={default:1});if(o)for(const a in s)!Do(a)&&i[a]==null&&delete s[a]},fn=Xu;function Ku(e){return Ju(e)}function Ju(e,n){const t=ls();t.__VUE__=!0;const{insert:r,remove:s,patchProp:o,createElement:i,createText:a,createComment:l,setText:c,setElementText:u,parentNode:d,nextSibling:m,setScopeId:f=Gn,insertStaticContent:g}=e,b=(h,y,v,P=null,L=null,I=null,G=void 0,H=null,W=!!y.dynamicChildren)=>{if(h===y)return;h&&!zt(h,y)&&(P=Dt(h),He(h,L,I,!0),h=null),y.patchFlag===-2&&(W=!1,y.dynamicChildren=null),y.dynamicChildren&&h&&h.dynamicChildren&&h.dynamicChildren.hasOnce&&(y.dynamicChildren===vt&&(y.dynamicChildren=[]),y.dynamicChildren.hasOnce=!0);const{type:N,ref:ne,shapeFlag:Q}=y;switch(N){case Es:_(h,y,v,P);break;case On:w(h,y,v,P);break;case $r:h==null&&A(y,v,P,G);break;case Ae:j(h,y,v,P,L,I,G,H,W);break;default:Q&1?T(h,y,v,P,L,I,G,H,W):Q&6?M(h,y,v,P,L,I,G,H,W):(Q&64||Q&128)&&N.process(h,y,v,P,L,I,G,H,W,At)}ne!=null&&L?nr(ne,h&&h.ref,I,y||h,!y):ne==null&&h&&h.ref!=null&&nr(h.ref,null,I,h,!0)},_=(h,y,v,P)=>{if(h==null)r(y.el=a(y.children),v,P);else{const L=y.el=h.el;y.children!==h.children&&c(L,y.children)}},w=(h,y,v,P)=>{h==null?r(y.el=l(y.children||""),v,P):y.el=h.el},A=(h,y,v,P)=>{[h.el,h.anchor]=g(h.children,y,v,P,h.el,h.anchor)},x=({el:h,anchor:y},v,P)=>{let L;for(;h&&h!==y;)L=m(h),r(h,v,P),h=L;r(y,v,P)},S=({el:h,anchor:y})=>{let v;for(;h&&h!==y;)v=m(h),s(h),h=v;s(y)},T=(h,y,v,P,L,I,G,H,W)=>{if(y.type==="svg"?G="svg":y.type==="math"&&(G="mathml"),h==null)C(y,v,P,L,I,G,H,W);else{const N=h.el&&h.el._isVueCE?h.el:null;try{N&&N._beginPatch(),q(h,y,L,I,G,H,W)}finally{N&&N._endPatch()}}},C=(h,y,v,P,L,I,G,H)=>{let W,N;const{props:ne,shapeFlag:Q,transition:te,dirs:se}=h;if(W=h.el=i(h.type,I,ne&&ne.is,ne),Q&8?u(W,h.children):Q&16&&O(h.children,W,null,P,L,Fs(h,I),G,H),se&&bt(h,null,P,"created"),k(W,h,h.scopeId,G,P),ne){for(const Se in ne)Se!=="value"&&!Xt(Se)&&o(W,Se,null,ne[Se],I,P);"value"in ne&&o(W,"value",null,ne.value,I),(N=ne.onVnodeBeforeMount)&&Pn(N,P,h)}se&&bt(h,null,P,"beforeMount");const pe=Vu(L,te);pe&&te.beforeEnter(W),r(W,y,v),((N=ne&&ne.onVnodeMounted)||pe||se)&&fn(()=>{try{N&&Pn(N,P,h),pe&&te.enter(W),se&&bt(h,null,P,"mounted")}finally{}},L)},k=(h,y,v,P,L)=>{if(v&&f(h,v),P)for(let I=0;I<P.length;I++)f(h,P[I]);if(L){let I=L.subTree;if(y===I||Za(I.type)&&(I.ssContent===y||I.ssFallback===y)){const G=L.vnode;k(h,G,G.scopeId,G.slotScopeIds,L.parent)}}},O=(h,y,v,P,L,I,G,H,W=0)=>{for(let N=W;N<h.length;N++){const ne=h[N]=H?st(h[N]):qn(h[N]);b(null,ne,y,v,P,L,I,G,H)}},q=(h,y,v,P,L,I,G)=>{const H=y.el=h.el;let{patchFlag:W,dynamicChildren:N,dirs:ne}=y;W|=h.patchFlag&16;const Q=h.props||De,te=y.props||De;let se;if(v&&xt(v,!1),(se=te.onVnodeBeforeUpdate)&&Pn(se,v,y,h),ne&&bt(y,h,v,"beforeUpdate"),v&&xt(v,!0),N&&(!h.dynamicChildren||h.dynamicChildren.length!==N.length)&&(W=0,G=!1,N=null),(Q.innerHTML&&te.innerHTML==null||Q.textContent&&te.textContent==null)&&u(H,""),N?X(h.dynamicChildren,N,H,v,P,Fs(y,L),I):G||oe(h,y,H,null,v,P,Fs(y,L),I,!1),W>0){if(W&16)ee(H,Q,te,v,L);else if(W&2&&Q.class!==te.class&&o(H,"class",null,te.class,L),W&4&&o(H,"style",Q.style,te.style,L),W&8){const pe=y.dynamicProps;for(let Se=0;Se<pe.length;Se++){const xe=pe[Se],Be=Q[xe],Je=te[xe];(Je!==Be||xe==="value")&&o(H,xe,Be,Je,L,v)}}W&1&&h.children!==y.children&&u(H,y.children)}else!G&&N==null&&ee(H,Q,te,v,L);((se=te.onVnodeUpdated)||ne)&&fn(()=>{se&&Pn(se,v,y,h),ne&&bt(y,h,v,"updated")},P)},X=(h,y,v,P,L,I,G)=>{for(let H=0;H<y.length;H++){const W=h[H],N=y[H],ne=W.el||co(W),Q=ne&&(W.type===Ae||!zt(W,N)||W.shapeFlag&198)?d(ne):v;b(W,N,Q,null,P,L,I,G,!0)}},ee=(h,y,v,P,L)=>{if(y!==v){if(y!==De)for(const I in y)!Xt(I)&&!(I in v)&&o(h,I,y[I],null,L,P);for(const I in v){if(Xt(I))continue;const G=v[I],H=y[I];G!==H&&I!=="value"&&o(h,I,H,G,L,P)}"value"in v&&o(h,"value",y.value,v.value,L)}},j=(h,y,v,P,L,I,G,H,W)=>{const N=y.el=h?h.el:a(""),ne=y.anchor=h?h.anchor:a("");let{patchFlag:Q,dynamicChildren:te,slotScopeIds:se}=y;se&&(H=H?H.concat(se):se),h==null?(r(N,v,P),r(ne,v,P),O(y.children||[],v,ne,L,I,G,H,W)):Q>0&&Q&64&&te&&h.dynamicChildren&&h.dynamicChildren.length===te.length?(X(h.dynamicChildren,te,v,L,I,G,H),(y.key!=null||L&&y===L.subTree)&&Ya(h,y,!0)):oe(h,y,v,ne,L,I,G,H,W)},M=(h,y,v,P,L,I,G,H,W)=>{y.slotScopeIds=H,h==null?y.shapeFlag&512?L.ctx.activate(y,v,P,G,W):ce(y,v,P,L,I,G,W):Ce(h,y,W)},ce=(h,y,v,P,L,I,G)=>{const H=h.component=sd(h,P,L);if(wo(h)&&(H.ctx.renderer=At),id(H,!1,G),H.asyncDep){if(L&&L.registerDep(H,we,G,I),!h.el){const W=H.subTree=me(On);w(null,W,y,v),h.placeholder=W.el}}else we(H,h,y,v,L,I,G)},Ce=(h,y,v)=>{const P=y.component=h.component;if(Uu(h,y,v))if(P.asyncDep&&!P.asyncResolved){y.el=h.el,y.placeholder=h.placeholder,be(P,y,v);return}else P.next=y,P.update();else y.el=h.el,y.placeholder=h.placeholder,P.vnode=y},we=(h,y,v,P,L,I,G)=>{const H=()=>{if(h.isMounted){let{next:Q,bu:te,u:se,parent:pe,vnode:Se}=h;{const Sn=Xa(h);if(Sn){Q&&(Q.el=Se.el,be(h,Q,G)),Sn.asyncDep.then(()=>{fn(()=>{h.isUnmounted||N()},L)});return}}let xe=Q,Be;xt(h,!1),Q?(Q.el=Se.el,be(h,Q,G)):Q=Se,te&&Hr(te),(Be=Q.props&&Q.props.onVnodeBeforeUpdate)&&Pn(Be,pe,Q,Se),xt(h,!0);const Je=ii(h),yn=h.subTree;h.subTree=Je,b(yn,Je,d(yn.el),Dt(yn),h,L,I),Q.el=Je.el,xe===null&&Wu(h,Je.el),se&&fn(se,L),(Be=Q.props&&Q.props.onVnodeUpdated)&&fn(()=>Pn(Be,pe,Q,Se),L)}else{let Q;const{el:te,props:se}=y,{bm:pe,m:Se,parent:xe,root:Be,type:Je}=h,yn=tr(y);xt(h,!1),pe&&Hr(pe),!yn&&(Q=se&&se.onVnodeBeforeMount)&&Pn(Q,xe,y),xt(h,!0);{Be.ce&&Be.ce._hasShadowRoot()&&Be.ce._injectChildStyle(Je,h.parent?h.parent.type:void 0);const Sn=h.subTree=ii(h);b(null,Sn,v,P,h,L,I),y.el=Sn.el}if(Se&&fn(Se,L),!yn&&(Q=se&&se.onVnodeMounted)){const Sn=y;fn(()=>Pn(Q,xe,Sn),L)}(y.shapeFlag&256||xe&&tr(xe.vnode)&&xe.vnode.shapeFlag&256)&&h.a&&fn(h.a,L),h.isMounted=!0,y=v=P=null}};h.scope.on();const W=h.effect=new ua(H);h.scope.off();const N=h.update=W.run.bind(W),ne=h.job=W.runIfDirty.bind(W);ne.i=h,ne.id=h.uid,W.scheduler=()=>Ro(ne),xt(h,!0),N()},be=(h,y,v)=>{y.component=h;const P=h.vnode.props;h.vnode=y,h.next=null,Gu(h,y.props,P,v),zu(h,y.children,v),zn(),Ta(h),Kn()},oe=(h,y,v,P,L,I,G,H,W=!1)=>{const N=h&&h.children,ne=h?h.shapeFlag:0,Q=y.children,{patchFlag:te,shapeFlag:se}=y;if(te>0){if(te&128){Ke(N,Q,v,P,L,I,G,H,W);return}else if(te&256){Ue(N,Q,v,P,L,I,G,H,W);return}}se&8?(ne&16&&Zn(N,L,I),Q!==N&&u(v,Q)):ne&16?se&16?Ke(N,Q,v,P,L,I,G,H,W):Zn(N,L,I,!0):(ne&8&&u(v,""),se&16&&O(Q,v,P,L,I,G,H,W))},Ue=(h,y,v,P,L,I,G,H,W)=>{h=h||vt,y=y||vt;const N=h.length,ne=y.length,Q=Math.min(N,ne);let te;for(te=0;te<Q;te++){const se=y[te]=W?st(y[te]):qn(y[te]);b(h[te],se,v,null,L,I,G,H,W)}N>ne?Zn(h,L,I,!0,!1,Q):O(y,v,P,L,I,G,H,W,Q)},Ke=(h,y,v,P,L,I,G,H,W)=>{let N=0;const ne=y.length;let Q=h.length-1,te=ne-1;for(;N<=Q&&N<=te;){const se=h[N],pe=y[N]=W?st(y[N]):qn(y[N]);if(zt(se,pe))b(se,pe,v,null,L,I,G,H,W);else break;N++}for(;N<=Q&&N<=te;){const se=h[Q],pe=y[te]=W?st(y[te]):qn(y[te]);if(zt(se,pe))b(se,pe,v,null,L,I,G,H,W);else break;Q--,te--}if(N>Q){if(N<=te){const se=te+1,pe=se<ne?y[se].el:P;for(;N<=te;)b(null,y[N]=W?st(y[N]):qn(y[N]),v,pe,L,I,G,H,W),N++}}else if(N>te)for(;N<=Q;)He(h[N],L,I,!0),N++;else{const se=N,pe=N,Se=new Map;for(N=pe;N<=te;N++){const sn=y[N]=W?st(y[N]):qn(y[N]);sn.key!=null&&Se.set(sn.key,N)}let xe,Be=0;const Je=te-pe+1;let yn=!1,Sn=0;const yt=new Array(Je);for(N=0;N<Je;N++)yt[N]=0;for(N=se;N<=Q;N++){const sn=h[N];if(Be>=Je){He(sn,L,I,!0);continue}let bn;if(sn.key!=null)bn=Se.get(sn.key);else for(xe=pe;xe<=te;xe++)if(yt[xe-pe]===0&&zt(sn,y[xe])){bn=xe;break}bn===void 0?He(sn,L,I,!0):(yt[bn-pe]=N+1,bn>=Sn?Sn=bn:yn=!0,b(sn,y[bn],v,null,L,I,G,H,W),Be++)}const _r=yn?Yu(yt):vt;for(xe=_r.length-1,N=Je-1;N>=0;N--){const sn=pe+N,bn=y[sn],Cr=y[sn+1],vr=sn+1<ne?Cr.el||co(Cr):P;yt[N]===0?b(null,bn,v,vr,L,I,G,H,W):yn&&(xe<0||N!==_r[xe]?We(bn,v,vr,2):xe--)}}},We=(h,y,v,P,L=null)=>{const{el:I,type:G,transition:H,children:W,shapeFlag:N}=h;if(N&6){We(h.component.subTree,y,v,P);return}if(N&128){h.suspense.move(y,v,P);return}if(N&64){G.move(h,y,v,At);return}if(G===Ae){r(I,y,v);for(let Q=0;Q<W.length;Q++)We(W[Q],y,v,P);r(h.anchor,y,v);return}if(G===$r){x(h,y,v);return}if(P!==2&&N&1&&H)if(P===0)H.persisted&&!I[Ms]?r(I,y,v):(H.beforeEnter(I),r(I,y,v),fn(()=>H.enter(I),L));else{const{leave:Q,delayLeave:te,afterLeave:se}=H,pe=()=>{h.ctx.isUnmounted?s(I):r(I,y,v)},Se=()=>{const xe=I._isLeaving||!!I[Ms];I._isLeaving&&I[Ms](!0),H.persisted&&!xe?pe():Q(I,()=>{pe(),se&&se()})};te?te(I,pe,Se):Se()}else r(I,y,v)},He=(h,y,v,P=!1,L=!1)=>{const{type:I,props:G,ref:H,children:W,dynamicChildren:N,shapeFlag:ne,patchFlag:Q,dirs:te,cacheIndex:se,memo:pe}=h;if((Q===-2||N&&N.hasOnce)&&(L=!1),H!=null&&(zn(),nr(H,null,v,h,!0),Kn()),se!=null&&(!h.ctx||h.ctx===y)&&(y.renderCache[se]=void 0),ne&256){y.ctx.deactivate(h);return}const Se=ne&1&&te,xe=!tr(h);let Be;if(xe&&(Be=G&&G.onVnodeBeforeUnmount)&&Pn(Be,y,h),ne&6)Fe(h.component,v,P);else{if(ne&128){h.suspense.unmount(v,P);return}Se&&bt(h,null,y,"beforeUnmount"),ne&64?h.type.remove(h,y,v,At,P):N&&!N.hasOnce&&(I!==Ae||Q>0&&Q&64)?Zn(N,y,v,!1,!0):(I===Ae&&Q&384||!L&&ne&16)&&Zn(W,y,v),P&&En(h)}const Je=pe!=null&&se==null;(xe&&(Be=G&&G.onVnodeUnmounted)||Se||Je)&&fn(()=>{Be&&Pn(Be,y,h),Se&&bt(h,null,y,"unmounted"),Je&&(h.el=null)},v)},En=h=>{const{type:y,el:v,anchor:P,transition:L}=h,I=y===Ae;if(I&&!L){ge(v,P);return}if(y===$r){S(h),L&&!L.persisted&&L.afterLeave&&L.afterLeave();return}const G=I?so(h):h,H=()=>{I?d(v)&&ge(v,P):s(v),L&&!L.persisted&&L.afterLeave&&L.afterLeave()};if(G&&G.shapeFlag&1&&L&&!L.persisted){const{leave:W,delayLeave:N}=L,ne=G.el,Q=()=>W(ne,H);N?N(ne,H,Q):Q()}else H()},ge=(h,y)=>{let v;for(;h!==y;)v=m(h),s(h),h=v;s(y)},Fe=(h,y,v)=>{const{bum:P,scope:L,job:I,subTree:G,um:H,m:W,a:N}=h;ci(W),ci(N),P&&Hr(P),L.stop(),I?(I.flags|=8,He(G,h,y,v)):h.vnode.el&&G&&(G.transition=h.vnode.transition,He(G,h,y,v)),H&&fn(H,y),fn(()=>{h.isUnmounted=!0},y)},Zn=(h,y,v,P=!1,L=!1,I=0)=>{for(let G=I;G<h.length;G++)He(h[G],y,v,P,L)},Dt=h=>{if(h.shapeFlag&6)return Dt(h.component.subTree);if(h.shapeFlag&128)return h.suspense.next();const y=m(h.anchor||h.el),v=y&&y[hu];return v?m(v):y},xr=(h,y,v)=>{const P=h&&y._vnode?void 0:h&&h.component?h.component.uid:rd();au(()=>{h==null?y._vnode&&He(y._vnode,null,null,!0):b(y._vnode||null,h,y,null,null,null,v),y._vnode=h},P)},At={p:b,um:He,m:We,r:En,mt:ce,mc:O,pc:oe,pbc:X,n:Dt,o:e};return{render:xr,hydrate:void 0,createApp:Iu(xr)}}function Fs({type:e,props:n},t){return t==="svg"&&e==="foreignObject"||t==="mathml"&&e==="annotation-xml"&&n&&n.encoding&&n.encoding.includes("html")?void 0:t}function xt({effect:e,job:n},t){t?(e.flags|=32,n.flags|=4):(e.flags&=-33,n.flags&=-5)}function Vu(e,n){return(!e||e&&!e.pendingBranch)&&n&&!n.persisted}function Ya(e,n,t=!1){const r=e.children,s=n.children;if(ie(r)&&ie(s))for(let o=0;o<r.length;o++){const i=r[o];let a=s[o];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=s[o]=st(s[o]),a.el=i.el),!t&&a.patchFlag!==-2&&Ya(i,a)),a.type===Es&&(a.patchFlag===-1&&(a=s[o]=st(a)),a.el=i.el),a.type===On&&!a.el&&(a.el=i.el)}}function Yu(e){const n=e.slice(),t=[0];let r,s,o,i,a;const l=e.length;for(r=0;r<l;r++){const c=e[r];if(c!==0){if(s=t[t.length-1],e[s]<c){n[r]=s,t.push(r);continue}for(o=0,i=t.length-1;o<i;)a=o+i>>1,e[t[a]]<c?o=a+1:i=a;c<e[t[o]]&&(o>0&&(n[r]=t[o-1]),t[o]=r)}}for(o=t.length,i=t[o-1];o-- >0;)t[o]=i,i=n[i];return t}function Xa(e){const n=e.subTree.component;if(n)return n.asyncDep&&!n.asyncResolved?n:Xa(n)}function ci(e){if(e)for(let n=0;n<e.length;n++)e[n].flags|=8}function co(e){if(e.placeholder)return e.placeholder;const n=e.component;return n?co(n.subTree):null}const Za=e=>e.__isSuspense;function Xu(e,n){n&&n.pendingBranch?ie(e)?n.effects.push(...e):n.effects.push(e):iu(e)}const Ae=Symbol.for("v-fgt"),Es=Symbol.for("v-txt"),On=Symbol.for("v-cmt"),$r=Symbol.for("v-stc"),Rt=[];let mn=null;function B(e=!1){Rt.push(mn=e?null:[])}function el(){Rt.pop(),mn=Rt[Rt.length-1]||null}let lr=1;function ui(e,n=!1){lr+=e,e<0&&mn&&n&&(mn.hasOnce=!0)}function nl(e){return e.dynamicChildren=lr>0?mn||vt:null,el(),lr>0&&mn&&mn.push(e),e}function $(e,n,t,r,s,o){return nl(p(e,n,t,r,s,o,!0))}function at(e,n,t,r,s){return nl(me(e,n,t,r,s,!0))}function No(e){return e?e.__v_isVNode===!0:!1}function zt(e,n){return e.type===n.type&&e.key===n.key}const tl=({key:e})=>e??null,jr=({ref:e,ref_key:n,ref_for:t})=>(typeof e=="number"&&(e=""+e),e!=null?$e(e)||ln(e)||de(e)?{i:_n,r:e,k:n,f:!!t}:e:null);function p(e,n=null,t=null,r=0,s=null,o=e===Ae?0:1,i=!1,a=!1){const l={__v_isVNode:!0,__v_skip:!0,type:e,props:n,key:n&&tl(n),ref:n&&jr(n),scopeId:Na,slotScopeIds:null,children:t,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:o,patchFlag:r,dynamicProps:s,dynamicChildren:null,appContext:null,ctx:_n};return a?(Zr(l,t),o&128&&e.normalize(l)):t&&(l.shapeFlag|=$e(t)?8:16),lr>0&&!i&&mn&&(l.patchFlag>0||o&6)&&l.patchFlag!==32&&mn.push(l),l}const me=Zu;function Zu(e,n=null,t=null,r=0,s=null,o=!1){if((!e||e===Ru)&&(e=On),No(e)){const a=Bt(e,n,!0);return t&&Zr(a,t),lr>0&&!o&&mn&&(a.shapeFlag&6?mn[mn.indexOf(e)]=a:mn.push(a)),a.patchFlag=-2,a}if(ud(e)&&(e=e.__vccOpts),n){n=ed(n);let{class:a,style:l}=n;a&&!$e(a)&&(n.class=Ie(a)),Te(l)&&(ko(l)&&!ie(l)&&(l=rn({},l)),n.style=Wt(l))}const i=$e(e)?1:Za(e)?128:hs(e)?64:Te(e)?4:de(e)?2:0;return p(e,n,t,r,s,i,o,!0)}function ed(e){return e?ko(e)||ja(e)?rn({},e):e:null}function Bt(e,n,t=!1,r=!1){const{props:s,ref:o,patchFlag:i,children:a,transition:l}=e,c=n?nd(s||{},n):s,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:c,key:c&&tl(c),ref:n&&n.ref?t&&o?ie(o)?o.concat(jr(n)):[o,jr(n)]:jr(n):o,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:a,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:n&&e.type!==Ae?i===-1?16:i|16:i,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:l,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&Bt(e.ssContent),ssFallback:e.ssFallback&&Bt(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return l&&r&&Vr(u,l.clone(u)),u}function xn(e=" ",n=0){return me(Es,null,e,n)}function Lr(e,n){const t=me($r,null,e);return t.staticCount=n,t}function ye(e="",n=!1){return n?(B(),at(On,null,e)):me(On,null,e)}function qn(e){return e==null||typeof e=="boolean"?me(On):ie(e)?me(Ae,null,e.slice()):No(e)?st(e):me(Es,null,String(e))}function st(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:Bt(e)}function Zr(e,n){let t=0;const{shapeFlag:r}=e;if(n==null)n=null;else if(ie(n))t=16;else if(typeof n=="object")if(r&65){const s=n.default;s&&(s._c&&(s._d=!1),Zr(e,s()),s._c&&(s._d=!0));return}else{t=32;const s=n._;!s&&!ja(n)?n._ctx=_n:s===3&&_n&&(_n.slots._===1?n._=1:(n._=2,e.patchFlag|=1024))}else if(de(n)){if(r&65){Zr(e,{default:n});return}n={default:n,_ctx:_n},t=32}else n=String(n),r&64?(t=16,n=[xn(n)]):t=8;e.children=n,e.shapeFlag|=t}function nd(...e){const n={};for(let t=0;t<e.length;t++){const r=e[t];for(const s in r)if(s==="class")n.class!==r.class&&(n.class=Ie([n.class,r.class]));else if(s==="style")n.style=Wt([n.style,r.style]);else if(os(s)){const o=n[s],i=r[s];i&&o!==i&&!(ie(o)&&o.includes(i))?n[s]=o?[].concat(o,i):i:i==null&&o==null&&!is(s)&&(n[s]=i)}else s!==""&&(n[s]=r[s])}return n}function Pn(e,n,t,r=null){Nn(e,n,7,[t,r])}const td=qa();let rl=0;function rd(){return rl}function sd(e,n,t){const r=e.type,s=(n?n.appContext:e.appContext)||td,o={uid:rl++,vnode:e,type:r,parent:n,appContext:s,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Nc(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:n?n.provides:Object.create(s.provides),ids:n?n.ids:["",0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:za(r,s),emitsOptions:Ua(r,s),emit:null,emitted:null,propsDefaults:De,inheritAttrs:r.inheritAttrs,ctx:De,data:De,props:De,attrs:De,slots:De,refs:De,setupState:De,setupContext:null,suspense:t,suspenseId:t?t.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return o.ctx={_:o},o.root=n?n.root:o,o.emit=Pu.bind(null,o),e.ce&&e.ce(o),o}let dn=null;const od=()=>dn||_n;let es,cr;{const e=ls(),n=(t,r)=>{let s;return(s=e[t])||(s=e[t]=[]),s.push(r),o=>{s.length>1?s.forEach(i=>i(o)):s[0](o)}};es=n("__VUE_INSTANCE_SETTERS__",t=>dn=t),cr=n("__VUE_SSR_SETTERS__",t=>ur=t)}const br=e=>{const n=dn;return es(e),e.scope.on(),()=>{e.scope.off(),es(n)}},di=()=>{dn&&dn.scope.off(),es(null)};function sl(e){return e.vnode.shapeFlag&4}let ur=!1;function id(e,n=!1,t=!1){n&&cr(n);const{props:r,children:s}=e.vnode,o=sl(e);Hu(e,r,o,n),Qu(e,s,t||n);const i=o?ad(e,n):void 0;return n&&cr(!1),i}function ad(e,n){const t=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,wu);const{setup:r}=t;if(r){zn();const s=e.setupContext=r.length>1?cd(e):null,o=br(e),i=Sr(r,e,0,[e.props,s]),a=ta(i);if(Kn(),o(),(a||e.sp)&&!tr(e)&&Ma(e),a){if(i.then(di,di),n)return i.then(l=>{cr(!0);try{fi(e,l,n)}finally{cr(!1)}}).catch(l=>{ds(l,e,0)});e.asyncDep=i}else fi(e,i)}else ol(e)}function fi(e,n,t){de(n)?e.type.__ssrInlineRender?e.ssrRender=n:e.render=n:Te(n)&&(e.setupState=ka(n)),ol(e)}function ol(e,n,t){const r=e.type;e.render||(e.render=r.render||Gn);{const s=br(e);zn();try{Tu(e)}finally{Kn(),s()}}}const ld={get(e,n){return an(e,"get",""),e[n]}};function cd(e){const n=t=>{e.exposed=t||{}};return{attrs:new Proxy(e.attrs,ld),slots:e.slots,emit:e.emit,expose:n}}function ys(e){return e.exposed?e.exposeProxy||(e.exposeProxy=new Proxy(ka(Vc(e.exposed)),{get(n,t){if(t in n)return n[t];if(t in rr)return rr[t](e)},has(n,t){return t in n||t in rr}})):e.proxy}function ud(e){return de(e)&&"__vccOpts"in e}const _e=(e,n)=>nu(e,n,ur),dd="3.5.44";/**
* @vue/runtime-dom v3.5.44
* (c) 2018-present Yuxi (Evan) You and Vue contributors
* @license MIT
**/let uo;const hi=typeof window<"u"&&window.trustedTypes;if(hi)try{uo=hi.createPolicy("vue",{createHTML:e=>e})}catch{}const il=uo?e=>uo.createHTML(e):e=>e,fd="http://www.w3.org/2000/svg",hd="http://www.w3.org/1998/Math/MathML",rt=typeof document<"u"?document:null,gi=rt&&rt.createElement("template"),gd={insert:(e,n,t)=>{n.insertBefore(e,t||null)},remove:e=>{const n=e.parentNode;n&&n.removeChild(e)},createElement:(e,n,t,r)=>{const s=n==="svg"?rt.createElementNS(fd,e):n==="mathml"?rt.createElementNS(hd,e):t?rt.createElement(e,{is:t}):rt.createElement(e);return e==="select"&&r&&r.multiple!=null&&s.setAttribute("multiple",r.multiple),s},createText:e=>rt.createTextNode(e),createComment:e=>rt.createComment(e),setText:(e,n)=>{e.nodeValue=n},setElementText:(e,n)=>{e.textContent=n},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>rt.querySelector(e),setScopeId(e,n){e.setAttribute(n,"")},insertStaticContent(e,n,t,r,s,o){const i=t?t.previousSibling:n.lastChild;if(s&&(s===o||s.nextSibling))for(;n.insertBefore(s.cloneNode(!0),t),!(s===o||!(s=s.nextSibling)););else{gi.innerHTML=il(r==="svg"?`<svg>${e}</svg>`:r==="mathml"?`<math>${e}</math>`:e);const a=gi.content;if(r==="svg"||r==="mathml"){const l=a.firstChild;for(;l.firstChild;)a.appendChild(l.firstChild);a.removeChild(l)}n.insertBefore(a,t)}return[i?i.nextSibling:n.firstChild,t?t.previousSibling:n.lastChild]}},pd=Symbol("_vtc");function md(e,n,t){const r=e[pd];r&&(n=(n?[n,...r]:[...r]).join(" ")),n==null?e.removeAttribute("class"):t?e.setAttribute("class",n):e.className=n}const ns=Symbol("_vod"),al=Symbol("_vsh"),ll={name:"show",beforeMount(e,{value:n},{transition:t}){e[ns]=e.style.display==="none"?"":e.style.display,t&&n?t.beforeEnter(e):Kt(e,n)},mounted(e,{value:n},{transition:t}){t&&n&&t.enter(e)},updated(e,{value:n,oldValue:t},{transition:r}){!n!=!t&&(r?n?(r.beforeEnter(e),Kt(e,!0),r.enter(e)):r.leave(e,()=>{Kt(e,!1)}):Kt(e,n))},beforeUnmount(e,{value:n}){Kt(e,n)}};function Kt(e,n){e.style.display=n?e[ns]:"none",e[al]=!n}const Ed=Symbol(""),yd=/(?:^|;)\s*display\s*:/;function Sd(e,n,t){const r=e.style,s=$e(t);let o=!1;if(t&&!s){if(n)if($e(n))for(const i of n.split(";")){const a=i.slice(0,i.indexOf(":")).trim();t[a]==null&&Yt(r,a,"")}else for(const i in n)t[i]==null&&Yt(r,i,"");for(const i in t){i==="display"&&(o=!0);const a=t[i];a!=null?xd(e,i,!$e(n)&&n?n[i]:void 0,a)||Yt(r,i,a):Yt(r,i,"")}}else if(s){if(n!==t){const i=r[Ed];i&&(t+=";"+i),r.cssText=t,o=yd.test(t)}}else n&&e.removeAttribute("style");ns in e&&((!s||n!==t)&&(e[ns]=o?r.display:""),e[al]&&(r.display="none"))}const Ir=/\s*!important$/;function Yt(e,n,t){if(ie(t))t.forEach(r=>Yt(e,n,r));else if(t==null&&(t=""),n.startsWith("--"))Ir.test(t)?e.setProperty(n,t.replace(Ir,""),"important"):e.setProperty(n,t);else{const r=bd(e,n);Ir.test(t)?e.setProperty(Tt(r),t.replace(Ir,""),"important"):e[r]=t}}const pi=["Webkit","Moz","ms"],Bs={};function bd(e,n){const t=Bs[n];if(t)return t;let r=Dn(n);if(r!=="filter"&&r in e)return Bs[n]=r;r=oa(r);for(let s=0;s<pi.length;s++){const o=pi[s]+r;if(o in e)return Bs[n]=o}return n}function xd(e,n,t,r){return e.tagName==="TEXTAREA"&&(n==="width"||n==="height")&&$e(r)&&t===r}const mi="http://www.w3.org/1999/xlink";function Ei(e,n,t,r,s,o=Tc(n)){r&&n.startsWith("xlink:")?t==null?e.removeAttributeNS(mi,n.slice(6,n.length)):e.setAttributeNS(mi,n,t):t==null||o&&!aa(t)?e.removeAttribute(n):e.setAttribute(n,o?"":Qn(t)?String(t):t)}function yi(e,n,t,r,s){if(n==="innerHTML"||n==="textContent"){t!=null&&(e[n]=n==="innerHTML"?il(t):t);return}const o=e.tagName;if(n==="value"&&o!=="PROGRESS"&&!o.includes("-")){const a=o==="OPTION"?e.getAttribute("value")||"":e.value,l=t==null?e.type==="checkbox"?"on":"":String(t);(a!==l||!("_value"in e))&&(e.value=l),t==null&&e.removeAttribute(n),e._value=t;return}let i=!1;if(t===""||t==null){const a=typeof e[n];a==="boolean"?t=aa(t):t==null&&a==="string"?(t="",i=!0):a==="number"&&(t=0,i=!0)}try{e[n]=t}catch{}i&&e.removeAttribute(s||n)}function Mt(e,n,t,r){e.addEventListener(n,t,r)}function _d(e,n,t,r){e.removeEventListener(n,t,r)}const Si=Symbol("_vei");function Cd(e,n,t,r,s=null){const o=e[Si]||(e[Si]={}),i=o[n];if(r&&i)i.value=r;else{const[a,l]=Rd(n);if(r){const c=o[n]=Dd(r,s);Mt(e,a,c,l)}else i&&(_d(e,a,i,l),o[n]=void 0)}}const vd=/(Once|Passive|Capture)$/,kd=/^on:?(?:Once|Passive|Capture)$/;function Rd(e){let n,t;for(;(t=e.match(vd))&&!kd.test(e);)n||(n={}),e=e.slice(0,e.length-t[1].length),n[t[1].toLowerCase()]=!0;return[e[2]===":"?e.slice(3):Tt(e.slice(2)),n]}let qs=0;const wd=Promise.resolve(),Td=()=>qs||(wd.then(()=>qs=0),qs=Date.now());function Dd(e,n){const t=r=>{if(!r._vts)r._vts=Date.now();else if(r._vts<=t.attached)return;const s=t.value;if(ie(s)){const o=r.stopImmediatePropagation;r.stopImmediatePropagation=()=>{o.call(r),r._stopped=!0};const i=s.slice(),a=[r];for(let l=0;l<i.length&&!r._stopped;l++){const c=i[l];c&&Nn(c,n,5,a)}}else Nn(s,n,5,[r])};return t.value=e,t.attached=Td(),t}const bi=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,Ad=(e,n,t,r,s,o)=>{const i=s==="svg";n==="class"?md(e,r,i):n==="style"?Sd(e,t,r):os(n)?is(n)||Cd(e,n,t,r,o):(n[0]==="."?(n=n.slice(1),!0):n[0]==="^"?(n=n.slice(1),!1):Nd(e,n,r,i))?(yi(e,n,r),!e.tagName.includes("-")&&(n==="value"||n==="checked"||n==="selected")&&Ei(e,n,r,i,o,n!=="value")):e._isVueCE&&(Od(e,n)||e._def.__asyncLoader&&(/[A-Z]/.test(n)||!$e(r)))?yi(e,Dn(n),r,o,n):(n==="true-value"?e._trueValue=r:n==="false-value"&&(e._falseValue=r),Ei(e,n,r,i))};function Nd(e,n,t,r){if(r)return!!(n==="innerHTML"||n==="textContent"||n in e&&bi(n)&&de(t));if(n==="spellcheck"||n==="draggable"||n==="translate"||n==="autocorrect"||n==="sandbox"&&e.tagName==="IFRAME"||n==="form"||n==="list"&&e.tagName==="INPUT"||n==="type"&&e.tagName==="TEXTAREA")return!1;if(n==="width"||n==="height"){const s=e.tagName;if(s==="IMG"||s==="VIDEO"||s==="CANVAS"||s==="SOURCE")return!1}return bi(n)&&$e(t)?!1:n in e}function Od(e,n){const t=e._def.props;if(!t)return!1;const r=Dn(n);return Array.isArray(t)?t.some(s=>Dn(s)===r):Object.keys(t).some(s=>Dn(s)===r)}const xi=e=>{const n=e.props["onUpdate:modelValue"]||!1;return ie(n)?t=>Hr(n,t):n};function Ld(e){e.target.composing=!0}function _i(e){const n=e.target;n.composing&&(n.composing=!1,n.dispatchEvent(new Event("input")))}const Mr=Symbol("_assign"),Pr=Symbol("_initialValue");function Us(e,n,t){return n&&(e=e.trim()),t&&(e=yo(e)),e}const cl={created(e,{modifiers:{lazy:n,trim:t,number:r}},s){e.parentNode&&(e.type==="text"?e[Pr]=e.defaultValue.replace(/[\r\n]/g,""):e.type==="textarea"&&(e[Pr]=e.defaultValue.replace(/\r\n?/g,`
`))),e[Mr]=xi(s);const o=r||s.props&&s.props.type==="number";Mt(e,n?"change":"input",i=>{i.target.composing||e[Mr](Us(e.value,t,o))}),(t||o)&&Mt(e,"change",()=>{e.value=Us(e.value,t,o)}),n||(Mt(e,"compositionstart",Ld),Mt(e,"compositionend",_i),Mt(e,"change",_i))},mounted(e,{value:n,modifiers:{trim:t,number:r}}){const s=n??"",o=e[Pr];delete e[Pr],o!==void 0&&(e.type==="text"||e.type==="textarea")&&e.value!==o?e[Mr](Us(e.value,t,r)):e.value=s},beforeUpdate(e,{value:n,oldValue:t,modifiers:{lazy:r,trim:s,number:o}},i){if(e[Mr]=xi(i),e.composing)return;const a=(o||e.type==="number")&&!/^0\d/.test(e.value)?yo(e.value):e.value,l=n??"";if(a===l)return;const c=e.getRootNode();(c instanceof Document||c instanceof ShadowRoot)&&c.activeElement===e&&e.type!=="range"&&(r&&n===t||s&&e.value.trim()===l)||(e.value=l)}},Id=["ctrl","shift","alt","meta"],Md={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&e.button!==0,middle:e=>"button"in e&&e.button!==1,right:e=>"button"in e&&e.button!==2,exact:(e,n)=>Id.some(t=>e[`${t}Key`]&&!n.includes(t))},Pd=(e,n)=>{if(!e)return e;const t=e._withMods||(e._withMods={}),r=n.join(".");return t[r]||(t[r]=((s,...o)=>{for(let i=0;i<n.length;i++){const a=Md[n[i]];if(a&&a(s,n))return}return e(s,...o)}))},Fd=rn({patchProp:Ad},gd);let Ci;function Bd(){return Ci||(Ci=Ku(Fd))}const qd=((...e)=>{const n=Bd().createApp(...e),{mount:t}=n;return n.mount=r=>{const s=Wd(r);if(!s)return;const o=n._component;!de(o)&&!o.render&&!o.template&&(o.template=s.innerHTML),s.nodeType===1&&(s.textContent="");const i=t(s,!1,Ud(s));return s instanceof Element&&(s.removeAttribute("v-cloak"),s.setAttribute("data-v-app","")),i},n});function Ud(e){if(e instanceof SVGElement)return"svg";if(typeof MathMLElement=="function"&&e instanceof MathMLElement)return"mathml"}function Wd(e){return $e(e)?document.querySelector(e):e}const Hd=`一个**家庭账本 Web 服务**：Go 后端提供 REST API（注册、登录、账目 CRUD、分类、预算检查、月度统计、CSV 导出），Vue 前端对接，部署在家里的设备或云服务器上，具备可运维能力（配置管理、迁移、结构化日志、健康检查、优雅关闭、依赖安全扫描）。
`,Gd=`**前置说明**：你熟悉 Vue，HTTP、JSON、路由、异步不需要从零讲。本路线只聚焦**服务端视角**。
`,$d=`**Redis 的定位**：不作为阶段六的默认内容。家庭账本在 SQLite 下的读性能足够。只有当账本稳定运行、统计接口确实成为瓶颈时，才作为独立扩展引入 Cache-Aside。
`,jd="| 阶段 | 周数 | 核心内容 | 验收标准 |\n| :--- | :--- | :--- | :--- |\n| **一** | 2–3 周 | Go 语法、错误处理、接口、SQLite | 命令行账本，关掉终端数据还在 |\n| **二** | 1–2 周 | goroutine、channel、竞态、`context`、分包 | `-race` 报告出现又消失 |\n| **三** | 3 周 | `net/http`、路由、中间件、REST、统一响应、分页 | curl 增查，重启不丢，分页可用 |\n| **四** | 2 周 | 密码哈希（Argon2id / bcrypt cost 12）、JWT、认证中间件、数据隔离 | A 看不到 B 的账，响应无密码字段 |\n| **五** | 4–5 周 | 分层、GORM（**`Session` 隔离 + 请求级 `Context` 字段**）、迁移、连接池、统计、预算、CSV 导出、测试、集中错误处理、结构化日志 | `go test` 全绿，迁移可执行，日志带 request ID |\n| **六** | 2–3 周 | 配置管理、Docker、优雅关闭（**Server 超时 + Shutdown 顺序**）、健康检查、CORS、**govulncheck**、**Cookie 安全 + CSRF** | 手机浏览器完成完整操作，服务可优雅停止，无已知依赖漏洞 |\n\n**Redis 的定位**：不作为阶段六的默认内容。家庭账本在 SQLite 下的读性能足够。只有当账本稳定运行、统计接口确实成为瓶颈时，才作为独立扩展引入 Cache-Aside。\n",Qd=`**每日任务是最小执行单位**：每个阶段都拆到「天」，一天 3–4 小时。每天走完「预测 → 讲解 → 回忆 → 排错 → 迁移 → 判据 → 动手」六步闭环，**判据与任务都勾满才算完成**。下面是拆分口径与使用方式。

### 拆分口径

| 阶段 | 周数 | 折算天数 | 天数来源 |
| :--- | :--- | :--- | :--- |
| 一 · Go 语法与数据库入门 | 2–3 周 | **15 天** | 语法 8 天 + SQLite 5 天 + 项目收尾 2 天 |
| 二 · 并发、接口与分包 | 1–2 周 | **9 天** | 并发 6 天 + 分包重构 3 天 |
| 三 · HTTP 服务端与 REST API | 3 周 | **18 天** | 基础 5 天 + CRUD 7 天 + 中间件与错误 4 天 + 回归 2 天 |
| 四 · 用户认证与数据隔离 | 2 周 | **12 天** | 哈希 3 天 + 注册登录 3 天 + JWT 3 天 + 隔离 3 天 |
| 五 · 分层、GORM、迁移、统计与测试 | 4–5 周 | **26 天** | 分层 3 天 + GORM 6 天 + 迁移 2 天 + 统计 2 天 + 错误日志 2 天 + 测试 4 天 + stretch 3 天 + 回归 4 天 |
| 六 · 配置、部署与收尾 | 2–3 周 | **14 天** | 配置 2 天 + Docker 4 天 + 健康检查与关闭 3 天 + 跨域 1 天 + 安全 3 天 + 验收 1 天 |

**合计 94 天**（按每周 6 天折算，约 16 周）。周数区间取上限，是因为每天都按 3–4 小时满负荷计算；如果你每天只有 2 小时，把天数乘以 1.5 即可。

### 讲解的深度分档

94 天不是同一密度。每天讲解按概念难度分三档，日卡上有对应标记：

| 档 | 标记 | 讲解体量 | 当天怎么用 |
| :--- | :--- | :--- | :--- |
| 硬骨头 | 🟠 硬骨头 | 800–1100 字 + 3 道自测 | **分两遍**：先读到能说出判据，动手时回看 |
| 常规 | 无 | 600–800 字 + 代码 + 2–3 道自测 | 一次读完，直接做任务 |
| 速通 | ⚪ 速通 | 200–400 字 | 工具/验收/复盘日，读完立刻执行 |

共 **45 个硬骨头日、36 个常规日、13 个速通日**。硬骨头集中在：切片扩容、错误包装、接口方法集、竞态与锁、context 传播、GORM Session、JWT 校验、CSRF 中间件顺序、优雅关闭。

### 一天怎么算「学会」：六步闭环

每一张日卡都是同一条学习路径，顺序不能跳：

| 步骤 | 内容 | 为什么必须有 | 做不到会怎样 |
| :--- | :--- | :--- | :--- |
| ① 学前自检 | 前置知识 + **读前预测**（给代码，先猜结果） | 先暴露「我以为我会」，制造认知冲突，读的时候才有落点 | 读完觉得「懂了」，一动手全错 |
| ② 机制讲解 | 为什么需要 → 拆开看机制 → 错/对代码对照 | 提供最小充分知识，只讲这一天新出现的概念 | 背结论，换场景就崩 |
| ③ 主动回忆 | 2–3 道自测，答案折叠 | 提取练习比重读有效数倍 | 「看着眼熟」但说不出来 |
| ④ 排错诊断 | 坏代码 / 坏现象，先定位再改 | 会写 ≠ 会修，排错能力只能靠诊断练 | 遇到报错只能猜或问人 |
| ⑤ 迁移挑战 | 换一个没讲过的场景再解一次 | 检验是不是「真会」，而不是「记住了这段」 | 例题会做，需求一变就不会 |
| ⑥ 掌握判据 | 4–6 条可自我验证的事实，逐条勾选 | 把「学会」变成可判定，而不是感觉 | 永远不确定自己到底会不会 |
| ＋ 动手任务 | 当天要交付的东西 | 知识必须落到一个可运行的结果上 | 只是「看过」，没有产出 |

**判据和任务都勾满，这天才算完成**。页面顶栏和侧边栏显示的进度都按这个口径算——只读讲解、只勾任务，都不会让天数推进。

### 为什么读一遍不算学会

- **读只是编码**：信息进了短期记忆，合上页面就开始衰减。真正留住它的是「提取」（自测）和「使用」（任务）。
- **看懂不等于能写**：看懂是被动识别，写代码是主动生成，两者调用的能力不同。
- **能写不等于能改**：真实工作里 70% 的时间在排错和改别人的代码，所以每天都有一道排错题。
- **能改不等于能迁移**：迁移题故意换场景，就是防止你「只记住例题」。

如果某天的判据你勾不上，不要往下走——那不是进度问题，是地基问题。回退到对应的讲解段落，或者回到前面某一天补。

### 关于「几分钟读完」

时长按**技术中文 280 字/分钟 + 代码 22 行/分钟 + 每道自测 0.8 分钟**估算，是真实阅读时间，不是营销数字。

但它只表示「读完要多久」。这六步全部走完，实际投入通常接近当天标注的 3–4 小时：讲解只占其中 10–20 分钟。

### 使用方式

1. **只按「今天从这里开始」走**：顶部面板会自动定位到第一个未完成的天，不用翻目录。
2. **先答预测题，再看讲解**：猜错的地方才是你今天真正要学的。直接读讲解会跳过这个环节的价值。
3. **自测必须合上答案答**：答不出就回去重读那一段，不要点开答案「确认一下」——那是把练习变成阅读。
4. **排错题先说病灶，再说改法**：只说出「应该改成 X」不算过，要能指出「原代码哪一行、为什么错」。
5. **迁移题卡住时先看提示**：提示只给第一步方向，不给答案。看完提示还写不出，说明前面几步是虚的。
6. **判据要动手验证再勾**：比如「能复现 DATA RACE」就真的去跑一次 \`go test -race\`，不要凭印象勾。
7. **交付物是硬标准**：每天写了「交付」，指的是手上多出什么东西（一个文件、一次运行结果、一份对比数据）。
8. **允许跳天，不允许跳判据**：某天提前做完可以并到下一天，但不能因为「看懂了」就跳过验证。
9. **教过的内容不再重复讲**：讲解只讲当天新概念。忘了前面的，回那天补，阶段末尾的「知识点速查」用于回看。
10. **卡住超过 30 分钟就看「卡点」**：每天的卡点都是这一步最容易浪费两小时的地方。

### 落后了怎么办

- **落后 1–3 天**：不用补，直接从下一个未完成的天继续，把顺序保住比把进度补齐重要。
- **落后一周以上**：优先砍 stretch goal（阶段五 D21–D23 标了「可选」），再砍重复练习，**不要砍测试与 context / 迁移相关的天**——这些是后面所有阶段的底座。
- **某一阶段反复卡住**：回到「知识点」正文对照，把卡住的那一天拆成两个半天，而不是硬推下一天。
`,zd='**解决什么问题**：你有编程基础，不需要从零学变量和循环。Go 的关键差异是**错误通过返回值传递**、**接口隐式实现**、**切片有底层数组**、**用 `go mod` 管理依赖**。同时引入 SQLite，因为后端的核心特征是数据不活在内存里。\n\n### 知识点\n\n**第 1 周：Go 语法骨架**\n\n| 知识点 | 学到什么程度 |\n| :--- | :--- |\n| `var` / `:=`、基本类型、**显式类型转换** | 熟练；Go 无隐式转换 |\n| 切片：`len`、`cap`、`append`、底层数组共享 | 理解 `s[1:3]` 与扩容行为 |\n| map：`make`、`v, ok := m[k]` | 熟练 |\n| 结构体 + 方法：**值接收者 vs 指针接收者** | 修改结构体用指针接收者 |\n| **错误处理**：`if err != nil`、`fmt.Errorf("%w")` | 每个可能失败的操作都检查 |\n| **接口**：隐式实现、**由调用方定义** | 理解接口解耦的意义 |\n| `defer` | 用于关闭资源 |\n| `go mod init/tidy`、`go run/build/fmt/vet` | 熟练 |\n\n**第 2 周：SQLite 与 `database/sql`**\n\n| 知识点 | 学到什么程度 |\n| :--- | :--- |\n| SQL 基础：`CREATE TABLE` / `INSERT` / `SELECT` / `WHERE` / `ORDER BY` | 能写单表增查 |\n| `database/sql`：`Open` / `Exec` / `Query` / `QueryRow` / `rows.Scan` | 能建表、插入、查询 |\n| `modernc.org/sqlite` 纯 Go 驱动 | 无 CGO，跨平台无坑 |\n| 持久化生命周期：连接 → 执行 → 关闭 | 程序退出后数据仍在 |\n\n**学习方式**：Tour of Go 快速过语法（2–3 天），遇到切片、接口、错误处理时在本地写例子。SQLite 看 `database/sql` 官方示例，改成账目表。\n\n### 练手项目：命令行账本 `ledger-cli`\n\n- `add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭`\n- `list`：按日期倒序\n- `sum -month 2026-10`\n- 数据存 `ledger.db`\n',Kd="**解决什么问题**：理解 goroutine、channel、竞态和 `context`，后续所有服务端代码都会涉及请求取消和并发安全。同时把阶段一的单文件代码拆成多包。\n\n### 知识点\n\n| 知识点 | 核心内容 |\n| :--- | :--- |\n| `goroutine` | `go f()` |\n| `channel` | 发送/接收阻塞语义 |\n| `select` | 多路等待，`default` 非阻塞 |\n| `sync.WaitGroup` | `Add` / `Done` / `Wait` |\n| **竞态条件** | `go run -race` 检测，`sync.Mutex` 保护 |\n| `context` | `WithTimeout` / `WithCancel`，在 goroutine 树中传播取消信号 |\n| 包组织 | 一个目录一个包；首字母大写导出；`internal/` 限制外部导入 |\n\n**学习方式**：两个 goroutine 同时 `count++` 一万次 → `-race` 看到 `DATA RACE` → 加 `Mutex` 后报告消失。然后重构阶段一：数据库操作抽到 `internal/store`，`main` 只依赖 `Store` 接口。\n\n### 练手项目：重构 + 并发导出\n\n- 3 个包：`main`、`internal/store`（接口 + SQLite）、`internal/ledger`\n- `export` 命令：并发按月份写多个 CSV\n- `go test -race ./...` 通过\n",Jd='**解决什么问题**：写**接收请求的那一端**。核心链路：请求 → 路由 → 中间件 → handler 解析 → 业务 → 读写数据库 → 返回统一 JSON。\n\n### 知识点\n\n**1. 服务端视角的 HTTP**\n- `http.ListenAndServe(":8080", mux)`\n- 路由：`mux.HandleFunc("POST /ledger", handler)`（Go 1.22+）\n- Handler：`func(w http.ResponseWriter, r *http.Request)`\n- 读体：`json.NewDecoder(r.Body).Decode(&v)`\n- 写响应：`Content-Type` → `WriteHeader` → `Encode`\n- 路径参数：`r.PathValue("id")`；查询参数：`r.URL.Query().Get("month")`\n\n**2. 统一响应信封**\n- 泛型 `Response[T]`：`{code, message, data}`，成功和失败共用同一顶层结构\n- Handler 只调用 `OK(w, data)` 或 `Fail(w, status, code, message)`\n- HTTP 状态码表达传输层结果，`code` 表达业务结果\n\n**3. 分页：`limit/offset` 起步，知道深分页的代价**\n- `GET /ledger?limit=20&offset=0`，返回 `{items, total, limit, offset}`\n- `OFFSET` 的本质是**先扫描再跳过**，成本随页深**线性增长**（O(n)）。\n- **游标分页**（keyset pagination，`WHERE id > ? LIMIT 20`）利用主键索引做范围扫描，复杂度为 **O(1)**，性能不随页深衰减。\n- **本项目的实用策略**：前几页用 `OFFSET`（支持跳页），当 `offset` 超过约 **1000–2000** 时切换到游标分页；接口设计上让客户端可以接受一个 `cursor` 参数，为未来留出空间。家庭账本短期内不会触达这个量级，但**知道“为什么 OFFSET 会慢”** 比记住“以后要换游标”更有价值。\n\n**4. 中间件**\n- `func(http.Handler) http.Handler`\n- 日志中间件：方法、路径、状态码、耗时\n\n**学习方式（严格按顺序）**：\n1. `GET /hello` 返回统一信封，curl 看到 JSON\n2. `POST /ledger` 写入内存切片，`GET /ledger` 分页返回\n3. 内存换 SQLite：`POST` 写库，`GET` 读库\n4. 加 `GET /ledger/{id}` 和 `GET /summary?month=`\n\n**常见卡点**：端口被占用；404（方法或路径不匹配）；JSON 解析失败（检查 `Content-Type` 和双引号）；重启数据丢失（还在用内存）。\n\n### 练手项目：账本 HTTP API\n\n- `POST /ledger`：写 SQLite，返回 201 + 统一信封\n- `GET /ledger?limit=&offset=`：分页\n- `GET /ledger/{id}`：404 处理\n- `GET /summary?month=`\n- 日志中间件\n',Vd='**解决什么问题**：写登录接口本身——验证密码、签发 token、服务端验证 token、数据隔离、敏感字段不出响应。\n\n### 知识点\n\n| 知识点 | 核心内容 |\n| :--- | :--- |\n| **密码哈希** | **首选 Argon2id**：推荐参数 **m=64 MiB，t=3，p=4**（OWASP 2025）；目标单次哈希耗时 150–250ms。内存受限时退回 OWASP 最小值 m=19 MiB, t=2, p=1（降级配置）。**bcrypt 备选**：**显式设 cost=12**（不要依赖 `DefaultCost`）。无论哪种，**绝不存明文**，每个密码使用唯一盐值。 |\n| **JWT 签发** | `jwt.NewWithClaims`，payload 含 `user_id` 和过期时间，密钥签名 |\n| **JWT 验证** | `jwt.ParseWithClaims`，验证签名和过期时间 |\n| **认证中间件** | 从 `Authorization: Bearer <token>` 取 token → 验证 → `user_id` 放入 `context` |\n| **context 取值** | `r.Context().Value(userIDKey)` |\n| **数据隔离** | 账目表加 `user_id`；**每个查询必须带 `WHERE user_id = ?`** |\n| **敏感字段隔离** | `PasswordHash` 加 `json:"-"`，或使用独立响应 DTO；**任何响应不得包含密码哈希** |\n\n**学习方式**：先写 `POST /register` 和 `POST /login`，curl 测试。再写认证中间件套在 `/ledger` 路由上，不带 token 返回 401。最后改账本 handler，从 context 取 `user_id`。\n\n**常见卡点**：token 解析失败（检查 `Bearer ` 后的空格、密钥一致）；登录成功但 401（中间件没套上或 token 过期）；A 能看到 B 的账（**查询漏了 `user_id` 条件，最重要的安全检查点**）。\n\n### 练手项目：带认证的账本 API\n\n- `POST /register`、`POST /login`\n- `/ledger` 全部需认证\n- 账目表加 `user_id`\n- 响应中无 `password_hash`\n',Yd='**解决什么问题**：Handler 里同时有 HTTP 解析、业务判断和 SQL 不可维护。分层让每层只做一件事；GORM 用结构体操作数据库，但 **context 和连接生命周期的管理方式直接决定服务会不会在流量下耗尽连接**；迁移保证表结构变更有据可查；预算和导出让账本真正可用。\n\n> **🔧 密度校准**：本阶段清单较重。**必须完成**的核心是：分层重构、GORM 正确模式、迁移、统计、集中错误处理、结构化日志、基础测试。**预算检查**和**CSV 流式导出**标记为 **stretch goal**——可以先用简化版本（预算返回标志但不做复杂校验；CSV 先全量加载再输出）跑通流程，流式导出和完整的预算规则作为后续迭代。不要把 GORM context 模式和测试深度牺牲在赶进度上。\n\n### 知识点\n\n**1. 分层架构**\n- **Handler 层**：解析请求、调 Service、写统一响应\n- **Service 层**：业务规则（金额 > 0、分类存在、账目属于当前用户、**预算是否超限**）\n- **Repository 层**：数据库操作，对上提供接口\n- 依赖方向：Handler → Service → Repository，每层依赖接口\n- 手动依赖注入：`main` 组装 `repo → svc → handler`\n\n**2. GORM：`Session` 一次性完成隔离与 context 绑定（🔧 核心修复）**\n\n这是本阶段最容易出错的点。需要精确理解两个机制的区别：\n\n- **`WithContext(ctx)`** 本质上是 `Session(&Session{Context: ctx})` 的语法糖，但它**只替换 session 内部的 `context.Context` 字段，不重建底层连接或 statement 缓存**。在 HTTP handler 中依赖 `WithContext` 的隐式行为，容易导致上下文污染或在 session 复用时连接归还时机不确定。\n- **`Session(&gorm.Session{NewDB: true})`** 克隆 `*gorm.DB` 实例，**彻底隔离 Statement 状态**（不继承链式条件），但它不自动绑定 context。\n- **`Session` 结构体本身包含 `Context` 字段**，可以直接设置，将请求作用域的 `ctx` 与 session 隔离**一次性完成**。\n\n**正确的 Repository 层模式**：\n```go\nfunc (r *repo) GetEntry(ctx context.Context, id uint) (*Entry, error) {\n    var e Entry\n    tx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})\n    if err := tx.First(&e, id).Error; err != nil {\n        return nil, err\n    }\n    return &e, nil\n}\n```\n- `NewDB: true` 清空链式条件，保证每次查询从干净状态开始。\n- `Context: ctx` 将**请求作用域的、会在请求结束时被取消的 `ctx`** 直接绑定到 session，避免 `WithContext` 的隐式替换带来的不确定性。GORM 官方文档确认 `Session.Context` 字段的取消和截止时间会传播到驱动层。\n- **禁止**在长生命周期中间件或 goroutine 中**保留并传递** `c.Request.Context()` 给 GORM。\n\n**其他 GORM 要点**：\n- **GORM 升级到 v2.3.19+**（含相关修复）。\n- **显式配置底层 `sql.DB` 连接池**：`SetMaxOpenConns`、`SetMaxIdleConns`、`SetConnMaxLifetime`。即使 SQLite 单连接，显式配置也让行为可预期。\n- **SQLite 连接池**：`SetMaxOpenConns(1)` 是安全起点。**如果启用 `PRAGMA journal_mode=WAL`**，可拆分为**写池（1 连接）** 和**读池（多个连接）**：WAL 支持多读单写，写池 1 连接避免 `SQLITE_BUSY`，读池多连接提升读并发。\n- **事务中的 context**：`Transaction()` 回调不自动接收外部 `ctx`，事务内每一步都需要显式设置 `Context` 或使用 `tx.WithContext(ctx)`。\n- **零值陷阱**：`Updates` 默认忽略零值字段，更新时用 `Select` 或 `map` 显式指定。\n- `gorm.ErrRecordNotFound` 当作正常业务分支处理。\n\n**3. 数据库迁移：`goose` 更适合本项目的嵌入式场景**\n- `AutoMigrate` **仅用于本地开发和测试**。\n- 生产使用版本化迁移。`goose.SetBaseFS(embed.FS)` 与 `//go:embed` 集成只需一行，适合 SQLite + 单二进制部署。\n- 迁移文件成对：`00001_create_entries.up.sql` / `.down.sql`，使用 `-- +goose Up` / `-- +goose Down` 标记。\n- 迁移在部署流程中独立执行，不在每次应用启动时自动跑。\n\n**4. 统计与预算**\n- 按月份+分类：`Select("category, SUM(amount) as total").Where("user_id = ? AND date LIKE ?", uid, "2026-10%").Group("category").Scan(&results)`\n- **预算表**（stretch goal）：`budgets(id, user_id, category, month, amount)`。添加账目时检查超限，响应中返回 `budget_exceeded`。\n- **CSV 导出**（stretch goal）：`GET /ledger/export?month=`，优先实现全量加载版本；**流式读取写入 `text/csv`** 作为优化迭代。\n\n**5. 集中式错误处理与结构化日志**\n- Handler 返回 `error`，统一中间件转换为 HTTP 响应和统一信封。\n- `log/slog` 或 `zap`；每条请求日志包含：方法、路径、状态码、耗时、**request ID**。request ID 在中间件生成并放入 `context`，错误响应中返回。\n\n**6. 测试**\n- 表驱动测试：`cases := []struct{...}` + `t.Run`\n- Handler 测试：`httptest.NewRequest` + `httptest.NewRecorder`\n- Repository 测试：SQLite 内存模式 `file::memory:?cache=shared`\n- **连接归还验证**：用 `sqlmock` 的 `ExpectClose()` 断言查询结束后连接被归还（前提是 Repository 的 session 正确绑定了请求 ctx 并能随请求结束释放）。\n\n**学习方式**：重构阶段四 → 引入 GORM（**从第一行 GORM 代码就用 `Session(&gorm.Session{NewDB: true, Context: ctx})`**，`ctx` 必须是请求作用域）→ 写迁移文件替换 `AutoMigrate` → 加分类、统计 → 集中错误处理 + `slog` → 补测试。预算和 CSV 导出按 stretch goal 处理。\n\n### 练手项目：完整账本后端\n\n- 认证 + 账目 CRUD + 分类 + 月度统计（核心）\n- 预算检查 + CSV 导出（stretch goal，可先用简化版本）\n- `migrations/` 含至少两个迁移文件（`goose` 格式）\n- 所有 API 返回统一信封；错误响应含 `request_id`\n- Repository 使用 `Session(&gorm.Session{NewDB: true, Context: ctx})`\n',Xd='**解决什么问题**：API 写完，要让它跑在家里的设备上，配置不硬编码，服务能优雅停止，依赖无已知漏洞，前端能安全访问。\n\n### 知识点\n\n**1. 配置管理**\n- Viper 或 koanf：YAML 配置文件 + 环境变量覆盖 + 默认值；配置绑定到结构体，在 `main` 一次性注入。\n- JWT 密钥、数据库密码走环境变量或 secrets，**不写入代码和配置文件**。\n\n**2. 多阶段 Dockerfile 与 docker compose**\n- `golang` 镜像编译 → 小镜像运行二进制；`.dockerignore`。\n- compose：端口映射、卷挂载（SQLite 文件持久化）；迁移作为独立步骤或嵌入启动流程。\n\n**3. 健康检查**\n- `GET /healthz` 返回 200。\n\n**4. 优雅关闭：`http.Server` 超时是前提**\n```go\nsrv := &http.Server{\n    Addr:              ":8080",\n    Handler:           mux,\n    ReadHeaderTimeout: 5 * time.Second,\n    ReadTimeout:       30 * time.Second,\n    WriteTimeout:      30 * time.Second,\n    IdleTimeout:       120 * time.Second,\n}\n```\n**关闭顺序**：\n1. `signal.NotifyContext` 监听 `SIGTERM` / `SIGINT`。\n2. **先 `srv.Shutdown(ctx)`** ：停止接受新请求，等待进行中请求完成（`ctx` 控制超时）。\n3. **再 `db.Close()`** 。`Shutdown` 完成后直接关闭即可。\n\n**5. CORS**\n- Vue 开发服务器与后端不同源时，后端设置 `Access-Control-Allow-Origin`，或 Vite 代理，部署时反向代理同源转发。\n\n**6. 依赖漏洞扫描**\n- `go install golang.org/x/vuln/cmd/govulncheck@latest`，运行 `govulncheck ./...`，作为 `docker build` 前的固定步骤。\n\n**7. Cookie 安全属性与 CSRF（纵深防御，不是二选一）**\n\n如果选择 `HttpOnly` Cookie 传递 JWT，**必须同时设置三道属性**：\n- `HttpOnly: true`：JavaScript 无法读取。\n- `Secure: true`（生产环境）：仅通过 HTTPS 传输。\n- `SameSite: Lax` 或 `Strict`：限制跨站请求携带 Cookie。\n\n**但 `SameSite` 不能替代 CSRF 中间件**。IETF 明确指出：Lax 模式对依赖不安全 HTTP 方法（如 POST）的 CSRF 提供了合理的纵深防御，但作为通用类别的 CSRF 防御并不充分。**SameSite 是第一道防线，CSRF 中间件是第二道防线**。\n\n**🔧 中间件顺序（修复）** ：\n\n`gorilla/csrf` 的 `csrf.Protect()` **必须是第一个业务中间件，包裹整个路由器**，而不是挂在路由之后。如果 CSRF 中间件放在路由匹配之后，健康检查、静态文件等未匹配路径会绕过校验。\n\n推荐顺序：**Recovery → CSRF → RateLimit → Auth**\n\n- **Recovery** 在最外层，捕获包括 CSRF 中间件在内的 panic。\n- **CSRF** 紧随其后，尽早拦截未通过 CSRF 校验的请求，避免无效请求消耗限流配额。\n- **RateLimit** 对通过 CSRF 的请求施加流量控制。\n- **Auth** 最后，只对合法请求做身份验证。\n\n如果选择 `Authorization: Bearer` 头 + `localStorage`，不需要 CSRF，但需权衡 XSS 风险。**家庭内网场景下，Cookie + CSRF 是更安全的选择。**\n\n**8. Redis（可选，不纳入主线）**\n- 只有当统计接口确实成为瓶颈时，再引入 `go-redis/v9` 和 Cache-Aside。缓存故障必须降级查库。\n\n### 练手项目：可部署的家庭账本\n\n- 后端 Docker 化，`docker compose up -d` 运行。\n- 配置通过文件+环境变量管理，敏感信息不硬编码。\n- 服务收到 `SIGTERM` 时按 **Shutdown → db.Close()** 的顺序优雅停止，`http.Server` 有显式超时。\n- `govulncheck ./...` 无已知漏洞。\n- 如果使用 Cookie 方案：`HttpOnly + Secure + SameSite` 全开，POST/PUT/DELETE 受 CSRF 保护，`csrf.Protect()` 包裹整个路由器。\n- Vue 前端能完成登录、添加账目、查看列表、统计、预算标志。\n',Zd=`| 阶段 | 周数 | 累计 | 里程碑 |
| :--- | :--- | :--- | :--- |
| 一 | 2–3 周 | 第 3 周 | 命令行账本，数据持久化 |
| 二 | 1–2 周 | 第 5 周 | 分包重构，\`-race\` 通过 |
| 三 | 3 周 | 第 8 周 | HTTP API，统一响应+分页，Vue 可对接 |
| 四 | 2 周 | 第 10 周 | 认证与数据隔离，Argon2id（或 bcrypt cost 12），无敏感字段泄露 |
| 五 | 4–5 周 | 第 15 周 | 分层 + GORM 正确模式 + 迁移 + 统计 + 测试（预算/流式导出可后置） |
| 六 | 2–3 周 | **第 17–18 周** | 配置 + Docker + 优雅关闭 + govulncheck + Cookie 安全 + CSRF |
`,ef="1. **每个阶段都在改上一个阶段的代码**，不推倒重来。\n2. **数据库从第一天就在**，不是单独学“数据库课”。\n3. **GORM 从第一行代码就用 `Session(&gorm.Session{NewDB: true, Context: ctx})`**，`ctx` 必须是请求作用域、会在请求结束时被取消；禁止在长生命周期组件中保留 `c.Request.Context()`。\n4. **生产环境不用 `AutoMigrate`**，`goose` 迁移文件是表结构变更的唯一入口。\n5. **优雅关闭的前提是 Server 有超时**；先 `Shutdown`，再 `db.Close()`。\n6. **安全底线**：每个涉及用户数据的查询带 `user_id`；响应无密码哈希；Cookie 方案同时设置 `HttpOnly + Secure + SameSite`，`csrf.Protect()` **包裹整个路由器**（Recovery → CSRF → RateLimit → Auth）；部署前跑 `govulncheck`。\n7. **密码哈希**：首选 Argon2id **m=64 MiB, t=3, p=4**；备选 bcrypt **显式 cost=12**。\n8. **分页**：前几页用 `limit/offset`；`OFFSET` 超过约 **1000–2000** 后考虑游标分页（`WHERE id > ?`），因为 OFFSET 深分页是 O(n)，游标是 O(1)。\n9. **Redis 不着急**：SQLite 够用就不引入，等统计真的慢了再说。\n10. **阶段五不必一次做到“完整版”**：预算和流式 CSV 导出是 stretch goal，核心的 GORM context 模式和测试深度优先。\n",nf=[{day:1,title:"工具链与模块：让 Go 先跑起来",hours:3,tasks:["安装 Go（推荐最新稳定版 1.22+），终端运行 `go version` 确认版本号","把 Go bin 目录加进 PATH（按操作系统选一种）：**macOS (zsh)** `echo 'export PATH=$PATH:$(go env GOPATH)/bin' >> ~/.zshrc && source ~/.zshrc`；**Linux (bash)** 同上改 `~/.bashrc`；**Windows** 系统设置→环境变量→Path→新建→输入 `%USERPROFILE%\\go\\bin`","`mkdir ledger && cd ledger && go mod init ledger`，打开 `go.mod` 看两行：`module ledger`（模块名称，其他包引用时用这个路径）和 `go 1.22`（最低版本要求，影响可用特性）",'写 `main.go`：`package main` + `func main()` + `fmt.Println("ledger")`，`go run .` 跑通；如果报错 "cannot find main package"，检查是否有 `package main` 声明且文件在当前目录',"`go build -o ledger .` 产出二进制，`./ledger` 直接运行（不经过 go run）","`gofmt -l .` 应无输出（有输出就运行 `gofmt -w .` 自动格式化）；`go vet ./...` 应无告警","可选：运行 `go env` 查看关键变量（GOROOT、GOPATH、GOBIN），确认安装正确"],deliver:"一个可 `./ledger` 直接执行的二进制；`go.mod` 已存在，`gofmt`/`vet` 干净",pitfall:"有 `go.mod` 就是 module 模式，不要再去设 `GOPATH` 或把代码放进 `src/`。"},{day:2,title:"变量、基本类型与显式转换",hours:3.5,tasks:['把 `var x int`、`y := 10`、`var (a, b = 1, "s")` 三种声明各写一遍，理解零值','列出 `int` / `int64` / `float64` / `string` / `bool` / `byte` / `rune` 的用途与零值；**实验：遍历中文字符串 `"你好Go"`，对比 `len(s)`（字节数8）与 `utf8.RuneCountInString(s)`（字符数4）**','写类型转换的实际场景：**计算单价 `price := float64(total) / float64(count)`（整数除法会截断小数）；解析 API 返回的字符串数字 `age, err := strconv.Atoi("25")`**',"用 `strconv.Atoi` / `strconv.Itoa` / `strconv.ParseFloat` 完成字符串与数字互转，处理返回的 err（解析失败时返回格式化错误 `fmt.Errorf(\"金额'%s'格式错误: %w\", input, err)`）","用 `const` + `iota` 定义一组账目类型常量（Food=0, Transport=1, Entertainment=2），并在 switch 语句中使用它们返回中文名称"],deliver:"一个 `types.go`，里面有你写过的全部类型转换示例（含单价计算、API 解析、iota 分类），`go run` 能打印出每一步结果",pitfall:"Go 没有隐式转换，`int` 和 `int64` 相加会直接编译失败，必须显式写 `int64(n)`。"},{day:3,title:"切片：底层数组、len/cap 与扩容",hours:3.5,tasks:["写 `arr := [5]int{1,2,3,4,5}` 与 `s := arr[1:3]`，打印 `len(s)`、`cap(s)`；**理解内存布局：`s` 指向 `arr[1]` 开始的位置，能看到 `arr[1..4]` 共4个元素**","修改 `s[0]` 后回看 `arr`，验证切片与原数组共享底层数组（改 `s[0]=99` 后 `arr` 变成 `[1,99,3,4,5]`）","`append` 到超出 cap，打印新旧切片的指针（`%p`）与 cap，理解扩容会换底层数组","用三索引切片 `s[1:3:4]` 限制 cap（第三个索引 `max` 使新切片 cap=`max-low`=3），验证 append 后不再影响原数组；**超出 cap 才会触发扩容换数组**","写一个 `appendTo(s []int) []int` 函数，验证函数内 append 不会改动调用方的 len（必须接收返回值，因为可能返回新切片）","用 `copy(dst, src)` 创建独立副本：`dst := make([]int, len(src)); copy(dst, src)`，修改 `dst[0]` 不影响 `src`"],deliver:"一个能打印「同一底层数组 / 扩容后换数组」两种情况的 demo，并能口述原因；一份独立的 copy 副本实验",pitfall:"把切片当值传递时，改元素会互相影响，但 append 不会——这是后面 handler 里数据串味的常见源头。"},{day:4,title:"map 与字符串处理",hours:3,tasks:["用 `make(map[string]float64)` 和字面量两种方式建 map，完成增删查","用 `v, ok := m[k]` 区分「键不存在」与「值为零」，对比直接取值的差别","`delete(m, k)` 删除；用 `for k, v := range m` 遍历并观察顺序不固定（Go 故意随机化防止依赖实现细节）",'写英文词频统计：用 `strings.Fields("go is great go is fun")` 切分单词后计数，按次数排序输出 Top 5；**注意 `strings.Fields` 按空白切分，对中文无效**',"用 `strings.Builder` 拼接 1000 次字符串，与 `+=` 对比耗时（Builder 内部用 []byte 缓冲区避免反复复制）"],deliver:"一个 `wordcount` 小函数，输入英文文本输出 Top 5 高频词",pitfall:"map 遍历无序是语言保证，不要写依赖顺序的逻辑；并发写 map 会直接 panic（阶段二再处理）。"},{day:5,title:"结构体、方法与值/指针接收者",hours:3.5,tasks:["定义 `type Entry struct { ID int64; Amount float64; Category string; Date string; Note string }`","给 Entry 写值接收者方法 `func (e Entry) Summary() string`（只读场景）**；实验：用 nil 指针 `var e *Entry` 调用 `e.Summary()` 不会 panic，输出零值**","写指针接收者方法 `func (e *Entry) SetAmount(v float64)`，验证能改到原值；**对比：改成值接收者后修改丢失**","**理解选择规则：需修改字段/结构体大/含 Mutex 时用 `*T`；纯函数/小结构体用 `T`；同一类型的所有方法应统一用一种**","写构造器 `NewEntry(amount float64, category, date string) *Entry`，在构造器里做参数校验（amount>0、category 非空、date 格式 YYYY-MM-DD）","**理解方法集：`*T` 的方法集包含 T 和 *T 的方法，但 T 只包含 T 的方法——混用会导致接口实现失败**"],deliver:"一个 `entry.go`：Entry 类型 + 构造器（带校验）+ 各一个值/指针接收者方法，并有对照实验代码（值接收者修改丢失、nil 指针调用行为）",pitfall:"结构体里含 `sync.Mutex` 或需要修改字段时，必须用指针接收者；混用会让方法集不一致导致接口实现失败。"},{day:6,title:"错误处理：包装、哨兵与 errors.Is",hours:3.5,tasks:["给每个可能失败的操作都写 `if err != nil { return err }`，不允许 `_ =` 忽略","用 `errors.New` 定义哨兵错误 `ErrNotFound`，在查询函数里返回它","**对照实验**：用 `%w` 包装后 `errors.Is` 返回 true；改用 `%v` 包装后 `errors.Is` 返回 false（链路断裂）",'定义自定义错误类型 `type ValidationError struct { Field string; Value any }` 实现 `Error()` 方法，用 `fmt.Errorf("创建失败: %w", &ValidationError{...})` 包装',"在调用方用 `errors.As(err, &ve)` 取出 `*ValidationError`，访问其 `Field` 和 `Value` 字段","写一个三层调用链 `main → service → repo`，验证最外层仍能 `errors.Is` 命中哨兵"],deliver:"一条能穿透三层的错误链，最外层用 `errors.Is` 成功识别 `ErrNotFound`；一份 `%w` vs `%v` 的对照实验记录",pitfall:"用 `%v` 包装会断开错误链，必须用 `%w`；`errors.Is` 比较的不是字符串。"},{day:7,title:"接口：隐式实现与由调用方定义",hours:3.5,tasks:["定义 `type EntryStore interface { Add(Entry) error; List() ([]Entry, error) }`","写一个内存实现 `memStore`，不写任何 `implements` 声明，直接赋值给接口变量验证隐式实现","**理解设计动机**：把接口定义放在「使用方」所在的包（而不是实现方），这样你可以随时替换实现（HTTPClient / MockClient / CachedClient），单元测试时可以用 mock；**如果接口由第三方库定义，你的代码就会依赖它，无法解耦**","用 `io.Writer` 写一个函数 `PrintAll(w io.Writer, data string)`，既能传 `os.Stdout` 也能传 `bytes.Buffer`","可选：用类型断言 `v, ok := x.(EntryStore)` 处理多种实现，或改用依赖注入 `NewService(store EntryStore)`"],deliver:"一个函数 `PrintAll(w io.Writer, s EntryStore)`，用 os.Stdout 和 bytes.Buffer 各跑一次；一份「为什么接口属于调用方」的笔记",pitfall:"接口零值是 nil，但「装着 nil 指针的接口」不等于 nil——判断时容易踩坑。"},{day:8,title:"defer / panic / recover + 第一周复盘",hours:4,tag:"复盘",tasks:["写三个 defer 打印 1/2/3，确认后进先出（3→2→1）","用 defer 关闭文件/连接，验证即使中途 return 也会执行","**对照实验**：在循环里 `defer f.Close()` 打开 100 个文件，观察文件句柄耗尽；改成「循环内显式 Close」或「用匿名函数包裹 defer」两种正确做法","**补充实验**：`i := 0; defer fmt.Println(i); i = 10`，观察 defer 输出 0（参数在注册时求值，不是执行时）","写一个 `recover` 示例，理解 panic 只应处理「程序不该继续」的情况（如 HTTP 中间件防崩溃）","复盘：用本周语法写 `wc` 小工具——读文件、按行切分、打印行数/字数"],deliver:"能跑的 `wc` 小工具 + 一段笔记说明「为什么循环里不要 defer」+ defer 参数求值时机实验记录",pitfall:"`defer` 的参数在注册时就求值，`defer f(i)` 里 i 是当时的值，不是执行时的值。"},{day:9,title:"SQL 基础：手写建表与单表增查",hours:3,tasks:["装 `sqlite3` CLI（或 DB Browser），`sqlite3 ledger.db` 进入交互","手写 `CREATE TABLE entries(id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL NOT NULL, category TEXT NOT NULL, date TEXT NOT NULL, note TEXT)`","插入 3 条账目，用 `SELECT * FROM entries` 查回","练 `WHERE date LIKE '2026-10%'`、`ORDER BY date DESC`、`LIMIT 2 OFFSET 1`；**大数据集时改用范围查询 `WHERE date >= '2026-10-01' AND date < '2026-11-01'` 能利用索引**","练聚合：`SELECT category, SUM(amount) FROM entries GROUP BY category`","练更新和删除：`UPDATE entries SET note = '午餐' WHERE id = 1`；`DELETE FROM entries WHERE date < '2026-01-01'` 清理旧数据","练 NULL 处理：`SELECT * FROM entries WHERE note IS NULL` 查无备注的条目"],deliver:"`ledger.db` 里有 3+ 条数据，你能不看文档写出带 WHERE + ORDER BY + LIMIT 的查询；一次 UPDATE 和 DELETE 实验记录",pitfall:"SQLite 是动态类型，`REAL` 列也能塞字符串；日期统一存 `YYYY-MM-DD` 文本，别存时间戳。"},{day:10,title:"database/sql 接入 SQLite",hours:3,tasks:['`go get modernc.org/sqlite`（纯 Go 驱动，无需 CGO）；**空白导入 `_ "modernc.org/sqlite"` 会执行包的 `init()` 函数，自动向 `database/sql` 注册 "sqlite" 驱动**','**标准连接流程**：`db, err := sql.Open("sqlite", "file:ledger.db?_journal_mode=WAL")` → `err != nil` 检查 → `db.Ping()` 真正检测连接问题（路径错误、权限不足等会在 Ping 时报错）→ 配置连接池',"设置 `db.SetMaxOpenConns(1)`、`db.SetMaxIdleConns(1)`，避免 SQLite 并发写直接 `SQLITE_BUSY`；**理解：`*sql.DB` 不是连接，而是连接池管理器**","把建表语句放到 `initSchema(db)` 里，程序启动时执行一次；用 `defer db.Close()` 确保退出前释放资源","了解 DSN 常用选项：`file:ledger.db`（基本）、`file:ledger.db?_journal_mode=WAL`（读写并发更好）、`file::memory:`（内存数据库，测试用）"],deliver:"程序启动后能在 `ledger.db` 里自动建出 entries 表（用 sqlite3 CLI 验证）；一份完整的连接建立代码片段",pitfall:"`sql.Open` 不会报连接错误，只有 `Ping` 才会；DSN 写错时错误会延迟到第一次查询。"},{day:11,title:"Exec / Query / QueryRow / rows.Scan",hours:4,tasks:["用 `db.Exec` 插入一条，取 `LastInsertId()` 作为 Entry.ID 回填","**完整模板**：用 `db.Query` 查多行，严格写 `for rows.Next() { rows.Scan(...) }` + `defer rows.Close()`（Query 后立即 defer）+ `rows.Err()`；**Scan 参数个数与类型必须与 SELECT 列完全一致**","用 `db.QueryRow` 查单行，区分 `sql.ErrNoRows` 与真正的查询错误","处理可空字段：用 `sql.NullString` 读 note，检查 `ns.Valid` 后再取 `ns.String`；**适用场景：数据库允许 NULL 的列**","封装 `AddEntry` / `ListEntries` / `GetEntry` 三个函数，参数用 `context.Context` 占位"],deliver:"`store.go` 里三个函数跑通，插入后能按 ID 查回、能列出全部；一份 `sql.NullString` 处理 NULL 的实验记录",pitfall:"`rows.Scan` 的参数个数必须与 SELECT 列数一致；忘记 `rows.Close()` 会造成连接泄漏。"},{day:12,title:"预编译语句与事务",hours:3,tasks:["用 `db.Prepare` 预编译 INSERT，循环插入 5 条并复用 stmt；**理解优势：SQL 解析一次、执行计划缓存、参数化查询防止 SQL 注入；stmt 用完要 `defer stmt.Close()`**","用 `db.Begin()` 开事务，`defer tx.Rollback()` 兜底（Commit 后会返回 `sql.ErrTxDone`，可安全忽略），成功路径显式 `Commit()`","故意在事务中途 `return err`，验证数据没有落库","在事务里批量插入 100 条，与「100 次独立 Exec」对比耗时，观察事务的批量性能优势","把 `AddEntry` 改造成支持传 `*sql.Tx` 的版本，为后续批量导入留口"],deliver:"一个批量导入函数：100 条在单事务内完成，中途失败可完整回滚；一份预编译 vs 直接 Exec 的性能对比记录",pitfall:"`defer tx.Rollback()` 在 Commit 之后执行会返回 `sql.ErrTxDone`，可以忽略但不能不写。"},{day:13,title:"持久化生命周期与连接管理",hours:2.5,tasks:["把 `*sql.DB` 从全局变量改成显式传入（作为结构体字段或函数参数），避免全局状态；**这就是「依赖注入」的雏形：需要什么就传什么**","在 `main` 里 `defer db.Close()`，确认程序退出前连接被释放","跑一次 add → 退出进程 → 重新执行 list，验证数据仍在","检查 `ledger.db` 文件权限（`ls -l`），确认不是 777（任何用户都能改）；如需修正用 `chmod 600 ledger.db`","**解读 `db.Stats()`**：打印 `OpenConnections`（当前打开的连接数）、`InUse`（正在使用的）、`Idle`（空闲的）；**关键观察：OpenConnections 应该 <= MaxOpenConnections，InUse + Idle = OpenConnections**"],deliver:"「写入 → 杀进程 → 重启 → 读回」四步验证通过，`db.Stats()` 显示连接数正常（OpenConnections=1, InUse=0, Idle=1）",pitfall:"程序里同时 open 多个 `*sql.DB` 指向同一文件，会互相锁；一个进程只留一个 DB 句柄。"},{day:14,title:"ledger-cli 骨架：add 与 list",hours:4,tasks:['**子命令分发**：检查 `os.Args[1]`，用 switch 分发到 `runAdd()` / `runList()`；每个子函数里用 `flag.NewFlagSet("add", flag.ExitOnError)` 解析参数',"`add` 支持 `-amount -category -date -note` 四个参数，缺 amount/category 时打印用法并 `os.Exit(1)`","金额用 `strconv.ParseFloat` 解析，拒绝 <= 0 的输入；日期校验格式为 YYYY-MM-DD","`list` 按 `date DESC, id DESC` 输出，用 `text/tabwriter` 对齐表格；**关键：列之间用 `\\t` 分隔，最后必须调用 `w.Flush()` 才会真正输出**","把数据库操作抽到 `internal/store` 包（`internal` 目录的代码只能被本项目 import，外部无法访问）；`main` 只负责解析参数和打印"],deliver:"`./ledger add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭` 后 `./ledger list` 能看到这行，表格对齐美观",pitfall:"flag 解析失败默认会 `os.Exit(2)`，想自己控制错误就设 `fs.SetOutput(io.Discard)` 并检查 `Parse` 的返回值。"},{day:15,title:"sum 子命令、阶段验收与复盘",hours:4,tag:"里程碑",tasks:["**对照实验**：先用 `SELECT SUM(amount)` 查询空月份，观察 Scan 到 float64 报错（NULL 无法转换）；再改用 `SELECT COALESCE(SUM(amount), 0)` 修复，无数据时返回 0","让 `list` 支持 `-limit`，默认 20","跑完整验收：add 两笔 → 关终端 → 重开 → list 两笔都在 → sum 数字正确","写 `README.md`：**包含快速开始（安装+三条命令示例）、数据库结构（CREATE TABLE）、技术栈、常见问题（如 sum 返回 0 的原因）**","**复盘框架**：列出最卡的 3 个点，按「问题→原因→下次怎么做」的格式写，促进元认知"],deliver:"ledger-cli 全部验收项通过，`README.md` 能让陌生人一条命令跑起来；一份结构化复盘笔记",pitfall:"`sum` 在无匹配行时返回 NULL，`Scan` 到 float64 会报错，用 `COALESCE(SUM(amount), 0)`。"}],tf=[{day:1,title:"goroutine：并发的起点",hours:3,tasks:['写 `go fmt.Println("bg")`，在 main 后立刻 return，观察后台任务来不及执行；**理解：`go` 关键字告诉运行时这个函数可以异步执行，Go 的调度器（GMP 模型）会在后台自动分配 CPU 时间片**',"加 `time.Sleep(100 * time.Millisecond)` 让后台跑完，理解「main 退出即进程结束」；**goroutine 初始栈很小（2KB），可以动态增长，这是能开几万个的关键**","起 5 个 goroutine 各打印自己的编号，观察输出顺序每次不同；**如果跑了 3 次顺序都一样，把数量加到 20 个或每个 goroutine 里加随机 sleep 提高可见性**","用 `runtime.NumGoroutine()` 打印当前 goroutine 数量","把同一个函数改成串行执行，对比 5 次 100ms 睡眠的总耗时（0.5s vs 0.1s），理解并行优势"],deliver:"一段能证明「并行比串行快 5 倍」的对比代码，以及「main 退出会杀掉所有 goroutine」的现象记录；能解释为什么 main 退出会杀掉所有 goroutine（进程级别的行为）",pitfall:"goroutine 不是线程，数量可以开到几万；但每个都要能退出，否则就是泄漏。"},{day:2,title:"channel：通信代替共享内存",hours:3.5,tasks:["**阻塞演示**：启动一个 goroutine 发送 `ch <- 1`（故意延迟 1 秒），主 goroutine 立即 `<-ch` 接收；观察「发送方在接收方准备好之前一直阻塞」的现象，理解无缓冲 channel 的同步特性","有缓冲 channel：`make(chan int, 3)`，连发 3 条不阻塞，第 4 条阻塞；**用另一个 goroutine 去接收来验证第 4 条确实阻塞了**","用 `close(ch)` + `for v := range ch` 消费完所有值","用 `v, ok := <-ch` 区分「收到零值」与「channel 已关闭」","只读/只写类型：`func producer(out chan<- int)` / `func consumer(in <-chan int)`；**注意：channel 是引用类型，复制的是指针**","**警告实验**：对 nil channel (`var ch chan int`) 发送或接收，观察程序永久阻塞（不会 panic）；始终用 `make(chan T)` 初始化"],deliver:"一个生产者-消费者 demo：生产 10 个数，消费者累加并打印总和；一份无缓冲 channel 阻塞行为的实验记录",pitfall:"向已关闭的 channel 发送会 panic；重复 close 也会 panic。关闭方应是唯一的发送方；对 nil channel 操作会永久阻塞。"},{day:3,title:"select 与超时控制",hours:3,tasks:["两个 channel，用 `select` 谁先到处理谁，观察随机选择；**理解：当多个 case 都 ready 时 Go 会随机选一个，保证公平性**","加 `default` 分支实现非阻塞接收；**警告：高频循环中慎用 default，会变成忙等待消耗 CPU，应配合 time.Sleep**","用 `case <-time.After(500 * time.Millisecond)` 给操作加超时；**正确做法：循环外创建 `ticker := time.NewTicker(500ms)`，循环内用 `case <-ticker.C` 避免定时器累积**","用 `for { select { ... case <-done: return } }` 写一个可停止的循环；**实际场景：日志处理器持续从 channel 读取并打印，直到收到 done 信号**","对比「无超时的阻塞接收」与「带超时」在对方不发数据时的行为"],deliver:"一个带超时的取数函数：对方 500ms 内不返回就放弃并返回 `ErrTimeout`",pitfall:"`time.After` 每次调用都会创建定时器，循环里用会累积；高频场景改 `time.NewTicker`。"},{day:4,title:"WaitGroup 与竞态复现",hours:3.5,tasks:["用 `sync.WaitGroup` 等待 10 个 goroutine 全部完成；**关键：Add 必须在启动 goroutine 之前调用（可以在循环内逐个 Add），绝不能在 goroutine 内部 Add，否则 Wait 可能提前返回**","写 10 个 goroutine 各 `count++` 一万次，串行结果是 100000；**理解：`count++` 是「读-改-写」三步操作，中间可能被其他 goroutine 打断**","`go run -race .` 运行，观察 `WARNING: DATA RACE` 与冲突的两处堆栈；**注意：-race 只能检测实际执行路径上的竞态，要多跑几次**","不加锁再跑几次，观察最终 count 每次都不同（丢失更新）；**即使偶尔等于 100000 也不代表没问题，竞态是概率性的**","记录一份 race 报告的原文，作为后面修复的对照"],deliver:"一份真实出现的 `DATA RACE` 报告（截图或日志），以及「最终值小于 100000」的复现",pitfall:"竞态不一定每次都触发，跑一次没报不代表没问题，`-race` 检测的是「发生过的并发访问」。"},{day:5,title:"Mutex 修复竞态",hours:3,tasks:["用 `sync.Mutex` 包住 `count++`，**必须用 `defer mu.Unlock()` 确保即使 panic 或 early return 也能释放锁；在持锁期间不要调用可能阻塞的操作（如 channel 发送、网络请求），否则容易死锁**","用 `sync.RWMutex` 改写读多写少场景，读用 `RLock`、写用 `Lock`；**仅在读远多于写（>10:1）且读操作耗时较长时使用 RWMutex，否则普通 Mutex 更简单高效**","把计数器封装成带方法的类型：`type Counter struct { mu sync.Mutex; n int }`","验证「锁不能复制」：把含 Mutex 的结构体按值传给函数，`go vet` 会告警 copylocks","跑 `go test -race ./...`，确认全绿"],deliver:"`-race` 从「有报告」到「无报告」的完整对照，且 `go vet` 无 copylocks 告警",pitfall:"锁的粒度要覆盖整个「读-改-写」，只锁一半等于没锁。"},{day:6,title:"context：取消与超时的传播",hours:3.5,tasks:["`context.WithCancel` 创建可取消 ctx，调用 cancel 后 `<-ctx.Done()` 立即返回；**Done() 返回只读 channel，由 context 内部管理，不要尝试 close 或发送**","`context.WithTimeout(ctx, 2*time.Second)`，打印 `ctx.Err()` 是 `DeadlineExceeded`","把 ctx 作为函数第一个参数逐层传递，验证取消能穿透两层调用；**示例：main → layer1(ctx) → layer2(ctx) → slowOp(ctx)，父 ctx 取消后所有子层级都会收到信号**","在 select 里监听 `ctx.Done()`，让阻塞操作能被打断","用 `context.WithValue` 存一个 requestID，并在下游取出（只放请求作用域数据）"],deliver:"一个 `SlowQuery(ctx)`：超时 2s 自动放弃，且日志里能看到 `context deadline exceeded`",pitfall:"ctx 只能向下传，不能存进结构体长期持有；`WithValue` 不要放业务参数。"},{day:7,title:"包组织、导出规则与 internal",hours:3,tasks:["一个目录一个包：确认 `package store` 的文件都在同一目录；**包名用小写单数名词，与目录名一致，避免 utils/helpers 等模糊名称**","首字母大写才导出，小写只能包内访问；故意从外部引用小写标识符验证编译失败","用 `internal/` 目录限制外部模块导入；**规则：只有同一模块内的其他包可以导入 internal 下的包，外部模块即使在同一 repo 也无法导入**","画一张依赖图：`main → store`，确保没有反向依赖","用 `go list -deps ./...` 或 `go mod graph` 看实际依赖关系"],deliver:"一张手画的包依赖图 + 目录树，`go build ./...` 通过",pitfall:"两个包互相 import 会直接编译失败，出现循环依赖时通常是要提取第三个包或改接口位置。"},{day:8,title:"重构 ledger-cli 为三个包",hours:4,tasks:["建 `internal/store`：定义 `EntryStore` 接口 + `sqliteStore` 实现","建 `internal/ledger`：放 Entry 类型与业务校验（金额 > 0、日期格式）","`main` 只做：解析命令行 → 组装 store → 调业务 → 打印结果","把接口定义放在 `ledger`（使用方），`store` 提供实现","重构后重跑阶段一的全部验收，行为不能有任何变化"],deliver:"`main` 的代码行数明显下降，且不再出现任何 SQL 语句",pitfall:"重构时最容易把「接口定义在实现方」，导致上层被迫依赖具体实现，解耦白做。"},{day:9,title:"并发导出、-race 全绿与阶段验收",hours:4,tag:"里程碑",tasks:["实现 `ledger export -dir out`：按月份分组，每月一个 CSV","用 goroutine + channel 并发写多个月份的文件，主 goroutine 用 WaitGroup 等待","并发写同一个 map 会 panic，改用「每个 goroutine 返回结果、主 goroutine 汇总」","跑 `go test -race ./...`，全绿；再跑 `go run -race .` 走一遍 add/list/export","写一段话解释「main 为什么依赖接口而不是具体类型」"],deliver:"`export` 能一次产出多个月份 CSV，`-race` 全程无报告",pitfall:"并发写文件要每个 goroutine 自己 `os.Create`，共享同一个 `*os.File` 写入会内容错乱。"}],rf=[{day:1,title:"最小 HTTP 服务",hours:3,tasks:['`http.HandleFunc("/hello", ...)` + `http.ListenAndServe(":8080", nil)` 起服务',"`curl -i localhost:8080/hello` 看状态行、响应头、响应体",'Handler 里用 `w.Write([]byte("hello"))` 写响应',"故意访问 `/nope`，观察默认 404 与 `text/plain` 响应体","改端口到 8081 再起一次，体验 `address already in use` 报错"],deliver:"一个 30 行内的 `main.go`，`curl -i` 能看到 200 与响应体",pitfall:"端口占用时错误在 `ListenAndServe` 返回值里，不要只 `log.Fatal` 而漏掉打印 err。"},{day:2,title:"Handler 读写：JSON 请求与响应",hours:3.5,tasks:["写 `func(w http.ResponseWriter, r *http.Request)`，打印 `r.Method` 与 `r.URL.Path`",'响应头顺序：`w.Header().Set("Content-Type", "application/json")` → `w.WriteHeader(201)` → `json.NewEncoder(w).Encode(v)`',"用 `json.NewDecoder(r.Body).Decode(&req)` 解析请求体，defer `r.Body.Close()`","造一个缺字段 / 类型不符的请求体，观察 Decode 返回的错误信息",'给 struct 加 `json:"amount"` tag，验证字段名从 `Amount` 变成 `amount`'],deliver:"`POST /echo` 能把收到的 JSON 原样返回，字段名符合 tag 定义",pitfall:"`WriteHeader` 之后再改 Header 无效；Encode 会自动补 `\n`，也是它能直接写流的原因。"},{day:3,title:"Go 1.22 路由：方法与路径参数",hours:3,tasks:['用 `mux.HandleFunc("POST /ledger", h)` 限定方法，`GET` 访问应返回 **405 Method Not Allowed**；**理解：Go 1.22+ 支持精确匹配，`POST /ledger` 与 `GET /ledger` 是两个不同的路由**','用 `GET /ledger/{id}` 定义路径参数，`r.PathValue("id")` 取出并 `strconv.ParseInt`；**非法 ID（非数字）返回 400 而不是 500**','用 `r.URL.Query().Get("month")` 读查询参数，缺省时给默认值',"注册 `GET /ledger/{id}` 与 `GET /ledger` 两个模式，验证不会互相抢路由；**故意注册冲突模式（如 `GET /ledger/{id}` 和 `GET /ledger/{name}`），观察启动时 panic**","理解 Go 1.22+ 的路由改进：支持方法限定、路径参数精确匹配、启动时检测冲突"],deliver:"一张路由表（方法 + 路径 + 用途），`curl` 对每个模式都能得到预期状态码",pitfall:"路径参数是字符串，`ParseInt` 失败要返回 400 而不是 500；模式冲突在启动时 panic，早暴露。"},{day:4,title:"统一响应信封 Response[T]",hours:3,tasks:["定义泛型 `type Response[T any] struct { Code int; Message string; Data T }`；**理解：泛型保证类型安全，调用时 `OK(w, entry)` 自动推断 T 为 Entry 类型**",'写 `OK[T](w http.ResponseWriter, data T)` 函数：**设置 Content-Type → Encode(Response{T}{Code:0, Message:"ok", Data:data})**；对比 `Data any` 版本会丢失类型信息',"写 `Fail(w http.ResponseWriter, status int, code int, message string)` 函数：**先 WriteHeader(status) → Encode(Response[any]{Code:code, Message:message, Data:nil})**",'成功响应：HTTP 200 + `{code:0, message:"ok", data:...}`；失败响应：HTTP 400/404/500 + `{code:40001, message:"...", data:null}`',"对比两种写法：`OK[Entry](w, entry)`（显式指定）vs `OK(w, entry)`（自动推断），体会泛型的便利性"],deliver:"`/hello` 与一个故意报错的 `/boom` 都返回同一个顶层结构，`curl` 可直接对比",pitfall:"HTTP 状态码表达传输层结果，业务 `code` 表达业务结果，两者不要混为一谈。"},{day:5,title:"账本 API 骨架落地",hours:3,tasks:["按 `internal/api`（handler）/`internal/ledger`（业务）/`internal/store` 建目录","注册路由表：`GET /hello`、`POST /ledger`、`GET /ledger`、`GET /ledger/{id}`、`GET /summary`","每个 handler 先用假数据返回，保证路由与信封都通","写一个 `routes.go` 集中注册，`main` 只调用 `api.NewRouter(store)`","用 `curl` 逐个打通五个端点，记录状态码"],deliver:"五个端点全部返回统一信封（数据是假的），路由集中在 `routes.go`",pitfall:"handler 里直接 `log.Fatal` 会让整个服务退出；handler 只返回错误，不负责退出。"},{day:6,title:"POST /ledger：内存版写入与校验",hours:3.5,tasks:["请求体用独立 DTO：`{amount, category, date, note}`，不要直接复用存储模型",'校验：`amount > 0`、`category` 非空、`date` 能被 `time.Parse("2006-01-02")` 解析',"校验失败返回 400 + 业务码，成功返回 201 + 新建对象（含生成的 ID）","用 `sync.Mutex` 保护内存切片，避免并发写（阶段二的练习在这里复用）","`curl` 造 4 个请求：正常、amount 为负、日期格式错、缺 category"],deliver:"四个 curl 用例分别得到 201/400/400/400，错误信息能指出具体字段",pitfall:"只校验「有没有」不校验「合不合法」；`amount` 用 float64 存金额，后续要做四舍五入。"},{day:7,title:"GET /ledger：列表与分页结构",hours:3.5,tasks:["返回 `{items, total, limit, offset}` 而不是裸数组","解析 `limit`（默认 20，上限 100）与 `offset`（默认 0，负数归零）","在内存切片上实现切片截取，处理好 `offset > len` 的边界","按 `date DESC, id DESC` 排序后再分页，保证结果稳定",'`curl "localhost:8080/ledger?limit=2&offset=2"` 验证翻页数据不重叠'],deliver:"同一批数据分两页取回，合起来等于全量且无重复",pitfall:"先分页再排序是经典错误，必须先把全量排好序再截取；OFFSET 深分页会扫描大量行。"},{day:8,title:"分页边界与 total 语义",hours:3,tasks:["列边界用例：`limit=0`、`limit=1000`、`offset=-1`、`offset=999`","`total` 返回过滤后的总数，不是当前页条数","`limit=0` 定为「用默认值」还是「返回空」，选一个并写进接口说明","给响应加 `has_more` 或让前端用 `offset+len(items) < total` 判断，二选一并说明理由","把这些边界写成一个 shell 循环，一条命令跑完"],deliver:"一个 `pagination-test.sh`，覆盖 5 个边界用例且全部符合预期",pitfall:"`limit` 不设上限会被一次拉全表；负数 offset 在 SQLite 里不会报错，只会静默返回错误结果。"},{day:9,title:"内存换 SQLite：store 层落地",hours:4,tasks:["在 `internal/store` 里实现 `Create` / `List(limit, offset)` / `Count` / `GetByID`","建表语句抽成 `schema.sql`，启动时用 `db.Exec` 执行（阶段五再换 goose）","**创建复合索引**：`CREATE INDEX idx_entries_date_id ON entries(date DESC, id DESC)`，让 `ORDER BY date DESC, id DESC LIMIT ? OFFSET ?` 走索引扫描","业务层只依赖接口，把内存实现换成 SQLite 实现时 handler 一行不改","跑一遍阶段二的分包原则：`api` 不出现任何 SQL 字符串"],deliver:"切换实现后 handler 零改动，`GET /ledger` 返回的数据来自数据库",pitfall:"`LIMIT ?` 在 SQLite 里传 int 可以，但 `OFFSET` 传负数不报错；参数要自己先校验。"},{day:10,title:"重启不丢：持久化验证",hours:2.5,tasks:["`POST` 两条账目后 `Ctrl+C` 停掉服务","重新启动，`GET /ledger` 仍能查到这两条",'检查 `ledger.db` 文件确实存在且有数据（`sqlite3 ledger.db "select count(*) from entries"`）',"把数据目录做成可配置（`-db` 参数或环境变量），避免写死相对路径","删除 db 文件后重启，验证会自动建表而不是崩溃"],deliver:"「写入 → 重启 → 读回」三步截图/日志，db 路径可通过参数指定",pitfall:"在容器或 IDE 里工作目录不同，相对路径会导致「数据丢了」的假象，用绝对路径或显式参数。"},{day:11,title:"GET /ledger/{id} 与 404 语义",hours:3,tasks:["解析路径参数，非法 ID 返回 400（不是 500）","store 查不到时返回哨兵 `ErrNotFound`，handler 用 `errors.Is` 转成 404","404 响应体也用统一信封，message 说明「账目不存在」","查存在与不存在各一次，确认状态码分别是 200 / 404","顺手加 `DELETE /ledger/{id}`，删除不存在的记录也返回 404"],deliver:"`GET`/`DELETE` 对存在与不存在的 ID 四种组合，状态码全部正确",pitfall:"把 `sql.ErrNoRows` 直接透出成 500，是这一步最常见的错误。"},{day:12,title:"GET /summary：按月聚合",hours:3.5,tasks:["SQL：`SELECT category, SUM(amount) FROM entries WHERE date LIKE ? GROUP BY category`","返回 `{month, total, by_category: [{category, total}]}`","无数据时返回空数组与 total=0，而不是 null","`month` 参数缺省时用当前月，格式校验 `YYYY-MM`","用 sqlite3 CLI 手动核对一次聚合结果"],deliver:'`curl "/summary?month=2026-10"` 的 total 与手工 `SUM` 结果一致',pitfall:"`SUM` 在无匹配行时是 NULL，扫描到 float64 会报错，用 `COALESCE(SUM(amount), 0)`。"},{day:13,title:"中间件机制",hours:3,tasks:["写 `func logging(next http.Handler) http.Handler`，理解 `http.Handler` 是接口","把 mux 包进中间件：`logging(mux)`，验证所有路由都经过它","写两个中间件串联 `recovery(logging(mux))`；**理解洋葱模型执行顺序**：请求进入时 recovery 先包裹 → logging 记录开始时间 → handler 执行业务 → logging 输出状态码和耗时 → recovery 兜底 panic","用 `http.StripPrefix` 理解中间件也能改写请求","把路由注册抽成 `NewRouter()`，返回已包裹中间件的 handler"],deliver:"请求进出一个中间件时能各打一行日志，顺序符合「洋葱模型」",pitfall:"中间件顺序决定行为，认证/限流/日志的先后不能随便调；写错顺序会静默失效。"},{day:14,title:"日志中间件与 ResponseWriter 包装",hours:3.5,tasks:["实现 `statusRecorder` 包装 `http.ResponseWriter`，记录 WriteHeader 的状态码","日志输出：method、path、status、duration、remote addr","用 `time.Since(start)` 计算耗时，单位为 ms","验证 `w.Write` 未显式调用 WriteHeader 时状态码应记为 200","把日志格式改成一行一条，方便后续接入 `slog`（阶段五）"],deliver:"每个请求一行结构化日志，能看出慢请求",pitfall:"直接断言 `w.(http.Flusher)` 会在包装后失效；需要实现 `Flush`/`Hijack` 透传。"},{day:15,title:"统一错误处理与输入校验",hours:3,tasks:["定义业务错误码常量：参数错误 40001、未找到 40401、内部错误 50001","handler 内不再手写 `Fail(...)` 分支，改为返回 error 由统一函数翻译","写一个 `decodeJSON` 辅助函数：限制 body 大小（`http.MaxBytesReader`）、拒绝未知字段（`DisallowUnknownFields`）","把校验规则集中到 DTO 的 `Validate()` 方法","用一个「缺字段 + 超大 body + 错误类型」用例集验证都能得到 400"],deliver:"handler 里没有重复的 if-else 错误分支，错误码集中在一处定义",pitfall:"`DisallowUnknownFields` 会让前端多传字段直接 400，联调时要提前约定。"},{day:16,title:"深分页认知与 cursor 预留",hours:3,tasks:["用 `EXPLAIN QUERY PLAN` 对比两种分页：**`LIMIT 20 OFFSET 5000` 会扫描并跳过前5000行（O(n)复杂度）** vs **`WHERE (date, id) < (?, ?) ORDER BY date DESC, id DESC LIMIT 20` 利用索引直接定位（O(1)复杂度）**","造 10 万条测试数据（脚本批量插入），对比两种分页的耗时；**预期：OFFSET 5万时耗时显著增加，游标分页耗时基本恒定**","接口增加可选 `cursor` 参数：**格式为 `last_date,last_id`（上一页最后一条记录的date和id）**，解析后走 `WHERE (date < ?) OR (date = ? AND id < ?)` 游标查询","保持 `limit/offset` 兼容，`cursor` 存在时优先使用游标分页；**适用场景区分**：OFFSET适合跳页浏览但深分页慢，游标适合无限滚动/下拉加载但不能跳页","写一段接口说明：10万行以上必须用游标分页，OFFSET只适合前几页快速跳转"],deliver:"一份对比数据（OFFSET 5 万 vs 游标的第一页耗时）+ 可用的 cursor 参数实现",pitfall:"游标分页不能跳页；用 `(date, id)` 复合游标时排序字段必须与游标一致且方向相同。"},{day:17,title:"curl 回归脚本",hours:3,tasks:["写 `scripts/api-test.sh`：创建 → 列表 → 分页 → 单条 → summary → 404","用 `set -euo pipefail`，任一断言失败立即退出","用 `jq` 提取字段做断言（没有 jq 就用 grep 匹配关键片段）","脚本自己启动服务、跑完 kill，保证可重复执行","故意改坏一个接口，验证脚本能报红"],deliver:"一条 `./scripts/api-test.sh` 能端到端验证全部端点，输出 PASS/FAIL 汇总",pitfall:"脚本里用了 `localhost` 但服务监听 `127.0.0.1` 之外的地址时可能连不上，统一用 `127.0.0.1`。"},{day:18,title:"阶段验收与复盘",hours:4,tag:"里程碑",tasks:["跑完整验收：curl 创建两笔 → 重启 → 两笔都在 → 分页生效 → summary 正确","确认响应信封在成功与失败两种路径下完全一致","确认真实前端（Vue 或最简单的 fetch 页面）能调通 `GET /ledger`","补一份 API 清单：方法、路径、参数、响应示例","复盘：写清「OFFSET 为什么慢」以及本阶段踩过的 3 个坑"],deliver:"API 清单 + 全绿回归脚本；此时 API 已可被 Vue 调用",pitfall:"本阶段还没有认证，别把服务暴露到公网；只在局域网或本机测试。"}],sf=[{day:1,title:"密码哈希原理与 Argon2id 参数",hours:3.5,tasks:["弄清「哈希 ≠ 加密」：不可逆、加盐防彩虹表、慢哈希抗暴力","读 OWASP 密码存储建议，记下 Argon2id 推荐参数：`m=65536 (64MiB), t=3, p=4`","`go get golang.org/x/crypto/argon2`，看 `argon2.IDKey(pw, salt, t, m, p, keyLen)` 的函数签名","明确存储格式：`$argon2id$v=19$m=65536,t=3,p=4$<base64(salt)>$<base64(hash)>`，盐与参数都要存","用 `crypto/rand.Read(salt)` 生成 16 字节随机盐，禁止用时间戳或用户名当盐"],deliver:"一页笔记：参数含义（内存/迭代/并行度）+ 存储格式，能解释「为什么盐要随机且每用户唯一」",pitfall:"参数写死在代码里没问题，但必须与存储的字符串一致，否则换参数后老密码全验不过。"},{day:2,title:"实现 hashPassword / verifyPassword",hours:3.5,tasks:["实现 `hashPassword(pw string) (string, error)`：生成盐 → IDKey → 拼编码串","实现 `verifyPassword(pw, encoded string) (bool, error)`：解析参数与盐 → 重算 → 常量时间比较","用 `subtle.ConstantTimeCompare` 比较哈希，避免时序攻击","写表驱动单测：正确密码通过、错误密码不通过、空密码报错、篡改编码串报错","测量单次哈希耗时，确认落在 150–250ms 区间（不在就调参数）"],deliver:"两个函数 + 4 个单测用例全绿，单次哈希耗时在目标区间",pitfall:"用 `==` 比较哈希字符串会有时序泄漏；解析失败要返回错误而不是 false。"},{day:3,title:"bcrypt 备选方案与成本校准",hours:2.5,tag:"可选",tasks:["`go get golang.org/x/crypto/bcrypt`，用 `GenerateFromPassword(pw, 12)` **显式**传 cost","对比 bcrypt cost=10/12/14 的单次耗时，记录数据","说明什么情况下选 bcrypt（内存受限、依赖更简单），什么情况选 Argon2id","把哈希实现抽成接口 `Hasher`，让两种算法可替换","在配置里加 `password.algorithm`，默认 argon2id"],deliver:"一张 cost-耗时对照表 + 可切换的 Hasher 接口",pitfall:"不要依赖 `bcrypt.DefaultCost`，它随版本可能变化，必须显式写 12。"},{day:4,title:"users 表与唯一约束",hours:3,tasks:["建 `users(id, email TEXT UNIQUE NOT NULL, password_hash TEXT NOT NULL, created_at)`","email 统一 trim + 小写后存储，避免大小写重复注册","给 email 建唯一索引，插入重复时识别 SQLite 的约束错误","写 `CreateUser` / `GetUserByEmail` 两个 store 方法","手工用 sqlite3 CLI 插入重复 email，验证被约束拦住"],deliver:"重复 email 插入返回可识别的「已存在」错误，而不是 500",pitfall:"靠「先查再插」判断重复有并发窗口，唯一索引才是最终防线。"},{day:5,title:"POST /register",hours:4,tasks:["DTO：`{email, password}`；校验邮箱格式、密码长度 >= 8","密码先哈希再入库，任何日志里都不允许出现明文密码","重复 email 返回 409 + 业务码，不要暴露「这个邮箱已注册」之外的细节","响应只返回 `{id, email}`，绝不返回 `password_hash`","写 4 个 curl 用例：正常、短密码、非法邮箱、重复注册"],deliver:"注册成功返回 201 且响应体无任何密码字段；重复注册 409",pitfall:"返回 400 和 409 混用会让前端无法区分；明文密码一旦进日志就等于泄露。"},{day:6,title:"POST /login：校验密码",hours:3.5,tasks:["按 email 查用户，查不到与密码错都返回同一个「邮箱或密码错误」","用 `verifyPassword` 校验，注意查不到用户时也要走一次假哈希，避免时序侧信道","登录成功先返回一个占位 token，把签发逻辑留到明天","限制登录请求体大小，防止超大 body 打满内存","写 3 个用例：正确、密码错、不存在的邮箱"],deliver:"三种登录情况都返回统一错误信息，成功路径能拿到占位 token",pitfall:"「用户不存在」和「密码错误」返回不同提示，等于给攻击者做账号枚举。"},{day:7,title:"JWT 签发",hours:3,tasks:["`go get github.com/golang-jwt/jwt/v5`",'定义 claims：`type Claims struct { jwt.RegisteredClaims; UserID int64 `json:"sub"` }`，包含 `sub`（user id）、`exp`、`iat`，不要塞敏感信息',"用 HS256 签发：`token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)`，secret 从环境变量 `APP_JWT_SECRET` 读且长度 >= 32","设置有效期（如 24h）：`claims.ExpiresAt = jwt.NewNumericDate(time.Now().Add(24 * time.Hour))`，`exp` 单位是秒","用 `token.SignedString([]byte(secret))` 得到 token 字符串，用 jwt.io 解码验证三段结构与 payload 内容"],deliver:"`POST /login` 返回真实 JWT，解码后 `sub` 是用户 ID、`exp` 合理",pitfall:"secret 硬编码进仓库等于没有认证；`exp` 单位是秒不是毫秒。"},{day:8,title:"JWT 验证与错误分类",hours:3.5,tasks:["`jwt.ParseWithClaims` + 自定义 `Keyfunc`，强制校验签名算法为 HS256","区分三类失败：签名无效、已过期、格式错误，分别映射到 401 与不同业务码","写单测覆盖：正常 token、过期 token、被篡改 payload、错误算法（none）",'用 `jwt.WithValidMethods([]string{"HS256"})` 防算法混淆攻击',"验证过期 token 的 `errors.Is(err, jwt.ErrTokenExpired)` 能命中"],deliver:"4 个 token 用例全部按预期被接受或拒绝，过期能被单独识别",pitfall:"不限制算法时，攻击者可以把 alg 改成 none 绕过签名。"},{day:9,title:"认证中间件",hours:3.5,tasks:["从 `Authorization: Bearer <token>` 取 token，注意 `Bearer ` 后有空格且大小写不敏感","验证通过后把 userID 放进 context：定义 `type ctxKey int` 和 `const userIDKey ctxKey = iota`，用 `context.WithValue(r.Context(), userIDKey, id)` 避免 key 冲突","失败统一返回 401 + 统一信封，不要区分「没带 token」和「token 错」的细节给前端","把 `/ledger` 整组路由包进认证中间件，`/register` `/login` 不包","用 `r.WithContext(ctx)` 生成新请求再交给下游 handler"],deliver:"不带 token 访问 `/ledger` 返回 401，带合法 token 能进 handler",pitfall:"context key 不要用 string 字面量，用自定义类型避免与其他包的 key 冲突。"},{day:10,title:"context 取值与 handler 改造",hours:3,tasks:["写 `func userIDFrom(ctx) (int64, bool)` 集中取值，避免每个 handler 重复断言","所有账本 handler 从 ctx 取 userID，不再信任请求体里的 user_id","把 userID 一路传到 store 层（作为显式参数，不要塞进 ctx 传到底层）","给取不到 userID 的情况返回 401 而不是 500（说明中间件漏挂）","检查每个 handler 都走通了认证，用日志确认 userID 正确"],deliver:"handler 里没有任何 `user_id` 来自请求体；日志能打印当前 userID",pitfall:"把 userID 只放在 ctx 里传到 SQL 层，会让依赖关系变隐晦，业务层应显式接收。"},{day:11,title:"数据隔离：每条查询都带 user_id",hours:4,tasks:["entries 表加 `user_id INTEGER NOT NULL`，并建 `(user_id, date)` 复合索引：`CREATE INDEX idx_entries_user_date ON entries(user_id, date DESC)`","逐条审查查询：`INSERT` 写入 userID、`SELECT/UPDATE/DELETE` 全部加 `WHERE user_id = ? AND ...`","详情接口必须用 `WHERE id = ? AND user_id = ?`，不能先查再判断归属（会泄露记录是否存在）","造 A、B 两个用户各 3 条数据，用 A 的 token 请求 B 的账目 ID，必须返回 404 而不是 403","写一个检查清单，把「漏 WHERE user_id」列为 code review 必查项，包括 JOIN 和子查询"],deliver:"A 看不到 B 的任何账目，且用 B 的 ID 直接请求也是 404（不是 403）",pitfall:"「先按 id 查出来再判断归属」会泄露记录是否存在；条件要写进 WHERE。"},{day:12,title:"敏感字段隔离与阶段验收",hours:4,tag:"里程碑",tasks:['给 `PasswordHash` 加 `json:"-"`，或改用独立的响应 DTO（推荐后者）',"全局搜一遍响应结构，确认没有任何结构体意外嵌入了 User","写一个脚本 grep 所有响应 JSON，断言不包含 `password` 字样","跑完整验收：A 创建一笔 → B 登录看不到 → 无 token 返回 401 → 响应无密码哈希","复盘：为什么「漏一个 WHERE user_id」是这一阶段最危险的 bug"],deliver:"验收四步全过；能说出数据隔离的三道防线（中间件、WHERE 条件、响应 DTO）",pitfall:'用 `json:"-"` 只是兜底，一旦有人写了自定义 MarshalJSON 仍可能泄露，DTO 更可靠。'}],of=[{day:1,title:"分层目录设计",hours:3,tasks:["定目录：`internal/handler`、`internal/service`、`internal/repository`、`internal/model`","画依赖图：handler → service → repository，箭头单向","明确每层职责：handler 只碰 HTTP，service 只碰业务规则，repository 只碰 SQL","把现有的 handler 按职责标注出「哪几行属于 service」","定一个规矩：handler 里不出现 `db.`，repository 里不出现 `http.`"],deliver:"目录树 + 依赖图 + 三条分层红线",pitfall:"分层不是越细越好，四层足够；多一层「manager」往往只是把代码搬来搬去。"},{day:2,title:"接口定义与手动依赖注入",hours:3.5,tasks:["在 service 层定义 `EntryRepository` 接口（使用方定义）","在 handler 层定义 `EntryService` 接口，或直接用具体结构体（说明取舍）","写 `main` 里的组装：`repo := repository.New(db)` → `svc := service.New(repo)` → `h := handler.New(svc)`","验证可测性：给 service 传一个假 repo，单测不碰数据库","确认没有任何包级全局变量持有 db 或 service"],deliver:"`main` 里 5 行内完成全部组装，且能注入假实现跑通一个单测",pitfall:"接口定义在实现方会让上层被迫 import 实现包，解耦失败。"},{day:3,title:"分层重构落地",hours:4,tasks:["把认证、账目 CRUD 的 handler 瘦身：只解析请求 + 调 service + 写响应","把「金额 > 0、日期格式、归属校验」搬进 service","把 SQL 全部搬进 repository，方法签名收 `ctx context.Context`","定义 service 层错误：`ErrInvalidInput`、`ErrNotFound`、`ErrForbidden`","重构后跑阶段三的 `api-test.sh`，必须全绿"],deliver:"`api-test.sh` 全绿，handler 文件行数下降一半以上",pitfall:"重构时容易把事务边界拆散，注意「一个业务用例一个事务」要在 service 层控制。"},{day:4,title:"GORM 接入与连接池配置",hours:3.5,tasks:["`go get gorm.io/gorm gorm.io/driver/sqlite`，确认版本 >= v2.3.19","`gorm.Open(sqlite.Open(dsn), &gorm.Config{})`，用 `db.DB()` 取出底层 `*sql.DB`","显式配置 `SetMaxOpenConns(1)`、`SetMaxIdleConns(1)`、`SetConnMaxLifetime(time.Hour)`","开启 GORM logger，设为 Warn 级别，避免 SQL 刷屏","打印 `sqlDB.Stats()`，确认连接数符合预期"],deliver:"GORM 能连上同一个 `ledger.db`，连接池参数显式可见",pitfall:"不配连接池时默认无上限，SQLite 下会频繁 `database is locked`。"},{day:5,title:"模型定义与 tag",hours:3,tasks:['定义 `User`、`Entry`、`Category`、`Budget` 四个模型，字段用 `gorm:"..."` 标注','`Entry` 加 `UserID uint` + `gorm:"index:idx_user_date"`，与 `Date` 组成复合索引',"金额字段用 `int64` 存「分」或 `decimal`，明确取舍并统一","用 `TableName()` 固定表名，避免 GORM 复数化猜错","用 `db.DryRun` 模式打印建表 SQL，人工过一遍字段类型"],deliver:"四个模型 + 一份 DryRun 生成的建表 SQL，字段类型与索引符合预期",pitfall:"`float64` 存金额会有精度误差（0.1+0.2），要么存分，要么用 decimal。"},{day:6,title:"Session 核心模式：隔离 + context",hours:4,tasks:["在 repository 里统一用 `db := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})` 创建干净实例","实现 `GetByID`、`Create`、`List` 三个方法，全部从 `db` 出发而不是复用 `r.db`","确认 `NewDB: true` 会清空链式条件：连续调用两次不同查询验证条件不会残留","确认 `Context: ctx` 会随请求取消：handler 里 sleep 后取消请求，看查询是否中断并返回 `context.Canceled`","写一段注释说明：`NewDB` 解决链式污染，`Context` 解决超时传导，两者缺一不可"],deliver:"repository 里所有查询都从干净 session 出发，且请求取消能传导到驱动",pitfall:"只写 `NewDB` 不写 `Context`，请求取消不会传导；只写 `Context` 不写 `NewDB`，链式条件会串。"},{day:7,title:"WithContext 与 Session 的对照实验",hours:3.5,tasks:["写两个版本的同名方法：一个用 `WithContext`，一个用 `Session{NewDB, Context}`","用 `db.Debug()` 打印两次调用的 SQL 与 Statement 状态",'构造链式污染场景：先 `.Where("user_id = ?", 1)` 再复用 db，观察条件残留',"用 `context.WithTimeout(1*time.Nanosecond)` 验证两种方式下取消是否都能生效","把结论写成一段「为什么显式 Session 更确定」的说明"],deliver:"一份对照记录：链式污染复现 + 两种方式的取消行为差异",pitfall:"`WithContext` 会返回新实例但底层 Statement 复用，看似隔离实则共享部分状态。"},{day:8,title:"GORM CRUD 与零值陷阱",hours:4,tasks:["用 `First` / `Find` / `Create` / `Save` / `Updates` / `Delete` 各写一个方法","复现零值陷阱：把 amount 改成 0 用 `Updates` 更新，数据库没变",'用 `Select("amount")` 或 `map[string]any{"amount": 0}` 修复',"把 `gorm.ErrRecordNotFound` 翻译成 repository 的 `ErrNotFound`","配置软删除（`gorm.DeletedAt`）并验证 `Delete` 后 `Find` 查不到、`Unscoped` 能查到"],deliver:"零值更新能生效；删除行为符合预期（软删或硬删）并写进文档",pitfall:"`Save` 会更新全部字段，容易把未加载的字段覆盖成零值；局部更新用 `Updates`。"},{day:9,title:"事务与 ctx 传递",hours:3.5,tasks:["用 `db.Transaction(func(tx *gorm.DB) error {...})` 实现「创建账目 + 更新预算统计」","在事务内每一步都用 `tx.Session(&gorm.Session{NewDB: true, Context: ctx})`","验证：第二步返回 error 时第一步的数据不落库","测一次 panic：事务回调里 panic 会被 GORM 回滚并重新抛出","把事务边界放在 service 层，repository 只提供「接收 tx」的版本"],deliver:"一个跨两张表的原子操作，失败时能完整回滚",pitfall:"`Transaction` 回调的 `tx` 不自动带外部 ctx，必须每步显式设置。"},{day:10,title:"goose 迁移文件",hours:3.5,tasks:["`go install github.com/pressly/goose/v3/cmd/goose@latest`","建 `migrations/00001_init.up.sql` 与 `00001_init.down.sql`，用 `-- +goose Up` / `-- +goose Down` 标记块","写 `00002_add_categories.up.sql` 与对应的 `.down.sql`，确保 down 能完全撤销 up 的操作（删表、删索引）","用 `goose sqlite3 ledger.db up` 执行迁移，`goose status` 查看版本","执行 `goose down` 回滚一步，验证 down 脚本真的能撤销且库处于干净状态"],deliver:"两个成对的迁移文件，up/down 都能干净执行",pitfall:"down 脚本写错会导致回滚失败且库处于中间状态；先在副本库上验证。"},{day:11,title:"用迁移替换 AutoMigrate",hours:3,tasks:["删掉启动时的 `AutoMigrate` 调用","用 `goose.SetBaseFS(embed.FS)` + `//go:embed migrations/*.sql` 把迁移打进二进制","把迁移做成独立命令（`./app migrate up`）或启动前独立步骤，不在每次启动自动跑","验证：空库启动 → 执行迁移 → 表结构正确","把 `AutoMigrate` 仅保留在测试辅助函数里"],deliver:"生产路径不再有 `AutoMigrate`，迁移通过显式命令执行",pitfall:"每次启动自动跑迁移在多实例部署时会并发执行，可能把库改坏。"},{day:12,title:"分类表与关联",hours:4,tasks:["`categories(id, user_id, name, created_at)`，`(user_id, name)` 唯一","entries 加 `category_id`，保留 `category` 字符串作为冗余显示或直接迁移掉（二选一并说明）","实现分类 CRUD，删除分类时检查是否被引用",'列表查询用 `Preload("Category")` 或 JOIN 返回分类名',"验证：同一用户不能建同名分类，不同用户可以"],deliver:"分类可增删查，账目能正确关联分类，跨用户同名分类互不影响",pitfall:"`Preload` 会产生 N+1 或额外查询，列表接口用 JOIN + Select 指定字段更可控。"},{day:13,title:"统计接口：按月按分类聚合",hours:3.5,tasks:['`Select("category_id, SUM(amount) as total").Where("user_id = ? AND date LIKE ?", uid, month+"%").Group("category_id")`',"补齐分类名：JOIN categories 或二次查询映射","返回 `{month, total, by_category}`，并按 total 降序","加「按月趋势」接口：`GROUP BY substr(date,1,7)` 返回近 6 个月","用 sqlite3 CLI 手工核对两个月的聚合数字"],deliver:"统计接口数字与手工 SQL 完全一致，趋势接口能返回近 6 个月",pitfall:'`date LIKE "2026-10%"` 依赖字符串格式统一，混入 `2026/10/19` 就会漏数据。'},{day:14,title:"统计性能与索引验证",hours:3,tasks:["用 `EXPLAIN QUERY PLAN` 确认统计查询走了 `(user_id, date)` 索引","造 10 万条数据，记录统计接口耗时","对比「有索引 / 无索引」的耗时差异","把 `SUM(amount)` 的字段类型与存储单位确认一遍，避免隐式转换导致全表扫","把结论写进 README：什么量级下需要引入缓存"],deliver:"一份性能记录（行数、耗时、执行计划），能判断当前是否需要 Redis",pitfall:"在 WHERE 里对列做函数运算（`strftime(...)`）会让索引失效。"},{day:15,title:"集中式错误处理",hours:4,tasks:["定义 `type AppError struct { Code int; HTTPStatus int; Message string; Err error }`，实现 `Error() string` 方法","service 只返回 `AppError` 或哨兵错误（如 `ErrNotFound`），不关心 HTTP 状态码","写统一翻译函数：根据 `AppError.HTTPStatus` 设置响应状态码，`Code` 作为业务码，`Message` 给用户看，原始 `Err` 只记日志","handler 统一写成 `if err != nil { respondErr(w, r, err); return }`，不再手写多个 if-else 分支","未知错误统一 500 并记录原始 err 到 slog，响应里只返回「内部错误」不透出 SQL 与表结构"],deliver:"handler 里没有裸的 `http.Error`；所有错误走同一条翻译路径",pitfall:"把 `err.Error()` 直接返回给前端会泄露 SQL 与表结构。"},{day:16,title:"结构化日志与 request ID",hours:4,tasks:["用 `log/slog` 建 JSON handler：`handler := slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{Level: slog.LevelInfo})`，`slog.SetDefault(handler)`","中间件生成 request ID：用 `crypto/rand.Read(b)` 生成 16 字节并 hex 编码，放进 ctx 与响应头 `X-Request-ID`",'每条请求日志带结构化字段：`slog.Info("request", "request_id", reqID, "method", r.Method, "path", r.URL.Path, "status", status, "duration_ms", duration.Milliseconds(), "user_id", userID)`','错误响应体里也带 request_id，方便用户报错时定位：`Response{Code: xxx, Message: "...", RequestID: reqID}`',"验证：用 request_id grep 日志，能串起一次请求的全部记录（包括慢查询、错误堆栈）"],deliver:"一次失败请求，凭响应里的 request_id 能在日志中定位到完整链路",pitfall:"用 `log.Printf` 拼字符串会丢失结构化字段；slog 要用 `slog.String/Int` 传键值。"},{day:17,title:"表驱动测试：service 层",hours:3.5,tasks:["写 `cases := []struct{ name string; in Input; wantErr error }` + `t.Run`","覆盖：金额为 0、负金额、分类不存在、正常创建","给 service 注入假 repository（内存 map 实现），测试不碰数据库","用 `errors.Is` 断言错误类型，不要比较错误字符串","跑 `go test ./internal/service/...`，全部通过"],deliver:"service 层 4+ 个表驱动用例，不依赖数据库即可运行",pitfall:"只测 happy path 的测试没有价值；边界与错误分支才是重点。"},{day:18,title:"Handler 测试与 httptest",hours:3,tasks:["用 `httptest.NewRequest` + `httptest.NewRecorder` 测一个 GET 端点","断言状态码、`Content-Type`、响应信封结构（反序列化后比较字段）","测一个 POST：合法 body 返回 201，非法 body 返回 400","测认证中间件：无 token 401、坏 token 401、好 token 200","确认测试里不需要真正监听端口"],deliver:"handler 层测试覆盖成功/参数错/未认证三类路径",pitfall:"直接比较整个 JSON 字符串会因字段顺序或空格失败，应反序列化后比较结构。"},{day:19,title:"Repository 测试：内存 SQLite",hours:4,tasks:["用 `file::memory:?cache=shared` 或每个测试独立临时文件建库","每个测试前跑迁移（`goose.Up`）或用最小建表 SQL，保证结构一致","测 `Create` → `GetByID` 往返，字段值完全一致","测 `List` 的分页与排序，以及 `WHERE user_id` 的隔离","注意 `MaxOpenConns(1)` 与 shared cache 组合可能死锁，记录你的解决方式"],deliver:"repository 测试可重复运行（连续跑 3 次都通过），不残留数据",pitfall:"`file::memory:?cache=shared` 多个测试共享同一个库，会互相污染；用唯一 DSN 或临时文件。"},{day:20,title:"覆盖率与竞态",hours:3,tasks:["`go test -race -cover ./...` 全绿","`go test -coverprofile=cover.out ./... && go tool cover -func=cover.out` 看各包覆盖率","给覆盖率最低的包补 2 个用例（优先补错误分支）","确认没有测试依赖执行顺序","把 `-race` 写进 CI 或本地检查脚本"],deliver:"`-race` 全绿，核心包覆盖率有明显提升（记录前后数字）",pitfall:"追求 100% 覆盖率没有意义，重点是业务分支与错误路径。"},{day:21,title:"预算检查（stretch goal）",hours:3.5,tag:"可选",tasks:["建 `budgets(id, user_id, category_id, month, amount)`，`(user_id, category_id, month)` 唯一","实现设置预算接口与查询接口","创建账目时查询当月该分类已用金额，与预算比较","响应里返回 `budget_exceeded: true/false` 与 `remaining`","先用「返回标志但不阻断」的简化版跑通，复杂规则后置"],deliver:"超预算时创建账目仍成功，但响应带 `budget_exceeded` 标志",pitfall:"预算检查放在事务外会有并发超支窗口；要求严格时需要行锁或串行化写入。"},{day:22,title:"CSV 导出：全量加载版（stretch goal）",hours:3,tag:"可选",tasks:["`GET /ledger/export?month=` 返回 `text/csv`",'设置 `Content-Disposition: attachment; filename="ledger-2026-10.csv"`',"用 `encoding/csv` 写表头与数据行","中文 Excel 打开乱码时，在开头写 UTF-8 BOM","先用「查到内存再写」的简化版，验证文件能下载能打开"],deliver:"浏览器点一下能下载 CSV，Excel/Numbers 打开中文不乱码",pitfall:"`WriteHeader` 之后再 `Set` header 无效；导出前必须先把 Content-Type 设好。"},{day:23,title:"CSV 流式导出（stretch goal 优化）",hours:3,tag:"可选",tasks:["用 `csv.Writer` 直接写 `http.ResponseWriter`，边查边写","`rows, err := db.Query(...)` 后逐行 `Scan` 并 `Write` + 定期 `Flush`","确保 `rows.Close()` 与 `Flush()` 在函数退出前执行","造 5 万条数据，对比全量版与流式版的内存占用","明确失败场景：写到一半出错只能中断连接，无法改状态码"],deliver:"流式导出的内存占用基本恒定，5 万条数据不 OOM",pitfall:"流式输出一旦开始就无法返回错误页；要提前做完参数校验。"},{day:24,title:"接口清单与前端联调准备",hours:3.5,tasks:["整理接口清单：方法、路径、鉴权要求、请求体、响应示例、错误码","确认 CORS 或 Vite 代理配置，前端能跨端调用","用 `curl` 把清单里每个接口各跑一次，示例与真实响应对齐","给前端准备一份种子数据脚本（两个用户、若干账目、一个分类）","和前端约定错误码处理方式（401 跳登录、400 提示字段）"],deliver:"一份可直接交给前端的 API 文档 + 种子数据脚本",pitfall:"文档里的示例用手写 JSON 容易与实现漂移，最好用真实响应贴回去。"},{day:25,title:"端到端回归",hours:4,tasks:["扩展 `api-test.sh`：注册 → 登录 → 建分类 → 建账目 → 列表 → 统计 → 导出","加上「A 用户访问 B 数据应 404」的隔离断言","加一个并发用例：10 个并发创建请求，验证无 `database is locked`","跑 3 遍确认稳定，把失败日志留档","修复回归中发现的问题并补对应单测"],deliver:"一条命令跑完完整业务流，连续 3 次全绿",pitfall:"并发用例在 `MaxOpenConns(1)` 下会排队，若报锁错误说明还有连接没归还。"},{day:26,title:"阶段验收与复盘",hours:4,tag:"里程碑",tasks:["跑 `go test ./...`、`go test -race ./...` 全绿","curl 走通全流程，迁移可执行，日志能用 request ID 定位","确认 repository 全部使用 `Session(&gorm.Session{NewDB: true, Context: ctx})`","口述验收题：`NewDB` 和 `Context` 各自解决什么，为什么比 `WithContext` 更确定","复盘：本阶段最耗时的三件事，以及哪些是「本来可以避免」的"],deliver:"阶段验收清单全过；能不看笔记讲清 Session 两个字段的作用",pitfall:"预算与流式导出是 stretch goal，没做完不影响主线，别为了它们牺牲测试与 context 正确性。"}],af=[{day:1,title:"配置管理：文件 + 环境变量 + 默认值",hours:3.5,tasks:["选 koanf 或 viper，建 `config.yaml`：server 端口、db 路径、jwt 过期时间、日志级别","绑定到结构体：`type Config struct { Server ServerCfg; DB DBCfg; JWT JWTCfg }`","实现优先级：默认值 < 配置文件 < 环境变量（`APP_SERVER_PORT` 覆盖 `server.port`）","在 `main` 里一次性加载并注入，其他包不直接读环境变量","加 `-config` 参数指定配置文件路径"],deliver:"同一个二进制通过配置文件与 `APP_*` 环境变量能跑出两种配置",pitfall:"环境变量名要与嵌套结构对应且大小写一致，容易静默失效；加载后打印最终生效配置（脱敏）。"},{day:2,title:"敏感配置与启动即失败",hours:3,tasks:["JWT 密钥、数据库密码只从环境变量或 secrets 读，不写进 yaml","启动校验：密钥为空或长度 < 32 时直接 `log.Fatal` 并给出明确提示","配置文件加入 `.gitignore`，仓库只提交 `config.example.yaml`","给配置加载写单测：缺必填项应返回错误","确认 `strings`/日志里不会打印完整密钥（打码只留前 4 位）"],deliver:"缺少 JWT 密钥时进程立即退出并提示；`git log -p` 里搜不到真实密钥",pitfall:"把密钥写进 Dockerfile 的 ENV 会被 `docker history` 看到；用运行时注入。"},{day:3,title:"多阶段 Dockerfile",hours:4,tasks:['builder 阶段用 `golang:1.23-alpine`，`CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w"`',"运行阶段用 `alpine` 或 `distroless/static`，只拷贝二进制与迁移文件","确认 `modernc.org/sqlite` 纯 Go 驱动在 `CGO_ENABLED=0` 下能正常工作","`docker build -t family-ledger:dev .` 构建成功","`docker run --rm -p 8080:8080 family-ledger:dev` 能起服务"],deliver:"镜像能跑起来，体积明显小于单阶段构建（记录体积）",pitfall:"多阶段之间用 `COPY --from=builder`，路径写错会得到 `stat: not found`。"},{day:4,title:"镜像瘦身与非 root 运行",hours:3,tasks:["写 `.dockerignore`：排除 `.git`、`node_modules`、`*.db`、`dist`","创建非 root 用户并 `USER app`，数据目录提前 `chown`","时区问题：alpine 缺 tzdata，需要就装或统一用 UTC","对比 `alpine` 与 `distroless` 的镜像体积与调试便利性，选定一个","`docker run --read-only` 试试，确认只有数据卷可写"],deliver:"镜像以非 root 运行，`docker run` 后 `whoami` 不是 root",pitfall:"非 root 用户对挂载卷没有写权限会导致 SQLite 打不开，需在构建时建好目录并授权。"},{day:5,title:"compose 编排",hours:4,tasks:["写 `compose.yaml`：service（app）+ 卷 `./data:/data` + 端口映射 + `env_file`","配置 healthcheck 指向 `/healthz`，设置 interval/timeout/retries","`restart: unless-stopped`，验证容器异常退出会重启","`docker compose up -d` 起服务，`docker compose logs -f` 看日志","确认 SQLite 文件落在卷里，`down` 再 `up` 数据还在"],deliver:"`docker compose up -d` 一条命令起完整服务，重启后数据不丢",pitfall:"用匿名卷存 SQLite，`docker compose down -v` 会直接删数据；用绑定挂载更可控。"},{day:6,title:"迁移接入部署流程",hours:3.5,tasks:["把迁移做成镜像内的子命令：`./app migrate up`","在 compose 里用独立的一次性服务或 `entrypoint.sh` 先跑迁移再启动","验证：空数据卷 → `up` → 表自动建好 → 服务可用","确认重复执行 `migrate up` 是幂等的","写进 README：升级版本时的发布步骤（备份 → 迁移 → 起服务）"],deliver:"全新环境一条命令完成「建表 + 启动」，重复执行不报错",pitfall:"迁移与应用并发启动会竞争；用 `depends_on` + 条件或独立步骤串行化。"},{day:7,title:"健康检查：/healthz 与 /readyz",hours:3,tasks:["`/healthz` 只返回进程存活（200 + 极简 JSON），不查数据库","`/readyz` 执行 `db.PingContext`，数据库不可用返回 503","两个端点都不要求认证，也不写业务日志（避免刷屏）","把 compose 的 healthcheck 指向 `/healthz`，探针超时设置合理","模拟数据库不可用（改错路径重启），验证 `/readyz` 变 503 而 `/healthz` 仍 200"],deliver:"两个端点在数据库故障时表现不同，能被编排系统正确区分",pitfall:"liveness 里查数据库会导致数据库短暂抖动时容器被反复重启。"},{day:8,title:"优雅关闭",hours:4,tasks:["给 `http.Server` 设置超时：`ReadHeaderTimeout: 5*time.Second`（防 Slowloris 攻击）、`ReadTimeout: 15*time.Second`、`WriteTimeout: 30*time.Second`、`IdleTimeout: 120*time.Second`","用 `signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)` 监听信号","收到信号后先 `srv.Shutdown(shutdownCtx)`（等待进行中请求完成），`shutdownCtx` 设 10s 超时作为兜底","`Shutdown` 返回后再 `sqlDB.Close()`，顺序不能反：先停新请求 → 等旧请求 → 关数据库","`Shutdown` 超时则 `srv.Close()` 强制断开并记录日志，确保进程能退出"],deliver:"完整的一段关闭流程代码，顺序为 Shutdown → db.Close，且超时有兜底",pitfall:"先 `db.Close()` 会让进行中的请求全部失败；没有 Server 超时则 Shutdown 可能永远等。"},{day:9,title:"验证优雅关闭",hours:3,tasks:["写一个慢接口（sleep 3s），发起请求后立刻 `docker stop`","观察日志：收到 SIGTERM → 等待进行中请求 → 请求成功返回 → 退出","确认容器退出码为 0，不是 137（被 kill）","`docker stop` 默认等 10s，把慢接口调到 15s 验证超时兜底行为","把观察结果记录到 README"],deliver:"一次完整实验：进行中请求完成、服务正常退出、退出码 0",pitfall:"容器里 PID 1 不转发信号，用 `exec` 形式启动或引入 tini，否则收不到 SIGTERM。"},{day:10,title:"CORS 与反向代理",hours:3.5,tasks:["开发环境：用 Vite `server.proxy` 把 `/api` 代理到后端，避免跨域","或后端设置 CORS：只允许指定 origin，不用 `*`（带 cookie 时 `*` 无效）","需要 cookie 时设置 `Access-Control-Allow-Credentials: true` 且 origin 必须具体","处理预检请求 `OPTIONS`，缓存 `Access-Control-Max-Age`","部署环境用同源反向代理（Nginx/Caddy）转发，彻底绕开跨域"],deliver:"开发与部署两种环境下前端都能正常调用，无 CORS 报错",pitfall:"`Allow-Origin: *` 与 `Allow-Credentials: true` 同时出现会被浏览器直接拒绝。"},{day:11,title:"依赖漏洞扫描",hours:3,tasks:["`go install golang.org/x/vuln/cmd/govulncheck@latest`","跑 `govulncheck ./...`，读懂输出：哪个依赖、哪个函数、是否有可达路径","按提示升级到修复版本，`go mod tidy` 后重跑","把 `govulncheck` 加进构建前检查脚本，失败则中断","记录扫描结果与处理方式到 README"],deliver:"`govulncheck ./...` 输出 `No vulnerabilities found`",pitfall:"只升 go.mod 不 `go mod tidy` 可能留下旧版本；间接依赖要 `go get pkg@version` 显式提升。"},{day:12,title:"Cookie 安全属性",hours:3.5,tasks:["登录成功后用 `http.SetCookie` 下发 token，设置 `HttpOnly: true`（防 XSS 读取）、`Secure: true`（仅 HTTPS 传输）、`SameSite: http.SameSiteLaxMode`","`Path=/`、`MaxAge` 与 token 过期时间一致（如 86400 秒 = 24h）","本地开发用 http 时 `Secure` 会导致 cookie 不下发，用环境变量区分：生产必须 true，开发可 false","后端读 cookie 替代 `Authorization` 头，认证中间件同时兼容两种取法（便于调试）",'前端 `fetch` 需要 `credentials: "include"` 才带 cookie，跨域时还需 CORS 配置'],deliver:"浏览器 DevTools 里能看到 cookie 的 HttpOnly/Secure/SameSite 三个标记",pitfall:"`SameSite=None` 必须搭配 `Secure`；HttpOnly 只防 JS 读取，不防 CSRF。"},{day:13,title:"CSRF 中间件与顺序",hours:4,tasks:["`go get github.com/gorilla/csrf`，用 `csrf.Protect([]byte(secret))` **包裹整个路由器**：`csrfMiddleware(csrfMux)`","确认中间件顺序：`Recovery → CSRF → RateLimit → Auth → mux`，CSRF 必须在 Auth 之后、mux 之前","前端从响应头 `X-CSRF-Token` 或 cookie `_gorilla_csrf` 拿到 token，写进请求头 `X-CSRF-Token`","验证：不带 token 的 POST/PUT/DELETE 返回 403，带合法 token 成功；GET 请求不受 CSRF 保护","检查 `/healthz` 是否被 CSRF 拦住（不应被拦，因为 GET 请求默认豁免），如被拦需确认 csrf 配置正确"],deliver:"POST/PUT/DELETE 全部受 CSRF 保护，GET 与 `/healthz` 不受影响",pitfall:"把 `csrf.Protect` 挂在单个路由上，未匹配路径会绕过校验；必须包住整个 mux。"},{day:14,title:"Vue 联调、手机验收与复盘",hours:5,tag:"里程碑",tasks:["Vue 完成：登录 → 添加账目 → 列表 → 统计 → 超预算标志","用手机浏览器访问局域网地址，走通全流程（注意 cookie Secure 与 https）","验收：`docker stop` 时服务优雅退出、`govulncheck` 通过、CSRF 位置正确","补 README：架构图、启动方式、配置项、备份与恢复步骤","复盘整条路线：哪一阶段最值得重学，哪一处设计现在会做得不一样"],deliver:"手机浏览器完成完整业务闭环；README 能让陌生人 10 分钟内跑起来",pitfall:"手机访问局域网 IP 时 cookie 不生效，多半是 Secure 或 SameSite 配置与 http 不匹配。"}],lf='<!--day 1 | light-->\n#### 今天只解决一件事\n把「写 → 编 → 跑」这条链路跑通。Go 的编译产物是**单个静态二进制**：没有解释器、不依赖虚拟机、目标机器上不需要装 Go。后面所有「服务为什么在别人机器上跑不起来」的排查，都建立在你对这一点的手感上。\n\n#### 三个命令的分工，别混着用\n- `go build -o ledger .`：编译当前目录的 main 包，产出 `ledger`，**不运行**。部署时用的就是它。\n- `go run .`：编译到临时目录并立刻执行，适合试错，**产物不留**。别拿它当「运行方式」，它每次都重编。\n- `go install`：编译并安装到 `$GOPATH/bin`。装工具（`goose`、`govulncheck`）走这条，装完可以直接在终端敲命令名。\n\n#### `go.mod` 不是配置文件\n`go mod init ledger` 写下的 `module ledger`，是这个模块的**导入路径前缀**。包之间互相引用时写 `ledger/internal/store`，Go 按前缀解析，**不按目录相对路径**。所以改目录名不会静默改坏 import，改了就得改 import。\n\n`go.sum` 是依赖校验和，防止别人在远端替换同名版本；两个文件都要提交，别把 `go.sum` 加进 `.gitignore`。\n\n```go\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("ledger")\n}\n```\n\n#### 判据：四条命令全过才算跑通\n```bash\ngo run .                          # 输出 ledger\ngo build -o ledger . && ./ledger  # 输出 ledger\ngofmt -l .                        # 必须无输出（有输出=格式不合规）\ngo vet ./...                      # 必须无输出\n```\n`gofmt -l` 列的是「需要格式化的文件」，空输出才叫合规；`go vet` 查的是「能编译但大概率是 bug」的写法，跟风格无关。\n\n::q `go run .` 里的 `.` 能省吗？省了会发生什么？\n::a 不能省。Go 的构建命令都以**包**为参数，`.` 表示「当前目录对应的包」。省掉后 Go 不知道要构建谁，会报 `no go files in ...` 之类的错。同理 `go build ./...` 的 `./...` 表示「当前目录及其子目录下所有包」。\n::q `gofmt -l .` 输出了 `main.go`，说明什么？怎么修？\n::a 说明这个文件格式不合规（缩进、对齐、括号位置）。修法：`gofmt -w main.go` 直接写回，或编辑器保存时自动格式化。注意它不是「有 bug」，只是格式。\n::q 为什么 `go.sum` 必须提交，而 `ledger` 这个二进制不该提交？\n::a `go.sum` 记录依赖的哈希，保证不同机器拉到的是同一份依赖，属于源码的一部分。二进制是构建产物，能由源码重新生成，提交它会导致仓库膨胀、且二进制和源码可能不一致。惯例是 `.gitignore` 里写上二进制名。\n\n<!--day 2 | core-->\n#### 为什么先讲类型：这不是语法细节\nGo 是静态强类型，**没有任何隐式转换**。`int` 和 `int64` 是两个完全不同的类型，`a + b` 直接编译失败。初学者会觉得这是麻烦，但它把「精度丢失」「溢出」这类问题从**运行时**提前到了**编译期**——账本这类算钱的程序，这个性质是救命的。\n\n#### 零值：声明即可用，但不等于能用\n```go\nvar n int        // 0\nvar s string     // ""\nvar ok bool      // false\nvar p *Entry     // nil\nvar m map[string]int // nil\n```\nGo 没有「未初始化」状态，每个变量一出生就有确定的零值。但零值合法 ≠ 可以操作：\n- `m["a"] = 1` 对 nil map 写入 → **panic: assignment to entry in nil map**\n- `p.Name` 对 nil 指针解引用 → **panic: invalid memory address**\n- `s[0]` 对空字符串取下标 → **panic: index out of range**\n\n所以「零值可用」的真正含义是：**读**是安全的，**写之前要先 make 或取地址**。\n\n#### 转换、解析、格式化是三件事\n```go\ni := 42\nf := float64(i)   // 42.0  显式拓宽，安全\nj := int(3.9)     // 3     直接截断，不四舍五入\n\nn, err := strconv.Atoi("42")  // 字符串 → int，可能失败\ns := strconv.Itoa(42)         // int → 字符串，不会失败\nu, err := strconv.ParseFloat("3.14", 64)\n```\n区分点：**类型转换**（`float64(i)`）在编译期完成，不会失败；**解析**（`Atoi`）处理的是外部输入，一定返回 `err`，必须检查。\n\n#### 金额为什么从第一天就不用 float64\n```go\nfmt.Println(0.1 + 0.2)        // 0.30000000000000004\nfmt.Println(0.1+0.2 == 0.3)   // false\n```\nfloat64 是二进制浮点，`0.1` 无法精确表示。账本要求分毫不差，两条路：用 `int64` 存「分」，或引入 decimal 库。**这个决定会在阶段五建 `Entry` 模型时兑现**，今天先建立成条件反射：看到 `float64` 算钱，就当 bug 处理。\n\n#### 判据\n```go\na, b := 3, 2\nfmt.Println(a / b)          // 1，整数除法截断\nfmt.Println(float64(a)/float64(b)) // 1.5\n```\n能解释上面两行为什么不同，今天就算过。\n\n::q `var s []int` 之后直接 `s = append(s, 1)` 会 panic 吗？\n::a 不会。nil 切片是 `len=0, cap=0`，`append` 会自动分配底层数组并返回新切片。会 panic 的是 **nil map 写入**，这两者行为不同，容易混。\n::q `int(3.9)` 和 `math.Round(3.9)` 有什么区别？\n::a `int(3.9)` 是类型转换，直接截断小数部分得到 3；`math.Round(3.9)` 是数学四舍五入，返回 float64 的 4。算钱时用截断会系统性少算，用四舍五入要考虑「银行家舍入」的争议——所以干脆用整数分。\n::q 为什么 `strconv.Atoi` 要返回 error，而 `strconv.Itoa` 不用？\n::a `Atoi` 的输入来自外部（命令行、HTTP 请求、文件），可能是 `"abc"`、`"3.9"`、`""`，必须能表达失败。`Itoa` 的输入是内存里的 int，任何 int 都能转成字符串，不存在失败路径，所以不返回 error。\n\n<!--day 3 | core-->\n#### 先看清切片是什么，再谈扩容\n切片不是「数组的别名」，它是一个**三字段结构体**：\n\n```\ntype slice struct {\n    array unsafe.Pointer  // 指向底层数组\n    len   int             // 当前长度\n    cap   int             // 从 array 起可用的容量\n}\n```\n\n关键结论由此推出：**切片按值传递，但三个字段里的指针指向同一块内存**。所以「传切片进函数」「切片赋值」都不会复制元素，改元素会互相看见；但 `append` 可能换一块新数组，于是两边就分家了。\n\n#### 值语义与共享，用一段代码看清\n```go\narr := [5]int{1, 2, 3, 4, 5}\ns := arr[1:3]        // len=2 cap=4，指向 arr[1]\n\ns[0] = 99\nfmt.Println(arr)     // [1 99 3 4 5]  ← 改切片，数组变了\n\ns = append(s, 7)     // cap 还有空间，原地写 arr[3]\nfmt.Println(arr)     // [1 99 3 7 5]  ← 仍然影响底层数组\n\ns = append(s, 8, 9, 10, 11)  // 超出 cap=4，重新分配\ns[0] = 1\nfmt.Println(arr)     // [1 99 3 7 5]  ← 这次不再影响\n```\n三行 `fmt.Println` 的差异，就是「共享底层数组」和「扩容后独立」的分界。**不看 cap 就猜 append 会不会影响原数组，一定会错。**\n\n#### 两种命运：原地写 vs 重新分配\n- `len < cap`：`append` 直接写 `array[len]`，`len++`，底层数组不变 → **调用方能看到这次写入**。\n- `len == cap`：分配新数组（通常是 2 倍，超过 1024 元素后按 1.25 倍增长），拷贝旧元素，返回新切片 → **调用方看不到**。\n\n所以 `f(s []int)` 里 `append` 的结果**必须返回给调用方**，否则新元素丢失，这是最常见的 bug 之一。\n\n#### 三索引切片：控制 cap，切断共享\n```go\ns := arr[1:3:3]   // len=2, cap=2\ns = append(s, 100) // 立刻触发重新分配，不会污染 arr[3]\n```\n`arr[low:high:max]` 的 `max` 决定 cap。**当你要把子切片传给不受控的代码，又不想它写坏原数组时，用三索引把 cap 卡死。**\n\n#### 边界与坑\n- `s[1:10]` 越界：上界可以到 `cap`，但 `len` 以外访问会 panic（`s[1:10]` 若 10 > cap 直接 panic）。\n- 大数组切一小段长期持有 → 整块底层数组无法回收。要长期持有就 `copy` 一份出来。\n- `nil` 切片和空切片 `[]int{}` 在 `len`/`append`/`range` 上行为一致，`json.Marshal` 结果不同（`null` vs `[]`）。API 返回列表时想要 `[]`，就初始化为空切片。\n\n#### 判据\n```go\ns := make([]int, 0, 4)\ns = append(s, 1)\nfmt.Println(len(s), cap(s))  // 1 4\n```\n不看讲解能说出：`arr := [3]int{}; s := arr[:]; s = append(s, 9); fmt.Println(arr)` 输出什么？（答案在自测第 2 题）\n\n::q `s := make([]int, 3)` 之后 `s[0] = 1` 会 panic 吗？`append(s, 1)` 呢？\n::a `s[0]=1` 不会 panic，因为 `len=3`，三个元素都已存在（值为 0），是**可写**的。`append(s,1)` 也不 panic，会追加到第 4 位并扩容。容易混的是 `make([]int, 0, 3)`：`len=0`，这时 `s[0]=1` 就 panic 了——容量存在不代表长度存在。\n::q `arr := [3]int{1,2,3}; s := arr[:]; s = append(s, 9); fmt.Println(arr)` 输出什么？\n::a 输出 `[1 2 3]`。`arr[:]` 得到的切片 `len=3, cap=3`，已经满了，`append` 必须重新分配新数组，新元素写在新数组里，`arr` 一个字节都没变。如果把 `arr` 换成 `[4]int`，cap 变成 4，输出就会是 `[1 2 3 9]`。\n::q 函数内 `append` 了切片但没返回，为什么调用方「有时」能看到新元素？\n::a 因为能不能看到取决于**是否重新分配**：`len<cap` 时新元素写进了共享的底层数组，调用方按原 `len` 切片看不到，但如果它自己再 `append` 或直接按索引访问 cap 区间，就能读到那块内存。这种「有时能、有时不能」正是最危险的状态，所以规则必须是：**append 的结果一律返回**。\n\n<!--day 4 | normal-->\n#### map 的两个必知语义\n```go\nm := make(map[string]int)\nv, ok := m["a"]      // v=0, ok=false —— 用 ok 区分「不存在」和「值是 0」\ndelete(m, "a")       // 删不存在的 key 不报错\n```\n只用 `v := m["a"]` 判断存在性是错的：存了 `0` 和没存，返回的 `v` 都是 `0`。**凡是用零值本身有意义的场景（计数、金额），必须用 `v, ok` 双返回值。**\n\n#### 遍历无序是语言保证，不是实现巧合\n```go\nfor k := range m { ... }   // 顺序随机，每次运行都可能不同\n```\n需要稳定顺序就显式排序：\n```go\nkeys := make([]string, 0, len(m))\nfor k := range m { keys = append(keys, k) }\nsort.Strings(keys)\nfor _, k := range keys { fmt.Println(k, m[k]) }\n```\n这条规矩在阶段五的**报表输出**里会直接影响结果可复现性——同一份数据两次导出的行序不同，测试就没法比对。\n\n#### 并发写 map 会直接崩\n```go\n// 两个 goroutine 同时 m[k] = v\n// fatal error: concurrent map writes\n```\n不是数据错乱，是**运行时直接杀进程**，`recover` 都拦不住。要用 `sync.RWMutex` 或 `sync.Map`（阶段二会展开）。今天只需要记住：map 不是并发安全的。\n\n#### 字符串：字节、rune、拼接\n```go\ns := "账本"\nfmt.Println(len(s))                    // 6 —— 字节数\nfmt.Println(len([]rune(s)))            // 2 —— 字符数\nfmt.Println(s[0])                      // 232 —— 一个字节，不是字符\nfor i, r := range s { ... }            // i 是字节偏移，r 是 rune\n```\nGo 的字符串是**只读字节序列**，UTF-8 编码。中文一个字 3 字节，所以 `len` 和「字数」不是一回事，`s[0]` 拿到的是半个字。\n\n拼接：\n- 少量：`a + b`，简单但每次都分配新串。\n- 循环内：用 `strings.Builder`，预分配 `Grow`，避免 O(n²)。\n- 格式化：`fmt.Sprintf`，可读但慢。\n\n#### 判据\n```go\nm := map[string][]int{}\nm["a"] = append(m["a"], 1)   // 对 nil value 的 append 是安全的\n```\n能解释为什么这行不用先初始化 `m["a"]`，以及为什么 `m["b"][0] = 1` 会 panic。\n\n::q `m := map[string]int{}; if m["x"] == 0 { ... }` 这段判断有什么隐患？\n::a 无法区分「key 不存在」和「key 存在但值为 0」。如果业务上 0 是合法值（比如某分类本月支出为 0），这行会把「有记录且为 0」误判成「没记录」。正确写法是 `v, ok := m["x"]; if !ok || v == 0`，或者更明确地分开两次判断。\n::q 为什么 `for k := range m` 的顺序不能依赖？\n::a Go 故意在每次 range 时随机化起始位置，强制开发者不依赖顺序。如果业务需要稳定输出（CSV 导出、报表、测试断言），必须自己把 key 取出来排序。依赖 map 顺序的代码在本地可能一直「正确」，上线后偶发错乱。\n::q `strings.Builder` 相比 `s += part` 在循环里的优势是什么？\n::a `s += part` 每次都分配一个新字符串并拷贝全部旧内容，n 次拼接是 O(n²) 的内存拷贝。`Builder` 内部是可变字节切片，按需扩容，均摊 O(n)，还能用 `Grow` 一次性预分配避免多次扩容。\n\n<!--day 5 | core-->\n#### 值接收者和指针接收者，差别只有一句话\n方法接收者是**值**，调用时复制一份；是**指针**，传的是地址，方法内改字段能影响原对象。\n\n```go\ntype Entry struct { Amount int64 }\n\nfunc (e Entry) Double()  { e.Amount *= 2 }   // 改的是副本，调用方看不到\nfunc (e *Entry) Double2() { e.Amount *= 2 }  // 改的是原对象\n```\n\n#### 但真正难的是「方法集」，它决定谁能满足接口\nGo 的规则很短，但后果很大：\n\n| 接收者 | `T` 的方法集 | `*T` 的方法集 |\n| :--- | :--- | :--- |\n| `func (t T)` | ✅ 包含 | ✅ 包含 |\n| `func (t *T)` | ❌ **不包含** | ✅ 包含 |\n\n所以：\n```go\ntype Saver interface{ Save() error }\nfunc (r *Repo) Save() error { ... }\n\nvar s Saver = Repo{}    // 编译错误：Repo does not implement Saver\nvar s Saver = &Repo{}   // 正确\n```\n**只要有一个方法用了指针接收者，这个类型就只有 `*T` 满足接口，`T` 不满足。** 这条规则在阶段五写 Repository 时会天天遇到（`*repo` 实现了接口，`repo` 没有）。\n\n#### 什么时候必须用指针接收者\n1. 方法要修改接收者（几乎所有 `Set`/`Update`/`append` 类操作）。\n2. 结构体较大（几十字节以上），复制成本不划算。\n3. 结构体含 `sync.Mutex` 等不可复制字段——复制会破坏锁语义，`go vet` 会直接报 `copylocks`。\n4. 同一个类型上混用两种接收者 → **统一成指针**。混用是维护灾难：你永远记不清哪个方法改得动数据。\n\n#### 构造器：为什么返回指针\n```go\nfunc NewLedger(path string) (*Ledger, error) {\n    db, err := sql.Open("sqlite", path)\n    if err != nil { return nil, fmt.Errorf("open ledger: %w", err) }\n    return &Ledger{db: db}, nil\n}\n```\n返回 `*Ledger` 而不是 `Ledger`：一是避免复制内部状态，二是让「构造可能失败」这件事通过 `error` 显式暴露，调用方不可能忘掉检查。Go 没有构造函数语法，`NewXxx` 是纯约定，但全生态都遵守。\n\n#### 判据\n```go\ntype Counter struct{ n int }\nfunc (c Counter) Inc()  { c.n++ }\nfunc (c *Counter) Inc2() { c.n++ }\n\nc := Counter{}\nc.Inc();  fmt.Println(c.n)  // 0\nc.Inc2(); fmt.Println(c.n)  // 1\n```\n能不看讲解说出这两个 0 和 1 的原因，以及 `var _ Saver = Repo{}` 这类「编译期断言」的写法。\n\n::q 一个类型有 3 个方法用值接收者、1 个用指针接收者，`T` 能满足接口吗？\n::a 取决于接口要求哪些方法。如果接口只要那 3 个值接收者方法，`T` 和 `*T` 都满足。但只要接口里包含那个指针接收者的方法，就只有 `*T` 满足。实践上更该注意的是：**同类型混用接收者是坏味道**，应该统一，否则调用方要不停在 `T` 和 `&T` 之间猜。\n::q 为什么含 `sync.Mutex` 的结构体不能用值接收者？\n::a 值接收者会复制整个结构体，`Mutex` 也被复制，于是锁变成了「两把独立的锁」，互斥失效；解锁时还可能复制出未加锁状态，`go vet` 报 `copylocks`。正确做法是指针接收者，且结构体本身也以指针传递。\n::q `func NewX() *X` 返回指针，和返回 `X` 相比最实际的好处是什么？\n::a 调用方拿到的是同一个对象，后续方法（尤其是指针接收者的）能真正修改它；返回值也不必整体复制。配合 `(T, error)` 双返回值，还能把「构造失败」变成强制检查项——返回 `X` 时零值可能是「看起来正常但其实是坏的」对象。\n\n<!--day 6 | core-->\n#### 错误不是异常，是被传递的值\nGo 里 `error` 是一个接口：\n```go\ntype error interface { Error() string }\n```\n任何实现了 `Error() string` 的类型都是 error。函数把错误**当返回值返回**，调用方**必须显式检查**。没有 try/catch，也就没有「异常静默穿过三层栈」这种事——代价是每个可能失败的地方都得写 `if err != nil`。\n\n#### 三种错误来源，处理方式不同\n1. **哨兵错误（sentinel）**：`sql.ErrNoRows`、`gorm.ErrRecordNotFound`。用 `errors.Is` 判断。这类错误是**预期内的分支**，不是故障。\n2. **包装错误**：`fmt.Errorf("create entry: %w", err)`。保留原始错误链，供上层判断。\n3. **自定义错误类型**：需要携带结构化信息（字段名、冲突 ID）时定义 `type ValidationError struct{ Field string }`，用 `errors.As` 取出。\n\n#### `%w` 和 `%v` 的区别，是这道题的分水岭\n```go\nerr1 := fmt.Errorf("open db: %v", base)  // 只是文本拼接，链断了\nerr2 := fmt.Errorf("open db: %w", base)  // 保留链，errors.Is(err2, base) == true\n\nfmt.Println(errors.Is(err1, base)) // false\nfmt.Println(errors.Is(err2, base)) // true\n```\n`%v` 之后 `errors.Is/As` 全部失效，上层没法判断「到底是数据库连不上，还是记录不存在」。**包装一律用 `%w`，只在确实要切断语义时才用 `%v`。**\n\n#### 判断方式：不要用 `==` 比字符串\n```go\n// ❌ 脆弱：字符串改了、被包装了就失效\nif err.Error() == "record not found" { ... }\n\n// ✅ 判断身份\nif errors.Is(err, sql.ErrNoRows) { ... }\n\n// ✅ 判断类型并取出字段\nvar ve *ValidationError\nif errors.As(err, &ve) {\n    fmt.Println(ve.Field)\n}\n```\n`errors.Is` 会沿 `Unwrap()` 链逐层比对，`errors.As` 会沿链找第一个类型匹配。**这就是 `%w` 的意义所在。**\n\n#### 包装的层次要在日志里可读\n```go\nfunc (r *repo) Get(ctx context.Context, id int64) (*Entry, error) {\n    var e Entry\n    err := r.db.QueryRowContext(ctx, "SELECT ... WHERE id = ?", id).Scan(&e.ID, &e.Amount)\n    if err != nil {\n        return nil, fmt.Errorf("repo.Get(id=%d): %w", id, err)\n    }\n    return &e, nil\n}\n```\n最终日志里是 `api: load entry: repo.Get(id=42): sql: no rows in result set`——**从调用链倒着读就能定位**。只写 `fmt.Errorf("failed")` 的代码，出故障时等于没日志。\n\n#### 边界与坑\n- `if err != nil { return err }` 允许，但丢失上下文；跨包边界必须补一层包装。\n- 不要在循环里 `errors.Is` 判同一个错误多次；判断一次，转成业务分支。\n- 错误字符串小写开头、不带标点（Go 惯例），因为它会被拼接进上层句子。\n- `err == nil` 是唯一可靠的「成功」判据，别用 `err.Error() == ""`。\n\n#### 判据\n写一个 `func mustInt(s string) (int, error)`，然后：\n```go\nv, err := mustInt("abc")\nfmt.Println(errors.Is(err, strconv.ErrSyntax)) // 应为 true\n```\n如果为 false，说明你包装时用了 `%v`。\n\n::q `fmt.Errorf("load: %v", err)` 和 `%w` 在实际排障中造成什么差别？\n::a 用 `%v` 只保留文本，错误链被切断，上层 `errors.Is(err, sql.ErrNoRows)` 永远返回 false，于是「记录不存在」会被当成「数据库故障」返回 500。用 `%w` 保留链，上层能正确分流出 404 和 500。差别不在日志文本，在**控制流**。\n::q `errors.Is` 和 `errors.As` 各自解决什么问题？\n::a `errors.Is(err, target)` 判断链上是否存在**等于** `target` 的错误（用于哨兵值）。`errors.As(err, &target)` 判断链上是否存在**类型匹配**的错误，并把它赋值给 `target`（用于自定义错误类型，需要取出字段时）。前者比身份，后者比类型。\n::q 为什么 `err.Error()` 返回的字符串不适合做程序判断依据？\n::a 字符串是给人看的，随时会因为改文案、加包装前缀而变；而且不同包可能返回相同文案的不同错误。判断必须基于错误身份（`Is`）或类型（`As`）。用字符串比较的代码在本地能过，重构一次就悄悄失效。\n\n<!--day 7 | core-->\n#### 接口是「调用方需要什么」，不是「实现方有什么」\nGo 的接口是**隐式实现**的：不需要 `implements` 声明，只要方法集齐全就自动满足。更重要的是设计原则——**接口应该定义在使用方所在的包**，由使用方声明「我需要什么能力」，而不是实现方导出「我能做什么」。\n\n```go\n// internal/ledger/service.go —— 使用方声明需求\ntype Store interface {\n    Insert(ctx context.Context, e Entry) (int64, error)\n    ListByMonth(ctx context.Context, month string) ([]Entry, error)\n}\n\ntype Service struct { store Store }   // 只依赖接口\n```\n`internal/store` 包里的 `*SQLiteStore` 完全不知道 `ledger.Store` 的存在，但它实现了它。**换实现只改 main 里的一行装配，Service 不动。**\n\n#### 为什么这一步决定后面能不能测试\n```go\ntype fakeStore struct{ entries []Entry }\nfunc (f *fakeStore) Insert(ctx context.Context, e Entry) (int64, error) { ... }\nfunc (f *fakeStore) ListByMonth(ctx context.Context, m string) ([]Entry, error) { ... }\n```\nService 的测试不需要数据库、不需要锁文件、毫秒级跑完。如果 Service 直接依赖 `*sql.DB`，这段测试就写不出来——这是「接口解耦」最实际的价值，不是教材话术。\n\n#### 接口要小\n```go\n// ❌ 一个包罗万象的接口，任何 mock 都要实现 12 个方法\ntype Repository interface { Create; Get; List; Update; Delete; Count; Sum; Export; ... }\n\n// ✅ 按使用场景拆\ntype Reader interface { Get(ctx, id) (*Entry, error) }\ntype Writer interface { Create(ctx, e) (int64, error) }\n```\n**接口越大，mock 越痛，复用越差。** 一个方法一个接口在 Go 里是正常做法（`io.Reader`、`io.Writer` 都只有一个方法）。\n\n#### nil 接口陷阱：这个坑必踩一次\n```go\ntype MyErr struct{}\nfunc (e *MyErr) Error() string { return "boom" }\n\nfunc bad() error {\n    var p *MyErr = nil\n    return p          // 返回的 error 非 nil！\n}\n\nfmt.Println(bad() == nil)  // false\n```\n原因：接口值由「类型 + 值」两部分组成。`p` 是 `*MyErr` 类型的 nil 指针，装进接口后**类型部分非空**，所以接口本身不等于 nil。判断 `err != nil` 成立，但调用 `err.Error()` 可能 panic。\n\n规避：函数内不要声明具体类型的 nil 变量再当 error 返回，直接 `return nil`，或 `return (*MyErr)(nil)` 之前想清楚调用方怎么判。\n\n#### 判据\n```go\nvar _ Store = (*SQLiteStore)(nil)  // 编译期断言：不满足就编译失败\n```\n在 store 包里写这一行，能提前发现「方法签名写错了」，而不是等到 main 装配时报错。\n\n::q 为什么接口要定义在调用方（使用方）包里，而不是实现方包里？\n::a 因为接口描述的是「使用方需要什么」，只有使用方知道自己要哪些方法。定义在实现方包里，等于让使用方被迫接受实现方给出的方法集合，接口容易变胖，且使用方为了测试还得依赖实现方包。定义在使用方包里，依赖方向就是使用方 → 自己的接口，实现方反向「恰好」满足，避免了包循环依赖。\n::q `var p *MyErr = nil; var err error = p; err == nil` 的结果？为什么？\n::a 结果是 false。接口值包含动态类型和动态值两部分，`p` 虽然值为 nil，但类型是 `*MyErr`，赋给接口后类型部分非空，所以接口整体不等于 nil。这是 Go 里最经典的陷阱之一，用 `err != nil` 判断会误判为「有错误」。\n::q 一个接口有 8 个方法，会带来什么具体成本？\n::a 每个 mock、每个测试替身都要实现全部 8 个方法，哪怕只用到 1 个；任何实现方要新增能力都得改接口，所有实现全部编译失败；接口变得难以复用，最后往往演变成「什么都能干但谁都不满意」的大接口。所以按使用场景拆成若干小接口。\n\n<!--day 8 | normal-->\n#### defer 的三条规则\n```go\nfunc f() {\n    defer fmt.Println("1")\n    defer fmt.Println("2")\n    fmt.Println("body")\n}\n// 输出：body 2 1 —— 后进先出\n```\n1. **后进先出（LIFO）**：多个 defer 按逆序执行。所以「先开的资源后关」自然成立。\n2. **参数在 defer 语句处求值**，不是执行处：\n```go\ni := 0\ndefer fmt.Println(i)  // 捕获 0\ni = 9                 // 不影响上面\n```\n3. **能改返回值（命名返回值时）**：\n```go\nfunc f() (n int) {\n    defer func() { n++ }()\n    return 5      // 实际返回 6\n}\n```\n非命名返回值时改不到，因为 return 已经把值复制走了。\n\n#### 循环里 defer 是陷阱\n```go\nfor _, p := range paths {\n    f, _ := os.Open(p)\n    defer f.Close()      // ❌ 全部堆到函数结束才关\n}\n```\n文件句柄会累积到函数返回，循环一万次就是「too many open files」。正确做法是包一层函数，让 defer 的粒度等于一次迭代：\n```go\nfor _, p := range paths {\n    func() {\n        f, err := os.Open(p)\n        if err != nil { return }\n        defer f.Close()\n        // 处理 f\n    }()\n}\n```\n\n#### panic / recover：只在「程序不该继续」时用\n- `panic` 用于不可恢复的编程错误（数组越界、断言失败、初始化缺配置）。\n- `recover` 只能在 `defer` 里生效，且只能捕获**同一个 goroutine** 的 panic。\n- **HTTP 服务的 panic 必须被中间件兜住**（阶段三 D14 会写），否则单个请求打崩整个进程。\n- 业务错误用 `error` 返回，不要用 panic 做控制流——那等于把显式错误变成隐式跳转。\n\n```go\ndefer func() {\n    if r := recover(); r != nil {\n        log.Printf("panic: %v\\n%s", r, debug.Stack())\n    }\n}()\n```\n\n#### 第一周复盘：三个自检问题\n1. 能不能不看资料写出「切片扩容前后，append 是否影响原数组」的判断？\n2. 能不能说出「为什么 `%w` 影响的是控制流而不只是日志」？\n3. 能不能解释「指针接收者决定了 `T` 还是 `*T` 满足接口」？\n\n三个都答得出，第一周就算过；有一个含糊，回对应那天重读，别往下赶。\n\n::q `defer fmt.Println(i)` 之后的 `i = 9` 会影响输出吗？为什么？\n::a 不会。defer 的参数在**语句执行时**就求值并保存，`fmt.Println(i)` 的参数此刻是 0，之后 i 变成 9 与已保存的副本无关。要打印最终值，得用闭包 `defer func(){ fmt.Println(i) }()`，闭包捕获的是变量本身。\n::q 循环里 defer 关闭文件为什么会耗尽句柄？\n::a defer 注册在**函数**返回时执行，不是「迭代」结束时。循环一千次就注册一千个 Close，全部堆到函数返回才执行，期间句柄一直占用。解决方法是把循环体包成匿名函数，让 defer 的生效范围收缩到单次迭代。\n::q 为什么 HTTP handler 里的 panic 必须有中间件兜底？\n::a 因为 panic 会终止整个 goroutine 并沿调用栈向上传播，如果没有 recover，`net/http` 的默认行为是打印堆栈并**关闭这条连接**，但在自己起的 goroutine（比如异步任务）里 panic 会直接让进程退出。统一在中间件里 recover，才能保证单个请求的异常不影响其他用户。\n\n<!--day 9 | normal-->\n#### 先从「表」想起，不要先想 ORM\n账本只需要两张表起步：`entries`（账目）和后面的 `users`。今天手写 SQL，目的是让你在后面用 GORM 时知道它替你做了什么。\n\n```sql\nCREATE TABLE entries (\n    id       INTEGER PRIMARY KEY AUTOINCREMENT,\n    amount   INTEGER NOT NULL,              -- 单位：分\n    category TEXT    NOT NULL,\n    date     TEXT    NOT NULL,              -- \'YYYY-MM-DD\'\n    note     TEXT    NOT NULL DEFAULT \'\'\n);\n\nCREATE INDEX idx_entries_date ON entries(date);\n```\n\n#### 三个必须现在就想清楚的决定\n1. **金额存 `INTEGER`（分）**，不用 `REAL`。SQLite 的 `REAL` 是浮点，`0.1+0.2` 的问题会原样搬进数据库。\n2. **日期存 `TEXT`（ISO 8601）**。SQLite 没有原生日期类型，`\'YYYY-MM-DD\'` 的字典序等于时间序，`LIKE \'2026-10%\'` 和 `BETWEEN` 都能用，还不受时区影响。\n3. **`NOT NULL` + 默认值**。SQLite 对类型的约束很宽松（`TEXT` 列能存数字），所以约束要写足，把错误挡在写入前。\n\n#### 单表增查的四种基本形态\n```sql\nINSERT INTO entries (amount, category, date, note)\nVALUES (3550, \'餐饮\', \'2026-10-19\', \'午饭\');\n\nSELECT id, amount, category, date, note\nFROM entries\nWHERE date LIKE \'2026-10%\'\nORDER BY date DESC, id DESC\nLIMIT 20 OFFSET 0;\n\nSELECT category, SUM(amount) AS total\nFROM entries\nWHERE date LIKE \'2026-10%\'\nGROUP BY category\nORDER BY total DESC;\n\nSELECT COALESCE(SUM(amount), 0) FROM entries WHERE date LIKE \'2026-10%\';\n```\n`COALESCE` 那行是为了让「本月没有记录」返回 `0` 而不是 `NULL`——`SUM` 对空集返回 NULL，直接 Scan 进 `int64` 会报错。**这个坑在阶段五写统计接口时会真实出现。**\n\n#### 判据\n用 `sqlite3 ledger.db` 交互式执行上面的建表和插入，然后：\n```sql\nSELECT COUNT(*) FROM entries;                        -- 2\nSELECT SUM(amount) FROM entries WHERE date LIKE \'2026-10%\';  -- 正确\nSELECT category, SUM(amount) FROM entries GROUP BY category;\n```\n三条都能出正确结果，说明你对 `WHERE`/`GROUP BY`/聚合函数的分工清楚了。\n\n::q 为什么金额字段不用 `REAL`？\n::a `REAL` 是二进制浮点，无法精确表示 0.1、0.2 这类十进制小数，累加会产生误差（`0.1+0.2=0.30000000000000004`）。账本要求分毫不差，所以用 `INTEGER` 存「分」，所有计算在整数域完成，展示时再除以 100。\n::q `WHERE date LIKE \'2026-10%\'` 为什么能按月筛选？换成 `MONTH(date)=10` 有什么问题？\n::a 因为日期存的是 `\'YYYY-MM-DD\'` 定长文本，月份部分位置固定，前缀匹配即可。用 `MONTH(date)` 这类函数会让**索引失效**（对列做函数运算无法用上索引），且 SQLite 的日期函数对格式敏感、还涉及时区，性能与正确性都更差。\n::q `SUM(amount)` 在没有匹配行时返回什么？为什么这会引发 bug？\n::a 返回 `NULL`，不是 0。直接把 `NULL` Scan 进 `int64` 会报 `converting NULL to int64 is unsupported`。修复方式是 `COALESCE(SUM(amount), 0)`，或者在 Go 里用 `sql.NullInt64` 接收再判断。\n\n<!--day 10 | core-->\n#### `database/sql` 是抽象层，驱动才是实现\n```go\nimport (\n    "database/sql"\n    _ "modernc.org/sqlite"   // 空白导入：只为触发驱动的 init() 注册\n)\n\ndb, err := sql.Open("sqlite", "file:ledger.db?_pragma=busy_timeout(5000)")\n```\n两点必须理解：\n- **`sql.Open` 不会真的连数据库**，它只校验参数、准备连接池。真正建立连接发生在第一次执行语句时。所以 `Open` 成功不代表数据库可用。\n- **空白导入**是为了执行驱动包的 `init()`，它内部调用 `sql.Register("sqlite", ...)`。没有它，运行时报 `unknown driver "sqlite"`。\n\n`modernc.org/sqlite` 是纯 Go 实现，不依赖 CGO，交叉编译无坑。代价是比 CGO 版略慢，家庭账本完全够用。\n\n#### 第一个必做的验证：Ping\n```go\nif err := db.PingContext(ctx); err != nil {\n    return fmt.Errorf("ping db: %w", err)\n}\n```\n没有这一步，配置写错（路径不可写、目录不存在）会在第一个真实请求时才爆，而且报错位置离原因很远。\n\n#### 连接池参数，SQLite 必须显式设\n```go\ndb.SetMaxOpenConns(1)          // SQLite 单写者，先设 1 最安全\ndb.SetMaxIdleConns(1)\ndb.SetConnMaxLifetime(0)       // 不主动过期，SQLite 是本地文件\n```\n`SetMaxOpenConns(1)` 的含义是「同时只允许一个连接」：所有查询串行化，彻底避免 `database is locked`。代价是并发度低——家庭账本一天几百次请求，完全无所谓。**先正确，再谈性能。**\n\n如果你后面启用了 `PRAGMA journal_mode=WAL`，可以拆成写池（1 连接）和读池（多连接），这是阶段五 D4 的内容。\n\n#### 建表语句放哪\n```go\nconst schema = `\nCREATE TABLE IF NOT EXISTS entries (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    amount INTEGER NOT NULL,\n    category TEXT NOT NULL,\n    date TEXT NOT NULL,\n    note TEXT NOT NULL DEFAULT \'\'\n);`\n\nif _, err := db.ExecContext(ctx, schema); err != nil {\n    return fmt.Errorf("create schema: %w", err)\n}\n```\n今天先用这段「启动即建表」，阶段五会换成 `goose` 迁移。**但你要知道它的问题**：没有版本记录、不能回滚、改动表结构时老数据怎么办全靠人脑记。用它只是为了让今天能跑起来。\n\n#### 判据\n```go\ndb, _ := sql.Open("sqlite", "file:ledger.db")\ndb.SetMaxOpenConns(1)\nif err := db.PingContext(context.Background()); err != nil { log.Fatal(err) }\n```\n跑完 `ls -l ledger.db` 能看到文件；杀掉进程再跑一次，表还在（`CREATE TABLE IF NOT EXISTS` 不会报错）。\n\n::q `sql.Open` 返回 nil error，是否说明数据库一定可用？\n::a 不一定。`Open` 只做参数校验和连接池初始化，**不建立真实连接**。路径不可写、目录不存在、驱动参数错误都要等到第一次 `Ping` 或执行语句时才暴露。所以 `Open` 之后必须 `PingContext` 验证。\n::q 为什么 `import _ "modernc.org/sqlite"` 要用下划线？\n::a 下划线表示「只执行包的 init()，不使用它的导出名」。驱动的 init 里会调用 `sql.Register` 把驱动注册到 `database/sql` 的全局表里，`sql.Open("sqlite", ...)` 正是靠这张表找到实现。如果去掉下划线又不使用包内符号，编译会报「imported and not used」。\n::q `SetMaxOpenConns(1)` 对 SQLite 解决了什么问题？代价是什么？\n::a 解决多连接同时写导致的 `database is locked`（SQLite 同一时刻只允许一个写事务）。代价是查询完全串行，吞吐受限于单连接；对家庭账本这种低并发场景可接受，但要知道这是「用并发换确定性」。\n\n<!--day 11 | core-->\n#### 四个方法，各自对应什么 SQL 形态\n| 方法 | 用于 | 返回 |\n| :--- | :--- | :--- |\n| `ExecContext` | INSERT / UPDATE / DELETE / DDL | `sql.Result`（可拿 `LastInsertId`、`RowsAffected`） |\n| `QueryRowContext` | 确定最多一行的 SELECT | `*sql.Row`，`.Scan()` 时若无行返回 `sql.ErrNoRows` |\n| `QueryContext` | 多行 SELECT | `*sql.Rows`，**必须 Close** |\n| `PrepareContext` | 同一语句反复执行 | `*sql.Stmt`，**必须 Close** |\n\n#### 写入：拿回自增 ID 与影响行数\n```go\nres, err := db.ExecContext(ctx,\n    `INSERT INTO entries (amount, category, date, note) VALUES (?, ?, ?, ?)`,\n    e.Amount, e.Category, e.Date, e.Note)\nif err != nil {\n    return 0, fmt.Errorf("insert entry: %w", err)\n}\nid, err := res.LastInsertId()\nif err != nil {\n    return 0, fmt.Errorf("last insert id: %w", err)\n}\nreturn id, nil\n```\n`LastInsertId` 只对自增主键有意义；`RowsAffected` 用来判断 UPDATE/DELETE 是否真的改到了行——**更新了 0 行通常意味着 ID 不存在或不属于当前用户**，这个信号在阶段四做数据隔离时非常重要。\n\n#### 查询单行：`ErrNoRows` 不是故障\n```go\nvar e Entry\nerr := db.QueryRowContext(ctx, `SELECT id, amount, category, date, note FROM entries WHERE id = ?`, id).\n    Scan(&e.ID, &e.Amount, &e.Category, &e.Date, &e.Note)\nif errors.Is(err, sql.ErrNoRows) {\n    return nil, ErrNotFound   // 转成业务语义\n}\nif err != nil {\n    return nil, fmt.Errorf("get entry %d: %w", id, err)\n}\n```\n注意顺序：**先判 `ErrNoRows`，再判其他错误**。反过来写会把「不存在」也包成 500。\n\n#### 查询多行：`Close` 和 `rows.Err()` 都不能漏\n```go\nrows, err := db.QueryContext(ctx, `SELECT id, amount FROM entries WHERE date LIKE ? ORDER BY date DESC`, month+"%")\nif err != nil { return nil, err }\ndefer rows.Close()          // 必须\n\nvar out []Entry\nfor rows.Next() {\n    var e Entry\n    if err := rows.Scan(&e.ID, &e.Amount); err != nil {\n        return nil, fmt.Errorf("scan: %w", err)\n    }\n    out = append(out, e)\n}\nif err := rows.Err(); err != nil {   // 遍历中途的错误在这里\n    return nil, fmt.Errorf("iterate: %w", err)\n}\n```\n`rows.Err()` 为什么必须检查：`Next()` 返回 false 有两种原因——正常结束，或**中途出错**（连接断开、上下文取消）。只看 `Next()` 会把「查询失败」当成「查到 0 行」，这是最隐蔽的一类 bug：报表少了数据，但日志一片正常。\n\n#### Scan 的类型映射\n- `INTEGER` → `int64`（不要用 `int`，跨平台宽度不一）\n- `TEXT` → `string`\n- 可空列 → `sql.NullString` / `sql.NullInt64`，或建表时就 `NOT NULL DEFAULT \'\'`\n- `Scan` 的目标必须是指针，数量与列数严格一致，否则报 `expected N destination arguments`\n\n#### 判据\n```go\nid, _ := insert(...)\ne, err := get(id)      // 拿到刚插入的\n_, err = get(999999)   // errors.Is(err, ErrNotFound) == true\n```\n两条都成立，且 `get` 的实现里 `ErrNoRows` 先判。\n\n::q `rows.Next()` 返回 false，一定是「没有更多数据」吗？\n::a 不一定。也可能是遍历中途出错（网络断开、context 被取消、驱动内部错误）。必须再检查 `rows.Err()` 才能区分。只看 `Next()` 会把失败当成空结果，导致统计数字偏小却不报错。\n::q 为什么 `QueryRowContext` 的错误要在 `Scan` 之后判断？\n::a 因为 `QueryRowContext` 本身几乎不返回错误，它把执行延迟到 `Scan`。`Scan` 会返回三类错误：没有行（`sql.ErrNoRows`）、列数不匹配、类型转换失败。所以 `if err := row.Scan(...); err != nil` 是唯一正确的判断点。\n::q `UPDATE` 成功返回但 `RowsAffected() == 0`，说明什么？\n::a 说明没有行被改动。可能是 ID 不存在、可能值本来就没变（某些数据库会算作 0 行），也可能是 `WHERE user_id = ?` 不匹配——**最后一种在阶段四就是数据越权的信号**。业务上应把「更新 0 行」当条件不满足处理，而不是当成功。\n\n<!--day 12 | core-->\n#### 预编译语句：省的是解析，不是拼字符串\n```go\nstmt, err := db.PrepareContext(ctx, `INSERT INTO entries (amount, category, date) VALUES (?, ?, ?)`)\nif err != nil { return err }\ndefer stmt.Close()\n\nfor _, e := range batch {\n    if _, err := stmt.ExecContext(ctx, e.Amount, e.Category, e.Date); err != nil {\n        return fmt.Errorf("insert %s: %w", e.Category, err)\n    }\n}\n```\n服务端会缓存这条语句的执行计划，循环里只传参数。**批量导入（CSV 迁移历史账目）时收益明显。**\n\n但注意：`Prepare` 也需要 `Close`，否则语句句柄泄漏。而且在 `SetMaxOpenConns(1)` 下，长时间持有 `Stmt` 会占住连接。\n\n#### 参数占位符为什么必须用 `?`\n```go\n// ❌ 字符串拼接：SQL 注入 + 类型问题\nq := fmt.Sprintf("SELECT * FROM entries WHERE category = \'%s\'", cat)\n\n// ✅ 占位符：参数与语句分离，驱动负责转义\ndb.QueryContext(ctx, "SELECT * FROM entries WHERE category = ?", cat)\n```\n拼接的问题不只是注入。类别名里带单引号（`O\'Brien`）会直接语法错误；日期格式差异会导致隐式转换。**占位符是唯一正确写法，没有例外。**\n\n#### 事务：`Begin` / `Commit` / `Rollback` 的三段式\n```go\ntx, err := db.BeginTx(ctx, nil)\nif err != nil { return fmt.Errorf("begin: %w", err) }\ndefer tx.Rollback()   // 已提交后再 Rollback 返回 ErrTxDone，可安全忽略\n\nfor _, e := range entries {\n    if _, err := tx.ExecContext(ctx, `INSERT ...`, e.Amount, e.Category, e.Date); err != nil {\n        return fmt.Errorf("insert: %w", err)   // defer 会回滚\n    }\n}\nif err := tx.Commit(); err != nil {\n    return fmt.Errorf("commit: %w", err)\n}\nreturn nil\n```\n`defer tx.Rollback()` 是标准写法：**成功提交后这次 Rollback 是无害的空操作**，失败路径则自动回滚。少了它，任何提前 return 都会留下悬挂事务，占着锁直到连接关闭。\n\n#### 为什么批量插入必须用事务\n不用事务时，每条 INSERT 都是一次独立提交：SQLite 每次都要 fsync 日志文件。插入 1000 条 = 1000 次磁盘同步，可能要几十秒。放进一个事务，只在 Commit 时同步一次，通常能快 10–100 倍。\n\n这不是「优化技巧」，是**写入语义**问题：中途失败时，事务保证要么全进要么全不进；非事务下你会留下半份数据。\n\n#### `BeginTx` 的第二个参数\n```go\ntx, err := db.BeginTx(ctx, &sql.TxOptions{Isolation: sql.LevelSerializable})\n```\nSQLite 实际上以「串行化」为默认，`Isolation` 通常不用改。但 `ctx` 必须传：请求被取消或超时时，事务要跟着回滚，否则会一直占着写锁。\n\n#### 判据\n```go\nerr := insertBatch(ctx, []Entry{{...}, {Amount: -1}})  // 故意让第二条失败\n```\n预期：表里**一条都没有**。如果第一条进去了，说明你没用事务或没 `defer Rollback`。\n\n::q `defer tx.Rollback()` 在 `Commit()` 成功之后执行，会不会把已提交的数据撤销？\n::a 不会。提交后事务已结束，`Rollback` 返回 `sql.ErrTxDone`，是一个无害的空操作。所以标准写法就是「begin 之后立刻 defer rollback，成功路径显式 commit」，不需要在 defer 里判断状态。\n::q 为什么批量插入 1000 条，用事务比不用快一个数量级？\n::a 不用事务时每条 INSERT 都是独立事务，SQLite 每次提交都要把日志 fsync 到磁盘，1000 次同步是主要开销。放进一个事务后只在 Commit 时同步一次，磁盘 I/O 从 1000 次降到 1 次。这同时也是原子性保证的来源。\n::q 用 `fmt.Sprintf` 拼 SQL 有哪些具体风险（除注入外）？\n::a 三类：一是值里含引号（`O\'Brien`）导致语法错误；二是类型/格式问题，比如时间字符串格式不一致被隐式转换；三是无法复用执行计划，每次都是新语句，性能更差。占位符把「语句」和「数据」彻底分离，这三类问题一次性消除。\n\n<!--day 13 | normal-->\n#### 连接是稀缺资源，生命周期要显式管理\n`*sql.DB` **不是连接，是连接池**。它持有 0 到 N 条真实连接，按需创建、空闲复用、超时回收。所以要管理的是三件事：同时开多少、空闲留多少、一条连接活多久。\n\n```go\ndb.SetMaxOpenConns(1)     // 同时最多 1 条\ndb.SetMaxIdleConns(1)     // 空闲池保留 1 条\ndb.SetConnMaxLifetime(0)  // 永不过期（本地文件场景）\ndb.SetConnMaxIdleTime(0)\n```\n不设 `MaxOpenConns` 的默认值是**无限**，高并发下会把数据库连接打满（Postgres 上很致命）；SQLite 上则是频繁 `database is locked`。\n\n#### 关闭：`defer db.Close()` 放在 main 里\n```go\nfunc main() {\n    db, err := openDB(cfg.DBPath)\n    if err != nil { log.Fatal(err) }\n    defer db.Close()   // 进程退出前释放所有连接\n    ...\n}\n```\n`db.Close()` 会等待所有在用连接归还。所以顺序很重要：**先停 HTTP 服务，再关 DB**（阶段六 D8 会写优雅关闭，那时这个顺序就是正确性问题）。\n\n#### 一条查询从进入到归还，经过了什么\n1. 业务代码调 `QueryContext`。\n2. 池子有空闲连接 → 直接复用；没有且未达上限 → 新建；已达上限 → **阻塞等待**（或 ctx 超时）。\n3. 执行 SQL，`rows` 持有这条连接。\n4. `rows.Close()` 或遍历结束 → 连接归还池子。\n5. 连接空闲超过 `MaxIdleConns` → 被真正关闭。\n\n**第 4 步是关键：`rows` 不 Close，连接永远不归还。** 在 `MaxOpenConns(1)` 下，一次泄漏就会让整个服务卡死在下一次查询上——这是「服务突然无响应但 CPU 为 0」的典型原因。\n\n#### 判据\n```go\n// 故意漏掉 rows.Close()，然后连续查两次\nfor i := 0; i < 3; i++ {\n    rows, _ := db.QueryContext(ctx, "SELECT 1")\n    _ = rows            // 不 Close\n}\n```\n在 `MaxOpenConns(1)` 下，第三条会**永久阻塞**。这个实验做一遍，比读十遍文档有用。\n\n::q `db.SetMaxOpenConns(1)` 之后，如果某个函数忘了 `rows.Close()`，会发生什么？\n::a 那条连接被 `rows` 一直占着，池子里唯一可用的连接被耗尽。之后任何查询都会阻塞在「等待可用连接」上，直到 ctx 超时或进程退出。表现为服务整体无响应、CPU 却接近 0——排查时很容易误判成死锁。\n::q `*sql.DB` 需要每次请求都 `Close` 吗？\n::a 不需要，也不应该。`*sql.DB` 是长生命周期的连接池，全进程一个实例，只在程序退出时 `Close` 一次。每次请求要关的是 `*sql.Rows` 和 `*sql.Stmt`，它们才持有具体连接。\n::q 为什么「先停 HTTP 服务，再 db.Close()」的顺序不能反？\n::a 反过来的话，正在处理的请求会拿到一个已关闭的池，查询直接报 `sql: database is closed`，用户看到 500。正确顺序是先 `srv.Shutdown` 停止接受新请求并等待在途请求完成，确认没有请求再用 `db.Close()` 释放连接。\n\n<!--day 14 | normal-->\n#### 把前 13 天拼成一个能用的东西\n目标只有一个：`add` 写进去，`list` 读出来，**关掉终端数据还在**。不做花活。\n\n```go\nfunc main() {\n    db, err := openDB("ledger.db")\n    if err != nil { log.Fatalf("open db: %v", err) }\n    defer db.Close()\n\n    if len(os.Args) < 2 {\n        fmt.Fprintln(os.Stderr, "用法: ledger <add|list> [参数]")\n        os.Exit(2)\n    }\n\n    switch os.Args[1] {\n    case "add":\n        if err := runAdd(db, os.Args[2:]); err != nil {\n            log.Fatalf("add: %v", err)\n        }\n    case "list":\n        if err := runList(db); err != nil {\n            log.Fatalf("list: %v", err)\n        }\n    default:\n        fmt.Fprintf(os.Stderr, "未知命令: %s\\n", os.Args[1])\n        os.Exit(2)\n    }\n}\n```\n结构上就三块：**装配（main）→ 解析参数（flag）→ 执行（runXxx）**。`os.Exit` 只在 main 里出现，`runXxx` 只返回 error，这样后面要改成 HTTP 服务时，`runXxx` 可以原样变成 handler 的业务函数。\n\n#### `flag` 解析：注意它和位置参数混用\n```go\nfunc runAdd(db *sql.DB, args []string) error {\n    fs := flag.NewFlagSet("add", flag.ContinueOnError)\n    amount := fs.Int64("amount", 0, "金额（分）")\n    category := fs.String("category", "", "分类")\n    date := fs.String("date", time.Now().Format("2006-01-02"), "日期 YYYY-MM-DD")\n    note := fs.String("note", "", "备注")\n    if err := fs.Parse(args); err != nil { return err }\n\n    if *amount <= 0 { return fmt.Errorf("amount 必须为正数（单位分）") }\n    if *category == "" { return fmt.Errorf("category 不能为空") }\n\n    _, err := db.ExecContext(context.Background(),\n        `INSERT INTO entries (amount, category, date, note) VALUES (?, ?, ?, ?)`,\n        *amount, *category, *date, *note)\n    return err\n}\n```\n参数校验在**写库之前**完成，错误信息指出是哪个字段——这条习惯会一路延续到 HTTP 层（阶段三 D15 的输入校验）。\n\n#### 用 `text/tabwriter` 对齐输出\n```go\nw := tabwriter.NewWriter(os.Stdout, 0, 0, 2, \' \', 0)\nfmt.Fprintln(w, "ID\\t金额\\t分类\\t日期\\t备注")\nfor _, e := range entries {\n    fmt.Fprintf(w, "%d\\t%.2f\\t%s\\t%s\\t%s\\n", e.ID, float64(e.Amount)/100, e.Category, e.Date, e.Note)\n}\nw.Flush()\n```\n`float64(e.Amount)/100` 只在**展示层**出现，存储和计算全程是 int64 分。这条分界线要守住。\n\n#### 判据\n```bash\n./ledger add -amount 3550 -category 餐饮 -date 2026-10-19 -note 午饭\n./ledger add -amount 1200 -category 交通 -date 2026-10-19\n./ledger list\n```\n`list` 两行都在，金额显示 `35.50` 和 `12.00`。\n\n::q 为什么 `float64(e.Amount)/100` 只允许出现在展示层？\n::a 因为浮点除法会引入精度误差（比如 3550/100 在二进制下可能不精确）。存储、累加、比较必须全程用整数分，只在最后给人看的一步转成小数。如果中途转 float 再转回来，误差会累积，对账时出现「差一分」。\n::q `runAdd` 里为什么用 `flag.NewFlagSet` 而不是全局 `flag`？\n::a 全局 `flag` 会注册到 `flag.CommandLine`，多个子命令的参数名会冲突（`add` 和 `sum` 都想用 `-month`）。用独立的 `FlagSet` 让每个子命令有自己的参数空间，也便于测试时反复解析。\n::q 把 `os.Exit` 限制在 main 里，对后续改造有什么好处？\n::a `os.Exit` 会跳过所有 defer（连接不关、文件不刷），也无法被测单元测试覆盖。让 `runXxx` 只返回 error，main 统一决定退出码，这样这些函数能直接被测试调用，将来改造成 HTTP handler 时业务逻辑可以原样搬过去。\n\n<!--day 15 | light-->\n#### `sum`：第一次做聚合\n```go\nfunc runSum(db *sql.DB, args []string) error {\n    fs := flag.NewFlagSet("sum", flag.ContinueOnError)\n    month := fs.String("month", time.Now().Format("2006-01"), "月份 YYYY-MM")\n    if err := fs.Parse(args); err != nil { return err }\n\n    var total int64\n    err := db.QueryRowContext(context.Background(),\n        `SELECT COALESCE(SUM(amount), 0) FROM entries WHERE date LIKE ?`, *month+"%").\n        Scan(&total)\n    if err != nil { return fmt.Errorf("sum: %w", err) }\n    fmt.Printf("%s 合计 %.2f 元\\n", *month, float64(total)/100)\n    return nil\n}\n```\n`COALESCE` 保证空月份返回 0 而不是 NULL——现在把它写成条件反射。\n\n#### 阶段验收：逐条跑，别凭感觉\n```bash\n./ledger add -amount 3550 -category 餐饮 -date 2026-10-19 -note 午饭\n./ledger add -amount 1200 -category 交通 -date 2026-10-19\n# 关掉终端，重新打开\n./ledger list                 # 两笔都在\n./ledger sum -month 2026-10  # 4750 分 → 47.50 元\n```\n只要有一条不成立，就回到对应那天：`list` 没有 → D11 的 `rows.Err`；`sum` 报错 → D9 的 `COALESCE`；重启丢数据 → D10 的连接参数写成了 `:memory:`。\n\n#### 复盘：这 15 天你到底拿到了什么\n不是「会写 Go」，而是四件具体的事：\n1. 知道 `append` 何时共享、何时新分配（D3）。\n2. 知道错误包装为什么影响控制流（D6）。\n3. 知道接口定义在使用方、指针接收者决定方法集（D5/D7）。\n4. 知道 `rows` 不 Close 会占死连接（D11/D13）。\n\n这四条在后面每一个阶段都会被重新用到。**说不出来就是没拿到**，别用「我大概知道」糊过去。\n\n::q 为什么 `sum` 要用 `COALESCE(SUM(amount), 0)`？\n::a 因为 `SUM` 在没有匹配行时返回 `NULL`，Scan 到 `int64` 会报类型转换错误。`COALESCE` 把 NULL 换成 0，让「本月没记账」这个正常场景返回 0 而不是报错。\n::q 如果 `list` 重启后是空的，但文件存在且非空，最可能的原因是什么？\n::a 最可能是 `sql.Open` 的 DSN 写成了 `:memory:` 或 `file::memory:?cache=shared`，每次启动都是新的内存库；也可能是写入用了不同的工作目录（相对路径 `ledger.db` 在不同目录下指向不同文件）。排查方式是 `ls -l` 看文件修改时间、`SELECT COUNT(*)` 直接查库。\n::q 阶段一到此为止，最该留下来反复看的是哪一天？\n::a D13（连接生命周期）和 D6（错误包装）。前者是后面所有「服务无响应」类故障的根因模型，后者决定你在阶段三能不能正确区分 404 和 500。语法细节可以查，这两块是判断力。\n',cf=`<!--day 1 | normal-->
#### goroutine 便宜，但不是免费
\`\`\`go
go func() {
    fmt.Println("异步")
}()
fmt.Println("主线程")
\`\`\`
输出顺序不确定：主 goroutine 可能先打印再退出，子 goroutine 还没跑就被杀掉。**\`main\` 返回 = 进程结束，所有 goroutine 一起死**，没有「等待未完成任务」这回事。这是新手第一次写并发时最常见的「代码没执行」原因。

每个 goroutine 初始栈只有 2KB 左右，可以轻松开十万个。但「便宜」指的是栈，不是没有成本：调度、内存、锁竞争都是真实开销。

#### 三个必须建立的直觉
1. **启动顺序 ≠ 执行顺序**。\`go f()\` 只是把任务交给调度器，什么时候跑、在哪个核上跑都不确定。
2. **闭包捕获变量，不是捕获值**。
\`\`\`go
for i := 0; i < 3; i++ {
    go func() { fmt.Println(i) }()   // ❌ 可能打印 3 3 3
}
\`\`\`
Go 1.22 起循环变量每轮独立，这个问题在 \`for i :=\` 里已被修复；但如果你写的是 \`for _, v := range\` 并对 \`v\` 取地址，仍要显式传参 \`go func(v int){...}(v)\` 才最稳。

3. **goroutine 里的 panic 会杀死整个进程**，不像 HTTP handler 有 \`net/http\` 兜底。任何自己起的 goroutine 都要自带 \`recover\`，否则一个越界就让服务整体退出。

#### 判据
\`\`\`go
var wg sync.WaitGroup
for i := 0; i < 3; i++ {
    wg.Add(1)
    go func(n int) {
        defer wg.Done()
        fmt.Println(n)
    }(i)
}
wg.Wait()
\`\`\`
三行都打印出来（顺序不定），进程不会提前退出。如果你没写 \`wg.Wait()\`，很可能一行都没有。

::q 为什么 \`main\` 函数里的 \`go func(){...}()\` 经常「没执行」？
::a 因为 \`main\` 返回时进程立即结束，运行时不会等待未完成的 goroutine。子 goroutine 可能还没来得及被调度就被终止。要保证执行完，必须用 \`sync.WaitGroup\`、channel 或 \`context\` 显式同步。
::q 起 100 个 goroutine 每个都 panic，会发生什么？
::a 第一个未 recover 的 panic 就会导致整个进程退出（打印堆栈后 exit 2），其余 99 个随之被杀。所以每个 goroutine 顶部的 \`defer recover()\` 不是可选项，尤其在后台任务里。
::q Go 1.22 对循环变量做了什么改变？
::a 每次迭代都创建新的循环变量实例，闭包捕获的是当轮变量，因此 \`for i := range\` 里的 \`go func(){ use(i) }()\` 不再共享同一个 \`i\`。这修复了历史上有名的「全部打印最后一个值」的问题，但显式传参仍然是更清晰的写法。

<!--day 2 | core-->
#### channel 的本质：带锁的队列 + 阻塞语义
\`\`\`go
ch := make(chan int)        // 无缓冲
ch := make(chan int, 10)    // 有缓冲，容量 10
\`\`\`
- **无缓冲**：发送和接收必须**同时就绪**，任一方单独行动都会阻塞。它是「同步点」，不是「容器」。
- **有缓冲**：缓冲未满可发送、非空可接收，否则阻塞。

这三条规则推出来的后果：
\`\`\`go
ch := make(chan int)
ch <- 1        // 永久阻塞：没有接收者（fatal error: all goroutines are asleep - deadlock!）
\`\`\`
运行时能检测到「所有 goroutine 都卡住」并直接 panic，这比静默挂起好，但报错信息指向的是最后一行，真正的原因可能在上游。

#### 关闭的规则，只有一条要记
**只有发送方 close，接收方永远不 close。** 向已关闭的 channel 发送会 panic，从已关闭的 channel 接收会立刻返回零值且 \`ok == false\`。

\`\`\`go
close(ch)
v, ok := <-ch   // v=0, ok=false
for v := range ch { ... }  // 关闭且排空后自动退出循环
\`\`\`
\`range\` 是消费 channel 的标准写法：它会一直读到 channel 关闭。所以「谁发送谁关闭」的规矩不是风格问题——接收方 close 会让发送方 panic。

#### 用 channel 做「结果收集」
\`\`\`go
func sumAll(ctx context.Context, nums []int) int {
    ch := make(chan int, len(nums))
    var wg sync.WaitGroup

    for _, n := range nums {
        wg.Add(1)
        go func(v int) {
            defer wg.Done()
            ch <- v * v
        }(n)
    }

    go func() { wg.Wait(); close(ch) }()  // 关键：等所有发送方结束再关

    total := 0
    for v := range ch {
        total += v
    }
    return total
}
\`\`\`
三个要点：
1. 缓冲设成 \`len(nums)\`，发送方不会因为没人收而阻塞。
2. **\`close\` 必须等所有发送方完成**，否则 \`ch <- v\` 会 panic 在已关闭的 channel 上。所以用 \`wg.Wait()\` 起一个专门的 goroutine 来关。
3. \`range ch\` 负责收完并退出。

#### 什么时候不该用 channel
Go 的官方建议是：**「通过通信共享内存」只在数据所有权需要转移时用**；如果只是多个 goroutine 读写同一份结构，\`sync.Mutex\` 更简单、更快、更好读。用 channel 实现一个计数器（发一个 1、收一个 1）是典型的反模式。

#### 判据
\`\`\`go
ch := make(chan int, 2)
ch <- 1
ch <- 2
close(ch)
for v := range ch { fmt.Println(v) }  // 1 2，不 panic
\`\`\`
能解释「为什么这里不会 panic，而无缓冲版本会」。

::q \`ch := make(chan int); close(ch); ch <- 1\` 会怎样？
::a panic：\`send on closed channel\`。向已关闭的 channel 发送是运行时错误，不是阻塞。所以关闭权必须唯一地掌握在发送方手里，且关闭后不再发送。
::q 为什么关闭 channel 前要等所有发送方结束？
::a 因为 \`close\` 后任何发送都会 panic。如果用 \`wg.Wait()\` 在独立的 goroutine 里关闭，就保证了「所有发送 goroutine 已 \`Done\`」才执行 close，接收方 \`range\` 也就能安全地读到排空为止。
::q 无缓冲 channel 和有缓冲 channel 在语义上最本质的区别是什么？
::a 无缓冲是**同步点**：发送完成意味着接收方已经拿到值，天然构成一次握手。有缓冲是**队列**：发送只代表值进了缓冲，接收方何时处理完全未知。前者用于同步、后者用于解耦，混用会导致「以为同步了其实没有」的时序 bug。

<!--day 3 | core-->
#### \`select\` 是 channel 的 switch
\`\`\`go
select {
case v := <-ch1:
    fmt.Println("ch1", v)
case ch2 <- 42:
    fmt.Println("写入 ch2")
default:
    fmt.Println("都不就绪")
}
\`\`\`
规则：多个 case 同时就绪时**随机选一个**（防止饥饿）；有 \`default\` 时永不阻塞；没有 \`default\` 且全不就绪时阻塞。

#### 超时：\`time.After\` 是最常用的写法
\`\`\`go
select {
case v := <-ch:
    return v, nil
case <-time.After(2 * time.Second):
    return 0, fmt.Errorf("等待结果超时")
}
\`\`\`
\`time.After\` 返回一个 channel，到点后写入。代价是**在超时到来前它不会被回收**——放在循环里会累积定时器。循环场景用 \`time.NewTimer\` 并显式 \`Stop\`。

#### 取消：\`<-ctx.Done()\`
\`\`\`go
select {
case v := <-ch:
    return v, nil
case <-ctx.Done():
    return 0, ctx.Err()
}
\`\`\`
\`ctx.Done()\` 是一个「取消时关闭」的 channel。这是 Go 里最标准的取消传播方式——**不要自己造一个 \`done chan struct{}\` 到处传**，因为 context 还带截止时间和值，能一路传到数据库驱动。

#### \`for select\` 的经典形态
\`\`\`go
for {
    select {
    case job, ok := <-jobs:
        if !ok { return nil }   // 上游关闭
        if err := handle(job); err != nil { return err }
    case <-ctx.Done():
        return ctx.Err()
    }
}
\`\`\`
注意 \`ok\` 判断：channel 关闭后 \`<-jobs\` 会立刻返回零值，不判断就会陷入「疯狂处理空 job」的死循环，CPU 打满。

#### \`select\` 不能做什么
- 不能保证优先级：想让取消优先于正常任务，必须**先写一个非阻塞的检查**：
\`\`\`go
select {
case <-ctx.Done(): return ctx.Err()
default:
}
select { ... }   // 再做正常分支
\`\`\`
- 不能用于「等待所有」：那需要 \`WaitGroup\`。
- \`nil\` channel 在 select 里**永远不就绪**，可以用来动态禁用某个分支（把 channel 设为 nil 即可）。

#### 判据
\`\`\`go
ch := make(chan int)
ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
defer cancel()
select {
case <-ch:
    fmt.Println("收到")
case <-ctx.Done():
    fmt.Println("超时:", ctx.Err())   // context deadline exceeded
}
\`\`\`
100ms 后必须打印超时，且进程不挂住。

::q \`select\` 里两个 case 同时就绪，会选哪个？
::a 随机选一个。Go 的实现会在就绪的 case 中随机挑选，以避免固定顺序导致某些分支长期饥饿。这意味着**不能依赖 select 的顺序做优先级控制**，需要优先级时必须显式写两段 select。
::q channel 已关闭，\`case job, ok := <-jobs\` 不判断 \`ok\` 会怎样？
::a 会陷入死循环。关闭的 channel 永远「就绪」并返回零值，\`ok\` 为 false 但你忽略了它，于是每轮都拿到一个空 job 立刻处理，CPU 打满却不报错。必须用 \`if !ok { return }\` 退出。
::q \`time.After\` 放在循环里为什么可能泄漏？
::a 每次调用都会创建一个定时器，即使 select 提前走到了别的分支，这个定时器仍要在到期后才被回收。高频循环里会累积大量待回收定时器，造成内存和调度压力。正确做法是用 \`time.NewTimer\` + \`defer timer.Stop()\`，或复用一个 timer 并 \`Reset\`。

<!--day 4 | core-->
#### 竞态不是「偶发 bug」，是有确定成因的 bug
\`\`\`go
var counter int
var wg sync.WaitGroup
for i := 0; i < 1000; i++ {
    wg.Add(1)
    go func() { defer wg.Done(); counter++ }()
}
wg.Wait()
fmt.Println(counter)   // 通常小于 1000
\`\`\`
\`counter++\` 在机器层面是三步：读 → 加 → 写。两个 goroutine 交错执行 \`R R W W\`，其中一次自增被覆盖。**结果每次都不同，取决于调度**。

\`go run -race main.go\` 会明确告诉你哪两行冲突：
\`\`\`
WARNING: DATA RACE
Write at 0x... by goroutine 7:
  main.main.func1()
Previous read at 0x... by goroutine 6:
\`\`\`
**看到 \`DATA RACE\` 才算证据。** 「我觉得这里可能有并发问题」不算。

#### WaitGroup 的三个错误用法
\`\`\`go
// ❌ 1. Add 写在 goroutine 里
go func() { wg.Add(1); defer wg.Done(); ... }()
// 竞争：Wait 可能在 Add 之前就返回

// ❌ 2. 传值而不是传指针
func worker(wg sync.WaitGroup) { ... }  // 复制了计数器，Done 作用在副本上

// ❌ 3. Add 的数量和 Done 的次数不匹配
\`\`\`
正确形态永远是：**在启动 goroutine 之前 \`Add(1)\`，goroutine 内 \`defer Done()\`**。

#### \`-race\` 能查什么、不能查什么
能查：真实发生的数据竞争（读写冲突、无同步的并发访问）。
不能查：**逻辑竞争**（比如「先查余额再扣款」这种业务上的 TOCTOU，两个事务都读到 100，各自扣 80）。这类问题要靠数据库事务或锁解决，\`-race\` 帮不上。

#### 判据
\`\`\`bash
go run -race main.go   # 出现 WARNING: DATA RACE
\`\`\`
把这段输出保存下来，它是你后面「修好了」的对照基线。修完再跑，必须完全无输出。

::q \`counter++\` 为什么会丢更新？
::a 它不是原子操作，编译后是「加载 → 加一 → 存回」三条指令。两个 goroutine 若都先加载了旧值 5，各自加一存回 6，两次自增只生效一次。修复要么加锁，要么用 \`atomic.Int64\`。
::q \`wg.Add(1)\` 放在 goroutine 内部为什么危险？
::a 因为 \`wg.Wait()\` 可能在某个 goroutine 执行 \`Add\` 之前就看到计数为 0 而返回，导致 \`main\` 提前结束、任务没跑完。规范是：\`Add\` 必须在启动 goroutine 的**那一侧、启动之前**调用。
::q \`-race\` 没报错，是否说明并发逻辑一定正确？
::a 不是。\`-race\` 只检测同一个内存地址的读写冲突，检测不到业务逻辑上的时序问题（如「先查后改」的竞态）、死锁、goroutine 泄漏。它只是必要条件，不是充分条件。

<!--day 5 | core-->
#### Mutex：把「读-改-写」变成原子段落
\`\`\`go
type Counter struct {
    mu sync.Mutex
    n  int64
}

func (c *Counter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.n++
}
\`\`\`
\`defer Unlock\` 的意义不是省字，而是**保证 panic 时也会解锁**。手写 \`Unlock\` 在中间 return 或 panic 时会留下死锁。

#### 锁的粒度：太小无效，太大串行
\`\`\`go
// ❌ 锁住整个处理流程，并发退化成串行
mu.Lock()
data := fetchFromDB()   // 慢操作在锁内
process(data)
mu.Unlock()

// ✅ 只锁共享状态的读写
data := fetchFromDB()
mu.Lock()
cache[key] = data
mu.Unlock()
\`\`\`
判据：**锁内不允许出现 I/O、网络调用、channel 阻塞操作**。锁内做的事应该只有「几个字段的读写」。

#### 读写分离用 \`RWMutex\`
\`\`\`go
type Cache struct {
    mu sync.RWMutex
    m  map[string]Entry
}

func (c *Cache) Get(k string) (Entry, bool) {
    c.mu.RLock()
    defer c.mu.RUnlock()
    v, ok := c.m[k]
    return v, ok
}
func (c *Cache) Set(k string, v Entry) {
    c.mu.Lock()
    defer c.mu.Unlock()
    c.m[k] = v
}
\`\`\`
多个读可以并发，写独占。**读多写少才划算**；写频繁时 \`RWMutex\` 比 \`Mutex\` 更慢（维护读者计数有额外开销）。

#### 三个容易踩的坑
1. **复制含 Mutex 的结构体** → 锁失效，\`go vet\` 报 \`copylocks\`。所以这类结构体一律用指针传递。
2. **重入死锁**：Go 的 \`Mutex\` 不可重入，\`Lock\` 里再 \`Lock\` 同一把锁会永久阻塞。需要重入说明设计有问题，拆函数而不是换锁。
3. **锁的顺序**：多个锁必须全局统一获取顺序（如先 A 后 B），否则两个 goroutine 交叉持锁会死锁。

#### 原子操作：单个字段的轻量替代
\`\`\`go
import "sync/atomic"

var hits atomic.Int64
hits.Add(1)
fmt.Println(hits.Load())
\`\`\`
适用于「一个数字的加减/替换」，比 Mutex 快。但**一旦逻辑涉及多个字段的一致性，就必须用锁**——原子操作保护不了「A 和 B 要同时改」。

#### 判据
\`\`\`bash
go run -race main.go   # 无输出
go test -race ./...     # 全绿
\`\`\`
加上 Mutex 后，1000 次并发自增的结果必须**每次都是 1000**，连跑十次。

::q \`defer mu.Unlock()\` 相比在函数末尾写 \`mu.Unlock()\` 好在哪里？
::a 保证任何返回路径（包括中途 return 和 panic）都会解锁。手写 Unlock 时，一旦函数中间 \`return\` 或发生 panic，锁不会被释放，后续所有 Lock 永久阻塞，表现为服务整体卡死。
::q 为什么 \`RWMutex\` 在读多写少时才划算？
::a 它需要维护读者计数、唤醒等待者，写锁还要等待所有读锁释放。读多写少时并发收益大于这套额外开销；写频繁时等待链条变长，性能反而不如普通 Mutex。
::q 锁内调用数据库查询会造成什么后果？
::a 一次慢查询（几十毫秒到几秒）期间，所有需要同一把锁的 goroutine 全部阻塞，并发度退化为 1，请求排队雪崩。如果查询还依赖网络，故障时会把整个服务拖死。锁内只应操作内存中的少量字段。

<!--day 6 | core-->
#### context 解决的是「取消信号的传播」
一个 HTTP 请求进来，可能在 handler 里查了三次数据库、调了一次外部 API。用户关掉页面后，这些工作应该**尽快停下**，否则资源白烧。context 就是把这一个「停」的信号，沿着调用链自动传下去。

\`\`\`go
ctx, cancel := context.WithTimeout(r.Context(), 3*time.Second)
defer cancel()   // 必须调用，否则定时器泄漏
\`\`\`
三件事必须同时做到：
1. \`ctx\` 作为**第一个参数**一路传下去（\`func Get(ctx context.Context, id int64)\`）。
2. 每一层都把 \`ctx\` 交给下游（\`db.QueryRowContext(ctx, ...)\`）。
3. \`WithTimeout\`/\`WithCancel\` 的 \`cancel\` 一定 \`defer\` 调用，即使提前成功返回。

#### \`Done()\` / \`Err()\` 的语义
\`\`\`go
select {
case <-ctx.Done():
    return ctx.Err()   // context.Canceled 或 context.DeadlineExceeded
case <-time.After(time.Second):
}
\`\`\`
\`Done()\` 返回一个只读 channel，取消时关闭。\`Err()\` 给出原因——**这两个要配合使用**：只等 \`Done()\` 不知道是超时还是主动取消，日志里就没法区分「用户断开」和「后端太慢」。

#### 三条铁律
1. **不要把 \`ctx\` 存进结构体字段**。它是请求作用域的，存起来就意味着复用了一个已取消的 ctx。
2. **不要传 \`nil\` context**。不确定时用 \`context.TODO()\`，至少能静态检查出来。
3. **不要在长生命周期组件里保留 \`r.Context()\`**。请求结束 ctx 就取消，后台任务拿着它一定失败。

第 3 条在阶段五会变成具体规则：**GORM 只接受请求作用域的 ctx，不能把它存进 repo 结构体**。

#### 值传递：\`WithValue\` 只放请求元数据
\`\`\`go
type ctxKey string
const userIDKey ctxKey = "userID"

ctx := context.WithValue(r.Context(), userIDKey, int64(42))
uid, ok := ctx.Value(userIDKey).(int64)
\`\`\`
规矩：
- key 用**自定义类型**（不要用 string），避免不同包撞 key。
- 只放「横切关注点」：request ID、用户 ID、trace ID。**不要放业务参数**，那会让函数签名失去表意能力。
- 取出来必须做类型断言并判断 \`ok\`，否则 nil 断言 panic。

#### 取消如何真正生效
取消是**协作式**的：ctx 取消只关闭 channel，不会杀 goroutine。下游必须自己检查 \`ctx.Done()\` 或使用支持 ctx 的 API（\`QueryContext\`、\`http.NewRequestWithContext\`）才会真正中断。

\`\`\`go
// ❌ 取消不了：用的是不带 ctx 的 API
db.Query("SELECT ...")

// ✅ 取消能传到驱动层
db.QueryContext(ctx, "SELECT ...")
\`\`\`

#### 判据
\`\`\`go
ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
defer cancel()
time.Sleep(100 * time.Millisecond)
fmt.Println(ctx.Err())   // context deadline exceeded
\`\`\`
再验证一次「取消能传到数据库」：用 \`QueryContext\` 跑一条 \`SELECT\` 并在 10ms 后取消，应当返回 \`context deadline exceeded\` 而不是正常结果。

::q \`WithTimeout\` 之后忘记调用 \`cancel()\` 会怎样？
::a 定时器会一直存活到超时时刻，期间持有对 ctx 的引用，造成内存和定时器泄漏。如果这个 ctx 又被存进 map 或结构体，泄漏会持续累积。所以 \`defer cancel()\` 是无条件要写的，即使函数正常返回。
::q 为什么不能把 \`ctx\` 存进结构体字段？
::a context 的生命周期绑定单次请求，请求结束即取消。存进结构体意味着下次复用这个对象时仍持有已取消的 ctx，所有下游调用会立刻失败。需要跨调用传递的应该是请求参数，不是 ctx。
::q \`ctx.Done()\` 关闭后，下游 goroutine 会自动停止吗？
::a 不会。关闭 channel 只是一个信号，goroutine 必须自己检查（\`select { case <-ctx.Done(): }\`）或调用支持 ctx 的 API 才会退出。没有检查点的纯计算循环，即使 ctx 取消也会跑完。

<!--day 7 | normal-->
#### 一个目录一个包，包名是「职责」不是「层级」
\`\`\`
ledger/
├── go.mod
├── main.go                  package main
├── internal/
│   ├── store/               package store    —— 数据存取
│   └── ledger/              package ledger   —— 领域逻辑 + 接口定义
\`\`\`
\`internal/\` 是 Go 的强制可见性规则：**\`internal\` 下的包只能被同一父目录树内的代码导入**。外部项目想 import \`ledger/internal/store\` 会直接编译失败。这不是约定，是编译器保证。

#### 导出规则：首字母大写
- \`func Insert\` / \`type Entry\` → 导出，包外可见。
- \`func insert\` / \`type entry\` → 包内私有。

导出的东西就是你的 API 面。原则：**导出得越少，以后改起来越自由。** 结构体字段同理，只在必须序列化时才导出。

#### 包依赖必须是单向的
\`\`\`
main → ledger → store
\`\`\`
反过来 store 导入 ledger 就形成环，Go 直接拒绝编译（\`import cycle not allowed\`）。

常见的环是怎么产生的：store 需要返回 \`ledger.Entry\` 类型 → 于是导入 ledger；ledger 又导入 store 用它的函数 → 成环。解法有两种：
1. 把共享类型放到独立的 \`internal/model\` 包，两边都导入它。
2. 让接口定义在使用方（阶段一 D7 的原则），store 只返回自己包内的类型，由 ledger 层转换。

**第二种更好**：转换代码是显式的，依赖方向清晰。

#### 命名惯例
- 包名小写、单词、不用下划线：\`store\`、\`ledger\`，不要 \`store_pkg\`。
- 避免 \`util\`、\`common\`、\`base\` ——它们最终会变成垃圾场。
- 调用处读起来要通顺：\`store.New(...)\` 而不是 \`store.NewStore(...)\`（后者口吃）。

#### 判据
\`\`\`bash
go list -deps ./... | head       # 看依赖树
go build ./...                   # 无环、无未使用导入
\`\`\`
再写一行「故意让 store 导入 ledger」的代码，确认编译器报 \`import cycle\` —— 见过一次，以后就不会设计出环。

::q \`internal/\` 目录的作用是什么？
::a 限制导入范围：\`internal\` 下的包只能被以它父目录为根的树内代码导入。外部模块尝试导入会在编译期被拒绝。它用于把「实现细节」锁在项目内部，避免被别人依赖后再也改不动。
::q 什么是 import cycle，为什么会发生？
::a 两个包互相导入，Go 不允许这种环（会导致初始化顺序无法确定）。典型成因是共享类型放错了地方：A 定义类型、B 使用，后来 B 也定义了 A 需要的类型。解法是把共享类型下沉到第三个包，或把接口定义在使用方让依赖单向。
::q 为什么不该建 \`util\` 包？
::a 它没有明确职责，任何「不知道放哪」的函数都会扔进去，最终变成几十个不相关函数的集合。结果是谁都依赖它，它依赖所有人，改一个函数要重新验证整个项目。按职责命名（\`money\`、\`render\`、\`validate\`）才能让依赖关系有意义。

<!--day 8 | normal-->
#### 重构的目标不是「分层好看」，是「能测、能换」
重构前后行为必须完全一致——所以**先跑一遍 D14/D15 的验收命令，把输出存下来**，重构完逐条对比。没有基线就不叫重构，叫重写。

#### 第一步：把 SQL 挪进 store，接口定义在使用方
\`\`\`go
// internal/ledger/service.go
package ledger

import "context"

type Entry struct {
    ID       int64
    Amount   int64    // 分
    Category string
    Date     string
    Note     string
}

// 接口在使用方声明：Service 只关心这四件事
type Store interface {
    Insert(ctx context.Context, e Entry) (int64, error)
    Get(ctx context.Context, id int64) (Entry, error)
    ListByMonth(ctx context.Context, month string) ([]Entry, error)
    SumByMonth(ctx context.Context, month string) (int64, error)
}

type Service struct{ store Store }

func NewService(s Store) *Service { return &Service{store: s} }
\`\`\`
注意：\`ledger\` 包**不认识 sql**，也不认识 \`store\` 包。

#### 第二步：store 实现接口，自己管 SQL
\`\`\`go
// internal/store/sqlite.go
package store

import (
    "context"
    "database/sql"
    "ledger/internal/ledger"
)

type SQLite struct{ db *sql.DB }

func New(db *sql.DB) *SQLite { return &SQLite{db: db} }

func (s *SQLite) Insert(ctx context.Context, e ledger.Entry) (int64, error) {
    res, err := s.db.ExecContext(ctx,
        \`INSERT INTO entries (amount, category, date, note) VALUES (?, ?, ?, ?)\`,
        e.Amount, e.Category, e.Date, e.Note)
    if err != nil { return 0, fmt.Errorf("store.Insert: %w", err) }
    return res.LastInsertId()
}

var _ ledger.Store = (*SQLite)(nil)   // 编译期断言
\`\`\`
这里 store 导入 ledger（为了用 \`Entry\` 类型），方向是 store → ledger。而 ledger 只依赖自己定义的 \`Store\` 接口，不导入 store。**依赖单向，无环。**

#### 第三步：main 只做装配
\`\`\`go
func main() {
    db, err := openDB(cfg.DBPath)
    if err != nil { log.Fatal(err) }
    defer db.Close()

    st := store.New(db)
    svc := ledger.NewService(st)
    // 命令行模式传 svc，HTTP 模式也传 svc
    runCLI(svc)
}
\`\`\`
\`main\` 变成一张接线图，三行业务代码都不在里面。这是后面换 HTTP、加中间件、写测试的前提。

#### 判据
\`\`\`bash
go build ./...
go run . list          # 输出必须和重构前逐字一致
go list -deps ./internal/ledger | grep store   # 应当为空
\`\`\`
最后一条是关键：**ledger 包不应该依赖 store 包**。如果有输出，说明接口放错位置了。

::q \`go list -deps ./internal/ledger\` 里出现 store 包，说明什么问题？
::a 说明 ledger 反向依赖了实现包，依赖方向变成双向（store 为了实现接口也要导入 ledger），进一步就会 import cycle。正确形态是 ledger 只定义接口、不导入任何实现，实现方单向导入 ledger。
::q 重构前为什么必须先跑一遍验收命令？
::a 因为重构的定义是「外部行为不变」。没有重构前的输出作基线，就无法判断改动是否等价，只能靠人眼读代码，而人眼一定会漏。有了基线，任何差异立刻暴露。
::q 为什么 \`Entry\` 定义在 ledger 包而不是 store 包？
::a 因为它是业务概念，被 Service、CLI、将来的 HTTP 层共同使用。定义在 store 里会让上层被迫依赖存储层。放在领域包，存储层只负责「把领域对象存下去」，职责更清晰。

<!--day 9 | light-->
#### 并发导出：按月分文件，每个 goroutine 一个文件
\`\`\`go
func exportAll(ctx context.Context, svc *ledger.Service, months []string, dir string) error {
    var wg sync.WaitGroup
    errCh := make(chan error, len(months))

    for _, m := range months {
        wg.Add(1)
        go func(month string) {
            defer wg.Done()
            entries, err := svc.ListByMonth(ctx, month)
            if err != nil {
                errCh <- fmt.Errorf("export %s: %w", month, err)
                return
            }
            if err := writeCSV(filepath.Join(dir, month+".csv"), entries); err != nil {
                errCh <- fmt.Errorf("write %s: %w", month, err)
            }
        }(m)
    }

    wg.Wait()
    close(errCh)
    for err := range errCh { return err }   // 返回第一个错误
    return nil
}
\`\`\`
关键点：**每个 goroutine 写自己的文件**，没有共享状态，所以不需要锁。并发不是目的，「无共享」才是能安全并发的条件。

如果必须共享（比如都往一个 CSV 追加），就要么加锁，要么改成 channel 汇总由单一 goroutine 写——后者通常更简单。

#### 阶段验收
\`\`\`bash
go test -race ./...       # 全绿
go run -race . list       # 无 DATA RACE
go run . export           # 多个月份的 csv 都能打开
\`\`\`
然后回答三个问题（答不出回对应天）：

1. 为什么 \`main\` 依赖 \`Store\` 接口而不是 \`*store.SQLite\`？（D8）
2. \`-race\` 报告长什么样，你是怎么让它消失的？（D4/D5）
3. \`ctx\` 从命令行传到 SQL 一共经过几层？（D6）

::q 为什么「每个 goroutine 写自己的文件」就不需要加锁？
::a 因为没有共享可变状态——各自的文件句柄、各自的 buffer，互不影响。数据竞争的必要条件是「同一内存被并发读写」，没有共享就没有竞争。设计并发时优先考虑「切分数据」而不是「加锁保护共享数据」。
::q 多个 goroutine 都出错时，为什么只返回第一个错误？
::a 因为调用方通常只关心「这次导出失败了」，返回第一个足够定位；返回全部需要聚合错误（Go 1.20 的 \`errors.Join\`）。但要注意用带缓冲的 errCh，否则无人接收时发送方会阻塞，造成 goroutine 泄漏。
::q 为什么 \`close(errCh)\` 必须在 \`wg.Wait()\` 之后？
::a \`range errCh\` 依赖 channel 关闭才退出。如果先 close，尚未发送完的 goroutine 会 panic 在已关闭的 channel 上；如果既不 close 也不 Wait，range 会永久阻塞。顺序必须是「等所有发送方结束 → 关闭 → 接收方退出」。
`,uf=`<!--day 1 | light-->
#### 一个 HTTP 服务的最小闭环
\`\`\`go
func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Content-Type", "application/json; charset=utf-8")
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(\`{"message":"hello"}\`))
    })

    srv := &http.Server{Addr: ":8080", Handler: mux}
    log.Println("listen :8080")
    if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
        log.Fatal(err)
    }
}
\`\`\`
\`http.ErrServerClosed\` 是正常关闭的信号，不是错误——**不判断它，优雅关闭时程序会以 fatal 退出**。

#### 响应写的顺序不能乱
\`Header().Set\` → \`WriteHeader(status)\` → \`Write(body)\`。一旦 \`Write\` 了第一次，状态码和头就发出去了，再改无效（会有 \`superfluous WriteHeader call\` 警告）。

#### 一个请求在服务端到底经过了什么
\`\`\`
TCP 连接 → net/http 解析请求行与头 → 匹配 mux 模式 → 中间件链 → handler
        → 写状态码与头 → 写 body → （keep-alive）复用连接
\`\`\`
为什么要背这条链：**每一环都可能成为你的 bug 位置**。404 是路由没匹配，405 是方法不对，400 是 body 解析失败，500 是 handler 内 panic 或业务错误，而「响应体是空的」往往是没写 \`Write\` 或中间件提前 return 了。

#### \`net/http\` 的三个默认行为，会咬人
1. **默认没有超时**。\`&http.Server{Addr: ":8080"}\` 的 \`ReadTimeout\`/\`WriteTimeout\` 都是 0，意味着一个慢客户端可以永久占住连接（Slowloris）。现在就该加上，别等到阶段六。
2. **默认会 panic 后关闭连接**。handler 里 panic 时 \`net/http\` 会打印堆栈并断开这条连接，但不会杀进程——这看起来安全，实际上客户端拿到的是「连接被重置」，不是 500。
3. **默认不限制请求体大小**。\`r.Body\` 是无界的，一个 1GB 的 POST 会把内存吃光。用 \`http.MaxBytesReader\` 兜住（D2 会写）。

#### 监听地址写 \`:8080\` 而不是 \`localhost:8080\`
\`:8080\` 等价于 \`0.0.0.0:8080\`，监听所有网卡；\`localhost:8080\` 只监听回环。**手机连不上、容器外访问不了，十次有八次是这里写成了 localhost。** 安全边界应该由防火墙和反向代理控制，而不是靠只监听回环。

#### 判据
\`\`\`bash
curl -i localhost:8080/hello
# HTTP/1.1 200 OK   Content-Type: application/json; charset=utf-8
\`\`\`
再访问 \`/nope\` 看到 404，说明 mux 在正常工作。

::q 为什么 \`ListenAndServe\` 返回 \`http.ErrServerClosed\` 时不算错误？
::a 因为这是 \`srv.Shutdown()\` 被调用后的正常返回，表示服务器已停止接受新连接。把它当错误 \`log.Fatal\` 会让优雅关闭变成非零退出码，容器编排会误判为崩溃重启。
::q 调用 \`WriteHeader\` 之后再 \`Header().Set\` 为什么无效？
::a 响应头在 \`WriteHeader\`（或首次 \`Write\`）时就被序列化发送给客户端，之后再修改内存里的 header map 不会影响已发出的响应。所以所有头必须在写状态码之前设置。
::q 不设 \`Content-Type\` 会发生什么？
::a Go 会用 \`http.DetectContentType\` 嗅探前 512 字节猜类型，JSON 可能被猜成 \`text/plain\`，浏览器或前端就不会按 JSON 解析。显式设置是唯一可靠做法。

<!--day 2 | core-->
#### 读请求体：\`json.Decoder\` 而不是 \`ReadAll + Unmarshal\`
\`\`\`go
func createEntry(w http.ResponseWriter, r *http.Request) {
    var in struct {
        Amount   int64  \`json:"amount"\`
        Category string \`json:"category"\`
        Date     string \`json:"date"\`
        Note     string \`json:"note"\`
    }

    dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20))
    dec.DisallowUnknownFields()          // 拒绝多余字段（严格模式）
    if err := dec.Decode(&in); err != nil {
        http.Error(w, \`{"error":"invalid json"}\`, http.StatusBadRequest)
        return
    }
    ...
}
\`\`\`
三个点：
- \`MaxBytesReader\` 限制请求体大小，防超大 body 打爆内存。
- \`DisallowUnknownFields\` 让「字段名拼错」立刻 400，而不是静默忽略后落库为空值。**这在联调阶段能省大量时间。**
- \`Decode\` 直接读流，不需要先 \`ReadAll\`。

#### 请求体的三个常见错误
1. **\`r.Body\` 只能读一次**。读两次第二次拿到空。需要多次读就 \`io.ReadAll\` 后 \`io.NopCloser(bytes.NewReader(b))\` 重置。
2. **JSON 数字默认解析到 \`float64\`**，如果目标字段是 \`int64\`，\`json.Decoder\` 会做转换但**超出精度会静默出问题**。金额建议在契约里就用整数分，或者用 \`json.Number\`。
3. **\`null\` 和缺字段都会得到零值**，无法区分「没传」和「传了 0」。需要区分就用指针字段 \`*int64\`。

#### 写响应：先编码到 buffer，再一次性写
\`\`\`go
w.Header().Set("Content-Type", "application/json; charset=utf-8")
w.WriteHeader(http.StatusCreated)
if err := json.NewEncoder(w).Encode(resp); err != nil {
    // 此时头已发，只能记日志
    log.Printf("encode response: %v", err)
}
\`\`\`
\`Encode\` 是流式的，出错时头可能已经发出去了。所以严格场景应该先 \`json.Marshal\` 到 \`[]byte\`，成功后再 \`WriteHeader + Write\`——这样编码失败还能返回 500。

#### 判据
\`\`\`bash
curl -i -X POST localhost:8080/ledger \\
  -H 'Content-Type: application/json' \\
  -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}'
# 201 + JSON

curl -i -X POST localhost:8080/ledger -d '{"amount":"abc"}'
# 400，而不是 500
\`\`\`

::q 为什么推荐 \`json.NewDecoder(r.Body)\` 而不是 \`io.ReadAll\` + \`json.Unmarshal\`？
::a 前者直接流式解码，不用把整个 body 复制到内存；配合 \`MaxBytesReader\` 可以在超限时立即中断。后者要先把全部内容读进内存，大 body 会占用更多内存，还需要自己处理读取错误。
::q \`DisallowUnknownFields\` 打开后，前端多传一个字段会怎样？
::a \`Decode\` 返回错误，通常会响应 400。这是有意的严格性：字段名拼错（\`amout\` vs \`amount\`）会立刻暴露，而不是被静默忽略后写入零值。联调阶段能避免「数据不对但不报错」的排查地狱。
::q JSON 里的 \`null\` 和一个缺失的字段，解码到 \`int64\` 字段有什么区别？
::a 没有区别，两者都得到零值 0。要区分「未提供」和「显式传 0/null」，字段类型必须用指针 \`*int64\`：缺失时为 nil，显式 null 也是 nil，显式 0 则是指向 0 的指针。PATCH 语义必须用指针。

<!--day 3 | normal-->
#### Go 1.22 的路由：模式里带方法
\`\`\`go
mux.HandleFunc("POST /ledger", createEntry)
mux.HandleFunc("GET /ledger", listEntries)
mux.HandleFunc("GET /ledger/{id}", getEntry)
mux.HandleFunc("DELETE /ledger/{id}", deleteEntry)
\`\`\`
方法写在模式最前面，路径参数用 \`{name}\` 占位，handler 里 \`r.PathValue("id")\` 取出。

三条行为要知道：
1. **方法不匹配返回 405**，不是 404。这对客户端很重要——404 意味着「资源不存在」，405 意味着「路径对了但方法错了」。
2. \`GET /ledger/{id}\` 不会匹配 \`GET /ledger\`，也不会匹配 \`GET /ledger/1/extra\`。
3. \`{path...}\` 可以匹配剩余全部路径，用于静态文件。

#### 最具体的模式胜出
\`\`\`go
mux.HandleFunc("GET /ledger/summary", summary)  // 更具体
mux.HandleFunc("GET /ledger/{id}", getEntry)    // 更泛化
\`\`\`
\`/ledger/summary\` 会命中第一个，不会进 \`{id}\`。**但这也意味着如果你把 \`{id}\` 的解析写成 \`strconv.ParseInt\`，\`summary\` 永远走不到那个分支**——顺序无关，靠具体度匹配。

#### 路径参数一定要校验
\`\`\`go
idStr := r.PathValue("id")
id, err := strconv.ParseInt(idStr, 10, 64)
if err != nil {
    writeErr(w, http.StatusBadRequest, "invalid id")
    return
}
\`\`\`
不校验的后果：\`/ledger/abc\` 会被当成 0 去查库，然后返回 404，日志里看不出是「参数错」还是「真的没有这条」。

#### 判据
\`\`\`bash
curl -i localhost:8080/ledger            # 200
curl -i -X POST localhost:8080/ledger     # 201
curl -i -X PUT localhost:8080/ledger      # 405
curl -i localhost:8080/ledger/abc         # 400（校验生效）
curl -i localhost:8080/ledger/999         # 404
\`\`\`

::q \`POST /ledger\` 存在，请求 \`GET /ledger\` 时返回 405 还是 404？
::a 在 Go 1.22 的 mux 里，如果路径已注册但方法不匹配，返回 405 并带 \`Allow\` 头。这是更准确的语义。老版本 mux 或手写路由通常是 404，容易误导前端。
::q \`GET /ledger/{id}\` 会不会匹配 \`/ledger/summary\`？
::a 不会，如果同时注册了 \`GET /ledger/summary\`，因为它更具体，优先级更高。但如果没有注册它，\`/ledger/summary\` 会命中 \`{id}\` 分支，此时 \`PathValue("id")\` 是 \`"summary"\`，数字解析失败——所以参数校验必须要写。
::q 为什么路径参数 \`"abc"\` 应该返回 400 而不是 404？
::a 400 表示「请求本身有问题」（客户端传了非数字 ID），404 表示「请求合法但资源不存在」。混淆两者会让排查方向完全错误：看到 404 会去查数据库，实际是参数格式错。日志和监控上也应该能区分。

<!--day 4 | core-->
#### 统一信封解决的是「客户端要处理几种形状」
没有信封时，成功返回 \`{...}\`，失败返回 \`{"error": "..."}\`，客户端每处调用都要写两套解析。统一信封把所有响应变成同一种结构：

\`\`\`go
type Response[T any] struct {
    Code    string \`json:"code"\`            // 业务码，如 "OK" / "INVALID_ARGUMENT"
    Message string \`json:"message"\`
    Data    T      \`json:"data,omitempty"\`
    ReqID   string \`json:"request_id,omitempty"\`
}
\`\`\`

两个关键设计决定：
1. **\`code\` 是字符串而不是数字**。\`"INVALID_AMOUNT"\` 比 \`40013\` 可读、可 grep、不会因为加字段而改号。
2. **HTTP 状态码表达传输层结果，\`code\` 表达业务结果**。两者不是冗余——\`200 + code=PARTIAL_SUCCESS\` 是合法的，\`401 + code=TOKEN_EXPIRED\` 也是非常常见的组合。

#### 泛型让 handler 不写重复代码
\`\`\`go
func OK[T any](w http.ResponseWriter, data T) {
    writeJSON(w, http.StatusOK, Response[T]{Code: "OK", Message: "success", Data: data})
}

func Fail(w http.ResponseWriter, status int, code, msg string) {
    writeJSON(w, status, Response[any]{Code: code, Message: msg})
}

func writeJSON(w http.ResponseWriter, status int, v any) {
    buf, err := json.Marshal(v)
    if err != nil {
        http.Error(w, \`{"code":"INTERNAL"}\`, http.StatusInternalServerError)
        return
    }
    w.Header().Set("Content-Type", "application/json; charset=utf-8")
    w.WriteHeader(status)
    w.Write(buf)
}
\`\`\`
注意 \`Fail\` 用 \`Response[any]\`：失败时 \`data\` 是 nil，\`omitempty\` 会把它省掉，响应更干净。

#### 分页响应的形状
\`\`\`go
type Page[T any] struct {
    Items  []T   \`json:"items"\`
    Total  int64 \`json:"total"\`
    Limit  int   \`json:"limit"\`
    Offset int   \`json:"offset"\`
}
\`\`\`
\`Items\` 为空时要保证是 \`[]\` 而不是 \`null\`——初始化成 \`make([]T, 0)\`，否则前端 \`data.items.map\` 直接崩。

#### 判据
\`\`\`bash
curl -s localhost:8080/ledger | jq .
# { "code": "OK", "message": "success", "data": { "items": [], "total": 0, ... } }
curl -s localhost:8080/ledger/999 | jq .
# { "code": "NOT_FOUND", "message": "entry not found" }
\`\`\`
两种情况顶层字段一致，只有 \`code\` 和 HTTP 状态不同。

::q 既然有 HTTP 状态码，为什么还需要业务 \`code\`？
::a HTTP 状态码只有几十个，无法表达具体业务原因。比如 400 可能是「金额为负」「日期格式错」「分类不存在」，客户端需要区分并高亮不同字段。\`code\` 提供稳定的机器可读标识，状态码只用来表达大类（成功/客户端错/服务端错）。
::q 为什么 \`Items\` 要初始化成空切片而不是 nil？
::a nil 切片经 \`json.Marshal\` 会变成 \`null\`，前端 \`items.map(...)\` 或 \`items.length\` 直接抛错。空切片序列化成 \`[]\`，客户端可以无条件当作数组处理。这类「前端因为 null 崩」的问题排查成本很高，在服务端一行就能避免。
::q 泛型 \`Response[T]\` 相比 \`map[string]any\` 拼响应，实际收益是什么？
::a 编译期就能保证 \`Data\` 的类型正确，handler 写错字段会编译失败；\`map[string]any\` 只能靠运行时和测试发现，而且没有 IDE 补全。此外泛型不产生额外的接口装箱开销，JSON 输出结构也更稳定。

<!--day 5 | light-->
#### 今天的产出：一张能 curl 的骨架
\`\`\`go
func newRouter(svc *ledger.Service) http.Handler {
    mux := http.NewServeMux()
    mux.HandleFunc("POST /ledger", createEntry(svc))
    mux.HandleFunc("GET /ledger", listEntries(svc))
    mux.HandleFunc("GET /ledger/{id}", getEntry(svc))
    mux.HandleFunc("GET /summary", summary(svc))
    return mux
}

// handler 用闭包注入依赖，返回 http.HandlerFunc
func createEntry(svc *ledger.Service) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) { ... }
}
\`\`\`
**闭包注入是 Go 里最轻的依赖注入**：不用全局变量，不用框架，测试时传入假的 svc 就行。

#### 目录
\`\`\`
cmd/api/main.go         装配
internal/httpapi/       handler（本阶段新建）
internal/ledger/        Service + 接口
internal/store/         SQLite 实现
\`\`\`
handler 单独一个包，因为它属于「传输层」，和领域逻辑分开——这样后面加 gRPC 或 CLI，领域层不用动。

#### 先定契约，再写实现
骨架日的正确顺序是：**先把路由表和响应形状定下来，再逐个填实现**。原因是形状一旦定错，后面每个 handler 都要跟着改。

\`\`\`go
// 先把四个响应类型写出来，handler 里先 return 空数据
type CreateResp struct{ ID int64 \`json:"id"\` }
type ListResp struct {
    Items  []ledger.Entry \`json:"items"\`
    Total  int64          \`json:"total"\`
    Limit  int            \`json:"limit"\`
    Offset int            \`json:"offset"\`
}
\`\`\`
**\`Items\` 声明为切片而不是 \`any\`**，这样「返回 null 还是 []」的问题在类型层面就暴露了。

#### handler 只做三件事
\`\`\`go
func createEntry(svc *ledger.Service) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var in ledger.CreateInput
        if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&in); err != nil {
            Fail(w, http.StatusBadRequest, "INVALID_JSON", "请求体不是合法 JSON")
            return
        }
        id, err := svc.Create(r.Context(), in)
        if err != nil { writeError(w, r, err); return }   // 错误交给统一处理
        OKStatus(w, http.StatusCreated, CreateResp{ID: id})
    }
}
\`\`\`
三件事：**解码 → 调 Service → 写响应**。校验、事务、SQL 都不在这里。目测一下这个函数：11 行，没有一个 \`if\` 是在判断业务规则——这就是分层的体感。

#### 为什么 svc 用具体类型而不是接口
\`newRouter(svc *ledger.Service)\` 里传的是具体类型，这是有意的：**接口应该定义在使用方，而 router 并不需要「换掉 Service」**——它需要的就是完整的业务能力。给 Service 抽接口只会得到一个和实现一模一样的大接口，没有任何解耦价值。要替换的是 \`Store\`，不是 \`Service\`。

#### 判据
四个路由都能返回统一信封（哪怕数据是假的）。这一步不追求功能，追求「形状对了」。

::q 为什么 handler 用「返回闭包的函数」而不是全局变量持有 svc？
::a 全局变量让依赖隐式、测试时无法替换、并发初始化有风险。闭包把依赖固定在函数创建时，测试可以传 mock，生产传真实实现，且没有全局状态。这是 Go 标准库和大多数项目的主流做法。
::q 为什么把 handler 放在 \`internal/httpapi\` 而不是跟 Service 放一个包？
::a 传输层和领域层的变更原因不同：改 API 形状（加字段、改状态码）不应该触碰业务规则，改业务规则也不应该影响路由。分包后依赖方向明确（httpapi → ledger），也让 handler 的测试不需要加载业务实现。

<!--day 6 | normal-->
#### 写入路径的四步，缺一步都出事
\`\`\`go
func (s *Service) Create(ctx context.Context, in CreateInput) (int64, error) {
    if in.Amount <= 0 {
        return 0, &ValidationError{Field: "amount", Msg: "必须为正数（单位分）"}
    }
    if in.Category == "" {
        return 0, &ValidationError{Field: "category", Msg: "不能为空"}
    }
    if _, err := time.Parse("2006-01-02", in.Date); err != nil {
        return 0, &ValidationError{Field: "date", Msg: "格式应为 YYYY-MM-DD"}
    }
    return s.store.Insert(ctx, ledger.Entry{...})
}
\`\`\`
四步：**解析 → 校验 → 转换 → 持久化**。校验必须在持久化之前，且错误要能定位到字段。

#### 校验放在 handler 还是 Service
- **格式校验**（JSON 能不能解析、字段类型对不对）→ handler。
- **业务校验**（金额必须为正、日期不能是未来太远、分类必须存在）→ Service。

放错地方的代价：校验写在 handler 里，CLI 或后台任务调用 Service 时就绕过了规则。**业务规则只有一份，且在 Service 层。**

#### 201 与 Location 头
\`\`\`go
w.Header().Set("Location", fmt.Sprintf("/ledger/%d", id))
OKStatus(w, http.StatusCreated, map[string]int64{"id": id})
\`\`\`
创建成功返回 201 是约定，\`Location\` 让客户端知道新资源在哪。不是强制的，但成本极低。

#### 金额从进入 handler 那一刻起就是 int64
\`\`\`go
type CreateInput struct {
    Amount   int64  \`json:"amount"\`   // 分
    Category string \`json:"category"\`
    Date     string \`json:"date"\`
    Note     string \`json:"note"\`
}
\`\`\`
不要这样写：
\`\`\`go
Amount float64 \`json:"amount"\`     // ❌ 前端传 35.5，乘 100 得 3549.999...
\`\`\`
\`35.5 * 100\` 在 float64 下是 \`3549.9999999999995\`，\`int64()\` 截断后变 \`3549\`，**少一分**。这类 bug 在测试里很难复现（大部分金额刚好精确），但用户对账时一定会发现。接口契约里就规定「分」，前端负责乘 100 并取整。

#### 并发写入：现在就该想清楚
「先查有没有重复，再插入」在两个并发请求下都会通过检查。真正可靠的只有数据库唯一约束。即使今天还没加约束，写代码时也要形成习惯：**能交给数据库的判断，不要交给应用层的 if。**

#### 幂等：重复提交怎么办
用户手抖点两次「保存」，会写两条一模一样的账。三种处理：
1. 前端禁用按钮（治标，刷新页面就失效）。
2. 请求带 \`Idempotency-Key\`，服务端记录已处理的 key（重）。
3. 接受重复，提供删除（家庭账本最实际）。

**知道有这个问题、并做出明确选择**，比假装它不存在好。今天先在注释里写清楚选了哪条。

#### 判据
\`\`\`bash
curl -i -X POST localhost:8080/ledger -d '{"amount":0,"category":"餐饮","date":"2026-10-19"}'
# 400 + code=INVALID_ARGUMENT + message 指出 amount

curl -i -X POST localhost:8080/ledger -d '{"amount":3550,"category":"餐饮","date":"2026/10/19"}'
# 400，date 格式错误
\`\`\`

::q 业务校验为什么不该写在 handler 里？
::a 因为 handler 只是众多入口之一（还有 CLI、定时任务、消息消费）。规则写在 handler，其他入口就会绕过它，导致数据不一致。规则集中在 Service，所有入口共享同一份约束。
::q 创建成功为什么要返回 201 而不是 200？
::a 201 明确表示「新资源已创建」，并配合 \`Location\` 头给出资源地址，客户端可以据此跳转或缓存。200 只表示请求成功，语义上不含「新建」。REST 客户端的重试逻辑也可能据此区分。
::q 日期校验用 \`time.Parse("2006-01-02", s)\` 而不是正则，好处是什么？
::a \`time.Parse\` 会真正校验日期合法性（\`2026-02-30\` 会失败），正则只能校验形状（两位月两位日），无法发现 2 月 30 日这种不存在日期。而且解析成功还能直接拿到 \`time.Time\` 用于后续计算。

<!--day 7 | core-->
#### 分页的两个参数、三个坑
\`\`\`go
limit := parseIntDefault(r.URL.Query().Get("limit"), 20)
offset := parseIntDefault(r.URL.Query().Get("offset"), 0)

if limit <= 0 || limit > 100 {
    limit = 20                     // 上限防「一次拉全表」
}
if offset < 0 {
    offset = 0
}
\`\`\`
三个坑：
1. **不设上限**：\`?limit=1000000\` 直接把内存打爆，是常见的低强度攻击面。
2. **不校验负数**：\`offset=-1\` 会让 SQL 报错或行为诡异。
3. **字符串直接拼进 SQL**：\`limit\` 是从 URL 来的，必须转成 int 再用占位符。虽然它是数字，但「URL 参数一律当不可信输入」这条规则不该有例外。

#### 一次查询两件事：数据 + 总数
\`\`\`go
rows, err := db.QueryContext(ctx,
    \`SELECT id, amount, category, date, note FROM entries
     WHERE date LIKE ? ORDER BY date DESC, id DESC LIMIT ? OFFSET ?\`,
    month+"%", limit, offset)
...
var total int64
db.QueryRowContext(ctx, \`SELECT COUNT(*) FROM entries WHERE date LIKE ?\`, month+"%").
    Scan(&total)
\`\`\`
**\`ORDER BY\` 必须带唯一列兜底**（这里是 \`id DESC\`）。只按 \`date\` 排序时，同一天的多条记录顺序不确定，翻页会出现「第 1 页和第 2 页有重复/漏记录」。

#### \`total\` 的语义要定清楚
- \`total\` = 满足筛选条件的**总条数**（与 limit/offset 无关）。
- 不是「本页条数」，也不是「剩余条数」。

定不清楚的后果：前端算总页数 \`ceil(total/limit)\` 会错，分页器显示「第 1 页 / 共 1 页」但实际有 5 页。

#### 判据
\`\`\`bash
curl -s 'localhost:8080/ledger?limit=2&offset=0' | jq '.data | {total, n: (.items|length)}'
# total=5, n=2
curl -s 'localhost:8080/ledger?limit=2&offset=4' | jq '.data | {total, n: (.items|length)}'
# total=5, n=1
\`\`\`
两次的 \`total\` 必须相同，\`n\` 随 offset 变化。

::q \`ORDER BY date DESC\` 单独用，翻页时为什么可能重复或漏数据？
::a 同一天可能有多条记录，它们的相对顺序由数据库实现决定且不保证稳定。不同次查询（尤其加了 LIMIT/OFFSET）可能给出不同顺序，导致某条记录在两页都出现、另一条被跳过。加上唯一列（如 \`id DESC\`）后排序全序确定，翻页才稳定。
::q \`total\` 应该表示什么？如果前端要用它算总页数，必须是哪种语义？
::a 应该是「满足筛选条件的总记录数」，与当前 limit/offset 无关。前端算总页数用 \`ceil(total/limit)\` 才成立。如果返回的是「剩余条数」，分页器会算错。
::q 为什么 \`limit\` 也要做上限校验，即使它已经转成了 int？
::a 因为攻击者或误用可以传 \`limit=1000000\`，服务端会尝试一次拉出全表并序列化成 JSON，内存和带宽都可能被打爆，属于低成本的拒绝服务。上限（如 100）是必要的保护，同时也能让响应时间可预测。

<!--day 8 | core-->
#### 边界值的清单，逐条过
| 输入 | 期望行为 |
| :--- | :--- |
| \`limit=0\` | 用默认值 20，不返回空列表 |
| \`limit=-5\` | 用默认值 20 |
| \`limit=101\` | 截到 100 或返回 400，二选一但要一致 |
| \`offset=0\` | 第一页 |
| \`offset\` 超过 total | 返回空 \`items\`，\`total\` 照常 |
| \`offset=-1\` | 归零或 400 |
| \`month=2026-13\` | 400，不是空列表 |
| \`month=\` 空 | 用当前月 |

**「返回空列表」和「返回错误」的选择要有理由**：\`offset\` 超出范围是合法请求（客户端可以乐观翻页），返回空列表更友好；\`month=2026-13\` 是非法输入，必须 400，否则前端以为「这个月没记账」。

#### 空列表 vs 越界，语义不同
\`\`\`go
if len(items) == 0 && offset > 0 && int64(offset) >= total {
    // 不是错误，就是翻过头了；返回空 items
}
\`\`\`
日志里要能区分「这个月真的没数据」和「翻页翻过头」——否则监控上看不出来是用户行为异常还是数据缺失。

#### 时间范围校验
\`\`\`go
func validMonth(s string) bool {
    _, err := time.Parse("2006-01", s)
    return err == nil
}
\`\`\`
\`time.Parse("2006-01", "2026-13")\` 会失败，这是最省事的校验方式。空字符串单独处理成默认当前月。

#### 判据
写一个 \`paging_test.go\`，表驱动跑上面 8 行，全部通过才算今天完成。**分页 bug 是那种「上线三个月后才被用户发现」的类型**，必须靠测试挡住。

::q \`offset\` 超过总数时，返回空列表和返回 404 哪个更合适？
::a 返回空列表。因为请求本身合法（参数都在允许范围内），只是没有数据，客户端可以据此判断「到底了」。返回 404 会让客户端误以为「分页接口不存在」，也不符合「集合资源」的语义。
::q \`limit=0\` 为什么不该直接返回空列表？
::a 因为多数客户端把「不传 limit」等同于 \`limit=0\`（零值），若按 0 处理会导致「忘了传参数就拿到空数据」这种极难排查的问题。约定是 0 或负数一律回落到默认值。
::q 为什么 \`month=2026-13\` 必须报 400 而不是返回空？
::a 因为 13 月不存在，是非法输入。返回空会让用户以为「这个月没有记账」，掩盖了前端拼参数的错误。非法输入与合法但无数据必须区分，这是 API 可用性的一部分。

<!--day 9 | normal-->
#### 换存储层，handler 一行不改
这是分层第一次兑现价值。Service 依赖 \`Store\` 接口，把内存实现换成 SQLite 实现，只需要改 \`main\` 里的一行装配：

\`\`\`go
// 之前
svc := ledger.NewService(memstore.New())
// 之后
svc := ledger.NewService(store.New(db))
\`\`\`
如果这一步需要改 handler，说明依赖方向错了。

#### 内存实现也要认真写
\`\`\`go
type Mem struct {
    mu      sync.Mutex
    entries []ledger.Entry
    nextID  int64
}

func (m *Mem) Insert(ctx context.Context, e ledger.Entry) (int64, error) {
    if err := ctx.Err(); err != nil { return 0, err }   // 尊重取消
    m.mu.Lock()
    defer m.mu.Unlock()
    m.nextID++
    e.ID = m.nextID
    m.entries = append(m.entries, e)
    return e.ID, nil
}
\`\`\`
内存实现不是「临时代码」，它是**测试替身**。要保证语义和 SQLite 一致（ID 自增、返回顺序、空列表非 nil），否则测试通过但生产失败。

#### 这是对「接口抽象」的第一次真实检验
换实现时你要盯住三件事：
1. **handler 有没有改**——一行都不该改。
2. **Service 有没有改**——不该改。
3. **\`main\` 改了几行**——应该只有装配那一行。

如果 Service 里出现了 \`if isSQLite { ... }\` 之类的分支，说明抽象漏了：内存实现和 SQLite 实现的语义没有对齐（比如排序规则、空列表、ID 自增行为），只能在上层打补丁。

#### SQLite 实现里必须注意的四点
\`\`\`go
func (s *SQLite) ListByMonth(ctx context.Context, month string) ([]ledger.Entry, error) {
    rows, err := s.db.QueryContext(ctx, \`
        SELECT id, amount, category, date, note FROM entries
        WHERE date LIKE ? ORDER BY date DESC, id DESC\`, month+"%")
    if err != nil { return nil, fmt.Errorf("list: %w", err) }
    defer rows.Close()

    out := make([]ledger.Entry, 0, 16)      // ① 初始化空切片，不返回 nil
    for rows.Next() {
        var e ledger.Entry
        if err := rows.Scan(&e.ID, &e.Amount, &e.Category, &e.Date, &e.Note); err != nil {
            return nil, fmt.Errorf("scan: %w", err)
        }
        out = append(out, e)
    }
    return out, rows.Err()                   // ② 检查遍历错误
}
\`\`\`
③ **\`ORDER BY\` 加唯一列兜底**，否则同一天多条记录顺序不稳（D8 会讲）。
④ **\`Scan\` 顺序必须与 \`SELECT\` 列顺序严格一致**，错一位不会报错，只会把分类塞进金额。

#### 建表语句放哪
今天可以用「启动时 \`CREATE TABLE IF NOT EXISTS\`」，但要在代码里留一行注释：**阶段五会换成 \`goose\` 迁移**。带着「这是临时方案」的自觉写代码，才不会把它固化成架构。

#### 判据
\`\`\`bash
go run . add -amount 3550 ...   # 用 HTTP 也行
curl -s localhost:8080/ledger | jq '.data.items | length'
\`\`\`
换成 SQLite 后，重启进程数据还在；换成内存实现后重启就没了——这个对比就是「持久化」的定义。

::q 为什么内存实现里也要检查 \`ctx.Err()\`？
::a 因为测试替身要模拟真实实现的行为。真实实现会因 ctx 取消而返回错误，如果内存实现忽略 ctx，测试就测不出「handler 是否正确传播了取消」，掩盖真实环境的问题。
::q 换存储实现时如果必须改 handler，说明什么？
::a 说明 handler 直接依赖了具体实现（比如直接用了 \`*store.SQLite\` 的方法或它的类型），或者业务逻辑泄漏到了 handler 里。依赖方向应该始终是 handler → Service → 接口，实现只在 main 里出现。

<!--day 10 | light-->
#### 持久化验证：三步走
\`\`\`bash
# 1. 写入
curl -X POST localhost:8080/ledger -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}'
# 2. 杀掉进程（Ctrl+C 或 kill）
# 3. 重启后再查
curl -s localhost:8080/ledger | jq '.data.total'   # 应为 1
\`\`\`
这一步必须亲手做一次。**很多「数据丢了」的问题，其实是 DSN 写成了 \`:memory:\`，或者工作目录变了导致打开了另一个 db 文件。**

#### 直接查库的三种方式
\`\`\`bash
sqlite3 ledger.db 'select count(*) from entries'          # 最简单
sqlite3 ledger.db '.schema entries'                       # 看建表语句
sqlite3 -header -column ledger.db 'select * from entries limit 5'
\`\`\`
\`-header -column\` 让输出带列名并自动对齐，比默认的 \`|\` 分隔好读得多。排查「到底写进去了没有」，永远先绕开服务直接查库。

#### \`-wal\` 和 \`-shm\` 是什么
启用 WAL 后目录里会多出两个文件：
- \`ledger.db-wal\` 是预写日志，**最新写入可能还在这里，尚未合并进主库文件**。
- \`ledger.db-shm\` 是共享内存索引，进程异常退出后可能残留。

后果：**只备份 \`ledger.db\` 可能丢掉最近的写入。** 正确做法：
\`\`\`bash
sqlite3 ledger.db ".backup 'backup.db'"    # 在线一致备份
\`\`\`
或者停服务后三个文件一起拷。直接 \`cp ledger.db\` 在写入进行中可能拿到不一致的快照。

#### 数据文件的权限
\`ls -l ledger.db\` 看属主。服务以非 root 用户运行时，如果文件属主是 root，写入会失败并报 \`attempt to write a readonly database\`——错误信息指向「只读」，实际是权限问题。生产环境应固定绝对路径并明确属主。

#### 排查清单
1. DSN 是 \`file:ledger.db\` 还是 \`:memory:\`？
2. 启动时的工作目录在哪？相对路径会跟着变。
3. \`ls -l ledger.db\` 的修改时间是否是刚才？
4. \`sqlite3 ledger.db 'select count(*) from entries'\` 直接查库，绕过服务。

第 4 条是分界线：**库里有没有数据**决定了问题在写入端还是读取端。

::q 重启后数据消失，最先应该检查什么？
::a 先绕过服务直接查库：\`sqlite3 ledger.db 'select count(*) from entries'\`。如果库里有数据，问题在读取端（DSN 不一致、查询条件错）；如果库里没有，问题在写入端（用了内存库、写入失败但错误被吞、事务回滚）。
::q 相对路径 \`ledger.db\` 有什么隐患？
::a 它相对于进程的当前工作目录。用不同方式启动（\`./api\` 与 \`cd /var/lib && /opt/api\`）会打开不同的文件，表现为「数据莫名消失」。生产环境应该用绝对路径或明确配置的数据目录。

<!--day 11 | normal-->
#### 404 的三种来源，必须区分
\`\`\`go
func (s *Service) Get(ctx context.Context, id int64) (ledger.Entry, error) {
    e, err := s.store.Get(ctx, id)
    if errors.Is(err, sql.ErrNoRows) {
        return ledger.Entry{}, ErrNotFound       // 业务语义
    }
    if err != nil {
        return ledger.Entry{}, fmt.Errorf("get entry: %w", err)
    }
    return e, nil
}
\`\`\`
- **参数非法**（\`/ledger/abc\`）→ 400。
- **资源不存在**（\`ErrNotFound\`）→ 404。
- **数据库故障** → 500。

三种都返回 404 是常见错误：真出故障时前端和监控都以为是「用户访问了不存在的记录」，故障被掩盖。

#### handler 侧的分流
\`\`\`go
if errors.Is(err, ledger.ErrNotFound) {
    Fail(w, http.StatusNotFound, "NOT_FOUND", "entry not found")
    return
}
Fail(w, http.StatusInternalServerError, "INTERNAL", "internal error")
\`\`\`
\`errors.Is\` 能穿透 \`fmt.Errorf("%w")\` 的包装——这就是阶段一 D6 说的「\`%w\` 影响控制流」在这里的具体兑现。

#### 不要泄漏内部错误信息
生产环境不要把 \`sql\` 错误原文返回给客户端（可能含表名、字段名）。**给客户端 code + 通用 message，给日志完整错误 + request_id。**

#### \`PathValue\` 拿到的永远是字符串
\`\`\`go
id, err := strconv.ParseInt(r.PathValue("id"), 10, 64)
if err != nil || id <= 0 {
    Fail(w, http.StatusBadRequest, "INVALID_ARGUMENT", "id 必须是正整数")
    return
}
\`\`\`
\`ParseInt\` 的三个参数分别处理：进制（10）、位宽（64）、返回值类型。**\`id <= 0\` 也要挡**——\`/ledger/0\` 和 \`/ledger/-1\` 语法合法但业务上不存在，直接拒绝比查一次库更省事，也避免把 \`-1\` 传进 SQL。

#### 删除：幂等还是报错
\`\`\`go
func (s *Service) Delete(ctx context.Context, userID, id int64) error {
    n, err := s.store.DeleteEntry(ctx, userID, id)
    if err != nil { return err }
    if n == 0 { return ErrNotFound }
    return nil
}
\`\`\`
REST 语义上 \`DELETE\` 应该是**幂等**的：删两次都返回成功。但那样会掩盖「ID 拼错」的问题。家庭账本选「第二次返回 404」更实用——前端能提示「这条记录已经不存在了，可能已被删除」。

**关键是选定一种并在接口文档里写清楚**，不要让前端靠猜。

#### 软删除要不要现在做
\`deleted_at\` 字段 + GORM 的软删除，好处是「误删可恢复」，坏处是**每条查询都要带 \`deleted_at IS NULL\`**（GORM 自动加，但原生 SQL 要手写），一旦漏掉就会把已删数据查出来。

家庭账本建议先做硬删除（连 \`DELETE FROM\`），把「回收站」作为后续需求。**不要在还没搞清楚查询边界时引入软删除**，它会让你每一处 SQL 都要多一份心智负担。

#### 判据
\`\`\`bash
curl -i localhost:8080/ledger/999999   # 404 + code=NOT_FOUND
curl -i localhost:8080/ledger/abc      # 400 + code=INVALID_ARGUMENT
# 把 db 路径改成不可写，重启后请求 → 500 + code=INTERNAL，日志有完整原因
\`\`\`

::q 为什么数据库故障不能返回 404？
::a 404 表示「请求的资源不存在」，是客户端可理解的正常结果。数据库故障是服务端问题，返回 404 会让客户端放弃重试、让监控看不到错误率上升，故障被静默掩盖。必须 500 并记录日志。
::q \`errors.Is(err, ledger.ErrNotFound)\` 为什么能穿透多层包装？
::a 因为每层都用 \`fmt.Errorf("...: %w", err)\` 包装，保留了 \`Unwrap()\` 链。\`errors.Is\` 会沿链逐层比较。如果某层用了 \`%v\`，链断裂，这里就判断不到。
::q 为什么不把 \`sql\` 错误原文返回给客户端？
::a 会泄漏内部结构（表名、字段名、SQL 片段），给攻击者提供信息；对用户也毫无意义。正确做法是返回稳定的 \`code\` 和通用文案，完整错误写进日志并用 request_id 关联。

<!--day 12 | normal-->
#### 按月聚合的 SQL
\`\`\`sql
SELECT category, SUM(amount) AS total
FROM entries
WHERE user_id = ? AND date LIKE ?
GROUP BY category
ORDER BY total DESC;
\`\`\`
如果用 GORM（阶段五）：
\`\`\`go
db.Model(&Entry{}).
    Select("category, SUM(amount) as total").
    Where("user_id = ? AND date LIKE ?", uid, month+"%").
    Group("category").
    Scan(&rows)
\`\`\`
\`Scan\` 到自定义结构体，**不要 Scan 到 \`Entry\`**——它没有 \`total\` 字段，会静默丢掉聚合结果。

#### 响应结构
\`\`\`go
type Summary struct {
    Month string          \`json:"month"\`
    Total int64           \`json:"total"\`
    ByCategory []CategorySum \`json:"by_category"\`
}
type CategorySum struct {
    Category string \`json:"category"\`
    Total    int64  \`json:"total"\`
    Percent  int    \`json:"percent"\`   // 预留，便于前端画图
}
\`\`\`
\`Total\` 建议单独查一次 \`COALESCE(SUM(amount),0)\`，而不是把各分类相加——分类相加在有 \`NULL\` 分类或过滤条件不一致时会算错。

#### \`LIKE '2026-10%'\` 和范围查询的实际差别
\`\`\`sql
-- A: 前缀匹配
WHERE date LIKE '2026-10%'
-- B: 半开区间
WHERE date >= '2026-10-01' AND date < '2026-11-01'
\`\`\`
两者都能走索引，但 B 更稳：
- B 的边界是**显式日期**，改月份时不会因为字符串拼接出错（\`'2026-1'\` 会匹配到 \`2026-10\`、\`2026-11\`、\`2026-12\`）。
- B 在跨年时不会出错（\`LIKE '2026-12%'\` 的下一月是 \`2027-01\`，需要特殊处理）。
- B 可以处理「不足两位的月份」写法（如果数据里有 \`2026-1-05\`）。

**建议：接口层接收 \`2026-10\`，内部转成半开区间再查。** 这层转换放在 Service 里，SQL 里就不出现 \`LIKE\`。

#### 月份参数必须校验
\`\`\`go
_, err := time.Parse("2006-01", month)
if err != nil {
    return Summary{}, &ValidationError{Field: "month", Msg: "格式应为 YYYY-MM"}
}
\`\`\`
不校验的话，\`month=2026-1\` 会静默匹配到 10/11/12 月的数据，统计结果翻十倍而没有任何报错。

#### 空分类与 NULL
如果历史数据里 \`category\` 为空字符串，\`GROUP BY\` 会把它单独成一组，前端显示一个没有名字的分类。两种处理：
- 建表时 \`NOT NULL DEFAULT '未分类'\`。
- 查询时 \`CASE WHEN category = '' THEN '未分类' ELSE category END\`。

**选一种，别让空分类流到前端**——那是把数据质量问题转嫁给用户。

#### 判据
\`\`\`bash
curl -s 'localhost:8080/summary?month=2026-10' | jq .data
# by_category 按金额降序，total 等于各项之和
\`\`\`
再插一条 0 元记录，确认它不影响总额但会出现在分类里（这个边界决定你的 SQL 是否需要 \`HAVING SUM(amount) > 0\`）。

::q 为什么 \`Scan\` 聚合结果时不要用 \`Entry\` 结构体？
::a \`Entry\` 没有 \`total\` 字段，GORM 会静默忽略这一列，你拿到的是空结构体或零值，且不报错。必须定义专用结构体（如 \`CategorySum\`）承载聚合列，字段名与 SQL 别名对应。
::q \`total\` 用「各分类相加」和「单独 SUM 一次」，哪个更可靠？
::a 单独 SUM 更可靠。分类相加依赖两个查询的条件完全一致，且分类中若有 NULL 或空字符串会被 GROUP BY 单独成组，容易漏算。单独一次 \`SELECT COALESCE(SUM(amount),0)\` 语义明确，也不受分组影响。

<!--day 13 | core-->
#### 中间件的类型签名，只有一个正确答案
\`\`\`go
type Middleware func(http.Handler) http.Handler
\`\`\`
它接收「下一个 handler」，返回「包装后的 handler」。所以它可以做三件事：**请求前做事、请求后做事、决定要不要调下一个**。

\`\`\`go
func WithLogging(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)                      // 调用下游
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}
\`\`\`

#### 套的顺序 = 执行的顺序（洋葱）
\`\`\`go
h := mux
h = WithAuth(h)        // 最内层
h = WithRateLimit(h)
h = WithLogging(h)     // 最外层
srv.Handler = h
\`\`\`
请求进来先过 \`WithLogging\`，再到 \`WithRateLimit\`，最后 \`WithAuth\`。**返回时反序。** 记住「后套的在外层」。

后续阶段的固定顺序（阶段六 D13 会再强调）：
\`\`\`
Recovery → CSRF → RateLimit → Auth → handler
\`\`\`
\`Recovery\` 必须在最外层，才能捕获内层所有 panic。

#### 中间件不该做的事
- **不要在里面写业务逻辑**（查账本、算统计）。中间件只处理横切关注点：日志、认证、限流、CORS、恢复。
- **不要用中间件做参数校验**。它拿不到业务上下文，做出来的校验会和 handler 重复且不一致。
- **不要每个路由单独套一份**，容易漏。统一套在 mux 外层。

#### 传递数据的正确方式
\`\`\`go
type ctxKey struct{ name string }
var userIDKey = ctxKey{"userID"}

// 中间件里
ctx := context.WithValue(r.Context(), userIDKey, uid)
next.ServeHTTP(w, r.WithContext(ctx))     // 必须 WithContext，否则下游拿不到

// handler 里
uid, ok := r.Context().Value(userIDKey).(int64)
\`\`\`
用自定义 key 类型避免撞键；取出来必须断言并判 \`ok\`。

#### 判据
套两个中间件，观察日志顺序：
\`\`\`
[outer] before
[inner] before
handler
[inner] after
[outer] after
\`\`\`
顺序不对说明套反了。

::q 中间件为什么必须是 \`func(http.Handler) http.Handler\` 这个签名？
::a 因为它需要「包装」任意下游 handler，且自身也要能被当作 handler 使用。这个签名让中间件可以任意嵌套组合，最终产物仍是 \`http.Handler\`，可以直接赋给 \`srv.Handler\`。任何别的签名都会失去组合能力。
::q 为什么 \`Recovery\` 必须放在最外层？
::a 因为它要捕获内层所有中间件和 handler 的 panic。放在内层的话，外层中间件（如日志、限流）在 panic 传播时已经中断，无法记录完整请求信息，进程也可能因此退出。
::q 中间件里用 \`r.WithContext(ctx)\` 而不是直接改 \`r.Context()\`，为什么？
::a \`http.Request\` 是不可变的（按值传递），\`r.Context()\` 返回的是内部字段的值，直接修改副本不会影响下游。\`WithContext\` 返回一个带新 ctx 的浅拷贝请求，把这份新请求传给 \`next\` 才能让下游读到值。

<!--day 14 | core-->
#### 日志中间件要拿到「真实状态码」，而 \`ResponseWriter\` 不告诉你
\`\`\`go
type statusRecorder struct {
    http.ResponseWriter
    status int
    bytes  int
}

func (s *statusRecorder) WriteHeader(code int) {
    s.status = code
    s.ResponseWriter.WriteHeader(code)
}

func (s *statusRecorder) Write(b []byte) (int, error) {
    if s.status == 0 { s.status = http.StatusOK }   // 隐式 200
    n, err := s.ResponseWriter.Write(b)
    s.bytes += n
    return n, err
}
\`\`\`
两个细节决定这段代码对不对：
1. **不重写 \`Write\`，状态码永远是 0**——handler 只调 \`Write\` 不调 \`WriteHeader\` 时，实际返回的是 200，但记录器不知道。
2. **\`WriteHeader\` 可能被调用多次**，后者无效。记录第一次即可（这里直接覆盖，但实际响应仍是第一次的，建议只在 \`status == 0\` 时记录）。

#### 日志该带哪些字段
\`\`\`go
log.Printf("method=%s path=%s status=%d dur=%s bytes=%d req_id=%s",
    r.Method, r.URL.Path, rec.status, time.Since(start), rec.bytes, reqID)
\`\`\`
结构化日志（阶段五 D16）会用 \`slog\` 输出成 JSON，字段固定才有法聚合。**\`path\` 不要记完整 URL（含 query 里的敏感参数），必要时只记 path。**

#### 为什么不能只记「请求进来了」
没有状态码和耗时，日志只能证明「有人访问过」，无法回答「哪个接口慢」「错误率多少」。这两个字段是所有可观测性的最小集合。

#### 判据
\`\`\`bash
curl -s localhost:8080/ledger/999999 > /dev/null
# 日志里 status=404，不是 200
\`\`\`
如果记成 200，说明 \`statusRecorder\` 没生效（可能 handler 里用了 \`http.Error\`，它内部调 \`WriteHeader\`，能被捕获；但如果中间件漏传包装器就不会）。

::q 为什么需要包装 \`ResponseWriter\` 才能拿到状态码？
::a \`http.ResponseWriter\` 接口没有读状态码的方法。要记录就必须在调用 \`WriteHeader\` 时截获。包装器实现同一接口，把调用转发给原始 writer 并顺便记录，是标准做法。
::q 只重写 \`WriteHeader\` 不重写 \`Write\`，会漏什么？
::a 会漏「隐式 200」。handler 直接 \`w.Write(...)\` 而不显式 \`WriteHeader\` 时，Go 自动发送 200，但你的记录器从未被通知，\`status\` 保持 0，日志里就会出现 status=0 或空值。
::q 日志路径里为什么不该记录完整 query string？
::a query 里可能含 token、手机号、搜索关键词等敏感信息，写入日志会造成泄漏和合规问题。需要排障时可以只记录白名单参数，或对值做脱敏。

<!--day 15 | core-->
#### 集中式错误处理：handler 只返回 error
\`\`\`go
type HandlerFunc func(w http.ResponseWriter, r *http.Request) error

func Wrap(h HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        if err := h(w, r); err != nil {
            writeError(w, r, err)
        }
    }
}

func writeError(w http.ResponseWriter, r *http.Request, err error) {
    var ve *ledger.ValidationError
    switch {
    case errors.As(err, &ve):
        Fail(w, http.StatusBadRequest, "INVALID_ARGUMENT", ve.Error())
    case errors.Is(err, ledger.ErrNotFound):
        Fail(w, http.StatusNotFound, "NOT_FOUND", "entry not found")
    case errors.Is(err, context.DeadlineExceeded):
        Fail(w, http.StatusGatewayTimeout, "TIMEOUT", "request timeout")
    default:
        log.Printf("internal error: %v req_id=%s", err, reqID(r))
        Fail(w, http.StatusInternalServerError, "INTERNAL", "internal error")
    }
}
\`\`\`
这个 switch 就是**整个服务的错误语义地图**。新增错误类型只改这一处。

#### 三条规则
1. **错误映射集中在一处**，handler 里只 \`return err\`，不写 \`http.Error\`。
2. **未知错误一律 500 且不泄漏细节**，同时必须记日志——否则 500 变成了「什么都没发生」。
3. **\`context.Canceled\` 不该记成 500**：客户端主动断开是正常现象，记成 500 会污染错误率。通常返回 499（非标准）或直接不写响应。

#### 输入校验要用同一个错误类型
\`\`\`go
type ValidationError struct {
    Field string
    Msg   string
}
func (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }
\`\`\`
好处：\`errors.As\` 能一次识别所有字段级错误，响应里能带上 \`field\` 供前端高亮。

#### 判据
\`\`\`bash
# 三类错误各打一次，确认状态码和 code 正确
curl -i -X POST localhost:8080/ledger -d '{"amount":0}'
curl -i localhost:8080/ledger/999999
# 停掉数据库（改错路径重启），再请求 → 500，日志有详细原因但响应无细节
\`\`\`

::q 为什么「未知错误返回 500」还必须写日志？
::a 因为 500 对客户端和监控只是一个数字，不含任何原因。如果不记日志，故障就变成「有错误率但没有线索」，只能靠复现。日志要带完整错误链和 request_id，才能从告警直接定位到具体请求。
::q \`context.Canceled\` 为什么不该算作 500？
::a 它表示客户端主动断开（关页面、超时取消），不是服务端故障。记成 500 会拉高错误率、触发误报警。这类请求通常也不需要写响应体，因为对端已经走了。
::q 错误映射集中在 \`writeError\` 里，新增一种业务错误需要改几处？
::a 一处：在 switch 里加一个 \`errors.As\`/\`errors.Is\` 分支。handler 只需要 \`return\` 新错误，不用关心 HTTP 状态码。这正是集中处理的价值——错误到 HTTP 的映射只存在一份。

<!--day 16 | core-->
#### \`OFFSET\` 为什么会随页深变慢
\`\`\`sql
SELECT ... FROM entries ORDER BY id LIMIT 20 OFFSET 100000;
\`\`\`
数据库必须**先按顺序扫描并丢弃前 100000 行**，才能返回接下来的 20 行。成本是 O(offset)，页越深越慢。\`EXPLAIN QUERY PLAN\` 能看到它走了索引但仍然要逐行跳过。

游标分页（keyset）：
\`\`\`sql
SELECT ... FROM entries WHERE id < ? ORDER BY id DESC LIMIT 20;
\`\`\`
直接从索引定位到 \`id < ?\` 的位置开始取 20 行，成本 O(1)，与页深无关。**代价是不能跳页**，只能「下一页」。

#### 两种分页的取舍
| | OFFSET | 游标 |
| :--- | :--- | :--- |
| 跳页 | ✅ | ❌ |
| 深页性能 | ❌ O(n) | ✅ O(1) |
| 数据变动时稳定性 | 会重复/漏 | 稳定 |
| 实现复杂度 | 低 | 中 |

**家庭账本的现实**：一个月几百条，\`OFFSET\` 完全够。但接口设计上要预留 \`cursor\` 参数，等数据量真的上来再切，不用改前端契约。

#### 预留设计
\`\`\`go
type ListQuery struct {
    Limit  int
    Offset int
    Cursor string   // 预留：base64("2026-10-19|42")
}
// 响应里带上 next_cursor，客户端下次原样回传
type Page[T any] struct {
    Items      []T    \`json:"items"\`
    Total      int64  \`json:"total"\`
    NextCursor string \`json:"next_cursor,omitempty"\`
}
\`\`\`

#### 游标要编码，不要直接暴露 SQL 条件
\`\`\`go
func encodeCursor(date string, id int64) string {
    return base64.RawURLEncoding.EncodeToString([]byte(fmt.Sprintf("%s|%d", date, id)))
}

func decodeCursor(s string) (string, int64, error) {
    b, err := base64.RawURLEncoding.DecodeString(s)
    if err != nil { return "", 0, err }
    parts := strings.SplitN(string(b), "|", 2)
    if len(parts) != 2 { return "", 0, errors.New("bad cursor") }
    id, err := strconv.ParseInt(parts[1], 10, 64)
    return parts[0], id, err
}
\`\`\`
为什么要编码：
1. 客户端不该看到、也不该构造排序键的内部结构。
2. 以后换排序字段（改成按金额排序）时，游标格式可以变而不破坏契约。
3. 但要**校验解码结果**——客户端会传垃圾字符串，\`base64\` 成功不代表内容是合法的。

#### 同时传 \`offset\` 和 \`cursor\` 怎么办
必须定规则，否则行为不确定：
\`\`\`go
if q.Cursor != "" {
    // 游标优先，忽略 offset
} else {
    // 用 offset
}
\`\`\`
**接口文档里写清楚「cursor 优先」**，并在响应里回显实际使用的分页方式（或直接不返回 \`total\`，避免前端误算页数）。

#### 游标分页下 \`total\` 会变贵
因为要「下一页」很快，但「总共多少条」仍然要 \`COUNT(*)\` 全表统计。数据量大时，这个 count 比取数据本身还慢。

三个选择：
- 保留 \`COUNT(*)\`，接受成本（家庭账本没问题）。
- 只在第一页返回 \`total\`，后续页返回空。
- 用近似值（\`EXPLAIN\` 的 row estimate），不精确但快。

**知道这个取舍，比背「游标分页更快」有用。**

#### 判据
\`\`\`sql
EXPLAIN QUERY PLAN SELECT * FROM entries ORDER BY id LIMIT 20 OFFSET 50000;
-- 观察是否出现 "SCAN" 而非 "SEARCH ... USING INDEX"
\`\`\`
能解释「为什么游标分页不会随页深变慢」，今天就过。

::q \`OFFSET 100000 LIMIT 20\` 为什么会慢？慢在哪一步？
::a 数据库必须按排序顺序产生前 100020 行，然后丢弃前 100000 行，只返回最后 20 行。丢弃的动作本身要读取索引/数据行，成本与 offset 成正比。所以是「扫描成本」而不是「返回成本」导致慢。
::q 游标分页为什么不能跳页？
::a 因为游标是「上一页最后一条记录的位置」，只能据此往后取。要跳到第 50 页，必须知道第 49 页末尾的位置，而那个位置无法从 \`page=50\` 直接算出。这是用「不能随机访问」换「恒定成本」。
::q 数据在翻页期间被插入，OFFSET 分页会出现什么现象？
::a 会出现重复或遗漏：新记录插到前面时，后续页的 offset 整体后移，导致某条记录在两页都出现；删除则导致某条被跳过。游标分页基于稳定位置，不受这种位移影响。

<!--day 17 | light-->
#### 回归脚本：把 curl 变成可重复的检查
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
BASE=\${BASE:-http://localhost:8080}

# 1. 健康
curl -fsS "$BASE/ledger?limit=1" > /dev/null

# 2. 创建
ID=$(curl -fsS -X POST "$BASE/ledger" \\
  -H 'Content-Type: application/json' \\
  -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}' | jq -r '.data.id')

# 3. 读回
curl -fsS "$BASE/ledger/$ID" | jq -e '.data.amount == 3550' > /dev/null

# 4. 404
code=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/ledger/99999999")
[ "$code" = "404" ] || { echo "expected 404, got $code"; exit 1; }

echo "all checks passed"
\`\`\`
\`-f\` 让 curl 在 4xx/5xx 时返回非零，\`set -e\` 让脚本立即失败。**没有这两点，脚本永远「通过」**。

#### 脚本要放在仓库里
\`scripts/smoke.sh\`，每次改完跑一遍。它的价值不在今天，在阶段四加认证、阶段五改 GORM 之后——那时你会改到很多共享代码，一个 20 行的脚本能挡住大部分回归。

::q 为什么 \`curl\` 要加 \`-f\`？
::a \`-f\`（fail）让 curl 在 HTTP 状态码 >= 400 时返回非零退出码，配合 \`set -e\` 脚本会立即失败。不加的话 curl 对 500 也返回 0，脚本永远显示「通过」，完全失去回归价值。
::q 这个 smoke 脚本在后续阶段最大的价值是什么？
::a 它把「接口行为」固化成了可执行断言。阶段四加认证后所有接口都需要 token，阶段五换 GORM 后 SQL 行为可能微变，这些改动都可能悄悄破坏某个边界；脚本能在几秒内告诉你哪条断了。

<!--day 18 | light-->
#### 阶段验收清单（逐条打勾，不许「差不多」）
\`\`\`bash
# 1. 创建两笔
curl -s -X POST localhost:8080/ledger -d '{"amount":3550,"category":"餐饮","date":"2026-10-19"}'
curl -s -X POST localhost:8080/ledger -d '{"amount":1200,"category":"交通","date":"2026-10-19"}'
# 2. 重启进程
# 3. 两笔都在
curl -s 'localhost:8080/ledger?limit=20' | jq '.data.total'    # 2
# 4. 分页生效
curl -s 'localhost:8080/ledger?limit=1&offset=1' | jq '.data.items | length'  # 1
# 5. summary 正确
curl -s 'localhost:8080/summary?month=2026-10' | jq '.data.total'  # 4750
\`\`\`

#### 复盘：三个阶段各自留下了什么资产
| 阶段 | 留下的东西 | 后面怎么用 |
| :--- | :--- | :--- |
| 一 | 错误包装、切片语义、连接生命周期 | 阶段五 500/404 分流、GORM 连接池 |
| 二 | 竞态模型、context 传播 | 阶段五 请求级 ctx、阶段六 优雅关闭 |
| 三 | 统一信封、中间件、错误地图 | 阶段四 认证中间件、阶段六 CSRF |

**这张表不是总结，是依赖关系。** 任何一项没打牢，后面都会以「奇怪的 bug」形式回来找你。

::q 到阶段三结束时，API 已经能被 Vue 调用，此时最缺的是什么？
::a 认证与数据隔离。任何人只要知道地址就能读写全部账目，也没有「这笔账属于谁」的概念。这是阶段四要解决的，也是从「能跑」到「能用」的分界线。
::q 为什么要在进入下一阶段前做一次完整回归？
::a 因为接下来要重构（加认证中间件、换 GORM），重构的前提是有可信的行为基线。基线不存在时，任何异常都无法判断是「新引入的 bug」还是「本来就这样」。
`,df=`<!--day 1 | core-->
#### 密码不能加密，只能哈希
「加密」意味着可解密，只要密钥泄漏就全盘皆输。密码存储只能用**单向哈希**：验证时把用户输入再哈希一次，比较结果。

但普通哈希（SHA-256）也不行——它太快了。现代 GPU 每秒能算几十亿次 SHA-256，一个 8 位密码的哈希库几个小时内就能暴力破解完。所以密码哈希必须**故意慢**，并且**每个用户加盐**。

#### 三种攻击，三个对应设计
| 攻击 | 手段 | 防御 |
| :--- | :--- | :--- |
| 彩虹表 | 预计算 hash→明文 表 | 每用户唯一盐值 |
| 暴力枚举 | 高速 GPU 试密码 | 慢哈希 + 参数可调 |
| 撞库 | 拿到别的站密码库 | 慢哈希 + 限流 + 不存明文 |

**盐值不需要保密**，它和哈希一起存。它的作用是让「同一个密码」在不同用户那里产生不同哈希，从而让预计算表失效。

#### 为什么首选 Argon2id
Argon2 是密码哈希竞赛（PHC）的获胜者，\`id\` 是混合模式：先用 \`Argon2i\` 的抗侧信道特性填充内存，再用 \`Argon2d\` 的抗 GPU 特性计算。它的关键优势是**内存硬（memory-hard）**：每次计算需要占用大量内存，GPU 的并行优势被内存带宽卡死。

OWASP 2025 推荐参数：
\`\`\`
m = 64 MiB   (内存)
t = 3        (迭代次数)
p = 4        (并行度)
\`\`\`
目标：**单次哈希 150–250ms**。太慢会让登录接口被拖死（还可被用来做 DoS），太快则防护不足。

内存受限环境（小内存 VPS、容器限 128MB）退回 OWASP 最小值：
\`\`\`
m = 19 MiB, t = 2, p = 1
\`\`\`

#### bcrypt 是合格的备选，但有两个硬限制
\`\`\`go
hash, _ := bcrypt.GenerateFromPassword([]byte(pw), 12)
\`\`\`
1. **cost 必须显式写 12**，不要用 \`bcrypt.DefaultCost\`（当前是 10，偏低，而且会随版本变化）。
2. **输入最长 72 字节**，超出部分被静默截断。长密码要先 SHA-256 再 base64 再交给 bcrypt，否则「前 72 字节相同的两个密码」等价。

#### 判据
写一个基准测试，确认单次哈希落在 150–250ms：
\`\`\`go
func BenchmarkHash(b *testing.B) {
    for i := 0; i < b.N; i++ {
        hashPassword("correct horse battery staple")
    }
}
// go test -bench=Hash -benchtime=10x
\`\`\`
如果只有 20ms，说明参数太低；超过 500ms，说明服务器扛不住并发登录。

::q 为什么不能用 SHA-256 存密码？
::a SHA-256 设计目标是快，GPU 每秒可算数十亿次，暴力破解 8 位密码的成本极低。密码哈希需要「故意慢」且「内存硬」，才能让每次尝试都昂贵，把暴力破解的可行性降到可接受范围。
::q 盐值需要保密吗？它的作用是什么？
::a 不需要保密，和哈希一起存即可。作用是让相同密码产生不同哈希，使预计算的彩虹表失效，并防止「一次破解、多处通用」。攻击者只能针对单个用户逐个暴力破解，成本大幅上升。
::q Argon2id 相比 bcrypt 的核心优势是什么？
::a 内存硬。bcrypt 只消耗 CPU，GPU/ASIC 可以大规模并行；Argon2id 每次计算要占用几十 MB 内存，并行规模被内存带宽限制。同时它的参数（内存、迭代、并行度）更细粒度，能按硬件能力调整。

<!--day 2 | core-->
#### 编码格式要自带参数，否则以后改不了
\`\`\`go
// PHC 字符串格式
// $argon2id$v=19$m=65536,t=3,p=4$<salt-b64>$<hash-b64>
\`\`\`
**把参数写进哈希串**，验证时从串里解析出来。这样以后提高参数，老用户的密码仍能用旧参数验证，下次登录时再按新参数重算（渐进式升级）。如果把参数写死在代码常量里，改一次就会让所有老用户无法登录。

\`\`\`go
func hashPassword(pw string) (string, error) {
    salt := make([]byte, 16)
    if _, err := rand.Read(salt); err != nil {
        return "", fmt.Errorf("read salt: %w", err)
    }
    // 参数：64MiB, t=3, p=4, keyLen=32
    h := argon2.IDKey([]byte(pw), salt, 3, 64*1024, 4, 32)
    return fmt.Sprintf("$argon2id$v=%d$m=%d,t=%d,p=%d$%s$%s",
        argon2.Version, 64*1024, 3, 4,
        base64.RawStdEncoding.EncodeToString(salt),
        base64.RawStdEncoding.EncodeToString(h)), nil
}
\`\`\`
用 \`base64.RawStdEncoding\`（不带 \`=\` 填充），因为 PHC 格式里的 \`$\` 是分隔符，填充符会带来歧义。

#### 验证必须用恒定时间比较
\`\`\`go
func verifyPassword(pw, encoded string) (bool, error) {
    parts := strings.Split(encoded, "$")
    if len(parts) != 6 || parts[1] != "argon2id" {
        return false, fmt.Errorf("invalid hash format")
    }
    var m uint32
    var t uint32
    var p uint8
    if _, err := fmt.Sscanf(parts[3], "m=%d,t=%d,p=%d", &m, &t, &p); err != nil {
        return false, fmt.Errorf("parse params: %w", err)
    }
    salt, err := base64.RawStdEncoding.DecodeString(parts[4])
    if err != nil { return false, err }
    want, err := base64.RawStdEncoding.DecodeString(parts[5])
    if err != nil { return false, err }

    got := argon2.IDKey([]byte(pw), salt, t, m, p, uint32(len(want)))
    return subtle.ConstantTimeCompare(got, want) == 1, nil
}
\`\`\`
**\`subtle.ConstantTimeCompare\`** 而不是 \`bytes.Equal\`：后者在第一个不同字节就返回，比较耗时随匹配前缀长度变化，理论上可被计时攻击推断哈希。密码比较必须恒定时间。

#### 三个必须避免的写法
1. 明文或 MD5/SHA1 存库——直接不合格。
2. 固定盐（全局一个 salt）——等于没有盐。
3. 把哈希和密码一起返回给前端——\`json:"-"\` 或独立 DTO。

#### 判据
\`\`\`go
h1, _ := hashPassword("same-password")
h2, _ := hashPassword("same-password")
fmt.Println(h1 == h2)   // false（盐不同）

ok, _ := verifyPassword("same-password", h1)   // true
ok, _ = verifyPassword("wrong", h1)            // false
\`\`\`

::q 为什么参数要编码进哈希字符串，而不是写在代码常量里？
::a 因为参数会随硬件升级而调整。写进字符串后，老哈希仍能用它自己的参数验证，新密码用新参数，实现平滑升级；写死在代码里则一改参数全体用户无法登录。这是密码存储必须遵守的向前兼容设计。
::q \`bytes.Equal\` 比较哈希为什么不够安全？
::a 它在遇到第一个不同字节时立刻返回，比较耗时与「匹配前缀长度」相关。攻击者可以通过大量请求测量时间差，逐字节推断出正确哈希（理论上可行，实践中需要极稳定的环境）。\`subtle.ConstantTimeCompare\` 无论内容如何都比较完全部字节。
::q 同一个密码两次哈希结果不同，会不会导致登录失败？
::a 不会。验证时从存储的字符串里取出盐值，用同样的参数重新计算，再比较哈希。盐值随哈希一起存，所以能复现。这也说明「哈希不同」正是盐生效的证据。

<!--day 3 | normal-->
#### cost 是「时间成本」，不是安全等级
\`\`\`go
const cost = 12
hash, err := bcrypt.GenerateFromPassword([]byte(pw), cost)
err = bcrypt.CompareHashAndPassword(hash, []byte(pw))
\`\`\`
cost=12 意味着 2^12 = 4096 轮。每加 1，耗时翻倍。现代服务器上 cost=12 大约 200–300ms，符合目标区间。

**显式写 12 的理由**：\`bcrypt.DefaultCost\` 是 10，约 50–80ms，偏低；而且默认值可能随库版本变化，导致你的安全基线悄悄漂移。

#### 72 字节限制不能忽略
\`\`\`go
// 超过 72 字节被静默截断
bcrypt.GenerateFromPassword([]byte(strings.Repeat("a", 100)), 12)
\`\`\`
两个前 72 字节相同的密码会被判为同一个。修复方式（bcrypt 官方推荐）：
\`\`\`go
sum := sha256.Sum256([]byte(pw))
pw64 := base64.StdEncoding.EncodeToString(sum[:])   // 44 字节，稳定
bcrypt.GenerateFromPassword([]byte(pw64), cost)
\`\`\`
注意：这个预处理**必须固定**，一旦上线就不能改，否则所有密码失效。

#### 迁移路径：从 bcrypt 到 Argon2id
1. 验证时先看哈希前缀（\`$2a$\` → bcrypt，\`$argon2id$\` → Argon2）。
2. 用对应算法验证。
3. 验证成功后，若算法过时，立即用新算法重算并更新库。
4. 长期不登录的用户保持旧哈希，不影响使用。

**这个模式叫「登录时重哈希」，是密码算法升级的唯一平滑路径。**

#### 成本参数怎么定：从目标耗时反推
不要凭感觉选 cost。步骤：
\`\`\`go
for c := 10; c <= 14; c++ {
    start := time.Now()
    bcrypt.GenerateFromPassword([]byte("benchmark-password"), c)
    fmt.Printf("cost=%d %v\\n", c, time.Since(start))
}
\`\`\`
在**目标部署机器**上跑，选落在 150–250ms 的最小 cost。开发机通常比家庭服务器快 3–5 倍，在 MacBook 上测出的 200ms，到小主机上可能变成 800ms——登录会明显变慢。

#### 并发下的现实问题
每次登录要占 200ms CPU。如果同时有 10 个登录请求，就需要 2 秒的 CPU 时间。家庭账本无所谓，但要知道：**慢哈希会把「登录接口」变成最容易被打的资源**。这也是为什么阶段六要把限流放在认证之前。

#### 判据
\`\`\`go
start := time.Now()
bcrypt.GenerateFromPassword([]byte("x"), 12)
fmt.Println(time.Since(start))   // 150–300ms
\`\`\`
跑 10 次取中位数，确认没有抖动到 1s 以上（否则并发登录会排队）。

::q 为什么不用 \`bcrypt.DefaultCost\`？
::a 它的当前值是 10，约 50–80ms，低于 OWASP 建议的 150ms 下限；而且默认值属于库的实现细节，升级库版本可能变化，你会在不知情的情况下改变安全基线。显式写常数才能被 review 和测试。
::q bcrypt 的 72 字节截断会造成什么实际问题？
::a 两个前 72 字节相同、后面不同的密码会被认为是同一个，用户以为自己设了长密码但实际只有前 72 字节生效。修复是先做 SHA-256 再 base64（固定 44 字节）后交给 bcrypt，但这个预处理一旦上线不可更改。
::q 「登录时重哈希」解决了什么问题？
::a 它让算法和参数可以升级而不用强制所有用户改密码：老哈希继续能验证，验证成功的那一刻用新算法重算并覆盖。这样存量用户在自然登录过程中逐步迁移，不需要一次性迁移窗口。

<!--day 4 | normal-->
#### 表设计：约束写在数据库里，不只写在代码里
\`\`\`sql
CREATE TABLE users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    created_at    TEXT    NOT NULL
);
CREATE UNIQUE INDEX idx_users_email ON users(email);
\`\`\`
**\`UNIQUE\` 是并发安全的最后一道防线。** 「先查邮箱是否存在，再插入」这个流程在两个并发请求下都能查到「不存在」，然后都插入成功。只有数据库的唯一约束能真正拦住。

所以注册接口的正确写法是：
\`\`\`go
_, err := db.ExecContext(ctx, \`INSERT INTO users (email, password_hash, created_at) VALUES (?,?,?)\`, ...)
if isUniqueViolation(err) {
    return ErrEmailTaken
}
\`\`\`
而不是先 SELECT 再 INSERT。

#### 邮箱规范化
\`\`\`go
email = strings.ToLower(strings.TrimSpace(email))
\`\`\`
不规范化会导致 \`A@x.com\` 和 \`a@x.com\` 被当成两个账号，用户自己都记不清注册的是哪个。注意：只在存储和比较时规范化，展示时保留原样（如果要保留大小写，就额外存一列 \`email_display\`）。

#### 识别唯一约束冲突
\`\`\`go
func isUniqueViolation(err error) bool {
    if err == nil { return false }
    msg := err.Error()
    return strings.Contains(msg, "UNIQUE constraint failed") ||
           strings.Contains(msg, "constraint failed: UNIQUE")
}
\`\`\`
SQLite 的错误是字符串，不同驱动措辞略有差异。**这类字符串判断要集中在一个函数里**，将来换 Postgres（有 \`SQLSTATE 23505\`）只改这一处。

#### 判据
\`\`\`sql
INSERT INTO users (email, password_hash, created_at) VALUES ('a@x.com','h','2026-10-19');
INSERT INTO users (email, password_hash, created_at) VALUES ('a@x.com','h','2026-10-19');
-- 第二条必须报 UNIQUE constraint failed
\`\`\`
再用两个并发请求打注册接口，只有一个成功。

::q 「先查邮箱是否存在，再插入」为什么不可靠？
::a 存在 TOCTOU 竞态：两个并发请求可能同时查到「不存在」，然后都执行插入。数据库的唯一约束才是原子性的保证。正确做法是直接 INSERT 并捕获唯一冲突错误，把它转成业务错误。
::q 邮箱为什么要统一转小写？
::a 因为用户会把 \`A@x.com\` 和 \`a@x.com\` 当作同一个邮箱，若不规范化就会注册出两个账号，后续登录、找回密码都会混乱。规范化的时机应在入库前，比较时也用小写。
::q 把「唯一约束冲突」的判断写成字符串匹配，风险是什么？
::a 依赖驱动的错误文案，换驱动或升级版本可能失效，导致冲突被当成 500。缓解办法是集中在单个函数里，并为它写测试；换数据库时只需改这一处（Postgres 可用 SQLSTATE 判断）。

<!--day 5 | normal-->
#### 注册的四步：规范化 → 校验 → 哈希 → 插入
\`\`\`go
func (s *Service) Register(ctx context.Context, email, pw string) (int64, error) {
    email = strings.ToLower(strings.TrimSpace(email))
    if !strings.Contains(email, "@") {
        return 0, &ValidationError{Field: "email", Msg: "格式不正确"}
    }
    if len(pw) < 10 {                     // 长度优先于复杂度
        return 0, &ValidationError{Field: "password", Msg: "至少 10 位"}
    }

    hash, err := hashPassword(pw)
    if err != nil { return 0, fmt.Errorf("hash: %w", err) }

    id, err := s.store.CreateUser(ctx, email, hash)
    if errors.Is(err, store.ErrDuplicate) {
        return 0, ErrEmailTaken
    }
    return id, err
}
\`\`\`

#### 为什么「长度优先于复杂度」
NIST SP 800-63B 明确建议：**要求长度，不要求大小写+数字+符号的混合**。强制混合会让人写出 \`Passw0rd!\` 这种可预测的密码，而 16 位纯小写短语的熵高得多。也不要做定期强制改密（会催生 \`Passw0rd1\` → \`Passw0rd2\`）。

#### 注册接口的返回
- 成功：\`201\`，返回 \`{id, email}\`，**绝不返回 hash**。
- 邮箱已存在：\`409 Conflict\`，\`code=EMAIL_TAKEN\`。
  - 更严格的隐私考虑是不暴露「邮箱是否已注册」，但那会牺牲用户体验。家庭内网场景可以直接返回 409。

#### 不该在注册里做的事
- 不要「注册成功自动登录」——把签发 token 的逻辑耦合进来，测试会变复杂。让前端再调一次 \`/login\`。
- 不要在注册时校验「密码不含邮箱前缀」，规则越奇葩越容易被绕过。

#### 判据
\`\`\`bash
curl -i -X POST localhost:8080/register -d '{"email":"a@x.com","password":"correct horse battery"}'
# 201
curl -i -X POST localhost:8080/register -d '{"email":"A@X.com","password":"correct horse battery"}'
# 409（规范化生效）
\`\`\`
第二条必须是 409，否则说明大小写没统一。

::q 为什么密码规则更该要求长度而不是大小写+符号混合？
::a 强制混合会诱导用户产生可预测的变形（\`Password1!\`），实际熵不高；而长短语（如四个随机单词）熵更高且更好记。NIST 800-63B 因此建议以长度为主，并禁止强制定期改密。
::q 注册成功为什么不该顺便签发 token？
::a 会把「账号创建」和「会话建立」两个关注点耦合在一起：测试注册要连带验证 JWT，改认证方案要动注册逻辑，也无法单独支持「注册后要求邮箱验证再登录」的流程。分开更清晰。
::q 返回 409 而不是 400，差别在哪？
::a 409 表示「请求与服务器当前状态冲突」（邮箱已被占用），400 表示「请求本身格式错误」。前端可以据此给出不同提示（提示登录 vs 提示改格式），监控上也能区分用户行为与参数错误。

<!--day 6 | core-->
#### 登录必须做的事：统一错误、恒定时间、不区分账号密码
\`\`\`go
func (s *Service) Login(ctx context.Context, email, pw string) (string, error) {
    email = strings.ToLower(strings.TrimSpace(email))
    u, err := s.store.FindUserByEmail(ctx, email)
    if errors.Is(err, store.ErrNotFound) {
        // 仍然跑一次哈希，抹平时间差
        _, _ = verifyPassword(pw, dummyHash)
        return "", ErrInvalidCredentials
    }
    if err != nil { return "", fmt.Errorf("find user: %w", err) }

    ok, err := verifyPassword(pw, u.PasswordHash)
    if err != nil || !ok {
        return "", ErrInvalidCredentials
    }
    return s.issueToken(u.ID, u.Email)
}
\`\`\`
三个关键点：

1. **统一错误 \`ErrInvalidCredentials\`**。区分「用户不存在」和「密码错误」等于给攻击者一个账号枚举接口。
2. **用户不存在时也跑一次哈希**。否则「不存在」立即返回、「存在」要 200ms，攻击者靠响应时间就能枚举账号。这叫**时间侧信道**。
3. **\`dummyHash\`** 是一个预先算好的合法哈希串，用来消耗同样的时间。

#### 会话建立后的两件事
\`\`\`go
// 1. 记录登录审计（可选但有用）
s.store.LogLogin(ctx, u.ID, r.RemoteAddr, time.Now())

// 2. 签发 token（阶段六改为 HttpOnly Cookie）
token, err := s.issueToken(u.ID, u.Email)
\`\`\`

#### 限流是登录接口的必需品
即使哈希很慢，攻击者仍可以高频打接口。最低限度：**同一 IP + 同一邮箱，连续失败 5 次后延迟递增（指数退避），或锁定 15 分钟。** 阶段六会讲限流中间件的位置，现在至少要知道「没有限流 = 慢哈希只是让攻击变慢，而不是不可行」。

#### 判据
\`\`\`bash
time curl -s -X POST localhost:8080/login -d '{"email":"nobody@x.com","password":"whatever"}'
time curl -s -X POST localhost:8080/login -d '{"email":"a@x.com","password":"wrong"}'
\`\`\`
两次耗时应当在同一量级（相差不超过 2 倍），且都返回同样的 \`code=INVALID_CREDENTIALS\`。

::q 为什么「用户不存在」时还要跑一次密码哈希？
::a 为了让两条路径耗时接近。如果「不存在」立即返回、「存在但密码错」要 200ms，攻击者仅凭响应时间就能判断账号是否注册，形成账号枚举漏洞。跑一次 dummy 哈希可以抹平这个差异。
::q 登录失败为什么统一返回「邮箱或密码错误」？
::a 区分两者会让攻击者先枚举出有效邮箱，再进行针对性爆破。统一错误把「账号是否存在」这个信息隐藏起来。代价是用户体验略差（不知道是哪个错），这是安全与体验的常见取舍。
::q 有了 200ms 的慢哈希，还需要限流吗？
::a 需要。慢哈希只是把单次尝试的成本提高，攻击者仍可并发发起大量请求（尤其分布式），还可能借登录接口消耗服务器 CPU 做 DoS。限流控制的是「单位时间尝试次数」，与单次成本互补。

<!--day 7 | core-->
#### JWT 的三个部分，以及「为什么不能放敏感信息」
\`\`\`
header.payload.signature
\`\`\`
- header：\`{"alg":"HS256","typ":"JWT"}\`，base64url 编码，**明文可读**。
- payload：claims，base64url 编码，**明文可读**（任何人拿到 token 都能解出内容）。
- signature：用密钥对 \`header.payload\` 签名，防篡改。

**关键认知：JWT 是签名，不是加密。** 放进去的 \`user_id\`、\`email\` 谁都能看到，所以绝不放密码、手机号、身份证。

#### 签发
\`\`\`go
type Claims struct {
    UserID int64  \`json:"uid"\`
    Email  string \`json:"email"\`
    jwt.RegisteredClaims
}

func (s *Service) issueToken(uid int64, email string) (string, error) {
    now := time.Now()
    claims := Claims{
        UserID: uid,
        Email:  email,
        RegisteredClaims: jwt.RegisteredClaims{
            Subject:   strconv.FormatInt(uid, 10),
            IssuedAt:  jwt.NewNumericDate(now),
            ExpiresAt: jwt.NewNumericDate(now.Add(2 * time.Hour)),
            Issuer:    "family-ledger",
        },
    }
    tok := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
    return tok.SignedString([]byte(s.secret))
}
\`\`\`
claims 用结构体而不是 \`map[string]any\`：类型安全、能统一校验 \`exp\`。

#### 有效期与刷新
- **access token 短（15 分钟–2 小时）**：泄漏后的窗口可控。
- **refresh token 长（7–30 天）**，只存哈希在库里，可吊销。
- 家庭账本可以简化：2 小时 access + 重新登录。**但要明确这是一个取舍**，不是「不需要刷新」。

#### 密钥管理
\`\`\`go
secret := os.Getenv("JWT_SECRET")
if len(secret) < 32 {
    log.Fatal("JWT_SECRET 必须至少 32 字节")
}
\`\`\`
- **不写死在代码或配置文件里**，走环境变量 / secrets。
- 长度至少 32 字节（HS256 的密钥强度应不低于哈希输出）。
- 启动时校验，**缺失就退出**，不要用默认值兜底——默认密钥等于没有密钥。

#### 判据
把 token 贴到 jwt.io 或本地解码，能看到 \`uid\`、\`exp\`；把 payload 改一位再请求，签名验证必须失败。

::q JWT 的 payload 是加密的吗？
::a 不是，只是 base64url 编码，任何人可解。安全性来自签名（防篡改），不来自保密。所以 payload 里不能放密码、手机号、身份证等敏感信息；需要保密就得用 JWE（加密 JWT），成本更高。
::q \`HS256\` 和 \`RS256\` 该怎么选？
::a 单一服务自己签发自己验证，用 HS256（对称密钥）最简单。如果验证方是多个独立服务、不希望它们持有签发密钥，用 RS256（私钥签、公钥验）。家庭账本单服务，HS256 足够。
::q 为什么密钥缺失时应该启动失败，而不是用默认值？
::a 默认值意味着所有部署共用同一个公开密钥，任何人都能伪造合法 token，认证形同虚设。启动即失败能让配置错误在部署阶段暴露，而不是以「看起来正常但完全不安全」的方式上线。

<!--day 8 | core-->
#### 验证要检查的四个东西
\`\`\`go
func (s *Service) parseToken(raw string) (*Claims, error) {
    var claims Claims
    tok, err := jwt.ParseWithClaims(raw, &claims, func(t *jwt.Token) (any, error) {
        if t.Method.Alg() != jwt.SigningMethodHS256.Alg() {
            return nil, fmt.Errorf("unexpected alg: %s", t.Method.Alg())
        }
        return []byte(s.secret), nil
    })
    if err != nil { return nil, mapJWTError(err) }
    if !tok.Valid { return nil, ErrInvalidToken }
    return &claims, nil
}
\`\`\`
1. **签名** — 库自动验证。
2. **算法** — 必须显式校验！\`alg: none\` 攻击和 \`HS256↔RS256\` 混淆攻击都靠这里拦住。
3. **过期** — \`exp\` 由库自动检查（\`tok.Valid\`）。
4. **签发者/受众** — 多服务场景要校验 \`iss\` / \`aud\`，单服务可省。

#### 错误分类，决定返回什么状态码
\`\`\`go
func mapJWTError(err error) error {
    switch {
    case errors.Is(err, jwt.ErrTokenExpired):
        return ErrTokenExpired        // → 401 + code=TOKEN_EXPIRED
    case errors.Is(err, jwt.ErrTokenMalformed):
        return ErrInvalidToken        // → 401 + code=INVALID_TOKEN
    case errors.Is(err, jwt.ErrTokenSignatureInvalid):
        return ErrInvalidToken
    default:
        return ErrInvalidToken
    }
}
\`\`\`
**\`TOKEN_EXPIRED\` 要单独给码**：前端据此触发「静默刷新」或「跳登录」，而 \`INVALID_TOKEN\` 应当直接清空本地凭证。两者混在一起，前端只能一律跳登录，体验差。

#### 四个常见坑
1. **忘记校验算法** → \`alg: none\` 伪造通过（老库有漏洞，但自己的代码也常漏）。
2. **把 \`exp\` 当唯一失效手段** → 无法主动吊销。登出、改密码后旧 token 仍有效 2 小时。需要吊销就加 \`token_version\` 字段或黑名单。
3. **时间偏差** → 服务器与签发机时钟差几分钟会导致误判。用 NTP 同步，必要时给 \`leeway\`。
4. **把 token 放在 URL 里** → 会进浏览器历史、代理日志、Referer。只能放 Header 或 HttpOnly Cookie。

#### 判据
\`\`\`bash
# 篡改 payload 一位
curl -i -H "Authorization: Bearer <tampered>" localhost:8080/ledger
# 401 + code=INVALID_TOKEN

# 用过期 token
# 401 + code=TOKEN_EXPIRED
\`\`\`

::q 为什么必须显式校验 \`t.Method.Alg()\`？
::a 防止算法混淆攻击：攻击者把 header 的 alg 改成 \`none\` 或从 RS256 改成 HS256，诱导验证方用公钥当作 HMAC 密钥，从而伪造签名。只信任自己签发的算法，是 JWT 验证的必备步骤。
::q \`TOKEN_EXPIRED\` 和 \`INVALID_TOKEN\` 为什么要分成两个 code？
::a 前端处理方式不同：过期可以静默刷新或提示「登录已过期」，无效则必须清空本地凭证重新登录。合并成一个码会让前端无法区分，只能一律跳登录，交互变差。
::q JWT 签发后，用户改密码，旧 token 还有效吗？
::a 默认仍有效直到 \`exp\` 到期，因为验证只看签名和过期时间。要立即失效，需要在用户表加 \`token_version\`（签发时写进 claims，验证时比对），或维护吊销黑名单。这是无状态 token 的固有代价。

<!--day 9 | core-->
#### 中间件的职责边界
\`\`\`go
func WithAuth(svc *Service) func(http.Handler) http.Handler {
    return func(next http.Handler) http.Handler {
        return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
            raw := bearerToken(r)
            if raw == "" {
                Fail(w, http.StatusUnauthorized, "UNAUTHORIZED", "missing token")
                return
            }
            claims, err := svc.parseToken(raw)
            if err != nil {
                code, status := "INVALID_TOKEN", http.StatusUnauthorized
                if errors.Is(err, ErrTokenExpired) { code = "TOKEN_EXPIRED" }
                Fail(w, status, code, "invalid token")
                return
            }
            ctx := context.WithValue(r.Context(), userIDKey, claims.UserID)
            next.ServeHTTP(w, r.WithContext(ctx))     // 必须 WithContext
        })
    }
}

func bearerToken(r *http.Request) string {
    h := r.Header.Get("Authorization")
    const prefix = "Bearer "
    if len(h) <= len(prefix) || !strings.EqualFold(h[:len(prefix)], prefix) {
        return ""
    }
    return strings.TrimSpace(h[len(prefix):])
}
\`\`\`
中间件只做三件事：**提取 → 验证 → 注入 context**。不做业务判断（比如「这个用户能不能看这条账」——那属于数据隔离，在查询里做）。

#### 为什么用 \`strings.EqualFold\`
\`Bearer\` 大小写不敏感（RFC 6750）。用 \`==\` 比较会在某些客户端失败，表现为「token 明明传了却 401」。\`Bearer\` 后的**单个空格**也是常见错误点：\`Bearer  xxx\`（两个空格）会让 token 带上前导空格导致签名失败，\`TrimSpace\` 可以兜住。

#### 不该用中间件做的事
- 不要在中间件里查数据库取用户详情（每个请求一次查询，且拿不到就用不了）。需要时在 handler 里按 \`uid\` 查。
- 不要在中间件里做「权限分级」（admin/user）——那是独立的 \`WithRole\` 中间件，职责分离。
- 不要对 \`/login\`、\`/register\`、\`/healthz\` 套认证。**套错会导致登录接口要求登录**，这类 bug 很常见。

#### 路由分组
\`\`\`go
public := http.NewServeMux()
public.HandleFunc("POST /login", login(svc))
public.HandleFunc("POST /register", register(svc))
public.HandleFunc("GET /healthz", healthz)

protected := http.NewServeMux()
protected.HandleFunc("GET /ledger", listEntries(svc))
protected.HandleFunc("POST /ledger", createEntry(svc))

root := http.NewServeMux()
root.Handle("/", WithAuth(svc)(protected))   // 兜底：其余全部需要认证
root.Handle("/login", public)
\`\`\`
用「一个兜底认证 + 显式公开路径」的结构，比逐个路由套认证安全——**漏套的后果是裸奔，漏放的后果只是多一次 401。**

#### 判据
\`\`\`bash
curl -i localhost:8080/ledger                                # 401
curl -i -H "Authorization: Bearer x" localhost:8080/ledger   # 401 INVALID_TOKEN
curl -i -H "Authorization: Bearer $TOKEN" localhost:8080/ledger  # 200
curl -i -X POST localhost:8080/login -d '{...}'              # 不能被 401 拦住
\`\`\`

::q 认证中间件为什么不该查数据库加载用户详情？
::a 每个请求都多一次查询，且大多数 handler 只需要 \`user_id\`。更关键的是它把「认证」和「用户信息加载」耦合，一旦查询失败就变成 500 而不是 401。需要详情时在 handler 里按需查。
::q 为什么推荐「兜底认证 + 显式公开路径」的结构？
::a 默认安全：新加的路由自动受保护，漏配的后果是一个 401（明显、可测），而不是接口裸奔（隐蔽、危险）。反过来「默认公开、逐个加认证」一旦漏加，就是数据泄漏。
::q \`Authorization: Bearer  <token>\`（两个空格）会发生什么？
::a token 会带上前导空格，签名验证失败返回 401，但排查时很难看出是空格问题。用 \`strings.TrimSpace\` 处理掉，同时对前缀用 \`EqualFold\` 兼容大小写，能消除这类「明明传了却认证失败」的困扰。

<!--day 10 | normal-->
#### 从 context 取值的标准写法
\`\`\`go
type ctxKey struct{}

var userIDKey ctxKey

func userIDFrom(ctx context.Context) (int64, bool) {
    uid, ok := ctx.Value(userIDKey).(int64)
    return uid, ok
}

// handler 里
uid, ok := userIDFrom(r.Context())
if !ok {
    Fail(w, http.StatusUnauthorized, "UNAUTHORIZED", "no user in context")
    return
}
\`\`\`
要点：
- key 用**未导出的自定义类型**，别的包无法构造同名 key，杜绝撞键。
- 封装成 \`userIDFrom\` 函数，handler 不直接碰 \`ctx.Value\`，将来改存储方式只改一处。
- **必须判断 \`ok\`**。缺失时直接 panic 是常见事故。

#### 改造所有账本 handler
\`\`\`go
func listEntries(svc *ledger.Service) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        uid, ok := userIDFrom(r.Context())
        if !ok { Fail(w, 401, "UNAUTHORIZED", "no user"); return }

        items, total, err := svc.List(r.Context(), uid, ledger.ListQuery{...})
        if err != nil { writeError(w, r, err); return }
        OK(w, Page[ledger.Entry]{Items: items, Total: total, ...})
    }
}
\`\`\`
**注意 \`uid\` 的传递方向**：从 context 取出后作为**显式参数**传给 Service，而不是继续放在 ctx 里往下传。业务函数签名里出现 \`uid\` 是好事——它让「这个操作属于谁」可见、可测。

#### 为什么不在 Service 里直接读 ctx
\`\`\`go
// ❌ 隐式依赖，测试时必须伪造 ctx
func (s *Service) List(ctx context.Context) ([]Entry, error) {
    uid := ctx.Value(userIDKey).(int64)
}
\`\`\`
显式参数能编译期检查、能 mock、能读懂。context 只传「横切关注点」（取消、trace），业务参数一律走签名。

#### 判据
\`\`\`bash
# 用 A 的 token 请求，日志里 uid 应为 A 的 id
# 不传 token 的请求不应到达 handler（被中间件拦住）
\`\`\`
在 handler 里临时 \`log.Println(uid)\`，确认每次都是正确用户。

::q 为什么把 uid 从 context 取出来后要作为显式参数传给 Service？
::a 显式参数让依赖可见、可测试、可编译期检查。埋在 ctx 里的话，Service 的测试必须构造带值的 ctx，调用者也看不出这个方法依赖用户身份，容易漏传导致越权。
::q context key 为什么用未导出的自定义类型而不是字符串？
::a 字符串 key 在任何包里都能构造同名值，容易与其他库撞键导致读到错误的值。未导出的自定义类型只有本包能创建实例，天然唯一。这是 Go 官方推荐的实践。
::q handler 里不判断 \`ok\` 直接断言会怎样？
::a 类型断言 \`ctx.Value(k).(int64)\` 在值不存在（nil）时会 panic，导致 500 或进程崩溃。必须用双返回值形式判断 \`ok\`，缺失时返回 401。这是「认证中间件没套上」时唯一的兜底。

<!--day 11 | core-->
#### 数据隔离不是「加个 if」，是每条查询都必须带 user_id
\`\`\`go
// ❌ 只按 id 查：任何人改个 id 就能看别人的账
SELECT * FROM entries WHERE id = ?

// ✅ 同时限定归属
SELECT * FROM entries WHERE id = ? AND user_id = ?
\`\`\`
\`WHERE id = ? AND user_id = ?\` 是最重要的一行 SQL。**漏掉 user_id 的查询，就是越权漏洞**，而且它不会报错、不会崩，测试不覆盖就永远发现不了。

#### 三类必须改造的语句
\`\`\`sql
-- 查询单条
SELECT ... FROM entries WHERE id = ? AND user_id = ?;
-- 列表
SELECT ... FROM entries WHERE user_id = ? AND date LIKE ? ORDER BY date DESC;
-- 更新 / 删除
UPDATE entries SET amount = ? WHERE id = ? AND user_id = ?;
DELETE FROM entries WHERE id = ? AND user_id = ?;
\`\`\`
更新和删除尤其要检查 \`RowsAffected()\`：**返回 0 行通常意味着「ID 存在但不属于你」**，此时应该返回 404（而不是 403，避免暴露「这条记录存在」）。

#### 为什么不用「先查再判断」
\`\`\`go
e, _ := store.Get(ctx, id)        // 不带 user_id
if e.UserID != uid { return 403 } // 事后判断
\`\`\`
问题：
1. 多一次查询，且中间有 TOCTOU 窗口（虽然这里影响小）。
2. 忘了判断就全泄漏，而 SQL 里带上条件是**默认安全**。
3. 403 暴露了「这个 ID 存在」，可被用来探测。

**原则：把权限条件写进 WHERE，而不是写在 if 里。**

#### 用测试锁住它
\`\`\`go
func TestEntryIsolation(t *testing.T) {
    // A 创建一条
    idA, _ := svc.Create(ctxA, in)
    // B 用自己的 uid 去读
    _, err := svc.Get(ctxB, idA)
    if !errors.Is(err, ledger.ErrNotFound) {
        t.Fatalf("B 读到了 A 的数据: %v", err)
    }
}
\`\`\`
这个测试必须存在。**它是唯一能防止「后来某次重构漏加 user_id」的机制。**

#### 判据
\`\`\`bash
# A 登录拿 tokenA，创建一笔，记下 id
# B 登录拿 tokenB，请求 /ledger/{id}
curl -i -H "Authorization: Bearer $TOKEN_B" localhost:8080/ledger/<idA>
# 必须 404
\`\`\`
再跑 \`go test ./... -run Isolation\`，通过。

::q 越权访问应该返回 403 还是 404？
::a 通常返回 404。403 等于确认「这个资源存在，只是你没权限」，可被用来枚举 ID 探测数据量。404 把「不存在」和「不属于你」合并，不泄漏信息。除非业务明确需要告知用户「你无权访问他人的账本」。
::q 为什么「先查出来再判断 UserID」不如「SQL 里直接带 user_id」？
::a SQL 带条件是默认安全：漏写逻辑分支不会导致泄漏，而是查不到数据。事后判断则依赖每个调用点都记得写 if，一旦遗漏就是漏洞，而且没有任何编译或运行时提示。此外还能少一次查询、避免 403 泄漏存在性。
::q 更新语句 \`RowsAffected() == 0\` 说明什么？
::a 说明没有行被更新：ID 不存在，或者存在但不属于当前用户。业务上应统一返回 404，而不是「更新成功」。这个信号是数据隔离的第二道检查——即使 WHERE 写对了，也能通过影响行数发现异常。

<!--day 12 | normal-->
#### 三条防线，防止密码哈希泄漏到响应
1. **结构体打标签**：\`PasswordHash string \\\`json:"-"\\\`\` —— 最省事，但容易被「复制结构体到 DTO」时忘掉。
2. **独立 DTO**：响应结构体里根本没有这个字段 —— 最可靠。
3. **测试断言**：\`if strings.Contains(body, "password") { t.Fatal }\` —— 兜底。

推荐 2 + 3：DTO 保证「不可能泄漏」，测试保证「将来加字段时被发现」。

\`\`\`go
type UserDTO struct {
    ID    int64  \`json:"id"\`
    Email string \`json:"email"\`
}

func toDTO(u store.User) UserDTO {
    return UserDTO{ID: u.ID, Email: u.Email}
}
\`\`\`

#### 阶段验收（逐条执行）
\`\`\`bash
# 1. A 创建一笔
curl -s -X POST localhost:8080/ledger -H "Authorization: Bearer $A" -d '{...}'
# 2. B 登录看不到
curl -s localhost:8080/ledger -H "Authorization: Bearer $B" | jq '.data.total'   # 0
# 3. 无 token 401
curl -i localhost:8080/ledger
# 4. 任何响应无密码哈希
curl -s localhost:8080/login -d '{"email":"a@x.com","password":"..."}' | grep -i "password\\|\\$argon2" || echo "clean"
\`\`\`

#### 复盘：这 12 天建立的安全模型
| 威胁 | 防御 |
| :--- | :--- |
| 拖库后还原密码 | 慢哈希 + 唯一盐 |
| 账号枚举 | 统一错误 + 恒定时间 |
| token 伪造 | 签名 + 算法白名单 |
| 越权读写 | 每条 SQL 带 user_id |
| 信息泄漏 | DTO + 响应不含敏感字段 |

任何一条缺失，整个模型就有缺口。**安全不是「做了几项」，是「没有短板」。**

#### 泄漏往往不是「忘了加标签」，而是「复制结构体」
最常见的路径：
\`\`\`go
// 某天为了省事，直接把 store 层的结构体返回了
func (h *Handler) me(w http.ResponseWriter, r *http.Request) {
    u, _ := h.svc.GetUser(r.Context(), uid)
    OK(w, u)          // ❌ u 里有 PasswordHash
}
\`\`\`
\`store.User\` 上有 \`json:"-"\` 的话这里侥幸没事，但只要有人为了调试把它改成 \`json:"password_hash"\`，或者新建了一个 DTO 又复制了所有字段，泄漏就发生了。

**防线是「响应结构里不存在这个字段」**，而不是「记得别序列化它」。所以 \`UserDTO\` 只声明 \`ID\`/\`Email\` 两个字段，从类型上就排除了泄漏可能。

#### 验收脚本要检查响应体，不是只检查状态码
\`\`\`bash
curl -s "$BASE/login" -H 'Content-Type: application/json' \\
  -d '{"email":"a@x.com","password":"correct horse battery"}' \\
  | grep -Ei 'password|argon2|\\$2[aby]\\$' && { echo "泄漏了密码字段"; exit 1; } || echo clean
\`\`\`
正则要覆盖三种形态：字段名 \`password\`、Argon2 的 \`$argon2\`、bcrypt 的 \`$2a$\`。只查字段名的脚本会漏掉被塞进别的字段里的哈希。

::q 只靠 \`json:"-"\` 防止密码哈希泄漏，风险在哪？
::a 一旦有人为了让响应「复用」而把 \`User\` 结构体直接返回，或在别的 DTO 里嵌入了它，标签可能被绕过或遗忘。用独立 DTO 让响应结构里根本不存在该字段，是结构性的保证；再加一条测试断言作为回归防线。
::q 为什么说安全「不是做了几项，而是没有短板」？
::a 攻击者只走最短路径。做了慢哈希但允许账号枚举、或做了 JWT 但某条 SQL 漏了 user_id，整个防护就失效。安全是链式结构，强度等于最弱一环。
`,ff='<!--day 1 | normal-->\n#### 分层的目的是「改动只影响一层」\n```\ninternal/\n├── httpapi/     传输层：解析请求、写响应\n├── ledger/      领域层：业务规则 + 接口定义\n└── store/       存储层：SQL / GORM\n```\n依赖方向单向：`httpapi → ledger ← store`。注意 `store` 是**指向** `ledger`（实现它的接口），两者不互相依赖。\n\n判断分层是否成立的三个问题：\n1. 改 HTTP 状态码，需要动 SQL 吗？\n2. 换数据库，需要动 handler 吗？\n3. 写业务测试，需要起 HTTP 服务吗？\n\n三个都「不需要」才算分对了。有一个「需要」，说明边界漏了。\n\n#### 每层该放什么、不该放什么\n| 层 | 该放 | 不该放 |\n| :--- | :--- | :--- |\n| httpapi | JSON 编解码、状态码、中间件 | 金额校验规则、SQL |\n| ledger | 业务规则、事务边界、接口定义 | `net/http`、`gorm` |\n| store | SQL、GORM 调用、行→结构体 | 业务判断、错误文案 |\n\n**领域层不知道 HTTP 存在，也不知道 GORM 存在。** 这条守住了，前面说的三个问题才能都答「不需要」。\n\n#### 常见的错误分层\n- `models` 包被三层共用，里面既有 `gorm` tag 又有 `json` tag——领域对象被两个外部协议污染，最后必然冲突（比如 `json:"-"` 的密码字段又要存库）。\n- Service 接收 `*http.Request`——领域层依赖传输层，彻底倒挂。\n- store 里写业务规则（比如「金额必须为正」）——换个入口就绕过了。\n\n#### 判据\n```bash\ngo list -deps ./internal/ledger | grep -E "net/http|gorm.io"   # 必须为空\n```\n这条命令是分层的自动检测。有输出就说明领域层被污染。\n\n::q 为什么领域层不能导入 `net/http`？\n::a 领域逻辑应该能被 HTTP、CLI、定时任务等多种入口复用。导入 `net/http` 意味着规则和传输协议绑定，换入口要复制逻辑，也无法脱离 HTTP 单测。领域层只接受普通参数、返回普通错误。\n::q `go list -deps` 检查依赖能发现什么？\n::a 能发现「不该有的依赖」，比如领域层导入了 gorm 或 net/http。它把「分层」这条口头约定变成可执行检查，防止重构时悄悄越过边界。\n::q 为什么 `models` 大包共用是坏味道？\n::a 一个结构体同时被 HTTP 序列化、数据库映射、业务逻辑使用，任何一方的需求都会污染其他方：给 JSON 加字段会影响建表，改 tag 会影响 API 契约。最终只能靠互相妥协，字段越来越乱。按用途拆成 DTO / 领域对象 / 持久化模型，转换显式化。\n\n<!--day 2 | core-->\n#### 接口定义在领域层，实现留在存储层\n```go\n// internal/ledger/store.go\npackage ledger\n\nimport "context"\n\ntype Store interface {\n    CreateEntry(ctx context.Context, e Entry) (int64, error)\n    GetEntry(ctx context.Context, userID, id int64) (Entry, error)\n    ListEntries(ctx context.Context, q ListQuery) ([]Entry, int64, error)\n    SumByCategory(ctx context.Context, userID int64, month string) ([]CategorySum, error)\n    CreateUser(ctx context.Context, email, hash string) (int64, error)\n    FindUserByEmail(ctx context.Context, email string) (User, error)\n}\n```\n注意 `GetEntry` 的参数里有 `userID`——**数据隔离是接口契约的一部分**，不是实现细节。这样写不出来「忘了带 user_id」的查询。\n\n#### 手动依赖注入：main 就是接线图\n```go\nfunc main() {\n    cfg := config.MustLoad()\n    db := store.MustOpen(cfg.DBPath)\n    defer db.Close()\n\n    st := store.NewGorm(db)\n    svc := ledger.NewService(st, cfg.JWTSecret)\n    h := httpapi.NewRouter(svc, cfg)\n\n    srv := &http.Server{Addr: cfg.Addr, Handler: h}\n    ...\n}\n```\n四行，依赖关系一眼看完。**不需要 DI 框架**——Go 项目里手动注入就是主流做法，因为显式、可读、编译期检查。\n\n#### 什么时候该抽接口，什么时候不该\n- **该抽**：跨进程/跨存储的边界（数据库、外部 API、时钟、随机数）。这些是测试难点。\n- **不该抽**：纯函数、同包内的辅助逻辑。为它们造接口只会增加噪音。\n\n判据：**这个依赖在测试时需要替换吗？** 需要就抽接口，不需要就别抽。\n\n#### 判据\n```go\n// main 里加一行编译期断言\nvar _ ledger.Store = (*store.Gorm)(nil)\n```\n再写一个假实现，确认 `ledger.NewService(fake)` 能编译通过——说明 Service 真的只依赖接口。\n\n::q 为什么 `GetEntry` 的参数里要显式包含 `userID`？\n::a 让数据隔离成为接口契约的一部分。实现方拿不到 userID 就没法正确过滤，写错会编译失败；调用方也无法「忘记传」。把安全条件放进类型签名，比靠注释提醒可靠得多。\n::q 什么情况下不该为某个依赖抽接口？\n::a 测试时不需要替换的依赖不必抽。比如纯计算函数、标准库的时间格式化，抽接口只会增加一层间接和 mock 维护成本，收益为零。判断标准就是「测试需不需要替换它」。\n::q 手写依赖注入相比 DI 框架的优势是什么？\n::a 依赖关系全部显式写在 main 里，能被 grep、能被编译器检查，出问题一眼看到；框架靠反射和标签，出错时报错位置远离原因，学习与调试成本高。Go 项目规模通常不需要框架。\n\n<!--day 3 | normal-->\n#### 重构顺序：先建新壳，再搬逻辑，最后删旧的\n1. 新建 `internal/ledger`，定义 `Entry`、`Store` 接口、`Service`。\n2. 把 handler 里的校验逻辑搬进 `Service`（一次只搬一个方法）。\n3. 新建 `internal/store`，用 GORM 或原生 SQL 实现接口。\n4. `main` 改成装配新结构。\n5. 每搬完一个方法就跑一次 smoke 脚本。\n\n**不要一次性重写全部**。重构的核心是「每一步都可运行、可回滚」，一次性重写等于赌博。\n\n#### 每步都要有的保护\n```bash\n./scripts/smoke.sh      # 阶段三 D17 写的脚本\ngo test ./...           # 已有的测试\n```\n如果 smoke 挂了，立刻回到上一步，不要「先往下做，最后一起修」——那时的错误已经不在原地了。\n\n#### 搬运顺序：从「最独立」的方法开始\n先搬 `Create`（只依赖 store 的一个方法，没有分支），再搬 `List`（带分页参数），最后搬 `Update`/`Delete`（要处理 `RowsAffected`）。**每搬一个就跑一次 smoke**，不要攒着。\n\n判断某个 handler 是否搬干净了，看三件事：\n```bash\ngrep -n "sql\\.\\|db\\.Query\\|db\\.Exec" internal/httpapi/    # 应为空\ngrep -n "http\\." internal/ledger/                          # 应为空\ngrep -n "fmt.Sprintf("SELECT" -r internal/                 # 应为空（防拼接）\n```\n\n#### 重构中最容易出现的「隐性行为变化」\n- **错误语义变了**：原来 handler 里 `if err != nil { 500 }`，搬到 Service 后忘了把 `sql.ErrNoRows` 转成 `ErrNotFound`，于是「不存在」从 404 变成了 500。\n- **顺序变了**：原来先校验再查库，现在先查库再校验，多了一次无谓查询，还可能把「不存在」的错误提前暴露。\n- **默认值变了**：原来 handler 里 `limit` 缺省 20，搬到 Service 后没设默认，变成 0 → 返回空列表。\n\n这三类都不会导致编译失败，只能靠 smoke 和断言测试抓。**这也是为什么重构前必须先写验收脚本。**\n\n#### 判据\n重构完成后：\n```bash\ngit diff --stat        # 看清改了哪些文件\n./scripts/smoke.sh     # 全过\n```\n并且 `httpapi` 包里**不再出现任何 SQL 字符串**（`grep -r "SELECT" internal/httpapi` 应为空）。\n\n::q 为什么重构要「一次搬一个方法」而不是整体重写？\n::a 整体重写无法定位问题来源，一旦行为不一致，你面对的是几百行新代码而不是一处改动。逐步搬迁每步都能跑 smoke，出错时原因就在刚刚那一步，回滚成本也低。\n::q 重构过程中 smoke 脚本挂了，应该先继续还是先修？\n::a 必须先修。带着已知失败继续往下走，后续改动会叠加在错误状态上，最终无法判断是哪一步引入的问题。重构的前提是每一步都可运行。\n\n<!--day 4 | core-->\n#### 接入 GORM 前必须做的三件事\n```go\ndb, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{\n    Logger: gormlogger.Default.LogMode(gormlogger.Warn),  // 生产只记慢查询和错误\n    NowFunc: func() time.Time { return time.Now().UTC() }, // 时间统一 UTC\n})\n```\n1. **日志级别**：开发用 `Info` 看 SQL，生产必须降到 `Warn`。`Info` 会把每条 SQL 打进日志，既慢又泄漏数据。\n2. **时间统一 UTC**：`NowFunc` 固定时区，避免服务器时区变化导致 `created_at` 混乱。\n3. **底层 `*sql.DB` 要单独配置**：\n```go\nsqlDB, err := db.DB()\nsqlDB.SetMaxOpenConns(1)\nsqlDB.SetMaxIdleConns(1)\nsqlDB.SetConnMaxLifetime(0)\n```\n**GORM 的连接池就是你配的这个 `*sql.DB`**，不配等于用默认值（`MaxOpenConns` 无限）。\n\n#### SQLite 的两个必要 PRAGMA\n```go\ndsn := "file:ledger.db?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)"\n```\n- `busy_timeout`：遇到锁时等待而不是立刻返回 `database is locked`。\n- `journal_mode(WAL)`：读写不互相阻塞。启用 WAL 后可以考虑「读池多连接 + 写池 1 连接」。\n- `foreign_keys(1)`：SQLite 默认**不启用**外键约束，不显式打开，`FOREIGN KEY` 形同虚设。\n\n#### 版本要求\nGORM 用 **v2.3.19 及以上**（含若干 session/context 相关修复）。`go get gorm.io/gorm@latest` 后看 `go.mod` 确认。\n\n#### 判据\n```go\nsqlDB, _ := db.DB()\nstats := sqlDB.Stats()\nfmt.Println(stats.MaxOpenConnections)   // 必须是 1，不是 0\n```\n`0` 表示「无限」，说明你忘了配置。\n\n::q 为什么生产环境要把 GORM 日志级别降到 `Warn`？\n::a `Info` 会打印每条 SQL 及其参数，高并发下日志量巨大、拖慢响应，而且参数里可能含邮箱、金额等敏感数据，造成泄漏。`Warn` 只记录慢查询和错误，既保留排障能力又控制成本。\n::q SQLite 的 `foreign_keys` 为什么要显式打开？\n::a SQLite 出于历史兼容默认关闭外键约束，即使建表语句写了 `FOREIGN KEY` 也不会生效。必须在连接 DSN 或 `PRAGMA` 里显式开启，否则删父表不会阻止、插子表不会校验，数据完整性完全靠应用层。\n::q `sqlDB.Stats().MaxOpenConnections` 返回 0 意味着什么？\n::a 意味着没有设置上限（无限连接）。这在 SQLite 上会导致并发写时频繁 `database is locked`，在 Postgres 上会耗尽数据库连接数。必须显式设置，SQLite 建议从 1 开始。\n\n<!--day 5 | normal-->\n#### 模型定义：三个 tag 各有各的用途\n```go\ntype Entry struct {\n    ID       int64  `gorm:"primaryKey" json:"id"`\n    UserID   int64  `gorm:"index;not null" json:"user_id"`\n    Amount   int64  `gorm:"not null" json:"amount"`            // 分\n    Category string `gorm:"size:32;index;not null" json:"category"`\n    Date     string `gorm:"size:10;index;not null" json:"date"` // YYYY-MM-DD\n    Note     string `gorm:"size:255;not null;default:\'\'" json:"note"`\n    CreatedAt time.Time `json:"created_at"`\n}\nfunc (Entry) TableName() string { return "entries" }\n```\n- `gorm` tag：列类型、索引、约束。\n- `json` tag：API 契约。\n- **两者混在一个结构体上是有代价的**：一旦 API 需要改字段名，就会牵动数据库层。规模变大后应拆成 `Entry`（领域）+ `entryRow`（持久化）+ DTO。\n\n#### 金额用 `int64`，日期用 `string`\n- `Amount int64` 存分，**不用 `float64`**——阶段一 D2 埋的伏笔在这里兑现。\n- `Date string`（`YYYY-MM-DD`）而不是 `time.Time`：SQLite 存储简单、`LIKE \'2026-10%\'` 可直接用、不受时区影响。如果要用 `time.Time`，必须统一 UTC，否则跨时区会串日期。\n\n#### 索引：先想清楚查询模式\n```go\nUserID int64 `gorm:"index:idx_user_date,priority:1"`\nDate   string `gorm:"index:idx_user_date,priority:2"`\n```\n复合索引 `(user_id, date)` 能同时服务：\n- `WHERE user_id = ?` （最左前缀）\n- `WHERE user_id = ? AND date LIKE \'2026-10%\'`\n\n**顺序不能反**。`(date, user_id)` 就无法高效支持「某用户的某月」之外的查询，而且对「只按 user_id 查」无效。\n\n#### 判据\n```sql\n-- 迁移后检查实际建出来的索引\nSELECT name, sql FROM sqlite_master WHERE type=\'index\' AND tbl_name=\'entries\';\n```\n确认 `idx_user_date` 存在且列顺序是 `(user_id, date)`。\n\n::q 复合索引 `(user_id, date)` 的顺序为什么不能反？\n::a 索引按定义的列顺序构建，只有「最左前缀」能被利用。`(user_id, date)` 支持「按 user_id 查」和「按 user_id+date 查」；`(date, user_id)` 只支持「按 date 查」，而账本的查询几乎都带 user_id，等于白建。\n::q 为什么日期存 `string` 而不是 `time.Time`？\n::a 账本的日期是「日历日」，没有时刻和时区语义。存字符串 `YYYY-MM-DD` 简单、可前缀匹配、不受时区转换影响。用 `time.Time` 则要处理 UTC/本地时区转换，跨时区时容易出现「10 月 19 日的账跑到 18 日」。\n::q 一个结构体同时挂 `gorm` 和 `json` tag，什么时候会出问题？\n::a 当 API 契约和数据库结构出现分歧时：比如某个字段要存库但绝不能返回（密码哈希），或 API 要改字段名而数据库列名不能动。混在一起就只能靠 `json:"-"` 之类的补丁，容易漏。规模变大后应拆分模型与 DTO。\n\n<!--day 6 | core-->\n#### 这是本阶段最容易做错的一天，慢一点\n`*gorm.DB` 不是「一个连接」，而是一个**带状态的链式构造器**。它内部有 `Statement`，记录当前的条件、表名、选中列等。所以：\n\n```go\nq := db.Where("user_id = ?", 1)\nq.Where("amount > ?", 100)     // ❌ 污染了 q 的 Statement\n```\n同一个 `db` 实例在多个请求间共享时，链式条件会互相污染——**A 用户的查询条件可能出现在 B 用户的查询里**。这不是理论风险，是真实发生过的越权事故。\n\n#### 两个机制，各解决一半问题\n| 机制 | 作用 | 不解决 |\n| :--- | :--- | :--- |\n| `Session(&gorm.Session{NewDB: true})` | 克隆实例，清空链式条件 | 不绑定 context |\n| `WithContext(ctx)` | 设置 Statement 的 context | 实现上是 `Session(&Session{Context: ctx})`，**不保证清空条件** |\n\n所以需要**同时**做两件事，而 `Session` 结构体本身带 `Context` 字段，可以一次完成：\n\n```go\nfunc (r *Repo) GetEntry(ctx context.Context, userID, id int64) (ledger.Entry, error) {\n    var e Entry\n    tx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})\n    err := tx.Where("id = ? AND user_id = ?", id, userID).First(&e).Error\n    if errors.Is(err, gorm.ErrRecordNotFound) {\n        return ledger.Entry{}, ledger.ErrNotFound\n    }\n    if err != nil {\n        return ledger.Entry{}, fmt.Errorf("GetEntry(%d): %w", id, err)\n    }\n    return toDomain(e), nil\n}\n```\n三个要点：\n1. **`NewDB: true`** 保证这次查询从干净状态开始，不继承任何链式条件。\n2. **`Context: ctx`** 把请求作用域的 ctx 直接绑到 session，取消和超时会传播到驱动层（`QueryContext`）。\n3. **`ctx` 必须是请求作用域的**，绝不能是 `context.Background()`，也不能存进 `Repo` 结构体。\n\n#### 为什么不能把 ctx 存进结构体\n```go\n// ❌ 请求结束 ctx 就被取消，之后所有查询立刻失败\ntype Repo struct {\n    db  *gorm.DB\n    ctx context.Context\n}\n```\n请求结束 → `r.Context()` 被 cancel → 结构体里的 ctx 永久失效。GORM 会把 `context canceled` 一路返回，表现为「服务跑一会儿就全部超时」。\n\n#### 判据\n写一个并发测试：两个 goroutine 分别用 `user_id=1` 和 `user_id=2` 各查 100 次，断言结果不串。\n```go\ngo test -race ./internal/store -run TestSessionIsolation\n```\n这个测试是「链式条件污染」的唯一可靠防线。\n\n::q `WithContext(ctx)` 为什么不够？它内部不就是 `Session` 吗？\n::a `WithContext` 等价于 `Session(&Session{Context: ctx})`，它替换了 context 字段，但**不会重置已有的链式条件**（`Statement`）。如果这个 `*gorm.DB` 上已经累积了 `Where`，条件仍会带过去。要彻底隔离必须同时 `NewDB: true`。\n::q 为什么 GORM 的 ctx 必须用请求作用域的，不能用 `context.Background()`？\n::a 用 `Background()` 意味着请求取消、超时都无法中断数据库操作，慢查询会一直占用连接直到自然结束，高并发下连接池被拖满。请求级 ctx 能让取消信号传导到驱动层，及时释放资源。\n::q 把 ctx 存进 Repo 结构体会导致什么问题？\n::a ctx 与单次请求绑定，请求结束即被取消。结构体是长生命周期对象，下次使用时持有的是已取消的 ctx，所有查询立即返回 `context canceled`。表现为服务运行一段时间后全部超时，且重启后暂时恢复。\n\n<!--day 7 | core-->\n#### 用实验看清两个机制的差别\n不要只背结论，跑一遍：\n\n```go\nbase := db.Where("amount > 0")   // 故意留一个链式条件\n\n// 实验一：WithContext\nq1 := base.WithContext(context.Background())\nvar n1 int64\nq1.Table("entries").Count(&n1)\nfmt.Println(q1.Statement.SQL.String())   // 仍然带 amount > 0\n\n// 实验二：Session NewDB\nq2 := base.Session(&gorm.Session{NewDB: true})\nvar n2 int64\nq2.Table("entries").Count(&n2)\nfmt.Println(q2.Statement.SQL.String())   // 干净，只有 COUNT\n```\n\n用 `db.Debug()` 可以看到实际执行的 SQL，也可以直接打印 `Statement.SQL`。**亲眼看到条件残留，比记住文档有效。**\n\n#### 三种写法对照\n```go\n// ❌ 直接用共享 db，链式条件会污染\nr.db.Where("user_id = ?", uid).Find(&list)\n\n// ⚠️ 只 WithContext，ctx 有了但条件没清\nr.db.WithContext(ctx).Where("user_id = ?", uid).Find(&list)\n\n// ✅ 一次完成隔离 + ctx\nr.db.Session(&gorm.Session{NewDB: true, Context: ctx}).\n    Where("user_id = ?", uid).Find(&list)\n```\n第三种是**唯一推荐形态**。建议在 Repo 里封装一个方法，避免每次都手写：\n```go\nfunc (r *Repo) session(ctx context.Context) *gorm.DB {\n    return r.db.Session(&gorm.Session{NewDB: true, Context: ctx})\n}\n```\n所有方法都以 `r.session(ctx)` 开头。**把正确做法变成默认路径，比记住规则可靠。**\n\n#### 事务里怎么办\n```go\ntx := r.session(ctx).Begin()\ndefer tx.Rollback()\n// 事务内的每一步都要用 tx，而不是 r.db\nif err := tx.Create(&e).Error; err != nil { return err }\nreturn tx.Commit().Error\n```\n**事务内不能再用 `r.session(ctx)`**，那会拿到池子里的另一个连接，等于脱离事务。这是一个高频错误。\n\n#### 判据\n```go\nvar e Entry\nerr := r.session(ctx).Where("id = ?", id).First(&e).Error\n// 用 db.Debug() 看 SQL：不能出现上一次查询残留的条件\n```\n再跑并发隔离测试，确认无串数据。\n\n::q 事务内为什么不能调用 `r.session(ctx)` 取新的 DB 实例？\n::a 那会从连接池拿另一条连接，与当前事务不在同一个事务上下文里，导致「事务内的写入」和「事务外的查询」看到不同数据，回滚也管不到。事务内所有操作必须复用 `tx`。\n::q `NewDB: true` 会不会影响性能（每次都克隆）？\n::a 它只克隆结构体和 Statement，不新建数据库连接，开销是内存分配级别，可忽略。相比「条件污染导致越权或查错数据」的代价，这点开销完全值得。\n::q 把 `session(ctx)` 封装成一个私有方法，好处是什么？\n::a 把「正确的默认路径」固化下来，所有查询自动获得隔离和 ctx 绑定，不依赖每个人的记忆。新人加方法时照抄一行即可，降低出错概率——这比写文档强调规则有效得多。\n\n<!--day 8 | core-->\n#### `Updates` 忽略零值，这是设计不是 bug\n```go\ndb.Model(&Entry{}).Where("id = ?", id).Updates(Entry{Amount: 0})\n// 生成的 SQL 里没有 amount = 0\n```\nGORM 用结构体更新时只更新非零字段（0、""、nil 都被跳过）。所以「把金额改成 0」「把备注清空」这类操作会静默失败——**接口返回成功，数据没变**。\n\n三种正确写法：\n```go\n// 1. map：所有列都参与更新\ndb.Model(&Entry{}).Where("id = ?", id).Updates(map[string]any{"amount": 0})\n\n// 2. Select 指定列\ndb.Model(&Entry{}).Where("id = ?", id).Select("amount", "note").Updates(Entry{Amount: 0})\n\n// 3. 指针字段 + Select\n```\n\n#### 更要命的是「全表更新」\n```go\ndb.Model(&Entry{}).Updates(map[string]any{"note": "x"})   // ❌ 没有 Where，全表被改\n```\nGORM 默认阻止无 `WHERE` 的全局更新（返回 `WHERE conditions required`），但**用 `Session{AllowGlobalUpdate: true}` 或某些链式写法可以绕过**。规则：**任何 Update/Delete 必须显式带 `Where`，并且带 `user_id`。**\n\n#### CRUD 的正确形态\n```go\nfunc (r *Repo) UpdateEntry(ctx context.Context, userID, id int64, patch map[string]any) error {\n    res := r.session(ctx).\n        Model(&Entry{}).\n        Where("id = ? AND user_id = ?", id, userID).\n        Updates(patch)\n    if res.Error != nil {\n        return fmt.Errorf("UpdateEntry(%d): %w", id, res.Error)\n    }\n    if res.RowsAffected == 0 {\n        return ledger.ErrNotFound     // 不存在或不属于该用户\n    }\n    return nil\n}\n```\n`RowsAffected == 0` 的处理不能省，理由和阶段四 D11 一样：它是「越权或无此记录」的信号。\n\n#### `First` / `Find` / `Take` 的区别\n- `First`：按主键升序取第一条，无记录返回 `ErrRecordNotFound`。\n- `Take`：不排序取第一条，无记录同样返回错误。\n- `Find`：取多条，无记录**不报错**，返回空切片。\n\n所以列表查询用 `Find` 且**不要**判断 `ErrRecordNotFound`；单条查询用 `First` 并必须判断。\n\n#### 判据\n```go\n// 创建后把 amount 改成 0\npatch := map[string]any{"amount": int64(0)}\nerr := repo.UpdateEntry(ctx, uid, id, patch)\n// 查询确认库里真的是 0，而不是旧值\n```\n\n::q `Updates(Entry{Amount: 0})` 为什么不生效？\n::a GORM 用结构体更新时忽略零值字段（0、""、false、nil），以免误把未赋值的字段写成零。要更新为零值必须用 `map[string]any` 或 `Select` 显式指定列。\n::q `Find` 查不到数据会返回 `ErrRecordNotFound` 吗？\n::a 不会。`Find` 用于多条查询，无结果时返回空切片和 nil 错误。只有 `First`/`Take` 这类单条查询在无记录时返回 `ErrRecordNotFound`。混淆两者会导致「空列表被当成 500」。\n::q 为什么 Update 之后要检查 `RowsAffected`？\n::a 它告诉你实际改了几行。0 行意味着条件没匹配上——可能是 ID 不存在，也可能是 `user_id` 不匹配（越权）。不检查就会把「什么都没改」当成功返回，用户以为保存了但数据没变。\n\n<!--day 9 | core-->\n#### 事务的两种写法\n```go\n// 1. 手动控制\ntx := r.session(ctx).Begin()\ndefer tx.Rollback()\nif err := tx.Create(&e).Error; err != nil { return err }\nif err := tx.Model(&Budget{}).Where(...).Update("used", gorm.Expr("used + ?", e.Amount)).Error; err != nil { return err }\nreturn tx.Commit().Error\n\n// 2. 回调（推荐）\nerr := r.session(ctx).Transaction(func(tx *gorm.DB) error {\n    if err := tx.Create(&e).Error; err != nil { return err }\n    if err := tx.Model(&Budget{}).Where(...).Update("used", gorm.Expr("used + ?", e.Amount)).Error; err != nil { return err }\n    return nil\n})\n```\n回调版的优势：**panic 也会回滚**（内部有 recover 并重新抛出），且不会忘记 Commit/Rollback。\n\n#### 事务内的 ctx 不会自动传下去\n`Transaction(func(tx *gorm.DB) error)` 的 `tx` **已经继承了外层 session 的 Context**（因为我们用 `r.session(ctx)` 开启），所以事务内不需要再 `WithContext`。\n\n但如果是 `db.Begin()` 手动开启（没有走 session），事务内的 `tx` 就**没有绑定 ctx**，需要每步 `tx.WithContext(ctx)`。\n\n**结论：统一用 `r.session(ctx).Transaction(...)`，事务内直接用 `tx`，最不容易错。**\n\n#### 事务的三条纪律\n1. **事务要短**：不要在事务里做 HTTP 调用、发消息、等锁。SQLite 下写事务持有全局写锁，长事务会让所有写入排队。\n2. **不要在事务里 `return nil` 后又继续用 `tx`**：回调返回后事务已提交，`tx` 不再有效。\n3. **不要在事务内取新 session**：`r.session(ctx)` 会拿另一条连接，脱离事务。\n\n#### 隔离级别与 SQLite 的现实\nSQLite 实际是「串行化」写：同一时刻只有一个写事务。所以「两个事务同时改余额」不会出现丢失更新——第二个会等 `busy_timeout` 或直接失败。这简化了很多问题，但也意味着**长事务会阻塞全部写入**。\n\n#### 判据\n```go\n// 故意让第二步失败\nerr := repo.CreateWithBudget(ctx, e, "不存在的分类")\n// 断言：entries 表里没有新增记录\n```\n这条断言必须通过，否则事务没生效。\n\n::q `Transaction` 回调里 `return err` 和 `return nil` 分别发生什么？\n::a 返回非 nil 时 GORM 自动回滚；返回 nil 时自动提交。所以回调内不要自己 Commit/Rollback，否则会与外层控制冲突（重复提交会报错）。\n::q 事务内为什么不能调外部 HTTP 接口？\n::a 事务持有数据库锁，网络调用可能耗时几百毫秒甚至超时，期间所有需要该锁的操作全部阻塞，容易引发雪崩。正确做法是先完成外部调用，再把结果放进短事务里落库。\n::q 手动 `Begin()` 和 `session(ctx).Transaction()` 在 ctx 传递上的差别？\n::a `session(ctx).Transaction()` 的 `tx` 继承了 session 的 ctx，事务内自动带上取消和超时；`db.Begin()` 得到的 `tx` 未必绑定 ctx，事务内每步都要显式 `WithContext(ctx)`，漏一处就失去取消能力。\n\n<!--day 10 | normal-->\n#### 为什么不用 `AutoMigrate` 管生产\n`AutoMigrate` 会「按结构体差异改表」，听起来很方便，但：\n1. **没有版本记录**：你不知道数据库现在是第几版，也无法知道某次部署是否执行过。\n2. **不能回滚**：改错了没有 `down`。\n3. **删列/改类型不处理**：它只加不删，字段改名会变成「新增一列 + 旧列留着」，数据静默丢失。\n4. **并发部署出问题**：多实例同时启动会同时改表。\n\n所以：**`AutoMigrate` 只用于本地和测试**，生产用版本化迁移。\n\n#### goose 的三步\n```go\n// migrations/embed.go\npackage migrations\n\nimport "embed"\n\n//go:embed *.sql\nvar FS embed.FS\n```\n```go\n// main.go 或独立命令\ngoose.SetBaseFS(migrations.FS)\nif err := goose.SetDialect("sqlite3"); err != nil { ... }\nif err := goose.Up(sqlDB, "."); err != nil { ... }\n```\n\n#### 迁移文件成对，且必须写 down\n```sql\n-- +goose Up\nCREATE TABLE entries (\n    id INTEGER PRIMARY KEY AUTOINCREMENT,\n    user_id INTEGER NOT NULL,\n    amount INTEGER NOT NULL,\n    category TEXT NOT NULL,\n    date TEXT NOT NULL,\n    note TEXT NOT NULL DEFAULT \'\',\n    created_at TEXT NOT NULL\n);\nCREATE INDEX idx_entries_user_date ON entries(user_id, date);\n\n-- +goose Down\nDROP INDEX idx_entries_user_date;\nDROP TABLE entries;\n```\n文件名：`00001_create_entries.sql`，序号递增，**已执行的迁移文件永不修改**——改了也不会重新执行，只会让新老环境不一致。\n\n#### 迁移要不要在启动时自动跑\n- 单实例、家庭部署：启动时跑 `goose.Up` 可以接受，简单。\n- 多实例：**必须独立执行**（部署流程里单独一步），否则并发迁移会互相冲突。\n\n阶段六 D6 会把迁移做成部署流程里的独立步骤。\n\n#### 判据\n```bash\ngoose -dir migrations sqlite3 ledger.db up\ngoose -dir migrations sqlite3 ledger.db status     # 显示 Applied\ngoose -dir migrations sqlite3 ledger.db down       # 能回滚\n```\n`down` 一定要验证一次——没验证过的回滚等于没有回滚。\n\n::q `AutoMigrate` 在生产环境的三个致命问题是什么？\n::a 没有版本记录（不知道当前结构版本）、不能回滚（改错无法退）、字段改名会变成新增列导致数据静默丢失。此外多实例并发启动会同时改表，可能互相阻塞或产生不一致。\n::q 为什么已经执行过的迁移文件不能修改？\n::a 迁移工具按版本号记录已执行，改文件内容不会重新执行。于是老环境保持旧结构、新环境用新结构，出现「同样代码在不同环境行为不同」的隐蔽问题。修正应该新增一个迁移文件。\n::q 迁移的 `down` 为什么必须验证一次？\n::a 没验证过的回滚脚本往往有错（漏删索引、依赖顺序错），真正需要回滚时才发现执行失败，那时已经在故障中。上线前跑一次 `up → down → up` 是最低要求。\n\n<!--day 11 | normal-->\n#### 切换步骤：先补迁移，再关掉 AutoMigrate\n1. 用 goose 写出与当前结构一致的 `00001_init.sql`。\n2. 在空库上执行，确认结构与 `AutoMigrate` 建出来的一致（对比 `sqlite_master`）。\n3. 关掉启动时的 `AutoMigrate`。\n4. 在已有数据的库上验证：迁移能正常执行、数据没丢。\n\n第 2 步的对比不能省——**你手写的 SQL 和 GORM 生成的 DDL 在类型、默认值、索引名上常有差异**，直接切会导致新老环境结构不一致。\n\n#### 对比结构的方法\n```sql\nSELECT type, name, sql FROM sqlite_master WHERE name NOT LIKE \'sqlite_%\' ORDER BY type, name;\n```\n把两份输出 diff 一下，重点看：\n- 列类型（`INTEGER` vs `BIGINT`）\n- `NOT NULL` 与默认值\n- 索引名和列顺序\n- 是否有 `AUTOINCREMENT`\n\n#### 已有数据的库怎么过渡\n如果已经有 `AutoMigrate` 建的表和数据：\n- 用 `goose fix` 或手动插入版本记录，让 goose 认为 00001 已执行。\n- 或者写 `00001` 为 `CREATE TABLE IF NOT EXISTS`，让它对已有库幂等。\n\n**不要 DROP 重建**，那会丢数据。生产环境的表结构变更永远是「增量」的。\n\n#### 判据\n```bash\n# 空库\nrm -f test.db && goose -dir migrations sqlite3 test.db up\nsqlite3 test.db "select count(*) from entries"    # 表存在，0 行\n\n# 有数据的库\ncp ledger.db backup.db\ngoose -dir migrations sqlite3 ledger.db up\nsqlite3 ledger.db "select count(*) from entries"  # 行数不变\n```\n\n::q 手写迁移 SQL 和 `AutoMigrate` 生成的结构可能有哪些差异？\n::a 列类型（`INTEGER`/`BIGINT`、`TEXT`/`VARCHAR`）、默认值写法、`NOT NULL` 约束、索引名称与列顺序、是否 `AUTOINCREMENT`。这些差异在 SQLite 上部分不影响行为，但会让新老环境不一致，日后排查困难。\n::q 已有数据的库如何让 goose 认为初始迁移已执行？\n::a 可以用 `goose fix` 生成基线，或手动往 `goose_db_version` 表插入对应版本记录；也可以把 00001 写成 `CREATE TABLE IF NOT EXISTS` 并让索引创建幂等，使其在已有库上安全执行。绝不要 DROP 重建。\n\n<!--day 12 | normal-->\n#### 分类表：从字符串到实体\n```go\ntype Category struct {\n    ID     int64  `gorm:"primaryKey"`\n    UserID int64  `gorm:"index:idx_cat_user_name,unique,priority:1"`\n    Name   string `gorm:"size:32;index:idx_cat_user_name,unique,priority:2"`\n    Icon   string `gorm:"size:16"`\n}\n```\n复合唯一索引 `(user_id, name)` 保证「同一用户不能有两个同名分类」，但不同用户可以有同名分类。**这就是「唯一约束要带作用域」的例子**——只对 `name` 加唯一，会让第二个用户无法创建「餐饮」。\n\n#### Entry 与 Category 的关联\n```go\ntype Entry struct {\n    ...\n    CategoryID int64    `gorm:"index"`\n    Category   Category `gorm:"foreignKey:CategoryID"`\n}\n```\n`Preload("Category")` 会发第二条 SQL 加载关联（N+1 中的 1+1）。列表页如果要显示分类名，两种选择：\n- `Preload`：多一次查询，代码简单。\n- JOIN + 自定义结构体：一次查询，但要自己 Scan。\n\n**列表 20 条时用 Preload 完全够**，不要在数据量小的时候过早优化。\n\n#### 关联的坑\n1. **零值外键**：`CategoryID: 0` 会尝试关联 `id=0`，`Preload` 结果为空但不报错。要么允许 NULL（用 `*int64`），要么强制校验存在性。\n2. **软删除**：GORM 的 `DeletedAt` 会让 `Preload` 自动过滤已删记录，但**不会阻止外键指向已删分类**。需要在删除分类时检查是否被引用。\n3. **级联**：SQLite 必须显式 `PRAGMA foreign_keys=ON`，否则 `ON DELETE CASCADE` 不生效（阶段五 D4 已配置）。\n\n#### 判据\n```sql\n-- 两个用户各自建「餐饮」，必须都成功\nINSERT INTO categories (user_id, name) VALUES (1, \'餐饮\');\nINSERT INTO categories (user_id, name) VALUES (2, \'餐饮\');\n-- 同一用户重复建，必须失败\nINSERT INTO categories (user_id, name) VALUES (1, \'餐饮\');  -- UNIQUE constraint failed\n```\n\n::q 为什么分类的唯一索引要包含 `user_id`？\n::a 因为分类是用户私有的。只对 `name` 加唯一会导致第二个用户无法创建「餐饮」，这是典型的「约束范围错了」。复合唯一 `(user_id, name)` 才能表达「同一用户内不重名」。\n::q `Preload` 和 `JOIN` 该怎么选？\n::a 数据量小、代码清晰优先时用 `Preload`（两次简单查询，易读易维护）。列表很大或需要按关联字段排序/过滤时用 `JOIN` + 自定义结构体，一次查询完成。过早优化会牺牲可读性，收益却很小。\n::q 删除分类时需要注意什么？\n::a 要检查是否还有账目引用它，否则会留下悬空外键（SQLite 未开启外键约束时甚至不会报错）。业务上通常禁止删除已被引用的分类，或改为软删除并保留历史记录的关联。\n\n<!--day 13 | core-->\n#### 聚合查询：GORM 的 `Select` + `Scan` 组合\n```go\ntype CategorySum struct {\n    Category string `json:"category"`\n    Total    int64  `json:"total"`\n}\n\nfunc (r *Repo) SumByCategory(ctx context.Context, userID int64, month string) ([]CategorySum, error) {\n    var rows []CategorySum\n    err := r.session(ctx).\n        Model(&Entry{}).\n        Select("category, SUM(amount) AS total").\n        Where("user_id = ? AND date LIKE ?", userID, month+"%").\n        Group("category").\n        Order("total DESC").\n        Scan(&rows).Error\n    if err != nil {\n        return nil, fmt.Errorf("SumByCategory: %w", err)\n    }\n    return rows, nil\n}\n```\n三个要点：\n1. **`Scan` 到专用结构体**，字段名要和 SQL 别名一致（`total`）。\n2. **`Order("total DESC")` 用的是别名**，SQLite 支持，Postgres 也支持。若要跨库，改成 `ORDER BY SUM(amount) DESC`。\n3. **空结果返回 nil 切片**，上层要转成 `[]` 再序列化。\n\n#### 同时算总额，别用分类相加\n```go\nvar total int64\nerr := r.session(ctx).\n    Model(&Entry{}).\n    Select("COALESCE(SUM(amount), 0)").\n    Where("user_id = ? AND date LIKE ?", userID, month+"%").\n    Scan(&total).Error\n```\n分类相加在有空分类、过滤条件不一致时会算错。**单独查一次，成本极低，语义明确。**\n\n#### 百分比在服务端算还是前端算\n建议服务端算，返回 `percent`（整数），避免前端各自实现导致四舍五入不一致。注意除零：总额为 0 时百分比一律 0。\n\n```go\nfor i := range rows {\n    if total > 0 {\n        rows[i].Percent = int(math.Round(float64(rows[i].Total) * 100 / float64(total)))\n    }\n}\n```\n\n#### 判据\n```bash\ncurl -s "localhost:8080/summary?month=2026-10" -H "Authorization: Bearer $T" | jq .data\n# by_category 按 total 降序，各项相加 == total，percent 之和 ≈ 100\n```\n再插一笔不同类型的账，确认新分类出现在列表里且顺序正确。\n\n::q `Scan` 聚合结果时，结构体字段名必须和什么对应？\n::a 必须和 SQL 的列别名对应（如 `AS total` → `Total`）。GORM 按列名映射到字段，名字不匹配会得到零值且不报错——这类 bug 很隐蔽，必须靠断言测试发现。\n::q 为什么总额要单独查一次 `COALESCE(SUM(amount),0)`？\n::a 分类相加依赖两个查询条件完全一致，且如果存在 NULL 分类或被 `HAVING` 过滤的分类，结果会偏小。单独查一次语义明确、成本很低，也避免「部分之和 ≠ 总额」这种对不上账的问题。\n::q 百分比为什么建议在服务端计算？\n::a 保证所有客户端（Web、Android）得到一致结果，避免各自实现四舍五入造成显示差异。同时服务端能统一处理除零（总额为 0）这类边界，客户端只需渲染。\n',hf=`<!--day 14 | core-->
#### 先看执行计划，再谈优化
\`\`\`sql
EXPLAIN QUERY PLAN
SELECT category, SUM(amount) FROM entries
WHERE user_id = 1 AND date LIKE '2026-10%'
GROUP BY category;
\`\`\`
你要看到的理想输出包含 \`SEARCH entries USING INDEX idx_entries_user_date (user_id=?)\`。如果出现 \`SCAN entries\`，说明索引没用上——数据量一大就线性变慢。

#### 索引为什么可能失效
| 写法 | 是否走索引 | 原因 |
| :--- | :--- | :--- |
| \`WHERE user_id = ? AND date LIKE '2026-10%'\` | ✅ | 最左前缀 + 前缀匹配 |
| \`WHERE date LIKE '%10%'\` | ❌ | 前置通配符无法定位起点 |
| \`WHERE substr(date,1,7) = '2026-10'\` | ❌ | 对列做函数运算 |
| \`WHERE user_id = ? AND date >= '2026-10-01' AND date < '2026-11-01'\` | ✅ | 范围扫描，最稳 |

**结论**：想做「按月」筛选，\`LIKE '2026-10%'\` 和范围查询都可以；一旦对列套函数就退化成全表扫描。

#### 索引不是越多越好
- 每个索引都会让写入变慢（INSERT/UPDATE 要维护索引）。
- 占磁盘空间。
- 优化器可能选错索引。

原则：**按真实查询建索引**，不要「猜着建」。账本的核心查询就两种：按用户+月列列表、按用户+月聚合。一个 \`(user_id, date)\` 复合索引就够。

#### 判据
\`\`\`sql
EXPLAIN QUERY PLAN <你的聚合 SQL>;
-- 必须出现 USING INDEX，不能是 SCAN
\`\`\`
再插入 1 万条测试数据，对比加索引前后的耗时（\`EXPLAIN\` 看计划比看耗时更稳定）。

::q \`WHERE substr(date,1,7) = '2026-10'\` 为什么用不上索引？
::a 索引存的是列的原始值，一旦对列施加函数（\`substr\`/\`date()\`/\`upper\`），数据库必须对每一行计算函数值才能比较，无法利用索引的有序性，只能全表扫描。应改成对列直接做范围或前缀比较。
::q 复合索引 \`(user_id, date)\` 能被 \`WHERE date = ?\` 用上吗？
::a 不能。复合索引只能被「最左前缀」利用，单独用 \`date\` 查询缺少 \`user_id\` 这一前置列，无法定位。要支持这种查询需要单独为 \`date\` 建索引，或调整复合索引顺序。
::q 索引过多会带来什么具体代价？
::a 每次写入都要同步更新所有相关索引，降低插入/更新吞吐；占用额外磁盘；优化器选择空间变大，可能选错索引导致查询变慢。应按实际查询模式精简。

<!--day 15 | core-->
#### 错误处理中间件：把「错误→HTTP」的映射收敛到一处
\`\`\`go
type appError struct {
    Status int
    Code   string
    Msg    string
    Err    error   // 原始错误，只进日志
}

func (e *appError) Error() string { return e.Msg }
func (e *appError) Unwrap() error { return e.Err }

func badRequest(code, msg string) error {
    return &appError{Status: 400, Code: code, Msg: msg}
}
func notFound(msg string) error {
    return &appError{Status: 404, Code: "NOT_FOUND", Msg: msg}
}
\`\`\`
\`Unwrap()\` 让 \`errors.Is/As\` 仍能穿透，兼顾「统一映射」和「保留错误链」。

#### 中间件里统一翻译
\`\`\`go
func writeError(w http.ResponseWriter, r *http.Request, err error) {
    var ae *appError
    if errors.As(err, &ae) {
        Fail(w, ae.Status, ae.Code, ae.Msg)
        if ae.Err != nil {
            slog.Error("request failed", "err", ae.Err, "req_id", reqID(r))
        }
        return
    }
    switch {
    case errors.Is(err, ledger.ErrNotFound):
        Fail(w, 404, "NOT_FOUND", "not found")
    case errors.Is(err, context.DeadlineExceeded):
        Fail(w, 504, "TIMEOUT", "upstream timeout")
    case errors.Is(err, ledger.ErrEmailTaken):
        Fail(w, 409, "EMAIL_TAKEN", "email already registered")
    default:
        slog.Error("unhandled error", "err", err, "req_id", reqID(r))
        Fail(w, 500, "INTERNAL", "internal error")
    }
}
\`\`\`
关键：**默认分支必须记日志**。未知错误静默返回 500，是最难排查的一类问题。

#### 三层错误的职责
- **store**：返回原始错误，用 \`%w\` 包装，加操作上下文。
- **ledger（Service）**：翻译成业务错误（\`ErrNotFound\`、\`ErrEmailTaken\`、\`ValidationError\`）。
- **httpapi**：把业务错误映射到状态码 + code。

**store 不认识 HTTP，Service 不认识状态码。** 这条守住了，将来加 gRPC 只需要写一套新的映射。

#### 判据
\`\`\`bash
# 四类错误各打一次
curl -i -X POST .../ledger -d '{"amount":0}'      # 400 INVALID_ARGUMENT
curl -i .../ledger/999999                          # 404 NOT_FOUND
curl -i .../register -d '{"email":"a@x.com",...}'  # 409 EMAIL_TAKEN
# 数据库不可用时                                    # 500 INTERNAL + 日志有完整错误
\`\`\`

::q \`appError\` 为什么要实现 \`Unwrap()\`？
::a 让 \`errors.Is/As\` 能继续沿链判断底层错误。这样上层既能用 \`errors.As\` 取出 \`appError\` 拿到状态码，也能用 \`errors.Is\` 判断底层的 \`ErrNotFound\`，两种语义都保留。
::q 未知错误为什么必须记日志？
::a 因为默认分支返回的 500 不含任何原因，客户端和监控都只看到「服务端错误」。没有日志就没有排查线索，只能靠复现。日志要带完整错误链和 request_id，才能从告警直达具体请求。
::q Service 层为什么不该知道 HTTP 状态码？
::a 状态码是传输层概念，Service 被 CLI、gRPC、定时任务共用时没有意义。Service 只表达业务语义（不存在、冲突、参数非法），由各传输层自行映射。耦合后换协议就要改业务代码。

<!--day 16 | core-->
#### request ID：一条日志串起一次请求
\`\`\`go
func WithRequestID(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        id := r.Header.Get("X-Request-ID")
        if id == "" {
            id = newID()   // 随机 16 字节 hex
        }
        ctx := context.WithValue(r.Context(), reqIDKey, id)
        w.Header().Set("X-Request-ID", id)   // 回传给客户端，便于报障
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}
\`\`\`
**ID 由入口生成，向下传，向上回显。** 客户端报障时报这个 ID，你就能在日志里 grep 出整条链路。

#### 用 \`slog\` 而不是 \`log.Printf\`
\`\`\`go
slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, &slog.HandlerOptions{
    Level: slog.LevelInfo,
})))

slog.Info("request",
    "method", r.Method,
    "path", r.URL.Path,
    "status", rec.status,
    "dur_ms", time.Since(start).Milliseconds(),
    "req_id", reqID(r),
)
\`\`\`
JSON 输出能被日志系统直接解析、按字段聚合。\`log.Printf\` 的文本行只能靠正则，字段一多就崩。

#### 日志要遵守的三条
1. **不记敏感信息**：密码、token、完整邮箱、cookie。需要时脱敏（\`a***@x.com\`）。
2. **不记请求体全文**：体积大且可能含隐私，只记长度和关键字段。
3. **错误日志带 \`err\`**，用 \`slog.Error("...", "err", err)\`，序列化时会带消息和链。

#### 判据
\`\`\`bash
curl -i localhost:8080/ledger | grep -i x-request-id
# 响应头有 ID
# 日志里同一 ID 能 grep 到请求行 + 错误行
grep <id> app.log
\`\`\`

::q request ID 应该由谁生成？
::a 由最外层入口生成（通常是网关或 HTTP 中间件），并回写到响应头。若上游已带 \`X-Request-ID\` 就沿用，保证跨服务链路一致。让每个服务自己生成会导致同一次请求在日志里有多个 ID。
::q 为什么日志用 JSON 而不是文本行？
::a JSON 有固定字段名，日志系统能直接解析并做聚合查询（按 status、dur 分组），也便于程序处理。文本行需要正则提取，字段一多或格式一变就失效。
::q 日志里哪些内容不能记录？
::a 密码、token、cookie、完整手机号/邮箱、身份证、完整请求体。这些一旦落盘就构成泄漏风险，且很难追溯清理。需要排障时记录脱敏值或哈希值。

<!--day 17 | normal-->
#### 表驱动测试的骨架
\`\`\`go
func TestCreate_Validation(t *testing.T) {
    cases := []struct {
        name    string
        in      ledger.CreateInput
        wantErr string
    }{
        {"amount 为 0", ledger.CreateInput{Amount: 0, Category: "餐饮", Date: "2026-10-19"}, "amount"},
        {"amount 为负", ledger.CreateInput{Amount: -1, Category: "餐饮", Date: "2026-10-19"}, "amount"},
        {"分类为空", ledger.CreateInput{Amount: 100, Category: "", Date: "2026-10-19"}, "category"},
        {"日期格式错", ledger.CreateInput{Amount: 100, Category: "餐饮", Date: "2026/10/19"}, "date"},
        {"合法输入", ledger.CreateInput{Amount: 100, Category: "餐饮", Date: "2026-10-19"}, ""},
    }

    for _, c := range cases {
        t.Run(c.name, func(t *testing.T) {
            svc := ledger.NewService(&fakeStore{})
            _, err := svc.Create(context.Background(), c.in)
            if c.wantErr == "" {
                if err != nil { t.Fatalf("unexpected error: %v", err) }
                return
            }
            var ve *ledger.ValidationError
            if !errors.As(err, &ve) || ve.Field != c.wantErr {
                t.Fatalf("want field %q, got %v", c.wantErr, err)
            }
        })
    }
}
\`\`\`
三个设计点：
1. **\`name\` 是中文描述**：失败时报「amount 为 0」比「case 1」有用得多。
2. **断言字段而不是错误文案**：文案会改，字段名稳定。
3. **每个 case 独立构造 Service**：避免状态泄漏。

#### fakeStore 是测试的核心资产
\`\`\`go
type fakeStore struct {
    entries []ledger.Entry
    createErr error
}
func (f *fakeStore) CreateEntry(ctx context.Context, e ledger.Entry) (int64, error) {
    if f.createErr != nil { return 0, f.createErr }
    f.entries = append(f.entries, e)
    return int64(len(f.entries)), nil
}
\`\`\`
它能模拟「存储层报错」，这是真实数据库很难稳定构造的场景（比如超时、唯一冲突）。

#### 判据
\`\`\`bash
go test ./internal/ledger -v -run TestCreate_Validation
# 5 个子测试全部 PASS，失败时输出中文 case 名
\`\`\`

::q 表驱动测试里为什么断言 \`ValidationError.Field\` 而不是错误消息文本？
::a 消息文案会随产品迭代修改，断言文本会让测试频繁误报。字段名是稳定的语义标识，也正好是前端用来高亮输入框的值。断言语义比断言文案更有价值。
::q 为什么需要 \`fakeStore\` 而不是直接用 SQLite 内存库测 Service？
::a Service 的测试目标是业务规则，不该依赖数据库行为。fake 能精确构造「存储层返回唯一冲突」「返回超时」等难以稳定复现的场景，测试也更快。真正验证 SQL 的测试放在 Repository 层。
::q 每个 case 都新建 Service 有什么好处？
::a 避免测试间状态污染（比如前一个 case 写入的数据影响后一个）。表驱动测试共享状态时，失败顺序依赖执行顺序，排查会非常困难。

<!--day 18 | core-->
#### \`httptest\` 的两个工具
\`\`\`go
func TestCreateEntry_BadJSON(t *testing.T) {
    req := httptest.NewRequest(http.MethodPost, "/ledger", strings.NewReader(\`{"amount":"abc"}\`))
    req.Header.Set("Content-Type", "application/json")
    rec := httptest.NewRecorder()

    router := httpapi.NewRouter(svc, cfg)
    router.ServeHTTP(rec, req)

    if rec.Code != http.StatusBadRequest {
        t.Fatalf("want 400, got %d body=%s", rec.Code, rec.Body.String())
    }
    var resp struct {
        Code string \`json:"code"\`
    }
    json.Unmarshal(rec.Body.Bytes(), &resp)
    if resp.Code != "INVALID_ARGUMENT" {
        t.Fatalf("want INVALID_ARGUMENT, got %s", resp.Code)
    }
}
\`\`\`
- \`NewRequest\`：构造请求（不经过网络）。
- \`NewRecorder\`：捕获状态码、头、body。

**它测的是整条链路**：路由匹配 + 中间件 + handler + 错误映射。比单独测 handler 更有价值。

#### 必须测的六类用例
| 类型 | 例子 | 断言 |
| :--- | :--- | :--- |
| 正常 | 合法 JSON | 201 + data.id > 0 |
| 语法错 | 非法 JSON | 400 |
| 语义错 | amount=0 | 400 + field |
| 认证缺失 | 无 Authorization | 401 |
| 资源不存在 | id=999999 | 404 |
| 方法错 | PUT /ledger | 405 |

**认证相关的用例特别重要**：它验证「中间件确实套上了」。漏套中间件是灾难级 bug，而它不会导致任何编译错误。

#### 一个容易忽略的点
\`httptest.NewRequest\` 的 \`r.RemoteAddr\` 默认是 \`192.0.2.1:1234\`，如果你的限流或审计依赖真实 IP，测试里要显式设置，否则测不到真实行为。

#### 判据
\`\`\`bash
go test ./internal/httpapi -v
# 六个用例全绿；把认证中间件注释掉，401 用例必须变红
\`\`\`
**故意破坏一次，确认测试能抓住。** 测试没抓到问题的测试，等于没写。

::q \`httptest.NewRecorder\` 相比启动真实服务器，优势是什么？
::a 不需要端口、不经过网络，毫秒级完成，能稳定断言状态码/头/body，也能在同一进程内注入依赖。真实服务器测试更适合端到端验证，单元测试用 recorder 更快更可靠。
::q 为什么「无 token 应返回 401」这个测试特别关键？
::a 它验证认证中间件真的挂在了路由上。漏挂不会导致编译错误、不会影响其他测试，但会让整个接口裸奔。这是典型的「静默失效」，只能靠测试发现。
::q 如何确认一个测试「真的能抓住 bug」？
::a 故意把被测逻辑改坏（注释掉中间件、改错状态码），运行测试确认变红，再恢复。测试永远绿色往往意味着断言太弱或根本没覆盖到。

<!--day 19 | core-->
#### 内存 SQLite 的正确 DSN
\`\`\`go
func newTestDB(t *testing.T) *gorm.DB {
    t.Helper()
    // 每个测试用独立的内存库，避免相互影响
    dsn := fmt.Sprintf("file:memdb_%s?mode=memory&cache=shared", t.Name())
    db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{})
    if err != nil { t.Fatalf("open: %v", err) }
    sqlDB, _ := db.DB()
    sqlDB.SetMaxOpenConns(1)      // 内存库多连接会各自看到不同的库
    t.Cleanup(func() { sqlDB.Close() })
    if err := migrations.Up(sqlDB); err != nil { t.Fatalf("migrate: %v", err) }
    return db
}
\`\`\`
三个关键点：
1. **\`mode=memory&cache=shared\`**：\`file::memory:\` 在每次连接时创建新库，多连接会看到不同的数据。带名字 + shared cache 才能让同进程的多个连接共享。
2. **\`SetMaxOpenConns(1)\`**：内存库在多连接下容易出「表不存在」的怪问题。
3. **用 \`t.Cleanup\` 关闭**，不用 \`defer\`（\`defer\` 在子测试里时机不对）。

#### 为什么用真迁移而不是 AutoMigrate
测试库如果和生产的建表方式不同，SQL 差异就测不出来。**测试环境应该尽量贴近生产**：同一个迁移文件、同样的索引。

#### 一个完整的 Repository 测试
\`\`\`go
func TestEntry_Isolation(t *testing.T) {
    db := newTestDB(t)
    r := store.NewGorm(db)
    ctx := context.Background()

    id, err := r.CreateEntry(ctx, ledger.Entry{UserID: 1, Amount: 100, Category: "餐饮", Date: "2026-10-19"})
    if err != nil { t.Fatal(err) }

    _, err = r.GetEntry(ctx, 2, id)     // 用户 2 读用户 1 的数据
    if !errors.Is(err, ledger.ErrNotFound) {
        t.Fatalf("越权读取未被阻止: %v", err)
    }
}
\`\`\`
这个测试的价值在阶段五之后依然存在——**它是数据隔离的回归防线**。

#### 判据
\`\`\`bash
go test ./internal/store -v -count=1    # 全绿
go test ./internal/store -race          # 无竞态
\`\`\`
\`-count=1\` 禁用缓存，确保真的执行了。

::q \`file::memory:\` 和 \`file:testdb?mode=memory&cache=shared\` 有什么区别？
::a \`file::memory:\` 每次建立连接都会创建一个**新的**空库，多连接时彼此不可见，表现为「表不存在」或「刚插的数据查不到」。带名字 + \`cache=shared\` 让同进程内多个连接共享同一个内存库，行为才接近真实数据库。
::q 测试库为什么建议用真实迁移文件建表？
::a 保证测试环境与生产结构一致。用 \`AutoMigrate\` 建表可能与迁移文件有类型、索引、默认值差异，导致「测试通过但生产失败」。测试贴近生产才能发现真实问题。
::q \`t.Cleanup\` 相比 \`defer\` 在子测试中的优势？
::a \`t.Cleanup\` 绑定到具体的测试/子测试，在它结束时执行，顺序和时机正确；\`defer\` 在函数返回时执行，跨子测试或提前 \`Fatal\` 时可能来不及清理。资源释放用 \`t.Cleanup\` 更可靠。

<!--day 20 | normal-->
#### 覆盖率看的是「哪没测」，不是「数字多高」
\`\`\`bash
go test ./... -coverprofile=cover.out
go tool cover -func=cover.out | tail -5
go tool cover -html=cover.out   # 浏览器查看未覆盖代码
\`\`\`
经验判断：
- **业务规则（校验、金额计算、隔离）必须接近 100%**。
- 简单的 getter/setter、\`main\` 装配可以低。
- **不要为了数字去测无逻辑代码**，那是自欺。

#### 覆盖率抓不到的东西
- 数据竞争（要 \`-race\`）。
- 并发时序问题。
- 数据库真实行为（索引、锁、事务隔离）。
- 错误处理分支是否真的可达。

所以「覆盖率 80%」不等于「质量 80%」。它是**发现盲区的工具**，不是目标。

#### \`-race\` 与 \`-count\`
\`\`\`bash
go test -race ./...            # 竞态检测，慢 5-10 倍，CI 必跑
go test -count=1 ./...         # 禁用缓存
go test -run TestX -v ./pkg    # 单测调试
\`\`\`
\`-race\` 只能发现**实际执行到**的竞态，所以测试要尽量覆盖并发路径（比如并发创建、并发更新同一行）。

#### 哪些代码「必须」被测到
按风险排序，前三个优先级最高：
1. **金额计算与单位换算**（分↔元）——错一分就是用户投诉。
2. **数据隔离条件**（\`user_id\`）——漏掉就是越权。
3. **错误到状态码的映射**——错了会让故障被掩盖。

这三块的覆盖率应该接近 100%，而且断言要具体（断言 \`code == "NOT_FOUND"\`，不是只断言「有错误」）。

#### 用 \`-coverpkg\` 看跨包覆盖
\`\`\`bash
go test ./internal/httpapi -coverpkg=./internal/ledger,./internal/store -coverprofile=c.out
\`\`\`
默认只统计被测包本身。加了 \`-coverpkg\` 才能看出「handler 测试实际上覆盖了多少 Service 代码」——这比单包数字更有意义。

#### 判据
\`\`\`bash
go test ./... -race -count=1
# 全绿且无 DATA RACE
go tool cover -func=cover.out | grep total
# 记下数字，重点看 ledger 包的覆盖率
\`\`\`

::q 覆盖率高是否代表测试质量高？
::a 不代表。覆盖率只说明「代码被执行过」，不说明断言是否正确、边界是否覆盖、并发是否安全。一段代码可以被执行 100 次而没有任何有效断言。它适合用来发现「完全没测到的盲区」。
::q \`-race\` 为什么必须在 CI 里跑？
::a 竞态是概率性的，本地跑几次可能都不触发。\`-race\` 会在运行时检测所有实际执行的读写冲突，配合覆盖并发路径的测试能提前暴露问题。虽然慢，但这是唯一能自动发现数据竞争的手段。
::q 哪些代码可以接受低覆盖率？
::a \`main\` 的装配代码、纯声明性的常量、简单 getter、以及依赖外部系统的适配层（由端到端测试覆盖）。业务规则、金额计算、权限判断这类逻辑不能低。

<!--day 21 | light-->
#### 预算的最小可用版本
\`\`\`go
type Budget struct {
    ID       int64  \`gorm:"primaryKey"\`
    UserID   int64  \`gorm:"index:idx_budget,unique,priority:1"\`
    Month    string \`gorm:"size:7;index:idx_budget,unique,priority:2"\`
    Category string \`gorm:"size:32;index:idx_budget,unique,priority:3"\`
    Amount   int64  \`gorm:"not null"\`   // 分
}
\`\`\`
唯一键 \`(user_id, month, category)\`：一个用户一个月一个分类只能有一条预算。

#### 检查只是「算一下再比较」
\`\`\`go
func (s *Service) budgetWarning(ctx context.Context, uid int64, month, category string, add int64) (*Warning, error) {
    b, err := s.store.GetBudget(ctx, uid, month, category)
    if errors.Is(err, ledger.ErrNotFound) {
        return nil, nil       // 没设预算就不提示
    }
    if err != nil { return nil, err }

    used, err := s.store.SumCategory(ctx, uid, month, category)
    if err != nil { return nil, err }

    after := used + add
    if after <= b.Amount {
        return &Warning{Exceeded: false}, nil
    }
    return &Warning{
        Exceeded: true,
        Limit:    b.Amount,
        Used:     after,
        Over:     after - b.Amount,
    }, nil
}
\`\`\`
**返回标志而不是拒绝写入**：记账是事实，预算只是提醒。拒绝写入会让用户被迫先改预算才能记账，体验极差。

#### 这是 stretch goal，可以先不做
标准是：**阶段五的核心（GORM 模式、迁移、统计、错误处理、测试）没做完之前，不要碰预算。** 先用「预算表 + 超限标志」跑通，复杂规则（分周期、共享预算、结转）留到以后。

::q 超预算时应该拒绝写入还是返回标志？
::a 返回标志。账目是既成事实，拒绝写入会导致数据不完整，用户还得先改预算才能记账。预算的作用是提醒而非限制，除非产品明确要求「硬性拦截」。
::q 预算唯一键为什么要包含 \`month\` 和 \`category\`？
::a 因为预算是「某用户某月某分类的限额」。缺少 \`month\` 会导致设置一次后永久生效，无法按月调整；缺少 \`category\` 则无法分类控制。

<!--day 22 | light-->
#### 全量加载版 CSV：能跑就行
\`\`\`go
func exportCSV(w http.ResponseWriter, entries []ledger.Entry) error {
    w.Header().Set("Content-Type", "text/csv; charset=utf-8")
    w.Header().Set("Content-Disposition", \`attachment; filename="ledger.csv"\`)

    w.Write([]byte{0xEF, 0xBB, 0xBF})   // UTF-8 BOM，Excel 才不乱码
    cw := csv.NewWriter(w)
    defer cw.Flush()

    if err := cw.Write([]string{"日期", "分类", "金额(元)", "备注"}); err != nil {
        return err
    }
    for _, e := range entries {
        if err := cw.Write([]string{
            e.Date, e.Category,
            strconv.FormatFloat(float64(e.Amount)/100, 'f', 2, 64),
            e.Note,
        }); err != nil {
            return err
        }
    }
    return cw.Error()
}
\`\`\`
两个必做细节：
1. **UTF-8 BOM**：不加的话 Excel 打开中文列名会乱码（这是 Windows Excel 的兼容问题）。
2. **\`cw.Error()\`**：\`Flush\` 之后要检查写入错误，否则磁盘满/连接断开时你以为成功了。

#### 金额格式化必须固定两位小数
\`strconv.FormatFloat(v, 'f', 2, 64)\` 保证输出 \`35.50\` 而不是 \`35.5\`。CSV 里的金额列如果小数位不固定，Excel 会当文本处理。

#### 判据
\`\`\`bash
curl -s "localhost:8080/ledger/export?month=2026-10" -H "Authorization: Bearer $T" -o out.csv
head -2 out.csv     # 表头中文正常
# 用 Excel / Numbers 打开，中文不乱码，金额两位小数
\`\`\`

::q CSV 为什么要加 UTF-8 BOM？
::a Windows 版 Excel 打开无 BOM 的 UTF-8 文件时会按本地编码（如 GBK）解析，中文列名变乱码。加 \`\\xEF\\xBB\\xBF\` 后 Excel 能识别为 UTF-8。这是兼容性处理，其他工具也能正确忽略 BOM。
::q \`csv.Writer.Flush()\` 之后为什么还要检查错误？
::a \`Write\` 只是写入缓冲，真正的 I/O 错误在 \`Flush\` 时才暴露。不检查 \`cw.Error()\` 会在磁盘满、连接中断时误判为成功，用户下载到残缺文件。

<!--day 23 | light-->
#### 流式导出：不要先把所有数据读进内存
\`\`\`go
func (h *Handler) exportStream(w http.ResponseWriter, r *http.Request) error {
    w.Header().Set("Content-Type", "text/csv; charset=utf-8")
    w.Header().Set("Content-Disposition", \`attachment; filename="ledger.csv"\`)
    w.Write([]byte{0xEF, 0xBB, 0xBF})

    cw := csv.NewWriter(w)
    defer cw.Flush()
    cw.Write([]string{"日期", "分类", "金额(元)", "备注"})

    rows, err := h.db.QueryContext(r.Context(),
        \`SELECT date, category, amount, note FROM entries WHERE user_id = ? ORDER BY date\`, uid(r))
    if err != nil { return err }
    defer rows.Close()

    for rows.Next() {
        var date, cat, note string
        var amount int64
        if err := rows.Scan(&date, &cat, &amount, &note); err != nil { return err }
        cw.Write([]string{date, cat, fmt.Sprintf("%.2f", float64(amount)/100), note})
        cw.Flush()   // 定期刷出，避免客户端等太久
    }
    return rows.Err()
}
\`\`\`
关键：**边读边写，内存占用与数据量无关**。缺点是一旦出错，响应头已经发出，无法改成 500——只能在 body 里中断连接。

#### 流式导出的代价
- 不能设置 \`Content-Length\`（长度未知）。
- 出错时无法改状态码。
- 需要处理客户端中途断开（\`r.Context()\` 被取消，\`rows.Next()\` 会失败）。

**只有数据量真的很大（十万行以上）才值得**。家庭账本一年几千条，全量加载完全够。这是典型的「知道怎么做，但不一定现在做」。

::q 流式导出为什么不能返回 500 错误页？
::a 因为响应头（200）和部分 body 已经发给客户端，HTTP 协议不允许中途修改状态码。此时只能中断连接让客户端感知下载不完整。要避免这种情况，可以在开始写之前先做一次「轻量预检」（如权限、参数校验）。
::q 什么时候流式导出才真的必要？
::a 数据量大到全量加载会占满内存时（几十万行以上），或者希望客户端「边下边处理」时。几千行数据全量加载只需几 MB，代码简单且能正常返回错误，反而更合适。

<!--day 24 | normal-->
#### 接口清单：给前端一份可执行的契约
| 方法 | 路径 | 认证 | 请求 | 响应 \`data\` |
| :--- | :--- | :--- | :--- | :--- |
| POST | \`/register\` | 否 | \`{email, password}\` | \`{id, email}\` |
| POST | \`/login\` | 否 | \`{email, password}\` | \`{token, expires_at}\` |
| GET | \`/ledger\` | 是 | \`?limit&offset&month\` | \`{items, total, limit, offset}\` |
| POST | \`/ledger\` | 是 | \`{amount, category, date, note}\` | \`{id}\` |
| GET | \`/ledger/{id}\` | 是 | — | \`Entry\` |
| DELETE | \`/ledger/{id}\` | 是 | — | \`{}\` |
| GET | \`/summary\` | 是 | \`?month\` | \`{month, total, by_category}\` |
| GET | \`/ledger/export\` | 是 | \`?month\` | CSV |
| GET | \`/healthz\` | 否 | — | \`{status}\` |

写这份表的目的是**在写前端之前发现不一致**：字段名、金额单位（分还是元）、日期格式、分页语义。这些问题在联调时才暴露，返工成本高。

#### 三个必须在契约里写清楚的约定
1. **金额单位是「分」**（int64），前端负责除以 100 展示。
2. **日期是 \`YYYY-MM-DD\` 字符串**，不是时间戳。
3. **错误响应固定 \`{code, message, request_id}\`**，前端按 \`code\` 分支。

#### 联调前自测
用 \`curl\` 把上表每一行都打一次，保存到一个 \`docs/api-examples.http\` 文件里。前端可以直接拿去当例子，也方便你回归。

::q 为什么金额在接口层用「分」而不是「元」的浮点数？
::a 浮点数有精度问题，接口层传 \`35.5\` 再转分可能得到 3549 或 3551。统一用整数分，传输无精度损失，前后端都不用猜。展示层再除以 100。
::q 接口清单在联调前写，能避免什么返工？
::a 字段名不一致、单位不一致（分/元）、分页语义不一致（total 是总数还是剩余）、错误码不一致。这些问题在联调时才暴露，往往要同时改前后端，成本最高。

<!--day 25 | normal-->
#### 端到端回归：从注册到导出走一遍
\`\`\`bash
#!/usr/bin/env bash
set -euo pipefail
BASE=http://localhost:8080
J='Content-Type: application/json'

# 1. 注册 + 登录
curl -fsS -X POST $BASE/register -H "$J" -d '{"email":"e2e@x.com","password":"correct horse battery"}' >/dev/null
TOKEN=$(curl -fsS -X POST $BASE/login -H "$J" -d '{"email":"e2e@x.com","password":"correct horse battery"}' | jq -r '.data.token')

# 2. 建分类（如有）
# 3. 记三笔
for a in 3550 1200 800; do
  curl -fsS -X POST $BASE/ledger -H "$J" -H "Authorization: Bearer $TOKEN" \\
    -d "{\\"amount\\":$a,\\"category\\":\\"餐饮\\",\\"date\\":\\"2026-10-19\\"}" >/dev/null
done

# 4. 列表 / 分页
TOTAL=$(curl -fsS "$BASE/ledger?limit=2" -H "Authorization: Bearer $TOKEN" | jq '.data.total')
[ "$TOTAL" = "3" ] || { echo "total 错: $TOTAL"; exit 1; }

# 5. 统计
SUM=$(curl -fsS "$BASE/summary?month=2026-10" -H "Authorization: Bearer $TOKEN" | jq '.data.total')
[ "$SUM" = "5550" ] || { echo "sum 错: $SUM"; exit 1; }

# 6. 导出
curl -fsS "$BASE/ledger/export?month=2026-10" -H "Authorization: Bearer $TOKEN" -o /tmp/e2e.csv
grep -q "餐饮" /tmp/e2e.csv || { echo "CSV 内容异常"; exit 1; }

echo "E2E OK"
\`\`\`

#### 这个脚本最重要的价值
它把「阶段四的认证 + 阶段五的 GORM/统计/导出 + 阶段三的中间件」串成一条链。**任何一处改错，它都会立刻红。** 每次重构后跑一遍，比人肉点页面可靠。

#### 脚本要能自己造数据、自己清理
\`\`\`bash
EMAIL="e2e-$(date +%s)@x.com"      # 每次用新邮箱，避免唯一约束冲突
trap 'rm -f /tmp/e2e.csv' EXIT     # 退出时清理
\`\`\`
固定邮箱会让脚本第二次运行就失败（409 EMAIL_TAKEN）。有人于是把它改成「注册失败也继续」，脚本就再也测不出注册问题——**用时间戳生成唯一账号**是标准做法。

#### 断言要具体到值，不要只断言状态码
\`\`\`bash
SUM=$(curl -fsS "$BASE/summary?month=2026-10" -H "Authorization: Bearer $TOKEN" | jq '.data.total')
[ "$SUM" = "5550" ] || { echo "sum 错: 期望 5550 实际 $SUM"; exit 1; }
\`\`\`
只断言「HTTP 200」的脚本，在统计逻辑算错时依然是绿的。**数值断言才是真正的回归保护。**

#### 判据
脚本退出码为 0；把某条 SQL 的 \`user_id\` 条件删掉，脚本应当仍通过（因为只有单个用户）——所以**还要单独跑隔离测试**，两者互补。

::q 为什么端到端脚本仍不能替代数据隔离测试？
::a E2E 通常只用一个用户，无法发现「漏了 user_id 条件」的问题。隔离测试需要两个用户交叉读写，专门验证越权。两类测试覆盖不同风险，缺一不可。
::q 这类脚本应该多久跑一次？
::a 每次改动共享代码后、每次提交前跑一次，CI 里也跑。它耗时几秒，能挡住绝大多数「改了 A 坏了 B」的回归，性价比极高。

<!--day 26 | light-->
#### 阶段验收（逐条执行，不靠感觉）
\`\`\`bash
go test ./... -race -count=1        # 全绿
goose -dir migrations sqlite3 ledger.db up
./scripts/e2e.sh                     # OK
grep -r "WithContext(" internal/     # 应只在少数必要处，且配合 NewDB
grep -rn "Session(&gorm.Session{NewDB: true, Context: ctx})" internal/store | wc -l   # 每个方法都有
\`\`\`

#### 复盘：阶段五真正的三个收获
1. **懂了 \`Session{NewDB, Context}\` 为什么必须成对出现**——一个管条件隔离，一个管取消传播，缺一个就有隐患。
2. **懂了错误分层**：store 用 \`%w\` 保链，Service 翻译成语义，HTTP 层映射状态码。
3. **懂了测试的分工**：Service 用 fake 测规则，Repository 用内存库测 SQL，Handler 用 httptest 测契约，E2E 测串联。

#### 必须能回答的三个问题（答不出就是没学透）
- \`WithContext\` 和 \`Session{NewDB:true, Context:ctx}\` 的差别具体在哪一步？
- 为什么事务内不能再调 \`r.session(ctx)\`？
- 为什么 \`Updates(Entry{Amount:0})\` 不生效？

::q 阶段五结束时，最容易被忽略但最危险的一个隐患是什么？
::a 某条 SQL 漏了 \`user_id\`。它不会报错、不会崩溃，功能测试也全绿，但在多用户场景下就是越权。唯一可靠的防线是专门的隔离测试 + 代码审查时逐条检查 WHERE。
::q 为什么说 \`NewDB\` 和 \`Context\` 必须成对？
::a \`NewDB\` 解决链式条件污染（防止越权/查错数据），\`Context\` 解决取消与超时传播（防止连接被慢查询占死）。只做前者会失去取消能力，只做后者会留下条件残留。
`,gf=`<!--day 1 | normal-->
#### 配置的三层来源，优先级从低到高
\`\`\`
默认值 < 配置文件（yaml） < 环境变量
\`\`\`
\`\`\`go
type Config struct {
    Addr      string \`yaml:"addr"\`
    DBPath    string \`yaml:"db_path"\`
    JWTSecret string \`yaml:"-"\`
    LogLevel  string \`yaml:"log_level"\`
}

func Load() (*Config, error) {
    c := &Config{Addr: ":8080", DBPath: "ledger.db", LogLevel: "info"}   // 1. 默认值
    if b, err := os.ReadFile("config.yaml"); err == nil {
        if err := yaml.Unmarshal(b, c); err != nil { return nil, fmt.Errorf("parse config: %w", err) }
    }
    if v := os.Getenv("ADDR"); v != "" { c.Addr = v }                      // 2. 环境变量覆盖
    if v := os.Getenv("DB_PATH"); v != "" { c.DBPath = v }
    c.JWTSecret = os.Getenv("JWT_SECRET")                                  // 3. 密钥只从环境变量来
    return c, c.validate()
}
\`\`\`
**默认值让本地开发零配置就能跑**，环境变量让容器部署不用改文件。

#### 为什么密钥不走 yaml
配置文件的常见命运是被提交进仓库、被打进镜像、被复制到聊天里。密钥一旦进 yaml，就等同于公开。**密钥只能来自环境变量或 secrets 挂载。**

#### 配置结构体只解析一次
在 \`main\` 里 \`Load()\` 一次，然后把具体字段传给需要的地方（\`store.MustOpen(cfg.DBPath)\`），不要到处 \`os.Getenv\`。散落的 \`Getenv\` 无法被测试、无法被校验、也无法生成配置文档。

#### 判据
\`\`\`bash
./api                              # 用默认值启动
ADDR=:9090 ./api                   # 端口被环境变量覆盖
ADDR=:9090 ./api &                 # 日志里应打印最终生效的值
\`\`\`
再写一个 \`config_test.go\`，验证「env 覆盖 yaml、yaml 覆盖默认」三层顺序。

::q 为什么密钥不应该放在 yaml 配置文件里？
::a 配置文件通常会被提交到仓库、打进镜像或复制传播，密钥一旦写入就很容易泄漏且难以追溯。环境变量或 secrets 挂载可以做到「配置与密钥分离」，且不落盘到镜像层。
::q 到处直接调用 \`os.Getenv\` 有什么问题？
::a 无法集中校验（缺失时不知道）、无法在测试中注入、无法生成配置清单、也无法保证类型转换一致。集中到 \`Load()\` 一次解析成结构体，才能在启动时发现所有配置问题。
::q 为什么要保留默认值？
::a 让本地开发和测试零配置可跑，降低上手成本；同时默认值必须是「安全且可用」的（比如数据库路径、监听地址），不能是空值导致启动失败。

<!--day 2 | normal-->
#### 启动即失败（fail fast）比运行时出错好
\`\`\`go
func (c *Config) validate() error {
    if c.Addr == "" { return errors.New("ADDR 不能为空") }
    if c.DBPath == "" { return errors.New("DB_PATH 不能为空") }
    if len(c.JWTSecret) < 32 {
        return fmt.Errorf("JWT_SECRET 至少 32 字节，当前 %d", len(c.JWTSecret))
    }
    switch c.LogLevel {
    case "debug", "info", "warn", "error":
    default:
        return fmt.Errorf("未知日志级别: %s", c.LogLevel)
    }
    return nil
}
\`\`\`
**配置错误必须在进程启动的 100ms 内暴露**，而不是等到第一个请求。容器编排会立刻看到退出码非 0，进入重启或告警流程。

#### 反例：默认值兜底
\`\`\`go
secret := os.Getenv("JWT_SECRET")
if secret == "" {
    secret = "dev-secret"     // ❌ 生产环境也用了这个
}
\`\`\`
这类代码会以「看起来正常但完全不安全」的方式上线。正确做法是：**开发环境用 \`.env\` 显式提供，生产缺失就退出。**

#### 启动日志要能自证配置
\`\`\`go
slog.Info("config loaded",
    "addr", cfg.Addr,
    "db_path", cfg.DBPath,
    "log_level", cfg.LogLevel,
    "jwt_secret_len", len(cfg.JWTSecret),   // 只打长度，不打值
)
\`\`\`
部署出问题时，第一件事就是看这行日志确认配置是否如预期。**密钥永远不打值。**

#### 判据
\`\`\`bash
./api                                   # 无 JWT_SECRET → 退出码 1 + 明确提示
JWT_SECRET=short ./api                  # 提示长度不足
JWT_SECRET=$(openssl rand -hex 32) ./api  # 正常启动
\`\`\`

::q 为什么配置错误要在启动时失败，而不是第一次用到时才报错？
::a 启动时失败能被容器编排立刻发现（退出码非 0、重启策略触发、告警发出），问题在部署阶段就暴露。拖到运行时，表现为随机 500，排查成本高得多。
::q 用默认密钥兜底为什么危险？
::a 默认密钥通常写在代码里、对内公开，任何人都能伪造 token。更糟的是它会掩盖配置缺失，让部署「看起来成功」，实际毫无安全性。
::q 启动日志里为什么只打印密钥长度？
::a 长度足以判断「是否配置了、是否符合最小要求」，而打印明文密钥会让它进入日志系统，构成泄漏。日志经常被更广泛的人访问，密钥不该出现在那里。

<!--day 3 | normal-->
#### 多阶段构建：编译环境和运行环境分离
\`\`\`dockerfile
# ---- build ----
FROM golang:1.23-alpine AS build
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -trimpath -ldflags="-s -w" -o /out/api ./cmd/api

# ---- runtime ----
FROM alpine:3.20
RUN apk add --no-cache ca-certificates tzdata && adduser -D -u 10001 app
WORKDIR /app
COPY --from=build /out/api /app/api
COPY --from=build /src/migrations /app/migrations
USER app
EXPOSE 8080
ENTRYPOINT ["/app/api"]
\`\`\`
四个关键点：
1. **先 \`COPY go.mod go.sum\` 再 \`go mod download\`**：依赖层被缓存，改代码不会重新下载依赖。
2. **\`CGO_ENABLED=0\`**：产出静态二进制，运行镜像不需要 glibc。
3. **\`-trimpath -ldflags="-s -w"\`**：去掉本地路径信息和符号表，体积更小、也更少泄漏构建环境。
4. **\`ca-certificates\` + \`tzdata\`**：不装的话 HTTPS 请求会失败、时区会变成 UTC（对中国用户是 8 小时偏差）。

#### 一定要有 \`.dockerignore\`
\`\`\`
node_modules
dist
.git
*.db
.env
\`\`\`
不写的话 \`COPY . .\` 会把本地数据库、\`.env\`、\`.git\` 全打进镜像——既臃肿又泄漏密钥。

#### 判据
\`\`\`bash
docker build -t ledger-api .
docker images ledger-api      # 应该在 20–30MB 量级
docker run --rm ledger-api    # 能启动并打印配置日志
\`\`\`

::q 为什么 \`go.mod\`/\`go.sum\` 要单独先 COPY？
::a Docker 按层缓存：依赖文件不变时 \`go mod download\` 这一层直接复用，改业务代码只需重新编译，构建时间从几分钟降到几秒。如果一起 COPY，任何代码改动都会让依赖重新下载。
::q \`CGO_ENABLED=0\` 的作用是什么？
::a 禁用 CGO，产出纯静态二进制，不依赖运行时的 libc。这样运行镜像可以用 alpine 甚至 scratch，体积更小、跨环境更稳定。\`modernc.org/sqlite\` 正是为了不依赖 CGO 才被选用。
::q \`.dockerignore\` 不写会导致什么？
::a 本地 \`.env\`、数据库文件、\`.git\` 目录会被 \`COPY . .\` 打进镜像，既增大体积，又可能把密钥和历史提交泄漏给任何能拉取镜像的人。

<!--day 4 | normal-->
#### 非 root 运行，不只是「更安全」
\`\`\`dockerfile
RUN adduser -D -u 10001 app
USER app
\`\`\`
root 容器里，进程被攻破等于拿到宿主机的高权限（尤其在挂载了目录、共享了网络时）。非 root 用户即使被攻破，破坏范围也被限制。

如果程序需要写数据库文件，**要提前把目录权限给对**：
\`\`\`dockerfile
RUN mkdir -p /data && chown -R app:app /data
VOLUME /data
\`\`\`
否则运行时会报 \`unable to open database file\`，而错误信息往往指向「数据库损坏」，很容易排查错方向。

#### SQLite 的额外注意
- 数据库文件所在目录**必须可写**（SQLite 需要在同目录写 \`-wal\`、\`-shm\`、日志文件）。
- 不要用只读挂载，除非确实只读查询。
- 卷的属主问题在容器里很常见：宿主机目录属主是 root，容器内 \`app\` 用户无法写。

#### 判据
\`\`\`bash
docker run --rm ledger-api id          # uid=10001，不是 0
docker run --rm -v $(pwd)/data:/data ledger-api   # 能正常写库
ls -l data/ledger.db                    # 属主是 10001
\`\`\`

::q 容器里用 root 运行的实际风险是什么？
::a 进程被攻破后拥有容器内 root 权限，若挂载了宿主机目录或有特权配置，可直接影响宿主机；也可能修改镜像内文件、读取敏感挂载。非 root 用户能把破坏面限制在授权目录内。
::q SQLite 数据库目录不可写时会出现什么错误？
::a 通常是 \`unable to open database file\`，还可能伴随无法创建 \`-wal\`/\`-shm\` 文件。错误信息容易被误读为「数据库损坏」，实际是权限问题。排查时先看目录属主和写权限。
::q 为什么挂载卷的属主问题在容器里特别常见？
::a 宿主机上的目录通常属于宿主用户（或 root），容器内的非 root 用户 uid 不同，没有写权限。需要在 Dockerfile 里创建对应 uid 并 chown，或在启动时调整目录权限。

<!--day 5 | core-->
#### compose 的四个要素
\`\`\`yaml
services:
  api:
    image: ledger-api:latest
    build: .
    ports:
      - "8080:8080"
    environment:
      DB_PATH: /data/ledger.db
      JWT_SECRET: \${JWT_SECRET:?JWT_SECRET required}
      LOG_LEVEL: info
    volumes:
      - ./data:/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:8080/healthz"]
      interval: 30s
      timeout: 3s
      retries: 3
\`\`\`
四个要素都不可省：
1. **\`environment\` 里用 \`\${VAR:?err}\`**：变量缺失时 compose 直接报错退出，而不是传空值进去。
2. **\`volumes\` 持久化 SQLite**：不挂卷，容器重建数据就没了。
3. **\`restart: unless-stopped\`**：宿主机重启后自动拉起，但你手动 stop 的不会被强行重启。
4. **\`healthcheck\`**：让编排系统知道容器「活着但不健康」和「死了」是两回事。

#### \`depends_on\` 不等于「等它就绪」
\`\`\`yaml
depends_on:
  db:
    condition: service_healthy   # 需要目标有 healthcheck
\`\`\`
只写 \`depends_on: [db]\` 只保证**启动顺序**，不保证 db 已经能接受连接。用 \`condition: service_healthy\` 才能真正等待。

#### 数据卷的两种写法
- \`./data:/data\`：绑定挂载，数据在项目目录，便于备份和查看，但依赖宿主机路径。
- \`ledger-data:/data\`：命名卷，由 Docker 管理，可移植性好，但不易直接访问。

家庭部署用绑定挂载更直观——出问题能直接 \`sqlite3 data/ledger.db\` 查看。

#### 判据
\`\`\`bash
docker compose up -d
docker compose ps                  # api 状态 healthy
curl localhost:8080/healthz        # 200
docker compose restart api && curl localhost:8080/ledger -H "Authorization: Bearer $T"
# 数据还在
\`\`\`

::q \`depends_on\` 只写服务名，能保证数据库就绪吗？
::a 不能。它只保证启动顺序（先启动 db 容器，再启动 api 容器），不等待数据库真正可连接。此时 api 启动时连接会失败。需要给 db 配 healthcheck 并用 \`condition: service_healthy\`。
::q \`restart: unless-stopped\` 和 \`always\` 的区别？
::a \`always\` 在宿主机重启后也会拉起，包括你手动 \`stop\` 的服务（某些版本会）；\`unless-stopped\` 会记住「你主动停过」，重启后不拉起。后者更符合「运维意图优先」的预期。
::q 为什么环境变量要用 \`\${JWT_SECRET:?required}\` 这种写法？
::a 缺少变量时 compose 会立刻报错并停止，避免把空密钥传进容器导致「启动成功但完全不安全」。这是把配置校验前移到编排层，比运行时才发现更早。

<!--day 6 | normal-->
#### 迁移不能靠应用启动时自动跑（多实例场景）
单实例家庭部署可以在 \`main\` 里 \`goose.Up\`，但更稳的做法是把迁移做成**独立的一次性任务**：
\`\`\`yaml
services:
  migrate:
    image: ledger-api:latest
    entrypoint: ["/app/migrate"]
    environment:
      DB_PATH: /data/ledger.db
    volumes:
      - ./data:/data
    restart: "no"

  api:
    depends_on:
      migrate:
        condition: service_completed_successfully
\`\`\`
\`service_completed_successfully\` 保证迁移成功退出后才启动 api。**迁移失败时 api 不会启动**，避免用旧结构跑新代码。

#### 为什么不用「启动时自动迁移」
1. 多副本同时启动会并发执行迁移，可能冲突。
2. 迁移失败会让应用无法启动，但如果应用已经跑起来一半（比如先监听再迁移），状态会很乱。
3. 无法单独回滚。

#### 迁移命令要能手动执行
\`\`\`bash
docker compose run --rm migrate status
docker compose run --rm migrate up
docker compose run --rm migrate down 1
\`\`\`
部署前先 \`status\`，出问题时能立刻判断「迁移到第几版了」。

#### 判据
\`\`\`bash
docker compose up migrate    # 退出码 0
docker compose up -d api
docker compose logs migrate  # 看到 "OK 00002_add_budget.sql"
\`\`\`

::q 为什么推荐把迁移做成独立的 compose 服务，而不是应用启动时自动执行？
::a 多副本场景下并发迁移会互相冲突；迁移失败时应用可能带着错误结构启动；也无法独立回滚或单独重跑。独立服务 + \`service_completed_successfully\` 让顺序和失败语义都明确。
::q \`condition: service_completed_successfully\` 相比 \`service_started\` 的意义？
::a 前者等待容器**成功退出**（退出码 0），保证迁移真的执行完且没出错；后者只等容器启动，迁移可能还在跑或已经失败，api 就带着错误结构启动了。

<!--day 7 | normal-->
#### 两个探针，两个问题
- **\`/healthz\`（liveness）**：进程还活着吗？失败 → 重启容器。
- **\`/readyz\`（readiness）**：能接受流量吗？失败 → 从负载均衡摘掉，但不重启。

混用会出事故：把「数据库连不上」写进 liveness，数据库短暂抖动就会导致容器被反复重启，反而放大故障。

\`\`\`go
func healthz(w http.ResponseWriter, r *http.Request) {
    w.WriteHeader(http.StatusOK)
    w.Write([]byte(\`{"status":"ok"}\`))
}

func readyz(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), time.Second)
        defer cancel()
        if err := db.PingContext(ctx); err != nil {
            w.WriteHeader(http.StatusServiceUnavailable)
            w.Write([]byte(\`{"status":"unready"}\`))
            return
        }
        w.WriteHeader(http.StatusOK)
        w.Write([]byte(\`{"status":"ready"}\`))
    }
}
\`\`\`
**探针必须有超时**，否则数据库挂住时探针也挂住，编排系统无法判断。

#### 探针不应该要求认证
\`/healthz\`、\`/readyz\` 必须放在认证中间件之外。套上认证会导致编排系统的探测始终 401，容器被判定不健康——**这是最容易犯的部署错误之一**。

#### 探针设计里三个容易做错的决定
1. **是否检查依赖**。\`/readyz\` 检查数据库是对的，\`/healthz\` 绝对不该检查——否则数据库抖一下，编排系统就把所有副本重启一遍。
2. **超时给多少**。探针超时要**小于**编排系统的探测超时（如 compose 的 \`timeout: 3s\`），否则你的探针还卡着，编排系统已经判定失败。
3. **返回体要不要 JSON**。HEAD 请求可能被探测，某些探测器只看状态码。写 JSON 无害，但不要依赖它。

#### 实现上的一个小陷阱
\`\`\`go
func readyz(db *sql.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        ctx, cancel := context.WithTimeout(r.Context(), time.Second)
        defer cancel()
        if err := db.PingContext(ctx); err != nil {
            w.WriteHeader(http.StatusServiceUnavailable)
            return
        }
        w.WriteHeader(http.StatusOK)
    }
}
\`\`\`
- **必须用 \`r.Context()\` 派生**，这样客户端断开时探测也会结束。
- \`defer cancel()\` 不能省，否则每次探测泄漏一个定时器。
- \`PingContext\` 在连接池满时会**排队等待**，所以超时设 1 秒是必要的，别用 \`db.Ping()\`。

#### 判据
\`\`\`bash
curl -i localhost:8080/healthz     # 200，无需 token
curl -i localhost:8080/readyz      # 200
# 把 DB_PATH 改错重启 → readyz 503，healthz 仍 200
\`\`\`

::q liveness 和 readiness 混用会导致什么问题？
::a 若把「数据库不可用」写进 liveness，一次短暂抖动就会让编排系统重启容器，重启期间请求全部失败，故障被放大。liveness 只应反映「进程是否卡死」，依赖健康属于 readiness。
::q 探针为什么必须设置超时？
::a 依赖挂住（比如数据库连接池耗尽）时，Ping 可能长时间不返回。没有超时，探针请求也挂住，编排系统拿不到明确结果，无法做出重启或摘流量的决策。
::q 健康检查接口被认证中间件拦住会怎样？
::a 编排系统没有 token，探测永远返回 401，容器被判定为不健康并不断重启，形成「服务其实是好的但一直在重启」的诡异状态。健康检查必须匿名可访问。

<!--day 8 | core-->
#### 优雅关闭解决的是「正在处理的请求被腰斩」
直接 \`kill\` 进程时，正在执行的请求会瞬间断开，客户端看到连接重置；数据库写入可能做到一半。优雅关闭要做的是：**停止接受新连接 → 等待在途请求完成 → 释放资源**。

#### 前提：Server 必须有超时
\`\`\`go
srv := &http.Server{
    Addr:              cfg.Addr,
    Handler:           router,
    ReadHeaderTimeout: 5 * time.Second,
    ReadTimeout:       30 * time.Second,
    WriteTimeout:      30 * time.Second,
    IdleTimeout:       120 * time.Second,
}
\`\`\`
没有超时的服务器，\`Shutdown\` 可能永远等不完（有慢连接一直挂着），最终被强制杀死——优雅关闭形同虚设。**超时是优雅关闭的前提，不是可选项。**

#### 关闭顺序：先停服务，再关数据库
\`\`\`go
ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)
defer stop()

go func() {
    if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
        slog.Error("listen", "err", err)
        os.Exit(1)
    }
}()

<-ctx.Done()
slog.Info("shutting down")

shutdownCtx, cancel := context.WithTimeout(context.Background(), 15*time.Second)
defer cancel()

if err := srv.Shutdown(shutdownCtx); err != nil {
    slog.Error("shutdown", "err", err)     // 超时，仍有请求未完成
}
if err := sqlDB.Close(); err != nil {      // 必须在 Shutdown 之后
    slog.Error("close db", "err", err)
}
slog.Info("bye")
\`\`\`
两条铁律：
1. **\`Shutdown\` 用新的 ctx**，不能用已经被 cancel 的那个（否则立刻超时）。
2. **\`db.Close()\` 在 \`Shutdown\` 之后**。顺序反了，在途请求会拿到已关闭的连接池，直接 500。

#### \`Shutdown\` 做了什么、没做什么
- 做：关闭监听 socket、停止接受新连接、等待在途请求结束（直到 ctx 超时）。
- 不做：强制中断超时的请求。超时后仍会返回，那些请求会被断开。

#### 判据
\`\`\`bash
# 起一个故意慢的请求（sleep 3s），同时发 SIGTERM
curl localhost:8080/slow &
kill -TERM $(pgrep api)
# 观察：慢请求正常返回 200，然后进程退出，日志有 "bye"
\`\`\`

::q 为什么 \`srv.Shutdown\` 的 ctx 不能复用 \`signal.NotifyContext\` 返回的那个？
::a 后者在收到信号时已经被 cancel，直接传进去会让 \`Shutdown\` 立即超时返回，在途请求被强行中断，优雅关闭失效。必须用 \`context.WithTimeout(context.Background(), ...)\` 新建一个。
::q \`db.Close()\` 放在 \`Shutdown\` 之前会怎样？
::a 在途请求仍在执行，它们需要的连接已随 \`db.Close()\` 释放，后续查询会报 \`sql: database is closed\`，用户看到 500。必须先等在途请求结束再关数据库。
::q 没有设置 \`WriteTimeout\` 会有什么后果？
::a 慢客户端可以无限期占用连接（Slowloris 类攻击），\`Shutdown\` 也可能一直等不完。设置读写超时既是防护，也是让优雅关闭有确定上界的前提。

<!--day 9 | core-->
#### 用实验验证「真的优雅」
\`\`\`bash
# 终端 1：启动服务
JWT_SECRET=$(openssl rand -hex 32) ./api

# 终端 2：发一个慢请求（用 /slow 或大导出接口）
time curl -s -o /dev/null -w "%{http_code}\\n" localhost:8080/ledger/export

# 终端 3：在请求进行中发送信号
pkill -TERM -f '/app/api'
\`\`\`
预期：
1. 慢请求返回 200（不是连接重置）。
2. 服务日志出现 \`shutting down\` → 请求完成日志 → \`bye\`。
3. 进程退出码 0。

#### 三个常见失败现象与原因
| 现象 | 原因 |
| :--- | :--- |
| 请求被重置（curl 报 52/56） | 没调 \`Shutdown\`，直接 \`os.Exit\` |
| \`Shutdown\` 立刻返回且日志报超时 | 用了已 cancel 的 ctx |
| 请求返回 500 \`database is closed\` | \`db.Close()\` 在 \`Shutdown\` 之前 |

#### docker stop 的默认超时
\`docker stop\` 默认等 10 秒后 \`SIGKILL\`。如果服务的关闭流程需要更久，要显式配置：
\`\`\`yaml
services:
  api:
    stop_grace_period: 30s
\`\`\`
否则你会看到「明明写了优雅关闭，容器还是被强杀」——因为 10 秒不够。

#### 关不掉的三种真实原因
优雅关闭验证失败，几乎都是这三类之一：

| 现象 | 根因 | 排查方式 |
| :--- | :--- | :--- |
| \`srv.Shutdown\` 一直等到超时 | 有 handler 卡在不会返回的调用上（死循环、无超时的 HTTP 客户端、阻塞的 channel 接收） | 加日志打印每个请求的开始/结束，看哪条请求没结束 |
| 进程立即退出，请求被重置 | \`main\` 里在 \`Shutdown\` 之后还有 \`os.Exit\`，或信号处理只写了 \`default\` 分支 | 检查是否有 \`os.Exit\` 绕过了 defer 和等待逻辑 |
| 容器退出码 137 | 关闭耗时超过 \`stop_grace_period\`（默认 10s）被 SIGKILL | \`docker inspect\` 看 \`State.ExitCode\`，调大宽限期或修掉慢 handler |

#### 怎么构造一个「必然卡住」的请求
验证时你需要一个可控的慢 handler：
\`\`\`go
mux.HandleFunc("GET /slow", func(w http.ResponseWriter, r *http.Request) {
    select {
    case <-time.After(3 * time.Second):
        w.Write([]byte("done"))
    case <-r.Context().Done():
        // 客户端断开或被取消
    }
})
\`\`\`
注意它监听 \`r.Context().Done()\`：如果 \`Shutdown\` 粗暴地中断请求，这里会走到 cancel 分支，你能立刻从日志看出「请求被中断了」。

#### 一个常被忽略的细节：keep-alive 连接
\`Shutdown\` 会关闭空闲的 keep-alive 连接，但**正在处理请求的连接会保留到请求结束**。所以「服务停了但连接还在」是正常的。如果客户端复用连接池，它下次请求会收到连接关闭并自动重连——**前提是客户端处理了这种情况**，否则会报 \`EOF\`。

#### 退出前该做的最后三件事
\`\`\`go
srv.Shutdown(ctx)                 // 1. 停止接新请求
sqlDB.Close()                     // 2. 关连接池
slog.Info("bye", "uptime", time.Since(boot))   // 3. 留一条可搜索的结束日志
\`\`\`
第三条不是形式主义：**日志里没有 "bye" 就说明进程是被强杀的**，这是区分「正常停机」和「崩溃」最快的信号。

#### 判据
\`\`\`bash
docker stop api        # 退出码 0，日志完整
docker inspect api --format '{{.State.ExitCode}}'   # 0
\`\`\`
退出码 137 表示被 SIGKILL（超时强杀），说明关闭时间不够或逻辑有阻塞。

::q \`docker stop\` 之后容器退出码 137 说明什么？
::a 137 = 128 + 9，表示被 SIGKILL 强制杀死。通常是因为关闭流程超过了 \`stop_grace_period\`（默认 10 秒），docker 等不及就强杀。需要检查是否有请求未完成或关闭逻辑阻塞，必要时调大宽限期。
::q 为什么验证优雅关闭必须用「在途请求」而不是空跑？
::a 没有在途请求时，\`Shutdown\` 会立刻返回，看起来「一切正常」，但真正的问题（请求被中断、连接池提前关闭）不会暴露。必须有一个正在执行的慢请求来检验等待逻辑。
::q 关闭过程中新请求会怎样？
::a \`Shutdown\` 一被调用就关闭监听 socket，新连接直接被拒绝（连接被拒而非 500）。这正是期望行为：负载均衡会把流量摘走，客户端重试到其他实例。

<!--day 10 | normal-->
#### CORS 的本质：浏览器在替用户拦截
跨源请求（协议/域名/端口任一不同）时，浏览器会检查响应头是否允许。**CORS 是浏览器行为，curl 不受影响**——所以「curl 能通、前端报 CORS」是正常现象。

#### 开发期两种解法
1. **Vite 代理**（推荐）：
\`\`\`ts
// vite.config.ts
server: {
  proxy: { '/api': { target: 'http://localhost:8080', changeOrigin: true, rewrite: p => p.replace(/^\\/api/, '') } }
}
\`\`\`
前端请求 \`/api/ledger\`，由 dev server 转发，浏览器看到的是同源，没有 CORS 问题。

2. **后端开 CORS**：
\`\`\`go
w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
w.Header().Set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS")
w.Header().Set("Access-Control-Allow-Headers", "Content-Type,Authorization")
w.Header().Set("Access-Control-Allow-Credentials", "true")
if r.Method == http.MethodOptions {
    w.WriteHeader(http.StatusNoContent)
    return
}
\`\`\`
\`Allow-Credentials: true\` 时 **\`Allow-Origin\` 不能是 \`*\`**，必须是具体源（浏览器强制）。这是「带 cookie 的跨源请求失败」最常见的原因。

#### 生产环境：用反向代理做成同源
\`\`\`
浏览器 → https://ledger.example.com/        → 静态文件
       → https://ledger.example.com/api/... → 反代到 :8080
\`\`\`
同源就没有 CORS，也不用暴露后端端口。家庭部署可以用 Caddy/Nginx，甚至直接用同一台机器的路径前缀。

#### 判据
\`\`\`bash
curl -i -X OPTIONS localhost:8080/ledger \\
  -H 'Origin: http://localhost:5173' \\
  -H 'Access-Control-Request-Method: POST'
# 204 + 正确的 Allow-* 头
\`\`\`

::q 为什么 \`curl\` 测试正常，前端却报 CORS 错误？
::a CORS 是浏览器实施的安全策略，\`curl\` 不执行同源检查。浏览器会发预检请求并校验响应头，缺失或不匹配就阻止读取响应。所以必须用浏览器或带 \`Origin\` 头的请求来验证。
::q \`Allow-Credentials: true\` 时为什么不能用 \`Allow-Origin: *\`？
::a 浏览器禁止这种组合：带凭证（cookie）的跨源请求必须明确指定允许的源，否则任意站点都能携带用户 cookie 发请求，等于绕过同源策略。必须回显具体 Origin 并做白名单校验。
::q 生产环境为什么优先用反向代理而不是后端开 CORS？
::a 同源部署彻底消除 CORS 复杂度，还能隐藏后端端口、统一 TLS、统一限流。CORS 是「不得不跨源时」的方案，不是默认选择。

<!--day 11 | normal-->
#### 扫描依赖漏洞，而不是靠印象
\`\`\`bash
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
\`\`\`
输出会指出：哪个依赖、哪个 CVE、**你的代码是否真的调用到了漏洞函数**（这是它比其他扫描器有用的地方——只报「可达」的漏洞，噪音小）。

#### 集成到构建前
\`\`\`bash
govulncheck ./... || exit 1
docker build -t ledger-api .
\`\`\`
放在构建前，漏洞会挡住发布。放在发布后，就只是「事后知道」。

#### 修复策略
1. **优先升级依赖**：\`go get -u ./...\` 后跑测试。
2. **无法升级时**，确认代码是否真的走到漏洞路径；如果走不到，记录原因（并在注释里写清）。
3. **标准库漏洞**，升级 Go 版本。

#### 扫描结果怎么读
\`govulncheck\` 的输出分两类，含义完全不同：
- **你的代码调用了漏洞函数**（有调用栈）→ 真实风险，必须处理。
- **依赖里有漏洞但没有调用路径** → 当前不可达，记录并跟踪，不必立即阻断。

这个区分很重要：它把「升级一切」变成了「只处理真正会执行的代码路径」，否则每跑一次都是几十条告警，最后没人看。

#### 一个实际的取舍
升级依赖可能引入行为变化（尤其 \`gorm\` 这类大版本）。策略：
\`\`\`bash
go get -u=patch ./...        # 先只升补丁版本，风险最小
go test ./... -race         # 必须全绿
govulncheck ./...           # 再扫一次
\`\`\`
补丁升级解决不了时，才考虑次版本/大版本，并单独做一次回归。

#### 判据
\`\`\`bash
govulncheck ./...
# 输出 "No vulnerabilities found." 才算通过
\`\`\`
如果有输出，逐条看是不是真的可达；可达就必须处理，不能「先放着」。

::q \`govulncheck\` 和普通的依赖扫描器有什么区别？
::a 它会做「可达性分析」：只有当你代码实际调用到含漏洞的函数时才报告。普通扫描器只看依赖版本，会报大量实际不可达的漏洞，导致告警疲劳。当然，不可达不代表永远安全，升级后行为可能变化。
::q 发现漏洞但暂时无法升级依赖，该怎么办？
::a 先确认代码是否真的走到漏洞路径（\`govulncheck\` 的调用栈能看出来）。走不到就记录原因和评估结论，并设一个跟踪项；走得到就必须升级或改用替代方案。不能只是「知道了」。
::q 为什么要把扫描放在 \`docker build\` 之前？
::a 让它成为发布的必经关卡，漏洞会阻断构建。放在之后，镜像已经产出，容易「先发了再说」。安全检查只有前置才有约束力。

<!--day 12 | core-->
#### Cookie 的三个属性，缺一不可
\`\`\`go
http.SetCookie(w, &http.Cookie{
    Name:     "session",
    Value:    token,
    Path:     "/",
    HttpOnly: true,                      // JS 读不到，防 XSS 窃取
    Secure:   true,                      // 只走 HTTPS
    SameSite: http.SameSiteLaxMode,      // 限制跨站携带
    MaxAge:   7200,
})
\`\`\`
- **\`HttpOnly\`**：\`document.cookie\` 读不到。XSS 仍能「以用户身份发请求」，但偷不走 token 带到别的站点。
- **\`Secure\`**：明文 HTTP 不发送。本地开发用 \`localhost\` 时浏览器仍允许（localhost 被视为安全上下文），但要在配置里区分环境。
- **\`SameSite\`**：\`Lax\` 允许顶级导航的 GET 携带，阻止跨站 POST；\`Strict\` 更严，但会让「从外部链接点进来」处于未登录状态。

#### 为什么 \`SameSite\` 不能替代 CSRF 防护
IETF 明确说明：\`Lax\` 对「依赖不安全 HTTP 方法的 CSRF」提供了**合理的纵深防御**，但作为通用类别的 CSRF 防御**并不充分**。原因包括：
- 老浏览器不支持 \`SameSite\`。
- 同站（same-site）不同源（如子域被攻破）仍可发起攻击。
- 某些客户端行为差异。

所以：**\`SameSite\` 是第一道防线，CSRF token 是第二道。两者是叠加，不是二选一。**

#### Bearer + localStorage 的取舍
- 优点：不需要 CSRF 防护（不会自动携带）。
- 缺点：任何 XSS 都能读走 token，且 token 长期有效时风险更大。

**家庭内网场景，Cookie + CSRF 更安全**——因为 XSS 在自建前端上概率低，而 token 放 localStorage 一旦泄漏就是长期风险。

#### 判据
浏览器 DevTools → Application → Cookies：
- \`HttpOnly\` 打勾
- \`Secure\` 打勾（HTTPS 下）
- \`SameSite\` 显示 \`Lax\`

再用 JS 执行 \`document.cookie\`，**不应出现** session。

::q \`HttpOnly\` 能防住 XSS 吗？
::a 不能完全防住。它只阻止 JS 读取 cookie，攻击者仍可以在页面里以用户身份发起请求（因为 cookie 会自动携带）。它的价值是防止 token 被窃取到外部长期使用，缩小影响范围。
::q 为什么 \`SameSite=Lax\` 不足以单独防 CSRF？
::a 它依赖浏览器实现（老版本不支持）、对同站不同源无效、且对不同请求方式的处理有差异。IETF 认为它是纵深防御的一层，不能作为唯一机制。CSRF token 校验的是「请求来自我们的页面」，与浏览器行为无关。
::q 选择 Cookie 还是 Bearer + localStorage，核心权衡是什么？
::a Cookie 自动携带，方便但也带来 CSRF 风险（需额外防护），优势是 \`HttpOnly\` 让 XSS 偷不走 token。localStorage 不会被自动携带、无需 CSRF，但任何 XSS 都能直接读走 token。安全模型不同，不是「哪个更先进」。

<!--day 13 | core-->
#### CSRF 攻击的最小模型
1. 用户已登录 \`ledger.example.com\`，浏览器持有 cookie。
2. 用户访问了 \`evil.com\`，页面里有一个自动提交的表单：
\`\`\`html
<form action="https://ledger.example.com/ledger" method="POST">
  <input name="amount" value="999999">
</form>
<script>document.forms[0].submit()<\/script>
\`\`\`
3. 浏览器**自动带上 cookie**，请求合法通过认证，账目被写入。

关键点：攻击者不需要读到响应，只需要「让请求发生」。所以防御的核心是**证明请求来自我们自己的页面**。

#### 双提交 / 同步令牌
\`gorilla/csrf\` 用同步令牌模式：服务端下发一个随机 token（放在 cookie 或页面里），表单/请求头必须带上同样的值，服务端比对。攻击者的站点无法读取该 token（同源策略），因此无法伪造。

\`\`\`go
csrfMiddleware := csrf.Protect(
    []byte(csrfKey),                  // 32 字节密钥
    csrf.Secure(true),                // 生产环境 HTTPS
    csrf.SameSite(csrf.SameSiteLaxMode),
    csrf.Path("/"),
)
handler := csrfMiddleware(router)     // 包住整个 router
\`\`\`

#### 中间件顺序：这是本阶段最容易做错的一处
**\`csrf.Protect()\` 必须是第一个业务中间件，包裹整个路由器**：
\`\`\`go
h := router
h = WithAuth(h)
h = WithRateLimit(h)
h = csrfMiddleware(h)      // 包住 router 和 auth
h = WithRecovery(h)        // 最外层
\`\`\`
推荐顺序：**Recovery → CSRF → RateLimit → Auth**。

为什么 CSRF 要在 Auth 之前、且包住整个 router：
- 放在路由匹配之后，未匹配的路径（\`/healthz\`、静态文件）会**绕过校验**。
- 放在 Auth 之后，未认证请求会先消耗认证开销；且认证失败的响应路径可能绕过 CSRF 检查。

#### 必须豁免的路径
- \`/healthz\`、\`/readyz\`（编排系统探测，没有 token）。
- 静态资源（GET，本来也不校验）。
- 如果前端用 \`Authorization: Bearer\`，则不需要 CSRF——**但不要两套混用**，会产生「有些接口校验、有些不校验」的混乱。

#### 前端要配合
- 从 cookie 读 \`csrf_token\`（这个 cookie 不能 \`HttpOnly\`），放进请求头 \`X-CSRF-Token\`。
- fetch 要带 \`credentials: 'include'\`。

#### 判据
\`\`\`bash
# 不带 token 的 POST 必须 403
curl -i -X POST localhost:8080/ledger -H "Cookie: session=$S" -d '{"amount":100}'
# 403 Forbidden - CSRF token not found

# 带正确 token 通过
curl -i -X POST localhost:8080/ledger -H "Cookie: session=$S; csrf_token=$C" -H "X-CSRF-Token: $C" ...
# 201
\`\`\`
再确认 \`/healthz\` 不需要 token 也能 200。

::q 为什么 \`csrf.Protect()\` 必须包住整个路由器，而不是挂在具体路由上？
::a 挂在路由之后只对匹配到的路径生效，未匹配的路径（健康检查、静态文件、404 处理）会绕过校验。攻击者可利用这些路径做状态变更或探测。包住整个 router 才能保证「所有请求都先过 CSRF」。
::q 中间件顺序为什么是 Recovery → CSRF → RateLimit → Auth？
::a Recovery 最外层才能捕获内层所有 panic；CSRF 紧随其后，尽早拦掉伪造请求，避免它们消耗限流配额和认证开销；RateLimit 对通过校验的请求限流；Auth 最后，只对合法请求做身份验证。
::q 用了 Bearer token 还需要 CSRF 吗？
::a 不需要，因为浏览器不会自动携带 \`Authorization\` 头，攻击者站点无法让请求「自带凭证」。但不要和 Cookie 方案混用，否则会出现部分接口需要 token、部分不需要的混乱，也容易留下绕过路径。

<!--day 14 | light-->
#### 联调：先打通，再谈体验
1. 前端 \`vite.config.ts\` 配代理（D10），避免 CORS。
2. 登录后把 token 存起来（Cookie 方案则由浏览器自动管理）。
3. 统一处理 401：\`TOKEN_EXPIRED\` → 跳登录；\`INVALID_TOKEN\` → 清凭证。
4. 金额展示：接口拿到的是「分」，除以 100 保留两位。

\`\`\`ts
const res = await fetch('/api/ledger?limit=20', { credentials: 'include' })
if (res.status === 401) { /* 跳登录 */ }
const body = await res.json()
if (body.code !== 'OK') { /* 按 code 分支 */ }
\`\`\`

#### 手机验收：这是最终判据
在手机浏览器上完整走一遍：
**登录 → 添加账目 → 列表看到 → 统计正确 → 超预算有标志**

四个常见失败点：
- 手机通过局域网 IP 访问，后端只监听 \`127.0.0.1\` → 连不上（要监听 \`0.0.0.0\`）。
- HTTPS 未配置，\`Secure\` cookie 不生效 → 登录状态丢失。
- Cookie 的 \`SameSite=Strict\` 导致从其他 App 跳转进来时未登录。
- 前端未处理「分 → 元」，显示成 \`3550.00\`。

#### 阶段与全路线收尾
\`\`\`bash
go test ./... -race -count=1
govulncheck ./...
docker compose up -d && curl localhost:8080/healthz
docker stop api && docker inspect api --format '{{.State.ExitCode}}'   # 0
\`\`\`

#### 最后：这条路线真正训练的能力
不是「会写 Go」，而是四件事：
1. **判断力**：知道 \`%w\` 影响控制流、知道 \`OFFSET\` 为什么慢、知道 \`NewDB\` 防的是什么。
2. **安全直觉**：每条查询带 \`user_id\`、密码只哈希、token 不看 payload。
3. **可运维性**：配置不硬编码、服务能优雅停、依赖无已知漏洞。
4. **验证习惯**：任何结论都要有命令输出或测试结果支撑。

::q 手机能打开页面但登录后立刻掉线，最可能的原因是什么？
::a 常见于 Cookie 的 \`Secure\` 属性在 HTTP 下不被浏览器保存，或 \`SameSite=Strict\` 导致跨站跳转时不携带。也可能是后端监听在 \`127.0.0.1\` 而非 \`0.0.0.0\`，或前端把 token 存在内存中，页面刷新即丢失。
::q 为什么把「手机完成完整操作」作为最终验收标准？
::a 它同时检验了网络可达性、HTTPS/Cookie 配置、前端金额换算、后端认证与统计的正确性——是唯一能覆盖「真实使用路径」的检查。桌面 curl 通过不代表手机上能用。
`,pf={1:[lf],2:[cf],3:[uf],4:[df],5:[ff,hf],6:[gf]};function mf(e){const n={},t=/<!--day (\d+)(?:\s*\|\s*(\w+))?-->/g,r=[];let s;for(;(s=t.exec(e))!==null;)r.push({day:Number(s[1]),depth:s[2]||"normal",start:s.index+s[0].length,at:s.index});return r.forEach((o,i)=>{const a=i+1<r.length?r[i+1].at:e.length;n[o.day]={depth:o.depth,body:e.slice(o.start,a).trim()}}),n}function Ef(e){const n=e.search(/^::q /m);if(n<0)return{text:e.trim(),quiz:[]};const t=e.slice(0,n).trim(),r=[];let s=null;for(const o of e.slice(n).split(`
`)){const i=o.trim();i.startsWith("::q ")?(s&&r.push(s),s={q:i.slice(4).trim(),a:""}):i.startsWith("::a ")?s&&(s.a=i.slice(4).trim()):s&&i&&(s.a=s.a?`${s.a}
${o.trim()}`:i)}return s&&r.push(s),{text:t,quiz:r.filter(o=>o.q)}}function yf(e){return e.replace(/```[\s\S]*?```/g,"").replace(/\s/g,"").length}function Sf(e){let n=0;for(const t of e.match(/```[\s\S]*?```/g)||[])n+=t.split(`
`).filter(r=>r.trim()&&!r.startsWith("```")).length;return n}function bf(e,n,t){return Math.max(2,Math.round(e/280+n/22+t*.8))}const ul={};for(const[e,n]of Object.entries(pf)){const t=mf(n.join(`

`)),r={};for(const[s,{depth:o,body:i}]of Object.entries(t)){const{text:a,quiz:l}=Ef(i),c=yf(a),u=Sf(a);r[Number(s)]={body:a,quiz:l,depth:o,chars:c,codeLines:u,readMin:bf(c,u,l.length)}}ul[Number(e)]=r}const xf='<!--day 1-->\n::pre 会用终端：`cd`、`mkdir`、看报错信息；知道什么是「当前目录」。\n::predict go\nmkdir demo && cd demo\ngo mod init example.com/demo\ngo run main.go\n::ask 这个目录里**没有** main.go 时，`go run main.go` 和 `go run .` 分别报什么？两条报错的区别说明了什么？\n::ans `go run main.go` 报 `stat main.go: no such file or directory`——它是**按文件**找，找不到文件就结束，不会去问「这个包在哪」。`go run .` 报 `no Go files in /.../demo`——它是**按包**找，先解析当前目录属于哪个包，再找包里的 Go 文件。记住这个区别：以后 `go build ./...` 是包级操作，`go run xxx.go` 是文件级操作，混用会出现「明明文件在，却报找不到包」的错觉。\n::debug go\n$ cd ~/code/ledger\n$ cat main.go\npackage main\n\nfunc main() { println("hi") }\n$ go run .\ngo: cannot find main module; see \'go help modules\'\n::sym 文件明明在，`go run .` 却报找不到 main module。\n::ask 缺的是什么？为什么「有 main.go」还不够？\n::ans 缺 `go.mod`。Go 1.16 之后默认 module 模式：任何构建都必须先确定「模块根在哪」，`go.mod` 就是那个锚点。没有它，Go 不知道 import 路径的解析基准，所以连一个不 import 任何东西的 main 包也不肯编译。修法：`go mod init example.com/ledger`。顺带记住 `go env GOMOD`：正常应指向你的 go.mod，报 `/dev/null` 就是没在模块里。\n::transfer\n::scene 你要把入口从根目录挪到 `cmd/ledger/main.go`，模块根仍在仓库根，模块名 `example.com/ledger`。入口需要 import 你自己写的 `internal/store`。\n::ask import 那一行应该怎么写？目录结构要怎么配合？\n::hint 先想「import 路径 = 模块名 + 从模块根到包目录的相对路径」，再想 `internal/` 的可见性规则。\n::ans 写 `import "example.com/ledger/internal/store"`。目录必须是 `<模块根>/internal/store/`，且该目录下所有文件同属一个包（`package store`）。`internal` 的特殊性：只有 `example.com/ledger` 这个前缀下的包能 import 它，外部模块 import 会被编译器拒绝——这是语言级的封装，比命名约定可靠。\n::crit 能说出 `go run main.go` 与 `go run .` 的查找范围差别，并解释为什么前者在换文件名后会失效\n::crit `go env GOMOD` 指向当前项目的 go.mod，删掉 go.mod 后能立刻判断出错误原因\n::crit 能在 3 分钟内从零建出一个可 `go run .` 的模块，且 `go vet ./...` 无输出\n::crit 能解释 module path、目录路径、import path 三者的对应关系，并举出 `internal/` 的可见性边界\n\n<!--day 2-->\n::pre 知道 `int`/`float64`/`string`/`bool` 是什么；写过至少一门语言的变量声明。\n::predict go\nvar a int32 = 100\nvar b int64 = 200\nfmt.Println(a + b)\n::ask 这段能编译吗？如果不能，报错信息长什么样？\n::ans 不能：`invalid operation: a + b (mismatched types int32 and int64)`。Go **没有任何隐式数值转换**，哪怕 int32 和 int64 在 64 位机器上宽度一样也不行。必须显式写 `int64(a) + b`。这条规则一开始很烦，但它挡住了 C 里那一整类「静默截断」的 bug。\n::predict go\nvar x float64 = 0.1\nvar y float64 = 0.2\nfmt.Println(x + y)\nfmt.Println(x + y == 0.3)\n::ask 第二行输出 true 还是 false？为什么？\n::ans 输出 `0.30000000000000004` 和 `false`。0.1、0.2 在二进制浮点里无法精确表示，相加后与字面量 0.3 的近似值不相等。**这就是金额不能用 float64 的理由**：`35.5 * 100` 会得到 `3549.9999999999995`，`int64()` 截断成 `3549`，少一分。账本从第一天起就用 `int64` 存「分」。\n::debug go\nfunc main() {\n    var s string\n    s = nil\n    fmt.Println(len(s))\n}\n::sym 编译报错：`cannot use nil as string value in assignment`。\n::ask 如果确实需要一个「可能不存在」的字符串，应该用什么类型？零值又是什么？\n::ans 用 `*string`（零值 nil）或 `sql.NullString`，而不是给 string 赋 nil。要理解的是：**Go 的每种类型都有确定的零值**——string 是 `""`、int 是 0、指针/切片/map/接口是 nil。`var s string` 之后 `len(s)` 完全合法，返回 0。不要带着「未初始化」的直觉写 Go，它没有未定义值。\n::transfer\n::scene 前端传来金额 35.5 元，接口约定用「分」的整数。你的同事写了 `int64(in.Amount * 100)`。\n::ask 找出这行的两个问题，并给出正确写法。\n::hint 一个是精度，一个是「谁负责乘 100」的契约归属。\n::ans 问题一：`35.5 * 100 = 3549.9999999999995`，截断后 3549，少一分。问题二：让浮点进入服务端就已经违约了——接口应该直接收 `amount_cents` 整数。如果必须收元，用 `math.Round(in.Amount*100)` 再转，但更好的做法是前端算好分再传，服务端只做 `if cents <= 0` 的校验。**能不让浮点进门，就别让它进门。**\n::crit 能写出 `int32` 与 `int64` 相加时的两种修法，并说明为什么 Go 选择不做隐式转换\n::crit 能当场演示 `0.1+0.2 != 0.3`，并说出这与「金额存分」的因果关系\n::crit 能列出 string / int / slice / map / 指针 / 接口 六种类型的零值\n::crit 写的任何金额相关代码里没有 float64\n\n<!--day 3-->\n::pre 用过数组或列表；知道「下标从 0 开始」。\n::predict go\ns := []int{1, 2, 3, 4, 5}\na := s[1:3]\na[0] = 99\nfmt.Println(s)\n::ask 输出什么？`a` 的长度和容量各是多少？\n::ans 输出 `[1 99 3 4 5]`——切片不复制数据，`a` 和 `s` 共享同一个底层数组，改 `a[0]` 就是改 `s[1]`。`len(a)=2`，`cap(a)=4`（从下标 1 到原数组末尾）。**切片是「数组的窗口」，不是「数组的一份拷贝」**，这是 Go 里最容易被误解的一处。\n::predict go\ns := make([]int, 0, 2)\ns = append(s, 1, 2)\np := s\ns = append(s, 3)\np[0] = 100\nfmt.Println(s[0], p[0])\n::ask 输出什么？为什么 `p[0]=100` 没有改到 `s[0]`？\n::ans 输出 `1 100`。第一次 append 后 len=2 cap=2，再 append 第 3 个元素时容量不够，Go **分配了新数组**并把旧数据拷过去，`s` 指向新数组，`p` 还指着旧数组。于是 `p[0]=100` 只改旧数组，`s[0]` 仍是 1。**任何一次 append 都可能让之前持有的切片「脱钩」**——这就是为什么函数返回切片要连 err 一起返回，而不是靠外部持有的旧切片观察结果。\n::debug go\nfunc addOne(s []int) {\n    s = append(s, 1)\n}\nfunc main() {\n    s := make([]int, 0, 4)\n    addOne(s)\n    fmt.Println(len(s))\n}\n::sym 输出 `0`，明明在函数里 append 了。\n::ask 为什么？两种修法分别是什么？\n::ans 因为切片是**值传递**：传进去的是 `{ptr, len, cap}` 三个字段的副本，函数内 append 改的是副本的 len，调用方的 len 不变（底层数组确实可能被写了，但 len 没变所以看不见）。修法一：返回新切片 `func addOne(s []int) []int`，调用方 `s = addOne(s)`。修法二：传 `*[]int`。**只要函数可能改变长度，就必须把切片返回出去**，这是硬规则。\n::transfer\n::scene 你要读 10 万条账目做 CSV 导出，一开始写 `var out []Entry` 然后循环 append。\n::ask 这行有什么性能问题？怎么改？改完大概省多少次内存分配？\n::hint 想想 append 扩容的倍数，以及「已知总量」这个信息能换来什么。\n::ans `var out []Entry` 的 cap 是 0，前几次 append 会按 1→2→4→8… 反复扩容并拷贝，10 万条大约触发 17 次扩容、累计拷贝约 20 万次元素。已知行数时直接 `out := make([]Entry, 0, n)` 一次分配到位，扩容次数降为 0。如果行数未知，退一步用 `make([]Entry, 0, 1024)` 给个合理起点。**「预分配容量」是 Go 里性价比最高的优化之一**，写循环前先问自己：我知道大概多少个吗？\n::crit 能画出 `s[1:3]` 之后两个切片的 ptr/len/cap 三元组，并解释为什么改一个会影响另一个\n::crit 能构造出「append 后旧切片看不到新元素」的最小例子\n::crit 知道函数内 append 必须返回新切片，并能说明 len 是值传递\n::crit 循环 append 前会先判断能否预分配容量\n\n<!--day 4-->\n::pre 用过哈希表 / 字典；知道什么是键值对。\n::predict go\nm := map[string]int{"a": 1, "b": 2, "c": 3}\nfor k := range m {\n    fmt.Print(k)\n}\n::ask 连跑三次，输出顺序一样吗？为什么？\n::ans 不一样，**Go 故意让 map 遍历顺序随机化**。原因不是实现偷懒，而是防止程序依赖顺序：一旦有人写出「按遍历顺序取第一个」，在 map 扩容后行为就会变，这类 bug 极难复现。所以语言层面直接把顺序打散，逼你显式排序。要稳定输出就取出 key 排序：`sort.Strings(keys)`。\n::predict go\nvar m map[string]int\nm["a"] = 1\n::ask 运行结果是什么？和 `m := map[string]int{}` 有什么区别？\n::ans panic：`assignment to entry in nil map`。`var m map[string]int` 只声明不分配，零值是 nil，nil map 可以读（返回零值）、可以 `range`（零次）、可以 `len`（0），但**不能写**。`map[string]int{}` 是空 map，已分配，可写。这个区别在「结构体里的 map 字段忘了初始化」时最容易踩：`type T struct{ M map[string]int }`，`t.M["x"]=1` 直接 panic。\n::debug go\ns := "héllo"\nfmt.Println(len(s))\nfmt.Println(s[1])\n::sym 输出 `6` 和 `195`，而你以为字符串是 5 个字符、第二个字符是 é。\n::ask 为什么？要按「字符」处理应该怎么做？\n::ans `len(s)` 返回**字节数**，é 在 UTF-8 里占 2 字节，所以是 6。`s[1]` 取的是第 2 个**字节**（0xC3），打印成数字 195；如果按 `%c` 打印会得到乱码。按字符处理要转 `[]rune(s)`（得到 5 个 rune），或 `for i, r := range s`（i 是字节偏移，r 是 rune）。**「长度」在 Go 里默认指字节，涉及中文/emoji 时必须主动切换到 rune。**\n::transfer\n::scene 账本的备注字段要限制「最多 50 个字」，你写了 `if len(note) > 50 { return err }`。\n::ask 这行对中文用户意味着什么？怎么改才对？\n::hint 一个汉字在 UTF-8 里占几个字节？\n::ans 一个常用汉字 3 字节，所以 `len > 50` 实际只允许 16 个汉字，用户会觉得「明明没超」。正确写法：`if utf8.RuneCountInString(note) > 50`，或者先 `[]rune(note)` 再判 len。如果产品要的是「显示宽度」（中文算 2），还得再算一层。**凡是给用户看的长度限制，都不能用字节数。**\n::crit 能解释 map 遍历顺序为什么是随机的，并写出稳定遍历的代码\n::crit 能说出 nil map 的三种合法操作和一种非法操作\n::crit 遇到中文/emoji 会主动区分 byte 与 rune，并能写出 rune 计数的写法\n::crit 知道 `range string` 的索引是字节偏移而不是字符序号\n\n<!--day 5-->\n::pre 知道函数、参数、返回值；理解「引用」和「值」的粗略区别。\n::predict go\ntype Counter struct{ n int }\nfunc (c Counter) Inc() { c.n++ }\nfunc main() {\n    c := Counter{}\n    c.Inc()\n    fmt.Println(c.n)\n}\n::ask 输出什么？\n::ans 输出 `0`。值接收者拿到的是**结构体的副本**，`c.n++` 改的是副本。改成 `func (c *Counter) Inc()` 才输出 1。判断规则很简单：**方法要不要改到原对象？要改就用指针接收者。**但更隐蔽的是「结构体较大时值接收者会复制」——一个 200 字节的结构体每次调用都拷 200 字节。\n::predict go\ntype Counter struct{ n int }\nfunc (c *Counter) Inc() { c.n++ }\nfunc main() {\n    var c *Counter\n    c.Inc()\n}\n::ask 这段会 panic 吗？\n::ans 会 panic：`invalid memory address or nil pointer dereference`。指针接收者的方法里解引用 `c.n`，c 是 nil 就直接炸。**这提醒一件事：指针接收者的方法不检查 nil**，调用前必须保证指针非 nil。对比：值接收者的方法对 nil 指针调用会先解引用再拷贝，同样 panic。\n::debug go\ntype User struct{ Name string }\nfunc (u *User) Rename(n string) { u.Name = n }\nfunc main() {\n    m := map[string]User{"a": {Name: "old"}}\n    m["a"].Rename("new")\n}\n::sym 编译错误：`cannot call pointer method on m["a"]` / `cannot assign to struct field m["a"].Name`。\n::ask 为什么？两种修法分别是什么？\n::ans 因为 map 的元素**不可寻址**：`m["a"]` 不是变量，只是一个值，取不到它的地址，所以调不了指针方法。修法一：存指针 `map[string]*User`（推荐，改的是同一个对象）。修法二：取出→改→放回 `u := m["a"]; u.Rename("new"); m["a"] = u`（注意这是复制后放回）。同理 `[]User` 的元素是**可寻址**的，`s[0].Rename()` 合法——这个差异经常会咬人。\n::transfer\n::scene 你有一个 `Entry` 结构体（约 120 字节，含 4 个 string 字段），要给 `internal/ledger` 包定义一组方法：`Validate()`、`AmountYuan() string`、`Normalize()`（把分类去空格、日期补零）。\n::ask 哪些用值接收者、哪些用指针接收者？给出判断理由。\n::ans `Validate()` 和 `AmountYuan()` 用值接收者：只读、不修改，值接收者对调用方零副作用，还能被并发安全地调用。`Normalize()` 必须用指针接收者：它要改原对象。经验规则：**默认值接收者，需要修改时才用指针**；但如果结构体很大（比如 > 64 字节）且调用频繁，即便只读也考虑指针接收者省拷贝。同一个类型的方法集最好统一——混用会让「值能否满足某个接口」变得难以推理。\n::crit 能写出值接收者修改无效的最小复现，并解释副本语义\n::crit 知道 map 元素不可寻址、slice 元素可寻址，能各举一个会编译失败的例子\n::crit 能对一组方法逐个判定该用值还是指针接收者，并说出理由\n::crit 理解「指针接收者的方法不判 nil」，调用前会检查\n\n<!--day 6-->\n::pre 见过 `if err != nil`；知道函数可以返回多个值。\n::predict go\nvar ErrNotFound = errors.New("not found")\nfunc find(id int) error {\n    return fmt.Errorf("find %d: %w", id, ErrNotFound)\n}\nfunc main() {\n    err := find(1)\n    fmt.Println(errors.Is(err, ErrNotFound))\n    fmt.Println(err == ErrNotFound)\n}\n::ask 两行分别输出什么？\n::ans `true` 和 `false`。`%w` 把底层错误**包**进新错误，`errors.Is` 会沿链逐层 `Unwrap` 比较，所以能找到；`==` 只比最外层，包装后的错误已经不是 `ErrNotFound` 本身了。**这正是必须用 `errors.Is` 而不能用 `==` 的原因**——只要有人在中间包了一层，`==` 就失效。\n::predict go\nfunc f() error {\n    var e *MyErr\n    return e\n}\nfunc main() {\n    err := f()\n    fmt.Println(err == nil)\n}\n::ask 输出 true 还是 false？\n::ans 输出 `false`。这是个经典陷阱：`e` 是 nil 指针，但返回成 `error` 接口后，接口的「类型」部分非 nil（是 `*MyErr`），「值」部分是 nil，整体不等于 nil。**返回具体类型指针时，nil 指针不等于 nil 接口。**修法：`if e == nil { return nil }`，或者返回 `error` 类型变量而不是具体指针。\n::debug go\nrows, err := db.Query("select id from entries")\nif err != nil { return err }\nfor rows.Next() {\n    var id int64\n    if err := rows.Scan(&id); err != nil { return err }\n}\nreturn nil\n::sym 偶尔会漏掉最后一批数据，或者在数据库断开时「看起来正常但数据不全」。\n::ask 这段漏了什么？为什么它不会报错？\n::ans 漏了 `rows.Err()`。`for rows.Next()` 返回 false 有两种原因：正常遍历完，或者中途出错。只看循环退出是分辨不出来的，必须 `return rows.Err()` 才能把遍历期的错误带出来。另外 `defer rows.Close()` 也没写——虽然 Next 耗尽会自动关，但提前 return 时不会。**`rows.Next()` 循环后检查 `rows.Err()` 是硬性要求，不是可选项。**\n::transfer\n::scene Service 层要区分「账目不存在」「无权访问」「数据库故障」三种情况，handler 要分别映射成 404 / 403 / 500。\n::ask 用 sentinel error、自定义 error 类型、还是字符串匹配？给出你的方案和理由。\n::ans 用 sentinel + 自定义类型组合：`ErrNotFound`/`ErrForbidden` 用 sentinel（`errors.New`），数据库错误原样包装 `fmt.Errorf("get entry: %w", err)`。handler 里用 `errors.Is(err, ErrNotFound)` 判断，而不是 `strings.Contains(err.Error(), "not found")`——字符串匹配在改文案时会静默失效。如果需要带字段（比如哪个字段校验失败），再定义 `type ValidationError struct{ Field, Msg string }` 实现 `Error()`，用 `errors.As` 取出。**错误分类靠类型和哨兵值，绝不靠字符串。**\n::crit 能解释 `%w` 与 `%v` 的区别，并演示 `errors.Is` 在多层包装后仍为 true\n::crit 能复现「nil 指针不等于 nil 接口」并说出修法\n::crit 写任何 `rows.Next()` 循环都会跟 `defer rows.Close()` 和 `rows.Err()`\n::crit 错误分类只用 `errors.Is` / `errors.As`，代码里搜不到 `strings.Contains(err.Error()`\n\n<!--day 7-->\n::pre 知道什么是方法集；写过至少一个带方法的类型。\n::predict go\ntype Reader interface{ Read() string }\ntype File struct{}\nfunc (f *File) Read() string { return "data" }\nfunc main() {\n    var r Reader = File{}\n    _ = r\n}\n::ask 能编译吗？\n::ans 不能：`File does not implement Reader (method Read has pointer receiver)`。指针接收者的方法属于 `*File` 的方法集，不属于 `File`。所以 `*File` 实现了 Reader，`File` 没有。这条规则直接决定了「你该传值还是传指针」：**只要接口方法里有一个是指针接收者，就必须用指针去满足接口。**\n::predict go\ntype Stringer interface{ String() string }\ntype T struct{}\nfunc (T) String() string { return "t" }\nvar _ Stringer = (*T)(nil)\n::ask 最后一行合法吗？它运行时会不会 panic？\n::ans 合法，且不会 panic。`(*T)(nil)` 是「类型为 *T、值为 nil」的指针，`*T` 的方法集包含值接收者的方法，所以满足 Stringer。编译期断言 `var _ Stringer = (*T)(nil)` 只检查类型，不求值。这是 Go 里最常用的**编译期接口断言技巧**，写在包级别，实现漏了方法编译就挂。\n::debug go\ntype Store interface {\n    Save(e Entry) error\n}\ntype memStore struct{ m map[int64]Entry }\nfunc (s *memStore) Save(e Entry) error { s.m[e.ID] = e; return nil }\nfunc main() {\n    var s Store = memStore{m: map[int64]Entry{}}\n    _ = s\n}\n::sym 编译错误：`memStore does not implement Store`。\n::ask 为什么？改哪一处最小？\n::ans `Save` 是指针接收者，只有 `*memStore` 满足接口，`memStore{}` 不满足。最小改动是把 `&memStore{...}` 传进去（或将方法改为值接收者，但那样 map 字段虽能改，结构体本身复制仍可能出问题）。**记住：构造函数返回接口时，一定要返回指针**：`func NewStore() Store { return &memStore{...} }`。\n::transfer\n::scene 你的 `Service` 需要一个「按月份查账目」的能力，当前依赖具体的 `*SQLiteStore`。你想让 `Service` 可测试（用内存实现替换）。\n::ask 接口应该定义在哪个包？方法签名怎么写？为什么不在 store 包里定义？\n::hint Go 的谚语：接口由使用方定义，而不是实现方。\n::ans 接口定义在**使用方**（`internal/ledger`），因为只有使用方知道自己需要哪些方法。签名用领域类型而不是 SQL 类型：`ListByMonth(ctx context.Context, userID int64, month string) ([]Entry, error)`，不要出现 `*sql.Rows`。如果在 store 包定义，使用方就被迫依赖 store 包，实现方新增方法还会撑大接口。**「接口属于调用者」是 Go 与 Java 最大的差异之一**，它让依赖方向始终指向内层。\n::crit 能说出值接收者与指针接收者的方法集差异，并写出编译失败的例子\n::crit 会在包里写 `var _ Interface = (*T)(nil)` 做编译期断言\n::crit 能解释为什么接口定义在使用方，并举出「定义在实现方会怎样变糟」的具体后果\n::crit 接口方法签名里不出现具体存储类型（`*sql.Rows`、`*gorm.DB`）\n\n<!--day 8-->\n::pre 知道函数调用栈；见过 panic 的堆栈输出。\n::predict go\nfunc f() (n int) {\n    defer func() { n++ }()\n    return 10\n}\nfunc main() { fmt.Println(f()) }\n::ask 输出什么？\n::ans 输出 `11`。`return 10` 分两步：先把 10 赋给命名返回值 n，再执行 defer，最后返回。defer 里 `n++` 改的是命名返回值，所以最终返回 11。**defer 能改命名返回值，这是 recover 之外唯一能「影响返回结果」的合法用法**，也常被用来做统一日志/耗时统计。\n::predict go\nfor i := 0; i < 3; i++ {\n    defer fmt.Print(i)\n}\n::ask 输出什么顺序？\n::ans 输出 `210`。defer 是**后进先出**的栈，且**参数在 defer 语句执行时就求值**——所以打印的是当时 i 的副本 0/1/2，只是按逆序执行。如果写成 `defer func(){ fmt.Print(i) }()`，输出会是 `333`，因为闭包捕获的是变量本身，执行时 i 已经是 3。**「defer 的参数立即求值，闭包捕获变量」这句话能解决 90% 的 defer 困惑。**\n::debug go\nfunc safeDiv(a, b int) (r int) {\n    defer func() {\n        if err := recover(); err != nil {\n            log.Println("recovered:", err)\n        }\n    }()\n    return a / b\n}\nfunc main() {\n    fmt.Println(safeDiv(1, 0))\n}\n::sym 没有 panic，但输出是 `0`，而且调用方完全不知道除零发生了。\n::ask 这段「吞掉」了什么？正确的做法是什么？\n::ans 吞掉的是错误语义：recover 之后函数正常返回，命名返回值 r 还是 0，调用方以为算出了 0。正确做法是让 recover 把 panic 转成 error：在 defer 里给命名返回值赋一个错误（需要签名有 error），或者干脆不要用 recover 兜业务错误——**除零这种可预判的情况应该显式 `if b == 0 { return 0, ErrDivByZero }`**。recover 只应该出现在「进程不能死」的边界：HTTP 中间件、goroutine 入口。\n::transfer\n::scene 你在一个 HTTP 服务里给每个 handler 套了 `defer func(){ recover() }()`，想「防止任何 panic 导致进程退出」。\n::ask 这个做法能兜住所有 panic 吗？有哪些情况它兜不住、也不该兜？\n::hint 想想 panic 发生在别的 goroutine 会怎样，以及 data race 导致的崩溃。\n::ans 兜不住三类：① **其他 goroutine 里的 panic**——recover 只对当前 goroutine 有效，handler 里 `go func(){...}()` 内部 panic 仍会杀进程，所以每个自起的 goroutine 入口都要自己的 recover；② **runtime 级致命错误**——并发写 map、栈溢出、OOM 这些是 fatal error，recover 无效；③ 不该兜的：recover 后如果状态已经不一致（比如事务写到一半），继续服务只会造成数据损坏。正确做法：recover 只做「记日志 + 返回 500 + 把请求标记为失败」，不做「假装没事继续跑」。\n::crit 能解释 defer 参数立即求值 vs 闭包捕获变量的差异，并各写出一个例子\n::crit 会用 defer 修改命名返回值，并说清它为什么合法\n::crit 知道 recover 只对当前 goroutine 有效，会在每个 goroutine 入口单独兜\n::crit 能列出三类 recover 兜不住的致命错误\n\n<!--day 9-->\n::pre 知道「表」「行」「列」；能看懂 `SELECT * FROM t`。\n::predict sql\nCREATE TABLE entries (\n  id INTEGER PRIMARY KEY,\n  amount INTEGER NOT NULL,\n  category TEXT NOT NULL,\n  date TEXT NOT NULL\n);\nINSERT INTO entries (amount, category, date) VALUES (3550, \'餐饮\', \'2026-10-19\');\nINSERT INTO entries (amount, category, date) VALUES (NULL, \'交通\', \'2026-10-19\');\n::ask 第二条 INSERT 会成功吗？\n::ans 失败：`NOT NULL constraint failed: entries.amount`。SQLite 默认**强制** NOT NULL（这点和某些数据库的宽松默认不同）。要允许空值得显式去掉 NOT NULL。设计表时的判断：这个字段「业务上允许不知道吗」——金额不允许，所以 NOT NULL 是正确约束，能在写入时就挡住脏数据。\n::predict sql\nSELECT * FROM entries WHERE date LIKE \'2026-1%\';\n::ask 这会查出哪些月份？有什么风险？\n::ans 会查出 `2026-1`、`2026-10`、`2026-11`、`2026-12` 全部——因为 `LIKE \'2026-1%\'` 是**前缀匹配**，`2026-10-19` 也以 `2026-1` 开头。这就是「月份参数不校验」的经典事故：用户传 `month=2026-1`，统计结果翻四倍，接口还返回 200。正确做法：参数必须匹配 `^\\d{4}-\\d{2}$`，查询用半开区间 `date >= \'2026-10-01\' AND date < \'2026-11-01\'`。\n::debug sql\nSELECT category, SUM(amount) FROM entries\nWHERE date LIKE \'2026-10%\'\nGROUP BY category\n::sym 结果里出现一个 `category` 为空的行，前端显示成一个没有名字的分类。\n::ask 空分类是怎么产生的？两种处理方式分别是什么？\n::ans 历史数据里 `category` 存了空字符串（或 NULL）。`GROUP BY` 把空值当成独立一组。处理方式一：建表时 `category TEXT NOT NULL DEFAULT \'未分类\'`，从源头杜绝；方式二：查询时 `CASE WHEN category IS NULL OR category = \'\' THEN \'未分类\' ELSE category END`。**别让空分类流到前端**——那是把数据质量问题转嫁给用户，而用户无法修复它。\n::transfer\n::scene 你要给 `entries` 加索引，加速「某用户某月按日期倒序」的查询：`WHERE user_id = ? AND date >= ? AND date < ? ORDER BY date DESC, id DESC`。\n::ask 索引该建哪几列、什么顺序？为什么不是 `(date, user_id)`？\n::hint 联合索引的最左前缀原则，以及 ORDER BY 能不能直接吃到索引顺序。\n::ans 建 `CREATE INDEX idx_entries_user_date ON entries(user_id, date DESC, id DESC)`。理由：等值条件 `user_id` 放最左，范围条件 `date` 放其后，`id` 作为同一天多条的稳定次序兜底。如果写成 `(date, user_id)`，`user_id` 的等值过滤就用不上最左前缀，只能靠 date 范围扫描再回表过滤。**联合索引顺序 = 等值列在前、范围列在后、排序列尽量跟上**，这一条能覆盖大部分账本查询。\n::crit 能解释 NOT NULL 在写入时挡住什么，并举一个「不加约束导致脏数据」的例子\n::crit 能现场演示 `LIKE \'2026-1%\'` 的多匹配问题，并写出半开区间写法\n::crit 会给账本建 `(user_id, date)` 联合索引，并说明列顺序的理由\n::crit 知道 `GROUP BY` 会把 NULL/空串单独成组，并能写出兜底分类\n\n<!--day 10-->\n::pre 会写 `CREATE TABLE` 和基本 `SELECT`；知道什么是数据库驱动。\n::predict go\nimport _ "modernc.org/sqlite"\n\ndb, err := sql.Open("sqlite", "ledger.db")\nif err != nil {\n    log.Fatal(err)\n}\nfmt.Println("connected")\n::ask 这段能证明数据库真的连上了吗？\n::ans 不能。`sql.Open` **不建立任何连接**，它只校验参数、创建连接池对象，第一次真正执行查询时才拨号。所以 DSN 写错、文件路径不可写、目录不存在，`sql.Open` 全都返回 nil error，「connected」照常打印。要验证必须 `db.Ping()`。**`sql.Open` 的 err 只代表「参数非法」，不代表「连得上」**，这是新手最容易误判的一处。\n::predict go\ndb.SetMaxOpenConns(1)\ndb.SetMaxIdleConns(1)\n// goroutine A: 开事务，写一条，然后 sleep 2s 再 commit\n// goroutine B: 同时执行一条普通 INSERT\n::ask B 会怎样？\n::ans B 会**阻塞等待**，直到 A 提交或回滚。因为最大连接数是 1，A 的事务独占那唯一连接，B 拿不到连接就排队（受 context 超时约束）。这在 SQLite 下是「正确的疼」：SQLite 只允许一个写者，用 1 个连接能彻底避免 `SQLITE_BUSY`，代价是写操作串行化。**家庭账本这个量级，串行写完全够用；不要为了「并发」把 MaxOpenConns 调到 10，那只会换来随机 BUSY 错误。**\n::debug go\ndb, _ := sql.Open("sqlite", "file:ledger.db?cache=shared")\ndb.SetMaxOpenConns(10)\n// 多个 goroutine 并发 INSERT\n::sym 偶发 `database is locked (5) (SQLITE_BUSY)`，重试有时成功有时失败。\n::ask 根因是什么？三种修法各自代价如何？\n::ans 根因：SQLite 同一时刻只允许一个写事务，多个连接并发写就会撞锁，默认 busy_timeout 很短（modernc 驱动默认为 0），撞上立刻返回 BUSY。修法一：`SetMaxOpenConns(1)`，写串行化，零 BUSY，代价是写吞吐受限（推荐）。修法二：DSN 加 `_pragma=busy_timeout(5000)`，让驱动等 5 秒而不是立刻失败，但高并发下仍会超时。修法三：开 WAL（`_pragma=journal_mode(WAL)`）+ 写池 1 连接 + 读池多连接，兼顾读并发。**先上修法一，需要读并发再上修法三，别一上来就调连接数。**\n::transfer\n::scene 你的服务启动时 `sql.Open` 成功，但第一次请求就报 `unable to open database file`。\n::ask 列出你会依次排查的四个点，以及各自怎么验证。\n::hint 从「路径是相对谁的」开始想，再想权限和目录。\n::ans ① **工作目录**：DSN 里的相对路径是相对进程 CWD，不是二进制所在目录。用 `os.Getwd()` 打印，或直接改成绝对路径（推荐）。② **目录是否存在**：SQLite 会创建文件，但不会创建父目录，`data/ledger.db` 在 `data/` 不存在时直接失败。③ **写权限**：`ls -ld` 看目录属主，非 root 运行而目录属 root 会失败。④ **文件是否被别的东西占着/只读**：`ls -l` 看权限位。验证顺序就是从「路径 → 存在 → 权限 → 占用」，一步一打印，别靠猜。\n::crit 能解释 `sql.Open` 为什么不连库，并坚持用 `PingContext` 验证\n::crit 知道 SQLite 默认 `MaxOpenConns(1)` 的理由，能说出调大的具体风险\n::crit 能复现 `SQLITE_BUSY` 并给出三种修法及代价\n::crit 配置数据库路径时会用绝对路径，并解释相对路径的依赖\n\n<!--day 11-->\n::pre 会写 `SELECT`；知道 Go 里 `&x` 是取地址。\n::predict go\nvar name string\nvar age int\nerr := db.QueryRow("SELECT name, age FROM users WHERE id = ?", 1).Scan(&age, &name)\n::ask 如果表里是 `name=\'a\', age=18`，能正确扫出来吗？\n::ans 不能。`Scan` 严格按**列顺序**填充，顺序反了就会把 `name`（字符串）扫进 `age`（int），报 `converting string to int: invalid syntax` 之类。SQLite 是动态类型，甚至可能不报错而是静默塞进奇怪的值。**`Scan` 的参数顺序必须与 SELECT 列顺序逐一对齐**，这是不会编译报错、只能靠人眼保证的一类 bug。写法上建议 `SELECT` 显式列名而不是 `SELECT *`，改表结构时至少能看见。\n::predict go\nrows, err := db.Query("SELECT id, note FROM entries")\nif err != nil { return err }\ndefer rows.Close()\nfor rows.Next() {\n    var id int64\n    var note sql.NullString\n    if err := rows.Scan(&id, &note); err != nil { return err }\n    fmt.Println(id, note.String)\n}\n::ask `note` 为什么用 `sql.NullString` 而不是 `string`？\n::ans 因为 `note` 列可能为 NULL，而 `*string`/`string` 扫 NULL 会报 `converting NULL to string is unsupported`。`sql.NullString{String, Valid}` 能区分「空字符串」和「NULL」。如果业务上「NULL 等价于空串」，也可以用 `COALESCE(note, \'\')` 在 SQL 里抹平——**但要想清楚：空串和 NULL 在你的业务里真的等价吗？**账本备注里「用户没填」和「用户填了空」其实没区别，用 COALESCE 更省事。\n::debug go\nstmt, _ := db.Prepare("INSERT INTO entries(amount) VALUES (?)")\nfor i := 0; i < 3; i++ {\n    stmt.Exec(i)\n}\ndb.Close()\n::sym 进程退出前有连接/语句泄漏告警，或者高频插入时句柄数持续上涨。\n::ask 缺了什么？`stmt` 和 `rows` 的关闭责任分别是谁的？\n::ans 缺 `defer stmt.Close()`。规则：**谁创建的谁关闭**——`db.Prepare` 出来的 `*Stmt` 要自己 Close，`db.Query` 出来的 `*Rows` 要自己 Close，`db.QueryRow` 不需要（内部已处理）。另外 `stmt.Exec` 的 error 也没检查。如果不关闭 Stmt，它持有的底层连接可能一直不归还，最终耗尽连接池。`defer` 放在 `Prepare` 成功之后立刻写，别拖到函数末尾才想起来。\n::transfer\n::scene 你要批量导入 5000 条账目，同事写了「循环里每次都 `db.QueryRow("SELECT id FROM entries WHERE ...")` 判重，没有就 INSERT」。\n::ask 这个做法有几个问题？在不改业务语义的前提下怎么优化？\n::hint 想想 5000 次网络/解析往返、以及「先查再插」的并发窗口。\n::ans 三个问题：① **N+1 往返**，5000 次查询 + 最多 5000 次插入 = 上万次往返，SQLite 本地也要几秒到几十秒；② **先查再插有竞态**，两个并发导入会同时通过判重然后都插入；③ 每次都重新 prepare SQL，浪费解析。优化：把判重交给数据库唯一约束（`UNIQUE(user_id, date, amount, category)`），用 `INSERT ... ON CONFLICT DO NOTHING` 一条语句完成「不存在才插」；批量放在一个事务里，用 `tx.Prepare` 复用语句。**「先查再写」几乎总是应该改成「让数据库判」**。\n::crit 知道 `Scan` 按列顺序填充，写查询时 SELECT 显式列名\n::crit 会为可空列选 `sql.NullString` 或 `COALESCE`，并说出两者的取舍\n::crit 遵守「谁创建谁关闭」，`Prepare` 后立刻 `defer stmt.Close()`\n::crit 能指出「先查再插」的竞态，并改用唯一约束 + `ON CONFLICT`\n\n<!--day 12-->\n::pre 知道事务的 ACID 概念；写过 `BEGIN`/`COMMIT`。\n::predict go\ntx, _ := db.Begin()\ntx.Exec("INSERT INTO entries(amount) VALUES (100)")\ntx.Exec("INSERT INTO entries(amount) VALUES (200)")\nreturn nil          // 忘了 Commit\n::ask 这两条数据会写进去吗？\n::ans 不会。没有 `Commit` 的事务在连接归还时会被回滚（`database/sql` 在 `tx` 被 GC 前若未提交，`Close` 时会 rollback）。这是**「写了但没生效」的经典形态**：代码不报错、日志正常、查询看不到。规则：`Begin` 之后立刻写 `defer tx.Rollback()`，成功路径显式 `Commit`——`Rollback` 在已提交后调用返回 `ErrTxDone`，无害。\n::predict go\nfunc create(tx *sql.Tx) error {\n    if _, err := tx.Exec("INSERT ..."); err != nil { return err }\n    return nil\n}\n// 调用方\ntx, _ := db.Begin()\nif err := create(tx); err != nil {\n    tx.Rollback()\n    return err\n}\ntx.Commit()\n::ask 这个模式有什么问题？如果 `create` 内部 panic 呢？\n::ans 问题一：`create` 拿到的是 `*sql.Tx`，没有 ctx，无法随请求取消——应该用 `BeginTx(ctx, nil)` 并把 ctx 传下去（或让 tx 由调用方在 ctx 上创建后统一管理）。问题二：panic 时既不会 Rollback 也不会 Commit，连接被占着直到 GC，高并发下会耗尽连接池。修法：`defer func(){ if p := recover(); p != nil { tx.Rollback(); panic(p) } }()`，或者更简单——**把事务边界收敛到一个函数里，用 defer 统一兜底**。\n::debug go\ntx, _ := db.Begin()\ntx.Exec("UPDATE entries SET amount = amount - 100 WHERE id = 1")\ntx.Exec("UPDATE entries SET amount = amount + 100 WHERE id = 2")\n// 第二条因为 CHECK 约束失败\ntx.Commit()\n::sym 第二条明明失败了，但第一条的扣款却生效了，账对不上。\n::ask 为什么？`Exec` 的返回值被忽略了会怎样？\n::ans `Exec` 返回 `(Result, error)`，这里把 error 丢了，所以失败被静默忽略，事务照常 Commit，第一条扣款就落了库。**事务不等于自动回滚**——它只保证「要么全提交、要么全回滚」，前提是你在出错时真的调用了 Rollback。每条 `Exec` 都必须检查 error，任一失败立即 `return err` 让 defer 去回滚。这类 bug 在转账/记账场景里就是真实的资金差错。\n::transfer\n::scene 转账：A 扣 100、B 加 100，两条 UPDATE 必须在同一事务里。你还要在事务内查一次 A 的余额做校验。\n::ask 写出这个函数的骨架（含 ctx、错误处理、defer），并说明校验查询为什么要放在事务内。\n::hint 校验放事务外会有什么窗口？\n::ans 骨架：\n```go\nfunc Transfer(ctx context.Context, db *sql.DB, from, to int64, cents int64) error {\n    tx, err := db.BeginTx(ctx, nil)\n    if err != nil { return fmt.Errorf("begin: %w", err) }\n    defer tx.Rollback()\n\n    var bal int64\n    if err := tx.QueryRowContext(ctx, `SELECT balance FROM accounts WHERE id = ?`, from).Scan(&bal); err != nil {\n        return fmt.Errorf("load balance: %w", err)\n    }\n    if bal < cents { return ErrInsufficient }\n\n    if _, err := tx.ExecContext(ctx, `UPDATE accounts SET balance = balance - ? WHERE id = ?`, cents, from); err != nil {\n        return fmt.Errorf("debit: %w", err)\n    }\n    if _, err := tx.ExecContext(ctx, `UPDATE accounts SET balance = balance + ? WHERE id = ?`, cents, to); err != nil {\n        return fmt.Errorf("credit: %w", err)\n    }\n    return tx.Commit()\n}\n```\n校验必须在事务内：放外面就是「查完到扣款之间」的窗口，另一个事务可能已经把钱花掉了（TOCTOU）。SQLite 下用 `BEGIN IMMEDIATE` 或 `UPDATE ... WHERE balance >= ?` 加条件更新更稳。**「读-判断-写」三步必须在同一个事务里，否则判断就是过期的。**\n::crit 知道 `Begin` 后必须立刻 `defer tx.Rollback()`，成功路径显式 `Commit`\n::crit 事务内的每条 `Exec` 都检查 error，绝不忽略\n::crit 能解释「读-判断-写」为什么必须在同一事务内，并举出 TOCTOU 的后果\n::crit 事务函数用 `BeginTx(ctx, ...)` 且所有语句带 `Context` 版本\n\n<!--day 13-->\n::pre 知道连接池概念；见过「连接泄漏」这个词。\n::predict go\ndb, _ := sql.Open("sqlite", "ledger.db")\ndb.SetMaxOpenConns(10)\ndb.SetMaxIdleConns(10)\ndb.SetConnMaxLifetime(time.Hour)\n// 服务运行 3 天后，句柄数持续上涨\n::ask 连接池配置看起来很正常，为什么还会泄漏？\n::ans 配置只决定「池里最多几个」，不决定「借出的会不会还」。泄漏来自**借了不还**：`rows` 没 Close、`tx` 没 Commit/Rollback、`stmt` 没 Close。每个未归还的连接都占住池里的一个位置，池满之后新请求就卡在 `db.Query` 上直到超时。**排查方法：`db.Stats()` 看 `InUse` 是否只增不减**，这是判断泄漏最快的信号。\n::predict go\ndb.SetMaxIdleConns(0)\n// 每个请求：Query → Scan → 返回\n::ask 功能正常，但 QPS 上不去，为什么？\n::ans `MaxIdleConns(0)` 意味着连接用完立刻关闭，下个请求要重新建连接（SQLite 本地也要打开文件、初始化页缓存）。表现为「功能对但慢」，CPU 花在反复建连上。**`MaxIdleConns` 决定复用，`MaxOpenConns` 决定上限**——两个都要设，且 Idle 通常等于或略小于 Open。默认 `MaxIdleConns` 只有 2，容易被忽略。\n::debug go\nrows, err := db.Query("SELECT id FROM entries")\nif err != nil { return err }\nfor rows.Next() {\n    var id int64\n    rows.Scan(&id)\n    if id == target {\n        return nil        // 提前返回，没 Close\n    }\n}\n::sym 请求量上来之后，服务开始大量超时，重启就恢复。\n::ask 泄漏点在哪？为什么重启能恢复？\n::ans 提前 `return nil` 时 `rows` 没有关闭，它占用的连接不会归还池。每次命中 target 就漏一个，池满后所有查询都在等连接。重启之所以「恢复」，是因为进程退出把所有连接释放了。修法：`defer rows.Close()` 紧跟 `Query` 之后。**任何在 `for rows.Next()` 里提前 return 的代码，都必须有 defer 兜底**——这是最容易漏的形态。\n::transfer\n::scene 家庭账本跑在树莓派上，SQLite 单文件。你要为它定一套连接池参数，并说清每个参数的理由。\n::ask 给出 `SetMaxOpenConns` / `SetMaxIdleConns` / `SetConnMaxLifetime` 的具体值和理由。\n::hint 想 SQLite 的写并发模型，以及「连接建立成本」在这台机器上有多高。\n::ans 推荐 `MaxOpenConns(1)`、`MaxIdleConns(1)`、`ConnMaxLifetime(0)`（不限）。理由：SQLite 单写者，1 个连接彻底避免 BUSY，家庭并发（几个人偶尔记账）完全够；Idle 设 1 保证连接常驻复用；Lifetime 不限，因为本地文件连接没有「服务端主动断开」的问题，设短了反而增加重连开销。如果开了 WAL 且读请求明显变多，再考虑「写池 1 + 读池 N」的双池方案。**参数要为场景服务，不要抄云环境的默认值。**\n::crit 会用 `db.Stats().InUse` 判断连接泄漏，并解释「只增不减」意味着什么\n::crit 知道 `MaxIdleConns` 默认只有 2，会显式设置\n::crit 写 `rows` 循环时 `defer rows.Close()` 紧跟 Query，提前 return 也不漏\n::crit 能为 SQLite 场景说出「为什么 MaxOpenConns=1」而不是照抄云端配置\n\n<!--day 14-->\n::pre 完成 D1-D13：会建表、会增删查、会事务、会关连接。\n::predict bash\ngo run . add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭\n::ask `flag` 包解析 `-amount 35.5` 时，`Amount` 变量应该是什么类型？如果用 `float64`，写库前必须做什么？\n::ans `flag.Float64`，但**更好的设计是 `flag.String` 收 "35.5" 然后自己 `strconv.ParseFloat` 再用 `math.Round(x*100)` 转成分**。直接 `flag.Float64` 也能用，问题是浮点误差已经在内存里了。写库前必须转成 `int64` 的分：`cents := int64(math.Round(v * 100))`，并校验 `cents > 0`。**CLI 是唯一允许接触「元」的地方，进库前必须变成分。**\n::predict go\ntype Entry struct {\n    ID       int64\n    Amount   int64\n    Category string\n    Date     string\n    Note     string\n}\n// list 输出\nfor _, e := range entries {\n    fmt.Printf("%s  %s  %d\\n", e.Date, e.Category, e.Amount)\n}\n::ask 用户看到 `3550` 会不会困惑？输出层该做什么转换？\n::ans 会——用户输入 35.5，看到 3550 会以为记错了。输出层必须转回元：`fmt.Printf("%.2f", float64(e.Amount)/100)`，或更安全地用整数拼字符串 `fmt.Sprintf("%d.%02d", c/100, c%100)` 避免浮点。**存储用分、展示用元，转换只发生在边界（输入解析、输出格式化）**，中间层一律是分。这条边界一旦模糊，后期到处都要猜「这个 amount 是分还是元」。\n::debug go\nflag.Parse()\nif flag.NArg() < 1 {\n    fmt.Println("用法: ledger-cli add ...")\n    os.Exit(1)\n}\nswitch os.Args[1] {\ncase "add": ...\ncase "list": ...\ndefault:\n    fmt.Println("未知命令")\n}\n::sym 用户执行 `ledger-cli add -amount 10` 时，`os.Args[1]` 是 `add`；但执行 `ledger-cli -amount 10 add` 时行为诡异。\n::ask 混用 `flag.Parse()` 和 `os.Args[1]` 的问题是什么？\n::ans `flag.Parse()` 只解析**第一个非 flag 参数之前**的 flag。`ledger-cli add -amount 10` 里 `add` 是非 flag 参数，Parse 到这里就停了，`-amount` 根本没被解析，值还是默认 0。所以「先 Parse 再读 os.Args[1]」这个组合是错的。正确做法：先取子命令 `cmd := os.Args[1]`，再用 `flag.NewFlagSet(cmd, ...)` 为该子命令单独解析 `os.Args[2:]`。**子命令 + flag 必须用 FlagSet，不能用全局 flag**，否则参数顺序一变就静默失效。\n::transfer\n::scene 用户执行 `add -amount 35.5 -category 餐饮`，你要在写入前做完整校验。\n::ask 列出至少 5 条校验，并说明每条失败时应该报什么、退出码是什么。\n::hint 从「金额、分类、日期、备注、重复」五个维度想。\n::ans ① 金额：`cents > 0`，否则 `amount must be positive`，退出码 2（用法错误）；② 分类：非空且在预置列表内（或允许自定义但要 trim），否则提示可选值；③ 日期：`time.Parse("2006-01-02")` 成功且不在未来（家庭账本记未来账没有意义），失败报格式要求；④ 备注：rune 长度 ≤ 50；⑤ 重复：同一天同金额同分类已有记录时提示「疑似重复，加 -force 强制写入」。校验全部在写库**之前**完成，不要写一半再回滚——CLI 场景没有事务必要，早失败更简单。**退出码要区分「用法错误(2)」和「运行失败(1)」**，脚本才能正确判断。\n::crit `add` 和 `list` 都能跑通，数据落在 `ledger.db`\n::crit 输入解析、存储、输出三处的单位转换都正确，且中间层只有「分」\n::crit 子命令用独立 `FlagSet` 解析，`-amount` 放在子命令前后都不会失效\n::crit 至少有 5 条入参校验，且失败时退出码能区分用法错误与运行错误\n\n<!--day 15-->\n::pre 完成 D14：`add` 能写入、`list` 能读出。\n::predict sql\nSELECT strftime(\'%Y-%m\', date) AS m, SUM(amount)\nFROM entries GROUP BY m ORDER BY m DESC\n::ask 如果 `date` 存的是 `2026-10-19`，这个查询能正确按月汇总吗？有什么前提？\n::ans 能，前提是 `date` 一律是 `YYYY-MM-DD` 定长格式。`strftime` 对不合规的字符串返回 NULL，那些行会被分到一个 NULL 组里静默丢失。**依赖字符串格式的聚合，必须保证写入侧已经规范化**——在 D14 的校验里就该挡住 `2026-10-9` 这种。更稳的做法是存 Unix 时间戳或整数 `20261019`，但家庭账本用定长字符串足够，只要写入严格。\n::predict go\nvar total int64\nerr := db.QueryRow("SELECT COALESCE(SUM(amount),0) FROM entries WHERE date LIKE ?", month+"%").Scan(&total)\n::ask 空月份时 `total` 是多少？如果去掉 COALESCE 呢？\n::ans 有 COALESCE 时是 0；去掉后 `SUM` 返回 NULL，`Scan` 进 `int64` 会报 `converting NULL to int64 is unsupported`。**聚合函数在空集上返回 NULL，不是 0**，这是聚合查询最常见的坑。所有 `SUM`/`AVG`/`MAX` 都要考虑空集，要么 `COALESCE`，要么用 `sql.NullInt64`。\n::debug bash\ngo run . add -amount 35.5 -category 餐饮 -date 2026-10-19\ngo run . add -amount 12 -category 交通 -date 2026-10-20\ngo run . sum -month 2026-10\n# 输出 1200\n::ask 期望 4750，实际 1200。最可能的三个原因是什么？按可能性排序。\n::ans ① **单位错了**：`-amount 12` 可能被当成 12 分而不是 12 元，总和变成 3550+12=3562 也不对，但如果两条都被当成「元→分」转换两次或没转换，会出现 1200 这种量级（12 元=1200 分，只有第二条生效）。② **WHERE 条件漏了第一条**：比如日期比较用了 `>` 而不是 `>=`，或者 `LIKE` 拼成了 `2026-10-2%`。③ **事务没提交**：第一条写了但没 Commit，进程退出后回滚。排查顺序：先 `sqlite3 ledger.db \'select * from entries\'` 看库里到底有几条、amount 是多少——**先确认数据，再怀疑代码**。\n::transfer\n::scene 阶段验收要求「关掉终端数据还在」。你要设计一个能在 2 分钟内跑完的验收脚本。\n::ask 写出脚本的步骤（含清理），并说明每步验证的是哪个能力。\n::hint 要覆盖「写入 → 进程退出 → 重新读取 → 数值正确」四件事。\n::ans \n```bash\n#!/usr/bin/env bash\nset -euo pipefail\nDB=/tmp/ledger-accept.db\nrm -f "$DB" "$DB-wal" "$DB-shm"\nBIN=./ledger-cli\n\n$BIN -db "$DB" add -amount 35.5 -category 餐饮 -date 2026-10-19 -note 午饭\n$BIN -db "$DB" add -amount 12 -category 交通 -date 2026-10-20\n# 关键：每条命令都是独立进程，天然验证「跨进程持久化」\n[ "$($BIN -db "$DB" list | wc -l)" = "2" ] || { echo "list 条数错"; exit 1; }\n[ "$($BIN -db "$DB" sum -month 2026-10)" = "4750" ] || { echo "sum 错"; exit 1; }\nsqlite3 "$DB" \'select count(*) from entries\' | grep -qx 2 || { echo "库里条数错"; exit 1; }\necho OK\n```\n每步验证：add 验证写入与校验；独立进程验证持久化（内存实现过不了）；list 验证读取与排序；sum 验证聚合与单位；直查库验证「不是 CLI 自己在骗自己」。**验收脚本必须能被别人一条命令跑，且失败时明确指出哪一步错了**——这是阶段一唯一可交付的「完成证据」。\n::crit `sum -month` 输出的数字与手算一致，且空月份返回 0 而不是报错\n::crit 能解释 `SUM` 在空集返回 NULL 的坑，代码里有 COALESCE 或 NullInt64\n::crit 验收脚本从空库开始跑，全部断言通过，且失败时能定位到具体步骤\n::crit 能说出「数据在库里」和「数据在内存里」在验收上如何区分\n',_f='<!--day 1-->\n::pre 知道函数调用会返回；理解「程序按顺序一行行执行」。\n::predict go\nfor i := 0; i < 3; i++ {\n    go fmt.Print(i)\n}\n::ask 这段一定打印 `012` 吗？\n::ans 不一定，甚至可能什么都不打印。原因有三：① 每次迭代的 `i` 是同一个变量被改写，goroutine 真正执行时看到的可能是任意值（Go 1.22 起 `for` 循环变量改为每轮独立，所以现在是 0/1/2 各一份，但执行顺序仍不定）；② `main` 打印完就退出，不会等 goroutine，可能一个都没跑完；③ 输出顺序取决于调度。**`go` 只是「发起」，不保证「完成」，也不保证「按顺序」**。要让 main 等，需要 WaitGroup 或 channel。\n::predict go\nfunc main() {\n    go func() { panic("boom") }()\n    time.Sleep(100 * time.Millisecond)\n    fmt.Println("alive")\n}\n::ask 输出什么？\n::ans 进程直接崩掉，栈信息里写着 `panic: boom`，`alive` 不会打印。**goroutine 里的 panic 不会只死那一个 goroutine，它会终止整个进程**（除非该 goroutine 内自己 recover）。这跟很多人对「线程池」的直觉相反。所以每个 `go func(){...}` 的入口都该有自己的 `defer recover`，尤其是处理请求的 goroutine。\n::debug go\nvar wg sync.WaitGroup\nfor i := 0; i < 5; i++ {\n    go func() {\n        defer wg.Done()\n        doWork(i)\n    }()\n}\nwg.Wait()\n::sym 程序直接 panic：`sync: negative WaitGroup counter`，或者 `doWork` 收到的 i 全是 5。\n::ask 缺了什么？为什么会出现负数计数？\n::ans 缺 `wg.Add(5)`（或循环内 `wg.Add(1)`）。`Done()` 是 `Add(-1)`，在计数为 0 时再减就 panic。另外 `i` 在 Go 1.22 之前会被所有 goroutine 共享，全部读到循环结束后的值。修法：`wg.Add(1)` 放在 `go` 语句**之前**（不是 goroutine 内部，否则可能在 Wait 之后才 Add）；如果目标是兼容旧版本，把 `i` 作为参数传入 `go func(n int){...}(i)`。\n::transfer\n::scene 你要并发处理 1000 条账目的分类统计，每条独立，最后合并结果。同事写了「起 1000 个 goroutine，每个查一次库」。\n::ask 这样做有什么问题？在 SQLite + MaxOpenConns(1) 下会发生什么？\n::hint 想连接池的排队行为，以及 goroutine 的调度成本。\n::ans 两个问题：① **1000 个 goroutine 抢 1 个数据库连接**，999 个在排队等连接，等于把并发变成了「排队 + 上下文切换开销」，总耗时比串行还长；② 内存与调度压力，虽然 goroutine 很轻（初始 2KB 栈），但 1000 个仍然没必要。正确做法：用一个固定大小的工作池（比如 4-8 个 worker 从 channel 取任务），或者干脆在 SQL 里一次 `GROUP BY` 算完——**能在数据库里聚合的，不要搬到应用层并发做**。并发的价值在于「等待 IO 时干别的」，不是「把 CPU 活拆碎」。\n::crit 能解释 `go f()` 的三不保证：不保证开始、不保证完成、不保证顺序\n::crit 知道 goroutine 内 panic 会杀整个进程，会在入口加 recover\n::crit `wg.Add` 写在 `go` 之前，且能说出写在内部的竞态风险\n::crit 能量化「1000 goroutine 抢 1 连接」为什么比串行更慢\n\n<!--day 2-->\n::pre 完成 D1：知道 goroutine 是并发执行流。\n::predict go\nch := make(chan int)\nch <- 1\nfmt.Println(<-ch)\n::ask 输出什么？\n::ans **死锁**：`fatal error: all goroutines are asleep - deadlock!`。无缓冲 channel 的发送会阻塞，直到有接收方就绪；这里发送时还没有接收方，主 goroutine 自己卡死，运行时检测到「所有 goroutine 都睡了」直接终止。必须让发送和接收在不同 goroutine：`go func(){ ch <- 1 }()`，或改用带缓冲 `make(chan int, 1)`。\n::predict go\nch := make(chan int, 2)\nch <- 1\nch <- 2\nch <- 3\n::ask 第三行会怎样？\n::ans 阻塞（若在主 goroutine 则死锁）。缓冲为 2 的 channel 只能暂存 2 个，第三个发送必须等有人接收。**缓冲不是「无限队列」，它只是把「必须同时就绪」放宽成「允许积压 N 个」**。设缓冲的依据是「生产者和消费者的速度差有多大」，不是「越大越好」——缓冲越大，出问题时内存占用和「数据积压未处理」的隐蔽性越强。\n::debug go\nfunc worker(ch chan int) {\n    for v := range ch {\n        process(v)\n    }\n}\nfunc main() {\n    ch := make(chan int)\n    go worker(ch)\n    for i := 0; i < 10; i++ {\n        ch <- i\n    }\n    // 没有 close(ch)\n    time.Sleep(time.Second)\n}\n::ask 功能看起来正常，但 `worker` 永远不会退出。为什么？关闭责任在谁？\n::ans `range ch` 只有在 channel 被 close 之后才会结束，否则永远阻塞等待。这里没人 close，worker 就永久挂着（虽然 main 退出后进程结束，但在长期运行的服务里就是 goroutine 泄漏）。规则：**由发送方关闭 channel，且只关一次**；接收方永远不要关。修法：`for` 循环结束后 `close(ch)`。另一个规则：如果多个 goroutine 都在发，就不能随便关——需要一个协调者（额外的 done channel 或 WaitGroup）来保证「所有发送者结束后才关」。\n::transfer\n::scene 你要实现「生产者读 CSV 的每一行 → 消费者写库」，生产者可能出错（文件损坏）。\n::ask channel 只传 `Entry` 够吗？错误怎么传？给出你的设计。\n::hint 想想「消费者怎么知道生产者中途失败了」，以及 close 之后还能不能读到值。\n::ans 不够，需要传结果结构：`type item struct { e Entry; err error }`，或者两个 channel（`ch chan Entry` + `errCh chan error`）。更简洁的做法是发 `item`，最后一条带 `err`，消费者看到 err 就停止并上报。注意：**close 之后 channel 仍能读出剩余缓冲值**，所以「关闭」不等于「立刻结束」，消费者要先把缓冲读完（`range` 天然如此）。不要用「发送一个特殊零值表示结束」——零值可能是合法数据，必须用 close 语义。\n::crit 能复现无缓冲 channel 的死锁，并说出触发条件\n::crit 知道缓冲满时发送阻塞，能根据「速度差」而不是「拍脑袋」定缓冲大小\n::crit 遵守「发送方 close、只 close 一次、接收方不 close」\n::crit 知道 close 后仍可读完缓冲，不会用零值当结束标记\n\n<!--day 3-->\n::pre 完成 D2：会用 channel 收发。\n::predict go\nch := make(chan int)\nselect {\ncase v := <-ch:\n    fmt.Println("recv", v)\ndefault:\n    fmt.Println("empty")\n}\n::ask 输出什么？\n::ans 输出 `empty`。`select` 在所有 case 都不就绪时，如果有 `default` 就立刻走 default（非阻塞）。没有 default 就阻塞等待。这是实现「尝试读一次，没有就算」的标准写法。**`default` 让 select 变成非阻塞轮询**，但要小心：放在 `for` 循环里会变成忙等，把 CPU 打满。\n::predict go\nch := make(chan int, 1)\nch <- 1\nselect {\ncase v := <-ch:\n    fmt.Println("got", v)\ncase <-time.After(time.Second):\n    fmt.Println("timeout")\n}\n::ask 输出什么？如果两个 case 同时就绪呢？\n::ans 输出 `got 1`。两个 case 同时就绪时，`select` **随机选一个**（伪随机，避免饥饿）。这条规则很重要：不能依赖 select 的优先级，需要优先级时必须显式嵌套（先非阻塞试高优先级，再阻塞等）。\n::debug go\nfor {\n    select {\n    case v := <-ch:\n        handle(v)\n    case <-time.After(100 * time.Millisecond):\n        return\n    }\n}\n::sym 每轮循环都创建一个新的 Timer，高频运行时 GC 压力大、定时器堆积。\n::ask 为什么？怎么改？\n::ans `time.After` 每次调用都新建一个 `*Timer`，在循环里就是每 100ms 建一个，旧的要等触发后才被回收。高频路径应改为复用：`t := time.NewTimer(d); defer t.Stop()`，循环内 `if !t.Reset(d) { <-t.C }`（Reset 前要确保通道已排空）。**`time.After` 适合「一次性超时」，循环里必须换成可复用的 Timer**，否则就是定时器泄漏。\n::transfer\n::scene 一个 worker 要在「收到任务」「收到退出信号」「每 5 秒打一次心跳」三件事之间等待。\n::ask 写出 select 骨架，并说明为什么不能把心跳写成 `time.Sleep`。\n::hint `time.Sleep` 期间能响应退出信号吗？\n::ans \n```go\nticker := time.NewTicker(5 * time.Second)\ndefer ticker.Stop()\nfor {\n    select {\n    case job, ok := <-jobs:\n        if !ok { return }\n        handle(job)\n    case <-ticker.C:\n        heartbeat()\n    case <-ctx.Done():\n        return\n    }\n}\n```\n`time.Sleep(5s)` 会让 goroutine 在这 5 秒内**完全无法响应退出信号**，优雅关闭时就要等满 5 秒。`select` 让「等待」变成「同时等三件事，谁先来处理谁」，这是 Go 并发的核心模式。**任何需要「边等边响应」的场景，都不该用 Sleep。**\n::crit 知道 `select` 无就绪 case 且无 default 时阻塞，有 default 时非阻塞\n::crit 知道多个 case 同时就绪时是随机选择，不依赖优先级\n::crit 循环里不用 `time.After`，改用 `NewTimer`/`NewTicker` 并 Stop\n::crit 能用 select 同时处理数据、心跳、取消三类事件，且不阻塞退出\n\n<!--day 4-->\n::pre 完成 D1-D3：会用 goroutine、channel、select。\n::predict go\nvar count int\nvar wg sync.WaitGroup\nfor i := 0; i < 1000; i++ {\n    wg.Add(1)\n    go func() { defer wg.Done(); count++ }()\n}\nwg.Wait()\nfmt.Println(count)\n::ask 输出一定是 1000 吗？\n::ans 不一定，可能小于 1000，且结果每次运行都不同。`count++` 是「读-加-写」三步，两个 goroutine 可能同时读到 100，各自加 1 写回 101，两次自增只生效一次。这就是**竞态条件（data race）**。`wg.Wait` 只保证 goroutine 都跑完了，不保证它们之间互斥。\n::predict bash\ngo run -race main.go\n::ask `-race` 会输出什么？它的检测原理是什么？\n::ans 会输出 `WARNING: DATA RACE`，并给出两个冲突访问的 goroutine 栈：一个 Write at ...、一个 Write at ...，以及「共享变量在哪个地址」。原理是 **happens-before 分析**：运行时记录每次内存访问的向量时钟，若两个访问之间没有同步关系（没有锁、没有 channel 通信），就报 race。注意：**`-race` 只能报告「实际发生」的竞态**，没跑到就不报——所以测试要尽量覆盖并发路径，且 `-race` 下程序会慢 5-10 倍、内存涨 5-10 倍。\n::debug go\nvar wg sync.WaitGroup\nfor i := 0; i < 10; i++ {\n    wg.Add(1)\n    go func() {\n        defer wg.Done()\n        shared = append(shared, i)\n    }()\n}\nwg.Wait()\n::sym `-race` 报 DATA RACE 指向 `append` 那一行，且 `shared` 长度经常小于 10。\n::ask 为什么 `append` 是竞态的高发点？加 Mutex 就能解决长度问题吗？\n::ans `append` 内部做三件事：读 len、写新元素、更新 len。两个 goroutine 同时 append 可能都基于同一个 len 写入同一个位置，一个覆盖另一个，于是长度短了、数据丢了。而且扩容时还会替换底层数组指针，导致并发写不同数组。加 Mutex 包住整个 `append` 能解决（必须包住，不能只包元素写入）。**凡是「读-改-写」复合操作，锁的粒度必须覆盖整个复合操作**，拆开锁就等于没锁。\n::transfer\n::scene 你要给 `Store` 加一层内存缓存 `map[string]*Entry`，多个 handler goroutine 会同时读写。\n::ask 需要哪些锁、加在哪几处？只加一把全局锁够吗？\n::hint 想想「读多写少」场景下，`sync.RWMutex` 与 `sync.Mutex` 的差别。\n::ans 用 `sync.RWMutex` 保护整个 map：`Get` 用 `RLock`，`Set`/`Delete` 用 `Lock`。注意三件事：① **不能返回 map 内部指针让别人改**——`Get` 应返回副本或只读视图，否则锁外修改仍会竞态；② **锁不能覆盖耗时操作**（比如锁内发 HTTP），否则退化成串行；③ 如果只是「读多写少」且数据量小，`sync.Map` 也可以，但它的 API 用起来别扭、性能优势只在特定模式下存在，优先 RWMutex。**锁的边界是「被保护的数据」，不是「整个函数」**。\n::crit 能复现 `count++` 丢失更新，并用 `-race` 看到报告\n::crit 知道 `-race` 只报实际发生的竞态，且需要覆盖率\n::crit 加锁覆盖整个「读-改-写」复合操作，不拆开\n::crit 缓存实现里不把内部指针暴露到锁外\n\n<!--day 5-->\n::pre 完成 D4：看到过 DATA RACE 报告。\n::predict go\nvar mu sync.Mutex\nvar count int\nfor i := 0; i < 1000; i++ {\n    go func() {\n        mu.Lock()\n        count++\n        mu.Unlock()\n    }()\n}\n// 没有 Wait\nfmt.Println(count)\n::ask 加了锁，输出一定是 1000 吗？\n::ans 不一定，通常远小于 1000。锁解决了「写冲突」，但没解决「等不等」——main 可能在大部分 goroutine 执行前就打印并退出。**锁保证正确性，WaitGroup 保证时序**，两件事不能互相替代。这是加锁后最常见的「以为修好了」。\n::predict go\nvar mu sync.Mutex\nfunc f() {\n    mu.Lock()\n    defer mu.Unlock()\n    g()\n}\nfunc g() {\n    mu.Lock()   // 再次获取同一把锁\n    defer mu.Unlock()\n}\n::ask 调用 f 会怎样？\n::ans **死锁**（`fatal error: all goroutines are asleep - deadlock!`）。`sync.Mutex` 不可重入，同一 goroutine 重复 Lock 会永久阻塞。修法：拆出不加锁的内部函数 `gLocked()`，由 f 在持锁时调用；或者重新设计锁的边界，让 g 不假设自己需要锁。**「可重入锁」在 Go 里不存在，这是刻意设计**——它逼你把临界区想清楚，而不是靠递归加锁蒙混。\n::debug go\nmu.Lock()\nif err := doSomething(); err != nil {\n    return          // 忘了 Unlock\n}\nmu.Unlock()\n::sym 偶发死锁，重启恢复；压力测试时几乎必现。\n::ask 这类 bug 的通用修法是什么？为什么它能躲过测试？\n::ans 修法是 `defer mu.Unlock()` 紧跟 `mu.Lock()`，让所有返回路径都解锁。它能躲过测试是因为：只有在「doSomething 返回 err」这条路径上才漏锁，正常数据下不触发；一旦线上出现脏数据走到错误分支，锁永久泄漏，后续所有请求卡死。**`Lock` 和 `defer Unlock` 必须成对写在一起，中间不插任何代码**——这是唯一可靠的纪律。\n::transfer\n::scene 账本服务有一个 `statsCache`，读很频繁（每次列表都查）、写很少（只在新增账目时失效）。\n::ask 用 `Mutex` 还是 `RWMutex`？给出读写两侧的具体代码，并说明一个容易写错的点。\n::hint 失效操作用什么锁？「检查-失效」是不是原子？\n::ans 用 `RWMutex`：读 `RLock/RUnlock`，失效 `Lock/Unlock`。易错点：**「判断缓存是否存在 → 不存在就回源 → 写回」不是原子的**，两个请求可能同时回源（缓存击穿）。要避免就得在写路径再加一层「单飞」（singleflight）或在锁内做整个回源——但锁内回源会阻塞所有读，通常不可接受。家庭账本量级可以直接接受少量重复回源，**但你要知道自己接受的是什么**。另一个易错点：失效操作用 `Lock` 而不是 `RLock`，用错编译能过、行为错。\n::crit 加锁代码里 `Lock` 与 `defer Unlock` 相邻，中间无逻辑\n::crit 知道 Mutex 不可重入，能复现自己锁自己的死锁\n::crit 能区分「锁保证正确性」和「WaitGroup 保证时序」，两者都用\n::crit RWMutex 的写路径用 `Lock`，读路径用 `RLock`，并知道「检查-写入」需要额外原子性\n\n<!--day 6-->\n::pre 完成 D1-D5：会并发、会加锁、会等。\n::predict go\nctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)\ndefer cancel()\nselect {\ncase <-time.After(time.Second):\n    fmt.Println("work done")\ncase <-ctx.Done():\n    fmt.Println("timeout:", ctx.Err())\n}\n::ask 输出什么？`ctx.Err()` 是什么值？\n::ans 输出 `timeout: context deadline exceeded`。100ms 后 ctx 被取消，`Done()` 通道关闭，select 走 ctx 分支。`ctx.Err()` 区分两种：`context.DeadlineExceeded`（超时）和 `context.Canceled`（主动取消）。**必须区分这两者**——超时是「对方太慢」，取消是「我们不需要了」，日志和重试策略完全不同。\n::predict go\nfunc handler(w http.ResponseWriter, r *http.Request) {\n    ctx := r.Context()\n    go func() {\n        time.Sleep(5 * time.Second)\n        db.Exec("INSERT ...")     // 用的是全局 db，没有 ctx\n    }()\n    w.WriteHeader(200)\n}\n::ask 客户端在 1 秒后断开，这个 INSERT 还会执行吗？\n::ans 会。goroutine 里用的是 `db.Exec` 而不是 `ExecContext(ctx, ...)`，ctx 根本没传下去，所以「客户端走了」这件事对写库毫无影响。结果：请求已经结束、资源已释放，后台还在写一条用户不要的数据——这就是**「取消信号没有传播」**。修法：`db.ExecContext(ctx, ...)`，并且不要在 handler 里起不受控的 goroutine（要用也要有自己的生命周期管理）。\n::debug go\nctx, cancel := context.WithTimeout(context.Background(), time.Second)\ndefer cancel()\nfor i := 0; i < 100; i++ {\n    go doWork(ctx)\n}\n// doWork 内部：select { case <-time.After(2*time.Second): ... case <-ctx.Done(): return }\n::sym 1 秒后 ctx 超时，但仍有 goroutine 在跑，甚至跑了 2 秒才结束。\n::ask 为什么取消没有立刻生效？`doWork` 里该怎么写才对？\n::ans `doWork` 里如果阻塞在 `time.After` 之外的**不可中断操作**（比如 `time.Sleep`、没有 ctx 的 IO、`for` 循环），ctx 取消只是关闭了一个通道，代码不检查就感知不到。`select` 只能中断「等待」，中断不了「正在执行的代码」。正确写法：所有可能阻塞的地方都要 `select` 或传 ctx；纯计算循环里要定期 `if ctx.Err() != nil { return }`。**取消是协作式的，不是抢占式的**——这一点和线程 kill 完全不同。\n::transfer\n::scene 你的 handler 调用 Service，Service 调用 Store，Store 执行 SQL。要在客户端断开时让 SQL 也尽快结束。\n::ask ctx 要怎么一路传下去？有哪些常见的断链点？\n::hint 检查每一层的函数签名里有没有 ctx，以及有没有在哪一层「换成了 Background」。\n::ans 一路传：`handler` 用 `r.Context()` → `svc.Get(ctx, id)` → `repo.Get(ctx, id)` → `db.QueryRowContext(ctx, ...)`。断链点通常在这几处：① 某一层图省事写了 `context.Background()`；② 在 goroutine 里把 ctx 存进结构体，之后用的时候已经过期；③ GORM 里用了 `db.WithContext(ctx)` 但后续 `Session` 重置丢了 ctx；④ 中间件里用 `context.WithValue` 包了一层但没把父 ctx 传下去。**ctx 必须作为第一个参数显式传递，绝不存进 struct**——这是 Go 的硬约定。\n::crit 能区分 `DeadlineExceeded` 与 `Canceled`，并在日志里分开处理\n::crit 所有阻塞调用都接受 ctx，且 handler 用 `r.Context()` 而不是 Background\n::crit 知道取消是协作式的，纯计算循环里会主动检查 `ctx.Err()`\n::crit 不在结构体里存 ctx，也不用 `context.Background()` 替换已有 ctx\n\n<!--day 7-->\n::pre 完成 D1-D6；写过多个 `.go` 文件。\n::predict go\n// 文件 a.go\npackage store\nfunc Load() int { return 1 }\n// 文件 b.go 同目录\npackage store\nfunc load() int { return 2 }\n::ask 两个函数能在同一个包共存吗？包外能调用哪个？\n::ans 能共存，名字不同（`Load` vs `load`）。包外只能调 `Load`，因为**首字母大写才是导出**。小写 `load` 是包私有的，同包其他文件可以用。注意：导出与否只看首字母是否 Unicode 大写，`_Load`、`load_` 都是私有的。这条规则简单但没有「private 关键字」的显式感，容易在重构时不小心把内部函数暴露成 API。\n::predict go\n// internal/store/store.go\npackage store\ntype Store struct{ db *sql.DB }\n// 外部模块 example.com/other 尝试：\nimport "example.com/ledger/internal/store"\n::ask 能 import 成功吗？\n::ans 不能：`use of internal package example.com/ledger/internal/store not allowed`。`internal/` 的规则是：**只有以 `example.com/ledger` 为前缀的包能 import 它**。这让「实现细节」在编译器层面被锁住，比「文档里写请勿使用」可靠得多。项目结构里，`internal/` 放「不打算给外部用」的一切；真要对外的库才放 `pkg/`（而且很多项目干脆不用 pkg）。\n::debug bash\ngo build ./...\n# 报错：import cycle not allowed\n# package example.com/ledger/internal/ledger imports example.com/ledger/internal/store\n# package example.com/ledger/internal/store imports example.com/ledger/internal/ledger\n::ask 循环依赖是怎么产生的？正确的依赖方向是什么？\n::ans `store` 里用到了 `ledger.Entry` 这个类型，而 `ledger` 又 import `store` 拿接口——两边互相引用。修法：把**共享的类型**下沉到第三个包（比如 `internal/model`），`ledger` 和 `store` 都只依赖 `model`，形成 `store → model`、`ledger → model` 的树，而不是环。**依赖必须是有向无环图（DAG）**，一旦出现环，说明「领域类型」放错了层——通常是最底层的数据结构被放进了上层包。\n::transfer\n::scene 你要把单文件的 `ledger-cli` 拆成 `main` + `internal/store` + `internal/ledger` 三包。\n::ask 画出依赖方向，并说明 `main` 应该依赖接口还是具体类型。\n::hint 谁定义接口？main 需要知道 SQLite 吗？\n::ans 依赖方向：`main → ledger → store 接口`，`store` 的 SQLite 实现反过来实现接口，在 `main` 里注入。具体说：`ledger` 包定义 `type Store interface { ... }`（使用方定义），`store` 包提供 `NewSQLite(db) *SQLite` 实现它，`main` 里 `svc := ledger.New(store.NewSQLite(db))`。`main` 只依赖 `ledger`，不知道 SQLite 存在。**这样测试 `ledger` 时用内存实现即可，`main` 是唯一需要改动的装配点**。如果 `main` 直接依赖 `*SQLite`，换存储就要改 `main` 甚至 `ledger`。\n::crit 能解释「首字母大写 = 导出」，并说出 `internal/` 的可见性边界\n::crit 遇到 `import cycle` 会先找「共享类型该放哪」，而不是靠拆函数硬绕\n::crit 拆分后 `main` 只做装配，不知道具体存储实现\n::crit 接口定义在使用方包，实现方包只提供构造函数\n\n<!--day 8-->\n::pre 完成 D7：知道三包怎么分。\n::predict go\n// internal/ledger/service.go\ntype Service struct { store Store }\nfunc New(s Store) *Service { return &Service{store: s} }\n// internal/store/sqlite.go\nfunc NewSQLite(db *sql.DB) *SQLite { ... }\n// main.go\nsvc := ledger.New(store.NewSQLite(db))\n::ask 这里有没有循环依赖？如果 `store` 需要返回 `[]ledger.Entry`，会不会出问题？\n::ans 当前没有环，因为 `store` 还没 import `ledger`。一旦 `store` 的方法签名里出现 `ledger.Entry`，`store → ledger`，而 `ledger → store`（接口），立刻成环。解决办法：`Entry` 定义在 `store` 包（数据层），`ledger` import `store` 拿类型和接口——但这样 `ledger` 依赖具体包，测试替换变难。更干净的是 `internal/model` 放 `Entry`，两边都依赖它。**「类型放哪」决定了依赖图的形状**，这是拆分时第一个要想清楚的事。\n::predict go\ntype Store interface {\n    Create(ctx context.Context, e Entry) (int64, error)\n    ListByMonth(ctx context.Context, month string) ([]Entry, error)\n    Sum(ctx context.Context, month string) (int64, error)\n}\n// 测试里\ntype fakeStore struct{}\nfunc (f *fakeStore) Create(...) { ... }\n::ask 这个接口设计有什么问题？随着功能增加会怎样？\n::ans 问题：接口把「读」和「写」混在一起，而且方法会随需求不断膨胀（加分类、加预算、加导出…），最终每个测试的 fake 都要实现十几个方法，其中大部分用不到。更好的做法是**按使用方拆小接口**：`type Reader interface{ ListByMonth; Sum }`、`type Writer interface{ Create }`，Service 只声明自己需要的那几个。Go 的谚语是「接口越大，抽象越弱」，**小接口才可组合**。\n::debug bash\ngo test ./... \n# internal/ledger 编译失败：\n# cannot use store.NewSQLite(db) (value of type *store.SQLite) as Store value:\n# 	*store.SQLite does not implement Store (wrong type for method ListByMonth)\n# 	have ListByMonth(context.Context, string) ([]store.Entry, error)\n# 	want ListByMonth(context.Context, string) ([]model.Entry, error)\n::ask 报错说明什么？该改哪一边？\n::ans 说明两边的 `Entry` 不是同一个类型——`store` 用的是自己包里的 `Entry`，接口要求 `model.Entry`。虽然字段一样，但 Go 的命名类型不Structural兼容，不会自动转换。改法：让 `store` 的方法签名统一用 `model.Entry`（import model），而不是在自己的包里再定义一份。**同一种领域实体只能有一个类型定义**，重复定义会立刻在接口边界炸出来——这其实是好事，编译器帮你发现了「两份模型」的隐患。\n::transfer\n::scene 重构完成后，你要证明「抽象没有漏」。\n::ask 用三条 grep 命令验证 handler 里没有 SQL、Service 里没有 HTTP、Store 里没有业务规则。写出命令并说明期望结果。\n::hint 找特征字符串：`sql.`、`http.`、`fmt.Sprintf("SELECT`。\n::ans \n```bash\ngrep -rn "sql\\.\\|db\\.Query\\|db\\.Exec" internal/httpapi/     # 期望：无输出\ngrep -rn "http\\." internal/ledger/                          # 期望：无输出\ngrep -rn \'fmt.Sprintf("SELECT\' internal/                    # 期望：无输出（防拼接 SQL）\ngrep -rn "net/http" internal/store/                         # 期望：无输出\n```\n前三条分别验证「handler 不碰 SQL」「Service 不碰 HTTP」「没有字符串拼 SQL」。第四条验证 store 不依赖 Web 层。**如果某条有输出，不要急着删，先判断它是不是「合理的例外」**——比如 handler 里出现 `http.StatusCreated` 是正常的（那是响应语义），要看的是有没有 `http.Request` 的业务处理。\n::crit 拆分后 `go build ./...` 与 `go vet ./...` 全绿\n::crit 依赖图无环，且能指出「共享类型放在哪个包、为什么」\n::crit 接口按使用方需要拆小，fake 实现的方法数不超过 4 个\n::crit 三条 grep 验证通过，或能解释每一处例外为何合理\n\n<!--day 9-->\n::pre 完成 D8：三包结构可用、测试能跑。\n::predict bash\ngo test -race ./...\n::ask `-race` 全绿说明什么？说明没有 bug 吗？\n::ans 只说明**「这次执行到的代码路径上没有检测到数据竞争」**。它不证明：没有逻辑错误、没有死锁（死锁是 hang 不是 race）、没有在未覆盖的分支里藏竞态。所以 `-race` 是必要条件不是充分条件——还要有并发路径的测试覆盖（比如同时起多个 goroutine 调同一个 Service），否则 `-race` 只是在测单线程。\n::predict go\nfunc export(months []string) error {\n    var wg sync.WaitGroup\n    errCh := make(chan error, len(months))\n    for _, m := range months {\n        wg.Add(1)\n        go func() {\n            defer wg.Done()\n            if err := writeCSV(m); err != nil {\n                errCh <- err\n            }\n        }()\n    }\n    wg.Wait()\n    close(errCh)\n    for err := range errCh { return err }\n    return nil\n}\n::ask 这段有问题吗？（提示：看闭包变量）\n::ans 有问题：`m` 在 Go 1.22 之前被所有 goroutine 共享，全部 goroutine 可能写同一个月份（现在 1.22+ 每轮独立，但依赖语言版本是脆弱的）。显式传参更安全：`go func(month string){...}(m)`。另外 `errCh` 的缓冲设成 `len(months)` 是对的（保证不会阻塞），但如果错误很多，其实只想要第一个，可以在收到第一个后 cancel 其余——不过那需要 ctx。**并发代码里，闭包捕获循环变量是历史遗留的头号坑，显式传参永远安全**。\n::debug bash\ngo test -race ./internal/ledger\n# ok  ...  0.02s\n# 但线上偶发 panic: concurrent map writes\n::ask 测试全绿，线上却崩。可能的三个原因？\n::ans ① **测试没覆盖并发路径**：测试是串行调用的，`-race` 自然看不到竞态；② **竞态发生在测试没触及的代码**（比如某个只在特定参数下走的分支）；③ **map 的并发写在 `-race` 下也会报**，如果没报说明那次执行确实没并发到——`concurrent map writes` 是 runtime 的致命错误，一旦触发进程直接死，且 recover 无效。排查手段：在测试里显式起 N 个 goroutine 同时打同一个方法，跑 `-race`；生产侧靠 pprof/日志定位是哪个 map。**「测试绿」和「能并发」是两件事。**\n::transfer\n::scene 阶段二验收要求「`-race` 报告出现过又消失」。你要留下可复现的证据。\n::ask 设计一个能稳定复现竞态、并在修复后稳定消失的最小实验，写出关键代码与命令。\n::hint 关键是「让两个 goroutine 真的重叠」，用 Sleep 或屏障放大窗口。\n::ans \n```go\n// race_demo_test.go\nfunc TestRace(t *testing.T) {\n    var count int\n    var wg sync.WaitGroup\n    for i := 0; i < 100; i++ {\n        wg.Add(1)\n        go func() { defer wg.Done(); count++ }()\n    }\n    wg.Wait()\n    _ = count\n}\n```\n`go test -race -run TestRace -count=1 ./...` → 必出 `WARNING: DATA RACE`，栈指向 `count++`。修复：加 `var mu sync.Mutex`，`mu.Lock(); count++; mu.Unlock()`，再跑 → 无报告。证据留存方式：把两次输出各存一个文件（`race-before.txt` / `race-after.txt`），commit 到仓库。**「报告出现过又消失」是可以被审计的事实，不是口头声明**——这也是阶段二唯一的硬验收。\n::crit `go test -race ./...` 全绿，且测试里真的有并发（不是串行调用）\n::crit 能复现一次 DATA RACE 并留下 before/after 输出\n::crit 并发代码里不靠闭包捕获循环变量，显式传参\n::crit 知道 `-race` 全绿 ≠ 无 bug，能说出它覆盖不到的三类问题\n',Cf='<!--day 1-->\n::pre 完成阶段二；知道 TCP 端口、HTTP 请求/响应的粗略结构。\n::predict go\nfunc main() {\n    http.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {\n        fmt.Fprintln(w, "hello")\n    })\n    http.ListenAndServe(":8080", nil)\n}\n::ask 服务启动后，用浏览器访问 `http://localhost:8080/hello/`（带尾斜杠）会怎样？\n::ans 会返回 301 重定向到 `/hello`，或 404，取决于注册方式。用 `http.HandleFunc("/hello", ...)` 注册的是**精确路径**，`/hello/` 不匹配，Go 的 ServeMux 会尝试重定向到 `/hello`（因为 `/hello/` 可以被当作「子树」的根，而父路径存在）。想匹配子树要注册 `"/hello/"`。**`net/http` 的路径匹配规则是「精确优先、然后最长前缀」，末尾有没有斜杠是两套语义**，这是最常见的 404 来源之一。\n::predict go\nsrv := &http.Server{Addr: ":8080", Handler: mux}\nlog.Fatal(srv.ListenAndServe())\n::ask 这个 server 有什么隐患？\n::ans **没有任何超时**。`ReadTimeout`/`WriteTimeout`/`IdleTimeout`/`ReadHeaderTimeout` 默认全是 0，即「永不超时」。一个只发半截请求头的客户端可以永久占住连接（Slowloris），几百个这样的连接就能耗尽文件描述符。生产必须设：`ReadHeaderTimeout: 5s`、`ReadTimeout: 30s`、`WriteTimeout: 30s`、`IdleTimeout: 120s`。**「能用」和「能扛」之间差的就是这几个超时**，而且它们不会在功能测试里暴露。\n::debug go\nhttp.HandleFunc("/ledger", handle)\nhttp.ListenAndServe("localhost:8080", nil)\n::sym 本机能访问，手机/另一台机器访问 `http://192.168.1.10:8080` 连不上，容器外也访问不了。\n::ask 为什么？正确写法是什么？这样做安全吗？\n::ans `localhost:8080` 只监听回环接口（127.0.0.1），外部流量进不来。改为 `:8080`（等价 `0.0.0.0:8080`）监听所有网卡。安全性不该靠「只绑回环」来保证——那样连家里其他设备都用不了。正确做法是绑 `0.0.0.0` + 防火墙限制来源网段，或者前面放反向代理只暴露它。**「监听地址」和「访问控制」是两件事，别用前者替代后者**。\n::transfer\n::scene 你要写一个最小可用的 `/hello`，返回统一 JSON `{"code":0,"message":"ok","data":{"msg":"hello"}}`，并保证 5 秒内 curl 能看到结果。\n::ask 写出完整代码，并说明为什么要显式设置 `Content-Type`。\n::hint 不设 Content-Type 时，浏览器/客户端会怎么猜？\n::ans \n```go\nmux := http.NewServeMux()\nmux.HandleFunc("GET /hello", func(w http.ResponseWriter, r *http.Request) {\n    w.Header().Set("Content-Type", "application/json; charset=utf-8")\n    w.WriteHeader(http.StatusOK)\n    io.WriteString(w, `{"code":0,"message":"ok","data":{"msg":"hello"}}`)\n})\nsrv := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second}\nlog.Fatal(srv.ListenAndServe())\n```\n不设 Content-Type 时 Go 会做 MIME 嗅探（`http.DetectContentType`），JSON 通常被猜成 `text/plain`，前端 `res.json()` 可能报错或需要额外处理。**`WriteHeader` 必须在写 body 之前调用**，一旦写了 body，再设状态码就无效了（会有 `superfluous WriteHeader call` 日志但被忽略）。\n::crit `curl -i` 能看到 `200` 与 `Content-Type: application/json`\n::crit server 设了至少 `ReadHeaderTimeout`，能说出不设的具体风险\n::crit 监听 `:8080` 而非 `localhost:8080`，并能解释两者差别\n::crit 知道 `WriteHeader` 之后再改状态码无效\n\n<!--day 2-->\n::pre 完成 D1；知道 JSON 的键值结构。\n::predict go\ntype Req struct {\n    Amount   int64  `json:"amount"`\n    Category string `json:"category"`\n}\nvar r Req\nerr := json.NewDecoder(req.Body).Decode(&r)\n::ask 如果客户端发的 `amount` 是字符串 `"35.5"`，会发生什么？多发一个未知字段 `"foo":"bar"` 呢？\n::ans 类型不匹配会报错：`json: cannot unmarshal string into Go struct field Req.amount of type int64`。未知字段**默认被忽略**，不报错。这个默认很危险：客户端把 `amount` 写成 `Amount`（大写），服务端拿到的就是 0，还返回 201。想严格校验可以用 `dec.DisallowUnknownFields()`，让未知字段直接报错——**在「字段名写错要立刻发现」的场景（比如内部 API）值得开**。\n::predict go\nvar r Req\ndec := json.NewDecoder(req.Body)\ndec.Decode(&r)\ndec.Decode(&r)\n::ask 第二行 Decode 会怎样？一次请求里 body 能被读几次？\n::ans 第二次 Decode 返回 `io.EOF`（body 已读完），或者如果 body 里有两个 JSON 值，会读到第二个。`r.Body` 是**一次性流**，读完就没了。所以「先 Decode 一次看结构，再 Decode 一次取数据」这种写法是错的。需要重复读就先 `io.ReadAll` 存下来（但要注意大小限制）。**`r.Body` 不能重读，这是新手最常踩的坑之一**。\n::debug go\nfunc create(w http.ResponseWriter, r *http.Request) {\n    var in CreateInput\n    if err := json.NewDecoder(r.Body).Decode(&in); err != nil {\n        http.Error(w, err.Error(), 400)\n        return\n    }\n    w.WriteHeader(201)\n}\n::sym 前端发 `{"amount": 3550, "category": "餐饮"}`，控制台报 `unexpected end of JSON input`；另一次发超大 body 直接把内存打满。\n::ask 这两个问题分别怎么修？\n::ans 第一个：如果前端用的是 `fetch` 但没设 `Content-Type: application/json`，或者 body 是空字符串，`Decode` 就会报 `EOF` / `unexpected end`。要在服务端区分「空 body」（`io.EOF` → 400 参数缺失）和「格式错」（400 JSON 格式错），错误信息不能直接把内部错误抛给用户。第二个：`r.Body` 无大小限制，用 `http.MaxBytesReader(w, r.Body, 1<<20)` 包一层（1MB），超限返回 413。**入参大小必须有上限**，否则一个请求就能把服务打挂。\n::transfer\n::scene 你要写一个统一的「读 JSON 入参」函数，供所有 handler 用。\n::ask 这个函数要处理哪几种失败？每种对应什么状态码和业务 code？写出签名。\n::hint 想想空 body、格式错、类型错、字段缺失、超大 body。\n::ans \n```go\nfunc decodeJSON[T any](w http.ResponseWriter, r *http.Request) (T, bool) {\n    var v T\n    if r.Body == nil { Fail(w, 400, "EMPTY_BODY", "请求体为空"); return v, false }\n    dec := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20))\n    dec.DisallowUnknownFields()\n    if err := dec.Decode(&v); err != nil {\n        var maxErr *http.MaxBytesError\n        switch {\n        case errors.As(err, &maxErr): Fail(w, 413, "BODY_TOO_LARGE", "请求体超过 1MB")\n        case errors.Is(err, io.EOF): Fail(w, 400, "EMPTY_BODY", "请求体为空")\n        default: Fail(w, 400, "INVALID_JSON", "请求体不是合法 JSON")\n        }\n        return v, false\n    }\n    return v, true\n}\n```\n关键是**不要 `err.Error()` 直接回给客户端**——那会泄漏内部结构（字段名、包名）。给用户看的是稳定的业务 code 和中文提示，细节进日志。泛型让每个 handler 少写 10 行。\n::crit 能说出未知字段默认被忽略的风险，并知道 `DisallowUnknownFields` 的作用\n::crit 知道 `r.Body` 一次性，不重复 Decode\n::crit 入参有 1MB 上限，超限返回 413\n::crit 错误响应不回显 `err.Error()`，用稳定的业务 code\n\n<!--day 3-->\n::pre 完成 D2；知道 REST 里 GET/POST/PUT/DELETE 的语义。\n::predict go\nmux := http.NewServeMux()\nmux.HandleFunc("GET /ledger/{id}", func(w http.ResponseWriter, r *http.Request) {\n    fmt.Fprint(w, r.PathValue("id"))\n})\n::ask 访问 `/ledger/42` 输出什么？访问 `/ledger/` 呢？访问 `/ledger/42/extra` 呢？\n::ans `/ledger/42` → `42`。`/ledger/` → 404（`{id}` 匹配一个非空段，空段不匹配）。`/ledger/42/extra` → 404（`{id}` 不跨斜杠）。Go 1.22 的模式语法里 `{id}` 只匹配单段，要匹配剩余路径用 `{rest...}`。**这是 Go 1.22 新增的能力，别再手写 `strings.Split(r.URL.Path, "/")`**——手写解析会在尾斜杠、编码字符、空段上出错。\n::predict go\nmux.HandleFunc("POST /ledger", h)\nr, _ := http.NewRequest("GET", "/ledger", nil)\n// 路由匹配结果？\n::ask GET 请求会命中这个 handler 吗？如果不命中返回什么？\n::ans 不会命中，ServeMux 返回 **405 Method Not Allowed** 并带上 `Allow: POST` 头。这是 1.22 路由的重要改进：方法不匹配是 405 而不是 404。区分这两者对排查很关键——**404 是「路径错了」，405 是「路径对了但方法错了」**，前端调错方法时能立刻看出来。\n::debug go\nmux.HandleFunc("GET /ledger/{id}", h)\n// 客户端请求 /ledger/%2Fetc%2Fpasswd\n::ask `r.PathValue("id")` 拿到的是什么？直接拼进 SQL 会怎样？\n::ans 拿到的是**解码后**的 `//etc/passwd`（`%2F` 被解码成 `/`）。如果直接拼进 SQL 就有注入风险（虽然这个例子更像路径穿越）。这里要建立两个习惯：① 路径参数**必须校验类型和范围**（`strconv.ParseInt` + `> 0`），不能直接信任；② SQL 一律用占位符 `?`，不做字符串拼接。**框架负责路由解码，不负责安全校验**。\n::transfer\n::scene 你要设计账本的 5 个路由：创建、列表、单条详情、更新、删除。\n::ask 写出完整的模式注册表，并说明每个的「成功状态码」应该是什么。\n::hint 创建 201，删除 204 还是 200？更新要不要返回资源？\n::ans \n```go\nmux.HandleFunc("POST   /api/v1/ledger",      h.Create)   // 201 + Location\nmux.HandleFunc("GET    /api/v1/ledger",      h.List)     // 200\nmux.HandleFunc("GET    /api/v1/ledger/{id}", h.Get)      // 200\nmux.HandleFunc("PATCH  /api/v1/ledger/{id}", h.Update)   // 200（返回更新后的资源）\nmux.HandleFunc("DELETE /api/v1/ledger/{id}", h.Delete)   // 204（无 body）\n```\n理由：201 表示「创建成功且资源已存在」，配 `Location: /api/v1/ledger/42` 让客户端知道去哪拿；204 表示「成功但没有响应体」，删除最适合；更新用 PATCH 而不是 PUT，因为账本只改部分字段（PUT 语义是整体替换，要求客户端把所有字段都传全）。**状态码是契约的一部分，定错就要靠文档补救**。\n::crit 能用 `{id}` 匹配单段，并知道 `{rest...}` 用于剩余路径\n::crit 知道方法不匹配返回 405 且带 `Allow` 头，能区分 404 与 405\n::crit 路径参数一律 `ParseInt` + 范围校验，不直接信任\n::crit 5 个路由的成功状态码符合 REST 语义，删除返回 204\n\n<!--day 4-->\n::pre 完成 D3；知道泛型的基本写法。\n::predict go\ntype Response[T any] struct {\n    Code    int    `json:"code"`\n    Message string `json:"message"`\n    Data    T      `json:"data"`\n}\nfunc OK[T any](w http.ResponseWriter, data T) {\n    json.NewEncoder(w).Encode(Response[T]{Code: 0, Message: "ok", Data: data})\n}\n// 调用\nOK(w, nil)\n::ask 响应里的 `data` 字段是什么？符合预期吗？\n::ans 是 `"data": null`。因为 `nil` 传给泛型 T 时 T 被推断成 `any` 之类，序列化成 null。如果前端期望「成功时 data 一定存在」，null 会引发判空。两种处理：成功但无数据时用 `struct{}{}`（序列化成 `{}`），或者让前端接受 null。**「空」在 JSON 里有三种形态：`null`、`{}`、`[]`**，选哪个要全项目统一，不能这里 null 那里 []。\n::predict go\nfunc Fail(w http.ResponseWriter, status, code int, msg string) {\n    w.WriteHeader(status)\n    json.NewEncoder(w).Encode(Response[any]{Code: code, Message: msg})\n}\n// 调用 Fail(w, 400, 1001, "参数错误")\n::ask 客户端收到什么状态码？body 里的 code 是什么？两者关系是什么？\n::ans 状态码 400，body 里 `code: 1001`。这是「双轨」设计：**HTTP 状态码表达传输层结果**（成功/客户端错/服务端错），**业务 code 表达具体原因**（1001 参数错、1002 未登录、2001 余额不足）。好处是网关/负载均衡能按状态码做通用处理（重试 5xx、不重试 4xx），客户端按 code 做精细分支。坏处是两套数字要维护，容易不一致——所以要有统一常量表。\n::debug go\nfunc Fail(w http.ResponseWriter, status, code int, msg string) {\n    json.NewEncoder(w).Encode(...)\n    w.WriteHeader(status)\n}\n::sym 客户端收到的状态码永远是 200，body 里却写着 code=1001。\n::ask 为什么？Go 的响应写入顺序规则是什么？\n::ans 因为先 Encode 写了 body，Go 在第一次写 body 时会**隐式调用 `WriteHeader(200)`**，之后再调 `WriteHeader(400)` 无效（只会打一条 `superfluous response.WriteHeader call` 日志）。所以顺序必须是：**设 Header → WriteHeader → 写 body**。这个错误不会导致编译失败，测试里如果只看 body 不看状态码也发现不了——所以测试必须断言状态码。\n::transfer\n::scene 你要给前端一份「错误码表」，覆盖账本的所有失败场景。\n::ask 设计 code 的分段规则，并给出至少 6 个具体 code（含 HTTP 状态码映射）。\n::hint 按「客户端错 / 认证 / 业务规则 / 服务端」分段。\n::ans 分段建议：`1xxx` 参数与请求、`2xxx` 认证授权、`3xxx` 业务规则、`5xxx` 服务端。示例：\n| code | HTTP | 含义 |\n| 1001 | 400 | 参数格式错误 |\n| 1002 | 404 | 资源不存在 |\n| 2001 | 401 | 未登录/token 无效 |\n| 2002 | 403 | 无权访问该资源 |\n| 3001 | 409 | 邮箱已注册 |\n| 3002 | 422 | 超出预算 |\n| 5001 | 500 | 内部错误 |\n规则：① **同一 code 永远对应同一 HTTP 状态**；② code 一旦发布不能改语义（只能新增）；③ 500 类不暴露内部细节，只给 request_id。**错误码表要作为接口文档的一部分维护**，否则前端只能靠猜字符串。\n::crit 成功/失败的响应结构共用同一顶层（code/message/data）\n::crit 知道 `WriteHeader` 必须在写 body 之前，测试会断言状态码\n::crit 空数据在 JSON 里的形态全项目统一（null / {} / []）\n::crit 有一张错误码表，code 与 HTTP 状态一一对应\n\n<!--day 5-->\n::pre 完成 D4；能写出统一信封和 5 个路由。\n::predict go\nfunc NewRouter(svc *ledger.Service) http.Handler {\n    mux := http.NewServeMux()\n    h := &Handler{svc: svc}\n    mux.HandleFunc("POST /ledger", h.Create)\n    return mux\n}\ntype Handler struct{ svc *ledger.Service }\n::ask 这个设计有什么问题？如果以后要加中间件、要测试 handler，会卡在哪？\n::ans 问题一：`Handler` 直接依赖 `*ledger.Service` 具体类型，测试时必须构造真的 Service（连带真的 Store），没法用 fake。问题二：路由和 handler 耦合在一个函数里，加中间件要改这个函数。改法：`Handler` 依赖一个**自己定义的小接口**（只含用到的方法），路由函数接受 `http.Handler` 便于包中间件。**「能不能单独测一个 handler」是检验分层是否到位的最快标准**。\n::predict go\ntype Handler struct {\n    svc *ledger.Service\n    db  *sql.DB\n}\nfunc (h *Handler) Create(w http.ResponseWriter, r *http.Request) {\n    // 直接查库做唯一性校验\n    var n int\n    h.db.QueryRow("SELECT count(*) FROM entries WHERE ...").Scan(&n)\n}\n::ask 这行代码违反了哪条分层原则？后果是什么？\n::ans 违反了「handler 不碰 SQL」。后果：① 业务规则散落在 HTTP 层，CLI 或其他入口复用时拿不到；② 测试 handler 必须有真数据库；③ 事务边界无法在 Service 层统一管理。**判断标准：把 HTTP 层整个删掉，业务逻辑还完整吗？** 如果答案是否，说明逻辑放错了层。\n::debug bash\ncurl -i -X POST localhost:8080/ledger -d \'{"amount":100}\'\n# HTTP/1.1 404 Not Found\n::ask 路由明明注册了 `POST /ledger`，为什么 404？\n::ans 三个常见原因：① 注册时写成了 `mux.HandleFunc("/ledger", ...)`（没有方法前缀，1.22 语义下这是「所有方法」但路径是精确匹配，理论上能命中）——真正的高频原因是**注册在了另一个 mux 上**（比如用了 `http.HandleFunc` 全局 mux，却把自定义 mux 传给 server）；② 路径多了前缀（`/api/v1/ledger` vs `/ledger`）；③ 服务没重启，跑的是旧二进制。排查顺序：先 `curl -v` 看实际请求行，再在注册处打日志确认 mux 被用了，最后看进程启动时间。**404 先怀疑「请求没到你以为的那个 mux」**。\n::transfer\n::scene 你要在阶段三结束时交出一个「API 骨架」，所有接口返回假数据但契约完整。\n::ask 列出这个骨架必须包含的东西（至少 6 项），并说明为什么先做骨架而不是先做功能。\n::hint 想想前端什么时候能开始联调。\n::ans ① 5 个路由全部注册、返回正确的状态码与信封；② 请求/响应的 DTO 类型定义（字段名、单位、可空性）；③ 错误码表与统一 `Fail`；④ 一个 `GET /healthz`；⑤ 至少一个真实实现的接口（比如 List 返回空数组）；⑥ 一份 `curl` 示例或 OpenAPI 片段。先做骨架的理由：**前端可以立刻开始对接，接口形状的争议在写业务前暴露**。等业务写完再改字段名，前端要返工一遍。骨架日的产出不是「能用的功能」，是「不会再变的契约」。\n::crit 5 个路由都能被 curl 命中，状态码正确\n::crit Handler 依赖接口而非具体 Service，能单独用 fake 测试\n::crit handler 里搜不到 `sql.` / `db.Query`\n::crit 骨架日结束时，接口字段与错误码已定稿，前端可开始联调\n\n<!--day 6-->\n::pre 完成 D5：路由与信封可用。\n::predict go\ntype CreateInput struct {\n    Amount   int64  `json:"amount"`\n    Category string `json:"category"`\n    Date     string `json:"date"`\n}\nfunc (in CreateInput) Validate() error {\n    if in.Amount <= 0 { return errors.New("金额必须大于 0") }\n    return nil\n}\n// 客户端传 amount: -100\n::ask 只校验 `> 0` 够吗？还有哪些必须校验的？\n::ans 不够。至少还要：① 金额上限（防止误输入 999999999 撑爆统计，比如 ≤ 100 万分 = 1 万元）；② 分类非空且在允许集合内；③ 日期能被 `time.Parse("2006-01-02")` 解析且不在未来（家庭账本记未来账无意义）；④ 备注长度按 rune 限制。**校验的原则是「凡是能在这里挡住的脏数据，绝不留给数据库或前端」**，但也不要过度（比如校验分类必须是某个枚举，会让用户无法自定义）。\n::predict go\nfunc (h *Handler) Create(w http.ResponseWriter, r *http.Request) {\n    in, ok := decodeJSON[CreateInput](w, r)\n    if !ok { return }\n    id, err := h.svc.Create(r.Context(), in)\n    if err != nil {\n        Fail(w, 500, 5001, "创建失败")\n        return\n    }\n    OK(w, map[string]int64{"id": id})\n}\n::ask 这里把所有错误都当 500，会有什么问题？\n::ans 会把「用户参数错」报成「服务器错」。具体后果：① 前端无法区分「我填错了」和「服务挂了」，只能统一提示「稍后再试」；② 监控上 5xx 报警会被用户输入错误刷爆，真正的故障被淹没；③ 网关可能对 5xx 做重试，而参数错误重试一万次也没用。正确做法是 `errors.Is/As` 分类：`ErrValidation` → 400、`ErrConflict` → 409、其他 → 500。**错误映射是 API 质量的分水岭**。\n::debug bash\ncurl -X POST localhost:8080/ledger -H \'Content-Type: application/json\' \\\n  -d \'{"amount":3550,"category":"餐饮","date":"2026-10-19"}\'\n# {"code":0,"message":"ok","data":{"id":0}}\n::ask 创建成功了，但 id 是 0。可能的原因？\n::ans ① SQLite 的 `LastInsertId()` 拿的是 `Result` 的返回值，如果用的是 `INSERT ... ON CONFLICT DO NOTHING` 且实际没插入，LastInsertId 返回上一次的或 0；② 代码里 `id, _ := res.LastInsertId()` 忽略了 error；③ 更常见：**返回的是结构体里没赋值的字段**（比如 `Entry{ID: ...}` 忘了填）。排查：直接 `sqlite3 db \'select max(id) from entries\'` 对比。**「写成功了但 id 是 0」几乎总是「返回值没取对」，不是数据库问题**。\n::transfer\n::scene 用户连点两次「保存」，产生两条一模一样的账目。\n::ask 三种处理方案的优缺点，你会选哪个？为什么？\n::hint 前端禁用、幂等键、允许重复后删除。\n::ans ① **前端禁用按钮**：成本最低，但刷新页面、网络重发、多标签页都挡不住，只能减少概率；② **Idempotency-Key**：客户端生成 UUID 放 header，服务端存 key→结果，重复请求返回首次结果。可靠但有存储成本，且要处理 key 过期；③ **数据库唯一约束**（同一用户+日期+金额+分类+备注）→ 409：最简单可靠，但会误伤「真的同一天买了两杯一样的咖啡」。家庭账本选 ③ 的宽松版：允许重复，但在列表里标「疑似重复」，让用户自己删。**关键不是选哪个，而是明确写下「我们接受哪种重复」**。\n::crit 创建接口覆盖金额、分类、日期、备注四类校验，且错误码区分\n::crit 错误按类型映射状态码，不会全部 500\n::crit 创建成功返回的 id 非零，且能被 `GET /ledger/{id}` 查到\n::crit 对「重复提交」有明确选择，并写进注释或文档\n\n<!--day 7-->\n::pre 完成 D6：能创建、能按 id 查。\n::predict go\n// GET /ledger?limit=20&offset=0\nlimit := 20\noffset := 0\nif v := r.URL.Query().Get("limit"); v != "" {\n    limit, _ = strconv.Atoi(v)\n}\nrows, _ := db.Query("SELECT ... LIMIT ? OFFSET ?", limit, offset)\n::ask 如果客户端传 `limit=abc` 或 `limit=-5`，会发生什么？\n::ans `Atoi` 报错被忽略，`limit` 变成 0，SQL 变成 `LIMIT 0` → 返回空列表，客户端以为「没数据」。`limit=-5` 在 SQLite 里 `LIMIT -5` 表示「不限条数」，直接返回全表——**一个负参数就能把整库拉出来**。必须显式校验：`if limit <= 0 || limit > 100 { limit = 20 }`。**分页参数不做上下界校验，是性能事故的常见入口**。\n::predict go\ntype ListResp struct {\n    Items  []Entry `json:"items"`\n    Total  int64   `json:"total"`\n    Limit  int     `json:"limit"`\n    Offset int     `json:"offset"`\n}\nvar items []Entry   // 没有 make\n// 查询无结果\njson.NewEncoder(w).Encode(ListResp{Items: items, ...})\n::ask 响应里的 `items` 是什么？前端 `data.items.map(...)` 会怎样？\n::ans `"items": null`，前端 `null.map` 直接抛 `TypeError`。修法：`items := make([]Entry, 0, limit)`，或者用 `Items []Entry` 但初始化。**「空列表必须是 `[]` 不是 `null`」是 API 契约的一部分**，前后端都要约定清楚。这类问题在数据为空时才会暴露，联调初期经常被忽略，上线后「新用户打开页面白屏」。\n::debug sql\nSELECT * FROM entries ORDER BY date DESC LIMIT 20 OFFSET 40\n::ask 翻到第 3 页时，如果这期间用户新增了一条今天的账目，会出现什么现象？\n::ans 会出现**重复或漏项**：新增的记录排在最前（date DESC），原来第 1 页的第 20 条被挤到第 2 页，而第 2 页已经读过了，于是第 3 页开头会重复出现一条已看过的记录（或反之漏掉一条）。这不是 bug，是 offset 分页的固有语义：**「第 N 页」在数据变化时不是稳定快照**。账本场景用户通常能接受，但如果你要做「无限滚动」，必须换游标分页（`WHERE (date, id) < (?, ?)`）。\n::transfer\n::scene 你要实现 `GET /ledger?month=2026-10&limit=20&offset=0`，返回该月分页。\n::ask 写出查询 SQL 与参数校验逻辑，并说明为什么 `total` 要单独查一次。\n::hint 一条 SQL 能不能同时拿到「当前页」和「总数」？\n::ans \n```go\n// 校验\nif limit <= 0 || limit > 100 { limit = 20 }\nif offset < 0 { offset = 0 }\nif _, err := time.Parse("2006-01", month); err != nil { return 400 }\n\n// 两条 SQL\nvar total int64\ndb.QueryRowContext(ctx, `SELECT COUNT(*) FROM entries WHERE user_id=? AND date>=? AND date<?`, uid, start, end).Scan(&total)\nrows, err := db.QueryContext(ctx, `SELECT id,amount,category,date,note FROM entries\n    WHERE user_id=? AND date>=? AND date<? ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`,\n    uid, start, end, limit, offset)\n```\n`total` 必须单独查：`LIMIT` 会截断结果集，`COUNT(*)` 需要的是全量。虽然可以 `COUNT(*) OVER()` 窗口函数一次拿到，但 SQLite 支持有限、且会拖慢分页查询——**两条简单查询比一条复杂查询更好维护**。注意 `ORDER BY` 必须有唯一列（`id`）兜底，否则同一天多条记录的页边界会抖动。\n::crit limit 有上下界（1-100），offset 非负，非法值有默认而非报错\n::crit 空结果返回 `[]` 而非 `null`\n::crit 月份参数校验格式，SQL 用半开区间不用 LIKE\n::crit `ORDER BY` 带唯一列兜底，能解释 offset 分页在数据变动时的重复/漏项\n\n<!--day 8-->\n::pre 完成 D7：列表能分页。\n::predict go\n// offset=1000, limit=20, 表里有 10 万条\n// SQLite 如何执行 OFFSET？\n::ask OFFSET 1000 是「直接跳到第 1000 条」还是「先读再丢」？复杂度是多少？\n::ans 是**先读再丢**：数据库要扫描并跳过前 1000 行，才能返回第 1001-1020 行。成本 O(offset)，随页深线性增长。这就是「深分页慢」的本质——不是索引没建，是 OFFSET 的语义决定的。优化方向是**游标分页**（keyset）：`WHERE (date, id) < (?, ?) ORDER BY date DESC, id DESC LIMIT 20`，利用索引直接定位起点，复杂度 O(1)（相对页深）。\n::predict sql\nSELECT * FROM entries ORDER BY date DESC LIMIT 20 OFFSET 999980;\n::ask 在 100 万行的表上，这条查询大概多久？为什么？\n::ans 可能要几百毫秒到几秒。它要扫描近 100 万行并丢弃，再取 20 行——**读的数据量和「取多少」无关，和「跳过多少」有关**。这也是为什么「最后一页」总是最慢的。如果业务允许，改成「按时间倒序 + 游标」后，无论翻多深都是毫秒级。\n::debug sql\nSELECT COUNT(*) FROM entries WHERE user_id = 1;\n-- 12 万行，耗时 400ms\n-- 而分页查询本身只要 3ms\n::ask 为什么 count 比分页查询还慢？三种优化选择是什么？\n::ans `COUNT(*)` 要遍历全部匹配行（即使有索引，也要走完整个索引区间），而分页查询只取 20 行就停。选择：① **保留 count**，接受成本（家庭账本 12 万行 400ms 可以接受，但要注意别每页都查）；② **只在第一页返回 total**，后续页返回 `-1` 或省略，前端不再显示总页数；③ **近似值**：`SELECT MAX(rowid) FROM entries` 或用 `EXPLAIN QUERY PLAN` 的估算行数，不精确但 O(1)。**知道「total 很贵」比背「要用游标分页」更实用**。\n::transfer\n::scene 你要给列表接口预留游标分页能力，但暂时不实现。\n::ask 接口参数和响应要怎么设计，才能「现在用 offset，以后换 cursor 不改契约」？\n::hint 响应里加一个字段，客户端「有就用，没有就回退 offset」。\n::ans 请求：`?limit=20&offset=0&cursor=`（cursor 为空则用 offset）。响应：`{items, total, limit, offset, next_cursor}`。规则写进文档：**`next_cursor` 非空时，客户端应优先用它请求下一页；为空表示没有更多**。服务端实现可以先只填 `next_cursor: null`，等真正切换时再填值，客户端代码不用改。**向前兼容的关键是「现在就多返回一个字段」**，而不是等换实现时再改契约。\n::crit 能说出 OFFSET 的成本是 O(offset)，不是 O(limit)\n::crit 知道深分页慢的根因，能写出 keyset 分页的 WHERE 条件\n::crit 知道 `COUNT(*)` 可能比分页查询贵，能说出三种取舍\n::crit 响应里预留了 `next_cursor` 字段，文档写明优先级规则\n\n<!--day 9-->\n::pre 完成 D7-D8；Store 接口已定义。\n::predict go\ntype Store interface {\n    Create(ctx context.Context, e Entry) (int64, error)\n}\n// 内存实现\nfunc (s *memStore) Create(ctx context.Context, e Entry) (int64, error) {\n    s.nextID++\n    e.ID = s.nextID\n    s.items = append(s.items, e)   // 存的是副本\n    return e.ID, nil\n}\n// SQLite 实现\nfunc (s *sqlStore) Create(ctx context.Context, e Entry) (int64, error) {\n    res, err := s.db.ExecContext(ctx, "INSERT ...", e.Amount, ...)\n    return res.LastInsertId()\n}\n::ask 两个实现的行为完全一致吗？有哪几处可能不同？\n::ans 至少四处：① **ID 起点**：内存从 1 开始，SQLite 的 rowid 也是 1，但删除后行为不同（SQLite 可能复用，`AUTOINCREMENT` 才不复用）；② **时间精度**：内存存 time.Time，SQLite 存字符串，精度可能从纳秒降到秒；③ **排序**：内存按插入顺序，SQLite 按 `ORDER BY`；④ **空值**：内存零值是 `""`，SQLite 可能是 NULL。**「换实现时行为不变」是接口的核心承诺**，但语言层面无法强制——只能靠同一套测试跑两个实现来验证。\n::predict go\n// 内存实现测试通过，切到 SQLite 后这个测试挂了\nif got[0].ID != 1 { t.Fatal("id 应为 1") }\n::ask 这个测试有什么问题？\n::ans 它断言了「实现细节」而不是「行为契约」。ID 从几开始是实现的自由，测它等于把测试绑死在某个实现上。应该断言「创建后能用返回的 id 查到同一条记录」——这是行为，两个实现都该满足。**测试要针对契约写，才能一套测试跑所有实现**（这也是「面向接口编程」在测试上的直接收益）。\n::debug bash\ngo test ./...        # 全绿（用的是内存实现）\n# 部署到真实环境后\nsqlite3 ledger.db \'select count(*) from entries\'   # 0\n# 但接口返回 200\n::ask 为什么测试全绿，线上却没数据？\n::ans 最可能：`main` 里注入的还是内存实现（比如切换代码写了但没启用，或环境变量判断反了）。其次是**事务没提交**（D12 讲过的形态），或者写到了另一个数据库文件（相对路径 + 不同 CWD）。系统性的防法是：**启动时打一条日志，明确写出「使用哪个 Store 实现 + 数据库文件绝对路径」**，让「连错库」变成一眼可见的事实，而不是靠猜。\n::transfer\n::scene 你要把内存实现换成 SQLite，同时保证所有已有测试仍然通过。\n::ask 步骤是什么？哪一步最容易漏？\n::hint 先写测试还是先换实现？\n::ans 步骤：① 先把「跑在内存实现上的测试」整理成表驱动，确保覆盖 Create/List/Sum 的主路径与边界；② 为 SQLite 实现加一个 `newTestStore(t)`，用 `file::memory:?cache=shared` 或临时文件；③ **用同一组测试函数跑两个实现**（`for name, factory := range map[string]func() Store{...}`）；④ 切换 main 的注入。最容易漏的是 ③——大多数人换完实现只跑原来的测试，而原测试只覆盖内存实现，等于没验证 SQLite。**「同一套契约测试跑所有实现」是把重构风险降到最低的手段**。\n::crit 内存与 SQLite 两个实现跑同一套契约测试，全部通过\n::crit 测试断言行为（能查回来）而不是实现细节（ID 从 1 开始）\n::crit 启动日志明确输出「Store 实现 + 数据库绝对路径」\n::crit 切换实现时 `main` 只改装配那几行，Service 与 Handler 零改动\n\n<!--day 10-->\n::pre 完成 D9：SQLite 实现可用。\n::predict bash\n./ledger-api &\ncurl -X POST localhost:8080/ledger -d \'{"amount":100,...}\'\nkill %1\n./ledger-api &\ncurl localhost:8080/ledger\n::ask 重启后能查到刚才那条吗？如果查不到，最可能的原因是什么？\n::ans 正常情况下能查到——数据在 SQLite 文件里，与进程无关。查不到的三个高频原因：① **DSN 是相对路径**，两次启动的 CWD 不同，写到了两个文件；② **事务没提交**（`Begin` 后忘了 `Commit`），进程退出时回滚；③ **用的是内存实现**（`file::memory:` 或进程内 map），重启即丢。**「重启不丢」是区分「真持久化」和「假持久化」的唯一标准**，也是阶段三的硬验收。\n::predict bash\nsqlite3 ledger.db \'.tables\'\n# entries\nls -l ledger.db*\n# ledger.db  ledger.db-wal  ledger.db-shm\n::ask 如果只备份 `ledger.db`，会丢数据吗？\n::ans 会。开了 WAL 之后，最新的写入先落在 `ledger.db-wal`，满足条件才 checkpoint 回主库。只拷主文件可能丢掉最近的事务。正确备份：`sqlite3 ledger.db ".backup \'backup.db\'"`（在线一致性备份），或者停服务后三个文件一起拷。**「备份了一个文件」和「备份了数据库」不是一回事**，这个差异只有在恢复时才会暴露——那时已经晚了。\n::debug bash\n# 服务跑在容器里，数据目录挂载为 /data\ndocker run -v $(pwd)/data:/data myapp\n# 重启容器后数据没了\n::ask 三个可能原因？\n::ans ① **挂载路径与 DSN 不一致**：DSN 写的是 `ledger.db`（相对 CWD，容器内是 `/app`），而挂载在 `/data`，数据写进了容器层，随容器删除而消失；② **挂载的是文件而不是目录**，宿主机文件不存在时 Docker 会创建一个空目录，SQLite 打不开；③ **以非 root 运行但挂载目录属主是 root**，写入失败（错误信息是 `readonly database`，容易误判）。排查：进容器 `ls -l /data` 看文件在不在，`os.Getwd()` 打日志看 CWD。**「数据丢了」先查「写到哪去了」，不要先怀疑数据库**。\n::transfer\n::scene 你要写一个「重启不丢」的自动化验收。\n::ask 脚本怎么写才能证明「数据真的在磁盘上」，而不是被进程内缓存骗了？\n::hint 关键是「杀掉进程」而不是「重启 handler」。\n::ans \n```bash\nDB=$(mktemp -d)/ledger.db\n./ledger-api -db "$DB" & PID=$!\nsleep 0.5\ncurl -fsS -X POST localhost:8080/ledger -H \'Content-Type: application/json\' \\\n  -d \'{"amount":3550,"category":"餐饮","date":"2026-10-19"}\' > /dev/null\nkill -TERM $PID; wait $PID            # 真杀进程，触发优雅关闭\n./ledger-api -db "$DB" & PID=$!\nsleep 0.5\nCOUNT=$(sqlite3 "$DB" \'select count(*) from entries\')\n[ "$COUNT" = "1" ] || { echo "重启后数据丢失"; kill $PID; exit 1; }\ncurl -fsS localhost:8080/ledger | grep -q 3550 || { echo "API 读不到"; exit 1; }\nkill -TERM $PID; wait $PID\n```\n两个关键点：**杀进程**（不是重启 handler，那验证不了持久化）、**直接查库 + 走 API 双向验证**（只查库证明写进去了，只查 API 可能读到缓存）。用 `mktemp -d` 保证每次从空库开始。\n::crit 杀掉进程重启后，数据仍能通过 API 查到\n::crit DSN 用绝对路径，能说出相对路径在容器/不同 CWD 下的风险\n::crit 知道 WAL 下要备份三个文件或用 `.backup`，不只拷主库\n::crit 验收脚本真的 kill 了进程，且从空库开始跑\n\n<!--day 11-->\n::pre 完成 D9-D10；列表与创建都通。\n::predict go\nidStr := r.PathValue("id")\nid, _ := strconv.ParseInt(idStr, 10, 64)\nrow := db.QueryRowContext(ctx, "SELECT ... WHERE id = ?", id)\nvar e Entry\nerr := row.Scan(&e.ID, &e.Amount, ...)\nif err != nil {\n    Fail(w, 500, 5001, "查询失败")\n    return\n}\n::ask 查不到记录时返回什么？合理吗？\n::ans 返回 500。`Scan` 在无结果时返回 `sql.ErrNoRows`，这里没区分就直接当 500 了。正确做法：`if errors.Is(err, sql.ErrNoRows) { Fail(w, 404, 1002, "账目不存在") }`。**`ErrNoRows` 是正常业务分支，不是异常**——「不存在」和「数据库坏了」必须分开，否则监控会被正常请求刷出 5xx。\n::predict go\n// GET /ledger/0 和 GET /ledger/-1\n::ask 这两个请求应该返回什么？直接查库会怎样？\n::ans 都应该返回 400（参数非法）。`id=0` 查库返回无结果（如果 id 从 1 开始），`id=-1` 也查不到——技术上「能用」，但语义上「0 和负数不是合法 ID」。直接在 handler 入口挡掉更省一次查询，也避免把负数传进 SQL（某些数据库对负数索引有奇怪行为）。**「语法合法但业务非法」的参数，应该在边界一刀切掉**。\n::debug go\nfunc (h *Handler) Get(w http.ResponseWriter, r *http.Request) {\n    id, _ := strconv.ParseInt(r.PathValue("id"), 10, 64)\n    e, err := h.svc.Get(r.Context(), id)\n    if err != nil {\n        Fail(w, 404, 1002, "账目不存在")   // 所有错误都 404\n        return\n    }\n    OK(w, e)\n}\n::ask 这里把「所有错误」都当 404，会掩盖什么？\n::ans 掩盖了真正的服务端故障：数据库连接断了、SQL 写错了、超时了，客户端全都收到「账目不存在」，于是用户以为记录被删了，运维也看不到 5xx 报警。正确做法：Service 层用 `ErrNotFound` 哨兵区分「查不到」，其他错误原样包装上抛，handler 里 `errors.Is` 判断后分别映射 404 / 500。**「404 兜一切」是短期省事、长期最贵的写法**。\n::transfer\n::scene 账本要支持「软删除」（`deleted_at` 字段），删除后 `GET` 应返回 404，但管理员能恢复。\n::ask 查询要加什么条件？最容易漏的地方是哪？\n::ans 所有面向普通用户的查询都要加 `deleted_at IS NULL`：`Get`、`List`、`Sum`、`Export`——**四处以上，漏一处就会把已删数据暴露出来**。容易漏的是聚合查询（`SUM` 会把已删的算进去）和「唯一性校验」（已删的记录占着唯一键，导致无法重新创建）。更好的做法是用 GORM 的软删除（自动加条件）或数据库视图，把「过滤」变成默认行为而不是每次记得写。**如果一个规则需要在 N 个地方重复，就应该把它下沉到一层**。\n::crit `id` 非正整数返回 400，不查库\n::crit `ErrNoRows` 映射为 404，其他错误映射 500，不混用\n::crit 能说出软删除会影响到的全部查询点（含聚合与唯一性校验）\n::crit 单条详情响应不含内部字段（如 `deleted_at`），除非明确需要\n\n<!--day 12-->\n::pre 完成 D11；会用 `GROUP BY`。\n::predict sql\nSELECT category, SUM(amount) AS total\nFROM entries\nWHERE user_id = ? AND date LIKE ?\nGROUP BY category\n::ask 这个查询的结果里，如果某分类一条记录都没有，会出现吗？\n::ans 不会。`GROUP BY` 只对**存在的行**分组，没有行就没有组。如果前端期望「10 个分类都显示，没有的显示 0」，服务端必须补零：要么在应用层用分类表左连接，要么把分类列表和结果做 merge。**「没有数据」和「数据为 0」在 SQL 里是两件事**，前端图表经常因此少几根柱子。\n::predict go\nrows, err := db.QueryContext(ctx, `SELECT category, SUM(amount) FROM entries\n    WHERE date LIKE ? GROUP BY category`, month+"%")\nfor rows.Next() {\n    var c string\n    var total int64\n    rows.Scan(&c, &total)\n    m[c] = total\n}\n::ask 这段有两个问题，分别是什么？\n::ans ① `rows.Scan` 的 error 被忽略，NULL 或类型不符时静默失败；② `defer rows.Close()` 没有（虽然这里读完了会自动关，但出错提前 return 时不会）；③ `SUM` 在空组不会出现，但**如果 category 是 NULL，`Scan` 进 string 会报错**——要用 `sql.NullString` 或 `COALESCE(category,\'未分类\')`。**聚合查询里 `SUM` 返回 NULL 是常态**（空集或全 NULL），`COALESCE(SUM(amount),0)` 是标配。\n::debug bash\ncurl \'localhost:8080/summary?month=2026-10\'\n# {"data":{"total":0,"by_category":[]}}\n# 但数据库里明明有 5 条 10 月的记录\n::ask 三个可能原因？\n::ans ① **月份格式**：库里 `date` 是 `2026-10-19`，但查询用了 `LIKE \'2026-10\'`（少了 `%`），匹配不上；② **user_id 不对**：鉴权还没做，用了 `user_id=0` 或某个默认值；③ **时区/日期截断**：写入时 `time.Now().Format(...)` 用的 UTC，本地 10 月 1 日凌晨的记录变成 9 月 30 日。排查方式：`sqlite3 db "select date from entries limit 5"` 看真实存储值，再手写同样条件的 SQL 跑一遍。**「统计为 0」先怀疑 WHERE 条件，不要怀疑聚合函数**。\n::transfer\n::scene 你要返回「月度总额 + 按分类小计 + 笔数」，且前端图表需要全部分类（没有的补 0）。\n::ask 用一条 SQL 还是多条？怎么补零？\n::hint 想想分类表是否独立存在。\n::ans 用两条：① `SELECT category, SUM(amount) total, COUNT(*) cnt FROM entries WHERE ... GROUP BY category`；② `SELECT name FROM categories WHERE user_id=?` 拿全部分类，然后在应用层 merge，缺失的填 0。一条 SQL 做左连接也可以：`categories LEFT JOIN (聚合子查询)`，但 SQLite 的写法较啰嗦、且分类表为空时行为要额外处理。**「补零」是展示逻辑，放在应用层比塞进 SQL 更好维护**——SQL 只负责「有什么」，展示层负责「缺什么」。\n::crit `SUM` 用 `COALESCE` 兜底，空月份返回 0 而非报错\n::crit 月份用半开区间，`date` 存储格式统一为 `YYYY-MM-DD`\n::crit 分类小计能补零，前端拿到全部分类\n::crit 统计接口返回笔数，而不只是金额\n\n<!--day 13-->\n::pre 完成 D1-D12；知道 `http.Handler` 是接口。\n::predict go\nfunc logging(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        log.Println("before")\n        next.ServeHTTP(w, r)\n        log.Println("after")\n    })\n}\nmux.Handle("/ledger", logging(http.HandlerFunc(h.List)))\n::ask `next.ServeHTTP` 前后各打一条日志，能覆盖所有情况吗？\n::ans 不能。如果 `h.List` 里 panic，`after` 不会打印（除非 recover）；如果中间调用了 `w.WriteHeader` 后 handler 又提前 return，`after` 仍会打印但你可能读不到状态码（因为 `ResponseWriter` 没包装，拿不到已写状态）。中间件的正确姿势是**包一层 `ResponseWriter` 记录状态码和字节数**，并在 defer 里写日志，这样 panic 也能记录。\n::predict go\nmux := http.NewServeMux()\nmux.HandleFunc("/ledger", h.List)\nhandler := logging(mux)\nsrv := &http.Server{Handler: handler}\n::ask 如果 `logging` 只包了某个路由，会有什么问题？\n::ans 只包单路由时，未注册的路径（404）、其他路由都不会经过它，日志里看不到 404 请求——而这恰恰是最需要排查的流量（扫描器、前端拼错路径）。**中间件应该包住整个 mux**，而不是逐个路由挂。同理，CSRF、限流、CORS 都应该在最外层包整个路由器，否则总有路径漏掉。\n::debug go\ntype respWriter struct {\n    http.ResponseWriter\n    status int\n}\nfunc (w *respWriter) WriteHeader(code int) {\n    w.status = code\n    w.ResponseWriter.WriteHeader(code)\n}\n// middleware\nrw := &respWriter{ResponseWriter: w}\nnext.ServeHTTP(rw, r)\nlog.Println(rw.status)   // 期望 200，实际 0\n::ask 为什么 status 是 0？\n::ans 因为 handler 如果**没有显式调用 `WriteHeader`**（直接 `w.Write(...)`），Go 会隐式写 200，但走的是内嵌 `ResponseWriter` 的方法（不是你的包装类型的方法），所以 `rw.status` 一直是 0。修法：在包装类型的 `Write` 方法里也记录状态（写 body 时如果 status 为 0 就设成 200）：\n```go\nfunc (w *respWriter) Write(b []byte) (int, error) {\n    if w.status == 0 { w.status = http.StatusOK }\n    return w.ResponseWriter.Write(b)\n}\n```\n**这是「包装 ResponseWriter」最经典的一个坑**，只重写 `WriteHeader` 是不够的。\n::transfer\n::scene 你要按顺序挂 `Recovery → 日志 → 鉴权` 三个中间件。\n::ask 从外到内还是从内到外？写出组装代码并说明理由。\n::hint 哪个必须最先执行？panic 发生在鉴权里怎么办？\n::ans 组装：`handler := Recovery(Logging(Auth(mux)))`——**写在前面的在最外层**。理由：Recovery 必须在最外层，才能捕获包括 Logging、Auth 在内的所有 panic；Logging 在 Auth 外层，才能记录「被鉴权拒绝的请求」（401 也要有日志）；Auth 在内层，只对合法请求做校验。如果顺序反了（Auth 在外），未登录请求的 panic 就没人兜；如果 Recovery 在内，Logging 里的 panic 会杀进程。**中间件顺序 = 责任链，想清楚「谁要看到谁的失败」**。\n::crit 中间件包住整个 mux，不是逐路由挂\n::crit 包装 `ResponseWriter` 时同时重写 `WriteHeader` 和 `Write`\n::crit 能用 `defer` 在 panic 时也记录日志\n::crit 中间件顺序有明确理由（Recovery 最外、Logging 次之、Auth 最内）\n\n<!--day 14-->\n::pre 完成 D13；会用中间件。\n::predict go\nstart := time.Now()\nnext.ServeHTTP(w, r)\nlog.Printf("%s %s %d %v", r.Method, r.URL.Path, status, time.Since(start))\n::ask 这条日志在高并发下会有什么问题？还缺什么关键信息？\n::ans 问题一：**多条日志会交错**，`log.Printf` 单条是原子的，但多行输出（比如 panic 栈）会混在一起，无法归属到某个请求。问题二：缺 **request ID**——同一个请求的多条日志（进入、SQL、错误）无法串起来，排查时只能靠时间戳猜。问题三：`r.URL.Path` 不含 query，查「哪个参数导致的错误」时信息不足（但也要注意别把敏感参数打进日志）。修法：用 `log/slog` 结构化输出 + 请求开始生成 `request_id` 放进 context。\n::predict go\n// request ID 中间件\nid := r.Header.Get("X-Request-ID")\nif id == "" { id = uuid.NewString() }\nctx := context.WithValue(r.Context(), reqIDKey, id)\nnext.ServeHTTP(w, r.WithContext(ctx))\n::ask 这个写法有两个隐患，分别是什么？\n::ans ① **无条件信任客户端传的 `X-Request-ID`**：恶意客户端可以传相同的 ID 制造日志混淆，或传超长字符串撑爆日志。应该校验格式（如 UUID/长度 ≤ 64），不合法就重新生成。② **`context.WithValue` 的 key 必须是非导出类型**：如果 key 是 string，不同包可能用同一个字符串 key 互相覆盖。要用 `type ctxKey int; const reqIDKey ctxKey = 1`。**「用 string 当 context key」是 Go 里明确反对的做法**。\n::debug bash\n# 日志里看到\n2026-10-19 10:00:01 POST /ledger 500 12ms\n2026-10-19 10:00:01 GET /ledger 200 3ms\n# 但错误响应里给的 request_id 是 abc-123\n# 日志里搜 abc-123：没有\n::ask 为什么搜不到？问题出在哪？\n::ans 说明**错误响应里的 request_id 和日志里记录的不是同一个来源**。常见原因：响应里用的是 handler 里现生成的 UUID，日志里用的是中间件生成的另一个；或者日志里压根没打 request_id 字段。修法：中间件生成一次，放进 `context`，**handler、Service、日志全部从 context 取同一个值**；错误响应也从 context 取。**request_id 的价值在于「唯一且一致」**，两处各生成一个就等于没有。\n::transfer\n::scene 你要定义一套日志字段规范，让「按 request_id 串起一次请求」成为可能。\n::ask 列出必备字段，并说明哪些字段绝对不能打。\n::hint 想想排查一个 500 需要哪些信息，以及哪些会泄漏隐私。\n::ans 必备：`ts`（时间）、`level`、`request_id`、`method`、`path`（不含 query 敏感项）、`status`、`duration_ms`、`user_id`（已鉴权时）、`error`（错误摘要）、`bytes`。可选：`client_ip`（注意合规）、`user_agent`。**绝对不能打**：`Authorization` 头、密码、`Set-Cookie`、完整请求体（可能含金额/备注等隐私）、SQL 参数原值（用占位符数量代替）。**日志是排障工具，不是数据副本**——把用户账目明细打进日志，等于凭空造了一个不受管控的数据库。\n::crit 每条请求日志都有 request_id，且响应体里的 ID 与日志一致\n::crit 日志用结构化格式（slog/zap），字段名统一\n::crit 不信任客户端传入的 request ID，做了格式与长度校验\n::crit context key 用自定义类型，不用裸 string\n\n<!--day 15-->\n::pre 完成 D13-D14；有日志与中间件基础。\n::predict go\nfunc (h *Handler) Create(w http.ResponseWriter, r *http.Request) {\n    in, ok := decodeJSON[CreateInput](w, r)\n    if !ok { return }\n    if err := in.Validate(); err != nil {\n        Fail(w, 400, 1001, err.Error())\n        return\n    }\n    ...\n}\n::ask 这种「每个 handler 自己写 if err → Fail」的模式，随着接口变多会怎样？\n::ans 会重复几十遍同样的映射逻辑，且容易出现「这个接口 400、那个接口 422」的不一致。更好的做法是**让 handler 只返回 error，由统一中间件转换**：handler 签名变成 `func(w, r) error`，外面套一层 `errorMapper`，用 `errors.As` 判断错误类型并映射状态码。这样「参数错 → 400」只定义一次，所有接口行为一致。**重复的错误映射是 bug 的温床**。\n::predict go\ntype ValidationError struct{ Field, Msg string }\nfunc (e *ValidationError) Error() string { return e.Msg }\n// 中间件里\nvar ve *ValidationError\nif errors.As(err, &ve) {\n    Fail(w, 400, 1001, ve.Msg)\n}\n::ask `errors.As` 的第二个参数为什么必须是指向指针的指针？\n::ans 因为 `errors.As` 需要**把找到的错误值写回给你**，所以传的是「存放指针的变量的地址」。`&ve` 里 `ve` 是 `*ValidationError`，`&ve` 是 `**ValidationError`。如果传 `ve`（nil 指针），As 无法写入，会 panic：`errors: target must be a non-nil pointer`。记忆方法：**`Is` 判等用值，`As` 取值用地址**。\n::debug go\nfunc writeError(w http.ResponseWriter, err error) {\n    switch err.(type) {          // 类型断言\n    case *ValidationError:\n        Fail(w, 400, 1001, err.Error())\n    case *NotFoundError:\n        Fail(w, 404, 1002, err.Error())\n    default:\n        Fail(w, 500, 5001, "内部错误")\n    }\n}\n// 但 err 是 fmt.Errorf("create: %w", &ValidationError{...})\n::ask 这个 switch 会命中 ValidationError 吗？\n::ans 不会，会走到 default → 500。因为 `err.(type)` 只看**最外层类型**，而最外层是 `*fmt.wrapError`。必须用 `errors.As(err, &ve)` 沿链查找。**只要项目里用了 `%w` 包装（应该用），类型断言就不能用于错误分类**，这是 `errors.As` 存在的唯一理由。\n::transfer\n::scene 定义完整的错误类型体系，覆盖参数、未找到、冲突、未授权、内部错误。\n::ask 每种用什么形式（哨兵/自定义类型/包装）？给出定义与映射表。\n::hint 需要携带字段信息的用类型，只需要判等的用哨兵。\n::ans \n```go\nvar (\n    ErrNotFound  = errors.New("not found")\n    ErrForbidden = errors.New("forbidden")\n    ErrConflict  = errors.New("conflict")\n)\ntype ValidationError struct{ Field, Msg string }\nfunc (e *ValidationError) Error() string { return e.Field + ": " + e.Msg }\n```\n映射：`ValidationError` → 400/1001（`errors.As`）；`ErrNotFound` → 404/1002（`errors.Is`）；`ErrForbidden` → 403/2002；`ErrConflict` → 409/3001；其他 → 500/5001 且只回 request_id。Service 层只管返回语义错误，**不 import `net/http`**——这一条能验证分层是否干净。包装时用 `%w` 保留链。\n::crit handler 只返回 error，状态码映射集中在一处\n::crit 错误分类全部用 `errors.Is`/`errors.As`，无类型断言、无字符串匹配\n::crit Service 层不 import `net/http`，错误类型与 HTTP 解耦\n::crit 500 响应只给 request_id，不回显内部错误\n\n<!--day 16-->\n::pre 完成 D7-D8；理解 offset 的成本。\n::predict sql\n-- keyset 分页：按 (date, id) 倒序\nSELECT * FROM entries\nWHERE user_id = ? AND (date, id) < (?, ?)\nORDER BY date DESC, id DESC LIMIT 20\n::ask SQLite 支持行值比较 `(a,b) < (?,?)` 吗？如果不支持该怎么写？\n::ans SQLite 3.15+ 支持行值比较，但为了兼容性和索引利用，更稳妥的写法是展开：\n```sql\nWHERE user_id = ?\n  AND (date < ? OR (date = ? AND id < ?))\nORDER BY date DESC, id DESC LIMIT 20\n```\n注意索引要建 `(user_id, date DESC, id DESC)` 才能让这个条件走范围扫描。**行值比较在 MySQL/PostgreSQL 上支持较好，SQLite 建议展开写**，可移植性更好。\n::predict go\n// 第一页返回的 next_cursor 是 base64("2026-10-19|42")\n// 客户端原样传回 ?cursor=2026-10-19|42   （未编码）\n::ask 会出什么问题？\n::ans `|` 在 URL query 里不是保留字符，但 `+`、`&`、`=` 是——如果游标里含这些字符，会被 URL 解析截断或转义错。所以游标**必须 base64url 编码**（`base64.RawURLEncoding`，无 padding、用 `-` `_` 替代 `+` `/`）。另外要防「客户端伪造游标」：解码后校验格式（两段、日期可解析、id 是正整数），不合法返回 400 而不是 500。**游标是不透明字符串，服务端必须当作不可信输入处理**。\n::debug go\ncursor := r.URL.Query().Get("cursor")\nb, _ := base64.StdEncoding.DecodeString(cursor)\nparts := strings.Split(string(b), "|")\nid, _ := strconv.ParseInt(parts[1], 10, 64)\n::ask 这段代码在恶意输入下会怎样？\n::ans 两处 panic 风险：① `parts[1]` 在 `parts` 长度 < 2 时越界 panic（客户端传 `cursor=abc` 解码后是乱码，可能没有 `|`）；② `ParseInt` 的错误被忽略，id 变 0，可能查出错误的数据。必须：先判断 `len(parts) == 2`，再校验 `err == nil`，全部失败返回 400。**任何来自客户端的字符串，在用之前都要假设它是垃圾**——`strings.Split` + 下标访问是 panic 的高发组合。\n::transfer\n::scene 你的列表接口同时支持 `offset` 和 `cursor`。\n::ask 两者都传时怎么办？响应里怎么表达「当前用的是哪种」？\n::hint 必须有一条确定规则，不能让行为依赖实现顺序。\n::ans 规则：**`cursor` 优先，非空时忽略 `offset`**，并在文档里写死。响应回显：`{items, limit, total?, next_cursor, paging: "cursor"|"offset"}`——让客户端知道服务端实际用了哪种，避免「我传了 cursor 但结果像 offset」的困惑。另一个决策：游标模式下 `total` 是否返回。建议**只在第一页（无 cursor 时）返回 total**，后续页返回 `null` 或省略，因为深分页时 `COUNT(*)` 比取数据还贵。\n::crit 能写出 keyset 分页的 WHERE 条件，并说明索引怎么配合\n::crit 游标用 base64url 编码，解码后校验段数与类型，不合法返回 400\n::crit 同时传 offset 和 cursor 时规则明确（cursor 优先）\n::crit 响应回显分页方式，游标模式下 total 的返回策略明确\n\n<!--day 17-->\n::pre 完成 D1-D16；所有接口都能 curl 通。\n::predict bash\ncurl -s localhost:8080/ledger | jq \'.data.items | length\'\n::ask 如果服务没启动，这条命令输出什么？脚本会怎么继续？\n::ans 输出空（`curl -s` 静默失败），`jq` 报 `parse error: Expected value before EOF`，但**脚本默认会继续往下执行**——于是后面的断言全部基于空数据，可能「碰巧通过」。修法：`curl -fsS`（`-f` 让 4xx/5xx 返回非零，`-S` 显示错误），配合 `set -euo pipefail`，任一命令失败立即退出。**验收脚本最怕的不是失败，是「失败但不退出」**。\n::predict bash\nset -e\nTOKEN=$(curl -s -X POST /login -d \'...\' | jq -r \'.data.token\')\ncurl -s -H "Authorization: Bearer $TOKEN" /ledger\n::ask `set -e` 能保证 `TOKEN` 一定拿到吗？\n::ans 不能。`$(...)` 里 curl 失败时，`set -e` **不会**让脚本退出（命令替换里的失败被吞掉，除非 `set -o pipefail` 且是管道）。`TOKEN` 可能是 `null` 或空字符串，后续请求带着 `Bearer null` 变成 401，脚本报错在「意料之外的地方」。修法：显式检查 `[ -n "$TOKEN" ] && [ "$TOKEN" != "null" ] || { echo "登录失败"; exit 1; }`。**`set -e` 不是万能的，命令替换、管道、条件语句里都有例外**。\n::debug bash\n#!/usr/bin/env bash\nset -e\nBASE=http://localhost:8080\ncurl -s $BASE/healthz\necho "ok"\n::ask 这个脚本有什么问题？（提示：healthz 返回 500 时）\n::ans `curl -s` 对 500 也返回 0（curl 只要收到响应就成功），`set -e` 不会触发，脚本照样输出 `ok`。必须用 `curl -f`（fail on HTTP error）或显式检查状态码：`code=$(curl -s -o /dev/null -w \'%{http_code}\' $BASE/healthz); [ "$code" = 200 ] || exit 1`。**「HTTP 500 但 curl 退出码 0」是验收脚本最常见的假绿来源**。\n::transfer\n::scene 写一个覆盖「注册 → 登录 → 创建 → 列表 → 统计 → 删除」的回归脚本。\n::ask 脚本结构怎么组织？失败时怎么定位到具体步骤？\n::hint 每个步骤打印名字，断言失败时输出「期望 vs 实际」。\n::ans \n```bash\n#!/usr/bin/env bash\nset -euo pipefail\nBASE=${BASE:-http://localhost:8080}\nstep() { printf \'\\n[%s] %s\\n\' "$1" "$2"; }\nfail() { echo "FAIL: $1 (期望 $2, 实际 $3)"; exit 1; }\n\nstep 1 "注册"\nEMAIL="e2e-$(date +%s)@x.com"\ncode=$(curl -s -o /tmp/r.json -w \'%{http_code}\' -X POST "$BASE/register" \\\n  -H \'Content-Type: application/json\' -d "{\\"email\\":\\"$EMAIL\\",\\"password\\":\\"correct-horse-1\\"}")\n[ "$code" = 201 ] || fail "注册状态码" 201 "$code"\n\nstep 2 "登录"\nTOKEN=$(curl -fsS -X POST "$BASE/login" ... | jq -r \'.data.token\')\n[ -n "$TOKEN" ] && [ "$TOKEN" != null ] || fail "token" non-empty "$TOKEN"\n...\n```\n三个要点：**每步编号 + 名称**（失败时一眼定位）、**断言带期望与实际**、**用时间戳造唯一数据**（否则第二次跑就撞唯一约束）。最后 `trap \'rm -f /tmp/r.json\' EXIT` 清理。\n::crit 脚本 `set -euo pipefail`，且用 `curl -f` 或断言状态码\n::crit 每步有编号与名称，失败输出「期望 vs 实际」\n::crit 数据用时间戳/随机后缀，脚本可重复运行\n::crit 数值断言（金额、条数）而不只是状态码\n\n<!--day 18-->\n::pre 完成 D1-D17；回归脚本能跑通。\n::predict bash\ngo vet ./... && go build ./... && ./scripts/e2e.sh\n::ask 三条都通过，能说明阶段三完成了吗？\n::ans 不能。它们只证明「能编译、静态检查过、脚本覆盖的路径正确」。阶段三的验收还要求：重启不丢（脚本必须杀进程）、分页边界正确（`limit=0`、`offset` 超界、空结果）、错误码映射正确（404 vs 500）、日志能按 request_id 追踪。**「CI 绿」和「验收通过」之间差的是「验收清单有没有被逐条覆盖」**。\n::predict go\n// 分页边界测试\ncases := []struct{ limit, offset int }{{0, 0}, {-1, 0}, {101, 0}, {20, 999999}}\n::ask 这四个用例分别期望什么行为？\n::ans ① `limit=0` → 用默认值 20（不是返回空）；② `limit=-1` → 默认 20（不能变成「不限」）；③ `limit=101` → 默认 20 或 400（要有明确策略，建议 clamp 到 100）；④ `offset=999999` → 返回空数组 + 正确的 total，不是 500。**边界测试的价值在于「把未定义的灰色地带变成明确行为」**，否则线上遇到时只能临时拍脑袋。\n::debug bash\n# 阶段验收时发现\ncurl \'localhost:8080/ledger?limit=20&offset=0\'   # 20 条\ncurl \'localhost:8080/ledger?limit=20&offset=20\'  # 20 条\ncurl \'localhost:8080/ledger?limit=20&offset=40\'  # 0 条\n# 但总数是 45\n::ask 哪里有问题？\n::ans 第 2 页返回了 20 条，说明总共有 40 条被读到；第 3 页返回 0 条，但总数是 45——第 41-45 条丢了。可能原因：① `offset` 计算用了 `page*limit` 但 `page` 从 1 开始（第 3 页算出 offset=60，跳过 41-60）；② SQL 里 `LIMIT ? OFFSET ?` 的参数顺序传反了（变成 `LIMIT offset OFFSET limit`，SQLite 不报错但结果荒谬）；③ 数据在两次请求之间被删了 5 条。**参数顺序传反是 Go 里不会编译报错、只能靠测试抓的典型错误**。\n::transfer\n::scene 写阶段三的验收报告，要能让别人复现。\n::ask 报告里必须包含哪几项？\n::hint 想想「别人拿到报告后能不能一条命令重跑」。\n::ans ① **环境**：Go 版本、启动命令、数据库路径；② **接口清单**：5 个路由 + 状态码 + 示例请求响应；③ **验收项对照表**：每条要求 → 用什么命令验证 → 实际输出（贴关键行）；④ **边界用例结果**：limit/offset 非法值、404、405、空结果；⑤ **持久化证据**：kill 进程前后对比；⑥ **已知问题**：明确写出没做的（比如鉴权还没做、cursor 只有字段没实现）；⑦ **复现脚本路径**。**报告的核心不是「我做了」，是「你可以验证我做了」**。\n::crit 验收清单每一项都有对应的可执行命令与输出\n::crit 边界用例（limit 非法、404、405、空结果）全部有明确行为\n::crit 有 kill 进程验证持久化的证据\n::crit 报告里诚实列出未完成项，而不是回避\n',vf='<!--day 1-->\n::pre 知道「哈希不可逆」；知道 salt 的存在。\n::predict\n账户 A 密码 `password123`，账户 B 密码也是 `password123`。\n用 SHA-256 直接存哈希（不加盐），两条记录的值相同吗？\n::ask 相同吗？攻击者从这个「相同」能得到什么？\n::ans 相同。后果有两层：① **彩虹表**——SHA-256 的常见密码哈希表是公开的，`password123` 的哈希可以直接反查；② **横向识别**——攻击者不用破解就知道「这两个人密码一样」，撞库时一次命中两个账号。加盐后每人一个随机 salt，同样的密码得到不同哈希，彩虹表失效。**salt 的作用不是「让哈希更难算」，是「让同样的输入产生不同结果」**。\n::predict\nArgon2id 参数 m=64MiB, t=3, p=4，单次哈希约 200ms。\n::ask 这 200ms 对登录接口意味着什么？如果 20 个用户同时登录呢？\n::ans 20 个并发登录需要 20 × 200ms = 4 秒的**纯 CPU/内存时间**。如果机器 4 核，排队后最后一个要等约 1 秒以上。这意味着：**慢哈希把登录接口变成了最容易被打的资源**——攻击者不需要破解，只要狂发登录请求就能让 CPU 打满。所以认证层前面必须有速率限制（阶段六），且 Argon2 的内存参数（64MiB）也要算进并发预算：20 个并发 × 64MiB = 1.25GB 内存峰值，小内存机器会 OOM。\n::debug\n```go\nh := sha256.Sum256([]byte(password))\nstored := hex.EncodeToString(h[:])\n```\n::sym 安全审计指出「密码存储不合规」。\n::ask 这段代码有几个问题？分别对应什么攻击？\n::ans 三个：① **用了快哈希**——SHA-256 单次微秒级，GPU 每秒能算几十亿次，离线爆破毫无门槛；② **没有盐**——彩虹表直接反查，且相同密码产生相同哈希；③ **没有迭代/成本参数**——无法通过调参对抗硬件升级。密码哈希必须用**专为「慢」设计的算法**：Argon2id、bcrypt、scrypt、PBKDF2。SHA-256 是「校验数据完整性」的工具，不是「存密码」的工具。\n::transfer\n::scene 你要在 OWASP 建议和家庭服务器（2GB 内存）之间做取舍。\n::ask Argon2id 参数怎么定？内存不够时降级到什么？降级后风险是什么？\n::hint 参数三元组 m/t/p 分别控制什么？\n::ans 首选 OWASP 2025 推荐：`m=64MiB, t=3, p=4`，目标单次 150-250ms。2GB 内存机器上并发登录可能 OOM，退到 OWASP 最小值 `m=19MiB, t=2, p=1`。降级代价：内存成本降低意味着**GPU/ASIC 并行破解的性价比上升**，同样硬件能同时跑更多哈希。风险缓解：① 登录接口限流（每 IP/每账号）；② 强密码策略；③ 监控异常登录。**参数不是越强越好，是「在你能承受的并发下，尽量贴近 200ms」**——先在目标机器上实测再定。\n::crit 能解释 salt 防的是彩虹表和「相同密码识别」，不是防暴力破解\n::crit 知道慢哈希的计算成本会成为登录接口的容量瓶颈，能算出并发预算\n::crit 能说出 SHA-256 存密码的三个问题及对应攻击\n::crit 能给出「首选参数 + 降级参数 + 降级后的补偿措施」\n\n<!--day 2-->\n::pre 完成 D1；知道 Argon2id 的参数含义。\n::predict\n```go\nhash, _ := argon2.IDKey([]byte(pw), salt, 1, 64*1024, 4, 32)\n// 存库时只存 hash\n```\n::ask 只存 hash 够吗？验证时怎么知道用哪个 salt、哪个参数？\n::ans 不够。验证时需要**同样的 salt 和同样的参数**重算，所以要把 `salt`、`m`、`t`、`p`、`keyLen` 一起存下来。标准做法是存**编码后的完整字符串**：`$argon2id$v=19$m=65536,t=3,p=4$<b64salt>$<b64hash>`——这是 PHC 标准格式，一行含全部参数。好处是以后调参数时，老用户的哈希仍能按老参数验证，新用户用新参数，**不需要强制所有人改密码**。\n::predict\n```go\nfunc verify(pw, encoded string) bool {\n    parts := strings.Split(encoded, "$")\n    salt := parts[4]\n    want := parts[5]\n    got, _ := argon2.IDKey([]byte(pw), []byte(salt), 1, 64*1024, 4, 32)\n    return base64.RawStdEncoding.EncodeToString(got) == want\n}\n```\n::ask 这段验证代码至少有三个错误，找出来。\n::ans ① **salt 没解码**：编码串里的 salt 是 base64，直接 `[]byte(salt)` 用的是 base64 文本而不是原始字节，算出的哈希永远不匹配；② **参数写死**：`t=1, m=64*1024` 与实际存储的参数可能不一致，应该从 `parts[3]` 解析；③ **字符串比较不是常数时间**：`==` 在第一个不同字符就返回，理论上可被计时攻击（虽然实践难度高，但密码比较应该用 `subtle.ConstantTimeCompare`）。另外 `parts` 长度没校验，畸形输入会 panic。**「验证」比「生成」更容易写错**，因为错误表现是「永远 false」或「偶尔 true」，很难察觉。\n::debug\n```go\nh1, _ := hashPassword("abc")\nh2, _ := hashPassword("abc")\nfmt.Println(h1 == h2)   // false\n```\n::sym 两个相同的密码算出不同哈希，测试 `h1 == h2` 失败。\n::ask 这是 bug 吗？测试该怎么写才对？\n::ans 不是 bug，是**正确行为**——每次哈希用新的随机 salt，所以结果必然不同。测试应该验证「用 verify 能通过」而不是「哈希相等」：`verifyPassword("abc", h1) == true && verifyPassword("abd", h1) == false`。**测试要针对「性质」而不是「输出值」**，否则会把随机性当成缺陷。同理，任何含随机 salt/nonce 的函数都不能断言具体输出。\n::transfer\n::scene 你要实现 `hashPassword` 和 `verifyPassword`，并写出它们的错误契约。\n::ask 两个函数的签名分别是什么？各返回哪些错误？为什么 verify 不应返回 error 而应返回 bool？\n::hint 想想「密码错误」到底是「业务失败」还是「系统错误」。\n::ans \n```go\nfunc hashPassword(pw string) (string, error)         // 只有系统错误：随机源失败、参数非法\nfunc verifyPassword(pw, encoded string) (bool, error) // bool=是否匹配；error=编码串损坏等系统问题\n```\n`verify` 必须区分三者：匹配（true, nil）、不匹配（false, nil）、**哈希串本身损坏**（false, err）。如果只返回 bool，编码串损坏会被当成「密码错」，用户永远登不上却查不出原因。而 handler 层：`(false, nil)` → 401「邮箱或密码错误」（**不区分是邮箱不存在还是密码错**，防止账号枚举）；`(_, err)` → 500 + 日志。**「认证失败」和「系统故障」必须分开，但对用户要模糊**。\n::crit 存储用 PHC 编码串（含算法、参数、salt、hash），不是分开的列\n::crit verify 从编码串解析参数，不写死 m/t/p\n::crit 比较用常数时间函数，且校验编码串结构避免 panic\n::crit 测试断言「verify 通过/不通过」，不断言哈希值相等\n\n<!--day 3-->\n::pre 完成 D2；Argon2id 已能跑通。\n::predict\n```go\nbcrypt.GenerateFromPassword([]byte(pw), bcrypt.DefaultCost)\n```\n::ask `DefaultCost` 是多少？为什么生产环境不该依赖它？\n::ans `DefaultCost = 10`（bcrypt 库的默认值）。不该依赖的原因：**默认值是库作者的选择，可能随版本变化**，而且 10 在现代硬件上约 50-60ms，低于 OWASP 建议的 150-250ms 区间。应显式写 `bcrypt.GenerateFromPassword([]byte(pw), 12)`。显式还有一个好处：代码评审时能一眼看到成本参数，而不是去查文档。**安全参数必须显式写出，不能依赖默认值**——这条对超时、TLS 版本、哈希成本都成立。\n::predict\n```go\nhash, _ := bcrypt.GenerateFromPassword([]byte(pw), 12)\n// 数据库 VARCHAR(60)\n```\n::ask 60 字符够存 bcrypt 哈希吗？Argon2 的编码串呢？\n::ans bcrypt 哈希固定 60 字符（`$2a$12$` + 22 salt + 31 hash），刚好够，但没有余量。Argon2 的 PHC 编码串约 95-100 字符（含参数），**`VARCHAR(60)` 会截断**，截断后验证永远失败。建议统一用 `VARCHAR(255)` 或 `TEXT`。**字段长度要按「最长的可能编码」留余量**，不要按某个算法的当前格式卡死——换算法时不用改表。\n::debug\n```go\n// 迁移：从 bcrypt 换到 Argon2id\n// 直接改 hashPassword 用 Argon2\nh, _ := hashPassword(pw)   // 现在是 $argon2id$...\nverifyPassword(pw, oldBcryptHash)  // 老用户登录\n```\n::sym 老用户全部登录失败。\n::ask 怎么在不强制改密码的前提下平滑迁移？\n::ans 验证时**按前缀分派**：`if strings.HasPrefix(encoded, "$2") { bcrypt.Compare } else if strings.HasPrefix(encoded, "$argon2id$") { argon2 验证 }`。更进一步做**登录时升级**：老用户用 bcrypt 验证成功后，立刻用 Argon2 重新哈希并更新库（`UPDATE users SET password_hash=? WHERE id=?`）。这样用户无感，活跃用户逐步迁移，长期不登录的保留旧格式也能用。**任何哈希/加密算法的迁移，都要走「双读单写 + 登录时升级」这条路**，不能一刀切。\n::transfer\n::scene 项目要在 Argon2id 和 bcrypt 之间做最终选择。\n::ask 从「安全强度、实现复杂度、依赖、内存占用、迁移成本」五个维度对比，给出结论。\n::hint 家庭账本场景：单机、低并发、2GB 内存。\n::ans\n| 维度 | Argon2id | bcrypt |\n| 抗 GPU | 强（内存硬） | 中（可并行） |\n| 实现复杂度 | 中（参数多、编码格式要自己处理） | 低（标准库 API 简单） |\n| 依赖 | `golang.org/x/crypto/argon2` | `golang.org/x/crypto/bcrypt` |\n| 内存占用 | 64MiB/次（并发时叠加） | 约 4KB |\n| 迁移成本 | 需要处理参数升级 | cost 可直接调 |\n结论：**默认 Argon2id**（内存硬优势明显，OWASP 首选）；如果部署环境内存吃紧（比如树莓派 1GB 且多用户），用 bcrypt cost=12 作为可接受的次优解。**不要为了「更安全」把内存参数设到机器扛不住**——OOM 导致服务不可用，是比「哈希稍弱」更现实的风险。\n::crit 显式指定 bcrypt cost=12，不依赖 `DefaultCost`\n::crit 密码字段长度 ≥ 255，能容纳 Argon2 的 PHC 编码串\n::crit 能写出「按前缀分派 + 登录时升级」的迁移方案\n::crit 能对比两种算法并给出「在什么条件下选哪个」的判据\n\n<!--day 4-->\n::pre 完成 D2-D3；会建表和写迁移 SQL。\n::predict\n```sql\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL,\n  password_hash TEXT NOT NULL\n);\n```\n::ask 这个表能挡住「同一个邮箱注册两次」吗？\n::ans 不能。没有唯一约束，两次注册会插入两行，之后 `SELECT ... WHERE email = ?` 可能返回任意一条，登录行为不确定。必须加 `UNIQUE`：`email TEXT NOT NULL UNIQUE`。**唯一性是数据库的责任，不是应用层「先查再插」的责任**——后者在并发下必然失效。\n::predict\n```sql\nINSERT INTO users(email, password_hash) VALUES (\'a@x.com\', \'h1\');\nINSERT INTO users(email, password_hash) VALUES (\'a@x.com\', \'h2\');\n```\n::ask 第二条会怎样？Go 里怎么判断这个错误？\n::ans 报错：`UNIQUE constraint failed: users.email`。Go 里要判断它，`modernc.org/sqlite` 没有导出错误码常量，通常用 `strings.Contains(err.Error(), "UNIQUE constraint failed")` 或检查 `sqlite.Error` 的 Code。这看起来违背了「不靠字符串匹配」的原则，但驱动没提供类型化错误时是唯一选择——**关键是把这种判断收敛到一个函数里**（`func isUniqueViolation(err error) bool`），而不是散落在各处。\n::debug\n```sql\nCREATE TABLE users (\n  id INTEGER PRIMARY KEY,\n  email TEXT NOT NULL UNIQUE\n);\nINSERT INTO users(email) VALUES (\'A@X.com\');\nINSERT INTO users(email) VALUES (\'a@x.com\');\n```\n::sym 两条都插进去了，但业务上它们是同一个邮箱。\n::ask 为什么唯一约束没生效？怎么修？\n::ans SQLite 的 `TEXT` 比较**默认区分大小写**（`BINARY` collation），`A@X.com` 和 `a@x.com` 被视为不同值。修法：① 列定义加 `COLLATE NOCASE`：`email TEXT NOT NULL UNIQUE COLLATE NOCASE`；② 或在写入前统一 `strings.ToLower(strings.TrimSpace(email))`（推荐，因为「存储规范化」比「查询时比较」更可控，也便于索引）。**邮箱规范化必须在入库前做**：trim 空格、转小写、不做过度的点号/加号处理（那是 Gmail 特有语义，不能通用）。\n::transfer\n::scene 设计完整的 `users` 表，还要支持「以后可能改用手机号登录」。\n::ask 表结构怎么写？哪些字段将来会疼？\n::hint 想「登录标识」和「用户资料」是不是一回事，以及软删除对唯一约束的影响。\n::ans\n```sql\nCREATE TABLE users (\n  id            INTEGER PRIMARY KEY AUTOINCREMENT,\n  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,\n  password_hash TEXT NOT NULL,\n  display_name  TEXT NOT NULL DEFAULT \'\',\n  created_at    TEXT NOT NULL,\n  updated_at    TEXT NOT NULL\n);\n```\n注意三点：① `AUTOINCREMENT` 保证 ID 不复用（删除用户后新用户不会拿到旧 ID，避免「旧 token 指向新用户」）；② 如果以后要软删除 + 允许同邮箱重新注册，`UNIQUE(email)` 会挡住——需要改成 `UNIQUE(email, deleted_at)` 或部分索引 `WHERE deleted_at IS NULL`；③ 手机号登录要新加 `phone TEXT UNIQUE`，且**允许 email 和 phone 都为空但不能都为空**（需要 `CHECK` 约束或应用层保证）。**唯一约束和软删除天然冲突，早想清楚比后期改表便宜**。\n::crit `email` 有 `UNIQUE`，且写入前做了 trim + 小写规范化\n::crit 能写出「重复注册」的错误判断，并收敛到一个函数里\n::crit 知道软删除与唯一约束的冲突，能说出两种解法\n::crit 主键用 AUTOINCREMENT，能解释「ID 不复用」的安全意义\n\n<!--day 5-->\n::pre 完成 D4：users 表可用。\n::predict\n```go\nfunc (h *Handler) Register(w http.ResponseWriter, r *http.Request) {\n    in, ok := decodeJSON[RegisterInput](w, r)\n    if !ok { return }\n    h.svc.CreateUser(r.Context(), in.Email, in.Password)\n    OK(w, nil)\n}\n```\n::ask 这个注册接口有几个安全问题？\n::ans 至少四个：① **没校验密码强度**——用户能设 `1`；② **没校验邮箱格式**——`a@` 也能注册；③ **错误被忽略**——重复邮箱时 `CreateUser` 返回错误但没检查，接口仍返回 200，用户以为注册成功；④ **响应体没返回用户信息**，前端无法确认注册成了哪个账号。另外还应该：密码不小于 8 位、不超过 72 字节（bcrypt 会截断到 72 字节，超长密码被静默截断是安全隐患）、邮箱长度上限 254。\n::predict\n```go\n// 注册时把密码原样写日志\nlog.Printf("register email=%s password=%s", in.Email, in.Password)\n```\n::ask 这行有什么问题？为什么它比「数据库泄漏」更常见？\n::ans **密码明文进了日志**，而日志通常：① 被收集到集中式平台（ELK/Loki），保留 30-90 天；② 权限比数据库松（开发、运维都能看）；③ 可能被同步到第三方 SaaS。所以「日志泄漏密码」的实际发生概率**远高于数据库被拖库**。规则：日志里永不出现密码、token、Cookie、完整银行卡号。要记录「注册成功」就记 `user_id` 和邮箱的哈希/掩码（`a***@x.com`）。**日志是审计工具，不是调试打印**。\n::debug\n```bash\ncurl -X POST /register -d \'{"email":"a@x.com","password":"123"}\'\n# 201 Created\ncurl -X POST /register -d \'{"email":"a@x.com","password":"456"}\'\n# 201 Created   ← 重复注册也成功？\n```\n::ask 第二次为什么也返回 201？\n::ans 因为代码忽略了 `CreateUser` 的错误（D4 讲过 UNIQUE 会报错，但这里没检查），或者用了 `INSERT OR IGNORE`（静默跳过）。两种都糟糕：前者让用户以为注册成功但实际没建账号，后者更隐蔽——用户以为改了密码，其实还是旧账号。正确行为：捕获唯一约束错误 → 返回 **409 Conflict** + `EMAIL_TAKEN`。**「注册」这个动作必须给出确定的结果：要么建了，要么明确告诉你为什么没建**。\n::transfer\n::scene 设计注册接口的完整校验清单与响应。\n::ask 列出所有校验（含顺序），并说明为什么某些校验要在哈希之前。\n::hint 哈希很贵（200ms），别让无效请求付费。\n::ans 顺序：① 请求体大小与 JSON 结构（最便宜）；② 邮箱 trim + 小写 + 格式正则 + 长度 ≤ 254；③ 密码长度 8-72 字节 + 不全是数字/不常见弱密码；④ **查重（可选，仅为了快速失败）**；⑤ **哈希**（200ms，最贵，放最后）；⑥ 插入，捕获唯一冲突 → 409。响应：201 + `{id, email}`，**不含 password_hash**。两个要点：**贵的操作放最后**（挡住无效请求）；**查重不能替代唯一约束**（并发窗口），它只是优化体验（早报错）。\n::crit 注册校验覆盖邮箱格式/长度、密码强度/长度，且顺序合理（哈希最后）\n::crit 重复邮箱返回 409 而不是 201/500\n::crit 日志里搜不到明文密码\n::crit 响应体不含 password_hash，只含 id 与 email\n\n<!--day 6-->\n::pre 完成 D5：能注册、能存哈希。\n::predict\n```go\nfunc (h *Handler) Login(w http.ResponseWriter, r *http.Request) {\n    var in LoginInput\n    decodeJSON(w, r, &in)\n    var hash string\n    var id int64\n    err := db.QueryRow("SELECT id, password_hash FROM users WHERE email = ?", in.Email).Scan(&id, &hash)\n    if err != nil {\n        Fail(w, 401, 2001, "邮箱不存在")\n        return\n    }\n    if ok, _ := verifyPassword(in.Password, hash); !ok {\n        Fail(w, 401, 2001, "密码错误")\n        return\n    }\n    OK(w, map[string]any{"user_id": id})\n}\n```\n::ask 这个接口有两个安全问题，分别是什么？\n::ans ① **账号枚举**：邮箱不存在返回「邮箱不存在」，密码错返回「密码错误」——攻击者可以批量探测哪些邮箱注册过。两者都应该返回同一句「邮箱或密码错误」。② **响应差异可被计时**：邮箱不存在时立刻返回（几微秒），密码错时要跑 200ms 哈希——攻击者用响应时间就能判断邮箱是否存在。修法：邮箱不存在时**也跑一次哈希**（对一个固定的假哈希验证），让两条路径耗时接近。**「认证失败」的所有分支必须看起来一样**，包括措辞、状态码、耗时。\n::predict\n```go\n// 登录成功，签一个 24 小时有效的 token\nclaims := jwt.MapClaims{\n    "user_id": id,\n    "exp":     time.Now().Add(24 * time.Hour).Unix(),\n}\ntoken := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)\ns, _ := token.SignedString([]byte(secret))\n```\n::ask `exp` 用 `Unix()` 秒级时间戳，客户端时钟偏差会有什么影响？\n::ans JWT 的 `exp` 是**服务端**校验的（用服务端当前时间），客户端的时钟不影响。真正的风险在别处：① **没有 `iat`**，无法判断 token 签发时间，也无法做「签发后改密码则全部失效」；② **没有 `nbf`** 时默认无起始限制，签发即生效；③ 24 小时太长，token 泄漏后有整整一天的窗口。建议：`exp` 15 分钟-1 小时（配 refresh token）或家庭场景 24 小时但**支持服务端吊销**（存一个 `token_version`，改密码时自增）。**JWT 的无状态特性意味着「签发后无法撤回」，除非你额外维护状态**。\n::debug\n```go\n// 登录成功后\nhttp.SetCookie(w, &http.Cookie{Name: "token", Value: s})\n```\n::sym 前端拿不到 Cookie，或者下次请求没带上。\n::ask 这段 Cookie 少了哪些属性？各自的作用是什么？\n::ans 少了四个关键属性：`HttpOnly: true`（JS 读不到，防 XSS 窃取）、`Secure: true`（只走 HTTPS）、`SameSite: Lax/Strict`（限制跨站携带，防 CSRF）、`Path: "/"`（默认是当前路径，可能导致其他路径不带）。还有 `MaxAge` 要跟 token 的 `exp` 对齐，否则 Cookie 还在但 token 已过期。**Cookie 的每个属性都对应一类攻击**，缺一个就少一层防护。\n::transfer\n::scene 你要设计登录的错误响应策略，兼顾「安全」与「可用」。\n::ask 哪些错误可以明确告诉用户，哪些必须模糊？分别给出响应。\n::hint 想「用户自己填错了」和「攻击者在探测」的区别。\n::ans **必须模糊**：邮箱不存在 / 密码错 / 账号被禁用 → 统一 `401 {"code":2001,"message":"邮箱或密码错误"}`，且耗时接近。**可以明确**：请求格式错（`400 INVALID_JSON`）、字段缺失（`400 MISSING_FIELD`）、请求过于频繁（`429 TOO_MANY_REQUESTS` 带 `Retry-After`）、服务端故障（`500` + request_id）。判断标准：**如果明确说明会让攻击者获得「某个账号是否存在」的信息，就必须模糊**；如果只是「你的请求写错了」，明确说明是在帮用户。**不要用 403 区分「密码错」和「账号锁定」**，那也是在泄漏状态。\n::crit 登录失败的所有分支返回同一响应，且耗时接近\n::crit token 含 `exp` 与 `iat`，有效期有明确理由\n::crit Cookie 至少设置 `HttpOnly + Secure + SameSite + Path`，`MaxAge` 与 exp 对齐\n::crit 能说出「哪些错误必须模糊、哪些应该明确」的判断标准\n\n<!--day 7-->\n::pre 完成 D6：登录能校验密码。\n::predict\n```go\ntoken := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{\n    "user_id": 42,\n    "role":    "admin",\n})\ns, _ := token.SignedString([]byte("secret"))\n```\n::ask 这个 token 的 payload 能被客户端看到吗？能改吗？\n::ans **能被看到，不能改**。JWT 的 payload 只是 base64url 编码，不是加密——任何人拿到 token 都能解出 `user_id` 和 `role`。但改了之后签名对不上，服务端验证会失败。所以：**绝不能在 payload 里放敏感信息**（密码、身份证、完整手机号）。同时这也意味着「用户知道自己的 user_id」是正常的，别把它当秘密。\n::predict\n```go\nvar secret = []byte("secret")\n// 生产环境用同一个硬编码值\n```\n::ask 密钥硬编码在代码里，会导致什么？\n::ans ① 代码进 Git 后，任何有仓库读权限的人都能伪造任意用户的 token（包括 `user_id: 1` 的管理员）；② 开源/泄漏后无法补救，除非改代码重新部署；③ 多环境共用同一个密钥，测试环境的 token 能在生产用。正确做法：密钥从环境变量/密钥管理服务读取，**启动时校验非空且长度足够**（HS256 建议 ≥ 32 字节随机值），缺失就拒绝启动。**「启动即失败」比「用默认密钥跑起来」安全一万倍**。\n::debug\n```go\n// 签发\njwt.NewWithClaims(jwt.SigningMethodHS256, claims)\n// 另一处代码用 None 算法验证\ntoken, _ := jwt.Parse(s, func(t *jwt.Token) (any, error) {\n    return secret, nil\n})\n```\n::ask 这个 Parse 有什么漏洞？\n::ans **没有校验签名算法**。`golang-jwt` 的 keyfunc 如果不检查 `t.Method`，攻击者可以把 header 改成 `alg: none` 或 `alg: RS256`（然后用公钥当 HMAC 密钥）来绕过验证。历史上大量 JWT 漏洞都源于此。必须显式检查：\n```go\nif t.Method.Alg() != jwt.SigningMethodHS256.Alg() {\n    return nil, fmt.Errorf("unexpected alg: %v", t.Method.Alg())\n}\n```\n**永远不要信任 token header 里的算法字段**——这是 JWT 使用的第一原则。\n::transfer\n::scene 设计 token 的 payload 与有效期策略。\n::ask 该放哪些字段？不该放哪些？刷新机制怎么做？\n::hint 想想「什么信息每次请求都需要」和「什么信息变了要立刻生效」。\n::ans **该放**：`sub`（user_id）、`iat`、`exp`、`jti`（token 唯一 ID，便于吊销）。**不该放**：密码哈希、邮箱（可能变）、角色权限（改了要等 token 过期才生效）、任何敏感数据。**有效期**：access token 15-30 分钟 + refresh token 7-30 天（refresh 存库、可吊销、一次性使用）。家庭账本可以简化：单个 token 24 小时 + 服务端 `token_version` 字段（改密码时自增，验证时比对），这样「改密码后旧 token 立刻失效」——用一点状态换取可吊销性，比纯无状态更实用。**纯无状态 JWT 的代价是「无法撤回」，要接受它或补状态**。\n::crit token payload 只有 `sub/iat/exp/jti` 等必要字段，无敏感信息\n::crit 密钥来自环境变量，启动时校验长度，缺失拒绝启动\n::crit 验证时显式校验 `alg`，拒绝 `none` 和其他算法\n::crit 有明确的吊销策略（短过期 + refresh，或 `token_version`）\n\n<!--day 8-->\n::pre 完成 D7：能签发 token。\n::predict\n```go\ntoken, err := jwt.ParseWithClaims(raw, &Claims{}, keyfunc)\nif err != nil {\n    return nil, err\n}\nreturn token.Claims.(*Claims), nil\n```\n::ask 这段验证漏了什么关键检查？\n::ans 漏了 `token.Valid`。`ParseWithClaims` 在**签名无效或过期**时会返回 err，但某些实现细节下 `token` 非 nil 而 `Valid == false`。更稳妥的写法：\n```go\nif err != nil { return nil, err }\nif !token.Valid { return nil, ErrInvalidToken }\n```\n另外要检查 `token.Method` 是否是预期算法（D7 讲过）。**「解析成功」不等于「验证通过」**，这两步必须分开确认。\n::predict\n```go\n// 客户端传了一个过期 1 秒的 token\n```\n::ask 服务端应该返回什么？前端怎么知道该刷新还是该重新登录？\n::ans 返回 **401**，但错误码要能区分「过期」和「无效」：`TOKEN_EXPIRED` vs `TOKEN_INVALID`。前端收到 `EXPIRED` 就尝试用 refresh token 换新，收到 `INVALID` 就跳登录页。如果两者都返回同一个通用 401，前端只能无脑跳登录，用户体验差（刚刷新页面就被踢出）。实现上：`errors.Is(err, jwt.ErrTokenExpired)` 能区分（`golang-jwt` v5 提供了这个哨兵）。**错误码的粒度要服务于客户端的决策**。\n::debug\n```go\nuid, _ := claims["user_id"].(int64)\n```\n::ask 这个类型断言为什么总是失败？\n::ans 因为 JSON 反序列化后数字都是 `float64`，`claims["user_id"]` 是 `float64` 而不是 `int64`。断言 `.(int64)` 失败返回 0（且 `ok` 被忽略，你连失败都不知道）。正确做法：用**强类型 Claims 结构体**：\n```go\ntype Claims struct {\n    UserID int64 `json:"user_id"`\n    jwt.RegisteredClaims\n}\n```\n`ParseWithClaims(raw, &Claims{}, ...)` 之后直接 `claims.UserID`，由 JSON 库负责转换。**永远不要用 `MapClaims` + 手动断言**——它把类型安全丢在了运行时，而错误会被 `_` 静默吞掉。\n::transfer\n::scene 写一个 `ParseToken(raw string) (*Claims, error)`，覆盖所有失败形态。\n::ask 列出所有可能的失败，并说明各返回什么错误。\n::hint 从「格式、算法、签名、过期、字段缺失」五个维度想。\n::ans ① 空字符串/格式不是三段 → `ErrTokenMalformed`；② `alg` 不是 HS256 → `ErrTokenAlg`；③ 签名不匹配 → `ErrTokenInvalid`；④ `exp` 已过 → `ErrTokenExpired`（包一层哨兵，便于 `errors.Is`）；⑤ `sub` 为空或无法解析 → `ErrTokenInvalid`；⑥ 密钥配置缺失 → 这是**服务端配置错误**，返回 500 而不是 401。全部用哨兵错误，handler 里映射：前五类 → 401（expired 单独 code），第六类 → 500。**「token 有问题」和「服务端配置有问题」不能混**。\n::crit 验证时检查 `err`、`token.Valid`、`alg` 三者，缺一不可\n::crit 用强类型 Claims 结构体，不用 MapClaims 手动断言\n::crit 过期与其他无效错误能区分（错误码粒度服务前端决策）\n::crit 密钥缺失算服务端错误（500），不算认证失败（401）\n\n<!--day 9-->\n::pre 完成 D8：能解析并验证 token。\n::predict\n```go\nfunc auth(next http.Handler) http.Handler {\n    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {\n        raw := r.Header.Get("Authorization")\n        claims, err := ParseToken(raw)\n        if err != nil {\n            Fail(w, 401, 2001, "未登录")\n            return\n        }\n        ctx := context.WithValue(r.Context(), "uid", claims.UserID)\n        next.ServeHTTP(w, r.WithContext(ctx))\n    })\n}\n```\n::ask 这段有两个问题，分别是什么？\n::ans ① **没有去掉 `Bearer ` 前缀**：`Authorization: Bearer eyJ...`，直接把整串传给 `ParseToken` 会因为多了 `Bearer ` 而解析失败，所有请求都 401。必须 `strings.TrimPrefix(raw, "Bearer ")` 并校验前缀确实存在（否则 `Basic xxx` 也会被当 token）。② **context key 用了裸 string**（`"uid"`），不同包可能用同一个 key 互相覆盖，且 `go vet` 会警告。要用自定义类型。\n::predict\n```go\n// 中间件挂在 /ledger 上\nmux.Handle("GET /ledger", auth(http.HandlerFunc(h.List)))\n// 但 /summary 忘了挂\nmux.HandleFunc("GET /summary", h.Summary)\n```\n::ask 这个错误会造成什么后果？\n::ans `/summary` 变成**完全公开**的接口，未登录也能查任意用户的统计（如果 handler 里用 `user_id=0` 或从 query 取，还可能查别人的）。这类漏洞的可怕之处是「功能测试全通过」——因为测试时你自己是登录状态。防法：**默认全站需要认证，白名单显式放行**（`/healthz`、`/login`、`/register`），而不是逐个路由挂。用子路由器：`protected := mux.Group(...)`（或用 `http.StripPrefix` 组合），把所有业务路由注册到受保护的 mux 上。**「默认拒绝」比「默认允许 + 逐个加锁」安全**。\n::debug\n```go\nctx := context.WithValue(r.Context(), uidKey, claims.UserID)\n// 下游\nuid, ok := r.Context().Value(uidKey).(int64)\nif !ok {\n    Fail(w, 401, 2001, "未登录")\n}\n// 但日志显示：uid = 0，ok = true\n```\n::ask `ok` 为 true 但值是 0，说明什么？\n::ans 说明 context 里存的是 `int64(0)` 而不是「没有值」——某个中间件或 handler 存了一个零值进去，或者 `claims.UserID` 本身就是 0（token 里没有 `sub`，解析后零值）。这掩盖了「未认证」的状态。修法：中间件在存入前校验 `claims.UserID > 0`，不满足直接 401；取值时也校验 `uid > 0`。**「零值」和「不存在」必须区分**，用 `(value, ok)` 只解决了一半——还要校验 value 本身合法。\n::transfer\n::scene 设计认证中间件与路由分组的完整结构。\n::ask 怎么组织代码，才能保证「新增路由默认受保护」？\n::hint 想想「公共 mux」和「受保护 mux」两个实例。\n::ans\n```go\nfunc NewRouter(h *Handler, authMW func(http.Handler) http.Handler) http.Handler {\n    public := http.NewServeMux()\n    public.HandleFunc("GET /healthz", h.Health)\n    public.HandleFunc("POST /api/v1/register", h.Register)\n    public.HandleFunc("POST /api/v1/login", h.Login)\n\n    protected := http.NewServeMux()\n    protected.HandleFunc("POST /api/v1/ledger", h.Create)\n    protected.HandleFunc("GET /api/v1/ledger", h.List)\n    // ... 所有业务路由\n\n    root := http.NewServeMux()\n    root.Handle("/api/v1/", authMW(protected))   // 前缀挂载\n    root.Handle("/", public)\n    return root\n}\n```\n关键：**业务路由全部注册在 `protected` 上，认证只需要挂一次**；新增业务路由时因为写进 `protected` 块，天然受保护。公共路由只有明确列出的三个。**结构上防止遗漏，比靠代码评审检查可靠**。\n::crit `Bearer ` 前缀正确剥离且校验存在，`Basic` 之类的不会被误当 token\n::crit context key 用自定义类型，取值后校验 `> 0`\n::crit 路由分组：业务路由全部在受保护 mux，公共路由显式白名单\n::crit 新增一个业务路由时，不需要额外记得「加认证」\n\n<!--day 10-->\n::pre 完成 D9：认证中间件能拒绝未登录。\n::predict\n```go\ntype ctxKey int\nconst uidKey ctxKey = 1\n\n// 中间件写入\nctx := context.WithValue(r.Context(), uidKey, claims.UserID)\n\n// handler 读取\nuid := r.Context().Value(uidKey).(int64)\n```\n::ask 直接断言不检查 `ok`，什么情况下会 panic？\n::ans 当 context 里没有这个 key 时，`Value` 返回 `nil`，`nil.(int64)` 直接 panic：`interface conversion: interface {} is nil, not int64`。什么时候会没有？① 该路由忘了挂认证中间件；② 中间件因为某个分支提前 return 了但 handler 还是被调用（逻辑错误）；③ 测试里直接调 handler 没经过中间件。修法：用 `uid, ok := ...; if !ok { 401 }`，**用 `ok` 而不是靠 panic 兜底**——panic 会被 Recovery 中间件转成 500，而正确语义是 401。\n::predict\n```go\n// handler 里\nuid := r.Context().Value(uidKey).(int64)\nentries, _ := h.svc.List(r.Context(), uid, month)\n```\n::ask 这段把 `r.Context()` 同时当作「取消信号」和「取用户身份」的载体，合理吗？\n::ans 合理，而且是标准做法：context 就是「请求作用域的值 + 取消信号」的载体，用户身份属于「请求作用域的值」。但要注意两点：① **只有认证中间件能写入 uid**，业务代码只能读，不能改（否则下游可以冒充别人）；② **不要把 uid 存进 Service 的结构体字段**——Service 是长生命周期的单例，存 uid 会导致请求间串号（A 的请求读到 B 的 uid）。**身份必须沿着调用链作为参数或 context 传递，不能存在单例里**。\n::debug\n```go\ntype Service struct{ db *sql.DB; uid int64 }\nfunc (s *Service) List(ctx context.Context, month string) ([]Entry, error) {\n    return s.query(ctx, s.uid, month)   // 用了结构体里的 uid\n}\n```\n::sym 并发测试时，用户 A 偶尔能查到用户 B 的数据。\n::ask 根因是什么？这类 bug 为什么特别危险？\n::ans 根因：`Service` 是单例，`s.uid` 被所有请求共享，A 的请求刚设置完，B 的请求就覆盖了，于是 A 用了 B 的 uid 查数据——**这是最严重的一类越权漏洞，而且偶发**，因为取决于并发时序。危险在于：① 测试时串行调用，永远复现不了；② 日志里看起来「A 查了 A 的数据」，因为日志也读的是被覆盖后的值；③ 一旦发生就是数据泄漏。修法：**uid 只作为函数参数或 context 值传递，绝不存进任何长生命周期对象**。这条规则没有例外。\n::transfer\n::scene 改造所有业务 handler，从 context 取 uid 并传给 Service。\n::ask 有更好的方式避免「每个 handler 都写一遍取值」吗？\n::hint 想想泛型 middle 或 helper 函数。\n::ans 用一个 helper + 自定义 handler 类型：\n```go\ntype AuthedHandler func(w http.ResponseWriter, r *http.Request, uid int64) error\n\nfunc (h *Handler) wrap(fn AuthedHandler) http.HandlerFunc {\n    return func(w http.ResponseWriter, r *http.Request) {\n        uid, ok := r.Context().Value(uidKey).(int64)\n        if !ok || uid <= 0 { Fail(w, 401, 2001, "未登录"); return }\n        if err := fn(w, r, uid); err != nil { h.writeError(w, r, err) }\n    }\n}\n// 使用\nmux.HandleFunc("GET /ledger", h.wrap(h.list))\n```\n好处：**uid 的获取与校验只写一次**，业务函数签名里显式出现 `uid`（不会忘），错误处理也统一了。代价是多一层包装——但换来的是「不可能忘记取 uid」这个结构保证。\n::crit handler 从 context 取 uid 时检查 `ok` 与 `> 0`，不裸断言\n::crit uid 只通过参数/context 传递，Service 结构体里没有 uid 字段\n::crit 用 helper 收敛「取值 + 校验 + 错误映射」，业务函数签名显式带 uid\n::crit 能复现「单例存 uid 导致串号」的并发 bug，并说明为何测试难发现\n\n<!--day 11-->\n::pre 完成 D10：能拿到 uid。\n::predict\n```go\nfunc (r *repo) List(ctx context.Context, month string) ([]Entry, error) {\n    rows, err := r.db.QueryContext(ctx,\n        `SELECT ... FROM entries WHERE date >= ? AND date < ?`, start, end)\n}\n```\n::ask 这个查询有什么致命问题？\n::ans **漏了 `user_id` 条件**，会返回所有用户的账目——最严重的数据越权。这类 bug 的特点：功能测试完全正常（因为你只有一个测试用户），代码评审时 `WHERE` 子句看起来很正常（有日期条件），只有多用户场景才暴露。**每一条涉及用户数据的查询，都必须带 `user_id = ?`，没有例外**。防法：① Repository 层的方法签名强制带 `uid int64`（不提供不带 uid 的版本）；② 代码评审时专门检查每个 WHERE；③ 写一个「两个用户交叉验证」的测试。\n::predict\n```go\n// 更新\nUPDATE entries SET amount = ? WHERE id = ?\n// 删除\nDELETE FROM entries WHERE id = ?\n```\n::ask 这两条有什么问题？攻击者怎么利用？\n::ans 都漏了 `AND user_id = ?`。攻击者只要猜到别人的 entry id（自增 ID 很容易枚举），就能改或删别人的账目——**水平越权**。正确写法：`WHERE id = ? AND user_id = ?`，然后检查 `RowsAffected()`：为 0 说明「不存在或不属于你」，统一返回 404（**不要返回 403**，403 会泄漏「这条记录存在但不是你的」）。`UPDATE`/`DELETE` 的 `WHERE` 条件必须和 `SELECT` 一样严格。\n::debug\n```sql\n-- 索引\nCREATE INDEX idx_date ON entries(date);\n-- 查询\nSELECT * FROM entries WHERE user_id = 1 AND date >= \'2026-10-01\' ORDER BY date DESC;\n```\n::ask 这个索引对上面的查询有效吗？该怎么建？\n::ans 部分有效但低效：`idx_date` 能用于日期范围，但 `user_id` 条件只能回表后过滤——如果某个用户数据占比很小，会扫描大量不属于他的行。正确索引：`(user_id, date)`，让「等值 + 范围」都走索引。**索引要按「查询的 WHERE 顺序」设计，不是按「哪个字段重要」**。加了 user_id 条件后，原来的索引设计要重新审视——这是加鉴权时最容易忽略的性能回归。\n::transfer\n::scene 你要在代码结构上保证「不可能写出漏 user_id 的查询」。\n::ask 有哪几种做法？各自的代价是什么？\n::hint 想想「接口设计」「数据库视图」「ORM 作用域」。\n::ans ① **接口强制**：Repository 所有方法第一个参数是 `uid int64`，内部实现必须用；不提供不带 uid 的公开方法。代价：偶尔需要「管理员查全部」时要另开接口。② **数据库视图**：`CREATE VIEW my_entries AS SELECT * FROM entries WHERE user_id = ...`——但 SQLite 视图不能用会话变量，做不到按请求过滤，不适用。③ **ORM scope / 全局钩子**：GORM 可以用 `Scopes` 或 callback 自动加条件，但隐式行为难调试。④ **代码检查**：CI 里 grep `FROM entries` 后必须跟 `user_id`，或用 `sqlc` 之类的工具生成查询。结论：**①为主（接口强制）+ ④为辅（CI 检查）**，其余两种都有明显副作用。\n::crit 所有 SELECT/UPDATE/DELETE 都带 `user_id`，且更新/删除检查 `RowsAffected`\n::crit 越权访问返回 404 而非 403（不泄漏资源存在性）\n::crit 索引按 `(user_id, date)` 重建，能说出「加了 user_id 后索引为何要变」\n::crit 有一个「A 用户尝试读/改/删 B 的记录」的测试，且断言失败\n\n<!--day 12-->\n::pre 完成 D11：数据隔离已生效。\n::predict\n```go\ntype User struct {\n    ID           int64  `json:"id"`\n    Email        string `json:"email"`\n    PasswordHash string `json:"password_hash"`\n}\n// handler\nOK(w, user)\n```\n::ask 这个响应有什么问题？\n::ans 把 `password_hash` 直接返回给客户端了。虽然哈希不可逆，但泄漏后攻击者可以离线爆破（尤其弱密码），而且这明显违反了「响应中不得包含敏感字段」的底线。修法有两条：① 加 `json:"-"` 让序列化跳过；② **用独立的响应 DTO**（`UserDTO{ID, Email}`）。**推荐 ②**——`json:"-"` 是「记得别序列化」的约定，而 DTO 是「类型上就不存在这个字段」，后者不依赖人的注意力。\n::predict\n```go\n// 同一个结构体既做 DB 模型又做 API 响应\ntype Entry struct {\n    ID        int64  `json:"id"`\n    UserID    int64  `json:"user_id"`\n    Amount    int64  `json:"amount"`\n    DeletedAt string `json:"deleted_at"`\n}\n```\n::ask 直接返回这个结构体会泄漏什么？\n::ans 泄漏 `user_id`（客户端知道内部 ID 体系，便于枚举）和 `deleted_at`（暴露软删除机制，攻击者可推测数据生命周期）。更重要的是：**DB 模型和 API 契约耦合后，任何一次表结构变更都会改变 API**——加个内部字段就意外暴露，改个字段名就破坏客户端。正确做法：DB 模型（`model.Entry`）和响应 DTO（`api.EntryResp`）分离，中间做显式映射。**多写一个映射函数的成本，远低于一次意外泄漏**。\n::debug\n```bash\ncurl -s /login -d \'{"email":"a@x.com","password":"..."}\' | grep -i \'password\\|argon\\|\\$2\'\n# 有输出\n```\n::ask 这条验收命令在查什么？为什么正则要覆盖三种形态？\n::ans 查「响应体里有没有密码相关痕迹」。三种形态：① 字段名 `password`（有人加了 `json:"password_hash"`）；② `$argon2`（哈希被塞进别的字段，比如 `note`）；③ `$2a$`/`$2b$`（bcrypt 哈希）。只查字段名会漏掉「哈希被拼进错误信息」或「被塞进其他字段」的情况。**验收脚本要检查「值的形态」，不只检查「键的名字」**。\n::transfer\n::scene 写阶段四的完整验收脚本。\n::ask 列出必须验证的项，以及每项的具体命令。\n::hint 覆盖：注册、登录、无 token、A/B 隔离、响应无哈希、改密码后旧 token 失效。\n::ans\n```bash\n# 1 注册 A、B（用时间戳保证唯一）\n# 2 登录 A、B 拿 token\n# 3 无 token 访问 /ledger → 401\n# 4 错 token 访问 → 401\n# 5 A 创建一条 → 201\n# 6 A 列表能看到 1 条\n# 7 B 列表看到 0 条          ← 数据隔离核心\n# 8 B 用 A 的 entry_id 查详情 → 404\n# 9 B 用 A 的 entry_id 删除 → 404，且 A 的数据还在\n# 10 所有响应 grep -Ei \'password|argon2|\\$2[aby]\\$\' → 无输出\n# 11 A 改密码 → 旧 token 访问 → 401（若实现了 token_version）\n```\n第 7、8、9 是核心——**「A 看不到 B」不能只测列表，还要测单条详情与写操作**，因为漏 user_id 的位置往往只在其中一个。第 11 项取决于是否实现了吊销，没做要明确写「未实现」而不是假装通过。\n::crit 响应里搜不到 `password` / `argon2` / `$2a$` 任一形态\n::crit 有「A 创建、B 看不到、B 改不动、B 删不掉」四项交叉测试\n::crit 无 token 与错 token 都返回 401，且错误码一致\n::crit 用 DTO 而非 DB 模型做响应，`user_id`/`deleted_at` 不外泄\n',kf='<!--day 1-->\n::pre 完成阶段四；现在 handler、service、store 都混在少数几个文件里。\n::predict\n```\ninternal/\n  handler.go\n  service.go\n  store.go\n  model.go\n```\n::ask 这个结构在「加一个新接口」时会遇到什么问题？\n::ans 三个：① 文件会无限膨胀，`handler.go` 里同时有账目、分类、预算、导出的 handler，找代码靠搜索；② **看不到依赖方向**——`handler.go` 可以直接调 `store.go`，没人拦得住；③ 测试不好切分，测 handler 却要连带真数据库。按职责分目录（而不是按「层名」分文件）能让「谁能引用谁」在目录结构上可见，也便于用 `go list` 分析依赖。**目录结构不是审美，是约束的载体**。\n::predict\n```\ninternal/\n  httpapi/     ← handler\n  ledger/      ← service\n  store/       ← repository\n  model/       ← 共享类型\n```\n::ask `model` 包存在的理由是什么？如果不要它，会怎样？\n::ans 如果没有 `model`，`store` 要返回 `[]Entry` 就得自己定义 `Entry`，而 `ledger` 也要 `Entry`——两份同名类型无法互通，接口实现不了（D8 讲过的类型不匹配）。放 `model` 让两边都依赖它，形成 `store → model`、`ledger → model` 的 DAG。**共享的领域类型必须下沉到最底层包**，这是打破循环依赖的标准手段。代价是 `model` 会变成「什么都往里放」的杂物间——要克制，只放真正跨层共享的结构。\n::debug\n```\ninternal/\n  ledger/\n    service.go      import "…/internal/store"\n  store/\n    sqlite.go       import "…/internal/ledger"   // 为了用 Entry\n```\n::sym `import cycle not allowed`。\n::ask 除了抽 `model`，还有别的解法吗？各自代价？\n::ans ① 抽 `model`（推荐）：两边都依赖它，环断了，语义清晰。② 在 `store` 里定义 `Entry`，`ledger` 依赖 `store`：能跑，但 `ledger` 被绑死在存储层，测试时无法脱离 store 包（连 fake 都得 import 它）。③ 用 `any` 或 map 传数据：彻底放弃类型安全，最差。**遇到循环依赖时，第一反应应该是「哪个类型放错了层」，而不是「怎么用接口绕过去」**——绕过只会把问题推到运行时。\n::transfer\n::scene 为这个项目设计完整的目录树，包含 `cmd/`、`internal/`、`migrations/`。\n::ask 画出目录树，并标注每个包的「允许依赖谁」。\n::hint 想想「谁能 import 谁」用一句话能不能说清。\n::ans\n```\ncmd/ledger-api/main.go       → 只做装配：config → db → store → service → router\ninternal/\n  config/     → 无内部依赖（只读环境变量/文件）\n  model/      → 无内部依赖（纯结构体）\n  store/      → model\n  ledger/     → model, store(接口在自己的包里定义)\n  httpapi/    → ledger, model（不 import store）\n  platform/   → 日志、request id 等横切工具，无业务依赖\nmigrations/   → 纯 SQL，不参与编译\n```\n一句话规则：**依赖只能从上往下，横切工具不反向依赖业务**。`main` 是唯一知道所有具体实现的地方——它是「组装车间」，不写业务逻辑。验证方法：`go list -deps ./internal/httpapi | grep internal/` 看看有没有意外依赖。\n::crit 目录按职责分，`main` 只做装配\n::crit 有 `model` 包承载跨层共享类型，依赖图无环\n::crit 能说出每个包「允许 import 谁」，并且实际代码符合\n::crit `go list -deps` 能验证 httpapi 没有间接依赖 store\n\n<!--day 2-->\n::pre 完成 D1：目录骨架已定。\n::predict\n```go\n// internal/ledger/service.go\ntype Store interface {\n    Create(ctx context.Context, e model.Entry) (int64, error)\n    Get(ctx context.Context, uid, id int64) (*model.Entry, error)\n    List(ctx context.Context, uid int64, q Query) ([]model.Entry, int64, error)\n    Update(ctx context.Context, e model.Entry) error\n    Delete(ctx context.Context, uid, id int64) error\n    Sum(ctx context.Context, uid int64, month string) ([]model.CategorySum, error)\n}\n```\n::ask 这个接口放在 `ledger` 包（使用方）而不是 `store` 包，好处是什么？有什么代价？\n::ans 好处：`ledger` 不依赖 `store`，测试时用 fake 实现即可，`store` 变成可替换的插件。代价：① `store` 包必须 import `ledger` 才能声明「我实现了它」——不行，那又成环了。实际做法是**不做显式断言**，靠 `main` 里赋值时编译检查（`var _ ledger.Store = (*store.SQLite)(nil)` 必须写在 `main` 或 `store` 里，写在 store 里就要 import ledger）。这是 Go 的一个真实痛点：接口在 A 包、实现在 B 包、断言又需要互相引用。折中：断言写在 `main.go`（它本来就依赖两边）。\n::predict\n```go\nfunc New(db *sql.DB) *Service { ... }\nfunc main() {\n    db := openDB()\n    svc := ledger.New(db)          // 直接传 db\n}\n```\n::ask 这样「手动依赖注入」还剩下什么？问题在哪？\n::ans 这不是注入，是把 `db` 直接塞进 `Service`——`ledger` 又依赖了 `*sql.DB`，之前的分层白做了。正确装配：`store := store.NewSQLite(db)`（store 包内部持有 db）→ `svc := ledger.New(store)`（ledger 只看到接口）→ `h := httpapi.New(svc)`。**依赖注入的本质是「高层不知道低层的具体类型」**，如果 `main` 里出现了 `sql.DB` 之外的存储细节（比如 GORM 的 `*gorm.DB`），说明注入点选错了。\n::debug\n```go\n// main.go\nsvc := ledger.New(store.NewSQLite(db))\nh := httpapi.New(svc)\n// 测试 httpapi 时\nh := httpapi.New(???)   // 要传真的 Service\n```\n::ask handler 测试为什么会卡住？怎么解？\n::ans 因为 `httpapi.New` 接受 `*ledger.Service` 具体类型，测试必须构造真的 Service（连带真的 Store 和真数据库）。解法：`httpapi` 自己定义所需接口（比如 `type Ledger interface{ Create...; List... }`），`New(svc Ledger)`。这样测试传 fake 即可。**每个包都定义自己需要的接口**——`httpapi` 定义 `Ledger` 接口，`ledger` 定义 `Store` 接口，形成「层层向内收窄」的接口链。代价是接口变多，但每个都很小（3-6 个方法），整体反而更清晰。\n::transfer\n::scene 画出三层接口与实现的完整依赖关系，并说明 `main` 里装配的每一行。\n::ask 写出 `main.go` 的装配代码，标注每行的作用。\n::hint 从 config 开始，一路到 router。\n::ans\n```go\nfunc main() {\n    cfg, err := config.Load()                    // 1. 配置（失败即退出）\n    if err != nil { log.Fatal(err) }\n\n    db, err := store.Open(cfg.DBPath)            // 2. 连接池 + Ping\n    if err != nil { log.Fatal(err) }\n    defer db.Close()\n\n    if err := store.Migrate(db); err != nil {    // 3. 迁移（部署时也可独立执行）\n        log.Fatal(err)\n    }\n\n    repo := store.NewSQLite(db)                  // 4. 具体实现\n    svc := ledger.New(repo)                      // 5. 依赖接口，不知道 SQLite\n    h := httpapi.New(svc, cfg.JWTSecret)         // 6. 依赖接口，不知道 Service 实现\n    srv := &http.Server{Handler: h.Router(), ... } // 7. 超时\n}\n```\n关键点：**第 4 行之后，`db` 只出现在 `defer db.Close()` 里**，任何一层的函数签名都不该再出现 `*sql.DB`。这是「装配」与「业务」的分界线。\n::crit 每个包定义自己所需的窄接口，不跨层引用具体类型\n::crit `main` 只做装配，装配代码不超过 30 行且不含业务判断\n::crit 编译期断言（`var _ X = (*Y)(nil)`）写在依赖双方都可见的位置\n::crit 能为 handler 传入 fake，测试不需要真数据库\n\n<!--day 3-->\n::pre 完成 D2：接口与装配方案已定。\n::predict\n```go\n// 重构前：handler 里有一句\nif e.Amount <= 0 { Fail(w, 400, ...); return }\n// 重构后搬到 service\nfunc (s *Service) Create(ctx context.Context, in CreateInput) (int64, error) {\n    if in.Amount <= 0 { return 0, &ValidationError{...} }\n    ...\n}\n// 但 handler 里原来的 HTTP 校验没删\n```\n::ask 会发生什么？\n::ans 重复校验，且**两处的错误响应可能不一致**（handler 返回 400/1001，service 返回 400/1002），前端无法预期。更糟的是维护时只改一处。重构的原则是「**搬移而不是复制**」：逻辑从 A 移到 B 后，A 处必须删掉。检查方法：重构后 grep 关键判断（`Amount <= 0`），应该只出现一次。**「复制粘贴式重构」是最常见的伪重构**，它让代码看起来分层了，实际规则有两份。\n::predict\n```go\n// 重构前 handler: 查不到返回 404\nif errors.Is(err, sql.ErrNoRows) { Fail(w, 404, ...) }\n// 重构后 service 返回 sql.ErrNoRows 给 handler\n```\n::ask 这样分层干净吗？\n::ans 不干净：`httpapi` 需要 import `database/sql` 才能判断 `ErrNoRows`，等于 HTTP 层依赖了存储层细节。正确做法：**service 把 `sql.ErrNoRows` 翻译成领域错误 `ledger.ErrNotFound`**，handler 只认领域错误。翻译发生在「跨越层边界」的地方，通常是 repository 或 service 的入口。**每一层只暴露自己语义的错误**，这样换存储实现时上层不用改。\n::debug\n```bash\n# 重构后跑 smoke\ncurl -X POST /ledger -d \'{"amount":0,...}\'   # 期望 400\n# 实际 500\n```\n::ask 最可能的原因是什么？\n::ans service 返回了 `ValidationError`，但 handler 的错误映射还是旧的（只认 `sql.ErrNoRows` 和「其他 → 500」），所以校验错误掉进了 default → 500。重构时最容易漏的就是**错误映射这一层**：逻辑搬走了，映射没跟上。修法：先把错误映射写成表驱动/集中函数，重构后为每种错误类型各写一个测试用例（400/404/409/500 各一条）。**重构的安全网是「错误路径的测试」，不是「正常路径的 smoke」**。\n::transfer\n::scene 把 handler 里的业务逻辑搬到 service，你要保证「行为完全不变」。\n::ask 列出你会做的检查（至少 5 条），并说明每条抓什么类型的问题。\n::hint 从「错误语义、默认值、执行顺序、事务边界、日志」五个角度想。\n::ans ① **错误语义**：`sql.ErrNoRows` 是否被翻译成 `ErrNotFound`（404 会变 500）；② **默认值**：`limit` 缺省 20 是否跟着搬了（不搬会变成 0，返回空列表）；③ **执行顺序**：原来「先校验再查库」，搬完是否变成「先查库再校验」（多一次查询 + 错误优先级变了）；④ **事务边界**：原来在 handler 里开事务，搬到 service 后是否还在同一事务（跨层事务最容易丢）；⑤ **日志与 request_id**：原来 handler 打的日志是否还在（丢了排查能力）。这五类都不会编译失败，只能靠对照测试抓。**重构前先写「行为快照」测试，重构后跑同一套**。\n::crit handler 里搜不到业务判断（金额、分类、权限规则）\n::crit service 返回领域错误，httpapi 不 import `database/sql`\n::crit 重构前后同一套接口测试全部通过（含错误路径）\n::crit 关键校验只出现一次（grep 验证没有复制残留）\n\n<!--day 4-->\n::pre 完成 D3：分层重构完成。\n::predict\n```go\ndb, err := gorm.Open(sqlite.Open("ledger.db"), &gorm.Config{})\n```\n::ask 这行代码建立连接了吗？连接池怎么配？\n::ans `gorm.Open` 会**立即 Ping 一次**（除非 `DisableAutomaticPing: true`），所以比 `sql.Open` 更能暴露「连不上」。但连接池不在 GORM 层配，要取出底层 `*sql.DB`：\n```go\nsqlDB, err := db.DB()\nsqlDB.SetMaxOpenConns(1)\nsqlDB.SetMaxIdleConns(1)\nsqlDB.SetConnMaxLifetime(0)\n```\n很多人只写 `gorm.Open` 就以为配好了，结果用的是 `database/sql` 的默认值（`MaxOpenConns` 无限制、`MaxIdleConns` 2），在 SQLite 上直接引发 BUSY。**GORM 是 `database/sql` 的上层封装，连接池永远是底层的事**。\n::predict\n```go\ndb, _ := gorm.Open(sqlite.Open("file:ledger.db?_pragma=busy_timeout(5000)"), &gorm.Config{\n    Logger: logger.Default.LogMode(logger.Info),\n})\n// 生产环境\n```\n::ask 生产环境开 `logger.Info` 有什么问题？\n::ans 会把**每一条 SQL 和参数**打到日志里，包括金额、备注等用户数据，还可能包含密码哈希（注册时）。后果：日志体积暴涨、隐私泄漏、性能下降（同步写日志）。生产应该用 `logger.Warn` 或 `logger.Error`，只在排查时临时开 Info。更稳妥的做法是接一个自定义 logger，把慢查询（> 200ms）单独记录。**「SQL 日志」和「用户数据」必须有边界**。\n::debug\n```go\ndb, _ := gorm.Open(sqlite.Open("ledger.db"), &gorm.Config{})\n// 并发写入时\nError: database is locked (5) (SQLITE_BUSY)\n```\n::ask 除了设 `MaxOpenConns(1)`，还有哪些配置能缓解？\n::ans ① DSN 加 `_pragma=busy_timeout(5000)`，让驱动等锁而不是立刻失败；② `_pragma=journal_mode(WAL)` 提升读并发（写仍串行）；③ `_pragma=foreign_keys(1)` 开启外键约束（SQLite 默认关闭，很多人不知道）；④ `_pragma=synchronous(NORMAL)` 在 WAL 下兼顾安全与性能。注意：**这些 pragma 要写在 DSN 里或用 `Exec` 在连接建立时执行**，写在 `gorm.Open` 之后可能只对当前连接生效，池里新连接不会继承。**连接级的配置必须通过 DSN，不能靠初始化时执行一次**。\n::transfer\n::scene 写一个 `store.Open(path string) (*gorm.DB, error)`，把上面所有配置固化进去。\n::ask 写出实现，并说明每个配置的理由。\n::hint 注意 DSN 拼接要处理已有参数的情况。\n::ans\n```go\nfunc Open(path string) (*gorm.DB, error) {\n    dsn := path + "?_pragma=busy_timeout(5000)&_pragma=journal_mode(WAL)&_pragma=foreign_keys(1)&_pragma=synchronous(NORMAL)"\n    db, err := gorm.Open(sqlite.Open(dsn), &gorm.Config{\n        Logger: logger.Default.LogMode(logger.Warn),   // 生产不打全量 SQL\n        NowFunc: func() time.Time { return time.Now().UTC() },\n    })\n    if err != nil { return nil, fmt.Errorf("open db: %w", err) }\n\n    sqlDB, err := db.DB()\n    if err != nil { return nil, err }\n    sqlDB.SetMaxOpenConns(1)      // SQLite 单写者，避免 BUSY\n    sqlDB.SetMaxIdleConns(1)      // 保持连接常驻，避免反复打开文件\n    sqlDB.SetConnMaxLifetime(0)   // 本地文件无服务端断连问题\n\n    ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)\n    defer cancel()\n    if err := sqlDB.PingContext(ctx); err != nil {\n        return nil, fmt.Errorf("ping: %w", err)\n    }\n    return db, nil\n}\n```\n每个配置都有理由，没有一行是「抄来的」：busy_timeout 防瞬时锁冲突、WAL 提读并发、foreign_keys 是 SQLite 默认关闭的坑、UTC 避免时区导致的「跨月」错误。\n::crit 从 `db.DB()` 取出 `*sql.DB` 并显式配置三个池参数\n::crit pragma 写在 DSN 里，不靠初始化时执行一次\n::crit 生产日志级别不是 Info，不打印全量 SQL 与参数\n::crit 启动时 `PingContext` 带超时，连不上立即失败\n\n<!--day 5-->\n::pre 完成 D4：GORM 已接入。\n::predict\n```go\ntype Entry struct {\n    ID       int64\n    UserID   int64\n    Amount   int64\n    Category string\n    Date     time.Time\n}\n```\n::ask 这个模型直接给 GORM 用，表名和列名会是什么？有什么问题？\n::ans 表名默认是结构体的**复数蛇形**：`entries`（GORM 的命名策略）。列名是 `id`、`user_id`、`amount`、`category`、`date`。问题：① `Date time.Time` 在 SQLite 里会存成 `2026-10-19 00:00:00+00:00` 这种带时区的字符串，`LIKE \'2026-10%\'` 能用但范围比较和字符串比较混用容易出错；② 没有索引声明；③ 没有约束（金额 > 0）。**默认命名能跑，但「能跑」和「可控」是两回事**——生产模型应该显式写 tag。\n::predict\n```go\nAmount int64 `gorm:"not null;check:amount > 0"`\nDate   string `gorm:"type:text;index"`\n```\n::ask `check` 约束在 SQLite 上会生效吗？GORM 会自动建吗？\n::ans `AutoMigrate` 会尝试创建 CHECK 约束，但 **SQLite 的 ALTER TABLE 能力有限**——对已存在的表加 CHECK 需要重建表，GORM 的 AutoMigrate 在 SQLite 上经常「静默跳过」这类变更（不报错但也没加上）。所以**约束必须写在迁移 SQL 里**，不能依赖 AutoMigrate。这也说明了 D10 为什么要用 goose：AutoMigrate 在 SQLite 上的行为不可靠，而迁移文件是确定的。\n::debug\n```go\ntype Entry struct {\n    ID     int64 `gorm:"primaryKey"`\n    Amount int64\n}\n// 查询\nvar e Entry\ndb.First(&e, 1)\n// 但表里主键列叫 entry_id\n```\n::ask 什么时候会出现「列名和字段名不一致」？怎么避免？\n::ans 当有人显式写了 `gorm:"column:entry_id"`，或者用了自定义 `NamingStrategy`（比如把 `ID` 映射成 `id` 之外的名字），或者表是从旧系统迁移来的。避免方式：**所有字段都显式写 `column` tag**，尤其是 `ID`、`UserID` 这种容易歧义的。显式写 tag 的另一个好处是：模型即文档，看代码就知道表结构长什么样，不用去查 GORM 的命名规则。**隐式约定在跨团队/跨时间时最贵**。\n::transfer\n::scene 设计 `Entry` 和 `User` 两个模型的完整 tag，包含主键、索引、约束、时间字段。\n::ask 写出模型，并说明每个 tag 的作用与「不加会怎样」。\n::hint 想查询会怎么用：按用户+日期、按分类聚合、软删除？\n::ans\n```go\ntype Entry struct {\n    ID        int64     `gorm:"primaryKey;autoIncrement" json:"id"`\n    UserID    int64     `gorm:"not null;index:idx_user_date,priority:1" json:"-"`\n    Amount    int64     `gorm:"not null" json:"amount"`                        // 分\n    Category  string    `gorm:"type:text;not null;default:未分类" json:"category"`\n    Date      string    `gorm:"type:text;not null;index:idx_user_date,priority:2" json:"date"` // YYYY-MM-DD\n    Note      string    `gorm:"type:text" json:"note"`\n    CreatedAt time.Time `gorm:"not null" json:"created_at"`\n    UpdatedAt time.Time `gorm:"not null" json:"updated_at"`\n    DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`\n}\n```\n要点：**联合索引 `(user_id, date)` 用 `priority` 控制列顺序**（顺序错了索引失效）；`json:"-"` 挡住 `user_id` 与软删除字段外泄；`Date` 用 string 而不是 `time.Time`，避免 SQLite 的时区序列化问题；`Amount` 是 int64 存分。**每个 tag 都对应一个具体后果**，不是装饰。\n::crit 每个字段都有显式 `column` 或明确的命名策略\n::crit 联合索引用 `priority` 明确列顺序，且与查询的 WHERE 顺序一致\n::crit 敏感/内部字段用 `json:"-"`，响应不外泄\n::crit 知道 CHECK 约束在 SQLite 上要写迁移，不能依赖 AutoMigrate\n\n<!--day 6-->\n::pre 完成 D5：模型与 tag 已定。\n::predict\n```go\nfunc (r *repo) Get(ctx context.Context, uid, id int64) (*model.Entry, error) {\n    var e model.Entry\n    if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, uid).First(&e).Error; err != nil {\n        return nil, err\n    }\n    return &e, nil\n}\n```\n::ask 这段代码在「同一个 `*gorm.DB` 被多次复用」时会有什么风险？\n::ans `WithContext` 返回的是一个**新的 `*gorm.DB` 实例**（clone），但它内部复用同一个 `Statement` 对象的部分状态。更关键的是：`r.db` 是全局单例，如果上游某处写了 `r.db.Where(...)` 并把这个返回值存起来复用，链式条件会**跨请求累积**（`Statement.Clauses` 被污染）。典型症状：A 查过一次 `user_id=1`，B 的查询莫名带上了 `user_id=1`。用 `Session(&gorm.Session{NewDB: true})` 可以彻底清空链式状态。\n::predict\n```go\ntx := r.db.WithContext(ctx)\ntx.Where("user_id = ?", uid).Find(&list)\ntx.Where("amount > ?", 100).Find(&list2)\n```\n::ask 第二条查询的 WHERE 是什么？\n::ans 是 `WHERE user_id = ? AND amount > 100`——**`tx.Where` 会修改 `tx` 自身的 Statement**，两次调用在同一个实例上累积。这是 GORM 最常见的一个陷阱：链式方法不是「返回新对象」，而是「修改当前对象并返回自己」（在非 `NewDB` 模式下）。所以要么每次都从 `r.db` 重新开始，要么用 `Session(NewDB: true)` 拿一个干净副本。**「链式调用会互相污染」这一条，能解释 80% 的 GORM 诡异查询**。\n::debug\n```go\nfunc (r *repo) List(ctx context.Context, uid int64) ([]Entry, error) {\n    var out []Entry\n    tx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})\n    return out, tx.Where("user_id = ?", uid).Find(&out).Error\n}\n// 但 ctx 已经在请求结束时取消了\n// 下一个请求复用这个 session？\n```\n::ask 把带 `Context: ctx` 的 session 存到结构体里复用，会怎样？\n::ans 那个 session 绑定的 ctx 在请求结束后被 cancel，之后所有用它的查询都会立刻返回 `context canceled`——**服务看起来「突然全挂了」，重启才恢复**。这正是「禁止把 ctx 存进长生命周期对象」的原因（D10 阶段四讲过）。正确做法：每次方法调用都用**当前请求的 ctx** 新建 session：\n```go\ntx := r.db.Session(&gorm.Session{NewDB: true, Context: ctx})\n```\n`ctx` 从参数来，生命周期与请求一致，用完即弃。**session 可以复用的是「配置」，不能复用的是「ctx」**。\n::transfer\n::scene 为 Repository 写一个统一的「取干净 session」辅助函数，并说明它解决的问题。\n::ask 写出函数，列出它必须设置的字段与理由。\n::hint 想想 `NewDB`、`Context`、`Logger` 三个字段。\n::ans\n```go\nfunc (r *repo) session(ctx context.Context) *gorm.DB {\n    return r.db.Session(&gorm.Session{\n        NewDB:   true,   // 清空链式条件，杜绝跨请求/跨语句污染\n        Context: ctx,    // 绑定请求作用域，随取消传播到驱动层\n        Logger:  r.log,  // 统一日志（可选，便于慢查询追踪）\n    })\n}\n```\n解决的问题：① **条件残留**——`NewDB: true` 保证每次从干净状态开始；② **取消传播**——`Context: ctx` 让 SQL 在客户端断开时尽快结束；③ **观测**——统一 logger 便于统一加慢查询阈值。用 `session(ctx)` 替代 `r.db.WithContext(ctx)` 后，「链式污染」和「ctx 不传播」两类问题同时消失。**把正确的用法固化成唯一的入口，比靠每个人记得怎么写可靠**。\n::crit Repository 所有方法都通过统一的 `session(ctx)` 取 DB，不直接用 `r.db`\n::crit `NewDB: true` 与 `Context: ctx` 同时设置，能解释各自解决什么\n::crit 没有把带 ctx 的 session/DB 存进结构体或包级变量\n::crit 能复现「链式条件污染」，并说明 `NewDB` 为什么能解决\n\n<!--day 7-->\n::pre 完成 D6：已用统一 session。\n::predict\n```go\n// 实验：观察 WithContext 是否清空链式条件\nbase := db.Where("user_id = ?", 1)\na := base.WithContext(ctx).Where("amount > ?", 100).Find(&x)\nb := base.WithContext(ctx).Find(&y)\n```\n::ask `b` 的 SQL 里有没有 `amount > 100`？\n::ans 没有。`WithContext` 内部是 `Session(&Session{Context: ctx})`，它在 clone 时会**复制当前 Statement**，但 `NewDB` 为 false 意味着**保留已有的链式条件**。所以 `b` 会带 `user_id = 1`（来自 base），但不带 `amount > 100`（那是 a 自己的分支）。关键点：**`WithContext` 解决「ctx 绑定」，不解决「条件隔离」**；`NewDB: true` 才解决后者。两者是正交的，必须一起用。\n::predict\n```go\na := db.Session(&gorm.Session{NewDB: true}).Where("user_id = ?", 1)\nb := a.Where("amount > ?", 100)\n```\n::ask `b` 的 WHERE 有几条？`a` 会不会被 `b` 影响？\n::ans `b` 有两条（`user_id` + `amount`）；`a` **会**被影响——因为 `b := a.Where(...)` 修改的是 `a` 的 Statement（非 NewDB 模式下 clone 是浅拷贝共享 Statement）。想真正隔离，`b` 也必须从 `Session(NewDB: true)` 开始，或者用 `a.Session(&gorm.Session{})`（空 Session 会 clone 出独立 Statement）。**这就是为什么「统一 session() 入口」比「记住什么时候该 clone」更可靠**。\n::debug\n```go\n// 用 Debug 观察真实 SQL\ntx := db.Session(&gorm.Session{NewDB: true, Context: ctx})\ntx.Debug().Where("user_id = ?", 1).Find(&a)\ntx.Debug().Where("amount > ?", 100).Find(&b)\n```\n::ask 第二条 SQL 里会不会有 `user_id = 1`？\n::ans 不会——因为每次都从 `NewDB: true` 的 session 开始（这里 `tx` 是同一个变量，但 `Where` 返回新 clone？不，`tx.Where()` 修改 `tx`）。这里有歧义，必须实测。**结论取决于 `tx` 是否被 `Where` 修改**：在 GORM v2 中，`tx.Where()` 在 `NewDB` session 上会 clone 出新实例（因为 `clone == 1` 时先 clone），所以 `tx` 本身不被修改。但这是实现细节，**不要依赖**——正确做法是每次调用都重新 `r.session(ctx)`，而不是复用中间变量。\n::transfer\n::scene 设计一个对照实验，用可观察的证据证明 `Session{NewDB, Context}` 优于 `WithContext`。\n::ask 实验步骤、观察指标、预期结论分别是什么？\n::hint 用 `db.Debug()` 或 `DryRun` 拿到 SQL；用 `context.WithCancel` 验证取消传播。\n::ans\n**实验一（条件隔离）**：\n```go\nbase := db.Where("user_id = ?", 1)\nx := base.Session(&gorm.Session{Context: ctx}).Where("amount > 100")\nfmt.Println(x.Debug().Find(&[]Entry{}).Statement.SQL.String())   // 观察是否含两条\ny := base.Session(&gorm.Session{NewDB: true, Context: ctx}).Where("amount > 100")\nfmt.Println(y.Debug().Find(&[]Entry{}).Statement.SQL.String())   // 观察是否只有 amount\n```\n**实验二（取消传播）**：`ctx, cancel := context.WithCancel(...)`，开一个 `Find` 后 10ms 内 cancel，看是否返回 `context canceled`（真连接下有效，`DryRun` 无效）。\n**指标**：生成的 SQL 文本、错误值。\n**结论**：`NewDB` 决定条件是否继承，`Context` 决定取消是否传播，二者正交。\n**证据形态**：把两段 SQL 打出来存成测试断言——**不是"我知道它更好"，而是"这段代码证明了它不一样"**。\n::crit 能用 `Debug()`/`DryRun` 打出真实 SQL 作为证据\n::crit 能说出 `WithContext` 与 `Session{NewDB}` 各自解决什么问题（正交）\n::crit 理解「链式方法会修改当前实例」，不依赖实现细节\n::crit 用 `context.WithCancel` 验证了取消确实传播到驱动\n\n<!--day 8-->\n::pre 完成 D6-D7：session 用法正确。\n::predict\n```go\n// 把金额改成 0\ndb.Model(&Entry{}).Where("id = ?", 1).Updates(Entry{Amount: 0})\n```\n::ask 金额会被改成 0 吗？\n::ans 不会。`Updates` 用结构体时**默认忽略零值字段**（0、""、false、nil），所以 `Amount: 0` 被跳过，SQL 里根本没有 `amount` 这一列。这是 GORM 最著名的坑之一。修法：① 用 map：`Updates(map[string]any{"amount": 0})`；② 用 `Select("amount").Updates(...)` 显式指定字段。**「更新为 0」和「不更新」在结构体里长得一样**，必须用 map 或 Select 区分。\n::predict\n```go\ntype Entry struct {\n    Amount   int64\n    Category string\n}\ndb.Model(&Entry{}).Where("id = ?", 1).Updates(map[string]any{\n    "amount":   3550,\n    "category": "",\n})\n```\n::ask `category` 会被更新成空字符串吗？\n::ans 会。map 形式不忽略零值，`""` 会被写入。这正好和结构体形式相反——**同一个方法，两种入参，两套零值语义**。所以选择哪种形式要明确：想「只更新非零字段」用结构体（比如 PATCH 语义），想「精确设置每个字段」用 map（比如 PUT 语义）。混用会导致「明明传了空值却没生效」或「没想清空却被清空」。\n::debug\n```go\ndb.Model(&Entry{}).Where("id = ?", id).Updates(Entry{Amount: amount, Category: cat})\n// amount 传 0（用户改成 0 元，业务上非法但校验漏了）\n// 结果：更新成功，但 amount 没变\n// 而且 RowsAffected = 1（因为 category 变了或没变？）\n```\n::ask `RowsAffected` 能用来判断「记录是否存在」吗？\n::ans **不能**。SQLite 的 `UPDATE` 即使没有实际改变值，`RowsAffected` 也可能返回匹配行数（取决于驱动实现）；而 GORM 在「无字段可更新」时可能返回 0。用「`RowsAffected == 0` 判断不存在」在 UPDATE 上是不可靠的。正确做法：先 `SELECT` 确认存在（在同一事务里），或用 `UPDATE ... WHERE id = ? AND user_id = ?` 后**再查一次**。`DELETE` 的 `RowsAffected` 相对可靠（删了就是 1，没删就是 0）。**「影响行数」的语义在不同数据库/驱动上不一致，不要用它做业务判断**。\n::transfer\n::scene 实现 PATCH 语义的更新：只更新请求里出现的字段。\n::ask 用结构体还是指针还是 map？怎么区分「没传」和「传了零值」？\n::hint 想想 `*int64` 的 nil 与指向 0。\n::ans 用**指针字段的 DTO**：\n```go\ntype UpdateInput struct {\n    Amount   *int64  `json:"amount"`\n    Category *string `json:"category"`\n    Note     *string `json:"note"`\n}\n```\n`nil` = 没传（不更新），`&0` = 传了 0（要更新成 0，但业务上非法 → 校验拒绝）。构造 map 时只放非 nil 的字段：\n```go\nupdates := map[string]any{}\nif in.Amount != nil { updates["amount"] = *in.Amount }\nif in.Category != nil { updates["category"] = *in.Category }\n```\n这样「没传」和「传了零值」在类型层面就分开了。**PATCH 的正确实现必须能表达「字段缺席」**，结构体做不到，指针可以。\n::crit 更新为 0/空串时用 map 或 `Select`，不用裸结构体\n::crit 知道 map 与结构体的零值语义相反，能说出各自适用场景\n::crit 不用 `RowsAffected` 判断记录是否存在\n::crit PATCH 用指针字段区分「未传」与「传了零值」\n\n<!--day 9-->\n::pre 完成 D8：CRUD 可用。\n::predict\n```go\nfunc (r *repo) Transfer(ctx context.Context, from, to int64, cents int64) error {\n    return r.db.WithContext(ctx).Transaction(func(tx *gorm.DB) error {\n        if err := tx.Exec("UPDATE ... WHERE id = ?", from).Error; err != nil { return err }\n        return tx.Exec("UPDATE ... WHERE id = ?", to).Error\n    })\n}\n```\n::ask 事务内的 `tx` 有没有绑定调用方的 ctx？\n::ans **没有**。`Transaction` 的回调收到的是 `tx`，它继承的是 `r.db` 的配置，**不会自动带上你 `WithContext(ctx)` 的 ctx**（GORM 的 `Transaction` 内部会创建新 session）。所以在事务内调用 `tx.Exec` 时，取消信号传不到驱动——客户端断开了，事务还在跑。修法：在回调里第一步 `tx = tx.WithContext(ctx)`，或者用 `r.db.Session(&gorm.Session{Context: ctx}).Transaction(...)` 并确认 ctx 被继承（实测）。**「事务内的 ctx 要显式补」是 GORM 的一个真实陷阱**。\n::predict\n```go\nerr := db.Transaction(func(tx *gorm.DB) error {\n    if err := tx.Create(&a).Error; err != nil { return err }\n    if err := tx.Create(&b).Error; err != nil { return err }\n    return nil\n})\n```\n::ask 如果第二个 `Create` 失败，第一个会回滚吗？如果回调里 panic 呢？\n::ans 第二个返回 err → `Transaction` 自动 rollback，第一个不会留下。**panic 也会 rollback**（GORM 在 defer 里有 recover，rollback 后重新 panic）。这是 `Transaction` 相比手写 `Begin/Commit` 的优势：**回滚路径由框架保证，不依赖你记得写 `defer tx.Rollback()`**。但要注意：回调里如果启动了 goroutine 并让它用 `tx`，那个 goroutine 不受事务生命周期管理——**事务内不要起异步任务**。\n::debug\n```go\ndb.Transaction(func(tx *gorm.DB) error {\n    tx.Create(&a)             // 错误没检查\n    return tx.Create(&b).Error\n})\n```\n::ask 这样写有什么问题？\n::ans 如果 `a` 的 Create 失败（比如约束冲突），错误被忽略，`b` 成功，事务提交——**a 没写进去但整体成功了**。事务只保证「返回值非 nil 才回滚」，不检查你内部是否吞了错误。**事务里的每一步都必须检查 error 并 return**，否则事务就是个摆设。这是「事务不等于原子性」的另一种形态：原子性依赖你正确地使用它。\n::transfer\n::scene 实现「创建账目 + 更新预算已用额度」的双写操作。\n::ask 事务边界怎么划？预算更新失败时创建要回滚吗？给出决策与理由。\n::hint 想「这两个写操作在业务上是不是一个整体」。\n::ans 在同一个事务里：\n```go\nerr := r.session(ctx).Transaction(func(tx *gorm.DB) error {\n    tx = tx.WithContext(ctx)              // 补 ctx\n    if err := tx.Create(&e).Error; err != nil { return err }\n    if err := tx.Model(&Budget{}).\n        Where("user_id = ? AND category = ? AND month = ?", uid, e.Category, month).\n        UpdateColumn("used", gorm.Expr("used + ?", e.Amount)).Error; err != nil {\n        return err\n    }\n    return nil\n})\n```\n理由：预算的「已用」是账目的派生数据，两者不一致会让用户看到错误的剩余额度。**派生数据要么在同一事务里更新，要么干脆不存（每次实时算）**。家庭账本数据量小，其实更推荐「不存 used，统计时 SUM」——少一个一致性负担。**如果可以选择不冗余，就不要冗余**。\n::crit 事务回调内显式补 `WithContext(ctx)`\n::crit 事务内每一步都检查 error 并 return，不吞错\n::crit 知道 panic 会自动回滚，但事务内不起异步 goroutine\n::crit 能判断「哪些写操作必须同事务」，并考虑过「不冗余」的替代方案\n\n<!--day 10-->\n::pre 完成 D4-D9：GORM 已能跑通。\n::predict\n```go\n// migrations/00001_init.up.sql\nCREATE TABLE entries (...);\n-- +goose Down\nDROP TABLE entries;\n```\n::ask 少了什么标记会让 goose 不认这个文件？\n::ans 缺少 `-- +goose Up` 标记。goose 要求文件里明确分区：\n```sql\n-- +goose Up\nCREATE TABLE entries (...);\n\n-- +goose Down\nDROP TABLE entries;\n```\n`Up` 段是迁移执行的内容，`Down` 段是回滚。如果只有 `Down` 没有 `Up`，goose 会报「no Up statements」。另外文件名要符合 `NNNNN_name.sql` 格式（如 `00001_create_entries.sql`），编号决定执行顺序。**goose 靠「标记 + 文件名」两个约定工作，缺一个就跑不起来**。\n::predict\n```sql\n-- +goose Up\nALTER TABLE entries ADD COLUMN budget_id INTEGER NOT NULL DEFAULT 0;\n-- +goose Down\nALTER TABLE entries DROP COLUMN budget_id;\n```\n::ask 在 SQLite 上这两条都能执行吗？\n::ans `ADD COLUMN` 可以（SQLite 3.35+ 支持 `DROP COLUMN`，更早版本不支持）。**SQLite 的 ALTER TABLE 能力非常有限**：不能改列类型、不能加约束、不能改主键。所以「加一个 NOT NULL 且无默认值的列」会失败（已有行没值）；「删列」在旧版本要重建表。这就是为什么 SQLite 的迁移经常写成「建新表 → 拷数据 → 删旧表 → 重命名」四步。**写 SQLite 迁移前先确认：这条 ALTER 在当前版本支持吗？**\n::debug\n```bash\ngoose -dir migrations sqlite3 ledger.db up\n# Error: failed to parse migration: no Up statements\n```\n::ask 除了缺 `-- +goose Up`，还有哪些原因？\n::ans ① 标记写成了 `-- +goose up`（**大小写敏感**，必须 `Up`）；② 标记前后有空行问题（goose 要求标记独占一行）；③ 文件里有 BOM 或 CRLF 导致匹配失败（Windows 编辑器常见）；④ 文件名不符合 `NNNNN_` 前缀，goose 直接跳过。排查：`goose status` 看它识别了哪些文件；`file migrations/*.sql` 看编码。**「迁移没执行」先看 goose 有没有识别到这个文件**，不要先怀疑 SQL。\n::transfer\n::scene 设计项目的迁移序列：初始化表、加索引、加分类表、加预算表。\n::ask 写出文件名与每个文件的核心 SQL，说明顺序理由。\n::hint 索引要不要单独一个文件？为什么？\n::ans\n```\n00001_create_users.sql           -- users + email 唯一索引\n00002_create_entries.sql         -- entries（不含索引）\n00003_add_entries_index.sql      -- (user_id, date) 联合索引\n00004_create_categories.sql      -- 分类表 + 默认分类种子数据\n00005_create_budgets.sql         -- 预算表 + (user_id, category, month) 唯一\n```\n顺序理由：**先建表再加索引**（索引依赖表存在）；**种子数据放在建表之后**（否则插入失败）；**每个迁移只做一件事**（回滚时能精确撤销）。索引单独成文件的好处是：可以在生产上单独评估「加索引会不会锁表」，而不是和建表混在一起。**迁移文件是「生产变更的单据」，一条变更一张单据**。\n::crit 迁移文件有 `-- +goose Up` 与 `-- +goose Down`，文件名符合 `NNNNN_`\n::crit 每个迁移只做一件事，能独立回滚\n::crit 知道 SQLite 的 ALTER 限制，需要改结构时用「重建表」四步法\n::crit 种子数据放在建表之后，且可重复执行（`INSERT OR IGNORE`）\n\n<!--day 11-->\n::pre 完成 D10：迁移文件已就绪。\n::predict\n```go\ndb.AutoMigrate(&model.User{}, &model.Entry{})\n// 换成\n//go:embed migrations/*.sql\nvar migrationsFS embed.FS\ngoose.SetBaseFS(migrationsFS)\ngoose.Up(sqlDB, "migrations")\n```\n::ask `go:embed` 的路径相对于什么？为什么这个方案适合单二进制部署？\n::ans 相对于**包含该指令的 .go 文件所在目录**。`go:embed migrations/*.sql` 写在 `internal/store/migrate.go` 里，就会找 `internal/store/migrations/`——通常路径不对。要么把迁移目录放在同目录下，要么用 `//go:embed all:migrations` 配合 `embed.FS` 的子目录。好处：**SQL 文件被打进二进制，部署时只需要一个可执行文件**，不需要额外拷贝 migrations 目录——这对「家用小主机 + 单容器」场景非常合适。\n::predict\n```go\n// 启动时自动迁移\nif err := migrate(db); err != nil { log.Fatal(err) }\n// 但多个副本同时启动\n```\n::ask 多个实例同时跑迁移会怎样？\n::ans 可能冲突：两个实例同时执行 `ALTER TABLE`，一个成功一个报错（「列已存在」「表已存在」）→ 启动失败。SQLite 有写锁，第二个会等或 BUSY。修法：① **迁移作为部署的独立步骤**（`docker compose run --rm migrate`），应用启动只检查版本不执行；② 或者用 goose 的锁机制（`goose.WithLock`，但 SQLite 支持有限）；③ 家庭账本单实例部署，可以接受「启动时迁移」，但要明确写下这个前提。**「启动时自动迁移」在单实例下方便，在多副本下是事故源**。\n::debug\n```bash\ngoose -dir ./migrations sqlite3 ledger.db up\n# 应用启动后又报：no such column: deleted_at\n```\n::ask 迁移执行了，为什么应用还报列不存在？\n::ans ① **迁移连的不是同一个库**：goose 用 `ledger.db`（相对当前 shell 的 CWD），应用用的是绝对路径或容器内另一个路径——两个不同的文件；② **迁移只执行了一部分**（某个文件失败，goose 停在那里，后续没跑）；③ 应用的 GORM 模型里有 `deleted_at` 但迁移文件里忘了加这一列（模型先行，迁移没跟上）。排查：`goose status` 看版本号，`sqlite3 db \'.schema entries\'` 看实际列。**「迁移跑过了」要以「目标库的实际结构」为准，不是以「命令没报错」为准**。\n::transfer\n::scene 写一个「迁移 + 启动」的部署流程，保证结构变更可控。\n::ask 单实例与多实例分别怎么做？给出命令。\n::hint 单实例可以启动时迁移，多实例必须独立步骤。\n::ans\n**单实例（家庭部署）**：\n```bash\n# 启动时自动跑（幂等，goose 记录版本）\n./ledger-api --migrate-only   # 可选：先单独跑一次\n./ledger-api\n```\n**多实例 / 容器**：\n```yaml\nservices:\n  migrate:\n    image: ledger-api:latest\n    command: ["/app/ledger-api", "--migrate-only"]\n    volumes: ["./data:/data"]\n    restart: "no"\n  api:\n    image: ledger-api:latest\n    depends_on:\n      migrate:\n        condition: service_completed_successfully\n```\n关键：**迁移用一次性容器跑完退出，API 等它成功再启动**。这样迁移失败时 API 不会带着旧结构启动，问题在部署阶段就暴露。`--migrate-only` flag 让同一个镜像承担两个角色，不需要额外镜像。\n::crit 用 `go:embed` 把迁移打进二进制，部署只需一个文件\n::crit 生产不用 `AutoMigrate`，迁移是结构变更的唯一入口\n::crit 多实例场景迁移是独立步骤，不是启动时自动执行\n::crit 「迁移成功」以目标库实际结构为准（`goose status` + `.schema`）\n\n<!--day 12-->\n::pre 完成 D10-D11：迁移可用。\n::predict\n```go\ntype Category struct {\n    ID     int64  `gorm:"primaryKey"`\n    UserID int64\n    Name   string\n}\ntype Entry struct {\n    CategoryID int64\n    Category   Category `gorm:"foreignKey:CategoryID"`\n}\ndb.Preload("Category").Find(&entries)\n```\n::ask `Preload` 会生成几条 SQL？\n::ans 两条：先查 entries，再 `SELECT * FROM categories WHERE id IN (...)`。这是「1+N 变 2」的优化（相比逐行查）。但 `Preload` 只支持「一对多/多对一」的预加载，如果是多对多还要 `Preload("Tags")` 再来一条。**`Preload` 不是 JOIN，是第二条查询 + 内存关联**，所以它不会因为 JOIN 导致行数膨胀，但也无法用 JOIN 的条件过滤。\n::predict\n```go\n// 账目表存 category 字符串（现状）\n// 改成 category_id 外键\n```\n::ask 这个改动会影响哪些地方？值得做吗？\n::ans 影响：① 所有 `WHERE category = ?` 要变成 `JOIN categories` 或先查 id；② 统计 SQL 的 `GROUP BY category` 要改成 `GROUP BY category_id` 再关联名字；③ 历史数据要迁移（字符串 → id，未知分类要自动创建）；④ 前端接口的字段可能变（`category` 从名字变成 id）。**代价不小，收益是「改分类名不用改所有账目」+「分类可以有颜色/图标」**。家庭账本如果只有十几个固定分类，字符串足够；如果要用户自定义分类且允许改名，就该上外键。**判断标准：分类是不是一个「有生命周期的实体」**。\n::debug\n```go\ndb.Create(&entry)   // entry.CategoryID = 5（不存在的分类）\n// 成功\n```\n::ask 为什么没报外键错误？\n::ans SQLite **默认不开启外键约束**，即使建表时写了 `REFERENCES`。必须 `PRAGMA foreign_keys = ON`（且是连接级的，每次连接都要设）。GORM 的 sqlite 驱动可以通过 DSN 的 `_pragma=foreign_keys(1)` 开启。没开的话，`category_id=5` 指向不存在的行也能插入，数据完整性靠应用层保证——而应用层总会漏。**「写了外键」不等于「有外键约束」，SQLite 是唯一需要显式打开的主流数据库**。\n::transfer\n::scene 决定用外键还是保留字符串分类，给出决策文档。\n::ask 列出决策依据（至少 4 条），并给出你的选择和迁移方案。\n::hint 从「是否改名、是否有元数据、数据量、查询复杂度」想。\n::ans\n| 维度 | 字符串 | 外键 |\n| 分类改名 | 要 UPDATE 全表 | 改一行 |\n| 元数据（颜色/图标/预算） | 无处放 | 自然扩展 |\n| 查询复杂度 | 简单 | 需 JOIN |\n| 历史数据迁移 | 无 | 需一次性转换 |\n**选择**：家庭账本先保留字符串，但把「分类」抽成独立表（只有 `id/name/user_id`），账目存 `category_id`——**为将来的元数据留位置**。迁移步骤：① 建 categories 表并从现有 entries 的 distinct category 生成种子；② entries 加 `category_id` 列；③ `UPDATE entries SET category_id = (SELECT id FROM categories WHERE name = entries.category)`；④ 校验无 NULL；⑤ 保留 `category` 列一个版本作为回滚保险，下个版本删。**迁移要能回滚，就别在同一次变更里删旧列**。\n::crit 知道 SQLite 默认不启用外键，必须 DSN 开 `_pragma=foreign_keys(1)`\n::crit 理解 `Preload` 是第二条查询，不是 JOIN\n::crit 能判断「分类该不该独立成表」，并说出判据\n::crit 数据迁移有「先加列、回填、校验、后删旧列」的步骤，可回滚\n\n<!--day 13-->\n::pre 完成 D5-D12：模型与关联就绪。\n::predict\n```go\ntype CategorySum struct {\n    Category string\n    Total    int64\n}\nvar out []CategorySum\ndb.Model(&Entry{}).\n    Select("category, SUM(amount) as total").\n    Where("user_id = ? AND date >= ? AND date < ?", uid, start, end).\n    Group("category").\n    Scan(&out)\n```\n::ask `Scan` 到自定义结构体时，字段名怎么对应？\n::ans GORM 按**列名 → 字段名**的蛇形映射：列 `total` 对应字段 `Total`，列 `category` 对应 `Category`。如果 SQL 里写 `SUM(amount) AS total_amount`，字段要叫 `TotalAmount`。**不对应时不会报错，只会是零值**——这是最隐蔽的一类 bug。防法：给字段加 `gorm:"column:total"` 显式指定，或 aliases 与字段名严格一致。\n::predict\n```go\ndb.Model(&Entry{}).Where("date LIKE ?", month+"%").Group("category").Count(&n)\n```\n::ask 这条能拿到「每个分类的条数」吗？\n::ans 不能。`Count` 是聚合整个结果集，配合 `Group` 时 GORM 的行为是「返回组数」或拼出不合法的 SQL，取决于版本。要分组计数必须显式 `Select("category, COUNT(*) as cnt").Group("category").Scan(&out)`。**`Count` 只适合「总数」，分组统计必须用 `Select + Group + Scan`**。\n::debug\n```go\nvar total int64\ndb.Model(&Entry{}).Where("user_id = ?", uid).Select("SUM(amount)").Scan(&total)\n// total 一直是 0\n```\n::ask 为什么？\n::ans `Scan` 到 `int64` 时，GORM 期望的是一行一列，但 `Select("SUM(amount)")` 的列名是 `SUM(amount)`，而 `Scan(&int64)` 会尝试按位置/名称匹配——通常能工作，但在某些版本/驱动下匹配失败就是 0。更可靠：`Select("COALESCE(SUM(amount), 0) AS total").Scan(&total)` 或 `Row().Scan(&total)`。另外**空集时 `SUM` 返回 NULL，扫进 int64 会失败或得 0**，必须 COALESCE。**聚合查询的「空集」是最容易漏的边界**。\n::transfer\n::scene 实现 `/summary?month=2026-10`：返回总额、笔数、按分类小计、最大值。\n::ask 用一条 SQL 还是多条？写出结构与响应 JSON。\n::hint 一条 SQL 能否同时算出「总体」和「分组」？\n::ans 用两条更清晰：\n```go\n// 总体\ntype Totals struct {\n    Total int64 `gorm:"column:total"`\n    Count int64 `gorm:"column:cnt"`\n    Max   int64 `gorm:"column:max_amount"`\n}\ndb.Model(&Entry{}).Select("COALESCE(SUM(amount),0) AS total, COUNT(*) AS cnt, COALESCE(MAX(amount),0) AS max_amount").\n    Where(...).Scan(&totals)\n\n// 分项\nvar byCat []CategorySum\ndb.Model(&Entry{}).Select("category, COALESCE(SUM(amount),0) AS total, COUNT(*) AS cnt").\n    Where(...).Group("category").Order("total DESC").Scan(&byCat)\n```\n响应：`{month, total, count, max, by_category:[{category,total,count,ratio}]}`。`ratio` 在应用层算（避免 SQL 里除零）。**「一条 SQL 干完」看起来优雅，但可读性和可维护性往往更差**；两条简单查询加起来也就多一次往返。\n::crit 分组统计用 `Select + Group + Scan`，不用 `Count`\n::crit 聚合列加 `COALESCE`，空月份返回 0\n::crit 自定义结构体字段与别名严格对应，或显式写 `column` tag\n::crit 响应含总额/笔数/分类小计，比例在应用层计算\n\n<!--day 14-->\n::pre 完成 D13：统计接口可用。\n::predict sql\n```sql\nEXPLAIN QUERY PLAN\nSELECT category, SUM(amount) FROM entries\nWHERE user_id = 1 AND date >= \'2026-10-01\' AND date < \'2026-11-01\'\nGROUP BY category;\n```\n::ask 你希望看到什么？看到 `SCAN entries` 意味着什么？\n::ans 希望看到 `SEARCH entries USING INDEX idx_user_date (user_id=? AND date>? AND date<?)`。如果看到 `SCAN entries`，说明**全表扫描**——索引没用上。常见原因：① 索引列顺序是 `(date, user_id)` 而不是 `(user_id, date)`；② 条件里对列做了函数运算（`strftime(\'%Y-%m\', date) = ?`），索引失效；③ 类型不匹配（`user_id` 存成 TEXT，条件传 int）。**`EXPLAIN QUERY PLAN` 是唯一可靠的「索引到底有没有用」的证据**，不要靠猜。\n::predict\n```sql\n-- 索引 (user_id, date)\nWHERE user_id = 1 AND strftime(\'%Y-%m\', date) = \'2026-10\'\n```\n::ask 这个查询能用上索引吗？\n::ans 不能（`date` 部分用不上）。因为索引存的是 `date` 的原始值，而 `strftime(date)` 是**函数运算后的值**，SQLite 无法用索引直接定位。它只能用 `user_id` 做前缀过滤，然后逐行算 `strftime`。这就是为什么一直强调「用半开区间而不是 LIKE/函数」——**任何对索引列的函数包装都会让索引失效**（除非建表达式索引，SQLite 支持但与查询写法强耦合）。\n::debug bash\n```bash\n# 12 万行数据\ntime sqlite3 ledger.db "SELECT ... WHERE user_id=1 AND date>=\'2026-10-01\'..."\n# real 0.4s\n```\n::ask 有索引但还是很慢，可能是什么原因？\n::ans ① **索引没被用上**（先 `EXPLAIN` 确认）；② **回表代价高**：索引只含 `user_id,date`，但查询要 `category,amount`，每行都要回表——如果一个月有 1 万行，就是 1 万次随机读；③ **统计本身贵**：`SUM + GROUP BY` 要遍历所有匹配行，这是 O(n) 的，索引帮不了聚合；④ **SQLite 的页缓存太小**（`PRAGMA cache_size`）。优化方向：覆盖索引 `(user_id, date, category, amount)` 让查询不回表；或者预先聚合到月度汇总表（物化视图思路）。**「加了索引还是慢」通常是因为索引没覆盖查询需要的列**。\n::transfer\n::scene 给统计接口做一次性能验证，证明索引有效。\n::ask 写出验证步骤与判定标准。\n::hint 对比「有索引/无索引」的 EXPLAIN 与耗时。\n::ans\n```bash\n# 1. 造 10 万行数据（脚本插入，避免手写）\n# 2. 记录无索引基线\nsqlite3 db "DROP INDEX IF EXISTS idx_user_date;"\nsqlite3 db "EXPLAIN QUERY PLAN SELECT ..."        # 期望 SCAN\ntime sqlite3 db "SELECT ..." > /dev/null          # 记录耗时\n\n# 3. 建索引，再测\nsqlite3 db "CREATE INDEX idx_user_date ON entries(user_id, date);"\nsqlite3 db "EXPLAIN QUERY PLAN SELECT ..."        # 期望 SEARCH USING INDEX\ntime sqlite3 db "SELECT ..." > /dev/null          # 应明显下降\n\n# 4. 验证「函数包装会让索引失效」\nsqlite3 db "EXPLAIN QUERY PLAN SELECT ... WHERE strftime(\'%Y-%m\',date)=\'2026-10\'"  # 期望回退 SCAN\n```\n判定：**有索引必须是 `SEARCH`，耗时至少降一个数量级**；函数包装那条必须变回 `SCAN`（这是反向验证，证明你理解原因）。把四段 EXPLAIN 输出贴进验收报告。\n::crit 用 `EXPLAIN QUERY PLAN` 确认走的是 `SEARCH` 而非 `SCAN`\n::crit 能解释「函数包装索引列导致失效」，并演示\n::crit 有「无索引 vs 有索引」的耗时对比数据\n::crit 知道覆盖索引能避免回表，能说出何时需要\n\n<!--day 15-->\n::pre 完成 D3-D14：分层与业务已完成。\n::predict\n```go\nfunc (h *Handler) Create(w http.ResponseWriter, r *http.Request) {\n    id, err := h.svc.Create(r.Context(), in)\n    if err != nil {\n        switch {\n        case errors.Is(err, ledger.ErrNotFound): Fail(w, 404, 1002, "...")\n        case errors.Is(err, ledger.ErrForbidden): Fail(w, 403, 2002, "...")\n        default: Fail(w, 500, 5001, "内部错误")\n        }\n    }\n}\n```\n::ask 每个 handler 都这样写，有什么问题？\n::ans ① 重复几十遍，改一处状态码要改所有 handler；② 容易漏某个错误类型，导致「本该 400 的变成 500」；③ handler 变长，业务逻辑被错误处理淹没。更好的做法：**handler 只 `return err`，由统一中间件转换**。用 `func(w, r) error` 签名 + 外层包装：\n```go\ntype HandlerFunc func(http.ResponseWriter, *http.Request) error\nfunc (h *Handler) wrap(fn HandlerFunc) http.HandlerFunc {\n    return func(w http.ResponseWriter, r *http.Request) {\n        if err := fn(w, r); err != nil { h.writeError(w, r, err) }\n    }\n}\n```\n**错误映射只写一次，行为全局一致**。\n::predict\n```go\nfunc (h *Handler) writeError(w http.ResponseWriter, r *http.Request, err error) {\n    var ve *ledger.ValidationError\n    if errors.As(err, &ve) {\n        Fail(w, 400, 1001, ve.Msg)\n        return\n    }\n    slog.Error("request failed", "err", err, "req_id", reqID(r.Context()))\n    Fail(w, 500, 5001, "内部错误")\n}\n```\n::ask 这段有什么问题？\n::ans ① 顺序有隐患：`ValidationError` 如果被 `fmt.Errorf("%w")` 包装过，`errors.As` 仍能命中（正确）；但 `ErrNotFound` / `ErrConflict` 等哨兵没处理，会全部落到 500。② **500 的响应里没有 `request_id`**——用户报障时你无法定位。③ `slog.Error` 只打了 `err`，没打方法/路径/用户，排查时缺少上下文。修法：完整映射所有领域错误，500 响应带 `request_id`，日志补齐字段。**「内部错误」对用户是黑盒，对运维必须是白盒**。\n::debug\n```bash\ncurl -X POST /ledger -d \'{"amount":0}\'\n# {"code":5001,"message":"内部错误"}  ← 期望 1001 参数错误\n```\n::ask 怎么快速定位是哪一步把 ValidationError 变成了 500？\n::ans ① 在 `writeError` 入口打日志 `slog.Debug("map error", "type", fmt.Sprintf("%T", err), "err", err)`，看实际类型；② 常见原因：service 返回的是 `fmt.Errorf("validate: %v", err)`（用 `%v` 而不是 `%w`），包装链断了，`errors.As` 找不到；③ 或者 handler 里 `if err != nil { return fmt.Errorf("create: %w", err) }` 后又在上层被 `errors.New(err.Error())` 重建了一个错误（彻底断链）。**`%v` 和 `%w` 一字之差，决定了错误能否被识别**。\n::transfer\n::scene 建立完整的错误处理体系，从 service 到 HTTP 响应。\n::ask 列出错误类型、映射表、以及「哪些信息给用户、哪些只进日志」。\n::hint 想 4xx 与 5xx 的信息披露策略差异。\n::ans\n| 错误 | HTTP | code | 给用户的信息 | 日志 |\n| `ValidationError` | 400 | 1001 | 字段名 + 中文提示 | 完整 |\n| `ErrNotFound` | 404 | 1002 | 资源不存在 | 路径 + uid |\n| `ErrForbidden` | 403 | 2002 | 无权访问 | 路径 + uid + 资源 id |\n| `ErrConflict` | 409 | 3001 | 冲突原因 | 完整 |\n| `ErrUnauthorized` | 401 | 2001 | 登录已失效 | 原因（expired/invalid） |\n| 其他 `error` | 500 | 5001 | **只给 request_id** | 完整堆栈 + 上下文 |\n原则：**4xx 说清「你哪里错了」（帮用户改正）；5xx 什么也不说（防信息泄漏），只给 request_id**。所有 `%w` 包装保留链，映射用 `errors.Is/As`。**不要让 `err.Error()` 直接进 4xx 响应**——它可能包含内部字段名甚至 SQL 片段。\n::crit handler 统一 `return error`，映射只在一处\n::crit 全部错误用 `errors.Is/As` 分类，无 `%v` 包装断链\n::crit 500 响应只含 request_id，不含内部细节\n::crit 4xx 的提示是「可操作的中文」，不是原始错误\n\n<!--day 16-->\n::pre 完成 D15：错误处理已统一。\n::predict\n```go\nslog.Info("create entry", "user_id", uid, "amount", e.Amount)\n```\n::ask 这条日志在排查「某个用户说创建失败」时够用吗？\n::ans 不够：① 没有 `request_id`，无法和同一次请求的其他日志（HTTP 访问日志、SQL 日志）串起来；② 没有时间戳格式约定（slog 默认带，但要看 handler 配置）；③ 没有结果（成功/失败、耗时）。完整的一条应该是：`slog.Info("create entry", "req_id", rid, "uid", uid, "amount", e.Amount, "entry_id", id, "dur_ms", 12)`。**日志字段的设计目标是「能回答一个具体问题」**，不是「记录尽可能多的东西」。\n::predict\n```go\n// middleware\nrid := uuid.NewString()\nctx := context.WithValue(r.Context(), reqIDKey, rid)\nw.Header().Set("X-Request-ID", rid)\nnext.ServeHTTP(w, r.WithContext(ctx))\n```\n::ask 这个中间件缺了什么关键输出？\n::ans 缺**请求完成时的汇总日志**（方法、路径、状态码、耗时、rid）。只有响应头带 ID 不够——出问题时你要能「按 rid 搜日志」，而不是「按时间翻日志」。应该在 `defer` 里输出：\n```go\nstart := time.Now()\ndefer func() {\n    slog.Info("http", "req_id", rid, "method", r.Method, "path", r.URL.Path,\n        "status", rw.status, "dur_ms", time.Since(start).Milliseconds())\n}()\n```\n并且用包装过的 `ResponseWriter` 拿到真实状态码（D14 阶段三讲过）。\n::debug\n```go\nslog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))\n// 日志里出现\n{"time":"...","level":"ERROR","msg":"db error","err":"UNIQUE constraint failed: users.email"}\n```\n::ask 这条日志有什么问题？怎么改？\n::ans ① `err` 是字符串，**结构化日志里错误应该保持 error 类型**（`slog.Any("err", err)`），否则丢失了类型信息（无法判断是 ValidationError 还是 DB 错误）；② 没有 `req_id`，无法关联；③ `UNIQUE constraint failed: users.email` 这种底层错误对排查有用，但需要补「哪个用户/哪次请求」；④ 缺少 level 之外的上下文（handler 名）。修法：`slog.Error("create user failed", "err", err, "req_id", rid, "email_hash", hashEmail(email))`——注意邮箱要哈希或掩码，不能明文。**结构化日志的价值在于「字段可被查询」，不是「JSON 好看」**。\n::transfer\n::scene 定义日志规范：哪些级别、哪些字段、哪些禁止。\n::ask 写出规范，并给出一个 500 请求的完整日志链（从进入到结束）。\n::hint 一次请求应该有几条日志？\n::ans **级别**：`Debug` 开发用（SQL、参数）；`Info` 请求完成、启动/关闭、迁移；`Warn` 可恢复异常（重试、降级、慢查询 > 500ms）；`Error` 需要人介入（5xx、panic、连不上库）。**字段**：`req_id`（必有）、`method`、`path`、`status`、`dur_ms`、`uid`、`err`、`msg`。**禁止**：密码、token、Cookie、完整请求体、SQL 参数原值、完整邮箱/手机号。\n**一次 500 的日志链**：\n```\nINFO  http  req_id=abc method=POST path=/api/v1/ledger status=201 dur_ms=18 uid=7\nERROR entry create failed  req_id=abc uid=7 amount=3550 err="UNIQUE constraint failed"\nINFO  http  req_id=abc ... status=500 dur_ms=21\n```\n三条共用一个 `req_id`，能用一条命令 `grep abc` 拉出全链路。**这就是 request_id 的全部意义**。\n::crit 每条请求日志都有 `req_id`，且响应头也返回同一个\n::crit 500 场景能用 `grep req_id` 拉出「进入 → 错误 → 结束」完整链\n::crit 日志里没有密码/token/完整邮箱\n::crit 错误用 `slog.Any("err", err)` 保留类型，不转字符串\n\n<!--day 17-->\n::pre 完成 D15-D16；service 层已稳定。\n::predict\n```go\nfunc TestCreate(t *testing.T) {\n    svc := newTestService(t)\n    id, err := svc.Create(ctx, CreateInput{Amount: 100, Category: "餐饮", Date: "2026-10-19"})\n    if err != nil { t.Fatal(err) }\n    if id == 0 { t.Fatal("id 应为非零") }\n}\n```\n::ask 这个测试有几个问题？\n::ans ① 只测了「happy path」，没有错误分支；② 断言太弱（`id != 0` 不能证明「存进去的是这条数据」）；③ 用了真实时间 `2026-10-19`，如果业务有「不允许未来日期」的校验，测试会随时间失效（今天是 2026-10-19，明天就变未来）；④ 每次跑都插入数据，多次运行可能撞唯一约束。**表驱动 + 固定时间 + 每例独立数据**是三条基本功。\n::predict\n```go\ncases := []struct{\n    name string\n    in   CreateInput\n    wantErr error\n}{\n    {"金额为0", CreateInput{Amount: 0}, ErrValidation},\n    {"金额为负", CreateInput{Amount: -1}, ErrValidation},\n}\nfor _, c := range cases {\n    t.Run(c.name, func(t *testing.T) {\n        _, err := svc.Create(ctx, c.in)\n        if !errors.Is(err, c.wantErr) { t.Fatalf("got %v want %v", err, c.wantErr) }\n    })\n}\n```\n::ask 这个表驱动测试缺了什么？\n::ans ① 没有 `t.Parallel()`（表驱动常配并行，但要注意共享状态）；② 每个 case 没有独立的 service/store（前一个 case 的写入会影响后一个）；③ `wantErr` 用 `err` 类型比较，但如果是 `ValidationError`（需要 `errors.As`）就不适用；④ 没有覆盖「合法输入」的正例——只有反例的测试无法证明「正常路径没坏」。**表驱动不是「把 if 换成 for」，每行 case 要有独立的夹具与明确的断言**。\n::debug bash\n```bash\ngo test ./internal/ledger -run TestCreate -v\n# --- FAIL: TestCreate/金额为0\n#     got <nil> want validation error\n```\n::ask 测试挂了，是测试错了还是代码错了？\n::ans 先看**代码是否真的校验了 0**。如果 service 的 `Create` 里只写了 `if in.Amount < 0`，那 0 确实能通过——**测试发现了真实 bug**。如果代码有校验但错误类型不匹配（比如返回 `errors.New("金额必须大于0")` 而不是 `ValidationError`），那是「代码行为对、契约不对」，要统一错误类型。**测试失败时第一反应是「代码错了」，不是「改测试让它过」**——后者是把测试变成装饰。\n::transfer\n::scene 为 `Create` 写完整的表驱动测试。\n::ask 列出至少 8 个 case，并说明每个覆盖什么风险。\n::hint 从「金额、分类、日期、备注、权限、重复」六个维度想。\n::ans\n| case | 输入 | 期望 | 覆盖 |\n| 正常 | 100/餐饮/2026-10-01 | 成功，能查回 | 主路径 |\n| 金额 0 | 0 | ValidationError | 边界 |\n| 金额负 | -1 | ValidationError | 边界 |\n| 金额超大 | 1e12 | ValidationError | 溢出/误输 |\n| 分类空 | "" | ValidationError | 必填 |\n| 分类超长 | 100 字 | ValidationError | 长度 |\n| 日期格式错 | "2026/10/01" | ValidationError | 格式 |\n| 日期未来 | 明天 | ValidationError | 业务规则 |\n| 备注超长 | 200 字 | ValidationError | rune 长度 |\n| 用户隔离 | uid=2 查 uid=1 的 | ErrNotFound | 越权 |\n十个 case 覆盖六类风险，每个都有明确断言（错误类型 + 关键字段）。**测试的价值在于「它能挡住哪一类回归」**，所以每个 case 都要能说出「如果这行代码被改坏，是哪个 case 报警」。\n::crit 表驱动覆盖主路径 + 至少 6 类错误分支\n::crit 每个 case 有独立数据，测试可重复运行\n::crit 断言具体（错误类型、字段值），不只断言 `err != nil`\n::crit 测试失败时先判断「代码错还是测试错」，不改测试来迁就 bug\n\n<!--day 18-->\n::pre 完成 D17：service 测试已写。\n::predict\n```go\nreq := httptest.NewRequest("POST", "/ledger", strings.NewReader(`{"amount":100}`))\nrec := httptest.NewRecorder()\nh.Create(rec, req)\n// 检查\nif rec.Code != 201 { t.Fatal(rec.Code) }\n```\n::ask 这个测试有什么问题？\n::ans ① 没设 `Content-Type: application/json`，如果 handler 检查了它，测试会失败；② 没有注入 uid（`r.Context()` 里没有认证信息），handler 会 401；③ 没有断言响应体内容；④ `httptest.NewRequest` 的 body 是 `io.Reader`，如果 handler 读两次就会失败（真实请求也一样，这是好事）。修法：用 helper 构造「已认证的请求」：\n```go\nfunc authedRequest(method, path string, body string, uid int64) *http.Request {\n    r := httptest.NewRequest(method, path, strings.NewReader(body))\n    r.Header.Set("Content-Type", "application/json")\n    return r.WithContext(context.WithValue(r.Context(), uidKey, uid))\n}\n```\n::predict\n```go\nh := httpapi.New(fakeLedger{})   // fake 返回 ErrNotFound\nreq := httptest.NewRequest("GET", "/ledger/1", nil)\nrec := httptest.NewRecorder()\nh.Get(rec, req)\n// 期望 404，实际 200\n```\n::ask 为什么 fake 返回了 ErrNotFound 但状态码是 200？\n::ans 可能原因：① fake 的方法签名与接口不匹配，实际调用的是嵌入的零值方法（返回 nil）；② handler 里错误被忽略（`e, _ := svc.Get(...)`）；③ `writeError` 没被调用（直接 `OK(w, e)` 了）。**这类「fake 没生效」的问题，最有效的排查是让 fake 记录「被调用了没有」**：在 fake 里加 `called bool`，测试断言 `fake.called == true`。**否则你可能在测一个空实现**。\n::debug\n```go\n// 测试里\nOK(w, nil)\n// 断言\nvar resp map[string]any\njson.NewDecoder(rec.Body).Decode(&resp)\nif resp["code"].(float64) != 0 { ... }\n```\n::ask 这段断言有什么脆弱之处？\n::ans ① `resp["code"].(float64)` 直接断言，字段缺失时 panic（测试崩而不是失败，报错信息不友好）；② 用 `map[string]any` 断言，绕过了类型检查——如果响应结构改了（`code` 变成 string），只有运行时才发现；③ 没检查 HTTP 状态码。更好：定义与 API 一致的响应结构体（或复用 DTO），解码到结构体，断言具体字段：\n```go\ntype envelope struct {\n    Code int `json:"code"`\n    Data struct{ ID int64 `json:"id"` } `json:"data"`\n}\nvar got envelope\njson.NewDecoder(rec.Body).Decode(&got)\nif got.Code != 0 || got.Data.ID == 0 { ... }\n```\n::transfer\n::scene 为 5 个 handler 写测试，其中 3 个需要认证、2 个是公开的。\n::ask 怎么组织代码避免重复？给出 helper 设计。\n::hint 用一个 `do(t, handler, req)` 返回 `(status, envelope)`。\n::ans\n```go\nfunc do(t *testing.T, h http.HandlerFunc, req *http.Request) (int, envelope) {\n    t.Helper()\n    rec := httptest.NewRecorder()\n    h(rec, req)\n    var env envelope\n    if rec.Body.Len() > 0 {\n        if err := json.NewDecoder(rec.Body).Decode(&env); err != nil {\n            t.Fatalf("响应不是合法 JSON: %v, body=%s", err, rec.Body.String())\n        }\n    }\n    return rec.Code, env\n}\n\nfunc newReq(method, path, body string, uid int64) *http.Request { ... }\n// 使用\ncode, env := do(t, h.Create, newReq("POST", "/ledger", `{...}`, 7))\nif code != 201 { t.Fatalf("status=%d body=%+v", code, env) }\n```\n两个 helper 消掉所有重复；`t.Helper()` 让失败行号指向调用处而不是 helper 内部；解码失败时把 body 打出来（否则你只知道「不是 JSON」，不知道实际返回了什么）。**测试 helper 的质量决定了写测试的痛苦程度**。\n::crit 请求构造包含 Content-Type 与认证上下文\n::crit fake 记录调用情况，测试断言「确实调用了」\n::crit 响应解码到结构体，不裸断言 `map[string]any`\n::crit helper 用 `t.Helper()`，失败信息包含 status 与 body\n\n<!--day 19-->\n::pre 完成 D17-D18：service 与 handler 测试已写。\n::predict\n```go\ndb, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})\n// 两个测试同时跑\n```\n::ask `cache=shared` 的内存库有什么问题？\n::ans 所有用同一个 DSN 的连接**共享同一个内存数据库**——测试之间会互相污染（A 测试插入的数据 B 测试能查到），并行跑时更乱。正确做法：每个测试用**唯一名字**的内存库：`file:test_<uuid>?mode=memory&cache=shared`，并在 `t.Cleanup` 里关闭连接（连接关光后内存库自动销毁）。或者用临时文件：`filepath.Join(t.TempDir(), "test.db")`——更简单，且能验证真实的文件行为（WAL、权限）。\n::predict\n```go\nfunc newTestRepo(t *testing.T) *repo {\n    db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), ...)\n    db.AutoMigrate(&model.Entry{})\n    return &repo{db: db}\n}\n```\n::ask 用 `AutoMigrate` 建测试表，有什么风险？\n::ans 风险是**测试用的表结构与生产不一致**：生产的表由迁移文件创建（含 CHECK、索引、默认值），`AutoMigrate` 建出来的可能少了 CHECK（D5 讲过 SQLite 上 AutoMigrate 会跳过），于是「生产会拒绝的数据，测试能插入」。这会让测试通过但线上失败。正确做法：**测试里跑真实的迁移文件**（`goose.Up` 指向 embed 的 migrations），保证结构与生产完全一致。**测试夹具应该复用生产路径，而不是另建一套**。\n::debug\n```go\nr := newTestRepo(t)\nr.Create(ctx, entry1)\nvar got []model.Entry\nr.List(ctx, 1, Query{Month: "2026-10"})\n// got 为空\n```\n::ask 数据明明插了，为什么查不到？\n::ans 常见三个原因：① **时间格式**：`entry.Date` 存的是 `2026-10-19`，但查询用 `time.Time` 做条件，序列化后带时分秒，`>= 2026-10-01 00:00:00` 与 `2026-10-19` 字符串比较出问题；② **月份边界算错**：`start/end` 用了 `AddDate(0,1,0)` 但时区不对；③ **每个测试用了不同的内存库**（DSN 里带了随机名），插入和查询连的不是同一个。排查：在测试里 `db.Debug()` 打出插入和查询的 SQL，直接看条件值。**「查不到」永远先看生成的 SQL**。\n::transfer\n::scene 设计 Repository 测试的夹具策略。\n::ask 用内存库还是临时文件？迁移怎么跑？每个测试怎么隔离？\n::hint 考虑「WAL 行为、并发、清理」三点。\n::ans **推荐临时文件**：`path := filepath.Join(t.TempDir(), "test.db")`。理由：① 行为与生产一致（WAL、文件锁、权限）；② `t.TempDir()` 自动清理，不需要手动删；③ 能跑并发测试（内存 shared cache 在并发下容易出诡异问题）。迁移用真实文件：\n```go\nfunc newTestRepo(t *testing.T) (*repo, *gorm.DB) {\n    t.Helper()\n    db, err := Open(filepath.Join(t.TempDir(), "test.db"))\n    if err != nil { t.Fatal(err) }\n    if err := Migrate(db); err != nil { t.Fatal(err) }\n    t.Cleanup(func() { sqlDB, _ := db.DB(); sqlDB.Close() })\n    return &repo{db: db}, db\n}\n```\n**每个测试一个库文件**，天然隔离；**跑真实迁移**，结构与生产一致；`t.Cleanup` 兜底关闭，避免句柄泄漏导致 `t.TempDir` 删不掉。\n::crit 每个测试用独立数据库（临时文件或唯一命名的内存库）\n::crit 测试跑真实迁移文件，不用 `AutoMigrate`\n::crit `t.Cleanup` 关闭连接，无句柄泄漏\n::crit 「查不到」时会用 `Debug()` 看真实 SQL，不靠猜\n\n<!--day 20-->\n::pre 完成 D17-D19：三层测试都有。\n::predict bash\n```bash\ngo test ./... -cover\n# internal/httpapi   45.2%\n# internal/ledger    78.1%\n# internal/store     12.3%\n```\n::ask 看到 store 只有 12%，第一反应应该是什么？\n::ans 不是「赶紧补到 80%」，而是问：**store 里哪些代码没被测到？那些代码的风险高吗？** 如果没覆盖的是「SQL 拼接的正常路径」，风险高；如果是「错误分支的参数校验」，可能由 service 测试间接覆盖。覆盖率是**发现盲区的工具**，不是 KPI——为了数字写「调用一下不断言」的测试，等于自欺欺人。\n::predict bash\n```bash\ngo test ./internal/httpapi -coverpkg=./internal/ledger,./internal/store -coverprofile=c.out\ngo tool cover -func=c.out | tail -5\n```\n::ask `-coverpkg` 的作用是什么？不加会怎样？\n::ans 不加时，覆盖率只统计**被测包自己**的代码——handler 测试里调用了大量 service 代码，但这些行不算进 httpapi 的覆盖率，于是数字虚低，你会误以为「handler 测试没覆盖业务」。加 `-coverpkg=...` 后，service/store 里被 handler 测试执行到的行也算进来，能看出「handler 测试实际覆盖了多少下层逻辑」。**「跨包覆盖」才是有意义的数字**。\n::debug bash\n```bash\ngo test -race ./...\n# ok\ngo test -race -count=10 ./internal/ledger\n# WARNING: DATA RACE\n```\n::ask 为什么跑一次没问题，跑十次就报？\n::ans 竞态是**概率性**的：单次运行时两个 goroutine 恰好没重叠，跑十次总有一次撞上。`-count=10` 是「用重复换概率」的标准手段。另一个可能是测试之间有共享状态（比如包级变量），`-count` 让第二次运行时状态已被第一次污染——**这也是为什么要每个测试独立夹具**。排查：看 race 报告里的两个栈，一个是测试代码，一个是被测代码，就知道是谁在并发写。\n::transfer\n::scene 为整个项目定一套测试策略，说明「哪些必须测、哪些不必」。\n::ask 给出优先级排序和理由，并说明覆盖率目标怎么定。\n::hint 按「出错后的后果」排序，不按「代码行数」。\n::ans\n| 优先级 | 内容 | 理由 | 目标 |\n| P0 | 金额计算/单位换算 | 错一分就是投诉 | ~100% |\n| P0 | 数据隔离（user_id） | 错就是越权 | ~100% |\n| P0 | 认证与密码 | 错就是安全事故 | ~100% |\n| P1 | 错误到状态码映射 | 错会掩盖故障 | 90%+ |\n| P1 | 统计/聚合 | 错就是账不对 | 90%+ |\n| P2 | 参数校验 | 错是体验问题 | 80% |\n| P3 | 配置解析/日志格式 | 错影响运维 | 尽力 |\n**覆盖率目标按包定，不设全局数字**：`ledger` 85%+、`httpapi` 80%+、`store` 70%+（SQL 的极端分支难测）。**「P0 100%」比「全局 80%」有意义得多**。\n::crit 用 `-coverpkg` 看跨包覆盖，不只看单包数字\n::crit `-race -count=10` 至少跑一次，能复现概率性竞态\n::crit 覆盖率目标按风险分层，P0 项接近 100%\n::crit 不写「调用一下不断言」的凑数测试\n\n<!--day 21-->\n::pre 完成 D13：统计接口可用（预算为 stretch goal）。\n::predict\n```go\n// 添加账目时检查预算\nvar b Budget\ndb.Where("user_id=? AND category=? AND month=?", uid, cat, month).First(&b)\nif b.Amount > 0 && used + e.Amount > b.Amount {\n    return ErrBudgetExceeded\n}\n```\n::ask 这个检查有什么问题？\n::ans ① **并发下会漏判**：两个请求同时读到 `used = 900`，各自加 100 都判定「没超 1000」，实际到了 1100；② `used` 从哪来？如果每次 `SUM` 查，成本高；如果存字段，又要维护一致性；③ 超预算时**要不要阻止写入**？家庭账本里「超预算是提醒」而不是「禁止记账」——禁止会导致用户记不了账，反而更糟。正确做法：**超预算时写入成功，但响应里带 `budget_exceeded: true` 标志**。**「预算」是提示性约束，不是硬约束**。\n::predict\n```go\n// 用 CHECK 约束做硬限制\nALTER TABLE entries ADD CONSTRAINT chk_budget CHECK (...)\n```\n::ask 能这么干吗？\n::ans 不能：① CHECK 约束只能引用同一行的列，无法聚合其他行（不知道「本月已用多少」）；② SQLite 不支持给已有表加 CHECK（要重建表）；③ 预算按月变化，约束无法表达。**跨行的业务规则必须由应用层（或数据库触发器）实现，CHECK 只管单行内的约束**（比如 `amount > 0`）。\n::debug\n```bash\ncurl -X POST /ledger -d \'{"amount":5000,"category":"餐饮"}\'\n# 预算 3000，超出\n# 响应 200，但没有任何提示\n```\n::ask 用户怎么知道超预算了？\n::ans 不知道——如果响应里没有标志，前端无法提示。修法：在创建响应里加字段：\n```json\n{"code":0,"data":{"id":42,"budget":{"limit":3000,"used":8000,"exceeded":true}}}\n```\n或者提供独立的 `GET /budget/status?month=` 让前端主动查。**「提示」必须有一条明确的数据通道**，不能指望用户自己算。另外前端提示文案要说清「超了多少」，而不只是「超预算」。\n::transfer\n::scene 设计预算功能的最小可用版本（stretch goal）。\n::ask 表结构、检查时机、响应字段分别是什么？哪些可以不做？\n::hint 最小版本 = 能设预算 + 能判断超没超。\n::ans\n**表**：`budgets(id, user_id, category, month, amount)`，唯一索引 `(user_id, category, month)`。\n**检查时机**：创建/更新账目后，在同一事务里 `SUM` 当月该分类，再与预算比。**不做「预扣」**（那需要复杂的回滚），只做「事后判断」。\n**响应**：创建响应带 `budget: {limit, used, exceeded}`。\n**可以不做**：① 预算的时间维度继承（每月自动复制上月预算）；② 分档提醒（80%/100%）；③ 预算调整的历史记录。**先把「设了预算 → 记账时能看到超没超」这条主路径跑通**，其余都是增量。\n::crit 超预算不阻止写入，只返回标志（说明这是提示性约束）\n::crit 预算是「事后 SUM 判断」，不做预扣/预留\n::crit 响应里有明确的 `budget` 字段（limit/used/exceeded）\n::crit 能说出最小版本的边界（哪些明确不做）\n\n<!--day 22-->\n::pre 完成 D13-D14：统计接口可用。\n::predict\n```go\nrows, _ := db.Query("SELECT date, amount, category, note FROM entries WHERE ...")\nw.Header().Set("Content-Type", "text/csv")\nw.Write([]byte("date,amount,category,note\\n"))\nfor rows.Next() {\n    var d, c, n string\n    var a int64\n    rows.Scan(&d, &a, &c, &n)\n    fmt.Fprintf(w, "%s,%d,%s,%s\\n", d, a, c, n)\n}\n```\n::ask 这段 CSV 导出有什么问题？\n::ans ① **没有 CSV 转义**：备注里有逗号、引号、换行时，整个文件列错位。必须用 `encoding/csv` 的 `Writer`，它负责加引号、转义、处理换行。② **金额单位**：导出 `3550` 还是 `35.50`？给用户看的应该是元，但 Excel 会把 `35.50` 当数字（可能丢末尾零）。③ **没有 `Content-Disposition`**，浏览器可能直接显示而不是下载。④ **编码**：Excel 打开 UTF-8 CSV 可能乱码，需要 BOM（`\\ufeff`）——但加了 BOM 会影响程序解析。**CSV 看起来简单，但转义/编码/单位每个都能出问题**。\n::predict\n```go\nfmt.Fprintf(w, "%s,%s\\n", date, note)   // note = "午饭,和同事"\n```\n::ask Excel 打开后这一行有几列？\n::ans 三列（`午饭` 和 `和同事` 被拆开）。`encoding/csv` 遇到含逗号的字段会自动加双引号：`2026-10-19,"午饭,和同事"`。如果字段本身含双引号，会写成 `""` 转义。**手写 CSV 迟早会错，永远用标准库**。\n::debug\n```bash\ncurl -o out.csv \'/ledger/export?month=2026-10\'\n# 文件大小正确，但 Excel 打开只有一列，内容是 "date,amount,..."\n```\n::ask 为什么？\n::ans 可能原因：① **`Content-Type` 设成了 `text/plain`**，Excel 按纯文本处理不分列——应该 `text/csv; charset=utf-8`；② 文件的换行是 `\\n` 而 Excel（Windows）期望 `\\r\\n`，导致整个文件被当成一行；③ 用了 `\\t` 分隔却命名为 csv。前两个最常见。`encoding/csv` 默认用 `\\n`，可以 `w.UseCRLF = true` 修复。**「导出文件打不开」先检查分隔符和换行符**。\n::transfer\n::scene 实现全量加载版 CSV 导出（stretch goal 的第一版）。\n::ask 写出 handler 骨架，说明为什么全量加载在这个量级可接受。\n::hint 家庭账本一个月的记录有多少条？\n::ans\n```go\nfunc (h *Handler) Export(w http.ResponseWriter, r *http.Request, uid int64) error {\n    entries, err := h.svc.ListAll(r.Context(), uid, month)   // 全量\n    if err != nil { return err }\n    w.Header().Set("Content-Type", "text/csv; charset=utf-8")\n    w.Header().Set("Content-Disposition", `attachment; filename="ledger-`+month+`.csv"`)\n    cw := csv.NewWriter(w)\n    cw.UseCRLF = true\n    defer cw.Flush()\n    cw.Write([]string{"日期", "金额(元)", "分类", "备注"})\n    for _, e := range entries {\n        cw.Write([]string{e.Date, formatCents(e.Amount), e.Category, e.Note})\n    }\n    return cw.Error()\n}\n```\n可接受的理由：家庭账本一个月最多几百条，一条 `Entry` 约 100 字节，全量加载不到 100KB。**「流式」是为了「数据量可能无限」的场景，不是所有导出的默认姿势**——先算一下最坏情况的内存占用，再决定要不要复杂化。\n::crit 用 `encoding/csv` 而不是手拼字符串，含逗号/引号/换行的字段正确\n::crit `Content-Type: text/csv; charset=utf-8` + `Content-Disposition` 触发下载\n::crit 金额导出为「元」且保留两位小数（用整数拼接，不用浮点）\n::crit 能算出全量加载的最坏内存，判断是否可接受\n\n<!--day 23-->\n::pre 完成 D22：CSV 全量导出可用。\n::predict\n```go\n// 流式\nrows, _ := db.Query("SELECT ...")\nfor rows.Next() {\n    cw.Write(record)\n    cw.Flush()          // 每行 flush\n}\n```\n::ask 每行 `Flush` 有什么问题？\n::ans ① **性能差**：每次 Flush 都可能触发一次 write 系统调用，1 万行就是 1 万次；② **响应可能已经发送**：一旦开始写 body，后面的错误就无法再改状态码（客户端会收到「200 + 截断的文件」）。正确做法：用 `bufio.Writer` 或让 `csv.Writer` 自己缓冲（它内部有 bufio，只需要在**最后** Flush），中途不 Flush。代价是「客户端看到的进度不是实时的」，但 CSV 下载不需要实时。**流式的关键是「内存有界」，不是「逐行刷盘」**。\n::predict\n```go\n// 流式导出中途数据库出错\nfor rows.Next() { ... }\nreturn rows.Err()   // 此时已经写了 3 万行\n```\n::ask 客户端会收到什么？\n::ans 收到 **HTTP 200 + 一个不完整的 CSV 文件**。因为响应头已经发出，无法改成 500。这是流式导出的固有缺陷。缓解手段：① 在开始写之前先做一次「轻量预检」（比如 `COUNT(*)` 确认数据可读），降低中途失败概率；② 在文件末尾写一个「结束标记」行（如 `# END`），客户端/导入方可以校验完整性；③ 明确告知用户「如果文件不完整请重试」。**流式导出必须在「内存」和「错误可恢复性」之间做取舍**，没有两全。\n::debug\n```bash\ncurl -o out.csv \'/ledger/export?month=2026-10\'\nwc -l out.csv    # 5001\n# 但数据库里有 8000 条\n```\n::ask 少了的 3000 条去哪了？怎么排查？\n::ans 可能原因：① **查询本身有限制**（比如默认 `LIMIT 5000`，或者分页参数没传对）；② **`rows.Next()` 提前结束**：数据库连接中断，`rows.Err()` 有错误但被忽略；③ **写入端提前断开**：客户端超时/取消，`csv.Write` 返回错误但没检查。排查：`rows.Err()` 必须检查；`cw.Error()` 必须检查；日志里记录「导出行数 vs 期望行数」。**「导出条数不对」必须有对账，不能让用户自己数**。\n::transfer\n::scene 决定这个项目到底用全量还是流式。\n::ask 给出决策与判据，并说明如果将来要改流式，接口要不要变。\n::hint 想想「多少条数据会让全量加载出问题」。\n::ans **决策：先用全量**。判据：单条 `Entry` 约 120 字节，1 万条约 1.2MB，10 万条约 12MB——家庭账本一个月不会超过 1 万条，全量完全可接受。**触发改造的阈值**：单次导出内存超过 50MB（约 40 万条），或导出耗时超过 5 秒。改造时**接口不变**（还是 `GET /ledger/export?month=`），只换内部实现——这正是「先定契约、后优实现」的好处。如果现在就上流式，你会为一个不会发生的问题付出复杂度。\n::crit 流式实现只在最后 `Flush`，不逐行刷\n::crit 知道流式导出中途失败无法改状态码，有缓解措施\n::crit 检查 `rows.Err()` 与 `cw.Error()`，并记录导出行数\n::crit 能说出「什么时候该从全量换成流式」的具体阈值\n\n<!--day 24-->\n::pre 完成 D1-D23：后端功能基本齐。\n::predict\n```json\n// 前端问：创建账目时 amount 传什么？\n// 后端答：分\n// 前端又问：那列表返回的呢？\n```\n::ask 如果接口文档没写清单位，会发生什么？\n::ans 前端把「分」当「元」显示，35.5 元显示成 3550 元；或者前端传元、后端当分存，35.5 变成 0.355 元。这类 bug 的特点是**不会报错，只会数字不对**，而且往往在用户投诉后才发现。必须在文档里对每个金额字段标注单位：`amount_cents`（字段名自带单位）比 `amount` + 注释更可靠。**「字段名承载语义」比「文档承载语义」更不容易失效**。\n::predict\n```json\n// 响应\n{"code":0,"data":{"items":[...],"total":45}}\n// 前端问：total 是「当前页条数」还是「总条数」？\n```\n::ask 这种歧义怎么系统性避免？\n::ans ① **命名精确**：`page_size` / `total_count` / `has_more`，不用 `total`/`count`/`size` 这种多义字段；② **文档给出示例**（含具体数字）；③ **提供 OpenAPI 描述**，让前端能生成类型；④ 联调时前端按文档写，发现不一致立刻改文档而不是「口头约定」。**接口字段的命名是契约的核心，含糊的名字会持续产生误解**。\n::debug\n```bash\n# 前端联调时\nPOST /api/v1/ledger  → 404\nGET  /ledger         → 200\n```\n::ask 一个带前缀一个不带，问题出在哪？\n::ans 路由注册不一致：有的写在 `/api/v1` 前缀下，有的直接挂根路径。修法：**统一用一个 base path 常量**，所有路由注册都基于它：\n```go\nconst base = "/api/v1"\nmux.HandleFunc("POST "+base+"/ledger", h.Create)\n```\n或者用子 mux + `StripPrefix`。**路径前缀不能靠每个人记得写**，否则必然漏。同理，前端也应该把 baseURL 收敛到一个配置项。\n::transfer\n::scene 写一份「前端联调准备」的接口清单。\n::ask 清单里必须包含哪些内容？给出一个接口的完整条目示例。\n::hint 想前端实现一个页面需要哪些信息。\n::ans 每条包含：**路径与方法、是否需要认证、请求字段（名/类型/单位/必填/约束）、响应字段（含义）、错误码列表、curl 示例**。\n示例：\n```markdown\n### POST /api/v1/ledger  创建账目（需认证）\n请求：{ "amount_cents": 3550, "category": "餐饮", "date": "2026-10-19", "note": "午饭" }\n- amount_cents: int64, 必填, 1 ~ 10000000（分）\n- category: string, 必填, 1-20 字符\n- date: string, 必填, YYYY-MM-DD, 不晚于今天\n响应 201：{ "code": 0, "data": { "id": 42, "budget": {...} } }\n错误：1001 参数错误 / 2001 未登录 / 3001 疑似重复\ncurl: curl -X POST ... -H "Authorization: Bearer $T" -d \'{...}\'\n```\n**「单位、必填、范围」三样缺一不可**，它们是联调时 80% 问题的来源。\n::crit 所有金额字段名带单位（`_cents`），文档标注\n::crit 路由前缀统一用常量，不存在「有的带前缀有的不带」\n::crit 每个接口条目含字段约束、错误码、curl 示例\n::crit 分页字段命名无歧义（`page_size`/`total_count`/`has_more`）\n\n<!--day 25-->\n::pre 完成 D1-D24：接口清单已交付。\n::predict bash\n```bash\n./scripts/e2e.sh\n# 全部通过\n```\n::ask 端到端脚本全绿，还需要人工验证什么？\n::ans ① **浏览器里的真实行为**：Cookie 是否被设置、跨域是否通过、前端拿到的数字显示是否正确；② **并发**：两个用户同时创建，数据是否串；③ **重启**：数据是否还在；④ **异常输入**：超大 body、畸形 JSON、超长字段；⑤ **性能**：列表接口在 1 万条数据下的响应时间。**脚本能覆盖「契约」，覆盖不了「体验」和「并发」**。\n::predict\n```bash\n# 两个用户并发创建\nfor i in {1..10}; do curl -X POST ... & done; wait\n# 检查条数\nsqlite3 db \'select count(*) from entries\'\n# 10\n```\n::ask 这能证明没有并发问题吗？\n::ans 不能。① 10 个请求可能被串行处理（`MaxOpenConns(1)` 下写本来就是串行）；② 没有验证「每个请求的 user_id 是否正确落库」（可能全落到了同一个用户）；③ 没有 `-race`。真正的并发验证要：**多用户并发 + 检查每条记录的 user_id + 服务端开 `-race` 跑**。而且要注意：SQLite 的写串行化会掩盖很多竞态，所以并发测试要用**读操作**（读是并发的）来暴露问题。\n::debug\n```bash\n# e2e 通过，但浏览器里\n# 登录后刷新页面 → 又变成未登录\n```\n::ask 脚本测不出来，为什么？\n::ans 因为脚本是「取 token 放 header」，而浏览器是「依赖 Cookie」。刷新后掉登录说明 **Cookie 没被正确设置或没被带上**：① `Set-Cookie` 少了 `Path=/`（只在 `/api/v1/login` 路径生效）；② `Secure: true` 但用 http 访问，浏览器拒绝存；③ `SameSite=Strict` + 跨站前端，Cookie 不发送；④ 没设 `MaxAge`，变成会话 Cookie（关浏览器就没了，但刷新不该掉）。**「脚本通、浏览器不通」几乎总是 Cookie/跨域问题**，这类必须人工在浏览器验证。\n::transfer\n::scene 设计阶段五的端到端回归清单。\n::ask 列出必须覆盖的场景（至少 10 条），标注哪些只能人工验。\n::hint 分「契约、并发、持久化、异常、体验」五类。\n::ans\n| # | 场景 | 类型 |\n| 1 | 注册 → 登录 → 创建 → 列表 → 统计 → 删除 全链路 | 脚本 |\n| 2 | A 创建，B 看不到 / 改不动 / 删不掉 | 脚本 |\n| 3 | 未登录访问业务接口 → 401 | 脚本 |\n| 4 | 金额 0/负数/超大 → 400 | 脚本 |\n| 5 | 分页翻到最后一页 + 越界 offset | 脚本 |\n| 6 | 空月份统计返回 0 | 脚本 |\n| 7 | CSV 导出含逗号/引号的备注 | 脚本（解析校验） |\n| 8 | kill 进程重启后数据仍在 | 脚本 |\n| 9 | 10 用户并发创建，每条 user_id 正确 | 脚本 + `-race` |\n| 10 | 浏览器登录 → 刷新仍登录 → 添加 → 列表显示 | **人工** |\n| 11 | 手机浏览器访问（局域网 IP）完整流程 | **人工** |\n| 12 | 超长备注/超大 body 的错误提示是否友好 | **人工** |\n**第 10-12 条是脚本的盲区**，必须人工过一遍——尤其是手机访问（监听地址、CORS、Cookie Secure）。\n::crit 回归清单覆盖契约/并发/持久化/异常/体验五类\n::crit 多用户并发后校验每条记录 `user_id` 正确\n::crit 明确标出「只能人工验证」的项，且真的验了\n::crit 浏览器刷新后仍保持登录（Cookie 属性正确）\n\n<!--day 26-->\n::pre 完成 D1-D25：功能与非功能项都过了一遍。\n::predict\n```bash\ngo test ./... -race -cover\ngovulncheck ./...\ndocker compose up -d\n```\n::ask 三条都通过，阶段五算完成吗？\n::ans 还差：① **迁移在生产库上真的执行过**（不只是测试库）；② **GORM 的 session 模式全局一致**（grep 确认没有裸 `r.db.Where`）；③ **日志能用 request_id 串起来**（实际 grep 一次）；④ **预算/CSV 这两个 stretch goal 的完成度有明确说明**（做了多少、没做什么）；⑤ **性能有基线数据**（列表接口 P95）。**「测试绿」是必要条件，验收是「清单逐条有证据」**。\n::predict\n```bash\ngrep -rn "r\\.db\\.Where\\|r\\.db\\.First\\|r\\.db\\.Find" internal/store/\n```\n::ask 这条 grep 期望什么结果？如果有输出说明什么？\n::ans 期望**无输出**（或者输出都在 `session()` 的实现内部）。有输出说明有人绕过了统一的 `session(ctx)`，直接用了 `r.db`——那么「条件污染」和「ctx 不传播」的风险就在那些地方。这是「约定是否被遵守」的机器可验证手段。**凡是重要的编码约定，都应该能用一条 grep 验证**，否则它只是文档里的一句话。\n::debug bash\n```bash\n# 验收时执行\ngoose -dir migrations sqlite3 ./data/ledger.db status\n# Applied At                  Migration\n# ==============================================\n# (never applied)             00001_create_users.sql\n```\n::ask 服务已经跑了一周，为什么迁移显示从未执行？\n::ans 因为服务跑的是**另一个数据库文件**（相对路径 vs 绝对路径），或者迁移是 `AutoMigrate` 建的（`AutoMigrate` 不会写 goose 的版本表）。这解释了「为什么生产表结构和迁移文件对不上」。修法：① 统一用绝对路径/环境变量指定 DB；② 启动日志打印 DB 绝对路径；③ 如果表已存在但 goose 版本为空，需要用 `goose up` 时加 `--allow-missing` 或手工 `goose stamp` 标记基线。**「迁移版本表」是判断「结构从哪来」的唯一依据**。\n::transfer\n::scene 写阶段五的验收报告。\n::ask 报告必须包含哪些证据？哪些「没做到」要明确写出？\n::hint 想「别人怎么复现你的结论」。\n::ans\n**证据**：\n1. `go test ./... -race -coverpkg=...` 输出（含各包覆盖率）\n2. `govulncheck ./...` 输出（无漏洞）\n3. `goose status` 输出（版本号与生产库一致）\n4. `EXPLAIN QUERY PLAN` 四条（有索引/无索引/函数包装/覆盖索引）\n5. `grep -rn "r\\.db\\." internal/store` 输出（无绕过）\n6. `grep req_id` 一次真实 500 的完整日志链\n7. 列表接口 P95 耗时（1 万条数据下）\n8. `go test -count=10 -race` 输出（概率性竞态未复现）\n**必须明确写「没做到」**：预算只做了「设置 + 提示」，没做「分档提醒」；CSV 只做了全量加载，流式列为后续；覆盖率 store 包 62%（未达标原因：SQL 错误分支难构造）。**诚实的「未完成清单」比虚假的全绿更有价值**——它是下一阶段的输入。\n::crit 报告含测试/扫描/迁移/性能四类可复现证据\n::crit `grep` 验证「统一 session」约定被遵守\n::crit 有一次真实 500 的完整日志链（req_id 可检索）\n::crit 明确列出未完成项与原因，不掩盖\n',Rf='<!--day 1-->\n::pre 完成阶段五；现在配置散落在代码、环境变量、命令行参数里。\n::predict\n```go\nport := os.Getenv("PORT")\nif port == "" { port = "8080" }\ndbPath := os.Getenv("DB_PATH")\nif dbPath == "" { dbPath = "ledger.db" }\n// 共 15 个 os.Getenv\n```\n::ask 这种「到处 Getenv」的方式有什么问题？\n::ans ① 配置项散落在各处，没人知道总共有哪些、哪些必填；② 默认值写法不统一（有的有默认，有的没有，缺了就在运行时报错）；③ 类型转换重复（每处都要 `strconv.Atoi`）；④ 测试时无法一次性构造一套配置，只能到处 `Setenv`。修法：**启动时一次性加载到结构体**，之后全项目只用结构体。**配置是「启动时的输入」，应该在启动时定型**。\n::predict\n```go\ntype Config struct {\n    Port   int\n    DBPath string\n}\n// 加载顺序：默认值 → 配置文件 → 环境变量\n```\n::ask 为什么环境变量优先级最高？\n::ans 因为部署时的覆盖需求：配置文件进版本库（开发默认值），环境变量由部署环境注入（生产实际值）。反过来（配置文件覆盖环境变量）会导致「容器里设了变量却被镜像里的文件覆盖」，排查时极其反直觉。这是 12-Factor App 的约定：**默认值 < 配置文件 < 环境变量 < 命令行参数**。**优先级顺序要写进文档**，否则运维不知道该改哪个。\n::debug\n```yaml\n# config.yaml\nport: 8080\ndb_path: ./data/ledger.db\n```\n```bash\nPORT=9090 ./app\n# 日志显示 listening on :8080\n```\n::ask 为什么环境变量没生效？\n::ans 因为代码只读了文件，没做环境变量覆盖；或者读了但顺序反了（文件覆盖了环境变量）。这类问题在容器部署里特别常见——你改了 compose 的 `environment`，服务却还用着镜像里的默认值。修法：加载后用日志打印**最终生效值**（`slog.Info("config", "port", cfg.Port, "db", cfg.DBPath)`），让「实际用了什么」一眼可见。**配置的排查成本，取决于你有没有在启动时打印它**。\n::transfer\n::scene 设计完整的配置结构，覆盖端口、数据库、JWT 密钥、日志级别、CORS 来源、超时。\n::ask 写出结构体与加载函数，说明哪些必填、哪些有默认值。\n::hint 敏感项没有默认值，缺失就失败。\n::ans\n```go\ntype Config struct {\n    Port        int      `koanf:"port"`          // 默认 8080\n    DBPath      string   `koanf:"db_path"`       // 必填（或默认 ./data/ledger.db）\n    JWTSecret   string   `koanf:"jwt_secret"`    // 必填，无默认\n    LogLevel    string   `koanf:"log_level"`     // 默认 info\n    CORSOrigins []string `koanf:"cors_origins"`  // 默认空（同源）\n    ReadTimeout time.Duration `koanf:"read_timeout"`  // 默认 30s\n}\n```\n规则：**有安全含义的（密钥）必填且无默认；有合理工程默认的（端口、超时）给默认值；环境相关的（路径、CORS）显式配置**。加载后立刻校验（D2 讲），并把 `cfg` 以值传递注入各层——**不要用全局变量**，否则测试之间会互相影响。\n::crit 配置集中在一个结构体，启动时一次加载\n::crit 优先级明确（默认 < 文件 < 环境变量），并写进文档\n::crit 启动日志打印最终生效值（敏感项打码）\n::crit 不用包级全局配置变量，靠注入传递\n\n<!--day 2-->\n::pre 完成 D1：配置结构已定。\n::predict\n```go\ncfg.JWTSecret = os.Getenv("JWT_SECRET")   // 忘了检查空值\ntoken.SignedString([]byte(cfg.JWTSecret))  // 空字符串\n```\n::ask 用空密钥签发的 token 有什么后果？\n::ans 任何人只要知道「密钥是空字符串」就能伪造任意用户的 token——包括 `user_id=1` 的管理员。而且这种配置错误**不会导致任何报错**，服务正常运行，直到被利用。这就是为什么「启动即失败」是安全底线：**宁可服务起不来，也不要带着空密钥对外提供服务**。\n::predict\n```go\nif cfg.JWTSecret == "" {\n    slog.Warn("JWT_SECRET is empty, using a random one")\n    cfg.JWTSecret = randomString()\n}\n```\n::ask 这样处理有什么问题？\n::ans 两个：① **多实例部署时每个实例的随机密钥不同**，A 实例签发的 token 在 B 实例验证失败，表现为「随机掉登录」；② **重启后密钥变了**，所有用户被踢下线。所以「随机生成兜底」只适合单实例 + 可接受掉登录的开发环境。生产必须：**缺失就 `log.Fatal`**，让部署流程明确失败。**「友好的降级」在安全配置上是危险的**。\n::debug\n```bash\ndocker compose up\n# 服务正常启动\n# 但所有登录请求返回 500\n# 日志：signing key is empty\n```\n::ask 为什么启动时不报错？\n::ans 因为密钥只在「签发 token」时才被用到，启动路径没碰它——这是典型的「延迟失败」。修法是**在启动时主动校验所有必填配置**：\n```go\nfunc (c Config) Validate() error {\n    var errs []error\n    if len(c.JWTSecret) < 32 { errs = append(errs, errors.New("jwt_secret 长度不足 32")) }\n    if c.DBPath == "" { errs = append(errs, errors.New("db_path 未设置")) }\n    if c.Port <= 0 || c.Port > 65535 { errs = append(errs, fmt.Errorf("port 非法: %d", c.Port)) }\n    return errors.Join(errs...)\n}\n```\n`errors.Join` 能把多个错误一起报出来，用户一次改完，不用「改一个、重启、再报下一个」。**配置校验要在启动时做完，且一次报全**。\n::transfer\n::scene 写完整的配置校验，覆盖类型、范围、依赖关系。\n::ask 列出至少 6 条校验，说明每条防的是什么问题。\n::hint 想「端口范围、路径可写、密钥长度、超时正数、CORS 格式、日志级别枚举」。\n::ans\n| 校验 | 防的问题 |\n| `port` 1-65535 | 端口非法导致启动失败但错误晦涩 |\n| `db_path` 非空 + 父目录可写 | 运行时才发现「打不开数据库」 |\n| `jwt_secret` ≥ 32 字节 | 弱密钥可被暴力破解 |\n| `read/write_timeout` > 0 | 0 意味着永不超时（Slowloris） |\n| `log_level` ∈ {debug,info,warn,error} | 拼错后日志静默不输出 |\n| `cors_origins` 每项是合法 URL 且不含 `*`（生产） | `*` + credentials 会被浏览器拒绝，且不安全 |\n| 依赖关系：`env=production` 时 `cors_origins` 不能为空 | 生产环境默认放开跨域 |\n实现上返回 `errors.Join(...)`，`main` 里 `if err := cfg.Validate(); err != nil { log.Fatal(err) }`。**每条校验都对应一个「不校验就会在运行时踩的坑」**，不是为了凑数。\n::crit 必填项缺失时 `log.Fatal`，不降级、不猜默认值\n::crit 校验一次报全所有问题（`errors.Join`）\n::crit 密钥有最小长度校验，不是只判空\n::crit 生产模式与开发模式的校验强度不同（CORS、日志级别）\n\n<!--day 3-->\n::pre 完成 D1-D2：配置可用。\n::predict dockerfile\n```dockerfile\nFROM golang:1.23\nWORKDIR /app\nCOPY . .\nRUN go build -o app .\nCMD ["./app"]\n```\n::ask 这个镜像有多大？有什么问题？\n::ans 约 800MB-1GB（golang 镜像本身 800MB + 源码 + 构建缓存）。问题：① 把源码、测试、`.git` 全打进镜像；② 构建工具链也在里面（攻击面大）；③ 每次改代码都要重新下载依赖（除非利用缓存）；④ 以 root 运行。**多阶段构建**能把最终镜像降到 10-30MB：一个阶段编译，另一个阶段只拷二进制。\n::predict dockerfile\n```dockerfile\nFROM golang:1.23 AS builder\nWORKDIR /src\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nRUN CGO_ENABLED=0 go build -o /out/app ./cmd/ledger-api\n\nFROM alpine:3.20\nCOPY --from=builder /out/app /app\nCMD ["/app"]\n```\n::ask 为什么先 `COPY go.mod go.sum` 再 `COPY . .`？\n::ans 为了**利用 Docker 层缓存**：依赖只在 `go.mod`/`go.sum` 变化时才重新下载。如果先 `COPY . .`，任何一次源码改动都会让 `go mod download` 这层缓存失效，每次构建都重新拉全部依赖（几分钟）。这是 Dockerfile 最基本的优化，也是「构建慢」最常见的原因。**把「变化频率低的」放前面，「变化频率高的」放后面**。\n::debug dockerfile\n```dockerfile\nRUN CGO_ENABLED=0 go build -o /out/app ./cmd/ledger-api\n# 构建失败：no such directory\n```\n::ask 可能原因？\n::ans ① **构建上下文不含该目录**（`.dockerignore` 排除了 `cmd/`，或者 `COPY` 的路径不对）；② 模块根不在 `WORKDIR`（`go.mod` 在上一层）；③ 包路径拼错（`./cmd/ledger-api` vs `./cmd/api`）。排查：在 builder 阶段加 `RUN ls -R .` 或 `go list ./...` 看实际有哪些包。**`go build` 的路径错误信息通常很明确（"no Go files" 或 "no such directory"），照着路径核对即可**。\n::transfer\n::scene 写完整的多阶段 Dockerfile，包含缓存优化、静态编译、健康检查。\n::ask 写出完整文件，并说明每一行的目的。\n::hint 注意 `CGO_ENABLED=0`、`-ldflags`、`HEALTHCHECK`、`USER`。\n::ans\n```dockerfile\n# ---- build ----\nFROM golang:1.23-alpine AS builder\nWORKDIR /src\nRUN apk add --no-cache git ca-certificates\nCOPY go.mod go.sum ./\nRUN go mod download\nCOPY . .\nARG VERSION=dev\nRUN CGO_ENABLED=0 GOOS=linux go build \\\n    -trimpath \\\n    -ldflags="-s -w -X main.version=${VERSION}" \\\n    -o /out/app ./cmd/ledger-api\n\n# ---- runtime ----\nFROM gcr.io/distroless/static-debian12:nonroot\nCOPY --from=builder /out/app /app\nCOPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/\nEXPOSE 8080\nUSER nonroot:nonroot\nENTRYPOINT ["/app"]\n```\n要点：`CGO_ENABLED=0` 静态编译（不依赖 glibc，能跑在 distroless/scratch）；`-trimpath` 去掉本地路径（避免泄漏构建机目录，也让构建可复现）；`-s -w` 去掉符号表（镜像更小，但 panic 栈会缺行号——权衡）；`distroless:nonroot` 无 shell、无包管理器、非 root，攻击面最小。**生产镜像的原则是「只包含运行必需的东西」**。\n::crit 多阶段构建，运行镜像只含二进制与必要证书\n::crit `go.mod`/`go.sum` 先 COPY，依赖层能被缓存\n::crit `CGO_ENABLED=0` 静态编译，能解释原因\n::crit 镜像以非 root 用户运行\n\n<!--day 4-->\n::pre 完成 D3：多阶段构建可用。\n::predict dockerfile\n```dockerfile\nFROM scratch\nCOPY --from=builder /out/app /app\nENTRYPOINT ["/app"]\n```\n::ask 用 `scratch` 会缺什么？\n::ans ① **CA 证书**：任何 HTTPS 请求（调用外部 API）都会失败 `x509: certificate signed by unknown authority`；② **时区数据**：`time.LoadLocation("Asia/Shanghai")` 失败，只能用 UTC；③ **`/etc/passwd`**：`USER` 指令需要用户存在，scratch 里没有；④ 没有 shell，无法 `docker exec` 进去调试。所以要么用 `distroless`（含证书和 passwd），要么手动 COPY 证书与 `zoneinfo`。**「镜像越小越好」有下限——低于这个下限就开始缺运行时必需品**。\n::predict dockerfile\n```dockerfile\nFROM alpine:3.20\nRUN adduser -D -u 10001 app\nUSER app\n```\n::ask 切到非 root 后，可能出现什么问题？\n::ans ① **数据目录权限**：挂载的 `./data` 属主是宿主机的 root，容器内 uid 10001 写不进去，报 `readonly database` 或 `permission denied`；② **端口 < 1024** 需要特权（8080 没问题）；③ 某些库要写 `/tmp` 或 `$HOME`，而 distroless 的 `$HOME` 可能不存在。修法：宿主机上 `chown -R 10001:10001 ./data`，或在 compose 里 `user: "10001:10001"` 并确保目录属主一致。**「非 root 运行」不是加一行 USER 就完事，要连带处理文件权限**。\n::debug bash\n```bash\ndocker run -v $(pwd)/data:/data myapp\n# panic: unable to open database file: /data/ledger.db\n# permission denied\n```\n::ask 三个排查方向？\n::ans ① `ls -ld data` 看宿主机目录属主（大概率 root:root，而容器内是 uid 10001）；② 进容器 `id` 确认实际 uid；③ 看 DSN 路径是否真的是 `/data/ledger.db`（不是相对路径写到了别处）。修法：`chown -R 10001:10001 ./data`，或用 compose 的 `user: "${UID}:${GID}"` 对齐宿主机用户。**容器里的权限问题，永远是「容器内 uid」与「宿主机文件属主」的匹配问题**。\n::transfer\n::scene 为镜像瘦身做一次完整评估。\n::ask 列出「必须保留 / 可以删除 / 必须加回」三类内容。\n::hint 想想运行时到底需要什么。\n::ans\n**必须保留**：静态二进制、CA 证书（HTTPS）、时区数据（若用本地时区）、`/etc/passwd`（非 root 用户）。\n**可以删除**：Go 工具链、源码、`.git`、测试文件、`node_modules`（如果是前端）、包管理器缓存、shell（除非要 exec 调试）。\n**必须加回**：`ca-certificates`（如果用了 scratch）、`tzdata`（如果用 `LoadLocation`）、时区文件（`/usr/share/zoneinfo`）。\n瘦身手段：`.dockerignore` 排除无关文件、`-ldflags="-s -w"`、`upx`（可选，但会拖慢启动且可能被杀软误报）。**判断标准不是「镜像多小」，而是「运行时有没有缺东西」**——一个 20MB 但 HTTPS 调用失败的镜像，比 50MB 能正常工作的更糟。\n::crit 运行镜像含 CA 证书，HTTPS 调用不失败\n::crit 非 root 运行且数据目录权限已对齐\n::crit `.dockerignore` 排除 `.git`/测试/本地数据\n::crit 能说出「scratch / distroless / alpine」三者的取舍\n\n<!--day 5-->\n::pre 完成 D3-D4：镜像可用。\n::predict yaml\n```yaml\nservices:\n  api:\n    image: ledger-api:latest\n    ports:\n      - "8080:8080"\n    volumes:\n      - ./data:/data\n    environment:\n      - DB_PATH=/data/ledger.db\n```\n::ask 这份 compose 少了什么关键配置？\n::ans ① **没有健康检查**，编排系统不知道服务是否真的可用；② **没有重启策略**（`restart: unless-stopped`），进程崩了就停着；③ **没有资源限制**（内存/CPU），一个内存泄漏能拖垮宿主机；④ **没有日志轮转**，日志会无限增长撑爆磁盘；⑤ 镜像用 `latest`，部署不可复现。**「能 up 起来」和「能长期跑」差的就是这几项**。\n::predict yaml\n```yaml\nvolumes:\n  - ./data:/data\n# 后来改成\nvolumes:\n  - ledger-data:/data\n```\n::ask 命名卷和绑定挂载，各自适合什么场景？\n::ans **绑定挂载**（`./data:/data`）：数据在宿主机可见、易备份、易用 sqlite3 直接查看——适合家庭账本这种「我要能摸到文件」的场景。**命名卷**（`ledger-data:/data`）：由 Docker 管理，跨平台一致、权限问题少、但文件位置隐蔽（`/var/lib/docker/volumes/...`）。家庭场景推荐绑定挂载 + 明确属主；如果要「一条命令迁移到另一台机器」，命名卷配合 `docker run --volumes-from` 更方便。**关键是把数据放在「容器删除后仍然存在」的位置**，两种都满足。\n::debug bash\n```bash\ndocker compose up -d\ndocker compose ps\n# api   Up (healthy)  ← 但实际请求 502\n```\n::ask 容器 healthy 但请求失败，可能原因？\n::ans ① **健康检查只查了进程存活**（比如 `curl localhost:8080/healthz` 但 healthz 永远返回 200，连数据库都不查）——这就是「假健康」；② **端口映射错了**（容器内监听 9090，映射写 8080）；③ **健康检查在容器内执行，但容器里没有 curl**（distroless 镜像没有 curl！），检查一直失败或一直被当成「无法判定」。**distroless 镜像做健康检查必须在二进制里实现 `--health-check` 子命令，不能依赖 curl**。\n::transfer\n::scene 写完整的 compose 配置，包含迁移、健康检查、资源限制、日志轮转。\n::ask 写出文件并解释关键项。\n::hint 迁移用独立服务 + `service_completed_successfully`。\n::ans\n```yaml\nservices:\n  migrate:\n    image: ledger-api:${VERSION:-latest}\n    command: ["/app", "--migrate-only"]\n    volumes: ["./data:/data"]\n    environment:\n      DB_PATH: /data/ledger.db\n    restart: "no"\n\n  api:\n    image: ledger-api:${VERSION:-latest}\n    depends_on:\n      migrate:\n        condition: service_completed_successfully\n    ports: ["8080:8080"]\n    volumes: ["./data:/data"]\n    environment:\n      DB_PATH: /data/ledger.db\n      JWT_SECRET: ${JWT_SECRET:?JWT_SECRET 必须设置}\n      LOG_LEVEL: info\n    healthcheck:\n      test: ["CMD", "/app", "--health-check"]   # 镜像里没有 curl\n      interval: 30s\n      timeout: 3s\n      retries: 3\n      start_period: 5s\n    restart: unless-stopped\n    mem_limit: 256m\n    logging:\n      driver: json-file\n      options: { max-size: "10m", max-file: "3" }\n```\n`${JWT_SECRET:?...}` 让缺失时 compose 直接报错，比服务起来后 500 好。`start_period` 给启动留时间，避免冷启动被判定失败。\n::crit 迁移是独立服务，API 等它成功再启动\n::crit 健康检查不依赖 curl（distroless 无 curl）\n::crit 有重启策略、内存限制、日志轮转\n::crit 敏感配置用 `${VAR:?}` 强制必填，缺失即失败\n\n<!--day 6-->\n::pre 完成 D5：compose 可跑。\n::predict\n```yaml\n# 迁移放在 api 的 command 里\ncommand: sh -c "goose up && /app"\n```\n::ask 这样有什么问题？\n::ans ① 镜像里可能没有 `goose` 二进制（多阶段构建只拷了 app）；② 多个副本同时启动会并发迁移（D11 讲过的冲突）；③ 迁移失败时 `&&` 会让整个容器退出，但如果 `restart: always` 就会无限重启循环，日志被刷爆；④ 迁移和业务的日志混在一起，排查困难。**迁移应该是「一次性任务」，不是「每次启动都做的事」**。\n::predict bash\n```bash\ndocker compose run --rm migrate\n# 输出：OK 00005_create_budgets.sql\ndocker compose up -d api\n```\n::ask 如果迁移执行到一半失败（比如某个 ALTER 不兼容），会发生什么？\n::ans ① goose 会停在失败的版本，**后续迁移不会执行**；② 已执行的部分**不会自动回滚**（每个迁移文件是独立事务，但跨文件不是）；③ API 如果已经启动，会带着「半新半旧」的结构运行，可能报「列不存在」。处置：① 看 `goose status` 确认停在哪；② 手工修 SQL 或 `goose down` 回退到上一个版本；③ 修好后重新 `up`。**这就是为什么要 `--migrate-only` 单独跑**——失败时 API 不会启动，你不会面对「结构不对但服务在跑」的局面。\n::debug bash\n```bash\ndocker compose up -d\n# api 起来了\n# 但日志：no such table: budgets\n```\n::ask 迁移服务明明配置了，为什么表不存在？\n::ans ① `depends_on` 用了 `condition: service_started` 而不是 `service_completed_successfully`（API 在迁移还没跑完就启动了）；② 迁移服务跑的是**另一个数据库路径**（卷挂载不一致）；③ 迁移服务失败了但 `restart: "no"` 让它退出，API 的 `depends_on` 没拦住（旧版 compose 不支持 condition）。排查：`docker compose logs migrate` 看它到底做了什么。**「表不存在」先看迁移容器日志，不要先改代码**。\n::transfer\n::scene 设计一套「部署 → 迁移 → 启动 → 验证」的完整流程。\n::ask 写出流程与每步的失败处置。\n::hint 每一步都要有「失败了怎么办」。\n::ans\n```bash\nset -euo pipefail\n# 1. 拉镜像 / 构建\ndocker compose build\n# 2. 迁移（失败则整体中止，API 不启动）\ndocker compose run --rm migrate || { echo "迁移失败，查看 logs"; docker compose logs migrate; exit 1; }\n# 3. 启动\ndocker compose up -d api\n# 4. 等待健康\nfor i in {1..30}; do\n  if curl -fsS localhost:8080/healthz >/dev/null; then break; fi\n  sleep 1\ndone\ncurl -fsS localhost:8080/readyz || { echo "not ready"; docker compose logs api; exit 1; }\n# 5. 冒烟\ncurl -fsS localhost:8080/api/v1/ledger -H "Authorization: Bearer $SMOKE_TOKEN" > /dev/null\n```\n失败处置：迁移失败 → 修 SQL 或 `goose down`；启动失败 → 看 logs；不健康 → 看 `/readyz` 的具体依赖；冒烟失败 → 回滚镜像版本（`VERSION=previous docker compose up -d`）。**部署脚本的价值在于「失败时立刻停住并告诉你原因」**。\n::crit 迁移是独立步骤，失败则 API 不启动\n::crit 部署后自动轮询健康检查，超时失败\n::crit 有回滚方案（镜像版本可指定）\n::crit 能说出「迁移失败停在中间」的处置步骤\n\n<!--day 7-->\n::pre 完成 D5-D6：服务能部署。\n::predict\n```go\nmux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {\n    w.WriteHeader(200)\n})\n```\n::ask 这个健康检查有什么问题？\n::ans 它只证明「HTTP 服务器还在响应」，证明不了「业务可用」：数据库断了、磁盘满了、迁移没跑，它照样 200。但这**不一定是错的**——关键是要区分两类探针：`/healthz`（liveness，进程活着就该 200，否则重启反而更糟）和 `/readyz`（readiness，依赖都正常才 200，否则摘流量）。**把数据库检查放进 liveness，会导致「数据库抖一下，所有实例被重启」**，这是编排系统里最经典的雪崩模式。\n::predict\n```go\nfunc readyz(db *sql.DB) http.HandlerFunc {\n    return func(w http.ResponseWriter, r *http.Request) {\n        if err := db.Ping(); err != nil {\n            w.WriteHeader(503)\n            return\n        }\n        w.WriteHeader(200)\n    }\n}\n```\n::ask 这里用了 `db.Ping()` 而不是 `PingContext`，有什么风险？\n::ans `Ping()` 没有超时，如果数据库连接卡住（网络分区、磁盘 IO hang），这个请求会一直挂着——健康检查本身变成了「拖垮服务的请求」。必须 `PingContext(ctx)` 带短超时（1-2 秒）：\n```go\nctx, cancel := context.WithTimeout(r.Context(), time.Second)\ndefer cancel()\nif err := db.PingContext(ctx); err != nil { w.WriteHeader(503); return }\n```\n另外 `defer cancel()` 不能省（否则定时器泄漏），而且必须从 `r.Context()` 派生（客户端断开时探测也该结束）。**健康检查自己不能成为故障源**。\n::debug bash\n```bash\ncurl -i localhost:8080/readyz\n# 200 OK\n# 但紧接着业务请求全部 503\n```\n::ask readyz 说健康，业务却失败，可能是什么？\n::ans ① readyz 只查了数据库 ping，但**迁移没跑**（表不存在）——ping 成功不代表结构对；② 数据库连接池耗尽（ping 用的是池里最后一个连接，业务请求排队超时）；③ readyz 有缓存（比如 30 秒内返回上次结果），实际已经挂了。修法：readyz 除了 ping，还应该跑一条**极轻量的真实查询**（`SELECT 1` 不够，最好 `SELECT count(*) FROM schema_version` 之类能验证结构的），且不缓存。**「能连上」和「能用」之间差一次真实查询**。\n::transfer\n::scene 设计 liveness / readiness / startup 三类探针的完整策略。\n::ask 各自检查什么、超时多少、失败后果是什么？\n::hint 想「失败后编排系统会做什么」。\n::ans\n| 探针 | 检查内容 | 超时 | 失败后果 |\n| startup | 进程能否响应 HTTP | 3s，最多 30 次 | 重启容器（给慢启动留时间） |\n| liveness | HTTP 服务器是否响应（**不查依赖**） | 1s | 重启容器 |\n| readiness | 数据库 ping + 一条轻量真实查询 | 1s | **摘掉流量**，不重启 |\n关键原则：**liveness 失败 = 重启（治标），readiness 失败 = 摘流量（等它恢复）**。数据库短暂不可用时，应该 readyz 失败让流量走开，而不是重启所有实例（重启也连不上，还会放大故障）。startup 探针是为了「迁移/预热慢」的场景，避免 liveness 在启动期间误判。**三类探针的语义不能混用**。\n::crit 区分 liveness 与 readiness，健康检查不查依赖、就绪检查查\n::crit 用 `PingContext` 带 1 秒超时，不用无超时的 `Ping`\n::crit readiness 除 ping 外还有一条真实查询\n::crit 能说出「数据库抖动时不重启实例」的理由\n\n<!--day 8-->\n::pre 完成 D5-D7：部署与探针就绪。\n::predict\n```go\nsrv := &http.Server{Addr: ":8080", Handler: mux}\nsrv.ListenAndServe()\n```\n::ask 收到 SIGTERM 时，这个服务会怎样？\n::ans 进程**立即退出**，所有进行中的请求被强制断开（客户端看到 connection reset），数据库连接也没正常关闭。因为 Go 默认不处理 SIGTERM（会直接终止进程）。这就是为什么需要 `signal.NotifyContext` + `srv.Shutdown`。**没有优雅关闭的服务，每次部署都会丢掉正在处理的请求**——对账本来说，可能是「用户点了保存，页面报错，但数据其实写了一半」。\n::predict\n```go\nctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)\ndefer stop()\n<-ctx.Done()\nsrv.Shutdown(context.Background())   // 没有超时\ndb.Close()\n```\n::ask 这段有两个问题，分别是什么？\n::ans ① **`Shutdown` 用了 `context.Background()`**，没有超时——如果有请求永远不结束（死循环、无超时的外部调用），进程会永久挂住，编排系统等到 `stop_grace_period`（默认 10s）后 SIGKILL，等于没优雅。必须用 `context.WithTimeout(..., 10*time.Second)`。② **`db.Close()` 在 `Shutdown` 返回后立刻执行**，但 `Shutdown` 只保证「HTTP 请求处理完」，如果 handler 里有后台 goroutine 还在用 db，就会拿到「连接已关闭」的错误。正确顺序是：Shutdown（带超时）→ 等后台任务（WaitGroup）→ db.Close()。\n::debug bash\n```bash\ndocker stop api\n# 容器 10 秒后才停（被 SIGKILL）\n# 日志里没有 "shutdown complete"\n```\n::ask 为什么优雅关闭没生效？\n::ans ① **信号没被捕获**：`CMD ["./app"]` 是 exec 形式吗？如果是 `CMD ./app`（shell 形式），PID 1 是 shell，信号发给 shell 而不是 app——docker 的 SIGTERM 到不了应用。必须用 exec 形式（JSON 数组）或 `tini`/`dumb-init` 作为 init。② **`stop_grace_period` 太小**（默认 10s），而 `Shutdown` 超时设了 30s，编排系统先动手 SIGKILL。③ 日志级别不够，看不到关闭流程。**容器里「信号收不到」十次有八次是 shell 形式 CMD**。\n::transfer\n::scene 写完整的优雅关闭流程。\n::ask 写出代码骨架与顺序，说明每步的作用。\n::hint 顺序：停止接收 → 等请求 → 等后台 → 关库 → 打日志。\n::ans\n```go\nfunc run() error {\n    ctx, stop := signal.NotifyContext(context.Background(), syscall.SIGTERM, os.Interrupt)\n    defer stop()\n\n    srv := &http.Server{\n        Addr:              cfg.Addr,\n        Handler:           router,\n        ReadHeaderTimeout: 5 * time.Second,\n        ReadTimeout:       30 * time.Second,\n        WriteTimeout:      30 * time.Second,\n        IdleTimeout:       120 * time.Second,\n    }\n\n    errCh := make(chan error, 1)\n    go func() {\n        if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {\n            errCh <- err\n        }\n    }()\n\n    select {\n    case err := <-errCh:\n        return err\n    case <-ctx.Done():\n        slog.Info("shutdown signal received")\n    }\n\n    shutCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\n    defer cancel()\n    if err := srv.Shutdown(shutCtx); err != nil {\n        slog.Warn("graceful shutdown timed out", "err", err)\n    }\n    bg.Wait()             // 等后台任务（如有）\n    if err := sqlDB.Close(); err != nil { slog.Warn("db close", "err", err) }\n    slog.Info("shutdown complete")\n    return nil\n}\n```\n顺序不能乱：**先停止接收新请求，再等进行中的完成，最后才关数据库**。反过来的话，正在执行的 handler 会拿到「连接已关闭」。\n::crit `Server` 显式设置四个超时（含 `ReadHeaderTimeout`）\n::crit `signal.NotifyContext` 捕获 SIGTERM/SIGINT\n::crit `Shutdown` 用带超时的 ctx，且有兜底日志\n::crit 顺序为 Shutdown → 等后台 → `db.Close()`，并说明理由\n\n<!--day 9-->\n::pre 完成 D8：已实现优雅关闭。\n::predict bash\n```bash\ncurl localhost:8080/slow &     # 一个 3 秒才返回的请求\nsleep 0.5\ndocker stop api                # 期望：等请求完成再退出\ncurl 会成功吗？\n```\n::ask 这个测试能验证优雅关闭吗？怎么判断成功？\n::ans 能，但要观察三件事：① `curl` **收到完整响应**（200 + 完整 body），不是 connection reset；② 容器退出**耗时约 3 秒**（不是瞬间，也不是 10 秒被杀）；③ 日志里有 `shutdown signal received` 和 `shutdown complete` 两条。只看「容器停了」不能证明优雅——可能只是被杀得快。**验证优雅关闭必须同时看客户端结果和服务端日志**。\n::predict bash\n```bash\ndocker stop api\n# 容器 0.1 秒就退出了\n# 日志：shutdown complete\n```\n::ask 退出太快，说明什么？\n::ans 说明**根本没有进行中的请求**（测试没构造出来），或者 `Shutdown` 之后立刻 `db.Close()` + `os.Exit` 把还在跑的 goroutine 干掉了。也有可能是 `srv.Shutdown` 返回了 `context.Canceled`（因为 `srv.BaseContext` 被取消）导致提前返回。要构造「必然卡住」的请求才能验证：\n```go\nmux.HandleFunc("GET /slow", func(w http.ResponseWriter, r *http.Request) {\n    select {\n    case <-time.After(3 * time.Second):\n        w.Write([]byte("done"))\n    case <-r.Context().Done():\n        // 被中断\n    }\n})\n```\n**没有慢请求的测试，等于没测优雅关闭**。\n::debug bash\n```bash\ndocker stop api\n# 容器退出码 137\n```\n::ask 137 意味着什么？怎么修？\n::ans 137 = 128 + 9（SIGKILL），说明**容器被强制杀死**，优雅关闭没在宽限期内完成。原因：① `Shutdown` 超时 > `stop_grace_period`（compose 默认 10s），编排系统先动手；② 有请求永远不返回（死循环、无超时的外部调用）；③ 后台 goroutine 不响应 ctx。修法：调大 `stop_grace_period: 30s`，同时把 `Shutdown` 超时设小一点（10s），并把慢操作都加上 ctx。**「退出码 137」= 你的关闭流程超时了，不是 docker 的问题**。\n::transfer\n::scene 写一个可靠的优雅关闭验证脚本。\n::ask 脚本步骤、断言、判定标准分别是什么？\n::hint 用 `/slow` 制造进行中的请求，记录耗时与响应。\n::ans\n```bash\n#!/usr/bin/env bash\nset -euo pipefail\nBASE=http://localhost:8080\n\n# 1. 启动一个 3 秒的请求（后台）\n( curl -fsS -w \'\\nHTTP:%{http_code}\\n\' "$BASE/slow" > /tmp/slow.out 2>&1; echo $? > /tmp/slow.rc ) &\nSLOW_PID=$!\nsleep 0.5\n\n# 2. 记录停止开始时间，发 SIGTERM\nSTART=$(date +%s)\ndocker stop -t 30 api > /dev/null\nEND=$(date +%s)\nwait $SLOW_PID || true\n\n# 3. 断言\n[ "$(cat /tmp/slow.rc)" = "0" ] || { echo "请求被中断"; exit 1; }\ngrep -q \'HTTP:200\' /tmp/slow.out || { echo "响应不完整"; exit 1; }\nELAPSED=$((END - START))\n[ "$ELAPSED" -ge 2 ] && [ "$ELAPSED" -le 8 ] || { echo "关闭耗时异常: ${ELAPSED}s"; exit 1; }\ndocker inspect --format \'{{.State.ExitCode}}\' api | grep -qx 0 || { echo "退出码非 0（可能被 SIGKILL）"; exit 1; }\ndocker logs api 2>&1 | grep -q \'shutdown complete\' || { echo "缺少关闭日志"; exit 1; }\necho "OK: 优雅关闭验证通过（耗时 ${ELAPSED}s）"\n```\n四个断言覆盖四件事：**请求完成、响应完整、耗时合理、退出码 0**。少任何一个都可能「看起来优雅其实没」。\n::crit 验证脚本构造了进行中的慢请求\n::crit 断言请求成功 + 响应完整 + 退出码 0\n::crit 能诊断退出码 137 的三个原因\n::crit `stop_grace_period` > `Shutdown` 超时，两个值都显式设置\n\n<!--day 10-->\n::pre 完成 D5-D9：服务可部署、可优雅停止。\n::predict\n```go\nw.Header().Set("Access-Control-Allow-Origin", "*")\nw.Header().Set("Access-Control-Allow-Credentials", "true")\n```\n::ask 这两行同时设置会怎样？\n::ans 浏览器会**拒绝**这个响应：`The value of the \'Access-Control-Allow-Origin\' header in the response must not be the wildcard \'*\' when the credentials mode is \'include\'`。因为 `*` 意味着「任何源都能带凭证访问」，这在安全上不可接受。必须返回具体的源（`https://app.example.com`），且要校验请求的 `Origin` 在白名单里。**`*` + credentials 是无效组合，不是「宽松一点」**。\n::predict go\n```go\n// 开发时前端 5173，后端 8080\n// 方案 A：后端开 CORS\n// 方案 B：Vite 代理\n```\n::ask 两种方案各适合什么场景？生产环境用哪个？\n::ans **开发**：优先 Vite 代理（`server.proxy`），因为「同源」请求不需要 CORS，也不需要处理 Cookie 的 `SameSite`——前端代码里直接写 `/api/v1/...` 即可，和生产环境一致。**生产**：优先反向代理（Nginx/Caddy）把 `/api` 转发到后端，同样实现同源。只有在「前后端确实不同域且无法反代」时才开 CORS。**能用同源解决，就不要用 CORS**——CORS 是浏览器安全模型的例外，例外越多越容易出错。\n::debug bash\n```bash\ncurl -i -X OPTIONS localhost:8080/api/v1/ledger \\\n  -H \'Origin: http://localhost:5173\' \\\n  -H \'Access-Control-Request-Method: POST\'\n# 405 Method Not Allowed\n```\n::ask 为什么预检请求 405？\n::ans 因为路由只注册了 `POST /api/v1/ledger`，浏览器发的 `OPTIONS` 请求没有匹配的 handler，ServeMux 返回 405。CORS 中间件必须在**路由匹配之前**处理 `OPTIONS` 并直接返回 204，而不是让它走到 mux。正确顺序：`CORS(Recovery(Logging(Auth(mux))))`——CORS 在最外层（或至少在 mux 之前），预检请求在中间件层就被短路返回。**预检请求不带业务语义，不该进入业务路由**。\n::transfer\n::scene 设计开发与生产两套跨域方案。\n::ask 各自怎么配？Cookie 的 `SameSite` 要怎么设？\n::hint 同源时 SameSite 可以 Lax，跨站时需要 None + Secure。\n::ans\n**开发**：Vite 代理\n```ts\nserver: {\n  proxy: { \'/api\': { target: \'http://localhost:8080\', changeOrigin: true } }\n}\n```\n前端请求 `/api/v1/...`，浏览器认为同源，无 CORS、无 SameSite 问题。\n**生产**：Nginx 反代\n```nginx\nlocation /api/ { proxy_pass http://api:8080; proxy_set_header Host $host; }\nlocation /     { root /usr/share/nginx/html; try_files $uri /index.html; }\n```\n同样是同源，Cookie 设 `SameSite=Lax` 即可。\n**如果必须跨站**：`Access-Control-Allow-Origin: https://app.example.com`（具体源）、`Allow-Credentials: true`、`SameSite=None; Secure`——三者必须同时满足，缺一个 Cookie 就不会被带上。**「Cookie 带不上」第一查 SameSite，第二查 Secure 与协议**。\n::crit 预检请求在中间件层返回 204，不进业务路由\n::crit 不用 `*` + credentials 的组合\n::crit 开发用代理、生产用反代，尽量保持同源\n::crit 跨站时 `SameSite=None; Secure` 与 CORS 具体源同时配置\n\n<!--day 11-->\n::pre 完成 D3-D10：镜像与部署就绪。\n::predict bash\n```bash\ngovulncheck ./...\n# Vulnerability #1: GO-2024-XXXX\n#   Called by: ...\n#   Found in: golang.org/x/crypto@v0.20.0\n```\n::ask 这个输出说明「一定需要升级」吗？\n::ans 要看有没有 `Called by` 的调用栈。`govulncheck` 的核心价值是**区分「依赖里有漏洞」和「你的代码真的调用了漏洞函数」**：有调用栈 → 真实风险，必须处理；只有 "Found in" 没有 "Called by" → 当前不可达，记录并跟踪。**不做这个区分的话，每次扫描几十条告警，最后没人看**。\n::predict bash\n```bash\ngo get -u ./...\ngo test ./...\n# 编译失败\n```\n::ask 为什么「全量升级」是坏策略？\n::ans ① 大版本升级会有 breaking change（比如 GORM v1→v2、jwt v4→v5）；② 一次升几十个依赖，出问题时无法定位是哪个导致的；③ 升级本身引入新 bug 的风险，可能比漏洞本身更现实。正确策略：**先只升补丁版本**（`go get -u=patch ./...`），跑测试 + 重新扫描；解决不了再考虑次版本/大版本，且**一次只升一个**，单独回归。**升级要可回滚、可归因**。\n::debug bash\n```bash\ngovulncheck ./...\n# No vulnerabilities found\n# 但 go list -m all | grep golang.org/x/net\n# v0.17.0  ← 已知有漏洞\n```\n::ask 为什么扫描说没漏洞，但依赖版本很旧？\n::ans 因为 `govulncheck` 只报「**当前模块图里、且可达**」的漏洞。如果旧版 `x/net` 只是间接依赖且漏洞函数没被调用，它不会报。但这不代表安全——一旦将来代码路径变化调用了那个函数，风险就出现了。做法：① 定期 `go get -u=patch` 保持补丁最新；② 关注依赖的安全公告；③ 对「明知有漏洞但不可达」的依赖，在文档里记录并设复查时间。**「扫描通过」是当下的快照，不是永久免疫**。\n::transfer\n::scene 把漏洞扫描接入构建流程。\n::ask 放在哪个环节？失败时阻断还是告警？给出具体配置。\n::hint 想想「开发本地」和「CI」的差别。\n::ans\n**本地**：`make vuln` 手动跑，快速反馈。\n**CI**：在 `docker build` **之前**跑，作为独立 step：\n```yaml\n- name: govulncheck\n  run: |\n    go install golang.org/x/vuln/cmd/govulncheck@latest\n    govulncheck ./...\n```\n**阻断策略**：对「有调用栈」的漏洞**阻断合并**；对「不可达」的漏洞**告警 + 记录 issue**（可以用 `-json` 输出后自己判断）。全量阻断会导致「一条不可达告警卡住所有 PR」，团队最终会加 `|| true`，等于关掉扫描。**分级处置比一刀切有效**。\n另外固定 `govulncheck` 版本（不要 `@latest`），否则某天工具更新导致 CI 突然红。\n::crit 能区分「有调用栈」与「仅依赖存在」两类结果\n::crit 升级策略是「先补丁、再逐个、每次回归」\n::crit 扫描接入 CI，且分级处置（阻断/告警）\n::crit 固定扫描工具版本，不用 `@latest`\n\n<!--day 12-->\n::pre 完成阶段四的 Cookie 方案；现在要补齐安全属性。\n::predict\n```go\nhttp.SetCookie(w, &http.Cookie{\n    Name:  "token",\n    Value: signed,\n})\n```\n::ask 这个 Cookie 缺了哪些属性？各自防什么？\n::ans 缺四个：`HttpOnly`（防 XSS 通过 `document.cookie` 窃取）、`Secure`（防明文 HTTP 传输被嗅探）、`SameSite`（防跨站请求自动携带，CSRF 第一道防线）、`Path=/`（默认只在设置它的路径生效，其他接口不带）。还有 `MaxAge`（不设就是会话 Cookie，关浏览器即失效——可能不是你想要的）。**每个属性对应一类攻击，缺一个就少一层**。\n::predict\n```go\n// 登出时\nhttp.SetCookie(w, &http.Cookie{Name: "token", Value: "", MaxAge: -1})\n```\n::ask 这样能删掉 Cookie 吗？还缺什么？\n::ans 大多数情况能（`MaxAge: -1` 表示立即过期），但**必须带上与原 Cookie 相同的 `Path` 和 `Domain`**，否则浏览器认为这是「另一个 Cookie」，原 Cookie 还在。常见症状：登出后刷新页面又是登录状态。正确写法：\n```go\nhttp.SetCookie(w, &http.Cookie{\n    Name: "token", Value: "", Path: "/", MaxAge: -1, HttpOnly: true, Secure: true, SameSite: http.SameSiteLaxMode,\n})\n```\n**删除 Cookie 的本质是「用相同作用域覆盖一个过期值」**，作用域不匹配就删不掉。\n::debug bash\n```bash\n# 本地 http://localhost:8080 测试\n# 登录成功，但浏览器没有保存 Cookie\n```\n::ask 为什么？\n::ans 因为 `Secure: true` 的 Cookie **只在 HTTPS 下才会被保存**（`localhost` 在部分浏览器被视为安全上下文例外，但 `192.168.1.10` 不会）。家庭内网用 http 访问时，`Secure` 会导致 Cookie 被静默丢弃，表现为「登录成功但立刻掉登录」。取舍：① 生产/有域名时用 HTTPS + `Secure`；② 内网 http 场景，`Secure` 设为「根据协议动态」（`r.TLS != nil`），但这会让内网流量明文——要明确接受这个风险。**不要为了「配置看起来安全」而在 http 环境开 Secure，那只会让功能坏掉**。\n::transfer\n::scene 设计完整的 Cookie 策略，覆盖开发/生产/内网三种环境。\n::ask 各环境的属性组合是什么？如何避免「本地能跑线上挂」？\n::hint 用配置项控制 `Secure`，而不是硬编码。\n::ans\n| 环境 | Secure | SameSite | 说明 |\n| 本地开发(http localhost) | false | Lax | localhost 是安全上下文，但 Secure 仍会限制 |\n| 内网 http(192.168.x) | false | Lax | 明确接受明文风险，靠网络隔离 |\n| 生产 https | true | Lax（或 Strict） | 标准配置 |\n实现：`Secure: cfg.CookieSecure`，配置项由环境决定；启动日志打印实际值。**「安全属性」不是越多越好，要和实际协议匹配**——不匹配的结果不是「更安全」，是「功能失效 + 有人为了修好而全部关掉」。另外无论哪种环境，`HttpOnly` 都应该开（它不依赖协议），`Path=/` 都应该显式写。\n::crit `HttpOnly` 在所有环境都开启\n::crit `Secure` 由配置控制，与协议匹配，启动日志可见\n::crit 删除 Cookie 时 `Path`/`Domain` 与原 Cookie 一致\n::crit 能说出「http 环境开 Secure 会导致 Cookie 静默丢弃」\n\n<!--day 13-->\n::pre 完成 D12：Cookie 属性已配。\n::predict go\n```go\nmux.HandleFunc("POST /api/v1/ledger", csrf.Protect(key)(h.Create))\nmux.HandleFunc("GET /healthz", h.Health)\n```\n::ask 这样挂 CSRF 有什么问题？\n::ans 只保护了创建接口，其他写接口（更新、删除、注册、登录）都没保护；而且 `csrf.Protect` 包在单个 handler 上，**未匹配的路径、其他路由都绕过了校验**。正确做法是包住整个路由器：\n```go\nhandler := csrf.Protect(key, csrf.Secure(true))(mux)\nsrv := &http.Server{Handler: handler}\n```\n**CSRF 中间件必须在路由之前**，否则「没匹配到路由的请求」不会经过它——而攻击者恰恰可以利用这些路径。**中间件的位置决定了它的覆盖面**。\n::predict go\n```go\nhandler := Recovery(Logging(RateLimit(Auth(csrf.Protect(key)(mux)))))\n```\n::ask 这个顺序有什么问题？\n::ans CSRF 在最内层（Auth 之后），意味着：① 未通过 CSRF 的恶意请求会先消耗限流配额、先做鉴权（鉴权要查库/验签，有成本）；② 如果 Auth 因为某种原因放行了（比如公开接口），CSRF 才生效，覆盖面不完整。推荐顺序：**Recovery → CSRF → RateLimit → Auth**。理由：Recovery 最外捕获所有 panic；CSRF 尽早拦截无效请求（最便宜，只验 token）；RateLimit 对「合法形状」的请求限流；Auth 最后做昂贵的身验。**「便宜且能拒绝的检查放前面」是中间件排序的通用原则**。\n::debug bash\n```bash\n# 前端带了 Cookie 但没带 CSRF token\ncurl -X POST localhost:8080/api/v1/ledger \\\n  -b \'token=xxx\' -d \'{"amount":100}\'\n# 403 Forbidden\n```\n::ask 这是 bug 还是预期？前端该怎么拿 token？\n::ans 是**预期行为**——CSRF 中间件要求写请求带 token。前端需要：① 页面加载时请求 `GET /csrf-token`（或从 Cookie 里读，取决于方案），拿到 token；② 每个写请求带 `X-CSRF-Token` 头。用 `gorilla/csrf` 时，它会把 token 放在名为 `_gorilla_csrf` 的 Cookie 里（HttpOnly），并提供一个 `csrf.TemplateField` / `csrf.Token(r)` 让后端注入到页面或接口。**SPA 场景通常在登录响应里返回 token，或提供一个 `GET /csrf` 接口**——关键是「前端有个稳定途径拿到它」。\n::transfer\n::scene 设计完整的 CSRF 防护方案，说明 SPA + Cookie 场景怎么落地。\n::ask 中间件顺序、token 下发方式、豁免路径分别是什么？\n::hint 想「哪些路径不需要 CSRF」（健康检查、登录？）以及为什么。\n::ans\n**中间件顺序**：`Recovery → CSRF → RateLimit → Auth → mux`。\n**token 下发**：`GET /api/v1/csrf` 返回 `{token}`（同时通过 `csrf.Token(r)` 生成），前端存内存，写请求带 `X-CSRF-Token`。\n**豁免**：`/healthz`、`/readyz`（GET，无副作用，且编排系统不会带 token）；`/api/v1/login` 通常也豁免（用户还没会话，CSRF 无意义），但**要确保登录接口本身没有副作用**（比如不能「登录即创建资源」）。\n**不豁免**：所有写接口（POST/PUT/PATCH/DELETE），包括 logout（防止被强制登出）。\n**注意**：`SameSite=Lax` 已经挡住了大部分跨站 POST，CSRF token 是第二道防线。两者都要有，不是二选一。**「有 SameSite 就够了」是常见误解**——Lax 对顶层 GET 导航仍会带 Cookie，且老浏览器支持不一。\n::crit `csrf.Protect()` 包住整个路由器，不在单个 handler 上\n::crit 顺序为 Recovery → CSRF → RateLimit → Auth，且能说出理由\n::crit 有明确的 token 下发途径，前端可稳定获取\n::crit 豁免路径只有无副作用的（healthz/readyz），登录豁免有理由\n\n<!--day 14-->\n::pre 完成 D1-D13：后端可部署、安全项已配。\n::predict bash\n```bash\n# Vue 前端 build 后由 Nginx 提供，/api 反代到后端\ncurl -I https://ledger.example.com/\n# 200，但页面白屏\n```\n::ask 白屏最常见的原因是什么？\n::ans ① **静态资源 404**：Vue 的路由是 history 模式，直接访问 `/ledger` 时 Nginx 找不到对应文件，必须 `try_files $uri $uri/ /index.html`；② **API base URL 写死成 `localhost:8080`**，部署后浏览器请求自己的 localhost；③ **构建产物路径不对**（`base: \'/\'` vs `\'/app/\'`）。白屏时先看浏览器 Console 的 404/网络错误，再看 `index.html` 是否正确返回。**「白屏」= HTML 拿到了但 JS 没跑起来，先看资源加载**。\n::predict bash\n```bash\n# 手机上访问 http://192.168.1.10:8080\n# 登录成功，但点「添加账目」没反应\n```\n::ask 可能原因？\n::ans ① **监听地址是 `localhost`**（只回环），手机根本连不上——但这里「登录成功」说明连上了；② **Cookie 的 `Secure`** 导致 http 下 Cookie 不保存，第二个请求变成未登录，前端拿到 401 但没处理（表现为「没反应」）；③ **CORS 预检失败**（如果前端和后端不同源），浏览器的 OPTIONS 被拒；④ 前端错误没提示（catch 了但没展示）。排查：手机连电脑开 Safari/Chrome 远程调试，或后端日志看第二个请求是否 401。**「手机上点了没反应」八成是 401 + 前端没提示**。\n::debug bash\n```bash\ndocker compose logs api | tail -20\n# 全是 GET /healthz 200\n# 没有任何业务请求\n```\n::ask 前端说「请求发出去了」，日志里却没有，问题在哪？\n::ans 请求**没到后端**：① 前端 API base URL 指向了错误的 host/port；② Nginx 反代配置错误（`proxy_pass` 路径多了/少了 `/api` 前缀）；③ 请求被浏览器拦截（CORS 预检失败时，实际请求根本不会发出）；④ 混合内容（https 页面请求 http 接口被浏览器阻止）。排查：浏览器 Network 面板看请求状态（failed / CORS error / 404），以及 `docker compose logs nginx`。**「前端说发了，后端没收到」= 看 Network 面板，不要猜**。\n::transfer\n::scene 做最终的手机端验收。\n::ask 列出验收清单（至少 8 项），并说明每项验证什么。\n::hint 覆盖登录、增删改查、统计、预算、导出、刷新、断网。\n::ans\n| # | 操作 | 验证 |\n| 1 | 手机浏览器打开首页 | 静态资源加载、路由正常 |\n| 2 | 注册新账号 | 表单校验、错误提示 |\n| 3 | 登录 | Cookie 保存（刷新后仍登录） |\n| 4 | 添加账目（含中文备注、逗号） | 金额单位正确、CSV 转义 |\n| 5 | 列表看到刚添加的 | 分页、排序 |\n| 6 | 删除并确认 | 二次确认、列表更新 |\n| 7 | 查看月度统计 | 数字与手算一致 |\n| 8 | 超预算时看到提示 | budget 标志展示 |\n| 9 | 导出 CSV 并用手机打开 | 编码、列对齐 |\n| 10 | 关闭浏览器重开 | Cookie 持久化（MaxAge） |\n| 11 | 飞行模式下操作 | 错误提示友好，不白屏 |\n**第 3、10 项验证 Cookie 生命周期；第 4、9 项验证编码与单位；第 11 项验证错误处理**。全部通过才算「可交付」——这也是整条路线的最终验收。\n::crit 手机端完成「登录 → 添加 → 列表 → 统计 → 删改」完整链路\n::crit 刷新/重开浏览器后仍保持登录\n::crit CSV 在手机上能正确打开，中文不乱码\n::crit 断网时有明确错误提示，不白屏、不静默失败\n',wf={1:[xf],2:[_f],3:[Cf],4:[vf],5:[kf],6:[Rf]};function Tf(e){const n={},t=/<!--day (\d+)-->/g,r=[];let s;for(;(s=t.exec(e))!==null;)r.push({day:Number(s[1]),start:s.index+s[0].length,at:s.index});return r.forEach((o,i)=>{const a=i+1<r.length?r[i+1].at:e.length;n[o.day]=e.slice(o.start,a).trim()}),n}function Df(e){const n={predict:[],debug:[],transfer:[],criteria:[]};let t=null,r=null,s=null,o=null,i=!1;const a=l=>{if(o){const c=o.obj[o.key];o.obj[o.key]=c?`${c}
${l}`:l}};for(const l of e.split(`
`)){const c=l.replace(/\s+$/,""),u=c.trim();if(u.startsWith("::")){const d=u.indexOf(" "),m=(d<0?u.slice(2):u.slice(2,d)).trim(),f=d<0?"":u.slice(d+1).trim();switch(i=!1,o=null,m){case"pre":n.prereq=f,o={obj:n,key:"prereq"};break;case"predict":t={code:"",lang:f||"go",ask:"",answer:""},n.predict.push(t),r=null,s=null,i=!0;break;case"debug":r={symptom:"",code:"",lang:f||"go",ask:"",answer:""},n.debug.push(r),t=null,s=null,i=!0;break;case"code":r&&(f&&(r.code=f),i=!0);break;case"sym":r&&(r.symptom=f,o={obj:r,key:"symptom"});break;case"ask":t?(t.ask=f,o={obj:t,key:"ask"}):r?(r.ask=f,o={obj:r,key:"ask"}):s&&(s.ask=f,o={obj:s,key:"ask"});break;case"ans":t?(t.answer=f,o={obj:t,key:"answer"}):r?(r.answer=f,o={obj:r,key:"answer"}):s&&(s.answer=f,o={obj:s,key:"answer"});break;case"transfer":s={scene:"",ask:"",answer:""},n.transfer.push(s),t=null,r=null,o={obj:s,key:"scene"};break;case"scene":s&&(s.scene=f,o={obj:s,key:"scene"});break;case"hint":s&&(s.hint=f,o={obj:s,key:"hint"});break;case"crit":n.criteria.push(f),o={obj:n.criteria,key:String(n.criteria.length-1)};break}continue}if(i){const d=/^```\s*([\w+#-]*)\s*$/.exec(u);if(d){const m=d[1];m&&t?t.lang=m:m&&r&&(r.lang=m);continue}t?t.code=t.code?`${t.code}
${c}`:c:r&&(r.code=r.code?`${r.code}
${c}`:c);continue}u&&a(c)}return n.criteria=n.criteria.map(l=>l.trim()).filter(Boolean),n.predict=n.predict.filter(l=>l.ask&&l.code),n.debug=n.debug.filter(l=>l.ask&&(l.symptom||l.code)),n.transfer=n.transfer.filter(l=>l.scene&&l.ask),n}const dl={};for(const[e,n]of Object.entries(wf)){const t={};for(const[r,s]of Object.entries(Tf(n.join(`

`))))t[Number(r)]=Df(s);dl[Number(e)]=t}function Lt(e,n){return n.map(t=>{var r,s;return{...t,lesson:(r=ul[e])==null?void 0:r[t.day],mastery:(s=dl[e])==null?void 0:s[t.day]}})}const he={title:"家庭账本 · 学习路线",subtitle:"Go 后端 + Vue 前端 · 服务端视角 · 94 天逐日计划",goalMd:Hd,prefaceMd:Gd,redisMd:$d,overviewMd:jd,pacingMd:Qd,phases:[{id:1,name:"Go 语法与数据库入门",weeks:"2–3 周",core:"Go 语法、错误处理、接口、SQLite",acceptance:"命令行账本，关掉终端数据还在",md:zd,checklist:["`add` 两笔","关终端","重开","`list` 两笔都在","`sum` 数字正确"],days:Lt(1,nf)},{id:2,name:"并发、接口与分包",weeks:"1–2 周",core:"goroutine、channel、竞态、context、分包",acceptance:"-race 报告出现又消失",md:Kd,checklist:["能解释“`main` 为什么依赖接口而不是具体类型”","`-race` 报告出现过并被修复"],days:Lt(2,tf)},{id:3,name:"HTTP 服务端与 REST API",weeks:"3 周",core:"net/http、路由、中间件、REST、统一响应、分页",acceptance:"curl 增查，重启不丢，分页可用",md:Jd,checklist:["curl 创建两笔","**重启**","两笔都在","分页生效","summary 正确","**此时 API 已可被 Vue 调用**"],days:Lt(3,rf)},{id:4,name:"用户认证与数据隔离",weeks:"2 周",core:"密码哈希（Argon2id / bcrypt cost 12）、JWT、认证中间件、数据隔离",acceptance:"A 看不到 B 的账，响应无密码字段",md:Vd,checklist:["A 创建一笔","B 登录看不到","无 token 返回 401","任何响应无密码哈希"],days:Lt(4,sf)},{id:5,name:"分层、GORM、迁移、统计、预算与测试",weeks:"4–5 周",core:"分层、GORM（Session 隔离 + 请求级 Context 字段）、迁移、连接池、统计、预算、CSV 导出、测试、集中错误处理、结构化日志",acceptance:"go test 全绿，迁移可执行，日志带 request ID",md:Yd,checklist:["`go test ./...` 全绿","curl 走通全流程","迁移可执行","日志中能用 request ID 定位请求","能解释“`Session` 的 `NewDB` 和 `Context` 字段各自解决什么问题”，以及为什么这比 `WithContext` 的隐式绑定更确定"],days:Lt(5,of)},{id:6,name:"配置、部署与收尾",weeks:"2–3 周",core:"配置管理、Docker、优雅关闭（Server 超时 + Shutdown 顺序）、健康检查、CORS、govulncheck、Cookie 安全 + CSRF",acceptance:"手机浏览器完成完整操作，服务可优雅停止，无已知依赖漏洞",md:Xd,checklist:["手机浏览器完成“登录 → 添加账目 → 列表看到 → 统计正确 → 超预算有标志”","`docker stop` 时服务优雅退出","`govulncheck` 通过","CSRF 中间件位置正确，`/healthz` 不在 CSRF 豁免路径之外暴露风险"],days:Lt(6,af)}],timelineMd:Zd,remindersMd:ef},Af=he.phases.reduce((e,n)=>e+n.days.length,0);he.phases.reduce((e,n)=>e+n.days.reduce((t,r)=>t+r.tasks.length,0),0);function Ss(e){return he.phases.find(n=>n.id===e)}function Nf(e,n){var t;return(t=Ss(e))==null?void 0:t.days.find(r=>r.day===n)}const fl=he.phases.flatMap(e=>e.days.map(n=>({phaseId:e.id,phaseName:e.name,day:n.day,title:n.title})));function hl(e,n){return fl.findIndex(t=>t.phaseId===e&&t.day===n)}function vi(e,n,t){const r=hl(e,n);return r<0?null:fl[r+t]??null}const gl="family-ledger-roadmap:progress:v4",Of="family-ledger-roadmap:progress:v3";function Fr(e,n,t){return`p${e}-d${n}-t${t}`}function Br(e,n,t){return`p${e}-d${n}-k${t}`}function Ws(e,n){return`p${e}-a${n}`}function Lf(){try{const e=localStorage.getItem(gl);if(e){const t=JSON.parse(e);if(Array.isArray(t))return new Set(t)}const n=localStorage.getItem(Of);if(n){const t=JSON.parse(n);if(Array.isArray(t))return new Set(t)}}catch{}return new Set}const qe=Ht(Lf());jn(qe,e=>{try{localStorage.setItem(gl,JSON.stringify([...e]))}catch{}},{deep:!0});function Gt(){const e=(C,k)=>{var O;return(O=he.phases.find(q=>q.id===C))==null?void 0:O.days.find(q=>q.day===k)},n=(C,k,O)=>qe.has(Fr(C,k,O));function t(C,k,O){const q=Fr(C,k,O);qe.has(q)?qe.delete(q):qe.add(q)}function r(C,k){const O=e(C,k),q=(O==null?void 0:O.tasks.length)??0;let X=0;for(let ee=0;ee<q;ee++)qe.has(Fr(C,k,ee))&&X++;return{done:X,total:q}}const s=(C,k,O)=>qe.has(Br(C,k,O));function o(C,k,O){const q=Br(C,k,O);qe.has(q)?qe.delete(q):qe.add(q)}function i(C,k){var ee;const O=e(C,k),q=((ee=O==null?void 0:O.mastery)==null?void 0:ee.criteria.length)??0;let X=0;for(let j=0;j<q;j++)qe.has(Br(C,k,j))&&X++;return{done:X,total:q}}const a=(C,k)=>{const O=r(C,k);if(O.total===0||O.done!==O.total)return!1;const q=i(C,k);return q.total===0?!0:q.done===q.total};function l(C,k){var X;const O=e(C,k);if(!O)return;const q=a(C,k);O.tasks.forEach((ee,j)=>{const M=Fr(C,k,j);q?qe.delete(M):qe.add(M)}),(X=O.mastery)==null||X.criteria.forEach((ee,j)=>{const M=Br(C,k,j);q?qe.delete(M):qe.add(M)})}function c(C){const k=he.phases.find(ee=>ee.id===C);if(!k)return{daysDone:0,daysTotal:0,tasksDone:0,tasksTotal:0};let O=0,q=0,X=0;return k.days.forEach(ee=>{const{done:j,total:M}=r(C,ee.day);q+=j,X+=M,a(C,ee.day)&&O++}),{daysDone:O,daysTotal:k.days.length,tasksDone:q,tasksTotal:X}}const u=(C,k)=>qe.has(Ws(C,k));function d(C,k){const O=Ws(C,k);qe.has(O)?qe.delete(O):qe.add(O)}function m(C){const k=he.phases.find(X=>X.id===C),O=(k==null?void 0:k.checklist.length)??0;let q=0;for(let X=0;X<O;X++)qe.has(Ws(C,X))&&q++;return{done:q,total:O}}const f=_e(()=>he.phases.reduce((C,k)=>C+k.days.length,0)),g=_e(()=>{let C=0;return he.phases.forEach(k=>{k.days.forEach(O=>{a(k.id,O.day)&&C++})}),C}),b=_e(()=>[...qe].filter(C=>C.includes("-t")).length),_=_e(()=>he.phases.reduce((C,k)=>C+k.days.reduce((O,q)=>O+q.tasks.length,0),0)),w=_e(()=>[...qe].filter(C=>C.includes("-k")).length),A=_e(()=>he.phases.reduce((C,k)=>C+k.days.reduce((O,q)=>{var X;return O+(((X=q.mastery)==null?void 0:X.criteria.length)??0)},0),0)),x=_e(()=>f.value===0?0:Math.round(g.value/f.value*100)),S=_e(()=>{var C,k,O,q,X,ee;for(const j of he.phases)for(const M of j.days)if(!a(j.id,M.day))return{phaseId:j.id,phaseName:j.name,day:M.day,title:M.title,hours:M.hours,readMin:((C=M.lesson)==null?void 0:C.readMin)??0,quiz:((k=M.lesson)==null?void 0:k.quiz.length)??0,predict:((O=M.mastery)==null?void 0:O.predict.length)??0,debug:((q=M.mastery)==null?void 0:q.debug.length)??0,transfer:((X=M.mastery)==null?void 0:X.transfer.length)??0,depth:((ee=M.lesson)==null?void 0:ee.depth)??"normal"};return null});function T(){qe.clear()}return{isTaskDone:n,toggleTask:t,dayProgress:r,isCritDone:s,toggleCrit:o,critProgress:i,dayDone:a,toggleDay:l,phaseProgress:c,isAcceptDone:u,toggleAccept:d,acceptProgress:m,totalDays:f,doneDays:g,doneTasks:b,totalTasks:_,doneCriteria:w,totalCriteria:A,percent:x,nextDay:S,reset:T}}const ki={};function If(e){let n=ki[e];if(n)return n;n=ki[e]=[];for(let t=0;t<128;t++){const r=String.fromCharCode(t);n.push(r)}for(let t=0;t<e.length;t++){const r=e.charCodeAt(t);n[r]="%"+("0"+r.toString(16).toUpperCase()).slice(-2)}return n}function qt(e,n){typeof n!="string"&&(n=qt.defaultChars);const t=If(n);return e.replace(/(%[a-f0-9]{2})+/gi,function(r){let s="";for(let o=0,i=r.length;o<i;o+=3){const a=parseInt(r.slice(o+1,o+3),16);if(a<128){s+=t[a];continue}if((a&224)===192&&o+3<i){const l=parseInt(r.slice(o+4,o+6),16);if((l&192)===128){const c=a<<6&1984|l&63;c<128?s+="��":s+=String.fromCharCode(c),o+=3;continue}}if((a&240)===224&&o+6<i){const l=parseInt(r.slice(o+4,o+6),16),c=parseInt(r.slice(o+7,o+9),16);if((l&192)===128&&(c&192)===128){const u=a<<12&61440|l<<6&4032|c&63;u<2048||u>=55296&&u<=57343?s+="���":s+=String.fromCharCode(u),o+=6;continue}}if((a&248)===240&&o+9<i){const l=parseInt(r.slice(o+4,o+6),16),c=parseInt(r.slice(o+7,o+9),16),u=parseInt(r.slice(o+10,o+12),16);if((l&192)===128&&(c&192)===128&&(u&192)===128){let d=a<<18&1835008|l<<12&258048|c<<6&4032|u&63;d<65536||d>1114111?s+="����":(d-=65536,s+=String.fromCharCode(55296+(d>>10),56320+(d&1023))),o+=9;continue}}s+="�"}return s})}qt.defaultChars=";/?:@&=+$,#";qt.componentChars="";const Ri={};function Mf(e){let n=Ri[e];if(n)return n;n=Ri[e]=[];for(let t=0;t<128;t++){const r=String.fromCharCode(t);/^[0-9a-z]$/i.test(r)?n.push(r):n.push("%"+("0"+t.toString(16).toUpperCase()).slice(-2))}for(let t=0;t<e.length;t++)n[e.charCodeAt(t)]=e[t];return n}function lt(e,n,t){typeof n!="string"&&(t=n,n=lt.defaultChars),typeof t>"u"&&(t=!0);const r=Mf(n);let s="";for(let o=0,i=e.length;o<i;o++){const a=e.charCodeAt(o);if(t&&a===37&&o+2<i&&/^[0-9a-f]{2}$/i.test(e.slice(o+1,o+3))){s+=e.slice(o,o+3),o+=2;continue}if(a<128){s+=r[a];continue}if(a>=55296&&a<=57343){if(a>=55296&&a<=56319&&o+1<i){const l=e.charCodeAt(o+1);if(l>=56320&&l<=57343){s+=encodeURIComponent(e[o]+e[o+1]),o++;continue}}s+="%EF%BF%BD";continue}s+=encodeURIComponent(e[o])}return s}lt.defaultChars=";/?:@&=+$,-_.!~*'()#";lt.componentChars="-_.!~*'()";function fo(e){let n="";return n+=e.protocol||"",n+=e.slashes?"//":"",n+=e.auth?e.auth+"@":"",e.hostname&&e.hostname.indexOf(":")!==-1?n+="["+e.hostname+"]":n+=e.hostname||"",n+=e.port?":"+e.port:"",n+=e.pathname||"",n+=e.search||"",n+=e.hash||"",n}function ts(){this.protocol=null,this.slashes=null,this.auth=null,this.port=null,this.hostname=null,this.hash=null,this.search=null,this.pathname=null}const Pf=/^([a-z0-9.+-]+:)/i,Ff=/:[0-9]*$/,Bf=/^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,qf=["<",">",'"',"`"," ","\r",`
`,"	"],Uf=["{","}","|","\\","^","`"].concat(qf),Wf=["'"].concat(Uf),wi=["%","/","?",";","#"].concat(Wf),Ti=["/","?","#"],Hf=255,Di=/^[+a-z0-9A-Z_-]{0,63}$/,Gf=/^([+a-z0-9A-Z_-]{0,63})(.*)$/,Ai={javascript:!0,"javascript:":!0},Ni={http:!0,https:!0,ftp:!0,gopher:!0,file:!0,"http:":!0,"https:":!0,"ftp:":!0,"gopher:":!0,"file:":!0};function ho(e,n){if(e&&e instanceof ts)return e;const t=new ts;return t.parse(e,n),t}ts.prototype.parse=function(e,n){let t,r,s,o=e;if(o=o.trim(),!n&&e.split("#").length===1){const c=Bf.exec(o);if(c)return this.pathname=c[1],c[2]&&(this.search=c[2]),this}let i=Pf.exec(o);if(i&&(i=i[0],t=i.toLowerCase(),this.protocol=i,o=o.substr(i.length)),(n||i||o.match(/^\/\/[^@\/]+@[^@\/]+/))&&(s=o.substr(0,2)==="//",s&&!(i&&Ai[i])&&(o=o.substr(2),this.slashes=!0)),!Ai[i]&&(s||i&&!Ni[i])){let c=-1;for(let g=0;g<Ti.length;g++)r=o.indexOf(Ti[g]),r!==-1&&(c===-1||r<c)&&(c=r);let u,d;c===-1?d=o.lastIndexOf("@"):d=o.lastIndexOf("@",c),d!==-1&&(u=o.slice(0,d),o=o.slice(d+1),this.auth=u),c=-1;for(let g=0;g<wi.length;g++)r=o.indexOf(wi[g]),r!==-1&&(c===-1||r<c)&&(c=r);c===-1&&(c=o.length),o[c-1]===":"&&c--;const m=o.slice(0,c);o=o.slice(c),this.parseHost(m),this.hostname=this.hostname||"";const f=this.hostname[0]==="["&&this.hostname[this.hostname.length-1]==="]";if(!f){const g=this.hostname.split(/\./);for(let b=0,_=g.length;b<_;b++){const w=g[b];if(w&&!w.match(Di)){let A="";for(let x=0,S=w.length;x<S;x++)w.charCodeAt(x)>127?A+="x":A+=w[x];if(!A.match(Di)){const x=g.slice(0,b),S=g.slice(b+1),T=w.match(Gf);T&&(x.push(T[1]),S.unshift(T[2])),S.length&&(o=S.join(".")+o),this.hostname=x.join(".");break}}}}this.hostname.length>Hf&&(this.hostname=""),f&&(this.hostname=this.hostname.substr(1,this.hostname.length-2))}const a=o.indexOf("#");a!==-1&&(this.hash=o.substr(a),o=o.slice(0,a));const l=o.indexOf("?");return l!==-1&&(this.search=o.substr(l),o=o.slice(0,l)),o&&(this.pathname=o),Ni[t]&&this.hostname&&!this.pathname&&(this.pathname=""),this};ts.prototype.parseHost=function(e){let n=Ff.exec(e);n&&(n=n[0],n!==":"&&(this.port=n.substr(1)),e=e.substr(0,e.length-n.length)),e&&(this.hostname=e)};const $f=Object.freeze(Object.defineProperty({__proto__:null,decode:qt,encode:lt,format:fo,parse:ho},Symbol.toStringTag,{value:"Module"})),pl=/[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/,ml=/[\0-\x1F\x7F-\x9F]/,jf=/[\xAD\u0600-\u0605\u061C\u06DD\u070F\u0890\u0891\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804[\uDCBD\uDCCD]|\uD80D[\uDC30-\uDC3F]|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/,Oo=/[!-#%-\*,-\/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061D-\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u09FD\u0A76\u0AF0\u0C77\u0C84\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B4E\u1B4F\u1B5A-\u1B60\u1B7D-\u1B7F\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E4F\u2E52-\u2E5D\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD803[\uDD6E\uDEAD\uDED0\uDF55-\uDF59\uDF86-\uDF89]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9\uDFD4\uDFD5\uDFD7\uDFD8]|\uD805[\uDC4B-\uDC4F\uDC5A\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDEB9\uDF3C-\uDF3E]|\uD806[\uDC3B\uDD44-\uDD46\uDDE2\uDE3F-\uDE46\uDE9A-\uDE9C\uDE9E-\uDEA2\uDF00-\uDF09\uDFE1]|\uD807[\uDC41-\uDC45\uDC70\uDC71\uDEF7\uDEF8\uDF43-\uDF4F\uDFFF]|\uD809[\uDC70-\uDC74]|\uD80B[\uDFF1\uDFF2]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD81B[\uDD6D-\uDD6F\uDE97-\uDE9A\uDFE2]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD839\uDDFF|\uD83A[\uDD5E\uDD5F]/,El=/[\$\+<->\^`\|~\xA2-\xA6\xA8\xA9\xAC\xAE-\xB1\xB4\xB8\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0384\u0385\u03F6\u0482\u058D-\u058F\u0606-\u0608\u060B\u060E\u060F\u06DE\u06E9\u06FD\u06FE\u07F6\u07FE\u07FF\u0888\u09F2\u09F3\u09FA\u09FB\u0AF1\u0B70\u0BF3-\u0BFA\u0C7F\u0D4F\u0D79\u0E3F\u0F01-\u0F03\u0F13\u0F15-\u0F17\u0F1A-\u0F1F\u0F34\u0F36\u0F38\u0FBE-\u0FC5\u0FC7-\u0FCC\u0FCE\u0FCF\u0FD5-\u0FD8\u109E\u109F\u1390-\u1399\u166D\u17DB\u1940\u19DE-\u19FF\u1B61-\u1B6A\u1B74-\u1B7C\u1FBD\u1FBF-\u1FC1\u1FCD-\u1FCF\u1FDD-\u1FDF\u1FED-\u1FEF\u1FFD\u1FFE\u2044\u2052\u207A-\u207C\u208A-\u208C\u20A0-\u20C1\u2100\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F\u218A\u218B\u2190-\u2307\u230C-\u2328\u232B-\u2429\u2440-\u244A\u249C-\u24E9\u2500-\u2767\u2794-\u27C4\u27C7-\u27E5\u27F0-\u2982\u2999-\u29D7\u29DC-\u29FB\u29FE-\u2B73\u2B76-\u2BFF\u2CE5-\u2CEA\u2E50\u2E51\u2E80-\u2E99\u2E9B-\u2EF3\u2F00-\u2FD5\u2FF0-\u2FFF\u3004\u3012\u3013\u3020\u3036\u3037\u303E\u303F\u309B\u309C\u3190\u3191\u3196-\u319F\u31C0-\u31E5\u31EF\u3200-\u321E\u322A-\u3247\u3250\u3260-\u327F\u328A-\u32B0\u32C0-\u33FF\u4DC0-\u4DFF\uA490-\uA4C6\uA700-\uA716\uA720\uA721\uA789\uA78A\uA828-\uA82B\uA836-\uA839\uAA77-\uAA79\uAB5B\uAB6A\uAB6B\uFB29\uFBB2-\uFBD2\uFD40-\uFD4F\uFD90\uFD91\uFDC8-\uFDCF\uFDFC-\uFDFF\uFE62\uFE64-\uFE66\uFE69\uFF04\uFF0B\uFF1C-\uFF1E\uFF3E\uFF40\uFF5C\uFF5E\uFFE0-\uFFE6\uFFE8-\uFFEE\uFFFC\uFFFD]|\uD800[\uDD37-\uDD3F\uDD79-\uDD89\uDD8C-\uDD8E\uDD90-\uDD9C\uDDA0\uDDD0-\uDDFC]|\uD802[\uDC77\uDC78\uDEC8]|\uD803[\uDD8E\uDD8F\uDED1-\uDED8]|\uD805\uDF3F|\uD807[\uDFD5-\uDFF1]|\uD81A[\uDF3C-\uDF3F\uDF45]|\uD82F\uDC9C|\uD833[\uDC00-\uDCEF\uDCFA-\uDCFC\uDD00-\uDEB3\uDEBA-\uDED0\uDEE0-\uDEF0\uDF50-\uDFC3]|\uD834[\uDC00-\uDCF5\uDD00-\uDD26\uDD29-\uDD64\uDD6A-\uDD6C\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDDEA\uDE00-\uDE41\uDE45\uDF00-\uDF56]|\uD835[\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3]|\uD836[\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85\uDE86]|\uD838[\uDD4F\uDEFF]|\uD83B[\uDCAC\uDCB0\uDD2E\uDEF0\uDEF1]|\uD83C[\uDC00-\uDC2B\uDC30-\uDC93\uDCA0-\uDCAE\uDCB1-\uDCBF\uDCC1-\uDCCF\uDCD1-\uDCF5\uDD0D-\uDDAD\uDDE6-\uDE02\uDE10-\uDE3B\uDE40-\uDE48\uDE50\uDE51\uDE60-\uDE65\uDF00-\uDFFF]|\uD83D[\uDC00-\uDED8\uDEDC-\uDEEC\uDEF0-\uDEFC\uDF00-\uDFD9\uDFE0-\uDFEB\uDFF0]|\uD83E[\uDC00-\uDC0B\uDC10-\uDC47\uDC50-\uDC59\uDC60-\uDC87\uDC90-\uDCAD\uDCB0-\uDCBB\uDCC0\uDCC1\uDCD0-\uDCD8\uDD00-\uDE57\uDE60-\uDE6D\uDE70-\uDE7C\uDE80-\uDE8A\uDE8E-\uDEC6\uDEC8\uDECD-\uDEDC\uDEDF-\uDEEA\uDEEF-\uDEF8\uDF00-\uDF92\uDF94-\uDFEF\uDFFA]/,yl=/[ \xA0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000]/,Qf=Object.freeze(Object.defineProperty({__proto__:null,Any:pl,Cc:ml,Cf:jf,P:Oo,S:El,Z:yl},Symbol.toStringTag,{value:"Module"})),zf=[8364,0,8218,402,8222,8230,8224,8225,710,8240,352,8249,338,0,381,0,0,8216,8217,8220,8221,8226,8211,8212,732,8482,353,8250,339,0,382,376];function Kf(e){return e===0||e>=55296&&e<=57343||e>1114111}function Jf(e){return Kf(e)?65533:e>=128&&e<=159&&zf[e-128]||e}function Vf(e){return e-1>>>0<127||e-160>>>0<55136?String.fromCharCode(e):String.fromCodePoint(Jf(e))}const Rn=(()=>{const e=new Uint8Array(127);let n=0;for(let t=33;t<=126;t++)t!==34&&t!==36&&t!==92&&(e[t]=n++);return e})();function Yf(e,n,t,r,s,o){const a=e.length,l=o*90;let c=0;const u=()=>{const q=Rn[e.charCodeAt(c++)];return q<o?q:q*91-l+Rn[e.charCodeAt(c++)]},d=t-r,m=t+s,f=new Int32Array(m);f.fill(-1,r,o),f.fill(-1,o+d,m);const g=new Int32Array(m),b=new Int32Array(m);function _(q,X){let ee=0,j=X;const M=X+q;for(;j<M;){const ce=Rn[e.charCodeAt(c++)];if(ce<89)ee+=ce,f[j++]=ee;else if(ce===89){let Ce=Rn[e.charCodeAt(c++)]+2;for(;Ce--;)f[j++]=++ee}else{const Ce=Rn[e.charCodeAt(c++)];ee+=89+(Ce<90?Ce*91+Rn[e.charCodeAt(c++)]:Rn[e.charCodeAt(c++)]*8281+Rn[e.charCodeAt(c++)]*91+Rn[e.charCodeAt(c++)]),f[j++]=ee}}}_(r,0),_(d,o);const w=new Int32Array(s*2);let A=0,x=0;function S(q,X){for(let ee=0;ee<q;ee++){const j=X+ee,M=u(),ce=u();w[x*2]=M,w[x*2+1]=ce,x+=1,g[j]=A;const Ce=(f[M]<0?b[M]:1)+(f[ce]<0?b[ce]:1);b[j]=Ce,A+=Ce}}S(s-o+r,o+d),S(o-r,r);const T=new Uint16Array(A);let C=0;for(let q=0;q<x;q++)for(let X=0;X<2;X++){const ee=w[q*2+X],j=f[ee];if(j<0){let M=g[ee];const ce=M+b[ee];for(;M<ce;)T[C++]=T[M++]}else T[C++]=j}const k=new Uint16Array(n);let O=0;for(;c<a;){let q=Rn[e.charCodeAt(c++)];q>=o&&(q=q*91-l+Rn[e.charCodeAt(c++)]);const X=f[q];if(X<0){let ee=g[q];const j=ee+b[q];for(;ee<j;)k[O++]=T[ee++]}else k[O++]=X}return k}const Xf=Yf("!}.&u%}'&}*'~!6*)%&,~!J~!J~%L~y<~!R,~~%Lu~~#GD~~#|)1#%}^%}2%+#.##%##%}&%##%'#%##&%#%#'%#&#%#&#'#%%#&#%##%#)%''%&%#%#'%#%%#%%}%%%#%#&(23#%%#&-%0%('1#(##%#'##+%'*.:1}#%#6-+(%'%%#%%%}#L'2351&('%}&/N'(0(/*-%(%%}#'+&T%7.2}#&%&#%#36/5##%&%%#&#%%#))2%%##%&&'0~!#*+&'%1~!%).'3q?&%'1~!.##%6(~!+%%%(Gw'rT~!E#<nA%#jZ~!H%(~!42##~!*31&~!G%U~#)5~#`3~!J~!Z~%]~%Y~%C~!q~!u~#kz~%#~!6'~!D~!U~!?~#T~!c%~!G#'~%7|~!G~!J~!G&~#pb~(Df}#%}*&}#%##%##%##&#-}&'#'&%#.++}%mI,#,@&(}*%}*'%&##&#%##%}&0}#.},U},%}+%}&%}#%##&}B%(}(%}+%)})%##%#&}&%##%&}<%}>%#%&}*%}(%}9%}/%})%}*%}*%}?&}&%}3%}&*#%})%#%#)}#&#-#+*%E%%'%'#%}#*V##&##I}#&&##%&%#&&Qf%%))w/0+&%#(#.%-''''++++7}>%4'',##1,#%#&%##&#'##&#*#9)%&%}#*}%,#+P(%A&%#'&##wSD',9E00#y#@}(+}&%&>~!#~!X}#*}(&&}(&}(,%}%&#+&}#&}I%#%}%)#(},'%#*}4%%#%}(''}#/##(##),%-##%%)#&}(.}&%#&}%%}*&#%},&&}&%}#%*'#%})%}D&}&%}-&}6&#&}-,%}#%})-(~+`~,=?~I9'9%~!,#%})%})%}@%}?%}(~!?~#<~#pP~#BG~#=1#%K+~#?#~%;)~#A~#mF1~#A'~'X%'~#lR~#N~'N~#r~#m#-~#i'?%#'%~#B%##%,%#~#_%#0%~#]732~,w~2+#:&#%&'0%&>%}#>##F+)#%&&#(+_}4&}-%}(&}@&}O7Fdf0@+/v4}&WU##&/0#&'('B#%}.%}'+#%}#%%&#&%#%##+#&#)#6#'#.},%}c%},%#%##%&#&%#&~#>'*-.%##%##%}#%%}%'~#)D1}#%*&~#_%%'(~#S2%'.}#~#=##*'*-%}&'%'##&&~'E%.#&~#M4}%%##&'%#~#O1##%&#'+~#<B%##%%'%+~#;#@%}#&%#&&%#(~#H1}'%'##&&~#?A}&'~#D#%32}'&&&&~#[}'(#%}'~#;C})&}%%#%~#=&%,3}%'(#%%~#^'#&&)#%'~#Y%-~#d-%'~#^%%&#&&&}#~#b~2t*&'~&(~&@~0%~e~3}%*''0})&}+~!9##-}#%-hD*)1fC#%/&/fB#40~!+#)*4~!+~!K'&:~!/*7~!.#~!H~!L':~%x&~!H#~!*~%1~!I#~!+A~#p'~!F~~#-#~,,(~.Z~!V~%;'B'mq-W~!N~%I%#&&#&}#%},%%}'%}+X#%}#&}(%}'%}<%}#%}%%'}'%}:~![)9@~%>~#UA%-%##&~!C%~!-.9:~!1~!-^2/:a~!y,D*J#-5)/4~%23,~#G~!L1~!0X3`~!2+~!!0-~&E~!W~!o,>Y&]~%cZx_&~#O*9#A#'#+I'%#)~!0B*-5A+-((F&*M#)(-7-5+'-3a5Vi~!Y~!?+[)%3),ERHm~!+:D,VG.+)?fB%%*(%)'(#&80%1'8`K8?`+'Z#&O&'H5#*9)A%%5&3))0%39+.*7#()&&*=4@**L)<'_&*+..;(#*+)./&0#3)%')-8(4ixD(&.}%,('aI:,)%,k2231T)I'#/-W7,/'Q#.'Y24+h')37</31&83##&0#),H(?'&?/1##%#&&#%''-%&&&#(&''&#.-'%#%%(,')*'&#&#'##%(%(#%('#&##%%%%('%#%#%%#%#&%##h>w+v<ayvyvcg.uuhKr}g/v|g>u9i[~>g5uI~=RvdwEg;v/g;uk!!TTSx]@RT!U!#!@VBRUU!'UTe-d0c`e&gSdicedFcrdTaqb.kYcAohdYd@a3e+d}dMdtd.aJ#bqcK`dle/e.e'dwdPdodddjbEb}ogd^ofdpduc6j?l%d{drdqc)d7bacOdQ%T#Y)X.sR[yH>6Vyv3[xwLu>vo'!*.[yBacahoj>6Rew3[xqdZa#!a&#^(X-[yG>6Vyu3[xvg3sEr|g.u/Ri9db0T#^(Xa)!-[y;>6Vylg4wKs{JwNZt3@3r=c4Z([xlg;wKt!cpq's@v7A'*a(a+!-a#[y<3Dt?3Dt'>6Vym3[xmg9rxsNJwLZt4~?r?db1T#`-!(Xa,!0[yS>6Vz%NuQs.g4wKtnJwNZtS@3r>c4Z([y%g;wKtrdga8!a(!#&T*Y-Xa#!a0<or[yc3Dtq>6Vz43[y3JwNZtf@3s!Ju}!%Dti:pm3c_%X#tjB5pkd6q!r]u?voC'*-a.a2!0a&a+[yI3DtI3Ds~3DtH>6Vyw3[xx;:s#~<5pKJwNZtE@3r~d`a)!a2T#a.(!+U.X1[yT3Dt`3Dtv>6Vz&3[y&g9rxwzcxstPu.<rAJwLZtT~?r@dZa%!a.&^*Za(/Reu[ya>6Vz23[y1g3sEr}wkg{NuQRg{ci(U#5@b`~,cg#U(2WnH5wugcRh7dX#T(Y,a'Ta!!a,[yZ<]mj>6Vz,3[y+Pv#5ReZKu+=,%!H}7ABwkaS?Rh:BcW(X#<]mrj:ubv/ARekdg%!(!a.*Ta(Y.X1!#sP>Rl*Dt6[y>>6Vyo3Wf*jOvuumvuRgRJuq*!:9<B@bX~3jVv&v@s@5Re[d/rQt{uAvo&a&a*)a2!,0Wf!3Dt0=Bs'>6Re}3[xy~<5s%JwJZt1~Gs)c;&!#2sJkNuXvzq7rxu,Re8dka4!a8(aEZ+a@Y.X1Xa)[yd=Bs(3DtP>6Vz53[y4cX#X&Re:avRe9~<5s&JwJZtQ~Gs*i^rzvdRg+Jv{%!2sbB@bX}kdga,!Za?&^*T1/!a'Dt+[y6>6Vyf3Wf%g/u;s4hGu6?Rh-JvZ,!c%#&RoX54Rivj7uyvf8RgTKvZB%*!2sGh<vu5Rgq<=C::9bb~#dZ#T&Ta6Y.X*Dt>[y93Wf)coZ(T,6VyifluvRgC@95@B@bX~/hFu34cC#T,k/unq8w8Q5RkUklwQuzunq8w8Q5Rk8d/rJu?v8w9)-&!a0a;a&aIWejg3sEr/h1s<DtDJvyZqY5aws3Jvy!&Wei~Hr1:au5@Bag>23E~5c:Z&bX};kKv?w&unuVu5Rjc;>bs)#~@:Rh.=ay<a]C;b`}Vd6s/t{uAvoaxa()!a,a7%-a#a2Dt,[yF2Wo[>6Vyt3[xuNuPRi&NuPwpi#RoWh?vf8Ri%Jv]!%Ri:KvxD!.'2WeAjZu`q9rxu,Re7woeAg-unLq(qA_/*2Wg_g3u5q^9:4E}/jTrxrzv=Wkkd~0UX#^^Xa-a1a5T&a=U1a'*aEa]!a*aPaA-adok[y54Rn>;:p3~Dp5g9rpsFNvZqjg3uJp4~<5p0Pw;5qlJwNZt*@3p1Pw:5p/Ou!5p2JvG'!6Vye=<qnJvh_[xhg3v,Rh3kOwOw-sDuev/Re^dha[a%!%!a+#Ta7)-5TaCaO!aka!a)sf[yb2>Rl!9ARiq5E}Qg=ucRkBE|oJrJ_@Wk~@Wk{JrJ_@Wk|@WkyJrJ_@Wk}@WkzJvO_[y2g-vMRmiKuYC!)&>Ri;>Ri<@3RkNc](X#@9Rk=g5vuRmhKvDB!+'=]meg3u4Rmgd)#Y'Vz3CARmfd`a+!%T'!+#Ta1Ta6TaM-sTDt9[yA9sYd'%Y#s[[xpj:ueunaXRgEjRq,v-vuqdd2'`#6Rev<32@5>:2<E}5xIo9a*X#Y(;5RePJvD_g>vyRgNj8w)v8<wggs:RgXiZt|vjx,hSq3ah!-(~@:Ro/Ou!5RhWj^v(pyw8unRhUdx-UY#^Ua.a3a70!)%UX1TaDa)'omRiRRhE[y:3Dsz=Br,>6Vyj3[xkg6ruwjcqsrPw;5r*Ku]D'Zt-@3r(~?r.i[vwv]dU1a--U#`a4(g/vsRhPOu!5RhLj:rmu9Wo!~@:wdh@g/vsRiTjXuvvNr}:RhBj^v(pyw8unRn]dz1UYa'a+^Y(!aETZalaRY.Ta?a4[yDJw1!#qLsW>6Vyrfzq-pLflpwRe|Js>%!Dt@3Dt&Jvy_[xs~HrnjMuwpsw'RecKu+D#'!t<~Grl~?rjg5u-x,gwp{ah!-(~@:Rg~Ou!5Rh'jXuvvNr}:Rh#cW#X/c;&!#2sLi[v7u7RgpJv)(!iLrxu,Re6j7v@s@5Se[e7d`aW!Za(a`T.a#!a3!&aDa-!9)Dt_=6s+3[x~~DR|h~DS6avhGun5RkZj3w)v-]mkKunB!&*]kb97R|i<ARk<c:Z(6Vy}Juh'!wziMRoS:F|vkLuauJv5vtvQRh1d='T+Y#VyO~DR|jcF#T'7R|g97R|kJv3'!ay<Rj,Jvh&!:ReXcsa6*a+#a#_aIRf9aLRf?c,Z&Rf5Rf7c.Z&Rf;Rf>cQ#%T'p-Rf8Rf=ct#%'(*!,p,Rf4p+Rf6Rf:Rf<d~'Ua%U*^UYa(!a,-!#a4YaTalaEX0a8a<Weo3Dt/3Dsx=Br93Wen~Dr;~<5p<JwNZt2@3p=Pw:5p;Ou!5r3c7&!#:p>3Ds}KvGB)_6Vyk2sM=<r7x'eovA(!hFu1ARf}cV#X&@r5j6rvwQa^Rf3c=Za'wkghJv__g;unRggA53B9=b^}%j6uduo5Jq;!(hIv%2Re`Ou4ARe_e%a#^^^Xa&!a*a2!&a6YaP!*ad!#a:aE/5Rn?[y@>6Vyp;:pE~DrY~<5pBJwNZt8@3pCh=rt3rWPw:5pAJup_[xoNuPpF9c!#'45pD5ARn)d8#X'X*3@rU72s]h>v<<sSjJpqvewOJq/(!hNw'5ReBk0s2u3w/w'5ReE5@Jq.!a+JQ!&WeU23d(#Y&RjG5]jBk!u7w&u0udARjEe#+^^^Ub#!a2/a`Z(agT1!a-a;|@TaG!aS[yV=Re~fow'RguNuPRe?bz#'>RoUWeL>:Cbb|?JwPZtVg6ruRmzJvD'!6Vz(g/vmRh~Jvy_[y(g9voRgyx*cy(#2>Ri2B9b]~9kIw9u7rluJu3Rg]dI#a%UY'@=p%CAx.gQZ&RhwwygtRm{x5g_Z'+ABqR9Woa=Bp&dV#^*Xa'!&@o{g4v]Rk;Jv{!%Rk[wkkiA5RkiwwfUB=x,fUuqC&*!>RfTg8v0RfV~ARfSd;rJsAuAv9wR'ae+/aO!a@aza/a#[yQ@Wg!2Wemg3sEr0JvB_g>uvReWg2v+Re=KupB_+[y!2AbY~-~Hr2AJwD!(h<~El>h<~El?Kun@+_:9b`}Kg-v/Ri3g;vtwyk_9]k_d=&T#*U.6qh@Ab`|K9:H|CJv[!&3Dtex'fDwC%!Rf[9WlMd[(^X,!a%Z06Vz!@WgBg=v~Rgvg,QRe@awd,#Y+jTv|Q~EfWj]uNr|~FRfXdy#Y&^Ua%!aO.!(a)Ua;=!a@aKap!a-,a!Ta]a[rSa]p?[y82sK=Bq~;:p:~<5p8Pw:5p7d'#Y'Wf(;RnRi[u4w&RgJJvG'!6Vyh=<r#ijuuv/sIKuYD'ZtG@3p9~Gr&d2#`(g<vtRgFj`u5w&rqpxRf2CJuY!+:wfnTOu!5Rg}jNs1ucv&RfwJvA!&3@q|BDcC#T,k/unq8w8Q5RkTklwQuzunq8w8Q5Rk9dga#!a'!a=#a0!:+Tb*b@aO.a4!aba8aFJv^}?!VyR~Dr<g;u%Rn.~<5p[x'e`wNZtR@3p]Pw:5pZhNvjBp.woe_g5u-r4JwF!%DtO3:ooc7&!#:p^3DtpLuGw(!+%)Dtk6Vz#2sd=<r8d'#Y([y#<x3gJt`w@!)%}MRiowzikRij=]ilxAf3,U(#B2Rf#g0v-Rm[ck{`U#]giKv3>)!&6Ri154s,KuGB_%@r68r:dJ|t`#X(9<E|u2@H|rx3gJu?w'!+'1Nu7Reg4=H~+9<wxgY95Rm]xLggZ-`(X}U2:Ri4h<uOawRmsJv__5@bb{jbV~3dka#a'a]!,#a+U=a>b6a3b%!/aKa/)!arwve^VyJ;:pR~DpTg3uJpS~<5pOPw;5qmPw:5pNOu!5pQJvG'!6Vyx=<qoJvA!{~Jup!%@qk7Rn/KvyD!}''[xz;>wkh'?Rh,x8gyt`w5D!&),(SgyccRgztJ@3pPB5p#d'(Y#<]mmifubw&RgoJvE&!82s^JvF&!8Rf,ADb]~;x=h'rNu]vK!,%'*0RnORh)4Rh*AqQg-vaRnNg;wHwkh'ba~4cE#Ta*x3gctyw@'!+%RnFRnD<4Rn@hFvK5RnCxWg[#`&a0Ua()`1Rm75Rg[c]%X#qi8Rg^NvdRj>BwzgZauwji7Rm6A4wgg]d1#&(*,.0a#Rm;Rm<Rm=Rm>Rm?Rm@RmARmBe%#^^^Xaea?aC/b+(,!a+a#!a/!>a&Ta<aKbD!2wphBRnk[yPw}hE|.=Br-3Dtm>6Vy~g6urRf.x,hPrNav!%'RnqRo%Ro#Nu;q[Pw;5r+JwNZtM@3r)d'#Y'Weh;xChL#`&RnmRnoKu}>%(!Rne~Bs-;2wjcussJv+'!aYSO}6@B<5?ba~8LrNvj!.%*ROwungw~ng~:9;Ri^>wtnig;wHRnixDh@|(UZ.x1h@|)!#:2<H|*xHn]#-UX'3Ro)z=iT}6ARns=Bwsn_wpnaRncw]aR(#UXa&Ua*a/=]iPd'#Y&Ro'WnXf{QRm2hNvj]nZd`'T~&1`{|`#9b]{}c:'!#Wl{>@=be}]?cl{{U#:5Abb}Jds#^YaF!a*b4a#a3aPa>&Tb!bH!*a_!Eau?/a&RjY<]gj>6Vz*;:pe~DrZg,QRj1JwNZtX@wihspcJvZ&!VyX9WmOJu|!|N2WmHJvh&!]ht~Bpbcn&T(!#RmQ<s7Nu;padH#X'`+WmJ@>RmKCARhnKup=!)&Wf+:RhqNuPpf9c!#'45pd5AwghpARn(Ls@w!%,)!RmP@Wfe<E|IJva!&WmNg8vsRmLd`*.`#Y'Xa!axRn*]hrA8Rhug5s@rXg8u!RmMd8#X'X*3@rV72smdI*#UY&RmICARho~GsgxVgd)Ta'U-Y&Xa!T#RnEWnA@Wffg1uDRi0hFvK5RnBxGnG&#`%owp)@wsf+bX}Ze-*1!a*^^^Ua|!#a.aq&Ya2!a>.a6!a:aO`aJDtL[y`@Wg#>6Vz12@wzoYRoZNuPRi!NuPRhzg=ucRi,@=b`{Yg=ucRi-ACJvB!&Sh[ebSh]ebi`wUuFRm4Jw2_[y0JvB!.<Ju(!&SoG}6Shd}6<Ju(!&SoH}6She}6Kur@._g5vHRieJvx!{L2G{Kx6gd'T#?Rh82Wi5cZ#X(g1w)Rm5dW-Y(Ta#!a)!#aYa=wnfE=su2>>bU{0j9udv:<svj8uQv-7RgHdE%#^'sq9sp=>Bb_{TJv`!&g/r|snj6v(us5d,#Y(56H}[978H}]Jw5!&g1rushJvB!+j;v{u5?zDhd}6}bj;v{u5?zDhe}6}ce*#`(^^^a[aea!=!a6a*aoXb1a.!aAbL!b>,b'aL!aV@Wf|2Wlg3[y/JwNZt^@3piPw:5pgJunZou3@rsJva&!Vy_g<v~Rm#JvG'!6Vz0=<r{Ju{%!:pj@WfsiXuJu3Rm:JvZ&!WfA~Bph@c4Z&Dtwax5rubx(#:awRk1@d,#Y&RfjRfid1#,Y(@Wfp2Wlrg5s@ryKu[@!,'=]ig9wlk?Rk>g5u-rqJvy'!@9RkQcH(T#=>Ri~@<wkj(Wj(KuZB*!&<7rw@9RkRcH(T#=>Ri}@<wkj)Wj)dg(Ta2Xa9X#`-!a*CARhg@@=I}d9x;c~#X%so=<sj>2@@=aybb}XjWv0Q~EfEj3vLv;<d,#Y(56H}`978H}_dgaPaFa'a/!#a3Y0a_a;a|!1(a7-[yE3[xt;:pJNvZrrg3uJrvJwNZt=@3pIh=rt3rxPw:5pGOu!5rpJvG'!6Vys=<rz@c4Z&Dt(ax5rtJvZ!&~BpH@wsfNg-vaRlNci*U#=<wei<F}a5@Jq.!a*JQ!%@qZ23d(#Y&RjH5]jCk!u7w&u0udARjFd/prq=tyvpaEa(a:.!a1aZ(@@=I}:9wpd%=<sX55w_h}@@=I{t=ay<aU@@=I}T=ay<2@@=I})?C9:9au@9Cb]}DP~=x-fAZ(2Wl1=ay<aU@@=I}>5@d##Y+jTv|vV~EfFj]uNpn~FRfGdgaK!Z2&!a8a-Tb({E!acTbM*!a(DtY[yYd'%Y#sl[y*hHvh>Re5x2c{Z}.j4uCvcawRiMd+#X+_x&d!},<5RkX;2Hzw@x,gavfB-!{CcF&T#Roe;RodwWbBg5urRgaKvHC*_6Vz+<4opieuew&Rmq@d]&Y)X,T#X0Rh}<BqP=4qS9:ReMg/ujReNJw0!/<Jui%!bd{kawwnemRelAxUa?a3#*.&UX(Ya+a/RhvRnQ<o}9Wmtd-#Y&RgSRmw9;Rmxay=Rmyg-vaRmuxEhSrNu,v-voC!%(aR.a(a7+1Ro1>Ro5CE{A9b]{@;5x#eO{:g;urRi+KrNA!%(Ro3>Ro79;Ri_Ku@>{;&!x%gX|{KunA_+g5QRj/g3u5Rj#g>uERj%wio/xRhS&!,!#^1U}wba{8>>@=be}qC@:D5ba{7Ku+A&!}x?ba}t>>@=be}se(aA^^^Uat!b0#{pa+awUazbGa#aLb9bgaWac'a5TbS=Br!d1#`%scp_Jvl!#rT>Re0JvX&!VyN=H{Fcm#U&:pY=ReaJv2&!]h0=]nUJvG'!6Vy|=<r%JrM_=]h2@Wlud'#)U'Wf'b]{i=]h/Jvh!&~BpWg=v]RnMx+ny#'Nu;pVwjnu=]nwxJnx,T#`&Reqwjnt=]nvieu9vrRjLLuYwP(#+!th@wih5pX~Gr'g5v/Rh4KunA'!-CARnP@wwiN:Rm_9x'cvw>!|l=<saKvAA!0&3@q}>w^e1bp#&Re2Re3BDx7gH#T|f5H|eKuZ>!%(:qNAH{]Jv6!+3B2B9=b^{X<5<B92:E{ZLvhwA(a;a%!igQuyRmad+#Y}m@3Rh5d8#X'X*:AqUAHzmaxwbh<aXRnVcF}RT#Nw&cj#U(BWnug/vsRntdka)(a3+.Zb7aYYan1!bVa@Xa}[y^@b[{G=H{+hFu73Rj&Pv#5ReQcK%T#sig1v{Rj'Ku+D#'!t]~Grm~?rkKuMB!01d5#`'Vy.ta3Dtu~Hroc8#'{^45s85AwZbP&!#Rn!wghxWn#KvEA!)&2RlA2RlBx:h|#(T,=]j09Wobz>x]z/@awRoTd+#Y(az]hFhCrm4d,#Y+jTv|Q~EfMj]uNr|~FRfOdCa!Xa9_X#@<plJvf!%b`{(9;Rgwc;.!#2x7cw#T|UDb]|T5Ju={(!=@E{&Jv)&!Ab`{'awJvf!~*>>@=be{#KuY>!+&4Ezyi[ugv&RjIdea+T)#UXa&T-T&a!Rh9auRmW=]kLg5vuRn+g3u4Rn-Ow6ARn,hHus5xNk?#UX(U~)/g8v0RkD~AwkkF?Ri.OuNBwkkA?Ri/d|a2`a*^UYa.!aBTZaTa'Xa;!(!2!-a#b2[yC>6Vyq3[xr2Wi?g1rusVh%s?DtF~<5rbJs;%!DtBfswKtCj[uvuSsEu3RgVx3o:u+wN'*Zt;@3rd~Grh~?rfg8w)Lq)qE&-a%!>bI|`jWv0vV~EfCjTv|vV~Ef@j]uNpn~FRfBcK#T']gWNu7x,k7q4ai(0!hHv8<RhmkMu9vrsBuev/RhlCJvB!,g<v{wchh~@:Rhji[vrv{wchi~@:RhkdS&a5UY#Ta!RgPwwiI5BwciI~@:Rh`x'iJvj'!5]iJPu8Bwch]~@:Rhach)U#h3rp]gLh@t|Ax,hTq3ah!-(~@:Ro0Ou!5RhXj^v(pyw8unRhVd|)`,^UYas!a?/a2Z'a^Ta{Tb7Ta(a#!a,Wf&9sZ3DtAadamov=Bqt3[xig8vsRm~>waiL2b`{QJv*_Ouv2qgj<v]v2BqfdR'X*X#Y-@3qr~Gqv~?p6hHv-]glPup5Lq+q?_%*b_{qF{n9b^{rOu4ARhpKvCD!+&~Bqp:5Dbb}nwoiKl&unuTuBv]v+ueunaXRf0=Jvh!0nKufu8v1w&w7q%w&uHrz:Rgnj5w,uxDJq/(!hNw'5ReCk0s2u3w/w'5ReFd>Za&!*UaA=<wkgsRnSJv^!%Refifw3vyRgOKu_B'!,<]gkiiu:w&Rh<=C@a^<B57@2F{[<B5@aW:=3away9A5aW=<B=C@a^<B57@2F{Ie-#`(^^^bCara.b8aza6!/bZ,!adTbnTbOb+aFaS!aAT9@Wf~2Wli3Dtl2@d,#Y&RfnRfmJwJZtN~GqyJva&!VyMg<v~Rm%iXuJu3Rm9Jv[_=]ih9wlkDRkCd1#`(@Wg>2Wls3cH#T(@<Rj*=>Ri|b~'#23s9h<~El.d'#Y&Dtxi^rzvdRl#d*#U%(o|B2s`hJwSaxRmDKv4B&!1:Rmdd5#`'Vx}to~Hq{x'f1v3(!BA5ba|bJv_&!Wfug1v]ReIdO+U/Y#&G}-8wze=Rh{g1v]ReHg/uQRf/by#)ibQwERl/cH#T(@<Rj+=>Ri{cNu+vlax-!(#a0qa9<Rii2;;bU{H;x<i=&X#Rk`<4wwi=C9H~8xAI(Y#<azRi@45wXI<B9;5bb~7dL(X#Xa(+!aL6Vy{g5QqOau:5au2@ay547EzbxOcU(UX-T#Ta#:Cbb|A?wjh/b_|SOw6ARgtihr}u7Rhy<d1#T)X1@@=I|~=ay<2@@=aybb}Sj3vLv;<d,#Y(56H}A978H}@dGpvs@uAu`vcw9*!aFa+ai%(b!aXa8.a?a[ozWey=sU2@G}Nch&U#Rf_WexKu+D#'!t:~Gr`~?r^j]uNr|~FRg*j^psurwJt|RmcKv)@&!)7Rkv~Br[@wxfO:Rl3co#U'6Rezj_q#vIuavjRltwzeyh@vr5JqD0!>aY?C9:9au@9Cb]}9cl#U*5;5<H||jbuus1ucv&Rfvg1v~d/pppzqFr^a--a~!aMat1(hFv;Wiz@@=Izoj5uuv-7Rix~Cw`fk2WlVcZ#X,k)u3vWs@u2]ktg;wEx'fBq(_2Wg/jTv|vV~EfoJv]!15x'hzqG!(P~EfU~CRl_j6v(us5x4i-#T(2WmZ?C2F|d>Kq<aj1!*jTqIsBv=Wl`~Cw`fi2WlWj`v0u*~>RlR=c>Z,k#u3vWs@u2]kr<c1Z+jTqIsBv=Wla~Cw`fm2WlXdmb3!a{(arZa`bkTa%TbQTa-a9+c'!aM!/[yL=Bqug.w'RifhFvyDRj.g>vgwyk^9]k^Jv3_@WfbAARkhJw2_[x|JvB_wkoIRoKwkoJRoLd'(Y#<]gm=<9<H|yd'%_X#skDtb3awwqkgNulRkgdB#^',9:p'hJwSaxRmEBwVb8@4=H|qLu+w50&!)@3qs~?pU>Awwn;;Rn=c:Z'ARn<=<qwKvC@!/&~BqqJv6!&]eVb^z^xRge'/a%+^`#Sge}6<4Rn3=]n0Pw2>Rn8Jw0!&>Rn:>Rn6cY#a7+!a&=<wkaNw~h3z_c5Z{=wjh#=]nLKv^D!&)Vyz=bW|swYb<WetcG#T(2wxa@qVx@gD#Y&b^|V5JwG&!5bb|pg/w&RgD@x=kHs=uAvn!a%%/'+RmSRh694Ro`g-vaRmRhHv-]mlxCcS#`&ba~.5cD#Ta)P~=d,#Y(56H{>978H{Dd_#{2^Y%_+qbbb{6g3sERhsbU{?dfa.,`a(Xa<!aiX#(55RiG54RiHcI#T'WiU3RiVNvdwtfcRlKNvdd,#Y&RlHRlExQgf.1*^T'X#Sgf}6Wn4=]hfPrk>Rn7Jw0!&>Rn5>Rn9Lunw?&a2!,5<oq@@wqfdRlJj5Q~=d,#Y(~ARfcOuN]fdDKw;ay(}i!547E}j?cI#T(@5bV}iCbV}hdv(^^Tb?a40,b##Tbo!a*bR!a<b|a/!aKai!aU[yK=]o^g:v>ReGJwPZtK<7Rh+h<~El,Pv#5ReR@awwxjCg,ulRjDJv6&!]j!z?aQeeg>w=Sh<eeJw;!&axEzOg,Qosc!#*:wkeJ]eJ>x'h-u(!%Ro.w~h.zPdNZ(X,Ya![x{;9ReY;wkgxRiF:x?ap#Y&RmUg<s2Rkod]+UY0TZ'!a&A9sw<=bczLNvuw{gqzNhJwSaxRmCKuLay!#&s_Rf-55b^{uJvZa!!c%#(55Ri654wmiu5RiuawLu,vp!+}^%b_}Y9;wkgxba}o>A9:=b^}zKuh=a''!3awRk3c*'!#aHRk6c+Z&Rk5Rk4Jv)&!awRjSawd9*`#0?C2@EzMj8u<uJ5RmbjQrquJu3x,k>uq@_+=ayb^|W~ARkEOuN]k@7dhzV^X/X&a-#zRzSb`zXcJzTT#2WkVKvDBzW!%FzY9;5bbzWjQrquJu3Jw3%!b`zU=ayb^zQd:#X(T-a!6Vyywxh}=b]{Jg=u1RiAdGp~qHtzv!w(wA+a+a;<!aJaYai'anasb(=azRmV:Cbb{MLq2vb!%')RjuRjrRjtRjqx3jnqCw3!%')Rk(Rk+Rk&Rk)Lq2vb!%')Rj{RjxRjzRjwLq2vb!%')RjsRjpRjfRjex3jcqCw3!%')Rk'Rk*RjkRjl9<CbbzfOu4ARhxLq2vb!%')RjyRjvRjhRjgx=joq*uKvb!%')+-Rk.Rk%Rj~Rk-Rk#Rj}x=jdq*uKvb!%')+-Rk,Rk!Rj|RjmRjjRjidAq&qKs@uAv8Aa.'*-a@a&0!aM@a5[y73Dsy3Ds|3Dt):wxgI2sHJwJZt.~Gqxwsf0ikrzt}Rl0Jvy_[xj~HqzKv_A|D!&WfP8axRoVcf,U#k(v]v+ueunaXRf1Ju}'!g8u#Ri=jQw!sCunLprq>!,')~<5qeGzq9F{W=c##%s5au:5aU3CBE|;d4#X(D!a&6Vygx(b;#(=]ed?C2F{N<capoq2r[a&!aPa9,'Pw;5s:@@=I|,55w_h|@@=IzcP~=x'fCqB_2Wl2>aU@@=I|1OuNBc1Z+jTqIsBv=Wlc~Cw`fl2WlZ~AcTa%!Z+jTqIsBv=Wlb~Cw`fh2WlYk+uNqJsBv=WlSg,u3dca3#UXaMYa)TaB-=cM|7T#<bI}l5@B932:aV2G{BOuNBJq:|M!5Ezt=<B=C@a^<B57@2F{v>cB{/T#=ay<bI{3Jv6!a.6BKq0ah&+!5E}HP~Ef{978BaU@@=Iza<7d#.Y#978BaU@@=IzH~AJq0!(@@=IzG978BaU@@=IzFe,aU*Y&^^^bvJb,b:bFad!a,c2Ta>aL.bo6!a#CbTa'T#Re{2Wlh2@G{yg6t~Ro_NvdRfticuRQRllJv3&!x&c|zs@Jw3!%RflwpfkRlpKuL;%(!Re<@G|C2GzdhIvuBwgjAg-u0RjAKQB%!(GzZ@G|5NuuRl7d='T+Y#Vy[g<v~Rm!==G|>JvA!)@wma=]m1ifuaw&RmnLs@vT'!|/+[y,g:v>ReTJw1!#qX=x!eC{bLu+wT&)ZtZauq_~Graci&U#F|89:r_Lupvq!.)&2RlG8RfaC=x!eF{_h?rpWlmd&'!#X|&]k::xJey#`'T|+<E|&2@H|%dE#(^,g;u.RiEg6vjRiC9xCkA{O|zY#g=ucRmXKs0@!&*@G|m@awRknJuh!,3d(}gY}eJvj!%Rm):Jw3!%Rm+Rm-Ls0w(&!a(a#@b[|6cZ#X'7RkxWgAOu4ARn'dH'U#Y*Vz-Wm'CARm}d]*#a%^a*T'aK!a<9bV{PC=p*Jw4!&SgxcbB5r]idw(wBRmF7xFkt#&`(Rm/Rm8E|!JuY_9:Rl5=wrgr2:bbxd@xXfB(a*#T+!.X0X1Ta/a'T&RlDRfL>RlyARl9b[z[>RfZ:RlL:RfRwlg/ARl;9;RlxKv,A/!%7s69<74=BA5ba{-8Bde#`a<XaKYa1,a'P~=wxfB2bZ}}?C972@@=I}r8@55B9;5bb}G978B2@@=aybb}3j3vLv;<Jw3&!>Rfk=ayb^}4~Ad1#`*@@=aybb{w2@>==<bbz]dx+UY#^UaF!a9!bB'Ya1.!ajXa#%olRhD[y=3Dt#Ov5BrHKuMB%!(Rf^Wep~HrJwkiQjKr|~FRg)Ku+D#'!t5~GrF~?rDdV)UY,Z/_7RkuG{<~BrBg,rlsO:235B@bX}|d?a1!#`(6Vyn5@d##Y+jTv|vV~EfIj]uNpn~FRfH7Lq2vb1!a9-978BaU@@=Iz9978BbU}#~AJq0!(@@=Iz8978BaU@@=Iz7~AJQ|}!978BbU}!JvkaK!AdUa21-U#`a+(g/vsRn~Ou!5RPj:rmu9WhOjXuvvNr}:RhAj^v(pyw8unRn[kPr}p|u7vwv]RiSBd;pppzq@qHQa?(b.!a.a`@.|xa(hFv;Wiyj5uuv-7Riw~Cw`fg2WlU978BbU|wOuNBJqG!(P~EfD~CRlQcZ#X,k)u3vWs@u2]ksg;wEx'f@q1_2Wg.j]uNpn~FRfqJv]!15x'h{qG!(@@=IzK~CRl^j6v(us5x4i,#T(2WmY?C2F{1>Kq<aj1!*jTqIsBv=Wld~Cw`fj2Wl[j`v0u*~>RlT=c>Z,k#u3vWs@u2]kq<c1Z+jTqIsBv=Wle~Cw`fn2Wl]dn1#c(a(b^a2!b/bAT(bj!aDa7bu,a_a{c0!2T0g:v>ReD2@G{42@G{5~DpM~<5rc=Bx6i>{RT#RnI@zCx]y]z:2Jv[!zr5Awyk]9]k]dD(Y+X#6Vz.g=wKtgwhaCwgmTWj2Lu,w%_+/[y-B;b^xeg3u3Rj-2@bX{*KrJ<!+'@Wg(g?QRlC@Jv`!%b[zIwsfII}8JQ_@w|kW|=Jv(%!AqcOuNBJvEzh!bYzjLs@wP#(0!oy@>RkdJwMZtc3Dtd@BcG#T'9bWxg2@2Fznd*#Y+;2x'c}w<zizixNgwa#Z'U+!/!a'!a+w~g~z6wcn{Rn}wcnzRn|5Rh%=]nJg5vuRmvNvdRlvcprJu}w*az*a#!%.a.'Bot9qT]kj@Wg'ay2Gzv@Jv`!%b[zEwsfHI}1;ck#Ux`<Cbbx_Lu+w!a&0*!wko*wwo,So,}6Juqxf!E}PigQuyRm`d3(`#8>Rn%:A5B;bZ~%KvhCa!a2!x>k7#Uxb@b{#xaRk7Jw0!)>wwhlShl}6>wwhmShm}6CJvB!.x'hhvj{!!5Bwkhhbaz}x'hivjz~!5Bwkhibaz|xEhTrNu,v-vpD!a%&/)a3a.,%Ro2t[CE{)@3re9b]{%wjo09:rgc:Z&Ro6=<riifuaw&RmoKrNA!%(Ro4>Ro89;Ri`dSaL'UYzxZb)7Rka3xRhT&!,!#^1U}vbaz{>>@=be}yC@:D5bazzKu+A&!}{?ba}y>>@=be}wxBh[t`u~vJvr!%a!a()a,a0a4RoC=]o;Ju(!%RoGRhdwjh`=]oAg>w#Ro?g5vuRo=NvdRl|Ku]C.!&;RoEJvB!%RoORoMBx'h[v+_?w~h`}~5?w~hd~!xKh]oiptu-utv.vp!#%&a30a@a'a+(a/aOp(o~p!RoDJu(!%RoHRhewjha=]oBNvdRl}g>w#Ro@g5vuRo>c[#X']o<CauRoRAd-#Y':RkpauRoQKu]C.!&;RoFJvB!%RoNRoPBx'h]v+_?w~ha}t5?w~he}ue!/UbhYacXaW^Tc&a;b:a-c/#b&aja1(!cL+!bKbt!bmcRc9aIc?8[yW3Dtt94Rg`Jv}!&SiRMzBhEebShEMNuPRe>x7gL#TzuwjirRipc<Z&>on;>z=h-MSh.Mwqczx'a7vj&!>Re4@=ResJt__NuPRi*NuPRi)j]uNr|~FRfzKrJ>_+@Wfy@Wf]2WocKrJ<!+'@Wg%g/QRl@@Jv`!&awRl<wsfFIzgLu(w*!.*&ShBMwvhIRhI9;RhNx1hK'!#Sn]Mx1hK~0!#:2<H~7cNu+w7D*'1ZtW>Rn1~?rOc:Z&Rn2=<rQ<7wjh&=BSnLMc]#X(6Vz)w[b=a!U#9wzgMc3#&(RgMRitRis<x,gKt`ax!&+SioM=BSilMc3#&(RgKRinRimKurB,!&SiQMzBhDebShDM6BJQ!(P~Efx978B2@@=I}WLrJw!!,a*&@G}O@9wkibRid@@x'fKwC!&SlDMSfLMjUv~Q~EfKKv3@a+!(hFv-]mpx/hYZ(C5RiWz<o/MwkhY?So/M@x,gbvfB*&!SgEM:SoeeehFu3:Rgbda(,^TZa)X/7Sg[eb:2RgI~BrMC@wgkc:wwkcRerx3h(uUvK!&*,SnOM4Sh*MArRg;wHRh(x=h;rJvPwI!a4',a'0@Wg&=BSh/Mg>w=Rh=g3w*wwgGRgGcW(X#;Sg}M2Gzk@Jv`!&awRl=wsfGIz`dKZ*T'Y-:RhR7RhQg5u-p`j6v(us5d,#Y+~Awkia?RicOuNBwkibba}Ld6p~tyu_vbAa'a+!a/'a3aEa8a!>Sh,ebJv{!&Sh@ebSaReb9;SgwebNuPRi(NvdRl)NuPRi'hHu^<Rm^Jvv_@Wl(g;u1Si/ebKu'B&!*Sh?eb@Wl'z@aPeb95Si.ebcpputyvjB)!,&a+0a%ShAMWeK@G}C@WfJ9;RhMwvhH9w{ia}ix,hJvRA1(!zAn[MRhHx1hJ~*!#hFv(BSn[MBJQ!(@@=I~'978B2@@=I}2db.Ua<'X}+T#a0XaG2G}E;wkg|wuh!Rh!x,hZu,@)!&So0MVy)C5RiXACJvB!&5RiY5RiZg8w)cG}*T#2@bU}=KsA>(!a.3wkhZba~(x,h^u(A!&(SoCMRhb5Bz=h[eb?w~hb~6x,h_u(A!&(SoDMRhc5Bz=h]eb?w~hc~6e)aA1T#T,^^^c-bMb&blcPaP(a/!0!bA=b5c@a(!bfbrc#2afwmhARnjwchORnp2Wlf3DtsNvdRl-2@wpa<]m0bx(#:awRk2@Jw3!%RfhwpfgRlnKQB%!(G{V@G|'NuuRl6d='T+Y#VyUg<v~Rl~==G|<Jv+'!aYShC}6@B<5?ba~8@Jw3'!g2QRljhLrpWlOd+#Y'g.w'rIg>w*wgj@g-u0Rj@Lu+wT&)ZtUauq]~GrGci&U#F|39:rELrNvj!.%*RhCwunfw~nf~:9;Ri]>wtnhg;wHRnhx3hDs@v~!/+'@Wfr@9RkSNu&Rlo=@<5GzoKs0@_+@Wl+@awRkmJuh!-3d(}pY#qWJvj!%Rm(:Jw3!%Rm,Rm*de&!1U-U#`)Re;@G|.@9Ri82@wjfvRlq=@<5GzpLvOvr!).&2RlF8Rf`C=x!eE{.Jw3_g2QRlkhLrpWlPde(!#U{s,UXa*Ta'[y'g:v>ReS;x0PZ&RnlRnn~HrKJw1}f!=x!eB|2w]aP(#Xa&a*Ta.Ua2a7=]iOd'#Y&Ro&WnWg;u.RiDg6vjRiBNvdRlzhNvj]nYJuW_2Wm3x)kFze{9d])!a.!,Y01!#&aC!a3RndC=ox~BrC@2b^{pg,rlse7x'ksuq!%Rm.E{xidw(wBRmGx9o+)X#wwo-So-}69:Rl4@xSf@a#XZ'X)X,Ta(/ARl8b[xc>RfY:RlI:RfQwlg.ARl:9;Rlwdn'#^XafaQa1X1TaHTa)@b[{zcZ#X'7RkwWg@Ou4ARn&x)kG#{,g7u/RkGdH'U#Y*Vz'Wm&CARm|bx#(A]gUbUzJj9Q~=d,#Y(56H}l978H{U7d,0#U*2>ABb_xZ978BbU{e~AJQ{g!978BbU{hxMh?ad{oUYZ.x1h?{l!#:2<H{mx3n[t{vl!,&a%3Ro(z=iS}6ARnr=Bwsn^wvn`Rnbd`*T}B0!#^X'BG{c9b]{a>>@=be}F?JvS!&BG{d7BG}(Bde#`a1X,Ya@!a'P~=wxf@2bZ}I56B2@@=aybb}08@55B9;5bb}<j3vLv;<Jw3&!>Rfg=ayb^}&OuNBKuLA!)a!P~=x#fD{f2@>==<bbzl?C972@@=Ix^d6rSu,v7w*C(0a)a6#B+a%!sQ[y?3Dt%3[xn~<5rLOu!5p@Ku+D#'!t7~GrP~?rNKvlaya7'!h+v-5qMg=t|cd,U#5AAaa5Abb{S@52B5@a[@52B5Gx[iXueu;d<#`a(!/549C;ag>23ExY5@Dah89b^~689Jv)!~2b[~1Lv'w(%*!a#bX|aPrmawRe]keu7uhv-q6rxu,q`xTo]/a5aU!bNaDXbi!b-!ao!b<bwA!#5@B932:aV2G|:d-)Y#hJrL>RhG<7@C5<H|_=Cau:5aj5@B932:bJ|ng>vIbs)#?C2F|9jPv0w.vISh-MKvUaz(.!9ABbb|[5;5<H|Eg>unwfh;9:4E|YjQsBt|vjx'hYq3!(?C2F|J:2<BaY?C2F|GOu!5x,g|p{ah!-(?C2F|c9:4E|OjXuvvNr}:Rh&i[w*t|cd+U#jJvsu)vsSn~Mkfrmu9p}u7vwv]So!McW#Xa!ax5@A5aY:5;5<H|>kJv~vYrquJu3x4ib#T)2@SmZM?C2F|Bj:rmu9@xPhI(a*a#U#`a3-5Abb|L~@:RhK9:4E|0@52B5G|#C::aY?C2F|-:2<BaY?C2F|.5Jvk!a)javYrquJu3x4ia#T)2@SmYM?C2F|HAxPhH(!a#U#`a*-5Abb|4~@:RhJ9:4E|R@52B5G|F:2<BaY?C2F|Sc^#Xa2j=Qq5CJvB!-g<v{z;hhM?C2F|Zi[vrv{z;hiM?C2F|XKsA>!a)-g<v{z;h[eb?C2F|]i[vrv{z;h]eb?C2F|^iZu.vix,hZq3ah!.(?C2F|QOu!5ShXM:2<BaY?C2F|P",13494,2713,49,25,61);var Ze;(function(e){e[e.VALUE_LENGTH=49152]="VALUE_LENGTH",e[e.FLAG13=8192]="FLAG13",e[e.BRANCH_LENGTH=8064]="BRANCH_LENGTH",e[e.JUMP_TABLE=127]="JUMP_TABLE",e[e.VALUE_MASK=8191]="VALUE_MASK"})(Ze||(Ze={}));var hn;(function(e){e[e.AMP=38]="AMP",e[e.NUM=35]="NUM",e[e.SEMI=59]="SEMI",e[e.EQUALS=61]="EQUALS",e[e.ZERO=48]="ZERO",e[e.NINE=57]="NINE",e[e.LOWER_A=97]="LOWER_A",e[e.LOWER_X=120]="LOWER_X"})(hn||(hn={}));const rs=32,Sl=21,Zf=2097151,go=2047;let bl=0;function eh(e){const n=e>>>Sl;return n===go?bl:n}function nh(e){return e-hn.ZERO>>>0<=9}function th(e){return(e|rs)-hn.LOWER_A>>>0<=5}function rh(e){return(e|rs)-hn.LOWER_A>>>0<=25}var Oi;(function(e){e[e.EntityStart=0]="EntityStart",e[e.NumericStart=1]="NumericStart",e[e.NumericDecimal=2]="NumericDecimal",e[e.NumericHex=3]="NumericHex",e[e.NamedEntity=4]="NamedEntity"})(Oi||(Oi={}));var Li;(function(e){e[e.Legacy=0]="Legacy",e[e.Strict=1]="Strict",e[e.Attribute=2]="Attribute"})(Li||(Li={}));function sh(e,n,t,r){const s=(n&Ze.BRANCH_LENGTH)>>7,o=n&Ze.JUMP_TABLE;if(o){if(s===0)return r===o?t:-1;const l=r-o;if(l>>>0>=s)return-1;const c=e[t+l];return c===0?-1:t+s+c-1&65535}if(s===0)return-1;const i=s+1>>1,a=t+i+s;for(let l=0;l<s;l++){const u=e[t+(l>>1)]>>((l&1)<<3)&255;if(u===r){const d=t+i+l;return a+e[d]&65535}if(u>r)return-1}return-1}function Ii(e,n,t){return t===1?String.fromCharCode(e[n]&Ze.VALUE_MASK):t===2?String.fromCharCode(e[n+1]):String.fromCharCode(e[n+1],e[n+2])}function oh(e,n,t){let r=n+1,s=0,o=r;if(r<t&&(e.charCodeAt(r)|rs)===hn.LOWER_X)for(r+=1,o=r;r<t;){const a=e.charCodeAt(r);if(nh(a))s=s*16+(a-hn.ZERO);else if(th(a))s=s*16+((a|rs)-hn.LOWER_A+10);else break;r+=1}else for(;r<t;){const a=e.charCodeAt(r)-hn.ZERO;if(a>>>0>9)break;s=s*10+a,r+=1}if(r===o)return 0;r<t&&e.charCodeAt(r)===hn.SEMI&&(r+=1),s>1114111&&(s=1114112);let i=r-n;return i>=go&&(bl=i,i=go),i<<Sl|s}function ih(e,n,t){const r=Xf;let s=e.indexOf("&");if(s<0)return e;const o=e.length;let i=0,a="";const l=r[0],c=l&Ze.JUMP_TABLE,u=(l&Ze.BRANCH_LENGTH)>>7;do{const d=s+1,m=e.charCodeAt(d);let f,g;if(m===hn.NUM){const b=oh(e,d,o);f=eh(b),f>0&&e.charCodeAt(d+f-1)!==hn.SEMI&&(f=0),g=f===0?"":Vf(b&Zf)}else if(rh(m)){f=0,g="";const b=m-c;let _;if(b>>>0<u){const T=r[1+b];_=T===0?-1:u+T&65535}else _=-1;let w=0,A=0,x=_<0?0:r[_],S=d+1;e:for(;S<o;){for(;(x&(Ze.VALUE_LENGTH|Ze.FLAG13))===0&&(x&Ze.JUMP_TABLE)!==0;){const O=x&Ze.JUMP_TABLE,q=(x&Ze.BRANCH_LENGTH)>>7;if(q===0){if(e.charCodeAt(S)!==O)break e;_+=1}else{const X=e.charCodeAt(S)-O;if(X>>>0>=q)break e;const ee=r[_+1+X];if(ee===0)break e;_=_+q+ee&65535}if(x=r[_],S+=1,S>=o)break e}if((x&(Ze.VALUE_LENGTH|Ze.FLAG13))===Ze.FLAG13){const O=(x&Ze.BRANCH_LENGTH)>>7;if(e.charCodeAt(S)!==(x&Ze.JUMP_TABLE))break;S+=1;const q=O-1;let X=_+1,ee=0;for(;ee+1<q;ee+=2){const j=r[X];if(e.charCodeAt(S)!==(j&255)||(S+=1,e.charCodeAt(S)!==(j>>8&255)))break e;S+=1,X+=1}if(ee<q){if(e.charCodeAt(S)!==(r[X]&255))break;S+=1}_+=1+(O>>1),x=r[_];continue}const T=x>>>14,C=e.charCodeAt(S);if(T!==0){if(C===hn.SEMI){f=S-d+1,g=T===1?String.fromCharCode(x&Ze.VALUE_MASK):Ii(r,_,T);break}if(T===1)break}const k=sh(r,x,_+(T||1),C);if(k<0)break;_=k,x=r[_],S+=1}g===""&&f>0&&(g=Ii(r,w,A))}else f=0,g="";f===0||t?s=d:(i<s&&(a+=e.slice(i,s)),a+=g,s=i=d+f),e.charCodeAt(s)!==hn.AMP&&(s=e.indexOf("&",s))}while(s>=0);return a+e.slice(i)}function xl(e){return ih(e,!0,!1)}var ah=class{constructor(e={}){Xe(this,"src_Any",pl.source);Xe(this,"src_Cc",ml.source);Xe(this,"src_Z",yl.source);Xe(this,"src_P",Oo.source);Xe(this,"src_ZPCc",[this.src_Z,this.src_P,this.src_Cc].join("|"));Xe(this,"src_ZCc",[this.src_Z,this.src_Cc].join("|"));Xe(this,"cache",{});Xe(this,"opts",{maxLength:1e4,urlAuth:!1,schema_names:[]});this.opts={...this.opts,...e}}set(e={}){return this.opts={...this.opts,...e},this.cache={},this}escapeRE(e){return e.replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&")}nestedPairRE(e,n,t=4){const r=this.escapeRE(e),s=this.escapeRE(n),o=`(?:(?!${this.src_ZCc}|${r}|${s}).)`;let i=`${r}${o}{0,1000}${s}`;for(let a=2;a<=t;a++)i=`${r}(?:${o}|${i}){0,1000}${s}`;return i}get_text_separators(){var e;return(e=this.cache).text_separators??(e.text_separators=/[><\uff5c]/)}get_pseudo_letter(){var e;return(e=this.cache).src_pseudo_letter??(e.src_pseudo_letter=new RegExp(`(?:(?!${this.get_text_separators().source}|${this.src_ZPCc})${this.src_Any})`))}get_ipv4_addr(){var e;return(e=this.cache).src_ip4??(e.src_ip4=new RegExp("(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])[.]){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])"))}get_ipv6_addr(){var t;const e="[0-9A-Fa-f]{1,4}",n=`(?:(?:${e}:${e})|${this.get_ipv4_addr().source})`;return(t=this.cache).src_ip6_addr??(t.src_ip6_addr=new RegExp(`(?:(?:${e}:){6}${n}|::(?:${e}:){5}${n}|(?:${e})?::(?:${e}:){4}${n}|(?:(?:${e}:){0,1}${e})?::(?:${e}:){3}${n}|(?:(?:${e}:){0,2}${e})?::(?:${e}:){2}${n}|(?:(?:${e}:){0,3}${e})?::${e}:${n}|(?:(?:${e}:){0,4}${e})?::${n}|(?:(?:${e}:){0,5}${e})?::${e}|(?:(?:${e}:){0,6}${e})?::)`))}get_ipv6_url_host(){var e;return(e=this.cache).src_ip6_host??(e.src_ip6_host=new RegExp(`\\[${this.get_ipv6_addr().source}\\]`))}get_ipv6_mail_host(){var e;return(e=this.cache).src_ipv6_mail_host??(e.src_ipv6_mail_host=new RegExp(`\\[IPv6:${this.get_ipv6_addr().source}\\]`))}get_auth(){var e;return(e=this.cache).src_auth??(e.src_auth=new RegExp(`(?:(?:(?!${this.src_ZCc}|[@/\\[\\]()]).){1,50}@)?`))}get_port(){var e;return(e=this.cache).src_port??(e.src_port=new RegExp("(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?"))}get_host_terminator(){var e;return(e=this.cache).src_host_terminator??(e.src_host_terminator=new RegExp(`(?=$|${this.get_text_separators().source}|${this.src_ZPCc})(?!${this.opts["---"]?"-(?!--)|":"-|"}_|:\\d|\\.-|\\.(?!$|${this.src_ZPCc}))`))}get_path_terminator(){var e;return(e=this.cache).src_path_terminator??(e.src_path_terminator=new RegExp(`${this.src_ZPCc}|${this.get_text_separators().source}`))}get_path(){var e;return(e=this.cache).src_path??(e.src_path=new RegExp(`(?:[/?#](?:${this.nestedPairRE("[","]")}|${this.nestedPairRE("(",")")}|${this.nestedPairRE("{","}")}|\\"(?:(?!${this.src_ZCc}|["]).){1,100}\\"|\\'(?:(?!${this.src_ZCc}|[']).){1,100}\\'|\\'(?=${this.get_pseudo_letter().source}|[-])|\\.{2,20}[:]?[a-zA-Z0-9%/&]|\\.(?!${this.src_ZCc}|[.]|$)|`+(this.opts["---"]?"\\-(?!--(?:[^-]|$))(?:-{0,19})|":"\\-{1,20}|")+`,(?!${this.src_ZCc}|$)|;(?!${this.src_ZCc}|$)|\\!{1,20}(?!${this.src_ZCc}|[!]|$)|\\?(?!${this.src_ZCc}|[?]|$)|`+this.get_path_extra().source+`[\\\\/:%@#&=_~*]|(?!${this.get_path_terminator().source}).){1,${this.opts.maxLength}}|\\/)?`))}get_mail_name(){var e;return(e=this.cache).src_mail_name??(e.src_mail_name=new RegExp("[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9](?:[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9]|[.](?=[-!#$%&'*+/=?^_`{|}~a-zA-Z0-9])){0,63}"))}get_xn(){var e;return(e=this.cache).src_xn??(e.src_xn=new RegExp("xn--[a-z0-9\\-]{1,59}"))}get_tld(){if(this.cache.tld)return this.cache.tld;const e=[...new Set(this.opts.tlds||[])].sort().reverse().join("|");return this.cache.tld=new RegExp(`${e||"$#none#$"}|${this.get_xn().source}`),this.cache.tld}get_domain_root(){var e;return(e=this.cache).src_domain_root??(e.src_domain_root=new RegExp("(?:"+this.get_xn().source+`|${this.get_pseudo_letter().source}{1,63})`))}get_domain(){var e;return(e=this.cache).src_domain??(e.src_domain=new RegExp("(?:"+this.get_xn().source+`|(?:${this.get_pseudo_letter().source})|(?:${this.get_pseudo_letter().source}(?:-|${this.get_pseudo_letter().source}){0,61}${this.get_pseudo_letter().source}))`))}get_url_host_port(){var e;return(e=this.cache).url_host_port??(e.url_host_port=new RegExp("(?:"+this.get_ipv6_url_host().source+`|(?:(?:(?:${this.get_domain().source})\\.){0,10}${this.get_domain().source}))`+this.get_port().source+this.get_host_terminator().source))}get_fuzzy_url_host_port(){var e;return(e=this.cache).fuzzy_url_host_port??(e.fuzzy_url_host_port=new RegExp("(?:"+(this.opts.fuzzyIP?this.get_ipv4_addr().source+"|":"")+`(?:(?:(?:${this.get_domain().source})\\.){1,10}(?:${this.get_tld().source})))`+this.get_host_terminator().source))}get_mail_host(){var e;return(e=this.cache).src_mail_host??(e.src_mail_host=new RegExp("(?:"+this.get_ipv6_mail_host().source+`|(?:(?:(?:${this.get_domain().source})\\.){0,4}${this.get_domain().source}))`+this.get_host_terminator().source))}get_fuzzy_mail_host(){var e;return(e=this.cache).src_fuzzy_mail_host??(e.src_fuzzy_mail_host=new RegExp("(?:"+this.get_ipv6_mail_host().source+`|(?:(?:(?:${this.get_domain().source})[.]){1,4}${this.get_domain_root().source}))`+this.get_host_terminator().source))}get_path_extra(){var e;return(e=this.cache).src_path_extra??(e.src_path_extra=new RegExp(""))}get_fuzzy_mail_host_search(){var e;return(e=this.cache).mail_fuzzy_host_search??(e.mail_fuzzy_host_search=new RegExp(`@${this.get_fuzzy_mail_host().source}`,"ig"))}get_fuzzy_link_search(){var e;return(e=this.cache).link_fuzzy_search??(e.link_fuzzy_search=new RegExp(`(^|(?![.:/\\-_@])(?:[$+<=>^\`|｜]|${this.src_ZPCc}))(?:(?![$+<=>^\`|｜])${this.get_fuzzy_url_host_port().source}${this.get_path().source})`,"ig"))}get_http_validator(){var e;return(e=this.cache).http_validator??(e.http_validator=new RegExp("\\/\\/"+(this.opts.urlAuth?this.get_auth().source:"")+this.get_url_host_port().source+this.get_path().source,"iy"))}get_relative_proto_validator(){var e;return(e=this.cache).relative_proto_validator??(e.relative_proto_validator=new RegExp((this.opts.urlAuth?this.get_auth().source:"")+`(?:localhost|${this.get_ipv6_url_host().source}|(?:(?:${this.get_domain().source})[.]){1,10}${this.get_domain_root().source})`+this.get_port().source+this.get_host_terminator().source+this.get_path().source,"iy"))}get_mail_name_validator(){var e;return(e=this.cache).mail_name_validator??(e.mail_name_validator=new RegExp(`(?:^|${this.get_text_separators().source}|"|\\(|${this.src_ZCc})(${this.get_mail_name().source})$`))}get_mailto_validator(){var e;return(e=this.cache).mailto_validator??(e.mailto_validator=new RegExp(`${this.get_mail_name().source}@${this.get_mail_host().source}`,"iy"))}get_schema_names(){var e;return(e=this.cache).schema_names??(e.schema_names=new RegExp((this.opts.schema_names||[]).map(n=>this.escapeRE(n)).join("|")))}get_schema_search(){var e;return(e=this.cache).schema_search??(e.schema_search=new RegExp(`(^|(?!_)(?:[><｜]|${this.src_ZPCc}))(${this.get_schema_names().source})`,"ig"))}get_schema_at_start(){var e;return(e=this.cache).schema_at_start??(e.schema_at_start=new RegExp(`^${this.get_schema_search().source}`,"i"))}},Hs={validate:(e,n,t)=>{const r=t.re.get_http_validator();r.lastIndex=n;const s=r.exec(e);return s?s[0].length:0},normalize:(e,n)=>n.normalize(e)},lh={"http:":Hs,"https:":Hs,"ftp:":Hs,"//":{validate:function(e,n,t){const r=t.re.get_relative_proto_validator();r.lastIndex=n;const s=r.exec(e);return s?n>=3&&e[n-3]===":"||n>=3&&e[n-3]==="/"?0:s[0].length:0},normalize:(e,n)=>n.normalize(e)},"mailto:":{validate:function(e,n,t){const r=t.re.get_mailto_validator();r.lastIndex=n;const s=r.exec(e);return s?s[0].length:0},normalize:(e,n)=>n.normalize(e)}},ch="a:cdefgilmnoqrstuwxz|b:abdefghijmnorstvwyz|c:acdfghiklmnoruvwxyz|d:ejkmoz|e:cegrstu|f:ijkmor|g:abdefghilmnpqrstuwy|h:kmnrtu|i:delmnoqrst|j:emop|k:eghimnprwyz|l:abcikrstuvy|m:acdeghklmnopqrstuvwxyz|n:acefgilopruz|o:m|p:aefghklmnrstwy|q:a|r:eosuw|s:abcdeghijklmnortuvxyz|t:cdfghjklmnortvwz|u:agksyz|v:aceginu|w:fs|y:et|z:amw",uh="biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф";function dh(){const e=uh.split("|");return ch.split("|").forEach(n=>{const t=n.indexOf(":"),r=n.slice(0,t);for(const s of n.slice(t+1))e.push(r+s)}),e}var fh={fuzzyLink:!1,fuzzyEmail:!0,fuzzyIP:!1,"---":!1,tlds:dh(),urlAuth:!1,maxLength:1e4},Mi=class{constructor(e,n,t,r){Xe(this,"schema");Xe(this,"index");Xe(this,"lastIndex");Xe(this,"raw");Xe(this,"text");Xe(this,"url");const s=e.slice(t,r);this.schema=n.toLowerCase(),this.index=t,this.lastIndex=r,this.raw=s,this.text=s,this.url=s}},hh=class{constructor(e={}){Xe(this,"__opts__");Xe(this,"__schemas__");Xe(this,"re");const{rebuilder:n,...t}=e;this.__opts__={...fh,...t},this.__schemas__={...lh},this.re=n||new ah,this.re.set({...this.__opts__,schema_names:Object.keys(this.__schemas__)})}add(e,n=null){if(!n)delete this.__schemas__[e];else{const t={normalize:(r,s)=>s.normalize(r),...n};this.__schemas__[e]=t}return this.re.set({...this.__opts__,schema_names:Object.keys(this.__schemas__)}),this}set(e={}){return this.__opts__={...this.__opts__,...e},this.re.set({...this.__opts__,schema_names:Object.keys(this.__schemas__)}),this}test(e){if(!e.length)return!1;let n,t;for(t=this.re.get_schema_search(),t.lastIndex=0;(n=t.exec(e))!==null;)if(this.testSchemaAt(e,n[2],t.lastIndex))return!0;if(this.__opts__.fuzzyLink&&this.__schemas__["http:"]&&(t=this.re.get_fuzzy_link_search(),t.lastIndex=0,t.exec(e)!==null))return!0;if(this.__opts__.fuzzyEmail&&this.__schemas__["mailto:"]&&e.indexOf("@")>=0){const r=this.re.get_fuzzy_mail_host_search(),s=this.re.get_mail_name_validator();for(r.lastIndex=0;(n=r.exec(e))!==null;){const o=e.slice(Math.max(0,n.index-65),n.index);if(s.test(o))return!0}}return!1}testSchemaAt(e,n,t){return this.__schemas__[n.toLowerCase()]?this.__schemas__[n.toLowerCase()].validate(e.slice(0,t+this.__opts__.maxLength),t,this):0}match(e){const n=[],t=this.re.get_schema_search();let r,s,o,i,a,l,c=!1,u=!1,d=!1,m=0;if(!e.length)return null;for(t.lastIndex=0,this.__opts__.fuzzyLink&&this.__schemas__["http:"]&&(r=this.re.get_fuzzy_link_search(),r.lastIndex=0),this.__opts__.fuzzyEmail&&this.__schemas__["mailto:"]&&(s=this.re.get_fuzzy_mail_host_search(),s.lastIndex=0,o=this.re.get_mail_name_validator());;){const f=Math.max(m-1,0);if(s&&o&&!d&&(!a||a.index<m))for(s.lastIndex<f&&(s.lastIndex=f);;){const A=s.exec(e);if(!A){d=!0,a=void 0;break}const x=o.exec(e.slice(Math.max(0,A.index-65),A.index));if(x){if(a={schema:"mailto:",index:A.index-x[1].length,lastIndex:A.index+A[0].length},a.index>=m)break;s.lastIndex<f&&(s.lastIndex=f)}}if(r&&!u&&(!i||i.index<m))for(r.lastIndex<f&&(r.lastIndex=f);;){const A=r.exec(e);if(!A){u=!0,i=void 0;break}if(i={schema:"",index:A.index+A[1].length,lastIndex:A.index+A[0].length},i.index>=m)break;r.lastIndex<f&&(r.lastIndex=f)}let g=a;(!g||i&&(i.index<g.index||i.index===g.index&&i.lastIndex>g.lastIndex))&&(g=i);let b;if(!c)for(;;){if(!l){t.lastIndex<f&&(t.lastIndex=f);const S=t.exec(e);if(!S){c=!0;break}l={schema:S[2],index:S.index+S[1].length,lastIndex:S.index+S[0].length}}if(l.index<m){l=void 0;continue}if(g&&l.index>g.index)break;const A=l;l=void 0;const x=this.testSchemaAt(e,A.schema,A.lastIndex);if(x){b={schema:A.schema,index:A.index,lastIndex:A.lastIndex+x};break}}let _=b;if((!_||a&&(a.index<_.index||a.index===_.index&&a.lastIndex>_.lastIndex))&&(_=a),(!_||i&&(i.index<_.index||i.index===_.index&&i.lastIndex>_.lastIndex))&&(_=i),!_)break;_===a?a=void 0:_===i&&(i=void 0);const w=new Mi(e,_.schema,_.index,_.lastIndex);w.schema?this.__schemas__[w.schema].normalize(w,this):this.normalize(w),n.push(w),m=_.lastIndex}return n.length?n:null}matchAtStart(e){if(!e.length)return null;const n=this.re.get_schema_at_start().exec(e);if(!n)return null;const t=this.testSchemaAt(e,n[2],n[0].length);if(!t)return null;const r=new Mi(e,n[2],n.index+n[1].length,n.index+n[0].length+t);return this.__schemas__[r.schema].normalize(r,this),r}tlds(e,n=!1){return e=Array.isArray(e)?e:[e],n?this.__opts__.tlds=this.__opts__.tlds.concat(e):this.__opts__.tlds=e,this.re.set({...this.__opts__,schema_names:Object.keys(this.__schemas__)}),this}normalize(e){e.schema||(e.url=`http://${e.url}`),e.schema==="mailto:"&&!/^mailto:/i.test(e.url)&&(e.url=`mailto:${e.url}`)}};const Ft=2147483647,Wn=36,Lo=1,dr=26,gh=38,ph=700,_l=72,Cl=128,vl="-",mh=/^xn--/,Eh=/[^\0-\x7F]/,yh=/[\x2E\u3002\uFF0E\uFF61]/g,Sh={overflow:"Overflow: input needs wider integers to process","not-basic":"Illegal input >= 0x80 (not a basic code point)","invalid-input":"Invalid input"},Gs=Wn-Lo,Hn=Math.floor,$s=String.fromCharCode;function ht(e){throw new RangeError(Sh[e])}function bh(e,n){const t=[];let r=e.length;for(;r--;)t[r]=n(e[r]);return t}function kl(e,n){const t=e.split("@");let r="";t.length>1&&(r=t[0]+"@",e=t[1]),e=e.replace(yh,".");const s=e.split("."),o=bh(s,n).join(".");return r+o}function Rl(e){const n=[];let t=0;const r=e.length;for(;t<r;){const s=e.charCodeAt(t++);if(s>=55296&&s<=56319&&t<r){const o=e.charCodeAt(t++);(o&64512)==56320?n.push(((s&1023)<<10)+(o&1023)+65536):(n.push(s),t--)}else n.push(s)}return n}const xh=e=>String.fromCodePoint(...e),_h=function(e){return e>=48&&e<58?26+(e-48):e>=65&&e<91?e-65:e>=97&&e<123?e-97:Wn},Pi=function(e,n){return e+22+75*(e<26)-((n!=0)<<5)},wl=function(e,n,t){let r=0;for(e=t?Hn(e/ph):e>>1,e+=Hn(e/n);e>Gs*dr>>1;r+=Wn)e=Hn(e/Gs);return Hn(r+(Gs+1)*e/(e+gh))},Tl=function(e){const n=[],t=e.length;let r=0,s=Cl,o=_l,i=e.lastIndexOf(vl);i<0&&(i=0);for(let a=0;a<i;++a)e.charCodeAt(a)>=128&&ht("not-basic"),n.push(e.charCodeAt(a));for(let a=i>0?i+1:0;a<t;){const l=r;for(let u=1,d=Wn;;d+=Wn){a>=t&&ht("invalid-input");const m=_h(e.charCodeAt(a++));m>=Wn&&ht("invalid-input"),m>Hn((Ft-r)/u)&&ht("overflow"),r+=m*u;const f=d<=o?Lo:d>=o+dr?dr:d-o;if(m<f)break;const g=Wn-f;u>Hn(Ft/g)&&ht("overflow"),u*=g}const c=n.length+1;o=wl(r-l,c,l==0),Hn(r/c)>Ft-s&&ht("overflow"),s+=Hn(r/c),r%=c,n.splice(r++,0,s)}return String.fromCodePoint(...n)},Dl=function(e){const n=[];e=Rl(e);const t=e.length;let r=Cl,s=0,o=_l;for(const l of e)l<128&&n.push($s(l));const i=n.length;let a=i;for(i&&n.push(vl);a<t;){let l=Ft;for(const u of e)u>=r&&u<l&&(l=u);const c=a+1;l-r>Hn((Ft-s)/c)&&ht("overflow"),s+=(l-r)*c,r=l;for(const u of e)if(u<r&&++s>Ft&&ht("overflow"),u===r){let d=s;for(let m=Wn;;m+=Wn){const f=m<=o?Lo:m>=o+dr?dr:m-o;if(d<f)break;const g=d-f,b=Wn-f;n.push($s(Pi(f+g%b,0))),d=Hn(g/b)}n.push($s(Pi(d,0))),o=wl(s,c,a===i),s=0,++a}++s,++r}return n.join("")},Ch=function(e){return kl(e,function(n){return mh.test(n)?Tl(n.slice(4).toLowerCase()):n})},vh=function(e){return kl(e,function(n){return Eh.test(n)?"xn--"+Dl(n):n})},Fi={version:"2.3.1",ucs2:{decode:Rl,encode:xh},decode:Tl,encode:Dl,toASCII:vh,toUnicode:Ch};/*! markdown-it 15.0.3 https://github.com/markdown-it/markdown-it @license MIT */var Bi=Object.defineProperty,Al=(e,n)=>{let t={};for(var r in e)Bi(t,r,{get:e[r],enumerable:!0});return Bi(t,Symbol.toStringTag,{value:"Module"}),t},kh=Al({arrayReplaceAt:()=>Rh,asciiTrim:()=>xs,callable:()=>Nl,escapeHtml:()=>Et,escapeRE:()=>Ph,fromCodePoint:()=>fr,isMdAsciiPunct:()=>pr,isPunctChar:()=>Ll,isPunctCharCode:()=>gr,isSpace:()=>Me,isValidEntityCode:()=>Io,isWhiteSpace:()=>hr,lib:()=>Fh,normalizeReference:()=>bs,unescapeAll:()=>Ut,unescapeMd:()=>Ah});function Nl(e){const n=function(...t){return Reflect.construct(e,t,new.target&&new.target!==n?new.target:e)};return Object.defineProperty(n,"name",{value:e.name}),Object.setPrototypeOf(n,e),n.prototype=e.prototype,n}function Rh(e,n,t){return[].concat(e.slice(0,n),t,e.slice(n+1))}function Io(e){return!(e>=55296&&e<=57343||e>=64976&&e<=65007||(e&65535)===65535||(e&65535)===65534||e>=0&&e<=8||e===11||e>=14&&e<=31||e>=127&&e<=159||e>1114111)}function fr(e){if(e>65535){e-=65536;const n=55296+(e>>10),t=56320+(e&1023);return String.fromCharCode(n,t)}return String.fromCharCode(e)}var Ol=/\\([!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])/g,wh=new RegExp(`${Ol.source}|${/&([a-z#][a-z0-9]{1,31});/gi.source}`,"gi"),Th=/^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))$/i;function Dh(e,n){if(n.charCodeAt(0)===35&&Th.test(n)){const r=n[1].toLowerCase()==="x"?parseInt(n.slice(2),16):parseInt(n.slice(1),10);return Io(r)?fr(r):e}const t=xl(e);return t!==e?t:e}function Ah(e){return e.indexOf("\\")<0?e:e.replace(Ol,"$1")}function Ut(e){return e.indexOf("\\")<0&&e.indexOf("&")<0?e:e.replace(wh,function(n,t,r){return t||Dh(n,r)})}var Nh=/[&<>"]/,Oh=/[&<>"]/g,Lh={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"};function Ih(e){return Lh[e]}function Et(e){return Nh.test(e)?e.replace(Oh,Ih):e}var Mh=/[.?*+^$[\]\\(){}|-]/g;function Ph(e){return e.replace(Mh,"\\$&")}function Me(e){switch(e){case 9:case 32:return!0}return!1}function hr(e){if(e>=8192&&e<=8202)return!0;switch(e){case 9:case 10:case 11:case 12:case 13:case 32:case 160:case 5760:case 8239:case 8287:case 12288:return!0}return!1}function Ll(e){return Oo.test(e)||El.test(e)}function gr(e){return Ll(fr(e))}function pr(e){switch(e){case 33:case 34:case 35:case 36:case 37:case 38:case 39:case 40:case 41:case 42:case 43:case 44:case 45:case 46:case 47:case 58:case 59:case 60:case 61:case 62:case 63:case 64:case 91:case 92:case 93:case 94:case 95:case 96:case 123:case 124:case 125:case 126:return!0;default:return!1}}function bs(e){return e=e.trim().replace(/\s+/g," "),e.toLowerCase().toUpperCase()}function qi(e){return e===32||e===9||e===10||e===13}function xs(e){let n=0;for(;n<e.length&&qi(e.charCodeAt(n));n++);let t=e.length-1;for(;t>=n&&qi(e.charCodeAt(t));t--);return e.slice(n,t+1)}var Fh={mdurl:$f,ucmicro:Qf};function Bh(e,n,t){let r,s,o,i;const a=e.posMax,l=e.pos;for(e.pos=n+1,r=1;e.pos<a;){if(o=e.src.charCodeAt(e.pos),o===93&&(r--,r===0)){s=!0;break}if(i=e.pos,e.md.inline.skipToken(e),o===91){if(i===e.pos-1)r++;else if(t)return e.pos=l,-1}}let c=-1;return s&&(c=e.pos),e.pos=l,c}function qh(e,n,t){let r,s=n;const o={ok:!1,pos:0,str:""};if(e.charCodeAt(s)===60){for(s++;s<t;){if(r=e.charCodeAt(s),r===10||r===60)return o;if(r===62)return o.pos=s+1,o.str=Ut(e.slice(n+1,s)),o.ok=!0,o;if(r===92&&s+1<t){s+=2;continue}s++}return o}let i=0;for(;s<t&&(r=e.charCodeAt(s),!(r===32||r<32||r===127));){if(r===92&&s+1<t){if(e.charCodeAt(s+1)===32){s++;continue}s+=2;continue}if(r===40&&(i++,i>32))return o;if(r===41){if(i===0)break;i--}s++}return n===s||i!==0||(o.str=Ut(e.slice(n,s)),o.pos=s,o.ok=!0),o}function Uh(e,n,t,r){let s,o=n;const i={ok:!1,can_continue:!1,pos:0,str:"",marker:0};if(r)i.str=r.str,i.marker=r.marker;else{if(o>=t)return i;let a=e.charCodeAt(o);if(a!==34&&a!==39&&a!==40)return i;n++,o++,a===40&&(a=41),i.marker=a}for(;o<t;){if(s=e.charCodeAt(o),s===i.marker)return i.pos=o+1,i.str+=Ut(e.slice(n,o)),i.ok=!0,i;if(s===40&&i.marker===41)return i;s===92&&o+1<t&&o++,o++}return i.can_continue=!0,i.str+=Ut(e.slice(n,o)),i}var Wh=Al({parseLinkDestination:()=>qh,parseLinkLabel:()=>Bh,parseLinkTitle:()=>Uh});function mr(e){"@babel/helpers - typeof";return mr=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},mr(e)}function Hh(e,n){if(mr(e)!="object"||!e)return e;var t=e[Symbol.toPrimitive];if(t!==void 0){var r=t.call(e,n);if(mr(r)!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(e)}function Gh(e){var n=Hh(e,"string");return mr(n)=="symbol"?n:n+""}function V(e,n,t){return(n=Gh(n))in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}var wt=class{constructor(e,n,t){V(this,"map",null),V(this,"level",0),V(this,"children",null),V(this,"content",""),V(this,"markup",""),V(this,"info",""),V(this,"block",!1),V(this,"hidden",!1),this.type=e,this.tag=n,this.attrs=null,this.nesting=t,this.meta=null}attrIndex(e){if(!this.attrs)return-1;const n=this.attrs;for(let t=0,r=n.length;t<r;t++)if(n[t][0]===e)return t;return-1}attrPush(e){this.attrs?this.attrs.push(e):this.attrs=[e]}attrSet(e,n){const t=this.attrIndex(e),r=[e,n];t<0?this.attrPush(r):this.attrs[t]=r}attrGet(e){const n=this.attrIndex(e);let t=null;return n>=0&&(t=this.attrs[n][1]),t}attrJoin(e,n){const t=this.attrIndex(e);t<0?this.attrPush([e,n]):this.attrs[t][1]=`${this.attrs[t][1]} ${n}`}},Er=class{constructor(){V(this,"__rules__",[]),V(this,"__cache__",null)}__find__(e){for(let n=0;n<this.__rules__.length;n++)if(this.__rules__[n].name===e)return n;return-1}__compile__(){const e=new Set;this.__rules__.forEach(n=>{n.enabled&&n.alt.forEach(t=>{t&&e.add(t)})}),this.__cache__=Object.create(null),this.__cache__[""]=[],this.__rules__.forEach(n=>{n.enabled&&this.__cache__[""].push(n.fn)}),e.forEach(n=>{this.__cache__[n]=[],this.__rules__.forEach(t=>{t.enabled&&t.alt.indexOf(n)>=0&&this.__cache__[n].push(t.fn)})})}at(e,n,t={}){const r=this.__find__(e);if(r===-1)throw new Error(`Parser rule not found: ${e}`);this.__rules__[r].fn=n,this.__rules__[r].alt=t.alt||[],this.__cache__=null}before(e,n,t,r={}){const s=this.__find__(e);if(s===-1)throw new Error(`Parser rule not found: ${e}`);this.__rules__.splice(s,0,{name:n,enabled:!0,fn:t,alt:r.alt||[]}),this.__cache__=null}after(e,n,t,r={}){const s=this.__find__(e);if(s===-1)throw new Error(`Parser rule not found: ${e}`);this.__rules__.splice(s+1,0,{name:n,enabled:!0,fn:t,alt:r.alt||[]}),this.__cache__=null}push(e,n,t={}){this.__rules__.push({name:e,enabled:!0,fn:n,alt:t.alt||[]}),this.__cache__=null}enable(e,n=!1){Array.isArray(e)||(e=[e]);const t=[];return e.forEach(r=>{const s=this.__find__(r);if(s<0){if(n)return;throw new Error(`Rules manager: invalid rule name ${r}`)}this.__rules__[s].enabled=!0,t.push(r)}),this.__cache__=null,t}enableOnly(e,n=!1){Array.isArray(e)||(e=[e]),this.__rules__.forEach(t=>{t.enabled=!1}),this.enable(e,n)}disable(e,n=!1){Array.isArray(e)||(e=[e]);const t=[];return e.forEach(r=>{const s=this.__find__(r);if(s<0){if(n)return;throw new Error(`Rules manager: invalid rule name ${r}`)}this.__rules__[s].enabled=!1,t.push(r)}),this.__cache__=null,t}getRules(e){return this.__cache__||this.__compile__(),this.__cache__[e]||[]}},Yn={};Yn.code_inline=function(e,n,t,r,s){const o=e[n];return`<code${s.renderAttrs(o)}>${Et(o.content)}</code>`};Yn.code_block=function(e,n,t,r,s){const o=e[n];return`<pre${s.renderAttrs(o)}><code>${Et(e[n].content)}</code></pre>
`};Yn.fence=function(e,n,t,r,s){const o=e[n],i=o.info?Ut(o.info).trim():"";let a="",l="";if(i){const u=i.split(/(\s+)/g);a=u[0],l=u.slice(2).join("")}let c;if(t.highlight?c=t.highlight(o.content,a,l)||Et(o.content):c=Et(o.content),c.indexOf("<pre")===0)return c+`
`;if(i){const u=o.attrIndex("class"),d=o.attrs?o.attrs.slice():[];u<0?d.push(["class",`${t.langPrefix}${a}`]):(d[u]=[d[u][0],d[u][1]],d[u][1]+=` ${t.langPrefix}${a}`);const m={attrs:d};return`<pre><code${s.renderAttrs(m)}>${c}</code></pre>
`}return`<pre><code${s.renderAttrs(o)}>${c}</code></pre>
`};Yn.image=function(e,n,t,r,s){const o=e[n];return o.attrs[o.attrIndex("alt")][1]=s.renderInlineAsText(o.children,t,r),s.renderToken(e,n,t)};Yn.hardbreak=function(e,n,t){return t.xhtmlOut?`<br />
`:`<br>
`};Yn.softbreak=function(e,n,t){return t.breaks?t.xhtmlOut?`<br />
`:`<br>
`:`
`};Yn.text=function(e,n){return Et(e[n].content)};Yn.html_block=function(e,n){return e[n].content};Yn.html_inline=function(e,n){return e[n].content};var Il=class{constructor(){V(this,"rules",Object.assign({},Yn))}renderAttrs(e){let n,t,r;if(!e.attrs)return"";for(r="",n=0,t=e.attrs.length;n<t;n++)r+=` ${Et(e.attrs[n][0])}="${Et(String(e.attrs[n][1]))}"`;return r}renderToken(e,n,t){const r=e[n];let s="";if(r.hidden)return"";let o=n-1;for(;o>=0&&e[o].hidden&&e[o].nesting===0;)o--;r.block&&r.nesting!==-1&&o>=0&&e[o].hidden&&e[o].nesting===-1&&(s+=`
`),s+=(r.nesting===-1?"</":"<")+r.tag,s+=this.renderAttrs(r),r.nesting===0&&t.xhtmlOut&&(s+=" /");let i=!1;if(r.block&&(i=!0,r.nesting===1)){let a=n+1;for(;a<e.length&&e[a].hidden&&e[a].nesting===0;)a++;if(a<e.length){const l=e[a];(l.type==="inline"||l.hidden||l.nesting===-1&&l.tag===r.tag)&&(i=!1)}}return s+=i?`>
`:">",s}renderInline(e,n,t){let r="";const s=this.rules;for(let o=0,i=e.length;o<i;o++){const a=e[o].type;typeof s[a]<"u"?r+=s[a](e,o,n,t,this):r+=this.renderToken(e,o,n)}return r}renderInlineAsText(e,n,t){let r="";for(let s=0,o=e.length;s<o;s++)switch(e[s].type){case"text":case"code_inline":r+=e[s].content;break;case"image":r+=this.renderInlineAsText(e[s].children,n,t);break;case"html_inline":case"html_block":r+=e[s].content;break;case"softbreak":case"hardbreak":r+=`
`}return r}render(e,n,t){let r="";const s=this.rules;for(let o=0,i=e.length;o<i;o++){const a=e[o].type;a==="inline"?r+=this.renderInline(e[o].children,n,t):typeof s[a]<"u"?r+=s[a](e,o,n,t,this):r+=this.renderToken(e,o,n)}return r}},Ml=class{constructor(e,n,t){V(this,"tokens",[]),V(this,"inlineMode",!1),V(this,"Token",wt),this.src=e,this.env=t,this.md=n}},$h=/\r\n?/g,jh=/\0/g;function Qh(e){let n;n=e.src.replace($h,`
`),n=n.replace(jh,"�"),e.src=n}function zh(e){let n;e.inlineMode?(n=new e.Token("inline","",0),n.content=e.src,n.map=[0,1],n.children=[],e.tokens.push(n)):e.md.block.parse(e.src,e.md,e.env,e.tokens)}function Kh(e){const n=e.tokens;let t=0;for(let r=0;r<n.length;r++)n[r].type!=="reference_definition"&&(r!==t&&(n[t]=n[r]),t++);n.length!==t&&(n.length=t)}function Jh(e){const n=e.tokens;for(let t=0,r=n.length;t<r;t++){const s=n[t];s.type==="inline"&&e.md.inline.parse(s.content,e.md,e.env,s.children)}}function Vh(e){return/^<a[>\s]/i.test(e)}function Yh(e){return/^<\/a\s*>/i.test(e)}function Xh(e){const n=e.tokens;if(e.md.options.linkify)for(let t=0,r=n.length;t<r;t++){if(n[t].type!=="inline"||!e.md.linkify.test(n[t].content))continue;const s=n[t].children,o=[];let i=0;for(let a=s.length-1;a>=0;a--){const l=s[a];if(l.type==="link_close"){for(a--;s[a].level!==l.level&&s[a].type!=="link_open";)a--;continue}if(l.type==="html_inline"&&(Vh(l.content)&&i>0&&i--,Yh(l.content)&&i++),!(i>0)&&l.type==="text"&&e.md.linkify.test(l.content)){const c=l.content;let u=e.md.linkify.match(c);const d=[];let m=l.level,f=0;u.length>0&&u[0].index===0&&a>0&&s[a-1].type==="text_special"&&(u=u.slice(1));for(let g=0;g<u.length;g++){const b=u[g].url,_=e.md.normalizeLink(b);if(!e.md.validateLink(_))continue;let w=u[g].text;u[g].schema?u[g].schema==="mailto:"&&!/^mailto:/i.test(w)?w=e.md.normalizeLinkText(`mailto:${w}`).replace(/^mailto:/,""):w=e.md.normalizeLinkText(w):w=e.md.normalizeLinkText(`http://${w}`).replace(/^http:\/\//,"");const A=u[g].index;if(A>f){const C=new e.Token("text","",0);C.content=c.slice(f,A),C.level=m,d.push(C)}const x=new e.Token("link_open","a",1);x.attrs=[["href",_]],x.level=m++,x.markup="linkify",x.info="auto",d.push(x);const S=new e.Token("text","",0);S.content=w,S.level=m,d.push(S);const T=new e.Token("link_close","a",-1);T.level=--m,T.markup="linkify",T.info="auto",d.push(T),f=u[g].lastIndex}if(f<c.length){const g=new e.Token("text","",0);g.content=c.slice(f),g.level=m,d.push(g)}o.push({index:a,nodes:d})}}if(o.length>0){let a=s.length;for(const d of o)a+=d.nodes.length-1;const l=new Array(a);let c=0,u=0;o.reverse();for(let d=0;d<s.length;d++){const m=o[c];if((m==null?void 0:m.index)===d){for(const f of m.nodes)l[u++]=f;c++}else l[u++]=s[d]}n[t].children=l}}}var Pl=/\+-|\.\.|\?\?\?\?|!!!!|,,|--/,Zh=/\((c|tm|r)\)/i,eg=/\((c|tm|r)\)/gi,ng={c:"©",r:"®",tm:"™"};function tg(e,n){return ng[n.toLowerCase()]}function rg(e){let n=0;for(let t=e.length-1;t>=0;t--){const r=e[t];r.type==="text"&&!n&&(r.content=r.content.replace(eg,tg)),r.type==="link_open"&&r.info==="auto"&&n--,r.type==="link_close"&&r.info==="auto"&&n++}}function sg(e){let n=0;for(let t=e.length-1;t>=0;t--){const r=e[t];r.type==="text"&&!n&&Pl.test(r.content)&&(r.content=r.content.replace(/\+-/g,"±").replace(/\.{2,}/g,"…").replace(/([?!])…/g,"$1..").replace(/([?!]){4,}/g,"$1$1$1").replace(/,{2,}/g,",").replace(/(^|[^-])---(?=[^-]|$)/gm,"$1—").replace(/(^|\s)--(?=\s|$)/gm,"$1–").replace(/(^|[^-\s])--(?=[^-\s]|$)/gm,"$1–")),r.type==="link_open"&&r.info==="auto"&&n--,r.type==="link_close"&&r.info==="auto"&&n++}}function og(e){let n;if(e.md.options.typographer)for(n=e.tokens.length-1;n>=0;n--)e.tokens[n].type==="inline"&&(Zh.test(e.tokens[n].content)&&rg(e.tokens[n].children),Pl.test(e.tokens[n].content)&&sg(e.tokens[n].children))}var ig=/['"]/,Ui=/['"]/g,Wi="’",ag=1e3;function Hi(e,n,t){for(;e.length>t;){const r=e.pop();r.isSingleQuote?n.single=r.prevSameQuoteIdx:n.double=r.prevSameQuoteIdx}}function qr(e,n,t,r){e[n]||(e[n]=[]),e[n].push({pos:t,ch:r})}function lg(e,n){let t="",r=0;n.sort((s,o)=>s.pos-o.pos);for(let s=0;s<n.length;s++){const o=n[s];t+=e.slice(r,o.pos)+o.ch,r=o.pos+1}return t+e.slice(r)}function cg(e,n){let t;const r=[],s={single:-1,double:-1},o={};for(let i=0;i<e.length;i++){const a=e[i],l=e[i].level;for(t=r.length-1;t>=0&&!(r[t].level<=l);t--);if(Hi(r,s,t+1),a.type!=="text")continue;const c=a.content;let u=0;const d=c.length;e:for(;u<d;){Ui.lastIndex=u;const m=Ui.exec(c);if(!m)break;let f=!0,g=!0;u=m.index+1;const b=m[0]==="'";let _=32;if(m.index-1>=0)_=c.charCodeAt(m.index-1);else for(t=i-1;t>=0&&!(e[t].type==="softbreak"||e[t].type==="hardbreak");t--)if(e[t].content){_=e[t].content.charCodeAt(e[t].content.length-1);break}let w=32;if(u<d)w=c.charCodeAt(u);else for(t=i+1;t<e.length&&!(e[t].type==="softbreak"||e[t].type==="hardbreak");t++)if(e[t].content){w=e[t].content.charCodeAt(0);break}const A=pr(_)||gr(_),x=pr(w)||gr(w),S=hr(_),T=hr(w);if(T?f=!1:x&&(S||A||(f=!1)),S?g=!1:A&&(T||x||(g=!1)),w===34&&m[0]==='"'&&_>=48&&_<=57&&(g=f=!1),f&&g&&(f=A,g=x),!f&&!g){b&&qr(o,i,m.index,Wi);continue}if(g&&(t=b?s.single:s.double,t>=0&&r[t].level===l)){const C=r[t];let k,O;b?(k=n.md.options.quotes[2],O=n.md.options.quotes[3]):(k=n.md.options.quotes[0],O=n.md.options.quotes[1]),qr(o,i,m.index,O),qr(o,C.tokenIdx,C.contentPos,k),Hi(r,s,t);continue e}if(f){if(r.length>=ag)return;r.push({tokenIdx:i,contentPos:m.index,isSingleQuote:b,level:l,prevSameQuoteIdx:b?s.single:s.double}),b?s.single=r.length-1:s.double=r.length-1}else g&&b&&qr(o,i,m.index,Wi)}}Object.keys(o).forEach(function(i){const a=Number(i);e[a].content=lg(e[a].content,o[i])})}function ug(e){if(e.md.options.typographer)for(let n=e.tokens.length-1;n>=0;n--)e.tokens[n].type!=="inline"||!ig.test(e.tokens[n].content)||cg(e.tokens[n].children,e)}function dg(e){let n,t;const r=e.length;for(n=0;n<r;n++)e[n].type==="text_special"&&(e[n].type="text");for(n=t=0;n<r;n++)e[n].type==="text"&&n+1<r&&e[n+1].type==="text"?e[n+1].content=e[n].content+e[n+1].content:(n!==t&&(e[t]=e[n]),t++);n!==t&&(e.length=t)}function fg(e){let n,t;const r=e.tokens,s=r.length;for(let o=0;o<s;o++){if(r[o].type!=="inline")continue;const i=r[o].children,a=i.length;for(n=0;n<a;n++)i[n].type==="text_special"&&(i[n].type="text"),i[n].children&&dg(i[n].children);for(n=t=0;n<a;n++)i[n].type==="text"&&n+1<a&&i[n+1].type==="text"?i[n+1].content=i[n].content+i[n+1].content:(n!==t&&(i[t]=i[n]),t++);n!==t&&(i.length=t)}}var js=[["normalize",Qh],["block",zh],["strip_references",Kh],["inline",Jh],["linkify",Xh],["replacements",og],["smartquotes",ug],["text_join",fg]],Fl=class{constructor(){V(this,"ruler",new Er),V(this,"State",Ml);for(let e=0;e<js.length;e++)this.ruler.push(js[e][0],js[e][1])}process(e){const n=this.ruler.getRules("");for(let t=0,r=n.length;t<r;t++)n[t](e)}},Bl=class{constructor(e,n,t,r){V(this,"bMarks",[]),V(this,"eMarks",[]),V(this,"tShift",[]),V(this,"sCount",[]),V(this,"bsCount",[]),V(this,"blkIndent",0),V(this,"line",0),V(this,"lineMax",0),V(this,"tight",!1),V(this,"listIndent",-1),V(this,"parentType","root"),V(this,"level",0),V(this,"Token",wt),this.src=e,this.md=n,this.env=t,this.tokens=r;const s=this.src;for(let o=0,i=0,a=0,l=0,c=s.length,u=!1;i<c;i++){const d=s.charCodeAt(i);if(!u)if(Me(d)){a++,d===9?l+=4-l%4:l++;continue}else u=!0;(d===10||i===c-1)&&(d!==10&&i++,this.bMarks.push(o),this.eMarks.push(i),this.tShift.push(a),this.sCount.push(l),this.bsCount.push(0),u=!1,a=0,l=0,o=i+1)}this.bMarks.push(s.length),this.eMarks.push(s.length),this.tShift.push(0),this.sCount.push(0),this.bsCount.push(0),this.lineMax=this.bMarks.length-1}push(e,n,t){const r=new wt(e,n,t);return r.block=!0,t<0&&this.level--,r.level=this.level,t>0&&this.level++,this.tokens.push(r),r}isEmpty(e){return this.bMarks[e]+this.tShift[e]>=this.eMarks[e]}skipEmptyLines(e){for(let n=this.lineMax;e<n&&!(this.bMarks[e]+this.tShift[e]<this.eMarks[e]);e++);return e}skipSpaces(e){for(let n=this.src.length;e<n&&Me(this.src.charCodeAt(e));e++);return e}skipSpacesBack(e,n){if(e<=n)return e;for(;e>n;)if(!Me(this.src.charCodeAt(--e)))return e+1;return e}skipChars(e,n){for(let t=this.src.length;e<t&&this.src.charCodeAt(e)===n;e++);return e}skipCharsBack(e,n,t){if(e<=t)return e;for(;e>t;)if(n!==this.src.charCodeAt(--e))return e+1;return e}getLines(e,n,t,r){if(e>=n)return"";const s=new Array(n-e);for(let o=0,i=e;i<n;i++,o++){let a=0;const l=this.bMarks[i];let c=l,u;for(i+1<n||r?u=this.eMarks[i]+1:u=this.eMarks[i];c<u&&a<t;){const d=this.src.charCodeAt(c);if(Me(d))d===9?a+=4-(a+this.bsCount[i])%4:a++;else if(c-l<this.tShift[i])a++;else break;c++}a>t?s[o]=new Array(a-t+1).join(" ")+this.src.slice(c,u):s[o]=this.src.slice(c,u)}return s.join("")}},hg=65536;function Qs(e,n){const t=e.bMarks[n]+e.tShift[n],r=e.eMarks[n];return e.src.slice(t,r)}function Gi(e){const n=[],t=e.length;let r=0,s=e.charCodeAt(r),o=!1,i=0,a="";for(;r<t;)s===124&&(o?(a+=e.substring(i,r-1),i=r):(n.push(a+e.substring(i,r)),a="",i=r+1)),o=s===92,r++,s=e.charCodeAt(r);return n.push(a+e.substring(i)),n}function gg(e,n,t,r){if(n+2>t)return!1;let s=n+1;if(e.sCount[s]<e.blkIndent||e.sCount[s]-e.blkIndent>=4)return!1;let o=e.bMarks[s]+e.tShift[s];if(o>=e.eMarks[s])return!1;const i=e.src.charCodeAt(o++);if(i!==124&&i!==45&&i!==58||o>=e.eMarks[s])return!1;const a=e.src.charCodeAt(o++);if(a!==124&&a!==45&&a!==58&&!Me(a)||i===45&&Me(a))return!1;for(;o<e.eMarks[s];){const S=e.src.charCodeAt(o);if(S!==124&&S!==45&&S!==58&&!Me(S))return!1;o++}let l=Qs(e,n+1),c=l.split("|");const u=[];for(let S=0;S<c.length;S++){const T=c[S].trim();if(!T){if(S===0||S===c.length-1)continue;return!1}if(!/^:?-+:?$/.test(T))return!1;T.charCodeAt(T.length-1)===58?u.push(T.charCodeAt(0)===58?"center":"right"):T.charCodeAt(0)===58?u.push("left"):u.push("")}if(l=Qs(e,n).trim(),l.indexOf("|")===-1||e.sCount[n]-e.blkIndent>=4)return!1;c=Gi(l),c.length&&c[0]===""&&c.shift(),c.length&&c[c.length-1]===""&&c.pop();const d=c.length;if(d===0||d!==u.length)return!1;if(r)return!0;const m=e.parentType;e.parentType="table";const f=e.md.block.ruler.getRules("blockquote"),g=e.push("table_open","table",1),b=[n,0];g.map=b;const _=e.push("thead_open","thead",1);_.map=[n,n+1];const w=e.push("tr_open","tr",1);w.map=[n,n+1];for(let S=0;S<c.length;S++){const T=e.push("th_open","th",1);u[S]&&(T.attrs=[["style",`text-align:${u[S]}`]]);const C=e.push("inline","",0);C.content=c[S].trim(),C.children=[],e.push("th_close","th",-1)}e.push("tr_close","tr",-1),e.push("thead_close","thead",-1);let A,x=0;for(s=n+2;s<t&&!(e.sCount[s]<e.blkIndent);s++){let S=!1;for(let C=0,k=f.length;C<k;C++)if(f[C](e,s,t,!0)){S=!0;break}if(S||(l=Qs(e,s).trim(),!l)||e.sCount[s]-e.blkIndent>=4||(c=Gi(l),c.length&&c[0]===""&&c.shift(),c.length&&c[c.length-1]===""&&c.pop(),x+=d-c.length,x>hg))break;if(s===n+2){const C=e.push("tbody_open","tbody",1);C.map=A=[n+2,0]}const T=e.push("tr_open","tr",1);T.map=[s,s+1];for(let C=0;C<d;C++){const k=e.push("td_open","td",1);u[C]&&(k.attrs=[["style",`text-align:${u[C]}`]]);const O=e.push("inline","",0);O.content=c[C]?c[C].trim():"",O.children=[],e.push("td_close","td",-1)}e.push("tr_close","tr",-1)}return A&&(e.push("tbody_close","tbody",-1),A[1]=s),e.push("table_close","table",-1),b[1]=s,e.parentType=m,e.line=s,!0}function pg(e,n,t){if(e.sCount[n]-e.blkIndent<4)return!1;let r=n+1,s=r;for(;r<t;){if(e.isEmpty(r)){r++;continue}if(e.sCount[r]-e.blkIndent>=4){r++,s=r;continue}break}e.line=s;const o=e.push("code_block","code",0);return o.content=e.getLines(n,s,4+e.blkIndent,!1)+`
`,o.map=[n,e.line],!0}function mg(e,n,t,r){let s=e.bMarks[n]+e.tShift[n],o=e.eMarks[n];if(e.sCount[n]-e.blkIndent>=4||s+3>o)return!1;const i=e.src.charCodeAt(s);if(i!==126&&i!==96)return!1;let a=s;s=e.skipChars(s,i);let l=s-a;if(l<3)return!1;const c=e.src.slice(a,s),u=e.src.slice(s,o);if(i===96&&u.indexOf(String.fromCharCode(i))>=0)return!1;if(r)return!0;let d=n,m=!1;for(;d++,!(d>=t||(s=a=e.bMarks[d]+e.tShift[d],o=e.eMarks[d],s<o&&e.sCount[d]<e.blkIndent));)if(e.src.charCodeAt(s)===i&&!(e.sCount[d]-e.blkIndent>=4)&&(s=e.skipChars(s,i),!(s-a<l)&&(s=e.skipSpaces(s),!(s<o)))){m=!0;break}l=e.sCount[n],e.line=d+(m?1:0);const f=e.push("fence","code",0);return f.info=u,f.content=e.getLines(n+1,d,l,!0),f.markup=c,f.map=[n,e.line],!0}function Eg(e,n,t,r){let s=e.bMarks[n]+e.tShift[n],o=e.eMarks[n];const i=e.lineMax;if(e.sCount[n]-e.blkIndent>=4||e.src.charCodeAt(s)!==62)return!1;if(r)return!0;const a=[],l=[],c=[],u=[],d=e.md.block.ruler.getRules("blockquote"),m=e.parentType;e.parentType="blockquote";let f=!1,g;for(g=n;g<t;g++){const x=e.sCount[g]<e.blkIndent;if(s=e.bMarks[g]+e.tShift[g],o=e.eMarks[g],s>=o)break;if(e.src.charCodeAt(s++)===62&&!x){let T=e.sCount[g]+1,C,k;e.src.charCodeAt(s)===32?(s++,T++,k=!1,C=!0):e.src.charCodeAt(s)===9?(C=!0,(e.bsCount[g]+T)%4===3?(s++,T++,k=!1):k=!0):C=!1;let O=T;for(a.push(e.bMarks[g]),e.bMarks[g]=s;s<o;){const q=e.src.charCodeAt(s);if(Me(q))q===9?O+=4-(O+e.bsCount[g]+(k?1:0))%4:O++;else break;s++}f=s>=o,l.push(e.bsCount[g]),e.bsCount[g]=e.sCount[g]+1+(C?1:0),c.push(e.sCount[g]),e.sCount[g]=O-T,u.push(e.tShift[g]),e.tShift[g]=s-e.bMarks[g];continue}if(f)break;let S=!1;for(let T=0,C=d.length;T<C;T++)if(d[T](e,g,t,!0)){S=!0;break}if(S){e.lineMax=g,e.blkIndent!==0&&(a.push(e.bMarks[g]),l.push(e.bsCount[g]),u.push(e.tShift[g]),c.push(e.sCount[g]),e.sCount[g]-=e.blkIndent);break}a.push(e.bMarks[g]),l.push(e.bsCount[g]),u.push(e.tShift[g]),c.push(e.sCount[g]),e.sCount[g]=-1}const b=e.blkIndent;e.blkIndent=0;const _=e.push("blockquote_open","blockquote",1);_.markup=">";const w=[n,0];_.map=w,e.md.block.tokenize(e,n,g);const A=e.push("blockquote_close","blockquote",-1);A.markup=">",e.lineMax=i,e.parentType=m,w[1]=e.line;for(let x=0;x<u.length;x++)e.bMarks[x+n]=a[x],e.tShift[x+n]=u[x],e.sCount[x+n]=c[x],e.bsCount[x+n]=l[x];return e.blkIndent=b,!0}function yg(e,n,t,r){const s=e.eMarks[n];if(e.sCount[n]-e.blkIndent>=4)return!1;let o=e.bMarks[n]+e.tShift[n];const i=e.src.charCodeAt(o++);if(i!==42&&i!==45&&i!==95)return!1;let a=1;for(;o<s;){const c=e.src.charCodeAt(o++);if(c!==i&&!Me(c))return!1;c===i&&a++}if(a<3)return!1;if(r)return!0;e.line=n+1;const l=e.push("hr","hr",0);return l.map=[n,e.line],l.markup=Array(a+1).join(String.fromCharCode(i)),!0}function $i(e,n){const t=e.eMarks[n];let r=e.bMarks[n]+e.tShift[n];const s=e.src.charCodeAt(r++);return s!==42&&s!==45&&s!==43||r<t&&!Me(e.src.charCodeAt(r))?-1:r}function ji(e,n){const t=e.bMarks[n]+e.tShift[n],r=e.eMarks[n];let s=t;if(s+1>=r)return-1;let o=e.src.charCodeAt(s++);if(o<48||o>57)return-1;for(;;){if(s>=r)return-1;if(o=e.src.charCodeAt(s++),o>=48&&o<=57){if(s-t>=10)return-1;continue}if(o===41||o===46)break;return-1}return s<r&&(o=e.src.charCodeAt(s),!Me(o))?-1:s}function Sg(e,n){const t=e.level+2;for(let r=n+2,s=e.tokens.length-2;r<s;r++)e.tokens[r].level===t&&e.tokens[r].type==="paragraph_open"&&(e.tokens[r+2].hidden=!0,e.tokens[r].hidden=!0,r+=2)}function bg(e,n,t,r){let s,o,i,a,l=n,c=!0;if(e.sCount[l]-e.blkIndent>=4||e.listIndent>=0&&e.sCount[l]-e.listIndent>=4&&e.sCount[l]<e.blkIndent)return!1;let u=!1;r&&e.parentType==="paragraph"&&e.sCount[l]>=e.blkIndent&&(u=!0);let d,m,f;if((f=ji(e,l))>=0){if(d=!0,i=e.bMarks[l]+e.tShift[l],m=Number(e.src.slice(i,f-1)),u&&m!==1)return!1}else if((f=$i(e,l))>=0)d=!1;else return!1;if(u&&e.skipSpaces(f)>=e.eMarks[l])return!1;if(r)return!0;const g=e.src.charCodeAt(f-1),b=e.tokens.length;d?(a=e.push("ordered_list_open","ol",1),m!==1&&(a.attrs=[["start",m]])):a=e.push("bullet_list_open","ul",1);const _=[l,0];a.map=_,a.markup=String.fromCharCode(g);let w=!1;const A=e.md.block.ruler.getRules("list"),x=e.parentType;for(e.parentType="list";l<t;){o=f,s=e.eMarks[l];const S=e.sCount[l]+f-(e.bMarks[l]+e.tShift[l]);let T=S;for(;o<s;){const Ce=e.src.charCodeAt(o);if(Ce===9)T+=4-(T+e.bsCount[l])%4;else if(Ce===32)T++;else break;o++}const C=o;let k;C>=s?k=1:k=T-S,k>4&&(k=1);const O=S+k;a=e.push("list_item_open","li",1),a.markup=String.fromCharCode(g);const q=[l,0];a.map=q,d&&(a.info=e.src.slice(i,f-1));const X=e.tight,ee=e.tShift[l],j=e.sCount[l],M=e.listIndent;if(e.listIndent=e.blkIndent,e.blkIndent=O,e.tight=!0,e.tShift[l]=C-e.bMarks[l],e.sCount[l]=T,C>=s&&e.isEmpty(l+1)?e.line=Math.min(e.line+2,t):e.md.block.tokenize(e,l,t),(!e.tight||w)&&(c=!1),w=e.line-l>1&&e.isEmpty(e.line-1),e.blkIndent=e.listIndent,e.listIndent=M,e.tShift[l]=ee,e.sCount[l]=j,e.tight=X,a=e.push("list_item_close","li",-1),a.markup=String.fromCharCode(g),l=e.line,q[1]=l,l>=t||e.sCount[l]<e.blkIndent||e.sCount[l]-e.blkIndent>=4)break;let ce=!1;for(let Ce=0,we=A.length;Ce<we;Ce++)if(A[Ce](e,l,t,!0)){ce=!0;break}if(ce)break;if(d){if(f=ji(e,l),f<0)break;i=e.bMarks[l]+e.tShift[l]}else if(f=$i(e,l),f<0)break;if(g!==e.src.charCodeAt(f-1))break}return d?a=e.push("ordered_list_close","ol",-1):a=e.push("bullet_list_close","ul",-1),a.markup=String.fromCharCode(g),_[1]=l,e.line=l,e.parentType=x,c&&Sg(e,b),!0}var zs=999;function xg(e){let n=e.length;for(let t=0;t<e.length-1;t++){const r=e.charCodeAt(t);if(r<55296||r>56319)continue;const s=e.charCodeAt(t+1);s>=56320&&s<=57343&&(n--,t++)}return n}function Jt(e,n){return Math.min(e.eMarks[n]+1,e.src.length)}function Ur(e,n){const t=e.lineMax;if(n>=t||e.isEmpty(n))return-1;let r=!1;if(e.sCount[n]-e.blkIndent>3&&(r=!0),e.sCount[n]<0&&(r=!0),!r){const s=e.md.block.ruler.getRules("reference"),o=e.parentType;e.parentType="reference";let i=!1;for(let a=0,l=s.length;a<l;a++)if(s[a](e,n,t,!0)){i=!0;break}if(e.parentType=o,i)return-1}return e.bMarks[n]+e.tShift[n]}function _g(e,n,t,r){const s=e.src;let o=e.bMarks[n]+e.tShift[n],i=n+1;if(e.sCount[n]-e.blkIndent>=4||s.charCodeAt(o)!==91)return!1;let a=Jt(e,n),l="",c=-1,u=++o;for(;o<a;){if(l.length+o-u>zs*2)return!1;let C=s.charCodeAt(o);if(C===91)return!1;if(C===93){c=o;break}if(C===92&&(C=s.charCodeAt(++o)),C===10&&o<a){const k=Ur(e,i);if(k<0)return!1;l+=s.slice(u,a),o=u=k,a=Jt(e,i++);continue}o++}if(c<0||s.charCodeAt(c+1)!==58||(l+=s.slice(u,c),l.length>zs&&xg(l)>zs))return!1;for(o=c+2;o<a;){const C=s.charCodeAt(o);if(C===10){const k=Ur(e,i);if(k<0)break;o=k,a=Jt(e,i++)}else if(Me(C))o++;else break}const d=e.md.helpers.parseLinkDestination(s,o,a);if(!d.ok)return!1;const m=e.md.normalizeLink(d.str);if(!e.md.validateLink(m))return!1;o=d.pos;const f=o,g=a,b=i;for(;o<a;){const C=s.charCodeAt(o);if(C===10){const k=Ur(e,i);if(k<0)break;o=k,a=Jt(e,i++)}else if(Me(C))o++;else break}const _=o;let w=e.md.helpers.parseLinkTitle(s,o,a);for(;w.can_continue;){const C=Ur(e,i);if(C<0)break;o=C,a=Jt(e,i++),w=e.md.helpers.parseLinkTitle(s,o,a,w)}let A;for(_!==f&&w.ok?(A=w.str,o=w.pos):(A="",o=f,a=g,i=b);o<a&&Me(s.charCodeAt(o));)o++;if(o<a&&s.charCodeAt(o)!==10&&A)for(A="",o=f,a=g,i=b;o<a&&Me(s.charCodeAt(o));)o++;if(o<a&&s.charCodeAt(o)!==10)return!1;const x=bs(l);if(!x)return!1;if(r)return!0;typeof e.env.references>"u"&&(e.env.references={}),typeof e.env.references[x]>"u"&&(e.env.references[x]={title:A,href:m});const S=e.push("reference_definition","",0);S.map=[n,i],S.hidden=!0;const T=Object.create(null);return T.label=x,S.meta=T,e.line=i,!0}var Cg=["address","article","aside","base","basefont","blockquote","body","caption","center","col","colgroup","dd","details","dialog","dir","div","dl","dt","fieldset","figcaption","figure","footer","form","frame","frameset","h1","h2","h3","h4","h5","h6","head","header","hr","html","iframe","legend","li","link","main","menu","menuitem","nav","noframes","ol","optgroup","option","p","param","search","section","summary","table","tbody","td","tfoot","th","thead","title","tr","track","ul"],vg=`<[A-Za-z][A-Za-z0-9\\-]*(?:\\s+[a-zA-Z_:][a-zA-Z0-9:._-]*(?:\\s*=\\s*(?:[^"'=<>\`\\x00-\\x20]+|'[^']*'|"[^"]*"))?)*\\s*\\/?>`,kg="<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>",ql=new RegExp(`^(?:${vg}|${kg})`),_t=[[/^<(script|pre|style|textarea)(?=(\s|>|$))/i,/<\/(script|pre|style|textarea)>/i,!0],[/^<!--/,/-->/,!0],[/^<\?/,/\?>/,!0],[/^<![A-Za-z]/,/>/,!0],[/^<!\[CDATA\[/,/\]\]>/,!0],[new RegExp(`^</?(${Cg.join("|")})(?=(\\s|/?>|$))`,"i"),/^$/,!0],[new RegExp(`${ql.source}\\s*$`),/^$/,!1]];function Rg(e,n,t,r){let s=e.bMarks[n]+e.tShift[n],o=e.eMarks[n];if(e.sCount[n]-e.blkIndent>=4||!e.md.options.html||e.src.charCodeAt(s)!==60)return!1;let i=e.src.slice(s,o),a=0;for(;a<_t.length&&!_t[a][0].test(i);a++);if(a===_t.length)return!1;if(r)return _t[a][2];let l=n+1;const c=_t[a][1].test("");if(!_t[a][1].test(i)){for(;l<t&&!(e.sCount[l]<e.blkIndent&&(c||!e.isEmpty(l)));l++)if(s=e.bMarks[l]+e.tShift[l],o=e.eMarks[l],i=e.src.slice(s,o),_t[a][1].test(i)){i.length!==0&&l++;break}}e.line=l;const u=e.push("html_block","",0);return u.map=[n,l],u.content=e.getLines(n,l,e.blkIndent,!0),!0}function wg(e,n,t,r){let s=e.bMarks[n]+e.tShift[n],o=e.eMarks[n];if(e.sCount[n]-e.blkIndent>=4)return!1;let i=e.src.charCodeAt(s);if(i!==35||s>=o)return!1;let a=1;for(i=e.src.charCodeAt(++s);i===35&&s<o&&a<=6;)a++,i=e.src.charCodeAt(++s);if(a>6||s<o&&!Me(i))return!1;if(r)return!0;o=e.skipSpacesBack(o,s);const l=e.skipCharsBack(o,35,s);l>s&&Me(e.src.charCodeAt(l-1))&&(o=l),e.line=n+1;const c=e.push("heading_open",`h${a}`,1);c.markup="########".slice(0,a),c.map=[n,e.line];const u=e.push("inline","",0);u.content=xs(e.src.slice(s,o)),u.map=[n,e.line],u.children=[];const d=e.push("heading_close",`h${a}`,-1);return d.markup="########".slice(0,a),!0}function Tg(e,n,t){const r=e.md.block.ruler.getRules("paragraph");if(e.sCount[n]-e.blkIndent>=4)return!1;const s=e.parentType;e.parentType="paragraph";let o=0,i,a=n+1;for(;a<t&&!e.isEmpty(a);a++){if(e.sCount[a]-e.blkIndent>3)continue;if(e.sCount[a]>=e.blkIndent){let f=e.bMarks[a]+e.tShift[a];const g=e.eMarks[a];if(f<g&&(i=e.src.charCodeAt(f),(i===45||i===61)&&(f=e.skipChars(f,i),f=e.skipSpaces(f),f>=g))){o=i===61?1:2;break}}if(e.sCount[a]<0)continue;let m=!1;for(let f=0,g=r.length;f<g;f++)if(r[f](e,a,t,!0)){m=!0;break}if(m)break}if(!o)return e.parentType=s,!1;const l=xs(e.getLines(n,a,e.blkIndent,!1));e.line=a+1;const c=e.push("heading_open",`h${o}`,1);c.markup=String.fromCharCode(i),c.map=[n,e.line];const u=e.push("inline","",0);u.content=l,u.map=[n,e.line-1],u.children=[];const d=e.push("heading_close",`h${o}`,-1);return d.markup=String.fromCharCode(i),e.parentType=s,!0}function Dg(e,n,t){const r=e.md.block.ruler.getRules("paragraph"),s=e.parentType;let o=n+1;for(e.parentType="paragraph";o<t&&!e.isEmpty(o);o++){if(e.sCount[o]-e.blkIndent>3||e.sCount[o]<0)continue;let c=!1;for(let u=0,d=r.length;u<d;u++)if(r[u](e,o,t,!0)){c=!0;break}if(c)break}const i=xs(e.getLines(n,o,e.blkIndent,!1));e.line=o;const a=e.push("paragraph_open","p",1);a.map=[n,e.line];const l=e.push("inline","",0);return l.content=i,l.map=[n,e.line],l.children=[],e.push("paragraph_close","p",-1),e.parentType=s,!0}var Wr=[["table",gg,["paragraph","reference"]],["code",pg],["fence",mg,["paragraph","reference","blockquote","list"]],["blockquote",Eg,["paragraph","reference","blockquote","list"]],["hr",yg,["paragraph","reference","blockquote","list"]],["list",bg,["paragraph","reference","blockquote"]],["reference",_g],["html_block",Rg,["paragraph","reference","blockquote"]],["heading",wg,["paragraph","reference","blockquote"]],["lheading",Tg],["paragraph",Dg]],Ul=class{constructor(){V(this,"ruler",new Er),V(this,"State",Bl);for(let e=0;e<Wr.length;e++)this.ruler.push(Wr[e][0],Wr[e][1],{alt:(Wr[e][2]||[]).slice()})}tokenize(e,n,t){const r=this.ruler.getRules(""),s=r.length,o=e.md.options.maxNesting;let i=n,a=!1;for(;i<t&&(e.line=i=e.skipEmptyLines(i),!(i>=t||e.sCount[i]<e.blkIndent));){if(e.level>=o){e.line=t;break}const l=e.line;let c=!1;for(let u=0;u<s;u++)if(c=r[u](e,i,t,!1),c){if(l>=e.line)throw new Error("block rule didn't increment state.line");break}if(!c)throw new Error("none of the block rules matched");e.tight=!a,e.isEmpty(e.line-1)&&(a=!0),i=e.line,i<t&&e.isEmpty(i)&&(a=!0,i++,e.line=i)}}parse(e,n,t,r){if(!e)return;const s=new this.State(e,n,t,r);this.tokenize(s,s.line,s.lineMax)}},Wl=class{constructor(e,n,t,r){V(this,"pos",0),V(this,"level",0),V(this,"pending",""),V(this,"pendingLevel",0),V(this,"cache",{}),V(this,"backticks",{}),V(this,"backticksScanned",!1),V(this,"skipHtmlSpecial",!1),V(this,"linkLevel",0),V(this,"delimiters",[]),V(this,"_prev_delimiters",[]),V(this,"Token",wt),this.src=e,this.env=t,this.md=n,this.tokens=r,this.tokens_meta=Array(r.length),this.posMax=this.src.length}pushPending(){const e=new wt("text","",0);return e.content=this.pending,e.level=this.pendingLevel,this.tokens.push(e),this.pending="",e}push(e,n,t){this.pending&&this.pushPending();const r=new wt(e,n,t);let s;return t<0&&(this.level--,this.delimiters=this._prev_delimiters.pop()),r.level=this.level,t>0&&(this.level++,this._prev_delimiters.push(this.delimiters),this.delimiters=[],s={delimiters:this.delimiters}),this.pendingLevel=this.level,this.tokens.push(r),this.tokens_meta.push(s),r}scanDelims(e,n){const t=this.posMax,r=this.src.charCodeAt(e);let s;if(e===0)s=32;else if(e===1)s=this.src.charCodeAt(0),(s&63488)===55296&&(s=65533);else if(s=this.src.charCodeAt(e-1),(s&64512)===56320){const g=this.src.charCodeAt(e-2);s=(g&64512)===55296?65536+(g-55296<<10)+(s-56320):65533}else(s&64512)===55296&&(s=65533);let o=e;for(;o<t&&this.src.charCodeAt(o)===r;)o++;const i=o-e;let a=o<t?this.src.charCodeAt(o):32;if((a&64512)===55296){const g=this.src.charCodeAt(o+1);a=(g&64512)===56320?65536+(a-55296<<10)+(g-56320):65533}else(a&64512)===56320&&(a=65533);const l=pr(s)||gr(s),c=pr(a)||gr(a),u=hr(s),d=hr(a),m=!d&&(!c||u||l),f=!u&&(!l||d||c);return{can_open:m&&(n||!f||l),can_close:f&&(n||!m||c),length:i}}};function Ag(e){switch(e){case 10:case 33:case 35:case 36:case 37:case 38:case 42:case 43:case 45:case 58:case 60:case 61:case 62:case 64:case 91:case 92:case 93:case 94:case 95:case 96:case 123:case 125:case 126:return!0;default:return!1}}function Ng(e,n){let t=e.pos;for(;t<e.posMax&&!Ag(e.src.charCodeAt(t));)t++;return t===e.pos?!1:(n||(e.pending+=e.src.slice(e.pos,t)),e.pos=t,!0)}function Og(e){return e>=65&&e<=90||e>=97&&e<=122}function Lg(e){return e>=65&&e<=90||e>=97&&e<=122||e>=48&&e<=57||e===43||e===45||e===46}function Ig(e,n){if(!e.md.options.linkify||e.linkLevel>0)return!1;const t=e.pos,r=e.posMax;if(t+3>r||e.src.charCodeAt(t)!==58||e.src.charCodeAt(t+1)!==47||e.src.charCodeAt(t+2)!==47)return!1;const s=t-Math.min(10,e.pending.length,t);let o=t;for(;o>s&&Lg(e.src.charCodeAt(o-1));)o--;if(o===t||!Og(e.src.charCodeAt(o)))return!1;const i=t-o,a=e.md.linkify.matchAtStart(e.src.slice(o));if(!a)return!1;let l=a.url;if(l.length<=i)return!1;let c=l.length;for(;c>0&&l.charCodeAt(c-1)===42;)c--;c!==l.length&&(l=l.slice(0,c));const u=e.md.normalizeLink(l);if(!e.md.validateLink(u))return!1;if(!n){e.pending=e.pending.slice(0,-i);const d=e.push("link_open","a",1);d.attrs=[["href",u]],d.markup="linkify",d.info="auto";const m=e.push("text","",0);m.content=e.md.normalizeLinkText(l);const f=e.push("link_close","a",-1);f.markup="linkify",f.info="auto"}return e.pos+=l.length-i,!0}function Mg(e,n){let t=e.pos;if(e.src.charCodeAt(t)!==10)return!1;const r=e.pending.length-1,s=e.posMax;if(!n)if(r>=0&&e.pending.charCodeAt(r)===32)if(r>=1&&e.pending.charCodeAt(r-1)===32){let o=r-1;for(;o>=1&&e.pending.charCodeAt(o-1)===32;)o--;e.pending=e.pending.slice(0,o),e.push("hardbreak","br",0)}else e.pending=e.pending.slice(0,-1),e.push("softbreak","br",0);else e.push("softbreak","br",0);for(t++;t<s&&Me(e.src.charCodeAt(t));)t++;return e.pos=t,!0}var Mo=[];for(let e=0;e<256;e++)Mo.push(0);"\\!\"#$%&'()*+,./:;<=>?@[]^_`{|}~-".split("").forEach(function(e){Mo[e.charCodeAt(0)]=1});function Pg(e,n){let t=e.pos;const r=e.posMax;if(e.src.charCodeAt(t)!==92||(t++,t>=r))return!1;let s=e.src.charCodeAt(t);if(s===10){for(n||e.push("hardbreak","br",0),t++;t<r&&(s=e.src.charCodeAt(t),!!Me(s));)t++;return e.pos=t,!0}if(s===32){if(!n){const a=e.push("text_special","",0);a.content="\\",a.markup="\\",a.info="escape"}return e.pos=t,!0}let o=e.src[t];if(s>=55296&&s<=56319&&t+1<r){const a=e.src.charCodeAt(t+1);a>=56320&&a<=57343&&(o+=e.src[t+1],t++)}const i="\\"+o;if(!n){const a=e.push("text_special","",0);s<256&&Mo[s]!==0?a.content=o:a.content=i,a.markup=i,a.info="escape"}return e.pos=t+1,!0}function Fg(e){const n={};let t=0;for(;(t=e.indexOf("`",t))!==-1;){const r=t;for(;e.charCodeAt(++t)===96;);n[t-r]=r}return n}function Bg(e,n){var t;const r=e.pos;if(e.src.charCodeAt(r)!==96)return!1;const s=e.posMax;let o=r+1;for(;o<s&&e.src.charCodeAt(o)===96;)o++;const i=e.src.slice(r,o),a=i.length;if(e.backticksScanned||(e.backticks=Fg(e.src),e.backticksScanned=!0),((t=e.backticks[a])!==null&&t!==void 0?t:-1)>=o){let l=o,c;for(;(c=e.src.indexOf("`",l))!==-1&&c<s;){for(l=c+1;e.src.charCodeAt(l)===96;)l++;if(l>s)break;if(l-c===a){if(!n){const u=e.push("code_inline","code",0);u.markup=i;let d=e.src.slice(o,c).replace(/\n/g," ");d.startsWith(" ")&&d.endsWith(" ")&&/[^ ]/.test(d)&&(d=d.slice(1,-1)),u.content=d}return e.pos=l,!0}}}return n||(e.pending+=i),e.pos=o,!0}function qg(e,n){const t=e.pos,r=e.src.charCodeAt(t);if(n||r!==126)return!1;const s=e.scanDelims(e.pos,!0);let o=s.length;const i=String.fromCharCode(r);if(o<2)return!1;let a;o%2&&(a=e.push("text","",0),a.content=i,o--);for(let l=0;l<o;l+=2)a=e.push("text","",0),a.content=i+i,e.delimiters.push({marker:r,length:0,token:e.tokens.length-1,end:-1,open:s.can_open,close:s.can_close});return e.pos+=s.length,!0}function Qi(e,n){let t;const r=[],s=n.length;for(let o=0;o<s;o++){const i=n[o];if(i.marker!==126||i.end===-1)continue;const a=n[i.end];t=e.tokens[i.token],t.type="s_open",t.tag="s",t.nesting=1,t.markup="~~",t.content="",t=e.tokens[a.token],t.type="s_close",t.tag="s",t.nesting=-1,t.markup="~~",t.content="",e.tokens[a.token-1].type==="text"&&e.tokens[a.token-1].content==="~"&&r.push(a.token-1)}for(;r.length;){const o=r.pop();let i=o+1;for(;i<e.tokens.length&&e.tokens[i].type==="s_close";)i++;i--,o!==i&&(t=e.tokens[i],e.tokens[i]=e.tokens[o],e.tokens[o]=t)}}function Ug(e){const n=e.tokens_meta,t=e.tokens_meta.length;Qi(e,e.delimiters);for(let s=0;s<t;s++){var r;const o=(r=n[s])===null||r===void 0?void 0:r.delimiters;o&&Qi(e,o)}}var Hl={tokenize:qg,postProcess:Ug};function Wg(e,n){const t=e.pos,r=e.src.charCodeAt(t);if(n||r!==95&&r!==42)return!1;const s=e.scanDelims(e.pos,r===42);for(let o=0;o<s.length;o++){const i=e.push("text","",0);i.content=String.fromCharCode(r),e.delimiters.push({marker:r,length:s.length,token:e.tokens.length-1,end:-1,open:s.can_open,close:s.can_close})}return e.pos+=s.length,!0}function zi(e,n){const t=n.length;for(let r=t-1;r>=0;r--){const s=n[r];if(s.marker!==95&&s.marker!==42||s.end===-1)continue;const o=n[s.end],i=r>0&&n[r-1].end===s.end+1&&n[r-1].marker===s.marker&&n[r-1].token===s.token-1&&n[s.end+1].token===o.token+1,a=String.fromCharCode(s.marker),l=e.tokens[s.token];l.type=i?"strong_open":"em_open",l.tag=i?"strong":"em",l.nesting=1,l.markup=i?a+a:a,l.content="";const c=e.tokens[o.token];c.type=i?"strong_close":"em_close",c.tag=i?"strong":"em",c.nesting=-1,c.markup=i?a+a:a,c.content="",i&&(e.tokens[n[r-1].token].content="",e.tokens[n[s.end+1].token].content="",r--)}}function Hg(e){const n=e.tokens_meta,t=e.tokens_meta.length;zi(e,e.delimiters);for(let s=0;s<t;s++){var r;const o=(r=n[s])===null||r===void 0?void 0:r.delimiters;o&&zi(e,o)}}var Gl={tokenize:Wg,postProcess:Hg};function Gg(e,n){let t,r,s,o,i="",a="",l=e.pos,c=!0;if(e.src.charCodeAt(e.pos)!==91)return!1;const u=e.pos,d=e.posMax,m=e.pos+1,f=e.md.helpers.parseLinkLabel(e,e.pos,!0);if(f<0)return!1;let g=f+1;if(g<d&&e.src.charCodeAt(g)===40){for(c=!1,g++;g<d&&(t=e.src.charCodeAt(g),!(!Me(t)&&t!==10));g++);if(g>=d)return!1;if(l=g,s=e.md.helpers.parseLinkDestination(e.src,g,e.posMax),s.ok){for(i=e.md.normalizeLink(s.str),e.md.validateLink(i)?g=s.pos:i="",l=g;g<d&&(t=e.src.charCodeAt(g),!(!Me(t)&&t!==10));g++);if(s=e.md.helpers.parseLinkTitle(e.src,g,e.posMax),g<d&&l!==g&&s.ok)for(a=s.str,g=s.pos;g<d&&(t=e.src.charCodeAt(g),!(!Me(t)&&t!==10));g++);}(g>=d||e.src.charCodeAt(g)!==41)&&(c=!0),g++}if(c){if(typeof e.env.references>"u")return!1;if(g<d&&e.src.charCodeAt(g)===91?(l=g+1,g=e.md.helpers.parseLinkLabel(e,g),g>=0?r=e.src.slice(l,g++):g=f+1):g=f+1,r||(r=e.src.slice(m,f)),r=bs(r),o=e.env.references[r],!o)return e.pos=u,!1;i=o.href,a=o.title}if(!n){e.pos=m,e.posMax=f;const b=e.push("link_open","a",1),_=[["href",i]];if(b.attrs=_,a&&_.push(["title",a]),r){const w=Object.create(null);w.label=r,b.meta=w}e.linkLevel++,e.md.inline.tokenize(e),e.linkLevel--,e.push("link_close","a",-1)}return e.pos=g,e.posMax=d,!0}function $g(e,n){let t,r,s,o,i,a,l,c,u="";const d=e.pos,m=e.posMax;if(e.src.charCodeAt(e.pos)!==33||e.src.charCodeAt(e.pos+1)!==91)return!1;const f=e.pos+2,g=e.md.helpers.parseLinkLabel(e,e.pos+1,!1);if(g<0)return!1;if(o=g+1,o<m&&e.src.charCodeAt(o)===40){for(o++;o<m&&(t=e.src.charCodeAt(o),!(!Me(t)&&t!==10));o++);if(o>=m)return!1;for(c=o,a=e.md.helpers.parseLinkDestination(e.src,o,e.posMax),a.ok&&(u=e.md.normalizeLink(a.str),e.md.validateLink(u)?o=a.pos:u=""),c=o;o<m&&(t=e.src.charCodeAt(o),!(!Me(t)&&t!==10));o++);if(a=e.md.helpers.parseLinkTitle(e.src,o,e.posMax),o<m&&c!==o&&a.ok)for(l=a.str,o=a.pos;o<m&&(t=e.src.charCodeAt(o),!(!Me(t)&&t!==10));o++);else l="";if(o>=m||e.src.charCodeAt(o)!==41)return e.pos=d,!1;o++}else{if(typeof e.env.references>"u")return!1;if(o<m&&e.src.charCodeAt(o)===91?(c=o+1,o=e.md.helpers.parseLinkLabel(e,o),o>=0?s=e.src.slice(c,o++):o=g+1):o=g+1,s||(s=e.src.slice(f,g)),s=bs(s),i=e.env.references[s],!i)return e.pos=d,!1;u=i.href,l=i.title}if(!n){r=e.src.slice(f,g);const b=[];e.md.inline.parse(r,e.md,e.env,b);const _=e.push("image","img",0),w=[["src",u],["alt",""]];if(_.attrs=w,_.children=b,_.content=r,l&&w.push(["title",l]),s){const A=Object.create(null);A.label=s,_.meta=A}}return e.pos=o,e.posMax=m,!0}var jg=/^([a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)$/,Qg=/^([a-zA-Z][a-zA-Z0-9+.-]{1,31}):([^<>\x00-\x20]*)$/;function zg(e,n){let t=e.pos;if(e.src.charCodeAt(t)!==60)return!1;const r=e.pos,s=e.posMax;for(;;){if(++t>=s)return!1;const i=e.src.charCodeAt(t);if(i===60)return!1;if(i===62)break}const o=e.src.slice(r+1,t);if(Qg.test(o)){const i=e.md.normalizeLink(o);if(!e.md.validateLink(i))return!1;if(!n){const a=e.push("link_open","a",1);a.attrs=[["href",i]],a.markup="autolink",a.info="auto";const l=e.push("text","",0);l.content=e.md.normalizeLinkText(o);const c=e.push("link_close","a",-1);c.markup="autolink",c.info="auto"}return e.pos+=o.length+2,!0}if(jg.test(o)){const i=e.md.normalizeLink(`mailto:${o}`);if(!e.md.validateLink(i))return!1;if(!n){const a=e.push("link_open","a",1);a.attrs=[["href",i]],a.markup="autolink",a.info="auto";const l=e.push("text","",0);l.content=e.md.normalizeLinkText(o);const c=e.push("link_close","a",-1);c.markup="autolink",c.info="auto"}return e.pos+=o.length+2,!0}return!1}function Kg(e){return/^<a[>\s]/i.test(e)}function Jg(e){return/^<\/a\s*>/i.test(e)}function $l(e){const n=e|32;return n>=97&&n<=122}function Vg(e,n){const t=e.src;let r,s;if(t.startsWith("<!--",n)){if(t.startsWith(">",n+4))return n+5;if(t.startsWith("->",n+4))return n+6;r=n+4,s="-->"}else if(t.startsWith("<![CDATA[",n))r=n+9,s="]]>";else if(t.charCodeAt(n+1)===63)r=n+2,s="?>";else if($l(t.charCodeAt(n+2)))r=n+3,s=">";else return-1;if(e.skipHtmlSpecial)return-1;const o=t.indexOf(s,r);return o<0?(e.skipHtmlSpecial=!0,-1):o+s.length}function Yg(e,n){if(!e.md.options.html)return!1;const t=e.posMax,r=e.pos;if(e.src.charCodeAt(r)!==60||r+2>=t)return!1;let s;const o=e.src.charCodeAt(r+1);if(o===33||o===63)s=Vg(e,r);else if(o===47||$l(o)){const i=e.src.slice(r).match(ql);s=i?r+i[0].length:-1}else return!1;if(s<0)return!1;if(!n){const i=e.push("html_inline","",0);i.content=e.src.slice(r,s),Kg(i.content)&&e.linkLevel++,Jg(i.content)&&e.linkLevel--}return e.pos=s,!0}var Xg=/^&#((?:x[a-f0-9]{1,6}|[0-9]{1,7}));/i,Zg=/^&([a-z][a-z0-9]{1,31});/i;function ep(e,n){const t=e.pos,r=e.posMax;if(e.src.charCodeAt(t)!==38||t+1>=r)return!1;if(e.src.charCodeAt(t+1)===35){const s=e.src.slice(t).match(Xg);if(s){if(!n){const o=s[1][0].toLowerCase()==="x"?parseInt(s[1].slice(1),16):parseInt(s[1],10),i=e.push("text_special","",0);i.content=Io(o)?fr(o):fr(65533),i.markup=s[0],i.info="entity"}return e.pos+=s[0].length,!0}}else{const s=e.src.slice(t).match(Zg);if(s){const o=xl(s[0]);if(o!==s[0]){if(!n){const i=e.push("text_special","",0);i.content=o,i.markup=s[0],i.info="entity"}return e.pos+=s[0].length,!0}}}return!1}function Ki(e){const n={},t=e.length;if(!t)return;let r=0,s=-2;const o=[];for(let i=0;i<t;i++){const a=e[i];if(o.push(0),(e[r].marker!==a.marker||s!==a.token-1)&&(r=i),s=a.token,a.length=a.length||0,!a.close)continue;n.hasOwnProperty(a.marker)||(n[a.marker]=[-1,-1,-1,-1,-1,-1]);const l=n[a.marker][(a.open?3:0)+a.length%3];let c=r-o[r]-1,u=c;for(;c>l;c-=o[c]+1){const d=e[c];if(d.marker===a.marker&&d.open&&d.end<0){let m=!1;if((d.close||a.open)&&(d.length+a.length)%3===0&&(d.length%3!==0||a.length%3!==0)&&(m=!0),!m){const f=c>0&&!e[c-1].open?o[c-1]+1:0;o[i]=i-c+f,o[c]=f,a.open=!1,d.end=i,d.close=!1,u=-1,s=-2;break}}}u!==-1&&(n[a.marker][(a.open?3:0)+(a.length||0)%3]=u)}}function np(e){const n=e.tokens_meta,t=e.tokens_meta.length;Ki(e.delimiters);for(let s=0;s<t;s++){var r;const o=(r=n[s])===null||r===void 0?void 0:r.delimiters;o&&Ki(o)}}function tp(e){let n,t,r=0;const s=e.tokens,o=e.tokens.length;for(n=t=0;n<o;n++)s[n].nesting<0&&r--,s[n].level=r,s[n].nesting>0&&r++,s[n].type==="text"&&n+1<o&&s[n+1].type==="text"?s[n+1].content=s[n].content+s[n+1].content:(n!==t&&(s[t]=s[n]),t++);n!==t&&(s.length=t)}var Ks=[["text",Ng],["linkify",Ig],["newline",Mg],["escape",Pg],["backticks",Bg],["strikethrough",Hl.tokenize],["emphasis",Gl.tokenize],["link",Gg],["image",$g],["autolink",zg],["html_inline",Yg],["entity",ep]],Js=[["balance_pairs",np],["strikethrough",Hl.postProcess],["emphasis",Gl.postProcess],["fragments_join",tp]],jl=class{constructor(){V(this,"ruler",new Er),V(this,"ruler2",new Er),V(this,"State",Wl);for(let e=0;e<Ks.length;e++)this.ruler.push(Ks[e][0],Ks[e][1]);for(let e=0;e<Js.length;e++)this.ruler2.push(Js[e][0],Js[e][1])}skipToken(e){const n=e.pos,t=this.ruler.getRules(""),r=t.length,s=e.md.options.maxNesting,o=e.cache;if(typeof o[n]<"u"){e.pos=o[n];return}let i=!1;if(e.level<s){for(let a=0;a<r;a++)if(e.level++,i=t[a](e,!0),e.level--,i){if(n>=e.pos)throw new Error("inline rule didn't increment state.pos");break}}else e.pos=e.posMax;i||e.pos++,o[n]=e.pos}tokenize(e){const n=this.ruler.getRules(""),t=n.length,r=e.posMax,s=e.md.options.maxNesting;for(;e.pos<r;){const o=e.pos;let i=!1;if(e.level<s){for(let a=0;a<t;a++)if(i=n[a](e,!1),i){if(o>=e.pos)throw new Error("inline rule didn't increment state.pos");break}}if(i){if(e.pos>=r)break;continue}e.pending+=e.src[e.pos++]}e.pending&&e.pushPending()}parse(e,n,t,r){const s=new this.State(e,n,t,r);this.tokenize(s);const o=this.ruler2.getRules(""),i=o.length;for(let a=0;a<i;a++)o[a](s)}},rp={default:{options:{html:!1,xhtmlOut:!1,breaks:!1,langPrefix:"language-",linkify:!1,typographer:!1,quotes:"“”‘’",highlight:null,maxNesting:100},components:{core:{},block:{},inline:{}}},zero:{options:{html:!1,xhtmlOut:!1,breaks:!1,langPrefix:"language-",linkify:!1,typographer:!1,quotes:"“”‘’",highlight:null,maxNesting:20},components:{core:{rules:["normalize","block","strip_references","inline","text_join"]},block:{rules:["paragraph"]},inline:{rules:["text"],rules2:["balance_pairs","fragments_join"]}}},commonmark:{options:{html:!0,xhtmlOut:!0,breaks:!1,langPrefix:"language-",linkify:!1,typographer:!1,quotes:"“”‘’",highlight:null,maxNesting:20},components:{core:{rules:["normalize","block","strip_references","inline","text_join"]},block:{rules:["blockquote","code","fence","heading","hr","html_block","lheading","list","reference","paragraph"]},inline:{rules:["autolink","backticks","emphasis","entity","escape","html_inline","image","link","newline","text"],rules2:["balance_pairs","emphasis","fragments_join"]}}}},sp=/^(vbscript|javascript|file|data):/,op=/^data:image\/(gif|png|jpeg|webp);/,Ji=["http:","https:","mailto:"],Xn=class{validateLink(e){const n=e.trim().toLowerCase();return sp.test(n)?op.test(n):!0}normalizeLink(e){const n=ho(e,!0);if(n.hostname&&(!n.protocol||Ji.indexOf(n.protocol)>=0))try{n.hostname=Fi.toASCII(n.hostname)}catch{}return n.auth&&(n.auth=lt(n.auth)),n.hostname&&(n.hostname=lt(n.hostname)),n.pathname&&(n.pathname=lt(n.pathname)),n.search&&(n.search=lt(n.search)),n.hash&&(n.hash=lt(n.hash)),fo(n)}normalizeLinkText(e){const n=ho(e,!0);if(n.hostname&&(!n.protocol||Ji.indexOf(n.protocol)>=0))try{n.hostname=Fi.toUnicode(n.hostname)}catch{}return qt(fo(n),qt.defaultChars+"%")}constructor(...e){V(this,"inline",new jl),V(this,"block",new Ul),V(this,"core",new Fl),V(this,"renderer",new Il),V(this,"linkify",new hh),V(this,"utils",kh),V(this,"helpers",Object.assign({},Wh));const[n,t]=e;typeof n=="string"?(this.configure(n),t&&this.set(t)):(this.configure("default"),this.set(n||{}))}set(e){return Object.assign(this.options,e),this}configure(e){let n;if(typeof e=="string"){const s=e;if(n=rp[s],!n)throw new Error(`Wrong 'markdown-it' preset "${s}", check name`)}else n=e;if(!n)throw new Error("Wrong `markdown-it` preset, can't be empty");n.options&&(this.options={...n.options});const t=n.components;if(t){var r;["core","block","inline"].forEach(o=>{var i;const a=(i=t[o])===null||i===void 0?void 0:i.rules;a&&this[o].ruler.enableOnly(a)});const s=(r=t.inline)===null||r===void 0?void 0:r.rules2;s&&this.inline.ruler2.enableOnly(s)}return this}enable(e,n=!1){let t=[];Array.isArray(e)||(e=[e]),["core","block","inline"].forEach(s=>{t=t.concat(this[s].ruler.enable(e,!0))}),t=t.concat(this.inline.ruler2.enable(e,!0));const r=e.filter(s=>t.indexOf(s)<0);if(r.length&&!n)throw new Error(`MarkdownIt. Failed to enable unknown rule(s): ${r}`);return this}disable(e,n=!1){let t=[];Array.isArray(e)||(e=[e]),["core","block","inline"].forEach(s=>{t=t.concat(this[s].ruler.disable(e,!0))}),t=t.concat(this.inline.ruler2.disable(e,!0));const r=e.filter(s=>t.indexOf(s)<0);if(r.length&&!n)throw new Error(`MarkdownIt. Failed to disable unknown rule(s): ${r}`);return this}use(e,...n){return e.apply(e,[this,...n]),this}parse(e,n){if(typeof e!="string")throw new Error("Input data should be a String");const t=new this.core.State(e,this,n);return this.core.process(t),t.tokens}render(e,n={}){return this.renderer.render(this.parse(e,n),this.options,n)}parseInline(e,n){const t=new this.core.State(e,this,n);return t.inlineMode=!0,this.core.process(t),t.tokens}renderInline(e,n={}){return this.renderer.render(this.parseInline(e,n),this.options,n)}};V(Xn,"Token",wt);V(Xn,"Ruler",Er);V(Xn,"Renderer",Il);V(Xn,"ParserCore",Fl);V(Xn,"StateCore",Ml);V(Xn,"ParserBlock",Ul);V(Xn,"StateBlock",Bl);V(Xn,"ParserInline",jl);V(Xn,"StateInline",Wl);var ip=Nl(Xn);function ap(e){return e&&e.__esModule&&Object.prototype.hasOwnProperty.call(e,"default")?e.default:e}var Vs,Vi;function lp(){if(Vi)return Vs;Vi=1;function e(E){return E instanceof Map?E.clear=E.delete=E.set=function(){throw new Error("map is read-only")}:E instanceof Set&&(E.add=E.clear=E.delete=function(){throw new Error("set is read-only")}),Object.freeze(E),Object.getOwnPropertyNames(E).forEach(D=>{const z=E[D],le=typeof z;(le==="object"||le==="function")&&!Object.isFrozen(z)&&e(z)}),E}class n{constructor(D){D.data===void 0&&(D.data={}),this.data=D.data,this.isMatchIgnored=!1}ignoreMatch(){this.isMatchIgnored=!0}}function t(E){return E.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")}function r(E,...D){const z=Object.create(null);for(const le in E)z[le]=E[le];return D.forEach(function(le){for(const je in le)z[je]=le[je]}),z}const s="</span>",o=E=>!!E.scope,i=(E,{prefix:D})=>{if(E.startsWith("language:"))return E.replace("language:","language-");if(E.includes(".")){const z=E.split(".");return[`${D}${z.shift()}`,...z.map((le,je)=>`${le}${"_".repeat(je+1)}`)].join(" ")}return`${D}${E}`};class a{constructor(D,z){this.buffer="",this.classPrefix=z.classPrefix,D.walk(this)}addText(D){this.buffer+=t(D)}openNode(D){if(!o(D))return;const z=i(D.scope,{prefix:this.classPrefix});this.span(z)}closeNode(D){o(D)&&(this.buffer+=s)}value(){return this.buffer}span(D){this.buffer+=`<span class="${D}">`}}const l=(E={})=>{const D={children:[]};return Object.assign(D,E),D};class c{constructor(){this.rootNode=l(),this.stack=[this.rootNode]}get top(){return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(D){this.top.children.push(D)}openNode(D){const z=l({scope:D});this.add(z),this.stack.push(z)}closeNode(){if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}walk(D){return this.constructor._walk(D,this.rootNode)}static _walk(D,z){return typeof z=="string"?D.addText(z):z.children&&(D.openNode(z),z.children.forEach(le=>this._walk(D,le)),D.closeNode(z)),D}static _collapse(D){typeof D!="string"&&D.children&&(D.children.every(z=>typeof z=="string")?D.children=[D.children.join("")]:D.children.forEach(z=>{c._collapse(z)}))}}class u extends c{constructor(D){super(),this.options=D}addText(D){D!==""&&this.add(D)}startScope(D){this.openNode(D)}endScope(){this.closeNode()}__addSublanguage(D,z){const le=D.root;z&&(le.scope=`language:${z}`),this.add(le)}toHTML(){return new a(this,this.options).value()}finalize(){return this.closeAllNodes(),!0}}function d(E){return E?typeof E=="string"?E:E.source:null}function m(E){return b("(?=",E,")")}function f(E){return b("(?:",E,")*")}function g(E){return b("(?:",E,")?")}function b(...E){return E.map(z=>d(z)).join("")}function _(E){const D=E[E.length-1];return typeof D=="object"&&D.constructor===Object?(E.splice(E.length-1,1),D):{}}function w(...E){return"("+(_(E).capture?"":"?:")+E.map(le=>d(le)).join("|")+")"}function A(E){return new RegExp(E.toString()+"|").exec("").length-1}function x(E,D){const z=E&&E.exec(D);return z&&z.index===0}const S=new RegExp(w(/\[(?:[^\\\]]|\\.)*\]/,/\(\?<(?![=!])[^>]+>/,/\(\?'[^']+'/,/\(\??/,/\\([1-9][0-9]*)/,/\\./));function T(E,{joinWith:D}){let z=0;return E.map(le=>{z+=1;const je=z;let Qe=d(le),Y="";for(;Qe.length>0;){const J=S.exec(Qe);if(!J){Y+=Qe;break}Y+=Qe.substring(0,J.index),Qe=Qe.substring(J.index+J[0].length),J[0][0]==="\\"&&J[1]?Y+="\\"+String(Number(J[1])+je):(Y+=J[0],(J[0]==="("||/^\(\?[<']/.test(J[0]))&&z++)}return Y}).map(le=>`(${le})`).join(D)}const C=/\b\B/,k="[a-zA-Z]\\w*",O="[a-zA-Z_]\\w*",q="\\b\\d+(\\.\\d+)?",X="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",ee="\\b(0b[01]+)",j="!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",M=(E={})=>{const D=/^#![ ]*\//;return E.binary&&(E.begin=b(D,/.*\b/,E.binary,/\b.*/)),r({scope:"meta",begin:D,end:/$/,relevance:0,"on:begin":(z,le)=>{z.index!==0&&le.ignoreMatch()}},E)},ce={begin:"\\\\[\\s\\S]",relevance:0},Ce={scope:"string",begin:"'",end:"'",illegal:"\\n",contains:[ce]},we={scope:"string",begin:'"',end:'"',illegal:"\\n",contains:[ce]},be={begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/},oe=function(E,D,z={}){const le=r({scope:"comment",begin:E,end:D,contains:[]},z);le.contains.push({scope:"doctag",begin:"[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",end:/(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,excludeBegin:!0,relevance:0});const je=w("I","a","is","so","us","to","at","if","in","it","on",/[A-Za-z]+['](d|ve|re|ll|t|s|n)/,/[A-Za-z]+[-][a-z]+/,/[A-Za-z][a-z]{2,}/);return le.contains.push({begin:b(/[ ]+/,"(",je,/[.]?[:]?([.][ ]|[ ])/,"){3}")}),le},Ue=oe("//","$"),Ke=oe("/\\*","\\*/"),We=oe("#","$"),He={scope:"number",begin:q,relevance:0},En={scope:"number",begin:X,relevance:0},ge={scope:"number",begin:ee,relevance:0},Fe={scope:"regexp",begin:/\/(?=[^/\n]*\/)/,end:/\/[gimuy]*/,contains:[ce,{begin:/\[/,end:/\]/,relevance:0,contains:[ce]}]},Zn={scope:"title",begin:k,relevance:0},Dt={scope:"title",begin:O,relevance:0},xr={begin:"\\.\\s*"+O,relevance:0};var $t=Object.freeze({__proto__:null,APOS_STRING_MODE:Ce,BACKSLASH_ESCAPE:ce,BINARY_NUMBER_MODE:ge,BINARY_NUMBER_RE:ee,COMMENT:oe,C_BLOCK_COMMENT_MODE:Ke,C_LINE_COMMENT_MODE:Ue,C_NUMBER_MODE:En,C_NUMBER_RE:X,END_SAME_AS_BEGIN:function(E){return Object.assign(E,{"on:begin":(D,z)=>{z.data._beginMatch=D[1]},"on:end":(D,z)=>{z.data._beginMatch!==D[1]&&z.ignoreMatch()}})},HASH_COMMENT_MODE:We,IDENT_RE:k,MATCH_NOTHING_RE:C,METHOD_GUARD:xr,NUMBER_MODE:He,NUMBER_RE:q,PHRASAL_WORDS_MODE:be,QUOTE_STRING_MODE:we,REGEXP_MODE:Fe,RE_STARTERS_RE:j,SHEBANG:M,TITLE_MODE:Zn,UNDERSCORE_IDENT_RE:O,UNDERSCORE_TITLE_MODE:Dt});function h(E,D){E.input[E.index-1]==="."&&D.ignoreMatch()}function y(E,D){E.className!==void 0&&(E.scope=E.className,delete E.className)}function v(E,D){D&&E.beginKeywords&&(E.begin="\\b("+E.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",E.__beforeBegin=h,E.keywords=E.keywords||E.beginKeywords,delete E.beginKeywords,E.relevance===void 0&&(E.relevance=0))}function P(E,D){Array.isArray(E.illegal)&&(E.illegal=w(...E.illegal))}function L(E,D){if(E.match){if(E.begin||E.end)throw new Error("begin & end are not supported with match");E.begin=E.match,delete E.match}}function I(E,D){E.relevance===void 0&&(E.relevance=1)}const G=(E,D)=>{if(!E.beforeMatch)return;if(E.starts)throw new Error("beforeMatch cannot be used with starts");const z=Object.assign({},E);Object.keys(E).forEach(le=>{delete E[le]}),E.keywords=z.keywords,E.begin=b(z.beforeMatch,m(z.begin)),E.starts={relevance:0,contains:[Object.assign(z,{endsParent:!0})]},E.relevance=0,delete z.beforeMatch},H=["of","and","for","in","not","or","if","then","parent","list","value"],W="keyword";function N(E,D,z=W){const le=Object.create(null);return typeof E=="string"?je(z,E.split(" ")):Array.isArray(E)?je(z,E):Object.keys(E).forEach(function(Qe){Object.assign(le,N(E[Qe],D,Qe))}),le;function je(Qe,Y){D&&(Y=Y.map(J=>J.toLowerCase())),Y.forEach(function(J){const ae=J.split("|");le[ae[0]]=[Qe,ne(ae[0],ae[1])]})}}function ne(E,D){return D?Number(D):Q(E)?0:1}function Q(E){return H.includes(E.toLowerCase())}const te={},se=E=>{console.error(E)},pe=(E,...D)=>{console.log(`WARN: ${E}`,...D)},Se=(E,D)=>{te[`${E}/${D}`]||(console.log(`Deprecated as of ${E}. ${D}`),te[`${E}/${D}`]=!0)},xe=new Error;function Be(E,D,{key:z}){let le=0;const je=E[z],Qe={},Y={};for(let J=1;J<=D.length;J++)Y[J+le]=je[J],Qe[J+le]=!0,le+=A(D[J-1]);E[z]=Y,E[z]._emit=Qe,E[z]._multi=!0}function Je(E){if(Array.isArray(E.begin)){if(E.skip||E.excludeBegin||E.returnBegin)throw se("skip, excludeBegin, returnBegin not compatible with beginScope: {}"),xe;if(typeof E.beginScope!="object"||E.beginScope===null)throw se("beginScope must be object"),xe;Be(E,E.begin,{key:"beginScope"}),E.begin=T(E.begin,{joinWith:""})}}function yn(E){if(Array.isArray(E.end)){if(E.skip||E.excludeEnd||E.returnEnd)throw se("skip, excludeEnd, returnEnd not compatible with endScope: {}"),xe;if(typeof E.endScope!="object"||E.endScope===null)throw se("endScope must be object"),xe;Be(E,E.end,{key:"endScope"}),E.end=T(E.end,{joinWith:""})}}function Sn(E){E.scope&&typeof E.scope=="object"&&E.scope!==null&&(E.beginScope=E.scope,delete E.scope)}function yt(E){Sn(E),typeof E.beginScope=="string"&&(E.beginScope={_wrap:E.beginScope}),typeof E.endScope=="string"&&(E.endScope={_wrap:E.endScope}),Je(E),yn(E)}function _r(E){function D(Y,J){return new RegExp(d(Y),"m"+(E.case_insensitive?"i":"")+(E.unicodeRegex?"u":"")+(J?"g":""))}class z{constructor(){this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}addRule(J,ae){ae.position=this.position++,this.matchIndexes[this.matchAt]=ae,this.regexes.push([ae,J]),this.matchAt+=A(J)+1}compile(){this.regexes.length===0&&(this.exec=()=>null);const J=this.regexes.map(ae=>ae[1]);this.matcherRe=D(T(J,{joinWith:"|"}),!0),this.lastIndex=0}exec(J){this.matcherRe.lastIndex=this.lastIndex;const ae=this.matcherRe.exec(J);if(!ae)return null;const Ye=ae.findIndex((jt,Cs)=>Cs>0&&jt!==void 0),ze=this.matchIndexes[Ye];return ae.splice(0,Ye),Object.assign(ae,ze)}}class le{constructor(){this.rules=[],this.multiRegexes=[],this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(J){if(this.multiRegexes[J])return this.multiRegexes[J];const ae=new z;return this.rules.slice(J).forEach(([Ye,ze])=>ae.addRule(Ye,ze)),ae.compile(),this.multiRegexes[J]=ae,ae}resumingScanAtSamePosition(){return this.regexIndex!==0}considerAll(){this.regexIndex=0}addRule(J,ae){this.rules.push([J,ae]),ae.type==="begin"&&this.count++}exec(J){const ae=this.getMatcher(this.regexIndex);ae.lastIndex=this.lastIndex;let Ye=ae.exec(J);if(this.resumingScanAtSamePosition()&&!(Ye&&Ye.index===this.lastIndex)){const ze=this.getMatcher(0);ze.lastIndex=this.lastIndex+1,Ye=ze.exec(J)}return Ye&&(this.regexIndex+=Ye.position+1,this.regexIndex===this.count&&this.considerAll()),Ye}}function je(Y){const J=new le;return Y.contains.forEach(ae=>J.addRule(ae.begin,{rule:ae,type:"begin"})),Y.terminatorEnd&&J.addRule(Y.terminatorEnd,{type:"end"}),Y.illegal&&J.addRule(Y.illegal,{type:"illegal"}),J}function Qe(Y,J){const ae=Y;if(Y.isCompiled)return ae;[y,L,yt,G].forEach(ze=>ze(Y,J)),E.compilerExtensions.forEach(ze=>ze(Y,J)),Y.__beforeBegin=null,[v,P,I].forEach(ze=>ze(Y,J)),Y.isCompiled=!0;let Ye=null;return typeof Y.keywords=="object"&&Y.keywords.$pattern&&(Y.keywords=Object.assign({},Y.keywords),Ye=Y.keywords.$pattern,delete Y.keywords.$pattern),Ye=Ye||/\w+/,Y.keywords&&(Y.keywords=N(Y.keywords,E.case_insensitive)),ae.keywordPatternRe=D(Ye,!0),J&&(Y.begin||(Y.begin=/\B|\b/),ae.beginRe=D(ae.begin),!Y.end&&!Y.endsWithParent&&(Y.end=/\B|\b/),Y.end&&(ae.endRe=D(ae.end)),ae.terminatorEnd=d(ae.end)||"",Y.endsWithParent&&J.terminatorEnd&&(ae.terminatorEnd+=(Y.end?"|":"")+J.terminatorEnd)),Y.illegal&&(ae.illegalRe=D(Y.illegal)),Y.contains||(Y.contains=[]),Y.contains=[].concat(...Y.contains.map(function(ze){return bn(ze==="self"?Y:ze)})),Y.contains.forEach(function(ze){Qe(ze,ae)}),Y.starts&&Qe(Y.starts,J),ae.matcher=je(ae),ae}if(E.compilerExtensions||(E.compilerExtensions=[]),E.contains&&E.contains.includes("self"))throw new Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");return E.classNameAliases=r(E.classNameAliases||{}),Qe(E)}function sn(E){return E?E.endsWithParent||sn(E.starts):!1}function bn(E){return E.variants&&!E.cachedVariants&&(E.cachedVariants=E.variants.map(function(D){return r(E,{variants:null},D)})),E.cachedVariants?E.cachedVariants:sn(E)?r(E,{starts:E.starts?r(E.starts):null}):Object.isFrozen(E)?r(E):E}var Cr="11.12.0";class vr extends Error{constructor(D,z){super(D),this.name="HTMLInjectionError",this.html=z}}const _s=t,Po=r,Fo=Symbol("nomatch"),Xl=7,Bo=function(E){const D=Object.create(null),z=Object.create(null),le=[];let je=!0;const Qe="Could not find the language '{}', did you forget to load/include a language module?",Y={disableAutodetect:!0,name:"Plain text",contains:[]};let J={ignoreUnescapedHTML:!1,throwUnescapedHTML:!1,noHighlightRe:/^(no-?highlight)$/i,languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",cssSelector:"pre code",languages:null,__emitter:u};function ae(U){return J.noHighlightRe.test(U)}function Ye(U){let re=U.className+" ";re+=U.parentNode?U.parentNode.className:"";const Ee=J.languageDetectRe.exec(re);if(Ee){const Ne=ut(Ee[1]);return Ne||(pe(Qe.replace("{}",Ee[1])),pe("Falling back to no-highlight mode for this block.",U)),Ne?Ee[1]:"no-highlight"}return re.split(/\s+/).find(Ne=>ae(Ne)||ut(Ne))}function ze(U,re,Ee){let Ne="",Ve="";typeof re=="object"?(Ne=U,Ee=re.ignoreIllegals,Ve=re.language):(Se("10.7.0","highlight(lang, code, ...args) has been deprecated."),Se("10.7.0",`Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`),Ve=U,Ne=re),Ee===void 0&&(Ee=!0);const kn={code:Ne,language:Ve};Rr("before:highlight",kn);const dt=kn.result?kn.result:jt(kn.language,kn.code,Ee);return dt.code=kn.code,Rr("after:highlight",dt),dt}function jt(U,re,Ee,Ne){const Ve=Object.create(null);function kn(K,Z){return K.keywords[Z]}function dt(){if(!ue.keywords){nn.addText(Oe);return}let K=0;ue.keywordPatternRe.lastIndex=0;let Z=ue.keywordPatternRe.exec(Oe),fe="";for(;Z;){fe+=Oe.substring(K,Z.index);const Re=Mn.case_insensitive?Z[0].toLowerCase():Z[0],on=kn(ue,Re);if(on){const[et,pc]=on;if(nn.addText(fe),fe="",Ve[Re]=(Ve[Re]||0)+1,Ve[Re]<=Xl&&(Dr+=pc),et.startsWith("_"))fe+=Z[0];else{const mc=Mn.classNameAliases[et]||et;In(Z[0],mc)}}else fe+=Z[0];K=ue.keywordPatternRe.lastIndex,Z=ue.keywordPatternRe.exec(Oe)}fe+=Oe.substring(K),nn.addText(fe)}function wr(){if(Oe==="")return;let K=null;if(typeof ue.subLanguage=="string"){if(!D[ue.subLanguage]){nn.addText(Oe);return}K=jt(ue.subLanguage,Oe,!0,Qo[ue.subLanguage]),Qo[ue.subLanguage]=K._top}else K=vs(Oe,ue.subLanguage.length?ue.subLanguage:null);ue.relevance>0&&(Dr+=K.relevance),nn.__addSublanguage(K._emitter,K.language)}function gn(){ue.subLanguage!=null?wr():dt(),Oe=""}function In(K,Z){K!==""&&(nn.startScope(Z),nn.addText(K),nn.endScope())}function Ho(K,Z){let fe=1;const Re=Z.length-1;for(;fe<=Re;){if(!K._emit[fe]){fe++;continue}const on=Mn.classNameAliases[K[fe]]||K[fe],et=Z[fe];on?In(et,on):(Oe=et,dt(),Oe=""),fe++}}function Go(K,Z){return K.scope&&typeof K.scope=="string"&&nn.openNode(Mn.classNameAliases[K.scope]||K.scope),K.beginScope&&(K.beginScope._wrap?(In(Oe,Mn.classNameAliases[K.beginScope._wrap]||K.beginScope._wrap),Oe=""):K.beginScope._multi&&(Ho(K.beginScope,Z),Oe="")),ue=Object.create(K,{parent:{value:ue}}),ue}function $o(K,Z,fe){let Re=x(K.endRe,fe);if(Re){if(K["on:end"]){const on=new n(K);K["on:end"](Z,on),on.isMatchIgnored&&(Re=!1)}if(Re){for(;K.endsParent&&K.parent;)K=K.parent;return K}}if(K.endsWithParent)return $o(K.parent,Z,fe)}function uc(K){return ue.matcher.regexIndex===0?(Oe+=K[0],1):(Ts=!0,0)}function dc(K){const Z=K[0],fe=K.rule,Re=new n(fe),on=[fe.__beforeBegin,fe["on:begin"]];for(const et of on)if(et&&(et(K,Re),Re.isMatchIgnored))return uc(Z);return fe.skip?Oe+=Z:(fe.excludeBegin&&(Oe+=Z),gn(),!fe.returnBegin&&!fe.excludeBegin&&(Oe=Z)),Go(fe,K),fe.returnBegin?0:Z.length}function fc(K){const Z=K[0],fe=re.substring(K.index),Re=$o(ue,K,fe);if(!Re)return Fo;const on=ue;ue.endScope&&ue.endScope._wrap?(gn(),In(Z,ue.endScope._wrap)):ue.endScope&&ue.endScope._multi?(gn(),Ho(ue.endScope,K)):on.skip?Oe+=Z:(on.returnEnd||on.excludeEnd||(Oe+=Z),gn(),on.excludeEnd&&(Oe=Z));do ue.scope&&nn.closeNode(),!ue.skip&&!ue.subLanguage&&(Dr+=ue.relevance),ue=ue.parent;while(ue!==Re.parent);return Re.starts&&Go(Re.starts,K),on.returnEnd?0:Z.length}function hc(){const K=[];for(let Z=ue;Z!==Mn;Z=Z.parent)Z.scope&&K.unshift(Z.scope);K.forEach(Z=>nn.openNode(Z))}let Tr={};function jo(K,Z){const fe=Z&&Z[0];if(Oe+=K,fe==null)return gn(),0;if(Tr.type==="begin"&&Z.type==="end"&&Tr.index===Z.index&&fe===""){if(Oe+=re.slice(Z.index,Z.index+1),!je){const Re=new Error(`0 width match regex (${U})`);throw Re.languageName=U,Re.badRule=Tr.rule,Re}return 1}if(Tr=Z,Z.type==="begin")return dc(Z);if(Z.type==="illegal"&&!Ee){const Re=new Error('Illegal lexeme "'+fe+'" for mode "'+(ue.scope||"<unnamed>")+'"');throw Re.mode=ue,Re}else if(Z.type==="end"){const Re=fc(Z);if(Re!==Fo)return Re}if(Z.type==="illegal"&&fe==="")return Z.index===re.length||(Oe+=`
`),1;if(ws>1e5&&ws>Z.index*3)throw new Error("potential infinite loop, way more iterations than matches");return Oe+=fe,fe.length}const Mn=ut(U);if(!Mn)throw se(Qe.replace("{}",U)),new Error('Unknown language: "'+U+'"');const gc=_r(Mn);let Rs="",ue=Ne||gc;const Qo={},nn=new J.__emitter(J);hc();let Oe="",Dr=0,St=0,ws=0,Ts=!1;try{if(Mn.__emitTokens)Mn.__emitTokens(re,nn);else{for(ue.matcher.considerAll();;){ws++,Ts?Ts=!1:ue.matcher.considerAll(),ue.matcher.lastIndex=St;const K=ue.matcher.exec(re);if(!K)break;const Z=re.substring(St,K.index),fe=jo(Z,K);St=K.index+fe}jo(re.substring(St))}return nn.finalize(),Rs=nn.toHTML(),{language:U,value:Rs,relevance:Dr,illegal:!1,_emitter:nn,_top:ue}}catch(K){if(K.message&&K.message.includes("Illegal"))return{language:U,value:_s(re),illegal:!0,relevance:0,_illegalBy:{message:K.message,index:St,context:re.slice(St-100,St+100),mode:K.mode,resultSoFar:Rs},_emitter:nn};if(je)return{language:U,value:_s(re),illegal:!1,relevance:0,errorRaised:K,_emitter:nn,_top:ue};throw K}}function Cs(U){const re={value:_s(U),illegal:!1,relevance:0,_top:Y,_emitter:new J.__emitter(J)};return re._emitter.addText(U),re}function vs(U,re){re=re||J.languages||Object.keys(D);const Ee=Cs(U),Ne=re.filter(ut).filter(Wo).map(gn=>jt(gn,U,!1));Ne.unshift(Ee);const Ve=Ne.sort((gn,In)=>{if(gn.relevance!==In.relevance)return In.relevance-gn.relevance;if(gn.language&&In.language){if(ut(gn.language).supersetOf===In.language)return 1;if(ut(In.language).supersetOf===gn.language)return-1}return 0}),[kn,dt]=Ve,wr=kn;return wr.secondBest=dt,wr}function Zl(U,re,Ee){const Ne=re&&z[re]||Ee;U.classList.add("hljs"),U.classList.add(`language-${Ne}`)}function ks(U){let re=null;const Ee=Ye(U);if(ae(Ee))return;if(Rr("before:highlightElement",{el:U,language:Ee}),U.dataset.highlighted){console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.",U);return}if(U.children.length>0&&(J.ignoreUnescapedHTML||(console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."),console.warn("https://github.com/highlightjs/highlight.js/wiki/security"),console.warn("The element with unescaped HTML:"),console.warn(U)),J.throwUnescapedHTML))throw new vr("One of your code blocks includes unescaped HTML.",U.innerHTML);re=U;const Ne=re.textContent,Ve=Ee?ze(Ne,{language:Ee,ignoreIllegals:!0}):vs(Ne);U.innerHTML=Ve.value,U.dataset.highlighted="yes",Zl(U,Ee,Ve.language),U.result={language:Ve.language,re:Ve.relevance,relevance:Ve.relevance},Ve.secondBest&&(U.secondBest={language:Ve.secondBest.language,relevance:Ve.secondBest.relevance}),Rr("after:highlightElement",{el:U,result:Ve,text:Ne})}function ec(U){J=Po(J,U)}const nc=()=>{kr(),Se("10.6.0","initHighlighting() deprecated.  Use highlightAll() now.")};function tc(){kr(),Se("10.6.0","initHighlightingOnLoad() deprecated.  Use highlightAll() now.")}let qo=!1;function kr(){function U(){kr()}if(document.readyState==="loading"){qo||window.addEventListener("DOMContentLoaded",U,!1),qo=!0;return}document.querySelectorAll(J.cssSelector).forEach(ks)}function rc(U,re){let Ee=null;try{Ee=re(E)}catch(Ne){if(se("Language definition for '{}' could not be registered.".replace("{}",U)),je)se(Ne);else throw Ne;Ee=Y}Ee.name||(Ee.name=U),D[U]=Ee,Ee.rawDefinition=re.bind(null,E),Ee.aliases&&Uo(Ee.aliases,{languageName:U})}function sc(U){delete D[U];for(const re of Object.keys(z))z[re]===U&&delete z[re]}function oc(){return Object.keys(D)}function ut(U){return U=(U||"").toLowerCase(),D[U]||D[z[U]]}function Uo(U,{languageName:re}){typeof U=="string"&&(U=[U]),U.forEach(Ee=>{z[Ee.toLowerCase()]=re})}function Wo(U){const re=ut(U);return re&&!re.disableAutodetect}function ic(U){U["before:highlightBlock"]&&!U["before:highlightElement"]&&(U["before:highlightElement"]=re=>{U["before:highlightBlock"](Object.assign({block:re.el},re))}),U["after:highlightBlock"]&&!U["after:highlightElement"]&&(U["after:highlightElement"]=re=>{U["after:highlightBlock"](Object.assign({block:re.el},re))})}function ac(U){ic(U),le.push(U)}function lc(U){const re=le.indexOf(U);re!==-1&&le.splice(re,1)}function Rr(U,re){const Ee=U;le.forEach(function(Ne){Ne[Ee]&&Ne[Ee](re)})}function cc(U){return Se("10.7.0","highlightBlock will be removed entirely in v12.0"),Se("10.7.0","Please use highlightElement now."),ks(U)}Object.assign(E,{highlight:ze,highlightAuto:vs,highlightAll:kr,highlightElement:ks,highlightBlock:cc,configure:ec,initHighlighting:nc,initHighlightingOnLoad:tc,registerLanguage:rc,unregisterLanguage:sc,listLanguages:oc,getLanguage:ut,registerAliases:Uo,autoDetection:Wo,inherit:Po,addPlugin:ac,removePlugin:lc}),E.debugMode=function(){je=!1},E.safeMode=function(){je=!0},E.versionString=Cr,E.regex={concat:b,lookahead:m,either:w,optional:g,anyNumberOfTimes:f};for(const U in $t)typeof $t[U]=="object"&&e($t[U]);return Object.assign(E,$t),E},Nt=Bo({});return Nt.newInstance=()=>Bo({}),Vs=Nt,Nt.HighlightJS=Nt,Nt.default=Nt,Vs}var cp=lp();const Vn=ap(cp);function up(e){const o={keyword:["break","case","chan","const","continue","default","defer","else","fallthrough","for","func","go","goto","if","import","interface","map","package","range","return","select","struct","switch","type","var"],type:["bool","byte","complex64","complex128","error","float32","float64","int8","int16","int32","int64","string","uint8","uint16","uint32","uint64","int","uint","uintptr","rune"],literal:["true","false","iota","nil"],built_in:["append","cap","close","complex","copy","imag","len","make","new","panic","print","println","real","recover","delete"]};return{name:"Go",aliases:["golang"],keywords:o,illegal:"</",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{className:"number",variants:[{match:/-?\b0[xX]\.[a-fA-F0-9](_?[a-fA-F0-9])*[pP][+-]?\d(_?\d)*i?/,relevance:0},{match:/-?\b0[xX](_?[a-fA-F0-9])+((\.([a-fA-F0-9](_?[a-fA-F0-9])*)?)?[pP][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b0[oO](_?[0-7])*i?/,relevance:0},{match:/-?\b0[bB](_?[01])*i?/,relevance:0},{match:/-?\.\d(_?\d)*([eE][+-]?\d(_?\d)*)?i?/,relevance:0},{match:/-?\b\d(_?\d)*(\.(\d(_?\d)*)?)?([eE][+-]?\d(_?\d)*)?i?/,relevance:0}]},{begin:/:=/},{className:"function",beginKeywords:"func",end:"\\s*(\\{|$)",excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,endsParent:!0,keywords:o,illegal:/["']/}]}]}}function Ql(e){const n=e.regex,t={},r={begin:/\$\{/,end:/\}/,contains:["self",{begin:/:-/,contains:[t]}]};Object.assign(t,{className:"variable",variants:[{begin:n.concat(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},r]});const s={className:"subst",begin:/\$\(/,end:/\)/,contains:[e.BACKSLASH_ESCAPE]},o=e.inherit(e.COMMENT(),{match:[/(^|\s)/,/#.*$/],scope:{2:"comment"}}),i={begin:/<<-?\s*(?=\w+)/,starts:{contains:[e.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,className:"string"})]}},a={className:"string",begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,t,s]};s.contains.push(a);const l={match:/\\"/},c={className:"string",begin:/'/,end:/'/},u={match:/\\'/},d={begin:/\$?\(\(/,end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},e.NUMBER_MODE,t]},m=["fish","bash","zsh","sh","csh","ksh","tcsh","dash","scsh"],f=e.SHEBANG({binary:`(${m.join("|")})`,relevance:10}),g={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,contains:[e.inherit(e.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0},b=["if","then","else","elif","fi","time","for","while","until","in","do","done","case","esac","coproc","function","select"],_=["true","false"],w={match:/(\/[a-z._-]+)+/},A=["break","cd","continue","eval","exec","exit","export","getopts","hash","pwd","readonly","return","shift","test","times","trap","umask","unset"],x=["alias","bind","builtin","caller","command","declare","echo","enable","help","let","local","logout","mapfile","printf","read","readarray","source","sudo","type","typeset","ulimit","unalias"],S=["autoload","bg","bindkey","bye","cap","chdir","clone","comparguments","compcall","compctl","compdescribe","compfiles","compgroups","compquote","comptags","comptry","compvalues","dirs","disable","disown","echotc","echoti","emulate","fc","fg","float","functions","getcap","getln","history","integer","jobs","kill","limit","log","noglob","popd","print","pushd","pushln","rehash","sched","setcap","setopt","stat","suspend","ttyctl","unfunction","unhash","unlimit","unsetopt","vared","wait","whence","where","which","zcompile","zformat","zftp","zle","zmodload","zparseopts","zprof","zpty","zregexparse","zsocket","zstyle","ztcp"],T=["chcon","chgrp","chown","chmod","cp","dd","df","dir","dircolors","ln","ls","mkdir","mkfifo","mknod","mktemp","mv","realpath","rm","rmdir","shred","sync","touch","truncate","vdir","b2sum","base32","base64","cat","cksum","comm","csplit","cut","expand","fmt","fold","head","join","md5sum","nl","numfmt","od","paste","ptx","pr","sha1sum","sha224sum","sha256sum","sha384sum","sha512sum","shuf","sort","split","sum","tac","tail","tr","tsort","unexpand","uniq","wc","arch","basename","chroot","date","dirname","du","echo","env","expr","factor","groups","hostid","id","link","logname","nice","nohup","nproc","pathchk","pinky","printenv","printf","pwd","readlink","runcon","seq","sleep","stat","stdbuf","stty","tee","test","timeout","tty","uname","unlink","uptime","users","who","whoami","yes"];return{name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z][a-z0-9._-]+\b/,keyword:b,literal:_,built_in:[...A,...x,"set","shopt",...S,...T]},contains:[f,e.SHEBANG(),g,d,o,i,w,a,l,c,u,t]}}function dp(e){const n=e.regex,t=e.COMMENT("--","$"),r={scope:"string",variants:[{begin:/'/,end:/'/,contains:[{match:/''/}]}]},s={begin:/"/,end:/"/,contains:[{match:/""/}]},o=["true","false","unknown"],i=["double precision","large object","with timezone","without timezone"],a=["bigint","binary","blob","boolean","char","character","clob","date","dec","decfloat","decimal","float","int","integer","interval","nchar","nclob","national","numeric","real","row","smallint","time","timestamp","varchar","varying","varbinary"],l=["add","asc","collation","desc","final","first","last","view"],c=["abs","acos","all","allocate","alter","and","any","are","array","array_agg","array_max_cardinality","as","asensitive","asin","asymmetric","at","atan","atomic","authorization","avg","begin","begin_frame","begin_partition","between","bigint","binary","blob","boolean","both","by","call","called","cardinality","cascaded","case","cast","ceil","ceiling","char","char_length","character","character_length","check","classifier","clob","close","coalesce","collate","collect","column","commit","condition","connect","constraint","contains","convert","copy","corr","corresponding","cos","cosh","count","covar_pop","covar_samp","create","cross","cube","cume_dist","current","current_catalog","current_date","current_default_transform_group","current_path","current_role","current_row","current_schema","current_time","current_timestamp","current_path","current_role","current_transform_group_for_type","current_user","cursor","cycle","date","day","deallocate","dec","decimal","decfloat","declare","default","define","delete","dense_rank","deref","describe","deterministic","disconnect","distinct","double","drop","dynamic","each","element","else","empty","end","end_frame","end_partition","end-exec","equals","escape","every","except","exec","execute","exists","exp","external","extract","false","fetch","filter","first_value","float","floor","for","foreign","frame_row","free","from","full","function","fusion","get","global","grant","group","grouping","groups","having","hold","hour","identity","in","indicator","initial","inner","inout","insensitive","insert","int","integer","intersect","intersection","interval","into","is","join","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","language","large","last_value","lateral","lead","leading","left","like","like_regex","listagg","ln","local","localtime","localtimestamp","log","log10","lower","match","match_number","match_recognize","matches","max","member","merge","method","min","minute","mod","modifies","module","month","multiset","national","natural","nchar","nclob","new","no","none","normalize","not","nth_value","ntile","null","nullif","numeric","octet_length","occurrences_regex","of","offset","old","omit","on","one","only","open","or","order","out","outer","over","overlaps","overlay","parameter","partition","pattern","per","percent","percent_rank","percentile_cont","percentile_disc","period","portion","position","position_regex","power","precedes","precision","prepare","primary","procedure","ptf","range","rank","reads","real","recursive","ref","references","referencing","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","release","result","return","returns","revoke","right","rollback","rollup","row","row_number","rows","running","savepoint","scope","scroll","search","second","seek","select","sensitive","session_user","set","show","similar","sin","sinh","skip","smallint","some","specific","specifictype","sql","sqlexception","sqlstate","sqlwarning","sqrt","start","static","stddev_pop","stddev_samp","submultiset","subset","substring","substring_regex","succeeds","sum","symmetric","system","system_time","system_user","table","tablesample","tan","tanh","then","time","timestamp","timezone_hour","timezone_minute","to","trailing","translate","translate_regex","translation","treat","trigger","trim","trim_array","true","truncate","uescape","union","unique","unknown","unnest","update","upper","user","using","value","values","value_of","var_pop","var_samp","varbinary","varchar","varying","versioning","when","whenever","where","width_bucket","window","with","within","without","year"],u=["abs","acos","array_agg","asin","atan","avg","cast","ceil","ceiling","coalesce","corr","cos","cosh","count","covar_pop","covar_samp","cume_dist","dense_rank","deref","element","exp","extract","first_value","floor","json_array","json_arrayagg","json_exists","json_object","json_objectagg","json_query","json_table","json_table_primitive","json_value","lag","last_value","lead","listagg","ln","log","log10","lower","max","min","mod","nth_value","ntile","nullif","percent_rank","percentile_cont","percentile_disc","position","position_regex","power","rank","regr_avgx","regr_avgy","regr_count","regr_intercept","regr_r2","regr_slope","regr_sxx","regr_sxy","regr_syy","row_number","sin","sinh","sqrt","stddev_pop","stddev_samp","substring","substring_regex","sum","tan","tanh","translate","translate_regex","treat","trim","trim_array","unnest","upper","value_of","var_pop","var_samp","width_bucket"],d=["current_catalog","current_date","current_default_transform_group","current_path","current_role","current_schema","current_transform_group_for_type","current_user","session_user","system_time","system_user","current_time","localtime","current_timestamp","localtimestamp"],m=["create table","insert into","primary key","foreign key","not null","alter table","add constraint","grouping sets","on overflow","character set","respect nulls","ignore nulls","nulls first","nulls last","depth first","breadth first"],f=u,g=[...c,...l].filter(T=>!u.includes(T)),b={scope:"variable",match:/@[a-z0-9][a-z0-9_]*/},_={scope:"operator",match:/[-+*/=%^~]|&&?|\|\|?|!=?|<(?:=>?|<|>)?|>[>=]?/,relevance:0},w={match:n.concat(/\b/,n.either(...f),/\s*\(/),relevance:0,keywords:{built_in:f}};function A(T){return n.concat(/\b/,n.either(...T.map(C=>C.replace(/\s+/,"\\s+"))),/\b/)}const x={scope:"keyword",match:A(m),relevance:0};function S(T,{exceptions:C,when:k}={}){const O=k;return C=C||[],T.map(q=>q.match(/\|\d+$/)||C.includes(q)?q:O(q)?`${q}|0`:q)}return{name:"SQL",case_insensitive:!0,illegal:/[{}]|<\//,keywords:{$pattern:/\b[\w\.]+/,keyword:S(g,{when:T=>T.length<3}),literal:o,type:a,built_in:d},contains:[{scope:"type",match:A(i)},x,w,b,r,s,e.C_NUMBER_MODE,e.C_BLOCK_COMMENT_MODE,t,_]}}function fp(e){const n="true false yes no null",t="[\\w#;/?:@&=+$,.~*'()[\\]]+",r={className:"attr",variants:[{begin:/[\w*@][\w*@ :()\./-]*:(?=[ \t]|$)/},{begin:/"[\w*@][\w*@ :()\./-]*":(?=[ \t]|$)/},{begin:/'[\w*@][\w*@ :()\./-]*':(?=[ \t]|$)/}]},s={className:"template-variable",variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]},o={className:"string",relevance:0,begin:/'/,end:/'/,contains:[{match:/''/,scope:"char.escape",relevance:0}]},i={className:"string",relevance:0,variants:[{begin:/"/,end:/"/},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,s]},a=e.inherit(i,{variants:[{begin:/'/,end:/'/,contains:[{begin:/''/,relevance:0}]},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),m={className:"number",begin:"\\b"+"[0-9]{4}(-[0-9][0-9]){0,2}"+"([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?"+"(\\.[0-9]*)?"+"([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?"+"\\b"},f={end:",",endsWithParent:!0,excludeEnd:!0,keywords:n,relevance:0},g={begin:/\{/,end:/\}/,contains:[f],illegal:"\\n",relevance:0},b={begin:"\\[",end:"\\]",contains:[f],illegal:"\\n",relevance:0},_=[r,{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,relevance:0},{className:"type",begin:"!\\w+!"+t},{className:"type",begin:"!<"+t+">"},{className:"type",begin:"!"+t},{className:"type",begin:"!!"+t},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},m,{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},g,b,o,i],w=[..._];return w.pop(),w.push(a),f.contains=w,{name:"YAML",case_insensitive:!0,aliases:["yml"],contains:_}}const hp="([-+]?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)|NaN|[-+]?Infinity",gp={scope:"number",match:hp,relevance:0};function pp(e){const n={className:"attr",begin:/(("(\\.|[^\\"\r\n])*")|('(\\.|[^\\'\r\n])*'))(?=\s*:)/,relevance:1.01},t={match:/[{}[\],:]/,className:"punctuation",relevance:0},r=["true","false","null"],s={scope:"literal",beginKeywords:r.join(" ")};return{name:"JSON",aliases:["jsonc","json5"],keywords:{literal:r},contains:[n,t,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,s,gp,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE],illegal:"\\S"}}const Yi="[A-Za-z$_][0-9A-Za-z$_]*",mp=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends","using"],Ep=["true","false","null","undefined","NaN","Infinity"],zl=["Object","Function","Boolean","Symbol","Math","Date","Number","BigInt","String","RegExp","Array","Float32Array","Float64Array","Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Int32Array","Uint16Array","Uint32Array","BigInt64Array","BigUint64Array","Set","Map","WeakSet","WeakMap","ArrayBuffer","SharedArrayBuffer","Atomics","DataView","JSON","Promise","Generator","GeneratorFunction","AsyncFunction","Reflect","Proxy","Intl","WebAssembly"],Kl=["Error","EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"],Jl=["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],yp=["arguments","this","super","console","window","document","localStorage","sessionStorage","module","self","global"],Sp=[].concat(Jl,zl,Kl);function Vl(e){const n=e.regex,t=(oe,{after:Ue})=>{const Ke="</"+oe[0].slice(1);return oe.input.indexOf(Ke,Ue)!==-1},r=Yi,s={begin:"<>",end:"</>"},o=/<[A-Za-z0-9\\._:-]+\s*\/>/,i={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(oe,Ue)=>{const Ke=oe[0].length+oe.index,We=oe.input[Ke];if(We==="<"||We===","){Ue.ignoreMatch();return}We===">"&&(t(oe,{after:Ke})||Ue.ignoreMatch());let He;const En=oe.input.substring(Ke);if(He=En.match(/^\s*=/)){Ue.ignoreMatch();return}if((He=En.match(/^\s+extends\s+/))&&He.index===0){Ue.ignoreMatch();return}}},a={$pattern:Yi,keyword:mp,literal:Ep,built_in:Sp,"variable.language":yp},l="[0-9](_?[0-9])*",c=`\\.(${l})`,u="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",d={className:"number",variants:[{begin:`(\\b(${u})((${c})|\\.)?|(${c}))[eE][+-]?(${l})\\b`},{begin:`\\b(${u})\\b((${c})\\b|\\.)?|(${c})\\b`},{begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{begin:"\\b0[0-7]+n?\\b"}],relevance:0},m={className:"subst",begin:"\\$\\{",end:"\\}",keywords:a,contains:[]},f={begin:".?html`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,m],subLanguage:"xml"}},g={begin:".?css`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,m],subLanguage:"css"}},b={begin:".?gql`",end:"",starts:{end:"`",returnEnd:!1,contains:[e.BACKSLASH_ESCAPE,m],subLanguage:"graphql"}},_={className:"string",begin:"`",end:"`",contains:[e.BACKSLASH_ESCAPE,m]},A={className:"comment",variants:[e.COMMENT(/\/\*\*(?!\/)/,"\\*/",{relevance:0,contains:[{begin:"(?=@[A-Za-z]+)",relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"},{className:"type",begin:"\\{",end:"\\}",excludeEnd:!0,excludeBegin:!0,relevance:0},{className:"variable",begin:r+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{begin:/(?=[^\n])\s/,relevance:0}]}]}),e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE]},x=[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,f,g,b,_,{match:/\$\d+/},d];m.contains=x.concat({begin:/\{/,end:/\}/,keywords:a,contains:["self"].concat(x)});const S=[].concat(A,m.contains),T=S.concat([{begin:/(\s*)\(/,end:/\)/,keywords:a,contains:["self"].concat(S)}]),C={className:"params",begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:T},k={variants:[{match:[/class/,/\s+/,r,/\s+/,/extends/,/\s+/,n.concat(r,"(",n.concat(/\./,r),")*")],scope:{1:"keyword",3:"title.class",5:"keyword",7:"title.class.inherited"}},{match:[/class/,/\s+/,r],scope:{1:"keyword",3:"title.class"}}]},O={relevance:0,match:n.either(/\bJSON/,/\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/,/\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/,/\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),className:"title.class",keywords:{_:[...zl,...Kl]}},q={label:"use_strict",className:"meta",relevance:10,begin:/^\s*['"]use (strict|asm)['"]/},X={variants:[{match:[/function/,/\s+/,r,/(?=\s*\()/]},{match:[/function/,/\s*(?=\()/]}],className:{1:"keyword",3:"title.function"},label:"func.def",contains:[C],illegal:/%/},ee={relevance:0,match:/\b[A-Z][A-Z_0-9]+\b/,className:"variable.constant"};function j(oe){return n.concat("(?!",oe.join("|"),")")}const M={match:n.concat(/\b/,j([...Jl,"super","import","await"].map(oe=>`${oe}\\s*\\(`)),r,n.lookahead(/\s*\(/)),className:"title.function",relevance:0},ce={begin:n.concat(/\./,n.lookahead(n.concat(r,/(?![0-9A-Za-z$_(])/))),end:r,excludeBegin:!0,keywords:"prototype",className:"property",relevance:0},Ce={match:[/get|set/,/\s+/,r,/(?=\()/],className:{1:"keyword",3:"title.function"},contains:[{begin:/\(\)/},C]},we="(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+e.UNDERSCORE_IDENT_RE+")\\s*=>",be={match:[/const|var|let/,/\s+/,r,/\s*/,/=\s*/,/(async\s*)?/,n.lookahead(we)],keywords:"async",className:{1:"keyword",3:"title.function"},contains:[C]};return{name:"JavaScript",aliases:["js","jsx","mjs","cjs"],keywords:a,exports:{PARAMS_CONTAINS:T,CLASS_REFERENCE:O},illegal:/#(?![$_A-Za-z])/,contains:[e.SHEBANG({label:"shebang",binary:"node",relevance:5}),q,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,f,g,b,_,A,{match:/\$\d+/},d,O,{scope:"attr",match:r+n.lookahead(":"),relevance:0},be,{begin:"("+e.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",keywords:"return throw case",relevance:0,contains:[A,e.REGEXP_MODE,{className:"function",begin:we,returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{begin:e.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0},{begin:/(\s*)\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:a,contains:T}]}]},{begin:/,/,relevance:0},{match:/\s+/,relevance:0},{variants:[{begin:s.begin,end:s.end},{match:o},{begin:i.begin,"on:begin":i.isTrulyOpeningTag,end:i.end}],subLanguage:"xml",contains:[{begin:i.begin,end:i.end,skip:!0,contains:["self"]}]}]},X,{beginKeywords:"while if switch catch for"},{begin:"\\b(?!function)"+e.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",returnBegin:!0,label:"func.def",contains:[C,e.inherit(e.TITLE_MODE,{begin:r,className:"title.function"})]},{match:/\.\.\./,relevance:0},ce,{match:"\\$"+r,relevance:0},{match:[/\bconstructor(?=\s*\()/],className:{1:"title.function"},contains:[C]},M,ee,k,Ce,{match:/\$[(.]/}]}}Vn.registerLanguage("go",up);Vn.registerLanguage("bash",Ql);Vn.registerLanguage("shell",Ql);Vn.registerLanguage("sql",dp);Vn.registerLanguage("yaml",fp);Vn.registerLanguage("json",pp);Vn.registerLanguage("javascript",Vl);Vn.registerLanguage("js",Vl);const ss=new ip({html:!1,linkify:!0,breaks:!1});ss.renderer.rules.fence=(e,n)=>{const t=e[n],s=(t.info||"").trim().split(/\s+/)[0]||"text";let o=ss.utils.escapeHtml(t.content);if(Vn.getLanguage(s))try{o=Vn.highlight(t.content,{language:s,ignoreIllegals:!0}).value}catch{}return`<div class="code-wrap"><div class="code-head"><span class="code-lang">${s==="text"?"code":s}</span><button class="copy-btn" type="button" aria-label="复制代码">复制</button></div><pre class="hljs"><code class="language-${s}">${o}</code></pre></div>`};function bp(e){return ss.render(e)}function xp(e){return ss.renderInline(e)}function wn(e){return e.replace(/```[\s\S]*?```/g," ").replace(/`([^`]*)`/g,"$1").replace(/\*\*([^*]*)\*\*/g,"$1").replace(/^#{1,6}\s*/gm,"").replace(/^[-*+]\s+/gm,"").replace(/^\d+\.\s+/gm,"").replace(/\|/g," ").replace(/\s+/g," ").trim()}function tt(e,n,t,r){r.split(`
`).forEach(s=>{const o=wn(s);o.length<2||/^[:\-\s|]+$/.test(o)||e.push({href:n,section:t,text:o})})}function _p(){const e=[];return tt(e,"#/home/goal","最终目标",he.goalMd),tt(e,"#/home/goal","前置说明",he.prefaceMd),tt(e,"#/home/goal","Redis 定位",he.redisMd),tt(e,"#/home/overview","阶段总览",he.overviewMd),tt(e,"#/home/pacing","每日节奏",he.pacingMd),he.phases.forEach(n=>{n.days.forEach(t=>{const r=`#/day/${n.id}/${t.day}`,s=`阶段 ${n.id} · D${t.day}`;e.push({href:r,section:`${s} · 第 ${t.day} 天`,text:wn(t.title)}),t.tasks.forEach(o=>{e.push({href:r,section:`${s} 任务`,text:wn(o)})}),t.deliver&&e.push({href:r,section:`${s} 交付`,text:wn(t.deliver)}),t.pitfall&&e.push({href:r,section:`${s} 卡点`,text:wn(t.pitfall)}),t.lesson&&(tt(e,r,`${s} 讲解`,t.lesson.body),t.lesson.quiz.forEach(o=>{e.push({href:r,section:`${s} 自测`,text:wn(o.q)})})),t.mastery&&(t.mastery.predict.forEach(o=>{e.push({href:r,section:`${s} 预测`,text:wn(o.ask)})}),t.mastery.debug.forEach(o=>{e.push({href:r,section:`${s} 排错`,text:wn(o.symptom)})}),t.mastery.transfer.forEach(o=>{e.push({href:r,section:`${s} 迁移`,text:wn(o.scene)})}),t.mastery.criteria.forEach(o=>{e.push({href:r,section:`${s} 判据`,text:wn(o)})}))}),tt(e,`#/phase/${n.id}`,`阶段 ${n.id} · ${n.name}`,n.md),n.checklist.forEach(t=>{e.push({href:`#/phase/${n.id}`,section:`阶段 ${n.id} · 验收`,text:wn(t)})})}),tt(e,"#/timeline","时间线",he.timelineMd),tt(e,"#/reminders","贯穿全程的提醒",he.remindersMd),e}function en(e){switch(e.name){case"home":return e.anchor?`#/home/${e.anchor}`:"#/";case"phase":return`#/phase/${e.phase}`;case"day":return`#/day/${e.phase}/${e.day}`;case"timeline":return"#/timeline";case"reminders":return"#/reminders"}}function Yl(e){const n=e.replace(/^#\/?/,"").replace(/\/+$/,"");if(!n)return{name:"home"};const[t,r,s]=n.split("/");return t==="home"?{name:"home",anchor:r||void 0}:t==="phase"?{name:"phase",phase:Number(r)||1}:t==="day"?{name:"day",phase:Number(r)||1,day:Number(s)||1}:t==="timeline"?{name:"timeline"}:t==="reminders"?{name:"reminders"}:{name:"home"}}const Pe=$n(typeof location>"u"?{name:"home"}:Yl(location.hash));let Xi=!1;function Cp(){Xi||typeof window>"u"||(Xi=!0,window.addEventListener("hashchange",()=>{Pe.value=Yl(location.hash)}))}function Zi(e){const n=en(e);if(location.hash===n){Pe.value={...e};return}location.hash=n}const vp={class:"toc"},kp=["href"],Rp={class:"today-nav-text"},wp={class:"today-nav-progress"},Tp={key:1,class:"today-nav alldone"},Dp={class:"today-nav-text"},Ap=["href"],Np=["href"],Op=["href"],Lp=["aria-expanded","aria-label","onClick"],Ip=["href"],Mp={class:"toc-phase-name"},Pp={class:"toc-phase-progress"},Fp=["href","data-day","title"],Bp={class:"td-no"},qp={class:"td-title"},Up={key:0,class:"td-next"},Wp=["href"],Hp=["href"],Gp=Ln({__name:"Sidebar",setup(e){var A;const{phaseProgress:n,nextDay:t,doneDays:r,totalDays:s,dayDone:o,dayProgress:i}=Gt(),a=Ht(new Set([((A=t.value)==null?void 0:A.phaseId)??he.phases[0].id]));jn(()=>Pe.value,x=>{if(x.name!=="day"&&x.name!=="phase")return;const S=x.phase;a.has(S)||(a.clear(),a.add(S))},{immediate:!0});const l=(x,S)=>Pe.value.name==="day"&&Pe.value.phase===x&&Pe.value.day===S,c=x=>Pe.value.name==="phase"&&Pe.value.phase===x||Pe.value.name==="day"&&Pe.value.phase===x,u=x=>Pe.value.name!=="home"?!1:(Pe.value.anchor??"goal")===x,d=(x,S)=>{var T,C;return((T=t.value)==null?void 0:T.phaseId)===x&&((C=t.value)==null?void 0:C.day)===S},m=_e(()=>{const x=t.value;return x?en({name:"day",phase:x.phaseId,day:x.day}):null}),f=new Map;function g(x,S){S?f.set(x,S):f.delete(x)}function b(x,S){const T=f.get(x);if(!T)return;const C=T.querySelector(`[data-day="${S}"]`);if(!C)return;const k=C.getBoundingClientRect().top-T.getBoundingClientRect().top+T.scrollTop;(k<T.scrollTop||k+C.offsetHeight>T.scrollTop+T.clientHeight)&&(T.scrollTop=Math.max(0,k-T.clientHeight/2+C.offsetHeight/2))}jn(()=>Pe.value,x=>{x.name==="day"&&ir(()=>b(x.phase,x.day))},{immediate:!0});function _(x){a.has(x)?a.delete(x):(a.clear(),a.add(x))}function w(x,S){return o(x,S)?"done":i(x,S).done>0?"partial":"todo"}return(x,S)=>{var T,C;return B(),$("nav",vp,[m.value?(B(),$("a",{key:0,class:"today-nav",href:m.value},[S[0]||(S[0]=p("span",{class:"today-nav-label"},"今天",-1)),p("span",Rp," 阶段 "+R((T=F(t))==null?void 0:T.phaseId)+" · 第 "+R((C=F(t))==null?void 0:C.day)+" 天 ",1),p("span",wp,R(F(r))+"/"+R(F(s)),1)],8,kp)):(B(),$("div",Tp,[S[1]||(S[1]=p("span",{class:"today-nav-label"},"全部完成 🎉",-1)),p("span",Dp,R(F(s))+" 天都掌握了",1)])),S[2]||(S[2]=p("div",{class:"toc-title"},"目录",-1)),p("a",{class:Ie(["toc-item",{on:u("goal")}]),href:F(en)({name:"home",anchor:"goal"})}," 最终目标 ",10,Ap),p("a",{class:Ie(["toc-item",{on:u("overview")}]),href:F(en)({name:"home",anchor:"overview"})}," 阶段总览 ",10,Np),p("a",{class:Ie(["toc-item",{on:u("pacing")}]),href:F(en)({name:"home",anchor:"pacing"})}," 每日节奏 ",10,Op),S[3]||(S[3]=p("div",{class:"toc-group"},"阶段 · 按天导航",-1)),(B(!0),$(Ae,null,pn(F(he).phases,k=>(B(),$("div",{key:k.id,class:"toc-phase-wrap"},[p("div",{class:Ie(["toc-phase-row",{on:c(k.id)}])},[p("button",{class:"toc-caret",type:"button","aria-expanded":a.has(k.id),"aria-label":`${a.has(k.id)?"收起":"展开"}阶段 ${k.id} 的天列表`,onClick:O=>_(k.id)}," › ",8,Lp),p("a",{class:"toc-phase-main",href:F(en)({name:"phase",phase:k.id})},[p("span",Mp,R(k.id)+". "+R(k.name),1),p("span",Pp,R(F(n)(k.id).daysDone)+"/"+R(k.days.length),1)],8,Ip)],2),fs(p("ul",{ref_for:!0,ref:O=>g(k.id,O),class:"toc-days"},[(B(!0),$(Ae,null,pn(k.days,O=>(B(),$("li",{key:O.day},[p("a",{class:Ie(["toc-day",{on:l(k.id,O.day),done:w(k.id,O.day)==="done"}]),href:F(en)({name:"day",phase:k.id,day:O.day}),"data-day":O.day,title:`第 ${O.day} 天 · ${O.title}`},[p("span",{class:Ie(["td-dot",w(k.id,O.day)])},R(w(k.id,O.day)==="done"?"✓":""),3),p("span",Bp,"D"+R(O.day),1),p("span",qp,R(O.title),1),d(k.id,O.day)?(B(),$("span",Up,"今")):ye("",!0)],10,Fp)]))),128))],512),[[ll,a.has(k.id)]])]))),128)),S[4]||(S[4]=p("div",{class:"toc-group"},"收尾",-1)),p("a",{class:Ie(["toc-item",{on:F(Pe).name==="timeline"}]),href:F(en)({name:"timeline"})}," 时间线 ",10,Wp),p("a",{class:Ie(["toc-item",{on:F(Pe).name==="reminders"}]),href:F(en)({name:"reminders"})}," 贯穿全程的提醒 ",10,Hp)])}}}),$p={class:"search"},jp={key:0,class:"search-panel"},Qp={key:0,class:"search-empty"},zp=["onMousedown"],Kp={class:"sr-section"},Jp=["innerHTML"],Vp={key:1,class:"search-hint"},Yp=Ln({__name:"SearchBox",props:{entries:{}},setup(e){const n=e,t=$n(""),r=$n(!1),s=$n(!1),o=_e(()=>{const f=t.value.trim().toLowerCase();return f.length===0?[]:n.entries.filter(g=>g.text.toLowerCase().includes(f)).slice(0,30)});function i(f){return f.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function a(f){const g=t.value.trim(),_=f.toLowerCase().indexOf(g.toLowerCase()),w=Math.max(0,_-24),A=Math.min(f.length,_+g.length+48);let x=f.slice(w,A);return w>0&&(x="…"+x),A<f.length&&(x=x+"…"),i(x).replace(new RegExp(i(g).replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),S=>`<mark>${S}</mark>`)}function l(f){r.value=!1,t.value="",location.hash===f?window.scrollTo({top:0,behavior:"smooth"}):location.hash=f}function c(){s.value=!0,t.value.trim()&&(r.value=!0)}function u(){s.value=!1,setTimeout(()=>r.value=!1,160)}function d(){r.value=t.value.trim().length>0}function m(f){f.key==="Escape"?(r.value=!1,f.target.blur()):f.key==="Enter"&&o.value.length>0&&l(o.value[0].href)}return(f,g)=>(B(),$("div",$p,[fs(p("input",{"onUpdate:modelValue":g[0]||(g[0]=b=>t.value=b),class:"search-input",type:"search",placeholder:"搜索知识点 / 命令 / 报错…",onFocus:c,onBlur:u,onInput:d,onKeydown:m},null,544),[[cl,t.value]]),r.value&&t.value.trim()?(B(),$("div",jp,[o.value.length===0?(B(),$("div",Qp,"没有匹配结果")):ye("",!0),(B(!0),$(Ae,null,pn(o.value,(b,_)=>(B(),$("button",{key:_,class:"search-result",onMousedown:Pd(w=>l(b.href),["prevent"])},[p("span",Kp,R(b.section),1),p("span",{class:"sr-text",innerHTML:a(b.text)},null,8,Jp)],40,zp))),128)),o.value.length>0?(B(),$("div",Vp," 共 "+R(o.value.length)+" 条结果 · 回车跳到第一条 ",1)):ye("",!0)])):ye("",!0)]))}}),Xp=["innerHTML"],Ge=Ln({__name:"MarkdownBlock",props:{content:{},inline:{type:Boolean}},setup(e){const n=e,t=_e(()=>n.inline?xp(n.content):bp(n.content));function r(s){var u;const i=s.target.closest(".copy-btn");if(!i)return;const a=i.closest(".code-wrap"),l=a==null?void 0:a.querySelector("code");if(!l)return;const c=l.textContent||"";(u=navigator.clipboard)==null||u.writeText(c).then(()=>{i.textContent="已复制",setTimeout(()=>i.textContent="复制",1200)}).catch(()=>{i.textContent="复制失败",setTimeout(()=>i.textContent="复制",1200)})}return(s,o)=>(B(),$("div",{class:Ie(["md",{"md-inline":e.inline}]),onClick:r,innerHTML:t.value},null,10,Xp))}}),Zp={class:"page"},em={class:"page-head"},nm={class:"today-left"},tm={class:"today-title"},rm={class:"today-sub"},sm={class:"today-title"},om={class:"today-right"},im={class:"today-stats"},am=["href"],lm={id:"goal",class:"doc-section"},cm={class:"callout"},um={class:"callout amber"},dm={id:"overview",class:"doc-section"},fm={class:"phase-grid"},hm=["href"],gm={class:"pc-top"},pm={class:"pc-no"},mm={class:"pc-days"},Em={class:"pc-name"},ym={class:"pc-core"},Sm={class:"pc-accept"},bm={class:"pc-bar"},xm={class:"pc-foot"},_m={class:"kpt kpt-overview"},Cm={id:"pacing",class:"doc-section"},vm={class:"foot"},km=Ln({__name:"HomeView",setup(e){const{doneDays:n,totalDays:t,doneCriteria:r,totalCriteria:s,percent:o,nextDay:i,phaseProgress:a}=Gt(),l=(c,u)=>en({name:"day",phase:c,day:u});return(c,u)=>(B(),$("div",Zp,[p("header",em,[p("h1",null,R(F(he).title),1),p("p",null,R(F(he).subtitle),1)]),p("section",{class:Ie(["today",{alldone:!F(i)}])},[p("div",nm,[u[2]||(u[2]=p("div",{class:"today-kicker"},"今天从这里开始",-1)),F(i)?(B(),$(Ae,{key:0},[p("div",tm,[xn(" 阶段 "+R(F(i).phaseId)+" · 第 "+R(F(i).day)+" 天 ",1),u[0]||(u[0]=p("span",{class:"today-sep"},"/",-1)),xn(" "+R(F(i).title),1)]),p("div",rm," 七步走完这一天：读前预测 "+R(F(i).predict)+" 题 → 读 "+R(F(i).readMin)+" 分钟讲解 → 自测 "+R(F(i).quiz)+" 题 → 排错 "+R(F(i).debug)+" 题 → 迁移 "+R(F(i).transfer)+" 题 → 勾满判据 → 做 "+R(F(i).hours)+" 小时任务 ",1)],64)):(B(),$(Ae,{key:1},[p("div",sm,"全部 "+R(F(t))+" 天已完成 🎉",1),u[1]||(u[1]=p("div",{class:"today-sub"},"回到时间线复盘，或直接进入项目迭代。",-1))],64))]),p("div",om,[p("div",im,[p("span",null,[p("b",null,R(F(n)),1),xn("/"+R(F(t))+" 天掌握",1)]),p("span",null,[p("b",null,R(F(r)),1),xn("/"+R(F(s))+" 条判据",1)])]),F(i)?(B(),$("a",{key:0,class:"today-btn",href:l(F(i).phaseId,F(i).day)}," 进入第 "+R(F(i).day)+" 天 → ",9,am)):ye("",!0)])],2),p("section",lm,[u[3]||(u[3]=p("div",{class:"sec-kicker"},"🎯 最终目标",-1)),me(Ge,{content:F(he).goalMd},null,8,["content"]),p("div",cm,[me(Ge,{content:F(he).prefaceMd},null,8,["content"])]),p("div",um,[me(Ge,{content:F(he).redisMd},null,8,["content"])])]),p("section",dm,[u[5]||(u[5]=p("h2",{class:"sec-title"},"🗺️ 阶段总览",-1)),u[6]||(u[6]=p("p",{class:"sec-sub"},"六个阶段、94 天，点任一阶段进入它的逐日清单。",-1)),p("div",fm,[(B(!0),$(Ae,null,pn(F(he).phases,d=>(B(),$("a",{key:d.id,class:"phase-card",href:F(en)({name:"phase",phase:d.id})},[p("div",gm,[p("span",pm,"阶段 "+R(d.id),1),p("span",mm,R(d.days.length)+" 天",1)]),p("div",Em,R(d.name),1),p("div",ym,R(d.core),1),p("div",Sm,"验收："+R(d.acceptance),1),p("div",bm,[p("div",{class:"pc-fill",style:Wt({width:F(a)(d.id).daysDone/d.days.length*100+"%"})},null,4)]),p("div",xm,[p("span",null,R(F(a)(d.id).daysDone)+"/"+R(d.days.length)+" 天掌握",1),p("span",null,R(d.weeks),1)])],8,hm))),128))]),p("details",_m,[u[4]||(u[4]=p("summary",null,"📋 阶段总览速查表（原文）",-1)),me(Ge,{content:F(he).overviewMd},null,8,["content"])])]),p("section",Cm,[u[7]||(u[7]=p("h2",{class:"sec-title"},"⏱️ 每日节奏与拆分口径",-1)),u[8]||(u[8]=p("p",{class:"sec-sub"},"94 天是怎么来的，以及落后了怎么调整。",-1)),me(Ge,{content:F(he).pacingMd},null,8,["content"])]),p("footer",vm," 家庭账本学习路线 · 94 天逐日计划 · 当前总进度 "+R(F(o))+"% · 勾选仅保存在本机浏览器 ",1)]))}}),Rm={class:"checklist"},wm=["onClick"],Tm={class:"ck-box"},Dm={class:"ck-text"},Am=Ln({__name:"Checklist",props:{phaseId:{},items:{}},setup(e){const{isAcceptDone:n,toggleAccept:t}=Gt();return(r,s)=>(B(),$("ul",Rm,[(B(!0),$(Ae,null,pn(e.items,(o,i)=>(B(),$("li",{key:i,class:Ie({done:F(n)(e.phaseId,i)}),onClick:a=>F(t)(e.phaseId,i)},[p("span",Tm,R(F(n)(e.phaseId,i)?"✓":""),1),p("div",Dm,[me(Ge,{content:o,inline:""},null,8,["content"])])],10,wm))),128))]))}}),Nm={key:0,class:"page"},Om={class:"crumbs"},Lm={class:"phase-hero"},Im={class:"ph-top"},Mm={class:"ph-no"},Pm={class:"ph-weeks"},Fm={class:"ph-name"},Bm={class:"ph-core"},qm={class:"ph-accept"},Um={class:"ph-progress"},Wm={class:"ph-track"},Hm={class:"ph-pct"},Gm={class:"ph-days"},$m=["href"],jm={class:"pd-check","aria-hidden":"true"},Qm={class:"pd-no"},zm={class:"pd-main"},Km={class:"pd-title"},Jm={key:1,class:"depth-chip"},Vm={key:2,class:"depth-chip depth-light"},Ym={class:"pd-sub"},Xm={key:0,class:"pd-next"},Zm={class:"kpt"},e0={class:"accept-block"},n0={class:"accept-title"},t0={class:"accept-count"},r0={class:"pn-nav"},s0=["href"],o0={class:"pn-name"},i0={key:1,class:"pn-link disabled"},a0=["href"],l0={class:"pn-name"},c0={key:3,class:"pn-link right disabled"},u0=Ln({__name:"PhaseView",props:{phaseId:{}},setup(e){const n=e,t=_e(()=>Ss(n.phaseId)),{dayDone:r,dayProgress:s,critProgress:o,isAcceptDone:i}=Gt(),a=_e(()=>he.phases.findIndex(g=>g.id===n.phaseId)),l=_e(()=>he.phases[a.value-1]??null),c=_e(()=>he.phases[a.value+1]??null),u=_e(()=>t.value?t.value.days.filter(g=>r(n.phaseId,g.day)).length:0),d=_e(()=>t.value&&t.value.days.length?Math.round(u.value/t.value.days.length*100):0),m=_e(()=>{var g,b;return((b=(g=t.value)==null?void 0:g.days.find(_=>!r(n.phaseId,_.day)))==null?void 0:b.day)??-1});function f(){const g=t.value;return g?g.checklist.every((b,_)=>i(g.id,_)):!1}return(g,b)=>t.value?(B(),$("div",Nm,[p("nav",Om,[b[0]||(b[0]=p("a",{href:"#/"},"学习路线",-1)),b[1]||(b[1]=p("span",{class:"crumb-sep"},"›",-1)),p("span",null,"阶段 "+R(t.value.id),1)]),p("header",Lm,[p("div",Im,[p("span",Mm,"阶段 "+R(t.value.id),1),p("span",Pm,R(t.value.weeks)+" · "+R(t.value.days.length)+" 天",1)]),p("h1",Fm,R(t.value.name),1),p("p",Bm,R(t.value.core),1),p("p",qm,[b[2]||(b[2]=p("b",null,"阶段验收",-1)),xn("："+R(t.value.acceptance),1)]),p("div",Um,[p("div",Wm,[p("div",{class:"ph-fill",style:Wt({width:d.value+"%"})},null,4)]),p("span",Hm,R(u.value)+"/"+R(t.value.days.length)+" 天 · "+R(d.value)+"%",1)])]),p("section",Gm,[b[4]||(b[4]=p("div",{class:"ph-days-head"},[p("h2",null,"📅 逐日清单"),p("p",null,"每天一个知识点、一套完整教学流程。点进去就是当天的学习页。")],-1)),(B(!0),$(Ae,null,pn(t.value.days,_=>{var w,A;return B(),$("a",{key:_.day,class:Ie(["pd-row",{done:F(r)(t.value.id,_.day),next:_.day===m.value}]),href:F(en)({name:"day",phase:t.value.id,day:_.day})},[p("span",jm,R(F(r)(t.value.id,_.day)?"✓":""),1),p("span",Qm,"D"+R(_.day),1),p("span",zm,[p("span",Km,[xn(R(_.title)+" ",1),_.tag?(B(),$("span",{key:0,class:Ie(["day-tag",`tag-${_.tag}`])},R(_.tag),3)):ye("",!0),((w=_.lesson)==null?void 0:w.depth)==="core"?(B(),$("span",Jm,"硬骨头")):((A=_.lesson)==null?void 0:A.depth)==="light"?(B(),$("span",Vm,"速通")):ye("",!0)]),p("span",Ym,[xn(" 判据 "+R(F(o)(t.value.id,_.day).done)+"/"+R(F(o)(t.value.id,_.day).total)+" · 任务 "+R(F(s)(t.value.id,_.day).done)+"/"+R(F(s)(t.value.id,_.day).total)+" · 约 "+R(_.hours)+" 小时 ",1),_.lesson?(B(),$(Ae,{key:0},[xn(" · 读 "+R(_.lesson.readMin)+" 分钟",1)],64)):ye("",!0)])]),_.day===m.value?(B(),$("span",Xm,"下一站")):ye("",!0),b[3]||(b[3]=p("span",{class:"pd-go"},"→",-1))],10,$m)}),128))]),p("details",Zm,[b[5]||(b[5]=p("summary",null,"📖 阶段知识点速查（中途忘了回来翻，不用从头读）",-1)),me(Ge,{content:t.value.md},null,8,["content"])]),p("section",e0,[p("div",n0,[b[6]||(b[6]=xn(" ✅ 阶段验收 ",-1)),p("span",t0,R(f()?"已通过":"离开这一阶段前必须过"),1)]),me(Am,{"phase-id":t.value.id,items:t.value.checklist},null,8,["phase-id","items"])]),p("nav",r0,[l.value?(B(),$("a",{key:0,class:"pn-link",href:F(en)({name:"phase",phase:l.value.id})},[b[7]||(b[7]=p("span",{class:"pn-dir"},"← 上一阶段",-1)),p("span",o0,R(l.value.id)+". "+R(l.value.name),1)],8,s0)):(B(),$("span",i0,[...b[8]||(b[8]=[p("span",{class:"pn-dir"},"← 上一阶段",-1),p("span",{class:"pn-name"},"已是第一个阶段",-1)])])),c.value?(B(),$("a",{key:2,class:"pn-link right",href:F(en)({name:"phase",phase:c.value.id})},[b[9]||(b[9]=p("span",{class:"pn-dir"},"下一阶段 →",-1)),p("span",l0,R(c.value.id)+". "+R(c.value.name),1)],8,a0)):(B(),$("span",c0,[...b[10]||(b[10]=[p("span",{class:"pn-dir"},"下一阶段 →",-1),p("span",{class:"pn-name"},"已是最后一个阶段",-1)])]))])])):ye("",!0)}}),d0={key:0,class:"quiz"},f0={class:"quiz-list"},h0=["id"],g0={class:"quiz-q"},p0=["onClick"],m0={class:"quiz-a"},E0=Ln({__name:"QuizBlock",props:{items:{},idPrefix:{}},setup(e){const n=e,t=Ht(new Set);function r(i){t.has(i)?t.delete(i):t.add(i)}function s(){n.items.forEach((i,a)=>t.add(a))}function o(){t.clear()}return(i,a)=>e.items.length?(B(),$("div",d0,[p("div",{class:"quiz-head"},[a[0]||(a[0]=p("span",{class:"quiz-title"},"自测：先自己答，再点开对",-1)),p("span",{class:"quiz-actions"},[p("button",{class:"mini-btn",type:"button",onClick:s},"全部答案"),p("button",{class:"mini-btn",type:"button",onClick:o},"收起")])]),a[1]||(a[1]=p("p",{class:"quiz-hint"}," 读一遍不算学会。先在心里（或纸上）答出来再点开——答不出说明这一段还得重读，不要直接翻答案。 ",-1)),p("ol",f0,[(B(!0),$(Ae,null,pn(e.items,(l,c)=>(B(),$("li",{key:c,id:`${e.idPrefix}-q${c}`,class:"quiz-item"},[p("div",g0,[me(Ge,{content:l.q,inline:""},null,8,["content"])]),p("button",{class:"quiz-toggle",type:"button",onClick:u=>r(c)},R(t.has(c)?"收起答案":"我的答案对一下"),9,p0),fs(p("div",m0,[me(Ge,{content:l.a},null,8,["content"])],512),[[ll,t.has(c)]])],8,h0))),128))])])):ye("",!0)}}),y0=["id"],S0={class:"drill-head"},b0={class:"drill-tag"},x0={class:"drill-tip"},_0={key:0,class:"drill-symptom"},C0={class:"ds-text"},v0={key:1,class:"drill-scene"},k0={class:"ds-text"},R0={key:2,class:"drill-code"},w0={class:"drill-ask"},T0={class:"da-text"},D0={key:3,class:"drill-guess"},A0={key:0,class:"guess-ok"},N0={class:"drill-actions"},O0={key:4,class:"drill-hint"},L0={key:5,class:"drill-answer"},I0={key:0,class:"guess-compare"},M0={class:"gc-text"},Ys="family-ledger-roadmap:guesses:v1",Xs=Ln({__name:"DrillBlock",props:{kind:{},index:{},code:{},lang:{},symptom:{},scene:{},ask:{},hint:{},answer:{},idPrefix:{}},setup(e){const n=e,t=$n(!1),r=$n(!1),s={predict:{tag:"读前预测",hint:"先别往下读，写下你的答案"},debug:{tag:"排错诊断",hint:"先说清「哪里错了」，再说「怎么改」"},transfer:{tag:"迁移挑战",hint:"换了个场景，你还认得出来吗"}},o=_e(()=>s[n.kind]),i=_e(()=>`${n.idPrefix}-${n.kind}-${n.index}`),a=_e(()=>"```"+(n.lang||"text")+`
`+(n.code||"")+"\n```");function l(){try{const d=localStorage.getItem(Ys);if(d)return JSON.parse(d)[i.value]??""}catch{}return""}const c=$n(l());jn(c,d=>{try{const m=localStorage.getItem(Ys),f=m?JSON.parse(m):{};d.trim()?f[i.value]=d:delete f[i.value],localStorage.setItem(Ys,JSON.stringify(f))}catch{}});const u=_e(()=>c.value.trim().length>0);return(d,m)=>(B(),$("div",{class:Ie(["drill",`drill-${e.kind}`]),id:i.value},[p("div",S0,[p("span",b0,R(o.value.tag)+" "+R(e.index+1),1),p("span",x0,R(o.value.hint),1)]),e.symptom?(B(),$("div",_0,[m[3]||(m[3]=p("span",{class:"ds-label"},"现象",-1)),p("div",C0,[me(Ge,{content:e.symptom,inline:""},null,8,["content"])])])):ye("",!0),e.scene?(B(),$("div",v0,[m[4]||(m[4]=p("span",{class:"ds-label"},"场景",-1)),p("div",k0,[me(Ge,{content:e.scene,inline:""},null,8,["content"])])])):ye("",!0),e.code?(B(),$("div",R0,[me(Ge,{content:a.value},null,8,["content"])])):ye("",!0),p("div",w0,[m[5]||(m[5]=p("span",{class:"da-label"},"问",-1)),p("div",T0,[me(Ge,{content:e.ask,inline:""},null,8,["content"])])]),e.kind==="predict"?(B(),$("div",D0,[fs(p("input",{"onUpdate:modelValue":m[0]||(m[0]=f=>c.value=f),type:"text",class:"guess-input",placeholder:"先写下你的预测：结果是什么、为什么（会保存在本机）"},null,512),[[cl,c.value]]),u.value?(B(),$("span",A0,"已记录，读完回来对照")):ye("",!0)])):ye("",!0),p("div",N0,[e.hint?(B(),$("button",{key:0,class:"drill-btn ghost",onClick:m[1]||(m[1]=f=>r.value=!r.value)},R(r.value?"收起提示":"卡住了？看提示"),1)):ye("",!0),p("button",{class:Ie(["drill-btn",{"need-guess":e.kind==="predict"&&!u.value}]),onClick:m[2]||(m[2]=f=>t.value=!t.value)},R(t.value?"收起答案":e.kind==="predict"?u.value?"对答案":"还没写预测，仍要看答案":"我先答过了，对答案"),3)]),e.hint&&r.value?(B(),$("div",O0,[m[6]||(m[6]=p("span",{class:"dh-label"},"提示（不是答案）",-1)),me(Ge,{content:e.hint},null,8,["content"])])):ye("",!0),t.value?(B(),$("div",L0,[u.value?(B(),$("div",I0,[m[7]||(m[7]=p("span",{class:"gc-label"},"你写的",-1)),p("span",M0,R(c.value),1)])):ye("",!0),m[8]||(m[8]=p("div",{class:"dan-label"},"答案与理由",-1)),me(Ge,{content:e.answer},null,8,["content"])])):ye("",!0)],10,y0))}}),P0={key:0,class:"page daypage"},F0={class:"crumbs"},B0=["href"],q0={class:"dp-hero"},U0={class:"dp-headrow"},W0={class:"dp-badge"},H0={class:"dp-headmain"},G0={class:"dp-title"},$0={key:1,class:"depth-chip"},j0={key:2,class:"depth-chip depth-light"},Q0={class:"dp-meta"},z0={key:0},K0={class:"dp-steps","aria-label":"当天教学步骤"},J0=["onClick"],V0={class:"ds-no"},Y0={class:"ds-body"},X0={class:"ds-name"},Z0={key:0,class:"ds-meta"},eE={key:0,id:"s-predict",class:"dp-sec"},nE={key:0,class:"prereq"},tE={class:"prereq-text"},rE={key:1,id:"s-lesson",class:"dp-sec"},sE={class:"dp-sec-head"},oE={class:"dsh-meta"},iE={class:"lesson-body"},aE={key:2,id:"s-quiz",class:"dp-sec"},lE={key:3,id:"s-debug",class:"dp-sec"},cE={key:4,id:"s-transfer",class:"dp-sec"},uE={key:5,id:"s-criteria",class:"dp-sec dp-sec-crit"},dE={class:"dp-sec-head"},fE={class:"dcrit"},hE=["onClick"],gE={class:"dc-box"},pE={class:"dc-text"},mE={id:"s-tasks",class:"dp-sec"},EE={class:"dp-sec-head"},yE={class:"dtasks"},SE=["onClick"],bE={class:"dt-box"},xE={class:"dt-text"},_E={key:0,class:"day-meta day-deliver"},CE={class:"dm-text"},vE={key:1,class:"day-meta day-pitfall"},kE={class:"dm-text"},RE={class:"dp-finish"},wE={class:"dp-finish-text"},TE={class:"pn-nav day-pn"},DE=["href"],AE={class:"pn-name"},NE={key:1,class:"pn-link disabled"},OE=["href"],LE={class:"pn-dir"},IE={class:"pn-name"},ME=["href"],PE={class:"pn-name"},FE={key:3,class:"pn-link right disabled"},BE={key:1,class:"page"},qE=Ln({__name:"DayView",props:{phaseId:{},day:{}},setup(e){const n=e,t=_e(()=>Ss(n.phaseId)),r=_e(()=>{var j;return(j=t.value)==null?void 0:j.days.find(M=>M.day===n.day)}),s=_e(()=>`p${n.phaseId}-d${n.day}`),{dayDone:o,dayProgress:i,critProgress:a,toggleDay:l,isTaskDone:c,toggleTask:u,isCritDone:d,toggleCrit:m}=Gt(),f=_e(()=>vi(n.phaseId,n.day,-1)),g=_e(()=>vi(n.phaseId,n.day,1)),b=_e(()=>hl(n.phaseId,n.day)+1),_=_e(()=>a(n.phaseId,n.day)),w=_e(()=>i(n.phaseId,n.day)),A=["①","②","③","④","⑤","⑥","⑦","⑧"],x=_e(()=>{var Ce,we,be,oe,Ue;const j=r.value;if(!j)return[];const M=[],ce=(Ke,We,He,En="")=>M.push({key:Ke,name:We,hint:He,meta:En});return(Ce=j.mastery)!=null&&Ce.predict.length&&ce("predict","学前自检","先确认地基，再带着问题往下读",`${j.mastery.predict.length} 道预测`),j.lesson&&ce("lesson","机制讲解","带着刚才的冲突读，重点看「为什么」",`约 ${j.lesson.readMin} 分钟`),(we=j.lesson)!=null&&we.quiz.length&&ce("quiz","主动回忆","合上答案，先自己复述一遍",`${j.lesson.quiz.length} 题`),(be=j.mastery)!=null&&be.debug.length&&ce("debug","排错诊断","会写不等于会修：先定位病灶，再谈改法",`${j.mastery.debug.length} 题`),(oe=j.mastery)!=null&&oe.transfer.length&&ce("transfer","迁移挑战","换个没讲过的场景，检验是不是真会",`${j.mastery.transfer.length} 题`),(Ue=j.mastery)!=null&&Ue.criteria.length&&ce("criteria","掌握判据","每条都要能自己动手验证，勾不上就是没学会",`${_.value.done}/${_.value.total}`),ce("tasks","动手任务","判据答得出，再动手；全部勾完才收工",`${w.value.done}/${w.value.total}`),M.map((Ke,We)=>({...Ke,no:A[We]??`${We+1}`}))}),S=$n("");let T=!1,C=150;function k(){T=!1;const j=x.value.map(ce=>`s-${ce.key}`);if(!j.length)return;let M=j[0];for(const ce of j){const Ce=document.getElementById(ce);if(Ce)if(Ce.getBoundingClientRect().top<=C)M=ce;else break}S.value=M.replace(/^s-/,"")}function O(){T||(T=!0,requestAnimationFrame(k))}function q(){const j=document.querySelector(".dp-steps"),M=(j==null?void 0:j.getBoundingClientRect().height)??44;C=parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--topbar-h")||"51")+M+26}function X(j){const M=document.getElementById(`s-${j}`);if(!M)return;const ce=C-20,Ce=M.getBoundingClientRect().top+window.scrollY-ce;window.scrollTo({top:Ce,behavior:"smooth"}),S.value=j}jn(()=>[n.phaseId,n.day],()=>ir(()=>{q(),k()}));function ee(j){const M=j.target;M&&/^(INPUT|TEXTAREA|SELECT)$/.test(M.tagName)||j.metaKey||j.ctrlKey||j.altKey||(j.key==="ArrowLeft"&&f.value?Zi({name:"day",phase:f.value.phaseId,day:f.value.day}):j.key==="ArrowRight"&&g.value&&Zi({name:"day",phase:g.value.phaseId,day:g.value.day}))}return To(()=>{window.addEventListener("scroll",O,{passive:!0}),window.addEventListener("resize",O,{passive:!0}),window.addEventListener("keydown",ee),ir(()=>{q(),k()})}),ps(()=>{window.removeEventListener("scroll",O),window.removeEventListener("resize",O),window.removeEventListener("keydown",ee)}),(j,M)=>{var ce,Ce,we,be,oe,Ue,Ke,We,He,En;return r.value?(B(),$("div",P0,[p("nav",F0,[M[2]||(M[2]=p("a",{href:"#/"},"学习路线",-1)),M[3]||(M[3]=p("span",{class:"crumb-sep"},"›",-1)),p("a",{href:F(en)({name:"phase",phase:e.phaseId})},"阶段 "+R(e.phaseId)+" · "+R((ce=t.value)==null?void 0:ce.name),9,B0),M[4]||(M[4]=p("span",{class:"crumb-sep"},"›",-1)),p("span",null,"第 "+R(e.day)+" 天",1)]),p("header",q0,[p("div",U0,[p("span",W0,"D"+R(e.day),1),p("div",H0,[p("h1",G0,[xn(R(r.value.title)+" ",1),r.value.tag?(B(),$("span",{key:0,class:Ie(["day-tag",`tag-${r.value.tag}`])},R(r.value.tag),3)):ye("",!0),((Ce=r.value.lesson)==null?void 0:Ce.depth)==="core"?(B(),$("span",$0,"硬骨头")):((we=r.value.lesson)==null?void 0:we.depth)==="light"?(B(),$("span",j0,"速通")):ye("",!0)]),p("div",Q0,[p("span",null,"全路线第 "+R(b.value)+"/"+R(F(Af))+" 天",1),r.value.lesson?(B(),$("span",z0,"讲解 "+R(r.value.lesson.chars)+" 字 · 约 "+R(r.value.lesson.readMin)+" 分钟",1)):ye("",!0),p("span",null,"判据 "+R(_.value.done)+"/"+R(_.value.total),1),p("span",null,"任务 "+R(w.value.done)+"/"+R(w.value.total),1),p("span",null,"约 "+R(r.value.hours)+" 小时",1)])]),p("button",{class:Ie(["dp-donebtn",{on:F(o)(e.phaseId,e.day)}]),type:"button",onClick:M[0]||(M[0]=ge=>F(l)(e.phaseId,e.day))},R(F(o)(e.phaseId,e.day)?"✓ 今天已掌握":"标记今天已掌握"),3)]),M[5]||(M[5]=p("p",{class:"dp-lead"}," 今天的顺序是固定的：先猜再读，读完自己复述，然后修坏代码、换场景、勾判据，最后才动手。 跳步的话，读得懂≠写得出。 ",-1))]),p("nav",K0,[(B(!0),$(Ae,null,pn(x.value,ge=>(B(),$("button",{key:ge.key,type:"button",class:Ie(["dp-step",{on:S.value===ge.key}]),onClick:Fe=>X(ge.key)},[p("span",V0,R(ge.no),1),p("span",Y0,[p("span",X0,R(ge.name),1),ge.meta?(B(),$("span",Z0,R(ge.meta),1)):ye("",!0)])],10,J0))),128))]),x.value.some(ge=>ge.key==="predict")?(B(),$("section",eE,[M[7]||(M[7]=Lr('<div class="dp-sec-head" data-v-2ee3e0da><span class="dsh-no" data-v-2ee3e0da>①</span><div class="dsh-main" data-v-2ee3e0da><h2 class="dsh-title" data-v-2ee3e0da>学前自检</h2><p class="dsh-hint" data-v-2ee3e0da>先确认地基，再带着问题读；预测写在本机，读完回来对。</p></div></div>',1)),(be=r.value.mastery)!=null&&be.prereq?(B(),$("div",nE,[M[6]||(M[6]=p("span",{class:"prereq-label"},"前置",-1)),p("div",tE,[me(Ge,{content:r.value.mastery.prereq,inline:""},null,8,["content"])])])):ye("",!0),(B(!0),$(Ae,null,pn(((oe=r.value.mastery)==null?void 0:oe.predict)??[],(ge,Fe)=>(B(),at(Xs,{key:`p${Fe}`,kind:"predict",index:Fe,code:ge.code,lang:ge.lang,ask:ge.ask,answer:ge.answer,"id-prefix":s.value},null,8,["index","code","lang","ask","answer","id-prefix"]))),128))])):ye("",!0),r.value.lesson?(B(),$("section",rE,[p("div",sE,[M[8]||(M[8]=p("span",{class:"dsh-no"},"②",-1)),M[9]||(M[9]=p("div",{class:"dsh-main"},[p("h2",{class:"dsh-title"},"机制讲解"),p("p",{class:"dsh-hint"}," 读完要能回答「它为什么这样设计」。没读懂就往上翻，别硬往下走。 ")],-1)),p("span",oE,R(r.value.lesson.chars)+" 字 · 代码 "+R(r.value.lesson.codeLines)+" 行 · 约 "+R(r.value.lesson.readMin)+" 分钟 ",1)]),p("div",iE,[me(Ge,{content:r.value.lesson.body},null,8,["content"])])])):ye("",!0),(Ue=r.value.lesson)!=null&&Ue.quiz.length?(B(),$("section",aE,[M[10]||(M[10]=Lr('<div class="dp-sec-head" data-v-2ee3e0da><span class="dsh-no" data-v-2ee3e0da>③</span><div class="dsh-main" data-v-2ee3e0da><h2 class="dsh-title" data-v-2ee3e0da>主动回忆</h2><p class="dsh-hint" data-v-2ee3e0da>合上答案，先在心里（或纸上）说一遍，再点开对。</p></div></div>',1)),me(E0,{items:r.value.lesson.quiz,"id-prefix":s.value},null,8,["items","id-prefix"])])):ye("",!0),(Ke=r.value.mastery)!=null&&Ke.debug.length?(B(),$("section",lE,[M[11]||(M[11]=Lr('<div class="dp-sec-head" data-v-2ee3e0da><span class="dsh-no" data-v-2ee3e0da>④</span><div class="dsh-main" data-v-2ee3e0da><h2 class="dsh-title" data-v-2ee3e0da>排错诊断</h2><p class="dsh-hint" data-v-2ee3e0da>会写不等于会修：先说清「哪里错了」，再说「怎么改」。</p></div></div>',1)),(B(!0),$(Ae,null,pn(r.value.mastery.debug,(ge,Fe)=>(B(),at(Xs,{key:`d${Fe}`,kind:"debug",index:Fe,code:ge.code,lang:ge.lang,symptom:ge.symptom,ask:ge.ask,answer:ge.answer,"id-prefix":s.value},null,8,["index","code","lang","symptom","ask","answer","id-prefix"]))),128))])):ye("",!0),(We=r.value.mastery)!=null&&We.transfer.length?(B(),$("section",cE,[M[12]||(M[12]=Lr('<div class="dp-sec-head" data-v-2ee3e0da><span class="dsh-no" data-v-2ee3e0da>⑤</span><div class="dsh-main" data-v-2ee3e0da><h2 class="dsh-title" data-v-2ee3e0da>迁移挑战</h2><p class="dsh-hint" data-v-2ee3e0da>换一个没讲过的场景还能解，才叫掌握。</p></div></div>',1)),(B(!0),$(Ae,null,pn(r.value.mastery.transfer,(ge,Fe)=>(B(),at(Xs,{key:`t${Fe}`,kind:"transfer",index:Fe,scene:ge.scene,ask:ge.ask,hint:ge.hint,answer:ge.answer,"id-prefix":s.value},null,8,["index","scene","ask","hint","answer","id-prefix"]))),128))])):ye("",!0),(He=r.value.mastery)!=null&&He.criteria.length?(B(),$("section",uE,[p("div",dE,[M[13]||(M[13]=p("span",{class:"dsh-no"},"⑥",-1)),M[14]||(M[14]=p("div",{class:"dsh-main"},[p("h2",{class:"dsh-title"},"掌握判据"),p("p",{class:"dsh-hint"},"勾之前先动手验证一遍；勾不上说明这天还没学会，回上一步补。")],-1)),p("span",{class:Ie(["dsh-count",{ok:_.value.total>0&&_.value.done===_.value.total}])},R(_.value.done)+"/"+R(_.value.total),3)]),p("ul",fE,[(B(!0),$(Ae,null,pn(r.value.mastery.criteria,(ge,Fe)=>(B(),$("li",{key:Fe,class:Ie({done:F(d)(e.phaseId,e.day,Fe)}),onClick:Zn=>F(m)(e.phaseId,e.day,Fe)},[p("span",gE,R(F(d)(e.phaseId,e.day,Fe)?"✓":""),1),p("div",pE,[me(Ge,{content:ge,inline:""},null,8,["content"])])],10,hE))),128))])])):ye("",!0),p("section",mE,[p("div",EE,[M[15]||(M[15]=p("span",{class:"dsh-no"},"⑦",-1)),M[16]||(M[16]=p("div",{class:"dsh-main"},[p("h2",{class:"dsh-title"},"动手任务"),p("p",{class:"dsh-hint"},"判据答得出，再动手；这里全部勾完才算收工。")],-1)),p("span",{class:Ie(["dsh-count",{ok:w.value.total>0&&w.value.done===w.value.total}])},R(w.value.done)+"/"+R(w.value.total),3)]),p("ul",yE,[(B(!0),$(Ae,null,pn(r.value.tasks,(ge,Fe)=>(B(),$("li",{key:Fe,class:Ie({done:F(c)(e.phaseId,e.day,Fe)}),onClick:Zn=>F(u)(e.phaseId,e.day,Fe)},[p("span",bE,R(F(c)(e.phaseId,e.day,Fe)?"✓":""),1),p("div",xE,[me(Ge,{content:ge,inline:""},null,8,["content"])])],10,SE))),128))]),r.value.deliver?(B(),$("div",_E,[M[17]||(M[17]=p("span",{class:"dm-label"},"交付",-1)),p("div",CE,[me(Ge,{content:r.value.deliver,inline:""},null,8,["content"])])])):ye("",!0),r.value.pitfall?(B(),$("div",vE,[M[18]||(M[18]=p("span",{class:"dm-label"},"卡点",-1)),p("div",kE,[me(Ge,{content:r.value.pitfall,inline:""},null,8,["content"])])])):ye("",!0)]),p("div",RE,[p("div",wE,[p("b",null,R(F(o)(e.phaseId,e.day)?"这一天已掌握":"还差一点"),1),p("span",null," 判据 "+R(_.value.done)+"/"+R(_.value.total)+" · 任务 "+R(w.value.done)+"/"+R(w.value.total)+"—— 两项都满了才算真做完。 ",1)]),p("button",{class:"today-btn",type:"button",onClick:M[1]||(M[1]=ge=>F(l)(e.phaseId,e.day))},R(F(o)(e.phaseId,e.day)?"取消今天已掌握":"勾满，标记今天已掌握"),1)]),p("nav",TE,[f.value?(B(),$("a",{key:0,class:"pn-link",href:F(en)({name:"day",phase:f.value.phaseId,day:f.value.day})},[M[19]||(M[19]=p("span",{class:"pn-dir"},"← 上一天",-1)),p("span",AE,"D"+R(f.value.day)+" · "+R(f.value.title),1)],8,DE)):(B(),$("span",NE,[...M[20]||(M[20]=[p("span",{class:"pn-dir"},"← 上一天",-1),p("span",{class:"pn-name"},"这是第一天",-1)])])),p("a",{class:"pn-link center",href:F(en)({name:"phase",phase:e.phaseId})},[p("span",LE,"阶段 "+R(e.phaseId)+" 目录",1),p("span",IE,R((En=t.value)==null?void 0:En.name),1)],8,OE),g.value?(B(),$("a",{key:2,class:"pn-link right",href:F(en)({name:"day",phase:g.value.phaseId,day:g.value.day})},[M[21]||(M[21]=p("span",{class:"pn-dir"},"下一天 →",-1)),p("span",PE,"D"+R(g.value.day)+" · "+R(g.value.title),1)],8,ME)):(B(),$("span",FE,[...M[22]||(M[22]=[p("span",{class:"pn-dir"},"下一天 →",-1),p("span",{class:"pn-name"},"94 天全部结束",-1)])]))])])):(B(),$("div",BE,[...M[23]||(M[23]=[p("p",{class:"empty-page"},[xn("没有这一天。"),p("a",{href:"#/"},"回到学习路线")],-1)])]))}}}),UE=(e,n)=>{const t=e.__vccOpts||e;for(const[r,s]of n)t[r]=s;return t},WE=UE(qE,[["__scopeId","data-v-2ee3e0da"]]),HE={class:"page"},GE={class:"crumbs"},$E={class:"doc-section"},jE={class:"sec-kicker"},QE={class:"doc-h1"},zE={key:0,class:"sec-sub"},ea=Ln({__name:"DocView",props:{kicker:{},title:{},sub:{},md:{}},setup(e){return(n,t)=>(B(),$("div",HE,[p("nav",GE,[t[0]||(t[0]=p("a",{href:"#/"},"学习路线",-1)),t[1]||(t[1]=p("span",{class:"crumb-sep"},"›",-1)),p("span",null,R(e.title),1)]),p("section",$E,[p("div",jE,R(e.kicker),1),p("h1",QE,R(e.title),1),e.sub?(B(),$("p",zE,R(e.sub),1)):ye("",!0),me(Ge,{content:e.md},null,8,["content"])]),t[2]||(t[2]=p("footer",{class:"foot"},[p("a",{href:"#/"},"← 回到学习路线")],-1))]))}}),KE={class:"app"},JE={class:"top-progress"},VE=["title"],YE={class:"tp-label"},XE={class:"layout"},ZE={class:"content"},ey=Ln({__name:"App",setup(e){const{doneDays:n,totalDays:t,percent:r,reset:s}=Gt(),o=_p(),i=$n(!1),a=$n(null);let l=null;To(()=>{if(Cp(),!a.value)return;const d=()=>{var f;const m=((f=a.value)==null?void 0:f.offsetHeight)??51;document.documentElement.style.setProperty("--topbar-h",`${m}px`)};d(),l=new ResizeObserver(d),l.observe(a.value)}),ps(()=>l==null?void 0:l.disconnect()),jn(Pe,async d=>{var m;if(i.value=!1,d.name==="home"&&d.anchor){await ir();const f=document.getElementById(d.anchor);if(f){const g=f.getBoundingClientRect().top+window.scrollY-(((m=a.value)==null?void 0:m.offsetHeight)??51)-12;window.scrollTo({top:g,behavior:"smooth"})}return}window.scrollTo({top:0,behavior:"auto"})},{immediate:!0});const c=_e(()=>{const d=Pe.value;if(d.name==="day"){const m=Nf(d.phase,d.day);return m?`D${d.day} · ${m.title} — 家庭账本学习路线`:"家庭账本学习路线"}if(d.name==="phase"){const m=Ss(d.phase);return m?`阶段 ${m.id} · ${m.name} — 家庭账本学习路线`:"家庭账本学习路线"}return d.name==="timeline"?"时间线 — 家庭账本学习路线":d.name==="reminders"?"贯穿全程的提醒 — 家庭账本学习路线":`${he.title} · ${he.subtitle}`});jn(c,d=>document.title=d,{immediate:!0});function u(){if(confirm("确定清空全部学习进度（掌握判据、每日任务、验收勾选与预测草稿）吗？")){s();try{localStorage.removeItem("family-ledger-roadmap:guesses:v1")}catch{}location.reload()}}return(d,m)=>(B(),$("div",KE,[p("header",{ref_key:"topbar",ref:a,class:"topbar"},[p("button",{class:"toc-toggle","aria-label":"目录",onClick:m[0]||(m[0]=f=>i.value=!i.value)},"☰"),m[1]||(m[1]=p("a",{class:"brand",href:"#/"},[p("span",{class:"brand-main"},"家庭账本"),p("span",{class:"brand-sub"},"学习路线")],-1)),me(Yp,{entries:F(o)},null,8,["entries"]),p("div",JE,[p("div",{class:"tp-track",title:`${F(n)} / ${F(t)} 天已完成`},[p("div",{class:"tp-fill",style:Wt({width:F(r)+"%"})},null,4)],8,VE),p("span",YE,R(F(n))+"/"+R(F(t))+" 天 · "+R(F(r))+"%",1),p("button",{class:"btn-reset",onClick:u},"重置")])],512),p("div",XE,[p("aside",{class:Ie(["sidebar",{open:i.value}])},[me(Gp)],2),p("main",ZE,[F(Pe).name==="home"?(B(),at(km,{key:0})):F(Pe).name==="phase"?(B(),at(u0,{key:1,"phase-id":F(Pe).phase},null,8,["phase-id"])):F(Pe).name==="day"?(B(),at(WE,{key:2,"phase-id":F(Pe).phase,day:F(Pe).day},null,8,["phase-id","day"])):F(Pe).name==="timeline"?(B(),at(ea,{key:3,kicker:"🗓️ 时间线",title:"时间线",sub:"每天 3–4 小时的大致节奏。",md:F(he).timelineMd},null,8,["md"])):F(Pe).name==="reminders"?(B(),at(ea,{key:4,kicker:"📌 贯穿全程",title:"贯穿全程的提醒",md:F(he).remindersMd},null,8,["md"])):ye("",!0)])])]))}});qd(ey).mount("#app");
