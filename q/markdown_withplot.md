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



Insert CodeSiteId


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

§§-Image_chart1

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

![Figure](data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHgCAYAAAA10dzkAAAAOXRFWHRTb2Z0d2FyZQBNYXRwbG90bGliIHZlcnNpb24zLjYuMywgaHR0cHM6Ly9tYXRwbG90bGliLm9yZy/P9b71AAAACXBIWXMAAA9hAAAPYQGoP6dpAABPUklEQVR4nO3dd3gUdeLH8c+mF5JAQg1JSCK9946gIIqIBRUVpMOhIqDYQA4Vf0r0bKfieSehiRQrqNhA6UoJJDSRHkIooZOeTbI7vz84ckaKQZLMJvN+Pc8+j/vdmexnxyH7yXxnZ22GYRgCAACAZbiZHQAAAACliwIIAABgMRRAAAAAi6EAAgAAWAwFEAAAwGIogAAAABZDAQQAALAYCiAAAIDFUAABAAAshgIIAABgMRRAAAAAi6EAAgAAWAwFEAAAwGIogAAAABZDAQQAALAYCiAAAIDFUAABAAAshgIIAABgMRRAAAAAi6EAAgAAWAwFEAAAwGIogAAAABZDAQQAALAYCiAAAIDFUAABAAAshgIIAABgMRRAAAAAi6EAAgAAWAwFEAAAwGIogAAAABZDAQQAALAYCiAAAIDFUAABAAAshgIIAABgMRRAAAAAi6EAAgAAWAwFEMAVzZ49Wzab7bK3lStXmh2xWERGRmrIkCHF9vOGDBly2W22ZMmSgu168ODBYntOACgqD7MDACgbZs2apfr161803rBhQxPSlA2+vr5avnz5ReP169dXXl6e1q1bpxo1apiQDIDVUQABFEnjxo3VunVrs2OUKW5ubmrfvv1lH69SpUoppvmfrKws+fn5mfLcAFwDU8AAisXChQtls9k0bdq0QuPPP/+83N3dtWzZsoKxKVOmqF27dgoODlZgYKBatmypGTNmyDCMQutGRkbqtttu05IlS9SiRQv5+vqqQYMGWrJkiaTz09MNGjSQv7+/2rZtq02bNhVaf8iQIapQoYJ+/fVXde/eXf7+/qpSpYoeffRRZWVl/elrSktL05NPPqmoqCh5eXmpZs2aeuyxx5SZmflXN1OBS00BG4ahqVOnqlatWvLx8VHr1q21bNkydevWTd26dbviupK0cuXKi6blu3XrpsaNG2v16tXq2LGj/Pz8NGzYsBJ/fQBcG0cAARSJw+FQfn5+oTGbzSZ3d3dJ0v33369Vq1bpiSeeUPv27dW6dWstX75cL730kp599lnddNNNBesdPHhQo0aNUkREhCRp/fr1GjNmjI4cOaLnnnuu0HNs3bpVEydO1KRJkxQUFKQpU6aob9++mjhxon766SdNnTpVNptNzzzzjG677TYlJibK19e3YP28vDzdeuutGjVqlCZMmKBffvlFL730kpKSkvT1119f9vVmZWWpa9euOnz4sJ599lk1bdpUv/76q5577jlt375dP/74o2w2259utyttsz+aNGmSYmJi9Le//U19+/ZVcnKyRowYoby8PNWtW/dPn+tyjh07pgcffFBPP/20pk6dKjc3t2J7fQDKKAMArmDWrFmGpEve3N3dCy2bk5NjtGjRwoiKijJ27txpVKtWzejatauRn59/2Z/vcDiMvLw848UXXzRCQkIMp9NZ8FitWrUMX19f4/DhwwVjW7ZsMSQZNWrUMDIzMwvGFy9ebEgyvvrqq4KxwYMHG5KMt99+u9Bzvvzyy4YkY+3atYWea/DgwQX3Y2JiDDc3NyMuLq7Qup999pkhyfj222+vuN0uPPcfb506dTIM43/bNTEx0TAMwzhz5ozh7e1t3HfffYV+zrp16wxJRteuXQvG/rjuBStWrDAkGStWrCgY69q1qyHJ+Omnnwote62vD0DZxhFAAEXy4YcfqkGDBoXG/niEyNvbW5988olatWqlli1bKjAwUAsWLLjoiNfy5cs1depUxcXFKS0trdBjJ06cULVq1QruN2/eXDVr1iy4fyFDt27dCp3HdmE8KSnpouwDBgwodL9///6aNGmSVqxYoU6dOl3y9S5ZskSNGzdW8+bNCx3Fu/nmmwumWXv16nXJdS/w9fXV6tWrC40FBARcctn169fLbrerX79+hcbbt2+vyMjIKz7Pn6lUqZJuvPHGQmPF8foAlF0UQABF0qBBgyJ9CKR27drq0qWLvvnmGz388MMXfcp148aN6tmzp7p166bp06crLCxMXl5eWrx4sV5++WVlZ2cXWj44OLjQfS8vryuO5+TkFBr38PBQSEhIobHq1atLkk6fPn3Z13H8+HHt27dPnp6el3z81KlTl133Ajc3tyJ/cOZClt+X3wsuNXY1LvVJ4+J4fQDKLgoggGIVGxurb775Rm3bttW0adN03333qV27dgWPL1y4UJ6enlqyZIl8fHwKxhcvXlwiefLz83X69OlCJTAlJUWSLiqGv1e5cmX5+vpq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oeB2wWeffabOnTurevXqqlChgiZPnqxDhw4V+nn33nuv+vbtq5iYGL3xxhsF5e9Sxo4dq5deekmdOnXS888/r23btpXMiwSAv4gCCKDcWbdund566y19+eWX6tChg4YPHy7DMPTiiy9qy5YtBTdJWr9+ve6//3716tVLS5YsUUJCgiZNmqTc3NxCPzMrK0ubN2+Wu7u79u7de8XnHzFihA4cOKCBAwdq+/btat26td59992SerkAcNUogADKlezsbA0ePFijRo1Sjx49FBsbq7i4OP3nP/9R1apVVbt27YKbJP3888+qVauWJk2apNatW6tOnTpKSkq66Oc+8cQTcnNz03fffad33nlHy5cvv2KO8PBwPfTQQ/riiy/0xBNPaPr06SXyegHgr6AAAihXJkyYIKfTqVdffVWSFBERoTfeeENPPfWUDh48eNHytWvX1qFDh7Rw4ULt379f77zzjhYtWlRomW+++UYzZ87UvHnzdNNNN2nChAkaPHiwzp49e8kMjz32mH744QclJiYqPj5ey5cvV4MGDYr9tQLAX8WHQACUG6tWrVL37t21cuVKde7cudBjN998s/Lz8/Xjjz/KZrMVeuzpp5/WzJkzZbfb1bt3b7Vv314vvPCCzp07p5MnT6pJkyYaN26cJk6cKEnKz89Xp06dFBkZqY8//viiD4GMGTNG3333nQ4fPqzAwEDdcssteuuttxQSElJq2wIAroQCCAAAYDFMAQMAAFgMBRAAAMBiKIAAAAAWQwEEAACwGAogAACAxVAAAQAALIYCCAAAYDEUQAAAAIuhAAIAAFgMBRAAAMBiKIAAAAAWQwEEAACwmP8HZYfshtLKmqoAAAAASUVORK5CYII=)
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



Insert CodePowCost


  --------------------------- ---------- ---------- -----------

   Total expenditure annuity   power      capacity   operation

          23 Euro/MWh            32%        60%         8%

  --------------------------- ---------- ---------- -----------
