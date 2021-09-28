import { Parser, Grammar } from "nearley";
import grammar from "./grammar.ne";
import "./index.css";
import Desmos from "desmos";

const calc = Desmos.GraphingCalculator(document.getElementById("calculator"));
calc.setExpression({ latex: "x^{2}+y^{2}=10" });

const symbols = {
  times: "×",
  div: "÷",
  frac: "/",
  cdot: "·",
  le: "≤",
  ge: "≥",
  sim: "~",
  infty: "∞",

  Alpha: "𝛢",
  Beta: "𝛣",
  Gamma: "𝛤",
  Delta: "𝛥",
  Epsilon: "𝛦",
  Zeta: "𝛧",
  Eta: "𝛨",
  Theta: "𝛩",
  Iota: "𝛪",
  Kappa: "𝛫",
  Lambda: "𝛬",
  Mu: "𝛭",
  Nu: "𝛮",
  Xi: "𝛯",
  Omicron: "𝛰",
  Pi: "𝛱",
  Rho: "𝛲",
  Sigma: "𝛴",
  Tau: "𝛵",
  Upsilon: "𝛶",
  Phi: "𝛷",
  Chi: "𝛸",
  Psi: "𝛹",
  Omega: "𝛺",

  alpha: "𝛼",
  beta: "𝛽",
  gamma: "𝛾",
  delta: "𝛿",
  epsilon: "𝜀",
  zeta: "𝜁",
  eta: "𝜂",
  theta: "𝜃",
  iota: "𝜄",
  kappa: "𝜅",
  lambda: "𝜆",
  mu: "𝜇",
  nu: "𝜈",
  xi: "𝜉",
  omicron: "𝜊",
  pi: "𝜋",
  rho: "𝜌",
  sigma: "𝜎",
  tau: "𝜏",
  upsilon: "𝜐",
  phi: "𝜙",
  chi: "𝜒",
  psi: "𝜓",
  omega: "𝜔",

  sgn: "sign",
  gcf: "gcd",
};

const displayText = t => {
  let text = t.text || t;
  if (typeof text !== "string") return t.map(displayText).join("");
  if (t.type === "number") return text.replace(/\\? |\.$/g, "").replace(/^\./, "0.");
  if (text.startsWith("\\")) text = text.slice(1);
  const match = text.match(/^operatorname{([A-Za-z]+)}$/);
  if (match) text = match[1];
  if (t.type === "trig") text = text.replace(/^(arc?)?(...h?)(\^-1)?$/, ($0, $1, $2, $3) => (!$1 === !$3 ? "" : "a") + $2);
  return symbols[text] || text;
};

const process = d => {
  if (!d) return [];
  if (d.type || typeof d === "string") return [d];
  if (!d.length) return [];
  d = d.flatMap(process);
  if (d.length === 1) return [d[0]].flatMap(process);
  return [d];
};

const skip = d => (d && !(d.type || typeof d === "string") && (d = d.flatMap(skip))[0] === "skip" ? d.slice(1) : [d]);

const transform = d => {
  if (d.type || typeof d === "string") return d;
  if (d[0] === "bracket") return transform(d[1]);
  if (d[0].type === "trig" && d.length === (d.text === "atan2") + 3) {
    if (d[1][0].text === "-" && d[1][1] === "1") {
      d[0].text += "^-1";
      d.splice(1, 1);
      return d.map(transform);
    }
    return ["^", transform(d.splice(1, 1)[0]), d.map(transform)];
  }
  if (d[0] === "*" && d.length === 3 && (d[1] === "var" || d[1].type === "operator" || d[1].type === "defined") && d[1].text !== "x" && d[1].text !== "y" && d[2][0] === "bracket") d.splice(0, 1);
  return d.map(transform);
};

const output = document.getElementById("output");
const tree = document.getElementById("tree");
calc.observeEvent("change", function () {
  let count = 0;
  function recursion(part) {
    count++;
    const li = document.createElement("li");
    const div = document.createElement("div");
    li.appendChild(div);
    if (part.type || typeof part === "string") {
      div.textContent = displayText(part);
      return li;
    }
    if (part[0] === "var") {
      div.appendChild(document.createTextNode(displayText(part[1])));
      const sub = document.createElement("sub");
      sub.textContent = displayText(part[2]);
      div.appendChild(sub);
      return li;
    } else div.textContent = displayText(part[0]);
    let ul = document.createElement("ul");
    li.appendChild(ul);
    part.forEach((item, i) => i && ul.appendChild(recursion(item)));
    return li;
  }
  try {
    const { results } = new Parser(Grammar.fromCompiled(grammar)).feed(calc.getExpressions().find(exp => exp.latex).latex);
    tree.textContent = "";
    const ul = document.createElement("ul");
    ul.appendChild(recursion(transform(["skip", [results[0]].flatMap(process)[0]].flatMap(skip)[1])));
    tree.appendChild(ul);
    output.textContent = count;
  } catch (e) {
    tree.textContent = "";
    output.textContent = "?";
  }
});
