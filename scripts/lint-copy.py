#!/usr/bin/env python3
"""Check the site copy against the rules the presentation research produced.

Run: python3 scripts/lint-copy.py
Exit code 1 if anything fails, so it can gate a build.

Every rule here traces to a source: Morkes and Nielsen 1997 on objective and
concise style, Gopen and Swan on topic and stress position, the Federal Plain
Language Guidelines on tables, and NN/g on scanning.
"""
import re, sys, pathlib, json

ROOT = pathlib.Path(__file__).resolve().parent.parent
FAIL = []

def fail(where, rule, detail):
    FAIL.append((where, rule, detail))

# --- rules that apply to any sentence of prose -------------------------------

BANNED_ADJECTIVES = [
    "promising", "powerful", "robust", "seamless", "cutting-edge",
    "state-of-the-art", "comprehensive", "critical", "actually",
    "genuinely", "truly", "simply", "significantly", "substantially",
    "dramatically", "considerably", "essential",
]
# quantity words used with no quantity attached
QUANTITY_NO_NUMBER = ["a fraction of", "several ", "many ", "a good deal", "a lot of"]
# the closing clause that grades the argument instead of advancing it
EDITORIAL_TAILS = [
    r", rather than [^.]*\.", r", not a [^.]*\.", r"which is exactly [^.]*\.",
    r"and that is the point", r", and that matters", r"by design, not by accident",
    r"is what makes .* defensible", r"which is the strongest evidence",
]
# sentences whose subject is the previous sentence
META_OPENERS = [
    "This is what makes", "That is precisely why", "This unifies",
    "The insight is", "The insight it is built on", "This answers",
    "What comes out the other side", "That last line matters",
]
# "X is not A, it is B"
NOT_X_BUT_Y = [r"\bis not [^.,]{3,40}, it is\b", r"\bnot [^.,]{3,40}, but\b"]
HIDDEN_VERBS = ["perform", "conduct", "carry out", "make use of", "give rise to",
                "has the effect of", "serves to", "is responsible for"]

def check_prose(path, text):
    for adj in BANNED_ADJECTIVES:
        for m in re.finditer(rf"\b{re.escape(adj)}\b", text, re.I):
            fail(path, "banned-adjective", f"{adj}: ...{text[max(0,m.start()-40):m.start()+40]}...")
    for q in QUANTITY_NO_NUMBER:
        for m in re.finditer(re.escape(q), text, re.I):
            fail(path, "quantity-without-quantity", f"{q.strip()}: ...{text[max(0,m.start()-40):m.start()+50]}...")
    for pat in EDITORIAL_TAILS:
        for m in re.finditer(pat, text, re.I):
            fail(path, "editorial-tail", m.group(0)[:90])
    for op in META_OPENERS:
        if op in text:
            fail(path, "meta-sentence", op)
    for pat in NOT_X_BUT_Y:
        for m in re.finditer(pat, text, re.I):
            fail(path, "not-x-but-y", m.group(0)[:90])
    for hv in HIDDEN_VERBS:
        for m in re.finditer(rf"\b{re.escape(hv)}s?\b", text, re.I):
            fail(path, "hidden-verb", f"{hv}: ...{text[max(0,m.start()-30):m.start()+45]}...")

# --- data/*.ts: the scan lines ----------------------------------------------

def check_data():
    src = (ROOT / "data/projects.ts").read_text()
    for m in re.finditer(r'id: "([^"]+)"(.*?)\n  \},', src, re.S):
        pid, body = m.group(1), m.group(2)
        s = re.search(r'summary:\s*\n?\s*"(.*?)",\n', body, re.S)
        if s:
            words, chars = len(s.group(1).split()), len(s.group(1))
            if words > 13 or chars > 70:
                fail(f"data/projects.ts:{pid}", "scan-line-too-long",
                     f"{words} words / {chars} chars: {s.group(1)}")
            if not re.search(r"\d", s.group(1)):
                fail(f"data/projects.ts:{pid}", "summary-has-no-number", s.group(1))
        r = re.search(r'result:\s*\n?\s*"(.*?)",\n', body, re.S)
        if r:
            first4 = " ".join(r.group(1).split()[:4])
            if not re.search(r"\d", first4):
                fail(f"data/projects.ts:{pid}", "number-not-in-first-four-words", r.group(1))

# --- content/*.md: the write-ups --------------------------------------------

WRITEUP_WORD_CAP = 400

def check_writeups():
    for f in sorted((ROOT / "content").rglob("*.md")):
        text = f.read_text()
        rel = str(f.relative_to(ROOT))
        n = len(text.split())
        if n > WRITEUP_WORD_CAP:
            fail(rel, "write-up-over-budget", f"{n} words (cap {WRITEUP_WORD_CAP})")
        check_prose(rel, text)
        # a section that claims results must contain a number
        for m in re.finditer(r"^## (.+)$", text, re.M):
            title = m.group(1)
            start = m.end()
            nxt = text.find("\n## ", start)
            body = text[start: nxt if nxt > 0 else len(text)]
            if re.search(r"result|measure|benchmark|performance", title, re.I) and not re.search(r"\d", body):
                fail(rel, "results-section-without-a-number", title)
        # duplicated paragraphs inside one file
        paras = [p.strip() for p in text.split("\n\n") if len(p.split()) > 12]
        seen = {}
        for p in paras:
            key = " ".join(p.lower().split())[:80]
            if key in seen:
                fail(rel, "duplicate-paragraph", p[:80])
            seen[key] = True

check_data()
check_writeups()

if FAIL:
    by_rule = {}
    for where, rule, detail in FAIL:
        by_rule.setdefault(rule, []).append((where, detail))
    for rule in sorted(by_rule, key=lambda r: -len(by_rule[r])):
        items = by_rule[rule]
        print(f"\n{rule}  ({len(items)})")
        for where, detail in items[:8]:
            print(f"  {where}\n    {detail}")
        if len(items) > 8:
            print(f"  ... and {len(items)-8} more")
    print(f"\n{len(FAIL)} problems across {len(by_rule)} rules")
    sys.exit(1)
print("copy lint: clean")
