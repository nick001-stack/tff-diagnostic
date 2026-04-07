"use client";
import { useState, useMemo } from "react";
import { QUESTIONS, FOLLOW_UPS, TEAM_ROLES, DIMENSIONS } from "@/lib/questions";

type Step = "intro" | "team" | "questions" | "submitting";

export default function DiagnosticForm({ onComplete }: { onComplete: (data: any) => void }) {
  const [step, setStep] = useState<Step>("intro");
  const [prospect, setProspect] = useState({ company_name: "", contact_name: "", email: "", revenue_range: "", employee_count: "" });
  const [team, setTeam] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [qIndex, setQIndex] = useState(0);
  const [error, setError] = useState("");

  // Build the active question sequence: core questions, with follow-ups inserted right after their trigger when triggered
  const sequence = useMemo(() => {
    const seq: { kind: "core" | "follow"; id: string }[] = [];
    for (const q of QUESTIONS) {
      seq.push({ kind: "core", id: q.id });
      const fs = FOLLOW_UPS.filter((f) => f.triggerQuestion === q.id);
      for (const f of fs) {
        const triggerAns = answers[q.id];
        if (triggerAns && f.triggerOn.includes(triggerAns as any)) {
          seq.push({ kind: "follow", id: f.id });
        }
      }
    }
    return seq;
  }, [answers]);

  const total = sequence.length;
  const current = sequence[qIndex];
  const currentQ = current
    ? current.kind === "core"
      ? QUESTIONS.find((q) => q.id === current.id)!
      : FOLLOW_UPS.find((f) => f.id === current.id)!
    : null;

  const dimName = currentQ ? DIMENSIONS[currentQ.dimension as keyof typeof DIMENSIONS]?.name : "";

  const handleAnswer = (letter: string) => {
    if (!currentQ) return;
    setAnswers((a) => ({ ...a, [currentQ.id]: letter }));
  };

  const handleNext = () => {
    if (currentQ && !answers[currentQ.id]) { setError("Please select an answer"); return; }
    setError("");
    if (qIndex < total - 1) setQIndex(qIndex + 1);
    else handleSubmit();
  };

  const handlePrev = () => {
    setError("");
    if (qIndex > 0) setQIndex(qIndex - 1);
  };

  const handleSubmit = async () => {
    setStep("submitting");
    try {
      const res = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prospect, team_structure: team, answers }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onComplete({ ...data, prospect, team_structure: team });
    } catch (e: any) {
      setError(e?.message || "Submission failed");
      setStep("questions");
    }
  };

  // === INTRO STEP ===
  if (step === "intro") {
    return (
      <div className="card max-w-2xl mx-auto">
        <div className="mono text-xs text-tff-gray uppercase tracking-widest mb-3">Step 1 of 3 — Introduction</div>
        <h1 className="font-display text-3xl font-bold mb-3">Finance Readiness Diagnostic</h1>
        <p className="text-tff-charcoal mb-2">A free 5–8 minute self-assessment built from real production automations running inside HUDI SAS.</p>
        <p className="text-tff-charcoal mb-6">You will receive an instant score across 6 dimensions, a personalized report, and a recommended TFF/ activation path.</p>
        <div className="space-y-4">
          <Input label="Company name *" value={prospect.company_name} onChange={(v) => setProspect({ ...prospect, company_name: v })} />
          <Input label="Your name *" value={prospect.contact_name} onChange={(v) => setProspect({ ...prospect, contact_name: v })} />
          <Input label="Email *" type="email" value={prospect.email} onChange={(v) => setProspect({ ...prospect, email: v })} />
          <Select label="Revenue range" value={prospect.revenue_range} onChange={(v) => setProspect({ ...prospect, revenue_range: v })}
            options={["< 1M€", "1–5M€", "5–10M€", "10–25M€", "25M€+"]} />
          <Select label="Employee count" value={prospect.employee_count} onChange={(v) => setProspect({ ...prospect, employee_count: v })}
            options={["1–10", "11–50", "51–100", "101–250", "250+"]} />
        </div>
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        <div className="mt-8 flex justify-end">
          <button className="btn-primary" onClick={() => {
            if (!prospect.company_name || !prospect.contact_name || !prospect.email) { setError("Please fill all required fields"); return; }
            setError(""); setStep("team");
          }}>Continue →</button>
        </div>
      </div>
    );
  }

  // === TEAM STEP ===
  if (step === "team") {
    return (
      <div className="card max-w-3xl mx-auto">
        <div className="mono text-xs text-tff-gray uppercase tracking-widest mb-3">Step 2 of 3 — Team Structure</div>
        <h2 className="font-display text-2xl font-bold mb-2">Your finance team</h2>
        <p className="text-tff-charcoal mb-6">For each role, select the staffing model. This is not scored — it informs the package recommendation.</p>
        <div className="space-y-5">
          {TEAM_ROLES.map((r) => (
            <div key={r.id}>
              <div className="font-medium mb-2">{r.label}</div>
              <div className="flex flex-wrap gap-2">
                {r.staffing.map((s) => (
                  <button key={s} onClick={() => setTeam({ ...team, [r.id]: s })}
                    className={`option text-sm ${team[r.id] === s ? "selected" : ""}`}>{s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
        <div className="mt-8 flex justify-between">
          <button className="btn-ghost" onClick={() => setStep("intro")}>← Back</button>
          <button className="btn-primary" onClick={() => {
            const missing = TEAM_ROLES.filter((r) => !team[r.id]);
            if (missing.length > 0) { setError("Please answer all team roles"); return; }
            setError(""); setStep("questions");
          }}>Continue →</button>
        </div>
      </div>
    );
  }

  // === SUBMITTING ===
  if (step === "submitting") {
    return (
      <div className="card max-w-2xl mx-auto text-center py-16">
        <div className="mono text-xs text-tff-gray uppercase tracking-widest mb-4">Generating your report</div>
        <h2 className="font-display text-2xl font-bold mb-3">Analyzing your finance function…</h2>
        <p className="text-tff-charcoal">Computing scores across 6 dimensions and drafting your personalized TFF/ readiness report. This takes 15–30 seconds.</p>
        <div className="mt-8 progress-bar"><div className="progress-fill" style={{ width: "70%" }} /></div>
      </div>
    );
  }

  // === QUESTIONS STEP ===
  return (
    <div className="card max-w-3xl mx-auto">
      <div className="mono text-xs text-tff-gray uppercase tracking-widest mb-3 flex justify-between">
        <span>Step 3 of 3 — Diagnostic ({qIndex + 1} / {total})</span>
        <span>{currentQ?.dimension} · {dimName}</span>
      </div>
      <div className="progress-bar mb-6"><div className="progress-fill" style={{ width: `${((qIndex + 1) / total) * 100}%` }} /></div>
      {currentQ && (
        <>
          <h2 className="font-display text-xl font-bold mb-5">{currentQ.text}</h2>
          <div className="space-y-3">
            {currentQ.options.map((o) => (
              <button key={o.letter} onClick={() => handleAnswer(o.letter)}
                className={`option w-full text-left ${answers[currentQ.id] === o.letter ? "selected" : ""}`}>
                <span className="mono text-xs mr-3 opacity-60">{o.letter}</span>{o.text}
              </button>
            ))}
          </div>
        </>
      )}
      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      <div className="mt-8 flex justify-between">
        <button className="btn-ghost" onClick={qIndex === 0 ? () => setStep("team") : handlePrev}>← Back</button>
        <button className="btn-primary" onClick={handleNext}>{qIndex === total - 1 ? "Generate Report →" : "Next →"}</button>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#d8d6d1] bg-white px-3 py-2 focus:outline-none focus:border-tff-black" />
    </div>
  );
}
function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full border border-[#d8d6d1] bg-white px-3 py-2 focus:outline-none focus:border-tff-black">
        <option value="">— Select —</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
