markdown test

I have found the answer at the subheading Try exporting a LyX document at this web-page https://wiki.lyx.org/Tips/ExportingOpenDocumentLibreofficeOpenofficeAndOfficeOpenXMLMSWordWithPandoc https://wiki.lyx.org/Tips/ExportingOpenDocumentLibreofficeOpenofficeAndOfficeOpenXMLMSWordWithPandoc If not all goes well, you will see a warning box with a message like Error while running pandoc -s -f latex -o \$\$o -t docx \$\$i

lyx \--force-overwrite \--export latex newfile3.lyx \| pandoc \--from latex \--to markdown -o mydocument.md

lyx --force-overwrite --export latex \$\$i \| pandoc \--from latex \--to markdown -o \$\$o

That's most likely because LyX is not sending Pandoc a file with the proper encoding. For a quick fix try: Document \> Settings, go to the Language section, and under Encoding select Other: Unicode (utf8). Try exporting again. If that works now, then encoding was the problem. See the Troubleshooting section for a way to ensure that all your new LyX documents have the proper encoding setting. If you still get the warning message, see Troubleshooting below.
