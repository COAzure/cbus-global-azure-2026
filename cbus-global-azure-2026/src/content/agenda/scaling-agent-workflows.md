---
title: "Happy Birthday! — Scaling Agent Workflows from One to Thirty with Beads"
time: "2026-04-18T11:50:00-04:00"
room: "Main Stage"
speakers:
  - "bill-klos"
---

Every new agent session is Frosty the Snowman putting on the hat — "Happy Birthday!" — cheerful, capable, and blissfully unaware of everything you've done together. Beads, Steve Yegge's Dolt-backed execution tracker, solves this by giving agents structured external memory with dependency tracking, semantic compaction, and queryable state. But memory is just the foundation — the real value is in the workflow patterns Beads enables as you scale. This talk walks through those patterns at three levels: a single agent managing session-to-session continuity, a small team of parallel agents coordinating through dependency graphs and atomic claims, and full agent swarms where twenty-plus agents grind through epics with role hierarchies and convoy-based work distribution. You'll leave with a practical understanding of which patterns matter at each scale, the architectural decisions that make them possible, and why execution-centric memory may be more important than the orchestration framework you pick.