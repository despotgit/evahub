---
title: "Title"
author: "Me"
output:
  bookdown::pdf_document2:
    keep_tex: yes
    latex_engine: xelatex
---

<-- https://www.overleaf.com/latex/templates/tagged/report -->
<-- from https://stackoverflow.com/questions/56616781/using-bullets-list-in-tikzs-node-label-in-rmarkdown/56618770#56618770 -->

```{tikz tikz-ex, echo=FALSE, fig.cap = "Funky tikz", fig.ext = 'pdf', cache=FALSE, eval=TRUE, engine.opts = list(template = "tikz2pdf.tex")}
\usetikzlibrary{
shapes,
arrows
}
\begin{tikzpicture}

\node[stile] (a){
\begin{minipage}{2.5cm}
p
\begin{myBullets}
\item first item
\item second item
\end{myBullets}
\end{minipage}
};

\end{tikzpicture}
```
