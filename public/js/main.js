!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var r=(e,t)=>{document.querySelector(`#row${e}col${t}input`).focus()};function o(e,t){return function(){const n=this.value,o=+this.value;!Number.isInteger(o)||o<1||o>9?this.value="":(this.value=n.trim().slice(0,1),this.classList.remove("generated"),8!==t?r(e,t+1):r(8!==e?e+1:0,0))}}function u(e,t){return function(n){switch(n.key){case"ArrowRight":case"Right":8!==t?r(e,t+1):r(8!==e?e+1:0,0);break;case"ArrowLeft":case"Left":case"Backspace":0!==t?r(e,t-1):r(0!==e?e-1:8,8);break;case"ArrowUp":case"Up":n.preventDefault(),r(0!==e?e-1:8,t);break;case"ArrowDown":case"Down":n.preventDefault(),r(8!==e?e+1:0,t);break;case"Enter":document.querySelector("#submit").click();break}}}var l=()=>{const e=document.querySelector("table");for(let t=0;t<9;t++){const n=e.insertRow(-1),r=t%3==0?"top":t%3==2?"bottom":null;for(let e=0;e<9;e++){const l=n.insertCell(-1),c=e%3==0?"left":e%3==2?"right":null;r&&l.classList.add(r),c&&l.classList.add(c);const s=document.createElement("input");s.setAttribute("type","number"),s.setAttribute("min","1"),s.setAttribute("max","9"),s.classList.add("manualInput"),s.id=`row${t}col${e}input`;const i=o(t,e),a=u(t,e);s.addEventListener("input",i),s.addEventListener("keydown",a),l.appendChild(s)}}},c=e=>{const t=e.replace(/[^0-9]/gi,"0");return 81===t.length&&Number.isInteger(+t)&&+t>=0},s=e=>{const t=e.split("");for(const[e,n]of t.entries()){const t=Math.floor(e/9),r=e%9,o=document.querySelector(`#row${t}col${r}input`);o.classList.remove("generated"),o.value=0==+n?"":n}document.querySelector("#permalink").removeAttribute("disabled")},i=()=>{const e=document.querySelector("#stringEntry");e.addEventListener("input",function(){document.querySelector("#permalink").setAttribute("disabled",""),location.search&&history.pushState(null,null,window.location.href.split("?")[0]);const e=this.value;if(c(e)){const t=e.replace(/[^0-9]/gi,"0");this.value=t,s(t)}}),e.addEventListener("keyup",function(e){if("Enter"===e.key){const e=document.querySelector("#submit");e.click()}})};const a=(()=>{const e=document.createElement("script"),t=new Worker("noModule"in e?"js/worker.js":"js/es5-worker.js");return t.onmessage=function(e){const t=document.querySelector("#solution"),n=e.data.solutionArray;if(n){for(const[e,t]of n.entries()){const n=Math.floor(e/9),r=e%9,o=document.querySelector(`#row${n}col${r}input`);o.value||(o.classList.add("generated"),o.value=t)}const e=n.join("");t.value=e}else t.value="There are no solutions.";const r=e.data.boardString;location.search&&location.search.substring(1)!==r&&history.pushState(null,null,window.location.href.split("?")[0]),document.querySelector("#permalink").removeAttribute("disabled")},t})();var d;d=a,l(),document.querySelector("#clear").addEventListener("click",()=>{const e=document.querySelector("table");for(;e.firstChild;)e.removeChild(e.firstChild);l();const t=document.querySelector("#stringEntry");t.value=t.defaultValue;const n=document.querySelector("#solution");n.value=n.defaultValue,location.search&&history.pushState(null,null,window.location.href.split("?")[0]),document.querySelector("#permalink").setAttribute("disabled","")}),(e=>{document.querySelector("#submit").addEventListener("click",function(){const t=document.querySelectorAll(".manualInput"),n=[];for(const e of t)e.value?n.push(e.value):n.push(0);const r=n.join("");document.querySelector("#stringEntry").value=r,document.querySelector("#solution").value="Loading...",e.postMessage(r)})})(d),(()=>{if(location.search){const e=location.search.substring(1);if(c(e)){const t=e.replace(/[^0-9]/gi,"0");history.pushState(null,null,"?"+t),s(t),document.querySelector("#submit").click()}else history.pushState(null,null,window.location.href.split("?")[0])}})(),i(),document.querySelector("#permalink").addEventListener("click",()=>{const e=document.querySelector("#stringEntry").value;c(e)&&history.pushState(null,null,`?${e}`)})}]);