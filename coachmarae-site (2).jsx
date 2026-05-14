import { useState, useEffect } from "react";

// ── Fonts ─────────────────────────────────────────────────────────
const fl = document.createElement("link");
fl.href = "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Nunito:wght@300;400;500;600;700&display=swap";
fl.rel = "stylesheet";
document.head.appendChild(fl);

// ── Tokens ────────────────────────────────────────────────────────
const C = {
  cream: "#faf8f3", surface: "#f2ebe0", card: "#fffdf8",
  sage: "#8fa891", sageDk: "#5d7a62", gold: "#c9a56a",
  rose: "#c49891", brown: "#382e28", muted: "#897870",
  soft: "#b5a89e", border: "#e2d8cc",
  shadow: "0 4px 32px rgba(56,46,40,0.08)",
  shadowMd: "0 8px 40px rgba(56,46,40,0.12)",
};

// ── CSS ───────────────────────────────────────────────────────────
const styleEl = document.createElement("style");
styleEl.textContent = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body { background: ${C.cream}; font-family: 'Nunito', sans-serif; }

  @keyframes fadeUp   { from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)} }
  @keyframes orbFloat { 0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-14px) scale(1.04)} }
  @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(143,168,145,0.35)}50%{box-shadow:0 0 0 14px rgba(143,168,145,0)} }
  @keyframes shimmer  { 0%{opacity:0.7}50%{opacity:1}100%{opacity:0.7} }

  .fu  { animation: fadeUp 0.8s ease both; }
  .fu2 { animation: fadeUp 0.8s 0.15s ease both; }
  .fu3 { animation: fadeUp 0.8s 0.30s ease both; }
  .fu4 { animation: fadeUp 0.8s 0.45s ease both; }
  .fu5 { animation: fadeUp 0.8s 0.60s ease both; }
  .orb { animation: orbFloat 6s ease-in-out infinite; }

  .nav-btn {
    font-family:'Nunito',sans-serif; font-size:0.78rem; font-weight:600;
    letter-spacing:0.12em; text-transform:uppercase;
    color:${C.muted}; background:transparent; border:none;
    border-radius:24px; padding:0.4rem 0.85rem; cursor:pointer;
    transition:all 0.3s ease;
  }
  .nav-btn:hover  { color:${C.brown}; background:${C.surface}; }
  .nav-btn.active { color:${C.sageDk}; background:${C.surface}; }

  .btn { font-family:'Nunito',sans-serif; font-size:0.88rem; font-weight:700;
    letter-spacing:0.06em; border:none; border-radius:32px;
    padding:0.8rem 2.2rem; cursor:pointer; transition:all 0.3s ease; display:inline-block; }
  .btn-fill    { background:${C.sage}; color:#fff; animation:pulse 3s ease-in-out infinite; }
  .btn-fill:hover { background:${C.sageDk}; transform:translateY(-2px); }
  .btn-outline { background:transparent; color:${C.sage}; border:2px solid ${C.sage}; }
  .btn-outline:hover { background:${C.sage}; color:#fff; }

  .card { background:${C.card}; border-radius:20px; border:1px solid ${C.border};
    box-shadow:${C.shadow}; transition:box-shadow 0.3s ease; }
  .card:hover { box-shadow:${C.shadowMd}; }

  .pill { display:inline-block; font-family:'Nunito',sans-serif; font-size:0.68rem;
    font-weight:700; letter-spacing:0.18em; text-transform:uppercase;
    padding:0.25rem 0.9rem; border-radius:20px; }

  .mood-btn { border:2px solid ${C.border}; background:transparent; border-radius:50%;
    cursor:pointer; transition:all 0.25s ease; font-family:'Nunito',sans-serif;
    font-weight:700; color:${C.muted}; }
  .mood-btn:hover { border-color:${C.sage}; color:${C.sageDk}; transform:scale(1.1); }
  .mood-btn.sel { border-color:transparent; color:#fff; transform:scale(1.15);
    box-shadow:0 4px 18px rgba(0,0,0,0.15); }

  textarea, input[type="text"], input[type="email"] {
    font-family:'Nunito',sans-serif; font-size:0.9rem; color:${C.brown};
    background:${C.cream}; border:1.5px solid ${C.border}; border-radius:12px;
    padding:0.75rem 1rem; width:100%; outline:none; transition:border-color 0.3s ease; resize:vertical;
  }
  textarea:focus, input:focus { border-color:${C.sage}; }

  .sigma-m {
    font-family:'Cormorant Garamond',serif;
    font-style:italic; font-weight:400;
    color:#fff; font-size:2.2rem; line-height:1;
    letter-spacing:-0.05em; user-select:none;
  }
`;
document.head.appendChild(styleEl);

// ── Data ──────────────────────────────────────────────────────────
const MOODS = [
  {n:1,  label:"Rock Bottom",   emoji:"🌑", desc:"Numb, hopeless, or in crisis. Everything feels impossible.",        body:"Heavy, exhausted, barely moving",        bg:"#b0a098"},
  {n:2,  label:"Very Low",      emoji:"🌒", desc:"Deeply sad or withdrawn. Hard to engage with anything.",            body:"Tense, hollow, tearful",                 bg:"#a89e96"},
  {n:3,  label:"Low",           emoji:"🌓", desc:"Struggling. Getting through the day takes real effort.",            body:"Dragging, foggy, low appetite",          bg:"#a8a89a"},
  {n:4,  label:"Below Average", emoji:"🌔", desc:"Off. Not yourself. Functional but quietly not okay.",              body:"Restless, irritable, disconnected",       bg:"#a0a898"},
  {n:5,  label:"Neutral",       emoji:"🌕", desc:"Neither bad nor good. Baseline. Just existing.",                   body:"Flat, steady, going through motions",    bg:"#98a898"},
  {n:6,  label:"Okay",          emoji:"⛅", desc:"A little spark. Manageable. Some moments of ease.",                body:"Loosening, slightly energized, present", bg:"#8fa891"},
  {n:7,  label:"Good",          emoji:"☀️", desc:"Engaged. Things feel doable. Connecting with others.",             body:"Lighter, clearer, breathing easier",     bg:"#c9a56a"},
  {n:8,  label:"Really Good",   emoji:"✨", desc:"Genuinely enjoying life. Motivated and grounded.",                 body:"Open, warm, expansive",                  bg:"#c49891"},
  {n:9,  label:"Thriving",      emoji:"🌟", desc:"Vibrant. Creative. Deeply connected to what matters.",             body:"Joyful, embodied, present",              bg:"#a08cb0"},
  {n:10, label:"Peak Joy",      emoji:"🌸", desc:"Overflowing. Fully alive, fully present, fully yourself.",         body:"Radiant, grounded, complete",            bg:"#c4a082"},
];

const PILLARS = [
  {icon:"🧠", title:"Nervous System Literacy", desc:"Understanding your own biology isn't clinical — it's compassionate. When you know why your body responds the way it does, shame loses its grip."},
  {icon:"🌿", title:"ACT Principles", desc:"Acceptance & Commitment Therapy helps you stop fighting your inner world and start moving toward the life that actually matters to you."},
  {icon:"✝️", title:"Faith Integration", desc:"Wholeness isn't just psychological. Your faith isn't separate from your healing — it's woven through it. We hold both."},
];

const TESTIMONIALS = [
  {quote:"You offer good advice and real presence, not just answers.", name:"A.J."},
  {quote:"Even when I didn't know what I needed, you were there.", name:"Jenny"},
  {quote:"You're structured and focused but still make space for people to feel heard.", name:"Morgan"},
  {quote:"You're a good listener, thoughtful and intentional in everything you do.", name:"Liam"},
];

const BELIEFS = [
  "Every neurodivergent person has gifts that can become their unique superpower.",
  "Jesus meets us in the mess of life, not just at the finish line.",
  "We are never broken beyond repair.",
  "Mental health and spiritual health are not in conflict — they're intertwined.",
  "You can be neurodivergent and still be called.",
  "God doesn't rush healing. He goes at your pace.",
];

const VALUES = [
  {title:"Compassion before correction", desc:"People open up when they feel safe, not judged."},
  {title:"Faith with feet", desc:"I take practical steps rooted in biblical wisdom — embodied trust, not just belief."},
  {title:"Accessibility matters", desc:"I make intentional space for neurodivergent believers, the chronically ill, and those hurt by church culture."},
  {title:"Authentic connection", desc:"I'd rather sit in the tension with you than offer a quick fix."},
  {title:"Rest as resistance", desc:"Sabbath isn't optional — it's a sacred space for survival."},
];

const RESOURCES = [
  {icon:"📖", title:"Understanding Central Sensitization", desc:"A gentle intro to CSS — what it is, how it develops, and why it's not 'all in your head.'", tag:"Education", tc:"#c9a56a"},
  {icon:"🫁", title:"The 4-7-8 Breath", desc:"A nervous system reset you can do anywhere. Inhale 4 counts, hold 7, exhale 8. Simple. Effective. Free.", tag:"Tool", tc:"#8fa891"},
  {icon:"📋", title:"Window of Tolerance Tracker", desc:"A daily worksheet for noticing when you're activated, shutdown, or regulated — so you can respond instead of react.", tag:"Worksheet", tc:"#c49891"},
  {icon:"🎮", title:"One Accord: The Guild", desc:"A faith-and-gaming Discord community where neurodivergent believers find belonging. Discipleship meets the digital world.", tag:"Community", tc:"#a08cb0"},
  {icon:"🔬", title:"The Sophrosyne Method", desc:"A walkthrough of the three-pillar framework: Nervous System Literacy · ACT Principles · Faith Integration.", tag:"Framework", tc:"#c9a56a"},
  {icon:"💬", title:"Free Consultation", desc:"Not sure if coaching is right for you? Book a no-pressure 20-minute conversation to find out.", tag:"Connect", tc:"#5d7a62"},
];

function fmt(ts) {
  return new Date(ts).toLocaleDateString("en-US",{month:"short",day:"numeric",hour:"numeric",minute:"2-digit"});
}

// ── σM Logo ───────────────────────────────────────────────────────
function SigmaMLogo({ size = 110 }) {
  return (
    <div className="orb" style={{
      width:size, height:size, borderRadius:"50%", margin:"0 auto",
      background:`radial-gradient(circle at 35% 30%, #b8d4ba, ${C.sage} 55%, ${C.sageDk})`,
      boxShadow:`0 0 60px rgba(143,168,145,0.45)`,
      display:"flex", alignItems:"center", justifyContent:"center",
      flexDirection:"column", position:"relative", flexShrink:0,
    }}>
      <div style={{
        fontFamily:"'Cormorant Garamond',serif",
        color:"#fff", lineHeight:1, userSelect:"none",
        display:"flex", alignItems:"baseline", gap:"1px",
      }}>
        <span style={{fontSize:size*0.32, fontStyle:"italic", fontWeight:300, letterSpacing:"-0.02em", opacity:0.92}}>σ</span>
        <span style={{fontSize:size*0.38, fontStyle:"normal", fontWeight:500, letterSpacing:"-0.04em"}}>M</span>
      </div>
    </div>
  );
}

// ── Nav ───────────────────────────────────────────────────────────
function Nav({page, go}) {
  const tabs = [{id:"home",label:"Home"},{id:"checkin",label:"Check In"},{id:"journey",label:"My Journey"},{id:"work",label:"Work With Me"},{id:"resources",label:"Resources"}];
  return (
    <nav style={{
      position:"sticky", top:0, zIndex:200,
      background:"rgba(250,248,243,0.94)", backdropFilter:"blur(14px)",
      borderBottom:`1px solid ${C.border}`,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0.7rem 1.5rem", gap:"0.5rem", flexWrap:"wrap",
    }}>
      <div onClick={()=>go("home")} style={{
        display:"flex", alignItems:"center", gap:"0.6rem", cursor:"pointer", userSelect:"none",
      }}>
        <div style={{
          width:34, height:34, borderRadius:"50%",
          background:`radial-gradient(circle at 35% 30%, #b8d4ba, ${C.sage} 55%, ${C.sageDk})`,
          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
          boxShadow:`0 2px 10px rgba(143,168,145,0.4)`,
        }}>
          <span style={{fontFamily:"'Cormorant Garamond',serif", color:"#fff", display:"flex", alignItems:"baseline", gap:"0px"}}>
            <span style={{fontSize:"0.7rem", fontStyle:"italic", fontWeight:300}}>σ</span>
            <span style={{fontSize:"0.82rem", fontStyle:"normal", fontWeight:500}}>M</span>
          </span>
        </div>
        <span style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontWeight:400, color:C.brown, letterSpacing:"0.03em"}}>
          Coach<span style={{color:C.sage}}>Marae</span>
        </span>
      </div>
      <div style={{display:"flex", gap:"0.15rem", flexWrap:"wrap"}}>
        {tabs.map(t=>(
          <button key={t.id} className={`nav-btn${page===t.id?" active":""}`} onClick={()=>go(t.id)}>{t.label}</button>
        ))}
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════
// HOME
// ══════════════════════════════════════════════════════════════════
function Home({go}) {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  useEffect(()=>{
    const t = setInterval(()=>setActiveTestimonial(p=>(p+1)%TESTIMONIALS.length), 6000);
    return ()=>clearInterval(t);
  },[]);

  return (
    <div style={{maxWidth:860, margin:"0 auto", padding:"0 1.5rem 6rem"}}>

      {/* Hero */}
      <div style={{textAlign:"center", padding:"4.5rem 0 3.5rem"}}>
        <SigmaMLogo size={120} />
        <div style={{height:"2rem"}} />
        <p className="pill fu" style={{background:C.surface, color:C.sage, marginBottom:"1rem"}}>
          Unfiltered Support · Lifelong Tools · Rooted in Faith
        </p>
        <h1 className="fu2" style={{
          fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(2.4rem,7vw,4rem)", fontWeight:300,
          color:C.brown, lineHeight:1.15, marginBottom:"0.5rem",
        }}>
          You were made<br /><em style={{color:C.sage}}>for wholeness.</em>
        </h1>
        <p className="fu3" style={{
          fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem",
          color:C.soft, fontStyle:"italic", letterSpacing:"0.06em", marginBottom:"1.5rem",
        }}>
          σωφροσύνη — soundness of mind, body, and spirit
        </p>
        <p className="fu4" style={{color:C.muted, fontSize:"1rem", lineHeight:1.8, maxWidth:540, margin:"0 auto 1.2rem"}}>
          Equipping neurodivergent minds to reclaim clarity and purpose
          through biblical tools that fit their God-given wiring.
        </p>
        <div className="fu5" style={{display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap"}}>
          <button className="btn btn-fill" onClick={()=>go("work")}>Book a Free Call</button>
          <button className="btn btn-outline" onClick={()=>go("checkin")}>Check In Today</button>
        </div>
      </div>

      <div style={{textAlign:"center", marginBottom:"3.5rem"}}>
        <div style={{width:40, height:2, background:C.border, margin:"0 auto"}} />
      </div>

      {/* Pain points */}
      <div className="card" style={{padding:"2.5rem", marginBottom:"2rem", textAlign:"center"}}>
        <p className="pill" style={{background:`${C.rose}22`, color:C.rose, marginBottom:"1.2rem"}}>Does this sound familiar?</p>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:C.brown, marginBottom:"1.5rem"}}>
          Overwhelmed?
        </h2>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1rem", textAlign:"left"}}>
          {[
            "You often feel overwhelmed, even when you're trying your best.",
            "It's hard to find peace, purpose, or people who really get you.",
            "You're looking for faith-based support that's gentle, practical, and made for minds like yours.",
          ].map((p,i)=>(
            <div key={i} style={{display:"flex", gap:"0.75rem", alignItems:"flex-start"}}>
              <span style={{color:C.rose, fontSize:"1.1rem", flexShrink:0, marginTop:"0.1rem"}}>◦</span>
              <p style={{color:C.muted, fontSize:"0.92rem", lineHeight:1.7}}>{p}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div style={{
        background:`linear-gradient(135deg, ${C.sage}15, ${C.gold}10)`,
        border:`1px solid ${C.border}`, borderRadius:20,
        padding:"2rem", marginBottom:"3rem", textAlign:"center",
      }}>
        <p className="pill" style={{background:C.surface, color:C.sage, marginBottom:"1.2rem"}}>What becomes possible</p>
        <div style={{display:"flex", gap:"1rem", flexWrap:"wrap", justifyContent:"center"}}>
          {["More calm, grounded, and focused","Clearer about your goals and next steps","At peace with yourself and closer to God","Energized and ready to move forward"].map((b,i)=>(
            <div key={i} style={{
              background:C.card, border:`1px solid ${C.border}`,
              borderRadius:32, padding:"0.5rem 1.2rem",
              fontFamily:"'Nunito',sans-serif", fontSize:"0.88rem",
              color:C.brown, fontWeight:500,
            }}>✦ {b}</div>
          ))}
        </div>
      </div>

      {/* Story strip */}
      <div className="card" style={{padding:"2.5rem", marginBottom:"3rem", display:"flex", gap:"2.5rem", flexWrap:"wrap", alignItems:"flex-start"}}>
        <div style={{flex:1, minWidth:220}}>
          <p className="pill" style={{background:`${C.rose}22`, color:C.rose, marginBottom:"0.75rem"}}>A Coach Who Gets It</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.9rem", fontWeight:400, color:C.brown, marginBottom:"0.9rem"}}>
            Thirty years of pain.<br />Finally, a name for it.
          </h2>
          <p style={{color:C.muted, lineHeight:1.85, marginBottom:"0.9rem", fontSize:"0.93rem"}}>
            I became a coach because I know what it's like to feel overwhelmed, unseen, and unsure how to move forward. I lived with undiagnosed Central Sensitization Syndrome for three decades before finding answers at Mayo Clinic's Pain Rehabilitation Center. That journey — the disbelief, the searching, the exhaustion, and the eventual naming — shapes every session I hold.
          </p>
          <p style={{color:C.muted, lineHeight:1.85, marginBottom:"1.2rem", fontSize:"0.93rem"}}>
            I coach from the inside of this experience, not from a textbook. I didn't want to offer surface-level support — I wanted to walk with people in a way that honored both their faith and their mental health.
          </p>
          <button className="btn btn-outline" onClick={()=>go("work")} style={{fontSize:"0.8rem", padding:"0.6rem 1.5rem"}}>
            Read My Full Story →
          </button>
        </div>
      </div>

      {/* Sophrosyne Method */}
      <div style={{marginBottom:"3rem"}}>
        <div style={{textAlign:"center", marginBottom:"2rem"}}>
          <p className="pill" style={{background:`${C.gold}22`, color:C.gold, marginBottom:"0.75rem"}}>The Framework</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(1.8rem,5vw,2.6rem)", fontWeight:300, color:C.brown}}>
            The Sophrosyne Method
          </h2>
          <p style={{color:C.soft, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", marginTop:"0.4rem"}}>σωφροσύνη — soundness of mind</p>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))", gap:"1.2rem"}}>
          {PILLARS.map((p,i)=>(
            <div key={i} className="card" style={{padding:"1.8rem 1.5rem", textAlign:"center"}}>
              <div style={{fontSize:"2rem", marginBottom:"0.75rem"}}>{p.icon}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.25rem", fontWeight:500, color:C.brown, marginBottom:"0.6rem"}}>{p.title}</h3>
              <p style={{color:C.muted, fontSize:"0.88rem", lineHeight:1.7}}>{p.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div style={{marginBottom:"3rem"}}>
        <div style={{textAlign:"center", marginBottom:"2rem"}}>
          <p className="pill" style={{background:`${C.sage}22`, color:C.sage, marginBottom:"0.75rem"}}>The Process</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:C.brown}}>How It Works</h2>
        </div>
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:"1.2rem"}}>
          {[
            {step:"01", title:"Book a Call", desc:"Let's see if we're a good fit. No pressure — just your name and a conversation."},
            {step:"02", title:"Start Sessions", desc:"We'll explore what's feeling hard, what your goals are, and shape a plan that supports you."},
            {step:"03", title:"Find Your Flow", desc:"We'll build your toolkit — more calm, confidence, and clarity that fits YOU."},
          ].map((s,i)=>(
            <div key={i} className="card" style={{padding:"1.8rem", position:"relative"}}>
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"3rem", fontWeight:300, color:`${C.sage}40`, lineHeight:1, marginBottom:"0.5rem"}}>{s.step}</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontWeight:500, color:C.brown, marginBottom:"0.5rem"}}>{s.title}</h3>
              <p style={{color:C.muted, fontSize:"0.88rem", lineHeight:1.7}}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonials */}
      <div style={{marginBottom:"3rem", textAlign:"center"}}>
        <p className="pill" style={{background:`${C.rose}22`, color:C.rose, marginBottom:"1.5rem"}}>What Clients Are Saying</p>
        <div className="card" style={{padding:"2.5rem", maxWidth:540, margin:"0 auto", minHeight:120, display:"flex", flexDirection:"column", justifyContent:"center"}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontStyle:"italic", color:C.brown, lineHeight:1.7, marginBottom:"1rem", transition:"all 0.5s ease"}}>
            "{TESTIMONIALS[activeTestimonial].quote}"
          </p>
          <p style={{color:C.soft, fontSize:"0.82rem", letterSpacing:"0.1em"}}>— {TESTIMONIALS[activeTestimonial].name}</p>
          <div style={{display:"flex", gap:"0.4rem", justifyContent:"center", marginTop:"1.2rem"}}>
            {TESTIMONIALS.map((_,i)=>(
              <button key={i} onClick={()=>setActiveTestimonial(i)} style={{
                width:6, height:6, borderRadius:"50%", border:"none", cursor:"pointer",
                background:i===activeTestimonial?C.sage:C.border, transition:"background 0.3s ease",
              }}/>
            ))}
          </div>
        </div>
      </div>

      {/* Check-in CTA */}
      <div style={{
        background:`linear-gradient(135deg, ${C.sage}18, ${C.gold}12)`,
        border:`1px solid ${C.border}`, borderRadius:24, padding:"2.5rem", textAlign:"center",
      }}>
        <p className="pill" style={{background:C.surface, color:C.sage, marginBottom:"1rem"}}>Daily Practice</p>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:C.brown, marginBottom:"0.75rem"}}>
          How are you <em>right now?</em>
        </h2>
        <p style={{color:C.muted, marginBottom:"1.5rem", fontSize:"0.95rem"}}>Awareness is always the first step. Take 60 seconds for yourself.</p>
        <button className="btn btn-fill" onClick={()=>go("checkin")}>Open the Mood Scale</button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// CHECK IN
// ══════════════════════════════════════════════════════════════════
function CheckIn({go}) {
  const [sel, setSel] = useState(null);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const m = sel ? MOODS[sel-1] : null;

  async function save() {
    const entry = {level:sel, note, timestamp:Date.now()};
    try {
      const existing = await window.storage.get("marae_mood_log");
      const log = existing ? JSON.parse(existing.value) : [];
      log.unshift(entry);
      await window.storage.set("marae_mood_log", JSON.stringify(log.slice(0,90)));
    } catch(e){}
    setSaved(true);
    setTimeout(()=>{setSaved(false);setNote("");setSel(null);}, 2400);
  }

  return (
    <div style={{maxWidth:600, margin:"0 auto", padding:"3rem 1.5rem 6rem"}}>
      <div style={{textAlign:"center", marginBottom:"2.5rem"}}>
        <p className="pill fu" style={{background:`${C.sage}22`, color:C.sage, marginBottom:"0.8rem"}}>Daily Check-In</p>
        <h1 className="fu2" style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,6vw,3rem)", fontWeight:300, color:C.brown, marginBottom:"0.6rem"}}>
          How are you <em>right now?</em>
        </h1>
        <p className="fu3" style={{color:C.muted, fontSize:"0.92rem"}}>No right or wrong answer. Just where you are.</p>
      </div>

      <div style={{display:"flex", gap:"0.5rem", flexWrap:"wrap", justifyContent:"center", marginBottom:"2.5rem"}}>
        {MOODS.map(mood=>(
          <button key={mood.n} className={`mood-btn${sel===mood.n?" sel":""}`}
            style={{width:52, height:52, fontSize:"1.05rem", background:sel===mood.n?mood.bg:"transparent"}}
            onClick={()=>{setSel(mood.n);setSaved(false);}}>
            {mood.n}
          </button>
        ))}
      </div>

      <div className="card" style={{
        padding:"2rem", minHeight:200, textAlign:"center",
        background:m?`linear-gradient(135deg, ${m.bg}18, ${C.card})`:C.card,
        border:m?`1px solid ${m.bg}55`:`1px solid ${C.border}`,
        marginBottom:"1.5rem", transition:"all 0.4s ease",
      }}>
        {m ? (
          <>
            <div style={{fontSize:"2.5rem", marginBottom:"0.5rem"}}>{m.emoji}</div>
            <div className="pill" style={{background:m.bg, color:"#fff", marginBottom:"1rem"}}>{m.n} — {m.label}</div>
            <p style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.15rem", fontStyle:"italic", color:C.brown, marginBottom:"1rem", lineHeight:1.6}}>"{m.desc}"</p>
            <p style={{fontSize:"0.75rem", color:C.soft, letterSpacing:"0.1em", textTransform:"uppercase"}}>Body signals</p>
            <p style={{color:C.muted, fontSize:"0.9rem", marginTop:"0.3rem"}}>{m.body}</p>
          </>
        ) : (
          <p style={{color:C.border, fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1.1rem", paddingTop:"2.5rem"}}>Select a number above</p>
        )}
      </div>

      {m && (
        <div style={{animation:"fadeUp 0.5s ease both"}}>
          <textarea rows={3} placeholder="Add a note (optional) — what's contributing to this? What do you notice in your body?"
            value={note} onChange={e=>setNote(e.target.value)} style={{marginBottom:"1rem"}}/>
          <div style={{display:"flex", gap:"1rem", justifyContent:"center", flexWrap:"wrap"}}>
            {saved
              ? <div style={{background:`${C.sage}22`, color:C.sageDk, border:`1px solid ${C.sage}55`, borderRadius:32, padding:"0.75rem 2rem", fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.88rem"}}>✓ Saved to your journey</div>
              : <button className="btn btn-fill" onClick={save}>Save Check-In</button>
            }
            <button className="btn btn-outline" onClick={()=>go("journey")}>View My Journey</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// JOURNEY
// ══════════════════════════════════════════════════════════════════
function Journey({go}) {
  const [log, setLog] = useState(null);
  useEffect(()=>{
    (async()=>{
      try { const r = await window.storage.get("marae_mood_log"); setLog(r?JSON.parse(r.value):[]); }
      catch { setLog([]); }
    })();
  },[]);

  async function clearLog() {
    if(!window.confirm("Clear all mood history?")) return;
    try { await window.storage.delete("marae_mood_log"); } catch(e){}
    setLog([]);
  }

  const avg = log&&log.length?(log.reduce((a,e)=>a+e.level,0)/log.length).toFixed(1):null;

  return (
    <div style={{maxWidth:680, margin:"0 auto", padding:"3rem 1.5rem 6rem"}}>
      <div style={{textAlign:"center", marginBottom:"2.5rem"}}>
        <p className="pill fu" style={{background:`${C.rose}22`, color:C.rose, marginBottom:"0.8rem"}}>Your Story</p>
        <h1 className="fu2" style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,6vw,3rem)", fontWeight:300, color:C.brown, marginBottom:"0.6rem"}}>
          My Journey
        </h1>
        <p className="fu3" style={{color:C.muted, fontSize:"0.92rem"}}>A record of where you've been — and how far you've come.</p>
      </div>

      {log&&log.length>0&&(
        <div className="card" style={{padding:"1.5rem 2rem", marginBottom:"2rem", display:"flex", gap:"2rem", flexWrap:"wrap", justifyContent:"space-around", textAlign:"center"}}>
          {[{label:"Check-Ins",val:log.length},{label:"Avg Mood",val:avg},{label:"Most Recent",val:MOODS[log[0].level-1].label}].map((s,i)=>(
            <div key={i}>
              <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:400, color:C.brown}}>{s.val}</div>
              <div style={{fontSize:"0.72rem", color:C.soft, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:"0.2rem"}}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {log&&log.length>0&&(
        <div className="card" style={{padding:"1.5rem", marginBottom:"2rem"}}>
          <p style={{fontSize:"0.72rem", color:C.soft, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:"1rem"}}>Recent trend (last 20)</p>
          <div style={{display:"flex", alignItems:"flex-end", gap:"5px", height:70}}>
            {[...log].slice(0,20).reverse().map((e,i)=>{
              const mood=MOODS[e.level-1];
              return <div key={i} title={`${mood.label} — ${fmt(e.timestamp)}`} style={{flex:1, minWidth:8, height:`${(e.level/10)*100}%`, background:mood.bg, borderRadius:"4px 4px 0 0", transition:"height 0.4s ease"}}/>;
            })}
          </div>
          <div style={{display:"flex", justifyContent:"space-between", marginTop:"0.4rem"}}>
            <span style={{fontSize:"0.7rem", color:C.soft}}>oldest</span>
            <span style={{fontSize:"0.7rem", color:C.soft}}>newest</span>
          </div>
        </div>
      )}

      {log===null ? <p style={{textAlign:"center", color:C.soft, fontStyle:"italic"}}>Loading…</p>
      : log.length===0 ? (
        <div style={{textAlign:"center", padding:"3rem 1rem"}}>
          <div style={{fontSize:"3rem", marginBottom:"1rem"}}>🌱</div>
          <p style={{color:C.muted, marginBottom:"1.5rem"}}>Your journey starts with the first step.</p>
          <button className="btn btn-fill" onClick={()=>go("checkin")}>Do Your First Check-In</button>
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:"0.75rem"}}>
          {log.map((e,i)=>{
            const mood=MOODS[e.level-1];
            return (
              <div key={i} className="card" style={{padding:"1.1rem 1.5rem", display:"flex", gap:"1rem", alignItems:"flex-start", borderLeft:`4px solid ${mood.bg}`}}>
                <div style={{width:42, height:42, borderRadius:"50%", background:mood.bg, color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"1rem", flexShrink:0}}>{e.level}</div>
                <div style={{flex:1}}>
                  <div style={{display:"flex", justifyContent:"space-between", flexWrap:"wrap", gap:"0.3rem", marginBottom:"0.25rem"}}>
                    <span style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.05rem", fontWeight:500, color:C.brown}}>{mood.label}</span>
                    <span style={{fontSize:"0.75rem", color:C.soft}}>{fmt(e.timestamp)}</span>
                  </div>
                  {e.note&&<p style={{color:C.muted, fontSize:"0.88rem", lineHeight:1.6, fontStyle:"italic"}}>"{e.note}"</p>}
                </div>
              </div>
            );
          })}
          <div style={{textAlign:"center", marginTop:"1rem"}}>
            <button onClick={clearLog} style={{background:"none", border:"none", color:C.soft, fontSize:"0.78rem", cursor:"pointer", textDecoration:"underline", fontFamily:"'Nunito',sans-serif"}}>Clear history</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// WORK WITH ME
// ══════════════════════════════════════════════════════════════════
function Work() {
  const [tab, setTab] = useState("story");
  return (
    <div style={{maxWidth:780, margin:"0 auto", padding:"3rem 1.5rem 6rem"}}>
      <div style={{textAlign:"center", marginBottom:"2.5rem"}}>
        <p className="pill fu" style={{background:`${C.gold}22`, color:C.gold, marginBottom:"0.8rem"}}>Coaching</p>
        <h1 className="fu2" style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,6vw,3.2rem)", fontWeight:300, color:C.brown, marginBottom:"0.6rem"}}>
          Work With Me
        </h1>
      </div>

      {/* Tabs */}
      <div style={{display:"flex", gap:"0.5rem", justifyContent:"center", marginBottom:"2.5rem", flexWrap:"wrap"}}>
        {[{id:"story",label:"My Story"},{id:"offerings",label:"Offerings"},{id:"beliefs",label:"What I Believe"},{id:"values",label:"My Values"}].map(t=>(
          <button key={t.id} className={`nav-btn${tab===t.id?" active":""}`} onClick={()=>setTab(t.id)} style={{fontSize:"0.82rem"}}>{t.label}</button>
        ))}
      </div>

      {/* Story */}
      {tab==="story" && (
        <div style={{animation:"fadeUp 0.6s ease both"}}>
          <div className="card" style={{padding:"2.5rem", marginBottom:"2rem"}}>
            <p className="pill" style={{background:`${C.rose}22`, color:C.rose, marginBottom:"1rem"}}>How I Got Here</p>
            <p style={{color:C.muted, lineHeight:1.9, marginBottom:"1rem", fontSize:"0.95rem"}}>
              I became a coach because I know what it's like to feel overwhelmed, unseen, and unsure how to move forward. During the pandemic, I saw how many friends — especially neurodivergent and spiritually conflicted — were silently struggling. I didn't want to offer surface-level support; I wanted to walk with people in a way that honored both their faith and their mental health.
            </p>
            <p style={{color:C.muted, lineHeight:1.9, marginBottom:"1rem", fontSize:"0.95rem"}}>
              I lived with undiagnosed Central Sensitization Syndrome for three decades before finding answers at Mayo Clinic's Pain Rehabilitation Center. That journey — the disbelief, the exhaustion, and the eventual naming — shapes every session I hold. I coach from the inside of this experience, not from a textbook.
            </p>
            <p style={{color:C.muted, lineHeight:1.9, marginBottom:"1rem", fontSize:"0.95rem"}}>
              Through this journey — alongside mentoring, prayer, and wise friends — I began healing too. I developed deeper trust in God, grieved old wounds, regulated my nervous system, and reclaimed the strength I had given away to survive. I began to thrive.
            </p>
            <p style={{color:C.muted, lineHeight:1.9, fontSize:"0.95rem"}}>
              Now, I walk alongside others who feel stuck in their minds or weighed down by emotion — especially those who've been told they're too much, too sensitive, or not enough. I help people reconnect with God, gain clarity, and come back home to who they were created to be.
            </p>
          </div>
          <div className="card" style={{padding:"1.5rem 2rem", marginBottom:"2rem", display:"flex", gap:"1.5rem", flexWrap:"wrap", justifyContent:"center", textAlign:"center"}}>
            {[{label:"Level 2 Certified",sub:"Mental Health Coach · Abide Network"},{label:"B.S. Psychology",sub:"Liberty University (in progress)"},{label:"Lived Experience",sub:"CSS · Neurodivergent · Faith-Integrated"}].map((c,i)=>(
              <div key={i} style={{padding:"0 1rem"}}>
                <div style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", fontWeight:500, color:C.brown}}>{c.label}</div>
                <div style={{fontSize:"0.75rem", color:C.soft, marginTop:"0.2rem"}}>{c.sub}</div>
              </div>
            ))}
          </div>
          <div style={{
            fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
            fontSize:"1.15rem", color:C.brown, lineHeight:1.8,
            textAlign:"center", padding:"1.5rem",
            borderTop:`1px solid ${C.border}`,
          }}>
            "You don't have to pretend to be okay here.<br/>You just need a little space to breathe, reflect, and begin again."
          </div>
        </div>
      )}

      {/* Offerings */}
      {tab==="offerings" && (
        <div style={{animation:"fadeUp 0.6s ease both"}}>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.2rem", marginBottom:"2rem"}}>
            {[
              {icon:"🌿", title:"1:1 Coaching", desc:"Regular sessions rooted in the Sophrosyne Method. We work with your nervous system, not against it.", badge:"Most Popular"},
              {icon:"🧩", title:"Neurodivergent Support", desc:"Specialized coaching for ADHD, autism, and complex presentations. Advocacy included when needed.", badge:""},
              {icon:"💫", title:"CSS & Chronic Pain", desc:"Nervous system–informed support for those navigating Central Sensitization or complex chronic conditions.", badge:""},
              {icon:"☎️", title:"Free Discovery Call", desc:"A relaxed 20-minute conversation. No pressure, no pitch. Just clarity on whether we're a good fit.", badge:"Start Here"},
            ].map((o,i)=>(
              <div key={i} className="card" style={{padding:"1.8rem", position:"relative"}}>
                {o.badge&&<div className="pill" style={{background:C.sage, color:"#fff", fontSize:"0.62rem", position:"absolute", top:"1.2rem", right:"1.2rem"}}>{o.badge}</div>}
                <div style={{fontSize:"2rem", marginBottom:"0.75rem"}}>{o.icon}</div>
                <h3 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.3rem", fontWeight:500, color:C.brown, marginBottom:"0.5rem"}}>{o.title}</h3>
                <p style={{color:C.muted, fontSize:"0.88rem", lineHeight:1.7}}>{o.desc}</p>
              </div>
            ))}
          </div>
          <div style={{background:`linear-gradient(135deg, ${C.rose}18, ${C.gold}12)`, border:`1px solid ${C.border}`, borderRadius:24, padding:"2.5rem", textAlign:"center"}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"2rem", fontWeight:300, color:C.brown, marginBottom:"0.75rem"}}>Ready when you are.</h2>
            <p style={{color:C.muted, marginBottom:"2rem", fontSize:"0.95rem"}}>Scheduling is gentle and flexible. Your nervous system sets the pace.</p>
            <a href="https://marae.coach" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
              <button className="btn btn-fill">Schedule a Consultation</button>
            </a>
          </div>
        </div>
      )}

      {/* Beliefs */}
      {tab==="beliefs" && (
        <div style={{animation:"fadeUp 0.6s ease both"}}>
          <div className="card" style={{padding:"2.5rem"}}>
            <p className="pill" style={{background:`${C.gold}22`, color:C.gold, marginBottom:"1.5rem"}}>What I Believe</p>
            <div style={{display:"flex", flexDirection:"column", gap:"1.2rem"}}>
              {BELIEFS.map((b,i)=>(
                <div key={i} style={{display:"flex", gap:"1rem", alignItems:"flex-start", paddingBottom:"1.2rem", borderBottom:i<BELIEFS.length-1?`1px solid ${C.border}`:"none"}}>
                  <span style={{color:C.sage, fontSize:"1.2rem", flexShrink:0, marginTop:"0.1rem"}}>✦</span>
                  <p style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:C.brown, lineHeight:1.7}}>{b}</p>
                </div>
              ))}
            </div>
            <div style={{marginTop:"2rem", padding:"1.5rem", background:`${C.sage}10`, borderRadius:12, borderLeft:`3px solid ${C.sage}`}}>
              <p style={{fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic", fontSize:"1rem", color:C.brown, lineHeight:1.7, marginBottom:"0.5rem"}}>
                "For I know the thoughts that I think toward you, says the Lord, thoughts of peace and not of evil, to give you a future and a hope."
              </p>
              <p style={{fontSize:"0.78rem", color:C.soft}}>Jeremiah 29:11 (NKJV)</p>
            </div>
          </div>
        </div>
      )}

      {/* Values */}
      {tab==="values" && (
        <div style={{animation:"fadeUp 0.6s ease both"}}>
          <div style={{display:"flex", flexDirection:"column", gap:"1rem"}}>
            {VALUES.map((v,i)=>(
              <div key={i} className="card" style={{padding:"1.5rem 2rem", display:"flex", gap:"1.2rem", alignItems:"flex-start"}}>
                <div style={{width:36, height:36, borderRadius:"50%", background:`${C.sage}22`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, color:C.sageDk, fontSize:"1rem"}}>✦</div>
                <div>
                  <h3 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", fontWeight:500, color:C.brown, marginBottom:"0.3rem"}}>{v.title}</h3>
                  <p style={{color:C.muted, fontSize:"0.9rem", lineHeight:1.7}}>{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════
// RESOURCES
// ══════════════════════════════════════════════════════════════════
function Resources({go}) {
  return (
    <div style={{maxWidth:780, margin:"0 auto", padding:"3rem 1.5rem 6rem"}}>
      <div style={{textAlign:"center", marginBottom:"3rem"}}>
        <p className="pill fu" style={{background:`${C.sage}22`, color:C.sage, marginBottom:"0.8rem"}}>Curated For You</p>
        <h1 className="fu2" style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(2rem,6vw,3.2rem)", fontWeight:300, color:C.brown, marginBottom:"0.6rem"}}>Resources</h1>
        <p className="fu3" style={{color:C.muted, fontSize:"0.92rem", maxWidth:460, margin:"0 auto"}}>Tools, frameworks, and community — hand-picked for anyone doing this kind of work.</p>
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))", gap:"1.2rem", marginBottom:"3rem"}}>
        {RESOURCES.map((r,i)=>(
          <div key={i} className="card" style={{padding:"1.8rem"}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"0.75rem"}}>
              <div style={{fontSize:"1.8rem"}}>{r.icon}</div>
              <div className="pill" style={{background:`${r.tc}22`, color:r.tc}}>{r.tag}</div>
            </div>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.2rem", fontWeight:500, color:C.brown, marginBottom:"0.5rem"}}>{r.title}</h3>
            <p style={{color:C.muted, fontSize:"0.87rem", lineHeight:1.7}}>{r.desc}</p>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center"}}>
        <p style={{color:C.muted, marginBottom:"1rem", fontSize:"0.92rem"}}>Not finding what you need? Ask in a session.</p>
        <button className="btn btn-outline" onClick={()=>go("work")}>Book a Consultation</button>
      </div>
    </div>
  );
}

// ── App Root ──────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  function go(p) { setPage(p); window.scrollTo({top:0,behavior:"smooth"}); }
  return (
    <div style={{minHeight:"100vh", background:C.cream}}>
      <Nav page={page} go={go}/>
      <main>
        {page==="home"      && <Home go={go}/>}
        {page==="checkin"   && <CheckIn go={go}/>}
        {page==="journey"   && <Journey go={go}/>}
        {page==="work"      && <Work/>}
        {page==="resources" && <Resources go={go}/>}
      </main>
      <footer style={{borderTop:`1px solid ${C.border}`, padding:"2rem 1.5rem", textAlign:"center", background:C.surface}}>
        <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:"0.6rem", marginBottom:"0.5rem"}}>
          <div style={{width:28, height:28, borderRadius:"50%", background:`radial-gradient(circle at 35% 30%, #b8d4ba, ${C.sage} 55%, ${C.sageDk})`, display:"flex", alignItems:"center", justifyContent:"center"}}>
            <span style={{fontFamily:"'Cormorant Garamond',serif", color:"#fff", display:"flex", alignItems:"baseline"}}>
              <span style={{fontSize:"0.62rem", fontStyle:"italic", fontWeight:300}}>σ</span>
              <span style={{fontSize:"0.74rem", fontWeight:500}}>M</span>
            </span>
          </div>
          <span style={{fontFamily:"'Cormorant Garamond',serif", fontSize:"1.1rem", color:C.brown}}>
            Coach<span style={{color:C.sage}}>Marae</span>
          </span>
        </div>
        <p style={{fontSize:"0.75rem", color:C.soft, letterSpacing:"0.08em"}}>
          marae.coach · Nervous system–informed · Faith-integrated · Neurodivergent-affirming
        </p>
      </footer>
    </div>
  );
}
