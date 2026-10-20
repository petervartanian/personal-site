# Developers completed a coding task sooner

Remote participants, mainly India and Pakistan. May–June 2022.

AI Benefits Database, AI-B-010
Source review 2026-10-19
Current record: https://petervartanian.xyz/ai-benefits/records/copilot-http-server-2022/
Cited version: https://petervartanian.xyz/ai-benefits/records/copilot-http-server-2022/versions/b0617d671891/

## Task and setting

Completing a coding task. Remote participants, mainly in India and Pakistan. Other countries are not named in the report.

## Outcome

Among developers who finished the task, those assigned GitHub Copilot completed a JavaScript HTTP server in 55.8% less time, averaging 71.17 versus 160.89 minutes.

95 Upwork recruits were assigned. Seventy completed the task and survey. Faster completion is not proof of higher earnings or a benefit for every assigned developer.

## Compared with

Random assignment to GitHub Copilot access plus a one-minute introduction versus no Copilot. Both groups could use their usual web resources. The reported time contrast includes only successful completers.

## Evidence

Randomized coding experiment, preprint. 95 developers were randomized, 45 to Copilot and 50 to control. The completion-time comparison covers 35 successful participants per group. The reported 95% confidence interval for the reduction is 21–89%.

One bounded JavaScript task. Completion-time results condition on successful completion. The success-rate difference was not statistically significant. The study did not evaluate broader code quality, security, maintenance, or team productivity. Authors included GitHub and Microsoft employees.

One coding assignment in May–June 2022. Later maintenance and ongoing workplace productivity were not measured.

Passing the twelve task tests does not establish secure, maintainable production code. Those properties were outside the evaluation.

## Contributions

**AI:** Suggested code and functions while developers wrote the server.

**People:** Developers implemented and submitted the program. They could use web search and other usual resources. A fixed suite checked twelve required behaviors.

**System:** GitHub Copilot. The paper identifies Codex and evaluates Copilot before general availability in June 2022. It gives no exact Codex snapshot or extension version.

**Timing:** The paper reports an experiment from May 15 to June 20, 2022. Its recruitment figure separately dates the Upwork posting to May 25.

## Conditions

- Developers received a starter repository and explicit HTTP-server requirements.
- A visible, unmodifiable suite of twelve tests determined successful completion.
- The Copilot group received a one-minute introduction, and both groups could use usual web resources.

A faster standardized task among completers does not establish equivalent gains on existing codebases, collaborative projects, other languages, or code needing security and maintenance review.

## Sources

- [The Impact of AI on Developer Productivity: Evidence from GitHub Copilot](https://arxiv.org/html/2302.06590v1)
  - 95 randomized developers, with 45 assigned to treatment and 50 to control. Locator: Results, first paragraph
  - 35 successful completers per group and 71.17 versus 160.89 minutes. Locator: Results, first paragraph and Figure 6 discussion
  - 55.8% reduction with a 21–89% confidence interval, conditional on completion. Locator: Results, Figure 6 discussion
  - Task success difference was not significant and broader code quality was not studied. Locator: Results, Figure 6 discussion, and Discussion
  - Codex, tool introduction, web-resource access, and twelve correctness checks. Locator: Introduction and Study Design
  - India and Pakistan were the main participant countries. Locator: Results, Figure 5 discussion

## Citation

Peter H. Vartanian. AI Benefits Database, AI-B-010: Developers completed a coding task sooner. Version b0617d671891, 2026-10-19. https://petervartanian.xyz/ai-benefits/records/copilot-http-server-2022/versions/b0617d671891/
