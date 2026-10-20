# Historians reconstructed text more accurately

Ancient Greek inscriptions. Published March 2022.

AI Benefits Database, AI-B-007
Source review 2026-10-19
Current record: https://petervartanian.xyz/ai-benefits/records/ithaca-historians-2022/
Cited version: https://petervartanian.xyz/ai-benefits/records/ithaca-historians-2022/versions/dbe9a5274e48/

## Task and setting

Restoring ancient Greek text. Texts from the ancient Mediterranean. The evaluators’ location is unreported.

## Outcome

On masked known text, historians’ top-choice reconstruction accuracy was 71.7% with Ithaca, compared with 25.3% unaided.

The human evaluation involved two graduate specialists in Greek history and epigraphy. Wider benefits to scholarship or the public were not measured.

## Compared with

Known masked text was reconstructed by historians with and without Ithaca.

## Evidence

Comparative research evaluation. The evaluation removed 1–10 known characters, allowing reconstructions to be checked against the original. Results are reported in Nature, Table 1.

Two trained evaluators do not represent all historians. Accuracy on masked known text does not establish accuracy on genuinely unknown text. The paper’s authors include Ithaca’s developers, and the corpus reflects prior scholarship.

One evaluation. Lasting changes in scholarly productivity were not measured.

Incorrect reconstructions and uneven corpus coverage are considerations for future use. This record does not estimate their downstream effects.

## Contributions

**AI:** Provided 20 ranked reconstruction hypotheses.

**People:** Interpreted alternatives using historical knowledge and searchable textual parallels.

**System:** Ithaca. The paper names Ithaca and describes its transformer architecture. JAX 0.2.9, Flax 0.3.0, and Haiku 0.0.4 are development-library versions. No Ithaca release or checkpoint identifier is reported.

**Timing:** Evaluation dates unreported.

## Conditions

- Evaluators had seven years of historical and linguistic training.
- Known text provided a reference against which to check reconstructions.
- Historians considered ranked suggestions alongside searchable textual parallels.

This controlled restoration task establishes no accuracy for genuinely unknown text, other languages, or different groups of historians.

## Sources

- [Restoring and attributing ancient texts using deep neural networks](https://www.nature.com/articles/s41586-022-04448-z)
  - Top-choice accuracy was 71.7% with Ithaca and 25.3% unaided. Locator: Table 1, restoration Top 1 column, ancient historian rows.
  - The evaluation hid 1–10 known characters and supplied 20 ranked suggestions. Locator: Experimental evaluation, first three paragraphs.
  - Two graduate specialists could search the training corpus for textual parallels. Locator: Methods, Ancient historian baseline.

## Citation

Peter H. Vartanian. AI Benefits Database, AI-B-007: Historians reconstructed text more accurately. Version dbe9a5274e48, 2026-10-19. https://petervartanian.xyz/ai-benefits/records/ithaca-historians-2022/versions/dbe9a5274e48/
