import fastify, { FastifyInstance } from "fastify";
import type { RuntimeContainer } from "../bootstrap/runtime-container.js";

export interface ServerOptions {
  port?: number;
  host?: string;
}

export async function startApiServer(
  container: RuntimeContainer,
  opts: ServerOptions = {}
): Promise<FastifyInstance> {
  const server = fastify({ logger: false });

  // 1. Core Inbound Validation Endpoint
  server.post("/api/v1/executions", {
    schema: {
      body: {
        type: "object",
        required: ["capability"],
        properties: {
          capability: { type: "string", minLength: 1 },
          input: { type: "object", additionalProperties: true }
        }
      }
    }
  }, async (request, reply) => {
    try {
      const body = request.body as { capability: string; input?: unknown };
      const response = await container.execute({
        capability: body.capability,
        input: body.input || {}
      });

      if (!response.success) {
        return reply.status(400).send(response);
      }
      return reply.status(200).send(response);
    } catch (err: any) {
      return reply.status(500).send({
        success: false,
        error: err.message || "Internal Server Execution Fault"
      });
    }
  });

  // 2. Customer-Facing Pinnacle Validator Application Dashboard
  server.get("/dashboard", async (request, reply) => {
    try {
      return reply.type("text/html").send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pinnacle Validator - Business Reputation & Trust Analysis</title>
  <style>
    :root {
      --bg-main: #0b0f19;
      --bg-card: #111827;
      --border-color: #1e293b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --primary: #0ea5e9;
      --primary-hover: #38bdf8;
      --success: #10b981;
      --warning: #f59e0b;
      --error: #ef4444;
    }
    body {
      background-color: var(--bg-main);
      color: var(--text-main);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 2rem 1rem;
      margin: 0;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container {
      width: 100%;
      max-width: 900px;
    }
    .header {
      text-align: center;
      margin-bottom: 2.5rem;
    }
    .header h1 {
      font-size: 2.25rem;
      font-weight: 800;
      letter-spacing: -0.025em;
      margin: 0 0 0.5rem 0;
      color: var(--text-main);
    }
    .header h1 span {
      color: var(--primary);
    }
    .header p {
      color: var(--text-muted);
      font-size: 1.1rem;
      margin: 0;
    }
    .card {
      background-color: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);
      margin-bottom: 2rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-muted);
    }
    .form-control {
      width: 100%;
      box-sizing: border-box;
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 6px;
      padding: 0.75rem 1rem;
      color: var(--text-main);
      font-size: 1rem;
      transition: border-color 0.2s;
    }
    .form-control:focus {
      outline: none;
      border-color: var(--primary);
    }
    .btn {
      background-color: var(--primary);
      color: white;
      border: none;
      border-radius: 6px;
      padding: 0.75rem 1.5rem;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      width: 100%;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: var(--primary-hover);
    }
    .btn:disabled {
      background-color: var(--border-color);
      color: var(--text-muted);
      cursor: not-allowed;
    }
    .hidden {
      display: none !important;
    }
    
    /* Loading States */
    .loader-wrapper {
      text-align: center;
      padding: 2rem 0;
    }
    .stage-item {
      display: flex;
      align-items: center;
      margin: 1rem 0;
      font-size: 1.05rem;
      color: var(--text-muted);
    }
    .stage-item.active {
      color: var(--primary);
      font-weight: 600;
    }
    .stage-item.done {
      color: var(--success);
    }
    .stage-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--border-color);
      margin-right: 1rem;
    }
    .stage-item.active .stage-dot {
      background-color: var(--primary);
      box-shadow: 0 0 8px var(--primary);
    }
    .stage-item.done .stage-dot {
      background-color: var(--success);
    }

    /* Results layout */
    .results-grid {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 768px) {
      .results-grid { grid-template-columns: 1fr; }
    }
    .score-box {
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
    .score-num {
      font-size: 3.5rem;
      font-weight: 800;
      color: var(--primary);
      line-height: 1;
      margin-bottom: 0.25rem;
    }
    .score-label {
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }
    .badge {
      margin-top: 1rem;
      padding: 0.35rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.85rem;
      font-weight: 700;
    }
    .badge-success { background-color: rgba(16, 185, 129, 0.15); color: var(--success); border: 1px solid var(--success); }
    .badge-error { background-color: rgba(239, 68, 68, 0.15); color: var(--error); border: 1px solid var(--error); }
    
    .summary-box {
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 1.5rem;
    }
    .summary-box h3 {
      margin-top: 0;
      margin-bottom: 1rem;
      font-size: 1.25rem;
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
      font-size: 0.95rem;
    }
    .info-label { color: var(--text-muted); }
    .info-val { font-weight: 600; }

    .section-title {
      font-size: 1.25rem;
      font-weight: 700;
      margin: 2rem 0 1rem 0;
      color: var(--text-main);
    }

    /* Evidence Log */
    .log-container {
      background-color: var(--bg-main);
      border: 1px solid var(--border-color);
      border-radius: 8px;
      overflow: hidden;
    }
    .log-item {
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      align-items: flex-start;
    }
    .log-item:last-child { border-bottom: none; }
    .log-icon {
      margin-right: 0.75rem;
      font-weight: bold;
      font-size: 1.1rem;
    }
    .log-icon.pass { color: var(--success); }
    .log-icon.fail { color: var(--error); }
    .log-content { flex: 1; }
    .log-title { font-weight: 600; margin-bottom: 0.15rem; font-size: 0.95rem; }
    .log-desc { color: var(--text-muted); font-size: 0.85rem; }

    /* Action triggers */
    .actions-row {
      display: flex;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .btn-outline {
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-radius: 6px;
      padding: 0.6rem 1rem;
      font-size: 0.9rem;
      cursor: pointer;
      flex: 1;
      text-align: center;
      transition: background 0.2s;
    }
    .btn-outline:hover {
      background-color: var(--border-color);
    }
    .footer-brand {
      text-align: center;
      margin-top: 3rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <h1>Pinnacle <span>Validator</span></h1>
      <p>Enterprise Business Reputation, Trust, and Infrastructure Integrity Validation</p>
    </div>

    <!-- Phase 1: Intake Card -->
    <div id="intake-panel" class="card">
      <form id="validator-form">
        <div class="form-group">
          <label for="businessName">Legal Business Name</label>
          <input type="text" id="businessName" class="form-control" placeholder="Example Enterprise LLC" required>
        </div>
        <div class="form-group">
          <label for="domain">Corporate Domain / Website URL</label>
          <input type="text" id="domain" class="form-control" placeholder="example.com" required>
        </div>
        <div class="form-group">
          <label for="locationHint">Location Hint (Optional)</label>
          <input type="text" id="locationHint" class="form-control" placeholder="Austin, TX">
        </div>
        <button type="submit" id="submit-btn" class="btn" style="margin-top: 1rem;">Run Reputation Validation</button>
      </form>
    </div>

    <!-- Phase 2: Progress Tracker -->
    <div id="loading-panel" class="card hidden">
      <div class="loader-wrapper">
        <h3 style="margin-top: 0; margin-bottom: 1.5rem;">Analyzing Trust Perimeter...</h3>
        <div id="stage-dns" class="stage-item active">
          <div class="stage-dot"></div>
          <span>Validating Website Infrastructure & DNS records</span>
        </div>
        <div id="stage-tls" class="stage-item">
          <div class="stage-dot"></div>
          <span>Verifying HTTPS/TLS security posture</span>
        </div>
        <div id="stage-google" class="stage-item">
          <div class="stage-dot"></div>
          <span>Analyzing Google Presence & Public Reputation Signals</span>
        </div>
        <div id="stage-scoring" class="stage-item">
          <div class="stage-dot"></div>
          <span>Computing risk classification matrix and evidence maps</span>
        </div>
      </div>
    </div>

    <!-- Phase 3: Live Output Dashboard -->
    <div id="results-panel" class="hidden">
      <div class="card">
        <div class="results-grid">
          <div class="score-box">
            <div class="score-label">Trust Score</div>
            <div id="res-score" class="score-num">0</div>
            <div class="score-label">out of 100</div>
            <div id="res-badge" class="badge">PENDING</div>
          </div>
          <div class="summary-box">
            <h3 id="res-biz-name">Business Profile</h3>
            <div class="info-row"><span class="info-label">Domain</span><span id="res-domain" class="info-val">-</span></div>
            <div class="info-row"><span class="info-label">Analysis Date</span><span id="res-date" class="info-val">-</span></div>
            <div class="info-row"><span class="info-label">Infrastructure Safety</span><span id="res-infra" class="info-val">-</span></div>
            <div class="info-row"><span class="info-label">Reputation Status</span><span id="res-rep" class="info-val">-</span></div>
          </div>
        </div>

        <div class="section-title">Validation Evidence Log</div>
        <div id="log-records" class="log-container">
          <!-- Populated dynamically -->
        </div>

        <div class="section-title">Report Allocation Actions</div>
        <div class="actions-row">
          <button onclick="exportReport('html')" class="btn-outline">Download HTML Report</button>
          <button onclick="exportReport('csv')" class="btn-outline">Export CSV Manifest</button>
          <button onclick="exportReport('txt')" class="btn-outline">Export Plain Text</button>
        </div>

        <button onclick="resetForm()" class="btn" style="margin-top: 2rem; background-color: var(--border-color);">Analyze New Business</button>
      </div>
    </div>

    <div class="footer-brand">
      Pinnacle Validator Platform • Secured Production Ingestion Boundary
    </div>
  </div>

  <script>
    let currentPayload = null;

    document.getElementById('validator-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const businessName = document.getElementById('businessName').value.trim();
      const domain = document.getElementById('domain').value.trim().replace(/^(https?:\\/\\/)?(www\\.)?/, '');
      const locationHint = document.getElementById('locationHint').value.trim();

      // Enter Loading State
      document.getElementById('intake-panel').classList.add('hidden');
      document.getElementById('loading-panel').classList.remove('hidden');

      // Visual step sequencer ticks
      setTimeout(() => {
        document.getElementById('stage-dns').className = 'stage-item done';
        document.getElementById('stage-tls').className = 'stage-item active';
      }, 800);

      setTimeout(() => {
        document.getElementById('stage-tls').className = 'stage-item done';
        document.getElementById('stage-google').className = 'stage-item active';
      }, 1600);

      setTimeout(() => {
        document.getElementById('stage-google').className = 'stage-item done';
        document.getElementById('stage-scoring').className = 'stage-item active';
      }, 2400);

      try {
        const response = await fetch('/api/v1/executions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            capability: 'lead_orchestration',
            input: {
              id: 'job_' + Math.random().toString(36).substring(2, 9),
              domain: domain,
              businessName: businessName,
              locationHint: locationHint || undefined,
              status: 'pending'
            }
          })
        });

        const data = await response.json();
        
        if (data.success && data.output) {
          setTimeout(() => {
            renderFinalResults(data.output);
          }, 3000);
        } else {
          alert('Validation engine failure: ' + (data.error || 'Unknown error code'));
          resetForm();
        }
      } catch (err) {
        alert('Network connection breakdown targeting runtime: ' + err.message);
        resetForm();
      }
    });

    function renderFinalResults(output) {
      currentPayload = output;
      
      document.getElementById('loading-panel').classList.add('hidden');
      document.getElementById('results-panel').classList.remove('hidden');

      document.getElementById('res-score').innerText = output.totalScore;
      document.getElementById('res-biz-name').innerText = document.getElementById('businessName').value;
      document.getElementById('res-domain').innerText = output.domain;
      document.getElementById('res-date').innerText = new Date(output.processedAt).toLocaleString();

      const badge = document.getElementById('res-badge');
      if (output.passed) {
        badge.innerText = 'LOW RISK';
        badge.className = 'badge badge-success';
      } else {
        badge.innerText = 'HIGH RISK';
        badge.className = 'badge badge-error';
      }

      // Read real breakdown items
      const logs = [];
      let infrastructureHealthy = true;
      let publicReputationHealthy = true;

      if (output.breakdown) {
        // DNS
        const dns = output.breakdown.dns_validator;
        if (dns) {
          infrastructureHealthy = dns.passed;
          logs.push({
            passed: dns.passed,
            title: 'DNS Verification Monitor',
            desc: dns.passed ? 'Domain configurations resolved successfully with active namespace allocation.' : 'Critical root lookup faults or unassigned namespace parameters detected.'
          });
          if (dns.evidence) {
            dns.evidence.forEach(e => {
              logs.push({ passed: dns.passed, title: 'Evidence: ' + e.code, desc: 'Value mapped: ' + JSON.stringify(e.value) + (e.description ? ' - ' + e.description : '') });
            });
          }
        }

        // TLS
        const tls = output.breakdown.tls_validator;
        if (tls) {
          if (!tls.passed) infrastructureHealthy = false;
          logs.push({
            passed: tls.passed,
            title: 'HTTPS Certificate & Cryptographic Posture',
            desc: tls.passed ? 'TLS security layer verified with strong handshake trust protocols.' : 'Missing, untrusted, or expired cryptographic handshakes detected.'
          });
        }

        // Google Profile
        const geo = output.breakdown.google_places_validator;
        if (geo) {
          publicReputationHealthy = geo.passed;
          logs.push({
            passed: geo.passed,
            title: 'Google Places Public Footprint Verification',
            desc: geo.passed ? 'Active match localized inside Google Registry with positive brand index.' : 'Unable to confirm matching corporate identities within local registry structures.'
          });
        }
      }

      document.getElementById('res-infra').innerText = infrastructureHealthy ? 'Verified Secure' : 'Action Required';
      document.getElementById('res-infra').style.color = infrastructureHealthy ? 'var(--success)' : 'var(--error)';
      
      document.getElementById('res-rep').innerText = publicReputationHealthy ? 'Confirmed Active' : 'Unverified Presence';
      document.getElementById('res-rep').style.color = publicReputationHealthy ? 'var(--success)' : 'var(--warning)';

      const logContainer = document.getElementById('log-records');
      logContainer.innerHTML = '';
      
      logs.forEach(item => {
        const div = document.createElement('div');
        div.className = 'log-item';
        div.innerHTML = \`
          <div class="log-icon \${item.passed ? 'pass' : 'fail'}">\${item.passed ? '✓' : '⚠'}</div>
          <div class="log-content">
            <div class="log-title">\${item.title}</div>
            <div class="log-desc">\${item.desc}</div>
          </div>
        \`;
        logContainer.appendChild(div);
      });
    }

    function exportReport(format) {
      if (!currentPayload) return;
      let content = '';
      let filename = 'pinnacle-report-' + currentPayload.jobId;

      if (format === 'txt') {
        content = \`=== PINNACLE VALIDATOR ANALYSIS REPORT ===\\n\` +
                  \`Job Identifier: \${currentPayload.jobId}\\n\` +
                  \`Target Domain: \${currentPayload.domain}\\n\` +
                  \`Final Trust Score: \${currentPayload.totalScore} / \${currentPayload.maxScore}\\n\` +
                  \`Risk Status: \${currentPayload.passed ? 'LOW RISK' : 'HIGH RISK'}\\n\` +
                  \`Processed Time: \${currentPayload.processedAt}\\n\`;
        filename += '.txt';
      } else if (format === 'csv') {
        content = 'parameter,value\\n' +
                  \`jobId,\${currentPayload.jobId}\\n\` +
                  \`domain,\${currentPayload.domain}\\n\` +
                  \`totalScore,\${currentPayload.totalScore}\\n\` +
                  \`passed,\${currentPayload.passed}\\n\`;
        filename += '.csv';
      } else {
        content = document.documentElement.outerHTML;
        filename += '.html';
      }

      const blob = new Blob([content], { type: 'text/plain' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    }

    function resetForm() {
      document.getElementById('validator-form').reset();
      document.getElementById('results-panel').classList.add('hidden');
      document.getElementById('loading-panel').classList.add('hidden');
      document.getElementById('intake-panel').classList.remove('hidden');
      
      // Reset tracker state
      document.getElementById('stage-dns').className = 'stage-item active';
      document.getElementById('stage-tls').className = 'stage-item';
      document.getElementById('stage-google').className = 'stage-item';
      document.getElementById('stage-scoring').className = 'stage-item';
      currentPayload = null;
    }
  </script>
</body>
</html>
      `);
    } catch (err: any) {
      return reply.status(500).type("text/plain").send(`Failed to render live interface: ${err.message}`);
    }
  });

  const port = opts.port || 8080;
  const host = opts.host || "0.0.0.0";
  await server.listen({ port, host });
  
  return server;
}
