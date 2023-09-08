# pip install markdown-exec[ansi]
# docs in https://pawamoy.github.io/markdown-exec/
# This extension relies on the SuperFences extension of PyMdown Extensions.
# To allow execution of code blocks, configure a custom fence from Python:

from markdown import Markdown
from markdown_exec import formatter, validator

Markdown(
    extensions=["pymdownx.superfences"],
    extension_configs={
        "pymdownx.superfences": {
            "custom_fences": [
                {
                    "name": "python",
                    "class": "python",
                    "validator": validator,
                    "format": formatter,
                }
            ]
        }
    }
)
