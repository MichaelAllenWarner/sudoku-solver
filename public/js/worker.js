!function(o){var n={};function t(s){if(n[s])return n[s].exports;var e=n[s]={i:s,l:!1,exports:{}};return o[s].call(e.exports,e,e.exports,t),e.l=!0,e.exports}t.m=o,t.c=n,t.d=function(o,n,s){t.o(o,n)||Object.defineProperty(o,n,{enumerable:!0,get:s})},t.r=function(o){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(o,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(o,"__esModule",{value:!0})},t.t=function(o,n){if(1&n&&(o=t(o)),8&n)return o;if(4&n&&"object"==typeof o&&o&&o.__esModule)return o;var s=Object.create(null);if(t.r(s),Object.defineProperty(s,"default",{enumerable:!0,value:o}),2&n&&"string"!=typeof o)for(var e in o)t.d(s,e,function(n){return o[n]}.bind(null,e));return s},t.n=function(o){var n=o&&o.__esModule?function(){return o.default}:function(){return o};return t.d(n,"a",n),n},t.o=function(o,n){return Object.prototype.hasOwnProperty.call(o,n)},t.p="",t(t.s=0)}([function(o,n,t){"use strict";t.r(n);class s{constructor(o,n){this.id=o,this.val=n||null,this.possVals=n?[]:[1,2,3,4,5,6,7,8,9],this.isAccountedForInGroupTakenNums=!1}row(){return Math.floor(this.id/9)}col(){return this.id%9}box(){return 3*Math.floor(this.row()/3)+Math.floor(this.col()/3)}moveLastRemainingPossValToVal(){this.val||1!==this.possVals.length||(this.val=this.possVals[0],this.possVals.pop())}checkForNoPossValsLeft(){if(!this.val&&0===this.possVals.length)return!0}}class e{constructor(o,n){this.groupType=o,this.num=n,this.takenNums=[]}checkForDuplicates(){const o=[];for(const n of this.takenNums){if(o.includes(n))return!0;o.push(n)}}}function r(o,n){const t=[];for(const s of o){if(!s.val)continue;if(s.isAccountedForInGroupTakenNums)continue;const o=[];for(const t of n)if(s[t.groupType]()===t.num&&(o.push(t),3===o.length))break;for(const n of o)t.push([n,s.val]);s.isAccountedForInGroupTakenNums=!0}if(t.length>0){for(const[o,n]of t)o.takenNums.push(n);return!0}}function u(o,n){const t=[];for(const s of o){if(s.val)continue;const o=[];for(const t of n)if(s[t.groupType]()===t.num&&t.takenNums.length>0&&(o.push(t),3===o.length))break;if(o.length>0)for(const n of o)for(const o of n.takenNums)s.possVals.includes(o)&&t.push([s,o])}if(t.length>0){for(const[o,n]of t){const t=o.possVals.findIndex(o=>o===n);-1!==t&&o.possVals.splice(t,1)}return!0}}function i(o,n){const t=[];for(const s of n){const n=[],e=[],r=[];for(const t of o)if(t[s.groupType]()===s.num&&(r.push(t),t.possVals.length>0))for(const o of t.possVals){if(e.includes(o))continue;const t=n.findIndex(n=>n===o);-1===t?n.push(o):(n.splice(t,1),e.push(o))}for(const o of n){const n=r.find(n=>n.possVals.includes(o));t.push([n,o])}}if(t.length>0){for(const[o,n]of t)o.possVals=[n];return!0}}var f=(o,n)=>{let t;do{if(t=r(o,n)||u(o,n)||i(o,n))for(const n of o)n.moveLastRemainingPossValToVal()}while(t);if(!function(o){for(const n of o)if(n.checkForDuplicates())return!0}(n)&&!function(o){for(const n of o)if(n.checkForNoPossValsLeft())return!0}(o))return o.map(o=>o.val||0)},c=o=>{let n;for(const t of o)if(!t.val){if(2===t.possVals.length){n=t;break}(!n||t.possVals.length<n.possVals.length)&&(n=t)}return n};function l(o){let n;const t=function(o){const n=[],t=o.split("");for(const[o,e]of t.entries())n.push(new s(o,+e));return n}(o),r=function(){const o=[];for(let n=0;n<9;n++)o.push(new e("row",n)),o.push(new e("col",n)),o.push(new e("box",n));return o}(),u=f(t,r);if(!!u){if(!u.includes(0))n=u;else{const o=c(t);for(const t of o.possVals){u[o.id]=t;const s=l(u.join(""));if(!!s){n=s;break}}}}return n}onmessage=function(o){const n=l(o.data);postMessage({boardString:o.data,solutionArray:n})}}]);