!function(t){var s={};function o(n){if(s[n])return s[n].exports;var e=s[n]={i:n,l:!1,exports:{}};return t[n].call(e.exports,e,e.exports,o),e.l=!0,e.exports}o.m=t,o.c=s,o.d=function(t,s,n){o.o(t,s)||Object.defineProperty(t,s,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,s){if(1&s&&(t=o(t)),8&s)return t;if(4&s&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&s&&"string"!=typeof t)for(var e in t)o.d(n,e,function(s){return t[s]}.bind(null,e));return n},o.n=function(t){var s=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(s,"a",s),s},o.o=function(t,s){return Object.prototype.hasOwnProperty.call(t,s)},o.p="",o(o.s=0)}([function(t,s,o){"use strict";o.r(s);class n{constructor(t,s){this.id=t,this.val=s||null,this.possVals=s?[]:[1,2,3,4,5,6,7,8,9],this.rowTakenNumsContributor=!1,this.colTakenNumsContributor=!1,this.boxTakenNumsContributor=!1}row(){return Math.floor(this.id/9)}col(){return this.id%9}box(){return 3*Math.floor(this.row()/3)+Math.floor(this.col()/3)}moveLastRemainingPossValToVal(){this.val||1!==this.possVals.length||(this.val=this.possVals[0],this.possVals.pop())}checkForNoPossValsLeft(){if(!this.val&&0===this.possVals.length)return!0}}class e{constructor(t,s){this.groupType=t,this.num=s,this.takenNums=[]}checkForDuplicates(){const t=[];for(let s=0;s<this.takenNums.length;s++){if(t.includes(this.takenNums[s]))return!0;t.push(this.takenNums[s])}}}function r(t,s){const o=[];if(s.forEach(s=>{t.forEach(t=>{t[s.groupType]()===s.num&&t.val&&!t[`${s.groupType}TakenNumsContributor`]&&o.push([s,t])})}),o.length>0)return o.forEach(t=>{const s=t[0],o=t[1];s.takenNums.push(o.val),o[`${s.groupType}TakenNumsContributor`]=!0}),!0}function u(t,s){const o=[];if(s.forEach(s=>{t.forEach(t=>{t[s.groupType]()!==s.num||t.val||s.takenNums.forEach(s=>{t.possVals.includes(s)&&o.push([t,s])})})}),o.length>0)return o.forEach(t=>{const s=t[0],o=t[1],n=s.possVals.findIndex(t=>t===o);-1!==n&&s.possVals.splice(n,1)}),!0}function i(t,s){const o=[];if(s.forEach(s=>{const n=[];t.forEach(t=>{t[s.groupType]()===s.num&&n.push(t)});const e=[],r=[];for(let t=1;t<10;t++)n.forEach(s=>{if(!s.possVals.includes(t)||e.includes(t)||r.includes(t)){if(s.possVals.includes(t)&&e.includes(t)&&!r.includes(t)){const s=e.findIndex(s=>s===t);e.splice(s,1),r.push(t)}}else e.push(t)});e.forEach(t=>{for(let s=0;s<9;s++)n[s].possVals.includes(t)&&(o.push([n[s],t]),s=9)})}),o.length>0)return o.forEach(t=>{const s=t[0],o=t[1];s.possVals=[o]}),!0}var l=(t,s)=>{let o;do{o=!1,(r(t,s)||u(t,s)||i(t,s))&&(o=!0,t.forEach(t=>{t.moveLastRemainingPossValToVal()}))}while(o);if(!function(t){for(let s=0;s<t.length;s++)if(t[s].checkForDuplicates())return!0}(s)&&!function(t){for(let s=0;s<t.length;s++)if(t[s].checkForNoPossValsLeft())return!0}(t))return t.map(t=>t.val||0)},a=t=>{let s;for(const o of t)if(!o.val){if(2===o.possVals.length){s=o;break}(!s||o.possVals.length<s.possVals.length)&&(s=o)}return s};function c(t){let s;const o=function(t){const s=[],o=t.split("");for(const[t,e]of o.entries())s.push(new n(t,+e));return s}(t),r=function(){const t=[];for(let s=0;s<9;s++)t.push(new e("row",s)),t.push(new e("col",s)),t.push(new e("box",s));return t}(),u=l(o,r);if(!!u){if(!u.includes(0))s=u;else{const t=a(o);for(const o of t.possVals){u.splice(t.id,1,o);const n=c(u.join(""));if(!!n){s=n;break}}}}return s}onmessage=function(t){const s=c(t.data);postMessage({boardString:t.data,solutionArray:s})}}]);