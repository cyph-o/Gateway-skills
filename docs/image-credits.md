# Photography — licensing and provenance

## Licence

Every photograph on this site is **CC0 1.0 / Public Domain Dedication**, sourced
via the [Openverse](https://openverse.org) index from StockSnap.io and RawPixel.
CC0 means no attribution is required and commercial use is unrestricted — the
safest footing available for a commercial site.

| File | Subject | Source | Licence |
| --- | --- | --- | --- |
| `care-dignity-*` | An older person's hand resting in a carer's hands | RawPixel | CC0 1.0 |
| `care-support-*` | A carer steadying a walking frame | RawPixel | CC0 1.0 |
| `leadership-team-*` | Manager leading a discussion around a table | StockSnap | CC0 1.0 |
| `leadership-review-*` | Colleagues reviewing documents together | StockSnap | CC0 1.0 |
| `automation-desk-*` | Administrator working at a laptop | StockSnap | CC0 1.0 |
| `automation-admin-*` | Administrator at a laptop in an office | StockSnap | CC0 1.0 |

## Derived plates

The same six originals also produce wide background plates (`bg-*`, 1800px) and
hero plates (`hero-*`, 2000px) for the full-bleed overlay sections and the hero
carousel. Sources top out at 960px, so these are upscaled with Lanczos —
acceptable only because every one sits under a heavy scrim, which hides the
softness that would be obvious in a crisp foreground image.

## Treatment

All six are colour-graded identically — desaturated to 55% with a cool green
tint — and cropped to 4:3. Stock from different photographers has clashing white
balance and saturation; left raw it reads as a pile of stock images. One grade
makes the set look like a single commissioned shoot and ties it to the brand
palette.

Generated as WebP at 960px and 640px. They are served **as authored**
(`unoptimized` on `next/image`): re-optimising an already-graded, already-sized
WebP cost server CPU to produce a larger file — a 22KB WebP came back as a 35KB
JPEG.

## Recommendation before a long-term campaign

CC0 is sound legally, but note two limits:

1. **No model releases.** CC0 covers the photographer's copyright, not the
   depicted person's likeness rights. The chosen images avoid this as far as
   possible — the two care images show hands only, with no identifiable faces,
   and the office images are generic workplace scenes. **No image implies the
   person shown is a Gateway client, learner or service user**, and alt text is
   written to describe the action, never to claim a relationship.
2. **They are not Gateway's.** Nothing here shows a real partner college, a real
   care setting, or real learners. For a brand that sells credibility to care
   operators, commissioned photography of actual partner settings would be
   materially stronger.

Treat these as a well-made placeholder set. Replacing them is a drop-in change:
swap the files in `public/images/photos/` keeping the same names, or edit
`src/content/imagery.ts`.

## Deliberately avoided

Searches surfaced plenty of clinical and hospital imagery — PPE, stethoscopes,
scrubs — plus several shots of visibly exhausted staff slumped on floors. None
of it was used. Adult social care is not a hospital, and burnout imagery is the
wrong message on a page selling leadership development.
