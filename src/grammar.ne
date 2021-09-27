@{%
const moo = require("moo");
const lexer = moo.compile({
  _: /\\? /,
  number: /(?:\d|\\? )+(?:\.(?:\d|\\? )*)?|\.(?:\d|\\? )+/,
  trig: /\\(?:arc?)?(?:sin|cos|tan|csc|sec|cot)h?(?![A-Za-z])|\\operatorname{(?:arc?)?(?:sin|cos|tan|csc|sec|cot)h?}/,
  op0: /=|[<>]=?|~|\\(?:[lg]eq?|sim)(?![A-Za-z])/,
  op1: /[+-]/,
  op2: /[*/]|\\(?:times|div|cdot)(?![A-Za-z])/,
  operator: /\\operatorname(?!{ans}){[A-Za-z]+}/,
  reserved: /\\(?:frac|sqrt|log|ln|left|right|int|sum|prod)(?![A-Za-z])/,
  percent: /\\%\\operatorname{of}/,
  defined: /\\operatorname{ans}|\\(?:[A-Za-z]+|{|})|[A-Za-z]/,
  other: /./,
});
lexer.next = (next => () => {
  let token;
  while ((token = next.call(lexer)) && token.type === "_");
  return token;
})(lexer.next);
const t = (...n) => d => n.map(i => typeof i === "number" ? d[i] : i);
const b = t(1, 0, 2);
const s = (...n) => t("skip", ...n);
%}

@lexer lexer

stmt -> expr | stmtsingle | stmtdouble
stmtsingle -> expr %op0 expr {% b %}
stmtdouble -> expr %op0 stmtsingle {% b %}
expr -> term | expr %op1 term {% b %}
term -> %op1:? factor | (%op1:? term) %op2 (%op1:? factor) {% b %} | term factor {% t("*", 0, 1) %}
factor -> %number | method | trigmethod | bracket | bracketpara | abs | factor sup {% t("^", 0, 1) %} | frac | sqrt | log | integral | accum | factorial | percent | list | piecewise
char -> [A-Za-z0-9]
chars -> char:+
varsub -> char | "{" chars "}" {% s(1) %}
var -> %defined | %defined "_" varsub {% t("var", 0, 2) %}
para -> %defined | char | bracketpara
sup -> "^" para {% s(1) %}
sub -> "_" para {% s(1) %}
frac -> "\\frac" para para
sqrt -> "\\sqrt" para {% t("√", "2", 1) %} | "\\sqrt" "[" expr "]" para {% t("√", 2, 4) %}
log -> "\\log" callsingle {% t("\\log", "10", 1) %} | "\\log" sub callsingle | "\\ln" callsingle {% t("\\log", "e", 1) %}
arctan -> "\\arctan" sup:? duple {% t("atan2", 1, 2) %} | "\\tan" "^" "{" "-" "1" "}" duple {% t("atan2", 6) %}
trigmethod -> arctan | %trig sup:? callsingle
function -> %operator | var
method -> function call:?
abs -> "\\left" "|" expr "\\right" "|" {% t("abs", 2) %}
args -> expr | argsmany
argsmany -> args "," expr {% s(0, 2) %}
bracket -> "(" expr ")" {% t("bracket", 1) %} | "\\left" "(" expr "\\right" ")" {% t("bracket", 2) %}
bracketpara -> "{" expr "}" {% s(1) %}
call -> "(" argsmany ")" {% s(1) %} | "\\left" "(" argsmany "\\right" ")" {% s(2) %}
callsingle -> bracket | expr
duple -> "(" expr "," expr ")" {% s(1, 3) %} | "\\left" "(" expr "," expr "\\right" ")" {% s(2, 4) %}
integral -> "\\int" sub sup term "d" var {% t("integral", 5, 1, 2, 3) %}
accum -> ("\\sum" | "\\prod") "_" "{" var "=" expr "}" sup term {% t(0, 3, 5, 7, 8) %}
factorial -> term "!" {% t("factorial", 0) %}
percent -> term %percent term {% t("percent", 0, 2) %}
list -> "[" args:? "]" {% t("list", 1) %} | "\\left" "[" args:? "\\right" "]" {% t("list", 2) %}
piecewisearg -> stmt {% t("condition", 0) %} | stmt ":" expr {% t("condition", 0, 2) %}
piecewiseargs -> piecewisearg | piecewiseargs "," piecewisearg {% s(0, 2) %}
otherwise ->  "," expr {% t("condition", 1) %}
conditions -> piecewiseargs otherwise:? {% s(0, 1) %}
piecewise -> "\\{" conditions:? "\\}" {% t("piecewise", 1) %} | "\\left" "\\{" conditions:? "\\right" "\\}" {% t("piecewise", 2) %}
