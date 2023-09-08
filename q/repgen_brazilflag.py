# generate reports from 
# History   23.05.23   regexp 
#                    integrate python-jsonplot_V1
#           07.08.23 include tex for footer header nice tables 
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
pattern = r"<-(.*?)->" #regular expression
markdown_lines = []
 
with open(filename, "r") as file:
    for line in file:
        match = re.search(pattern, line)
        if match:
            matched_text = match.group(0)
            print("Match found:", matched_text)
            # Your code goes here
            # Example: Insert a figure
            plt.plot([1, 2, 3, 4], [1, 4, 9, 16])
            plt.xlabel('X-axis')
            plt.ylabel('Y-axis')
            plt.title('Example Figure')

            # Encode the figure as a Base64 string
            buf = io.BytesIO()
            plt.savefig(buf, format='png')
            buf.seek(0)
            base64_string = base64.b64encode(buf.read()).decode('utf-8')

            # Generate Markdown content to include the embedded figure
            # Generate Markdown content for the embedded figure
            markdown_line = f"![Figure](data:image/png;base64,{base64_string})"
            ### brazil-flag
            # markdown_line= f"![Figure](9hAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAHhSURBVDjLjZPLSxtRFIfVZRdWi0oFBf+BrhRx5dKVYKG4tLhRqlgXPmIVJQiC60JCCZYqFHQh7rrQlUK7aVUUfCBRG5RkJpNkkswrM5NEf73n6gxpHujAB/fOvefjnHM5VQCqCPa1MNoZnU/Qxqhx4woE7ZZlpXO53F0+n0c52Dl8Pt/nQkmhoJOCdUWBsvQJ2u4ODMOAwvapVAqSJHGJKIrw+/2uxAmuJgFdMDUVincSxvEBTNOEpmlIp9OIxWJckMlkoOs6AoHAg6RYYNs2kp4RqOvfuIACVFVFPB4vKYn3pFjAykDSOwVta52vqW6nlEQiwTMRBKGygIh9GEDCMwZH6EgoE+qHLMuVBdbfKwjv3yE6Ogjz/PQ/CZVDPSFRRYE4/RHy1y8wry8RGWGSqyC/nM1meX9IQpQV2JKIUH8vrEgYmeAFwuPDCHa9QehtD26HBhCZnYC8ucGzKSsIL8wgsjiH1PYPxL+vQvm5B/3sBMLyIm7GhhCe90BaWykV/Gp+VR9oqPVe9vfBTsruM1HtBKVPmFIUNusBrV3B4ev6bsbyXlPdkbr/u+StHUkxruBPY+0KY8f38oWX/byvNAdluHNLeOxDB+uyQQfPCWZ3NT69BYJWkjxjnB1o9Fv/ASQ5s+ABz8i2AAAAAElFTkSuQmCC)"



            # tex_line = "data:image/png;base64,{base64_string}"
            # subprocess.check_call(['pdflatex', 'mylatex.tex'])  #produziert pdf aus dem tex file
            markdown_lines.append(markdown_line)
            
            plt.close()
            # you can use the markdown_content variable to write the 
            #  Markdown content to a file or use it in anyway
# Join the Markdown lines to form the complete Markdown content
markdown_withplot = "\n".join(markdown_lines)
print("Markdown content:")
print(markdown_withplot)
# Write the Markdown content to the output file
with open("testoutput.tex", "w") as file:
    file.write(markdown_withplot)



#######################################################
# Your code to generate the Markdown content goes here
def generateMarkdownContent():
    markdown_content = """
# Heading

This is a paragraph.

- Item 1
- Item 2
- Item 3
"""
    return markdown_content

# Get the Markdown content
markdown_content = generateMarkdownContent()

# Specify the output file path
output_file = "testutput.md"

# Write the Markdown content to the output file
with open(output_file, "w") as file:
    file.write(markdown_content)

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
