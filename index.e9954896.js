var e,t;function n(e,t){!function e(n,r){for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&("object"==typeof n[s]&&null!==n[s]?e(n[s],r+s+"."):t(r+s,n[s]))}(e,"")}function r(n,r){const s={};for(const[o,a]of n){const n=o.split("."),c=n.pop();n.reduce(((n,r)=>(e=n)[t=r]||(e[t]={})),s)[c]=r(a)}return s}function s(e){try{return decodeURIComponent(e.replace(/%(?![\da-f]{2})/gi,"%25"))}catch{return e}}const o={Equation:"=",Assignment:"≝",FunctionDefinition:"ᶠ≝",Stats:"stats",BoxPlot:"boxplot",DotPlot:"dotplot",Histogram:"histogram",IndependentTTest:"ittest",TTest:"ttest",Regression:"~",Error:"",Constant:c,MixedNumber:c,DotAccess:".",FunctionCall:a,FunctionExponent:"ᶠ^",FunctionFactorial:"ᶠ!",Identifier:a,Integral:"∫",Derivative:"∂",Prime:e=>"′".repeat(e.order),List:"[ ]",Range:"[...]",ListAccess:"A[n]",BareSeq:",",ParenSeq:"( , )",UpdateRule:"→",AssignmentExpression:"≔",ListComprehension:"[ for ]",OrderedPairAccess:".⁽ ⁾",Piecewise:"{ }",Product:"∏",Sum:"∑",SeededFunctionCall:"random",Add:"+",Subtract:"−",Multiply:"×",Divide:e=>{const t=S(e);return t?c({_constantValue:t}):"÷"},Exponent:"^",Negative:e=>{if("Identifier"===e.args[0].type&&"infty"===e.args[0]._symbol)return"-∞";if("Divide"!==e.args[0].type)return"-";const t=S(e.args[0]);return t?c({_constantValue:t},!0):"-"},And:"⋂","Comparator['<']":"<","Comparator['>']":">","Comparator['<=']":"≤","Comparator['>=']":"≥","Comparator['=']":"=",Seed:"",ExtendSeed:"",DoubleInequality:e=>{const t=document.createDocumentFragment(),n=document.createElement("div");n.textContent=e.args[1].replace("<=","≤").replace(">=","≥"),t.appendChild(n);const r=document.createElement("div");return r.textContent=e.args[3].replace("<=","≤").replace(">=","≥"),t.appendChild(r),t}};function a(e){if("factorial"===e._symbol)return"!";if("infty"===e._symbol)return"∞";const[t,n]=e._symbol.split("_");if(n){const e=document.createDocumentFragment();e.appendChild(document.createTextNode(t));const r=document.createElement("sub");return r.textContent=n,e.appendChild(r),e}return t}function c(e,t=!1){let n=e._constantValue;if("object"==typeof n&&1/+n.n&&1/+n.d){let e=n.n+"",r=n.d+"";const s=(n.n?"-"===e[0]:1/+n.n==-1/0)==(n.d?"-"===r[0]:1/+n.d==-1/0)!==t;if(e=e.replace(/^-/,""),r=r.replace(/^-/,""),e===r)return s?"1":"-1";if("1"===r)return(s?"":"-")+e;if("0"===r)return"0"===e?"NaN":s?"∞":"-∞";if(!e.includes("e")&&!r.includes("e")){let t=0,n=+r;for(;1!==n&&!(n%5);)n/=5,t++;for(;1!==n&&!(n%2);)n/=2,t--;if(1===n){const n=t<0?5**-t:2**t;return e=+e*n+"",r=+r*n+"",(s?"":"-")+(e.length<r.length?"0."+"0".repeat(r.length-e.length-1)+e:e.slice(0,1-r.length)+"."+e.slice(1-r.length)).replace(/\.?0+$/,"")}const o=_(+e,+r);if(e=+e/o+"",r=+r/o+"","1"===r)return(s?"":"-")+e}const o=document.createElement("span");o.className="fraction";const a=document.createElement("span");a.textContent=e,o.appendChild(a);const c=document.createElement("span");if(c.textContent=r,o.appendChild(c),!s){const e=document.createDocumentFragment();return e.appendChild(document.createTextNode("- ")),e.appendChild(o),e}return o}return"object"==typeof n&&(n=("∞"===n.n?1/0:"-∞"===n.n?-1/0:+n.n)/("∞"===n.d?1/0:"-∞"===n.d?-1/0:+n.d)),n===1/0?"∞":n===-1/0?"-∞":n+""}const i=Desmos.require("expressions/list-view").default.prototype,l=Desmos.require("lib/get-clipboard-data").default;let u;const d=i.onPaste;i.onPaste=function(e){u=l(e),d.call(this,e)};const{title:p}=document,m=Desmos.require("parser").parse,g=Desmos.GraphingCalculator(document.getElementById("calculator"),{pasteGraphLink:!0,pasteGraphLinkCallback(e,t){t(null,e);const n=/^\s*https?:\/\/(?:[a-zA-Z0-9]*\.)?desmos\.com(?::[0-9]+)?\/calculator\/(.+?)\s*$/.exec(u);n&&history.replaceState(e,p,"/desmos-ast-viewer/"+n[1])}});self.Calc=g,g.focusFirstExpression();const f=new Map;function y(e){return e.latex}n(g.getExpressions()[0],((e,t)=>f.set(e,t))),f.delete("color"),(()=>{const{hash:e}=location;if(e.startsWith("#/")){const t=e.slice(2,-e.endsWith("/")||void 0);return history.replaceState(g.getState(),p,"/desmos-ast-viewer/"+t),Desmos.require("main/load-graph-from-link").default(g.controller,"https://www.desmos.com/calculator/"+t,((e,n)=>{n(null,e),history.replaceState(e,p,"/desmos-ast-viewer/"+t)})),!0}const t=new URLSearchParams(location.search),n=t.get("state");if(n)try{return g.setState(s(n)),!0}catch{return!1}if(t.has("latex"))try{return g.setExpression(r(t.entries(),(e=>{return"true"===(t=s(e))||"false"!==t&&(+t==+t?+t:t);var t}))),!0}catch{return!1}})()||g.setExpression({latex:"x^{2}+y^{2}=10"}),history.replaceState(g.getState(),p),g.observeEvent("change",(()=>{const e=g.getState(),t=g.getExpressions().filter(y);history.replaceState(e,p,t.length?1===t.length?"/desmos-ast-viewer/?"+function(e){const t=new URLSearchParams;return n(e,((e,n)=>{f.get(e)!==n&&t.set(e,n)})),t.delete("type"),t.delete("id"),t.delete("hidden"),t.delete("secret"),t}(t[0]):"/desmos-ast-viewer/?state="+encodeURIComponent(JSON.stringify(e)):"/desmos-ast-viewer/")}));const h=document.getElementById("count"),C=document.getElementById("tree");function x(){const e=g.getExpressions().find(y);if(!e)return E();C.textContent="";const t=document.createElement("ul"),n=m(e.latex,{allowDt:!0,allowIndex:!0});if(n.isError)return E();t.appendChild(b(n)),C.appendChild(t),h.textContent=C.getElementsByTagName("div").length+""}function E(){C.textContent="",h.textContent="?"}function b(e){const t=document.createElement("li"),n=document.createElement("DoubleInequality"===e.type?"span":"div"),r=o[e.type],s="function"==typeof r?r(e):r;n.textContent="",n.appendChild("string"==typeof s?document.createTextNode(s):s),t.appendChild(n);const a=function(e){switch(e.type){case"Assignment":return[v(e._symbol),e._expression];case"Derivative":return[v(e._symbol),e.args[0]];case"FunctionDefinition":return[{type:"FunctionCall",_symbol:e._symbol,args:e._argSymbols.map(v)},e._expression];case"OrderedPairAccess":return[e.args[0],v("1"===e.args[1].scalarExprString()?"x":"y")];case"FunctionExponent":return[{type:"FunctionCall",_symbol:e.args[0]._symbol,args:[e.args[1]]},e.args[2]];case"FunctionFactorial":return[{type:"FunctionCall",_symbol:e.args[0]._symbol,args:[e.args[1]]}];case"Regression":case"Equation":return[e._lhs,e._rhs];case"DoubleInequality":return"args"in e?[e.args[0],e.args[2],e.args[4]]:[];case"Divide":return S(e)?[]:e.args;case"Negative":return"Identifier"===e.args[0].type&&"infty"===e.args[0]._symbol||"Divide"===e.args[0].type&&S(e.args[0])?[]:e.args;case"ListComprehension":case"SeededFunctionCall":return e.args.slice(1);default:return"args"in e?e.args:[]}}(e);if(a.length){const e=document.createElement("ul");a.forEach((t=>e.appendChild(b(t)))),t.appendChild(e)}return t}function v(e){return{type:"Identifier",_symbol:e}}function S(e){const[t,n]=e.args;if("Constant"===t.type&&"Constant"===n.type){const e=c(t),r=c(n);if(!("string"!=typeof e||e.includes(".")||e.includes("e")||"string"!=typeof r||r.includes(".")||r.includes("e")))return{n:e,d:r}}}function _(e,t){return t?_(t,e%t):e}g.observeEvent("change",x),x();
//# sourceMappingURL=index.e9954896.js.map
