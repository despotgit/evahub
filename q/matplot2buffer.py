# This is a bit ugly solution I often use, but I found it easiest to use in many cases.
# from answers to https://stackoverflow.com/questions/1381741/converting-latex-code-to-images-or-other-displayble-format-with-python
import matplotlib.pyplot as plt
import io
from PIL import Image, ImageChops

white = (255, 255, 255, 255)

def latex_to_img(tex):
    buf = io.BytesIO()
    plt.rc('text', usetex=True)
    plt.rc('font', family='serif')
    plt.axis('off')
    plt.text(0.05, 0.5, f'${tex}$', size=40)
    plt.savefig(buf, format='png')
    plt.close()

    im = Image.open(buf)
    bg = Image.new(im.mode, im.size, white)
    diff = ImageChops.difference(im, bg)
    diff = ImageChops.add(diff, diff, 2.0, -100)
    bbox = diff.getbbox()
    return im.crop(bbox)

latex_to_img(r'\frac{x}{y^2}').save('img.png')
# Keep in mind, it requires pillow and matplotlib.

# pip install matplotlib pillow