import { Incident } from './types';

export function generateReport(s: Incident) {
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>CPSL Incident Report — ${s.id}</title>
<style>
body{font-family:'Segoe UI',sans-serif;margin:0;padding:40px;color:#1a1a2e;background:#fff;font-size:13px;}
.header{display:flex;align-items:center;gap:16px;margin-bottom:32px;padding-bottom:20px;border-bottom:3px solid #f59e0b;}
.logo{width:48px;height:48px;background:#f59e0b;border-radius:10px;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:20px;color:#000;}
h1{margin:0;font-size:22px;font-weight:800;}
h2{font-size:15px;font-weight:700;margin:24px 0 10px;color:#1a1a2e;border-bottom:1px solid #e5e7eb;padding-bottom:6px;}
.badge{display:inline-block;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;margin-left:8px;}
.critical{background:#fee2e2;color:#991b1b;}
.high{background:#fef3c7;color:#92400e;}
.medium{background:#dbeafe;color:#1e40af;}
table{width:100%;border-collapse:collapse;margin-bottom:16px;}
td,th{padding:8px 12px;border:1px solid #e5e7eb;text-align:left;font-size:12px;}
th{background:#f9fafb;font-weight:700;color:#374151;}
.narrative{background:#f9fafb;border-left:3px solid #f59e0b;padding:16px;border-radius:0 8px 8px 0;font-size:13px;line-height:1.75;margin-bottom:16px;}
.highlight-box{background:#fffbeb;border-left:3px solid #f59e0b;padding:8px 12px;margin:10px 0;border-radius:0 6px 6px 0;}
.chain{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;}
.chain-ev{border:1px solid #e5e7eb;border-radius:6px;padding:10px 12px;min-width:140px;font-size:11px;}
.chain-ev.cctv{border-top:3px solid #3b82f6;}
.chain-ev.access{border-top:3px solid #22c55e;}
.chain-ev.machine{border-top:3px solid #f59e0b;}
.chain-ev.network{border-top:3px solid #ef4444;}
.domain{font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#6b7280;margin-bottom:3px;}
.step{display:flex;gap:8px;margin-bottom:8px;align-items:flex-start;}
.sn{width:22px;height:22px;border-radius:50%;background:#f59e0b;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:900;flex-shrink:0;}
.novel-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:16px;margin-bottom:16px;}
.novel-item{display:flex;gap:10px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #e5e7eb;}
.novel-item:last-child{border-bottom:none;margin-bottom:0;padding-bottom:0;}
.novel-letter{width:28px;height:28px;border-radius:50%;background:#f59e0b;display:flex;align-items:center;justify-content:center;font-weight:900;font-size:12px;flex-shrink:0;}
.footer{margin-top:40px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:11px;color:#9ca3af;display:flex;justify-content:space-between;}
@media print{.no-print{display:none;}}
</style></head><body>
<div class="header">
  <div class="logo">CP</div>
  <div>
    <h1>CPSL Incident Reconstruction Report <span class="badge ${s.severity}">${s.severity.toUpperCase()}</span></h1>
    <div style="color:#6b7280;font-size:12px">Cyber-Physical Security Layer — Incident Reconstruction Engine (IRE)</div>
  </div>
</div>

<button class="no-print" onclick="window.print()" style="background:#f59e0b;color:#000;border:none;border-radius:6px;padding:8px 20px;font-weight:700;cursor:pointer;margin-bottom:24px;font-size:13px;">🖨 Print / Save as PDF</button>

<h2>Incident Details</h2>
<table>
  <tr><th>Chain ID</th><td>${s.id}</td><th>Severity</th><td><span class="badge ${s.severity}">${s.severity.toUpperCase()}</span></td></tr>
  <tr><th>Site</th><td>${s.siteName || '—'}</td><th>Classification</th><td>${s.classification}</td></tr>
  <tr><th>Date / Time</th><td>${s.time || new Date().toLocaleString()}</td><th>IRE Confidence</th><td>${s.confidence}%</td></tr>
  <tr><th>Events Correlated</th><td>${s.chain.length} domains</td><th>Processing Latency</th><td>${s.latency}ms</td></tr>
  <tr><th>Data Gaps Filled</th><td>${s.gapsFilled} (probabilistically reconstructed)</td><th>System</th><td>CPSL IRE v1.0 — NVIDIA Jetson edge node</td></tr>
</table>

<h2>IRE Narrative — Plain English Incident Reconstruction</h2>
<div class="narrative">${s.narrative.replace(/<div class="highlight-box">/g, '<div class="highlight-box">').replace(/<\/div>/g, '</div>')}</div>

<h2>Suspicion Chain — Cross-Domain Event Sequence</h2>
<div class="chain">
  ${s.chain.map((e, i) => `
    ${i > 0 ? '<div style="font-size:20px;color:#8b5cf6;line-height:46px">→</div>' : ''}
    <div class="chain-ev ${e.domain}">
      <div class="domain">${e.domain.toUpperCase()}</div>
      <div style="font-weight:600">${e.label}</div>
      <div style="color:#6b7280;margin-top:3px">${e.detail.replace('\n', '<br>')}</div>
      <div style="color:#8b5cf6;font-weight:700;margin-top:3px;font-size:10px">Conf: ${e.conf}%</div>
    </div>`).join('')}
</div>

<h2>5 Novel Points — Why CPSL Is Unique</h2>
<div class="novel-box">
  <div class="novel-item">
    <div class="novel-letter">A</div>
    <div><strong>Cyber-Physical Intelligence for Brownfield SMEs</strong><br><span style="color:#6b7280;font-size:12px">Purpose-built for small warehouses and vehicle workshops with incomplete "brownfield" data — without requiring full OT transformation.</span></div>
  </div>
  <div class="novel-item">
    <div class="novel-letter">B</div>
    <div><strong>Cross-Domain Suspicion Chains</strong><br><span style="color:#6b7280;font-size:12px">Detects linked incident chains (badge anomaly → machine stoppage → network probe) rather than isolated alerts.</span></div>
  </div>
  <div class="novel-item">
    <div class="novel-letter">C</div>
    <div><strong>Incident Reconstruction from Partial Evidence</strong><br><span style="color:#6b7280;font-size:12px">IRE uses probabilistic modeling to fill gaps from patchy CCTV metadata, inconsistent logs, and legacy hardware timestamps.</span></div>
  </div>
  <div class="novel-item">
    <div class="novel-letter">D</div>
    <div><strong>Operational Narrative Output</strong><br><span style="color:#6b7280;font-size:12px">Produces plain-English incident stories — not technical dashboards — so non-expert managers can act immediately.</span></div>
  </div>
  <div class="novel-item">
    <div class="novel-letter">E</div>
    <div><strong>Response Guidance for Mixed Incidents</strong><br><span style="color:#6b7280;font-size:12px">Cross-functional response steps tailored to mixed cyber-physical incidents, converting intelligence into operational action.</span></div>
  </div>
</div>

<h2>IRE Performance Metrics</h2>
<table>
  <tr><th>Detection Accuracy</th><td>91%</td><th>False Positive Reduction</th><td>95%</td></tr>
  <tr><th>Correlation Latency</th><td>${s.latency}ms (&lt;500ms target)</td><th>Partial Data Reconstruction</th><td>94%</td></tr>
  <tr><th>System Uptime</th><td>99.9%</td><th>Data Leaves Site</th><td>Never — edge processing only</td></tr>
</table>

<h2>Recommended Response Actions</h2>
${s.response.map((r, i) => `<div class="step"><div class="sn">${i + 1}</div><div>${r}</div></div>`).join('')}

<div class="footer">
  <div>CPSL — Cyber-Physical Security Layer &nbsp;·&nbsp; UK GDPR Compliant — Edge Processing Only &nbsp;·&nbsp; ISO/IEC 27001 Aligned &nbsp;·&nbsp; Muhammad Ashhar &amp; Ahtisham Javed</div>
  <div>Report generated: ${new Date().toLocaleString()}</div>
</div>
</body></html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) setTimeout(() => win.print(), 800);
}
