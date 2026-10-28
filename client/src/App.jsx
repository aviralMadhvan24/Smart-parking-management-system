import { useEffect, useMemo, useState } from "react";
import { api } from "./api.js";

function localDateTimePlus(hours) {
  const date = new Date(Date.now() + hours * 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("spms_token") || "");
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("spms_user") || "null"); } catch { return null; }
  });
  const [mode, setMode] = useState("login");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [lots, setLots] = useState([]);
  const [slots, setSlots] = useState([]);
  const [selectedLot, setSelectedLot] = useState("");
  const [reservations, setReservations] = useState([]);
  const [summary, setSummary] = useState(null);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [booking, setBooking] = useState({
    slotId: "", vehicleNumber: "", startTime: localDateTimePlus(1), endTime: localDateTimePlus(2)
  });
  const [lotForm, setLotForm] = useState({ name: "", address: "" });
  const [slotForm, setSlotForm] = useState({ slotCode: "", type: "STANDARD", hourlyRate: 20 });

  const selectedLotName = useMemo(() => lots.find(l => l._id === selectedLot)?.name || "", [lots, selectedLot]);

  async function loadLots() {
    const result = await api("/parking-lots");
    setLots(result.data);
    if (result.data.length && !selectedLot) setSelectedLot(result.data[0]._id);
  }

  async function loadSlots(lotId) {
    if (!lotId) { setSlots([]); return; }
    const result = await api(`/parking-lots/${lotId}/slots`);
    setSlots(result.data);
  }

  async function loadReservations(authToken = token) {
    if (!authToken) return;
    const result = await api("/reservations/me", { token: authToken });
    setReservations(result.data);
  }

  async function loadAdminSummary() {
    if (!token || user?.role !== "ADMIN") return;
    const result = await api("/admin/summary", { token });
    setSummary(result.data);
  }

  async function refreshAll() {
    await loadLots();
    await loadReservations();
    await loadAdminSummary();
  }

  useEffect(() => {
    loadLots().catch(e => setError(e.message));
  }, []);

  useEffect(() => {
    if (selectedLot) loadSlots(selectedLot).catch(e => setError(e.message));
  }, [selectedLot]);

  useEffect(() => {
    if (token && user) {
      refreshAll().catch(e => setError(e.message));
    }
  }, [token, user]);

  function saveAuth(data) {
    localStorage.setItem("spms_token", data.token);
    localStorage.setItem("spms_user", JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    setNotice(`Welcome, ${data.user.name}.`);
    setError("");
  }

  async function submitAuth(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const payload = mode === "login"
        ? { email: authForm.email, password: authForm.password }
        : authForm;
      const result = await api(endpoint, { method: "POST", body: JSON.stringify(payload) });
      saveAuth(result);
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  function logout() {
    localStorage.removeItem("spms_token");
    localStorage.removeItem("spms_user");
    setToken(""); setUser(null); setReservations([]); setSummary(null);
    setNotice("You have signed out."); setError("");
  }

  async function submitBooking(event) {
    event.preventDefault();
    setBusy(true); setError(""); setNotice("");
    try {
      const result = await api("/reservations", {
        method: "POST", token,
        body: JSON.stringify({
          ...booking,
          startTime: new Date(booking.startTime).toISOString(),
          endTime: new Date(booking.endTime).toISOString()
        })
      });
      setNotice(`Reservation confirmed: ${result.data._id}`);
      setBooking(b => ({ ...b, slotId: "" }));
      await loadReservations();
      await loadSlots(selectedLot);
      await loadAdminSummary();
    } catch (e) { setError(e.message); }
    finally { setBusy(false); }
  }

  async function cancelReservation(id) {
    setError(""); setNotice("");
    try {
      await api(`/reservations/${id}/cancel`, { method: "PATCH", token });
      setNotice("Reservation cancelled.");
      await loadReservations();
      await loadSlots(selectedLot);
      await loadAdminSummary();
    } catch (e) { setError(e.message); }
  }

  async function createLot(event) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const result = await api("/admin/parking-lots", { method: "POST", token, body: JSON.stringify(lotForm) });
      setNotice(`Parking lot created: ${result.data.name}`);
      setLotForm({ name: "", address: "" });
      await loadLots();
      setSelectedLot(result.data._id);
      await loadAdminSummary();
    } catch (e) { setError(e.message); }
  }

  async function createSlot(event) {
    event.preventDefault(); setError(""); setNotice("");
    try {
      const result = await api("/admin/slots", {
        method: "POST", token,
        body: JSON.stringify({ ...slotForm, lotId: selectedLot, hourlyRate: Number(slotForm.hourlyRate) })
      });
      setNotice(`Slot created: ${result.data.slotCode}`);
      setSlotForm({ slotCode: "", type: "STANDARD", hourlyRate: 20 });
      await loadSlots(selectedLot);
      await loadAdminSummary();
    } catch (e) { setError(e.message); }
  }

  async function updateSlotStatus(id, status) {
    setError(""); setNotice("");
    try {
      await api(`/admin/slots/${id}/status`, { method: "PATCH", token, body: JSON.stringify({ status }) });
      setNotice("Slot status updated.");
      await loadSlots(selectedLot);
      await loadAdminSummary();
    } catch (e) { setError(e.message); }
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#"><span className="brand-icon">P</span><span>ParkSmart<small>SMART PARKING MANAGEMENT</small></span></a>
        <div className="top-actions">
          <span className="status-dot">● API-connected UI</span>
          {user ? <><span className="user-pill">{user.name} · {user.role}</span><button className="button button-quiet" onClick={logout}>Sign out</button></> : null}
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <div>
            <p className="eyebrow">PARKING, SIMPLIFIED</p>
            <h1>Find your space.<br /><span>Make time for more.</span></h1>
            <p className="hero-copy">Check parking slots, reserve a time window, and manage bookings from one simple dashboard.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="parking-lines"></div>
            <div className="parking-car">🚘</div>
            <div className="floating-tag"><span className="green-dot"></span> Reservations made simple</div>
          </div>
        </section>

        {notice ? <div className="alert success" role="status">{notice}</div> : null}
        {error ? <div className="alert error" role="alert">{error}</div> : null}

        {!user ? (
          <section className="auth-layout">
            <div className="panel auth-intro">
              <p className="eyebrow">GET STARTED</p>
              <h2>Your next parking spot is a few clicks away.</h2>
              <p>Sign in to book a slot or create an account to get started.</p>
              <div className="feature-line"><span>✓</span> Time-window reservations</div>
              <div className="feature-line"><span>✓</span> Booking history in one place</div>
              <div className="feature-line"><span>✓</span> Secure, role-based access</div>
            </div>
            <form className="panel form-panel" onSubmit={submitAuth}>
              <div className="tabs">
                <button type="button" className={mode === "login" ? "tab active" : "tab"} onClick={() => setMode("login")}>Sign in</button>
                <button type="button" className={mode === "register" ? "tab active" : "tab"} onClick={() => setMode("register")}>Create account</button>
              </div>
              <h2>{mode === "login" ? "Welcome back" : "Create your account"}</h2>
              <p className="muted">{mode === "login" ? "Enter your details to continue." : "Use your email to create a driver account."}</p>
              {mode === "register" ? <label>Full name<input required maxLength="80" value={authForm.name} onChange={e => setAuthForm({ ...authForm, name: e.target.value })} placeholder="Your name" /></label> : null}
              <label>Email address<input required type="email" value={authForm.email} onChange={e => setAuthForm({ ...authForm, email: e.target.value })} placeholder="you@example.com" /></label>
              <label>Password<input required minLength="8" type="password" value={authForm.password} onChange={e => setAuthForm({ ...authForm, password: e.target.value })} placeholder="At least 8 characters" /></label>
              <button className="button button-primary full" disabled={busy}>{busy ? "Please wait..." : mode === "login" ? "Sign in →" : "Create account →"}</button>
              <p className="tiny muted">Demo admin credentials are listed in the README. Change them before any public deployment.</p>
            </form>
          </section>
        ) : (
          <>
            <section className="section-heading">
              <div><p className="eyebrow">YOUR WORKSPACE</p><h2>Parking overview</h2><p className="muted">Choose a lot to see its slots and make a reservation.</p></div>
              <button className="button button-secondary" onClick={() => refreshAll().catch(e => setError(e.message))}>↻ Refresh data</button>
            </section>

            {user.role === "ADMIN" && summary ? (
              <section className="stats-grid">
                <Stat label="Active parking lots" value={summary.activeLots} icon="⌂" />
                <Stat label="Active slots" value={summary.activeSlots} icon="▦" />
                <Stat label="Maintenance slots" value={summary.maintenanceSlots} icon="⚙" />
                <Stat label="Confirmed reservations" value={summary.activeReservations} icon="✓" />
              </section>
            ) : null}

            <section className="panel parking-panel">
              <div className="panel-title-row">
                <div><p className="eyebrow">PARKING DIRECTORY</p><h2>Choose a parking lot</h2></div>
                <select aria-label="Parking lot" value={selectedLot} onChange={e => setSelectedLot(e.target.value)}>
                  {lots.length ? lots.map(lot => <option key={lot._id} value={lot._id}>{lot.name}</option>) : <option value="">No parking lots found</option>}
                </select>
              </div>
              {selectedLotName ? <p className="muted lot-address">{lots.find(l => l._id === selectedLot)?.address}</p> : null}
              <div className="legend"><span><i className="legend-box available"></i> Active slot</span><span><i className="legend-box busy"></i> Currently reserved/occupied</span><span><i className="legend-box maintenance"></i> Maintenance</span></div>
              <div className="slot-grid">
                {slots.map(slot => (
                  <button key={slot._id} className={`slot-card ${booking.slotId === slot._id ? "selected" : ""} ${slot.status !== "ACTIVE" ? "slot-disabled" : ""}`} disabled={slot.status !== "ACTIVE"} onClick={() => setBooking({ ...booking, slotId: slot._id })}>
                    <span className="slot-icon">🚗</span><strong>{slot.slotCode}</strong>
                    <span className="slot-type">{slot.type}</span>
                    <span className={`slot-status ${slot.status === "MAINTENANCE" ? "warn" : slot.currentlyOccupiedOrReserved ? "occupied" : "free"}`}>{slot.status === "MAINTENANCE" ? "Maintenance" : slot.currentlyOccupiedOrReserved ? "Reserved now" : "Select slot"}</span>
                    <span className="slot-rate">₹{slot.hourlyRate}/hour</span>
                  </button>
                ))}
                {!slots.length ? <div className="empty-state">No slots found for this lot yet.</div> : null}
              </div>
            </section>

            <section className="two-column">
              <form className="panel" onSubmit={submitBooking}>
                <p className="eyebrow">RESERVE A SLOT</p><h2>Booking details</h2><p className="muted">Select a slot above, then choose your time window.</p>
                <label>Selected slot<input readOnly value={slots.find(s => s._id === booking.slotId)?.slotCode || "Choose a slot above"} /></label>
                <label>Vehicle registration<input required maxLength="20" value={booking.vehicleNumber} onChange={e => setBooking({ ...booking, vehicleNumber: e.target.value })} placeholder="e.g. UP25AB1234" /></label>
                <div className="field-row">
                  <label>Start time<input required type="datetime-local" value={booking.startTime} onChange={e => setBooking({ ...booking, startTime: e.target.value })} /></label>
                  <label>End time<input required type="datetime-local" value={booking.endTime} onChange={e => setBooking({ ...booking, endTime: e.target.value })} /></label>
                </div>
                <button className="button button-primary full" disabled={busy || !booking.slotId}>{busy ? "Processing..." : "Confirm reservation →"}</button>
                <p className="tiny muted">Reservation is confirmed only after the server validates and saves it.</p>
              </form>

              <section className="panel">
                <p className="eyebrow">BOOKING HISTORY</p><h2>My reservations</h2><p className="muted">Your recent and upcoming parking reservations.</p>
                <div className="reservation-list">
                  {reservations.map(r => (
                    <article className="reservation-item" key={r._id}>
                      <div className="reservation-icon">P</div>
                      <div className="reservation-main">
                        <strong>{r.slotId?.slotCode || "Parking slot"}</strong>
                        <span>{r.vehicleNumber}</span>
                        <span>{new Date(r.startTime).toLocaleString()} – {new Date(r.endTime).toLocaleString()}</span>
                        <span className={`status-label ${r.status.toLowerCase()}`}>{r.status}</span>
                      </div>
                      {r.status === "CONFIRMED" ? <button className="text-button" onClick={() => cancelReservation(r._id)}>Cancel</button> : null}
                    </article>
                  ))}
                  {!reservations.length ? <div className="empty-state">No reservations yet. Choose a slot to make your first booking.</div> : null}
                </div>
              </section>
            </section>

            {user.role === "ADMIN" ? (
              <section className="panel admin-panel">
                <p className="eyebrow">ADMINISTRATION</p><h2>Manage parking inventory</h2><p className="muted">Add parking lots and slots. Administrative endpoints enforce role checks on the server.</p>
                <div className="two-column admin-forms">
                  <form onSubmit={createLot}>
                    <h3>Add a parking lot</h3>
                    <label>Lot name<input required value={lotForm.name} onChange={e => setLotForm({ ...lotForm, name: e.target.value })} placeholder="e.g. Visitor Parking" /></label>
                    <label>Address<input required value={lotForm.address} onChange={e => setLotForm({ ...lotForm, address: e.target.value })} placeholder="Building / campus address" /></label>
                    <button className="button button-secondary">Create lot</button>
                  </form>
                  <form onSubmit={createSlot}>
                    <h3>Add slot to selected lot</h3>
                    <label>Slot code<input required value={slotForm.slotCode} onChange={e => setSlotForm({ ...slotForm, slotCode: e.target.value })} placeholder="e.g. B-01" /></label>
                    <div className="field-row">
                      <label>Type<select value={slotForm.type} onChange={e => setSlotForm({ ...slotForm, type: e.target.value })}><option value="STANDARD">Standard</option><option value="ACCESSIBLE">Accessible</option><option value="EV">EV</option></select></label>
                      <label>Hourly rate (₹)<input required min="0" type="number" value={slotForm.hourlyRate} onChange={e => setSlotForm({ ...slotForm, hourlyRate: e.target.value })} /></label>
                    </div>
                    <button className="button button-secondary" disabled={!selectedLot}>Create slot</button>
                  </form>
                </div>
                <h3 className="subheading">Update slot status</h3>
                <div className="status-admin-list">
                  {slots.map(slot => <div className="status-admin-row" key={slot._id}><span><strong>{slot.slotCode}</strong><small>{slot.status}</small></span><select value={slot.status} aria-label={`Status for ${slot.slotCode}`} onChange={e => updateSlotStatus(slot._id, e.target.value)}><option value="ACTIVE">Active</option><option value="MAINTENANCE">Maintenance</option><option value="INACTIVE">Inactive</option></select></div>)}
                </div>
              </section>
            ) : null}
          </>
        )}
        <footer><span>ParkSmart · Academic Software Engineering Project</span><span>React · Express · MongoDB</span></footer>
      </main>
    </div>
  );
}

function Stat({ label, value, icon }) {
  return <div className="stat-card"><span className="stat-icon">{icon}</span><div><span className="stat-label">{label}</span><strong>{value}</strong></div></div>;
}
