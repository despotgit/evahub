# generate reports from filename to filename.pdf
# 
# this script is envoked by the evahub web-interface
# test in gIt_evahub > cd /evahub/backend 
# >repgen_V2_graph  mm_yyyy  (eg * => 06_2023)  (EVAL_*.json DIR_*json filename) to output *.md and *.pdf
# to produce a report from the  
#       markdown template  repgen_format_22lyx.md
#       by including data from the json-files
#                 TestUser/JRC_GridStorage  /EVAL_06_2023.json   graph data 
#                                           /DIR_        .json directed powerflow data
#                                                join + /HEAD_      .json moni-period  
#                                           /project description and nominal values
# History   23.05.23   regexp
#           07.08.23 include tex for footer header nice tables 
#                    .. to do integrate python-jsonplot_V1
#           10.08.23 include subproces for call pandoc   
#                    pass filename ./repgen_format_22lyx.md as parameter 
#                    later datafile EVAL_06_2023 as parameter  .json to produce EVAL_06_2023.md and .pdf 
# 
# /_INITIATIVES/TecVerb_EnergieSicherheit/JRC_Sabbatical/JS_work/gIt_evahub/evahub/
# gIt_evahub > source my-venv/bin/activate
# test in > cd evahub/backend %  
#         > python -i repgen_V2_graph.py  ...  CTRL-D
# vscode-explorer : click> output.html -> show preview

import re
import io
import base64
import matplotlib.pyplot as plt

import markdown
from subprocess import call

import sys

filename = "./repgen_format_22lyx_V1.md"   #version _22lyx_V0.md funktioniert

#filename = str(sys.argv[1])
#print(str)

# Inhalte in markdown-file einfügen
pattern = r":-(.*?)-:" #regular expression as from lyx export2md
markdown_lines = []
 
with open(filename, "r") as file:
    for line in file:
        match = re.search(pattern, line)
        if match:
            nextmatch = str(match.group(0))
            match=nextmatch.strip(':- ') # . - und Leerzeichen
            # print("Matches found:", str(match))
              # markdown_line='Insert Code' + str(match) 
            InsFigure = False
            # Your code goes here
            if match=='Image_chart1' : 
                InsFigure = True
                print("Insert ",str(match))
            # Example: Insert a figure
                plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
                plt.xlabel('X-axis')
                plt.ylabel('Y-axis')
                plt.title('Example Figure')
            #elif match=='Image_chart2' : InsFigure = True
            #elif match=='Image_fig1' : InsFigure = True
            #elif match=='Image_fig2' :InsFigure = True
            
            if InsFigure : # Encode the figure as a Base64 string
                buf = io.BytesIO()
                plt.savefig(buf, format='png')
                buf.seek(0)
                base64_string = base64.b64encode(buf.read()).decode('utf-8')
                # Generate Markdown content to include the embedded figure          
                figure_line = f"![Figure](data:image/png;base64,{base64_string})"    
                plt.close()
                markdown_lines.append(figure_line)

            # else :               # json_lines eintragen
        else : markdown_lines.append(line)
# Join the Markdown lines to form the complete Markdown content
markdown_withplot = "\n".join(markdown_lines)
print("Markdown content:")
print(markdown_withplot)

output_file="markdown_withplot.md"
# Write the Markdown content to the output file
with open(output_file, "w") as file:
    #file.write(markdown_content)
    file.write(markdown_withplot)
print(f"Markdown content written to {output_file}")

call('pandoc -i markdown_withplot.md -o markdown_output.pdf ',shell=True) # after insert

#call('pandoc -i '+str(filename)+' -o markdown_output.pdf ',shell=True) # before insert
call('', shell=True)

############## Convert Markdown to HTML
html_content = markdown.markdown('markdown_withplot')

output_file = "markdown_withplot.html"
with open(output_file, "w") as file:
    file.write(html_content)

print(f"HTML content written to {output_file}")
