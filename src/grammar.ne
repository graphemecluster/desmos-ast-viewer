@{%
const moo = require("moo");
const lexer = moo.compile({
  defined: /\\(?:pi|tau|frac|sqrt|max|min|exp|log|ln|left|right|int|sum|prod|%|{|})/,
  latin: /[A-Za-z]/,
  greek: ["\\alpha", "\\beta", "\\theta"],
  number: /\d+(?:\.\d*)?|\.\d+/,
  trig: /\\(?:arc)?(?:sin|cos|tan|csc|sec|cot)h?|\\operatorname{(?:arc)?(?:sin|cos|tan|csc|sec|cot)h?}/,
  op0: ["=", "<", ">", "<=", ">=", "\\le", "\\ge", "~", "\\sim"],
  op1: ["+", "-"],
  op2: ["*", "/", "\\cdot"],
  operator: /\\operatorname{[A-Za-z]+}/,
  other: /./,
});
const atom = _ => 1;
const func = (...n) => d => [1].concat(n.map(i => d[i]));
const only = (...n) => d => [].concat(n.map(i => d[i]));
%}

@lexer lexer

statement -> expr (%op0 expr (%op0 expr):?):?
expr -> term (%op1 term):*
term -> %op1:? factor (%op2 %op1:? factor | factor):*
factor -> const {% atom %} | var {% atom %} | bracket | abs | factor sup | derivative | frac | sqrt | method | integral | accum | factorial | percent | list | piecewise
letter -> %latin | %greek
digit -> [0-9]
const -> %number | "\\pi" | "\\tau" | "e"
char -> %latin | digit
var -> letter ("_" (char | "{" char:+ "}")):?
para -> char | %greek | "{" expr "}" {% only(1) %}
sup -> "^" para
sub -> "_" para
frac -> "\\frac" para para
sqrt -> "\\sqrt" para | "\\sqrt" "[" expr "]" para {% func(2, 4) %}
function -> "\\max" | "\\min" | "\\exp" | "\\log" sub:? | "\\ln" | %operator | %trig sup:? {% atom %}
args -> expr ("," expr):*
dash -> "'":*
method -> function dash call {% only(0, 2) %}
call -> "(" args:? ")" {% only(1) %} | "\\left" "(" args:? "\\right" ")" {% only(2) %} | term
abs -> "\\left" "|" expr "\\right" "|" {% func(2) %}
bracket -> "(" expr ")" {% only(1) %} | "\\left" "(" expr "\\right" ")" {% only(2) %} | "{" expr "}" {% only(1) %}
integral -> "\\int" sub sup term "d" var {% func(1, 2, 3) %}
accum -> ("\\sum" | "\\prod") sub sup term
factorial -> term "!"
percent -> term "\\%" "\\operatorname{of}" term {% func(0, 3) %}
dorder -> ("^" digit | "^" "{" digit:+ "}"):?
dsymbol -> "d" | "{" "d" dorder "}"
dvar -> "{" "d" var dorder "}"
derivative -> "\\frac" dsymbol dvar term {% atom %}
list -> "[" args:? "]" {% func(1) %} | "\\left" "[" args:? "\\right" "]" {% func(2) %}
piecewisearg -> statement (":" expr):?
conditions -> piecewisearg ("," piecewisearg):* ("," expr):?
piecewise -> "\\{" conditions:? "\\}" {% func(1) %} | "\\left" "{" conditions:? "\\right" "}" {% func(2) %}
