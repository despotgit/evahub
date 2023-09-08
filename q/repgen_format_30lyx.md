---
header-includes: |
    \usepackage{tikz,pgfplots,booktabs}
    \usepackage{fancyhdr}
    \pagestyle{fancy}
    \fancyhead[LE,LO]{§_§-Storage_System_Name}
    \fancyhead[CE,CO]{page \thepage \space of 6}
    \fancyhead[RE,RO]{§_§-MoniPeriod}
    \fancyfoot[LE,LO]{§_§-Monitoring_System_Operator}
    \fancyfoot[CE,CO]{\today}
    \fancyfoot[RE,RO]{§_§Author}
---

<!-- History 11/8/23 insert pagebreaks and header-footer and booktables from repgen_header_footer_graph.md   -->
<!--         24/8/23 version repgen_format_30.lyx to include figures.png in pandoc latex run  -->
<!--         remove !  from ![image]> to avoid autoplacement of figures https://www.markdownguide.org/basic-syntax/ -->


# Monitoring of Storage Unit in the Grid Structure {#monitoring-of-storage-unit-in-the-grid-structure .unnumbered}

::: center

  --------------------- --------------------
  SITE :                §§-Storage_System_Name
  OPERATOR :            §§-Monitoring_System_Operator
  MONITORING PERIOD :   §§-MoniPeriod
  EVALUATION DATE :     §§-EvaDate
  --------------------- --------------------

:::

<!-- ## Introduction {#introduction .unnumbered} -->
\
\
work with latex_makros :<https://pandoc.org/MANUAL.html#latex-macros>
This report provides analysis and presentation of measured data for the storage system

:- SiteId -:

:- SiteDescription

The storage unit is located at

It enables installation and operation of an enlarged PV-Generator with 2.5 times higher peak power by means of buffering PV generation, ensuring the line power to stay within the limits allowed.

-:

The report is conforming with the EC Guidelines for unified monitoring and performance assessement of storage-units in the grid structure.

Thus, it reveals energy balancing in a subgrid, characterized by both energy surplus and autonomy ratio. Further it quantifies and details contribution of the storage unit to grid control and balancing, and thus relief of the utility interface, resp. power line.

In the form of directed power-flows, monitoring data is suitable for spatial aggregation with results from other storage units in a common grid area.

Further to reporting for storage and distribution system operators, guideline conformant data and monitoring evaluation qualify for sharing performance experience, e.g. in the JRC's storage observatory.

## General Data {#general-data .unnumbered}

  ------------------- --------------------------------------- -------------------------------------------
  Storage Unit        Nominal Power/\[MW\]: §§-Storage_nominal_power-§§:    Nominal Capacity/\[MWh\]: $$-Storage_nominal_energy_capacity-§§
  Utility Interface   Nominal Power/\[MW\]: §§-UIP_nominal_power-§§   Site : §§-Utility_InterConnection_Name-§§
  ------------------- --------------------------------------- -------------------------------------------


<div style="page-break-before:always">&nbsp;</div
<p></p>
\newpage

## Energetic Balances  {#energetic-balances .unnumbered}

In line with recording format from independent metering, the total energies in the monitoring period sum up to :

  --------- --------------- ----- ---------------- -----
                      Input                 Output 
  Subgrid              17.5 MWh               19.5 MWh
  Utility              30.0 MWh               30.0 MWh
  Storage              28.0 MWh               25.0 MWh
  --------- --------------- ----- ---------------- -----

with the total difference between in- and outputs covering the storage losses.

In accumulation of directed powerflows, the energy exchanges of the storage unit with subgrid surpluses(net generation) and deficits(net-load), and with the utility can be distinguished from the direct flows between subgrid and utility.

  ----------------------------- --------------- -----
  net-generation to utility               19.58 MWh
  storage from net-generation             25.00 MWh
  storage from utility                     3.21 MWh
  storage to utility                       2.73 MWh
  storage to net-load                     25.07 MWh
  net-load from utility                   30.84 MWh
  ----------------------------- --------------- -----

## Exchange Yields {#exchange-yields .unnumbered}

Normalizing the directed powerflows, to the nominal power of the storage unit, is resulting in yields, comparable for units of different sizes. Chart 1 shows the exchange yields in their daily averages .

::: center

\includegraphics[scale=0.8]{Image_chart1.png}

:::

::: center
Chart 1 : Average DailyYields
:::

<div style="page-break-before:always">&nbsp;</div
<p></p>
\newpage

Accordingly, chart 2 shows the hourly averages of the exchange yields, reflecting average operation in the daily course.

::: center
§§-Image_chart2
:::

::: center
chart 2 : Average HourlyYields
:::

## Storage Performance in the Grid  {#storage-performance-in-the-grid .unnumbered}

Performance is resulting from average yields in the monitoring period, indicating the contribution of the storage unit to balancing. control. This compares to the total balancing need of the subgrid and the remaining balancing control, required from the utility interface.

**Subgrid Yields**

  --------- ----------------- ---------- -------- ----------------- ----------
   Input :  \_\_\_             Output :   \_\_\_   Balance Depth :   10.5 hrs
  --------- ----------------- ---------- -------- ----------------- ----------

**Utility Yields**

  --------- ----------------- ---------- -------- ----------------- ----------
   Input :           \_\_\_    Output :   \_\_\_   Balance Depth :   17.0 hrs
  --------- ----------------- ---------- -------- ----------------- ----------

**Storage Yields**

  ----------------------- ---------- -------------- -------- ----------------- ----------
  Input :                   \_\_\_    Throughput :   \_\_\_   Balance Depth :   23.0 hrs
  Subgrid Balancing                                  \_\_\_                     20.5 hrs
  Shifted Generation                                 \_\_\_                     2.0 hrs
  Shifted Load Coverage                                                         0.5 hrs
  ----------------------- ---------- -------------- -------- ----------------- ----------

Operation of the storage unit in time-shift of generation surplus, resp. of load deficit, is separated from operation in balancing the subgrid generation surplus with its load deficit. Time-shift operation reflects operation control performance and includes all exchanges with the utility interface, as well as planned services as unplanned. The storage usage and the longterm energetic losses are characterized by

  ------------------ ------- -------------------------- -----
  Recharge Ratio :   112 %   Equivalent Full-Cycles :   120
  ------------------ ------- -------------------------- -----

<div style="page-break-before:always">&nbsp;</div
<p></p>
\newpage 

## Utility Interface Relief {#utility-interface-relief .unnumbered}

Further resolving the balancing needs over increasing timespans, resp. balancing periods, results in the Balance Duration Curve of throughput, and the corresponding capacity as integral over the periods, visible as area under the curves.

::: center
:-Image_fig1-:
:::

::: center
figure 1 : Yields vs Balance-Durations before and behind Storage
:::

With the balancing yields of the subgrid in red, storage is balancing net-power yields over the red area for the balancing capacity employed, the normalized balance depth in \[hrs\]. The residual utility balance duration curve in blue remains to be compensated by the outer grid infrastructure, with the blue area for the total balancing depth required.
\
\
Complementary to the energetic balancing, the effect of storage unit operation on releasing the grid interface from power amplitude is quantified.

<div style="page-break-before:always">&nbsp;</div
<p></p>
\newpage 

::: center
[image]
§§-Image_fig2
:::

:::
figure 2 : Yields vs Power-Durations before and behind Storage
:::

This graph reveals how storage operation is modifying the characteristics of normalized power yields. For the subgrid yields in red, allocated storage is releasing the utility interface, which then covers the blue part only.

<div style="page-break-before:always">&nbsp;</div
<p></p>
\newpage 
## Subgrid Coverage Performance Ratios {#subgrid-coverage-performance-ratios .unnumbered}

In relation to the average net load yield $\bar{Y}_{NL}$ in the monitoring period, subgrid coverage is characterized by performance ratios. Storage and utility are covering the total net load of the subgrid

  ------------- ------------------- ------------------ -------------------
                 Net-Surplus Ratio   Throughput Ratio   Net-Load Coverage
   **Subgrid**         120 %              100 %              21 hrs
     Utility           50 %                30 %             14.5 hrs
     Storage           70 %                70 %              6.5 hrs
  ------------- ------------------- ------------------ -------------------

## Annuities {#annuities .unnumbered}

Based on storage unit power cost of :- PowCost -: Euro per MW-: , and capacity_cost of :- CapCost -: Euro per MWh on a financing term of :- FinTerm -: years and :- OpEx -:% operation costs, the annuities are resulting as:

  --------------------------- ---------- ---------- -----------
   Total expenditure annuity   power      capacity   operation
          23 Euro/MWh            32%        60%         8%
  --------------------------- ---------- ---------- -----------
