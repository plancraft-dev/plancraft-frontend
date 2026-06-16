import { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const C = {
  ink: "#111210",
  paper: "#F8F7F2",
  cream: "#EFEEE8",
  emerald: "#1A3C2E",
  emeraldLt: "#2B6048",
  gold: "#B8972A",
  goldLt: "#D4AE3A",
  muted: "#72716A",
  border: "#DDDCD6",
  white: "#FFFFFF",
  red: "#C0392B",
  success: "#1A3C2E",
};

const ADMIN_PASS = "plancraft2024";

const SAMPLE_PLAN = `# BUSINESS PLAN
## FreshBox — Organic Grocery Delivery, Lahore

### EXECUTIVE SUMMARY

FreshBox is a subscription-based organic grocery delivery service targeting health-conscious middle-class households in Lahore's DHA and Gulberg areas. We source directly from verified farms in Punjab, eliminating middlemen to deliver fresher produce at 15–20% below supermarket prices. We project Rs. 8.4M revenue by end of Year 1, reaching break-even at Month 7.

### PROBLEM & OPPORTUNITY

Urban Pakistani families increasingly want organic, chemical-free produce — yet supermarkets like Carrefour and Imtiaz stock limited organic ranges at premium prices, with no traceability. The Rs. 180B+ Pakistani grocery market is shifting online; organic grocery specifically is growing at 22% YoY. No dominant player exists in Lahore's organic delivery space.

### SOLUTION & VALUE PROPOSITION

Weekly and bi-weekly subscription boxes of 8–12 seasonal organic items, delivered same-day. Direct farm partnerships mean full traceability — customers scan a QR code on each box to see the farm, harvest date, and farmer profile. Pricing: Rs. 2,500–4,500/box depending on size.

### TARGET MARKET

Primary: Households in DHA Phases 1–6 and Gulberg, monthly income Rs. 150,000+, aged 28–50, health-conscious. Market size: ~85,000 households. We target 0.8% penetration (680 subscribers) in Year 1.

### REVENUE MODEL

Year 1 projected revenue: Rs. 8.4M
Year 2 projected revenue: Rs. 19.2M
Year 3 projected revenue: Rs. 38M`;

const PLANS = [
  { id: "starter", name: "Starter", price: "Rs. 15,000", days: "3–5 days", features: ["10–15 page plan", "Executive Summary", "Market Overview", "Basic Financials", "PDF delivery"], featured: false },
  { id: "professional", name: "Professional", price: "Rs. 35,000", days: "2–3 days", features: ["20–25 page plan", "Full Market Analysis", "3-Year Projections", "Investor-Ready Format", "PDF + Word file", "1 revision round"], featured: true, badge: "MOST POPULAR" },
  { id: "premium", name: "Premium", price: "Rs. 60,000", days: "24 hours", features: ["25+ page plan", "Everything in Pro", "Pitch Deck outline", "Rush 24hr delivery", "2 revision rounds", "WhatsApp support"], featured: false },
];

const PAYMENT_METHODS = [
  { id: "easypaisa", label: "EasyPaisa", detail: "03282493302 (Abdullah Atif)" },
  { id: "jazzcash", label: "JazzCash", detail: "03282493302 (Abdullah Atif)" },
  { id: "bank", label: "Bank Transfer", detail: "Bank Alfalah · 06601009967606 · Abdullah Atif" },
];

// Global Styles
const g = {
  page: {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    background: C.paper,
    color: C.ink,
    minHeight: "100vh",
    margin: 0,
  },
  nav: {
    background: C.emerald,
    padding: "0 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    height: "60px",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },
  logo: {
    color: C.gold,
    fontSize: "17px",
    fontWeight: "bold",
    letterSpacing: "0.3px",
    cursor: "pointer",
  },
  navLinks: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },
  navBtn: (active) => ({
    background: active ? C.gold : "transparent",
    color: active ? C.ink : "rgba(255,255,255,0.75)",
    border: "none",
    padding: "8px 14px",
    fontFamily: "'Arial', sans-serif",
    fontSize: "13px",
    cursor: "pointer",
    borderRadius: "2px",
    letterSpacing: "0.3px",
  }),
  hero: {
    background: C.emerald,
    backgroundImage: "radial-gradient(ellipse at 70% 50%, #2B6048 0%, #1A3C2E 60%)",
    color: C.white,
    padding: "80px 24px 100px",
    textAlign: "center",
  },
  heroEyebrow: {
    color: C.gold,
    fontSize: "11px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    marginBottom: "24px",
    fontFamily: "'Arial', sans-serif",
  },
  heroH1: {
    fontSize: "clamp(30px, 5.5vw, 58px)",
    lineHeight: 1.08,
    fontWeight: "normal",
    maxWidth: "680px",
    margin: "0 auto 24px",
  },
  heroItalic: {
    fontStyle: "italic",
    color: C.goldLt,
  },
  heroSub: {
    color: "rgba(255,255,255,0.6)",
    fontSize: "16px",
    maxWidth: "460px",
    margin: "0 auto 40px",
    lineHeight: 1.65,
    fontFamily: "'Arial', sans-serif",
  },
  heroCta: {
    background: C.gold,
    color: C.ink,
    border: "none",
    padding: "15px 36px",
    fontSize: "15px",
    fontWeight: "bold",
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
    borderRadius: "2px",
    letterSpacing: "0.3px",
  },
  sec: {
    padding: "72px 24px",
    maxWidth: "860px",
    margin: "0 auto",
  },
  secTitle: (dark) => ({
    fontSize: "clamp(22px, 3.5vw, 32px)",
    fontWeight: "normal",
    textAlign: "center",
    marginBottom: "10px",
    color: dark ? C.white : C.ink,
  }),
  secSub: (dark) => ({
    color: dark ? "rgba(255,255,255,0.4)" : C.muted,
    textAlign: "center",
    marginBottom: "48px",
    fontFamily: "'Arial', sans-serif",
    fontSize: "14px",
  }),
  formCard: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: "4px",
    padding: "40px 32px",
    maxWidth: "660px",
    margin: "0 auto",
    boxShadow: "0 4px 32px rgba(0,0,0,0.07)",
  },
  formTitle: {
    fontSize: "24px",
    fontWeight: "normal",
    marginBottom: "6px",
    textAlign: "center",
  },
  formSub: {
    color: C.muted,
    textAlign: "center",
    marginBottom: "32px",
    fontSize: "13px",
    fontFamily: "'Arial', sans-serif",
    lineHeight: 1.5,
  },
  fg: { marginBottom: "18px" },
  label: {
    display: "block",
    fontSize: "12px",
    fontWeight: "bold",
    letterSpacing: "0.5px",
    marginBottom: "6px",
    fontFamily: "'Arial', sans-serif",
    color: C.ink,
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    padding: "10px 13px",
    border: `1px solid ${C.border}`,
    borderRadius: "2px",
    fontSize: "14px",
    fontFamily: "'Arial', sans-serif",
    background: C.paper,
    color: C.ink,
    boxSizing: "border-box",
    outline: "none",
  },
  textarea: {
    width: "100%",
    padding: "10px 13px",
    border: `1px solid ${C.border}`,
    borderRadius: "2px",
    fontSize: "14px",
    fontFamily: "'Arial', sans-serif",
    background: C.paper,
    color: C.ink,
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    minHeight: "80px",
  },
  select: {
    width: "100%",
    padding: "10px 13px",
    border: `1px solid ${C.border}`,
    borderRadius: "2px",
    fontSize: "14px",
    fontFamily: "'Arial', sans-serif",
    background: C.paper,
    color: C.ink,
    boxSizing: "border-box",
    outline: "none",
  },
  btnPrimary: {
    background: C.emerald,
    color: C.white,
    border: "none",
    padding: "13px 28px",
    fontSize: "14px",
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
    borderRadius: "2px",
    letterSpacing: "0.3px",
  },
  btnGold: {
    background: C.gold,
    color: C.ink,
    border: "none",
    padding: "13px 28px",
    fontSize: "14px",
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
    borderRadius: "2px",
    fontWeight: "bold",
  },
  btnFull: {
    width: "100%",
    background: C.emerald,
    color: C.white,
    border: "none",
    padding: "15px",
    fontSize: "15px",
    fontFamily: "'Georgia', serif",
    cursor: "pointer",
    borderRadius: "2px",
    marginTop: "8px",
    letterSpacing: "0.3px",
  },
  payBox: {
    background: C.cream,
    border: `1px solid ${C.border}`,
    borderRadius: "3px",
    padding: "24px",
    marginBottom: "20px",
  },
  payMethod: {
    background: C.white,
    border: `2px solid ${C.border}`,
    borderRadius: "3px",
    padding: "16px 20px",
    marginBottom: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  payMethodSel: {
    background: "#F0F7F4",
    border: `2px solid ${C.emerald}`,
    borderRadius: "3px",
    padding: "16px 20px",
    marginBottom: "12px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confirmBox: {
    textAlign: "center",
    padding: "60px 24px",
    maxWidth: "520px",
    margin: "0 auto",
  },
  tick: {
    width: "72px",
    height: "72px",
    background: C.emerald,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "32px",
    margin: "0 auto 24px",
  },
  footer: {
    background: C.ink,
    color: "#555",
    textAlign: "center",
    padding: "40px 24px",
    fontFamily: "'Arial', sans-serif",
    fontSize: "13px",
    borderTop: `2px solid ${C.gold}`,
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
  },
  planCard: (featured) => ({
    background: featured ? C.gold : "#1C1C1A",
    border: featured ? "none" : `1px solid #2A2A28`,
    padding: "30px 24px",
    borderRadius: "2px",
    position: "relative",
  }),
  planBadge: {
    background: C.emerald,
    color: C.white,
    fontSize: "9px",
    letterSpacing: "2.5px",
    padding: "4px 12px",
    position: "absolute",
    top: "-13px",
    left: "50%",
    transform: "translateX(-50%)",
    whiteSpace: "nowrap",
    fontFamily: "'Arial', sans-serif",
  },
  planLabel: (featured) => ({
    fontSize: "10px",
    letterSpacing: "3px",
    textTransform: "uppercase",
    color: featured ? "#5A4200" : C.gold,
    marginBottom: "10px",
    fontFamily: "'Arial', sans-serif",
  }),
  planPrice: (featured) => ({
    fontSize: "30px",
    fontWeight: "bold",
    color: featured ? C.ink : C.white,
    marginBottom: "4px",
    lineHeight: 1,
  }),
  planNote: (featured) => ({
    fontSize: "12px",
    color: featured ? "#6A5200" : "#666",
    marginBottom: "22px",
    fontFamily: "'Arial', sans-serif",
  }),
  planFeatureList: (featured) => ({
    listStyle: "none",
    padding: 0,
    margin: 0,
    fontSize: "13px",
    color: featured ? "#2A1A00" : "#CCC",
    fontFamily: "'Arial', sans-serif",
    lineHeight: 2.1,
  }),
  sampleWrap: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: "3px",
    overflow: "hidden",
    maxHeight: "520px",
    overflowY: "auto",
    boxShadow: "0 8px 40px rgba(0,0,0,0.09)",
  },
  sampleHeader: {
    background: C.emerald,
    padding: "14px 20px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    position: "sticky",
    top: 0,
  },
  sampleDot: (c) => ({ width: 10, height: 10, borderRadius: "50%", background: c }),
  sampleBody: {
    padding: "32px",
    fontFamily: "'Georgia', serif",
    fontSize: "13.5px",
    lineHeight: 1.85,
    color: C.ink,
    whiteSpace: "pre-wrap",
  },
  adminHeader: {
    background: C.ink,
    padding: "16px 24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: `2px solid ${C.gold}`,
  },
  loader: {
    textAlign: "center",
    padding: "40px",
    color: C.muted,
    fontFamily: "'Arial', sans-serif",
    fontSize: "14px",
  },
  badge: (color, bg) => ({
    display: "inline-block",
    background: bg,
    color: color,
    fontSize: "11px",
    fontFamily: "'Arial', sans-serif",
    padding: "3px 10px",
    borderRadius: "20px",
    letterSpacing: "0.5px",
  }),
  divider: {
    border: "none",
    borderTop: `1px solid ${C.border}`,
    margin: "0",
  },
};

// Helper: Simple markdown renderer
function MarkdownLite({ text }) {
  const lines = text.split("\n");
  return (
    <div>
      {lines.map((line, i) => {
        if (line.startsWith("# ")) return <h1 key={i} style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "6px", color: C.emerald }}>{line.slice(2)}</h1>;
        if (line.startsWith("## ")) return <h2 key={i} style={{ fontSize: "17px", fontWeight: "bold", marginTop: "24px", marginBottom: "4px", color: C.emerald }}>{line.slice(3)}</h2>;
        if (line.startsWith("### ")) return <h3 key={i} style={{ fontSize: "14px", fontWeight: "bold", marginTop: "16px", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px", color: C.ink }}>{line.slice(4)}</h3>;
        if (line.trim() === "") return <div key={i} style={{ height: "8px" }} />;
        return <p key={i} style={{ fontFamily: "'Arial', sans-serif", fontSize: "13px", lineHeight: 1.7, margin: "0 0 4px" }}>{line}</p>;
      })}
    </div>
  );
}

// Main App
export default function App() {
  const [page, setPage] = useState("home");
  const [selectedPlan, setSelectedPlan] = useState(PLANS[1]);
  const [payMethod, setPayMethod] = useState(null);
  const [txRef, setTxRef] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    business: "",
    industry: "",
    problem: "",
    solution: "",
    market: "",
    revenue: "",
    budget: "",
    goal: "",
  });
  const [adminPass, setAdminPass] = useState("");
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminError, setAdminError] = useState(false);
  const [orders, setOrders] = useState([]);

  const handleForm = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submitOrder = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          planId: selectedPlan.id,
          payMethod: payMethod?.label,
          txRef,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const data = await response.json();
      setPage("confirm");
      setForm({ name: "", phone: "", email: "", business: "", industry: "", problem: "", solution: "", market: "", revenue: "", budget: "", goal: "" });
      setTxRef("");
      setPayMethod(null);
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }

    setLoading(false);
  };

  const fetchOrders = async (password) => {
    try {
      const response = await fetch(`${API_URL}/api/orders?password=${password}`);
      if (!response.ok) throw new Error("Unauthorized");
      const data = await response.json();
      setOrders(data.orders || []);
    } catch {
      setAdminError(true);
    }
  };

  // HOME
  if (page === "home")
    return (
      <div style={g.page}>
        <nav style={g.nav}>
          <div style={g.logo} onClick={() => setPage("home")}>PlanCraft Pakistan</div>
          <div style={g.navLinks}>
            <button style={g.navBtn(false)} onClick={() => setPage("sample")}>See Sample</button>
            <button style={g.navBtn(false)} onClick={() => setPage("order")}>Order</button>
            <button style={g.navBtn(false)} onClick={() => setPage("admin")} title="Admin">⚙</button>
          </div>
        </nav>

        <div style={g.hero}>
          <div style={g.heroEyebrow}>Professional Business Plans · Pakistan</div>
          <h1 style={g.heroH1}>
            Your business idea,<br />
            <span style={g.heroItalic}>written to win.</span>
          </h1>
          <p style={g.heroSub}>
            Investor-ready business plans for Pakistani entrepreneurs. Delivered in 24–72 hours.
          </p>
          <button style={g.heroCta} onClick={() => setPage("order")}>Order Your Business Plan</button>
        </div>

        {/* PRICING */}
        <div style={{ background: C.ink, padding: "72px 24px" }}>
          <div style={{ maxWidth: "860px", margin: "0 auto" }}>
            <h2 style={g.secTitle(true)}>Choose your package</h2>
            <p style={g.secSub(true)}>No hidden fees. Pay once, get your plan.</p>
            <div style={g.grid3}>
              {PLANS.map(p => (
                <div key={p.id} style={g.planCard(p.featured)}>
                  {p.badge && <div style={g.planBadge}>{p.badge}</div>}
                  <div style={g.planLabel(p.featured)}>{p.name}</div>
                  <div style={g.planPrice(p.featured)}>{p.price}</div>
                  <div style={g.planNote(p.featured)}>Delivery in {p.days}</div>
                  <ul style={g.planFeatureList(p.featured)}>
                    {p.features.map(f => <li key={f}>✓ {f}</li>)}
                  </ul>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "40px" }}>
              <button style={g.heroCta} onClick={() => setPage("order")}>Get Started →</button>
            </div>
          </div>
        </div>

        <footer style={g.footer}>
          <div style={{ color: C.gold, fontSize: "16px", marginBottom: "10px", fontFamily: "'Georgia', serif" }}>PlanCraft Pakistan</div>
          <div>Professional business plans for Pakistani entrepreneurs</div>
          <div style={{ marginTop: "8px" }}>WhatsApp: <strong style={{ color: "#AAA" }}>03282493302</strong> · plancraft.pk</div>
        </footer>
      </div>
    );

  // SAMPLE
  if (page === "sample")
    return (
      <div style={g.page}>
        <nav style={g.nav}>
          <div style={g.logo} onClick={() => setPage("home")}>PlanCraft Pakistan</div>
          <div style={g.navLinks}>
            <button style={g.navBtn(false)} onClick={() => setPage("home")}>← Home</button>
            <button style={g.navBtn(true)} onClick={() => setPage("order")}>Order Now</button>
          </div>
        </nav>
        <div style={g.sec}>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <div style={g.heroEyebrow}>Sample Business Plan</div>
            <h1 style={{ fontSize: "28px", fontWeight: "normal", marginBottom: "10px" }}>FreshBox — Organic Grocery Delivery</h1>
            <button style={g.btnGold} onClick={() => setPage("order")}>Order Your Plan →</button>
          </div>
          <div style={g.sampleWrap}>
            <div style={g.sampleHeader}>
              <div style={g.sampleDot("#FF5F57")} />
              <div style={g.sampleDot("#FFBD2E")} />
              <div style={g.sampleDot("#28CA41")} />
              <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginLeft: "8px", fontFamily: "'Arial', sans-serif" }}>BusinessPlan.pdf</span>
            </div>
            <div style={g.sampleBody}>
              <MarkdownLite text={SAMPLE_PLAN} />
            </div>
          </div>
        </div>
      </div>
    );

  // ORDER
  if (page === "order")
    return (
      <div style={g.page}>
        <nav style={g.nav}>
          <div style={g.logo} onClick={() => setPage("home")}>PlanCraft Pakistan</div>
          <div style={g.navLinks}>
            <button style={g.navBtn(false)} onClick={() => setPage("home")}>← Home</button>
          </div>
        </nav>
        <div style={{ padding: "48px 16px" }}>
          <div style={g.formCard}>
            <h2 style={g.formTitle}>Order Your Business Plan</h2>
            <p style={g.formSub}>Fill this out carefully. Your answers shape the quality of your plan.</p>

            {error && <div style={{ background: "#FFE6E6", color: C.red, padding: "12px", borderRadius: "2px", marginBottom: "16px", fontFamily: "'Arial', sans-serif", fontSize: "13px" }}>⚠ {error}</div>}

            <div style={g.fg}>
              <label style={g.label}>Select Package</label>
              {PLANS.map(p => (
                <div key={p.id} style={selectedPlan.id === p.id ? { ...g.payMethodSel, marginBottom: "8px" } : { ...g.payMethod, marginBottom: "8px" }} onClick={() => setSelectedPlan(p)}>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "14px", marginBottom: "2px" }}>{p.name} — {p.price}</div>
                    <div style={{ fontSize: "12px", color: C.muted, fontFamily: "'Arial', sans-serif" }}>Delivery in {p.days}</div>
                  </div>
                  {selectedPlan.id === p.id && <span style={{ color: C.emerald, fontSize: "18px" }}>✓</span>}
                </div>
              ))}
            </div>

            <hr style={{ ...g.divider, margin: "24px 0" }} />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <div style={g.fg}>
                <label style={g.label}>Your Name *</label>
                <input name="name" style={g.input} value={form.name} onChange={handleForm} placeholder="Ahmed Khan" />
              </div>
              <div style={g.fg}>
                <label style={g.label}>WhatsApp Number *</label>
                <input name="phone" style={g.input} value={form.phone} onChange={handleForm} placeholder="0300-1234567" />
              </div>
            </div>
            <div style={g.fg}>
              <label style={g.label}>Email (optional)</label>
              <input name="email" type="email" style={g.input} value={form.email} onChange={handleForm} placeholder="ahmed@gmail.com" />
            </div>

            <hr style={{ ...g.divider, margin: "24px 0" }} />

            {[
              ["business", "Business Idea *", "e.g. Online tutoring platform for O-Level students"],
              ["industry", "Industry / Sector *", "e.g. EdTech, Food & Beverage, Retail..."],
              ["problem", "What problem does your business solve? *", "e.g. Students can't find affordable tutors"],
              ["solution", "What is your product or service? *", "e.g. Mobile app connecting students and tutors"],
              ["market", "Who is your target customer? *", "e.g. Middle-class families with kids aged 13–18"],
              ["revenue", "How will you make money? *", "e.g. 15% commission per booking + premium subscription"],
              ["budget", "What is your startup budget? *", "e.g. Rs. 800,000 for development and marketing"],
              ["goal", "What is your #1 goal in the next 12 months? *", "e.g. Reach 500 active students and Rs. 2M revenue"],
            ].map(([name, label, ph]) => (
              <div key={name} style={g.fg}>
                <label style={g.label}>{label}</label>
                {name === "business" || name === "industry" ? (
                  <input name={name} style={g.input} value={form[name]} onChange={handleForm} placeholder={ph} />
                ) : (
                  <textarea name={name} style={g.textarea} value={form[name]} onChange={handleForm} placeholder={ph} />
                )}
              </div>
            ))}

            <button
              style={g.btnFull}
              onClick={() => {
                if (!form.name || !form.phone || !form.business || !form.industry || !form.problem || !form.solution) {
                  setError("Please fill all required fields (marked with *)");
                  return;
                }
                setPage("payment");
              }}
              disabled={loading}>
              {loading ? "Processing..." : "Continue to Payment →"}
            </button>
          </div>
        </div>
      </div>
    );

  // PAYMENT
  if (page === "payment")
    return (
      <div style={g.page}>
        <nav style={g.nav}>
          <div style={g.logo} onClick={() => setPage("home")}>PlanCraft Pakistan</div>
        </nav>
        <div style={{ padding: "48px 16px" }}>
          <div style={g.formCard}>
            <h2 style={g.formTitle}>Complete Payment</h2>
            <p style={g.formSub}>Pay to confirm your order. We start writing your plan once we verify payment.</p>

            <div style={{ background: "#F0F7F4", border: `1px solid ${C.emerald}`, borderRadius: "3px", padding: "16px 20px", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "15px" }}>{selectedPlan.name} Package</div>
                  <div style={{ fontSize: "12px", color: C.muted, fontFamily: "'Arial', sans-serif", marginTop: "2px" }}>for {form.name}</div>
                </div>
                <div style={{ fontSize: "22px", fontWeight: "bold", color: C.emerald }}>{selectedPlan.price}</div>
              </div>
            </div>

            <label style={g.label}>Select payment method</label>
            {PAYMENT_METHODS.map(m => (
              <div key={m.id} style={payMethod?.id === m.id ? g.payMethodSel : g.payMethod} onClick={() => setPayMethod(m)}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{m.label}</div>
                  <div style={{ fontSize: "13px", color: C.muted, fontFamily: "'Arial', sans-serif", marginTop: "2px" }}>{m.detail}</div>
                </div>
                {payMethod?.id === m.id && <span style={{ color: C.emerald, fontSize: "20px" }}>✓</span>}
              </div>
            ))}

            {payMethod && (
              <div style={g.payBox}>
                <div style={{ fontWeight: "bold", marginBottom: "8px", fontSize: "14px" }}>Payment Instructions</div>
                <div style={{ fontFamily: "'Arial', sans-serif", fontSize: "13px", color: C.muted, lineHeight: 1.7 }}>
                  1. Send <strong style={{ color: C.ink }}>{selectedPlan.price}</strong> to <strong style={{ color: C.ink }}>{payMethod.detail}</strong><br />
                  2. WhatsApp your payment screenshot to <strong style={{ color: C.ink }}>03282493302</strong><br />
                  3. Enter your transaction reference below
                </div>
              </div>
            )}

            <div style={g.fg}>
              <label style={g.label}>Transaction Reference *</label>
              <input style={g.input} value={txRef} onChange={e => setTxRef(e.target.value)} placeholder="e.g. EP-2847561" />
            </div>

            <button
              style={g.btnFull}
              onClick={submitOrder}
              disabled={loading || !payMethod || !txRef.trim()}>
              {loading ? "Processing..." : "Confirm Order →"}
            </button>

            {error && <div style={{ color: C.red, fontSize: "13px", marginTop: "12px", textAlign: "center", fontFamily: "'Arial', sans-serif" }}>{error}</div>}
          </div>
        </div>
      </div>
    );

  // CONFIRM
  if (page === "confirm")
    return (
      <div style={g.page}>
        <nav style={g.nav}>
          <div style={g.logo} onClick={() => { setPage("home"); setForm({ name: "", phone: "", email: "", business: "", industry: "", problem: "", solution: "", market: "", revenue: "", budget: "", goal: "" }); }}>PlanCraft Pakistan</div>
        </nav>
        <div style={g.confirmBox}>
          <div style={g.tick}>✓</div>
          <h2 style={{ fontSize: "26px", fontWeight: "normal", marginBottom: "12px" }}>Order Received!</h2>
          <p style={{ color: C.muted, fontFamily: "'Arial', sans-serif", fontSize: "15px", lineHeight: 1.65, marginBottom: "28px" }}>
            Thank you, <strong>{form.name}</strong>. We've received your order.<br /><br />
            Once we confirm your payment, we'll deliver your business plan to your WhatsApp within <strong>{selectedPlan.days}</strong>.
          </p>
          <div style={{ background: C.cream, border: `1px solid ${C.border}`, borderRadius: "3px", padding: "20px", textAlign: "left", marginBottom: "28px" }}>
            <div style={{ fontFamily: "'Arial', sans-serif", fontSize: "13px", lineHeight: 2, color: C.muted }}>
              <div>📦 Package: <strong style={{ color: C.ink }}>{selectedPlan.name}</strong></div>
              <div>📱 WhatsApp: <strong style={{ color: C.ink }}>{form.phone}</strong></div>
              <div>💬 Questions? <strong style={{ color: C.ink }}>03282493302</strong></div>
            </div>
          </div>
          <button style={g.btnGold} onClick={() => { setPage("home"); setForm({ name: "", phone: "", email: "", business: "", industry: "", problem: "", solution: "", market: "", revenue: "", budget: "", goal: "" }); }}>
            Back to Home
          </button>
        </div>
      </div>
    );

  // ADMIN LOGIN
  if (page === "admin" && !adminAuth)
    return (
      <div style={g.page}>
        <nav style={g.nav}>
          <div style={g.logo} onClick={() => setPage("home")}>PlanCraft Pakistan</div>
        </nav>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "80vh", padding: "24px" }}>
          <div style={{ ...g.formCard, maxWidth: "360px" }}>
            <h2 style={g.formTitle}>Admin Access</h2>
            <div style={g.fg}>
              <label style={g.label}>Password</label>
              <input type="password" style={g.input} value={adminPass} onChange={e => setAdminPass(e.target.value)} placeholder="Enter password" />
            </div>
            {adminError && <div style={{ color: C.red, fontFamily: "'Arial', sans-serif", fontSize: "13px", marginBottom: "12px" }}>Incorrect password.</div>}
            <button
              style={g.btnFull}
              onClick={() => {
                if (adminPass === ADMIN_PASS) {
                  setAdminAuth(true);
                  setAdminError(false);
                  fetchOrders(adminPass);
                } else {
                  setAdminError(true);
                }
              }}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    );

  // ADMIN DASHBOARD
  if (page === "admin" && adminAuth)
    return (
      <div style={{ ...g.page, background: "#F2F1EC" }}>
        <div style={g.adminHeader}>
          <div style={{ color: C.gold, fontSize: "17px", fontFamily: "'Georgia', serif", fontWeight: "bold" }}>PlanCraft · Admin</div>
          <button style={{ background: C.gold, color: C.ink, border: "none", padding: "8px 16px", fontFamily: "'Arial', sans-serif", fontSize: "13px", cursor: "pointer", borderRadius: "2px" }} onClick={() => { setAdminAuth(false); setAdminPass(""); setPage("home"); }}>
            Sign Out
          </button>
        </div>
        <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 16px" }}>
          <h2 style={{ fontSize: "20px", marginBottom: "20px" }}>Orders ({orders.length})</h2>
          {orders.length === 0 && <div style={g.loader}>No orders yet. Share your website to start getting customers.</div>}
          {orders.map(order => (
            <div key={order.id} style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "3px", padding: "16px", marginBottom: "12px", fontFamily: "'Arial', sans-serif", fontSize: "13px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{order.name}</div>
                  <div style={{ color: C.muted, fontSize: "12px" }}>{order.phone}</div>
                </div>
                <span style={g.badge(C.white, order.status === "pending_payment" ? C.gold : C.emerald)}>
                  {order.status === "pending_payment" && "Pending"}
                  {order.status === "payment_received" && "Paid"}
                  {order.status === "in_progress" && "In Progress"}
                  {order.status === "delivered" && "Delivered"}
                </span>
              </div>
              <div style={{ color: C.muted }}>
                <strong>{order.business}</strong> · {order.plan_id} · {order.pay_method}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  return null;
}
