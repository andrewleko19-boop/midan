"""Outline the wordmarks from Readex Pro (SIL OFL) into SVG path data.
Run once; the result is committed as src/brand/glyphs.json.
  pip install fonttools brotli uharfbuzz
  python scripts/make-glyphs.py
Change the wordmark: edit AR_TEXT / EN_TEXT (or the font files), re-run, then re-run build-assets.
"""
import io, json, pathlib
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

ROOT = pathlib.Path(__file__).resolve().parent.parent
AR_TEXT, EN_TEXT = "مِيدان", "midan"
AR_FONT = ROOT / "fonts/readex-pro-arabic-600-normal.woff2"
EN_FONT = ROOT / "fonts/readex-pro-latin-600-normal.woff2"

def outline(path, text, direction, script, lang):
    tt = TTFont(path); tt.flavor = None
    buf = io.BytesIO(); tt.save(buf)
    font = hb.Font(hb.Face(buf.getvalue()))
    b = hb.Buffer(); b.add_str(text); b.direction = direction; b.script = script; b.language = lang
    hb.shape(font, b, {})
    gs, order = tt.getGlyphSet(), tt.getGlyphOrder()
    fmt = lambda v: ("%.1f" % v).rstrip("0").rstrip(".")
    def run(dx):
        x, parts = 0, []
        bp = BoundsPen(gs)
        for info, pos in zip(b.glyph_infos, b.glyph_positions):
            g = gs[order[info.codepoint]]
            m = (1, 0, 0, -1, x + pos.x_offset + dx, -pos.y_offset)
            sp = SVGPathPen(gs, ntos=fmt); g.draw(TransformPen(sp, m)); parts.append(sp.getCommands())
            g.draw(TransformPen(bp, m)); x += pos.x_advance
        return " ".join(p for p in parts if p), bp.bounds
    _, bounds = run(0)
    d, (x0, y0, x1, y1) = run(-bounds[0])
    return dict(d=d, w=round(x1 - x0, 1), top=round(y0, 1), bottom=round(y1, 1))

out = dict(upm=1000,
           ar=outline(AR_FONT, AR_TEXT, "rtl", "Arab", "ar"),
           en=outline(EN_FONT, EN_TEXT, "ltr", "Latn", "en"))
(ROOT / "src/brand/glyphs.json").write_text(json.dumps(out, ensure_ascii=False))
print({k: {kk: vv for kk, vv in v.items() if kk != "d"} for k, v in out.items() if isinstance(v, dict)})
