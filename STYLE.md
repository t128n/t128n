# Style guide: the plain-text personal homepage

This document distills what a set of well-known programmer/researcher
homepages have in common (Daring Fireball, Bjarne Stroustrup, Chris Lattner,
Andrew Kelley, Clark Evans, Niklaus Wirth, Edwin Brady, Thorsten Ball,
Leonardo de Moura), so t128n.dev can be brought closer to that look and
feel. It's a reference for future layout/CSS work, not a redesign itself.

## The aesthetic in one paragraph

An anti-corporate, plain-text-web style that treats the visitor's time and
bandwidth with respect. Style comes from typography, whitespace, and
information density — not from decoration. It looks like it could be
lightly-styled Markdown, and that's the point: several of these sites are
explicitly proud of having "not changed since the 2000s."

## Principles

- **Text is the whole product.** No hero images, no illustrations, no stock
  photography, no marketing copy or taglines — just prose, links, and lists.
- **One constrained reading column.** Content sits in a fixed-width block,
  roughly 600–900px, never full-bleed, with generous whitespace around it.
- **Bare HTML feel.** Default-weight body text, minimal borders, no
  shadows, gradients, rounded "cards," icon sets, or extra UI chrome.
- **Nav is a flat list of text links.** Either pipe/space-separated in one
  row (Stroustrup, de Moura, Ball) or a short vertical list (Gruber,
  Kelley) — never a hamburger, dropdown, or button.
- **Minimal heading hierarchy.** One big H1 (name or site title), optional
  H2s for sections (About, Projects, Contact, Publications). No decorative
  type treatments.
- **Short, factual first-person bio.** "I'm a ___ who does ___." Direct
  statements of role and current work, no pitch language, no adjectives
  selling the person.
- **Headshot photo is optional.** When present: small, unfiltered, often
  black-and-white — never a styled/cropped hero portrait. About half the
  references skip it entirely.
- **Lists for projects/posts/publications.** Link plus a one-line
  description, or for blog indexes just `date — title`. No cards,
  thumbnails, tag pills, or read-time badges.
- **Restrained palette.** Overwhelmingly black/white/gray body text. A
  couple of sites invert to a dark background. The only color accent is
  the link color (near-default blue, or one deliberate accent like a
  yellow underline) — never more than one accent hue.
- **Standard link treatment.** Underlined or colored, no hover animations,
  no icon-adorned buttons.
- **Contact/social links as inline text**, not icon buttons or a contact
  form — email, Mastodon/Bluesky/GitHub/RSS spelled out as words.
- **No modern web chrome.** No cookie banners, popups, newsletter modals,
  share buttons, ads, or JS-driven interactivity beyond basic navigation.
- **Timeless over trendy.** Optimize for low maintenance and longevity, not
  for looking current.

## Anti-patterns to avoid

- Card-based layouts with shadows or rounded corners
- Icon sets / icon buttons for nav or social links
- Hero images, banners, or decorative illustrations
- More than one accent color
- Hover animations, transitions-as-decoration, scroll effects
- Popups, cookie banners, newsletter modals, share widgets
- Tag pills, badges, read-time estimates, thumbnail previews
- Full-bleed layouts (content stretching edge-to-edge on wide screens)
