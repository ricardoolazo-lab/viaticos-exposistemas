import { useState, useEffect, useCallback } from "react";

// ============ SUPABASE CONFIG ============
const SUPABASE_URL = "https://cexjgnehuuetixekhcvv.supabase.co";
const SUPABASE_KEY = "sb_publishable_5IPIIVf8YQ1qA0TDZX5W1g_x0Jhd3CT";

const supabase = {
  headers: (token) => ({
    "Content-Type": "application/json",
    "apikey": SUPABASE_KEY,
    "Authorization": `Bearer ${token || SUPABASE_KEY}`,
  }),
  async signIn(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "apikey": SUPABASE_KEY },
      body: JSON.stringify({ email, password }),
    });
    return res.json();
  },
  async query(table, token, params = "") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: this.headers(token),
    });
    return res.json();
  },
  async insert(table, data, token) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: { ...this.headers(token), "Prefer": "return=representation" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async update(table, id, data, token) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...this.headers(token), "Prefer": "return=representation" },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

// ============ DESIGN TOKENS ============
const C = {
  orange: "#E8871E", orangeLight: "#F5A623", teal: "#1A9B8C", tealDark: "#148577",
  bg: "#FAFAFA", card: "#FFFFFF", text: "#1A1A1A", textLight: "#6B7280",
  border: "#E5E7EB", green: "#16A34A", red: "#DC2626",
};

// ============ COMPONENTS ============
const Logo = ({ size = 28 }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{ width: size, height: size, background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: 800, fontSize: size * 0.5 }}>E</div>
    <span style={{ fontWeight: 700, fontSize: size * 0.6, color: C.text, letterSpacing: -0.5 }}>Expo<span style={{ color: C.teal }}>Sistemas</span></span>
  </div>
);

const Btn = ({ children, primary, small, onClick, full, disabled, danger }) => (
  <button onClick={onClick} disabled={disabled} style={{
    background: danger ? C.red : primary ? `linear-gradient(135deg, ${C.orange}, ${C.orangeLight})` : C.card,
    color: primary || danger ? "white" : C.text,
    border: primary || danger ? "none" : `1.5px solid ${C.border}`,
    borderRadius: 10, padding: small ? "6px 14px" : "12px 24px",
    fontWeight: 600, fontSize: small ? 12 : 14, cursor: disabled ? "not-allowed" : "pointer",
    width: full ? "100%" : "auto", opacity: disabled ? 0.5 : 1,
    boxShadow: primary ? "0 2px 8px rgba(232,135,30,0.25)" : "none",
    transition: "all 0.2s",
  }}>{children}</button>
);

const Input = ({ label, placeholder, type = "text", value, onChange, icon, required, disabled, style: st }) => (
  <div style={{ marginBottom: 14, ...st }}>
    {label && <label style={{ fontSize: 12, fontWeight: 600, color: C.textLight, marginBottom: 4, display: "block" }}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>}
    <div style={{ display: "flex", alignItems: "center", background: disabled ? "#F3F4F6" : "#F9FAFB", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", gap: 8 }}>
      {icon && <span style={{ color: C.textLight, fontSize: 16 }}>{icon}</span>}
      <input value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} type={type} disabled={disabled} style={{ border: "none", background: "transparent", flex: 1, fontSize: 14, color: C.text, outline: "none", width: "100%" }} />
    </div>
  </div>
);

const Select = ({ label, value, onChange, options, required }) => (
  <div style={{ marginBottom: 14 }}>
    <label style={{ fontSize: 12, fontWeight: 600, color: C.textLight, marginBottom: 4, display: "block" }}>{label}{required && <span style={{ color: C.red }}> *</span>}</label>
    <select value={value} onChange={e => onChange?.(e.target.value)} style={{ width: "100%", background: "#F9FAFB", border: `1.5px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 14, color: value ? C.text : C.textLight, outline: "none", appearance: "auto" }}>
      <option value="">Seleccionar...</option>
      {options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

const Card = ({ children, style }) => (
  <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 18, marginBottom: 12, boxShadow: "0 1px 3px rgba(0,0,0,0.04)", ...style }}>{children}</div>
);

const Badge = ({ text, color = C.orange }) => (
  <span style={{ background: color + "18", color, fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 20, whiteSpace: "nowrap" }}>{text}</span>
);

const Toast = ({ message, type, onClose }) => {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <div style={{ position: "fixed", top: 20, left: "50%", transform: "translateX(-50%)", background: type === "error" ? C.red : C.green, color: "white", padding: "12px 24px", borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 999, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", maxWidth: "90%", textAlign: "center" }}>{message}</div>
  );
};

const StatCard = ({ label, value, icon, color = C.orange }) => (
  <div style={{ background: C.card, borderRadius: 14, border: `1px solid ${C.border}`, padding: 16, flex: "1 1 45%", minWidth: 130 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
      <span style={{ fontSize: 10, fontWeight: 600, color: C.textLight, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</span>
      <span style={{ fontSize: 16 }}>{icon}</span>
    </div>
    <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
  </div>
);

// ============ CONCEPT ROW ============
const ConceptRow = ({ label, checked, onToggle, children }) => (
  <div style={{ borderBottom: `1px solid ${C.border}`, padding: "10px 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={onToggle}>
      <div style={{ width: 24, height: 24, borderRadius: 6, background: checked ? C.teal : "transparent", border: checked ? "none" : `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 14, fontWeight: 700, flexShrink: 0 }}>{checked ? "✓" : ""}</div>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 500, color: C.text }}>{label}</span>
    </div>
    {checked && <div style={{ marginTop: 8, marginLeft: 34 }}>{children}</div>}
  </div>
);

// ============ SCREENS ============

// --- LOGIN ---
const LoginScreen = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !pass) { setError("Completa todos los campos"); return; }
    setLoading(true); setError("");
    try {
      const data = await supabase.signIn(email, pass);
      if (data.error) { setError("Credenciales incorrectas"); setLoading(false); return; }
      const usuarios = await supabase.query("usuarios", data.access_token, `email=eq.${encodeURIComponent(email)}`);
      if (!usuarios?.length) { setError("No tienes acceso a la app"); setLoading(false); return; }
      localStorage.setItem("session", JSON.stringify({ token: data.access_token, refresh: data.refresh_token, user: usuarios[0] }));
      onLogin({ token: data.access_token, user: usuarios[0] });
    } catch { setError("Error de conexión"); }
    setLoading(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", padding: 30, background: C.bg }}>
      <div style={{ marginBottom: 30, textAlign: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, margin: "0 auto 16px", background: `linear-gradient(135deg, ${C.teal}, ${C.tealDark})`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 28, fontWeight: 800, boxShadow: `0 8px 24px ${C.teal}40` }}>E</div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: C.text }}>ExpoSistemas</h2>
        <p style={{ margin: "4px 0 0", fontSize: 13, color: C.textLight }}>Control de Viáticos</p>
      </div>
      <div style={{ width: "100%", maxWidth: 340 }}>
        {error && <div style={{ background: C.red + "15", color: C.red, padding: "10px 14px", borderRadius: 10, fontSize: 13, fontWeight: 500, marginBottom: 14 }}>{error}</div>}
        <Input label="Correo" placeholder="tu@correo.com" value={email} onChange={setEmail} icon="✉" />
        <Input label="Contraseña" placeholder="••••••••" type="password" value={pass} onChange={setPass} icon="🔒" />
        <Btn primary full onClick={handleLogin} disabled={loading}>{loading ? "Ingresando..." : "Iniciar Sesión"}</Btn>
      </div>
    </div>
  );
};

// --- FORM REGISTRO ---
const FormScreen = ({ session, onSaved }) => {
  const [eventos, setEventos] = useState([]);
  const [personal, setPersonal] = useState([]);
  const [form, setForm] = useState({ fecha: new Date().toISOString().split("T")[0], evento_id: "", operario_id: "", desayuno: false, desayuno_monto: "", almuerzo: false, almuerzo_monto: "", cena: false, cena_monto: "", lonche: false, lonche_monto: "", taxi: false, taxi_monto: "", taxi_origen: "", taxi_destino: "", horas_extras: false, horas_extras_hora_salida: "", otros: false, otros_monto: "", otros_descripcion: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    supabase.query("eventos", session.token, "activo=eq.true&order=codigo").then(setEventos);
    supabase.query("personal", session.token, "activo=eq.true&order=nombre_completo").then(setPersonal);
  }, [session.token]);

  const selectedOp = personal.find(p => p.id === form.operario_id);

  useEffect(() => {
    if (selectedOp?.domicilio && form.taxi) {
      setForm(f => ({ ...f, taxi_destino: f.taxi_destino || selectedOp.domicilio }));
    }
  }, [form.operario_id, form.taxi, selectedOp]);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const toggle = (key) => setForm(f => ({ ...f, [key]: !f[key] }));

  const total = [
    form.desayuno ? +form.desayuno_monto || 0 : 0,
    form.almuerzo ? +form.almuerzo_monto || 0 : 0,
    form.cena ? +form.cena_monto || 0 : 0,
    form.lonche ? +form.lonche_monto || 0 : 0,
    form.taxi ? +form.taxi_monto || 0 : 0,
    form.otros ? +form.otros_monto || 0 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleSave = async () => {
    if (!form.evento_id || !form.operario_id) { setToast({ message: "Selecciona evento y operario", type: "error" }); return; }
    if (!form.desayuno && !form.almuerzo && !form.cena && !form.lonche && !form.taxi && !form.horas_extras && !form.otros) { setToast({ message: "Marca al menos un concepto", type: "error" }); return; }
    if (form.otros && !form.otros_descripcion) { setToast({ message: "Describe el concepto 'Otros'", type: "error" }); return; }

    setLoading(true);
    const data = {
      fecha: form.fecha,
      evento_id: form.evento_id,
      operario_id: form.operario_id,
      coordinador_id: session.user.id,
      desayuno: form.desayuno, desayuno_monto: form.desayuno ? +form.desayuno_monto || 0 : 0,
      almuerzo: form.almuerzo, almuerzo_monto: form.almuerzo ? +form.almuerzo_monto || 0 : 0,
      cena: form.cena, cena_monto: form.cena ? +form.cena_monto || 0 : 0,
      lonche: form.lonche, lonche_monto: form.lonche ? +form.lonche_monto || 0 : 0,
      taxi: form.taxi, taxi_monto: form.taxi ? +form.taxi_monto || 0 : 0,
      taxi_origen: form.taxi ? form.taxi_origen : null,
      taxi_destino: form.taxi ? form.taxi_destino : null,
      horas_extras: form.horas_extras,
      horas_extras_hora_salida: form.horas_extras ? form.horas_extras_hora_salida || null : null,
      otros: form.otros, otros_monto: form.otros ? +form.otros_monto || 0 : 0,
      otros_descripcion: form.otros ? form.otros_descripcion : null,
    };

    const res = await supabase.insert("reportes", data, session.token);
    setLoading(false);

    if (res?.error || res?.message) {
      setToast({ message: res?.message?.includes("unique") ? "Ya existe un registro para ese operario en esa fecha y evento" : "Error al guardar: " + (res?.message || "intenta de nuevo"), type: "error" });
    } else {
      setToast({ message: "Registro guardado correctamente", type: "success" });
      setForm({ fecha: new Date().toISOString().split("T")[0], evento_id: form.evento_id, operario_id: "", desayuno: false, desayuno_monto: "", almuerzo: false, almuerzo_monto: "", cena: false, cena_monto: "", lonche: false, lonche_monto: "", taxi: false, taxi_monto: "", taxi_origen: "", taxi_destino: "", horas_extras: false, horas_extras_hora_salida: "", otros: false, otros_monto: "", otros_descripcion: "" });
      onSaved?.();
    }
  };

  return (
    <div style={{ padding: 16 }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: C.text }}>Nuevo Registro</h2>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: C.textLight }}>Registra los viáticos del día</p>

      <Card>
        <Select label="Evento / Proyecto" value={form.evento_id} onChange={v => set("evento_id", v)} required options={eventos?.map?.(e => ({ value: e.id, label: `${e.codigo} - ${e.nombre}` })) || []} />
        <Select label="Operario" value={form.operario_id} onChange={v => set("operario_id", v)} required options={personal?.map?.(p => ({ value: p.id, label: p.nombre_completo })) || []} />
        <Input label="Fecha" type="date" value={form.fecha} onChange={v => set("fecha", v)} required />
      </Card>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 6 }}>Conceptos</div>
        <ConceptRow label="Desayuno" checked={form.desayuno} onToggle={() => toggle("desayuno")}>
          <Input placeholder="Monto S/" type="number" value={form.desayuno_monto} onChange={v => set("desayuno_monto", v)} icon="S/" />
        </ConceptRow>
        <ConceptRow label="Almuerzo" checked={form.almuerzo} onToggle={() => toggle("almuerzo")}>
          <Input placeholder="Monto S/" type="number" value={form.almuerzo_monto} onChange={v => set("almuerzo_monto", v)} icon="S/" />
        </ConceptRow>
        <ConceptRow label="Cena" checked={form.cena} onToggle={() => toggle("cena")}>
          <Input placeholder="Monto S/" type="number" value={form.cena_monto} onChange={v => set("cena_monto", v)} icon="S/" />
        </ConceptRow>
        <ConceptRow label="Lonche" checked={form.lonche} onToggle={() => toggle("lonche")}>
          <Input placeholder="Monto S/" type="number" value={form.lonche_monto} onChange={v => set("lonche_monto", v)} icon="S/" />
        </ConceptRow>
        <ConceptRow label="Taxi" checked={form.taxi} onToggle={() => toggle("taxi")}>
          <Input label="Punto de partida" placeholder="Origen" value={form.taxi_origen} onChange={v => set("taxi_origen", v)} />
          <Input label="Destino" placeholder="Domicilio" value={form.taxi_destino} onChange={v => set("taxi_destino", v)} />
          <Input placeholder="Monto S/" type="number" value={form.taxi_monto} onChange={v => set("taxi_monto", v)} icon="S/" />
        </ConceptRow>
        <ConceptRow label="Horas Extras" checked={form.horas_extras} onToggle={() => toggle("horas_extras")}>
          <Input label="Hora de salida" type="time" value={form.horas_extras_hora_salida} onChange={v => set("horas_extras_hora_salida", v)} />
          <p style={{ fontSize: 11, color: C.teal, margin: "4px 0 0", fontWeight: 600 }}>✓ Autorizado por {session.user.nombre}</p>
        </ConceptRow>
        <ConceptRow label="Otros" checked={form.otros} onToggle={() => toggle("otros")}>
          <Input label="Descripción" placeholder="Detalle del gasto" value={form.otros_descripcion} onChange={v => set("otros_descripcion", v)} required />
          <Input placeholder="Monto S/" type="number" value={form.otros_monto} onChange={v => set("otros_monto", v)} icon="S/" />
        </ConceptRow>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: `2px solid ${C.border}` }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Total</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: C.orange }}>S/ {total.toFixed(2)}</span>
        </div>
      </Card>

      <Btn primary full onClick={handleSave} disabled={loading}>{loading ? "Guardando..." : "Guardar Registro"}</Btn>
    </div>
  );
};

// --- MIS REGISTROS ---
const ListScreen = ({ session }) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await supabase.query("reportes", session.token, `coordinador_id=eq.${session.user.id}&order=created_at.desc&select=*,eventos(codigo,nombre),personal(nombre_completo)`);
    setReportes(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [session]);

  useEffect(() => { load(); }, [load]);

  const getConceptos = (r) => {
    const c = [];
    if (r.desayuno) c.push("Desayuno");
    if (r.almuerzo) c.push("Almuerzo");
    if (r.cena) c.push("Cena");
    if (r.lonche) c.push("Lonche");
    if (r.taxi) c.push("Taxi");
    if (r.horas_extras) c.push("H. Extra");
    if (r.otros) c.push("Otros");
    return c.join(", ");
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: C.text }}>Mis Registros</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: C.textLight }}>{reportes.length} registros</p>
        </div>
        <Btn small onClick={load}>↻ Actualizar</Btn>
      </div>

      {loading && <p style={{ textAlign: "center", color: C.textLight, fontSize: 14 }}>Cargando...</p>}

      {!loading && reportes.length === 0 && (
        <Card style={{ textAlign: "center", padding: 30 }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
          <p style={{ color: C.textLight, fontSize: 14 }}>Aún no tienes registros</p>
        </Card>
      )}

      {reportes.map(r => (
        <Card key={r.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{r.personal?.nombre_completo}</div>
              <div style={{ fontSize: 12, color: C.textLight, marginTop: 2 }}>{r.eventos?.codigo} - {r.eventos?.nombre}</div>
            </div>
            <Badge text={r.estado === "aprobado" ? "Aprobado" : "Pendiente"} color={r.estado === "aprobado" ? C.green : C.orange} />
          </div>
          <div style={{ fontSize: 12, color: C.textLight, marginBottom: 6 }}>{getConceptos(r)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: C.textLight }}>📅 {r.fecha}</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: C.orange }}>S/ {(+r.total).toFixed(2)}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

// --- ADMIN: REPORTES ---
const AdminScreen = ({ session }) => {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState("todos");
  const [toast, setToast] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    let params = "order=created_at.desc&select=*,eventos(codigo,nombre),personal(nombre_completo),usuarios(nombre)";
    if (filtro === "pendiente") params += "&estado=eq.pendiente";
    if (filtro === "aprobado") params += "&estado=eq.aprobado";
    const data = await supabase.query("reportes", session.token, params);
    setReportes(Array.isArray(data) ? data : []);
    setLoading(false);
  }, [session, filtro]);

  useEffect(() => { load(); }, [load]);

  const aprobar = async (id) => {
    await supabase.update("reportes", id, { estado: "aprobado" }, session.token);
    setToast({ message: "Reporte aprobado", type: "success" });
    load();
  };

  const getConceptos = (r) => {
    const c = [];
    if (r.desayuno) c.push(`Desayuno S/${(+r.desayuno_monto).toFixed(2)}`);
    if (r.almuerzo) c.push(`Almuerzo S/${(+r.almuerzo_monto).toFixed(2)}`);
    if (r.cena) c.push(`Cena S/${(+r.cena_monto).toFixed(2)}`);
    if (r.lonche) c.push(`Lonche S/${(+r.lonche_monto).toFixed(2)}`);
    if (r.taxi) c.push(`Taxi S/${(+r.taxi_monto).toFixed(2)}`);
    if (r.horas_extras) c.push("H. Extra");
    if (r.otros) c.push(`Otros S/${(+r.otros_monto).toFixed(2)}`);
    return c.join(" · ");
  };

  return (
    <div style={{ padding: 16 }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: C.text }}>Reportes</h2>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: C.textLight }}>Revisar y aprobar</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 14, overflowX: "auto" }}>
        {["todos", "pendiente", "aprobado"].map(f => (
          <button key={f} onClick={() => setFiltro(f)} style={{ background: filtro === f ? C.orange + "15" : "transparent", border: `1.5px solid ${filtro === f ? C.orange : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, color: filtro === f ? C.orange : C.textLight, cursor: "pointer" }}>
            {f === "todos" ? "Todos" : f === "pendiente" ? "Pendientes" : "Aprobados"}
          </button>
        ))}
      </div>

      {loading && <p style={{ textAlign: "center", color: C.textLight }}>Cargando...</p>}

      {reportes.map(r => (
        <Card key={r.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{r.personal?.nombre_completo}</div>
            <Badge text={r.estado === "aprobado" ? "Aprobado" : "Pendiente"} color={r.estado === "aprobado" ? C.green : C.orange} />
          </div>
          <div style={{ fontSize: 12, color: C.textLight }}>{r.eventos?.codigo} - {r.eventos?.nombre}</div>
          <div style={{ fontSize: 11, color: C.textLight, margin: "4px 0" }}>📅 {r.fecha} · 👤 {r.usuarios?.nombre}</div>
          <div style={{ fontSize: 11, color: C.text, marginBottom: 6 }}>{getConceptos(r)}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: 6 }}>
              {r.estado === "pendiente" && <Btn small primary onClick={() => aprobar(r.id)}>✓ Aprobar</Btn>}
            </div>
            <span style={{ fontSize: 18, fontWeight: 800, color: C.orange }}>S/ {(+r.total).toFixed(2)}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};

// --- DASHBOARD ---
const DashboardScreen = ({ session }) => {
  const [eventos, setEventos] = useState([]);
  const [eventoId, setEventoId] = useState("");
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.query("eventos", session.token, "activo=eq.true&order=codigo").then(setEventos);
  }, [session.token]);

  useEffect(() => {
    if (!eventoId) return;
    setLoading(true);
    supabase.query("reportes", session.token, `evento_id=eq.${eventoId}&select=*,personal(nombre_completo),usuarios(nombre)`).then(data => {
      setReportes(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, [eventoId, session.token]);

  const totalGasto = reportes.reduce((s, r) => s + (+r.total || 0), 0);
  const operarios = new Set(reportes.map(r => r.operario_id)).size;
  const horasExtra = reportes.filter(r => r.horas_extras).length;

  const byConcepto = [
    { label: "Almuerzo", value: reportes.reduce((s, r) => s + (+r.almuerzo_monto || 0), 0), color: C.orange },
    { label: "Taxi", value: reportes.reduce((s, r) => s + (+r.taxi_monto || 0), 0), color: C.teal },
    { label: "Desayuno", value: reportes.reduce((s, r) => s + (+r.desayuno_monto || 0), 0), color: C.orangeLight },
    { label: "Cena", value: reportes.reduce((s, r) => s + (+r.cena_monto || 0), 0), color: C.tealDark },
    { label: "Lonche", value: reportes.reduce((s, r) => s + (+r.lonche_monto || 0), 0), color: C.textLight },
    { label: "Otros", value: reportes.reduce((s, r) => s + (+r.otros_monto || 0), 0), color: C.border },
  ].filter(c => c.value > 0).sort((a, b) => b.value - a.value);

  const maxConcepto = Math.max(...byConcepto.map(c => c.value), 1);

  const topOperarios = Object.values(reportes.reduce((acc, r) => {
    const id = r.operario_id;
    if (!acc[id]) acc[id] = { name: r.personal?.nombre_completo, total: 0 };
    acc[id].total += +r.total || 0;
    return acc;
  }, {})).sort((a, b) => b.total - a.total).slice(0, 3);

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ margin: "0 0 4px", fontSize: 18, fontWeight: 800, color: C.text }}>Dashboard</h2>
      <Select label="" value={eventoId} onChange={setEventoId} options={eventos?.map?.(e => ({ value: e.id, label: `${e.codigo} - ${e.nombre}` })) || []} />

      {!eventoId && <Card style={{ textAlign: "center", padding: 30 }}><p style={{ color: C.textLight }}>Selecciona un evento para ver el resumen</p></Card>}

      {loading && <p style={{ textAlign: "center", color: C.textLight }}>Cargando...</p>}

      {eventoId && !loading && (
        <>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
            <StatCard label="Total Viáticos" value={`S/ ${totalGasto.toFixed(2)}`} icon="💰" />
            <StatCard label="Operarios" value={operarios} icon="👷" color={C.teal} />
            <StatCard label="Horas Extra" value={horasExtra} icon="⏱" color={C.text} />
            <StatCard label="Registros" value={reportes.length} icon="📋" color={C.orangeLight} />
          </div>

          {byConcepto.length > 0 && (
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }}>Gasto por Concepto</div>
              {byConcepto.map((d, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: C.textLight, width: 65, textAlign: "right", flexShrink: 0 }}>{d.label}</span>
                  <div style={{ flex: 1, background: "#F3F4F6", borderRadius: 6, height: 22, overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 6, width: `${(d.value / maxConcepto) * 100}%`, background: d.color, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: "white" }}>S/{d.value.toFixed(0)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          )}

          {topOperarios.length > 0 && (
            <Card>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 10 }}>🏆 Top 3 Operarios</div>
              {topOperarios.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 6px", background: i === 0 ? C.orange + "08" : "transparent", borderRadius: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: "50%", background: i === 0 ? C.orange : i === 1 ? C.textLight : C.border, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                  <span style={{ flex: 1, fontSize: 12, fontWeight: 500 }}>{item.name}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: C.orange }}>S/{item.total.toFixed(2)}</span>
                </div>
              ))}
            </Card>
          )}
        </>
      )}
    </div>
  );
};

// --- GESTIÓN PERSONAL ---
const PersonalScreen = ({ session }) => {
  const [personal, setPersonal] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nombre_completo: "", cargo: "", area: "", domicilio: "" });
  const [toast, setToast] = useState(null);
  const [tab, setTab] = useState("personal");
  const [eventos, setEventos] = useState([]);
  const [eventoForm, setEventoForm] = useState({ codigo: "", nombre: "" });
  const [showEventoForm, setShowEventoForm] = useState(false);

  const loadAll = useCallback(async () => {
    setLoading(true);
    const p = await supabase.query("personal", session.token, "order=nombre_completo");
    setPersonal(Array.isArray(p) ? p : []);
    const e = await supabase.query("eventos", session.token, "order=codigo");
    setEventos(Array.isArray(e) ? e : []);
    setLoading(false);
  }, [session.token]);

  useEffect(() => { loadAll(); }, [loadAll]);

  const savePersonal = async () => {
    if (!form.nombre_completo) { setToast({ message: "El nombre es obligatorio", type: "error" }); return; }
    await supabase.insert("personal", form, session.token);
    setToast({ message: "Operario agregado", type: "success" });
    setForm({ nombre_completo: "", cargo: "", area: "", domicilio: "" });
    setShowForm(false);
    loadAll();
  };

  const saveEvento = async () => {
    if (!eventoForm.codigo || !eventoForm.nombre) { setToast({ message: "Código y nombre son obligatorios", type: "error" }); return; }
    await supabase.insert("eventos", eventoForm, session.token);
    setToast({ message: "Evento agregado", type: "success" });
    setEventoForm({ codigo: "", nombre: "" });
    setShowEventoForm(false);
    loadAll();
  };

  return (
    <div style={{ padding: 16 }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <h2 style={{ margin: "0 0 14px", fontSize: 18, fontWeight: 800, color: C.text }}>Gestión</h2>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["personal", "eventos"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? C.teal + "15" : "transparent", border: `1.5px solid ${tab === t ? C.teal : C.border}`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600, color: tab === t ? C.teal : C.textLight, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      {tab === "personal" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: C.textLight }}>{personal.length} operarios</span>
            <Btn small primary onClick={() => setShowForm(!showForm)}>{showForm ? "Cancelar" : "+ Agregar"}</Btn>
          </div>

          {showForm && (
            <Card>
              <Input label="Nombre Completo" value={form.nombre_completo} onChange={v => setForm(f => ({ ...f, nombre_completo: v }))} required placeholder="APELLIDO, Nombre" />
              <Input label="Cargo" value={form.cargo} onChange={v => setForm(f => ({ ...f, cargo: v }))} placeholder="Operario" />
              <Input label="Área" value={form.area} onChange={v => setForm(f => ({ ...f, area: v }))} placeholder="Montaje" />
              <Input label="Domicilio" value={form.domicilio} onChange={v => setForm(f => ({ ...f, domicilio: v }))} placeholder="Dirección del operario" />
              <Btn primary full onClick={savePersonal}>Guardar Operario</Btn>
            </Card>
          )}

          {personal.map(p => (
            <Card key={p.id} style={{ padding: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.nombre_completo}</div>
              <div style={{ fontSize: 12, color: C.textLight }}>{p.cargo} · {p.area}</div>
              {p.domicilio && <div style={{ fontSize: 11, color: C.textLight, marginTop: 2 }}>📍 {p.domicilio}</div>}
            </Card>
          ))}
        </>
      )}

      {tab === "eventos" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: C.textLight }}>{eventos.length} eventos</span>
            <Btn small primary onClick={() => setShowEventoForm(!showEventoForm)}>{showEventoForm ? "Cancelar" : "+ Agregar"}</Btn>
          </div>

          {showEventoForm && (
            <Card>
              <Input label="Código" value={eventoForm.codigo} onChange={v => setEventoForm(f => ({ ...f, codigo: v }))} required placeholder="EV-001" />
              <Input label="Nombre del Evento" value={eventoForm.nombre} onChange={v => setEventoForm(f => ({ ...f, nombre: v }))} required placeholder="Expo Minera 2026" />
              <Btn primary full onClick={saveEvento}>Guardar Evento</Btn>
            </Card>
          )}

          {eventos.map(e => (
            <Card key={e.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{e.nombre}</div>
                  <div style={{ fontSize: 12, color: C.textLight }}>{e.codigo}</div>
                </div>
                <Badge text={e.activo ? "Activo" : "Inactivo"} color={e.activo ? C.green : C.textLight} />
              </div>
            </Card>
          ))}
        </>
      )}
    </div>
  );
};

// ============ MAIN APP ============
export default function App() {
  const [session, setSession] = useState(null);
  const [screen, setScreen] = useState("form");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) {
      try { setSession(JSON.parse(saved)); } catch {}
    }
  }, []);

  const handleLogin = (s) => { setSession(s); setScreen("form"); };
  const handleLogout = () => { localStorage.removeItem("session"); setSession(null); };

  if (!session) return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", maxWidth: 480, margin: "0 auto" }}>
      <LoginScreen onLogin={handleLogin} />
    </div>
  );

  const rol = session.user.rol;
  const tabs = [];
  if (rol === "coordinador") { tabs.push({ id: "form", label: "Registro", icon: "📝" }, { id: "list", label: "Mis Registros", icon: "📋" }); }
  if (rol === "admin") { tabs.push({ id: "admin", label: "Reportes", icon: "📊" }, { id: "dashboard", label: "Dashboard", icon: "📈" }); }
  if (rol === "planillas") { tabs.push({ id: "gestion", label: "Gestión", icon: "👥" }, { id: "admin", label: "Reportes", icon: "📊" }); }
  if (rol === "admin") { tabs.push({ id: "gestion", label: "Gestión", icon: "👥" }); }

  const renderScreen = () => {
    switch (screen) {
      case "form": return <FormScreen session={session} onSaved={() => setRefreshKey(k => k + 1)} />;
      case "list": return <ListScreen session={session} key={refreshKey} />;
      case "admin": return <AdminScreen session={session} />;
      case "dashboard": return <DashboardScreen session={session} />;
      case "gestion": return <PersonalScreen session={session} />;
      default: return null;
    }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#F0F1F3", minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ background: C.card, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 10 }}>
        <Logo />
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: C.text }}>{session.user.nombre}</div>
            <div style={{ fontSize: 10, color: C.textLight, textTransform: "capitalize" }}>{rol}</div>
          </div>
          <button onClick={handleLogout} style={{ background: "none", border: `1.5px solid ${C.border}`, borderRadius: 8, padding: "4px 8px", fontSize: 11, color: C.textLight, cursor: "pointer" }}>Salir</button>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", background: C.bg }}>{renderScreen()}</div>

      <div style={{ background: C.card, borderTop: `1px solid ${C.border}`, padding: "6px 8px 10px", display: "flex", justifyContent: "center", gap: 4, position: "sticky", bottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setScreen(t.id)} style={{ background: screen === t.id ? C.orange + "12" : "transparent", border: "none", borderRadius: 10, padding: "6px 12px", fontSize: 11, fontWeight: screen === t.id ? 700 : 500, color: screen === t.id ? C.orange : C.textLight, cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
            <span style={{ fontSize: 16 }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
