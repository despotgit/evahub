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
#                                                       
# History   23.05.23   regexp
#           07.08.23 include tex for footer header nice tables 
#                    to do integrate python-jsonplot_V1
#           10.08.23 include subproces for call pandoc   
#                    pass filename ./repgen_format_22lyx.md as parameter 
#                    later datafile EVAL_06_2023 as parameter  .json to produce EVAL_06_2023.md and .pdf 
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

filename = "./testfile.txt"
filename = "./repgen_format_22lyx_V0.md"   #version _22lyx_V0 funktioniert
#filename = str(sys.argv[1])
print(str)

# Inhalte in markdown-file einfügen
pattern = r"<-(.*?)->" #regular expression
pattern = r":-(.*?)-:" #regular expression as from lyx export2md
markdown_lines = []
 
with open(filename, "r") as file:
    for line in file:
        match = re.search(pattern, line)
        if match:
            nextmatch = str(match.group(0))
            match=nextmatch.strip(':- ')
            print("Matches found:", str(match))
            # markdown_line='Insert Code' + str(match) 
            # Your code goes here
            if match=='Image_fig1' : 
                print('Image found') 
            # Example: Insert a figure
                plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
                plt.xlabel('X-axis')
                plt.ylabel('Y-axis')
                plt.title('Example Figure')
            #elif match=='Image_chart2' : InsFigure = True
            #elif match=='Image_fig1' : InsFigure = True
            # match=='Image_fig2' :InsFigure = True            
                buf = io.BytesIO()
                plt.savefig(buf, format='png')
                buf.seek(0)
                base64_string = base64.b64encode(buf.read()).decode('utf-8')
                # Generate Markdown content to include the embedded figure          
                markdown_line = f"![Figure](data:image/png;base64,{base64_string})"
                # ??tex_line = "data:image/png;base64,{base64_string}"
                # subprocess.check_call(['pdflatex', 'mylatex.tex'])  #produziert pdf aus dem tex file           
                plt.close()
            else: markdown_line = 'Insert Code' + str(match) 
            # you can use the markdown_content variable to write the 
            markdown_lines.append(markdown_line)
        else: markdown_lines.append(line)    
        #  Markdown content to a file or use it in anyway
# Join the Markdown lines to form the complete Markdown content
markdown_withplot = "\n".join(markdown_lines)
print("Markdown content:")

output_file="markdown_withplot.md"
# Write the Markdown content to the output file
with open(output_file, "w") as file:
    #file.write(markdown_content)
    file.write(markdown_withplot)
print(f"Markdown content written to {output_file}")


#call('pandoc -i repgen_format_22lyx.md -o markdown_withplot.pdf ',shell=True) 
call('pandoc -i markdown_withplot.md -o markdown_withplot.pdf ',shell=True) 
call('open -a Preview ./markdown_withplot.pdf', shell=True)

############## Convert Markdown to HTML
html_content = markdown.markdown('markdown_withplot')

output_file = "markdown_withplot.html"
with open(output_file, "w") as file:
    file.write(html_content)

print(f"HTML content written to {output_file}")
