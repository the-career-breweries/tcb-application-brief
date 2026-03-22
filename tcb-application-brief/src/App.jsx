import { useState, useEffect, useRef } from "react";

const COLORS = {
  dark: "#1C1410",
  amber: "#C97B2A",
  warm: "#E8A44A",
  cream: "#FAF3E8",
  mist: "#F0E8D8",
  ink: "#2D2017",
  soft: "#7A6652",
  border: "#DDD0BC",
};

const QUESTIONS = [
  {
    id: "q1",
    question: "Why this role, at this company, at this point in your career?",
    subtext: "One honest answer. Not the interview version.",
    minChars: 50,
  },
  {
    id: "q2",
    question: "What in your past makes you the right person for this — not on paper, but actually?",
    subtext: "Think about moments, not titles.",
    minChars: 50,
  },
  {
    id: "q3",
    question: "What about this role scares you slightly? What does that tell you?",
    subtext: "The honest answer here is more useful than a confident one.",
    minChars: 50,
  },
  {
    id: "q4",
    question: "What do you want to have learned or built six months into this job?",
    subtext: "Not what you'll contribute. What you'll gain.",
    minChars: 50,
  },
  {
    id: "q5",
    question: "If you don't get this role, what would you regret not having said in the application?",
    subtext: "Say it here first.",
    minChars: 50,
  },
];

const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,300;1,9..144,400&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: ${COLORS.cream};
    color: ${COLORS.ink};
    font-family: 'Plus Jakarta Sans', sans-serif;
    -webkit-font-smoothing: antialiased;
    min-height: 100vh;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  @keyframes amberpulse {
    0%, 100% { opacity: 0.4; transform: scale(0.95); }
    50% { opacity: 1; transform: scale(1.05); }
  }

  @keyframes revealOutput {
    from { opacity: 0; transform: translateY(24px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .fade-up {
    animation: fadeUp 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .fade-in {
    animation: fadeIn 0.4s ease both;
  }

  textarea {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    line-height: 1.7;
    color: ${COLORS.ink};
    background: ${COLORS.mist};
    border: 1.5px solid ${COLORS.border};
    border-radius: 12px;
    padding: 16px 18px;
    width: 100%;
    resize: none;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
    min-height: 120px;
  }

  textarea:focus {
    border-color: ${COLORS.amber};
    box-shadow: 0 0 0 3px rgba(201, 123, 42, 0.1);
    background: #fdf8f0;
  }

  textarea::placeholder {
    color: ${COLORS.border};
  }

  input[type="text"],
  input[type="email"],
  input[type="tel"] {
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-size: 15px;
    color: ${COLORS.ink};
    background: ${COLORS.mist};
    border: 1.5px solid ${COLORS.border};
    border-radius: 12px;
    padding: 14px 18px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  input[type="text"]:focus,
  input[type="email"]:focus,
  input[type="tel"]:focus {
    border-color: ${COLORS.amber};
    box-shadow: 0 0 0 3px rgba(201, 123, 42, 0.1);
    background: #fdf8f0;
  }

  input::placeholder {
    color: ${COLORS.border};
  }

  button {
    cursor: pointer;
    font-family: 'Plus Jakarta Sans', sans-serif;
    font-weight: 500;
  }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: ${COLORS.cream}; }
  ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 3px; }
`;

function StepIndicator({ current, total }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginBottom: "48px",
    }}>
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        color: COLORS.amber,
        letterSpacing: "0.08em",
        fontWeight: 500,
      }}>
        {String(current).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </span>
      <div style={{
        flex: 1,
        height: "1px",
        background: COLORS.border,
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          width: `${(current / total) * 100}%`,
          background: COLORS.amber,
          transition: "width 0.6s cubic-bezier(0.22, 1, 0.36, 1)",
        }} />
      </div>
    </div>
  );
}

function CharCount({ current, min }) {
  const met = current >= min;
  return (
    <div style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: "11px",
      color: met ? COLORS.amber : COLORS.border,
      textAlign: "right",
      marginTop: "6px",
      transition: "color 0.2s ease",
      letterSpacing: "0.04em",
    }}>
      {met ? "✓" : `${Math.max(0, min - current)} more to continue`}
    </div>
  );
}

function PrimaryButton({ children, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: disabled ? COLORS.border : COLORS.amber,
        color: disabled ? COLORS.soft : COLORS.cream,
        border: "none",
        borderRadius: "12px",
        padding: "15px 32px",
        fontSize: "15px",
        fontWeight: 600,
        letterSpacing: "0.01em",
        transition: "all 0.2s ease",
        cursor: disabled ? "not-allowed" : "pointer",
        transform: disabled ? "none" : "translateY(0)",
        boxShadow: disabled ? "none" : "0 4px 16px rgba(201, 123, 42, 0.25)",
      }}
      onMouseEnter={e => {
        if (!disabled) {
          e.target.style.background = COLORS.warm;
          e.target.style.transform = "translateY(-1px)";
          e.target.style.boxShadow = "0 6px 20px rgba(201, 123, 42, 0.35)";
        }
      }}
      onMouseLeave={e => {
        if (!disabled) {
          e.target.style.background = COLORS.amber;
          e.target.style.transform = "translateY(0)";
          e.target.style.boxShadow = "0 4px 16px rgba(201, 123, 42, 0.25)";
        }
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "transparent",
        color: COLORS.soft,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: "12px",
        padding: "14px 24px",
        fontSize: "14px",
        fontWeight: 500,
        transition: "all 0.2s ease",
      }}
      onMouseEnter={e => {
        e.target.style.borderColor = COLORS.soft;
        e.target.style.color = COLORS.ink;
      }}
      onMouseLeave={e => {
        e.target.style.borderColor = COLORS.border;
        e.target.style.color = COLORS.soft;
      }}
    >
      {children}
    </button>
  );
}

// ─── STEP 1: Job Input ───────────────────────────────────────────────────────
function StepJobInput({ data, onChange, onNext }) {
  const jdLength = (data.jobDescription || "").length;
  const canProceed = data.jobTitle?.trim() && data.company?.trim() && jdLength >= 200;

  return (
    <div className="fade-up">
      <StepIndicator current={1} total={4} />

      <div style={{ marginBottom: "40px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: COLORS.amber,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          The Role
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(28px, 5vw, 38px)",
          fontWeight: 400,
          color: COLORS.dark,
          lineHeight: 1.2,
          marginBottom: "14px",
        }}>
          Which role are you applying for?
        </h1>
        <p style={{
          fontSize: "16px",
          color: COLORS.soft,
          lineHeight: 1.65,
          maxWidth: "520px",
        }}>
          Paste the job description in full. The more complete it is, the sharper your brief will be.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={{
              display: "block",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: COLORS.soft,
              letterSpacing: "0.08em",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}>
              Job Title
            </label>
            <input
              type="text"
              value={data.jobTitle || ""}
              onChange={e => onChange("jobTitle", e.target.value)}
              placeholder="Senior Product Manager"
            />
          </div>
          <div>
            <label style={{
              display: "block",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              color: COLORS.soft,
              letterSpacing: "0.08em",
              marginBottom: "8px",
              textTransform: "uppercase",
            }}>
              Company
            </label>
            <input
              type="text"
              value={data.company || ""}
              onChange={e => onChange("company", e.target.value)}
              placeholder="Acme Inc."
            />
          </div>
        </div>

        <div>
          <label style={{
            display: "block",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: COLORS.soft,
            letterSpacing: "0.08em",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}>
            Job Description
          </label>
          <textarea
            rows={10}
            value={data.jobDescription || ""}
            onChange={e => onChange("jobDescription", e.target.value)}
            placeholder="Paste the full job description here..."
            style={{ minHeight: "200px" }}
          />
          <CharCount current={jdLength} min={200} />
        </div>

        <div style={{ paddingTop: "8px" }}>
          <PrimaryButton onClick={onNext} disabled={!canProceed}>
            Continue →
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 2: Questions ───────────────────────────────────────────────────────
function StepQuestions({ data, onChange, onNext, onBack }) {
  const [active, setActive] = useState(0);
  const answers = data.answers || {};

  const allAnswered = QUESTIONS.every(q => (answers[q.id] || "").length >= q.minChars);
  const currentAnswer = answers[QUESTIONS[active]?.id] || "";
  const currentMet = currentAnswer.length >= QUESTIONS[active]?.minChars;

  const goNext = () => {
    if (active < QUESTIONS.length - 1) setActive(active + 1);
    else if (allAnswered) onNext();
  };

  const goPrev = () => {
    if (active > 0) setActive(active - 1);
    else onBack();
  };

  return (
    <div className="fade-up">
      <StepIndicator current={2} total={4} />

      <div style={{ marginBottom: "40px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: COLORS.amber,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          Question {active + 1} of {QUESTIONS.length}
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(22px, 4vw, 30px)",
          fontWeight: 400,
          color: COLORS.dark,
          lineHeight: 1.3,
          marginBottom: "10px",
        }}>
          {QUESTIONS[active].question}
        </h1>
        <p style={{
          fontSize: "14px",
          color: COLORS.soft,
          fontStyle: "italic",
          lineHeight: 1.6,
        }}>
          {QUESTIONS[active].subtext}
        </p>
      </div>

      {/* Question nav dots */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {QUESTIONS.map((q, i) => {
          const answered = (answers[q.id] || "").length >= q.minChars;
          return (
            <button
              key={q.id}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: answered ? COLORS.amber : i === active ? COLORS.soft : COLORS.border,
                border: "none",
                transition: "all 0.3s ease",
                cursor: "pointer",
                padding: 0,
              }}
            />
          );
        })}
      </div>

      <div>
        <textarea
          key={active}
          rows={6}
          value={currentAnswer}
          onChange={e => onChange("answers", { ...answers, [QUESTIONS[active].id]: e.target.value })}
          placeholder=""
          style={{ minHeight: "160px" }}
          autoFocus
        />
        <CharCount current={currentAnswer.length} min={QUESTIONS[active].minChars} />
      </div>

      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: "32px",
      }}>
        <GhostButton onClick={goPrev}>
          ← Back
        </GhostButton>

        <PrimaryButton
          onClick={goNext}
          disabled={!currentMet}
        >
          {active < QUESTIONS.length - 1 ? "Next question →" : allAnswered ? "Continue →" : "Answer all questions"}
        </PrimaryButton>
      </div>
    </div>
  );
}

// ─── STEP 3: Capture Form ────────────────────────────────────────────────────
function StepCapture({ data, onChange, onNext, onBack, isGenerating }) {
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || "");
  const phoneValid = (data.phone || "").replace(/\D/g, "").length >= 10;
  const canProceed = emailValid && phoneValid && !isGenerating;

  return (
    <div className="fade-up">
      <StepIndicator current={3} total={4} />

      <div style={{ marginBottom: "40px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: COLORS.amber,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          Almost there
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(26px, 5vw, 36px)",
          fontWeight: 400,
          color: COLORS.dark,
          lineHeight: 1.25,
          marginBottom: "14px",
        }}>
          Where should we send your brief?
        </h1>
        <p style={{
          fontSize: "15px",
          color: COLORS.soft,
          lineHeight: 1.65,
          maxWidth: "480px",
        }}>
          Your Application Brief will appear here and land in your inbox. We'll also save it so you can revisit it anytime.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "440px" }}>
        <div>
          <label style={{
            display: "block",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: COLORS.soft,
            letterSpacing: "0.08em",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}>
            Email Address
          </label>
          <input
            type="email"
            value={data.email || ""}
            onChange={e => onChange("email", e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label style={{
            display: "block",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px",
            color: COLORS.soft,
            letterSpacing: "0.08em",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}>
            Phone Number
          </label>
          <input
            type="tel"
            value={data.phone || ""}
            onChange={e => onChange("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>

        <p style={{
          fontSize: "12px",
          color: COLORS.border,
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          We don't share your details. We don't spam. Your brief is yours.
        </p>

        {isGenerating ? (
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            padding: "16px 0",
          }}>
            <div style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: COLORS.amber,
              animation: "amberpulse 1.4s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: "14px",
              color: COLORS.soft,
              fontStyle: "italic",
            }}>
              Reading everything you wrote. Give us a moment.
            </span>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "12px", alignItems: "center", paddingTop: "8px" }}>
            <GhostButton onClick={onBack}>← Back</GhostButton>
            <PrimaryButton onClick={onNext} disabled={!canProceed}>
              Generate my brief →
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── STEP 4: Output ──────────────────────────────────────────────────────────
function StepOutput({ data, onRestart }) {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState(data.email || "");
  const [waitlistDone, setWaitlistDone] = useState(false);
  const [testimonialRating, setTestimonialRating] = useState(null);
  const [testimonialText, setTestimonialText] = useState("");
  const [testimonialConsent, setTestimonialConsent] = useState(false);
  const [testimonialDone, setTestimonialDone] = useState(false);

  // Placeholder output — real Claude output replaces this in Phase 2
  const output = {
    angle: `You're not applying for this role because it's the next logical step — you're applying because it sits at the intersection of what you've been quietly building toward. Your background gives you a perspective that most candidates in this process won't have: you've seen this problem from the inside. That changes how you'd approach it from day one.`,
    emphasise: [
      "The moment in your past where you navigated ambiguity without a clear brief — that's directly relevant here.",
      "The thing that scares you slightly about this role is the same thing that makes you the right fit for it.",
      "Your honest answer to why this company, at this time, is your strongest differentiator in the application.",
    ],
    leadLine: `"I've spent the last few years building toward exactly this kind of challenge — here's why this role, and why now."`,
  };

  useEffect(() => {
    const timer = setTimeout(() => setShowWaitlist(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const OutputCard = ({ delay, children, label }) => (
    <div
      style={{
        background: COLORS.mist,
        border: `1.5px solid ${COLORS.border}`,
        borderRadius: "16px",
        padding: "28px 32px",
        animation: `revealOutput 0.6s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s both`,
      }}
    >
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        color: COLORS.amber,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: "16px",
      }}>
        {label}
      </div>
      {children}
    </div>
  );

  return (
    <div className="fade-in">
      <StepIndicator current={4} total={4} />

      <div style={{ marginBottom: "36px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px",
          color: COLORS.amber,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          Your Application Brief
        </div>
        <h1 style={{
          fontFamily: "'Fraunces', serif",
          fontSize: "clamp(24px, 4vw, 34px)",
          fontWeight: 400,
          color: COLORS.dark,
          lineHeight: 1.25,
          marginBottom: "10px",
        }}>
          {data.jobTitle} at {data.company}
        </h1>
        <p style={{
          fontSize: "14px",
          color: COLORS.soft,
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          Generated {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        <OutputCard delay={0.1} label="Your Angle">
          <p style={{
            fontSize: "16px",
            lineHeight: 1.75,
            color: COLORS.ink,
            fontFamily: "'Fraunces', serif",
            fontWeight: 300,
            fontStyle: "italic",
          }}>
            {output.angle}
          </p>
        </OutputCard>

        <OutputCard delay={0.3} label="What to Emphasise">
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {output.emphasise.map((point, i) => (
              <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  color: COLORS.amber,
                  fontWeight: 500,
                  marginTop: "3px",
                  minWidth: "20px",
                }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <p style={{ fontSize: "15px", lineHeight: 1.65, color: COLORS.ink }}>
                  {point}
                </p>
              </div>
            ))}
          </div>
        </OutputCard>

        <OutputCard delay={0.5} label="The Line to Lead With">
          <p style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "18px",
            fontWeight: 400,
            color: COLORS.dark,
            lineHeight: 1.5,
            borderLeft: `3px solid ${COLORS.amber}`,
            paddingLeft: "20px",
          }}>
            {output.leadLine}
          </p>
        </OutputCard>

        {/* Testimonial Block */}
        {!testimonialDone ? (
          <div style={{
            background: COLORS.cream,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: "16px",
            padding: "28px 32px",
            animation: `revealOutput 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.7s both`,
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: COLORS.soft,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              marginBottom: "16px",
            }}>
              One quick question
            </div>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "18px",
              color: COLORS.dark,
              marginBottom: "20px",
              lineHeight: 1.4,
            }}>
              Did this change how you're thinking about this application?
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
              {[
                { value: "yes", label: "Yes — completely different angle now" },
                { value: "somewhat", label: "Somewhat — it helped me focus" },
                { value: "no", label: "Not really — I already knew my angle" },
              ].map(opt => (
                <label key={opt.value} style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer",
                  padding: "12px 16px",
                  borderRadius: "10px",
                  border: `1.5px solid ${testimonialRating === opt.value ? COLORS.amber : COLORS.border}`,
                  background: testimonialRating === opt.value ? "rgba(201,123,42,0.06)" : "transparent",
                  transition: "all 0.2s ease",
                }}>
                  <input
                    type="radio"
                    name="rating"
                    value={opt.value}
                    checked={testimonialRating === opt.value}
                    onChange={() => setTestimonialRating(opt.value)}
                    style={{ accentColor: COLORS.amber }}
                  />
                  <span style={{ fontSize: "14px", color: COLORS.ink }}>{opt.label}</span>
                </label>
              ))}
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: COLORS.soft,
                marginBottom: "8px",
              }}>
                In one sentence — what did this do for you? <span style={{ color: COLORS.border }}>(optional)</span>
              </label>
              <textarea
                rows={2}
                value={testimonialText}
                onChange={e => setTestimonialText(e.target.value)}
                placeholder=""
                style={{ minHeight: "72px", fontSize: "14px" }}
              />
            </div>

            <label style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              cursor: "pointer",
              marginBottom: "20px",
            }}>
              <input
                type="checkbox"
                checked={testimonialConsent}
                onChange={e => setTestimonialConsent(e.target.checked)}
                style={{ accentColor: COLORS.amber, marginTop: "2px" }}
              />
              <span style={{ fontSize: "13px", color: COLORS.soft, lineHeight: 1.5 }}>
                I'm happy for The Career Breweries to share this anonymously.
              </span>
            </label>

            <PrimaryButton
              onClick={() => setTestimonialDone(true)}
              disabled={!testimonialRating}
            >
              Submit
            </PrimaryButton>
          </div>
        ) : (
          <div style={{
            background: COLORS.mist,
            border: `1.5px solid ${COLORS.border}`,
            borderRadius: "16px",
            padding: "24px 32px",
            textAlign: "center",
            animation: "fadeIn 0.4s ease both",
          }}>
            <p style={{
              fontFamily: "'Fraunces', serif",
              fontSize: "17px",
              color: COLORS.dark,
              fontStyle: "italic",
            }}>
              Thank you. That means a lot.
            </p>
          </div>
        )}

        {/* Waitlist CTA */}
        {showWaitlist && (
          <div style={{
            background: COLORS.dark,
            borderRadius: "20px",
            padding: "36px 32px",
            animation: `revealOutput 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.9s both`,
          }}>
            {!waitlistDone ? (
              <>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  color: COLORS.amber,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  marginBottom: "14px",
                }}>
                  What's coming next
                </div>
                <p style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "20px",
                  color: COLORS.cream,
                  lineHeight: 1.45,
                  marginBottom: "8px",
                  fontWeight: 300,
                }}>
                  Liked how this felt?
                </p>
                <p style={{
                  fontSize: "14px",
                  color: COLORS.soft,
                  lineHeight: 1.65,
                  marginBottom: "24px",
                  maxWidth: "440px",
                }}>
                  We're building the full version — resume tailoring, outreach messages, SOP builder — all grounded in the same thinking. Get early access.
                </p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <input
                    type="email"
                    value={waitlistEmail}
                    onChange={e => setWaitlistEmail(e.target.value)}
                    placeholder="your@email.com"
                    style={{
                      background: "rgba(255,255,255,0.08)",
                      border: `1.5px solid rgba(255,255,255,0.15)`,
                      color: COLORS.cream,
                      flex: "1",
                      minWidth: "200px",
                    }}
                  />
                  <PrimaryButton onClick={() => setWaitlistDone(true)}>
                    Join early access
                  </PrimaryButton>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center" }}>
                <p style={{
                  fontFamily: "'Fraunces', serif",
                  fontSize: "20px",
                  color: COLORS.cream,
                  fontStyle: "italic",
                  marginBottom: "8px",
                }}>
                  You're in.
                </p>
                <p style={{ fontSize: "14px", color: COLORS.soft }}>
                  We'll reach out when the full product is ready.
                </p>
              </div>
            )}
          </div>
        )}

        <div style={{ paddingTop: "8px", paddingBottom: "40px" }}>
          <GhostButton onClick={onRestart}>
            Start a new brief
          </GhostButton>
        </div>

      </div>
    </div>
  );
}

// ─── HEADER ──────────────────────────────────────────────────────────────────
function Header() {
  return (
    <header style={{
      padding: "24px 0",
      borderBottom: `1px solid ${COLORS.border}`,
      marginBottom: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div style={{
          width: "28px",
          height: "28px",
          background: COLORS.amber,
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
            width: "10px",
            height: "14px",
            borderRadius: "5px 5px 3px 3px",
            border: `2px solid ${COLORS.cream}`,
            borderTop: "none",
            position: "relative",
            top: "2px",
          }} />
        </div>
        <div>
          <div style={{
            fontFamily: "'Fraunces', serif",
            fontSize: "14px",
            fontWeight: 500,
            color: COLORS.dark,
            lineHeight: 1,
          }}>
            The Career Breweries
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "9px",
            color: COLORS.soft,
            letterSpacing: "0.08em",
            marginTop: "2px",
          }}>
            The Application Brief
          </div>
        </div>
      </div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "10px",
        color: COLORS.border,
        letterSpacing: "0.06em",
      }}>
        Free · No account needed
      </div>
    </header>
  );
}

// ─── LANDING ─────────────────────────────────────────────────────────────────
function Landing({ onStart }) {
  return (
    <div className="fade-up" style={{ textAlign: "center", paddingTop: "24px", paddingBottom: "60px" }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        color: COLORS.amber,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: "28px",
      }}>
        For experienced jobseekers
      </div>

      <h1 style={{
        fontFamily: "'Fraunces', serif",
        fontSize: "clamp(34px, 7vw, 54px)",
        fontWeight: 400,
        color: COLORS.dark,
        lineHeight: 1.15,
        marginBottom: "24px",
        maxWidth: "560px",
        margin: "0 auto 24px",
      }}>
        Before you send the resume,<br />
        <em style={{ fontStyle: "italic", color: COLORS.amber }}>know your angle.</em>
      </h1>

      <p style={{
        fontSize: "17px",
        color: COLORS.soft,
        lineHeight: 1.75,
        maxWidth: "480px",
        margin: "0 auto 40px",
      }}>
        Five honest questions. Fifteen minutes. A brief that tells you exactly how to position yourself for this specific role.
      </p>

      <div style={{ marginBottom: "48px" }}>
        <PrimaryButton onClick={onStart}>
          Start your brief →
        </PrimaryButton>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "1px",
        background: COLORS.border,
        border: `1px solid ${COLORS.border}`,
        borderRadius: "16px",
        overflow: "hidden",
        maxWidth: "540px",
        margin: "0 auto",
        textAlign: "left",
      }}>
        {[
          { num: "01", label: "The Role", desc: "Paste the job description" },
          { num: "02", label: "The Thinking", desc: "Answer five real questions" },
          { num: "03", label: "The Brief", desc: "Your positioning, sharply written" },
        ].map(item => (
          <div key={item.num} style={{
            background: COLORS.cream,
            padding: "20px 18px",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              color: COLORS.amber,
              marginBottom: "8px",
            }}>
              {item.num}
            </div>
            <div style={{
              fontSize: "13px",
              fontWeight: 600,
              color: COLORS.dark,
              marginBottom: "4px",
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: "12px",
              color: COLORS.soft,
              lineHeight: 1.5,
            }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0); // 0=landing, 1=job, 2=questions, 3=capture, 4=output
  const [formData, setFormData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const topRef = useRef(null);

  const scrollTop = () => {
    topRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const goTo = (s) => {
    scrollTop();
    setTimeout(() => setStep(s), 100);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Phase 2 will wire Claude API here
    await new Promise(r => setTimeout(r, 2400));
    setIsGenerating(false);
    goTo(4);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div ref={topRef} style={{ minHeight: "100vh", background: COLORS.cream }}>
        <div style={{
          maxWidth: "680px",
          margin: "0 auto",
          padding: "0 24px",
        }}>
          <Header />

          {step === 0 && <Landing onStart={() => goTo(1)} />}
          {step === 1 && (
            <StepJobInput
              data={formData}
              onChange={handleChange}
              onNext={() => goTo(2)}
            />
          )}
          {step === 2 && (
            <StepQuestions
              data={formData}
              onChange={handleChange}
              onNext={() => goTo(3)}
              onBack={() => goTo(1)}
            />
          )}
          {step === 3 && (
            <StepCapture
              data={formData}
              onChange={handleChange}
              onNext={handleGenerate}
              onBack={() => goTo(2)}
              isGenerating={isGenerating}
            />
          )}
          {step === 4 && (
            <StepOutput
              data={formData}
              onRestart={() => { setFormData({}); goTo(0); }}
            />
          )}
        </div>
      </div>
    </>
  );
}
