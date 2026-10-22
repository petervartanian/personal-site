(async () => {
  const __agencyResources = await Promise.all(["/200/agency-costs/assets/data-20b103ae56d3.json", "/200/agency-costs/assets/incidents-842b74a35705.json", "/200/agency-costs/assets/controls-1-42483733e9e5.json", "/200/agency-costs/assets/controls-2-cfd12f8864e7.json", "/200/agency-costs/assets/controls-3-11b9aa1959b8.json", "/200/agency-costs/assets/risk-evidence-c17399ff325e.json"].map(async path => {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`Unable to load ${path}: ${response.status}`);
    return response.json();
  }));
  const __agencyPayloads = {
    DATA: __agencyResources[0],
    INCIDENTS: __agencyResources[1],
    MAPPED_CONTROLS: {...__agencyResources[2], controls: __agencyResources.slice(2, 5).flatMap(part => part.controls)},
    RISK_EVIDENCE: __agencyResources[5]
  };
const DATA = __agencyPayloads.DATA;
const WORKFLOWS = [{"id":"agriculture-maintenance","sector":"agriculture","name":"Maintenance work orders","task":"Turn equipment reports into work orders for an authorized maintenance team.","failure":"A work order omits a reported fault or assigns an unsuitable action, leaving the defect unresolved.","riskIds":["7.3","5.1"],"countingUnit":"One maintenance request, followed through inspection and closure; count repeated model calls within that request.","basis":"Keythorn application","controls":[{"id":"A0455_NIST2024","rationale":"Check that the agent receives current equipment records and relevant fault information.","evidenceNeeded":"Equipment record versions, the reported fault, retrieved documents and the resulting work order."},{"id":"A0665_Barrett2024","rationale":"Define who approves work affecting equipment safety or availability.","evidenceNeeded":"Approval rules, reviewer sign-off and records of rejected or corrected work orders."}],"humanComparison":{"task":"A maintenance planner reads the fault report and prepares a work order.","difference":"The agent may create many orders from one shared document or configuration; a common error could affect a batch.","evidenceNeeded":"Human and agent work-order cohorts with the same equipment scope, observation period, completion criteria and recorded repair consequences."}},{"id":"agriculture-procurement","sector":"agriculture","name":"Materials purchasing","task":"Prepare replenishment orders from approved materials specifications and stock records.","failure":"An order uses the wrong specification or quantity, causing unusable stock or delayed production.","riskIds":["7.3","3.1"],"countingUnit":"One purchase order; record order lines and revisions separately rather than treating each model call as a purchase.","basis":"Keythorn application","controls":[{"id":"A0053_Eisenberg2025","rationale":"Test whether orders match the approved specification, stock position and purchasing limits.","evidenceNeeded":"Approved specification, stock snapshot, generated order and test cases covering missing or conflicting inputs."},{"id":"A0665_Barrett2024","rationale":"Route exceptions to a buyer before an external commitment is made.","evidenceNeeded":"Exception criteria, purchasing authority and order approval or correction history."}],"humanComparison":{"task":"A buyer translates stock needs into a supplier order.","difference":"The agent can reuse the same incorrect specification across orders and may submit them with delegated purchasing authority.","evidenceNeeded":"Comparable purchase orders, rejection and correction records, credits and incremental disruption costs, with consistent cost boundaries."}},{"id":"trade-dispatch","sector":"trade","name":"Shipment dispatch","task":"Assign shipments to approved carriers and delivery slots using current operational constraints.","failure":"A dispatch disregards a capacity or destination constraint, causing a failed or delayed delivery.","riskIds":["7.3","5.1"],"countingUnit":"One shipment dispatch decision; keep reassignment attempts under the same shipment identifier.","basis":"Keythorn application","controls":[{"id":"A0053_Eisenberg2025","rationale":"Test dispatch decisions against carrier capacity, destination and service constraints.","evidenceNeeded":"Constraint snapshot, proposed dispatch, exception tests and the actual delivery outcome."},{"id":"A0442_NIST2024","rationale":"Keep a tested route to manual dispatch when the agent cannot satisfy the constraints.","evidenceNeeded":"Fallback trigger, manual handoff record and time required to resume dispatch."}],"humanComparison":{"task":"A dispatcher assigns the shipment and resolves delivery exceptions.","difference":"Automated assignments may propagate one stale constraint across many shipments before a dispatcher intervenes.","evidenceNeeded":"Matched shipment cohorts, lane and service mix, delivery outcomes, additional transport expense and the period of observation."}},{"id":"trade-returns","sector":"trade","name":"Retail returns and refunds","task":"Check a return request against the applicable sales policy and prepare the approved refund.","failure":"The agent authorizes an ineligible refund or rejects an eligible one because it applies the wrong policy.","riskIds":["7.3","3.1","4.3"],"countingUnit":"One return request, including retries and human interventions; record refund transactions and incident episodes separately.","basis":"Keythorn application","controls":[{"id":"A0507_NIST2024","rationale":"Verify which return policy and transaction records were supplied to the agent.","evidenceNeeded":"Sale date, applicable policy version, retrieved passages, request and refund decision."},{"id":"A0665_Barrett2024","rationale":"Require review when eligibility evidence or the applicable policy is uncertain.","evidenceNeeded":"Review threshold, exception routing, approval record and the final refund or refusal."}],"humanComparison":{"task":"A returns clerk checks eligibility and arranges the refund.","difference":"An agent may process requests continuously and reuse the same mistaken policy; its payment authority may differ from a clerk’s.","evidenceNeeded":"Requests from the same eligibility population, completed outcomes, recovered goods, refunds and review costs, with one definition of a request."}},{"id":"information-code","sector":"information","name":"Software changes","task":"Prepare a code change and submit it through the organization’s review and release process.","failure":"The change breaks an intended function or introduces a security weakness that reaches a release.","riskIds":["7.3","2.2"],"countingUnit":"One reviewed change request; keep commits, test runs and retries linked to that request.","basis":"Keythorn application","controls":[{"id":"A0044_Eisenberg2025","rationale":"Validate the security of the proposed change before it is released.","evidenceNeeded":"Change diff, security requirements, validation results and unresolved findings."},{"id":"A0665_Barrett2024","rationale":"Keep approval authority explicit for merging and deploying changes.","evidenceNeeded":"Agent permissions, reviewer decision, release approval and any bypass of the review process."},{"id":"A0051_Eisenberg2025","rationale":"Trace the requested change to the released version and observed outcome.","evidenceNeeded":"Task instruction, tool actions, test outputs, release version and incident timeline."}],"humanComparison":{"task":"A developer prepares a change that is reviewed and released.","difference":"The agent may generate changes at greater volume or hold tool permissions that remove a usual review step.","evidenceNeeded":"Comparable change scope and release process, failure outcomes, rollback effort and recovery expense; do not compare raw commit counts."}},{"id":"information-support","sector":"information","name":"Software customer support","task":"Answer customer questions and carry out permitted account-service actions.","failure":"An answer promises an unsupported service or the agent applies an account change outside its authority.","riskIds":["3.1","5.1","2.1"],"countingUnit":"One support case; group messages and tool calls under the same case and record the final customer outcome.","basis":"Keythorn application","controls":[{"id":"A0507_NIST2024","rationale":"Ground support answers in current product terms and account information.","evidenceNeeded":"Terms version, knowledge-base passages, account context and the customer-facing answer."},{"id":"A0042_Eisenberg2025","rationale":"Restrict account changes to the actions authorized for that support role.","evidenceNeeded":"Role permissions, authentication, account-change logs and escalation records."}],"humanComparison":{"task":"A support representative answers the question and makes authorized account changes.","difference":"A conversational answer may be delivered immediately and repeatedly; the agent’s tool access can turn an unsupported answer into an account action.","evidenceNeeded":"Comparable support cases, promises made, corrections, customer redress and investigation expense, with the same case-closure rule."}},{"id":"finance-payments","sector":"finance","name":"Payment instructions","task":"Prepare a payment from an approved obligation and submit it within delegated authority.","failure":"The payment uses an unapproved recipient or amount, or a repeated submission creates an unintended duplicate.","riskIds":["4.3","7.3","2.2"],"countingUnit":"One approved payment obligation; track instructions, retries, settlements and recoveries separately under that identifier.","basis":"Keythorn application","controls":[{"id":"A0042_Eisenberg2025","rationale":"Limit who or what can change payee details and release funds.","evidenceNeeded":"Payee-change permissions, authentication, approved obligation and payment authorization logs."},{"id":"A0665_Barrett2024","rationale":"Require review when the recipient, amount or route changes beyond delegated authority.","evidenceNeeded":"Approval policy, reviewed instruction, approval timestamp and final submitted instruction."},{"id":"A0051_Eisenberg2025","rationale":"Reconcile the intended payment with each submission and settlement.","evidenceNeeded":"Operation identifier, tool requests and responses, retry events, settlement confirmations and recovery receipts."}],"humanComparison":{"task":"A payments officer checks the obligation, verifies changes and submits a transfer.","difference":"Agent retries and shared software can repeat an error; the comparison depends on release permissions and the same payment-verification checks.","evidenceNeeded":"Matched payment obligations and settlement records, unauthorized or duplicate amounts, realized recoveries and incremental response costs."}},{"id":"finance-claims","sector":"finance","name":"Claims assessment","task":"Assemble claim evidence and calculate a proposed benefit using the applicable policy.","failure":"A claim is paid or refused using an inapplicable benefit schedule or incomplete claim evidence.","riskIds":["7.3","3.1","1.3"],"countingUnit":"One claim assessment under a specified policy; keep revisions, appeals and payments linked to the claim.","basis":"Keythorn application","controls":[{"id":"A0507_NIST2024","rationale":"Verify the policy version and evidence supporting the proposed benefit.","evidenceNeeded":"Policy and schedule versions, claim facts, retrieved passages and calculation trace."},{"id":"A0665_Barrett2024","rationale":"Route conflicting evidence, exclusions and uncertain eligibility for human assessment.","evidenceNeeded":"Escalation rules, reviewed evidence, assessor decision and subsequent appeal or correction."}],"humanComparison":{"task":"A claims handler reviews evidence and calculates a benefit.","difference":"A shared retrieval or calculation error can affect many claims; an agent may lack the handler’s discretion or access to further evidence.","evidenceNeeded":"Claims from comparable policy cohorts, benefit entitlement, actual payment, overpayment recovery and review expense; keep ordinary benefits outside the error loss."}},{"id":"finance-underwriting","sector":"finance","name":"Underwriting evidence review","task":"Summarize an application and supporting evidence for an authorized underwriting decision.","failure":"The summary omits a material fact or treats similar applicants inconsistently, affecting the human decision.","riskIds":["3.1","1.1","1.3"],"countingUnit":"One application review; track revisions and the final underwriting decision under the same application.","basis":"Keythorn application","controls":[{"id":"A0055_Eisenberg2025","rationale":"Assess whether the review performs consistently across relevant applicant groups.","evidenceNeeded":"Test population, subgroup performance measures, omitted-fact checks and review corrections."},{"id":"A0665_Barrett2024","rationale":"Require an underwriter to inspect material source evidence before accepting the recommendation.","evidenceNeeded":"Source documents, generated summary, decision criteria and the underwriter’s review record."}],"humanComparison":{"task":"An underwriting analyst summarizes an application for a decision-maker.","difference":"The agent may systematically omit the same type of fact across applications, while reviewers may rely on fluent summaries.","evidenceNeeded":"Comparable applications and decision criteria, blinded review of summary errors and documented decision consequences; premiums alone are not loss outcomes."}},{"id":"real-estate-applications","sector":"real-estate","name":"Rental application review","task":"Organize a rental application and flag missing evidence for an authorized reviewer.","failure":"Incorrectly represented evidence or uneven performance across applicants affects eligibility review.","riskIds":["1.1","1.3","3.1"],"countingUnit":"One rental application; keep document requests, reviewer decisions and appeals linked to that application.","basis":"Keythorn application","controls":[{"id":"A0055_Eisenberg2025","rationale":"Test review accuracy across the relevant applicant population and documentation formats.","evidenceNeeded":"Representative applications, error labels, subgroup measures and adjudicated corrections."},{"id":"A0665_Barrett2024","rationale":"Keep eligibility decisions and exception handling under a defined human review process.","evidenceNeeded":"Review criteria, original documents, agent output and the reviewer’s final decision."}],"humanComparison":{"task":"A property administrator checks documents and prepares an application for review.","difference":"One automated rule can be applied consistently but incorrectly to many applicants; a reviewer may see only the generated summary.","evidenceNeeded":"Comparable applicant populations, document completeness, review and appeal outcomes, and evidenced costs of correction or redress."}},{"id":"professional-contracts","sector":"professional","name":"Contract document review","task":"Compare a draft contract with an approved playbook and prepare issues for professional review.","failure":"The agent misses a consequential clause or reports an obligation that the document does not contain.","riskIds":["3.1","7.3","5.1"],"countingUnit":"One defined document review, with versions and reviewer corrections retained under the same review identifier.","basis":"Keythorn application","controls":[{"id":"A0053_Eisenberg2025","rationale":"Test whether material clauses and deviations are identified accurately.","evidenceNeeded":"Document versions, playbook, clause-level reference assessment and test results."},{"id":"A0665_Barrett2024","rationale":"Require a qualified reviewer to resolve material findings before advice or approval is issued.","evidenceNeeded":"Source clauses, agent findings, review sign-off and corrected advice."}],"humanComparison":{"task":"A professional reviews the contract against the engagement’s requirements.","difference":"Generated findings may appear complete despite omissions, and one shared review configuration may affect several clients.","evidenceNeeded":"Reviews of comparable scope and document complexity, independently assessed errors and actual correction or dispute costs."}},{"id":"professional-client-files","sector":"professional","name":"Client-file preparation","task":"Gather permitted client documents and assemble a work product for the assigned engagement.","failure":"Documents from another client or information beyond the engagement’s permission enter the work product.","riskIds":["2.1","2.2"],"countingUnit":"One client deliverable; record each source document and recipient without counting retrieved passages as separate engagements.","basis":"Keythorn application","controls":[{"id":"A0042_Eisenberg2025","rationale":"Enforce client and engagement boundaries for document retrieval and delivery.","evidenceNeeded":"Access roles, document permissions, retrieval audit and recipient records."},{"id":"A0067_Eisenberg2025","rationale":"Limit sensitive information to what is necessary for the assigned work.","evidenceNeeded":"Data inventory, redaction checks, deliverable content and records of any disclosure."}],"humanComparison":{"task":"An engagement team collects documents and prepares a client deliverable.","difference":"Broad search or connector permissions can cross client boundaries at machine speed.","evidenceNeeded":"Comparable deliverables, permission boundaries, confirmed disclosures and response costs, with the same definition of a disclosure event."}},{"id":"research-evidence-review","sector":"research","name":"Research evidence review","task":"Retrieve relevant studies and build a source-linked evidence summary for a research question.","failure":"An unsupported citation or incorrect extraction enters the evidence summary and affects subsequent research.","riskIds":["3.1","7.3","5.1"],"countingUnit":"One prespecified evidence-review question; track retrieved studies and extracted claims as subordinate records.","basis":"Keythorn application","controls":[{"id":"A0507_NIST2024","rationale":"Keep each extracted claim linked to the document and version actually retrieved.","evidenceNeeded":"Search scope, source documents, extracted passages and claim-to-source links."},{"id":"A0665_Barrett2024","rationale":"Require a researcher to verify material conclusions and unresolved evidence conflicts.","evidenceNeeded":"Review protocol, verification sample, corrected extractions and researcher sign-off."}],"humanComparison":{"task":"A researcher searches, extracts and synthesizes evidence.","difference":"An agent can generate a large, apparently coherent summary whose errors recur across citations.","evidenceNeeded":"The same review question and eligibility criteria, independently checked extractions, correction time and documented effects on downstream work."}},{"id":"research-analysis","sector":"research","name":"Research data analysis","task":"Prepare and execute an approved analysis plan on a specified research dataset.","failure":"A transformation or analysis step changes the intended population or measure, producing an unsupported result.","riskIds":["7.3","3.1","7.4"],"countingUnit":"One versioned analysis run under an agreed plan; retain reruns and model calls within the analysis history.","basis":"Keythorn application","controls":[{"id":"A0455_NIST2024","rationale":"Verify the accuracy, suitability and representativeness of the data used by the analysis.","evidenceNeeded":"Dataset version, variable definitions, exclusions, missingness and transformation records."},{"id":"A0053_Eisenberg2025","rationale":"Test the implemented calculations and outputs against the approved analysis plan.","evidenceNeeded":"Plan, executable analysis, validation checks, reproducibility results and reviewed conclusions."}],"humanComparison":{"task":"An analyst prepares data and carries out the research analysis.","difference":"An agent may change several analysis steps in one run and produce explanations that conceal the actual computation.","evidenceNeeded":"Equivalent analysis plans and datasets, independent replication, corrected results and recorded rework; publication count is not an exposure measure."}},{"id":"management-recruiting","sector":"management","name":"Recruitment screening","task":"Organize applications against the stated job requirements and prepare a shortlist for review.","failure":"An applicant is omitted or misrepresented because the agent misreads evidence or performs unevenly across groups.","riskIds":["1.1","1.3","3.1"],"countingUnit":"One application for one vacancy; link screening, human review and reconsideration under that application.","basis":"Keythorn application","controls":[{"id":"A0055_Eisenberg2025","rationale":"Evaluate screening accuracy and disparities for the job’s applicant population.","evidenceNeeded":"Job criteria, representative applications, adjudicated outcomes and subgroup error measures."},{"id":"A0665_Barrett2024","rationale":"Provide a defined review and correction process before the shortlist is used.","evidenceNeeded":"Reviewer access to original applications, review decisions and corrected or reconsidered cases."}],"humanComparison":{"task":"A recruiter reviews applications against job requirements.","difference":"A shared automated screen can repeat the same exclusion across applicants and vacancies.","evidenceNeeded":"Comparable vacancies and application populations, review outcomes, corrections and evidenced recruitment or redress costs."}},{"id":"management-accounts-payable","sector":"management","name":"Invoice processing","task":"Match supplier invoices with purchase orders and receipts, then prepare approved payment requests.","failure":"A duplicate, unsupported or mismatched invoice is passed onward as payable.","riskIds":["7.3","4.3"],"countingUnit":"One supplier invoice; link copies, resubmissions, purchase-order lines and settlements to its identifier.","basis":"Keythorn application","controls":[{"id":"A0053_Eisenberg2025","rationale":"Test matching and duplicate handling against known invoice and receipt exceptions.","evidenceNeeded":"Invoice, purchase order, receipt, matching output and exception test results."},{"id":"A0051_Eisenberg2025","rationale":"Preserve the invoice-to-approval-to-settlement sequence so a duplicate or incorrect payment can be traced.","evidenceNeeded":"Invoice identifiers, validation outcomes, reviewer approvals, submissions and settlement records."}],"humanComparison":{"task":"An accounts-payable clerk matches an invoice and routes exceptions.","difference":"Automated ingestion may treat copies or resubmissions as new invoices unless the surrounding process preserves their identity.","evidenceNeeded":"Matched invoice cohorts, verified overpayments, legitimate obligations, recovered amounts and incremental investigation cost."}},{"id":"education-assessment","sector":"education","name":"Student assessment support","task":"Apply an approved rubric to submitted work and prepare feedback for an educator’s review.","failure":"The assessment misreads the work or performs unevenly across students, leading to unsupported feedback or a changed grade.","riskIds":["1.3","3.1","5.1"],"countingUnit":"One student submission assessed under a specified rubric; keep revisions, appeals and regrading linked to it.","basis":"Keythorn application","controls":[{"id":"A0055_Eisenberg2025","rationale":"Check accuracy and performance differences across relevant student groups and submission formats.","evidenceNeeded":"Rubric, representative submissions, independent assessments and subgroup error measures."},{"id":"A0665_Barrett2024","rationale":"Have an educator resolve consequential judgments and student challenges.","evidenceNeeded":"Original work, generated feedback, review decision and regrading or appeal record."}],"humanComparison":{"task":"An educator assesses a submission and explains the result.","difference":"Automated feedback can apply the same mistaken rubric interpretation to a whole cohort.","evidenceNeeded":"Comparable assignments and rubrics, adjudicated disagreements, appeal outcomes and recorded correction effort."}},{"id":"healthcare-records","sector":"healthcare","name":"Clinical record summarization","task":"Prepare a source-linked patient-record summary for a qualified care professional to review.","failure":"The summary omits or misstates relevant information, which may influence a subsequent care decision.","riskIds":["3.1","7.3","5.1"],"countingUnit":"One patient-record summary for a specified encounter; keep revisions and clinician corrections under that encounter.","basis":"Keythorn application","controls":[{"id":"A0507_NIST2024","rationale":"Link material statements to the patient record and document version used.","evidenceNeeded":"Encounter scope, retrieved record sections, source links and generated summary."},{"id":"A0665_Barrett2024","rationale":"Require clinical review of information used for consequential decisions.","evidenceNeeded":"Review protocol, corrected summary, clinician sign-off and any documented downstream consequence."}],"humanComparison":{"task":"A care professional reads the chart and prepares a summary.","difference":"The agent may compress a long record and omit an exception while presenting the result confidently.","evidenceNeeded":"Comparable encounters, independently assessed omissions, review corrections and documented outcomes; a summary error is not itself proof of injury."}},{"id":"healthcare-referrals","sector":"healthcare","name":"Referral coordination","task":"Route an authorized referral, request missing administrative information and track its completion.","failure":"A referral goes to the wrong service, is delayed, or discloses patient information to an unintended recipient.","riskIds":["7.3","2.1"],"countingUnit":"One authorized referral; link messages, scheduling attempts and final disposition under that referral.","basis":"Keythorn application","controls":[{"id":"A0042_Eisenberg2025","rationale":"Restrict the agent to authorized patient records, destinations and coordination actions.","evidenceNeeded":"Patient-access permissions, intended recipient, transmitted documents and routing audit."},{"id":"A0442_NIST2024","rationale":"Provide a tested manual handoff when routing or completion is uncertain.","evidenceNeeded":"Exception trigger, handoff acknowledgment, resolution time and final referral status."}],"humanComparison":{"task":"A coordinator routes the referral and follows up on missing information.","difference":"An agent can repeat a routing mistake or continue follow-ups without recognizing an unresolved exception.","evidenceNeeded":"Comparable referral categories and completion windows, routing errors, disclosures, delays and supported administrative or patient consequences."}},{"id":"arts-rights","sector":"arts","name":"Content and rights preparation","task":"Assemble publication materials and check the available rights and attribution records before release.","failure":"Content is released with unsupported attribution or without resolving missing rights information.","riskIds":["3.1","6.3","7.3"],"countingUnit":"One publication package; retain the assets, permissions and revisions associated with that release.","basis":"Keythorn application","controls":[{"id":"A0455_NIST2024","rationale":"Check the completeness and suitability of rights and attribution information used in the package.","evidenceNeeded":"Asset inventory, rights records, source metadata and unresolved permission fields."},{"id":"A0665_Barrett2024","rationale":"Require a responsible editor to resolve material rights or attribution questions before release.","evidenceNeeded":"Release checklist, flagged issues, rights review and approval record."}],"humanComparison":{"task":"A production coordinator assembles materials and asks a rights specialist to resolve exceptions.","difference":"An agent may infer missing rights information from context or reuse an unsupported attribution across releases.","evidenceNeeded":"Comparable publication packages, independently reviewed permission status, takedowns, corrections and documented costs; do not infer infringement from an absent field alone."}},{"id":"hospitality-bookings","sector":"hospitality","name":"Booking changes","task":"Answer a booking request and make changes permitted by the current reservation terms.","failure":"The agent promises an unavailable service or applies an incorrect change or cancellation term.","riskIds":["3.1","7.3","5.1"],"countingUnit":"One booking-change request; link messages, reservation updates and any compensation to that request.","basis":"Keythorn application","controls":[{"id":"A0507_NIST2024","rationale":"Use the terms and inventory that apply to the actual booking.","evidenceNeeded":"Reservation, applicable terms, availability snapshot and customer-facing answer."},{"id":"A0665_Barrett2024","rationale":"Escalate service promises and exceptions outside the agent’s authority.","evidenceNeeded":"Authority limits, exception request, approval record and final reservation state."}],"humanComparison":{"task":"A booking agent checks availability and applies the reservation terms.","difference":"The agent may make immediate promises or updates before a person recognizes a mismatch.","evidenceNeeded":"Comparable reservation types, change requests, accepted terms, corrections, refunds and additional service costs."}},{"id":"hospitality-customer-refunds","sector":"hospitality","name":"Service refunds","task":"Assess a customer’s service complaint against the approved remedy policy and prepare a refund or escalation.","failure":"The agent grants an unsupported refund or refuses a remedy justified by the recorded service problem.","riskIds":["7.3","3.1","4.3"],"countingUnit":"One complaint requesting a remedy; keep review, refund and follow-up actions under the same complaint.","basis":"Keythorn application","controls":[{"id":"A0053_Eisenberg2025","rationale":"Test whether remedy decisions follow the applicable service policy and recorded facts.","evidenceNeeded":"Complaint, service record, remedy policy, proposed outcome and validated exception cases."},{"id":"A0665_Barrett2024","rationale":"Route ambiguous or high-consequence remedies to an authorized reviewer.","evidenceNeeded":"Escalation threshold, reviewer decision, refund authorization and the customer’s final outcome."}],"humanComparison":{"task":"A service representative evaluates the complaint and arranges a remedy.","difference":"An agent may apply one mistaken interpretation across many complaints or be granted direct refund authority.","evidenceNeeded":"Comparable complaints, eligibility and outcome rules, amounts legitimately due, erroneous payments, recoveries and review costs."}},{"id":"public-admin-benefits","sector":"public-admin","name":"Benefit application administration","task":"Organize a benefit application, identify missing documents and prepare evidence for an authorized decision-maker.","failure":"A material fact is misstated or a document is wrongly treated as missing, delaying or distorting the eligibility review.","riskIds":["1.1","1.3","3.1"],"countingUnit":"One application under a specified program; retain notices, corrections, appeals and final disposition under that application.","basis":"Keythorn application","controls":[{"id":"A0055_Eisenberg2025","rationale":"Test administrative accuracy across the program’s applicants and document formats.","evidenceNeeded":"Program criteria, representative applications, adjudicated errors and subgroup performance."},{"id":"A0665_Barrett2024","rationale":"Keep benefit decisions and contested evidence under an accountable review process.","evidenceNeeded":"Original evidence, generated summary, decision-maker review and correction or appeal history."}],"humanComparison":{"task":"A caseworker checks completeness and organizes evidence for a benefits decision.","difference":"Automated errors may be repeated across an entire program, and applicants may struggle to identify the source of an incorrect summary.","evidenceNeeded":"Comparable program cohorts, processing windows, corrected decisions, delay outcomes and evidenced administrative or claimant costs."}},{"id":"national-security-analysis","sector":"national-security","name":"Analytical briefing preparation","task":"Assemble a source-linked briefing from information the analyst is authorized to use.","failure":"An unsupported claim, lost source qualification or improperly included sensitive item enters the briefing.","riskIds":["3.1","2.1","5.1"],"countingUnit":"One briefing for a defined question and audience; retain claims, sources and review revisions within that briefing.","basis":"Keythorn application","controls":[{"id":"A0042_Eisenberg2025","rationale":"Constrain source access and distribution to the authorized briefing scope.","evidenceNeeded":"Access entitlements, retrieved source list, recipient scope and distribution audit."},{"id":"A0665_Barrett2024","rationale":"Require analyst review of material claims, source qualifications and release decisions.","evidenceNeeded":"Claim-to-source links, uncertainty annotations, review corrections and release approval."}],"humanComparison":{"task":"An analyst selects sources, assesses qualifications and prepares a briefing for an authorized audience.","difference":"The agent may combine sources without preserving their restrictions or uncertainty, encouraging excessive reliance on a fluent summary.","evidenceNeeded":"Comparable briefing scope and source access, independently assessed errors, correction records and documented consequences; intelligence judgments do not supply actuarial frequencies."}}];
const EVIDENCE = {"checkedAt":"2026-10-01","scope":"Two public chatbot or agent cases and one historical automation comparator. This is a small source-linked selection, not Keythorn customer data or a representative loss portfolio. Amounts retain their source currency and status. No case has a matched operational denominator.","codingNote":"Sector and risk links are this prototype's analytical coding into the canonical MIT taxonomy. They do not imply MIT validation of the coding. Sector placement describes the workflow context and may differ from the affected organization's formal NAICS classification.","cases":[{"id":"replit-database-2025","title":"Replit agent deletes application data","sectorId":"information","riskIds":["7.3"],"recordKind":"Observed agent incident","isComparator":false,"eventDate":"2025-07-18","eventDateBasis":"Date in MIT's AI Incident Tracker / AIID record 1152. The vendor account itself says only that it occurred recently.","publicationDate":"2025-07-29","workflow":"Agent-assisted software development and database changes","summary":"Replit reports that its agent deleted data from Jason Lemkin's application database. The company says Rollback ultimately restored the database, but the agent initially failed to help with recovery. Development changes could affect production at the time.","sectorBasis":"Software-platform workflow; the affected customer's establishment-level NAICS code is not established here.","countingUnit":"One reported deletion episode. Tables, rows, affected users and failed commands are not counted as separate incidents.","financial":{"currency":null,"amount":null,"relation":null,"status":"Not disclosed","label":"Monetary loss not disclosed","components":[],"note":"Restoration does not establish zero interruption cost, recovery cost or net loss. No loss amount or insurance payment appears in the vendor account."},"exposure":{"value":null,"unit":null,"note":"No matched count of eligible development operations or deployment period is supplied; a failure rate cannot be calculated."},"evidenceStatus":"Vendor account corroborates deletion and restoration; execution logs, costs and independent recovery verification are unavailable here.","sources":[{"title":"Doubling down on our commitment to secure vibe coding","publisher":"Replit","url":"https://replit.com/blog/doubling-down-on-our-commitment-to-secure-vibe-coding","kind":"Primary vendor account"},{"title":"AIID incident 1152","publisher":"AI Incident Database","url":"https://incidentdatabase.ai/cite/1152/","kind":"Incident catalogue"}],"mitLinks":[{"title":"MIT AI Incident Tracker, incident 1152","url":"https://airisk.mit.edu/ai-incident-tracker/incident-view"}],"questions":["Which executed commands and permissions permitted changes to production?","What interruption and recovery work occurred before restoration?","Can development and production separation be demonstrated on the same workflow?"]},{"id":"air-canada-moffatt-2022","title":"Air Canada chatbot gives incorrect fare advice","sectorId":"trade","riskIds":["3.1"],"recordKind":"Adjudicated chatbot case","isComparator":false,"eventDate":"2022-11-11","eventDateBasis":"Initial chatbot interaction and first booking in the tribunal's findings. The second booking was on November 16, 2022.","publicationDate":"2024-02-14","workflow":"Customer-service advice about airline fare eligibility","summary":"A customer relied on the airline's chatbot saying a bereavement fare could be claimed after booking. The tribunal found negligent misrepresentation and ordered compensation. The decision does not establish the chatbot's model architecture or autonomous payment authority.","sectorBasis":"Air transportation falls within the MIT study's Trade, Transportation, and Utilities grouping.","countingUnit":"One adjudicated dispute involving advice relied on for two bookings; the award is not a portfolio of insurance claims.","financial":{"currency":"CAD","amount":812.02,"relation":"equal","status":"Tribunal award ordered","label":"CAD 812.02 ordered","components":[{"label":"Damages","amount":650.88},{"label":"Pre-judgment interest","amount":36.14},{"label":"Tribunal fees","amount":125}],"note":"Paragraph 44 states the ordered total; paragraph 40 supports the damages. This is not verified payment, an insurance payout or the airline's complete economic cost."},"exposure":{"value":null,"unit":null,"note":"No matched total of chatbot conversations or eligible fare decisions is available. Two bookings in this case are not an operational exposure denominator."},"evidenceStatus":"Primary tribunal reasons verified. Currency is Canadian dollars. Payment compliance and insurance coverage are not established by the decision.","sources":[{"title":"Moffatt v. Air Canada, 2024 BCCRT 149","publisher":"British Columbia Civil Resolution Tribunal","url":"https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do","kind":"Primary tribunal decision"},{"title":"AIID incident 639","publisher":"AI Incident Database","url":"https://incidentdatabase.ai/cite/639/","kind":"Incident catalogue"}],"mitLinks":[{"title":"MIT AI Incident Tracker, Air Canada fare advice","url":"https://airisk.mit.edu/ai-incident-tracker/incident-view"}],"questions":["How does the customer-facing answer resolve against the authoritative policy?","Which decisions require escalation, and is the advice preserved for a dispute?","What evidence distinguishes an ordered award from an actual payment and other costs?"]},{"id":"knight-capital-2012","title":"Knight Capital trading-software failure","sectorId":"finance","riskIds":[],"recordKind":"Historical automation comparator","isComparator":true,"eventDate":"2012-08-01","eventDateBasis":"Date of the trading incident in the SEC investigation.","publicationDate":"2013-10-16","workflow":"Automated equity order routing","summary":"The SEC reports that a faulty deployment caused the router to send over four million orders in 45 minutes and left Knight with unwanted positions. The firm suffered a loss above USD 460 million. This was trading software, not an AI-agent incident or a human-only comparison.","sectorBasis":"Securities trading is within Finance and Insurance. No AI risk code is assigned to this non-AI comparator.","countingUnit":"One trading incident with many generated orders; neither order count nor the 45-minute episode supplies portfolio frequency.","financial":{"currency":"USD","amount":460000000,"relation":"greater_than","status":"Realized trading loss reported by regulator","label":"More than USD 460 million","components":[],"note":"The SEC describes a loss greater than this threshold, not an exact figure. Its separate USD 12 million penalty is excluded. No insurance payment or comparable agent loss rate is established."},"exposure":{"value":null,"unit":null,"note":"The incident's 212 customer orders and over four million generated orders describe different units, not a matched population of operating opportunities."},"evidenceStatus":"SEC enforcement account; the settlement was entered without admitting or denying the findings.","sources":[{"title":"SEC Charges Knight Capital With Violations of Market Access Rule","publisher":"U.S. Securities and Exchange Commission","url":"https://www.sec.gov/newsroom/press-releases/2013-222","kind":"Primary regulatory investigation"}],"mitLinks":[],"questions":["What limits halt repeated actions when the system misreads completion?","Can a deployment check detect inconsistent code across production systems?","Who receives an alert and can stop execution before exposure compounds?"]}]};
const MOSAIC = [{"shape":"0,0 34,0 36,12 30,28 33.333333,38 0,34","point":[18,19],"mobileShape":"0,0 100,0 100,13 48,10.483871 38,10 0,13","mobilePoint":[50,5.5],"mobileLabel":"vertical","color":"#FFF9F0","tint":"#234E70","sector":"finance","lines":["Finance and Insurance"],"iconPaths":["M3 10 16 3l13 7Z","M5 28h22M5 24h22M7 12v12m6-12v12m6-12v12m6-12v12"],"pattern":[{"d":"M5 24h7v-6h7v-6h8V6"},{"d":"M5 29h22"}],"patternTransform":""},{"shape":"34,0 68,0 67.199074,1.458333 66.462963,2.916667 65.791667,4.375 65.185185,5.833333 64.643519,7.291667 64.166667,8.75 63.75463,10.208333 63.407407,11.666667 63.125,13.125 62.907407,14.583333 62.75463,16.041667 62.666667,17.5 62.643519,18.958333 62.685185,20.416667 62.791667,21.875 62.962963,23.333333 63.199074,24.791667 63.5,26.25 63.865741,27.708333 64.296297,29.166667 64.791667,30.625 65.351852,32.083333 65.976852,33.541667 66.666667,35 65.277778,35.484375 63.888889,35.9375 62.5,36.359375 61.111111,36.75 59.722222,37.109375 58.333334,37.4375 56.944445,37.734375 55.555556,38 54.166667,38.234375 52.777778,38.4375 51.388889,38.609375 50,38.75 48.611111,38.859375 47.222222,38.9375 45.833333,38.984375 44.444444,39 43.055555,38.984375 42.857143,38.979592 41.666667,38.9375 40.277778,38.859375 38.888889,38.75 37.5,38.609375 36.111111,38.4375 34.722222,38.234375 33.333333,38 30,28 36,12","point":[49,19.5],"mobileShape":"0,13 38,10 48,10.483871 49.364583,11.547043 50.625,12.610215 51.78125,13.673387 52.833333,14.736559 53.78125,15.799731 54.625,16.862903 55.364583,17.926075 56,18.989247 56.53125,20.052419 56.958333,21.115591 57.28125,22.178763 57.5,23.241936 57.614583,24.305108 57.625,25.36828 57.53125,26.431452 57.333333,27.494624 57.03125,28.557796 56.625,29.620968 56.114583,30.68414 55.5,31.747312 54.78125,32.810484 53.958333,33.873656 53.03125,34.936828 52,36 49.833333,35.600694 47.666667,35.236111 45.5,34.90625 43.333333,34.611111 41.166667,34.350694 39,34.125 36.833333,33.934028 34.666667,33.777778 32.5,33.65625 30.333333,33.569444 28.166667,33.517361 26,33.5 23.833333,33.517361 21.666667,33.569444 19.5,33.65625 17.333333,33.777778 15.166667,33.934028 13,34.125 10.833333,34.350694 8.666667,34.611111 6.5,34.90625 4.333333,35.236111 2.166667,35.600694 0,36","mobilePoint":[28.8125,23],"mobileLabel":"vertical","color":"#45324D","tint":"#D8CAE8","sector":"research","lines":["Scientific Research","and Development","Services"],"iconPaths":["M12 3h8M14 3v10L5 26q-1 3 2 3h18q3 0 2-3L18 13V3","M10 20h12M13 24h1m5 1h1"],"pattern":[{"d":"M69 22Q81 3 94 22"},{"d":"M76 22Q82 12 88 22"}],"patternTransform":""},{"shape":"68,0 100,0 100,36 71.428571,35.142857 66.666667,35 65.976852,33.541667 65.351852,32.083333 64.791667,30.625 64.296297,29.166667 63.865741,27.708333 63.5,26.25 63.199074,24.791667 62.962963,23.333333 62.791667,21.875 62.685185,20.416667 62.643519,18.958333 62.666667,17.5 62.75463,16.041667 62.907407,14.583333 63.125,13.125 63.407407,11.666667 63.75463,10.208333 64.166667,8.75 64.643519,7.291667 65.185185,5.833333 65.791667,4.375 66.462963,2.916667 67.199074,1.458333","point":[81.321759,18],"mobileShape":"48,10.483871 100,13 100,37 75,36.479167 52,36 53.03125,34.936828 53.958333,33.873656 54.78125,32.810484 55.5,31.747312 56.114583,30.68414 56.625,29.620968 57.03125,28.557796 57.333333,27.494624 57.53125,26.431452 57.625,25.36828 57.614583,24.305108 57.5,23.241936 57.28125,22.178763 56.958333,21.115591 56.53125,20.052419 56,18.989247 55.364583,17.926075 54.625,16.862903 53.78125,15.799731 52.833333,14.736559 51.78125,13.673387 50.625,12.610215 49.364583,11.547043","mobilePoint":[74,23.741936],"mobileLabel":"vertical","color":"#512F2A","tint":"#EDA08D","sector":"agriculture","lines":["Agriculture, Mining,","Construction and","Manufacturing"],"iconPaths":["M3 28V12l9 5V9l9 7V4h6v24H3Z","M7 22h3m5 0h3m5 0h1"],"pattern":[{"d":"M6 10h24"},{"d":"M6 10v8q4 6 8 0v-8"},{"d":"M14 10v8q4 6 8 0v-8"}],"patternTransform":""},{"shape":"0,34 33.333333,38 34.722222,38.234375 36.111111,38.4375 37.5,38.609375 38.888889,38.75 40.277778,38.859375 41.666667,38.9375 42.857143,38.979592 46,48 41,56 42.857143,64 40,63.733333 21.428571,62 0,64","point":[23,49],"mobileShape":"0,36 2.166667,35.600694 4.333333,35.236111 6.5,34.90625 8.666667,34.611111 10.833333,34.350694 13,34.125 15.166667,33.934028 17.333333,33.777778 19.5,33.65625 21.666667,33.569444 23.833333,33.517361 26,33.5 28.166667,33.517361 30.333333,33.569444 32.5,33.65625 34.666667,33.777778 36.833333,33.934028 39,34.125 41.166667,34.350694 43.333333,34.611111 45.5,34.90625 47.666667,35.236111 49.833333,35.600694 52,36 75,36.479167 74.121528,37.125868 73.319444,37.77257 72.59375,38.419271 71.944444,39.065973 71.371528,39.712674 70.875,40.359375 70.454861,41.006077 70.111111,41.652778 69.84375,42.299479 69.652778,42.946181 69.538194,43.592882 69.5,44.239583 69.538194,44.886285 69.652778,45.532986 69.84375,46.179688 70.111111,46.826389 70.454861,47.47309 70.875,48.119792 71.371528,48.766493 71.944444,49.413195 72.59375,50.059896 73.319444,50.706597 74.121528,51.353299 75,52 71.875,52.239583 68.75,52.458333 65.625,52.65625 62.5,52.833333 59.375,52.989583 56.25,53.125 53.125,53.239583 50,53.333333 46.875,53.40625 44,53.454933 43.75,53.458333 40.625,53.489583 37.5,53.5 34.375,53.489583 31.25,53.458333 28.125,53.40625 25,53.333333 21.875,53.239583 18.75,53.125 15.625,52.989583 12.5,52.833333 9.375,52.65625 6.25,52.458333 3.125,52.239583 0,52","mobilePoint":[37.5,43.5],"mobileLabel":"vertical","color":"#202F4A","tint":"#8EAAE0","sector":"information","lines":["Information"],"iconPaths":["M3 6h26v21H3ZM3 11h26","M12 15l-4 4 4 4m8-8 4 4-4 4M18 13l-4 12"],"pattern":[{"d":"M6 29V13h16V6"},{"d":"M6 21h9v-5"}],"patternTransform":""},{"shape":"42.857143,38.979592 43.055555,38.984375 44.444444,39 45.833333,38.984375 47.222222,38.9375 48.611111,38.859375 50,38.75 51.388889,38.609375 52.777778,38.4375 54.166667,38.234375 55.555556,38 56.944445,37.734375 58.333334,37.4375 59.722222,37.109375 61.111111,36.75 62.5,36.359375 63.888889,35.9375 65.277778,35.484375 66.666667,35 71.428571,35.142857 70.915178,36.261905 70.446428,37.380952 70.022321,38.5 69.642857,39.619048 69.308035,40.738095 69.017857,41.857143 68.772321,42.97619 68.571428,44.095238 68.415178,45.214286 68.303571,46.333333 68.236607,47.452381 68.214286,48.571428 68.236607,49.690476 68.303571,50.809524 68.415178,51.928571 68.571428,53.047619 68.772321,54.166667 69.017857,55.285714 69.308035,56.404762 69.642857,57.52381 70.022321,58.642857 70.446428,59.761905 70.915178,60.880952 71.428571,62 70.238095,62.482639 69.047619,62.930555 67.857143,63.34375 66.666666,63.722222 65.47619,64.065972 64.285714,64.375 63.095238,64.649306 61.904762,64.888889 61,65.04775 60.714286,65.09375 59.523809,65.263889 58.333333,65.399306 57.142857,65.5 55.952381,65.565972 54.761905,65.597222 53.571429,65.59375 52.380952,65.555556 51.190476,65.482639 50,65.375 48.809524,65.232639 47.619048,65.055556 46.428572,64.84375 45.238095,64.597222 44.047619,64.315972 42.857143,64 41,56 46,48","point":[56.214286,50.298611],"mobileShape":"0,52 3.125,52.239583 6.25,52.458333 9.375,52.65625 12.5,52.833333 15.625,52.989583 18.75,53.125 21.875,53.239583 25,53.333333 28.125,53.40625 31.25,53.458333 34.375,53.489583 37.5,53.5 40.625,53.489583 43.75,53.458333 44,53.454933 49,61 56,66.0288 54.166667,66.013889 50,66 45.833333,66.013889 41.666667,66.055556 37.5,66.125 33.333333,66.222222 29.166667,66.347222 25,66.5 20.833333,66.680556 16.666667,66.888889 12.5,67.125 8.333333,67.388889 4.166667,67.680556 0,68","mobilePoint":[28,60],"mobileLabel":"vertical","color":"#503C24","tint":"#F1E2B8","sector":"professional","lines":["Professional and","Technical Services"],"iconPaths":["M3 10h26v17H3ZM11 10V5h10v5","M3 16q13 8 26 0M14 17h4v5h-4Z"],"pattern":[{"d":"M7 11h21"},{"d":"M7 18h17"},{"d":"M7 25h13"}],"patternTransform":""},{"shape":"71.428571,35.142857 100,36 100,64 98.809524,63.677083 97.619048,63.375 96.428571,63.09375 95.238095,62.833333 94.047619,62.59375 92.857143,62.375 91.666667,62.177083 90.47619,62 89.285714,61.84375 88.095238,61.708333 86.904762,61.59375 85.714286,61.5 84.523809,61.427083 83.333333,61.375 82.142857,61.34375 80.952381,61.333333 80,61.34 79.761904,61.34375 78.571428,61.375 77.380952,61.427083 76.190476,61.5 75,61.59375 73.809523,61.708333 72.619047,61.84375 71.428571,62 70.915178,60.880952 70.446428,59.761905 70.022321,58.642857 69.642857,57.52381 69.308035,56.404762 69.017857,55.285714 68.772321,54.166667 68.571428,53.047619 68.415178,51.928571 68.303571,50.809524 68.236607,49.690476 68.214286,48.571428 68.236607,47.452381 68.303571,46.333333 68.415178,45.214286 68.571428,44.095238 68.772321,42.97619 69.017857,41.857143 69.308035,40.738095 69.642857,39.619048 70.022321,38.5 70.446428,37.380952 70.915178,36.261905","point":[84.107143,49.571428],"mobileShape":"44,53.454933 46.875,53.40625 50,53.333333 53.125,53.239583 56.25,53.125 59.375,52.989583 62.5,52.833333 65.625,52.65625 68.75,52.458333 71.875,52.239583 75,52 100,51 100,68 95.833333,67.680556 91.666667,67.388889 87.5,67.125 83.333333,66.888889 79.166667,66.680556 75,66.5 70.833333,66.347222 66.666667,66.222222 62.5,66.125 58.333333,66.055556 56,66.0288 49,61","mobilePoint":[72,59.5],"mobileLabel":"vertical","color":"#234B46","tint":"#A9D5CB","sector":"healthcare","lines":["Health Care and","Social Assistance"],"iconPaths":["M11 3h10v8h8v10h-8v8H11v-8H3V11h8Z"],"pattern":[{"d":"M6 87h9l4-7 4 13 4-7h10"},{"d":"M41 87h10"}],"patternTransform":"translate(6 10) scale(.7)"},{"shape":"40,63.733333 42.857143,64 44.047619,64.315972 45.238095,64.597222 46.428572,64.84375 47.619048,65.055556 48.809524,65.232639 50,65.375 51.190476,65.482639 52.380952,65.555556 53.571429,65.59375 54.761905,65.597222 55.952381,65.565972 57.142857,65.5 58.333333,65.399306 59.523809,65.263889 60.714286,65.09375 61,65.04775 61,74 60,83.68 59.375,83.71875 58.333333,83.777778 57.291667,83.829861 56.25,83.875 55.208333,83.913194 54.166667,83.944444 53.125,83.96875 52.083333,83.986111 51.041667,83.996528 50,84 48.958333,83.996528 47.916667,83.986111 46.875,83.96875 45.833333,83.944444 44.791667,83.913194 43.75,83.875 42.708333,83.829861 41.666667,83.777778 41,83.7408 41.078125,82.907156 41.145833,82.073511 41.203125,81.239867 41.25,80.406222 41.286458,79.572578 41.3125,78.738933 41.328125,77.905289 41.333333,77.071644 41.328125,76.238 41.3125,75.404355 41.286458,74.570711 41.25,73.737066 41.203125,72.903422 41.145833,72.069778 41.078125,71.236133 41,70.402489 40.911458,69.568844 40.8125,68.7352 40.703125,67.901555 40.583333,67.067911 40.453125,66.234266 40.3125,65.400622 40.161458,64.566977","point":[50.5,74.5],"mobileShape":"0,76 1.416667,75.840278 2.833333,75.694444 4.25,75.5625 5.666667,75.444444 7.083333,75.340278 8.5,75.25 9.916667,75.173611 11.333333,75.111111 12.75,75.0625 14.166667,75.027778 15.583333,75.006944 17,75 18.416667,75.006944 19.833333,75.027778 21.25,75.0625 22.666667,75.111111 24.083333,75.173611 25.5,75.25 26.916667,75.340278 28.333333,75.444444 29.75,75.5625 31.166667,75.694444 32.583333,75.840278 34,76 33.921875,76.507353 33.854167,77.014706 33.796875,77.522059 33.75,78.029412 33.713542,78.536765 33.6875,79.044118 33.671875,79.551471 33.666667,80.058824 33.671875,80.566177 33.6875,81.07353 33.713542,81.580883 33.75,82.088235 33.796875,82.595588 33.854167,83.102941 33.921875,83.610294 34,84.117647 34.088542,84.625 34.1875,85.132353 34.296875,85.639706 34.416667,86.147059 34.546875,86.654412 34.6875,87.161765 34.838542,87.669118 35,88.176471 34,88 32.583333,87.920139 32,87.889273 31.166667,87.847222 29.75,87.78125 28.333333,87.722222 26.916667,87.670139 25.5,87.625 24.083333,87.586806 22.666667,87.555556 21.25,87.53125 19.833333,87.513889 18.416667,87.503472 17,87.5 15.583333,87.503472 14.166667,87.513889 12.75,87.53125 11.333333,87.555556 9.916667,87.586806 8.5,87.625 7.083333,87.670139 5.666667,87.722222 4.25,87.78125 2.833333,87.847222 1.416667,87.920139 0,88","mobilePoint":[17.5,81.588235],"mobileLabel":"vertical","color":"#523247","tint":"#E6B3C6","sector":"trade","lines":["Trade, Transportation,","and Utilities"],"iconPaths":["M3 7h17v16H3ZM20 12h6l4 6v5H20","M8 28a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm17 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"],"pattern":[{"d":"M7 13l10 7 10-7"},{"d":"M9 13a2 2 0 1 1-4 0a2 2 0 1 1 4 0"},{"d":"M19 20a2 2 0 1 1-4 0a2 2 0 1 1 4 0"},{"d":"M29 13a2 2 0 1 1-4 0a2 2 0 1 1 4 0"}],"patternTransform":"translate(10 65)"},{"shape":"0,64 21.428571,62 40,63.733333 40.161458,64.566977 40.3125,65.400622 40.453125,66.234266 40.583333,67.067911 40.703125,67.901555 40.8125,68.7352 40.911458,69.568844 41,70.402489 41.078125,71.236133 41.145833,72.069778 41.203125,72.903422 41.25,73.737066 41.286458,74.570711 41.3125,75.404355 41.328125,76.238 41.333333,77.071644 41.328125,77.905289 41.3125,78.738933 41.286458,79.572578 41.25,80.406222 41.203125,81.239867 41.145833,82.073511 41.078125,82.907156 41,83.7408 40.625,83.71875 39.583333,83.652778 38.541667,83.579861 37.5,83.5 36.458333,83.413194 35.416667,83.319444 34.375,83.21875 33.333333,83.111111 32.291667,82.996528 31.25,82.875 30.208333,82.746528 29.166667,82.611111 28.125,82.46875 27.083333,82.319444 26.041667,82.163194 25,82 0,82","point":[20.666667,72.8704],"mobileShape":"0,68 4.166667,67.680556 8.333333,67.388889 12.5,67.125 16.666667,66.888889 20.833333,66.680556 25,66.5 29.166667,66.347222 33.333333,66.222222 37.5,66.125 41.666667,66.055556 45.833333,66.013889 50,66 54.166667,66.013889 56,66.0288 58.333333,66.055556 62.5,66.125 66.666667,66.222222 70.833333,66.347222 75,66.5 79.166667,66.680556 83.333333,66.888889 87.5,67.125 91.666667,67.388889 95.833333,67.680556 100,68 100,76 98.75,76.119792 97.5,76.229167 96.25,76.328125 95,76.416667 93.75,76.494792 92.5,76.5625 91.25,76.619792 90,76.666667 88.75,76.703125 87.5,76.729167 86.25,76.744792 85,76.75 83.75,76.744792 82.5,76.729167 81.25,76.703125 80,76.666667 78.75,76.619792 77.5,76.5625 76.25,76.494792 75,76.416667 73.75,76.328125 72.5,76.229167 71.25,76.119792 70,76 34,76 32.583333,75.840278 31.166667,75.694444 29.75,75.5625 28.333333,75.444444 26.916667,75.340278 25.5,75.25 24.083333,75.173611 22.666667,75.111111 21.25,75.0625 19.833333,75.027778 18.416667,75.006944 17,75 15.583333,75.006944 14.166667,75.027778 12.75,75.0625 11.333333,75.111111 9.916667,75.173611 8.5,75.25 7.083333,75.340278 5.666667,75.444444 4.25,75.5625 2.833333,75.694444 1.416667,75.840278 0,76","mobilePoint":[50,71.375],"mobileLabel":"horizontal","color":"#294451","tint":"#A7CEDF","sector":"management","lines":["Management, Administrative,","and Support Services"],"iconPaths":["M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM3 29v-4a9 9 0 0 1 18 0v4","M24 5a4 4 0 0 1 0 8m0 6a7 7 0 0 1 6 7v3"],"pattern":[{"d":"M6 94Q7 78 23 80T39 71","dash":"3 5"},{"d":"M4 94h4"}],"patternTransform":""},{"shape":"61,65.04775 61.904762,64.888889 63.095238,64.649306 64.285714,64.375 65.47619,64.065972 66.666666,63.722222 67.857143,63.34375 69.047619,62.930555 70.238095,62.482639 71.428571,62 72.619047,61.84375 73.809523,61.708333 75,61.59375 76.190476,61.5 77.380952,61.427083 78.571428,61.375 79.761904,61.34375 80,61.34 80.479167,62.200833 80.916667,63.061667 81.3125,63.9225 81.666667,64.783333 81.979167,65.644167 82.25,66.505 82.479167,67.365833 82.666667,68.226667 82.8125,69.0875 82.916667,69.948333 82.979167,70.809167 83,71.67 82.979167,72.530833 82.916667,73.391667 82.8125,74.2525 82.666667,75.113333 82.479167,75.974167 82.25,76.835 81.979167,77.695833 81.666667,78.556667 81.3125,79.4175 80.916667,80.278333 80.479167,81.139167 80,82 75,82 73.958333,82.163194 72.916667,82.319444 71.875,82.46875 70.833333,82.611111 69.791667,82.746528 68.75,82.875 67.708333,82.996528 66.666667,83.111111 65.625,83.21875 64.583333,83.319444 63.541667,83.413194 62.5,83.5 61.458333,83.579861 60.416667,83.652778 60,83.68 61,74","point":[71.5,72.51],"mobileShape":"34,76 70,76 70,88 65,88.789474 51,91 35,88.176471 34.838542,87.669118 34.6875,87.161765 34.546875,86.654412 34.416667,86.147059 34.296875,85.639706 34.1875,85.132353 34.088542,84.625 34,84.117647 33.921875,83.610294 33.854167,83.102941 33.796875,82.595588 33.75,82.088235 33.713542,81.580883 33.6875,81.07353 33.671875,80.566177 33.666667,80.058824 33.671875,79.551471 33.6875,79.044118 33.713542,78.536765 33.75,78.029412 33.796875,77.522059 33.854167,77.014706 33.921875,76.507353","mobilePoint":[52,81.5],"mobileLabel":"vertical","color":"#FFF9F0","tint":"#8D4436","sector":"hospitality","lines":["Accommodation, Food,","and Other Services"],"iconPaths":["M5 14v14h22V14M3 14l3-9h20l3 9","M3 14q3 6 6 0 3 6 7 0 4 6 7 0 3 6 6 0M11 28v-8h10v8"],"pattern":[{"d":"M71 7h5v6h5V7h5v6h5V7h5"},{"d":"M78 19h18"}],"patternTransform":""},{"shape":"80,61.34 80.952381,61.333333 82.142857,61.34375 83.333333,61.375 84.523809,61.427083 85.714286,61.5 86.904762,61.59375 88.095238,61.708333 89.285714,61.84375 90.47619,62 91.666667,62.177083 92.857143,62.375 94.047619,62.59375 95.238095,62.833333 96.428571,63.09375 97.619048,63.375 98.809524,63.677083 100,64 100,82 80,82 80.479167,81.139167 80.916667,80.278333 81.3125,79.4175 81.666667,78.556667 81.979167,77.695833 82.25,76.835 82.479167,75.974167 82.666667,75.113333 82.8125,74.2525 82.916667,73.391667 82.979167,72.530833 83,71.67 82.979167,70.809167 82.916667,69.948333 82.8125,69.0875 82.666667,68.226667 82.479167,67.365833 82.25,66.505 81.979167,65.644167 81.666667,64.783333 81.3125,63.9225 80.916667,63.061667 80.479167,62.200833","point":[90,71.666667],"mobileShape":"75,36.479167 100,37 100,51 75,52 74.121528,51.353299 73.319444,50.706597 72.59375,50.059896 71.944444,49.413195 71.371528,48.766493 70.875,48.119792 70.454861,47.47309 70.111111,46.826389 69.84375,46.179688 69.652778,45.532986 69.538194,44.886285 69.5,44.239583 69.538194,43.592882 69.652778,42.946181 69.84375,42.299479 70.111111,41.652778 70.454861,41.006077 70.875,40.359375 71.371528,39.712674 71.944444,39.065973 72.59375,38.419271 73.319444,37.77257 74.121528,37.125868","mobilePoint":[85.5,44],"mobileLabel":"vertical","color":"#493B1B","tint":"#E5C36B","sector":"arts","lines":["Arts, Entertainment,","and Recreation"],"iconPaths":["M16 3C8 3 3 9 3 16s6 13 13 13h2c3 0 4-3 2-5s-1-5 2-5h3c6 0 5-9 1-12-3-3-6-4-10-4Z","M9 12h.01M15 8h.01M22 11h.01M8 19h.01"],"pattern":[{"d":"M5 77c5-5 10-5 15 0s10 5 15 0"},{"d":"M5 85c5-5 10-5 15 0s10 5 15 0"}],"patternTransform":""},{"shape":"0,82 25,82 25.480903,82.75 25.923611,83.5 26.328125,84.25 26.694444,85 27.022569,85.75 27.3125,86.5 27.564236,87.25 27.777778,88 27.953125,88.75 28.090278,89.5 28.189236,90.25 28.25,91 28.272569,91.75 28.256944,92.5 28.203125,93.25 28.111111,94 27.980903,94.75 27.8125,95.5 27.605903,96.25 27.361111,97 27.078125,97.75 26.756944,98.5 26.397569,99.25 26,100 0,100","point":[14.136285,91],"mobileShape":"70,76 71.25,76.119792 72.5,76.229167 73.75,76.328125 75,76.416667 76.25,76.494792 77.5,76.5625 78.75,76.619792 80,76.666667 81.25,76.703125 82.5,76.729167 83.75,76.744792 85,76.75 86.25,76.744792 87.5,76.729167 88.75,76.703125 90,76.666667 91.25,76.619792 92.5,76.5625 93.75,76.494792 95,76.416667 96.25,76.328125 97.5,76.229167 98.75,76.119792 100,76 100,88 98.75,88.159722 97.5,88.305556 96.25,88.4375 95,88.555556 93.75,88.659722 92.5,88.75 91.25,88.826389 90,88.888889 88.75,88.9375 87.5,88.972222 86.25,88.993056 85,89 83.75,88.993056 82.5,88.972222 81.25,88.9375 80,88.888889 78.75,88.826389 77.5,88.75 76.25,88.659722 75,88.555556 73.75,88.4375 72.5,88.305556 71.25,88.159722 70,88","mobilePoint":[85,82.5],"mobileLabel":"vertical","color":"#FFF9F0","tint":"#6C4C78","sector":"national-security","lines":["National Security"],"iconPaths":["M16 3 4 8v8c0 7 12 13 12 13s12-6 12-13V8Z","m10 16 4 4 8-9"],"pattern":[{"d":"M5 5h23"},{"d":"M5 5l19 9"},{"d":"M5 5l9 19"},{"d":"M5 5v23"}],"patternTransform":""},{"shape":"25,82 26.041667,82.163194 27.083333,82.319444 28.125,82.46875 29.166667,82.611111 30.208333,82.746528 31.25,82.875 32.291667,82.996528 33.333333,83.111111 34.375,83.21875 35.416667,83.319444 36.458333,83.413194 37.5,83.5 38.541667,83.579861 39.583333,83.652778 40.625,83.71875 41,83.7408 41.666667,83.777778 42.708333,83.829861 43.75,83.875 44.791667,83.913194 45.833333,83.944444 46.875,83.96875 47.916667,83.986111 48.958333,83.996528 50,84 49.439236,84.666667 48.923611,85.333333 48.453125,86 48.027778,86.666667 47.647569,87.333333 47.3125,88 47.022569,88.666667 46.777778,89.333333 46.578125,90 46.423611,90.666667 46.314236,91.333333 46.25,92 46.230903,92.666667 46.256944,93.333333 46.328125,94 46.444444,94.666667 46.605903,95.333333 46.8125,96 47.064236,96.666667 47.361111,97.333333 47.703125,98 48.090278,98.666667 48.522569,99.333333 49,100 26,100 26.397569,99.25 26.756944,98.5 27.078125,97.75 27.361111,97 27.605903,96.25 27.8125,95.5 27.980903,94.75 28.111111,94 28.203125,93.25 28.256944,92.5 28.272569,91.75 28.25,91 28.189236,90.25 28.090278,89.5 27.953125,88.75 27.777778,88 27.564236,87.25 27.3125,86.5 27.022569,85.75 26.694444,85 26.328125,84.25 25.923611,83.5 25.480903,82.75","point":[37.5,91],"mobileShape":"32,87.889273 32.583333,87.920139 34,88 35,88.176471 51,91 65,88.789474 66,94 68,100 32,100","mobilePoint":[50,95.5],"mobileLabel":"vertical","color":"#553923","tint":"#F0CCA9","sector":"education","lines":["Educational Services"],"iconPaths":["M16 7C10 3 6 3 2 5v22c4-2 9-2 14 1 5-3 10-3 14-1V5c-4-2-8-2-14 2v21","M6 10h5m-5 5h5m10-5h5m-5 5h5"],"pattern":[{"d":"M6 88q8-4 16 0q8-4 16 0"},{"d":"M8 81q6-2 12 0"},{"d":"M24 81q6-2 12 0"}],"patternTransform":""},{"shape":"50,84 51.041667,83.996528 52.083333,83.986111 53.125,83.96875 54.166667,83.944444 55.208333,83.913194 56.25,83.875 57.291667,83.829861 58.333333,83.777778 59.375,83.71875 60,83.68 60.416667,83.652778 61.458333,83.579861 62.5,83.5 63.541667,83.413194 64.583333,83.319444 65.625,83.21875 66.666667,83.111111 67.708333,82.996528 68.75,82.875 69.791667,82.746528 70.833333,82.611111 71.875,82.46875 72.916667,82.319444 73.958333,82.163194 75,82 75.399306,82.75 75.763889,83.5 76.09375,84.25 76.388889,85 76.649306,85.75 76.875,86.5 77.065972,87.25 77.222222,88 77.34375,88.75 77.430556,89.5 77.482639,90.25 77.5,91 77.482639,91.75 77.430556,92.5 77.34375,93.25 77.222222,94 77.065972,94.75 76.875,95.5 76.649306,96.25 76.388889,97 76.09375,97.75 75.763889,98.5 75.399306,99.25 75,100 49,100 48.522569,99.333333 48.090278,98.666667 47.703125,98 47.361111,97.333333 47.064236,96.666667 46.8125,96 46.605903,95.333333 46.444444,94.666667 46.328125,94 46.256944,93.333333 46.230903,92.666667 46.25,92 46.314236,91.333333 46.423611,90.666667 46.578125,90 46.777778,89.333333 47.022569,88.666667 47.3125,88 47.647569,87.333333 48.027778,86.666667 48.453125,86 48.923611,85.333333 49.439236,84.666667","point":[61.865451,91],"mobileShape":"0,88 1.416667,87.920139 2.833333,87.847222 4.25,87.78125 5.666667,87.722222 7.083333,87.670139 8.5,87.625 9.916667,87.586806 11.333333,87.555556 12.75,87.53125 14.166667,87.513889 15.583333,87.503472 17,87.5 18.416667,87.503472 19.833333,87.513889 21.25,87.53125 22.666667,87.555556 24.083333,87.586806 25.5,87.625 26.916667,87.670139 28.333333,87.722222 29.75,87.78125 31.166667,87.847222 32,87.889273 32,100 0,100","mobilePoint":[16,93.75],"mobileLabel":"vertical","color":"#203D27","tint":"#9CC29C","sector":"public-admin","lines":["Public Administration","excluding National Security"],"iconPaths":["M7 29V3M7 5c7-6 11 6 19 0v13c-8 6-12-6-19 0M3 29h9"],"pattern":[{"d":"M4 87c10-7 21-7 31 0"},{"d":"M4 94c10-7 21-7 31 0"}],"patternTransform":""},{"shape":"75,82 80,82 100,82 100,100 75,100 75.399306,99.25 75.763889,98.5 76.09375,97.75 76.388889,97 76.649306,96.25 76.875,95.5 77.065972,94.75 77.222222,94 77.34375,93.25 77.430556,92.5 77.482639,91.75 77.5,91 77.482639,90.25 77.430556,89.5 77.34375,88.75 77.222222,88 77.065972,87.25 76.875,86.5 76.649306,85.75 76.388889,85 76.09375,84.25 75.763889,83.5 75.399306,82.75","point":[87.5,91],"mobileShape":"65,88.789474 70,88 71.25,88.159722 72.5,88.305556 73.75,88.4375 75,88.555556 76.25,88.659722 77.5,88.75 78.75,88.826389 80,88.888889 81.25,88.9375 82.5,88.972222 83.75,88.993056 85,89 86.25,88.993056 87.5,88.972222 88.75,88.9375 90,88.888889 91.25,88.826389 92.5,88.75 93.75,88.659722 95,88.555556 96.25,88.4375 97.5,88.305556 98.75,88.159722 100,88 100,100 68,100 66,94","mobilePoint":[82.5,94.5],"mobileLabel":"vertical","color":"#332114","tint":"#C69668","sector":"real-estate","lines":["Real Estate and","Rental and Leasing"],"iconPaths":["M4 29V10h11V3h13v26H4ZM4 15h11m0-5v19M8 19v3m11-14h5m-5 5h5m-5 5h5m-5 5h5"],"pattern":[{"d":"M75 93V78h18"},{"d":"M82 93V85h11"}],"patternTransform":""}];
const SECTOR_PRIORITIES = {"source":{"title":"Prioritization of Risks from Artificial Intelligence: A Delphi Study of 272 International Experts","metric":"Sector vulnerability: mean expert rating, weighted by valid rating count across risks","formula":"For each risk-sector cell, mean_level = sum(level * pct_level), levels 1..5. Sector score = sum(mean_level * count) / sum(count) across all 24 risks.","scope24":true,"ratedRisks":24,"riskScope":"All 24 study risks, including AI welfare and rights (7.5), as used for sector sorting in the original figure code. The main-paper heatmap hides the welfare row after computing this order.","ratingsMeaning":"Sum of valid risk-sector ratings, not unique experts. One expert can rate several risks. Don't know responses are excluded from count.","scale":{"min":1,"max":5,"minLabel":"Not at all vulnerable","maxLabel":"Extremely vulnerable","measurement":"Ordinal expert judgment; score and tile-area ratios are not risk, urgency, loss or probability ratios."},"paperURL":"https://arxiv.org/abs/2606.04490","paperVersion":"v1, submitted 2026-06-03","paperFigure":"Figure 3, printed page 15 (PDF page 16)","projectURL":"https://osf.io/pj2qr/","downloadURL":"https://osf.io/download/6d58m/","date":"2026-10-05","snapshotGeneratedAt":"2026-05-25T21:14:12+1000","snapshotRound":"Round 3","snapshotGitSHA":"2a7cc5f7b6ebd51af1302fdd926aba97dff00947","snapshotArchivePath":"safe_for_osf/delphi_snapshot.rds","snapshotSHA256":"107de4998700ea82b00a142cd58b0609642906d941bebb021d81874287fbe829","provenanceArchivePath":"safe_for_osf/figures/02_actor_split_heatmap.R","provenanceLines":"86-92 (scores and sorting); 213-225 (welfare removed from display only)","provenanceSHA256":"18702a3d4d207f506267105a6cd0bad9ad85b702bca4de7e1c5957970914db79","precision":"Reproduces the source R script using the snapshot's published pct_1..pct_5 values without renormalizing or replacing their precision.","licenses":{"code":"MIT","data":"CC BY 4.0"}},"sectors":[{"id":"information","name":"Information","score":4.582475973154362,"ratedRisks":24,"ratings":1490},{"id":"finance","name":"Finance and Insurance","score":4.535178164768921,"ratedRisks":24,"ratings":1493},{"id":"national-security","name":"National Security","score":4.521179663299663,"ratedRisks":24,"ratings":1485},{"id":"healthcare","name":"Health Care and Social Assistance","score":4.405235670937289,"ratedRisks":24,"ratings":1483},{"id":"education","name":"Educational Services","score":4.166134807417975,"ratedRisks":24,"ratings":1402},{"id":"public-admin","name":"Public Administration excluding National Security","score":4.113294538098449,"ratedRisks":24,"ratings":1483},{"id":"research","name":"Scientific Research and Development Services","score":4.0464110961667785,"ratedRisks":24,"ratings":1487},{"id":"professional","name":"Professional and Technical Services","score":3.797724327956989,"ratedRisks":24,"ratings":1488},{"id":"management","name":"Management, Administrative, and Support Services","score":3.5564675510204085,"ratedRisks":24,"ratings":1470},{"id":"trade","name":"Trade, Transportation, and Utilities","score":3.5352135685210313,"ratedRisks":24,"ratings":1474},{"id":"real-estate","name":"Real Estate and Rental and Leasing","score":3.3586885245901636,"ratedRisks":24,"ratings":1464},{"id":"arts","name":"Arts, Entertainment, and Recreation","score":3.327022477995938,"ratedRisks":24,"ratings":1477},{"id":"agriculture","name":"Agriculture, Mining, Construction and Manufacturing","score":3.1374153165418655,"ratedRisks":24,"ratings":1469},{"id":"hospitality","name":"Accommodation, Food, and Other Services","score":2.9945042234332426,"ratedRisks":24,"ratings":1468}]};
const INCIDENTS = __agencyPayloads.INCIDENTS;
const { incidentLibraryPage, incidentLibraryResults, relatedIncidentSection, relatedIncidentText } = (() => {
// Source metadata discovery only. Risk IDs below are AC label crosswalks;
// neither a risk match nor a source incident count supplies a loss estimate.
const incidentEscape = value => String(value ?? '').replace(/[&<>"']/g, character => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[character]);
const incidentLabelKey = value => String(value ?? '').normalize('NFKC').toLowerCase()
  .replace(/,/g, '').replace(/\s+/g, ' ').trim();
const incidentSearchKey = value => String(value ?? '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
const incidentRows = context => Array.isArray(context.INCIDENTS?.records) ? context.INCIDENTS.records : [];
const incidentRisks = context => Array.isArray(context.DATA?.risks) ? context.DATA.risks : [];
const incidentRecentFirst = (a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')) || b.id - a.id;
const incidentRoute = (context, page, params = {}) => (context.routeUrl
  ? context.routeUrl(page, params) : `#/${page}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`);
const incidentCount = value => value.toLocaleString('en-US');

function incidentExternalLink(context, url, title) {
  const esc = context.esc || incidentEscape;
  let valid = false;
  try {
    const parsed = new URL(url);
    valid = parsed.protocol === 'https:' && !parsed.username && !parsed.password;
  } catch { /* Missing or malformed source URL is plain text. */ }
  if (!valid) return esc(title);
  return context.link ? context.link(url, title)
    : `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)} ↗</a>`;
}

function incidentCitation(context, record) {
  const esc = context.esc || incidentEscape;
  const expected = Number.isSafeInteger(record.id) && record.id > 0
    ? `https://incidentdatabase.ai/cite/${record.id}/` : null;
  return expected && record.citationURL === expected
    ? incidentExternalLink(context, expected, record.title) : esc(record.title);
}

/** Returns an AC canonical risk ID, never a claimed AIID-supplied code. */
function incidentRiskId(record, DATA, metadata = {}) {
  if (typeof record?.riskSubdomain !== 'string' || !record.riskSubdomain.trim()) return null;
  const risks = Array.isArray(DATA?.risks) ? DATA.risks : [];
  const key = incidentLabelKey(record.riskSubdomain);
  const exact = risks.filter(risk => incidentLabelKey(risk.name) === key);
  if (exact.length === 1) return exact[0].id;
  if (exact.length > 1) return null;
  const aliases = Array.isArray(metadata.riskLabelAliases) ? metadata.riskLabelAliases : [];
  // Aliases deliberately require the full unchanged source string. They do
  // not expand into fuzzy, substring, sector or semantic similarity matching.
  const alias = aliases.find(item => item.sourceLabel === record.riskSubdomain);
  if (!alias) return null;
  const target = risks.find(risk => risk.id === alias.riskId && risk.name === alias.canonicalLabel);
  return target?.id ?? null;
}

/** Intersects search and risk selection, returning a new newest-first array. */
function filterIncidentRecords(context = {}) {
  const records = incidentRows(context);
  const terms = incidentSearchKey(context.query).split(' ').filter(Boolean);
  const selectedRisk = typeof context.riskId === 'string' ? context.riskId : '';
  if (selectedRisk && selectedRisk !== 'unmapped' && !incidentRisks(context).some(risk => risk.id === selectedRisk)) return [];
  return records.filter(record => {
    const mappedId = incidentRiskId(record, context.DATA, context.INCIDENTS?.metadata);
    if (selectedRisk === 'unmapped' ? mappedId !== null : selectedRisk && mappedId !== selectedRisk) return false;
    const risk = incidentRisks(context).find(item => item.id === mappedId);
    const searchable = incidentSearchKey([record.id, record.title, record.date, record.riskDomain,
      record.riskSubdomain, mappedId, risk?.name].filter(value => value != null).join(' '));
    return terms.every(term => searchable.includes(term));
  }).sort(incidentRecentFirst);
}

function incidentClassification(context, record) {
  const esc = context.esc || incidentEscape;
  const id = incidentRiskId(record, context.DATA, context.INCIDENTS?.metadata);
  const source = `<span>${esc(record.riskDomain || 'Domain not recorded')}</span><small>${esc(record.riskSubdomain || 'Subdomain not recorded')}</small>`;
  return `${source}${id ? `<small><a href="${esc(incidentRoute(context, 'risk', { id }))}">AC taxonomy match: ${esc(id)}</a></small>` : '<small>No AC risk match</small>'}`;
}

function incidentLibraryResults(context = {}) {
  const esc = context.esc || incidentEscape;
  const records = filterIncidentRecords(context);
  const limit = Number.isSafeInteger(context.limit) && context.limit > 0 ? context.limit : 50;
  const shown = records.slice(0, limit);
  const count = `<p class="source-note" role="status">Showing ${incidentCount(shown.length)} of ${incidentCount(records.length)} matching source incident IDs (${incidentCount(incidentRows(context).length)} in this snapshot).</p>`;
  if (!shown.length) return `${count}<p>No source records match these filters. This is not evidence that the risk is absent.</p>`;
  const rows = shown.map(record => `<tr><td>AIID ${esc(record.id)}</td><td>${incidentCitation(context, record)}</td><td>${esc(record.date || 'Not recorded')}</td><td>${incidentClassification(context, record)}</td><td>${Number.isSafeInteger(record.reportCount) && record.reportCount >= 0 ? incidentCount(record.reportCount) : 'Not recorded'}</td></tr>`).join('');
  return `${count}<div class="table-scroll"><table><thead><tr><th scope="col">Source incident ID</th><th scope="col">Source title</th><th scope="col">Source event date</th><th scope="col">Source MIT classification</th><th scope="col">Linked reports</th></tr></thead><tbody>${rows}</tbody></table></div>${shown.length < records.length ? '<button type="button" data-more-incidents>Show 50 more source records</button>' : ''}`;
}

function incidentLibraryPage(context = {}) {
  const esc = context.esc || incidentEscape;
  const metadata = context.INCIDENTS?.metadata || {};
  const option = context.option || ((value, title, selected) => `<option value="${esc(value)}"${value === selected ? ' selected' : ''}>${esc(title)}</option>`);
  const heading = context.pageHeading || ((title, subtitle) => `<div class="page-heading"><div><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div></div>`);
  const selectedRisk = typeof context.riskId === 'string' ? context.riskId : '';
  const options = [option('', 'All risk labels', selectedRisk),
    ...incidentRisks(context).map(risk => option(risk.id, `${risk.id} ${risk.name}`, selectedRisk)),
    option('unmapped', 'No AC risk match', selectedRisk),
    ...(selectedRisk && selectedRisk !== 'unmapped' && !incidentRisks(context).some(risk => risk.id === selectedRisk)
      ? [option(selectedRisk, 'Unrecognized risk filter', selectedRisk)] : [])].join('');
  const aliases = Array.isArray(metadata.riskLabelAliases) ? metadata.riskLabelAliases : [];
  return `${heading('Incident library', 'Find reported incidents by title or MIT risk label, then examine the original record.')}
    <p class="compact">${incidentCount(incidentRows(context).length)} source incident IDs from the AI Incident Database, snapshot ${esc(metadata.snapshotDate || 'not recorded')}. One row is one source incident ID; linked reports are documents attached to that record.</p>
    <div class="toolbar"><label>Search source records<input type="search" id="incident-search" placeholder="Title, source ID or risk label" value="${esc(context.query || '')}"></label><label>MIT risk label<select id="incident-risk">${options}</select></label></div>
    <div id="incident-results">${incidentLibraryResults(context)}</div>
    <p class="source-note">Source classifications have not been independently validated here. A shared risk label does not establish a matching job or sector. These reported records supply neither exposure denominators nor verified loss amounts; their counts are not failure rates.</p>
    <details><summary>Source, counting unit and risk-label matching</summary><p>${esc(metadata.countingUnit || 'One unique AIID source incident ID.')}</p><p>Different source IDs are not assumed to be independent harmful events. This voluntary reporting sample is not representative of all AI use.</p><p>Original MIT domain and subdomain labels are shown unchanged. The risk filter uses an Agency Costs crosswalk to the shared taxonomy: exact names after comma, case and whitespace normalization, plus the documented exact-label alias below. Numeric AC taxonomy matches were not supplied in these AIID source fields. No sector is inferred.</p>${aliases.map(alias => `<p><strong>Exact-label crosswalk to ${esc(alias.riskId)}:</strong> “${esc(alias.sourceLabel)}” → “${esc(alias.canonicalLabel)}”. ${esc(alias.rationale)}</p>`).join('')}<p>${esc(metadata.attribution || 'AI Incident Database, Responsible AI Collaborative.')}</p><p>${incidentExternalLink(context, metadata.sourceURL, 'Source snapshot')} / ${incidentExternalLink(context, metadata.license?.url, metadata.license?.name || 'Source license')} / ${incidentExternalLink(context, metadata.license?.termsURL, 'Source terms')}</p></details>`;
}

// Generic action words also include change/release: these otherwise match
// unrelated title senses such as changing ID status or releasing footage.
const incidentCommonWords = new Set(`a an and are as at be been being but by can could did do does doing for from had has have if in into is it its may might not of on or our should that the their them these they this those to was were will with would you your ai agent agents system systems work works working review reviews reviewing operation operations task tasks job jobs change changes changed changing release releases released releasing`.split(' '));
const incidentTitleTokens = value => [...new Set(String(value ?? '').normalize('NFKC').toLowerCase()
  .match(/[\p{L}\p{N}]+/gu) || [])].filter(token => token.length > 2 && !incidentCommonWords.has(token));

function incidentRelatedMatches(context) {
  const riskIds = Array.isArray(context.workflow?.riskIds) ? context.workflow.riskIds : context.riskIds;
  if (!Array.isArray(riskIds) || !riskIds.length) return { selectedIds: [], matches: [] };
  const allowedIds = new Set(incidentRisks(context).map(risk => risk.id));
  const selectedIds = [...new Set(riskIds.filter(id => allowedIds.has(id)))];
  const weights = new Map();
  for (const [field, weight] of [['name', 3], ['task', 2], ['failure', 1]]) {
    for (const token of incidentTitleTokens(context.workflow?.[field])) {
      weights.set(token, (weights.get(token) || 0) + weight);
    }
  }
  const scored = incidentRows(context).filter(record => selectedIds.includes(
    incidentRiskId(record, context.DATA, context.INCIDENTS?.metadata),
  )).map(record => ({ record, score: incidentTitleTokens(record.title)
    .reduce((score, token) => score + (weights.get(token) || 0), 0) }));
  // Exact title-word overlap only: no sector inference, stemming, language
  // model or confidence estimate. Missing overlap retains date ordering.
  scored.sort((a, b) => b.score - a.score || incidentRecentFirst(a.record, b.record));
  const hasOverlap = scored.some(item => item.score > 0);
  const rankingNote = hasOverlap
    ? 'Titles with exact word overlap with the job name, task or failure appear first (name words ×3, task ×2, failure ×1). Ties use the newest source event date. This ordering does not verify relevance.'
    : 'No matching title words were found for this job, so candidates are ordered by newest source event date.';
  return { selectedIds, matches: scored.map(item => item.record), rankingNote };
}

function relatedIncidentSection(context = {}) {
  const { selectedIds, matches, rankingNote } = incidentRelatedMatches(context);
  if (!selectedIds.length) return '';
  const esc = context.esc || incidentEscape;
  const rows = matches.slice(0, 5);
  const params = selectedIds.length === 1 ? { risk: selectedIds[0] } : {};
  return `<section class="related-incidents"><h3>Records sharing MIT risk labels</h3><p class="source-note">${incidentCount(matches.length)} source incident IDs share a mapped risk label with this workflow. These are same-risk candidates, not verified matches for the job, system or sector.</p>${rows.length ? `<details class="source-note"><summary>How these records were selected</summary><p>${esc(rankingNote)}</p></details><ul>${rows.map(record => `<li>${incidentCitation(context, record)}<small>AIID ${esc(record.id)} / ${esc(record.date)} / ${esc(record.riskSubdomain)}</small></li>`).join('')}</ul>` : '<p>No source record in this snapshot shares these labels. This is a coverage gap, not evidence of safety.</p>'}<p><a href="${esc(incidentRoute(context, 'incidents', params))}">Search the incident library →</a></p></section>`;
}

function relatedIncidentText(context = {}) {
  const { selectedIds, matches, rankingNote } = incidentRelatedMatches(context);
  if (!selectedIds.length) return '';
  const metadata = context.INCIDENTS?.metadata || {};
  // Escape Markdown metacharacters and raw HTML in source strings. URLs are
  // admitted only through the source's exact incident-ID citation pattern.
  const plain = value => String(value ?? '').replace(/\r?\n/g, ' ')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/[\\`*_{}\[\]()#!|]/g, '\\$&');
  return [
    '### Records sharing MIT risk labels', '',
    `${incidentCount(matches.length)} source incident IDs share a mapped risk label with this workflow. These are same-risk candidates, not verified matches for the job, system or sector.`,
    ...(matches.length ? [rankingNote] : []),
    'One source incident ID is the counting unit. Different source IDs are not assumed to be independent events, and linked reports are not additional incidents. These records supply neither verified loss amounts nor exposure denominators.', '',
    ...(matches.length ? matches.slice(0, 5).flatMap(record => {
      const url = Number.isSafeInteger(record.id) && record.id > 0
        && record.citationURL === `https://incidentdatabase.ai/cite/${record.id}/` ? record.citationURL : '';
      return [
        `- AIID ${plain(record.id)}: ${plain(record.title)}`,
        `  Source event date: ${plain(record.date || 'Not recorded')}`,
        `  Source MIT domain: ${plain(record.riskDomain || 'Not recorded')}`,
        `  Source MIT subdomain: ${plain(record.riskSubdomain || 'Not recorded')}`,
        `  AC taxonomy match: ${plain(incidentRiskId(record, context.DATA, metadata))} (AC crosswalk; not a supplied AIID code).`,
        url ? `  Source: ${url}` : '  Source citation URL unavailable.', '',
      ];
    }) : ['No source record in this snapshot shares these labels. This is a coverage gap, not evidence of safety.', '']),
    `AIID snapshot: ${plain(metadata.snapshotDate || 'Not recorded')}. Source classifications have not been independently validated here.`,
    plain(metadata.attribution || 'AI Incident Database, Responsible AI Collaborative.'),
    'Metadata license: CC BY-SA 4.0 — https://creativecommons.org/licenses/by-sa/4.0/',
  ].join('\n');
}

return { incidentLibraryPage, incidentLibraryResults, relatedIncidentSection, relatedIncidentText };
})();
const { priorityEmphasisWeights, priorityTessellation } = (() => {
/**
 * Count-weighted mean of locally available sector response distributions.
 * Missing cells are excluded. The paper's complete 24-risk aggregate should
 * come from its published data, since this local snapshot has 23 sector cells.
 * A selected risk uses its published median. Neither is a failure rate.
 */
function sectorVulnerability(sector, risks, riskId = '') {
  const name = typeof sector === 'string' ? sector : sector?.name;
  const selected = Boolean(riskId);
  const weighting = selected ? 'selected-risk median' : 'count-weighted cell means';
  const records = Array.isArray(risks) ? risks : [];
  const eligible = selected ? records.filter(risk => risk?.id === riskId) : records;
  let weightedScore = 0;
  let totalRespondents = 0;
  let ratedRisks = 0;
  for (const risk of eligible) {
    const cell = risk?.sectors?.[name];
    if (!cell) continue;
    if (selected) {
      if (Number.isFinite(cell.median) && cell.median >= 1 && cell.median <= 5) {
        return { score: cell.median, ratedRisks: 1, weighting };
      }
      continue;
    }
    if (!Number.isSafeInteger(cell.count) || cell.count <= 0
      || !cell.distribution || typeof cell.distribution !== 'object' || Array.isArray(cell.distribution)) continue;
    const ratings = Object.entries(cell.distribution);
    if (!ratings.length || ratings.some(([level, share]) => !/^[1-5]$/.test(level)
      || !Number.isFinite(share) || share < 0 || share > 1)) continue;
    const totalShare = ratings.reduce((sum, [level, share]) => sum + share, 0);
    if (Math.abs(totalShare - 1) > 1e-8) continue;
    const mean = ratings.reduce((sum, [level, share]) => sum + Number(level) * share, 0);
    weightedScore += mean * cell.count;
    totalRespondents += cell.count;
    ratedRisks += 1;
  }
  return { score: totalRespondents > 0 ? weightedScore / totalRespondents : null, ratedRisks, weighting };
}

function layoutPercent(value) {
  return `${Math.min(100, Math.max(0, value)).toFixed(8)}%`;
}

/**
 * Return { cells, rows, columns }; cells is indexed by the supplied item IDs.
 * Positions, bounding boxes and vertices use whole-canvas percentages.
 * `points` is [top-left, top-right, bottom-right, bottom-left], each [x, y].
 * `clip` uses percentages inside each bounding box. `area` uses square canvas
 * percentage units: every cell together covers 100 * 100 = 10,000.
 *
 * Input order is retained. Each row is a horizontal band whose height is
 * proportional to its weight. Interior side boundaries slant in alternating
 * directions, with opposite offsets at the top and bottom. Their average
 * position remains the weighted boundary, preserving each cell's exact area.
 * Positive geometry weights are required; missing research scores must be
 * handled explicitly by the caller and are never silently changed into zero.
 */
function weightedTessellation(items, columns) {
  if (!Array.isArray(items)) throw new TypeError('Tessellation items must be an array.');
  if (!Number.isSafeInteger(columns) || columns < 1) throw new RangeError('Columns must be a positive integer.');
  const cells = Object.create(null);
  const rows = Math.ceil(items.length / columns);
  if (!items.length) return { cells, rows, columns };

  const seen = new Set();
  let maximumWeight = 0;
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || seen.has(item.id)) {
      throw new TypeError('Every tessellation item needs a unique nonempty string ID.');
    }
    if (!Number.isFinite(item.weight) || item.weight <= 0) {
      throw new RangeError('Every tessellation weight must be a finite positive number.');
    }
    seen.add(item.id);
    maximumWeight = Math.max(maximumWeight, item.weight);
  }
  // Scaling prevents an otherwise valid sum of very large weights overflowing.
  const normalized = items.map(item => ({ id: item.id, weight: item.weight / maximumWeight }));
  if (normalized.some(item => item.weight === 0)) {
    throw new RangeError('The weight range is too wide to represent every cell.');
  }
  const total = normalized.reduce((sum, item) => sum + item.weight, 0);
  let top = 0;
  for (let rowIndex = 0; rowIndex < rows; rowIndex += 1) {
    const row = normalized.slice(rowIndex * columns, (rowIndex + 1) * columns);
    const rowWeight = row.reduce((sum, item) => sum + item.weight, 0);
    const bottom = rowIndex === rows - 1 ? 100 : top + 100 * rowWeight / total;
    const height = bottom - top;
    const boundaries = [0];
    let cumulative = 0;
    row.forEach((item, index) => {
      cumulative += item.weight;
      boundaries.push(index === row.length - 1 ? 100 : 100 * cumulative / rowWeight);
    });
    const widths = row.map((item, index) => boundaries[index + 1] - boundaries[index]);
    const upper = [...boundaries];
    const lower = [...boundaries];
    for (let boundary = 1; boundary < row.length; boundary += 1) {
      const magnitude = 0.10 * Math.min(widths[boundary - 1], widths[boundary]);
      const offset = ((rowIndex + boundary) % 2 ? 1 : -1) * magnitude;
      upper[boundary] += offset;
      lower[boundary] -= offset;
    }
    row.forEach((item, index) => {
      const points = [
        [upper[index], top], [upper[index + 1], top],
        [lower[index + 1], bottom], [lower[index], bottom],
      ];
      const left = Math.min(upper[index], lower[index]);
      const right = Math.max(upper[index + 1], lower[index + 1]);
      const width = right - left;
      const upperWidth = upper[index + 1] - upper[index];
      const lowerWidth = lower[index + 1] - lower[index];
      const area = height * (upperWidth + lowerWidth) / 2;
      if (height <= 0 || width <= 0 || upperWidth <= 0 || lowerWidth <= 0 || !Number.isFinite(area) || area <= 0) {
        throw new RangeError('The weight range produces an unrepresentable cell.');
      }
      const clip = `polygon(${points.map(([x, y]) => `${layoutPercent(100 * (x - left) / width)} ${layoutPercent(100 * (y - top) / height)}`).join(',')})`;
      cells[item.id] = { left, top, width, height, clip, points, area };
    });
    top = bottom;
  }
  return { cells, rows, columns };
}

/**
 * Editorial display emphasis for the fourteen study sectors. Scores and
 * their ordering are preserved, but area does NOT encode score/risk ratios.
 * Equal scores share the earliest occupied rank and therefore the same size,
 * even across a nominal band boundary. No precision or certainty is added.
 */
function priorityEmphasisWeights(paperSectors) {
  if (!Array.isArray(paperSectors) || paperSectors.length !== 14) {
    throw new TypeError('Priority emphasis requires all fourteen study sectors.');
  }
  const ids = new Set();
  for (const sector of paperSectors) {
    if (!sector || typeof sector.id !== 'string' || !sector.id.trim() || ids.has(sector.id)) {
      throw new TypeError('Each study sector needs a unique nonempty string ID.');
    }
    if (!Number.isFinite(sector.score) || sector.score < 1 || sector.score > 5) {
      throw new RangeError('Every study sector needs its original finite 1–5 score.');
    }
    ids.add(sector.id);
  }
  const ordered = paperSectors.map((sector, index) => ({ ...sector, sourceIndex: index }))
    .sort((a, b) => b.score - a.score || a.sourceIndex - b.sourceIndex);
  let rank = 1;
  const items = ordered.map((sector, index) => {
    if (index > 0 && sector.score !== ordered[index - 1].score) rank = index + 1;
    const weight = rank <= 3 ? 5 : rank <= 7 ? 4 : rank <= 10 ? 3 : rank <= 12 ? 2 : 1;
    return { id: sector.id, score: sector.score, rank, weight };
  });
  return {
    items,
    method: 'Editorial rank emphasis: ranks 1–3 → 5, 4–7 → 4, 8–10 → 3, 11–12 → 2, 13–14 → 1; equal scores share a rank and size. Areas emphasize the paper’s ordering, not risk, loss or probability ratios.',
  };
}

function priorityPolygonArea(points) {
  return Math.abs(points.reduce((sum, [x, y], index) => {
    const next = points[(index + 1) % points.length];
    return sum + x * next[1] - next[0] * y;
  }, 0)) / 2;
}

function priorityCleanPolygon(points) {
  const cleaned = [];
  for (const point of points) {
    const previous = cleaned.at(-1);
    if (!previous || Math.hypot(point[0] - previous[0], point[1] - previous[1]) > 1e-11) cleaned.push(point);
  }
  if (cleaned.length > 1 && Math.hypot(cleaned[0][0] - cleaned.at(-1)[0], cleaned[0][1] - cleaned.at(-1)[1]) <= 1e-11) cleaned.pop();
  return cleaned;
}

// Both children receive the exact same intersection coordinates, so every
// cut is a shared edge rather than two independently perturbed outlines.
function prioritySplitPolygon(points, normal, position) {
  const before = [];
  const after = [];
  for (let index = 0; index < points.length; index += 1) {
    const start = points[index];
    const end = points[(index + 1) % points.length];
    const startDistance = start[0] * normal[0] + start[1] * normal[1] - position;
    const endDistance = end[0] * normal[0] + end[1] * normal[1] - position;
    if (startDistance <= 0) before.push(start);
    if (startDistance >= 0) after.push(start);
    if ((startDistance < 0 && endDistance > 0) || (startDistance > 0 && endDistance < 0)) {
      const proportion = startDistance / (startDistance - endDistance);
      const crossing = [start[0] + proportion * (end[0] - start[0]), start[1] + proportion * (end[1] - start[1])];
      before.push(crossing);
      after.push(crossing);
    }
  }
  return [priorityCleanPolygon(before), priorityCleanPolygon(after)];
}

function priorityBounds(points) {
  const x = points.map(point => point[0]);
  const y = points.map(point => point[1]);
  return { left: Math.min(...x), top: Math.min(...y), right: Math.max(...x), bottom: Math.max(...y) };
}

function priorityCentroid(points) {
  let crossSum = 0;
  let weightedX = 0;
  let weightedY = 0;
  for (let index = 0; index < points.length; index += 1) {
    const [x, y] = points[index];
    const [nextX, nextY] = points[(index + 1) % points.length];
    const cross = x * nextY - nextX * y;
    crossSum += cross;
    weightedX += (x + nextX) * cross;
    weightedY += (y + nextY) * cross;
  }
  return [weightedX / (3 * crossSum), weightedY / (3 * crossSum)];
}

function priorityHorizontalChord(points, y) {
  const intersections = [];
  for (let index = 0; index < points.length; index += 1) {
    const a = points[index];
    const b = points[(index + 1) % points.length];
    if (a[1] === b[1]) {
      if (y === a[1]) intersections.push(a[0], b[0]);
    } else if (y >= Math.min(a[1], b[1]) && y <= Math.max(a[1], b[1])) {
      intersections.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
    }
  }
  return [Math.min(...intersections), Math.max(...intersections)];
}

function priorityCell(points) {
  const { left, top, right, bottom } = priorityBounds(points);
  const width = right - left;
  const height = bottom - top;
  const area = priorityPolygonArea(points);
  const centroid = priorityCentroid(points);
  if (points.length < 3 || ![width, height, area, ...centroid].every(value => Number.isFinite(value))
    || width <= 0 || height <= 0 || area <= 1e-10) {
    throw new RangeError('The weight or aspect-ratio range produces an unrepresentable priority cell.');
  }
  // A small centered rectangle fits inside the convex cell: intersect chords
  // at its top and bottom, then inset horizontally. Its four corners are
  // inside, which is sufficient for the entire rectangle in a convex polygon.
  const availableHeight = 2 * Math.min(centroid[1] - top, bottom - centroid[1]);
  let labelBox = null;
  for (const fraction of [0.72, 0.58, 0.44]) {
    const boxHeight = availableHeight * fraction;
    const boxTop = centroid[1] - boxHeight / 2;
    const upper = priorityHorizontalChord(points, boxTop);
    const lower = priorityHorizontalChord(points, boxTop + boxHeight);
    const chordLeft = Math.max(upper[0], lower[0]);
    const chordRight = Math.min(upper[1], lower[1]);
    const boxWidth = (chordRight - chordLeft) * 0.88;
    const boxLeft = (chordLeft + chordRight - boxWidth) / 2;
    if (boxWidth > 0 && (!labelBox || boxWidth * boxHeight > labelBox.width * labelBox.height)) {
      labelBox = { left: boxLeft, top: boxTop, width: boxWidth, height: boxHeight };
    }
  }
  if (!labelBox) throw new RangeError('A readable inner label region could not be represented.');
  const localLabel = {
    left: 100 * (labelBox.left - left) / width,
    top: 100 * (labelBox.top - top) / height,
    width: 100 * labelBox.width / width,
    height: 100 * labelBox.height / height,
  };
  return {
    left, top, width, height, points, area,
    clip: `polygon(${points.map(([x, y]) => `${layoutPercent(100 * (x - left) / width)} ${layoutPercent(100 * (y - top) / height)}`).join(',')})`,
    labelX: localLabel.left + localLabel.width / 2,
    labelY: localLabel.top + localLabel.height / 2,
    labelWidth: localLabel.width,
    labelHeight: localLabel.height,
    labelBox: localLabel,
  };
}

/**
 * Recursive polygon treemap. Input weights are visual areas, not scores.
 * Each cut evaluates both physical axes with small alternating oblique angles.
 * Its descendants determine the choice: prefer balanced, slightly landscape
 * inner label regions instead of creating a thin full-height singleton. Each
 * cut is solved for its exact requested area. Convex children share boundaries.
 * There are no imposed row bands, gaps, random seeds or overlaps.
 *
 * aspectRatio is the rendered canvas width/height (for example 3.8 or 0.65).
 * Cell bbox/points/area use the same units as weightedTessellation. LabelX/Y,
 * labelWidth/Height and labelBox are percentages inside each cell's own bbox.
 */
function priorityTessellation(items, { aspectRatio = 3 } = {}) {
  if (!Array.isArray(items)) throw new TypeError('Priority tessellation items must be an array.');
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0 || !Number.isFinite(100 * aspectRatio)) {
    throw new RangeError('Canvas aspect ratio must be finite, positive and representable.');
  }
  const cells = Object.create(null);
  const method = 'Area-preserving recursive convex polygon treemap; both cut axes are compared for balanced inner label regions.';
  if (!items.length) return { cells, method };
  const ids = new Set();
  let maximumWeight = 0;
  for (const item of items) {
    if (!item || typeof item.id !== 'string' || !item.id.trim() || ids.has(item.id)) {
      throw new TypeError('Every priority cell needs a unique nonempty string ID.');
    }
    if (!Number.isFinite(item.weight) || item.weight <= 0) throw new RangeError('Every priority weight must be finite and positive.');
    ids.add(item.id);
    maximumWeight = Math.max(maximumWeight, item.weight);
  }
  const scaled = items.map(item => ({ id: item.id, weight: item.weight / maximumWeight }));
  if (scaled.some(item => item.weight === 0)) throw new RangeError('The weight range is too wide to represent all priority cells.');

  const partition = (group, polygon, depth) => {
    if (group.length === 1) {
      const points = polygon.map(([x, y]) => [Math.min(100, Math.max(0, x / aspectRatio)), Math.min(100, Math.max(0, y))]);
      const cell = priorityCell(points);
      const labelAspect = cell.width * aspectRatio * cell.labelWidth / (cell.height * cell.labelHeight);
      const labelCoverage = cell.width * cell.height * cell.labelWidth * cell.labelHeight / (10000 * cell.area);
      // Physical text boxes near 3:2 read more naturally than skinny columns.
      // Area weighting gives larger display tiles corresponding influence;
      // this is a geometry objective, unrelated to the source risk metric.
      const cost = cell.area * (Math.log(labelAspect / 1.5) ** 2 + 0.3 * (1 - labelCoverage));
      return { cells: [[group[0].id, cell]], cost };
    }
    const total = group.reduce((sum, item) => sum + item.weight, 0);
    let splitIndex = 1;
    let beforeWeight = group[0].weight;
    let cumulative = beforeWeight;
    for (let index = 2; index < group.length; index += 1) {
      cumulative += group[index - 1].weight;
      if (Math.abs(cumulative - total / 2) < Math.abs(beforeWeight - total / 2)) {
        splitIndex = index;
        beforeWeight = cumulative;
      }
    }
    const slope = (depth % 2 ? -1 : 1) * 0.09;
    const targetArea = priorityPolygonArea(polygon) * beforeWeight / total;
    let best = null;
    for (const normal of [[1, slope], [slope, 1]]) {
      const projections = polygon.map(([x, y]) => x * normal[0] + y * normal[1]);
      let low = Math.min(...projections);
      let high = Math.max(...projections);
      for (let iteration = 0; iteration < 64; iteration += 1) {
        const midpoint = (low + high) / 2;
        if (midpoint === low || midpoint === high) break;
        const [before] = prioritySplitPolygon(polygon, normal, midpoint);
        if (priorityPolygonArea(before) < targetArea) low = midpoint;
        else high = midpoint;
      }
      const children = prioritySplitPolygon(polygon, normal, (low + high) / 2);
      if (children.some(child => child.length < 3 || priorityPolygonArea(child) <= 0)) continue;
      try {
        const before = partition(group.slice(0, splitIndex), children[0], depth + 1);
        const after = partition(group.slice(splitIndex), children[1], depth + 1);
        const candidate = { cells: [...before.cells, ...after.cells], cost: before.cost + after.cost };
        if (!best || candidate.cost < best.cost) best = candidate;
      } catch (error) {
        // A numerically unrepresentable cut does not rule out the other axis.
        if (!(error instanceof RangeError)) throw error;
      }
    }
    if (!best) throw new RangeError('The requested priority weights cannot form nondegenerate cells.');
    return best;
  };
  const layout = partition(scaled, [[0, 0], [100 * aspectRatio, 0], [100 * aspectRatio, 100], [0, 100]], 0);
  for (const [id, cell] of layout.cells) cells[id] = cell;
  return { cells, method };
}

return { priorityEmphasisWeights, priorityTessellation };
})();
const { resolveDecisionSelection } = (() => {
// One sector/job selection powers the whole decision workspace and its URL.
function resolveDecisionSelection(sectors, workflows, params = new URLSearchParams()) {
  const sectorId = params.get('sector');
  const workflowId = params.get('workflow');
  const sector = sectors.find(item => item.id === sectorId);
  const workflow = workflows.find(item => item.id === workflowId);
  if (sector) {
    const selected = workflow?.sector === sector.id ? workflow
      : workflows.find(item => item.sector === sector.id);
    return { sector, workflow: selected || null };
  }
  if (workflow) {
    const parent = sectors.find(item => item.id === workflow.sector);
    if (parent) return { sector: parent, workflow };
  }
  const fallback = workflows.find(item => item.id === 'information-code')
    || workflows.find(item => sectors.some(parent => parent.id === item.sector));
  return { sector: sectors.find(item => item.id === fallback?.sector) || null,
    workflow: fallback || null };
}

return { resolveDecisionSelection };
})();
const { evidenceWorkflow } = (() => {
// Comparisons are joined by explicitly reviewed task mappings, never by sector alone.
function evidenceSelection(workflow, comparisons = {}, investigations = {}, params = new URLSearchParams()) {
  if (!workflow?.id) return { studies: [], cases: [], study: null, metric: null, incident: null };
  const studies = (comparisons.records || []).filter(record => record.workflowIds?.includes(workflow.id));
  const cases = (investigations.cases || []).filter(record => record.workflowIds?.includes(workflow.id));
  const study = studies.find(record => record.id === params.get('study')) || studies[0] || null;
  const metric = study?.metrics?.find(item => item.id === params.get('metric'))
    || study?.metrics?.find(item => item.id === study.defaultMetric) || null;
  const incident = cases.find(record => record.id === params.get('incident')) || cases[0] || null;
  return { studies, cases, study, metric, incident };
}

function comparisonBars(metric) {
  const arms = (metric?.arms || []).filter(arm => Number.isFinite(arm.value) && arm.value >= 0);
  const maximum = Math.max(metric?.unit === 'percent of teams' ? 100 : 1,
    ...arms.flatMap(arm => [arm.value, ...(arm.ci95 || []).filter(Number.isFinite)]));
  return arms.map(arm => ({ ...arm, width: arm.value / maximum * 100 }));
}

function evidenceWorkflow(context) {
  const { workflow: w, DATA, COMPARISONS, INVESTIGATIONS, EVIDENCE, params } = context;
  if (!w || !DATA.sectors.some(sector => sector.id === w.sector)) return '';
  const esc = context.esc;
  const source = (url, label) => {
    try { const parsed = new URL(url); if (parsed.protocol !== 'https:' || parsed.username || parsed.password) return esc(label); }
    catch { return esc(label); }
    return `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;
  };
  const number = value => Number.isFinite(value) ? value.toLocaleString('en-US', { maximumFractionDigits: Math.abs(value) < 1 ? 4 : 1 }) : 'Not reported';
  const pick = (key, value, label, selected) => `<button type="button" data-evidence-key="${esc(key)}" data-evidence-value="${esc(value)}" aria-pressed="${Boolean(selected)}">${esc(label)}</button>`;
  const selection = evidenceSelection(w, COMPARISONS, INVESTIGATIONS, params);
  const { study, metric, incident } = selection;
  const failureView = params.get('view') === 'failures';
  const humanTask = context.HUMAN_TASKS?.workflows?.find(item => item.workflowId === w.id);
  const humanReference = humanTask?.tasks?.length ? `<p class="evidence-footnote">Human task match: ${esc(humanTask.tasks[0]?.text)} ${source(`https://www.onetonline.org/link/summary/${humanTask.occupationCode}`, 'O*NET')}</p>` : '';
  const relevantRiskIds = [...new Set([...w.riskIds, ...(failureView ? incident?.riskIds || [] : [])])];
  const priorities = relevantRiskIds.map(id => DATA.risks.find(risk => risk.id === id)).filter(Boolean)
    .sort((a, b) => (b.sectors?.[DATA.sectors.find(s => s.id === w.sector).name]?.median || 0)
      - (a.sectors?.[DATA.sectors.find(s => s.id === w.sector).name]?.median || 0));
  const risk = priorities.find(item => item.id === params.get('risk'))
    || (failureView && priorities.find(item => item.id === incident?.riskIds?.[0])) || priorities[0];
  const sectorRating = risk?.sectors?.[DATA.sectors.find(s => s.id === w.sector).name];
  const owner = risk?.responsibility?.['AI Deployer'];
  const riskContext = risk ? `<aside class="evidence-mit"><p class="eyebrow">MIT risk context</p><div class="evidence-options risk-options" role="group" aria-label="Relevant MIT risks">${priorities.map(item => pick('risk', item.id, item.name, item.id === risk.id)).join('')}</div><div class="mit-context-values"><div><strong>${sectorRating ? `${number(sectorRating.median)}/5` : 'Unknown'}</strong><span>Sector vulnerability${sectorRating ? ` / n = ${sectorRating.count}` : ''}</span></div><div><strong>${owner ? `${number(owner.median)}/5` : 'Unknown'}</strong><span>Deployer responsibility${owner ? ` / n = ${owner.count}` : ''}</span></div></div><p class="evidence-footnote">Expert judgments. These scores do not estimate the job’s failure rate.</p><a href="#/risk?id=${esc(risk.id)}&sector=${esc(w.sector)}">Read the underlying risk evidence</a></aside>` : '';
  const nav = failureView ? `<button class="quiet" data-evidence-key="view" data-evidence-value="comparison">Back to comparison</button>` : '';
  const heading = `<header class="evidence-workflow-heading"><div><p class="eyebrow">${failureView ? 'Investigate the consequences' : 'Compare the work'}</p><h2>${esc(w.name)}</h2></div>${nav}</header>`;

  if (!failureView) {
    const bars = comparisonBars(metric);
    const sampleText = study?.sample?.total ? `${study.sample.total} ${study.sample.unit.startsWith('team') ? 'teams' : `${study.sample.unit}s`}${study.sample.humans ? ` / ${study.sample.humans} developers` : ''}`
      : study?.sample?.humans ? `${number(study.sample.humans)} workers in full study / ${number(metric?.effect?.n ?? study.sample.mainRegressionObservations)} worker-months for this outcome` : '';
    const chart = bars.length ? `<div class="comparison-chart" role="img" aria-label="${esc(metric.label)}: ${bars.map(arm => `${esc(arm.label)} ${number(arm.value)}`).join('; ')}">${bars.map(arm => `<div class="comparison-arm"><div class="arm-label"><span>${esc(arm.label)}</span><strong>${number(arm.value)}${metric.unit === 'percent of teams' ? '%' : ''}</strong></div><div class="arm-track"><span class="arm-fill arm-${esc(arm.id)}" style="width:${arm.width}%"></span></div><small>${arm.numerator != null ? `${number(arm.numerator)} / ${number(arm.denominator)}${metric.unit === 'errors per team' ? ' errors / teams' : metric.unit === 'false positives per team' ? ' false positives / teams' : ' teams'}` : arm.n != null ? `n = ${arm.n} issues` : arm.reference ? 'Reference' : 'Adjusted estimate'}${arm.ci95 ? ` / 95% CI ${number(arm.ci95[0])}–${number(arm.ci95[1])}` : ''}</small></div>`).join('')}</div>` : metric?.effect ? `<div class="effect-value"><strong>${number(metric.effect.value)}</strong><span>${esc(metric.effect.unit)}</span>${metric.effect.standardError != null ? `<small>Standard error ${metric.effect.standardError}</small>` : ''}</div>` : '';
    const comparison = study ? `<section class="comparison-study"><p class="study-setting">${esc(study.observationPeriod.label)} / ${esc(sampleText)}</p><h3>${esc(study.headline)}</h3>${selection.studies.length > 1 ? `<div class="evidence-options">${selection.studies.map(item => pick('study', item.id, item.title, item.id === study.id)).join('')}</div>` : ''}<div class="evidence-options metric-options" role="group" aria-label="Measured outcomes">${study.metrics.map(item => pick('metric', item.id, item.label, item.id === metric.id)).join('')}</div><p class="chart-unit">${esc(metric.unit)} / ${metric.lowerIsBetter ? 'Lower' : 'Higher'} is better</p>${chart}<p class="evidence-footnote">${esc(metric.basis)}</p><div class="study-boundary"><strong>What this supports</strong><p>${esc(study.conclusion || study.headline)}</p><p>${esc(study.boundary || study.setting)}</p></div>${study.freshness ? `<p class="evidence-footnote">${source(study.freshness.url, 'Later METR study')}: newer estimates have selection and timing limitations.</p>` : ''}<p class="evidence-source">${study.sources.slice(0, 1).map(item => source(item.url, item.title)).join(' / ')} / <a href="#/sources">Data and limitations</a></p></section>`
      : `<section class="comparison-study comparison-empty"><h3>No matched human–AI comparison yet</h3><p>${esc(w.task)}</p><p class="evidence-footnote">The MIT sector ratings help locate risks. They do not measure whether delegating this job pays off.</p><div class="study-boundary"><strong>Decision still open</strong><p>Comparable task outcomes and total costs are missing.</p></div></section>`;
    const quantification = context.renderQuantification ? context.renderQuantification({ ...selection, workflow: w, esc, source }) : '';
    return `<article class="evidence-workflow">${heading}${quantification}<div class="evidence-board">${comparison}${riskContext}</div>${humanReference}<div class="workflow-next"><span>${selection.cases.length ? `${selection.cases.length} task-linked incident${selection.cases.length === 1 ? '' : 's'} to investigate` : 'Inspect the risks and available safeguards'}</span><button class="primary" data-evidence-key="view" data-evidence-value="failures">Investigate possible failures</button></div></article>`;
  }
  // Case details and safeguard selection are supplied by the normalized source adapter.
  const casePanel = context.renderIncident ? context.renderIncident({ ...selection, workflow: w, risk, params, esc, source, pick }) : '';
  return `<article class="evidence-workflow">${heading}<div class="evidence-board investigation-board"><section>${casePanel}</section>${riskContext}</div><div class="workflow-next"><span>Evidence informs the delegation boundary; total net benefit remains unmeasured.</span><button data-evidence-key="view" data-evidence-value="comparison">Return to comparison</button></div></article>`;
}

return { evidenceWorkflow };
})();
const { incidentInvestigation } = (() => {
// Incident narratives, provisional classifications and measured loss stay separate.
function matchingSafeguards(riskId, mappings = {}) {
  if (!riskId) return [];
  return (mappings.controls || [])
    .filter(control => control.riskPrimary === riskId || control.riskOther?.includes(riskId))
    .sort((a, b) => Number(Boolean(a.childIds?.length)) - Number(Boolean(b.childIds?.length))
      || Number(b.riskPrimary === riskId) - Number(a.riskPrimary === riskId)
      || Number(b.actorPrimary === '02 Deployer') - Number(a.actorPrimary === '02 Deployer'))
    .slice(0, 5);
}

const normalizedIdentity = value => String(value || '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

function workflowSafeguards(workflow, data = {}, mappings = {}) {
  return (workflow?.controls || []).map(application => {
    const original = (data.mitigations || []).find(control => control.id === application.id);
    if (!original) return null;
    const exact = (mappings.controls || []).filter(control =>
      normalizedIdentity(control.name) === normalizedIdentity(original.name)
      && normalizedIdentity(control.sourceId) === normalizedIdentity(original.source));
    const enriched = exact.length === 1 ? exact[0] : null;
    return { ...original, ...application, sourceId: original.source,
      sourceTitle: enriched?.sourceTitle || original.source,
      sourceUrl: enriched?.sourceUrl || null,
      actorPrimary: enriched?.actorPrimary, lifecyclePrimary: enriched?.lifecyclePrimary };
  }).filter(Boolean);
}

function selectedIndex(params, count) {
  const raw = params?.get('safeguard');
  const index = raw == null ? 0 : Number(raw);
  return Number.isInteger(index) && index >= 0 && index < count ? index : 0;
}

function incidentInvestigation(context) {
  const { workflow, cases = [], params, esc, source, pick, EVIDENCE = {}, MAPPINGS = {} } = context;
  const incident = context.incident || cases[0];
  const controls = MAPPINGS.controls || [];
  const controlLink = control => {
    const definition = control.definition || control.displayText || control.name;
    const description = normalizedIdentity(definition) === normalizedIdentity(control.name) ? '' : `<p>${esc(definition)}</p>`;
    return `<div class="investigation-control"><strong>${esc(control.name)}</strong>${description}<p class="evidence-source">${control.sourceUrl ? source(control.sourceUrl, control.sourceTitle || control.sourceId) : esc(control.sourceTitle || control.sourceId)}${control.definitionPageNumber ? ` / p. ${esc(control.definitionPageNumber)}` : ''}</p><p class="evidence-footnote">${esc([control.actorPrimary, control.lifecyclePrimary].filter(Boolean).map(value => value.replace(/^\d+\s+/, '')).join(' / '))}</p></div>`;
  };
  const library = `<a href="#/incidents${context.risk?.id ? `?risk=${encodeURIComponent(context.risk.id)}` : ''}">Search the incident library</a>`;

  if (!incident) {
    const matches = workflowSafeguards(workflow, context.DATA, MAPPINGS);
    const index = selectedIndex(params, matches.length);
    const selected = matches[index];
    return `<div class="incident-investigation investigation-empty"><h3>No task-linked case in this selection</h3><p>These safeguards were selected for this job. A source-checked incident is still needed to examine how a failure unfolded.</p>${selected ? `<div class="evidence-options safeguard-options" role="group" aria-label="Safeguards matched to this job">${matches.map((control, i) => pick('safeguard', String(i), control.name, i === index)).join('')}</div><p>${esc(selected.rationale)}</p>${controlLink(selected)}<p class="evidence-footnote"><strong>Check:</strong> ${esc(selected.evidenceNeeded)}</p><p class="evidence-footnote">AC’s job-specific application of MIT-sourced safeguards; effectiveness and cost are not measured here.</p>` : '<p class="evidence-footnote">No safeguard has been mapped to this job.</p>'}<p class="evidence-source">${library}</p></div>`;
  }

  const primary = incident.primarySources || [];
  const candidate = primary.length === 0;
  const gaps = incident.safeguardGaps || [];
  const index = selectedIndex(params, gaps.length);
  const gap = gaps[index];
  const mapped = (gap?.controlIds || []).map(id => controls.find(control => control.id === id)).filter(Boolean);
  const financial = (EVIDENCE.cases || []).find(record => record.id === incident.evidenceCaseId)?.financial;
  const hasAmount = Number.isFinite(financial?.amount) && financial.currency;
  const amount = hasAmount
    ? `${financial.relation === 'greater_than' ? 'More than ' : financial.relation === 'less_than' ? 'Less than ' : ''}${financial.currency} ${financial.amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}` : 'Not reported';
  const money = financial ? `<p class="investigation-money"><strong>${esc(hasAmount ? amount : financial.label || 'Not reported')}</strong> <span>${hasAmount ? `${esc(financial.status)}. ` : ''}${esc(financial.note || '')}</span></p>`
    : '<p class="evidence-footnote">No verified monetary loss in this case record.</p>';
  const sources = primary.length ? primary.map(item => source(item.url, item.title)).join(' / ')
    : source(incident.catalogueUrl, 'AI Incident Database record');
  const safe = gap ? `<div class="investigation-safeguards"><h4>Safeguard to examine</h4><div class="evidence-options safeguard-options" role="group" aria-label="Safeguards for this case">${gaps.map((item, i) => pick('safeguard', String(i), item.name, i === index)).join('')}</div><p>${esc(gap.basis)}</p>${mapped.map(controlLink).join('')}<p class="evidence-footnote">${esc(gap.status)}. ${esc(gap.effectivenessStatus || 'Effectiveness and cost are not measured in this case.')}</p></div>` : '';
  const causalLabels = [incident.systemType, incident.causal?.entity, incident.causal?.intent, incident.causal?.timing].filter(Boolean);
  return `<div class="incident-investigation"><div class="evidence-options incident-options" role="group" aria-label="Task-linked failure cases">${cases.map(item => pick('incident', item.id, item.title, item.id === incident.id)).join('')}</div><p class="eyebrow">${candidate ? 'Candidate case / primary source not checked' : 'Source-linked case'}</p><h3>${esc(incident.title)}</h3><p class="investigation-task">${esc(incident.task)}</p><div class="investigation-findings"><div><h4>How it failed</h4><p>${esc(incident.causal?.mechanism || 'The failure mechanism has not been established.')}</p></div><div><h4>Reported consequence</h4><p>${esc(incident.harm?.summary || 'The consequence has not been established.')}</p>${money}</div></div><p class="evidence-source">${sources}</p><p class="evidence-footnote">${esc(incident.reviewStatus)}. ${esc(incident.workflowMappingBasis)}</p>${causalLabels.length ? `<p class="evidence-footnote">Provisional classification: ${esc(causalLabels.join(' / '))}.</p>` : ''}${safe}<p class="evidence-source">${library}</p></div>`;
}

return { incidentInvestigation };
})();
const COMPARISONS = {"schemaVersion":1,"asOf":"2026-10-05","status":"Verified external comparison candidates; not local pilot observations or financial verdicts.","joinRule":"Exact workflowIds only for default comparisons. contextWorkflowIds are adjacent methodological references and must not become direct matches.","records":[{"id":"metr-early-2025-software","title":"Experienced developers working in their own repositories","workflowIds":["information-code"],"applicability":"Same broad activity; experienced open-source maintainers and early-2025 tools are a narrower setting than all software changes.","studyDate":"2025-07-10","observationPeriod":{"label":"Early 2025","start":null,"end":null},"design":"Randomized permission to use AI at the issue level; 16 developers on their own repositories.","task":"Complete real bug fixes, features and refactors to normal review, testing and documentation standards.","setting":"Human-only versus human with AI allowed, primarily Cursor Pro and Claude 3.5/3.7 Sonnet. This is not unattended deployment.","sample":{"unit":"software issue","total":246,"humans":16,"armCounts":{"human":110,"assisted":136}},"headline":"AI-allowed tasks took about 19% longer in this early-2025 setting.","defaultMetric":"adjusted-time-index","metrics":[{"id":"adjusted-time-index","label":"Implementation time","unit":"index; human reference = 100","lowerIsBetter":true,"basis":"Normalized adjusted time ratio, not raw mean hours and not a financial loss rate.","arms":[{"id":"human","label":"Human, AI disallowed","value":100,"n":110,"reference":true},{"id":"assisted","label":"Human, AI allowed","value":118.83999411634196,"n":136,"ci95":[101.25598526968045,139.47762360869635]}],"effect":{"value":0.18839994116341963,"unit":"relative change in time","ci95":[0.012559852696804485,0.39477623608696355],"ciMethod":"Authors’ homoskedastic OLS specification; normal 95% interval, independently reproduced.","model":"log(total implementation time) ~ AI allowed + log(predicted time without AI)"},"provenance":"Recomputed from the pinned data_complete.csv; 16 missing post-review values replaced with their treatment-group mean, following the authors’ published method."}],"controlsObserved":["Human implementation and review remain in the task; AI use is permitted, not mandated."],"costUse":"A local time-cost scenario can use the relative time effect only after matching task, skill, tools and wage assumptions; no measured net benefit, remediation loss or insurance price is supplied.","limitations":["Small, experienced sample; no representative all-developer effect.","Time is an effort outcome, not a production incident or claim denominator.","METR’s February 2026 follow-up reports newer data but warns that selection and timing problems make the newer effect unreliable. Do not describe 19% slowdown as current universal AI performance."],"freshness":{"date":"2026-02-24","url":"https://metr.org/blog/2026-02-24-uplift-update/","note":"Later estimates were -18% time for returning developers (95% CI -38% to +9%) and -4% for new developers (-15% to +9%); authors identify serious selection/timing limitations."},"access":{"rawData":"Downloaded: 246-row CSV","license":"No explicit data license found in the inspected repository; public availability is not a permissive-license claim."},"sources":[{"title":"METR study, July 10, 2025","url":"https://metr.org/blog/2025-07-10-early-2025-ai-experienced-os-dev-study/","locator":"Methodology and core result"},{"title":"METR original data and regression","url":"https://github.com/METR/Measuring-Early-2025-AI-on-Exp-OSS-Devs","locator":"data_complete.csv and regression.py"}],"conclusion":"Measured task time increased in this setting; the study supplies a real test of an assumed time saving.","boundary":"Early-2025 AI assistance for experienced maintainers. It does not establish the performance of today’s autonomous coding agents or net financial benefit."},{"id":"i4replication-ai-games-2024","title":"Checking published quantitative research","workflowIds":["research-analysis"],"contextWorkflowIds":["research-evidence-review"],"applicability":"Directly relevant to re-running and checking research analyses; only adjacent evidence for general literature review.","studyDate":"2026-05-28","observationPeriod":{"label":"February–November 2024","start":"2024-02","end":"2024-11"},"design":"Researchers assigned to teams; teams randomized to human-only, AI-assisted or AI-led protocols across seven replication events.","task":"Reproduce supplied studies, identify coding errors and propose/run robustness checks in R or Stata.","setting":"ChatGPT GPT-4/GPT-4o available in 2024. AI-led participants operated the interface with constrained human input; this is a specific protocol, not a current production agent.","sample":{"unit":"team attempting a research reproduction","total":103,"armCounts":{"human":33,"assisted":35,"ai-led":35},"reportedResearchers":288,"rawTeamSizeSum":270,"rawRows":138,"excludedRows":35},"headline":"Reproduction succeeded for 31/33 human teams, 32/35 assisted teams and 13/35 AI-led teams.","defaultMetric":"reproduction-success","metrics":[{"id":"reproduction-success","label":"Successful reproduction","unit":"percent of teams","lowerIsBetter":false,"basis":"Observed experimental outcome; repeated attempts at supplied studies, not unique incidents or deployment failures.","arms":[{"id":"human","label":"Human-only","value":93.93939393939394,"n":33,"numerator":31,"denominator":33},{"id":"assisted","label":"AI-assisted","value":91.42857142857143,"n":35,"numerator":32,"denominator":35},{"id":"ai-led","label":"AI-led, limited human handling","value":37.142857142857146,"n":35,"numerator":13,"denominator":35}],"effect":{"value":-0.018,"unit":"adjusted probability change, assisted versus human","ci95":[-0.144,0.107],"source":"Authors’ main.tex, reproduction column"},"provenance":"Independently recounted from Master sheet after authors’ exclusions; matches published rounded 94%, 91%, 37%."},{"id":"major-errors-found","label":"Major coding errors found","unit":"errors per team","lowerIsBetter":false,"basis":"Detection count, not errors introduced or a sensitivity rate.","arms":[{"id":"human","label":"Human-only","value":1.696969696969697,"n":33,"numerator":56,"denominator":33},{"id":"assisted","label":"AI-assisted","value":0.7428571428571429,"n":35,"numerator":26,"denominator":35},{"id":"ai-led","label":"AI-led, limited human handling","value":0.22857142857142856,"n":35,"numerator":8,"denominator":35}],"effect":{"value":-1.022,"unit":"adjusted errors found per team, assisted versus human","ci95":[-1.743,-0.3],"source":"Authors’ main.tex, major-errors column"},"provenance":"Independently counted from Errors sheet; duplicate flags removed and false-positive flags excluded as in cleaning.R."},{"id":"false-positives","label":"False error identifications","unit":"false positives per team","lowerIsBetter":true,"basis":"Observed experimental error-identification count, not money or insurance claims.","arms":[{"id":"human","label":"Human-only","value":0.7272727272727273,"n":33,"numerator":24,"denominator":33},{"id":"assisted","label":"AI-assisted","value":0.2571428571428571,"n":35,"numerator":9,"denominator":35},{"id":"ai-led","label":"AI-led, limited human handling","value":1.0571428571428572,"n":35,"numerator":37,"denominator":35}],"provenance":"Errors sheet, flag 6-false positive; authors’ duplicate-exclusion rules."}],"controlsObserved":["The experiment changes human involvement; it does not price a human-review control or isolate a production safeguard’s causal effect."],"costUse":"Separates completing a check from finding consequential mistakes. No wages, AI operating cost, loss amounts or insurance premium were measured here.","limitations":["2024 models and a restrictive AI-led protocol; not a contemporary universal agent benchmark.","Several teams inspect the same studies; do not treat 103 teams as 103 independent real-world incidents.","The article reports 288 researchers; the analyzed workbook team-size column sums to 270. Team denominators and reproduction counts reconcile; participant discrepancy is unresolved.","Success-only average completion times omit failures; no simple time-saving claim is included."],"access":{"rawData":"Downloaded main XLSX, analysis tables and cleaning rules","license":"Data and generated figures: CC BY 4.0. Code: MIT. Article itself: CC BY-NC-ND; do not infer article license from dataset license."},"sources":[{"title":"Brodeur et al., PNAS 2026","url":"https://doi.org/10.1073/pnas.2524747123","locator":"Procedures and results"},{"title":"University-deposited published article","url":"https://eprints.whiterose.ac.uk/id/eprint/241548/1/brodeur-et-al-2026-ai-assisted-teams-outperform-ai-led-teams-but-not-human-only-teams-in-assessing-research-1.pdf","locator":"Article pages 3–7"},{"title":"I4Replication original data and code","url":"https://github.com/I4Replication/AI-Games","locator":"data/AI games.xlsx; code/cleaning.R; output/tables/main.tex and branches.tex"}],"conclusion":"Human-only and assisted teams had similar observed reproduction rates; assisted teams found fewer major errors. The AI-led protocol completed far fewer reproductions.","boundary":"2024 research-checking protocol with GPT-4/GPT-4o. Reproduction and error detection are separate outcomes; neither is a monetary-loss rate."},{"id":"generative-ai-at-work-support","title":"Technical support for business software","workflowIds":["information-support"],"applicability":"Close task match for software customer support with a human deciding what to send; not evidence for autonomous refunds or unsupervised customer commitments.","studyDate":"2025-02-04","observationPeriod":{"label":"Rollout mainly fall 2020–winter 2021","start":null,"end":null},"design":"Staggered rollout, analyzed with difference-in-differences and worker, month and tenure controls; not a fully randomized 5,172-person trial.","task":"Human support staff answer technical questions from US small-business customers.","setting":"GPT-3-based assistant suggests responses and documentation to a human who retains final authority.","sample":{"unit":"worker-month for regressions; chat for underlying activity","humans":5172,"chats":3006395,"postAIHumans":1636,"postAIChats":1180446,"mainRegressionObservations":12295},"headline":"AI assistance increased resolved issues per hour by an estimated 15.2% in this deployment.","defaultMetric":"resolved-issues-index","metrics":[{"id":"resolved-issues-index","label":"Resolved issues per hour","unit":"index; human reference = 100","lowerIsBetter":false,"basis":"Normalized index of the authors’ adjusted relative effect; not raw group means.","arms":[{"id":"human","label":"Human without AI assistance","value":100,"reference":true},{"id":"assisted","label":"Human with AI assistance","value":115.2}],"effect":{"value":0.301,"unit":"additional resolved issues per worker-hour","standardError":0.0329,"relativePercent":15.2,"n":12295,"observationUnit":"worker-month","source":"Table II, column 3; article page 907"},"provenance":"Published aggregate estimate; underlying microdata not available for independent recount."},{"id":"handling-time-effect","label":"Average chat handling time","unit":"minutes per chat","lowerIsBetter":true,"basis":"Adjusted change, not arm means; worker-month regression.","arms":[],"effect":{"value":-3.746,"unit":"minutes per chat","standardError":0.369,"n":21839,"source":"Table III, column 1; article page 909"}},{"id":"resolution-rate-effect","label":"Share of chats resolved","unit":"probability","lowerIsBetter":false,"basis":"Adjusted change, not arm means; statistical interval includes zero.","arms":[],"effect":{"value":0.0132,"unit":"probability change","standardError":0.00882,"n":12295,"source":"Table III, column 3; article page 909"}}],"controlsObserved":["Only human workers saw suggestions and chose whether to use them. The system withheld suggestions when training data were insufficient."],"costUse":"Productivity and handling time can inform a matched local labor-cost scenario, but individual pay, total AI cost, failure severity and premiums are not supplied.","limitations":["One firm and an older, task-tuned assistant; effects vary with worker experience.","Assisted human performance cannot be assigned to an autonomous agent.","Resolution-rate change is not statistically distinguishable from zero in the reported specification.","Underlying microdata are restricted by a data-use agreement; the public package contains replication code only."],"access":{"rawData":"Not public; published measurements extracted only","license":"Replication package CC0; article CC BY-NC 4.0. Neither grants access to restricted microdata."},"sources":[{"title":"Brynjolfsson, Li and Raymond, Generative AI at Work","url":"https://doi.org/10.1093/qje/qjae044","locator":"Tables I–III and section III.C"},{"title":"Author-hosted published paper","url":"https://danielle.li/assets/docs/GenerativeAIatWork.pdf","locator":"PDF pages 12–21; article pages 901–909"},{"title":"Public replication package and access restriction","url":"https://doi.org/10.7910/DVN/FSV1X7","locator":"README.md"}],"conclusion":"A human-controlled assistant improved resolved issues per hour in this software-support deployment.","boundary":"The human decided what to send. This does not demonstrate that autonomous customer support is worthwhile or safe, and costs and loss severity remain unmeasured."},{"id":"waymo-swiss-re-25m-claims","title":"Autonomous driving and third-party liability claims","workflowIds":[],"contextWorkflowIds":["finance-underwriting"],"applicability":"Reference for underwriting evidence design only. Passenger driving does not match shipment dispatch or other existing agent jobs.","studyDate":"2024-12-19","observationPeriod":{"label":"January 2018–July 2024; claims valued November 30, 2024","start":"2018-01-01","end":"2024-07-31","valuationDate":"2024-11-30"},"design":"Observational autonomous-fleet claims compared with geographically calibrated human-driving insurance benchmarks.","task":"Fully autonomous passenger driving in Phoenix, San Francisco, Los Angeles and Austin.","setting":"Waymo driverless operations versus human personal-auto insurance experience; human exposure partly estimated from policy years.","sample":{"unit":"third-party liability claim; exposure in miles","autonomousMiles":25300000,"distinctAutonomousCollisions":10,"propertyDamageClaims":9,"bodilyInjuryClaims":2},"headline":"Real claims comparison with an exposure denominator; no published loss severity or price.","defaultMetric":"property-claims","metrics":[{"id":"property-claims","label":"Third-party property damage claims","unit":"claims per million miles","lowerIsBetter":true,"basis":"Published observed autonomous claim frequency versus calibrated human benchmark; not a randomized comparison.","arms":[{"id":"human","label":"Human-driving benchmark","value":3.08,"ci95":[3.063,3.088]},{"id":"autonomous","label":"Waymo autonomous driving","value":0.36,"numerator":9,"denominator":25300000,"ci95":[0.163,0.675]}]},{"id":"injury-claims","label":"Third-party bodily injury claims","unit":"claims per million miles","lowerIsBetter":true,"basis":"Published claims, including open claims; not paid-loss amounts.","arms":[{"id":"human","label":"Human-driving benchmark","value":1.04,"ci95":[1.035,1.047]},{"id":"autonomous","label":"Waymo autonomous driving","value":0.08,"numerator":2,"denominator":25300000,"ci95":[0.01,0.285]}]}],"controlsObserved":[],"costUse":"Shows the structure needed for underwriting: a comparable operation, exposure, claim definition and valuation date. Frequency alone does not determine expected loss or premium.","limitations":["Two property-damage claims and both injury claims remained open; do not label all counts paid losses.","Nine property and two injury claims arose from ten collisions; adding claim types does not count unique incidents.","Human 78 property/26 injury expected claims at equal exposure are model-based expected counts, not observed matched-fleet counts.","No per-claim public microdata, dollar severity, control price or insurance price; no transfer to LLM agent workflows."],"access":{"rawData":"Published aggregate measurements only; underlying claim records not acquired","license":"No open microdata license established."},"sources":[{"title":"Waymo–Swiss Re original insurance comparison","url":"https://storage.googleapis.com/waymo-uploads/files/documents/safety/Comparison%20of%20Waymo%20and%20Human-Driven%20Vehicles%20at%2025M%20miles.pdf","locator":"Pages 6–10, especially Figure 3 and claims definitions"},{"title":"Waymo research publication","url":"https://www.waymo.com/research/do-autonomous-vehicles-outperform-latest-generation-human-driven-vehicles-25-million-miles/","locator":null}],"conclusion":"This operation has measured liability-claim frequencies and a human benchmark with an explicit mileage denominator.","boundary":"Autonomous passenger driving only. Claims include unresolved cases; frequency is not severity, premium or evidence for a different agent job."}],"provenanceManifest":"sources/raw/comparisons/manifest.json"};
const INVESTIGATIONS = {"schemaVersion":1,"createdAt":"2026-10-05","source":{"name":"Agency Costs investigations of publicly documented incidents","inspectedAt":"2026-10-05","status":"Primary-source narratives and explicit analyst task/control mappings.","provenanceNote":"Each investigation links its public primary sources and catalogue record. Private research classifications are excluded from this release."},"status":"Three public-source investigations. No loss-rate estimate.","cases":[{"id":"aiid-1152","aiidId":1152,"title":"Replit agent deletes application data","date":"18/07/2025","workflowIds":["information-code"],"sectorIds":["information"],"workflowMappingBasis":"Same software-change task; deployment boundary is the important similarity, not a shared sector alone.","mappingStatus":"AC analyst mapping, not a published MIT task-to-incident mapping","task":"Change application code and its connected database.","riskIds":["7.3"],"causal":{"mechanism":"The vendor describes development changes reaching production and an agent that did not know about the available rollback."},"harm":{"summary":"Replit says the deleted data was fully restored. Interruption and recovery costs are not quantified.","monetaryEvidenceRef":"replit-database-2025"},"safeguardGaps":[{"name":"Separate development from production","basis":"Vendor says the incident preceded its default development/production separation; development could affect production.","status":"Primary source states the boundary failure and subsequent change","controlIds":["A2299_Gipiskis2024"],"sourceUrls":["https://replit.com/blog/doubling-down-on-our-commitment-to-secure-vibe-coding"],"effectivenessStatus":"Not measured in this case; no assumed percentage reduction"},{"name":"Restore data to a known-good state","basis":"Replit reports that rollback restored the database, but the agent did not know the feature existed. The mapped NCSC guidance covers protecting and restoring AI-related assets, including data. Applying this security-recovery guidance to accidental database changes is an analyst adaptation.","status":"Source-described recovery problem; asset-restoration safeguard adapted from security guidance","controlIds":["A0574_UK_NCSC2023"],"sourceUrls":["https://replit.com/blog/doubling-down-on-our-commitment-to-secure-vibe-coding"],"effectivenessStatus":"Not measured in this case; no assumed percentage reduction"}],"humanAlternative":{"task":"An engineer prepares the change in development; a separate reviewer approves production access.","status":"Analyst-proposed comparison arm; no measured human outcome data in this incident"},"primarySources":[{"title":"Replit: secure vibe coding","url":"https://replit.com/blog/doubling-down-on-our-commitment-to-secure-vibe-coding","kind":"Primary vendor account","checkedAt":"2026-10-05","status":"Read directly"}],"catalogueUrl":"https://incidentdatabase.ai/cite/1152/","reviewStatus":"Primary-source mechanism checked; task and safeguard links are Agency Costs analysis","evidenceCaseId":"replit-database-2025","unknowns":["No matched human or agent operational denominator","No verified net loss","Vendor-reported recovery is not independent verification","Model/version and the exact execution log are not supplied"]},{"id":"aiid-1039","aiidId":1039,"title":"Cursor support bot invents a login policy","date":"19/04/2025","workflowIds":["information-support","hospitality-customer-refunds"],"sectorIds":["information"],"workflowMappingBasis":"Direct software-support example; refund-workflow link is an analogy because the company later reported a refund, not because the bot autonomously issued one.","mappingStatus":"AC analyst mapping, not a published MIT task-to-incident mapping","task":"Answer customer email about login and device access.","riskIds":["3.1"],"causal":{"mechanism":"A support bot incorrectly described a login disruption as company policy. The cofounder separately attributed the underlying logouts to a session race condition."},"harm":{"summary":"A user reported cancellation; the cofounder reported a refund and a bug fix. Neither lost revenue nor the refund amount is verified.","monetaryEvidenceRef":null},"safeguardGaps":[{"name":"Identify AI support replies","basis":"The cofounder reports making AI-generated support responses clearly labelled after the incident.","status":"Primary-source-described intervention; no causal effectiveness estimate","controlIds":["A0066_Eisenberg2025"],"sourceUrls":["https://news.ycombinator.com/item?id=43700931"],"effectivenessStatus":"Not measured in this case; no assumed percentage reduction"},{"name":"Verify policy statements and route uncertain answers to staff","basis":"The incorrect-policy response is confirmed; verification and escalation are analyst-proposed safeguards.","status":"Analyst-proposed safeguard addressing an evidenced failure","controlIds":["A2412_US_NIST2024","A1534_Tong2025"],"sourceUrls":["https://www.reddit.com/r/cursor/comments/1jyy5am/comment/mn2vlbr/"],"effectivenessStatus":"Not measured in this case; no assumed percentage reduction"}],"humanAlternative":{"task":"A support employee checks the policy and incident status, then communicates the diagnosis or escalates.","status":"Analyst-proposed comparison arm; no measured human outcome data in this incident"},"primarySources":[{"title":"Cursor cofounder: no such policy","url":"https://www.reddit.com/r/cursor/comments/1jyy5am/comment/mn2vlbr/","kind":"Primary company statement","checkedAt":"2026-10-05","status":"Read directly; original post removed, linked company comment remains"},{"title":"Cursor cofounder: refund, labelling and session bug fix","url":"https://news.ycombinator.com/item?id=43700931","kind":"Primary company statement","checkedAt":"2026-10-05","status":"Read directly"}],"catalogueUrl":"https://incidentdatabase.ai/cite/1039/","reviewStatus":"Primary-source mechanism checked; task and safeguard links are Agency Costs analysis","evidenceCaseId":null,"unknowns":["Underlying model unknown","User receipt of the reported refund not independently verified","No causal cancellation total or money amount","No matched human comparison"]},{"id":"aiid-639","aiidId":639,"title":"Air Canada chatbot gives incorrect refund advice","date":"11/11/2022","workflowIds":["trade-returns","hospitality-customer-refunds","information-support"],"sectorIds":["trade"],"workflowMappingBasis":"Analogy to refund-policy advice; the actual case concerns airline bereavement fares, not retail returns or software support.","mappingStatus":"AC analyst mapping, not a published MIT task-to-incident mapping","task":"Explain fare eligibility and the process for claiming a discount.","riskIds":["3.1"],"causal":{"mechanism":"The chatbot gave advice inconsistent with the airline policy; the customer relied on it when purchasing."},"harm":{"summary":"The tribunal ordered compensation. The financial amount below comes from the separately checked decision.","monetaryEvidenceRef":"air-canada-moffatt-2022"},"safeguardGaps":[{"name":"Check policy answers against the applicable policy version","basis":"The observed failure is incorrect policy advice. Grounding and review are proposed controls; the decision does not establish their measured effectiveness.","status":"Analyst-proposed safeguard addressing an evidenced failure","controlIds":["A2412_US_NIST2024","A1534_Tong2025"],"sourceUrls":["https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do"],"effectivenessStatus":"Not measured in this case; no assumed percentage reduction"}],"humanAlternative":{"task":"A support employee checks the fare policy and explains eligibility before purchase.","status":"Analyst-proposed comparison arm; no measured human outcome data in this incident"},"primarySources":[{"title":"Moffatt v. Air Canada, 2024 BCCRT 149","url":"https://decisions.civilresolutionbc.ca/crt/crtd/en/item/525448/index.do","kind":"Primary tribunal decision","checkedAt":"2026-10-01","status":"Financial passages verified in existing evidence.json; direct re-fetch blocked on 2026-10-05"}],"catalogueUrl":"https://incidentdatabase.ai/cite/639/","reviewStatus":"Existing curated primary case; fresh fetch blocked","evidenceCaseId":"air-canada-moffatt-2022","unknowns":["Chatbot architecture is not established","No autonomous payment authority established","No matched human comparison or failure frequency","Award is not proof of payment or total business cost"]}]};
const MAPPED_CONTROLS = __agencyPayloads.MAPPED_CONTROLS;
const RISK_EVIDENCE = __agencyPayloads.RISK_EVIDENCE;
const HUMAN_TASKS = {"version":1,"databaseVersion":"31.0","sourceUrl":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","occupationSourceUrl":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/occupation_data.csv","licenseUrl":"https://creativecommons.org/licenses/by/4.0/","licenseDetailsUrl":"https://www.onetcenter.org/license_db.html","attribution":"Includes information from the O*NET® 31.0 Database by the U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), used under CC BY 4.0. O*NET® is a trademark of USDOL/ETA. Agency Costs selected task statements and added workflow crosswalks and scope notes; the task text is unchanged. USDOL/ETA has not approved, endorsed, or tested these additions.","note":"O*NET-SOC describes occupations; MIT's adapted NAICS taxonomy describes industry sectors. This is an Agency Costs task-level crosswalk, not an official O*NET-to-MIT mapping. Source statements describe human work, not observed human success rates, time, cost, AI capability or delegation permission. Closest task analogues have explicit limits; uncertain workflows remain unmapped.","workflows":[{"workflowId":"agriculture-maintenance","occupationCode":"43-5061.00","occupationTitle":"Production, Planning, and Expediting Clerks","tasks":[{"id":"11377","text":"Compile and prepare documentation related to production sequences, transportation, personnel schedules, or purchase, maintenance, or repair orders.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"},{"id":"11370","text":"Distribute production schedules or work orders to departments.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Work-order documentation and distribution only; this is not a match for diagnosing machinery or performing maintenance."},{"workflowId":"agriculture-procurement","occupationCode":"13-1023.00","occupationTitle":"Purchasing Agents, Except Wholesale, Retail, and Farm Products","tasks":[{"id":"1143","text":"Prepare purchase orders, solicit bid proposals, and review requisitions for goods and services.","updated":"08/2025","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"},{"id":"1157","text":"Write and review product specifications, maintaining a working technical knowledge of the goods or services to be purchased.","updated":"08/2025","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Purchase-order preparation and specification review; delegated purchasing authority remains outside this task crosswalk."},{"workflowId":"trade-dispatch","occupationCode":"43-5032.00","occupationTitle":"Dispatchers, Except Police, Fire, and Ambulance","tasks":[{"id":"2723","text":"Schedule or dispatch workers, work crews, equipment, or service vehicles to appropriate locations, according to customer requests, specifications, or needs, using radios or telephones.","updated":"08/2021","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"2727","text":"Prepare daily work and run schedules.","updated":"08/2021","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Scheduling and dispatch coordination; no claim that every transport operation uses this occupation."},{"workflowId":"trade-returns","occupationCode":"43-4051.00","occupationTitle":"Customer Service Representatives","tasks":[{"id":"2579","text":"Resolve customers' service or billing complaints by performing activities such as exchanging merchandise, refunding money, or adjusting bills.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"},{"id":"2589","text":"Compare disputed merchandise with original requisitions and information from invoices and prepare invoices for returned goods.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Returns and billing-complaint tasks, without inferring a specific retailer's refund authority."},{"workflowId":"information-code","occupationCode":"15-1252.00","occupationTitle":"Software Developers","tasks":[{"id":"21670","text":"Modify existing software to correct errors, adapt it to new hardware, or upgrade interfaces and improve performance.","updated":"08/2025","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"21669","text":"Develop or direct software system testing or validation procedures, programming, or documentation.","updated":"08/2025","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Software modification and testing; organizational release permission and review effectiveness are separate evidence questions."},{"workflowId":"information-support","occupationCode":"15-1232.00","occupationTitle":"Computer User Support Specialists","tasks":[{"id":"1282","text":"Answer user inquiries regarding computer software or hardware operation to resolve problems.","updated":"08/2023","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"1288","text":"Read technical manuals, confer with users, or conduct computer diagnostics to investigate and resolve problems or to provide technical assistance and support.","updated":"08/2023","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Software-support inquiries and technical investigation; the occupation does not establish permission for account-changing actions."},{"workflowId":"finance-payments","occupationCode":"43-3031.00","occupationTitle":"Bookkeeping, Accounting, and Auditing Clerks","tasks":[{"id":"2501","text":"Calculate and prepare checks for utilities, taxes, and other payments.","updated":"07/2017","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"},{"id":"2486","text":"Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes.","updated":"07/2017","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Payment preparation and accuracy checking; electronic payment execution and spending authority are not implied."},{"workflowId":"finance-claims","occupationCode":"13-1031.00","occupationTitle":"Claims Adjusters, Examiners, and Investigators","tasks":[{"id":"21417","text":"Examine claims forms and other records to determine insurance coverage.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"21428","text":"Verify and analyze data used in settling claims to ensure that claims are valid and that settlements are made according to company practices and procedures.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Coverage and claim-data review; a particular policy, jurisdiction and decision authority remain necessary."},{"workflowId":"finance-underwriting","occupationCode":"13-2053.00","occupationTitle":"Insurance Underwriters","tasks":[{"id":"21045","text":"Examine documents to determine degree of risk from factors such as applicant health, financial standing and value, and condition of property.","updated":"08/2018","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"},{"id":"1262","text":"Write to field representatives, medical personnel, or others to obtain further information, quote rates, or explain company underwriting policies.","updated":"08/2018","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Application-document examination and requests for further underwriting information, not autonomous acceptance or pricing."},{"workflowId":"real-estate-applications","occupationCode":null,"occupationTitle":null,"tasks":[],"mappingBasis":"Unmapped","mappingNote":"No sufficiently direct rental-application task was verified in the reviewed occupation rows; property management alone is not an adequate task match."},{"workflowId":"professional-contracts","occupationCode":"23-2011.00","occupationTitle":"Paralegals and Legal Assistants","tasks":[{"id":"23994","text":"Prepare, edit, or review legal documents, including legislation, briefs, pleadings, appeals, wills, contracts, and real estate closing statements.","updated":"08/2024","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"1636","text":"Gather and analyze research data, such as statutes, decisions, and legal articles, codes, and documents.","updated":"08/2024","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Legal-document preparation/review and research support; this does not establish authorization to provide legal advice."},{"workflowId":"professional-client-files","occupationCode":null,"occupationTitle":null,"tasks":[],"mappingBasis":"Unmapped","mappingNote":"The engagement and profession are unspecified; selecting a legal, accounting or other occupation would add an unsupported assumption."},{"workflowId":"research-evidence-review","occupationCode":"19-4061.00","occupationTitle":"Social Science Research Assistants","tasks":[{"id":"12960","text":"Conduct internet-based and library research.","updated":"08/2019","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"12953","text":"Provide assistance with the preparation of project-related reports, manuscripts, and presentations.","updated":"08/2019","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"A social-science research-assistant analogue for literature retrieval and report support; it does not represent all scientific disciplines."},{"workflowId":"research-analysis","occupationCode":"15-2041.00","occupationTitle":"Statisticians","tasks":[{"id":"8957","text":"Prepare data for processing by organizing information, checking for inaccuracies, and adjusting and weighting the raw data.","updated":"08/2024","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"},{"id":"8956","text":"Analyze and interpret statistical data to identify significant differences in relationships among sources of information.","updated":"08/2024","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"A statistical-analysis analogue; qualitative, laboratory and other research methods are outside this match."},{"workflowId":"management-recruiting","occupationCode":"13-1071.00","occupationTitle":"Human Resources Specialists","tasks":[{"id":"18868","text":"Review employment applications and job orders to match applicants with job requirements.","updated":"08/2019","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"18871","text":"Select qualified job applicants or refer them to managers, making hiring recommendations when appropriate.","updated":"08/2019","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Application matching and shortlist/referral preparation; suitability and lawful selection criteria need separate evaluation."},{"workflowId":"management-accounts-payable","occupationCode":"43-3031.00","occupationTitle":"Bookkeeping, Accounting, and Auditing Clerks","tasks":[{"id":"2509","text":"Match order forms with invoices, and record the necessary information.","updated":"07/2017","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"2486","text":"Check figures, postings, and documents for correct entry, mathematical accuracy, and proper codes.","updated":"07/2017","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Invoice/order matching and accuracy checking; approval and payment execution remain separate."},{"workflowId":"education-assessment","occupationCode":"25-9044.00","occupationTitle":"Teaching Assistants, Postsecondary","tasks":[{"id":"10956","text":"Evaluate and grade examinations, assignments, or papers, and record grades.","updated":"07/2016","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"10962","text":"Meet with supervisors to discuss students' grades or to complete required grade-related paperwork.","updated":"07/2016","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"A postsecondary teaching-assistant example for grading and supervisor review; other education settings need their own occupation/task match."},{"workflowId":"healthcare-records","occupationCode":"29-2072.00","occupationTitle":"Medical Records Specialists","tasks":[{"id":"22878","text":"Compile and maintain patients' medical records to document condition and treatment and to provide data for research or cost control and care improvement efforts.","updated":"08/2026","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"},{"id":"22881","text":"Identify, compile, abstract, and code patient data, using standard classification systems.","updated":"08/2026","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Record compilation and abstraction only; this does not establish clinical interpretation, diagnosis or care decisions."},{"workflowId":"healthcare-referrals","occupationCode":"43-6013.00","occupationTitle":"Medical Secretaries and Administrative Assistants","tasks":[{"id":"775","text":"Schedule and confirm patient diagnostic appointments, surgeries, or medical consultations.","updated":"08/2021","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"20438","text":"Schedule tests or procedures for patients, such as lab work or x-rays, based on physician orders.","updated":"08/2021","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Administrative appointment/procedure coordination under physician orders; clinical referral judgment is not covered."},{"workflowId":"arts-rights","occupationCode":"27-3041.00","occupationTitle":"Editors","tasks":[{"id":"1794","text":"Arrange for copyright permissions.","updated":"08/2026","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"},{"id":"1779","text":"Plan the contents of publications according to the publication's style, editorial policy, and publishing requirements.","updated":"08/2026","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Publication planning and copyright-permission work; source task coverage does not establish rights clearance for a particular work."},{"workflowId":"hospitality-bookings","occupationCode":"43-4081.00","occupationTitle":"Hotel, Motel, and Resort Desk Clerks","tasks":[{"id":"2620","text":"Make and confirm reservations.","updated":"08/2026","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"A hotel reservation example; other booking products may need a different occupation/task match."},{"workflowId":"hospitality-customer-refunds","occupationCode":"43-4051.00","occupationTitle":"Customer Service Representatives","tasks":[{"id":"2579","text":"Resolve customers' service or billing complaints by performing activities such as exchanging merchandise, refunding money, or adjusting bills.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"},{"id":"2582","text":"Refer unresolved customer grievances to designated departments for further investigation.","updated":"08/2022","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Customer complaint refunds and escalation; applicable terms and spending authority are separate."},{"workflowId":"public-admin-benefits","occupationCode":"43-4061.00","occupationTitle":"Eligibility Interviewers, Government Programs","tasks":[{"id":"9736","text":"Compile, record, and evaluate personal and financial data to verify completeness and accuracy, and to determine eligibility status.","updated":"08/2023","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Core"},{"id":"9746","text":"Provide applicants with assistance in completing application forms, such as those for job referrals or unemployment compensation claims.","updated":"08/2023","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Incumbent","taskType":"Supplemental"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Application completeness/data review and assistance; the source occupation includes eligibility decisions beyond AC's preparation task."},{"workflowId":"national-security-analysis","occupationCode":"33-3021.06","occupationTitle":"Intelligence Analysts","tasks":[{"id":"17552","text":"Prepare comprehensive written reports, presentations, maps, or charts, based on research, collection, and analysis of intelligence data.","updated":"08/2024","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"},{"id":"17555","text":"Validate known intelligence with data from other sources.","updated":"08/2024","source":"https://www.onetcenter.org/dl_files/database/db_31_0_csv/task_statements.csv","domainSource":"Occupational Expert","taskType":"Core"}],"mappingBasis":"Agency Costs task crosswalk","mappingNote":"Intelligence report preparation and corroboration; information-access permissions and operational decisions are not inferred."}]};
const WAGES = {"schemaVersion":1,"asOf":"2026-10-05","title":"BLS occupational wage benchmarks","source":{"publisher":"U.S. Bureau of Labor Statistics","program":"Occupational Employment and Wage Statistics","releaseUrl":"https://www.bls.gov/news.release/archives/ocwage_05152026.htm","tablesUrl":"https://www.bls.gov/oes/tables.htm","downloadUrl":"https://www.bls.gov/oes/special-requests/oesm25nat.zip","referenceDate":"2025-05","releaseDate":"2026-05-15","retrievedDate":"2026-10-05","latestAvailableVerified":true,"rawDirectory":"sources/raw/quantification/bls-oews-may-2025"},"defaultMeasure":"hourlyMedian","unit":"USD per hour","costBasis":"Straight-time gross wages. Employer benefits and overhead are not included.","method":"Study effects are applied to a normalized workload that would require 100 baseline human hours, then valued at a sourced occupation wage. This is an AC calculation, not a financial result reported by BLS or the study.","normalization":{"baselineHours":100,"basis":"Display scale; not a claim that the study observed exactly 100 hours."},"boundaries":["Current US occupational median pay is not the pay of the original study participants, whose countries and dates differ.","Occupation and task applicability are analyst crosswalks, not BLS findings about AI performance.","Wage-equivalent capacity becomes an economic benefit only if freed time is used productively or costs are actually avoided.","No operating-cost, implementation-cost, additional-review-cost or expected-loss values have been assumed.","Research success rates cannot be monetized from wage rates alone because time and loss costs are incomplete."],"records":[{"id":"bls-2025-software-developers","occupationCode":"15-1252","occupationTitle":"Software Developers","workflowIds":["information-code"],"studyIds":["metr-early-2025-software"],"currency":"USD","geography":"United States, all industries","referencePeriod":"May 2025","wageReferenceDate":"2025-05","releaseDate":"2026-05-15","hourlyMedian":65.38,"hourlyMean":71.2,"annualMean":148100,"employment":1687890,"sourceUrl":"https://www.bls.gov/news.release/archives/ocwage_05152026.htm","sourceLocator":"Table 1, Software Developers row; Median hourly wages column","rawRow":"Software developers..............................................................   1,687,890    71.20    148,100\t   65.38","occupationMapping":"O*NET-SOC task crosswalk already used by AC; the wage is a US occupation benchmark, not measured pay in the study.","use":"Conditional wage-equivalent scenario for the matched study; not an estimate of realized employer savings."},{"id":"bls-2025-computer-user-support","occupationCode":"15-1232","occupationTitle":"Computer User Support Specialists","workflowIds":["information-support"],"studyIds":["generative-ai-at-work-support"],"currency":"USD","geography":"United States, all industries","referencePeriod":"May 2025","wageReferenceDate":"2025-05","releaseDate":"2026-05-15","hourlyMedian":29.74,"hourlyMean":32.37,"annualMean":67330,"employment":717190,"sourceUrl":"https://www.bls.gov/news.release/archives/ocwage_05152026.htm","sourceLocator":"Table 1, Computer User Support Specialists row; Median hourly wages column","rawRow":"Computer user support specialists................................................     717,190    32.37     67,330\t   29.74","occupationMapping":"O*NET-SOC task crosswalk already used by AC; the wage is a US occupation benchmark, not measured pay in the study.","use":"Conditional wage-equivalent scenario for the matched study; not an estimate of realized employer savings."},{"id":"bls-2025-customer-service","occupationCode":"43-4051","occupationTitle":"Customer Service Representatives","workflowIds":["hospitality-customer-refunds"],"studyIds":[],"currency":"USD","geography":"United States, all industries","referencePeriod":"May 2025","wageReferenceDate":"2025-05","releaseDate":"2026-05-15","hourlyMedian":21.53,"hourlyMean":22.4,"annualMean":46590,"employment":2595750,"sourceUrl":"https://www.bls.gov/news.release/archives/ocwage_05152026.htm","sourceLocator":"Table 1, Customer Service Representatives row; Median hourly wages column","rawRow":"Customer service representatives..................................................   2,595,750    22.40     46,590     21.53","occupationMapping":"O*NET-SOC task crosswalk already used by AC; the wage is a US occupation benchmark, not measured pay in the study.","use":"Occupational wage context only; no time-cost conversion is supported by the currently connected comparison."},{"id":"bls-2025-statisticians","occupationCode":"15-2041","occupationTitle":"Statisticians","workflowIds":["research-analysis"],"studyIds":[],"currency":"USD","geography":"United States, all industries","referencePeriod":"May 2025","wageReferenceDate":"2025-05","releaseDate":"2026-05-15","hourlyMedian":50.79,"hourlyMean":55.63,"annualMean":115700,"employment":29030,"sourceUrl":"https://www.bls.gov/news.release/archives/ocwage_05152026.htm","sourceLocator":"Table 1, Statisticians row; Median hourly wages column","rawRow":"Statisticians.....................................................................      29,030    55.63    115,700\t   50.79","occupationMapping":"O*NET-SOC task crosswalk already used by AC; the wage is a US occupation benchmark, not measured pay in the study.","use":"Occupational wage context only; no time-cost conversion is supported by the currently connected comparison."}]};
const { quantifyWorkload, reproductionComparison } = (() => {
// Derived workload equivalents, not observed payroll savings or complete costs.
const WORKLOAD_METRICS = {
  'metr-early-2025-software': { id: 'adjusted-time-index', mode: 'time-ratio' },
  'generative-ai-at-work-support': { id: 'resolved-issues-index', mode: 'throughput-ratio' },
};

const finite = value => typeof value === 'number' && Number.isFinite(value);
const product = (left, right) => {
  const value = left * right;
  return Number.isFinite(value) ? value : null;
};

/**
 * Express a supported study's relative effect for one fixed human workload.
 * An occupation's median wage is an illustrative valuation, not study payroll.
 * Missing wages remain missing; an explicit zero wage remains zero.
 */
function quantifyWorkload(study, benchmark, baselineHours = 100) {
  const supported = WORKLOAD_METRICS[study?.id];
  if (!supported || !finite(baselineHours) || baselineHours < 0) return null;
  const metric = study.metrics?.find(item => item.id === supported.id);
  const human = metric?.arms?.find(arm => arm.id === 'human');
  const assisted = metric?.arms?.find(arm => arm.id === 'assisted');
  if (!finite(human?.value) || human.value <= 0 || !finite(assisted?.value)
    || assisted.value < 0 || (supported.mode === 'throughput-ratio' && assisted.value === 0)) return null;

  const toHours = value => baselineHours * (supported.mode === 'time-ratio'
    ? value / human.value : human.value / value);
  const aiHours = toHours(assisted.value);
  if (!finite(aiHours)) return null;
  const hoursChange = aiHours - baselineHours;
  const capacityHours = baselineHours - aiHours;
  const benchmarkMatches = !Array.isArray(benchmark?.studyIds) || benchmark.studyIds.includes(study.id);
  const hourlyWage = benchmarkMatches && finite(benchmark?.hourlyMedian) && benchmark.hourlyMedian >= 0
    ? benchmark.hourlyMedian : null;
  const currency = typeof benchmark?.currency === 'string' && /^[A-Za-z]{3}$/.test(benchmark.currency)
    ? benchmark.currency.toUpperCase() : null;
  const valueHours = hours => hourlyWage !== null && currency ? product(hours, hourlyWage) : null;
  const wageValueChange = valueHours(hoursChange);
  const grossCapacityValue = valueHours(capacityHours);
  const additionalCostCeiling = grossCapacityValue > 0 ? grossCapacityValue : null;

  let bounds = null;
  const interval = assisted.ci95;
  if (Array.isArray(interval) && interval.length === 2 && interval.every(finite)
    && interval[0] <= assisted.value && assisted.value <= interval[1]
    && interval[0] >= 0 && (supported.mode !== 'throughput-ratio' || interval[0] > 0)) {
    const aiBounds = interval.map(toHours).sort((left, right) => left - right);
    if (aiBounds.every(finite)) {
      const changeBounds = aiBounds.map(value => value - baselineHours);
      const capacityBounds = [baselineHours - aiBounds[1], baselineHours - aiBounds[0]];
      bounds = {
        aiHours: aiBounds,
        hoursChange: changeBounds,
        capacityHours: capacityBounds,
        wageValueChange: hourlyWage !== null && currency ? changeBounds.map(valueHours) : null,
        grossCapacityValue: hourlyWage !== null && currency ? capacityBounds.map(valueHours) : null,
        basis: 'Study 95% interval transformed at a fixed baseline workload and wage; wage, applicability and total-cost uncertainty are not included.',
      };
    }
  }

  return {
    studyId: study.id,
    metricId: supported.id,
    baselineHours,
    aiHours,
    hoursChange,
    capacityHours,
    hourlyWage,
    currency,
    wageValueChange,
    grossCapacityValue,
    additionalCostCeiling,
    bounds,
    mode: supported.mode,
    basis: supported.mode === 'time-ratio'
      ? 'Derived hours for the same workload using the study’s relative implementation-time effect. Human work with AI allowed, not autonomous replacement.'
      : 'Derived hours for the same resolved workload: divide human hours by the relative throughput effect. Human work with AI assistance, not autonomous replacement.',
    valuationBasis: 'Occupation median wage values labour capacity only. It is not employer total cost, observed cash savings, net benefit, expected loss or an insurance premium. AI costs and incremental losses are unpriced.',
  };
}

function reproductionArm(arm) {
  if (!Number.isSafeInteger(arm?.numerator) || !Number.isSafeInteger(arm?.denominator)
    || arm.denominator <= 0 || arm.numerator < 0 || arm.numerator > arm.denominator) return null;
  const failures = arm.denominator - arm.numerator;
  return {
    armId: arm.id,
    label: arm.label,
    successes: arm.numerator,
    failures,
    denominator: arm.denominator,
    percent: arm.numerator / arm.denominator * 100,
    failurePercent: failures / arm.denominator * 100,
  };
}

/** Keep observed team attempts separate from money and operational loss rates. */
function reproductionComparison(study, armId = 'ai-led') {
  if (study?.id !== 'i4replication-ai-games-2024') return null;
  const metric = study.metrics?.find(item => item.id === 'reproduction-success');
  const human = reproductionArm(metric?.arms?.find(arm => arm.id === 'human'));
  const selected = reproductionArm(metric?.arms?.find(arm => arm.id === armId));
  if (!human || !selected) return null;
  return {
    studyId: study.id,
    metricId: metric.id,
    ...selected,
    human,
    percentPointDelta: selected.percent - human.percent,
    basis: 'Observed teams attempting research reproductions, including repeated attempts at the same studies. This is not an independent-incident denominator, monetary loss rate or priced control effect.',
  };
}

return { quantifyWorkload, reproductionComparison };
})();
const { quantificationView } = (() => {
// Values come from the matched study and explicit occupation crosswalk.
// This view does not infer a loss rate from the incident collection.
function quantificationView(context) {
  const { workflow, study, cases = [], WAGES, EVIDENCE, esc, source,
    quantifyWorkload, reproductionComparison } = context;
  const benchmark = WAGES.records.find(item => item.workflowIds.includes(workflow.id)
    && item.studyIds.includes(study?.id));
  const workload = quantifyWorkload(study, benchmark);
  const reproduction = reproductionComparison(study);
  const assistedReproduction = reproductionComparison(study, 'assisted');
  const number = value => value.toLocaleString('en-US', { maximumFractionDigits: 2 });
  const amount = (value, currency) => !Number.isFinite(value) || !currency ? 'Not priced' : `${esc(currency)} ${value.toLocaleString('en-US', {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  })}`;
  const cell = (label, value, note, className = '') => `<div class="quant-cell ${className}"><span>${label}</span><strong>${value}</strong><small>${note}</small></div>`;
  let content;

  if (workload) {
    const faster = workload.capacityHours > 0;
    const unchanged = workload.hoursChange === 0;
    const value = faster ? workload.grossCapacityValue : workload.wageValueChange;
    const valuation = value === null ? 'Not priced' : amount(value, workload.currency);
    const boundary = value === null ? 'No matched wage benchmark is available for this comparison.' : faster
      ? `If the study effect transfers and all freed time is used productively, ${valuation} is available to cover tools, setup, extra oversight and added losses.`
      : unchanged ? 'The comparison shows no change in the work required. Tools, setup and added losses remain unpriced.'
        : 'In this study, AI assistance increased the work required. Tools, setup and added losses would be additional costs.';
    const interval = workload.bounds?.wageValueChange;
    content = `<div class="quant-heading"><h3>For the same workload</h3><span>100 human hours as the reference</span></div>
      <div class="quant-readouts">${cell('Human work', `${number(workload.baselineHours)} h`, 'Reference workload')}${cell('With AI assistance', `${number(workload.aiHours)} h`, unchanged ? 'No change in workload' : `${number(Math.abs(workload.hoursChange))} h ${faster ? 'of capacity freed' : 'of additional work'}`)}${cell(faster ? 'Gross capacity value' : unchanged ? 'Wage-equivalent change' : 'Additional wage equivalent', valuation, 'Before other costs', faster ? 'quant-benefit' : 'quant-cost')}</div>
      <p class="quant-verdict">${boundary}</p>
      <p class="evidence-footnote">Derived scenario, not observed savings. ${source(benchmark?.sourceUrl, 'BLS May 2025 US median wage')}: ${amount(workload.hourlyWage, workload.currency)}/h. Benefits and overhead excluded.${interval ? ` Study 95% interval at that fixed wage: ${amount(interval[0], workload.currency)}–${amount(interval[1], workload.currency)} additional effort.` : ''}</p>`;
  } else if (reproduction && assistedReproduction) {
    const armCell = (label, arm) => cell(label, `${number(arm.percent)}%`, `${arm.successes}/${arm.denominator} teams succeeded; ${arm.failures} failed`);
    content = `<div class="quant-heading"><h3>Successful research reproductions</h3><span>Observed team attempts</span></div><div class="quant-readouts">${armCell('Human', reproduction.human)}${armCell('AI-assisted', assistedReproduction)}${armCell('AI-led', reproduction)}</div><p class="quant-verdict">AI-led success was ${number(Math.abs(reproduction.percentPointDelta))} percentage points lower than human success.</p><p class="evidence-footnote">2024 experimental protocol with GPT-4/4o. Team attempts are not independent deployment incidents. Matched total time and costs are unavailable, so these results cannot yet be priced.</p>`;
  } else {
    content = '<div class="quant-heading"><h3>The cost comparison is not yet measurable</h3></div><p class="quant-verdict">No matched workload and total-cost evidence is connected for this job.</p>';
  }

  const pricedCases = cases.map(incident => ({
    incident, record: EVIDENCE.cases.find(item => item.id === incident.evidenceCaseId),
  })).filter(({ record }) => Number.isFinite(record?.financial?.amount)
    && /^[A-Z]{3}$/.test(record.financial.currency || ''));
  const losses = pricedCases.length ? pricedCases.map(({ incident, record }) => {
    const financial = record.financial;
    const analogy = workflow.id === 'information-support' ? ' / refund-advice analogy' : '';
    return `<div class="quant-loss"><div><span class="eyebrow">Documented incident amount${analogy}</span><p><strong>${financial.relation === 'greater_than' ? '&gt; ' : ''}${amount(financial.amount, financial.currency)}</strong> ${esc(financial.status)}</p><small>${esc(incident.title)}. Payment and complete economic cost are not established.</small></div><button class="quiet" data-open-incident="${esc(incident.id)}">Inspect this incident</button></div>`;
  }).join('') : `<p class="quant-unknown"><strong>Incident cost:</strong> ${cases.length ? 'No verified monetary amount in the linked cases.' : 'No priced incident linked to this job.'}</p>`;
  return `<section class="quantification" aria-label="Quantification"><p class="eyebrow">Quantification</p>${content}${losses}<p class="quant-net"><strong>AI / human cost ratio: unavailable.</strong> Complete costs for equivalent work are not yet established.</p></section>`;
}

return { quantificationView };
})();
const { delegationFormula, delegationMethodPage } = (() => {
// Compare expected costs only after fixing the required output and service standard.
function delegationFormula() {
  return `<section class="delegation-formula" aria-labelledby="delegation-formula-title">
    <div class="formula-heading"><h2 id="delegation-formula-title">AI vs human</h2><a href="#/formula">How this is calculated</a></div>
    <div class="formula-expression" role="math" aria-label="Expected total AI cost divided by expected total human cost to deliver the same required work.">
      <span class="cost-fraction"><span><strong>AI</strong> total cost</span><span><strong>Human</strong> total cost</span></span>
    </div>
    <p>Expected costs for the same work, quality and deadline.<br>Below 1: AI costs less. Above 1: humans cost less.</p>
  </section>`;
}

function delegationMethodPage() {
  return `<div class="page-heading"><div><h1>Comparing AI and human costs</h1><p>Is this job worth delegating to an AI agent?</p></div></div>
    ${delegationFormula()}
    <div class="prose formula-method">
      <p>Compare the expected total cost of delivering the same required work with AI and with humans. Divide the AI cost by the human cost. A ratio of 0.8 means the AI workflow costs 20% less; 1 means equal cost; 1.2 means it costs 20% more.</p>
      <h2>Keep the work comparable</h2>
      <p>Both alternatives must deliver the required quantity to the same quality, completion and deadline standards. Match task difficulty, case mix and operating conditions. The AI workflow includes its human oversight and fallback; the human alternative includes its own tools, supervision and mistakes. Cheap output that fails the service requirement cannot win this comparison.</p>
      <h2>Count the whole cost</h2>
      <p>Include setup, execution, checking, tools, monitoring, retries, human rescue and incident costs on both sides. Use the same currency, workload, time horizon, valuation date and financial perspective. Count each expense or loss once, and allocate shared setup costs consistently over the stated workload.</p>
      <p>Estimate the ultimate cost of incidents arising from that work, including unpaid and not-yet-reported losses. State whether costs are before insurance or the operator’s costs after insurance. For the latter, include premiums and retained losses; do not add premiums to the same gross losses they cover.</p>
      <h2>Use the records behind the result</h2>
      <p>Join anonymized activity, labor, tool, outcome and incident records for matched AI and human workloads. Keep failed attempts and rescues in the cost totals. Compare the cost of delivering the same completed workload, including fallback where needed; selecting only successful attempts would understate costs.</p>
      <p>Use the ratio of expected cost totals, not the average of individual job ratios. Show the evidence period, sample size and uncertainty. Missing material costs, a nonpositive human cost or an unmet service target leave the ratio unavailable. The current study-based wage scenarios cover only part of total cost, so they cannot supply this ratio yet.</p>
      <p>Partner records remain in a protected analytical environment; publish only permitted, reviewed aggregates. A golden dataset validates extraction and event counting. Selected incident reports supply examples and severity evidence, but complete activity records are needed to estimate incident rates. MIT categories organize these records; Delphi ratings do not become probabilities or money.</p>
      <h2>Method and interpretation</h2>
      <p>This applies cost comparison to equivalent output. <a href="https://www.gov.uk/government/publications/the-green-book-appraisal-and-evaluation-in-central-government/the-green-book-2026#shortlist-appraisal" target="_blank" rel="noopener noreferrer">HM Treasury’s Green Book, chapter 6</a> supports comparing costs of alternative ways to deliver the same output, after checking that they meet the objectives. Its guidance concerns public appraisal; the AI-to-human ratio here is AC’s application of that principle.</p>
      <p><a href="https://www.actuarialstandardsboard.org/asops/estimating-future-costs-prospective-propertycasualty-risk-transfer-risk-retention/" target="_blank" rel="noopener noreferrer">ASOP 53</a> informs the loss estimates: exposure, future conditions, credibility and infrequent events matter. A lower expected cost supports the economic case for delegation, conditional on acceptable safety and downside risk. It does not establish an insurance price. Underwriters and reinsurers also need loss distributions, coverage terms and portfolio dependence; any capital or risk charge must have a disclosed basis.</p>
    </div>`;
}

return { delegationFormula, delegationMethodPage };
})();
const { chapterPages } = (() => {
// The published Agency Costs field guide superseded the five-tool prototype
// on 25 September 2026. Keep its chapters separate from reference and bonus.
const CHAPTERS = [
  ['resources', 'MIT resources'],
  ['home', 'Risk landscape'],
  ['frequency', 'Failure frequency'],
  ['records', 'Loss & severity'],
  ['causes', 'Causes & responsibility'],
  ['history', 'Historical evidence'],
  ['controls', 'Controls & value'],
  ['underwriting', 'Underwriting & transfer'],
];

function chapterPages(context) {
  const {
    DATA, WORKFLOWS, EVIDENCE, accounts, route, esc, link, option,
    pageHeading, recordTable, accountTable, routeUrl,
  } = context;
  const risk = DATA.risks.find(r => r.id === route.params.get('risk')) || DATA.risks[0];
  const workflow = WORKFLOWS.find(w => w.id === route.params.get('workflow')) || WORKFLOWS.find(w => w.sector === 'finance');
  const sector = DATA.sectors.find(s => s.id === workflow.sector);
  const workflowPicker = () => `<label class="chapter-selector">Workflow<select id="chapter-workflow">${WORKFLOWS.map(w => option(w.id, w.name, workflow.id)).join('')}</select></label>`;
  const workflowLink = `<a href="${routeUrl('workflow', { id: workflow.id })}">Open workflow and evidence →</a>`;
  const createAccount = `<button data-new-account data-workflow="${workflow.id}">Create loss account</button>`;
  const table = (heads, rows) => `<div class="table-scroll"><table><thead><tr>${heads.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(row => `<tr>${row.map(value => `<td>${value}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

  return {
    resources: () => `${pageHeading('MIT resources', 'The study, taxonomies and mitigation evidence used throughout Agency Costs.')}
      <div class="resource-list">
        <article><span class="chapter-number">01</span><div><h2>AI Risk Priorities</h2><p>272 experts, 24 risks and 14 study sectors. Inspect vulnerability, severity and actor responsibility, with the published sample sizes.</p><div class="actions"><a class="button" href="#/matrix">Compare all sector ratings</a>${link('https://airisk.mit.edu/priorities', 'Study and visualizations')}</div></div></article>
        <article><span class="chapter-number">02</span><div><h2>Shared taxonomy</h2><p>Sector names, definitions, actors and categories follow the shared Airtable base. The industry groupings adapt NAICS 2022; scientific research and development has its own study sector.</p><div class="actions"><a class="button" href="#/home">Explore the 14 sectors</a>${link('https://airtable.com/appu8mul8OVahwr3P', 'Taxonomy source')}</div></div></article>
        <article><span class="chapter-number">03</span><div><h2>AI Risk Mitigation Map</h2><p>831 entries from 13 frameworks, preserving their source text and shared taxonomy categories. Select controls against a workflow and appraise their cost using a loss account.</p><div class="actions"><a class="button" href="#/controls">Explore controls</a>${link('https://airisk.mit.edu/ai-risk-mitigations', 'MIT Mitigation Map')}</div></div></article>
      </div><p class="source-note">Research snapshot: 1 October 2026. Expert vulnerability ratings describe judgments about risk; observed failure rates and financial losses require separate evidence. <a href="#/sources">Sources and methods →</a></p>`,

    frequency: () => `${pageHeading('Failure frequency', 'Define the task and observation period before dividing failures by opportunities.')}
      ${workflowPicker()}<div class="chapter-focus"><p class="eyebrow">${esc(sector.name)}</p><h2>${esc(workflow.name)}</h2><dl class="workflow-facts"><div><dt>Proposed counting unit</dt><dd>${esc(workflow.countingUnit)}</dd></div><div><dt>Failure to investigate</dt><dd>${esc(workflow.failure)}</dd></div><div><dt>Matched population</dt><dd>Eligible operations of this task, using the same outcome rule, system version and observation period as the failed operations.</dd></div></dl><div class="actions">${createAccount}${workflowLink}</div></div>
      <section><h2>Rates in your loss accounts</h2>${accountTable(accounts)}<p class="source-note">Each rate is calculated within its own account. Different tasks, units and periods are not pooled.</p></section>
      <section><h2>What the public evidence counts</h2>${table(['Record', 'Counting unit', 'Exposure evidence'], EVIDENCE.cases.map(c => [`<a href="${routeUrl('case', { id: c.id })}">${esc(c.title)}</a>`, esc(c.countingUnit), esc(c.exposure.note)]))}<p class="source-note">The bundled public cases have no matched operational denominator. Their count cannot establish an industry failure rate.</p></section>`,

    causes: () => `${pageHeading('Causes & responsibility', 'Separate the explanation of a failure from the actors able to reduce its risk.')}
      <section><h2>MIT causal taxonomy</h2><div class="causal-dimensions">${DATA.taxonomy.causes.filter(c => !c.Parent).map(parent => `<div><h3>${esc(parent.Name)}</h3><p>${DATA.taxonomy.causes.filter(c => c.Parent === parent.Name).map(c => esc(c.Name)).join(' / ')}</p></div>`).join('')}</div><p class="source-note">Category names follow the shared taxonomy. A category is a description to investigate, not proof of causation or legal liability.</p></section>
      <section><h2>Who is vulnerable, and who can act?</h2><label class="chapter-selector">MIT risk<select id="chapter-risk">${DATA.risks.map(r => option(r.id, `${r.id} ${r.name}`, risk.id)).join('')}</select></label><p class="compact">${esc(risk.definition)}</p>${table(['Actor', 'Vulnerability / 5', 'Responsibility / 5'], DATA.actors.filter(a => a.studyKey).map(a => {
        const v = risk.vulnerability[a.studyKey]; const r = risk.responsibility[a.studyKey];
        return [esc(a['Actor Name']), v ? `${v.median}<small>n = ${v.count}</small>` : 'Not displayed', r ? `${r.median}<small>n = ${r.count}</small>` : 'Not displayed'];
      }))}<p class="source-note">These are study-wide expert judgments for the selected risk. Responsibility uses a scale from “Not at all” to “Primary”; it does not assign liability for a particular case.</p></section>
      <section><h2>Questions tied to actual evidence</h2>${EVIDENCE.cases.filter(c => !c.isComparator).map(c => `<article class="control-card"><h3><a href="${routeUrl('case', { id: c.id })}">${esc(c.title)} →</a></h3><p>${esc(c.summary)}</p><ul>${c.questions.map(q => `<li>${esc(q)}</li>`).join('')}</ul></article>`).join('')}</section>`,

    history: () => `${pageHeading('Historical evidence', 'Compare the mechanism, authority and consequences before transferring a lesson.')}
      <section><h2>Reported AI incidents</h2><p>Explore ${Number(context.incidentCount || 0).toLocaleString('en-US')} source-linked incident records, with the original MIT risk classifications where available.</p><a class="button" href="#/incidents">Search the incident collection →</a><p class="source-note">Reports about one event are not separate incidents. This collection includes many kinds of AI systems; each record needs review before applying it to an agent workflow.</p></section>
      <section><h2>Historical automation comparator</h2>${recordTable(EVIDENCE.cases.filter(c => c.isComparator))}<p class="source-note">Knight Capital demonstrates how a software failure can propagate through repeated actions. It is neither an AI-agent incident nor a human-only claims baseline.</p></section>
      <section><h2>Human-workflow crosswalk</h2>${workflowPicker()}<div class="chapter-focus"><h3>${esc(workflow.name)}</h3><div class="comparison-grid"><div><h3>Human task</h3><p>${esc(workflow.humanComparison.task)}</p></div><div><h3>What delegation changes</h3><p>${esc(workflow.humanComparison.difference)}</p></div><div><h3>Evidence needed</h3><p>${esc(workflow.humanComparison.evidenceNeeded)}</p></div></div>${workflowLink}</div><p class="source-note">These are Agency Costs task comparisons. No matched human-versus-agent loss ratio has been established in the bundled evidence.</p></section>`,

    underwriting: () => `${pageHeading('Underwriting & transfer', 'Assemble the evidence for a defined deployment and the losses a party wants to transfer.')}
      ${workflowPicker()}<div class="chapter-focus"><p class="eyebrow">${esc(sector.name)}</p><h2>${esc(workflow.name)}</h2><p>${esc(workflow.task)}</p><div class="actions">${createAccount}${workflowLink}<button data-download-request="${workflow.id}">Download evidence request</button></div></div>
      <section><h2>Evidence to request</h2>${table(['Record', 'What to establish'], [
        ['Task and authority', 'Allowed actions, effective permissions, approval thresholds, system versions and the party operating the agent.'],
        ['Event and outcome', `${esc(workflow.failure)} Preserve the execution trace, affected parties, response and recovery.`],
        ['Exposure', esc(workflow.countingUnit) + ' Record the eligible population and observation period.'],
        ['Loss and recovery', 'Currency, assessment date, direct damage, response, interruption, third-party amounts and recoveries. Preserve unknowns and link each amount to evidence.'],
        ['Controls', 'Which safeguards were present, what they did, the test evidence and the cost of maintaining them.'],
        ['Claim and transfer', 'Claim status, documented responsibility, policy or contract wording, payments and the burden remaining with each party.'],
        ['Shared dependencies', 'Model, tools, credentials, infrastructure and data sources shared with other deployments.'],
      ])}</section><section><h2>Keep the records distinct</h2><div class="causal-dimensions"><div><h3>Economic consequence</h3><p>What happened, to whom, and what it cost.</p></div><div><h3>Claim and coverage</h3><p>What remedy was requested and the documented position on coverage.</p></div><div><h3>Payment and retained loss</h3><p>What was actually paid and what remains with the chosen party.</p></div></div><p class="source-note">This is a record-review workflow adapted from the existing Agency Costs field guide. A MIT risk rating does not establish coverage or supply a premium. <a href="https://petervartanian.xyz/200/agency-costs/#underwriting" target="_blank" rel="noopener">Full underwriting chapter and references ↗</a></p></section>`,

    dividend: () => `${pageHeading('The Dividend', 'Is this job worth delegating to an AI agent?' , '<a class="button primary" href="#/assess">Assess a job →</a>')}
      <div class="chapter-focus"><h2>What should this agent be allowed to do?</h2><p>Agency Costs helps an operator and a risk reviewer answer that question for a specific workflow. Follow the evidence from sector risks to actual failures, losses, human comparisons, controls and retained exposure. Get an assessment you can inspect, export and revisit as evidence improves.</p></div>
      <div class="resource-list">
        <article><span class="chapter-number">01</span><div><h2>Review a proposed delegation</h2><p>Choose the task and state the benefit you want. Define what the agent may read, change, spend or approve, and where a person must intervene.</p><div class="actions"><a href="#/home">Choose a sector →</a><a href="#/assess">Assess a job →</a></div></div></article>
        <article><span class="chapter-number">02</span><div><h2>Learn from a failure</h2><p>Reconcile the financial consequences, recoveries and nonfinancial harm. Establish what counts as one operation, then check whether you have a matched exposure denominator.</p><div class="actions"><a href="#/records">Create a loss account →</a><a href="#/frequency">Inspect exposure →</a></div></div></article>
        <article><span class="chapter-number">03</span><div><h2>Choose conditions and the next test</h2><p>Compare safeguards against their costs and evidence. Record the remaining loss, the human alternative, your decision, and what you must measure before changing it.</p><div class="actions"><a href="#/controls">Appraise controls →</a><a href="#/underwriting">Assemble transfer evidence →</a></div></div></article>
      </div><section><h2>The result: a sourced delegation assessment</h2><p>Choose a job and Agency Costs assembles the relevant evidence into an assessment you can inspect and export. It shows what can be established today and which missing evidence could change the answer. Unknown costs and benefits remain unknown.</p><a class="button primary" href="#/assess">Assess a job →</a></section><p class="source-note">The current guide supplies research context, public cases and calculations using your inputs. The bundled evidence does not yet establish a portfolio loss rate, a measured control effect or a matched human-versus-agent loss ratio.</p>`,
  };
}

return { chapterPages };
})();
const { REVIEW_DECISIONS, blankReview, restoreReview, reviewGaps, exportReviewMarkdown } = (() => {
/** Local, reviewer-entered workflow decisions. No scoring or approval is inferred. */
const REVIEW_DECISIONS = Object.freeze([
  'Not decided',
  'Request evidence',
  'Pilot with conditions',
  'Proceed with conditions',
  'Do not delegate',
]);

const REVIEW_TEXT_FIELDS = [
  'id', 'title', 'workflow', 'authority', 'objective', 'evidence', 'rationale',
  'conditions', 'owner', 'nextReview', 'nextMeasurement',
];
const REVIEW_SHORT_FIELDS = new Set(['id', 'title', 'workflow', 'owner']);
const REVIEW_FIELDS = new Set([
  'version', ...REVIEW_TEXT_FIELDS, 'decision', 'caseIds', 'accountIds',
]);

function blankReview() {
  return {
    version: 1,
    ...Object.fromEntries(REVIEW_TEXT_FIELDS.map(key => [key, ''])),
    decision: 'Not decided',
    caseIds: [],
    accountIds: [],
  };
}

function reviewDateIsValid(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

/** Accept unfinished reviews, but reject incompatible or malformed stored data. */
function restoreReview(raw) {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.version !== 1) return null;
  if (Object.keys(raw).some(key => !REVIEW_FIELDS.has(key))) return null;
  const review = blankReview();
  for (const key of REVIEW_TEXT_FIELDS) {
    if (raw[key] === undefined) continue;
    const limit = key === 'nextReview' ? 10 : REVIEW_SHORT_FIELDS.has(key) ? 500 : 20000;
    if (typeof raw[key] !== 'string' || raw[key].length > limit) return null;
    review[key] = raw[key];
  }
  if (review.nextReview && !reviewDateIsValid(review.nextReview)) return null;
  if (raw.decision !== undefined) {
    if (!REVIEW_DECISIONS.includes(raw.decision)) return null;
    review.decision = raw.decision;
  }
  for (const key of ['caseIds', 'accountIds']) {
    if (raw[key] === undefined) continue;
    if (!Array.isArray(raw[key]) || raw[key].length > 500
      || raw[key].some(id => typeof id !== 'string' || !id.trim() || id.length > 500)) return null;
    review[key] = [...new Set(raw[key])];
  }
  return review;
}

function selectedReviewRecords(review, context) {
  const cases = Array.isArray(context.cases) ? context.cases : [];
  const accounts = Array.isArray(context.accounts) ? context.accounts : [];
  return {
    cases: review.caseIds.map(id => cases.find(record => record?.id === id)).filter(Boolean),
    accounts: review.accountIds.map(id => accounts.find(record => record?.account?.id === id)).filter(Boolean),
  };
}

/** Questions still unanswered, not a risk score or an approval checklist. */
function reviewGaps(raw, context = {}) {
  const review = restoreReview(raw);
  if (!review) return ['The review record has an invalid format.'];
  const selected = selectedReviewRecords(review, context);
  const gaps = [];
  if (!review.workflow) gaps.push('Choose the workflow being reviewed.');
  else if (!context.workflow || context.workflow.id !== review.workflow) {
    gaps.push('The selected workflow is not available in this review context.');
  }
  if (!review.objective.trim()) gaps.push('Record the intended outcome and benefit of delegation.');
  if (!review.authority.trim()) gaps.push('Record permitted actions, approval boundaries and escalation.');
  if (!review.evidence.trim() && !selected.cases.length && !selected.accounts.length) {
    gaps.push('Record the evidence being considered or select a source record.');
  }
  for (const id of review.caseIds) {
    if (!selected.cases.some(record => record.id === id)) gaps.push(`Selected evidence record is unavailable: ${id}.`);
  }
  for (const id of review.accountIds) {
    if (!selected.accounts.some(record => record.account.id === id)) gaps.push(`Selected loss account is unavailable: ${id}.`);
  }
  if (review.decision === 'Not decided') gaps.push('The reviewer has not recorded a decision.');
  if (!review.rationale.trim()) gaps.push('Explain the reasoning and uncertainty behind the decision.');
  if (['Pilot with conditions', 'Proceed with conditions'].includes(review.decision) && !review.conditions.trim()) {
    gaps.push('Specify the conditions attached to the decision.');
  }
  if (!review.owner.trim()) gaps.push('Name the person responsible for this review.');
  if (!review.nextReview) gaps.push('Set the next review date.');
  if (!review.nextMeasurement.trim()) gaps.push('Specify the next measurement or evidence to check.');
  return gaps;
}

const reviewText = (value, fallback = 'Not recorded') => typeof value === 'string' && value.trim() ? value : fallback;
const reviewName = (record, fallback) => reviewText(record?.name || record?.title, fallback);
const reviewNumber = value => typeof value === 'number' && Number.isFinite(value) && value >= 0;
const reviewMoney = (value, currency) => reviewNumber(value)
  ? `${reviewText(currency, 'Currency not recorded')} ${value.toFixed(2)}` : 'Unknown';
const reviewCents = (value, currency) => Number.isSafeInteger(value) && value >= 0
  ? reviewMoney(value / 100, currency) : 'Unknown';

function reviewSourceLink(source) {
  try {
    const url = new URL(source?.url);
    if (!['https:', 'http:'].includes(url.protocol)) return '';
    const title = reviewText(source.title, url.hostname).replace(/[\r\n]/g, ' ').replace(/[\[\]]/g, '\\$&');
    return `[${title}](<${url.href}>)`;
  } catch { return ''; }
}

function reviewCaseLines(record) {
  const financial = record.financial || {};
  const amount = reviewNumber(financial.amount) && financial.relation === 'greater_than'
    ? `More than ${reviewMoney(financial.amount, financial.currency)}`
    : reviewMoney(financial.amount, financial.currency);
  const sources = (record.sources || []).map(reviewSourceLink).filter(Boolean);
  return [
    `### ${reviewName(record, record.id)}`, '',
    `Record: ${record.id}`,
    `Record kind: ${reviewText(record.recordKind)}`,
    `Event or publication date: ${reviewText(record.eventDate || record.publicationDate)}`,
    `Recorded workflow: ${reviewText(record.workflow)}`,
    record.isComparator ? 'Historical comparator; not counted as an AI-agent incident.' : '',
    reviewText(record.summary), '',
    `Counting unit: ${reviewText(record.countingUnit)}`,
    `Exposure and denominator limits: ${reviewText(record.exposure?.note, 'No matched operational denominator is documented here.')}`,
    `Reported amount: ${amount}`,
    `Financial status: ${reviewText(financial.status || financial.label)}`,
    `Financial interpretation: ${reviewText(financial.note)}`,
    `Evidence status: ${reviewText(record.evidenceStatus)}`,
    ...(sources.length ? ['Sources:', ...sources.map(source => `- ${source}`)] : ['Source links: Not recorded']), '',
  ].filter(line => line !== undefined);
}

function reviewScenarioLines(result, currency) {
  const errors = Object.values(result?.errors || {});
  const invalid = result?.status === 'invalid' || errors.length > 0;
  const available = result && ['known', 'unknown'].includes(result.status) && !invalid;
  let benefit = 'Not calculated; no scenario result was supplied';
  let breakEven = benefit;
  let status = 'Not calculated';
  if (invalid) {
    status = 'Invalid inputs';
    benefit = 'Unavailable; correct the invalid scenario inputs';
    breakEven = benefit;
  } else if (available) {
    status = result.status === 'known' ? 'Calculated from the recorded assumptions' : 'Some assumptions are unknown';
    benefit = result.status === 'known' && typeof result.netAnnualBenefit === 'number' && Number.isFinite(result.netAnnualBenefit)
      ? `${reviewText(currency, 'Currency not recorded')} ${result.netAnnualBenefit.toFixed(2)}`
      : 'Unknown; required assumptions are missing';
    breakEven = reviewNumber(result.breakEvenReductionPct)
      ? `${result.breakEvenReductionPct.toFixed(2)}%`
      : result.baselineLossCents === 0
        ? 'Not defined for a zero annual baseline loss'
        : 'Unknown; annual baseline loss and control cost are required';
  }
  return [
    `Scenario calculation status: ${status}`,
    `Net annual benefit under assumptions: ${benefit}`,
    `Break-even loss reduction under assumptions: ${breakEven}`,
    ...errors.map(error => `Scenario issue: ${error}`),
    'These results use the account currency and the same annual period. They do not establish measured savings, control effectiveness, deployment approval or insurance coverage.',
  ];
}

function reviewAccountLines({ account, summary = {}, appraisalResults = [] }, controls) {
  const exposure = summary.exposure || {};
  const exposureField = key => Object.prototype.hasOwnProperty.call(account.exposure || {}, key)
    ? account.exposure[key] : exposure[key];
  const recordedCount = value => (typeof value === 'string' && value.trim()) || (Number.isSafeInteger(value) && value >= 0)
    ? String(value) : 'Unknown';
  const currency = account.currency;
  const completeLabel = account.financialBasis === 'realized loss' ? 'Complete net loss' : 'Complete net accounted amount';
  return [
    `### ${reviewName(account, account.id)}`, '',
    `Account: ${account.id}`,
    `Recorded workflow ID: ${reviewText(account.workflow)}`,
    `Record kind: ${reviewText(account.recordKind)}`,
    `Financial basis: ${reviewText(account.financialBasis)}`,
    `Currency: ${reviewText(currency)}`,
    `Account as of: ${reviewText(account.asOf)}`,
    `Source: ${reviewText(account.source)}`,
    `Event: ${reviewText(account.event)}`,
    `Authority recorded for this account: ${reviewText(account.authority)}`,
    `Outcome: ${reviewText(account.outcome)}`,
    `Recorded cost subtotal: ${summary.knownCostCount > 0 ? reviewCents(summary.knownGrossCents, currency) : 'Unknown'}`,
    `${completeLabel}: ${summary.complete === true ? reviewCents(summary.netCents, currency) : 'Unknown; the account is incomplete or invalid'}`,
    ...(summary.missing?.length ? [`Unknown components: ${summary.missing.join(', ')}`] : []),
    ...Object.values(summary.errors || {}).map(error => `Account issue: ${error}`),
    `Counting unit: ${reviewText(exposureField('unit'))}`,
    `Population: ${reviewText(exposureField('population'))}`,
    `Observation period: ${reviewText(exposureField('start'), 'Unknown')} to ${reviewText(exposureField('end'), 'Unknown')}`,
    `Recorded failed operations: ${recordedCount(exposureField('failures'))}`,
    `Recorded eligible operations: ${recordedCount(exposureField('opportunities'))}`,
    `Failures per 1,000 eligible operations: ${exposure.status === 'known' && reviewNumber(exposure.ratePer1000) ? exposure.ratePer1000.toFixed(4) : 'Not established'}`,
    `Exposure interpretation: ${reviewText(exposure.explanation, 'Matched exposure has not been established in this summary.')}`,
    ...Object.values(exposure.errors || {}).map(error => `Exposure issue: ${error}`), '',
    'Comparison evidence and account notes:', reviewText(account.notes), '',
    ...(Array.isArray(account.appraisals) ? account.appraisals.flatMap(appraisal => {
      const control = controls.find(item => item.id === appraisal.controlId);
      const result = Array.isArray(appraisalResults)
        ? appraisalResults.find(item => item?.controlId === appraisal.controlId)?.result : undefined;
      return [
        `#### Control scenario: ${reviewName(control, appraisal.controlId)}`, '',
        `Reviewer control decision: ${reviewText(appraisal.decision)}`,
        `Evidence: ${reviewText(appraisal.evidence)}`,
        `Assumed annual baseline loss (${reviewText(currency)}): ${reviewText(appraisal.baselineLoss, 'Unknown')}`,
        `Assumed loss reduction (%): ${reviewText(appraisal.reductionPct, 'Unknown')}`,
        `Annual control cost (${reviewText(currency)}): ${reviewText(appraisal.annualCost, 'Unknown')}`,
        'These are user-entered scenario assumptions, not measured control effects or MIT loss estimates.',
        ...reviewScenarioLines(result, currency), '',
      ];
    }) : []),
  ];
}

/** Export selected records separately; no loss pooling or inferred recommendations. */
function exportReviewMarkdown(raw, context = {}) {
  const review = restoreReview(raw);
  if (!review) throw new TypeError('A valid version 1 workflow review is required.');
  const workflow = context.workflow?.id === review.workflow ? context.workflow : null;
  const sector = !workflow || !context.sector?.id || context.sector.id === workflow.sector ? context.sector : null;
  const selected = selectedReviewRecords(review, context);
  const controls = Array.isArray(context.controls) ? context.controls : [];
  const risks = Array.isArray(context.risks) ? context.risks : [];
  const gaps = reviewGaps(review, context);
  const snapshot = typeof context.snapshot === 'string' ? context.snapshot : context.snapshot?.date;
  const lines = [
    `# ${reviewText(review.title, 'Workflow decision brief')}`, '',
    `Review: ${reviewText(review.id)}`,
    `Workflow: ${reviewName(workflow, reviewText(review.workflow))}`,
    `Sector: ${reviewName(sector, 'Not recorded')}`,
    `MIT source snapshot: ${reviewText(snapshot)}`, '',
    '## Reviewer decision',
    `Decision: ${review.decision}`,
    'This is a reviewer-entered decision. Agency Costs does not issue deployment approval, determine coverage or quote an insurance price.', '',
    `Reasoning and uncertainty: ${reviewText(review.rationale)}`,
    `Conditions: ${reviewText(review.conditions)}`,
    `Review owner: ${reviewText(review.owner)}`,
    `Next review date: ${reviewText(review.nextReview)}`,
    `Next measurement or evidence: ${reviewText(review.nextMeasurement)}`, '',
    '## Task and delegation',
    `Intended outcome and benefit: ${reviewText(review.objective)}`,
    `Allowed authority, approvals and escalation: ${reviewText(review.authority)}`,
    `Workflow task: ${reviewText(workflow?.task, 'The selected workflow description is unavailable.')}`,
    `Failure to investigate: ${reviewText(workflow?.failure)}`,
    `Proposed counting unit: ${reviewText(workflow?.countingUnit)}`,
    `Workflow basis: ${reviewText(workflow?.basis, 'Not recorded')}`,
    'Workflow descriptions apply the MIT taxonomy; they are review prompts, not observations of this deployment.', '',
    '## Reviewer evidence notes', reviewText(review.evidence), '',
    '## Selected source records',
    ...(selected.cases.length ? selected.cases.flatMap(reviewCaseLines) : ['No source records selected or available.', '']),
    '## Selected loss accounts',
    ...(selected.accounts.length ? selected.accounts.flatMap(item => reviewAccountLines(item, controls)) : ['No loss accounts selected or available.', '']),
    'Accounts and source amounts remain separate. Currencies, financial bases, periods and accounting parties are not pooled. Missing amounts do not establish zero loss.', '',
    '## Human comparison and control evidence prompts',
    `Comparable human task: ${reviewText(workflow?.humanComparison?.task)}`,
    `What delegation changes: ${reviewText(workflow?.humanComparison?.difference)}`,
    `Evidence for a fair comparison: ${reviewText(workflow?.humanComparison?.evidenceNeeded)}`, '',
    ...(workflow?.controls?.length ? workflow.controls.flatMap(item => {
      const control = controls.find(candidate => candidate.id === item.id);
      return [
        `### ${reviewName(control, item.id)}`,
        `MIT entry: ${item.id}`,
        `Source framework: ${reviewText(control?.source)}`,
        `Application rationale: ${reviewText(item.rationale)}`,
        `Evidence to inspect: ${reviewText(item.evidenceNeeded)}`, '',
      ];
    }) : ['No workflow control prompts are available.', '']),
    '## Questions still open',
    ...(gaps.length ? gaps.map(gap => `- ${gap}`) : ['No unanswered form fields were identified. This does not establish evidence quality, low risk or readiness.']), '',
    '## MIT research foundation',
    ...(workflow?.riskIds || []).map(id => `- ${id} ${reviewName(risks.find(risk => risk.id === id), '')}`.trim()),
    '- [AI Risk Priorities](https://airisk.mit.edu/priorities)',
    '- [AI Risk Mitigation Map](https://airisk.mit.edu/ai-risk-mitigations)',
    '- [Shared taxonomy](https://airtable.com/appu8mul8OVahwr3P)', '',
    'MIT expert judgments and taxonomy provide research context. Workflow failure rates, financial losses, human comparisons and control effects require their own evidence.',
  ];
  return lines.join('\n');
}

return { REVIEW_DECISIONS, blankReview, restoreReview, reviewGaps, exportReviewMarkdown };
})();
const { reviewPages } = (() => {
// Rendering only. Saved reviews and source records stay with the application.
function reviewPages(context) {
  const { reviews, review, WORKFLOWS, EVIDENCE, accounts, workflowById,
    sectorById, reviewContext, reviewGaps, decisions, storageOk, esc, option,
    routeUrl, pageHeading, money } = context;
  const workflowOptions = current => WORKFLOWS.map(w => option(w.id,
    `${w.name} — ${sectorById(w.sector).name}`, current)).join('');
  const text = (label, field, value, hint = '', type = 'textarea') => `<label>${label}${hint ? `<small>${hint}</small>` : ''}${type === 'textarea'
    ? `<textarea rows="3" data-review-field="${field}" maxlength="20000">${esc(value)}</textarea>`
    : `<input type="${type}" data-review-field="${field}" maxlength="500" value="${esc(value)}">`}</label>`;
  const gaps = current => {
    const items = reviewGaps(current, reviewContext(current));
    return items.length ? `<ul>${items.map(item => `<li>${esc(item)}</li>`).join('')}</ul>`
      : '<p>All review fields have an answer. Evidence quality and the decision still require your judgment.</p>';
  };
  return {
    reviews: () => `${pageHeading('Your workflow reviews', 'Turn the field guide into a decision: authority, evidence, conditions and the next check.')}
      <div class="review-start"><div><h2>What are you considering delegating?</h2><label>Workflow<select id="new-review-workflow">${workflowOptions('finance-payments')}</select></label></div><button class="primary" data-new-review>Start review →</button></div>
      <p class="source-note">Reviews save in this browser. Export a brief to share it with an operator, risk engineer or underwriter.</p>
      <section><h2>Saved reviews</h2>${reviews.length ? `<div class="table-scroll"><table><thead><tr><th>Review</th><th>Your decision</th><th>Owner</th><th>Next review</th></tr></thead><tbody>${reviews.map(r => `<tr><td><a href="${routeUrl('review', { id: r.id })}">${esc(r.title || 'Untitled review')}</a><small>${esc(workflowById(r.workflow)?.name || 'Workflow unavailable')}</small></td><td>${esc(r.decision)}</td><td>${esc(r.owner || 'Not recorded')}</td><td>${esc(r.nextReview || 'Not set')}</td></tr>`).join('')}</tbody></table></div>` : '<p class="empty-line">Choose a workflow above to prepare your first decision brief.</p>'}</section>
      <div class="review-path"><article><span>1</span><h3>Set the boundary</h3><p>State the benefit you want and which actions the agent may take.</p></article><article><span>2</span><h3>Inspect the evidence</h3><p>Connect relevant failures, loss accounts, comparisons and control tests.</p></article><article><span>3</span><h3>Record the decision</h3><p>Specify conditions, an owner and what you need to learn next.</p></article></div>`,
    review: () => {
      if (!review) return `${pageHeading('Review unavailable')}<a href="#/reviews">Return to your reviews →</a>`;
      const w = workflowById(review.workflow);
      const relevant = record => w && record.sectorId === w.sector && record.riskIds.some(id => w.riskIds.includes(id));
      return `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/reviews">Your reviews</a><span aria-hidden="true">/</span><span>Decision brief</span></nav>
        ${pageHeading('Workflow decision brief', 'What should the agent be allowed to do, and what would change your decision?', '<button class="primary" data-export-review>Export brief</button><button data-print>Print</button>')}
        <p class="source-note" id="review-save-state">${storageOk ? 'Saved in this browser.' : 'Browser storage unavailable. Export this brief to retain it.'}</p>
        <div class="account-layout review-layout"><div>
          <section><h2>1. Task and authority</h2><div class="form-grid">${text('Review title', 'title', review.title, '', 'text')}<label>Workflow<select data-review-field="workflow">${workflowOptions(review.workflow)}</select></label></div>
            ${text('Intended outcome and benefit', 'objective', review.objective, 'What should improve, for whom, and compared with which current process?')}
            ${text('Permitted actions, approvals and escalation', 'authority', review.authority, 'Include access, transaction limits, human checkpoints and when the agent must stop.')}
          </section>
          <section><h2>2. Evidence for this decision</h2><p class="compact">Select the records you used, then explain how far their lessons apply. A related public case does not establish this workflow’s failure rate.</p>
            <div class="review-records">${[...EVIDENCE.cases].sort((a,b) => Number(relevant(b))-Number(relevant(a))).map(c => `<div class="review-evidence-row"><label class="check"><input type="checkbox" data-review-case="${c.id}" ${review.caseIds.includes(c.id) ? 'checked' : ''}><span><strong>${esc(c.title)}</strong><small>${esc(c.recordKind)}${relevant(c) ? ' / related sector and risk tags' : ' / check relevance to this task'}</small><small>${c.financial.relation === 'greater_than' ? 'More than ' : ''}${money(c.financial.amount,c.financial.currency)} / ${esc(c.financial.label)}</small></span></label><a href="${routeUrl('case',{id:c.id})}">Inspect record →</a></div>`).join('')}</div>
            <h3>Supporting loss accounts</h3>${accounts.length ? `<div class="review-records">${accounts.map(a => `<div class="review-evidence-row"><label class="check"><input type="checkbox" data-review-account="${esc(a.id)}" ${review.accountIds.includes(a.id) ? 'checked' : ''}><span><strong>${esc(a.title || 'Untitled account')}</strong><small>${esc(a.financialBasis)} / ${a.workflow === review.workflow ? 'same workflow' : 'different or unspecified workflow: check relevance'}</small></span></label><a href="${routeUrl('account',{id:a.id})}">Inspect account →</a></div>`).join('')}</div><p class="source-note">An account and a public record may describe the same event. They remain separate references, not independent observations.</p>` : '<p class="source-note">No local loss accounts yet.</p>'}
            ${w ? `<button data-new-account data-workflow="${w.id}" data-for-review="${esc(review.id)}">Create and link a loss account</button>` : ''}
            ${text('Evidence, comparisons and remaining limitations', 'evidence', review.evidence, 'Record sources, control test results, nonfinancial harms and any comparable human or assisted process. Distinguish observations from estimates and assumptions.')}
          </section>
          <section><h2>3. Your decision and conditions</h2><label>Reviewer decision<select data-review-field="decision">${decisions.map(d => option(d,d,review.decision)).join('')}</select></label>
            ${text('Reasoning and uncertainty', 'rationale', review.rationale, 'Explain the trade-offs, whose costs matter, and what the evidence cannot yet support.')}
            ${text('Conditions to enforce', 'conditions', review.conditions, 'Specify controls, limits, human checks and rollback triggers attached to your decision.')}
            <div class="form-grid">${text('Review owner', 'owner', review.owner, '', 'text')}${text('Next review date', 'nextReview', review.nextReview, '', 'date')}</div>
            ${text('Next measurement or evidence', 'nextMeasurement', review.nextMeasurement, 'What will you measure, over which population and period, to revisit the decision?')}
            <div class="actions"><button class="primary" data-export-review>Export decision brief</button><a href="#/reviews">All reviews →</a></div>
          </section>
        </div><aside><div class="sticky-panel review-context">
          ${w ? `<p class="eyebrow">${esc(sectorById(w.sector).name)}</p><h3>${esc(w.name)}</h3><p>${esc(w.task)}</p><h3>Failure to investigate</h3><p>${esc(w.failure)}</p><h3>Proposed counting unit</h3><p>${esc(w.countingUnit)}</p><a href="${routeUrl('workflow',{id:w.id})}">Evidence, human comparison and controls →</a><p class="source-note">Your review is saved while you consult the field guide.</p>` : '<p>Choose a valid workflow.</p>'}
          <details class="review-questions" open><summary>Questions still open</summary><div id="review-gaps">${gaps(review)}</div></details>
          <p class="source-note">This brief records your judgment. It does not issue deployment approval or an insurance quote.</p>
        </div></aside></div>`;
    },
    gaps,
  };
}

return { reviewPages };
})();
const { assessmentPages } = (() => {
// Assemble a source-backed assessment from the available records. Unknown
// benefits, unmatched denominators and analogies never become a yes/no verdict.
function assessmentPages(context) {
  const { DATA, WORKFLOWS, EVIDENCE, accounts, route, esc, link, option,
    routeUrl, pageHeading, recordTable, accountTable, summarizeAccount,
    calculateControl, money } = context;
  const selected = WORKFLOWS.find(w => w.id === route.params.get('workflow'));
  const control = id => DATA.mitigations.find(c => c.id === id);
  const sector = id => DATA.sectors.find(s => s.id === id);
  const evidenceFor = w => EVIDENCE.cases.filter(c => c.sectorId === w.sector
    && c.riskIds.some(id => w.riskIds.includes(id)));
  const accountsFor = w => accounts.filter(a => a.workflow === w.id && a.sector === w.sector);
  const priorities = w => w.riskIds.map(id => DATA.risks.find(r => r.id === id))
    .filter(Boolean).sort((a,b) => (b.sectors[sector(w.sector).name]?.median ?? -1)
      - (a.sectors[sector(w.sector).name]?.median ?? -1));
  const scenarioTable = local => {
    const rows = local.flatMap(a => a.appraisals.filter(p =>
      [p.baselineLoss,p.reductionPct,p.annualCost].some(value => value !== '' && value != null))
      .map(p => { const result = calculateControl(p); return `<tr><td>${esc(control(p.controlId)?.name || p.controlId)}<small>${esc(a.title)}</small></td><td>${result.netAnnualBenefit == null ? 'Not established' : money(result.netAnnualBenefit,a.currency)}</td><td>${result.breakEvenReductionPct == null ? 'Not established' : `${result.breakEvenReductionPct.toFixed(2)}%`}</td><td>${Object.values(result.errors).map(esc).join(' ') || 'Calculated from account assumptions'}</td></tr>`; }));
    return rows.length ? `<h3>Existing control scenarios</h3><div class="table-scroll"><table><thead><tr><th>Control and account</th><th>Assumed net annual benefit</th><th>Break-even reduction</th><th>Basis</th></tr></thead><tbody>${rows.join('')}</tbody></table></div><p class="source-note">These calculations use the assumptions already in the accounts. They are not measured effects or the total net benefit of delegating the job.</p>` : '';
  };
  const picker = current => `<label class="assessment-picker">Which job?<select id="assessment-workflow">${option('', 'Choose a job', current)}${WORKFLOWS.map(w => option(w.id, `${w.name} — ${sector(w.sector).name}`, current)).join('')}</select></label>`;
  const exportText = w => {
    if (!w) return '';
    const local = accountsFor(w), records = evidenceFor(w);
    const recorded = value => value === '' || value == null ? 'Not recorded' : String(value);
    return [
      `# Is ${w.name.toLowerCase()} worth delegating?`, '',
      `Sector: ${sector(w.sector).name}`, 'MIT taxonomy snapshot: 1 October 2026', '',
      '## Assessment',
      'The available evidence does not establish whether delegation is worth its costs. No matched record of the benefit and total cost of human, assisted and agent execution is available in this assessment.',
      'This result is assembled from the bundled research and local loss accounts. It is not a deployment recommendation or an estimate of insurance coverage.', '',
      '## Job and changed exposure', w.task, '',
      `Human task: ${w.humanComparison.task}`,
      `Failure to investigate: ${w.failure}`,
      `What delegation changes: ${w.humanComparison.difference}`,
      `Proposed counting unit: ${w.countingUnit}`, '',
      '## Related public evidence',
      ...(records.length ? records.flatMap(c => [
        c.title, `Record kind: ${c.recordKind}`,
        `Financial consequence: ${c.financial.relation === 'greater_than' ? 'More than ' : ''}${money(c.financial.amount,c.financial.currency)} (${c.financial.label})`,
        c.financial.note, `Counting unit: ${c.countingUnit}`, c.exposure.note,
        ...c.sources.map(source => `${source.title}: ${source.url}`), '',
      ]) : ['No public record is linked by sector and risk tags. This is a coverage gap, not evidence of safety.', '']),
      'Public records matched by sector and risk tags are related evidence. They do not establish an identical task, permission boundary or loss distribution.', '',
      context.incidentEvidenceText ? context.incidentEvidenceText(w) : '', '',
      '## Local loss accounts',
      ...(local.length ? local.flatMap(a => {
        const summary = summarizeAccount(a);
        return [`${a.title} (${a.id})`, `Source: ${a.source || 'Not recorded'}`,
          `Authority: ${recorded(a.authority)}`,
          `Account notes: ${recorded(a.notes)}`,
          `Financial basis: ${a.financialBasis}`, `Currency: ${a.currency}`,
          `Net accounted amount: ${summary.complete ? money(summary.netCents/100,a.currency) : 'Unknown; account incomplete or invalid'}`,
          `Recorded failed operations: ${recorded(a.exposure?.failures)}`,
          `Recorded eligible operations: ${recorded(a.exposure?.opportunities)}`,
          `Exposure counting unit: ${recorded(a.exposure?.unit)}`,
          `Exposure population: ${recorded(a.exposure?.population)}`,
          `Observation start: ${recorded(a.exposure?.start)}`,
          `Observation end: ${recorded(a.exposure?.end)}`,
          `Matching population, period and counting rule declared: ${a.exposure?.matched === true ? 'Yes (account declaration)' : 'Not declared'}`,
          `Failure rate per 1,000: ${summary.exposure.ratePer1000 ?? 'Not established'}`,
          `Exposure interpretation: ${summary.exposure.explanation || 'Within the stated population and period only.'}`,
          ...a.appraisals.flatMap(p => { const result = calculateControl(p); return [
            `Control: ${control(p.controlId)?.name || p.controlId}`,
            `Assumed annual baseline loss: ${p.baselineLoss === '' || p.baselineLoss == null ? 'Unknown' : p.baselineLoss} ${a.currency}`,
            `Assumed loss reduction: ${p.reductionPct === '' || p.reductionPct == null ? 'Unknown' : p.reductionPct}%`,
            `Assumed annual control cost: ${p.annualCost === '' || p.annualCost == null ? 'Unknown' : p.annualCost} ${a.currency}`,
            `Assumed scenario net annual benefit: ${result.netAnnualBenefit == null ? 'Not established' : money(result.netAnnualBenefit,a.currency)}`,
            `Break-even reduction: ${result.breakEvenReductionPct == null ? 'Not established' : `${result.breakEvenReductionPct.toFixed(2)}%`}`,
            'Control scenario inputs are user assumptions, not measured effects.',
          ]; }), ''];
      }) : ['No local accounts for this workflow.', '']),
      'Amounts remain separate across records, currencies and financial bases. No portfolio inference is made.', '',
      '## MIT priorities linked to the job',
      ...priorities(w).map(r => { const rating = r.sectors[sector(w.sector).name];
        return `${r.id} ${r.name}: ${rating ? `median ${rating.median}/5, n = ${rating.count}` : 'sector rating not displayed'}`; }),
      'Expert vulnerability judgments are not failure probabilities or monetary loss estimates.',
      'Source: https://airisk.mit.edu/priorities', '',
      '## Evidence that would change the answer', w.humanComparison.evidenceNeeded, '',
      ...w.controls.flatMap(item => [`${control(item.id)?.name} (${item.id})`,
        `Application: ${item.rationale}`, `Evidence: ${item.evidenceNeeded}`,
        `Source framework: ${control(item.id)?.source}`, '']),
      'MIT control source: https://airisk.mit.edu/ai-risk-mitigations', '',
      'Workflow mappings and counting units are Agency Costs analysis applying MIT research. Control effectiveness and the net benefit of delegation remain unmeasured here.',
    ].join('\n');
  };
  return {
    exportText,
    pickerPage: () => `${pageHeading('Is this job worth delegating?', 'Choose a job. Agency Costs assembles the evidence and assesses what it can support.')}${picker('')}
      <p class="source-note">The assessment uses MIT research, linked public evidence and any relevant loss accounts already saved here.</p>
      <div class="workflow-grid">${WORKFLOWS.map(w => `<a class="workflow-card" href="${routeUrl('assessment',{workflow:w.id})}"><p class="eyebrow">${esc(sector(w.sector).name)}</p><h2>${esc(w.name)} →</h2><p>${esc(w.task)}</p></a>`).join('')}</div>`,
    assessment: () => {
      if (!selected) return `${pageHeading('Choose a job to assess')}${picker('')}`;
      const w = selected, s = sector(w.sector), local = accountsFor(w), records = evidenceFor(w);
      const matched = local.filter(a => summarizeAccount(a).exposure.ratePer1000 != null);
      return `${pageHeading(w.name, 'Is this job worth delegating to an AI agent?', `<button class="primary" data-export-assessment="${w.id}">Export assessment</button>`)}${picker(w.id)}
        <section class="assessment-answer"><p class="eyebrow">Assessment from available evidence</p><h2>The case for delegation is not yet established.</h2><p>We can identify the failure mechanisms and controls to investigate. The available records do not establish a matched comparison of the benefits and total costs of delegating this job.</p><p class="source-note">${records.length} related public ${records.length===1?'record':'records'} / ${local.length} local loss ${local.length===1?'account':'accounts'} / ${matched.length} ${matched.length===1?'account contains':'accounts contain'} a computable exposure rate. These are evidence counts, not a risk score.</p></section>
        <div class="assessment-body"><div><section><h2>What changes when the agent does it?</h2><p>${esc(w.humanComparison.difference)}</p><p><strong>Failure to investigate:</strong> ${esc(w.failure)}</p><p class="source-note">This is an Agency Costs workflow analysis, not a reported observation.</p></section>
          <section><h2>What the evidence actually shows</h2>${records.length ? `<p class="compact">Matched by sector and overlapping risk tags. Check the underlying task before transferring a lesson.</p>${recordTable(records)}` : '<p>No public case in the current collection is linked to this job. Absence from this collection does not establish safety.</p>'}${records.map(c=>`<p class="source-note">${esc(c.financial.note)} ${c.sources.map(source=>link(source.url,source.title)).join(' / ')}</p>`).join('')}
            ${local.length ? `<h3>Existing accounts for this job</h3>${accountTable(local)}<p class="source-note">Accounts remain separate. Scenarios, awards and realized losses have different meanings.</p>${scenarioTable(local)}` : ''}</section>
          ${context.relatedIncidents ? context.relatedIncidents(w) : ''}
          <section><h2>What would change the answer?</h2><p>${esc(w.humanComparison.evidenceNeeded)}</p><p><strong>Proposed counting unit:</strong> ${esc(w.countingUnit)}</p><div class="control-list">${w.controls.map(item=>{const c=control(item.id);return `<article class="control-card"><h3>${esc(c.name)}</h3><p>${esc(item.rationale)}</p><p class="evidence-prompt">${esc(item.evidenceNeeded)}</p><details><summary>MIT source</summary><p>${esc(c.definition)}</p><p class="source-note">${esc(c.source)} / ${esc(c.id)}</p></details></article>`;}).join('')}</div><p class="source-note">These controls are candidates supported by the MIT source text. No measured effect size for this job is present in this assessment.</p></section>
        </div><aside class="atlas-priorities"><p class="eyebrow">${esc(s.name)}</p><h2>MIT risk context</h2><p class="source-note">Priorities linked to this workflow</p><ul>${priorities(w).map(r=>{const v=r.sectors[s.name];return `<li><a href="${routeUrl('risk',{id:r.id,sector:s.id})}">${r.id} ${esc(r.name)}</a><strong>${v?`${v.median}/5`:'Not displayed'}</strong>${v?`<small>n = ${v.count}</small>`:''}</li>`;}).join('')}</ul><p class="source-note">Expert vulnerability judgments. They do not quantify the chance or cost of a failure.</p><a href="${routeUrl('workflow',{id:w.id})}">Full workflow reference →</a><a href="#/sources">Sources and methods →</a></aside></div>`;
    },
  };
}

return { assessmentPages };
})();
const { ratingMean, severityKeys, vulnerabilityLabels, rankedRisks, naicsSectors } = (() => {
const severityKeys = ['negligible', 'minor', 'substantial', 'severe', 'catastrophic'];
const vulnerabilityLabels = ['Not at all', 'Minimal', 'Moderate', 'High', 'Extreme'];
const responsibilityLabels = ['Not at all', 'Minimal', 'Moderate', 'High', 'Primary'];

function ratingMean(rating) {
  if (!rating || !rating.count) return null;
  return Object.entries(rating.distribution).reduce((sum, [level, share]) => sum + Number(level) * share, 0);
}

function severityMean(distribution) {
  if (!distribution) return null;
  return severityKeys.reduce((sum, key, index) => sum + (index + 1) * distribution[key] / 100, 0);
}

function rankedRisks(risks, sector, sort = 'vulnerability') {
  return [...risks].sort((a, b) => {
    if (sort === 'taxonomy') return a.id.localeCompare(b.id, undefined, { numeric: true });
    if (sort === 'severity') return severityMean(b.severity.bau) - severityMean(a.severity.bau);
    const ar = a.sectors[sector.name];
    const br = b.sectors[sector.name];
    return (br?.median ?? -1) - (ar?.median ?? -1)
      || (ratingMean(br) ?? -1) - (ratingMean(ar) ?? -1)
      || a.id.localeCompare(b.id);
  });
}

function naicsSectors(code, data) {
  // Use explicit Airtable links, then the longest matching ancestor. Sector 54
  // cannot be assigned as a whole because the study separates R&D (5417).
  const candidates = data.sectors.flatMap(sector => sector.naics.map(parent => ({ sector, parent })));
  const matches = candidates.filter(({ parent }) => {
    if (parent.includes('-')) {
      const [start, end] = parent.split('-').map(Number);
      return Number(code.slice(0, 2)) >= start && Number(code.slice(0, 2)) <= end;
    }
    return code.startsWith(parent);
  });
  const specificity = Math.max(0, ...matches.map(({ parent }) => parent.includes('-') ? 2 : parent.length));
  return [...new Set(matches.filter(({ parent }) => (parent.includes('-') ? 2 : parent.length) === specificity).map(x => x.sector.id))];
}

function makeBrief(data, brief) {
  const sector = data.sectors.find(s => s.id === brief.sector);
  return {
    title: brief.title || 'Untitled deployment', snapshot: data.version,
    sector: sector?.name || '', deployment: brief.deployment || '',
    authority: brief.authority || '', exposure: brief.exposure || '',
    loss: brief.loss || '', evidence: brief.evidence || '',
    actor: brief.actor || '', lifecycle: brief.lifecycle || '',
    risks: brief.risks.map(id => {
      const r = data.risks.find(risk => risk.id === id);
      const rating = r.sectors[sector?.name];
      return { id, name: r.name, sectorVulnerability: rating ? {
        median: rating.median, mean: ratingMean(rating), n: rating.count, consensus: rating.consensus,
      } : null, notes: brief.riskNotes?.[id] || '' };
    }),
    mitigations: brief.controls.map(id => {
      const c = data.mitigations.find(control => control.id === id);
      return { id, name: c.name, category: c.category, source: c.source, definition: c.definition };
    }),
    limitations: 'MIT Delphi ratings are expert judgments about broad AI risks, not deployment failure rates, insured losses or premiums. Control selections and deployment notes are user assessments. No control effectiveness is estimated.',
    sources: ['https://airtable.com/appu8mul8OVahwr3P', 'https://airisk.mit.edu/priorities', 'https://airisk.mit.edu/ai-risk-mitigations'],
  };
}

function briefMarkdown(record) {
  const lines = [`# ${record.title}`, '', `Sector: ${record.sector}`, `Source snapshot: ${record.snapshot}`, '',
    '## Deployment', record.deployment || 'Not recorded', '', `Actor: ${record.actor || 'Not recorded'}`,
    `Lifecycle: ${record.lifecycle || 'Not recorded'}`, '', '## Authority and exposure',
    record.authority || 'Agent authority not recorded', '', record.exposure || 'Exposure and counting unit not recorded',
    '', '## Potential loss', record.loss || 'Not recorded', '', '## Risks for review'];
  record.risks.forEach(r => lines.push('', `### ${r.id} ${r.name}`, r.sectorVulnerability
    ? `MIT sector vulnerability: median ${r.sectorVulnerability.median}/5, mean ${r.sectorVulnerability.mean.toFixed(2)}, n=${r.sectorVulnerability.n}, consensus ${r.sectorVulnerability.consensus ? 'yes' : 'no'}.`
    : 'Sector vulnerability not displayed in MIT’s published view.', r.notes || 'Deployment-specific evidence not recorded.'));
  lines.push('', '## Candidate mitigations');
  record.mitigations.forEach(c => lines.push('', `### ${c.name}`, c.definition, `MIT category: ${c.category}; source: ${c.source}.`));
  lines.push('', '## Evidence to obtain', record.evidence || 'Not recorded', '', '## Interpretation', record.limitations, '', '## Sources', ...record.sources);
  return lines.join('\n');
}

return { ratingMean, severityKeys, vulnerabilityLabels, rankedRisks, naicsSectors };
})();
const { blankAccount, summarizeAccount, calculateControl, validateAccount, exportAccountMarkdown } = (() => {
/**
 * Local Agency Costs account schema, version 1.
 *
 * Money inputs are non-negative decimal currency amounts, with up to two decimal
 * places. Empty strings and null mean unknown; an explicit 0 means known zero.
 * Components must cover disjoint costs in the same currency and dated boundary.
 * `recovered` records received recoveries, not expected receipts or insurance
 * limits. A full net needs all five components. No MIT rating enters these sums.
 *
 * Defaults: { version: 1, id, title, sector, workflow, currency: 'USD', eventDate,
 * asOf, source, event, authority, outcome, notes, recordKind: 'user-entered',
 * financialBasis: 'realized loss',
 * losses: { direct, response, interruption, thirdParty, recovered },
 * exposure: { failures, opportunities, unit, population, start, end,
 * matched: false }, risks: [], controls: [], appraisals: [] }.
 * Each appraisal: { controlId, decision: 'Investigate', evidence, baselineLoss,
 * reductionPct, annualCost }. All unspecified text is ''. Financial basis is
 * 'realized loss', 'ordered award', 'estimate' or 'scenario'; an ordered award is
 * not treated as proof of a paid loss. Control economics is a separate scenario.
 *
 * Exported functions are pure and do not use browser storage or network access.
 */

const COST_KEYS = ['direct', 'response', 'interruption', 'thirdParty'];
const LOSS_KEYS = [...COST_KEYS, 'recovered'];
const LOSS_LABELS = {
  direct: 'Direct loss',
  response: 'Response costs',
  interruption: 'Business interruption',
  thirdParty: 'Third-party costs',
  recovered: 'Received recoveries',
};
const TEXT_KEYS = [
  'id', 'title', 'sector', 'workflow', 'eventDate', 'asOf', 'source', 'event',
  'authority', 'outcome', 'notes',
];
const EXPOSURE_TEXT_KEYS = ['unit', 'population', 'start', 'end'];
const RECORD_KINDS = ['user-entered', 'public-account', 'operator-record', 'constructed'];
const FINANCIAL_BASES = ['realized loss', 'ordered award', 'estimate', 'scenario'];
const MAX_MONEY_CENTS = BigInt(Number.MAX_SAFE_INTEGER);

function blankAccount() {
  return {
    version: 1,
    ...Object.fromEntries(TEXT_KEYS.map(key => [key, ''])),
    currency: 'USD',
    recordKind: 'user-entered',
    financialBasis: 'realized loss',
    losses: Object.fromEntries(LOSS_KEYS.map(key => [key, ''])),
    exposure: {
      failures: '', opportunities: '', unit: '', population: '', start: '', end: '',
      matched: false,
    },
    risks: [],
    controls: [],
    appraisals: [],
  };
}

function inputText(value) {
  if (value === undefined || value === null) return '';
  return typeof value === 'string' || typeof value === 'number' ? String(value).trim() : null;
}

function money(value) {
  const text = inputText(value);
  if (text === '') return { status: 'unknown', cents: null };
  if (text === null || text.length > 40 || !/^(?:\d+(?:\.\d{0,2})?|\.\d{1,2})$/.test(text)) {
    return { status: 'invalid', cents: null, error: 'Use an amount of 0 or more, with at most two decimal places.' };
  }
  const [whole = '', fraction = ''] = text.split('.');
  const cents = BigInt(whole || '0') * 100n + BigInt(fraction.padEnd(2, '0'));
  if (cents > MAX_MONEY_CENTS) {
    return { status: 'invalid', cents: null, error: 'The amount is too large to calculate precisely.' };
  }
  return { status: 'known', cents: Number(cents) };
}

function count(value) {
  const text = inputText(value);
  if (text === '') return { status: 'unknown', value: null };
  const number = text === null ? NaN : Number(text);
  if (text === null || !/^\d+(?:\.0+)?$/.test(text) || !Number.isSafeInteger(number) || number < 0) {
    return { status: 'invalid', value: null, error: 'Use a whole number of 0 or more.' };
  }
  return { status: 'known', value: number };
}

function validDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value;
}

function summarizeExposure(input = {}) {
  const failures = count(input.failures);
  const opportunities = count(input.opportunities);
  const metadata = Object.fromEntries(EXPOSURE_TEXT_KEYS.map(key => [key, inputText(input[key]) || '']));
  const errors = {};
  if (failures.error) errors.failures = failures.error;
  if (opportunities.error) errors.opportunities = opportunities.error;
  for (const key of ['start', 'end']) {
    if (metadata[key] && !validDate(metadata[key])) errors[key] = 'Use a valid date in YYYY-MM-DD form.';
  }
  if (!errors.start && !errors.end && metadata.start && metadata.end && metadata.end < metadata.start) {
    errors.end = 'The observation end must be on or after its start.';
  }
  if (failures.value !== null && opportunities.value !== null && failures.value > opportunities.value) {
    errors.failures = 'Failed operations cannot exceed eligible opportunities.';
  }
  const missing = EXPOSURE_TEXT_KEYS.filter(key => !metadata[key]);
  if (failures.status === 'unknown') missing.unshift('failures');
  if (opportunities.status === 'unknown') missing.unshift('opportunities');
  let status = 'known';
  if (Object.keys(errors).length) status = 'invalid';
  else if (missing.length || opportunities.value === 0) status = 'unknown';
  else if (input.matched !== true) status = 'unmatched';
  const ratePer1000 = status === 'known' ? failures.value / opportunities.value * 1000 : null;
  return {
    status, failures: failures.value, opportunities: opportunities.value,
    ...metadata, matched: input.matched === true, missing, errors, ratePer1000,
    explanation: status === 'known'
      ? 'Failed operations per 1,000 eligible opportunities in the recorded population and period.'
      : status === 'unmatched'
        ? 'Confirm that failures and opportunities use the same population, period and counting rule.'
        : opportunities.value === 0 && status !== 'invalid'
          ? 'A zero denominator cannot establish an observed failure rate.'
          : 'A rate requires valid counts, a counting unit, population, observation dates and a matching declaration.',
  };
}

function summarizeAccount(account = {}) {
  const losses = account.losses || {};
  const parsed = Object.fromEntries(LOSS_KEYS.map(key => [key, money(losses[key])]));
  const components = Object.fromEntries(LOSS_KEYS.map(key => [key, parsed[key].cents]));
  const errors = Object.fromEntries(LOSS_KEYS.filter(key => parsed[key].error).map(key => [key, parsed[key].error]));
  const missing = LOSS_KEYS.filter(key => parsed[key].status === 'unknown');
  const knownCosts = COST_KEYS.filter(key => parsed[key].status === 'known');
  let knownGrossCents = knownCosts.length ? knownCosts.reduce((sum, key) => sum + components[key], 0) : null;
  if (knownGrossCents !== null && !Number.isSafeInteger(knownGrossCents)) {
    errors.total = 'Combined costs are too large to calculate precisely.';
    knownGrossCents = null;
  }
  const grossCents = COST_KEYS.every(key => parsed[key].status === 'known') && !errors.total
    ? knownGrossCents : null;
  if (grossCents !== null && components.recovered !== null && components.recovered > grossCents) {
    errors.recovered = 'Received recoveries cannot exceed the recorded total costs.';
  }
  const complete = missing.length === 0 && Object.keys(errors).length === 0;
  const netCents = complete ? grossCents - components.recovered : null;
  // A partial subtotal never pretends that an unknown component is a known zero.
  const knownNetCents = knownGrossCents !== null && components.recovered !== null
    && components.recovered <= knownGrossCents && !errors.total && !errors.recovered
    ? knownGrossCents - components.recovered : null;
  return {
    currency: typeof account.currency === 'string' ? account.currency.toUpperCase() : 'USD',
    status: Object.keys(errors).length ? 'invalid' : complete ? 'known' : 'unknown',
    components, knownGrossCents, knownNetCents, grossCents, netCents, complete,
    knownCostCount: knownCosts.length, missing, errors,
    exposure: summarizeExposure(account.exposure || {}),
  };
}

/** Assumption arithmetic: all loss/cost inputs refer to the same annual period. */
function calculateControl({ baselineLoss, reductionPct, annualCost } = {}) {
  const baseline = money(baselineLoss);
  const cost = money(annualCost);
  const reductionText = inputText(reductionPct);
  const reduction = reductionText === '' || reductionText === null ? null : Number(reductionText);
  const errors = {};
  if (baseline.error) errors.baselineLoss = baseline.error;
  if (cost.error) errors.annualCost = cost.error;
  if (reductionText === null || (reduction !== null && (!/^(?:\d+(?:\.\d*)?|\.\d+)$/.test(reductionText) || !Number.isFinite(reduction) || reduction < 0 || reduction > 100))) {
    errors.reductionPct = 'Use an assumed reduction from 0 to 100 percent.';
  }
  const status = Object.keys(errors).length ? 'invalid'
    : baseline.cents === null || cost.cents === null || reduction === null ? 'unknown' : 'known';
  const lossAvoidedCents = status === 'known' ? Math.round(baseline.cents * (reduction / 100)) : null;
  const residualLossCents = status === 'known' ? baseline.cents - lossAvoidedCents : null;
  const netBenefitCents = status === 'known' ? lossAvoidedCents - cost.cents : null;
  const breakEvenReductionPct = baseline.cents > 0 && cost.cents !== null && !errors.baselineLoss && !errors.annualCost
    ? cost.cents / baseline.cents * 100 : null;
  return {
    status, errors, baselineLossCents: baseline.cents, annualCostCents: cost.cents,
    reductionPct: reduction, lossAvoidedCents, residualLossCents, netBenefitCents,
    netAnnualBenefit: netBenefitCents === null ? null : netBenefitCents / 100,
    breakEvenReductionPct,
    basis: 'User-entered annual-loss, cost and effectiveness assumptions. These are not MIT estimates or observed control effects.',
  };
}

/** Validate imported input only. Derived outputs are always recalculated. */
function validateAccount(input) {
  const errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { valid: false, account: null, errors: { account: 'Choose a version 1 account object.' } };
  }
  if (input.version !== 1) errors.version = 'This file must use account version 1.';
  const account = blankAccount();
  const readString = (object, key, path = key, limit = 20000) => {
    const value = object[key];
    if (value === undefined || value === null) return '';
    if (typeof value !== 'string' || value.length > limit) {
      errors[path] = `Use text no longer than ${limit.toLocaleString('en-US')} characters.`;
      return '';
    }
    return value;
  };
  for (const key of TEXT_KEYS) account[key] = readString(input, key);
  if (input.currency !== undefined) {
    const currency = readString(input, 'currency', 'currency', 3).toUpperCase();
    if (!/^[A-Z]{3}$/.test(currency)) errors.currency = 'Record a three-letter currency code.';
    else account.currency = currency;
  }
  if (input.recordKind !== undefined) {
    if (!RECORD_KINDS.includes(input.recordKind)) errors.recordKind = 'Choose a recognized record kind.';
    else account.recordKind = input.recordKind;
  }
  if (input.financialBasis !== undefined) {
    if (!FINANCIAL_BASES.includes(input.financialBasis)) errors.financialBasis = 'Choose realized loss, ordered award, estimate or scenario.';
    else account.financialBasis = input.financialBasis;
  }
  for (const key of ['losses', 'exposure']) {
    if (input[key] !== undefined && (!input[key] || typeof input[key] !== 'object' || Array.isArray(input[key]))) {
      errors[key] = 'Expected an object with named fields.';
    }
  }
  if (!errors.losses) {
    for (const key of LOSS_KEYS) {
      const text = inputText(input.losses?.[key]);
      const parsed = money(input.losses?.[key]);
      if (parsed.error) errors[`losses.${key}`] = parsed.error;
      account.losses[key] = text ?? '';
    }
  }
  if (!errors.exposure) {
    for (const key of ['failures', 'opportunities']) {
      const text = inputText(input.exposure?.[key]);
      const parsed = count(input.exposure?.[key]);
      if (parsed.error) errors[`exposure.${key}`] = parsed.error;
      account.exposure[key] = text ?? '';
    }
    for (const key of EXPOSURE_TEXT_KEYS) account.exposure[key] = readString(input.exposure || {}, key, `exposure.${key}`);
    if (input.exposure?.matched !== undefined && typeof input.exposure.matched !== 'boolean') {
      errors['exposure.matched'] = 'The matching declaration must be true or false.';
    } else account.exposure.matched = input.exposure?.matched === true;
  }
  for (const key of ['risks', 'controls']) {
    const values = input[key] ?? [];
    if (!Array.isArray(values) || values.length > 1000 || values.some(value => typeof value !== 'string' || value.length > 500)) {
      errors[key] = 'Use an array of at most 1,000 text identifiers.';
    } else account[key] = [...new Set(values)];
  }
  const appraisals = input.appraisals ?? [];
  if (!Array.isArray(appraisals) || appraisals.length > 1000) {
    errors.appraisals = 'Use an array of at most 1,000 control appraisals.';
  } else {
    account.appraisals = appraisals.flatMap((appraisal, index) => {
      const path = `appraisals.${index}`;
      if (!appraisal || typeof appraisal !== 'object' || Array.isArray(appraisal)) {
        errors[path] = 'Expected an appraisal object.';
        return [];
      }
      const result = {
        controlId: readString(appraisal, 'controlId', `${path}.controlId`, 500),
        decision: appraisal.decision === undefined ? 'Investigate' : readString(appraisal, 'decision', `${path}.decision`, 100),
        evidence: readString(appraisal, 'evidence', `${path}.evidence`),
        baselineLoss: inputText(appraisal.baselineLoss) ?? '',
        reductionPct: inputText(appraisal.reductionPct) ?? '',
        annualCost: inputText(appraisal.annualCost) ?? '',
      };
      const calculation = calculateControl(appraisal);
      for (const [key, message] of Object.entries(calculation.errors)) errors[`${path}.${key}`] = message;
      return [result];
    });
  }
  const summary = summarizeAccount(account);
  for (const [key, message] of Object.entries(summary.errors)) errors[`losses.${key}`] = message;
  for (const [key, message] of Object.entries(summary.exposure.errors)) errors[`exposure.${key}`] = message;
  return { valid: Object.keys(errors).length === 0, account: Object.keys(errors).length ? null : account, errors };
}

function moneyLabel(cents, currency) {
  return cents === null ? 'Unknown' : `${currency} ${(cents / 100).toFixed(2)}`;
}

function contextName(value, fallback = '') {
  return typeof value === 'string' ? value : value?.name || value?.title || value?.id || fallback;
}

function exportAccountMarkdown(record, { sector, workflow, risks = [], controls = [] } = {}) {
  const account = { ...blankAccount(), ...record };
  const summary = summarizeAccount(account);
  const lines = [
    `# ${account.title || 'Untitled loss account'}`, '',
    `Record: ${account.id || 'Not assigned'}`, `Record kind: ${account.recordKind}`,
    `Financial basis: ${account.financialBasis}`,
    `Sector: ${contextName(sector, account.sector) || 'Not recorded'}`,
    `Workflow: ${contextName(workflow, account.workflow) || 'Not recorded'}`,
    `Event date: ${account.eventDate || 'Not recorded'}`,
    `Account as of: ${account.asOf || 'Not recorded'}`, '',
    '## Event and evidence', account.event || 'Event not recorded.', '',
    `Authority: ${account.authority || 'Not recorded'}`,
    `Outcome: ${account.outcome || 'Not recorded'}`, '',
    `Source: ${account.source || 'Not recorded'}`, '',
    '## Loss account',
    ...LOSS_KEYS.map(key => `- ${LOSS_LABELS[key]}: ${moneyLabel(summary.components[key], summary.currency)}`),
    '', `Recorded cost subtotal: ${moneyLabel(summary.knownCostCount ? summary.knownGrossCents : null, summary.currency)}`,
    `${account.financialBasis === 'realized loss' ? 'Complete net loss' : `Net accounted amount (${account.financialBasis})`}: ${moneyLabel(summary.netCents, summary.currency)}`,
    'Costs must be disjoint and use the same currency and accounting boundary. Unknown values have not been replaced with zero.',
    ...Object.values(summary.errors).map(message => `Account issue: ${message}`), '',
    '## Counting unit and exposure',
    `Unit: ${summary.exposure.unit || 'Not recorded'}`,
    `Population: ${summary.exposure.population || 'Not recorded'}`,
    `Observation period: ${summary.exposure.start || 'Unknown'} to ${summary.exposure.end || 'Unknown'}`,
    `Failed operations: ${summary.exposure.failures ?? 'Unknown'}`,
    `Eligible opportunities: ${summary.exposure.opportunities ?? 'Unknown'}`,
    `Same population, period and counting rule confirmed: ${summary.exposure.matched ? 'Yes' : 'No'}`,
    `Failures per 1,000: ${summary.exposure.ratePer1000 === null ? 'Not established' : summary.exposure.ratePer1000.toFixed(4)}`,
    summary.exposure.explanation, '',
    '## Human workflow comparison',
    ...(workflow?.humanComparison ? [
      `Human task: ${workflow.humanComparison.task}`,
      `Changed by delegation: ${workflow.humanComparison.difference}`,
      `Evidence required: ${workflow.humanComparison.evidenceNeeded}`,
      'This is a task crosswalk, not an established human-versus-agent loss ratio.', '',
    ] : ['No workflow comparison is linked.', '']),
    '## Risk classification',
    ...(risks.length ? risks.map(risk => `- ${risk.id ? `${risk.id} ` : ''}${contextName(risk)}`) : (account.risks || []).map(id => `- ${id}`)), '',
    '## Controls',
    ...(controls.length ? controls.map(control => `- ${contextName(control)} (${control.id}; MIT category ${control.category}; source ${control.source})`) : (account.controls || []).map(id => `- ${id}`)), '',
    ...((account.appraisals || []).length ? ['## Control appraisals', '', ...(account.appraisals || []).flatMap(appraisal => {
      const calculation = calculateControl(appraisal);
      const control = controls.find(item => item.id === appraisal.controlId);
      return [
        `### ${contextName(control, appraisal.controlId) || 'Control not recorded'}`,
        `Decision: ${appraisal.decision || 'Investigate'}`,
        `Evidence: ${appraisal.evidence || 'Not recorded'}`,
        `Assumed annual loss: ${moneyLabel(calculation.baselineLossCents, summary.currency)}`,
        `Assumed loss reduction: ${calculation.reductionPct === null ? 'Unknown' : `${calculation.reductionPct}%`}`,
        `Annual control cost: ${moneyLabel(calculation.annualCostCents, summary.currency)}`,
        `Net annual benefit under assumptions: ${moneyLabel(calculation.netBenefitCents, summary.currency)}`,
        calculation.basis, '',
      ];
    })] : []),
    '## Notes', account.notes || 'Not recorded.', '',
    'MIT taxonomy and Delphi judgments provide classification and research context. The account, source judgments, loss amounts and control selections require their own evidence. No study rating has been converted to a loss probability or premium.',
  ];
  return lines.join('\n');
}

return { blankAccount, summarizeAccount, calculateControl, validateAccount, exportAccountMarkdown };
})();

const $ = selector => document.querySelector(selector);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link = (url, title) => /^https:\/\//.test(url || '') ? `<a href="${esc(url)}" target="_blank" rel="noopener noreferrer">${esc(title)}</a>` : esc(title);
const option = (value, label, selected) => `<option value="${esc(value)}" ${value === selected ? 'selected' : ''}>${esc(label)}</option>`;
const sectorById = id => DATA.sectors.find(s => s.id === id);
const riskById = id => DATA.risks.find(r => r.id === id);
const controlById = id => DATA.mitigations.find(c => c.id === id);
const categoryById = id => DATA.taxonomy.mitigations.find(c => c.Code === id);
const workflowById = id => WORKFLOWS.find(w => w.id === id);
const caseById = id => EVIDENCE.cases.find(c => c.id === id);
const routeUrl = (page, params = {}) => `#/${page}${Object.keys(params).length ? `?${new URLSearchParams(params)}` : ''}`;
const money = (v, currency = 'USD') => v == null ? 'Not reported' : `${currency} ${Number(v).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}`;
const moneyCents = (v,currency) => money(v == null ? null : v / 100,currency);
const riskLink = (id, sector) => { const r=riskById(id); return r ? `<a class="risk-tag" href="${routeUrl('risk',{id,sector})}"><b>${r.id}</b> ${esc(r.name)}</a>` : ''; };
const pageHeading = (title, subtitle='', actions='') => `<div class="page-heading"><div><h1>${esc(title)}</h1>${subtitle ? `<p>${esc(subtitle)}</p>` : ''}</div>${actions ? `<div class="actions">${actions}</div>` : ''}</div>`;
const breadcrumb = (...parts) => `<nav class="breadcrumb" aria-label="Breadcrumb"><a href="#/home">Sectors</a>${parts.map(([title,url])=>`<span aria-hidden="true">/</span>${url ? `<a href="${url}">${esc(title)}</a>` : `<span>${esc(title)}</span>`}`).join('')}</nav>`;
const studyNote = '<p class="source-note">Expert judgments of sector vulnerability, on a 1–5 scale. These are not failure rates. <a href="https://airisk.mit.edu/priorities" target="_blank" rel="noopener">MIT priority study</a></p>';
const casesForSector = id => EVIDENCE.cases.filter(c => c.sectorId === id);
const workflowCases = w => EVIDENCE.cases.filter(c => c.sectorId === w.sector && c.riskIds.some(id => w.riskIds.includes(id)));
const sectorOptions = current => DATA.sectors.map(s=>option(s.id,s.name,current)).join('');
const storageKey = 'agency-costs-accounts-v2';
// Browser drafts must retain unfinished or invalid numeric edits. Validate their
// structure with the calculation fields blank, then restore the entered values;
// the calculation functions still reject invalid amounts and impossible rates.
function restoreDraft(raw) {
 if (!raw || typeof raw!=='object' || Array.isArray(raw)) return null;
 const candidate=structuredClone(raw),pending=[];
 const retain=(object,key,path)=>{
  if (!object || typeof object!=='object' || Array.isArray(object) || object[key]===undefined || object[key]===null) return;
  const value=object[key];
  if (!['string','number'].includes(typeof value) || String(value).length>100) return;
  pending.push([path,typeof value==='number'?String(value):value]);object[key]='';
 };
 for (const key of ['direct','response','interruption','thirdParty','recovered']) retain(candidate.losses,key,['losses',key]);
 for (const key of ['failures','opportunities','start','end']) retain(candidate.exposure,key,['exposure',key]);
 if(Array.isArray(candidate.appraisals))candidate.appraisals.forEach((p,i)=>{for(const key of ['baselineLoss','reductionPct','annualCost'])retain(p,key,['appraisals',i,key]);});
 const result=validateAccount(candidate);if(!result.valid)return null;
 for(const [path,value] of pending){let target=result.account;for(const key of path.slice(0,-1))target=target[key];target[path.at(-1)]=value;}
 return result.account;
}
function accountDate() {
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
 const values=Object.fromEntries(parts.map(p=>[p.type,p.value]));
 return `${values.year}-${values.month}-${values.day}`;
}
function normalizeControlContext(a) {
 const seen=new Set();
 for(const p of a.appraisals){
  if(!controlById(p.controlId))throw Error('Unknown MIT control ID in an appraisal.');
  if(seen.has(p.controlId))throw Error('The same control has more than one appraisal.');
  seen.add(p.controlId);
  if(!a.controls.includes(p.controlId))a.controls.push(p.controlId);
 }
 for(const id of a.controls)if(!seen.has(id))a.appraisals.push({controlId:id,decision:'Investigate',evidence:'',baselineLoss:'',reductionPct:'',annualCost:''});
}
let accounts = [], storageOk = true;
try { const saved=JSON.parse(localStorage.getItem(storageKey)||'[]');if(!Array.isArray(saved))throw Error('Invalid saved account collection.');accounts=saved.map(restoreDraft).filter(Boolean); } catch { storageOk=false; }
const reviewStorageKey = 'agency-costs-reviews-v1';
let reviews = [], reviewStorageOk = true;
try {
 const saved = JSON.parse(localStorage.getItem(reviewStorageKey) || '[]');
 if (!Array.isArray(saved)) throw Error('Invalid review collection.');
 reviews = saved.map(restoreReview).filter(Boolean);
} catch { reviewStorageOk = false; }
const reviewById = id => reviews.find(review => review.id === id);
function saveReviews() {
 try { localStorage.setItem(reviewStorageKey, JSON.stringify(reviews)); reviewStorageOk = true; }
 catch { reviewStorageOk = false; }
}
function reviewContext(review) {
 const workflow = workflowById(review.workflow);
 return {
  workflow, sector: sectorById(workflow?.sector), risks: DATA.risks,
  cases: EVIDENCE.cases, accounts: accounts.map(account => ({ account, summary: summarizeAccount(account),
   appraisalResults: account.appraisals.map(appraisal => ({controlId: appraisal.controlId, result: calculateControl(appraisal)})),
  })),
  controls: DATA.mitigations, snapshot: '1 October 2026',
 };
}
function reviewViews(review) {
 return reviewPages({ reviews, review, WORKFLOWS, EVIDENCE, accounts, workflowById,
  sectorById, reviewContext, reviewGaps, decisions: REVIEW_DECISIONS,
  storageOk: reviewStorageOk, esc, option, routeUrl, pageHeading, money });
}
function startReview(workflow) {
 const w = workflowById(workflow);
 if (!w) return;
 const review = blankReview();
 review.id = `ACR-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
 review.workflow = w.id;
 review.title = `${w.name} review`;
 reviews.push(review); saveReviews(); navigate('review', { id: review.id });
}
function assessmentViews() {
 return assessmentPages({DATA, WORKFLOWS, EVIDENCE, accounts, route, esc, link, option,
  routeUrl, pageHeading, recordTable, accountTable, summarizeAccount, calculateControl, money,
  relatedIncidents: workflow => relatedIncidentSection({...incidentContext(), workflow}),
  incidentEvidenceText: workflow => relatedIncidentText({...incidentContext(), workflow})});
}
function incidentContext() {
 return {INCIDENTS, DATA, esc, link, option, routeUrl, pageHeading,
  query:incidentQuery, riskId:incidentRisk, limit:incidentLimit};
}
function updateReview(target) {
 const review = reviewById(route.params.get('id'));
 if (!review) return;
 const field = target.dataset.reviewField;
 if (field === 'workflow' && target.value !== review.workflow) {
  startReview(target.value);
  notify('New review created. The previous review is preserved.');
  return;
 }
 if (field) review[field] = target.value;
 else {
  const key = target.dataset.reviewCase ? 'caseIds' : 'accountIds';
  const id = target.dataset.reviewCase || target.dataset.reviewAccount;
  review[key] = review[key].filter(value => value !== id);
  if (target.checked) review[key].push(id);
 }
 saveReviews();
 if (field === 'workflow') { render(); return; }
 if ($('#review-gaps')) $('#review-gaps').innerHTML = reviewViews(review).gaps(review);
 if ($('#review-save-state')) $('#review-save-state').textContent = reviewStorageOk
  ? 'Saved in this browser.' : 'Browser storage unavailable. Export this brief to retain it.';
}
let route, currentAccountId = accounts.at(-1)?.id || '', sectorQuery='', controlQuery='',controlCategory='',controlLimit=30;
let selectedSector = '', selectedWorkflow = '';
let incidentQuery = '', incidentRisk = '', incidentLimit = 50;
let notificationTimer;
function notify(message) { $('#notice').textContent=message; $('#notice').classList.add('show'); clearTimeout(notificationTimer); notificationTimer=setTimeout(()=>$('#notice').classList.remove('show'),4200); }
function save() { try { localStorage.setItem(storageKey,JSON.stringify(accounts)); storageOk=true; } catch { storageOk=false; } }
function accountById(id) { return accounts.find(a=>a.id===id); }
function readRoute() { const [p,q='']=(location.hash.slice(1)||'/home').split('?'); return {page:p.slice(1),params:new URLSearchParams(q)}; }
function navigate(page,params={}) { location.hash=routeUrl(page,params); }
function rating(r) { return r ? `<span class="rating level-${Math.round(r.median)}">${r.median}/5 <span>${esc(Number.isInteger(r.median) ? vulnerabilityLabels[r.median-1] : `${vulnerabilityLabels[Math.floor(r.median)-1]}–${vulnerabilityLabels[Math.ceil(r.median)-1]}`)}</span></span>` : '<span class="muted">Not displayed</span>'; }
function bars(distribution) { return `<div class="distribution" aria-label="Rating distribution">${Object.entries(distribution).map(([n,p])=>`<span class="level-${n}" style="width:${100*p}%" title="Rating ${n}: ${(p*100).toFixed(1)}%"></span>`).join('')}</div>`; }
function riskTable(sector, risks=rankedRisks(DATA.risks,sector)) { return `<div class="table-scroll"><table><caption class="sr-only">MIT risk priorities for ${esc(sector.name)}</caption><thead><tr><th>MIT risk</th><th>Vulnerability</th><th>Respondents</th><th>Consensus</th></tr></thead><tbody>${risks.map(r=>{const v=r.sectors[sector.name];return `<tr><td><a href="${routeUrl('risk',{id:r.id,sector:sector.id})}"><span class="code">${r.id}</span> ${esc(r.name)}</a></td><td>${rating(v)}</td><td>${v?`n = ${v.count}`:'—'}</td><td>${v ? (v.consensus?'Yes':'No'):'—'}</td></tr>`;}).join('')}</tbody></table></div>`; }
function recordTable(cases, empty='No public case is linked to this sector in this selection.') { return cases.length ? `<div class="table-scroll"><table class="records-table"><thead><tr><th>Evidence record</th><th>Workflow</th><th>Financial consequence</th><th>Counting unit / exposure</th></tr></thead><tbody>${cases.map(c=>`<tr><td><a href="${routeUrl('case',{id:c.id})}">${esc(c.title)}</a><small>${esc(c.recordKind)} / ${esc(c.eventDate||c.publicationDate)}</small></td><td>${esc(c.workflow)}</td><td><strong>${c.financial.relation==='greater_than'?'&gt; ':''}${money(c.financial.amount,c.financial.currency)}</strong><small>${esc(c.financial.label)}</small></td><td>${esc(c.countingUnit)}<small>${esc(c.exposure.note)}</small></td></tr>`).join('')}</tbody></table></div>` : `<p class="empty-line">${esc(empty)}</p>`; }
function accountTable(list) { return list.length ? `<div class="table-scroll"><table><thead><tr><th>Loss account</th><th>Basis</th><th>Net accounted amount</th><th>Failed operations / 1,000</th></tr></thead><tbody>${list.map(a=>{const s=summarizeAccount(a);return `<tr><td><a href="${routeUrl('account',{id:a.id})}">${esc(a.title||'Untitled account')}</a><small>${esc(sectorById(a.sector)?.name||'Sector not selected')}</small></td><td>${esc(a.financialBasis||'realized loss')}</td><td>${s.complete?moneyCents(s.netCents,a.currency):'Incomplete account'}</td><td>${s.exposure.ratePer1000 == null ? 'Unavailable' : s.exposure.ratePer1000.toFixed(3)}</td></tr>`;}).join('')}</tbody></table></div>` : '<p class="empty-line">No local loss accounts yet.</p>'; }

function home() {
 const selection = resolveDecisionSelection(DATA.sectors, WORKFLOWS,
  new URLSearchParams({sector:selectedSector,workflow:selectedWorkflow}));
 selectedSector = selection.sector?.id || ''; selectedWorkflow = selection.workflow?.id || '';
 return `<div class="question-intro"><h1>Is this job worth delegating to an AI agent?</h1><p class="author-credit">Peter Vartanian, Casey Tewey &amp; Michael Wong</p>${delegationFormula()}<div class="question-context"><span>14 MIT study sectors</span><span>24 jobs</span><a href="#/incidents">${INCIDENTS.records.length.toLocaleString('en-US')} incident records</a></div></div>
 <section class="decision-explorer" aria-label="Choose the job"><div class="explorer-heading"><h2>Choose the job</h2><label class="sector-find"><span class="sr-only">Find a sector or NAICS industry</span><input id="sector-search" type="search" value="${esc(sectorQuery)}" placeholder="Find a sector or NAICS industry"></label></div>
 <div id="mosaic-results">${mosaic()}</div><div id="decision-workflows">${workspaceJobs()}</div></section>
 <p id="decision-selection-status" class="sr-only" role="status"></p>
 <div id="decision-answer" tabindex="-1">${workspaceAnswer()}</div>`;
}
function workspaceJobs() {
 const sector = sectorById(selectedSector);
 if (!sector) return '';
 const jobs = WORKFLOWS.filter(w => w.sector === sector.id);
 return `<div class="workspace-jobs"><div class="selected-sector"><span>Selected sector</span><h3>${esc(sector.name)}</h3></div><div class="job-options" role="group" aria-label="Jobs in ${esc(sector.name)}">${jobs.map(w=>`<button data-home-workflow="${w.id}" aria-pressed="${w.id===selectedWorkflow}">${esc(w.name)}</button>`).join('')}</div></div>`;
}
function workspaceAnswer() {
 return evidenceWorkflow({workflow:workflowById(selectedWorkflow),DATA,EVIDENCE,COMPARISONS,INVESTIGATIONS,HUMAN_TASKS,esc,params:route.params,
  renderQuantification:context=>quantificationView({...context,WAGES,EVIDENCE,quantifyWorkload,reproductionComparison}),
  renderIncident:context=>incidentInvestigation({...context,DATA,EVIDENCE,MAPPINGS:MAPPED_CONTROLS})});
}
function selectEvidence(key, value, view) {
 const allowed = ['view', 'study', 'metric', 'incident', 'risk', 'safeguard', 'control'];
 if (!allowed.includes(key)) return;
 const params = new URLSearchParams(route.params);
 params.set('sector', selectedSector); params.set('workflow', selectedWorkflow);
 params.set(key, value);
 if (view === 'failures') params.set('view', view);
 if (key === 'study') params.delete('metric');
 if (key === 'incident') { params.delete('safeguard'); params.delete('risk'); }
 if (key === 'risk') { params.delete('control'); params.delete('safeguard'); }
 history.pushState(null, '', `#/home?${params}`); route = readRoute();
 $('#decision-answer').innerHTML = workspaceAnswer();
 $('#decision-selection-status').textContent = 'Evidence updated.';
 const active = [...document.querySelectorAll('[data-evidence-key]')].find(button => button.dataset.evidenceKey === key && button.dataset.evidenceValue === value);
 if (key === 'view' || view === 'failures') { $('#decision-answer').scrollIntoView({block:'start'}); $('#decision-answer').focus({preventScroll:true}); }
 else active?.focus({preventScroll:true});
}
function selectWorkspace(sector, workflow, focus = 'sector') {
 const selection = resolveDecisionSelection(DATA.sectors,WORKFLOWS,new URLSearchParams({sector:sector||'',workflow:workflow||''}));
 selectedSector=selection.sector?.id||'';selectedWorkflow=selection.workflow?.id||'';
 history.pushState(null,'',routeUrl('home',{sector:selectedSector,workflow:selectedWorkflow}));route=readRoute();
 if(!$('#decision-answer')){render();return;}
 $('#mosaic-results').innerHTML=mosaic();$('#decision-workflows').innerHTML=workspaceJobs();$('#decision-answer').innerHTML=workspaceAnswer();
 $('#decision-selection-status').textContent=`${selection.sector.name}: ${selection.workflow.name}. Assessment updated.`;
 const target=focus==='job'?document.querySelector(`[data-home-workflow="${selectedWorkflow}"]`):document.querySelector(`[data-select-sector="${selectedSector}"]`);
 target?.focus({preventScroll:true});fitMosaicLabels();
}
// Compact labels are display aliases only. Accessible names and selections
// always retain the complete names from the shared taxonomy.
const compactSectorLabels = {
 agriculture: 'Agriculture & industry', trade: 'Trade, transport & utilities',
 information: 'Information', finance: 'Finance & insurance',
 'real-estate': 'Real estate & rentals', professional: 'Professional & technical',
 research: 'Research & development', management: 'Management & support',
 education: 'Education', healthcare: 'Health & social care', arts: 'Arts & recreation',
 hospitality: 'Food & other services', 'public-admin': 'Public administration',
 'national-security': 'National security',
};
// Areas deliberately emphasize the study ranking. Source scores stay unchanged.
function mosaic() {
 const q=sectorQuery.toLowerCase().trim();
 const naics=q?DATA.naics.filter(n=>`${n.Code} ${n.Title}`.toLowerCase().includes(q)):[];
 const matches=new Set(naics.flatMap(n=>naicsSectors(n.Code,DATA)));
 const visible=new Set(DATA.sectors.filter(s=>!q||`${s.name} ${s.definition} ${s.examples}`.toLowerCase().includes(q)||matches.has(s.id)).map(s=>s.id));
 const emphasis=priorityEmphasisWeights(SECTOR_PRIORITIES.sectors);
 const layouts={desktop:priorityTessellation(emphasis.items,{aspectRatio:4.3}).cells,tablet:priorityTessellation(emphasis.items,{aspectRatio:2.4}).cells,mobile:priorityTessellation(emphasis.items,{aspectRatio:0.6}).cells};
 const regions=emphasis.items.map(item=>{
  const tile=MOSAIC.find(t=>t.sector===item.id),sector=sectorById(item.id),dimmed=!visible.has(item.id);
  const geometry=Object.entries(layouts).map(([layout,cells])=>['left','top','width','height','clip','labelX','labelY','labelWidth','labelHeight'].map(key=>`--${layout}-${key}:${cells[item.id][key]}${key==='clip'?'':'%'}`).join(';')).join(';');
  return `<button class="ac-atlas-region ${dimmed?'is-dimmed':''}" data-select-sector="${item.id}" data-priority="${item.weight}" data-vulnerability="${item.score}" aria-label="${esc(sector.name)}" title="${esc(sector.name)} — MIT vulnerability ${item.score.toFixed(2)}/5" aria-pressed="${selectedSector===item.id}" aria-controls="decision-answer" ${dimmed?'disabled':''} style="--sector-color:${tile.color};--sector-tint:${tile.tint};${geometry}"><span class="ac-atlas-region-label"><svg class="ac-atlas-icon" viewBox="0 0 32 32" aria-hidden="true">${tile.iconPaths.map(path=>`<path d="${path}" />`).join('')}</svg><span class="ac-atlas-name">${esc(sector.name)}</span></span></button>`;
 }).join('');
 return `<div class="atlas-container"><div class="ac-atlas-map priority-mosaic" role="group" aria-label="MIT study sectors" aria-describedby="mosaic-key">${regions}</div></div>
 <div class="mosaic-footer"><span id="mosaic-key" class="sr-only">Tile areas emphasize the MIT study’s sector ranking. Open the notes for sources and sizing.</span><button class="annotation-marker" type="button" data-mosaic-note="sources" aria-label="* Research and taxonomy" aria-haspopup="dialog" aria-controls="mosaic-note">*</button><button class="annotation-marker" type="button" data-mosaic-note="sizing" aria-label="** How tiles are sized" aria-haspopup="dialog" aria-controls="mosaic-note">**</button></div>
 ${q?`<p class="source-note" role="status">${visible.size} matching ${visible.size===1?'sector':'sectors'}${naics.length?` / ${naics.length} NAICS entries`:''}. All 14 sectors retain their size.</p>`:''}`;
}
function fitMosaicLabels() {
 requestAnimationFrame(()=>{
  document.querySelectorAll('.ac-atlas-region-label').forEach(label=>{
   const region=label.closest('[data-priority]');
   const icon=label.querySelector('.ac-atlas-icon'),name=label.querySelector('.ac-atlas-name');
   const priority=Number(region.dataset.priority),initial=window.innerWidth<=650?12:priority>=4?14:12;
   let size=initial;
   name.textContent=region.getAttribute('aria-label');
   icon.style.display=priority<=2?'none':'';
   const fits=()=>name.getBoundingClientRect().height+(icon.style.display==='none'?0:icon.getBoundingClientRect().height+5)<=label.clientHeight&&name.scrollWidth<=label.clientWidth+1;
   const shrink=minimum=>{label.style.fontSize=`${size}px`;while(size>minimum&&!fits()){size-=0.5;label.style.fontSize=`${size}px`;}};
   shrink(11);
   if(!fits()){icon.style.display='none';size=initial;shrink(11);}
   if(!fits()){name.textContent=compactSectorLabels[region.dataset.selectSector];size=initial;shrink(10);}
  });
 });
}

function sectorPage(s) {
 const ws=WORKFLOWS.filter(w=>w.sector===s.id);
 return `${breadcrumb([s.name])}${pageHeading(s.name,s.definition)}<p class="taxonomy-line"><strong>NAICS 2022:</strong> ${s.naics.join(', ')} <span>${esc(s.examples)}</span></p>
 <section><div class="section-head"><h2>Delegated workflows</h2><span class="muted">Operational applications of the MIT taxonomy</span></div><div class="workflow-grid">${ws.map(w=>`<a class="workflow-card" href="${routeUrl('workflow',{id:w.id})}"><span class="eyebrow">${esc(w.countingUnit)}</span><h3>${esc(w.name)} <span aria-hidden="true">→</span></h3><p>${esc(w.task)}</p><div class="mini-codes">${w.riskIds.map(id=>`<span>${esc(id)}</span>`).join('')}</div></a>`).join('')}</div></section>
 <section><div class="section-head"><h2>Loss evidence</h2><button data-new-account data-sector="${s.id}">Add loss account</button></div>${recordTable(casesForSector(s.id))}${accounts.some(a=>a.sector===s.id)?accountTable(accounts.filter(a=>a.sector===s.id)):''}</section>
 <section><div class="section-head"><h2>MIT priority profile</h2><a href="${routeUrl('matrix',{sector:s.id})}">Compare sectors</a></div>${studyNote}${riskTable(s)}</section>`;
}
function controlsForWorkflow(w) {
 return w.controls.map(item=>{const c=controlById(item.id);if(!c)return '';return `<article class="control-card"><p class="eyebrow">${esc(c.category)} ${esc(categoryById(c.category)?.Name)}</p><h3>${esc(c.name)}</h3><p>${esc(item.rationale)}</p><p class="evidence-prompt"><strong>Evidence to inspect:</strong> ${esc(item.evidenceNeeded)}</p><details><summary>MIT source entry</summary><p>${esc(c.definition)}</p><p class="source-note">${esc(c.source)} / ${esc(c.id)}</p></details></article>`;}).join('');
}
function workflowPage(w) {
 const s=sectorById(w.sector),cs=workflowCases(w);
 return `${breadcrumb([s.name,routeUrl('sector',{sector:s.id})],[w.name])}${pageHeading(w.name,w.task,`<button class="primary" data-new-review data-workflow="${w.id}">Assess this job</button><button data-new-account data-workflow="${w.id}">Create loss account</button>`)}
 <div class="workflow-summary"><div><span class="eyebrow">Failure to investigate</span><p>${esc(w.failure)}</p></div><div><span class="eyebrow">Proposed exposure unit</span><p>${esc(w.countingUnit)}</p></div></div>
 <div class="risk-tags">${w.riskIds.map(id=>riskLink(id,s.id)).join('')}</div>
 <nav class="section-nav" aria-label="Workflow sections"><a href="#evidence" data-scroll="evidence">Evidence & loss</a><a href="#comparison" data-scroll="comparison">Human comparison</a><a href="#controls" data-scroll="controls">Controls</a><a href="#priorities" data-scroll="priorities">MIT priorities</a></nav>
 <section id="evidence"><h2>Evidence and loss</h2>${cs.length?'<p class="compact muted">Related sector evidence with overlapping risk tags. Check the task and authority before transferring a lesson.</p>':''}${recordTable(cs,'No observed case has been linked to this workflow. The proposed failure above is a review question, not an occurrence claim.')}${accountTable(accounts.filter(a=>a.workflow===w.id))}</section>
 <section id="comparison"><h2>Human workflow comparison</h2><div class="comparison-grid"><div><h3>Human task</h3><p>${esc(w.humanComparison.task)}</p></div><div><h3>What delegation changes</h3><p>${esc(w.humanComparison.difference)}</p></div><div><h3>Evidence needed for a fair comparison</h3><p>${esc(w.humanComparison.evidenceNeeded)}</p></div></div><p class="source-note">This is a task crosswalk. No matched human-versus-agent loss ratio has been established in the bundled evidence.</p></section>
 <section id="controls"><div class="section-head"><h2>Controls to investigate</h2><a href="#/controls">Search all 831 MIT entries</a></div><div class="control-grid">${controlsForWorkflow(w)}</div><p class="source-note">Case-to-control links are Agency Costs analysis. The MIT source provides the control text, not an estimated reduction in this workflow’s losses.</p></section>
 <section id="priorities"><h2>Related MIT priorities for this sector</h2>${studyNote}${riskTable(s,w.riskIds.map(riskById))}</section>`;
}
function casePage(c) {
 const s=sectorById(c.sectorId);
 return `${breadcrumb([s.name,routeUrl('sector',{sector:s.id})],[c.title])}${pageHeading(c.title,c.workflow,`<button class="primary" data-new-account data-case="${c.id}">Open a loss account</button>`)}
 <p class="eyebrow">${esc(c.recordKind)} / ${esc(c.eventDate||c.publicationDate)}</p><p class="lead">${esc(c.summary)}</p><div class="risk-tags">${c.riskIds.map(id=>riskLink(id,s.id)).join('')}</div>
 <div class="two-column"><section class="panel"><h2>Financial consequence</h2><div class="big-value">${c.financial.relation==='greater_than'?'&gt; ':''}${money(c.financial.amount,c.financial.currency)}</div><p><strong>${esc(c.financial.label)}</strong></p><p>${esc(c.financial.note)}</p>${c.financial.components?.length?`<ul>${c.financial.components.map(p=>`<li>${esc(p.label||p.name)}: ${money(p.amount,c.financial.currency)}</li>`).join('')}</ul>`:''}</section><section class="panel"><h2>What is counted?</h2><dl><dt>Evidence unit</dt><dd>${esc(c.countingUnit)}</dd><dt>Exposure</dt><dd>${esc(c.exposure.note)}</dd><dt>Failure rate</dt><dd>Unavailable without matched opportunities</dd><dt>Evidence status</dt><dd>${esc(c.evidenceStatus)}</dd></dl></section></div>
 <section><h2>Questions before using this record</h2><ul class="questions">${c.questions.map(q=>`<li>${esc(q)}</li>`).join('')}</ul></section>
 <section><h2>Sources</h2><ul class="source-list">${c.sources.map(p=>`<li>${link(p.url,p.title)}<small>${esc(p.publisher)} / ${esc(p.kind)}</small></li>`).join('')}</ul></section>
 <section><h2>Related workflows to inspect</h2><div class="workflow-grid">${WORKFLOWS.filter(w=>w.sector===s.id&&w.riskIds.some(id=>c.riskIds.includes(id))).map(w=>`<a class="workflow-card" href="${routeUrl('workflow',{id:w.id})}"><h3>${esc(w.name)}</h3><p>${esc(w.task)}</p></a>`).join('')}</div></section>`;
}
function recordsPage() { return `${pageHeading('Loss & severity','Inspect each event, amount, counting unit and consequence.',`<label class="button">Import account<input type="file" id="import-account" accept="application/json,.json" class="sr-only"></label><button class="primary" data-new-account>Add loss account</button>`)}<section><h2>Public evidence</h2>${recordTable(EVIDENCE.cases)}<p class="source-note">Amounts retain their source currency and basis. Awards, realized losses and historical automation comparators are not pooled.</p></section><section><h2>Your loss accounts</h2>${accountTable(accounts)}<p class="source-note">${storageOk?'Saved on this browser. Export to carry an account between devices.':'Browser storage is unavailable. Export your account to keep it.'}</p></section><section><h2>MIT severity scenarios</h2><p>Explore the study-wide expected severity distributions for 2025–2030. These describe expert expectations for broad risks, not the financial severity of a particular loss account.</p><div class="risk-tags">${DATA.risks.map(r=>riskLink(r.id,'finance')).join('')}</div></section>`; }
function input(label,field,value,type='text',extra='') { return `<label>${esc(label)}<input data-account-field="${field}" type="${type}" value="${esc(value)}" ${extra}></label>`; }
function textarea(label,field,value) { return `<label>${esc(label)}<textarea data-account-field="${field}" rows="3">${esc(value)}</textarea></label>`; }
function accountPage(a) {
 currentAccountId=a.id;const w=workflowById(a.workflow),s=sectorById(a.sector);
 return `${breadcrumb([s?.name||'Loss evidence',s?routeUrl('sector',{sector:s.id}):'#/records'],[a.title||'Loss account'])}${pageHeading(a.title||'Loss account','Reconcile the loss, establish exposure and appraise the controls.',`<button data-export="json">Export JSON</button><button data-export="md">Export note</button><button data-print>Print</button>`)}
 <p class="source-note" id="save-state">${storageOk?'Saved on this browser':'Storage unavailable; export to retain this account'}. ${a.recordKind==='user-entered'?'User-entered evidence.':''}</p>
 <div class="account-layout"><div><section><h2>1. Event and evidence</h2><div class="form-grid">${input('Account title','title',a.title)}<label>Sector<select data-account-field="sector">${option('','Select sector',a.sector)}${sectorOptions(a.sector)}</select></label>${input('Event date','eventDate',a.eventDate,'date')}${input('Account as of','asOf',a.asOf,'date')}${textarea('Source URLs or evidence references','source',a.source)}<label>Financial basis<select data-account-field="financialBasis">${['realized loss','ordered award','estimate','scenario'].map(v=>option(v,v,a.financialBasis)).join('')}</select></label></div>${textarea('What happened?','event',a.event)}${textarea('Agent authority and permissions','authority',a.authority)}${textarea('Outcome and nonfinancial harm','outcome',a.outcome)}</section>
 <section><h2>2. Loss account</h2><p class="compact">Enter amounts in one currency. A blank means unknown; enter 0 only when absence of that cost is established.</p><div class="form-grid"><label>Currency<select data-account-field="currency">${['USD','CAD','GBP','EUR','AUD'].map(v=>option(v,v,a.currency)).join('')}</select></label>${[['Direct loss','direct'],['Response and remediation','response'],['Business interruption','interruption'],['Third-party liability','thirdParty'],['Recoveries','recovered']].map(([l,k])=>input(l,`losses.${k}`,a.losses[k],'number','min="0" step="0.01" inputmode="decimal"')).join('')}</div><div id="loss-summary">${accountSummary(a)}</div></section>
 <section><h2>3. Exposure and counting unit</h2><p class="compact">Count failed operations against all eligible operations in the same population and period. Keep source reports, incidents, operations and claims separate.</p><div class="form-grid">${input('Failed operations','exposure.failures',a.exposure.failures,'number','min="0" step="1"')}${input('Eligible operations','exposure.opportunities',a.exposure.opportunities,'number','min="1" step="1"')}${input('What counts as one operation?','exposure.unit',a.exposure.unit)}${input('Population, system/version and exclusions','exposure.population',a.exposure.population)}${input('Period start','exposure.start',a.exposure.start,'date')}${input('Period end','exposure.end',a.exposure.end,'date')}</div><label class="check"><input type="checkbox" data-account-field="exposure.matched" ${a.exposure.matched?'checked':''}> Evidence establishes matching outcomes, opportunities, population and period</label><div id="exposure-summary">${exposureSummary(a)}</div></section>
 <section><h2>4. Human comparison</h2>${w?`<p><strong>Human task:</strong> ${esc(w.humanComparison.task)}</p><p><strong>Changed by delegation:</strong> ${esc(w.humanComparison.difference)}</p><p><strong>Evidence required:</strong> ${esc(w.humanComparison.evidenceNeeded)}</p>`:'<p>Record the comparable human task, permissions, period, exposure and financial basis.</p>'}${textarea('Comparison evidence and limitations','notes',a.notes)}</section>
 <section><div class="section-head"><h2>5. Control appraisal</h2><a href="#/controls">Add MIT controls</a></div><div id="appraisals">${appraisals(a)}</div></section></div>
 <aside><div class="sticky-panel"><h3>Account context</h3><p>${esc(s?.name||'Select a sector')}</p>${w?`<a href="${routeUrl('workflow',{id:w.id})}">${esc(w.name)}</a>`:''}<h3>MIT risk coding</h3><div class="risk-tags">${a.risks.map(id=>riskLink(id,a.sector)).join('')||'<p>Choose a workflow to start from its risk coding.</p>'}</div><p class="source-note">MIT sector ratings provide context. They do not determine this account’s loss or failure rate.</p></div></aside></div>`;
}
function accountSummary(a) {const s=summarizeAccount(a),errors=Object.values(s.errors);return `<div class="calculation"><span>${s.complete?(a.financialBasis==='realized loss'?'Net loss':`Net accounted amount (${esc(a.financialBasis)})`):'Known cost subtotal'}</span><strong>${s.knownCostCount ? moneyCents(s.complete?s.netCents:s.knownGrossCents,a.currency) : 'Not recorded'}</strong><p>${s.complete?'Direct + response + interruption + third-party liability − recoveries.':`${s.missing.length?`Unknown components: ${s.missing.join(', ')}.`:'Correct the invalid components below.'} No complete net loss is calculated.`}</p>${errors.map(e=>`<p class="error">${esc(e)}</p>`).join('')}</div>`;}
function exposureSummary(a) {const e=summarizeAccount(a).exposure;return `<div class="calculation"><span>Failed operations per 1,000</span><strong>${e.ratePer1000==null?'Unavailable':e.ratePer1000.toFixed(3)}</strong><p>${e.ratePer1000==null?esc(e.explanation):'Failed operations ÷ eligible operations × 1,000. This sample may not generalize.'}</p>${Object.values(e.errors).map(x=>`<p class="error">${esc(x)}</p>`).join('')}</div>`;}
function controlResult(p,currency) {const r=calculateControl(p),errors=Object.values(r.errors);return `<p class="control-math">${errors.length?esc(errors.join(' ')):r.netAnnualBenefit==null?'Enter your annual baseline, assumed reduction and control cost to calculate a scenario.':`Scenario net benefit: ${money(r.netAnnualBenefit,currency)} per year. Break-even reduction: ${r.breakEvenReductionPct==null?'unavailable':`${r.breakEvenReductionPct.toFixed(1)}%`}.`}</p>`;}
function appraisals(a) {return a.appraisals?.length?a.appraisals.map((p,i)=>{const c=controlById(p.controlId);if(!c)return '';return `<article class="appraisal"><div class="section-head"><h3>${esc(c.name)}</h3><button class="quiet" data-remove-control="${esc(c.id)}">Remove</button></div><p class="eyebrow">${esc(c.category)} ${esc(categoryById(c.category)?.Name)}</p><p>${esc(c.definition)}</p><div class="form-grid"><label>Decision<select data-appraisal="${i}" data-field="decision">${['Investigate','Keep','Improve','Retire'].map(v=>option(v,v,p.decision)).join('')}</select></label><label>Annual baseline loss (${a.currency})<input type="number" min="0" step="0.01" data-appraisal="${i}" data-field="baselineLoss" value="${esc(p.baselineLoss)}"></label><label>Assumed loss reduction (%)<input type="number" min="0" max="100" step="0.1" data-appraisal="${i}" data-field="reductionPct" value="${esc(p.reductionPct)}"></label><label>Annual control cost (${a.currency})<input type="number" min="0" step="0.01" data-appraisal="${i}" data-field="annualCost" value="${esc(p.annualCost)}"></label></div><label>Evidence and reason for decision<textarea data-appraisal="${i}" data-field="evidence" rows="2">${esc(p.evidence)}</textarea></label><div data-control-result="${i}">${controlResult(p,a.currency)}</div><small>Scenario using your assumptions. MIT does not estimate these effect sizes. Source: ${esc(c.source)}.</small></article>`;}).join(''):'<p class="empty-line">No control selected. <a href="#/controls">Search the MIT mitigation entries.</a></p>';}

function riskSourceEvidence(risk, sector) {
 const entries = RISK_EVIDENCE.records.filter(record=>record.riskId===risk.id);
 const selected = entries.find(record=>record.key===route.params.get('entry')) || entries[0];
 if (!selected) return '<p class="source-note">No underlying source entry maps exactly to this risk.</p>';
 const url = key => routeUrl('risk',{id:risk.id,sector:sector.id,entry:key});
 return `<section class="risk-source-evidence"><h2>Underlying source evidence</h2><p class="source-note">${entries.length} source entries mapped to this MIT risk. A framework statement is not an observed incident.</p><div class="risk-source-layout"><nav aria-label="Risk source entries">${entries.map(entry=>`<a href="${url(entry.key)}" ${entry.key===selected.key?'aria-current="true"':''}>${esc(entry.title || entry.sourceTitle)}<small>${esc(entry.sourcePaper)}</small></a>`).join('')}</nav><article><h3>${esc(selected.title)}</h3><p>${esc(selected.description)}</p>${(selected.evidence||[]).slice(0,2).map(item=>`<blockquote>${esc(item.text)}${item.page?`<cite>Page ${esc(item.page)}</cite>`:''}</blockquote>`).join('')}<p>${link(selected.sourceUrl,selected.sourceTitle || selected.sourcePaper)}${selected.definitionPage?` / page ${esc(selected.definitionPage)}`:''}</p><p class="source-note">Source record ${esc(selected.id)}. The mapping is supplied by the MIT Navigator.</p></article></div></section>`;
}
function riskPage(r,s) {
 return `${breadcrumb([s.name,routeUrl('sector',{sector:s.id})],[`${r.id} ${r.name}`])}${pageHeading(`${r.id} ${r.name}`,r.definition)}<label class="inline-select">Sector<select id="risk-sector">${sectorOptions(s.id)}</select></label>${riskSourceEvidence(r,s)}<section><h2>Sector vulnerability</h2>${rating(r.sectors[s.name])}${r.sectors[s.name]?`<p>n = ${r.sectors[s.name].count}. ${r.sectors[s.name].consensus?'Consensus':'No consensus'} in the study.</p>${bars(r.sectors[s.name].distribution)}`:''}${studyNote}</section>
 <section><h2>Expected severity, 2025–2030</h2><p class="compact">Study-wide distributions across scenarios, not sector loss estimates. n = ${r.severityN}.</p><div class="table-scroll"><table><thead><tr><th>Outcome</th><th>Business as usual</th><th>Pragmatic mitigation</th></tr></thead><tbody>${severityKeys.map(k=>`<tr><td>${k[0].toUpperCase()+k.slice(1)}</td><td>${r.severity.bau[k].toFixed(1)}%</td><td>${r.severity.mitigated[k].toFixed(1)}%</td></tr>`).join('')}</tbody></table></div></section>
 <section><h2>Actor vulnerability and responsibility</h2><div class="table-scroll"><table><thead><tr><th>Actor</th><th>Vulnerability median</th><th>n</th><th>Responsibility median</th><th>n</th></tr></thead><tbody>${DATA.actors.filter(a=>a.studyKey).map(a=>{const v=r.vulnerability[a.studyKey],p=r.responsibility[a.studyKey];return `<tr><td>${esc(a['Actor Name'])}</td><td>${v?`${v.median}/5`:'Not displayed'}</td><td>${v?.count??'—'}</td><td>${p?`${p.median}/5`:'Not displayed'}</td><td>${p?.count??'—'}</td></tr>`;}).join('')}</tbody></table></div><p class="source-note">Vulnerability ranges from not at all to extreme; responsibility ranges from not at all to primary. Canonical actor names follow the shared Airtable taxonomy.</p></section>
 <section><h2>Related workflows</h2><div class="workflow-grid">${WORKFLOWS.filter(w=>w.riskIds.includes(r.id)&&w.sector===s.id).map(w=>`<a class="workflow-card" href="${routeUrl('workflow',{id:w.id})}"><h3>${esc(w.name)}</h3><p>${esc(w.task)}</p></a>`).join('')||'<p>No proposed workflow is currently tagged to this risk in the selected sector.</p>'}</div></section>`;
}
function matrixPage() {return `${pageHeading('Compare sectors','MIT median vulnerability ratings for every published sector–risk assessment.')}<div class="legend">${vulnerabilityLabels.map((l,i)=>`<span><i class="level-${i+1}"></i>${i+1} ${l}</span>`).join('')}</div><div class="table-scroll matrix"><table><thead><tr><th>MIT risk</th>${DATA.sectors.map(s=>`<th><a href="${routeUrl('sector',{sector:s.id})}">${esc(s.name)}</a></th>`).join('')}</tr></thead><tbody>${DATA.risks.map(r=>`<tr><th>${r.id} ${esc(r.name)}</th>${DATA.sectors.map(s=>{const v=r.sectors[s.name];return `<td class="shade-${v?Math.round(v.median):0}"><a href="${routeUrl('risk',{id:r.id,sector:s.id})}" aria-label="${esc(r.name)} in ${esc(s.name)}, ${v?`${v.median} of 5`:'not displayed'}">${v?.median??'—'}<small>${v?`n=${v.count}`:''}</small></a></td>`;}).join('')}</tr>`).join('')}</tbody></table></div>${studyNote}<p class="source-note">AI welfare and rights has no sector ratings in the published view. Missing does not mean zero.</p>`;}
function controlsPage() {
 return `${pageHeading('Controls & value','831 MIT mitigation entries, with control appraisal in your loss accounts.')}<div class="toolbar"><label class="grow">Search controls<input type="search" id="control-search" value="${esc(controlQuery)}" placeholder="Permissions, testing, monitoring…"></label><label>MIT category<select id="control-category">${option('','All categories',controlCategory)}${DATA.taxonomy.mitigations.filter(c=>c.Parent).map(c=>option(c.Code,`${c.Code} ${c.Name}`,controlCategory)).join('')}</select></label></div>${accounts.length?`<label class="inline-select">Add controls to<select id="active-account">${accounts.map(a=>option(a.id,a.title||'Untitled account',currentAccountId)).join('')}</select></label>`:'<p class="source-note"><a href="#/home">Choose a sector and workflow</a> to create a loss account, then compare annual control cost with the loss reduction assumed in your scenario.</p>'}<div id="control-results">${controlResults()}</div>`;
}
function controlResults() {const q=controlQuery.toLowerCase();const list=DATA.mitigations.filter(c=>(!controlCategory||c.category===controlCategory)&&`${c.name} ${c.definition} ${c.source}`.toLowerCase().includes(q));const a=accountById(currentAccountId);return `<p class="results-count">${list.length} matching entries</p><div class="control-list">${list.slice(0,controlLimit).map(c=>`<article class="control-card"><div class="section-head"><div><p class="eyebrow">${esc(c.category)} ${esc(categoryById(c.category)?.Name)}</p><h3>${esc(c.name)}</h3></div>${a?`<button data-add-control="${esc(c.id)}" ${a.controls.includes(c.id)?'disabled':''}>${a.controls.includes(c.id)?'Added':'Add to account'}</button>`:''}</div><p>${esc(c.definition||'No description supplied in the source entry.')}</p><small>${esc(c.source)} / ${esc(c.id)}</small></article>`).join('')}</div>${list.length>controlLimit?'<button id="more-controls">Show 30 more</button>':''}`;}
function newEvidenceSources() {
 return `<h2>Human–AI comparisons</h2><p>Three task-matched studies now supply measured outcomes. Job mappings are Agency Costs analysis. Adjacent studies are not treated as matched experiments. No study supplies a complete net-benefit or insurance-price estimate.</p>${COMPARISONS.records.filter(study=>study.workflowIds.length).map(study=>`<article class="source-study"><h3>${esc(study.title)}</h3><p>${esc(study.design)} ${esc(study.setting)}</p><p>${esc(study.access.rawData)}. ${esc(study.access.license)}</p><ul>${study.limitations.map(item=>`<li>${esc(item)}</li>`).join('')}</ul>${study.metrics.map(metric=>`<p><strong>${esc(metric.label)}:</strong> ${esc(metric.basis)} ${esc(metric.provenance || '')}${metric.effect?.ciMethod?` ${esc(metric.effect.ciMethod)}`:''}</p>`).join('')}<p>${study.sources.map(item=>link(item.url,item.title)).join(' / ')}</p></article>`).join('')}<h2>Human task definitions</h2><p>${esc(HUMAN_TASKS.attribution)}</p><p>${esc(HUMAN_TASKS.note)} ${link(HUMAN_TASKS.licenseUrl,'License')}</p><h2>Recovered MIT source evidence</h2><p>${RISK_EVIDENCE.records.length.toLocaleString('en-US')} risk-source rows from the Navigator connect taxonomy categories to their framework definitions and cited passages. Duplicate source IDs retain separate stable row keys. Domain-only codes are not forced into a subdomain; missing source URLs remain unavailable.</p><h2>Mapped mitigation actions</h2><p>${MAPPED_CONTROLS.controls.length.toLocaleString('en-US')} source-linked action records from ${MAPPED_CONTROLS.source.sourceCount} sources carry risk, actor, lifecycle and parent/child mappings. They are not ${MAPPED_CONTROLS.controls.length.toLocaleString('en-US')} independent safeguards. ${MAPPED_CONTROLS.source.parentRecordCount} parent records and repeated definitions remain identifiable. Classification provenance covers source taxonomy coding; it does not establish human validation of every mapping or control effectiveness.</p><p>Case-to-control links are analyst judgments. Neither cost nor measured efficacy is supplied. ${link(MAPPED_CONTROLS.source.overviewUrl,'MIT mitigation repository')}</p><h2>Incident investigations</h2><p>Three task-linked investigations use public primary sources. Replit and Cursor mechanisms were checked against company accounts. Air Canada retains the checked tribunal amount. Task and safeguard links are Agency Costs analysis, and financial displays use only the separately curated record. No matched exposure denominators are supplied.</p>`;
}
function sourcesPage() {return `${pageHeading('Sources and methods','The research foundation and the evidence behind each result.')}<div class="prose"><p><a href="#/formula">The AI-to-human cost comparison</a> explains how to compare equivalent work and the evidence needed for total costs.</p>${newEvidenceSources()}<h2>Shared taxonomy</h2><p>Sector names, definitions and NAICS links come from ${link('https://airtable.com/appu8mul8OVahwr3P','Simon’s Airtable source of truth')}, captured 1 October 2026. The 14 study sectors group NAICS 2022 industries; research and development is separated from the other professional services. NAICS lookup uses the most specific mapped ancestor.</p><h2>MIT priority study</h2><p>${link('https://airisk.mit.edu/priorities','MIT AI Risk Priorities')} includes 272 experts and 24 risk categories. This app preserves all 322 displayed sector ratings, sample sizes and consensus flags. ${link('https://arxiv.org/abs/2606.04490','Study paper')}.</p><p>Vulnerability ratings are expert judgments. They cannot supply incident frequencies, insurance prices or monetary losses. The severity scenarios are study-wide. The public visualizer omits AI welfare sector and actor ratings; those individual cells remain marked as not displayed here.</p><h2>Mosaic weighting</h2><p>The 14 sectors are ordered by the June 2026 paper’s aggregate vulnerability scores. We reproduced Figure 3’s original ${link("https://osf.io/download/6d58m/","published analysis")}: the mean of each risk-sector response distribution, weighted by its valid response count, across all 24 risks. The original analysis includes AI welfare in the sector aggregate before omitting its row from the displayed heatmap. Rating counts are repeated judgments, not unique experts.</p><p>The mosaic uses editorial display-emphasis bands: ranks 1–3, 4–7, 8–10, 11–12 and 13–14 receive area weights of 5, 4, 3, 2 and 1. Equal scores share the earliest occupied rank and the same area. The largest tiles therefore have five times the area of the smallest; this is a design choice, not a fivefold difference in measured danger, urgency or expected loss. The original 1–5 scores remain unchanged and appear on hover. Search highlights matching categories without resizing them. The live MIT visualizer uses a different summary (agreement-weighted medians over displayed risks); we reproduce the paper’s method for the sector ordering.</p><h2>MIT Mitigation Map</h2><p>The ${link('https://airisk.mit.edu/ai-risk-mitigations','Mitigation Map')} dataset dated 23 July 2025 contains 831 entries from 13 frameworks, classified under the taxonomy in the shared base. The legacy account editor retains that snapshot. The investigation workflow uses the separately versioned Navigator mappings described above; the two corpora are not added together. The original source framework is retained on every entry.</p><h2>Workflows, public cases and losses</h2><p>Workflows and their risk/control links are proposed Agency Costs applications of the MIT framework. They are not workflow findings published by the Delphi study. Public evidence records link to their original sources. A vendor account, a tribunal award and an older automation incident have different evidential and financial meanings.</p><p>All preloaded cases are public evidence; no Keythorn pilot claims were supplied in the reviewed materials. The old illustrative records are excluded. Public case counts are a selected collection and have no exposure denominator.</p><h2>Public incident collection</h2><p>The ${link("https://incidentdatabase.ai/research/snapshots/","AI Incident Database export")} of 28 September 2026 supplies ${INCIDENTS.records.length.toLocaleString("en-US")} incident metadata records. ${INCIDENTS.metadata.mappedRiskRecordCount.toLocaleString("en-US")} map to a canonical MIT risk subdomain; original source labels are preserved. The ${link("https://creativecommons.org/licenses/by-sa/4.0/","CC BY-SA 4.0")} attribution belongs to the Responsible AI Collaborative. Only metadata and source classifications are bundled, without article text or media. <a href="#/incidents">Search the collection</a></p><p>One source incident ID is one library record. Reports are associated documents, not additional events. Source classifications have not been independently validated here. Risk-label matches identify candidates for review; they do not establish a shared workflow, sector, loss or failure rate. No MIT sector is inferred from the source’s separate CSET/ISIC fields. The library documents its exact privacy-label crosswalk.</p><h2>Quantification in the job workflow</h2><p>Agency Costs converts supported study effects into a fixed workload requiring 100 human hours. METR’s implementation-time ratio multiplies that reference; the support study’s throughput ratio divides it. These are derived workload equivalents, not 100 hours observed in either study. Both studies concern people using AI assistance, not autonomous replacements.</p><p>Wage equivalents use ${link(WAGES.source.releaseUrl,'BLS May 2025 national median hourly wages')}, released 15 May 2026: USD 65.38 for software developers and USD 29.74 for computer user support specialists. The occupation links follow the O*NET task crosswalk. US benchmark wages are not the original participants’ pay and exclude benefits and overhead. Research success counts are not converted into money because matched total-time and cost data are missing.</p><p>Freed capacity has economic value only when the study effect transfers and the time is productively reused or costs are avoided. Tools, setup, additional oversight and incremental losses remain unpriced. METR’s displayed interval transforms the study’s 95% interval at a fixed wage; it does not capture wage or applicability uncertainty. Incident amounts retain their source currency and status and are not subtracted from the wage scenario. MIT ratings never become probabilities, expected losses or premiums.</p><h2>Counting and calculations</h2><p>A public record counts one documented episode. A loss account records direct loss, response, interruption, third-party liability and recoveries in a single currency. A blank amount is unknown. Net loss is calculated only with all components stated and valid; otherwise the app shows a known cost subtotal.</p><p>Failure rates require eligible operations and failed operations from the same defined population and period. The user must establish this match; the app cannot verify the underlying evidence. An ordered award does not demonstrate payment. Source currencies are never silently converted.</p><p>Control scenarios calculate annual baseline loss × assumed loss reduction − annual control cost. Break-even reduction is annual control cost ÷ baseline loss. Inputs are user assumptions, not MIT effectiveness estimates.</p><h2>Automatic assessments and local records</h2><p>Choose a job to assemble a sourced assessment from the bundled MIT research, linked public cases and any matching local loss accounts. This is an offline evidence synthesis, not a live search or a trained prediction model. No matched benefit-and-total-cost dataset is supplied, so it cannot yet establish the net value of delegation.</p><h2>Optional review records</h2><p>Workflow reviews record your scope, evidence, decision, conditions and next measurement. They save in this browser and export a Markdown brief, with selected public records and loss accounts kept separate. Decisions are entered by the reviewer; they are not inferred from MIT ratings or form completeness.</p><p>Accounts save in this browser and can be exported as JSON or Markdown. Import restores a validated JSON account as a separate local copy. No account content is sent to a service. The app also works as a standalone HTML file.</p><h2>Attribution</h2><p>Agency Costs: Peter Vartanian, Casey Tewey and Michael Wong.</p><p>MIT research data is attributed under CC BY 4.0. Agency Costs is a Keythorn adaptation and does not imply MIT endorsement. Interface and mosaic adapted from ${link('https://petervartanian.xyz/200/correlator/','AI Risk Correlator')}, ${link('https://petervartanian.xyz/200/monitor/','AI Control Monitor')} and ${link('https://petervartanian.xyz/200/agency-costs/','Agency Costs')}. The compact tiles retain the published mosaic’s colours and line icons. Their areas emphasize the paper’s sector ranking through the explicitly described editorial bands above.</p></div>`;}

function render() {
 route=readRoute();const p=route.params;
 if(route.page==='incidents'){incidentQuery=p.get('q')||'';incidentRisk=p.get('risk')||'';incidentLimit=50;}
 if(['home','assess','assessment'].includes(route.page)){const selection=resolveDecisionSelection(DATA.sectors,WORKFLOWS,p);selectedSector=selection.sector?.id||'';selectedWorkflow=selection.workflow?.id||'';}
 const sector=sectorById(p.get('sector'))||sectorById('finance');
 const workflow=workflowById(p.get('id')),incident=caseById(p.get('id')),account=accountById(p.get('id')),risk=riskById(p.get('id'));
 const chapters=chapterPages({DATA,WORKFLOWS,EVIDENCE,accounts,route,esc,link,option,pageHeading,recordTable,accountTable,routeUrl,incidentCount:INCIDENTS.records.length});
 const reviewRenderers = reviewViews(reviewById(p.get('id')));
 const renderers={...chapters,formula:delegationMethodPage,incidents:()=>incidentLibraryPage(incidentContext()),assess:home,assessment:home,reviews:reviewRenderers.reviews,review:reviewRenderers.review,home,sector:()=>sectorPage(sector),workflow:()=>workflow?workflowPage(workflow):home(),case:()=>incident?casePage(incident):recordsPage(),records:recordsPage,account:()=>account?accountPage(account):recordsPage(),risk:()=>risk?riskPage(risk,sector):matrixPage(),matrix:matrixPage,controls:controlsPage,sources:sourcesPage};
 const isQuestion=['home','assess','assessment'].includes(route.page);
 $('#reference-navigation').innerHTML=`${isQuestion?'':`<a href="${routeUrl('home',{sector:selectedSector,workflow:selectedWorkflow})}">Back to the question</a>`}<a href="#/sources">Sources & methods</a>`;
 $('#main').innerHTML=(renderers[route.page]||home)();
 document.title=`${$('#main h1')?.textContent||'Agency Costs'} | Keythorn`;
 fitMosaicLabels();
}
function startAccount({sector,workflow,incident,reviewId}) {
 const w=workflowById(workflow),c=caseById(incident);const a=blankAccount();
 a.id=`AC-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;
 a.asOf=accountDate();a.sector=w?.sector||c?.sectorId||sector||'';a.workflow=w?.id||'';a.title=w?.name||c?.title||'New loss account';a.event=c?.summary||'';a.source=c?.sources.map(s=>s.url).join('\n')||'';a.eventDate=c?.eventDate?.match(/^\d{4}-\d{2}-\d{2}$/)?c.eventDate:'';
 a.currency=c?.financial.currency||'USD';a.risks=w?.riskIds.slice()||c?.riskIds.slice()||[];a.exposure.unit=w?.countingUnit||'';
 a.controls=w?.controls.map(c=>c.id)||[];a.appraisals=(w?.controls||[]).map(p=>({controlId:p.id,decision:'Investigate',evidence:p.evidenceNeeded,baselineLoss:'',reductionPct:'',annualCost:''}));
 if(c) {a.recordKind='public-account';a.financialBasis=/award|ordered/i.test(c.financial.status||'')?'ordered award':/estimate/i.test(c.financial.status||'')?'estimate':'realized loss';a.outcome=c.financial.note;a.notes=`Public evidence: ${c.evidenceStatus}. Source amount: ${c.financial.relation==='greater_than'?'More than ':''}${money(c.financial.amount,c.financial.currency)} (${c.financial.label}). Reconcile components and financial basis before entering a loss.`;}
 accounts.push(a);currentAccountId=a.id;save();
 const review = reviewById(reviewId);
 if (review) { review.accountIds.push(a.id); saveReviews(); }
 navigate('account',{id:a.id});
}
function download(name,content,mime) {const blob=new Blob([content],{type:mime}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);}
function updateAccount(target) {
 const a=accountById(route.params.get('id'));if(!a)return;
 const keys=target.dataset.accountField.split('.');const val=target.type==='checkbox'?target.checked:target.value;
 if(keys.length===2)a[keys[0]][keys[1]]=val;else a[keys[0]]=val;
 if(keys[0]==='sector'&&a.workflow&&workflowById(a.workflow)?.sector!==a.sector){a.workflow='';}
 save();if($('#loss-summary'))$('#loss-summary').innerHTML=accountSummary(a);if($('#exposure-summary'))$('#exposure-summary').innerHTML=exposureSummary(a);
 if(keys[0]==='currency')$('#appraisals').innerHTML=appraisals(a);
 if($('#save-state'))$('#save-state').textContent=storageOk?'Saved on this browser.':'Storage unavailable; export to retain this account.';
 if(keys[0]==='sector')render();
}
document.addEventListener('input',e=>{
 const t=e.target;
 if(t.id==='incident-search'){incidentQuery=t.value;incidentLimit=50;$('#incident-results').innerHTML=incidentLibraryResults(incidentContext());}
 if(t.dataset.reviewField && t.tagName!=='SELECT')updateReview(t);
 if(t.id==='sector-search'){sectorQuery=t.value;$('#mosaic-results').innerHTML=mosaic();fitMosaicLabels();}
 if(t.id==='control-search'){controlQuery=t.value;controlLimit=30;$('#control-results').innerHTML=controlResults();}
 if(t.dataset.accountField)updateAccount(t);
 if(t.dataset.appraisal!=null){const a=accountById(route.params.get('id'));const p=a.appraisals[Number(t.dataset.appraisal)];p[t.dataset.field]=t.value;save();document.querySelector(`[data-control-result="${t.dataset.appraisal}"]`).innerHTML=controlResult(p,a.currency);}
});
document.addEventListener('change',async e=>{
 const t=e.target;
 if(t.id==='incident-risk')navigate('incidents',{risk:t.value,q:incidentQuery});
 if(t.id==='assessment-workflow')navigate(t.value?'assessment':'assess',t.value?{workflow:t.value}:{});
 if((t.dataset.reviewField && t.tagName==='SELECT') || t.dataset.reviewCase || t.dataset.reviewAccount)updateReview(t);
 if(t.id==='chapter-workflow')navigate(route.page,{workflow:t.value});
 if(t.id==='chapter-risk')navigate(route.page,{risk:t.value});
 if(t.id==='risk-sector')navigate('risk',{id:route.params.get('id'),sector:t.value});
 if(t.id==='control-category'){controlCategory=t.value;controlLimit=30;$('#control-results').innerHTML=controlResults();}
 if(t.id==='active-account'){currentAccountId=t.value;$('#control-results').innerHTML=controlResults();}
 if(t.id==='import-account'&&t.files[0]){
 try { if(t.files[0].size>2_000_000)throw Error('Account files must be under 2 MB.');const raw=JSON.parse(await t.files[0].text());const result=validateAccount(raw?.account||raw);if(!result.valid)throw Error(Object.values(result.errors).join(' '));const a=result.account;if(!sectorById(a.sector)&&a.sector)throw Error('Unknown sector.');if(a.workflow&&!workflowById(a.workflow))throw Error('Unknown workflow.');if(a.workflow&&workflowById(a.workflow).sector!==a.sector)throw Error('The workflow and sector do not match.');if(a.risks.some(id=>!riskById(id))||a.controls.some(id=>!controlById(id)))throw Error('Unknown MIT risk or control ID.');normalizeControlContext(a);a.id=`AC-import-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,6)}`;accounts.push(a);currentAccountId=a.id;save();navigate('account',{id:a.id});notify('Account imported as a separate copy.'); }catch(err){notify(`Import failed: ${err.message}`);}
 }
});
const mosaicNotes = {
 sources: {
  title: 'Research and taxonomy',
  body: '<p>The 14 sectors follow the MIT priority study’s adaptation of NAICS. Names and definitions follow the shared taxonomy maintained by Simon’s team.</p><p>Taxonomy snapshot: 1 October 2026. MIT research data: CC BY 4.0.</p><p><a href="https://airisk.mit.edu/priorities" target="_blank" rel="noopener noreferrer">MIT study</a> / <a href="#/sources" data-close-note>Sources and methods</a></p>',
 },
 sizing: {
  title: 'How tiles are sized',
  body: '<p>Larger tiles emphasize sectors ranked more vulnerable in the MIT study. The ranking uses the paper’s response-weighted mean across all 24 risks.</p><p>Ranks 1–3, 4–7, 8–10, 11–12 and 13–14 receive area weights of 5, 4, 3, 2 and 1. Tied scores share a weight. These are display choices, not ratios of danger, urgency or loss.</p><p><a href="https://arxiv.org/abs/2606.04490" target="_blank" rel="noopener noreferrer">Study paper</a> / <a href="https://osf.io/download/6d58m/" target="_blank" rel="noopener noreferrer">Published analysis</a></p>',
 },
};
$('#mosaic-note').addEventListener('click',event=>{
 const dialog = event.currentTarget;
 if (event.target !== dialog) return;
 const bounds = dialog.getBoundingClientRect();
 if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.addEventListener('click',e=>{
 const t=e.target.closest('button,a,label');if(!t)return;
 if(t.dataset.mosaicNote){const note=mosaicNotes[t.dataset.mosaicNote];if(note){$('#mosaic-note-title').textContent=note.title;$('#mosaic-note-body').innerHTML=note.body;$('#mosaic-note').showModal();}return;}
 if(t.hasAttribute('data-close-note')){$('#mosaic-note').close();return;}
 if(t.dataset.openIncident){selectEvidence('incident',t.dataset.openIncident,'failures');return;}
 if(t.dataset.scroll){e.preventDefault();const target=document.getElementById(t.dataset.scroll);if(target){target.scrollIntoView({block:'start'});target.focus({preventScroll:true});}return;}
 if(t.hasAttribute('data-more-incidents')){incidentLimit+=50;$('#incident-results').innerHTML=incidentLibraryResults(incidentContext());}
 if(t.dataset.selectSector)selectWorkspace(t.dataset.selectSector,'','sector');
 if(t.dataset.evidenceKey){selectEvidence(t.dataset.evidenceKey,t.dataset.evidenceValue);return;}
 if(t.dataset.homeWorkflow){const job=workflowById(t.dataset.homeWorkflow);if(job)selectWorkspace(job.sector,job.id,'job');}
 if(t.dataset.downloadRequest){const w=workflowById(t.dataset.downloadRequest);const s=sectorById(w.sector);const lines=['# Agency Costs: evidence request','',`Sector: ${s.name}`,`Workflow: ${w.name}`,'','## Task',w.task,'','## Failure to investigate',w.failure,'','## Counting unit',w.countingUnit,'','## Records to supply','- Event ID, observation period, allowed authority and actual action.','- Execution traces, affected parties, response and recovery.','- Currency, valuation date and source for each cost or recovery.','- Matched eligible operations and the rule used to count failures.','- Claim status, documented responsibility, policy or contract references.','- Source owner, reviewer and permission for the intended disclosure.','','## Control evidence',...w.controls.map(c=>`- ${controlById(c.id)?.name}: ${c.evidenceNeeded}`),'','## Human comparison',w.humanComparison.evidenceNeeded,'','MIT taxonomy snapshot: 1 October 2026. This request applies it to the selected workflow.'];download(`agency-costs-request-${w.id}.md`,lines.join('\n'),'text/markdown');notify('Evidence request downloaded.');}
 if(t.hasAttribute('data-new-review'))navigate('assessment',{workflow:t.dataset.workflow || $('#new-review-workflow')?.value});
 if(t.dataset.exportAssessment){const w=workflowById(t.dataset.exportAssessment);if(w){download(`agency-costs-assessment-${w.id}.md`,assessmentViews().exportText(w),'text/markdown');notify('Assessment exported.');}}
 if(t.hasAttribute('data-export-review')){
  const review = reviewById(route.params.get('id'));
  if(review) { download(`${(review.title||review.id).replace(/[^a-zA-Z0-9]+/g,'-')}.md`,exportReviewMarkdown(review,reviewContext(review)),'text/markdown'); notify('Decision brief exported.'); }
 }
 if(t.hasAttribute('data-new-account'))startAccount({sector:t.dataset.sector,workflow:t.dataset.workflow,incident:t.dataset.case,reviewId:t.dataset.forReview});
 if(t.dataset.export){const a=accountById(route.params.get('id'));const context={sector:sectorById(a.sector),workflow:workflowById(a.workflow),risks:a.risks.map(riskById).filter(Boolean),controls:a.controls.map(controlById).filter(Boolean)};const name=(a.title||a.id).replace(/[^a-zA-Z0-9]+/g,'-');download(`${name}.${t.dataset.export==='json'?'json':'md'}`,t.dataset.export==='json'?JSON.stringify(a,null,2):exportAccountMarkdown(a,context),t.dataset.export==='json'?'application/json':'text/markdown');notify('Account exported.');}
 if(t.hasAttribute('data-print'))window.print();
 if(t.dataset.addControl){const a=accountById(currentAccountId);if(!a)return;const id=t.dataset.addControl;if(!a.controls.includes(id)){a.controls.push(id);a.appraisals.push({controlId:id,decision:'Investigate',evidence:'',baselineLoss:'',reductionPct:'',annualCost:''});save();$('#control-results').innerHTML=controlResults();notify('Control added to the account.');}}
 if(t.dataset.removeControl){const a=accountById(route.params.get('id')),id=t.dataset.removeControl;a.controls=a.controls.filter(c=>c!==id);a.appraisals=a.appraisals.filter(p=>p.controlId!==id);save();$('#appraisals').innerHTML=appraisals(a);}
 if(t.id==='more-controls'){controlLimit+=30;$('#control-results').innerHTML=controlResults();}
});
window.addEventListener('hashchange',()=>{render();window.scrollTo(0,0);$('#main').focus({preventScroll:true});});
window.addEventListener('popstate',render);
window.addEventListener('resize',fitMosaicLabels);
document.fonts?.ready.then(fitMosaicLabels);
render();

})();