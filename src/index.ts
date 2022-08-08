import type { desmosRequire } from "../DesModder/src/globals/window";
import type { parseDesmosLatexRaw } from "../DesModder/src/utils/depUtils";
import type Node from "../DesModder/src/parsing/parsenode";
import type { ChildExprNode, Divide, Error, FunctionCall, Identifier } from "../DesModder/src/parsing/parsenode";

declare global {
  namespace Desmos {
    const require: typeof desmosRequire;
  }
  interface Window {
    Desmos: typeof Desmos;
  }
}

const display: {
  [K in Node["type"]]: string | globalThis.Node | ((node: Node & { type: K }) => string | globalThis.Node);
} = {
  "Equation": "=",
  "Assignment": "≝",
  "FunctionDefinition": "ᶠ≝",
  "Stats": "stats",
  "BoxPlot": "boxplot",
  "DotPlot": "dotplot",
  "Histogram": "histogram",
  "IndependentTTest": "ittest",
  "TTest": "ttest",
  "Regression": "~",
  "Error": "",
  "Constant": constantToFraction,
  "MixedNumber": constantToFraction,
  "DotAccess": ".",
  "FunctionCall": symbolToElement,
  "FunctionExponent": "ᶠ^",
  "FunctionFactorial": "ᶠ!",
  "Identifier": symbolToElement,
  "Integral": "∫",
  "Derivative": "∂",
  "Prime": node => "′".repeat(node.order),
  "List": "[ ]",
  "Range": "[...]",
  "ListAccess": "A[n]",
  "BareSeq": ",",
  "ParenSeq": "( , )",
  "UpdateRule": "→",
  "AssignmentExpression": "≔",
  "ListComprehension": "[ for ]",
  "OrderedPairAccess": ".⁽ ⁾",
  "Piecewise": "{ }",
  "Product": "∏",
  "Sum": "∑",
  "SeededFunctionCall": "random",
  "Add": "+",
  "Subtract": "−",
  "Multiply": "×",
  "Divide": node => {
    const fraction = toFraction(node);
    return fraction ? constantToFraction({ _constantValue: fraction }) : "÷";
  },
  "Exponent": "^",
  "Negative": node => {
    if (node.args[0].type === "Identifier" && node.args[0]._symbol === "infty") return "-infty";
    if (node.args[0].type !== "Divide") return "-";
    const fraction = toFraction(node.args[0]);
    return fraction ? constantToFraction({ _constantValue: fraction }, true) : "-";
  },
  "And": "⋂",
  "Comparator['<']": "<",
  "Comparator['>']": ">",
  "Comparator['<=']": "≤",
  "Comparator['>=']": "≥",
  "Comparator['=']": "=",
  "Seed": "",
  "ExtendSeed": "",
  "DoubleInequality": node => {
    const fragment = document.createDocumentFragment();
    const lhs = document.createElement("div");
    lhs.textContent = node.args[1].replace("<=", "≤").replace(">=", "≥");
    fragment.appendChild(lhs);
    const rhs = document.createElement("div");
    rhs.textContent = node.args[3].replace("<=", "≤").replace(">=", "≥");
    fragment.appendChild(rhs);
    return fragment;
  },
};

function symbolToElement(node: Node & { _symbol: string }) {
  if (node._symbol === "factorial") return "!";
  const [lhs, rhs] = node._symbol.split("_");
  if (rhs) {
    const fragment = document.createDocumentFragment();
    fragment.appendChild(document.createTextNode(lhs!));
    const sub = document.createElement("sub");
    sub.textContent = rhs;
    fragment.appendChild(sub);
    return fragment;
  }
  return lhs!;
}

function constantToFraction(
  node: { _constantValue: boolean | number | { n: string | number; d: string | number } },
  negate = false
) {
  const value = node._constantValue;
  if (typeof value === "object") {
    let n = value.n + "";
    let d = value.d + "";
    const sign = ((n[0] === "-") === (d[0] === "-")) !== negate;
    n = n.replace(/^-/, "");
    d = d.replace(/^-/, "");
    if (d === "1") return (sign ? "" : "-") + n;
    if (d === "0") return n === "0" ? "undefined" : (sign ? "" : "-") + "infty";
    if (!n.includes("e") && !d.includes("e")) {
      let diff = 0;
      let v = +d;
      while (v !== 1 && !(v % 5)) {
        v /= 5;
        diff++;
      }
      while (v !== 1 && !(v % 2)) {
        v /= 2;
        diff--;
      }
      if (v === 1) {
        const m = diff < 0 ? 5 ** -diff : 2 ** diff;
        n = +n * m + "";
        d = +d * m + "";
        return (
          (sign ? "" : "-") +
          (n.length < d.length
            ? "0." + "0".repeat(d.length - n.length - 1) + n
            : n.slice(0, 1 - d.length) + "." + n.slice(1 - d.length)
          ).replace(/\.?0+$/, "")
        );
      }
    }
    const fraction = document.createElement("span");
    fraction.className = "fraction";
    const numerator = document.createElement("span");
    numerator.textContent = n;
    fraction.appendChild(numerator);
    const denominator = document.createElement("span");
    denominator.textContent = d;
    fraction.appendChild(denominator);
    if (!sign) {
      const fragment = document.createDocumentFragment();
      fragment.appendChild(document.createTextNode("- "));
      fragment.appendChild(fraction);
      return fragment;
    }
    return fraction;
  }
  return isNaN(value as number) ? "undefined" : value + "";
}

const parse = Desmos.require("parser").parse as typeof parseDesmosLatexRaw;
const calc = Desmos.GraphingCalculator(document.getElementById("calculator")!, { pasteGraphLink: true });
calc.setExpression({ latex: "x^{2}+y^{2}=10" });

const count = document.getElementById("count")!;
const tree = document.getElementById("tree")!;
calc.observeEvent("change", onChange);
onChange();

function onChange() {
  const exp = calc
    .getExpressions()
    .find((exp): exp is Exclude<Desmos.ExpressionState, { type: "table" }> & { latex: string } => (exp as any).latex);
  if (!exp) return onError();
  tree.textContent = "";
  const ul = document.createElement("ul");
  const node = parse(exp.latex, { allowDt: true, allowIndex: true });
  if ((node as Error).isError) return onError();
  ul.appendChild(recursion(node));
  tree.appendChild(ul);
  count.textContent = tree.getElementsByTagName("div").length + "";
}

function onError() {
  tree.textContent = "";
  count.textContent = "?";
}

function recursion(node: Node): HTMLLIElement {
  const li = document.createElement("li");
  const div = document.createElement(node.type === "DoubleInequality" ? "span" : "div");
  const elementOrFn = display[node.type] as string | globalThis.Node | ((node: Node) => string | globalThis.Node);
  const element = typeof elementOrFn === "function" ? elementOrFn(node) : elementOrFn;
  div.textContent = "";
  div.appendChild(typeof element === "string" ? document.createTextNode(element) : element);
  li.appendChild(div);
  const children = getChildren(node);
  if (children.length) {
    const ul = document.createElement("ul");
    children.forEach(child => ul.appendChild(recursion(child)));
    li.appendChild(ul);
  }
  return li;
}

function getChildren(node: Node) {
  switch (node.type) {
    case "Assignment":
      return [toIdentifier(node._symbol), node._expression];
    case "Derivative":
      return [toIdentifier(node._symbol), node.args[0]];
    case "FunctionDefinition":
      return [
        { type: "FunctionCall", _symbol: node._symbol, args: node._argSymbols.map(toIdentifier) } as FunctionCall,
        node._expression,
      ];
    case "OrderedPairAccess":
      return [node.args[0], toIdentifier(node.args[1].scalarExprString() === "1" ? "x" : "y")];
    case "FunctionExponent":
      return [
        { type: "FunctionCall", _symbol: node.args[0]._symbol, args: [node.args[1]] } as FunctionCall,
        node.args[2],
      ];
    case "FunctionFactorial":
      return [{ type: "FunctionCall", _symbol: node.args[0]._symbol, args: [node.args[1]] } as FunctionCall];
    case "Regression":
    case "Equation":
      return [node._lhs, node._rhs];
    case "DoubleInequality":
      return "args" in node ? [node.args[0], node.args[2], node.args[4]] : [];
    case "Divide":
      return toFraction(node) ? [] : node.args;
    case "Negative":
      return (node.args[0].type === "Identifier" && node.args[0]._symbol === "infty") ||
        (node.args[0].type === "Divide" && toFraction(node.args[0]))
        ? []
        : node.args;
    case "ListComprehension":
    case "SeededFunctionCall":
      return node.args.slice(1);
    default:
      return "args" in node ? (node.args as ChildExprNode[]) : [];
  }
}

function toIdentifier(str: string) {
  return { type: "Identifier", _symbol: str } as Identifier;
}

function toFraction(node: Divide) {
  const [nNode, dNode] = node.args;
  if (nNode.type === "Constant" && dNode.type === "Constant") {
    const n = constantToFraction(nNode);
    const d = constantToFraction(dNode);
    if (
      typeof n === "string" &&
      !n.includes(".") &&
      !n.includes("e") &&
      typeof d === "string" &&
      !d.includes(".") &&
      !d.includes("e")
    )
      return { n, d };
  }
}
