!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);const o=document.createElement("script"),r=new Worker("noModule"in o?"js/worker.js":"js/es5-worker.js");r.onmessage=function(e){const t=document.querySelector("#solution"),n=e.data.solutionArray;if(!!n){for(const[e,t]of n.entries()){const n=Math.floor(e/9),o=e%9,r=document.querySelector(`#row${n}col${o}input`);r.value||(r.classList.add("generated"),r.value=t)}const e=n.join("");t.value=e}else t.value="There are no solutions.";const o=e.data.boardString;if(location.search.substring(1)!==o){history.pushState(null,null,window.location.href.split("?")[0]),document.querySelector("#permalink").removeAttribute("disabled")}};var u=(e,t)=>{document.querySelector(`#row${e}col${t}input`).focus()};function l(e,t){return function(){const n=this.value,o=+this.value;!Number.isInteger(o)||o<1||o>9?(this.value="",this.classList.add("warning")):(this.value=n.trim().slice(0,1),this.classList.remove("generated"),8!==t?u(e,t+1):u(8!==e?e+1:0,0))}}function c(e,t){return function(n){switch(n.key){case"ArrowRight":case"Right":8!==t?u(e,t+1):u(8!==e?e+1:0,0);break;case"ArrowLeft":case"Left":case"Backspace":0!==t?u(e,t-1):u(0!==e?e-1:8,8);break;case"ArrowUp":case"Up":u(0!==e?e-1:8,t);break;case"ArrowDown":case"Down":u(8!==e?e+1:0,t);break;case"Enter":document.querySelector("#submit").click();break}}}var s,i,a=()=>{const e=document.querySelector("table");for(let t=0;t<9;t++){const n=e.insertRow(-1),o=t%3==0?"top":t%3==2?"bottom":null;for(let e=0;e<9;e++){const r=n.insertCell(-1),u=e%3==0?"left":e%3==2?"right":null;o&&r.classList.add(o),u&&r.classList.add(u);const s=document.createElement("input");s.classList.add("manualInput"),s.id=`row${t}col${e}input`;const i=l(t,e),a=c(t,e);s.addEventListener("input",i),s.addEventListener("keydown",a),r.appendChild(s)}}},d=()=>{const e=document.querySelectorAll(".manualInput");for(const t of e)t.addEventListener("animationend",function(){this.classList.remove("warning")})},f=e=>{const t=e.replace(/[^0-9]/gi,"0");return 81===t.length&&Number.isInteger(+t)&&+t>=0},m=e=>{const t=e.split("");for(const[e,n]of t.entries()){const t=Math.floor(e/9),o=e%9,r=document.querySelector(`#row${t}col${o}input`);r.classList.remove("generated"),r.value=0==+n?"":n}document.querySelector("#permalink").removeAttribute("disabled")};a(),d(),s=a,i=d,document.querySelector("#clear").addEventListener("click",()=>{const e=document.querySelectorAll("tr");for(const t of e)t.remove();s(),i();const t=document.querySelector("#stringEntry");t.value=t.defaultValue;const n=document.querySelector("#solution");n.value=n.defaultValue,history.pushState(null,null,window.location.href.split("?")[0]),document.querySelector("#permalink").setAttribute("disabled","")}),(e=>{document.querySelector("#submit").addEventListener("click",function(){const t=document.querySelectorAll(".manualInput"),n=[];for(const e of t)e.value?n.push(e.value):n.push(0);const o=n.join("");document.querySelector("#stringEntry").value=o,document.querySelector("#solution").value="Loading...",e.postMessage(o)})})(r),(()=>{if(location.search){const e=location.search.substring(1);if(f(e)){const t=e.replace(/[^0-9]/gi,"0");history.pushState(null,null,"?"+t),m(t),document.querySelector("#submit").click()}else history.pushState(null,null,window.location.href.split("?")[0])}})(),(()=>{const e=document.querySelector("#stringEntry");e.addEventListener("input",function(){document.querySelector("#permalink").setAttribute("disabled",""),history.pushState(null,null,window.location.href.split("?")[0]);const e=this.value;if(f(e)){const t=e.replace(/[^0-9]/gi,"0");this.value=t,m(t)}}),e.addEventListener("keyup",function(e){if("Enter"===e.key){const e=document.querySelector("#submit");e.click()}})})(),document.querySelector("#permalink").addEventListener("click",()=>{const e=document.querySelector("#stringEntry").value;f(e)&&history.pushState(null,null,`?${e}`)})}]);