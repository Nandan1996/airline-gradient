import { useState, useRef } from "react";
import { useApp } from "../context";
import type { Airline } from "../types";

function parseCSV(text: string): Airline[] {
  const results: Airline[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("code")) continue;
    const cols = line.split(",").map((c) => c.trim());
    if (cols.length < 5) continue;
    const [id, t1, t2, t3, t4] = cols;
    results.push({
      id: id.toUpperCase(),
      name: cols[5]?.trim() || id.toUpperCase(),
      tokens: [t1, t2, t3, t4],
    });
  }
  return results;
}

function toCSV(airlines: Airline[]): string {
  const header = "code,token1,token2,token3,token4,name";
  const rows = airlines.map(
    (a) => `${a.id},${a.tokens.join(",")},${a.name}`,
  );
  return [header, ...rows].join("\n");
}

const TOKEN_LABELS = ["T1 (lightest)", "T2", "T3", "T4 (darkest)"];

function TokenInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="token-input">
      <span>{label}</span>
      <div className="color-pair">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} />
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} maxLength={7} className="hex-input" />
      </div>
    </label>
  );
}

function AirlineForm({
  draft,
  setDraft,
  onSave,
  onCancel,
  saveLabel,
}: {
  draft: Airline;
  setDraft: (a: Airline) => void;
  onSave: () => void;
  onCancel: () => void;
  saveLabel: string;
}) {
  const updateToken = (i: number, v: string) => {
    const tokens = [...draft.tokens] as Airline["tokens"];
    tokens[i] = v;
    setDraft({ ...draft, tokens });
  };

  return (
    <div className="airline-form">
      <div className="airline-form-row">
        <label className="form-field">
          <span>Code</span>
          <input className="id-input" value={draft.id} onChange={(e) => setDraft({ ...draft, id: e.target.value.toUpperCase() })} maxLength={3} placeholder="6E" />
        </label>
        <label className="form-field form-field-grow">
          <span>Name</span>
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Airline name" />
        </label>
      </div>
      <div className="airline-form-tokens">
        {draft.tokens.map((t, i) => (
          <TokenInput key={i} label={TOKEN_LABELS[i]} value={t} onChange={(v) => updateToken(i, v)} />
        ))}
      </div>
      <div className="airline-actions">
        <button onClick={onSave}>{saveLabel}</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

function AirlineRow({ airline }: { airline: Airline }) {
  const { updateAirline, removeAirline } = useApp();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(airline);

  if (!editing) {
    return (
      <div className="airline-row">
        <div className="airline-info">
          <strong>{airline.id}</strong>
          <span>{airline.name}</span>
          <div className="token-swatches">
            {airline.tokens.map((t, i) => (
              <div key={i} className="swatch" style={{ background: t }} title={`T${i + 1}: ${t}`} />
            ))}
          </div>
        </div>
        <div className="airline-actions">
          <button onClick={() => setEditing(true)}>Edit</button>
          <button className="danger" onClick={() => removeAirline(airline.id)}>Remove</button>
        </div>
      </div>
    );
  }

  return (
    <div className="airline-row editing">
      <AirlineForm
        draft={draft}
        setDraft={setDraft}
        onSave={() => { updateAirline(draft); setEditing(false); }}
        onCancel={() => { setDraft(airline); setEditing(false); }}
        saveLabel="Save"
      />
    </div>
  );
}

const EMPTY_AIRLINE: Airline = { id: "", name: "", tokens: ["#e0e0e0", "#999999", "#555555", "#111111"] };

export default function AirlineManager() {
  const { airlines, addAirline, importAirlines } = useApp();
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState<Airline>({ ...EMPTY_AIRLINE });
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAdd = () => {
    if (!draft.id || !draft.name) return;
    addAirline(draft);
    setDraft({ ...EMPTY_AIRLINE });
    setAdding(false);
  };

  const handleExport = () => {
    const csv = toCSV(airlines);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "airlines.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((text) => {
      const parsed = parseCSV(text);
      if (parsed.length) importAirlines(parsed);
    });
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Airlines</h2>
        <div className="panel-header-actions">
          <button onClick={handleExport}>Export CSV</button>
          <button onClick={() => fileRef.current?.click()}>Import CSV</button>
          <input ref={fileRef} type="file" accept=".csv,text/csv" onChange={handleImport} hidden />
        </div>
      </div>
      <div className="airline-list">
        {airlines.map((a) => <AirlineRow key={a.id} airline={a} />)}
      </div>

      {adding ? (
        <div className="airline-row editing" style={{ marginTop: 12 }}>
          <AirlineForm
            draft={draft}
            setDraft={setDraft}
            onSave={handleAdd}
            onCancel={() => setAdding(false)}
            saveLabel="Add"
          />
        </div>
      ) : (
        <button className="add-btn" onClick={() => setAdding(true)}>+ Add Airline</button>
      )}
    </section>
  );
}
