const GOLD = "#949437";
const BLUE = "#8fa9dc";
const DARK_TEXT = "#1a1a1a";
const LIGHT_BG = "#f4f4f2";
const LOGO = "/manus-storage/delmon_logo_official_81df30cc.png";
const IMG = "/manus-storage/p1_park_view_19fba288.png";

const d = {
  name: "بارك فيو",
  type: "مركز تجاري",
  city: "الرياض",
  district: "حي العليا",
  area: "45,000",
  floors: "4",
  year: "2025",
  desc: "مشروع تجاري متكامل يضم محلات تجارية ومكاتب إدارية بموقع استراتيجي في قلب العاصمة الرياض، مع مواقف سيارات متعددة الطوابق وأنظمة أمن متكاملة.",
  units: [
    { no: "A-101", floor: "1", area: "250 م²", type: "محل تجاري", rent: "25,000 ر.س" },
    { no: "B-201", floor: "2", area: "180 م²", type: "مكتب إداري", rent: "18,000 ر.س" },
    { no: "C-301", floor: "3", area: "320 م²", type: "مطعم",       rent: "35,000 ر.س" },
  ],
};

/* ─── قالب Delmon Blue ─────────────────────────────────────── */
function BlueSlide1() {
  return (
    <div style={{ width:1123, height:794, display:"flex", fontFamily:"'Cairo',sans-serif", direction:"rtl", background:"#fff", overflow:"hidden", position:"relative" }}>
      {/* يمين: محتوى */}
      <div style={{ width:500, padding:"52px 48px", display:"flex", flexDirection:"column", justifyContent:"space-between", zIndex:2 }}>
        <div>
          <img src={LOGO} alt="" style={{ height:56, marginBottom:28 }} />
          <div style={{ width:56, height:3, background:GOLD, marginBottom:14 }} />
          <div style={{ fontSize:11, color:BLUE, fontWeight:700, letterSpacing:3, marginBottom:10 }}>LEASING BROCHURE | بروشور التأجير</div>
          <div style={{ fontSize:52, fontWeight:900, color:DARK_TEXT, lineHeight:1.15, marginBottom:10 }}>{d.name}</div>
          <div style={{ fontSize:16, color:GOLD, fontWeight:700, marginBottom:20 }}>{d.type} &nbsp;•&nbsp; {d.city}</div>
          <div style={{ fontSize:13, color:"#555", lineHeight:2, maxWidth:380 }}>{d.desc}</div>
        </div>
        {/* إحصائيات */}
        <div style={{ display:"flex", gap:14 }}>
          {[{l:"إجمالي المساحة",v:`${d.area} م²`},{l:"عدد الطوابق",v:d.floors},{l:"سنة الإنجاز",v:d.year}].map((s,i)=>(
            <div key={i} style={{ flex:1, background:LIGHT_BG, border:`2px solid ${BLUE}`, borderRadius:8, padding:"14px 10px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{s.v}</div>
              <div style={{ fontSize:10, color:"#888", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* يسار: صورة */}
      <div style={{ flex:1, position:"relative" }}>
        <img src={IMG} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"grayscale(30%)" }} />
        {/* إطار أزرق */}
        <div style={{ position:"absolute", inset:24, border:`3px solid ${BLUE}`, borderRadius:4, pointerEvents:"none" }} />
        {/* شريط سفلي */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:48, background:`${GOLD}cc`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
          <span style={{ fontSize:11, color:"#fff", fontWeight:700, letterSpacing:2 }}>SLIDE /01</span>
          <span style={{ fontSize:11, color:"#fff" }}>delmoninvest.com</span>
        </div>
      </div>
    </div>
  );
}

function BlueSlide2() {
  return (
    <div style={{ width:1123, height:794, display:"flex", fontFamily:"'Cairo',sans-serif", direction:"rtl", background:"#fff", overflow:"hidden" }}>
      {/* شريط جانبي ذهبي */}
      <div style={{ width:8, background:GOLD, flexShrink:0 }} />
      <div style={{ flex:1, padding:"44px 52px", display:"flex", flexDirection:"column" }}>
        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:28, fontWeight:900, color:DARK_TEXT }}>{d.name}</div>
            <div style={{ fontSize:12, color:BLUE, fontWeight:600, letterSpacing:2 }}>تفاصيل المشروع | PROJECT DETAILS</div>
          </div>
          <img src={LOGO} alt="" style={{ height:44 }} />
        </div>
        <div style={{ height:2, background:`linear-gradient(to left,${GOLD},transparent)`, marginBottom:28 }} />
        {/* Grid معلومات */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:24 }}>
          {[{l:"نوع المشروع",v:d.type},{l:"المدينة",v:d.city},{l:"الحي / الموقع",v:d.district},{l:"إجمالي المساحة",v:`${d.area} م²`},{l:"عدد الطوابق",v:d.floors},{l:"سنة الإنجاز",v:d.year}].map((item,i)=>(
            <div key={i} style={{ background:LIGHT_BG, borderRadius:8, padding:"14px 18px", borderRight:`4px solid ${GOLD}` }}>
              <div style={{ fontSize:10, color:"#999", marginBottom:4 }}>{item.l}</div>
              <div style={{ fontSize:16, fontWeight:800, color:DARK_TEXT }}>{item.v}</div>
            </div>
          ))}
        </div>
        {/* جدول الوحدات */}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:800, color:GOLD, marginBottom:10, letterSpacing:1 }}>الوحدات المتاحة</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:GOLD }}>
                {["رقم الوحدة","الطابق","المساحة","النوع","الإيجار الشهري"].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 14px", color:"#fff", fontWeight:700, textAlign:"right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.units.map((u,i)=>(
                <tr key={i} style={{ background: i%2===0?"#fff":LIGHT_BG }}>
                  <td style={{ padding:"10px 14px", color:DARK_TEXT, fontWeight:700 }}>{u.no}</td>
                  <td style={{ padding:"10px 14px", color:"#555" }}>{u.floor}</td>
                  <td style={{ padding:"10px 14px", color:"#555" }}>{u.area}</td>
                  <td style={{ padding:"10px 14px", color:"#555" }}>{u.type}</td>
                  <td style={{ padding:"10px 14px", color:GOLD, fontWeight:800 }}>{u.rent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize:10, color:"#bbb", marginTop:12, textAlign:"left", letterSpacing:1 }}>SLIDE /02 | delmoninvest.com</div>
      </div>
    </div>
  );
}

/* ─── قالب Delmon Dark ─────────────────────────────────────── */
const DB = "#0d1b2a";
const DC = "#162032";

function DarkSlide1() {
  return (
    <div style={{ width:1123, height:794, display:"flex", fontFamily:"'Cairo',sans-serif", direction:"rtl", background:DB, overflow:"hidden", position:"relative" }}>
      {/* يمين: محتوى */}
      <div style={{ width:500, padding:"52px 48px", display:"flex", flexDirection:"column", justifyContent:"space-between", zIndex:2 }}>
        <div>
          <img src={LOGO} alt="" style={{ height:56, marginBottom:28, filter:"brightness(0) invert(1)" }} />
          <div style={{ width:56, height:3, background:GOLD, marginBottom:14 }} />
          <div style={{ fontSize:11, color:BLUE, fontWeight:700, letterSpacing:3, marginBottom:10 }}>LEASING BROCHURE | بروشور التأجير</div>
          <div style={{ fontSize:52, fontWeight:900, color:"#fff", lineHeight:1.15, marginBottom:10 }}>{d.name}</div>
          <div style={{ fontSize:16, color:GOLD, fontWeight:700, marginBottom:20 }}>{d.type} &nbsp;•&nbsp; {d.city}</div>
          <div style={{ fontSize:13, color:"#aaa", lineHeight:2, maxWidth:380 }}>{d.desc}</div>
        </div>
        <div style={{ display:"flex", gap:14 }}>
          {[{l:"إجمالي المساحة",v:`${d.area} م²`},{l:"عدد الطوابق",v:d.floors},{l:"سنة الإنجاز",v:d.year}].map((s,i)=>(
            <div key={i} style={{ flex:1, background:DC, border:`1.5px solid ${GOLD}55`, borderRadius:8, padding:"14px 10px", textAlign:"center" }}>
              <div style={{ fontSize:22, fontWeight:900, color:GOLD }}>{s.v}</div>
              <div style={{ fontSize:10, color:"#666", marginTop:4 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      {/* يسار: صورة */}
      <div style={{ flex:1, position:"relative" }}>
        <img src={IMG} alt="" style={{ width:"100%", height:"100%", objectFit:"cover", filter:"grayscale(50%) brightness(0.65)" }} />
        <div style={{ position:"absolute", inset:0, background:`linear-gradient(to right,${DB} 0%,transparent 35%)` }} />
        <div style={{ position:"absolute", inset:24, border:`2px solid ${GOLD}50`, borderRadius:4, pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:48, background:`${GOLD}bb`, display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 24px" }}>
          <span style={{ fontSize:11, color:"#fff", fontWeight:700, letterSpacing:2 }}>SLIDE /01</span>
          <span style={{ fontSize:11, color:"#fff" }}>delmoninvest.com</span>
        </div>
      </div>
    </div>
  );
}

function DarkSlide2() {
  return (
    <div style={{ width:1123, height:794, display:"flex", fontFamily:"'Cairo',sans-serif", direction:"rtl", background:DB, overflow:"hidden" }}>
      <div style={{ width:8, background:GOLD, flexShrink:0 }} />
      <div style={{ flex:1, padding:"44px 52px", display:"flex", flexDirection:"column" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:28 }}>
          <div>
            <div style={{ fontSize:28, fontWeight:900, color:"#fff" }}>{d.name}</div>
            <div style={{ fontSize:12, color:BLUE, fontWeight:600, letterSpacing:2 }}>تفاصيل المشروع | PROJECT DETAILS</div>
          </div>
          <img src={LOGO} alt="" style={{ height:44, filter:"brightness(0) invert(1)" }} />
        </div>
        <div style={{ height:2, background:`linear-gradient(to left,${GOLD},transparent)`, marginBottom:28 }} />
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:14, marginBottom:24 }}>
          {[{l:"نوع المشروع",v:d.type},{l:"المدينة",v:d.city},{l:"الحي / الموقع",v:d.district},{l:"إجمالي المساحة",v:`${d.area} م²`},{l:"عدد الطوابق",v:d.floors},{l:"سنة الإنجاز",v:d.year}].map((item,i)=>(
            <div key={i} style={{ background:DC, borderRadius:8, padding:"14px 18px", borderRight:`4px solid ${GOLD}` }}>
              <div style={{ fontSize:10, color:"#555", marginBottom:4 }}>{item.l}</div>
              <div style={{ fontSize:16, fontWeight:800, color:"#fff" }}>{item.v}</div>
            </div>
          ))}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13, fontWeight:800, color:GOLD, marginBottom:10, letterSpacing:1 }}>الوحدات المتاحة</div>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr style={{ background:GOLD }}>
                {["رقم الوحدة","الطابق","المساحة","النوع","الإيجار الشهري"].map((h,i)=>(
                  <th key={i} style={{ padding:"10px 14px", color:"#fff", fontWeight:700, textAlign:"right" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {d.units.map((u,i)=>(
                <tr key={i} style={{ background: i%2===0?DC:"#1e2d3d" }}>
                  <td style={{ padding:"10px 14px", color:"#fff", fontWeight:700 }}>{u.no}</td>
                  <td style={{ padding:"10px 14px", color:"#aaa" }}>{u.floor}</td>
                  <td style={{ padding:"10px 14px", color:"#aaa" }}>{u.area}</td>
                  <td style={{ padding:"10px 14px", color:"#aaa" }}>{u.type}</td>
                  <td style={{ padding:"10px 14px", color:GOLD, fontWeight:800 }}>{u.rent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ fontSize:10, color:"#444", marginTop:12, textAlign:"left", letterSpacing:1 }}>SLIDE /02 | delmoninvest.com</div>
      </div>
    </div>
  );
}

/* ─── صفحة العرض ─────────────────────────────────────────── */
export default function TemplateMockup() {
  return (
    <div style={{ background:"#2a2a2a", minHeight:"100vh", padding:"48px 40px", fontFamily:"'Cairo',sans-serif" }}>
      <div style={{ maxWidth:1200, margin:"0 auto" }}>
        <h1 style={{ textAlign:"center", color:"#fff", fontSize:22, fontWeight:900, marginBottom:6 }}>نماذج القوالب المقترحة</h1>
        <p style={{ textAlign:"center", color:"#aaa", fontSize:12, marginBottom:48 }}>هوية دلمون الرسمية — أفقي A4 Landscape</p>

        {/* Delmon Blue */}
        <div style={{ marginBottom:56 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:4, height:24, background:BLUE, borderRadius:2 }} />
            <span style={{ color:"#fff", fontSize:16, fontWeight:700 }}>القالب الثاني — Delmon Blue</span>
            <span style={{ fontSize:11, color:"#888", background:"#333", padding:"3px 10px", borderRadius:20 }}>خلفية فاتحة • هوية رسمية</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:3, boxShadow:"0 12px 48px rgba(0,0,0,0.5)", borderRadius:6, overflow:"hidden" }}>
            <div style={{ transform:"scale(0.85)", transformOrigin:"top right", width:1123, marginBottom:-120 }}><BlueSlide1 /></div>
            <div style={{ transform:"scale(0.85)", transformOrigin:"top right", width:1123 }}><BlueSlide2 /></div>
          </div>
        </div>

        {/* Delmon Dark */}
        <div style={{ marginBottom:40 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ width:4, height:24, background:GOLD, borderRadius:2 }} />
            <span style={{ color:"#fff", fontSize:16, fontWeight:700 }}>القالب الثالث — Delmon Dark</span>
            <span style={{ fontSize:11, color:"#888", background:"#333", padding:"3px 10px", borderRadius:20 }}>خلفية داكنة • فاخر</span>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:3, boxShadow:"0 12px 48px rgba(0,0,0,0.5)", borderRadius:6, overflow:"hidden" }}>
            <div style={{ transform:"scale(0.85)", transformOrigin:"top right", width:1123, marginBottom:-120 }}><DarkSlide1 /></div>
            <div style={{ transform:"scale(0.85)", transformOrigin:"top right", width:1123 }}><DarkSlide2 /></div>
          </div>
        </div>

        <p style={{ textAlign:"center", color:"#666", fontSize:12, marginTop:32 }}>
          هذه نماذج أولية للصفحتين الأولى والثانية فقط — بعد موافقتك أكمل الصفحات الأربع الكاملة لكل قالب
        </p>
      </div>
    </div>
  );
}
