# Pinnacle Runtime Validator V2 — Pilot Operations Runbook
**Runtime Version:** v1 | **Release Tag:** validator-v2-core-release

Welcome to the internal pilot environment. This operational logbook details how to execute, monitor, and export trust evaluations safely using the frozen validation pipeline.

---

## 🧭 Operational Procedures

### Workflow 1: Running an Individual Trust Validation
1. **Access the Console:** Open your private workspace environment via the runtime command terminal.
2. **Provide Target Telemetry:** Ingest the exact legal business name and destination website domain.
3. **Trigger Pipeline:** Execute the validation command runner.
4. **Inspect Resolution Screen:** Verify that the generated 0-100 Trust Score, Risk Category, and natural language AI Executive Summary render properly on the interface screen.

### Workflow 2: Ingesting Bulk Lead Batches
1. **Verify Source Data:** Ensure your target intake spreadsheet is formatted as a clean CSV with headers matching: `Business Name, Website`.
2. **Initialize Batch Intake:** Upload the file into the operational panel buffer. The system will auto-assign a deterministic `Batch ID`.
3. **Monitor Stream Telemetry:** Watch the real-time operational dashboard for streaming tracking counters.
4. **Extract Batch Output Logs:** Once processing reaches 100%, execute the batch data compilation step.

---

## 🛠️ Failure Recovery & Incident Management
*   **DNS Timeouts:** The core framework auto-reloads its built-in retry handling. Stalled items shift to a secondary queue without blocking execution streams.
*   **Invalid CSV Formats:** The validation engine filters out broken lines, logs rows as `Pipeline Failures`, and continues processing healthy records.