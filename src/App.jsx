import React, { useMemo, useState } from "react";

// --- Types (JSDoc style so this works in plain JS) -------------------------
// Waybill: { id: string, name: string, uploadedAt: string }
// Driver:  { id, name, address, driverLicense, truckNumber, phone, waybills[], status, carOwnerId? }
// CarOwner:{ id, name, phone, ownershipDocUrl? }
// Owner:   { id, name, location, phone, waybills[] }
// Track:   { id, plate, model?, isAvailable, carOwnerId?, assignedDriverId? }

const seedDrivers = [
  {
    id: "d1",
    name: "Ahmed Ali",
    address: "Hargeisa, Togdheer Rd",
    driverLicense: "DL-12345-SL",
    truckNumber: "SL-TRK-9921",
    phone: "+25263 555 1122",
    status: "idle",
    waybills: [],
    carOwnerId: "co1",
  },
  {
    id: "d2",
    name: "Hodan Warsame",
    address: "Berbera Port Area",
    driverLicense: "DL-98431-SL",
    truckNumber: "SL-TRK-4410",
    phone: "+25263 777 9010",
    status: "custom-reached",
    waybills: [{ id: "w1", name: "Waybill-INV-009.pdf", uploadedAt: new Date().toISOString() }],
    carOwnerId: "co2",
  },
];

const seedCarOwners = [
  { id: "co1", name: "Mahad Transport Co.", phone: "+25263 500 1111", ownershipDocUrl: "" },
  { id: "co2", name: "Sahal Logistics", phone: "+25263 500 2222" },
];

const seedOwners = [
  { id: "o1", name: "Abdi Buyer", location: "Hargeisa Market", phone: "+25263 600 1010", waybills: [] },
  { id: "o2", name: "Zahra Import", location: "Borama", phone: "+25263 600 2020", waybills: [] },
];

const seedTracks = [
  { id: "t1", plate: "SL-TRK-9921", model: "Hino 500", isAvailable: true, carOwnerId: "co1", assignedDriverId: "d1" },
  { id: "t2", plate: "SL-TRK-4410", model: "Isuzu FVR", isAvailable: false, carOwnerId: "co2", assignedDriverId: "d2" },
  { id: "t3", plate: "SL-TRK-3307", model: "Fuso Fighter", isAvailable: true, carOwnerId: "co2" },
];

const now = () => new Date().toISOString();

function Section({ title, children }) {
  return (
    <section style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, background: "#fff" }}>
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {children}
    </section>
  );
}

function AvailableTracks({ tracks, carOwners }) {
  const available = tracks.filter((t) => t.isAvailable);
  const ownerById = useMemo(() => Object.fromEntries(carOwners.map((o) => [o.id, o])), [carOwners]);

  return (
    <Section title="Available Tracks">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Plate</th>
            <th align="left">Model</th>
            <th align="left">Car Owner</th>
            <th align="left">Status</th>
          </tr>
        </thead>
        <tbody>
          {available.map((t) => (
            <tr key={t.id}>
              <td>{t.plate}</td>
              <td>{t.model ?? "—"}</td>
              <td>{t.carOwnerId ? ownerById[t.carOwnerId]?.name : "—"}</td>
              <td><span style={{ padding: "2px 8px", background: "#eef", borderRadius: 8 }}>Available</span></td>
            </tr>
          ))}
          {available.length === 0 && (
            <tr>
              <td colSpan="4" align="center" style={{ color: "#777" }}>No available tracks right now.</td>
            </tr>
          )}
        </tbody>
      </table>
    </Section>
  );
}

function WaybillWidget({ items, onUpload }) {
  const [fileName, setFileName] = useState("");
  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          style={{ flex: 1, padding: 8 }}
          placeholder="Waybill-123.pdf"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
        />
        <button
          onClick={() => {
            if (!fileName.trim()) return;
            onUpload({ id: crypto.randomUUID(), name: fileName.trim(), uploadedAt: now() });
            setFileName("");
          }}
        >
          Upload
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Name</th>
            <th align="left">Uploaded</th>
          </tr>
        </thead>
        <tbody>
          {items.map((w) => (
            <tr key={w.id}>
              <td>{w.name}</td>
              <td>{new Date(w.uploadedAt).toLocaleString()}</td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="2" style={{ color: "#777" }}>No waybills yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default function App() {
  const [drivers, setDrivers] = useState(seedDrivers);
  const [owners, setOwners] = useState(seedOwners);
  const [carOwners, setCarOwners] = useState(seedCarOwners);
  const [tracks, setTracks] = useState(seedTracks);
  const [tab, setTab] = useState("public");
  const [messages, setMessages] = useState([
    { id: "m1", from: "owner", text: "Driver on the way?", at: now() },
    { id: "m2", from: "driver", text: "Yes, 10 minutes out.", at: now() },
  ]);

  const totals = {
    tracks: tracks.length,
    drivers: drivers.length,
    owners: owners.length + carOwners.length,
    availableTracks: tracks.filter((t) => t.isAvailable).length,
  };

  const assignStatus = (driverId, status) => {
    setDrivers((d) => d.map((x) => (x.id === driverId ? { ...x, status } : x)));
  };

  return (
    <div style={{ minHeight: "100dvh", background: "#f6f7fb", padding: 16, display: "grid", gap: 16 }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 20 }}>HeeyLogistic</div>
          <div style={{ color: "#777", fontSize: 12 }}>Vercel-ready minimal UI</div>
        </div>
        <span style={{ border: "1px solid #ddd", padding: "2px 8px", borderRadius: 8 }}>Dashboard</span>
      </header>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 }}>
        <Section title="Total Tracks">{totals.tracks}</Section>
        <Section title="Available">{totals.availableTracks}</Section>
        <Section title="Drivers">{totals.drivers}</Section>
        <Section title="Owners">{totals.owners}</Section>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8 }}>
        {["public", "driver", "owner", "car-owner", "admin"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: "6px 10px",
              borderRadius: 8,
              border: "1px solid #ddd",
              background: tab === t ? "#e7f0ff" : "#fff",
              textTransform: "capitalize",
            }}
          >
            {t.replace("-", " ")}
          </button>
        ))}
      </div>

      {tab === "public" && <AvailableTracks tracks={tracks} carOwners={carOwners} />}

      {tab === "driver" && (
        <Section title="Driver Status & Waybills">
          <div style={{ display: "grid", gap: 12 }}>
            {drivers.map((d) => (
              <div key={d.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{d.name} · {d.truckNumber}</div>
                    <div style={{ color: "#777", fontSize: 12 }}>{d.phone}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span style={{ padding: "2px 8px", background: "#eef", borderRadius: 8, textTransform: "capitalize" }}>
                      {d.status.replace("-", " ")}
                    </span>
                    <select value={d.status} onChange={(e) => assignStatus(d.id, e.target.value)}>
                      <option value="idle">Idle</option>
                      <option value="custom-reached">Custom reached</option>
                      <option value="purchaser-reached">Purchaser reached</option>
                    </select>
                  </div>
                </div>

                <div style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Waybills</div>
                  <WaybillWidget
                    items={d.waybills}
                    onUpload={(w) =>
                      setDrivers((all) => all.map((x) => (x.id === d.id ? { ...x, waybills: [w, ...x.waybills] } : x)))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {tab === "owner" && (
        <Section title="Owner Waybills & Status">
          <div style={{ display: "grid", gap: 12 }}>
            {owners.map((o) => (
              <div key={o.id} style={{ border: "1px solid #eee", borderRadius: 12, padding: 12, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{o.name}</div>
                    <div style={{ color: "#777", fontSize: 12 }}>{o.location} · {o.phone}</div>
                  </div>
                  <div>
                    <span style={{ color: "#777", fontSize: 12, marginRight: 6 }}>Latest status:</span>
                    <span style={{ padding: "2px 8px", background: "#eef", borderRadius: 8 }}>
                      {drivers[0]?.status.replace("-", " ")}
                    </span>
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  <WaybillWidget
                    items={o.waybills}
                    onUpload={(w) =>
                      setOwners((all) => all.map((x) => (x.id === o.id ? { ...x, waybills: [w, ...x.waybills] } : x)))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {tab === "car-owner" && (
        <Section title="Car Owners">
          <CarOwnerForm carOwners={carOwners} setCarOwners={setCarOwners} />
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}>
              <thead>
                <tr>
                  <th align="left">Name</th>
                  <th align="left">Phone</th>
                  <th align="left">Ownership Doc</th>
                </tr>
              </thead>
              <tbody>
                {carOwners.map((co) => (
                  <tr key={co.id}>
                    <td>{co.name}</td>
                    <td>{co.phone}</td>
                    <td>{co.ownershipDocUrl ? <a href={co.ownershipDocUrl} target="_blank" rel="noreferrer">View</a> : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
      )}

      {tab === "admin" && (
        <Section title="Admin">
          <div style={{ display: "grid", gap: 12 }}>
            <CreateDriver onCreate={(d) => setDrivers((prev) => [{ id: crypto.randomUUID(), ...d, waybills: [], status: d.status || "idle" }, ...prev])} />
            <CreateOwner onCreate={(o) => setOwners((prev) => [{ id: crypto.randomUUID(), ...o, waybills: [] }, ...prev])} />
            <ManageTracks tracks={tracks} onToggle={(id) => setTracks((all) => all.map((t) => (t.id === id ? { ...t, isAvailable: !t.isAvailable } : t)))} />
            <Chat messages={messages} onSend={(text) => setMessages((m) => [...m, { id: crypto.randomUUID(), from: "admin", text, at: now() }])} />
          </div>
        </Section>
      )}

      <footer style={{ textAlign: "center", color: "#777", fontSize: 12 }}>
        © {new Date().getFullYear()} HeeyLogistic • Demo UI
      </footer>
    </div>
  );
}

function CreateDriver({ onCreate }) {
  const [f, setF] = useState({ name: "", address: "", driverLicense: "", truckNumber: "", phone: "", status: "idle" });
  return (
    <Section title="Create Driver">
      <FormGrid>
        <Text label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Text label="Address" value={f.address} onChange={(v) => setF({ ...f, address: v })} />
        <Text label="Driver License" value={f.driverLicense} onChange={(v) => setF({ ...f, driverLicense: v })} />
        <Text label="Truck Number" value={f.truckNumber} onChange={(v) => setF({ ...f, truckNumber: v })} />
        <Text label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
        <Select label="Status" value={f.status} onChange={(v) => setF({ ...f, status: v })} options={["idle","custom-reached","purchaser-reached"]} />
      </FormGrid>
      <div style={{ textAlign: "right" }}>
        <button onClick={() => onCreate(f)}>Save Driver</button>
      </div>
    </Section>
  );
}

function CreateOwner({ onCreate }) {
  const [f, setF] = useState({ name: "", location: "", phone: "" });
  return (
    <Section title="Create Owner">
      <FormGrid>
        <Text label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Text label="Location" value={f.location} onChange={(v) => setF({ ...f, location: v })} />
        <Text label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
      </FormGrid>
      <div style={{ textAlign: "right" }}>
        <button onClick={() => onCreate(f)}>Save Owner</button>
      </div>
    </Section>
  );
}

function CarOwnerForm({ carOwners, setCarOwners }) {
  const [f, setF] = useState({ name: "", phone: "", ownershipDocUrl: "" });
  return (
    <div>
      <FormGrid>
        <Text label="Name" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
        <Text label="Phone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
        <Text label="Ownership Doc URL" value={f.ownershipDocUrl} onChange={(v) => setF({ ...f, ownershipDocUrl: v })} />
      </FormGrid>
      <div style={{ textAlign: "right", marginTop: 8 }}>
        <button
          onClick={() =>
            setCarOwners((prev) => [{ id: crypto.randomUUID(), ...f }, ...prev])
          }
        >
          Save Car Owner
        </button>
      </div>
    </div>
  );
}

function ManageTracks({ tracks, onToggle }) {
  return (
    <Section title="Manage Tracks">
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left">Plate</th>
            <th align="left">Model</th>
            <th align="left">Available</th>
            <th align="left">Action</th>
          </tr>
        </thead>
        <tbody>
          {tracks.map((t) => (
            <tr key={t.id}>
              <td>{t.plate}</td>
              <td>{t.model ?? "—"}</td>
              <td>{t.isAvailable ? "Yes" : "No"}</td>
              <td><button onClick={() => onToggle(t.id)}>Toggle</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </Section>
  );
}

function Chat({ messages, onSend }) {
  const [text, setText] = useState("");
  return (
    <Section title="Chat (Driver ↔ Owner, Admin view)">
      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ maxHeight: 200, overflow: "auto", border: "1px solid #eee", borderRadius: 8, padding: 8, background: "#fafafa" }}>
          {messages.map((m) => (
            <div key={m.id} style={{ marginBottom: 6 }}>
              <div style={{ fontSize: 12, color: "#777" }}>{m.from} · {new Date(m.at).toLocaleString()}</div>
              <div>{m.text}</div>
            </div>
          ))}
          {!messages.length && <div style={{ color: "#777" }}>No messages yet.</div>}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input style={{ flex: 1, padding: 8 }} placeholder="Type a message" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && text.trim()) { onSend(text.trim()); setText(""); } }} />
          <button disabled={!text.trim()} onClick={() => { onSend(text.trim()); setText(""); }}>Send</button>
        </div>
      </div>
    </Section>
  );
}

function FormGrid({ children }) {
  return <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 8 }}>{children}</div>;
}
function Text({ label, value, onChange }) {
  return (
    <label style={{ display: "grid", gap: 4 }}>
      <span style={{ fontSize: 12 }}>{label}</span>
      <input style={{ padding: 8 }} value={value} onChange={(e) => onChange(e.target.value)} />
    </label>
  );
}
function Select({ label, value, onChange, options }) {
  return (
    <label style={{ display: "grid", gap: 4 }}>
      <span style={{ fontSize: 12 }}>{label}</span>
      <select style={{ padding: 8 }} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}
