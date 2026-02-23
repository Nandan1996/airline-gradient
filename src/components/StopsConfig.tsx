import { useApp } from "../context";
import type { GradientConfig, StopEntry, DualStopEntry } from "../types";

function SingleStops({
  stops,
  onChange,
}: {
  stops: StopEntry[];
  onChange: (s: StopEntry[]) => void;
}) {
  const update = (i: number, patch: Partial<StopEntry>) => {
    const next = stops.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange(next);
  };

  const addStop = () => onChange([...stops, { position: 100, tokenIndex: 0 }]);
  const removeStop = (i: number) => onChange(stops.filter((_, idx) => idx !== i));

  return (
    <div className="stops-group">
      <div className="stops-header">
        <h3>Single Airline</h3>
        <button onClick={addStop}>+ Stop</button>
      </div>
      <div className="stops-table">
        {stops.map((s, i) => (
          <div key={i} className="stop-row">
            <label className="stop-field">
              <span>Position</span>
              <div className="stop-value">
                <input type="range" min={0} max={100} value={s.position} onChange={(e) => update(i, { position: +e.target.value })} />
                <input type="number" min={0} max={100} value={s.position} onChange={(e) => update(i, { position: +e.target.value })} className="stop-num" />
                <span>%</span>
              </div>
            </label>
            <label className="stop-field">
              <span>Token</span>
              <select value={s.tokenIndex} onChange={(e) => update(i, { tokenIndex: +e.target.value })}>
                {[0, 1, 2, 3].map((t) => (
                  <option key={t} value={t}>T{t + 1}</option>
                ))}
              </select>
            </label>
            {stops.length > 2 && (
              <button className="danger sm" onClick={() => removeStop(i)}>×</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function DualStops({
  stops,
  onChange,
}: {
  stops: DualStopEntry[];
  onChange: (s: DualStopEntry[]) => void;
}) {
  const update = (i: number, patch: Partial<DualStopEntry>) => {
    const next = stops.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    onChange(next);
  };

  const addStop = () => onChange([...stops, { position: 100, airlineIndex: 0, tokenIndex: 0 }]);
  const removeStop = (i: number) => onChange(stops.filter((_, idx) => idx !== i));

  return (
    <div className="stops-group">
      <div className="stops-header">
        <h3>Two Airlines</h3>
        <button onClick={addStop}>+ Stop</button>
      </div>
      <div className="stops-table">
        {stops.map((s, i) => (
          <div key={i} className="stop-row">
            <label className="stop-field">
              <span>Position</span>
              <div className="stop-value">
                <input type="range" min={0} max={100} value={s.position} onChange={(e) => update(i, { position: +e.target.value })} />
                <input type="number" min={0} max={100} value={s.position} onChange={(e) => update(i, { position: +e.target.value })} className="stop-num" />
                <span>%</span>
              </div>
            </label>
            <label className="stop-field">
              <span>Airline</span>
              <select value={s.airlineIndex} onChange={(e) => update(i, { airlineIndex: +e.target.value as 0 | 1 })}>
                <option value={0}>Airline 1</option>
                <option value={1}>Airline 2</option>
              </select>
            </label>
            <label className="stop-field">
              <span>Token</span>
              <select value={s.tokenIndex} onChange={(e) => update(i, { tokenIndex: +e.target.value })}>
                {[0, 1, 2, 3].map((t) => (
                  <option key={t} value={t}>T{t + 1}</option>
                ))}
              </select>
            </label>
            {stops.length > 2 && (
              <button className="danger sm" onClick={() => removeStop(i)}>×</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function StopsConfig() {
  const { config, setConfig } = useApp();

  const updateSingle = (single: GradientConfig["single"]) => setConfig({ ...config, single });
  const updateDual = (dual: GradientConfig["dual"]) => setConfig({ ...config, dual });

  return (
    <section className="panel">
      <h2>Gradient Stops</h2>
      <SingleStops stops={config.single} onChange={updateSingle} />
      <DualStops stops={config.dual} onChange={updateDual} />
    </section>
  );
}
