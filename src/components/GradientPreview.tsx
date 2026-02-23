import { useState } from "react";
import { useApp } from "../context";

export default function GradientPreview() {
  const { airlines, config } = useApp();
  const [airline1, setAirline1] = useState("");
  const [airline2, setAirline2] = useState("");

  const a1 = airlines.find((a) => a.id === airline1);
  const a2 = airlines.find((a) => a.id === airline2);

  let gradient = "";
  let legend: { color: string; position: number; label: string }[] = [];

  if (a1 && !a2) {
    legend = config.single.map((s) => ({
      color: a1.tokens[s.tokenIndex],
      position: s.position,
      label: `${a1.id}.T${s.tokenIndex + 1}`,
    }));
  } else if (a1 && a2) {
    const sources = [a1, a2];
    legend = config.dual.map((s) => {
      const src = sources[s.airlineIndex];
      return {
        color: src.tokens[s.tokenIndex],
        position: s.position,
        label: `${src.id}.T${s.tokenIndex + 1}`,
      };
    });
  }

  if (legend.length) {
    const parts = legend.map((l) => `${l.color} ${l.position}%`);
    gradient = `linear-gradient(to bottom, ${parts.join(", ")})`;
  }

  return (
    <section className="panel preview-panel">
      <h2>Gradient Preview</h2>

      <div className="selector-row">
        <label>
          Airline 1
          <select value={airline1} onChange={(e) => setAirline1(e.target.value)}>
            <option value="">-- select --</option>
            {airlines.map((a) => (
              <option key={a.id} value={a.id}>{a.id} - {a.name}</option>
            ))}
          </select>
        </label>
        <label>
          Airline 2 (optional)
          <select value={airline2} onChange={(e) => setAirline2(e.target.value)}>
            <option value="">-- none --</option>
            {airlines.map((a) => (
              <option key={a.id} value={a.id}>{a.id} - {a.name}</option>
            ))}
          </select>
        </label>
      </div>

      {gradient ? (
        <>
          <div className="gradient-bar vertical" style={{ background: gradient }} />
          <div className="token-legend">
            {legend.map((l, i) => (
              <div key={i} className="legend-item">
                <div className="swatch" style={{ background: l.color }} />
                <span>{l.label} ({l.color}) @ {l.position}%</span>
              </div>
            ))}
          </div>
          <div className="css-output">
            <code>{`background: ${gradient};`}</code>
          </div>
        </>
      ) : (
        <p className="hint">Select at least one airline to preview</p>
      )}
    </section>
  );
}
