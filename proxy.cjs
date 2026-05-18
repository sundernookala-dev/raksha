// ═══════════════════════════════════════════════════════════════
// RAKSHA PROXY v3 — IndianAPI + RSS Defence News
// Usage: node proxy.cjs
// ═══════════════════════════════════════════════════════════════
var http = require("http");
var https = require("https");
var urlMod = require("url");
var PORT = 3002;
var API_HOST = "stock.indianapi.in";

var RSS_FEEDS = [
  { name: "ET Defence", url: "https://economictimes.indiatimes.com/news/defence/rssfeeds/13357270.cms" },
  { name: "IDRW", url: "https://idrw.org/feed/" },
  { name: "Indian Defence News", url: "https://www.indiandefensenews.in/feed/" },
  { name: "LiveFist Defence", url: "https://www.livefistdefence.com/feed/" },
  { name: "LiveMint", url: "https://www.livemint.com/rss/news" },
  { name: "Hindu BL", url: "https://www.thehindubusinessline.com/topic/defence/feeder/default.rss" },
  { name: "India Strategic", url: "https://indiastrategic.in/feed/" },
  { name: "Defence Blog", url: "https://defence-blog.com/topics/india/feed/" },
];

var defKW = "defence,defense,military,army,navy,air force,missile,drdo,hal,bel,bdl,shipyard,warship,submarine,fighter,ammunition,radar,aerospace,weapon,artillery,tejas,brahmos,akash,drone,uav,atmanirbhar,make in india,defence export,defence budget,defence acquisition,idex,procurement,ministry of defence,cochin shipyard,mazagon,garden reach,bharat dynamics,bharat forge,solar industries,zen tech,data patterns,paras defence,beml,astra micro,ideaforge,mtar,raphe,tonbo,sagar defence,garuda aerospace".split(",");

function extractTag(xml, tag) {
  var r = [], re = new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)<\\/" + tag + ">", "gi"), m;
  while ((m = re.exec(xml)) !== null) r.push(m[1].trim());
  return r;
}
function strip(s) { var m = s.match(/<!\[CDATA\[([\s\S]*?)\]\]>/); return (m ? m[1] : s).replace(/<[^>]+>/g, "").trim(); }

function fetchURL(u, redir) {
  if (!redir) redir = 3;
  return new Promise(function(ok) {
    if (redir <= 0) return ok("");
    try {
      var p = urlMod.parse(u);
      var opts = { hostname: p.hostname, port: p.port || 443, path: p.path, method: "GET", timeout: 10000, headers: { "User-Agent": "Mozilla/5.0 (Raksha/3.0)", Accept: "application/rss+xml, application/xml, text/xml, */*" } };
      var req = (p.protocol === "https:" ? https : http).request(opts, function(res) {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          var loc = res.headers.location; if (loc.startsWith("/")) loc = p.protocol + "//" + p.hostname + loc;
          res.resume(); return fetchURL(loc, redir - 1).then(ok);
        }
        if (res.statusCode !== 200) { res.resume(); return ok(""); }
        var chunks = []; res.on("data", function(c) { chunks.push(c); }); res.on("end", function() { ok(Buffer.concat(chunks).toString("utf8")); }); res.on("error", function() { ok(""); });
      });
      req.on("error", function() { ok(""); }); req.on("timeout", function() { req.destroy(); ok(""); }); req.end();
    } catch (e) { ok(""); }
  });
}

function parseRSS(xml, src) {
  var items = [], blocks = extractTag(xml, "item"); if (!blocks.length) blocks = extractTag(xml, "entry");
  var isDef = ["idrw", "defence", "livefist", "india strategic", "pib"].some(function(k) { return src.toLowerCase().indexOf(k) >= 0; });
  blocks.forEach(function(b) {
    var t = extractTag(b, "title")[0], l = extractTag(b, "link")[0], d = extractTag(b, "pubDate")[0] || extractTag(b, "published")[0] || extractTag(b, "updated")[0], desc = extractTag(b, "description")[0];
    t = t ? strip(t) : ""; l = l ? strip(l) : ""; d = d ? strip(d) : ""; desc = desc ? strip(desc).slice(0, 200) : "";
    if (!t || t.length < 10) return;
    if (!isDef) { var c = (t + " " + desc).toLowerCase(); if (!defKW.some(function(k) { return c.indexOf(k) >= 0; })) return; }
    var iso = "unknown"; if (d) { try { var dt = new Date(d); if (!isNaN(dt.getTime())) iso = dt.toISOString().slice(0, 10); } catch (e) {} }
    items.push({ title: t.slice(0, 200), link: l, date: iso, source: src, description: desc.slice(0, 150) });
  });
  return items;
}

var cache = null, cacheTime = 0, TTL = 600000;
function fetchNews(force) {
  if (!force && cache && Date.now() - cacheTime < TTL) return Promise.resolve(cache);
  console.log("  📰 Fetching " + RSS_FEEDS.length + " RSS feeds...");
  return Promise.all(RSS_FEEDS.map(function(f) {
    return fetchURL(f.url).then(function(xml) {
      var items = xml && xml.length > 100 ? parseRSS(xml, f.name) : [];
      console.log("    " + (items.length ? "✓" : "✗") + " " + f.name + ": " + items.length + " articles");
      return items;
    }).catch(function() { return []; });
  })).then(function(results) {
    var all = []; results.forEach(function(r) { all = all.concat(r); });
    all.sort(function(a, b) { return b.date.localeCompare(a.date); });
    var seen = {}, deduped = [];
    all.forEach(function(i) { var k = i.title.toLowerCase().slice(0, 40); if (!seen[k]) { seen[k] = true; deduped.push(i); } });
    var grouped = {};
    deduped.forEach(function(i) { if (!grouped[i.date]) grouped[i.date] = []; grouped[i.date].push(i); });
    cache = grouped; cacheTime = Date.now();
    console.log("  ✓ " + deduped.length + " articles across " + Object.keys(grouped).length + " days");
    return grouped;
  });
}

var server = http.createServer(function(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,X-Api-Key");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }
  var parsed = urlMod.parse(req.url, true), pathname = parsed.pathname;

  if (pathname === "/rss/defence-news") {
    var force = parsed.query.fresh === "1";
    console.log("→ /rss/defence-news" + (force ? " (force refresh)" : ""));
    fetchNews(force).then(function(data) {
      var j = JSON.stringify(data);
      res.writeHead(200, { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(j) }); res.end(j);
    }).catch(function(e) { res.writeHead(500, { "Content-Type": "application/json" }); res.end(JSON.stringify({ error: e.message })); });
    return;
  }

  var fullPath = parsed.path;
  console.log("→ " + req.method + " " + fullPath);
  var opts = { hostname: API_HOST, port: 443, path: fullPath, method: req.method, headers: Object.assign({}, req.headers, { host: API_HOST }) };
  delete opts.headers.origin; delete opts.headers.referer;
  var pr = https.request(opts, function(pRes) {
    console.log("  ← " + pRes.statusCode);
    var h = Object.assign({}, pRes.headers); delete h["access-control-allow-origin"];
    res.writeHead(pRes.statusCode, h); pRes.pipe(res);
  });
  pr.on("error", function(e) { res.writeHead(502); res.end(JSON.stringify({ error: e.message })); });
  req.pipe(pr);
});

server.listen(PORT, function() {
  console.log("\n🛡️  Raksha Proxy v3 on http://localhost:" + PORT);
  console.log("   API: https://" + API_HOST);
  console.log("   RSS: " + RSS_FEEDS.length + " feeds | /rss/defence-news");
  console.log("   Add ?fresh=1 to force refresh cache");
  console.log("   Ctrl+C to stop\n");
});
