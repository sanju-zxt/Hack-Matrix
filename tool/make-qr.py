"""Generate the compact QR SVG used by the brochure for the event website.

    python tool/make-qr.py

Writes brochure/hack-matrix-qr.svg — a run-length path (one <path>, no rects) so the
inlined data URI stays small enough to embed in the printable HTML.
"""
import os
import sys

import qrcode

URL = os.environ.get("BROCHURE_URL", "https://hack-matrix-lac.vercel.app")
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "brochure", "hack-matrix-qr.svg")

TEMPLATE = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {n} {n}" '
    'shape-rendering="crispEdges" role="img" aria-label="QR code: {url}">'
    '<rect width="{n}" height="{n}" fill="#ffffff"/>'
    '<path fill="#0b3d1f" d="{d}"/>'
    "</svg>"
)


def main() -> int:
    qr = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_H, border=2, box_size=1)
    qr.add_data(URL)
    qr.make(fit=True)
    matrix = qr.get_matrix()
    size = len(matrix)

    runs = []
    for y, row in enumerate(matrix):
        x = 0
        while x < size:
            if row[x]:
                start = x
                while x < size and row[x]:
                    x += 1
                runs.append("M%d %dh%dv1h-%dz" % (start, y, x - start, x - start))
            else:
                x += 1

    svg = TEMPLATE.format(n=size, url=URL, d=" ".join(runs))
    with open(os.path.abspath(OUT), "w", encoding="utf-8") as fh:
        fh.write(svg)
    print("[qr] %s (%dx%d modules, %d bytes)" % (os.path.abspath(OUT), size, size, len(svg)))
    return 0


if __name__ == "__main__":
    sys.exit(main())