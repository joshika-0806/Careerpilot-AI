/**
 * SummaryCard — Candidate contact details panel.
 * Props: { parsedData }
 *   parsedData: { email, phone, linkedin, github, summary }
 */
function SummaryCard({ parsedData = {} }) {
  const { email, phone, linkedin, github, summary } = parsedData;

  const rows = [
    { label: "Email",    value: email    || "Not found", href: email ? `mailto:${email}` : null },
    { label: "Phone",    value: phone    || "Not found", href: null },
    { label: "LinkedIn", value: linkedin ? "View Profile ↗" : "Not listed", href: linkedin ? `https://${linkedin}` : null },
    { label: "GitHub",   value: github   ? "View Profile ↗" : "Not listed", href: github   ? `https://${github}`   : null },
  ];

  return (
    <div className="glass-card meta-card">
      <h3 className="card-overline">Contact Details</h3>

      {rows.map(({ label, value, href }) => (
        <div className="info-row" key={label}>
          <span className="info-label">{label}</span>
          <span className="info-val">
            {href ? (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {value}
              </a>
            ) : (
              value
            )}
          </span>
        </div>
      ))}

      {summary && (
        <div className="summary-block">
          <span className="info-label" style={{ display: "block", marginBottom: "8px" }}>
            Summary
          </span>
          <p className="summary-text">{summary}</p>
        </div>
      )}
    </div>
  );
}

export default SummaryCard;
