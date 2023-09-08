
# in /Users/jsachau/_INITIATIVES/TecVerb_EnergieSicherheit/JRC_Sabbatical/JS_work/gIt_evahub/evahub/backend'

import json

import matplotlib.pyplot as plt
import numpy as np

# run with Python 3.9.15 github_venv :conda
# backend > source github_venv/bin/activate
#  evahub> % python -i "backend/python-jsonplot.py"    end with CTRL+D
#                    interactive in the treminal
# %matplotlibdata = ()
with open("TestUser/JRC_GridStorage/EVAL_06_2023.json", "r") as read_file:
    data = json.load(read_file)
keylist = list(data.keys())  # liefert Liste der Schlüssel set( liefert set)
data_list = list(data.values())  # liefert die Inhaltedict
# numpy arrays erzeugen
PD_sub = np.asarray(data_list[1])
PD_UIP = np.asarray(data_list[2])
BalD_sub = np.asarray(data_list[3])
BalD_UIP = np.asarray(data_list[4])
Dirflo_day = np.asarray(data_list[5])
Dirflo_hr = np.asarray(data_list[6])
Powflo_day = np.asarray(data_list[7])
Powflo_hr = np.asarray(data_list[8])


# type(data)
# fig1 = plt.figure()  # an empty figure with no Axes
# fig1, ax = plt.subplots()  # a figure with a single Axes

# plot
fig1, ax1 = plt.subplots()
ax1.plot(PD_sub[:, 0], PD_sub[:, 1], linewidth=2.0)
# Axes
# ax1.set(xlim=(0, 720), xticks=np.arange(1, 8),
#       ylim=(0, 1), yticks=np.arange(0, 0.2))
ax1.set(xlim=(0, 720),
        ylim=(-1, 1))
plt.show()
