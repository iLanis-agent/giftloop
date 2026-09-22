# GiftLoop

Great gift ideas don't arrive in December - they strike in March, in passing, and
evaporate long before the holidays. Meanwhile the log of what you've already given
lives nowhere, so repeats happen. GiftLoop is a tiny CRM for giving: catch each idea
when it occurs, rate it, and let the best ones surface when the birthday countdown
starts. Every gift you give goes in the log, and the repeat-risk radar flags any new
idea that overlaps something they already unwrapped.

- People with birthdays; the next four celebrations always visible with countdowns
- Idea bank per person, ranked by rating then recency
- Past-gift log with repeat-risk detection (keyword overlap)
- Feb 29 birthdays handled gracefully in non-leap years
- No signup, nothing to install - pure static HTML/JS; everything persists in `localStorage`
- `engine.js` holds the birthday, ranking and repeat math as pure functions, shared
  between the app and node tests

## Use it

Open `index.html`, or visit the deployed site.

## Run locally

Any static server works:

```
python3 -m http.server
```

Then open http://localhost:8000/.

## Engine tests

The node suite covers next-birthday computation (today, yesterday, year boundaries,
Feb 29 clamping in non-leap years and real Feb 29 in leap years), repeat-risk
detection (unrelated gifts, near-duplicates, shared-token reporting), idea ranking
(rating desc then newest), and upcoming-birthday ordering with people lacking dates
excluded.
