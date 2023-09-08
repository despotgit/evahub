# generate reports from 
# this script is envoked by the evahub web-interface
# to produce a report from the  
#       markdown template  
#       including the json-files
#                 TestUser/JRC_GridStorage  /EVAL_06_2023.json   graph data 
#                                           /DIR_      directed powerflow data
#                                                join + /HEAD_ moni-period  
#                                           / project description and nominal values
#                                                       
# History   23.05.23   regexp
#           07.08.23 include tex for footer header nice tables 
#                    to do integrate python-jsonplot_V1
#           10.08.23    
# /_INITIATIVES/TecVerb_EnergieSicherheit/JRC_Sabbatical/JS_work/gIt_evahub/evahub/
# gIt_evahub > source my-venv/bin/activate
# test in backend %  python -i repgen_V1.py  ...  CTRL-D
# vscode-explorer : click> output.html -> show preview
import re
import io
import base64
import matplotlib.pyplot as plt

import markdown

filename = "./testfile.txt"
filename = "./repgen_format_22lyx.md"

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
            markdown_line='Insert Code' + str(match) 
            InsFigure = False
            # Your code goes here
            if match=='Image_chart1' : 
                InsFigure = True
            # Example: Insert a figure
                plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
                plt.xlabel('X-axis')
                plt.ylabel('Y-axis')
                plt.title('Example Figure')
            #elif match=='Image_chart2' : InsFigure = True
            #elif match=='Image_fig1' : InsFigure = True
            # match=='Image_fig2' :InsFigure = True
            
            if InsFigure : # Encode the figure as a Base64 string
                buf = io.BytesIO()
                plt.savefig(buf, format='png')
                buf.seek(0)
                base64_string = base64.b64encode(buf.read()).decode('utf-8')
                # Generate Markdown content to include the embedded figure          
                markdown_line = f"![Figure](data:image/png;base64,{base64_string})"
                # ??tex_line = "data:image/png;base64,{base64_string}"
                # subprocess.check_call(['pdflatex', 'mylatex.tex'])  #produziert pdf aus dem tex file           
                plt.close()
            # you can use the markdown_content variable to write the 
            markdown_lines.append(markdown_line)
        else: markdown_lines.append(line)    
        #  Markdown content to a file or use it in anyway
# Join the Markdown lines to form the complete Markdown content
markdown_withplot = "\n".join(markdown_lines)
print("Markdown content:")
#rint(markdown_withplot)
# convert the markdown-content to pdf

# Write the Markdown content to the output file
with open("markdown_out-test.md", "w") as file:
    file.write(markdown_withplot)


output_file="markdown_withplot.md"
# Write the Markdown content to the output file
with open(output_file, "w") as file:
    #file.write(markdown_content)
    file.write(markdown_withplot)
print(f"Markdown content written to {output_file}")

############## Convert Markdown to HTML
html_content = markdown.markdown(markdown_withplot)

##### create preview file output.html ##########################
# Create an HTML template
html_template = f"""
<!DOCTYPE html>
<html>
<head>
    <title>Markdown Preview</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            margin: 20px;
        }}
    </style>
</head>
<body>
    {html_content}
</body>
</html>
"""

# Write the HTML content to a file
output_file = "output.html"
with open(output_file, "w") as file:
    file.write(html_template)

print(f"HTML content written to {output_file}")
