var e,t;function n(e,t){!function e(n,r){for(const s in n)Object.prototype.hasOwnProperty.call(n,s)&&("object"==typeof n[s]&&null!==n[s]?e(n[s],r+s+"."):t(r+s,n[s]))}(e,"")}function r(n,r){const s={};for(const[o,a]of n){const n=o.split("."),c=n.pop();n.reduce(((n,r)=>(e=n)[t=r]||(e[t]={})),s)[c]=r(a)}return s}function s(e){try{return decodeURIComponent(e.replace(/%(?![\da-f]{2})/gi,"%25"))}catch{return e}}const o={Equation:"=",Assignment:"≝",FunctionDefinition:"ᶠ≝",Stats:"stats",BoxPlot:"boxplot",DotPlot:"dotplot",Histogram:"histogram",IndependentTTest:"ittest",TTest:"ttest",Regression:"~",Error:"",Constant:c,MixedNumber:c,DotAccess:".",FunctionCall:a,FunctionExponent:"ᶠ^",FunctionFactorial:"ᶠ!",Identifier:a,Integral:"∫",Derivative:"∂",Prime:e=>"′".repeat(e.order),List:"[ ]",Range:"[...]",ListAccess:"A[n]",BareSeq:",",ParenSeq:"( , )",UpdateRule:"→",AssignmentExpression:"≔",ListComprehension:"[ for ]",OrderedPairAccess:".⁽ ⁾",Piecewise:"{ }",Product:"∏",Sum:"∑",SeededFunctionCall:"random",Add:"+",Subtract:"−",Multiply:"×",Divide:e=>{const t=C(e);return t?c({_constantValue:t}):"÷"},Exponent:"^",Negative:e=>{if("Identifier"===e.args[0].type&&"infty"===e.args[0]._symbol)return"-infty";if("Divide"!==e.args[0].type)return"-";const t=C(e.args[0]);return t?c({_constantValue:t},!0):"-"},And:"⋂","Comparator['<']":"<","Comparator['>']":">","Comparator['<=']":"≤","Comparator['>=']":"≥","Comparator['=']":"=",Seed:"",ExtendSeed:"",DoubleInequality:e=>{const t=document.createDocumentFragment(),n=document.createElement("div");n.textContent=e.args[1].replace("<=","≤").replace(">=","≥"),t.appendChild(n);const r=document.createElement("div");return r.textContent=e.args[3].replace("<=","≤").replace(">=","≥"),t.appendChild(r),t}};function a(e){if("factorial"===e._symbol)return"!";const[t,n]=e._symbol.split("_");if(n){const e=document.createDocumentFragment();e.appendChild(document.createTextNode(t));const r=document.createElement("sub");return r.textContent=n,e.appendChild(r),e}return t}function c(e,t=!1){const n=e._constantValue;if("object"==typeof n){let e=n.n+"",r=n.d+"";const s="-"===e[0]==("-"===r[0])!==t;if(e=e.replace(/^-/,""),r=r.replace(/^-/,""),"1"===r)return(s?"":"-")+e;if("0"===r)return"0"===e?"undefined":(s?"":"-")+"infty";if(!e.includes("e")&&!r.includes("e")){let t=0,n=+r;for(;1!==n&&!(n%5);)n/=5,t++;for(;1!==n&&!(n%2);)n/=2,t--;if(1===n){const n=t<0?5**-t:2**t;return e=+e*n+"",r=+r*n+"",(s?"":"-")+(e.length<r.length?"0."+"0".repeat(r.length-e.length-1)+e:e.slice(0,1-r.length)+"."+e.slice(1-r.length)).replace(/\.?0+$/,"")}}const o=document.createElement("span");o.className="fraction";const a=document.createElement("span");a.textContent=e,o.appendChild(a);const c=document.createElement("span");if(c.textContent=r,o.appendChild(c),!s){const e=document.createDocumentFragment();return e.appendChild(document.createTextNode("- ")),e.appendChild(o),e}return o}return isNaN(n)?"undefined":n+""}const i=Desmos.require("parser").parse,l=Desmos.GraphingCalculator(document.getElementById("calculator"),{pasteGraphLink:!0});self.Calc=l,l.focusFirstExpression();const u=new Map;function d(e){return e.latex}n(l.getExpressions()[0],((e,t)=>u.set(e,t))),u.delete("color"),(()=>{const e=s(location.pathname.replace(/^\/desmos-ast-viewer\/?/,""));if(e)return Desmos.require("main/load-graph-from-link").default(l.controller,"https://www.desmos.com/calculator/"+e,((t,n)=>{n(null,t),history.replaceState(t,document.title,"/desmos-ast-viewer/"+e)})),!0;const t=new URLSearchParams(location.search),n=t.get("state");if(n)try{return l.setState(s(n)),!0}catch{return!1}if(t.has("latex"))try{return l.setExpression(r(t.entries(),(e=>JSON.parse(s(e))))),!0}catch{return!1}})()||l.setExpression({latex:"x^{2}+y^{2}=10"}),l.observeEvent("change",(()=>{const e=l.getState(),t=l.getExpressions().filter(d);history.replaceState(e,document.title,t.length?1===t.length?"/desmos-ast-viewer/?"+function(e){const t=new URLSearchParams;return n(e,((e,n)=>{u.get(e)!==n&&t.set(e,JSON.stringify(n))})),t.delete("type"),t.delete("id"),t.delete("hidden"),t.delete("secret"),t}(t[0]):"/desmos-ast-viewer/?state="+encodeURIComponent(JSON.stringify(e)):"/desmos-ast-viewer/")}));const p=document.getElementById("count"),m=document.getElementById("tree");function g(){const e=l.getExpressions().find(d);if(!e)return f();m.textContent="";const t=document.createElement("ul"),n=i(e.latex,{allowDt:!0,allowIndex:!0});if(n.isError)return f();t.appendChild(y(n)),m.appendChild(t),p.textContent=m.getElementsByTagName("div").length+""}function f(){m.textContent="",p.textContent="?"}function y(e){const t=document.createElement("li"),n=document.createElement("DoubleInequality"===e.type?"span":"div"),r=o[e.type],s="function"==typeof r?r(e):r;n.textContent="",n.appendChild("string"==typeof s?document.createTextNode(s):s),t.appendChild(n);const a=function(e){switch(e.type){case"Assignment":return[h(e._symbol),e._expression];case"Derivative":return[h(e._symbol),e.args[0]];case"FunctionDefinition":return[{type:"FunctionCall",_symbol:e._symbol,args:e._argSymbols.map(h)},e._expression];case"OrderedPairAccess":return[e.args[0],h("1"===e.args[1].scalarExprString()?"x":"y")];case"FunctionExponent":return[{type:"FunctionCall",_symbol:e.args[0]._symbol,args:[e.args[1]]},e.args[2]];case"FunctionFactorial":return[{type:"FunctionCall",_symbol:e.args[0]._symbol,args:[e.args[1]]}];case"Regression":case"Equation":return[e._lhs,e._rhs];case"DoubleInequality":return"args"in e?[e.args[0],e.args[2],e.args[4]]:[];case"Divide":return C(e)?[]:e.args;case"Negative":return"Identifier"===e.args[0].type&&"infty"===e.args[0]._symbol||"Divide"===e.args[0].type&&C(e.args[0])?[]:e.args;case"ListComprehension":case"SeededFunctionCall":return e.args.slice(1);default:return"args"in e?e.args:[]}}(e);if(a.length){const e=document.createElement("ul");a.forEach((t=>e.appendChild(y(t)))),t.appendChild(e)}return t}function h(e){return{type:"Identifier",_symbol:e}}function C(e){const[t,n]=e.args;if("Constant"===t.type&&"Constant"===n.type){const e=c(t),r=c(n);if(!("string"!=typeof e||e.includes(".")||e.includes("e")||"string"!=typeof r||r.includes(".")||r.includes("e")))return{n:e,d:r}}}l.observeEvent("change",g),g();
//# sourceMappingURL=index.fd1ceaf3.js.map
