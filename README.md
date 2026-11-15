# Cleartrip, planned together: case study

One long page, in the spirit of a design case study. The story (brief, nine conversations, patterns, directions, AI, decisions) is shown as exported Figma sections. Wherever a screen appears, it is the **live prototype**, annotated and animated:

- **Four annotated user flows** (Plan together, Decide together, Review and agree, When things go wrong). Each has a flowchart that lights up as the walkthrough runs, and the real app playing beside it.
- **Web and Phone** toggle on every flow, with numbered pins and leader-line labels.
- **It drives the app for real**: a cursor clicks through Find me a place, drags stickers into the Wishbox and jumps between states. Pause, Back and Next are there, and the walkthrough pauses as soon as you touch the app.
- Reduced-motion is respected.

The walkthrough controls the prototype at https://rushabhm-blip.github.io/Cleartrip_ai_agent/ through its iframe, which works because both sites share the `rushabhm-blip.github.io` origin.

Files: `index.html`, `site.css`, `site.js`, `docs/` (story sections). Static, so it works on GitHub Pages (deploy from `main`, root).

A concept for Cleartrip, not an official release. Prices, places and AI replies are samples.
