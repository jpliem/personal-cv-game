# Portfolio images

Drop the real photos into this folder using **exactly** these filenames.
The site references them by absolute path; if a file is missing the layout
shows a clean labelled placeholder instead of a broken image, so you can
deploy first and swap photos in whenever they're ready.

## Required

| File              | Used in              | Recommended spec                         |
|-------------------|----------------------|------------------------------------------|
| `portrait.jpg`    | Hero                 | Portrait, ~3:4, at least 800×1067 px     |
| `running.jpg`     | Beyond Work (hero)   | Landscape, ~3:2, at least 1200×800 px    |

## Optional (nice to have, not wired yet)

| File              | Used in              | Recommended spec                         |
|-------------------|----------------------|------------------------------------------|
| `bouldering.jpg`  | Beyond Work grid     | Landscape, ~4:3                          |
| `padel.jpg`       | Beyond Work grid     | Landscape, ~4:3                          |

## Notes

- Keep filesizes under ~400 KB each (export at quality ~80).
- The frames crop with `object-fit: cover`, so leave a little headroom.
- After dropping files in, just refresh the page — no rebuild needed.
