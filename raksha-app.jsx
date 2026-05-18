import { useState, useEffect, useCallback } from "react";

var API = "http://localhost:3002";

// ═══ NIFTY DEFENCE INDEX ═══════════════════════════════════════
var NIFTY = [
  { n: "Bharat Electronics", c: "BEL", w: 29.67 }, { n: "Hindustan Aeronautics", c: "HAL", w: 24.33 },
  { n: "Solar Industries", c: "SOLARINDS", w: 11.27 }, { n: "Mazagon Dock Shipbuilders", c: "MAZDOCK", w: 8.91 },
  { n: "Bharat Forge", c: "BHARATFORG", w: 7.89 }, { n: "Bharat Dynamics", c: "BDL", w: 4.25 },
  { n: "Cochin Shipyard", c: "COCHINSHIP", w: 3.34 }, { n: "Garden Reach Shipbuilders", c: "GRSE", w: 2.45 },
  { n: "Data Patterns", c: "DATAPATTNS", w: 1.72 }, { n: "Zen Technologies", c: "ZENTEC", w: 1.23 },
  { n: "BEML", c: "BEML", w: 1.17 }, { n: "MTAR Technologies", c: "MTAR", w: 1.04 },
  { n: "Astra Microwave Products", c: "ASTRAMICRO", w: 0.85 }, { n: "Dynamatic Technologies", c: "DYNAMATECH", w: 0.64 },
  { n: "Mishra Dhatu Nigam", c: "MIDHANI", w: 0.55 }, { n: "Paras Defence", c: "PARAS", w: 0.47 },
  { n: "Cyient DLM", c: "CYIENTDLM", w: 0.22 },
];
var NM = {}; NIFTY.forEach(function(x) { NM[x.c] = x; });
function niftyInfo(name, code) {
  if (code && NM[code]) return NM[code];
  for (var i = 0; i < NIFTY.length; i++) { if (name && name.toLowerCase().indexOf(NIFTY[i].n.toLowerCase()) >= 0) return NIFTY[i]; }
  return null;
}

// ═══ STARTUP DATA ══════════════════════════════════════════════
var STARTUP_CATS = [
  { cat: "Drones & UAVs", col: "#f97316", items: [
    { n: "Raphe mPhibr", f: "$154M", r: "Series B", fo: "Carbon fiber drones & UAVs", inv: "General Catalyst", hq: "Noida" },
    { n: "ideaForge", f: "IPO '23", r: "Listed", fo: "Tactical surveillance drones", inv: "Celesta, WRV Capital", hq: "Mumbai" },
    { n: "Garuda Aerospace", f: "$30M+", r: "Series A", fo: "AI-powered drone solutions", inv: "CIIF, Venture Catalysts", hq: "Chennai" },
    { n: "DroneAcharya", f: "$4.6M", r: "IPO '22", fo: "Drone services & training", inv: "Public", hq: "Pune" },
    { n: "BonV Aero", f: "$5M+", r: "Seed", fo: "eVTOL & advanced UAVs", inv: "Undisclosed", hq: "Bengaluru" },
    { n: "Gamma Rotors", f: "$3.1M", r: "Seed", fo: "Heavy-lift cargo drones", inv: "Undisclosed", hq: "Hyderabad" },
  ]},
  { cat: "Underwater & Maritime", col: "#3b82f6", items: [
    { n: "Sagar Defence", f: "$25.4M", r: "Series B", fo: "Autonomous naval vessels", inv: "Anicut Capital, IAN", hq: "Pune" },
    { n: "EyeROV", f: "₹47Cr contract", r: "Pre-Series A", fo: "Underwater drones/ROVs", inv: "Unicorn India", hq: "Kochi" },
  ]},
  { cat: "Electro-Optics & Imaging", col: "#22c55e", items: [
    { n: "Tonbo Imaging", f: "$20.4M", r: "Series D", fo: "Night vision, thermal imaging", inv: "Tata Capital, BEL", hq: "Bengaluru" },
    { n: "AjnaLens", f: "$10M+", r: "Series A", fo: "AR/MR headsets for defence", inv: "Infosys, Rajan Anandan", hq: "Mumbai" },
  ]},
  { cat: "Space & Satellites", col: "#a855f7", items: [
    { n: "NewSpace Research", f: "$33M", r: "Series B", fo: "Defence satellites & ISR", inv: "Pavestone Capital", hq: "Bengaluru" },
    { n: "Constelli", f: "$3M", r: "Seed", fo: "Satellite swarm intelligence", inv: "Undisclosed", hq: "Bengaluru" },
    { n: "Tsalla Aerospace", f: "Raising $8M", r: "Seed", fo: "AI autonomy systems", inv: "IISc, SIDBI", hq: "Bengaluru" },
  ]},
  { cat: "Munitions & Defence Systems", col: "#ef4444", items: [
    { n: "Big Bang Boom", f: "$29.9M", r: "Series C", fo: "Advanced munitions", inv: "Inflexor, Auxano", hq: "Pune" },
    { n: "Optimized Electrotech", f: "$8M+", r: "Series A", fo: "Defence electronics & EW", inv: "Undisclosed", hq: "Pune" },
    { n: "AGNIT Semi", f: "$5M+", r: "Series A", fo: "GaN for radars", inv: "Undisclosed", hq: "Bengaluru" },
  ]},
  { cat: "Cyber & AI", col: "#06b6d4", items: [
    { n: "Cron AI", f: "$5M+", r: "Series A", fo: "AI perimeter security", inv: "Unicorn India", hq: "Gurgaon" },
    { n: "Ulook", f: "Early", r: "Seed", fo: "Autonomous RF sensing", inv: "Undisclosed", hq: "Bengaluru" },
  ]},
];

// ═══ RESEARCH REPORTS ══════════════════════════════════════════
var REPORTS = [
  { t: "India Defence Tech: $711M Capital, 2x Step-Up in 2025", s: "Tracxn", d: "Jan 2026", tags: ["VC","Startups"], url: "https://w.tracxn.com/report-releases/india-defence-tech-report-2026", col: "#f97316" },
  { t: "Defence Sector Thematic — HAL, BEL, BDL Deep Dive", s: "HDFC Securities", d: "Mar 2026", tags: ["Equity","Exports"], url: "https://static.hdfcsec.com/research/reports/019cc2318f7d77b3abd90a62f9c3d395.pdf", col: "#3b82f6" },
  { t: "Major Sector Inflection: India Defense & Aerospace", s: "Gymkhana Partners", d: "Dec 2025", tags: ["Sector","VC"], url: "https://www.gymkhanapartners.com/dispatches/major-sector-inflection-india-defense-and-aerospace", col: "#22c55e" },
  { t: "India Defense Market — $37.57B by 2030", s: "Mordor Intelligence", d: "2025", tags: ["Market","Forecast"], url: "https://www.mordorintelligence.com/industry-reports/india-defense-market", col: "#a855f7" },
  { t: "India's Defence Leap — Government Whitepaper", s: "PIB", d: "Jun 2025", tags: ["Government"], url: "https://static.pib.gov.in/WriteReadData/specificdocs/documents/2025/jun/doc2025610567901.pdf", col: "#ec4899" },
  { t: "Defence Manufacturing Industry Analysis", s: "IBEF", d: "2025", tags: ["Industry","Data"], url: "https://www.ibef.org/industry/defence-manufacturing-presentation", col: "#f59e0b" },
  { t: "India Defense Acquisition — $41.7B by 2030", s: "GlobalData", d: "2025", tags: ["Budget"], url: "https://www.globaldata.com/store/report/india-defense-market-analysis/", col: "#06b6d4" },
  { t: "Defence Build-Up 2025 — Year Review", s: "Raksha Anirveda", d: "Dec 2025", tags: ["Review"], url: "https://raksha-anirveda.com/indias-defence-build-up-accelerated-in-2025/", col: "#8b5cf6" },
];

var REBAL = {
  "Mar 26": { HAL:"Hold",BEL:"Buy",BDL:"Hold",MAZDOCK:"Buy",COCHINSHIP:"Hold",DATAPATTNS:"Buy",PARAS:"Hold",BEML:"Sell",SOLARINDS:"Buy",GRSE:"Hold",ZENTEC:"Buy",MIDHANI:"Hold",ASTRAMICRO:"Buy",BHARATFORG:"Hold",MTAR:"Buy" },
  "Feb 26": { HAL:"Buy",BEL:"Buy",BDL:"Hold",MAZDOCK:"Hold",COCHINSHIP:"Buy",DATAPATTNS:"Hold",PARAS:"Hold",BEML:"Hold",SOLARINDS:"Buy",GRSE:"Buy",ZENTEC:"Hold",MIDHANI:"Hold",ASTRAMICRO:"Hold",BHARATFORG:"Hold",MTAR:"Hold" },
  "Jan 26": { HAL:"Buy",BEL:"Hold",BDL:"Buy",MAZDOCK:"Buy",COCHINSHIP:"Hold",DATAPATTNS:"Buy",PARAS:"Buy",BEML:"Hold",SOLARINDS:"Hold",GRSE:"Hold",ZENTEC:"Buy",MIDHANI:"Buy",ASTRAMICRO:"Hold",BHARATFORG:"Buy",MTAR:"Hold" },
};

// ═══ API ════════════════════════════════════════════════════════
function apiFetch(path, key) { return fetch(API + path, { headers: { "X-Api-Key": key } }).then(function(r) { if (!r.ok) throw new Error("API " + r.status); return r.json(); }); }
function smartFetch(key, code, name) {
  var tries = [code, name]; if (name) { var w = name.split(" ")[0]; if (w.length > 2) tries.push(w); }
  return tries.reduce(function(p, q) { return p.then(function(r) { if (r) return r; return apiFetch("/stock?name=" + encodeURIComponent(q), key).then(function(d) { return d && (d.companyName || d.currentPrice) ? d : null; }).catch(function() { return null; }); }); }, Promise.resolve(null));
}
function smartStats(key, code, name, stat) {
  return [code, name].reduce(function(p, q) { return p.then(function(r) { if (r) return r; return apiFetch("/historical_stats?stock_name=" + encodeURIComponent(q) + "&stats=" + stat, key).then(function(d) { return d && Object.keys(d).length ? d : null; }).catch(function() { return null; }); }); }, Promise.resolve(null));
}
function smartHist(key, code, name, period) {
  return [code, name].reduce(function(p, q) { return p.then(function(r) { if (r) return r; return apiFetch("/historical_data?stock_name=" + encodeURIComponent(q) + "&period=" + period + "&filter=price", key).then(function(d) { var v = null; if (d && d.datasets) d.datasets.forEach(function(ds) { if (ds.metric === "Price") v = ds.values; }); return v && v.length ? v : null; }).catch(function() { return null; }); }); }, Promise.resolve(null));
}

// ═══ THEME ══════════════════════════════════════════════════════
var themes = {
  dark: { bg: "#060a12", bg2: "rgba(255,255,255,.025)", bg3: "rgba(255,255,255,.04)", border: "rgba(255,255,255,.05)", text: "#e2e8f0", text2: "#94a3b8", text3: "#475569", headerBg: "rgba(6,10,18,.92)", sidebarBg: "rgba(10,14,23,.97)" },
  light: { bg: "#f8fafc", bg2: "#ffffff", bg3: "#f1f5f9", border: "#e2e8f0", text: "#1e293b", text2: "#64748b", text3: "#94a3b8", headerBg: "rgba(248,250,252,.95)", sidebarBg: "#ffffff" },
};

// ═══ HELPERS ════════════════════════════════════════════════════
function flattenMetrics(km) {
  var flat = [];
  function ex(o) { if (Array.isArray(o)) o.forEach(function(i) { if (i && i.displayName && i.value != null && String(i.value) !== "null") flat.push({ l: i.displayName, v: i.value }); }); else if (typeof o === "object" && o !== null) Object.values(o).forEach(ex); }
  ex(km);
  var pri = ["P/E","ROE","ROCE","Return on","Debt","EPS","Book Value","Dividend","Operating Margin","Net Profit Margin","Gross Margin"];
  flat.sort(function(a, b) { var as = 99, bs = 99; pri.forEach(function(p, i) { if (a.l.indexOf(p) >= 0 && as === 99) as = i; if (b.l.indexOf(p) >= 0 && bs === 99) bs = i; }); return as - bs; });
  return flat;
}

function safeStr(v) {
  if (v == null) return "—";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) {
    if (v.length && v[0] && v[0].displayName && v[0].value !== undefined) return v.filter(function(i) { return i.value != null && String(i.value) !== "null"; }).map(function(i) { return i.displayName + ": " + i.value; }).join(", ");
    if (v.length && v[0] && (v[0].firstName || v[0].lastName)) return v.map(function(p) { var nm = [p.firstName, p.mI, p.lastName].filter(Boolean).join(" "); var role = p.title && typeof p.title === "object" ? (p.title.Value || "") : (p.title || ""); return nm + (role ? " — " + role : "") + (p.age ? " (" + p.age + ")" : ""); }).join("\n");
    if (v.length && v[0] && v[0].companyName) return v.map(function(p) { return [p.companyName, p.price ? "₹" + Number(p.price).toLocaleString("en-IN") : "", p.priceToEarningsValueRatio ? "P/E:" + p.priceToEarningsValueRatio : "", p.marketCap ? "MCap:₹" + Number(p.marketCap).toLocaleString("en-IN") + "Cr" : ""].filter(Boolean).join(" · "); }).join("\n");
    return v.slice(0, 5).map(function(i) { return typeof i === "object" ? JSON.stringify(i).slice(0, 100) : String(i); }).join(", ");
  }
  if (typeof v === "object") { var ks = Object.keys(v); if (ks.length === 1 && Array.isArray(v[ks[0]])) return safeStr(v[ks[0]]); var uf = ["Value","value","name","displayName","description"].find(function(f) { return typeof v[f] === "string"; }); if (uf) return v[uf]; return JSON.stringify(v).slice(0, 200); }
  return String(v);
}

// ═══ MAIN APP ══════════════════════════════════════════════════
var TABS = [
  { id: "dash", label: "Dashboard", icon: "◉" },
  { id: "stocks", label: "Stocks", icon: "◈" },
  { id: "news", label: "News", icon: "◎" },
  { id: "startups", label: "Startups", icon: "◆" },
  { id: "research", label: "Research", icon: "◇" },
  { id: "ratios", label: "Ratios", icon: "⊞" },
  { id: "portfolio", label: "Portfolio", icon: "⊕" },
  { id: "rebalance", label: "Rebalance", icon: "⟳" },
];

export default function App() {
  var [key, setKey] = useState(""); var [keyIn, setKeyIn] = useState(""); var [ok, setOk] = useState(false); var [authErr, setAuthErr] = useState(""); var [authLd, setAuthLd] = useState(false);
  var [dark, setDark] = useState(true); var T = dark ? themes.dark : themes.light;
  var [tab, setTab] = useState("dash"); var [search, setSearch] = useState("");
  var [stocks, setStocks] = useState([]); var [stkLd, setStkLd] = useState(false);
  var [selCode, setSelCode] = useState(null); var [selName, setSelName] = useState(null);
  var [selD, setSelD] = useState(null); var [selLd, setSelLd] = useState(false); var [selErr, setSelErr] = useState("");
  var [hist, setHist] = useState([]); var [histP, setHistP] = useState("1yr"); var [histLd, setHistLd] = useState(false);
  var [qtr, setQtr] = useState(null); var [target, setTarget] = useState(null);
  var [cmpC, setCmpC] = useState([]); var [cmpD, setCmpD] = useState({});
  var [newsMap, setNewsMap] = useState({}); var [newsLd, setNewsLd] = useState(false); var [newsDone, setNewsDone] = useState(false);
  var [newsMo, setNewsMo] = useState(new Date().getMonth()); var [newsYr, setNewsYr] = useState(new Date().getFullYear());
  var [sbO, setSbO] = useState(false); var [sbC, setSbC] = useState(null);
  var [selMo, setSelMo] = useState("Mar 26"); var [corpus, setCorpus] = useState(1000000);
  var [startupCat, setStartupCat] = useState("all");

  useEffect(function() { function h(e) { if (e.key === "Escape") setSbO(false); } document.addEventListener("keydown", h); return function() { document.removeEventListener("keydown", h); }; }, []);

  // Connect
  var conn = function() { setAuthErr(""); setAuthLd(true); apiFetch("/stock?name=HAL", keyIn).then(function(d) { if (!d || (!d.companyName && !d.tickerId)) throw new Error("Bad response"); setKey(keyIn); setOk(true); }).catch(function(e) { setAuthErr(e.message); }).finally(function() { setAuthLd(false); }); };

  // Discover stocks
  useEffect(function() { if (!key) return; setStkLd(true);
    Promise.all(["defence","aerospace","shipbuilding","ammunition","missile","military"].map(function(q) { return apiFetch("/industry_search?query=" + q, key).catch(function() { return []; }); })).then(function(res) {
      var map = {}; res.forEach(function(arr) { if (Array.isArray(arr)) arr.forEach(function(s) { if (s && s.id) map[s.id] = s; }); });
      var list = Object.values(map).map(function(s) { var ni = niftyInfo(s.commonName, s.exchangeCodeNsi); return Object.assign({}, s, { isNifty: !!ni, nWt: ni ? ni.w : null }); });
      var found = {}; list.forEach(function(s) { if (s.isNifty) found[s.exchangeCodeNsi] = true; });
      NIFTY.forEach(function(n) { if (!found[n.c]) list.push({ id: "n-" + n.c, commonName: n.n, exchangeCodeNsi: n.c, mgIndustry: "Defence", isNifty: true, nWt: n.w, activeStockTrends: {} }); });
      list.sort(function(a, b) { if (a.isNifty && !b.isNifty) return -1; if (!a.isNifty && b.isNifty) return 1; if (a.isNifty && b.isNifty) return (b.nWt || 0) - (a.nWt || 0); return (a.commonName || "").localeCompare(b.commonName || ""); });
      setStocks(list); setStkLd(false);
    });
  }, [key]);

  // Fetch news on connect (fresh)
  useEffect(function() { if (!key || newsDone) return; setNewsLd(true);
    fetch(API + "/rss/defence-news?fresh=1").then(function(r) { return r.json(); }).then(function(d) { setNewsMap(d || {}); setNewsDone(true); setNewsLd(false); }).catch(function() { setNewsLd(false); setNewsDone(true); });
  }, [key]);

  // Stock detail
  useEffect(function() { if (!key || !selCode) return; setSelLd(true); setSelD(null); setQtr(null); setTarget(null); setSelErr("");
    Promise.all([smartFetch(key, selCode, selName), smartStats(key, selCode, selName, "quarter_results"), apiFetch("/stock_target_price?stock_id=" + encodeURIComponent(selCode), key).catch(function() { return null; })])
      .then(function(r) { if (!r[0]) setSelErr("No data for " + selCode); setSelD(r[0]); setQtr(r[1]); setTarget(r[2]); setSelLd(false); });
  }, [key, selCode]);

  useEffect(function() { if (!key || !selCode) return; setHistLd(true); setHist([]);
    smartHist(key, selCode, selName, histP).then(function(v) { setHist(v || []); setHistLd(false); });
  }, [key, selCode, histP]);

  useEffect(function() { if (!key || !cmpC.length) return;
    cmpC.forEach(function(c) { if (cmpD[c]) return; smartFetch(key, c, NM[c] ? NM[c].n : c).then(function(d) { if (d) setCmpD(function(p) { var n = Object.assign({}, p); n[c] = d; return n; }); }); });
  }, [key, cmpC]);

  var filtered = stocks.filter(function(s) { var q = search.toLowerCase(); return (s.commonName || "").toLowerCase().indexOf(q) >= 0 || (s.exchangeCodeNsi || "").toLowerCase().indexOf(q) >= 0; });
  var niftyList = stocks.filter(function(s) { return s.isNifty; });
  function goStock(c, n) { setSelCode(c); setSelName(n); setTab("stocks"); }
  function goTab(t) { setTab(t); setSelCode(null); setSelName(null); setSelD(null); setSelErr(""); }

  var accent = "#f97316";
  var mono = { fontFamily: "'JetBrains Mono',monospace" };
  var card = { background: T.bg2, border: "1px solid " + T.border, borderRadius: 12, padding: 16 };
  var thS = { padding: "10px 8px", textAlign: "left", color: T.text3, fontWeight: 600, fontSize: 10, letterSpacing: .5, textTransform: "uppercase" };

  function Badge(props) {
    var colors = { "default": [dark ? "rgba(100,120,140,.15)" : "#e2e8f0", T.text2], nifty: ["rgba(249,115,22,.15)", "#f97316"], bullish: ["rgba(34,197,94,.12)", "#22c55e"], bearish: ["rgba(239,68,68,.12)", "#ef4444"], neutral: [dark ? "rgba(100,120,140,.12)" : "#e2e8f0", T.text2], buy: ["rgba(34,197,94,.15)", "#16a34a"], hold: ["rgba(245,158,11,.15)", "#f59e0b"], sell: ["rgba(239,68,68,.15)", "#ef4444"], live: ["rgba(34,197,94,.2)", "#22c55e"] };
    var p = colors[props.v || "default"] || colors["default"];
    return <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: 20, fontSize: 10, fontWeight: 600, letterSpacing: .4, background: p[0], color: p[1], textTransform: "uppercase", whiteSpace: "nowrap", ...(props.style || {}) }}>{props.children}</span>;
  }
  function Ld(props) { return <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "20px 0", color: T.text2, fontSize: 13 }}><div style={{ width: 16, height: 16, border: "2px solid rgba(249,115,22,.2)", borderTopColor: accent, borderRadius: "50%", animation: "rspin .6s linear infinite" }} />{props.t}</div>; }
  function TB(props) { if (!props.r) return null; var l = props.r.toLowerCase(); return <Badge v={l.indexOf("bullish") >= 0 ? "bullish" : l.indexOf("bearish") >= 0 ? "bearish" : "neutral"}>{props.r}</Badge>; }
  function Chart(props) {
    var d = props.data, w = props.w || 780, h = props.h || 200; if (!d || !d.length) return <div style={{ height: h, display: "flex", alignItems: "center", justifyContent: "center", color: T.text3, fontSize: 13 }}>No chart data</div>;
    var vals = d.map(function(x) { return parseFloat(x[1]); }).filter(function(v) { return !isNaN(v); }); if (!vals.length) return null;
    var mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), rng = mx - mn || 1;
    var pts = vals.map(function(v, i) { return (48 + (i / (vals.length - 1)) * (w - 48)) + "," + (h - 10 - ((v - mn) / rng) * (h - 20)); }).join(" ");
    var col = vals[vals.length - 1] >= vals[0] ? "#22c55e" : "#ef4444";
    return <svg width={w} height={h} style={{ display: "block" }}>
      {[0, .25, .5, .75, 1].map(function(p) { var y = 10 + (h - 20) * p; return <g key={p}><line x1={48} y1={y} x2={w} y2={y} stroke={dark ? "rgba(255,255,255,.04)" : "rgba(0,0,0,.06)"} /><text x={2} y={y + 3} fill={T.text3} fontSize={9} {...mono}>{(mx - p * rng).toFixed(0)}</text></g>; })}
      <defs><linearGradient id="ag" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={col} stopOpacity=".2" /><stop offset="100%" stopColor={col} stopOpacity="0" /></linearGradient></defs>
      <polygon points={"48," + (h - 10) + " " + pts + " " + w + "," + (h - 10)} fill="url(#ag)" />
      <polyline points={pts} fill="none" stroke={col} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>;
  }

  // ═══ LOGIN ═══════════════════════════════════════════════════
  if (!ok) return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: T.bg, color: T.text, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');@keyframes rspin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 440, padding: 44, borderRadius: 22, ...card }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
          <div style={{ width: 46, height: 46, borderRadius: 13, background: "linear-gradient(135deg,#f97316,#dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 20, color: "#fff" }}>R</div>
          <div><div style={{ fontSize: 24, fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Raksha</div><div style={{ fontSize: 10, color: T.text3, fontWeight: 500, letterSpacing: 1.5, textTransform: "uppercase" }}>Defence Intelligence Platform</div></div>
        </div>
        <div style={{ padding: 12, borderRadius: 10, background: dark ? "rgba(59,130,246,.06)" : "#eff6ff", border: "1px solid " + (dark ? "rgba(59,130,246,.15)" : "#bfdbfe"), marginBottom: 20, fontSize: 12, lineHeight: 1.6, color: T.text2 }}>
          <strong style={{ color: "#3b82f6" }}>Setup:</strong> Start proxy → <code style={{ background: dark ? "rgba(255,255,255,.06)" : "#f1f5f9", padding: "1px 6px", borderRadius: 4, ...mono }}>node proxy.cjs</code>
        </div>
        <label style={{ fontSize: 10, fontWeight: 600, color: T.text3, letterSpacing: .8, textTransform: "uppercase", marginBottom: 6, display: "block" }}>IndianAPI Key</label>
        <input type="password" placeholder="Paste X-Api-Key..." value={keyIn} onChange={function(e) { setKeyIn(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter") conn(); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "1px solid " + T.border, background: T.bg3, color: T.text, fontSize: 13, outline: "none", ...mono, marginBottom: 14, boxSizing: "border-box" }} />
        {authErr && <div style={{ padding: "10px 14px", borderRadius: 10, background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.2)", color: "#ef4444", fontSize: 11, marginBottom: 14 }}>{authErr}</div>}
        <button onClick={conn} disabled={!keyIn || authLd} style={{ width: "100%", padding: "11px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", background: keyIn ? "linear-gradient(135deg,#f97316,#dc2626)" : T.bg3, color: keyIn ? "#fff" : T.text3, cursor: keyIn && !authLd ? "pointer" : "default" }}>{authLd ? "Connecting..." : "Connect"}</button>
      </div>
    </div>
  );

  // ═══ MAIN LAYOUT ═════════════════════════════════════════════
  var showDetail = tab === "stocks" && selCode;

  return (
    <div style={{ fontFamily: "'Outfit',sans-serif", background: T.bg, color: T.text, minHeight: "100vh", minWidth: "100vw", display: "flex" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');*{box-sizing:border-box;margin:0}html,body,#root{background:${T.bg};margin:0;padding:0}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:${dark?"rgba(255,255,255,.08)":"rgba(0,0,0,.1)"};border-radius:3px}input::placeholder{color:${T.text3}}@keyframes rspin{to{transform:rotate(360deg)}}`}</style>

      {/* ═══ LEFT NAV ═══ */}
      <nav style={{ width: 200, minHeight: "100vh", background: T.sidebarBg, borderRight: "1px solid " + T.border, padding: "16px 0", position: "fixed", left: 0, top: 0, zIndex: 100, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 16px", marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg,#f97316,#dc2626)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900, fontSize: 15, color: "#fff" }}>R</div>
          <span style={{ fontSize: 16, fontWeight: 800, background: "linear-gradient(135deg,#f97316,#ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Raksha</span>
        </div>

        {TABS.map(function(t) {
          var active = tab === t.id;
          return <button key={t.id} onClick={function() { goTab(t.id); }} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 16px", border: "none", background: active ? (dark ? "rgba(249,115,22,.08)" : "#fff7ed") : "transparent", color: active ? accent : T.text2, fontSize: 13, fontWeight: active ? 700 : 500, cursor: "pointer", textAlign: "left", borderLeft: active ? "3px solid " + accent : "3px solid transparent", transition: "all .15s" }}>
            <span style={{ fontSize: 14, opacity: .7 }}>{t.icon}</span>{t.label}
          </button>;
        })}

        {/* Startup sub-nav */}
        {tab === "startups" && <div style={{ padding: "8px 0 0 20px", borderTop: "1px solid " + T.border, marginTop: 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.text3, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, paddingLeft: 8 }}>Categories</div>
          {[{ id: "all", label: "All Startups" }].concat(STARTUP_CATS.map(function(c) { return { id: c.cat, label: c.cat }; })).map(function(c) {
            var active = startupCat === c.id;
            return <button key={c.id} onClick={function() { setStartupCat(c.id); }} style={{ display: "block", width: "100%", padding: "5px 8px", border: "none", background: "transparent", color: active ? accent : T.text3, fontSize: 11, fontWeight: active ? 700 : 400, cursor: "pointer", textAlign: "left", borderRadius: 4 }}>{c.label}</button>;
          })}
        </div>}

        <div style={{ marginTop: "auto", padding: "12px 16px" }}>
          <button onClick={function() { setDark(!dark); }} style={{ width: "100%", padding: "8px", borderRadius: 8, border: "1px solid " + T.border, background: T.bg3, color: T.text2, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>{dark ? "☀ Light Mode" : "🌙 Dark Mode"}</button>
          <div style={{ fontSize: 10, color: T.text3, marginTop: 8, textAlign: "center" }}>{stocks.length} stocks · <Badge v="live">LIVE</Badge></div>
        </div>
      </nav>

      {/* ═══ MAIN CONTENT ═══ */}
      <main style={{ marginLeft: 200, flex: 1, padding: 24, maxWidth: 1200 }}>

        {/* SEARCH BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ position: "relative", width: 320 }}>
            <input type="text" placeholder="Search stocks..." value={search} onChange={function(e) { setSearch(e.target.value); }} style={{ width: "100%", padding: "8px 14px 8px 32px", borderRadius: 10, border: "1px solid " + T.border, background: T.bg2, color: T.text, fontSize: 12, outline: "none" }} />
            <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: T.text3, fontSize: 13 }}>⌕</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11 }}>
            <span style={{ color: T.text3 }}>Corpus: <span style={{ color: "#22c55e", fontWeight: 700, ...mono }}>₹{(corpus / 1e5).toFixed(1)}L</span></span>
          </div>
        </div>

        {/* ═══ DASHBOARD ═══ */}
        {tab === "dash" && <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 20 }}>
            {[{ l: "Defence Stocks", v: stocks.length || "...", c: "#f97316" }, { l: "NIFTY Index", v: niftyList.length, c: "#22c55e" }, { l: "Bullish", v: stocks.filter(function(s) { return s.activeStockTrends && s.activeStockTrends.overallRating && s.activeStockTrends.overallRating.toLowerCase().indexOf("bullish") >= 0; }).length, c: "#3b82f6" }, { l: "Startups", v: "195+", c: "#a855f7" }].map(function(c, i) {
              return <div key={i} style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase", letterSpacing: .7, marginBottom: 4 }}>{c.l}</div><div style={{ fontSize: 26, fontWeight: 800, color: c.c, ...mono }}>{c.v}</div></div>;
            })}
          </div>
          {stkLd ? <Ld t="Discovering defence stocks..." /> :
          <div style={card}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>NIFTY India Defence Index</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              {niftyList.map(function(s) { return <div key={s.id} onClick={function() { goStock(s.exchangeCodeNsi, s.commonName); }} style={{ padding: 14, borderRadius: 10, background: T.bg3, border: "1px solid " + T.border, cursor: "pointer", transition: "all .15s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}><span style={{ fontWeight: 700, fontSize: 12 }}>{s.exchangeCodeNsi}</span><Badge v="nifty" style={{ fontSize: 8 }}>{s.nWt}%</Badge></div>
                <div style={{ fontSize: 10, color: T.text2, marginBottom: 6 }}>{(s.commonName || "").slice(0, 22)}</div>
                {s.activeStockTrends && s.activeStockTrends.overallRating && <TB r={s.activeStockTrends.overallRating} />}
              </div>; })}
            </div>
          </div>}
        </div>}

        {/* ═══ STOCKS LIST ═══ */}
        {tab === "stocks" && !showDetail && <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Defence Stocks ({filtered.length})</h2>
          {stkLd ? <Ld t="Loading..." /> :
          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: "1px solid " + T.border }}>{["Stock", "NSE", "Industry", "Trend", "NIFTY"].map(function(h) { return <th key={h} style={thS}>{h}</th>; })}</tr></thead>
              <tbody>{filtered.map(function(s) { return <tr key={s.id} onClick={function() { goStock(s.exchangeCodeNsi || s.commonName, s.commonName); }} style={{ borderBottom: "1px solid " + T.border, cursor: "pointer" }}>
                <td style={{ padding: "10px 8px", fontWeight: 700 }}>{s.commonName}</td>
                <td style={{ padding: "10px 8px", ...mono, fontWeight: 600, fontSize: 11 }}>{s.exchangeCodeNsi || "—"}</td>
                <td style={{ padding: "10px 8px", color: T.text2, fontSize: 11 }}>{s.mgIndustry || "—"}</td>
                <td style={{ padding: "10px 8px" }}>{s.activeStockTrends && s.activeStockTrends.overallRating ? <TB r={s.activeStockTrends.overallRating} /> : null}</td>
                <td style={{ padding: "10px 8px" }}>{s.isNifty ? <Badge v="nifty">{s.nWt}%</Badge> : <span style={{ color: T.text3 }}>—</span>}</td>
              </tr>; })}</tbody>
            </table>
          </div>}
        </div>}

        {/* ═══ STOCK DETAIL ═══ */}
        {showDetail && <div>
          <button onClick={function() { setSelCode(null); setSelD(null); }} style={{ background: "none", border: "none", color: accent, cursor: "pointer", fontSize: 12, fontWeight: 600, marginBottom: 12, padding: 0 }}>← Back</button>
          {selLd && <Ld t={"Loading " + selCode + "..."} />}
          {selErr && !selLd && <div style={{ padding: 20, borderRadius: 12, background: "rgba(239,68,68,.06)", border: "1px solid rgba(239,68,68,.15)", color: "#ef4444", fontSize: 12, marginBottom: 16 }}>{selErr}</div>}
          {selD && !selLd && <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{selD.companyName || selName}</h2>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
              {selD.industry && typeof selD.industry === "string" && <Badge>{selD.industry}</Badge>}
              {NM[selCode] && <Badge v="nifty">NIFTY DEF — {NM[selCode].w}%</Badge>}
              {selD.tickerId && typeof selD.tickerId === "string" && <Badge style={mono}>{selD.tickerId}</Badge>}
            </div>
            {/* Action chips */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 16 }}>
              {selD.recentNews && selD.recentNews.length > 0 && <button onClick={function() { setSbC({ type: "news", title: "News — " + (selD.companyName || selCode), data: selD.recentNews }); setSbO(true); }} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(249,115,22,.25)", background: "rgba(249,115,22,.05)", color: accent, cursor: "pointer" }}>News ({selD.recentNews.length})</button>}
              {selD.shareholding && <button onClick={function() { setSbC({ type: "sh", title: "Shareholding", data: selD.shareholding }); setSbO(true); }} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(59,130,246,.25)", background: "rgba(59,130,246,.05)", color: "#3b82f6", cursor: "pointer" }}>Shareholding</button>}
              {selD.companyProfile && <button onClick={function() { setSbC({ type: "data", title: "Profile", data: selD.companyProfile }); setSbO(true); }} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(168,85,247,.25)", background: "rgba(168,85,247,.05)", color: "#a855f7", cursor: "pointer" }}>Profile</button>}
              {selD.financials && <button onClick={function() { setSbC({ type: "fin", title: "Financials", data: selD.financials }); setSbO(true); }} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 11, fontWeight: 600, border: "1px solid rgba(34,197,94,.25)", background: "rgba(34,197,94,.05)", color: "#22c55e", cursor: "pointer" }}>Financials</button>}
            </div>
            {/* Price cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 18 }}>
              <div style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase" }}>Price</div><div style={{ fontSize: 22, fontWeight: 800, color: "#22c55e", ...mono, marginTop: 4 }}>₹{selD.currentPrice && (selD.currentPrice.NSE || selD.currentPrice.BSE) ? (selD.currentPrice.NSE || selD.currentPrice.BSE).toLocaleString("en-IN") : "—"}</div>{selD.percentChange != null && <div style={{ fontSize: 11, color: selD.percentChange >= 0 ? "#22c55e" : "#ef4444", marginTop: 3 }}>{selD.percentChange >= 0 ? "+" : ""}{selD.percentChange}%</div>}</div>
              <div style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase" }}>52 Week</div><div style={{ fontSize: 13, ...mono, marginTop: 8, lineHeight: 1.8 }}><span style={{ color: "#22c55e" }}>H: ₹{selD.yearHigh ? selD.yearHigh.toLocaleString("en-IN") : "—"}</span><br /><span style={{ color: "#ef4444" }}>L: ₹{selD.yearLow ? selD.yearLow.toLocaleString("en-IN") : "—"}</span></div></div>
              <div style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase" }}>Key Metrics</div><div style={{ fontSize: 11, ...mono, marginTop: 8, lineHeight: 1.6, color: T.text2 }}>{selD.keyMetrics && flattenMetrics(selD.keyMetrics).slice(0, 5).map(function(m) { return <div key={m.l}>{m.l}: <span style={{ color: T.text, fontWeight: 600 }}>{String(m.v)}</span></div>; })}</div></div>
              <div style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase" }}>Target</div>{target && target.priceTarget ? <div style={{ marginTop: 8 }}><div style={{ fontSize: 18, fontWeight: 800, color: "#3b82f6", ...mono }}>₹{target.priceTarget.Mean ? target.priceTarget.Mean.toFixed(0) : "—"}</div><div style={{ fontSize: 10, color: T.text3, marginTop: 2 }}>{target.priceTarget.NumberOfEstimates} est · ₹{target.priceTarget.Low}–₹{target.priceTarget.High}</div></div> : <div style={{ fontSize: 11, color: T.text3, marginTop: 8 }}>No data</div>}</div>
            </div>
            {/* Chart */}
            <div style={{ ...card, marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>Price History</div>
                <div style={{ display: "flex", gap: 3 }}>{["1m","6m","1yr","3yr","5yr","max"].map(function(p) { return <button key={p} onClick={function() { setHistP(p); }} style={{ padding: "2px 8px", borderRadius: 5, fontSize: 10, fontWeight: 600, border: histP === p ? "1px solid " + accent : "1px solid " + T.border, background: histP === p ? "rgba(249,115,22,.1)" : "transparent", color: histP === p ? accent : T.text3, cursor: "pointer" }}>{p}</button>; })}</div>
              </div>
              {histLd ? <Ld t="Loading chart..." /> : <Chart data={hist} />}
            </div>
            {/* Quarterly */}
            {qtr && Object.keys(qtr).length > 0 && <div style={{ ...card, marginBottom: 18 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Quarterly Results</div>
              <div style={{ overflowX: "auto" }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11, minWidth: 600 }}>
                <thead><tr style={{ borderBottom: "1px solid " + T.border }}><th style={{ ...thS, position: "sticky", left: 0, background: T.bg, minWidth: 120 }}>Metric</th>{qtr.Sales && Object.keys(qtr.Sales).slice(-8).map(function(q) { return <th key={q} style={{ ...thS, textAlign: "right", whiteSpace: "nowrap" }}>{q}</th>; })}</tr></thead>
                <tbody>{["Sales","Operating Profit","OPM %","Net Profit","EPS in Rs"].filter(function(k) { return qtr[k]; }).map(function(m, i) {
                  return <tr key={m} style={{ borderBottom: "1px solid " + T.border }}><td style={{ padding: "7px 8px", fontWeight: 600, color: T.text2, position: "sticky", left: 0, background: T.bg, minWidth: 120 }}>{m}</td>{Object.entries(qtr[m]).slice(-8).map(function(e) { var v = e[1]; if (typeof v === "object" && v !== null) v = JSON.stringify(v); return <td key={e[0]} style={{ padding: "7px 8px", textAlign: "right", ...mono }}>{String(v)}</td>; })}</tr>;
                })}</tbody>
              </table></div>
            </div>}
          </div>}
        </div>}

        {/* ═══ NEWS CALENDAR ═══ */}
        {tab === "news" && (function() {
          var moNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
          var dim = new Date(newsYr, newsMo + 1, 0).getDate();
          var fdow = new Date(newsYr, newsMo, 1).getDay();
          var blanks = []; for (var b = 0; b < fdow; b++) blanks.push(b);
          var moCount = 0; for (var d = 1; d <= dim; d++) { var ds = newsYr + "-" + String(newsMo + 1).padStart(2, "0") + "-" + String(d).padStart(2, "0"); if (newsMap[ds]) moCount += newsMap[ds].length; }
          var today = new Date().toISOString().slice(0, 10);

          return <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Defence News</h2>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={function() { var m = newsMo - 1, y = newsYr; if (m < 0) { m = 11; y--; } setNewsMo(m); setNewsYr(y); }} style={{ background: T.bg3, border: "1px solid " + T.border, borderRadius: 6, color: T.text2, cursor: "pointer", padding: "2px 10px", fontSize: 14 }}>←</button>
                <span style={{ fontSize: 14, fontWeight: 700, minWidth: 140, textAlign: "center" }}>{moNames[newsMo]} {newsYr}</span>
                <button onClick={function() { var m = newsMo + 1, y = newsYr; if (m > 11) { m = 0; y++; } setNewsMo(m); setNewsYr(y); }} style={{ background: T.bg3, border: "1px solid " + T.border, borderRadius: 6, color: T.text2, cursor: "pointer", padding: "2px 10px", fontSize: 14 }}>→</button>
              </div>
              <span style={{ fontSize: 11, color: T.text3 }}>{moCount} articles</span>
            </div>
            <div style={{ fontSize: 10, color: T.text3, marginBottom: 12 }}>Sources: ET Defence, IDRW, LiveFist, LiveMint, Hindu BL, India Strategic, Defence Blog</div>

            {newsLd ? <Ld t="Fetching defence news..." /> :
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(function(d) { return <div key={d} style={{ padding: 5, textAlign: "center", fontSize: 10, fontWeight: 700, color: T.text3, textTransform: "uppercase" }}>{d}</div>; })}
              {blanks.map(function(b) { return <div key={"b" + b} style={{ minHeight: 60 }} />; })}
              {Array.from({ length: dim }, function(_, i) {
                var day = i + 1;
                var ds = newsYr + "-" + String(newsMo + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
                var arts = newsMap[ds]; var cnt = arts ? arts.length : 0; var isToday = ds === today;
                return <div key={day} onClick={function() { if (arts) { setSbC({ type: "news", title: "News — " + ds, data: arts }); setSbO(true); } }} style={{ padding: 8, textAlign: "center", borderRadius: 8, minHeight: 60, cursor: cnt ? "pointer" : "default", transition: "all .15s", background: cnt > 3 ? "rgba(249,115,22,.1)" : cnt > 0 ? "rgba(249,115,22,.05)" : T.bg3, border: isToday ? "2px solid " + accent : cnt ? "1px solid rgba(249,115,22,.2)" : "1px solid " + T.border }}>
                  <div style={{ fontSize: 13, fontWeight: isToday ? 800 : 500, color: isToday ? accent : cnt ? T.text : T.text3 }}>{day}</div>
                  {cnt > 0 && <div style={{ marginTop: 4 }}><div style={{ width: 6, height: 6, borderRadius: "50%", background: cnt > 3 ? accent : "#22c55e", margin: "0 auto" }} /><div style={{ fontSize: 8, color: accent, marginTop: 2 }}>{cnt}</div></div>}
                </div>;
              })}
            </div>}

            {/* Recent articles below calendar */}
            {!newsLd && Object.keys(newsMap).length > 0 && <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Recent Articles</div>
              {Object.entries(newsMap).slice(0, 5).map(function(entry) {
                return <div key={entry[0]}>
                  <div style={{ fontSize: 10, color: accent, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", marginTop: 10, marginBottom: 4 }}>{entry[0]}</div>
                  {entry[1].slice(0, 4).map(function(a, i) { return <div key={i} onClick={function() { if (a.link) window.open(a.link, "_blank"); }} style={{ padding: "6px 0", borderBottom: "1px solid " + T.border, cursor: a.link ? "pointer" : "default" }}>
                    <div style={{ fontSize: 12, fontWeight: 500, lineHeight: 1.4 }}>{a.title}</div>
                    <div style={{ fontSize: 10, color: T.text3, marginTop: 2 }}>{a.source}</div>
                  </div>; })}
                </div>;
              })}
            </div>}
          </div>;
        })()}

        {/* ═══ STARTUPS ═══ */}
        {tab === "startups" && <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Defence Tech Startups</h2>
          <p style={{ fontSize: 12, color: T.text3, marginBottom: 16 }}>195+ startups · $711M cumulative · $247M in 2025 (Tracxn)</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 20 }}>
            {[{ l: "Startups", v: "195+", c: "#f97316" }, { l: "2025 Funding", v: "$247M", c: "#22c55e" }, { l: "All-time", v: "$711M", c: "#3b82f6" }, { l: "iDEX Winners", v: "430+", c: "#a855f7" }].map(function(c, i) { return <div key={i} style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase", marginBottom: 4 }}>{c.l}</div><div style={{ fontSize: 22, fontWeight: 800, color: c.c, ...mono }}>{c.v}</div></div>; })}
          </div>
          {(startupCat === "all" ? STARTUP_CATS : STARTUP_CATS.filter(function(c) { return c.cat === startupCat; })).map(function(cat) {
            return <div key={cat.cat} style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: cat.col, marginBottom: 10, textTransform: "uppercase", letterSpacing: .5 }}>{cat.cat}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
                {cat.items.map(function(s) { return <div key={s.n} style={{ ...card, borderLeft: "3px solid " + cat.col }}>
                  <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 6 }}>{s.n}</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "#22c55e", marginBottom: 4, ...mono }}>{s.f}</div>
                  <div style={{ fontSize: 10, color: T.text2, marginBottom: 6 }}>{s.r} · {s.hq}</div>
                  <div style={{ fontSize: 11, lineHeight: 1.4, marginBottom: 8 }}>{s.fo}</div>
                  <div style={{ fontSize: 10, color: T.text3 }}>Investors: {s.inv}</div>
                </div>; })}
              </div>
            </div>;
          })}
          <div style={card}><div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Top VCs</div><div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{["Venture Catalysts (6)","Accel (5)","HDA Tech Growth (5)","Inflection Point (5)","General Catalyst","Anicut Capital","Unicorn India","Pavestone","Celesta Capital","IAN Fund","Auxano","InfoEdge","3one4","Peak XV","Tata Capital"].map(function(v) { return <span key={v} style={{ padding: "4px 12px", borderRadius: 20, fontSize: 10, fontWeight: 600, background: "rgba(168,85,247,.08)", border: "1px solid rgba(168,85,247,.15)", color: "#a855f7" }}>{v}</span>; })}</div></div>
        </div>}

        {/* ═══ RESEARCH ═══ */}
        {tab === "research" && <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>Defence Sector Research</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: 12 }}>
            {REPORTS.map(function(r, i) { return <div key={i} onClick={function() { window.open(r.url, "_blank"); }} style={{ ...card, cursor: "pointer", borderLeft: "3px solid " + r.col }}>
              <div style={{ fontSize: 10, color: r.col, fontWeight: 700, textTransform: "uppercase", marginBottom: 4 }}>{r.s}</div>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.4, marginBottom: 10 }}>{r.t}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><div style={{ display: "flex", gap: 4 }}>{r.tags.map(function(t) { return <Badge key={t}>{t}</Badge>; })}</div><span style={{ fontSize: 10, color: T.text3 }}>{r.d}</span></div>
              <div style={{ marginTop: 8, fontSize: 11, color: "#3b82f6" }}>Open report →</div>
            </div>; })}
          </div>
        </div>}

        {/* ═══ RATIOS ═══ */}
        {tab === "ratios" && <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>Ratio Comparison</h2>
          <div style={{ display: "flex", gap: 5, marginBottom: 16, flexWrap: "wrap" }}>{niftyList.map(function(s) { var c = s.exchangeCodeNsi; return <button key={s.id} onClick={function() { setCmpC(function(p) { return p.indexOf(c) >= 0 ? p.filter(function(x) { return x !== c; }) : p.length < 5 ? p.concat([c]) : p; }); }} style={{ padding: "3px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, border: cmpC.indexOf(c) >= 0 ? "1px solid " + accent : "1px solid " + T.border, background: cmpC.indexOf(c) >= 0 ? "rgba(249,115,22,.1)" : "transparent", color: cmpC.indexOf(c) >= 0 ? accent : T.text3, cursor: "pointer" }}>{c}</button>; })}</div>
          {cmpC.length > 0 ? <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: "1px solid " + T.border }}><th style={thS}>Metric</th>{cmpC.map(function(c) { return <th key={c} style={{ ...thS, textAlign: "right", color: accent, fontWeight: 700 }}>{(cmpD[c] && cmpD[c].tickerId) || c}</th>; })}</tr></thead>
              <tbody>{[{ l: "Price", fn: function(d) { return d && d.currentPrice && d.currentPrice.NSE ? "₹" + d.currentPrice.NSE.toLocaleString("en-IN") : "..."; } }, { l: "Change%", fn: function(d) { return d && d.percentChange != null ? d.percentChange + "%" : "..."; } }, { l: "52W High", fn: function(d) { return d && d.yearHigh ? "₹" + d.yearHigh.toLocaleString("en-IN") : "..."; } }, { l: "52W Low", fn: function(d) { return d && d.yearLow ? "₹" + d.yearLow.toLocaleString("en-IN") : "..."; } }, { l: "Industry", fn: function(d) { return d && d.industry ? d.industry : "..."; } }].map(function(r, i) {
                return <tr key={r.l} style={{ borderBottom: "1px solid " + T.border }}><td style={{ padding: "8px 12px", fontWeight: 600, color: T.text2 }}>{r.l}</td>{cmpC.map(function(c) { return <td key={c} style={{ padding: "8px 12px", textAlign: "right", fontWeight: 600, ...mono }}>{cmpD[c] ? r.fn(cmpD[c]) : "..."}</td>; })}</tr>;
              })}</tbody>
            </table>
          </div> : <div style={{ textAlign: "center", color: T.text3, padding: 40 }}>Select stocks above</div>}
        </div>}

        {/* ═══ PORTFOLIO ═══ */}
        {tab === "portfolio" && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>NIFTY Defence Portfolio</h2>
            <button onClick={function() { setCorpus(function(c) { return c + 1e5; }); }} style={{ padding: "5px 14px", borderRadius: 8, fontSize: 11, fontWeight: 700, border: "1px solid rgba(34,197,94,.3)", background: "rgba(34,197,94,.06)", color: "#22c55e", cursor: "pointer" }}>+ Add ₹1L</button>
          </div>
          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: "1px solid " + T.border }}>{["Stock","NSE","Weight","Allocation","Trend"].map(function(h) { return <th key={h} style={thS}>{h}</th>; })}</tr></thead>
              <tbody>{niftyList.map(function(s) { return <tr key={s.id} onClick={function() { goStock(s.exchangeCodeNsi, s.commonName); }} style={{ borderBottom: "1px solid " + T.border, cursor: "pointer" }}>
                <td style={{ padding: "9px 8px", fontWeight: 700 }}>{(s.commonName || "").slice(0, 25)}</td>
                <td style={{ padding: "9px 8px", ...mono, fontSize: 11 }}>{s.exchangeCodeNsi}</td>
                <td style={{ padding: "9px 8px" }}><Badge v="nifty">{s.nWt}%</Badge></td>
                <td style={{ padding: "9px 8px", ...mono }}>₹{(corpus * (s.nWt || 0) / 1e7).toFixed(2)}L</td>
                <td style={{ padding: "9px 8px" }}>{s.activeStockTrends && s.activeStockTrends.overallRating ? <TB r={s.activeStockTrends.overallRating} /> : null}</td>
              </tr>; })}</tbody>
            </table>
          </div>
          <p style={{ fontSize: 10, color: "#ef4444", marginTop: 12, textAlign: "center", fontStyle: "italic" }}>⚠ Index weights only. Not investment advice.</p>
        </div>}

        {/* ═══ REBALANCE ═══ */}
        {tab === "rebalance" && <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Rebalancing</h2>
            <div style={{ display: "flex", gap: 5 }}>{Object.keys(REBAL).map(function(m) { return <button key={m} onClick={function() { setSelMo(m); }} style={{ padding: "4px 10px", borderRadius: 6, fontSize: 10, fontWeight: 600, border: selMo === m ? "1px solid " + accent : "1px solid " + T.border, background: selMo === m ? "rgba(249,115,22,.1)" : "transparent", color: selMo === m ? accent : T.text3, cursor: "pointer" }}>{m}</button>; })}</div>
          </div>
          <div style={{ ...card, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: "1px solid " + T.border }}><th style={thS}>Stock</th><th style={{ ...thS, textAlign: "center" }}>Wt</th>{Object.keys(REBAL).map(function(m) { return <th key={m} style={{ ...thS, textAlign: "center" }}>{m}</th>; })}</tr></thead>
              <tbody>{niftyList.filter(function(s) { return REBAL["Mar 26"][s.exchangeCodeNsi]; }).map(function(s) { return <tr key={s.id} style={{ borderBottom: "1px solid " + T.border }}>
                <td style={{ padding: "7px 8px", fontWeight: 700 }}>{s.exchangeCodeNsi}</td>
                <td style={{ padding: "7px 8px", textAlign: "center" }}><Badge v="nifty">{s.nWt}%</Badge></td>
                {Object.entries(REBAL).map(function(e) { var rec = e[1][s.exchangeCodeNsi]; return <td key={e[0]} style={{ padding: "7px 8px", textAlign: "center" }}><Badge v={rec ? rec.toLowerCase() : "default"}>{rec || "—"}</Badge></td>; })}
              </tr>; })}</tbody>
            </table>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
            <div style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase" }}>Model XIRR</div><div style={{ fontSize: 26, fontWeight: 800, color: "#22c55e", ...mono }}>28.4%</div></div>
            <div style={card}><div style={{ fontSize: 10, color: T.text3, fontWeight: 600, textTransform: "uppercase" }}>Rebalanced XIRR</div><div style={{ fontSize: 26, fontWeight: 800, color: "#3b82f6", ...mono }}>32.1%</div></div>
          </div>
          <p style={{ fontSize: 10, color: "#ef4444", marginTop: 12, textAlign: "center", fontStyle: "italic" }}>⚠ Illustrative only.</p>
        </div>}
      </main>

      {/* ═══ SIDEBAR ═══ */}
      {sbO && <div>
        <div onClick={function() { setSbO(false); }} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.4)", zIndex: 200 }} />
        <div style={{ position: "fixed", top: 0, right: 0, width: 420, height: "100vh", background: T.sidebarBg, borderLeft: "1px solid " + T.border, zIndex: 201, overflowY: "auto", padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{sbC && sbC.title || "Details"}</div>
            <button onClick={function() { setSbO(false); }} style={{ background: "none", border: "none", color: T.text3, cursor: "pointer", fontSize: 17, fontWeight: 700 }}>✕</button>
          </div>

          {/* NEWS */}
          {sbC && sbC.type === "news" && (sbC.data || []).map(function(n, i) {
            var title = typeof n === "string" ? n : (n.title || n.headline || JSON.stringify(n).slice(0, 120));
            var link = n.link || n.url || null;
            return <div key={i} onClick={function() { if (link) window.open(link, "_blank"); }} style={{ padding: "10px 0", borderBottom: "1px solid " + T.border, cursor: link ? "pointer" : "default" }}>
              <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.5 }}>{title}</div>
              {n.description && typeof n.description === "string" && <div style={{ fontSize: 10, color: T.text3, marginTop: 3, lineHeight: 1.4 }}>{n.description.slice(0, 120)}</div>}
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                {n.source && typeof n.source === "string" && <span style={{ fontSize: 10, color: accent }}>{n.source}</span>}
                {n.date && typeof n.date === "string" && <span style={{ fontSize: 10, color: T.text3 }}>{n.date}</span>}
              </div>
              {link && <div style={{ fontSize: 10, color: "#3b82f6", marginTop: 4 }}>Read full article →</div>}
            </div>;
          })}

          {/* SHAREHOLDING */}
          {sbC && sbC.type === "sh" && (function() {
            var data = sbC.data; if (!data) return <div>No data</div>;
            var rows = Array.isArray(data) ? data : (function() { var v = Object.values(data); for (var i = 0; i < v.length; i++) if (Array.isArray(v[i])) return v[i]; return []; })();
            if (!rows.length || !rows[0].categories) return <pre style={{ fontSize: 10, whiteSpace: "pre-wrap", color: T.text2, ...mono }}>{JSON.stringify(data, null, 2)}</pre>;
            var dates = rows[0].categories.map(function(c) { return c.holdingDate; });
            var colors = { Promoter: accent, FII: "#3b82f6", MF: "#22c55e", Other: T.text2 };
            return <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead><tr style={{ borderBottom: "1px solid " + T.border }}><th style={{ ...thS, minWidth: 80 }}>Category</th>{dates.map(function(d) { return <th key={d} style={{ ...thS, textAlign: "right", whiteSpace: "nowrap" }}>{d}</th>; })}</tr></thead>
                <tbody>{rows.map(function(r, i) { var label = r.displayName || r.categoryName; return <tr key={i} style={{ borderBottom: "1px solid " + T.border }}>
                  <td style={{ padding: 8, fontWeight: 700, color: colors[label] || T.text }}>{label}</td>
                  {(r.categories || []).map(function(c, j) { return <td key={j} style={{ padding: 8, textAlign: "right", ...mono }}>{c.percentage}%</td>; })}
                </tr>; })}</tbody>
              </table>
            </div>;
          })()}

          {/* FINANCIALS */}
          {sbC && sbC.type === "fin" && (function() {
            var data = sbC.data; if (!data) return <div>No data</div>;
            var items = Array.isArray(data) ? data : [data];
            var sections = { INC: { name: "Income Statement", col: "#22c55e" }, BAL: { name: "Balance Sheet", col: "#3b82f6" }, CAS: { name: "Cash Flow", col: "#f59e0b" } };
            var found = {};
            Object.keys(sections).forEach(function(k) { for (var i = 0; i < items.length; i++) { var m = items[i].stockFinancialMap || items[i]; if (m[k] && Array.isArray(m[k]) && m[k].length) { found[k] = m[k]; break; } } });
            if (!Object.keys(found).length) return <div style={{ color: T.text3 }}>No financial data</div>;
            return <div>{Object.entries(found).map(function(e) { var k = e[0], rows = e[1], s = sections[k]; return <div key={k} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: s.col, marginBottom: 8, textTransform: "uppercase", letterSpacing: .5 }}>{s.name}</div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><tbody>{rows.filter(function(r) { return r.value != null && String(r.value) !== "null"; }).map(function(r, i) { return <tr key={i} style={{ borderBottom: "1px solid " + T.border }}>
                <td style={{ padding: "5px 0", color: T.text2, fontSize: 10, maxWidth: 200 }}>{r.displayName || r.key}</td>
                <td style={{ padding: "5px 8px", textAlign: "right", ...mono, fontWeight: 600 }}>{isNaN(Number(r.value)) ? r.value : Number(r.value).toLocaleString("en-IN", { maximumFractionDigits: 2 })}</td>
              </tr>; })}</tbody></table>
            </div>; })}</div>;
          })()}

          {/* GENERIC DATA */}
          {sbC && sbC.type === "data" && (function() {
            var data = sbC.data; if (!data) return <div>No data</div>;
            if (typeof data !== "object") return <div>{String(data)}</div>;
            return <div style={{ fontSize: 11, lineHeight: 1.7, color: T.text2 }}>{Object.entries(data).map(function(e) {
              var k = e[0], v = safeStr(e[1]); if (v.length > 400) v = v.slice(0, 400) + "...";
              var lines = v.split("\n");
              return <div key={k} style={{ padding: "6px 0", borderBottom: "1px solid " + T.border }}>
                <div style={{ color: T.text3, fontWeight: 600, fontSize: 10, textTransform: "uppercase", letterSpacing: .3, marginBottom: 2 }}>{k}</div>
                {lines.length > 1 ? lines.map(function(l, i) { return <div key={i} style={{ padding: "2px 0", borderBottom: i < lines.length - 1 ? "1px solid " + T.border : "none" }}>{l}</div>; }) : <div style={{ ...mono, fontSize: 11, wordBreak: "break-word" }}>{v}</div>}
              </div>;
            })}</div>;
          })()}
        </div>
      </div>}
    </div>
  );
}
