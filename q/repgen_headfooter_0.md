---
title: Just say hello!
author: My Friend
header-includes: |
    \usepackage{tikz,pgfplots,booktabs}
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \fancyhead[LE,LO]{This is left}

    \fancyfoot[RE,RO]{\today}
    \fancyfoot[CE,CO]{page \thepage \space of 6}
---
abstract: This is a pandoc test with Markdown + HTML

from https://tex.stackexchange.com/questions/139139/adding-headers-and-footers-using-pandoc---

L: Left field		E: Even page
C: Center field		O: Odd page
R: Right field	

H: Header
F: Footer

comment invisible after this : <!-- a normal html comment -->

test with double call of : 
pandoc -i repgen_headfooter.md -o repgen_headfooter.pdf |open -a Preview repgen_headfooter.pdf

its possible to make a markdown template for pandoc 
or a latex template

<div style="page-break-before:always">&nbsp;</div
<p></p>
\newpage 

latex's pagebreak will start a new page and the paragraphs of the old page will be spread out so that the old page will not look like the end of a chapter.


second page

<div style="page-break-after: always;"></div>
\pagebreak

usepackage(booktabs)
https://www.latex-kurs.de/kurse/2017/Kurs1/Teil9/Tabellen/Druck-Tabellen.pdf

\begin{tabular}{llr} \toprule
\multicolumn{2}{c}{Studium}\\ \cmidrule(r){1-2}
Fach & Dauer & Einkommen (\$)\\ \midrule
Info & 2 & 12.75 \\
MST & 6 & 8.20 \\
VWL & 14 & 10.00\\ \bottomrule
\end{tabular}

next is same as use package(tabular}

\begin{tabular}{ l c r }
  1 & 2 & 3 \\
  4 & 5 & 6 \\
  7 & 8 & 9 \\
\end{tabular}

third page with ?worse pagebreak instead of newpage 
---