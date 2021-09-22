import { Parser, Grammar } from "nearley";
import grammar from "./grammar.ne";
import "./index.css";
import Desmos from "desmos";

const calc = Desmos.GraphingCalculator(document.getElementById("calculator"));
calc.setExpression({ latex: "x^{2}+y^{2}=10" });

const output = document.getElementById("output");
calc.observeEvent("change", function () {
  try {
    output.textContent = new Parser(Grammar.fromCompiled(grammar))
      .feed(
        calc
          .getExpressions()
          .find(exp => exp.latex)
          .latex.replace(/\\? /g, "")
      )
      .results[0].flat(Infinity)
      .filter(n => n).length;
  } catch {
    output.textContent = "?";
  }
});
