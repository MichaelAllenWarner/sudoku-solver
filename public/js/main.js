!function(e){var t={};function o(n){if(t[n])return t[n].exports;var r=t[n]={i:n,l:!1,exports:{}};return e[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=e,o.c=t,o.d=function(e,t,n){o.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},o.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},o.t=function(e,t){if(1&t&&(e=o(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)o.d(n,r,function(t){return e[t]}.bind(null,r));return n},o.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return o.d(t,"a",t),t},o.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},o.p="",o(o.s=0)}([function(e,t,o){"use strict";o.r(t);const n=new Worker("js/worker.js");function r(){const e=document.querySelector("table");for(let t=0;t<9;t++){const o=e.insertRow(-1);for(let e=0;e<9;e++){const n=o.insertCell(-1),r=t%3==0?"top":t%3==2?"bottom":null,u=e%3==0?"left":e%3==2?"right":null;r&&n.classList.add(r),u&&n.classList.add(u);const c=document.createElement("input");c.classList.add("manualInput"),c.id=`row${t}col${e}input`,c.addEventListener("input",function(){if(this.value){if(!Number.isInteger(+this.value)||+this.value<1||+this.value>9)return this.value="",void this.classList.add("warning");this.classList.remove("generated"),this.value=this.value.trim().slice(0,1),8!==e?document.querySelector(`#row${t}col${e+1}input`).focus():8!==t?document.querySelector(`#row${t+1}col0input`).focus():document.querySelector("#row0col0input").focus()}}),c.addEventListener("keyup",function(o){"ArrowRight"!==o.key&&"Right"!==o.key||(8!==e?document.querySelector(`#row${t}col${e+1}input`).focus():8!==t?document.querySelector(`#row${t+1}col0input`).focus():document.querySelector("#row0col0input").focus()),"ArrowLeft"!==o.key&&"Left"!==o.key&&"Backspace"!==o.key||(0!==e?document.querySelector(`#row${t}col${e-1}input`).focus():0!==t?document.querySelector(`#row${t-1}col8input`).focus():document.querySelector("#row8col8input").focus()),"ArrowUp"!==o.key&&"Up"!==o.key||(0!==t?document.querySelector(`#row${t-1}col${e}input`).focus():document.querySelector(`#row8col${e}input`).focus()),"ArrowDown"!==o.key&&"Down"!==o.key||(8!==t?document.querySelector(`#row${t+1}col${e}input`).focus():document.querySelector(`#row0col${e}input`).focus()),"Enter"===o.key&&document.querySelector("#submit").click()}),n.appendChild(c)}}}function u(){document.querySelectorAll(".manualInput").forEach(e=>{e.addEventListener("animationend",function(){this.classList.remove("warning")})})}n.onmessage=function(e){const t=document.querySelector("#solution"),o=e.data.solutionArray;if(!!o){o.forEach((e,t)=>{const o=Math.floor(t/9),n=t%9,r=document.querySelector(`#row${o}col${n}input`);r.value||(r.classList.add("generated"),r.value=e)});const e=o.join("");t.value=e}else t.value="There are no solutions.";const n=e.data.boardString;if(location.search.substring(1)!==n){history.pushState(null,null,window.location.href.split("?")[0]),document.querySelector("#permalink").removeAttribute("disabled")}},r(),u(),function(e,t){document.querySelector("#clear").addEventListener("click",()=>{document.querySelectorAll("tr").forEach(e=>{e.remove()}),e(),t();const o=document.querySelector("#stringEntry");o.value=o.defaultValue;const n=document.querySelector("#solution");n.value=n.defaultValue,history.pushState(null,null,window.location.href.split("?")[0]),document.querySelector("#permalink").setAttribute("disabled","")})}(r,u),function(e){document.querySelector("#submit").addEventListener("click",()=>{const t=document.querySelectorAll(".manualInput"),o=[];t.forEach(e=>{e.value?o.push(e.value):o.push(0)});const n=o.join("");document.querySelector("#stringEntry").value=n,document.querySelector("#solution").value="Loading...",e.postMessage(n)})}(n),function(){if(location.search){const e=location.search.substring(1).replace(/[^0-9]/gi,"0");t(e)?(o(e),document.querySelector("#submit").click()):history.pushState(null,null,window.location.href.split("?")[0])}const e=document.querySelector("#stringEntry");function t(e){return 81===e.length&&Number.isInteger(+e)&&+e>=0}function o(e){e.split("").forEach((e,t)=>{const o=Math.floor(t/9),n=t%9,r=document.querySelector(`#row${o}col${n}input`);r.classList.remove("generated"),r.value=0==+e?"":e}),document.querySelector("#permalink").removeAttribute("disabled")}e.addEventListener("input",function(){document.querySelector("#permalink").setAttribute("disabled",""),history.pushState(null,null,window.location.href.split("?")[0]);const e=this.value.replace(/[^0-9]/gi,"0");t(e)&&(this.value=e,o(e))}),e.addEventListener("keyup",function(e){if("Enter"===e.key){const e=document.querySelector("#submit");e.click()}})}(),document.querySelector("#permalink").addEventListener("click",()=>{const e=document.querySelector("#stringEntry").value.replace(/[^0-9]/gi,"0");81===e.length&&Number.isInteger(+e)&&+e>=0&&history.pushState(null,null,`?${document.querySelector("#stringEntry").value}`)})}]);