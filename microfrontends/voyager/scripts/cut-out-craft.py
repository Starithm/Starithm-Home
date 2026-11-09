# Cuts Voyager 1 out of NASA's PIA17049 render (public/voyager/voyager-1-pia17049.jpg, 1600x900) onto a
# transparent ground, booms and all, for the stage's Golden Record scene. The craft is the one large
# connected shape brighter than the sky; stars are small separate dots and drop out; dark gaps inside the
# truss are closed so the sky doesn't show through the spacecraft.
#   python3 microfrontends/voyager/scripts/cut-out-craft.py
import numpy as np
from PIL import Image
from scipy import ndimage

SRC = 'public/voyager/voyager-1-pia17049.jpg'
OUT = 'public/voyager/voyager-1-cutout-pia17049.webp'
BOX = (505, 55, 1250, 895)  # the whole craft, magnetometer and antennas included

rgb = np.asarray(Image.open(SRC).convert('RGB').crop(BOX)).astype(np.float32)
v = rgb.max(axis=2)
lit = v > 30
# join the thin booms to the body, keep the largest piece, then close the gaps in the truss
joined = ndimage.binary_dilation(lit, iterations=3)
labels, n = ndimage.label(joined)
sizes = ndimage.sum(joined, labels, range(1, n + 1))
craft = labels == (1 + int(np.argmax(sizes)))
solid = ndimage.binary_closing(craft, iterations=6)
solid = ndimage.binary_fill_holes(solid)
# opaque inside the solid body; along the fine booms, alpha follows brightness so they stay thin
body = ndimage.binary_erosion(solid, iterations=4) & ndimage.binary_opening(solid, iterations=6)
# where a star sat on an antenna, closing leaves a small dark wedge: keep only the big solid pieces
bl, bn = ndimage.label(body)
bs = ndimage.sum(body, bl, range(1, bn + 1))
body = np.isin(bl, 1 + np.flatnonzero(bs > 3000))
body = ndimage.binary_dilation(body, iterations=2)
alpha = np.where(body, 255.0, np.clip((v - 18) * 4, 0, 255) * craft)
alpha = ndimage.gaussian_filter(alpha, 0.6)
out = np.dstack([rgb, alpha]).clip(0, 255).astype(np.uint8)
Image.fromarray(out, 'RGBA').save(OUT, quality=90, method=6)
print(OUT, out.shape)
