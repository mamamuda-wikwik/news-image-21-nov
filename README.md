# THE WORLD — 21 November 2026 in One Image

[![make.fun · news-image-20261121](https://make.fun/badge/news-image-20261121.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![rank](https://make.fun/badge/news-image-20261121/mamamuda-wikwik/news-image-21-nov/rank.svg)](https://make.fun/bounty/news-image-20261121/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)
[![reward](https://make.fun/badge/news-image-20261121/mamamuda-wikwik/news-image-21-nov/reward.svg)](https://make.fun/bounty/news-image-20261121?utm_source=github&utm_medium=readme&utm_campaign=news-image-20261121)

## What this is

A broadsheet newspaper front page called **THE WORLD**, drawn as one
1024×1024 image. A whole day of world news — Saturday, 21 November 2026 —
on a single page, the way a paper front page used to work: one big lead
story, four more stories in a grid, and a ticker of the day's other news
along the bottom. Black ink on newsprint white.

## The day in the headlines

The day belonged to Kyiv — and to Poland. Overnight, Russia fired more
than 400 drones and 110 missiles at Ukraine, its biggest barrage of the
war so far. At least eight people were killed in Kyiv as strikes hit
homes and power plants across the capital, leaving districts in darkness
and cold. Three Russian projectiles landed in Poland, and NATO called
the spillover a violation of allied airspace. A ballistic missile also
hit Kryvyi Rih, President Zelenskyy's hometown, killing two people and
wounding sixty.

The rest of the page follows the day. On Wall Street, a sharp sell-off
in AI and chip shares drove markets down — the S&P 500 slid into
correction and Japan's Nikkei fell 5.1% — even as Anthropic debuted at
about a $2 trillion market value. President Trump is weighing another
round of extensive military strikes on Iran as Israel presses for
action; Iran hit three tankers near the Strait of Hormuz and US-Iran
talks have stalled. In Antalya, the COP31 climate summit passed its
Friday deadline without a deal, and fossil fuels are unmentioned in the
draft agreement. And in London, a daily pill called daraxonrasib made
pancreatic cancer undetectable in 1 in 12 patients in a trial — a rare
advance against the disease.

The ticker carries the rest: the UK and EU signing three post-Brexit
agreements on youth mobility, trade and energy; the FBI criminal
database and the USDA payment system reportedly hacked; the
International Court of Justice finding Myanmar responsible for the
Rohingya genocide — the first time a country has been found responsible;
Denmark expelling a Russian diplomat over an alleged plot to kill a
US-Ukrainian rapper; Mexico detaining cartel boss 'El Chapo Isidro',
one of the FBI's 10 most wanted; cost-of-living protests spreading
across Europe; Bolsonaro hospitalised with intestinal obstruction; and
BepiColombo reaching Mercury orbit.

Every headline was checked against several news sources reporting the
same day, so the page reflects what the day actually contained — not one
outlet's version of it. The image was drawn programmatically, letter by
letter, in a black-and-white newsprint style.

## Sources

The headlines were cross-checked across multiple outlets and wires
reporting the same day: AFP, BBC, AP, NYT, Reuters, and UNFCCC. Where
the sources disagreed on a number, the page uses the figure the
authorities on the ground gave — the Kyiv authorities for the casualties,
the market reporting for the sell-off and the Anthropic debut.

## How to run it

Requires Node.js (no packages, no network — standard library only).

```sh
node main.ts ./out
```

The program checks `entry.png` first: it must be a genuine PNG with a
13-byte IHDR chunk, an IDAT chunk, an IEND trailer, exactly 1024×1024
pixels, and no more than 1 MiB. If anything fails, it prints an error,
exits with a non-zero code, and copies nothing. On success it copies the
image to `./out/entry.png` and prints a one-line summary with the
dimensions and byte size.

## Files

- `entry.png` — the front page itself, 1024×1024.
- `main.ts` — the validator and copier (Node.js, standard library only).
- `README.md` — this file.
- `LICENSE` — MIT license.

## Referral

Referral code `tdgxqn9n` is tied to this entry.
