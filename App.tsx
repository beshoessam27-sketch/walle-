import { useState } from "react";

// ─── REALISTIC SAMPLE CLAIM ────────────────────────────────────────────────
const REALISTIC_CLAIM = {
  name: "Hassan Mohamed Abdel-Rahman",
  age: "47",
  gender: "male",
  insurance_id: "INS-EG-00294817",
  policy_number: "POL-2024-GRP-0041",
  plan_name: "GlobeCare Premium — Group Medical Plan",
  hospital_name: "Cairo University Hospital",
  doctor_name: "Dr. Khaled Samy Fahmy",
  specialty: "Internal Medicine — Pulmonology",
  provider_id: "PROV-EG-0034812",
  admission_date: "2025-05-03",
  discharge_date: "2025-05-08",
  visit_type: "Inpatient — Acute Admission",
  diagnosis: "J18.9 — Pneumonia, unspecified organism",
  diagnosis2: "E11.9 — Type 2 diabetes mellitus without complications",
  diagnosis3: "I10 — Essential (primary) hypertension",
  procedures:
    "CPT 99223 — Initial inpatient care (high complexity), CPT 74177 — CT Thorax with contrast, CPT 85025 — CBC x2, CPT 94640 — Nebulizer x10, ICD-10-PCS 3E0336Z — IV Ceftriaxone 2g x5",
  amount: "22530",
  notes:
    "Patient admitted via ED with moderate-to-severe community-acquired pneumonia. Known T2DM and hypertension on medication. Pre-authorization obtained: PA-2025-GRP-00291.",
  billing: [
    {
      service: "Room & Board — Semi-Private (5 nights)",
      unit: 1200,
      qty: 5,
      total: 6000,
    },
    {
      service: "Emergency Department Assessment",
      unit: 850,
      qty: 1,
      total: 850,
    },
    {
      service: "Attending Physician — Initial Consultation",
      unit: 1500,
      qty: 1,
      total: 1500,
    },
    {
      service: "Attending Physician — Daily Follow-up (4 days)",
      unit: 700,
      qty: 4,
      total: 2800,
    },
    { service: "Chest X-Ray (PA & Lateral)", unit: 450, qty: 1, total: 450 },
    {
      service: "CT Scan — Thorax with Contrast",
      unit: 3200,
      qty: 1,
      total: 3200,
    },
    { service: "Complete Blood Count (CBC)", unit: 220, qty: 2, total: 440 },
    { service: "Sputum Culture & Sensitivity", unit: 380, qty: 1, total: 380 },
    { service: "Blood Chemistry Panel", unit: 560, qty: 1, total: 560 },
    {
      service: "Ceftriaxone 2g IV — Daily (5 days)",
      unit: 185,
      qty: 5,
      total: 925,
    },
    {
      service: "Azithromycin 500mg IV (3 days)",
      unit: 210,
      qty: 3,
      total: 630,
    },
    {
      service: "Bronchodilator Nebulizer Sessions",
      unit: 150,
      qty: 10,
      total: 1500,
    },
    { service: "Nursing Care & Observation", unit: 400, qty: 5, total: 2000 },
  ],
  attachments: [
    {
      id: "ATT-001",
      type: "Admission Note",
      file: "admission_note_CLM2025-00847312.pdf",
      date: "2025-05-03",
    },
    {
      id: "ATT-002",
      type: "Radiology Report — Chest X-Ray",
      file: "xray_report_05032025.pdf",
      date: "2025-05-03",
    },
    {
      id: "ATT-003",
      type: "CT Scan Report — Thorax",
      file: "ct_thorax_report_05042025.pdf",
      date: "2025-05-04",
    },
    {
      id: "ATT-004",
      type: "Lab Results — CBC & Chemistry",
      file: "lab_results_05032025.pdf",
      date: "2025-05-03",
    },
    {
      id: "ATT-005",
      type: "Sputum Culture Report",
      file: "sputum_culture_05062025.pdf",
      date: "2025-05-06",
    },
    {
      id: "ATT-006",
      type: "Discharge Summary",
      file: "discharge_summary_CLM2025-00847312.pdf",
      date: "2025-05-08",
    },
    {
      id: "ATT-007",
      type: "Pre-Authorization Letter",
      file: "preauth_POL2024GRP0041.pdf",
      date: "2025-05-03",
    },
  ],
  file: null,
};

// ─── RULES ─────────────────────────────────────────────────────────────────
const RULES = [
  {
    id: "R001",
    condition: "MRI requires pre-approval",
    field: "procedures",
    match: "mri",
    action: "reject",
    message:
      "MRI imaging requires prior authorization before service delivery.",
  },
  {
    id: "R002",
    condition: "Cosmetic procedures excluded",
    field: "procedures",
    match: "cosmetic",
    action: "reject",
    message:
      "Cosmetic and aesthetic procedures are excluded from medical coverage.",
  },
  {
    id: "R003",
    condition: "Dental under medical policy",
    field: "procedures",
    match: "dental",
    action: "reject",
    message:
      "Dental services must be submitted under a separate dental benefits plan.",
  },
  {
    id: "R004",
    condition: "Age ≥65 coordination check",
    field: "age",
    match: ">64",
    action: "warning",
    message:
      "Patient age ≥65. Verify Medicare primary/secondary benefits coordination.",
  },
  {
    id: "R005",
    condition: "Missing diagnosis code",
    field: "diagnosis",
    match: "empty",
    action: "reject",
    message:
      "A valid ICD-10-CM diagnosis code is required for claim adjudication.",
  },
  {
    id: "R006",
    condition: "Experimental treatment exclusion",
    field: "procedures",
    match: "experimental",
    action: "reject",
    message:
      "Experimental or investigational treatments are not covered under this policy.",
  },
  {
    id: "R007",
    condition: "CT Scan authorization advisory",
    field: "procedures",
    match: "ct",
    action: "warning",
    message:
      "CT imaging may require prior authorization depending on the patient's plan tier.",
  },
  {
    id: "R008",
    condition: "Patient name required",
    field: "name",
    match: "empty",
    action: "reject",
    message: "Patient full legal name is required for claim identification.",
  },
  {
    id: "R009",
    condition: "Botox non-medical exclusion",
    field: "procedures",
    match: "botox",
    action: "reject",
    message:
      "Botulinum toxin injections for non-medical indications are not covered.",
  },
];

const SAMPLE_CLAIMS = [
  {
    name: "Ahmed Hassan",
    age: "45",
    gender: "male",
    insurance_id: "INS-EG-00183421",
    policy_number: "POL-2024-IND-0088",
    plan_name: "MediCare Plus — Individual Plan",
    hospital_name: "Ain Shams University Hospital",
    doctor_name: "Dr. Tarek Nabil Saad",
    specialty: "Orthopedics & Spine Surgery",
    provider_id: "PROV-EG-0021933",
    admission_date: "2025-04-20",
    discharge_date: "2025-04-22",
    visit_type: "Inpatient — Elective Admission",
    diagnosis: "M54.5 — Lumbalgia, unspecified",
    diagnosis2: "M51.1 — Lumbar disc degeneration",
    diagnosis3: "M47.816 — Spondylosis with radiculopathy, lumbar region",
    procedures:
      "CPT 72148 — MRI Lumbar Spine without contrast, CPT 97110 — Physical Therapy x8 sessions, CPT 99213 — Office visit moderate complexity, CPT 62323 — Epidural steroid injection",
    amount: "8750",
    notes:
      "Chronic lower back pain with radiculopathy. Conservative management failed after 6 months. Pre-auth obtained PA-2025-IND-00178.",
    billing: [
      {
        service: "Room & Board — Standard (2 nights)",
        unit: 900,
        qty: 2,
        total: 1800,
      },
      {
        service: "Attending Physician — Orthopedic Consultation",
        unit: 1200,
        qty: 1,
        total: 1200,
      },
      {
        service: "MRI Lumbar Spine (without contrast)",
        unit: 2800,
        qty: 1,
        total: 2800,
      },
      { service: "Physical Therapy Sessions", unit: 350, qty: 8, total: 2800 },
      { service: "Epidural Steroid Injection", unit: 950, qty: 1, total: 950 },
      { service: "Nursing Care & Observation", unit: 300, qty: 2, total: 600 },
    ],
    attachments: [
      {
        id: "ATT-001",
        type: "Admission Note",
        file: "admission_note_ahmed_hassan.pdf",
        date: "2025-04-20",
      },
      {
        id: "ATT-002",
        type: "MRI Report — Lumbar Spine",
        file: "mri_lumbar_04202025.pdf",
        date: "2025-04-20",
      },
      {
        id: "ATT-003",
        type: "Physical Therapy Plan",
        file: "pt_plan_ahmed_hassan.pdf",
        date: "2025-04-21",
      },
      {
        id: "ATT-004",
        type: "Pre-Authorization Letter",
        file: "preauth_PA2025IND00178.pdf",
        date: "2025-04-19",
      },
      {
        id: "ATT-005",
        type: "Discharge Summary",
        file: "discharge_ahmed_hassan.pdf",
        date: "2025-04-22",
      },
    ],
    file: null,
  },
  {
    name: "Sara Ali",
    age: "32",
    gender: "female",
    insurance_id: "INS-EG-00276554",
    policy_number: "POL-2024-GRP-0117",
    plan_name: "GlobeCare Standard — Group Plan",
    hospital_name: "Cairo University Hospital",
    doctor_name: "Dr. Hana Magdy Fouad",
    specialty: "Pulmonology & Internal Medicine",
    provider_id: "PROV-EG-0034812",
    admission_date: "2025-04-10",
    discharge_date: "2025-04-14",
    visit_type: "Inpatient — Emergency Admission",
    diagnosis: "J18.9 — Pneumonia, unspecified organism",
    diagnosis2: "J96.00 — Acute respiratory failure, unspecified",
    diagnosis3: "R05.9 — Cough, unspecified",
    procedures:
      "CPT 71046 — Chest X-Ray PA & Lateral, CPT 85025 — CBC with differential, CPT 86580 — Sputum culture & sensitivity, CPT 94640 — Nebulizer treatment x6, ICD-10-PCS 3E0336Z — IV Amoxicillin-Clavulanate x4 days",
    amount: "6400",
    notes:
      "Acute community-acquired pneumonia with early respiratory compromise. Admitted via ED. O2 saturation 88% on arrival. Responded well to IV antibiotics.",
    billing: [
      {
        service: "Room & Board — Semi-Private (4 nights)",
        unit: 1100,
        qty: 4,
        total: 4400,
      },
      {
        service: "Emergency Department Assessment",
        unit: 750,
        qty: 1,
        total: 750,
      },
      { service: "Chest X-Ray (PA & Lateral)", unit: 420, qty: 1, total: 420 },
      { service: "CBC with Differential", unit: 200, qty: 2, total: 400 },
      {
        service: "Sputum Culture & Sensitivity",
        unit: 350,
        qty: 1,
        total: 350,
      },
      {
        service: "Nebulizer Treatment Sessions",
        unit: 140,
        qty: 6,
        total: 840,
      },
      {
        service: "IV Antibiotics — Amoxicillin-Clavulanate",
        unit: 160,
        qty: 4,
        total: 640,
      },
    ],
    attachments: [
      {
        id: "ATT-001",
        type: "ED Triage Note",
        file: "ed_note_sara_ali.pdf",
        date: "2025-04-10",
      },
      {
        id: "ATT-002",
        type: "Chest X-Ray Report",
        file: "xray_report_04102025.pdf",
        date: "2025-04-10",
      },
      {
        id: "ATT-003",
        type: "Lab Results — CBC & Cultures",
        file: "lab_results_sara_ali.pdf",
        date: "2025-04-11",
      },
      {
        id: "ATT-004",
        type: "Discharge Summary",
        file: "discharge_sara_ali.pdf",
        date: "2025-04-14",
      },
    ],
    file: null,
  },
  {
    name: "Layla Mostafa",
    age: "28",
    gender: "female",
    insurance_id: "INS-EG-00341209",
    policy_number: "POL-2024-IND-0203",
    plan_name: "BasicCare — Individual Plan",
    hospital_name: "Al-Salam International Hospital",
    doctor_name: "Dr. Rania Sherif Kamal",
    specialty: "Plastic & Reconstructive Surgery",
    provider_id: "PROV-EG-0058741",
    admission_date: "2025-03-15",
    discharge_date: "2025-03-15",
    visit_type: "Outpatient — Day Surgery",
    diagnosis: "L57.0 — Actinic keratosis",
    diagnosis2: "Z41.1 — Encounter for cosmetic surgery",
    diagnosis3: "",
    procedures:
      "CPT 15820 — Cosmetic Rhinoplasty, CPT 64612 — Botulinum toxin injection (non-medical), CPT 99202 — Office visit, new patient",
    amount: "12500",
    notes:
      "Elective cosmetic procedure. Patient requests rhinoplasty and botox for aesthetic purposes. No pre-authorization obtained. Policy excludes cosmetic interventions.",
    billing: [
      {
        service: "Day Surgery — Operating Room (4 hrs)",
        unit: 4500,
        qty: 1,
        total: 4500,
      },
      {
        service: "Plastic Surgeon Fee — Rhinoplasty",
        unit: 5500,
        qty: 1,
        total: 5500,
      },
      {
        service: "Botulinum Toxin Injection (Botox)",
        unit: 1800,
        qty: 1,
        total: 1800,
      },
      { service: "Anesthesia Fee", unit: 1200, qty: 1, total: 1200 },
      { service: "Consumables & Dressings", unit: 500, qty: 1, total: 500 },
    ],
    attachments: [
      {
        id: "ATT-001",
        type: "Surgical Consent Form",
        file: "consent_layla_mostafa.pdf",
        date: "2025-03-15",
      },
      {
        id: "ATT-002",
        type: "Pre-Op Assessment",
        file: "preop_layla_mostafa.pdf",
        date: "2025-03-14",
      },
      {
        id: "ATT-003",
        type: "Operative Report",
        file: "op_report_layla_mostafa.pdf",
        date: "2025-03-15",
      },
    ],
    file: null,
  },
];

// ─── ENGINES ───────────────────────────────────────────────────────────────
function runAIModel(claim) {
  let score = 18;
  const p = (claim.procedures || "").toLowerCase();
  const d = (claim.diagnosis || "").toLowerCase();
  const age = parseInt(claim.age) || 0;
  const amt = parseFloat(claim.amount) || 0;
  if (!d) score += 26;
  if (p.includes("mri")) score += 20;
  if (
    p.includes("cosmetic") ||
    p.includes("botox") ||
    p.includes("rhinoplasty")
  )
    score += 42;
  if (p.includes("experimental")) score += 36;
  if (p.includes("dental")) score += 30;
  if (age > 65) score += 10;
  if (amt > 5000) score += 14;
  if (p.includes("x-ray") || p.includes("lab") || p.includes("cbc"))
    score -= 10;
  if (d.includes("j18") || d.includes("i10") || d.includes("e11")) score -= 8;
  score = Math.min(96, Math.max(4, score));
  const prediction =
    score >= 60 ? "Rejected" : score >= 35 ? "Needs Review" : "Approved";
  return { score, prediction };
}

function runRulesEngine(claim) {
  const violations = [],
    warnings = [];
  for (const rule of RULES) {
    const val = (claim[rule.field] || "").toString().toLowerCase();
    let hit = false;
    if (rule.match === "empty") hit = val.trim() === "";
    else if (rule.match.startsWith(">"))
      hit = parseFloat(val) > parseFloat(rule.match.slice(1));
    else hit = val.includes(rule.match);
    if (hit) (rule.action === "reject" ? violations : warnings).push(rule);
  }
  return { violations, warnings };
}

function combineResults(ai, rules) {
  let status = ai.prediction;
  if (rules.violations.length > 0) status = "Rejected";
  else if (rules.warnings.length > 0 && status === "Approved")
    status = "Needs Review";
  const suggestions = [];
  if (rules.violations.some((v) => v.message.includes("prior authorization")))
    suggestions.push(
      "Obtain written pre-authorization from the insurer prior to service delivery."
    );
  if (rules.violations.some((v) => v.message.includes("ICD-10")))
    suggestions.push(
      "Assign a valid ICD-10-CM code corresponding to the primary diagnosis."
    );
  if (
    rules.violations.some(
      (v) => v.message.includes("Cosmetic") || v.message.includes("Botox")
    )
  )
    suggestions.push(
      "Resubmit under a supplemental cosmetic or elective benefits plan if available."
    );
  if (ai.score >= 40)
    suggestions.push(
      "Review clinical documentation and ensure all supporting records are attached."
    );
  if (rules.warnings.length > 0)
    suggestions.push(
      "Resolve all advisory warnings before final submission to reduce adjudication delay."
    );
  return { status, suggestions };
}

// ─── STYLES ────────────────────────────────────────────────────────────────
const C = {
  bg: "#f4f5f7",
  surface: "#ffffff",
  border: "#d0d5dd",
  text: "#1a2332",
  sub: "#5a6474",
  muted: "#8f9aaa",
  blue: "#1a56a0",
  blueLight: "#e8f0fb",
  red: "#b91c1c",
  redLight: "#fef2f2",
  redBorder: "#fca5a5",
  amber: "#92400e",
  amberLight: "#fffbeb",
  amberBorder: "#fcd34d",
  green: "#065f46",
  greenLight: "#ecfdf5",
  greenBorder: "#6ee7b7",
  headerBg: "#1a2332",
};

const inp = {
  width: "100%",
  padding: "7px 10px",
  border: `1px solid ${C.border}`,
  borderRadius: 4,
  fontSize: 12,
  color: C.text,
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  fontFamily: "inherit",
};
const lbl = {
  fontSize: 11,
  fontWeight: 600,
  color: C.sub,
  display: "block",
  marginBottom: 4,
  textTransform: "uppercase",
  letterSpacing: "0.04em",
};

function Btn({ children, onClick, disabled, variant = "primary", small }) {
  const s = {
    primary: { background: C.blue, color: "#fff", border: "none" },
    secondary: {
      background: "#fff",
      color: C.text,
      border: `1px solid ${C.border}`,
    },
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        ...s[variant],
        borderRadius: 4,
        padding: small ? "4px 10px" : "7px 16px",
        cursor: disabled ? "default" : "pointer",
        fontSize: small ? 11 : 12,
        fontWeight: 600,
        opacity: disabled ? 0.55 : 1,
        fontFamily: "inherit",
      }}
    >
      {children}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  multiline,
  span2,
}) {
  return (
    <div style={{ gridColumn: span2 ? "span 2" : "span 1" }}>
      <label style={lbl}>{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          style={{ ...inp, resize: "vertical" }}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={inp}
        />
      )}
    </div>
  );
}

function StatusChip({ status }) {
  const cfg = {
    Approved: {
      bg: C.greenLight,
      color: C.green,
      border: C.greenBorder,
      label: "APPROVED",
    },
    Rejected: {
      bg: C.redLight,
      color: C.red,
      border: C.redBorder,
      label: "REJECTED",
    },
    "Needs Review": {
      bg: C.amberLight,
      color: C.amber,
      border: C.amberBorder,
      label: "NEEDS REVIEW",
    },
  };
  const s = cfg[status] || cfg["Needs Review"];
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        border: `1px solid ${s.border}`,
        borderRadius: 3,
        padding: "3px 10px",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
      }}
    >
      {s.label}
    </span>
  );
}

function ScoreBar({ score }) {
  const color = score < 35 ? "#16a34a" : score < 60 ? "#d97706" : "#dc2626";
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 4,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: C.sub,
            textTransform: "uppercase",
            letterSpacing: "0.04em",
          }}
        >
          Rejection Risk Score
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color }}>{score}%</span>
      </div>
      <div style={{ background: "#e5e7eb", borderRadius: 2, height: 5 }}>
        <div
          style={{
            width: `${score}%`,
            background: color,
            height: "100%",
            borderRadius: 2,
            transition: "width 0.5s ease",
          }}
        />
      </div>
    </div>
  );
}

function SectionHead({ title, sub }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${C.border}`,
        paddingBottom: 8,
        marginBottom: 14,
      }}
    >
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: C.text }}>
        {title}
      </p>
      {sub && (
        <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>{sub}</p>
      )}
    </div>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 5,
        padding: "16px 18px",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── MAIN ──────────────────────────────────────────────────────────────────
export default function WALLE() {
  const [view, setView] = useState("login");
  const [loginData, setLoginData] = useState({ user: "", pass: "" });
  const [loginErr, setLoginErr] = useState("");
  const [claim, setClaim] = useState({
    name: "",
    age: "",
    gender: "male",
    insurance_id: "",
    policy_number: "",
    plan_name: "",
    hospital_name: "",
    doctor_name: "",
    specialty: "",
    provider_id: "",
    admission_date: "",
    discharge_date: "",
    visit_type: "",
    diagnosis: "",
    diagnosis2: "",
    diagnosis3: "",
    procedures: "",
    amount: "",
    notes: "",
    billing: [],
    attachments: [],
    file: null,
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [tab, setTab] = useState("submit");

  const set = (k, v) => setClaim((p) => ({ ...p, [k]: v }));

  const handleLogin = () => {
    if (
      (loginData.user === "admin" && loginData.pass === "walle123") ||
      (loginData.user === "doctor" && loginData.pass === "health2025")
    ) {
      setLoginErr("");
      setView("app");
    } else setLoginErr("Invalid username or password.");
  };

  const processClaim = async () => {
    if (!claim.name.trim()) return alert("Patient name is required.");
    if (!claim.procedures.trim()) return alert("Procedures are required.");
    setLoading(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 800));
    const ai = runAIModel(claim);
    const rules = runRulesEngine(claim);
    const combined = combineResults(ai, rules);
    const res = {
      claim: { ...claim },
      ai,
      rules,
      combined,
      timestamp: new Date().toLocaleString(),
      id: `CLM-${Date.now().toString().slice(-6)}`,
    };
    setResult(res);
    setHistory((h) => [res, ...h].slice(0, 20));
    setLoading(false);
    setTab("result");
  };

  // ── LOGIN ──
  if (view === "login")
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#eaecef",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', Arial, sans-serif",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: `1px solid ${C.border}`,
            borderRadius: 5,
            width: 320,
            boxShadow: "0 2px 10px rgba(0,0,0,0.10)",
          }}
        >
          <div
            style={{
              background: C.headerBg,
              borderRadius: "5px 5px 0 0",
              padding: "18px 22px",
            }}
          >
            <p
              style={{
                margin: 0,
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.04em",
              }}
            >
              WALLE
            </p>
            <p style={{ margin: "2px 0 0", color: "#94a3b8", fontSize: 11 }}>
              Claims Validation & Decision Support
            </p>
          </div>
          <div style={{ padding: "22px" }}>
            <div style={{ marginBottom: 12 }}>
              <label style={lbl}>Username</label>
              <input
                value={loginData.user}
                onChange={(e) =>
                  setLoginData((p) => ({ ...p, user: e.target.value }))
                }
                placeholder="Enter username"
                style={inp}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={lbl}>Password</label>
              <input
                type="password"
                value={loginData.pass}
                onChange={(e) =>
                  setLoginData((p) => ({ ...p, pass: e.target.value }))
                }
                placeholder="Enter password"
                style={inp}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            {loginErr && (
              <div
                style={{
                  background: C.redLight,
                  border: `1px solid ${C.redBorder}`,
                  borderRadius: 3,
                  padding: "7px 10px",
                  marginBottom: 12,
                }}
              >
                <p style={{ margin: 0, color: C.red, fontSize: 11 }}>
                  {loginErr}
                </p>
              </div>
            )}
            <Btn onClick={handleLogin}>Sign In</Btn>
            <p style={{ marginTop: 12, fontSize: 11, color: C.muted }}>
              Demo: admin / walle123
            </p>
          </div>
        </div>
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: C.bg,
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      <div
        style={{
          background: C.headerBg,
          padding: "0 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 46,
          borderBottom: "2px solid #0f1929",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: "0.06em",
            }}
          >
            WALLE
          </span>
          <span style={{ color: "#475569", fontSize: 11 }}>|</span>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>
            Claims Validation & Decision Support System
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: "#94a3b8", fontSize: 11 }}>admin</span>
          <button
            onClick={() => setView("login")}
            style={{
              background: "none",
              color: "#94a3b8",
              border: "1px solid #2d3f55",
              borderRadius: 3,
              padding: "3px 9px",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            Sign Out
          </button>
        </div>
      </div>

      <div
        style={{
          background: "#fff",
          borderBottom: `1px solid ${C.border}`,
          padding: "0 22px",
          display: "flex",
        }}
      >
        {[
          ["submit", "Claim Entry"],
          ["result", "Validation Results"],
          ["rules", "Policy Rules"],
          ["history", "Claim History"],
        ].map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "none",
              border: "none",
              borderBottom:
                tab === t ? `2px solid ${C.blue}` : "2px solid transparent",
              padding: "11px 14px",
              cursor: "pointer",
              fontWeight: tab === t ? 700 : 400,
              color: tab === t ? C.blue : C.sub,
              fontSize: 12,
              fontFamily: "inherit",
              marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div style={{ padding: "18px 22px", maxWidth: 1000, margin: "0 auto" }}>
        {/* ── CLAIM ENTRY ── */}
        {tab === "submit" && (
          <div>
            <div
              style={{
                marginBottom: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
              }}
            >
              <div>
                <p
                  style={{
                    margin: 0,
                    fontSize: 14,
                    fontWeight: 700,
                    color: C.text,
                  }}
                >
                  New Claim Entry
                </p>
                <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>
                  Complete all required fields before submitting for validation
                </p>
              </div>
              <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                <span style={{ fontSize: 11, color: C.muted, marginRight: 4 }}>
                  Load sample:
                </span>
                <button
                  onClick={() => setClaim({ ...REALISTIC_CLAIM })}
                  style={{
                    background: "#fff",
                    border: `1px solid ${C.blue}`,
                    borderRadius: 3,
                    padding: "3px 9px",
                    cursor: "pointer",
                    fontSize: 11,
                    color: C.blue,
                    fontFamily: "inherit",
                    fontWeight: 600,
                  }}
                >
                  Realistic Case
                </button>
                {SAMPLE_CLAIMS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setClaim({ ...s })}
                    style={{
                      background: "#fff",
                      border: `1px solid ${C.border}`,
                      borderRadius: 3,
                      padding: "3px 9px",
                      cursor: "pointer",
                      fontSize: 11,
                      color: C.sub,
                      fontFamily: "inherit",
                    }}
                  >
                    {s.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Patient Info */}
            <Card style={{ marginBottom: 10 }}>
              <SectionHead title="1. Patient Information" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px 14px",
                }}
              >
                <Field
                  label="Full Name *"
                  value={claim.name}
                  onChange={(v) => set("name", v)}
                  placeholder="Last, First Middle"
                />
                <Field
                  label="Age *"
                  value={claim.age}
                  onChange={(v) => set("age", v)}
                  placeholder="Years"
                  type="number"
                />
                <div>
                  <label style={lbl}>Gender</label>
                  <select
                    value={claim.gender}
                    onChange={(e) => set("gender", e.target.value)}
                    style={inp}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <Field
                  label="Insurance ID"
                  value={claim.insurance_id}
                  onChange={(v) => set("insurance_id", v)}
                  placeholder="INS-EG-XXXXXXX"
                />
                <Field
                  label="Policy Number"
                  value={claim.policy_number}
                  onChange={(v) => set("policy_number", v)}
                  placeholder="POL-XXXX-XXXX"
                />
                <Field
                  label="Plan Name"
                  value={claim.plan_name}
                  onChange={(v) => set("plan_name", v)}
                  placeholder="e.g. GlobeCare Premium"
                />
              </div>
            </Card>

            {/* Provider Info */}
            <Card style={{ marginBottom: 10 }}>
              <SectionHead title="2. Provider Information" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px 14px",
                }}
              >
                <Field
                  label="Hospital Name"
                  value={claim.hospital_name}
                  onChange={(v) => set("hospital_name", v)}
                  placeholder="Hospital / Facility"
                />
                <Field
                  label="Attending Physician"
                  value={claim.doctor_name}
                  onChange={(v) => set("doctor_name", v)}
                  placeholder="Dr. Full Name"
                />
                <Field
                  label="Specialty"
                  value={claim.specialty}
                  onChange={(v) => set("specialty", v)}
                  placeholder="e.g. Internal Medicine"
                />
                <Field
                  label="Provider ID"
                  value={claim.provider_id}
                  onChange={(v) => set("provider_id", v)}
                  placeholder="PROV-EG-XXXXXX"
                />
              </div>
            </Card>

            {/* Visit Details */}
            <Card style={{ marginBottom: 10 }}>
              <SectionHead title="3. Visit Details" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "10px 14px",
                }}
              >
                <Field
                  label="Admission Date"
                  value={claim.admission_date}
                  onChange={(v) => set("admission_date", v)}
                  type="date"
                />
                <Field
                  label="Discharge Date"
                  value={claim.discharge_date}
                  onChange={(v) => set("discharge_date", v)}
                  type="date"
                />
                <Field
                  label="Visit Type"
                  value={claim.visit_type}
                  onChange={(v) => set("visit_type", v)}
                  placeholder="Inpatient / Outpatient / ER"
                />
              </div>
            </Card>

            {/* Diagnoses */}
            <Card style={{ marginBottom: 10 }}>
              <SectionHead title="4. Diagnoses — ICD-10-CM" />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <Field
                  label="Primary Diagnosis *"
                  value={claim.diagnosis}
                  onChange={(v) => set("diagnosis", v)}
                  placeholder="e.g. J18.9 — Pneumonia, unspecified organism"
                />
                <Field
                  label="Secondary Diagnosis (Comorbidity)"
                  value={claim.diagnosis2}
                  onChange={(v) => set("diagnosis2", v)}
                  placeholder="e.g. E11.9 — Type 2 Diabetes mellitus"
                />
                <Field
                  label="Additional Diagnosis"
                  value={claim.diagnosis3}
                  onChange={(v) => set("diagnosis3", v)}
                  placeholder="e.g. I10 — Essential hypertension"
                />
              </div>
            </Card>

            {/* Procedures */}
            <Card style={{ marginBottom: 10 }}>
              <SectionHead title="5. Procedures & CPT Codes *" />
              <Field
                label="Procedures / CPT / ICD-10-PCS"
                value={claim.procedures}
                onChange={(v) => set("procedures", v)}
                placeholder="e.g. CPT 99223, CPT 74177 — CT Thorax, CPT 85025 — CBC"
                multiline
              />
            </Card>

            {/* Billing */}
            <Card style={{ marginBottom: 10 }}>
              <SectionHead
                title="6. Itemized Billing"
                sub="Auto-populated when Realistic Case is loaded"
              />
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 10,
                  alignItems: "flex-end",
                }}
              >
                <div style={{ flex: 1 }}>
                  <label style={lbl}>Total Billed Amount (EGP) *</label>
                  <input
                    type="number"
                    value={claim.amount}
                    onChange={(e) => set("amount", e.target.value)}
                    placeholder="0.00"
                    style={inp}
                  />
                </div>
              </div>
              {claim.billing && claim.billing.length > 0 && (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 11,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8f9fb",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {[
                        "#",
                        "Service / Description",
                        "Unit Cost",
                        "Qty",
                        "Total",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "6px 10px",
                            textAlign:
                              h === "Unit Cost" || h === "Qty" || h === "Total"
                                ? "right"
                                : "left",
                            fontSize: 10,
                            fontWeight: 700,
                            color: C.sub,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {claim.billing.map((b, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: i % 2 === 0 ? "#fff" : "#fafafa",
                        }}
                      >
                        <td style={{ padding: "6px 10px", color: C.muted }}>
                          {String(i + 1).padStart(2, "0")}
                        </td>
                        <td style={{ padding: "6px 10px", color: C.text }}>
                          {b.service}
                        </td>
                        <td
                          style={{
                            padding: "6px 10px",
                            textAlign: "right",
                            color: C.sub,
                          }}
                        >
                          {b.unit.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: "6px 10px",
                            textAlign: "right",
                            color: C.sub,
                          }}
                        >
                          {b.qty}
                        </td>
                        <td
                          style={{
                            padding: "6px 10px",
                            textAlign: "right",
                            fontWeight: 600,
                            color: C.text,
                          }}
                        >
                          {b.total.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr
                      style={{
                        borderTop: `2px solid ${C.border}`,
                        background: "#f8f9fb",
                      }}
                    >
                      <td
                        colSpan={4}
                        style={{
                          padding: "7px 10px",
                          fontWeight: 700,
                          fontSize: 11,
                          color: C.text,
                        }}
                      >
                        TOTAL BILLED
                      </td>
                      <td
                        style={{
                          padding: "7px 10px",
                          textAlign: "right",
                          fontWeight: 700,
                          color: C.blue,
                        }}
                      >
                        {claim.billing
                          .reduce((s, b) => s + b.total, 0)
                          .toLocaleString()}{" "}
                        EGP
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}
            </Card>

            {/* Attachments */}
            <Card style={{ marginBottom: 10 }}>
              <SectionHead title="7. Attachments & Supporting Documents" />
              {claim.attachments && claim.attachments.length > 0 ? (
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 11,
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        background: "#f8f9fb",
                        borderBottom: `1px solid ${C.border}`,
                      }}
                    >
                      {["Doc ID", "Document Type", "Filename", "Date"].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              padding: "6px 10px",
                              textAlign: "left",
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.sub,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {claim.attachments.map((a, i) => (
                      <tr
                        key={i}
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: i % 2 === 0 ? "#fff" : "#fafafa",
                        }}
                      >
                        <td
                          style={{
                            padding: "6px 10px",
                            color: C.blue,
                            fontWeight: 600,
                          }}
                        >
                          {a.id}
                        </td>
                        <td style={{ padding: "6px 10px", color: C.text }}>
                          {a.type}
                        </td>
                        <td style={{ padding: "6px 10px", color: C.sub }}>
                          {a.file}
                        </td>
                        <td style={{ padding: "6px 10px", color: C.muted }}>
                          {a.date}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div
                  style={{
                    border: `1px dashed ${C.border}`,
                    borderRadius: 4,
                    padding: 14,
                    cursor: "pointer",
                    background: "#fafafa",
                  }}
                  onClick={() => document.getElementById("fu").click()}
                >
                  <input
                    id="fu"
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    style={{ display: "none" }}
                    onChange={(e) => set("file", e.target.files[0])}
                  />
                  {claim.file ? (
                    <p style={{ margin: 0, fontSize: 12, color: C.blue }}>
                      Attached: <strong>{claim.file.name}</strong>
                    </p>
                  ) : (
                    <p style={{ margin: 0, fontSize: 12, color: C.muted }}>
                      Click to attach a medical document or supporting record
                    </p>
                  )}
                </div>
              )}
              <div style={{ marginTop: 10 }}>
                <Field
                  label="Clinical Notes / Remarks"
                  value={claim.notes}
                  onChange={(v) => set("notes", v)}
                  placeholder="Supporting context, referral notes, or special circumstances"
                  multiline
                />
              </div>
            </Card>

            <div style={{ display: "flex", gap: 8 }}>
              <Btn onClick={processClaim} disabled={loading}>
                {loading ? "Processing..." : "Submit for Validation"}
              </Btn>
              <Btn
                variant="secondary"
                onClick={() =>
                  setClaim({
                    name: "",
                    age: "",
                    gender: "male",
                    insurance_id: "",
                    policy_number: "",
                    plan_name: "",
                    hospital_name: "",
                    doctor_name: "",
                    specialty: "",
                    provider_id: "",
                    admission_date: "",
                    discharge_date: "",
                    visit_type: "",
                    diagnosis: "",
                    diagnosis2: "",
                    diagnosis3: "",
                    procedures: "",
                    amount: "",
                    notes: "",
                    billing: [],
                    attachments: [],
                    file: null,
                  })
                }
              >
                Clear Form
              </Btn>
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {tab === "result" &&
          (!result ? (
            <div
              style={{ textAlign: "center", padding: "60px 0", color: C.muted }}
            >
              <p style={{ fontSize: 13 }}>
                No validation results available. Submit a claim to begin.
              </p>
              <div style={{ marginTop: 12 }}>
                <Btn onClick={() => setTab("submit")}>Go to Claim Entry</Btn>
              </div>
            </div>
          ) : (
            <div>
              <div
                style={{
                  background:
                    result.combined.status === "Approved"
                      ? C.greenLight
                      : result.combined.status === "Rejected"
                      ? C.redLight
                      : C.amberLight,
                  border: `1px solid ${
                    result.combined.status === "Approved"
                      ? C.greenBorder
                      : result.combined.status === "Rejected"
                      ? C.redBorder
                      : C.amberBorder
                  }`,
                  borderRadius: 5,
                  padding: "14px 18px",
                  marginBottom: 14,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <p
                    style={{
                      margin: "0 0 5px",
                      fontSize: 11,
                      color: C.sub,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Claim Decision — {result.id}
                  </p>
                  <StatusChip status={result.combined.status} />
                </div>
                <div
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: C.sub,
                    lineHeight: 1.8,
                  }}
                >
                  <div>
                    Patient:{" "}
                    <strong style={{ color: C.text }}>
                      {result.claim.name}
                    </strong>
                  </div>
                  <div>
                    Insurance ID:{" "}
                    <strong style={{ color: C.text }}>
                      {result.claim.insurance_id || "—"}
                    </strong>
                  </div>
                  <div>
                    Policy:{" "}
                    <strong style={{ color: C.text }}>
                      {result.claim.policy_number || "—"}
                    </strong>
                  </div>
                  <div>
                    Billed:{" "}
                    <strong style={{ color: C.text }}>
                      {parseFloat(result.claim.amount || 0).toLocaleString()}{" "}
                      EGP
                    </strong>
                  </div>
                  <div>Processed: {result.timestamp}</div>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 12,
                  marginBottom: 12,
                }}
              >
                <Card>
                  <SectionHead
                    title="Risk Assessment"
                    sub="Automated scoring based on clinical and billing patterns"
                  />
                  <ScoreBar score={result.ai.score} />
                  <div
                    style={{
                      marginTop: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        color: C.sub,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Predictive Decision
                    </span>
                    <StatusChip status={result.ai.prediction} />
                  </div>
                </Card>
                <Card>
                  <SectionHead
                    title="Policy Validation"
                    sub={`${result.rules.violations.length} violation(s) · ${result.rules.warnings.length} advisory(s)`}
                  />
                  {result.rules.violations.length === 0 &&
                  result.rules.warnings.length === 0 ? (
                    <p
                      style={{ fontSize: 12, color: C.green, fontWeight: 600 }}
                    >
                      No policy violations detected.
                    </p>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 5,
                      }}
                    >
                      {result.rules.violations.map((v, i) => (
                        <div
                          key={i}
                          style={{
                            background: C.redLight,
                            border: `1px solid ${C.redBorder}`,
                            borderRadius: 3,
                            padding: "7px 9px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.red,
                              display: "block",
                              marginBottom: 2,
                            }}
                          >
                            VIOLATION — {v.id}
                          </span>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: "#7f1d1d",
                            }}
                          >
                            {v.message}
                          </p>
                        </div>
                      ))}
                      {result.rules.warnings.map((w, i) => (
                        <div
                          key={i}
                          style={{
                            background: C.amberLight,
                            border: `1px solid ${C.amberBorder}`,
                            borderRadius: 3,
                            padding: "7px 9px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.amber,
                              display: "block",
                              marginBottom: 2,
                            }}
                          >
                            ADVISORY — {w.id}
                          </span>
                          <p
                            style={{
                              margin: 0,
                              fontSize: 11,
                              color: "#78350f",
                            }}
                          >
                            {w.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>

              {result.combined.suggestions.length > 0 && (
                <Card>
                  <SectionHead title="Recommended Corrective Actions" />
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {result.combined.suggestions.map((s, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom:
                              i < result.combined.suggestions.length - 1
                                ? `1px solid ${C.border}`
                                : "none",
                          }}
                        >
                          <td
                            style={{
                              padding: "7px 10px 7px 0",
                              width: 28,
                              verticalAlign: "top",
                            }}
                          >
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                color: C.blue,
                                background: C.blueLight,
                                borderRadius: 2,
                                padding: "2px 6px",
                              }}
                            >
                              {String(i + 1).padStart(2, "0")}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "7px 0",
                              fontSize: 12,
                              color: C.text,
                              lineHeight: 1.5,
                            }}
                          >
                            {s}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}

              {result.claim.billing && result.claim.billing.length > 0 && (
                <Card style={{ marginTop: 12 }}>
                  <SectionHead title="Submitted Itemized Billing" />
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                      fontSize: 11,
                    }}
                  >
                    <thead>
                      <tr
                        style={{
                          background: "#f8f9fb",
                          borderBottom: `1px solid ${C.border}`,
                        }}
                      >
                        {["#", "Service", "Unit", "Qty", "Total"].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "6px 10px",
                              textAlign:
                                h === "Unit" || h === "Qty" || h === "Total"
                                  ? "right"
                                  : "left",
                              fontSize: 10,
                              fontWeight: 700,
                              color: C.sub,
                              textTransform: "uppercase",
                              letterSpacing: "0.04em",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.claim.billing.map((b, i) => (
                        <tr
                          key={i}
                          style={{
                            borderBottom: `1px solid ${C.border}`,
                            background: i % 2 === 0 ? "#fff" : "#fafafa",
                          }}
                        >
                          <td style={{ padding: "6px 10px", color: C.muted }}>
                            {String(i + 1).padStart(2, "0")}
                          </td>
                          <td style={{ padding: "6px 10px", color: C.text }}>
                            {b.service}
                          </td>
                          <td
                            style={{
                              padding: "6px 10px",
                              textAlign: "right",
                              color: C.sub,
                            }}
                          >
                            {b.unit.toLocaleString()}
                          </td>
                          <td
                            style={{
                              padding: "6px 10px",
                              textAlign: "right",
                              color: C.sub,
                            }}
                          >
                            {b.qty}
                          </td>
                          <td
                            style={{
                              padding: "6px 10px",
                              textAlign: "right",
                              fontWeight: 600,
                              color: C.text,
                            }}
                          >
                            {b.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}
            </div>
          ))}

        {/* ── RULES ── */}
        {tab === "rules" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                Active Policy Rules
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>
                {RULES.length} rules active — applied to every claim submission
              </p>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                background: "#fff",
                border: `1px solid ${C.border}`,
                borderRadius: 5,
                fontSize: 12,
              }}
            >
              <thead>
                <tr
                  style={{
                    background: "#f8f9fb",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  {[
                    "Rule ID",
                    "Condition",
                    "Scope",
                    "Action",
                    "Policy Rationale",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "8px 12px",
                        textAlign: "left",
                        fontSize: 10,
                        fontWeight: 700,
                        color: C.sub,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {RULES.map((r, i) => (
                  <tr
                    key={r.id}
                    style={{
                      borderBottom:
                        i < RULES.length - 1 ? `1px solid ${C.border}` : "none",
                      background: i % 2 === 0 ? "#fff" : "#fafafa",
                    }}
                  >
                    <td
                      style={{
                        padding: "9px 12px",
                        fontWeight: 700,
                        color: C.blue,
                      }}
                    >
                      {r.id}
                    </td>
                    <td style={{ padding: "9px 12px", color: C.text }}>
                      {r.condition}
                    </td>
                    <td
                      style={{
                        padding: "9px 12px",
                        color: C.sub,
                        textTransform: "capitalize",
                      }}
                    >
                      {r.field}
                    </td>
                    <td style={{ padding: "9px 12px" }}>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 7px",
                          borderRadius: 3,
                          letterSpacing: "0.05em",
                          background:
                            r.action === "reject" ? C.redLight : C.amberLight,
                          color: r.action === "reject" ? C.red : C.amber,
                        }}
                      >
                        {r.action === "reject" ? "DENY" : "ADVISORY"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "9px 12px",
                        color: C.sub,
                        lineHeight: 1.5,
                      }}
                    >
                      {r.message}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── HISTORY ── */}
        {tab === "history" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  fontWeight: 700,
                  color: C.text,
                }}
              >
                Claim History
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 11, color: C.muted }}>
                {history.length} record(s) this session
              </p>
            </div>
            {history.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "60px 0",
                  color: C.muted,
                }}
              >
                <p style={{ fontSize: 13 }}>
                  No claims processed in this session.
                </p>
              </div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  background: "#fff",
                  border: `1px solid ${C.border}`,
                  borderRadius: 5,
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr
                    style={{
                      background: "#f8f9fb",
                      borderBottom: `1px solid ${C.border}`,
                    }}
                  >
                    {[
                      "Claim ID",
                      "Patient",
                      "Insurance ID",
                      "Procedures",
                      "Billed",
                      "Risk",
                      "Decision",
                      "Time",
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "8px 12px",
                          textAlign: "left",
                          fontSize: 10,
                          fontWeight: 700,
                          color: C.sub,
                          textTransform: "uppercase",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr
                      key={i}
                      style={{
                        borderBottom:
                          i < history.length - 1
                            ? `1px solid ${C.border}`
                            : "none",
                        background: i % 2 === 0 ? "#fff" : "#fafafa",
                      }}
                    >
                      <td
                        style={{
                          padding: "8px 12px",
                          fontWeight: 700,
                          color: C.blue,
                        }}
                      >
                        {h.id}
                      </td>
                      <td style={{ padding: "8px 12px", color: C.text }}>
                        {h.claim.name}
                      </td>
                      <td style={{ padding: "8px 12px", color: C.sub }}>
                        {h.claim.insurance_id || "—"}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          color: C.sub,
                          maxWidth: 160,
                        }}
                      >
                        <div
                          style={{
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h.claim.procedures}
                        </div>
                      </td>
                      <td style={{ padding: "8px 12px", color: C.text }}>
                        {parseFloat(h.claim.amount || 0).toLocaleString()}
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          fontWeight: 700,
                          color:
                            h.ai.score >= 60
                              ? C.red
                              : h.ai.score >= 35
                              ? "#d97706"
                              : "#16a34a",
                        }}
                      >
                        {h.ai.score}%
                      </td>
                      <td style={{ padding: "8px 12px" }}>
                        <StatusChip status={h.combined.status} />
                      </td>
                      <td
                        style={{
                          padding: "8px 12px",
                          color: C.muted,
                          whiteSpace: "nowrap",
                          fontSize: 11,
                        }}
                      >
                        {h.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
