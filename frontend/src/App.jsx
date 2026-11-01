
import { useState } from "react";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  Settings,
  MessageSquare,
  Scale,
  ArrowRight,
  Sparkles,
  BookOpen,
  Menu,
  Loader2,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  ShieldCheck,
  Brain,
  ChevronRight,
  ArrowDown,
  Lightbulb
} from "lucide-react";

import { generateDebate } from "./services/debateService";

const suggestedTopics = [
  "Should mobile phones be allowed in classrooms?",
  "Is online education better than traditional education?",
  "Should homework be abolished?",
  "Is artificial intelligence beneficial for students?"
];

function App() {
  const [topic, setTopic] = useState("");
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [debate, setDebate] = useState(null);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "New Debate", icon: PlusCircle },
    { name: "History", icon: History },
    { name: "Settings", icon: Settings }
  ];

  const startDebate = async () => {
    if (!topic.trim()) {
      setError("Please enter a debate topic.");
      return;
    }

    setLoading(true);
    setError("");
    setDebate(null);

    try {
      const result = await generateDebate(topic.trim());
      setDebate(result);
    } catch (err) {
      setError(err.message || "Unable to generate debate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetDebate = () => {
    setDebate(null);
    setError("");
    setTopic("");
    setActivePage("New Debate");
  };

  const ScoreCard = ({ title, data }) => {
    if (!data) return null;

    const score = Math.min(10, Math.max(0, Number(data.score) || 0));

    return (
      <div className="rounded-xl border border-white/[0.07] bg-[#11111a] p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h4 className="text-sm font-medium text-gray-200">{title}</h4>
          <span className="text-sm font-semibold text-violet-400">
            {score}/10
          </span>
        </div>

        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
          <div
            className="h-full rounded-full bg-violet-500 transition-all"
            style={{ width: `${score * 10}%` }}
          />
        </div>

        <p className="text-sm leading-6 text-gray-400">
          {data.reason}
        </p>
      </div>
    );
  };

  const SectionHeading = ({ icon: Icon, title, subtitle }) => (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <Icon size={19} className="text-violet-400" />
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#09090f] text-white">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-white/[0.06] bg-[#0d0d15] px-5 py-7 transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-14 flex items-center gap-3 px-1">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 shadow-lg shadow-violet-900/30">
            <Scale size={22} />
          </div>

          <div>
            <h1 className="text-base font-semibold tracking-tight">
              Debate AI
            </h1>
            <p className="text-[11px] text-gray-500">
              Intelligent Debate Coach
            </p>
          </div>
        </div>

        <p className="mb-4 px-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
          Workspace
        </p>

        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActivePage(item.name);
                  setSidebarOpen(false);
                  setError("");

                  if (item.name === "New Debate") {
                    setDebate(null);
                    setTopic("");
                  }
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  activePage === item.name
                    ? "bg-violet-600/15 text-violet-300"
                    : "text-gray-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.name}</span>

                {activePage === item.name && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-violet-400" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-auto rounded-xl border border-violet-500/15 bg-violet-500/[0.06] p-4">
          <div className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 text-violet-400">
            <Brain size={18} />
          </div>

          <h3 className="mb-1 text-sm font-semibold">
            Think critically.
          </h3>

          <p className="text-xs leading-5 text-gray-500">
            Understand different perspectives and build stronger arguments.
          </p>
        </div>

        <div className="mt-5 border-t border-white/[0.06] pt-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-sm font-semibold">
              V
            </div>

            <div>
              <p className="text-sm font-medium">Student Workspace</p>
              <p className="text-[11px] text-gray-500">AI Debate Coach</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="min-w-0 flex-1 px-5 py-6 md:px-9 md:py-8 lg:px-12">

        {/* Header */}
        <header className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg border border-white/10 p-2 text-gray-300 md:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-xs text-gray-500">
                Workspace <ChevronRight className="mx-1 inline" size={12} /> {activePage}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{activePage}</h2>
            </div>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-green-500/15 bg-green-500/[0.06] px-3 py-2 sm:flex">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-xs text-green-400">AI System Ready</span>
          </div>
        </header>

        {(activePage === "Dashboard" || activePage === "New Debate") && (
          <>
            {/* Debate input page */}
            {!debate && (
              <>
                <section className="mx-auto mb-12 max-w-3xl text-center">
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-2 text-xs text-violet-300">
                    <Sparkles size={14} />
                    Intelligent Debate Preparation
                  </div>

                  <h1 className="text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                    Think deeper.
                    <span className="block text-violet-400">
                      Debate smarter.
                    </span>
                  </h1>

                  <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                    Explore both sides of an argument, challenge assumptions,
                    and develop balanced perspectives with AI.
                  </p>
                </section>

                <section className="mx-auto max-w-3xl">
                  <div className="rounded-2xl border border-white/[0.08] bg-[#11111a] p-5 shadow-2xl shadow-black/20 sm:p-7">

                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-500/10 text-violet-400">
                        <MessageSquare size={18} />
                      </div>

                      <div>
                        <h3 className="text-sm font-semibold">
                          Start a new debate
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Enter a topic to explore multiple perspectives.
                        </p>
                      </div>
                    </div>

                    <textarea
                      value={topic}
                      onChange={(e) => {
                        setTopic(e.target.value);
                        setError("");
                      }}
                      disabled={loading}
                      maxLength={300}
                      placeholder="Example: Should artificial intelligence be used in education?"
                      className="h-36 w-full resize-none rounded-xl border border-white/[0.08] bg-[#09090f] p-4 text-sm leading-6 text-white outline-none transition placeholder:text-gray-600 focus:border-violet-500/60 disabled:opacity-50"
                    />

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[11px] text-gray-600">
                        {topic.length}/300 characters
                      </span>
                      <span className="text-[11px] text-gray-500">
                        Classroom-friendly topics
                      </span>
                    </div>

                    {error && (
                      <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/20 bg-red-500/[0.06] p-3 text-sm text-red-300">
                        <AlertCircle size={18} className="shrink-0" />
                        {error}
                      </div>
                    )}

                    <button
                      onClick={startDebate}
                      disabled={loading}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3.5 text-sm font-semibold shadow-lg shadow-violet-900/20 transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Analyzing perspectives...
                        </>
                      ) : (
                        <>
                          Generate balanced debate
                          <ArrowRight size={17} />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Suggested topics */}
                  <div className="mt-10">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">
                          Need some inspiration?
                        </h3>
                        <p className="mt-1 text-xs text-gray-500">
                          Start with one of these suggested topics.
                        </p>
                      </div>
                      <BookOpen size={19} className="text-gray-500" />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {suggestedTopics.map((item) => (
                        <button
                          key={item}
                          disabled={loading}
                          onClick={() => {
                            setTopic(item);
                            setError("");
                          }}
                          className="group flex min-h-16 items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#11111a] p-4 text-left text-sm text-gray-300 transition hover:border-violet-500/40 hover:bg-violet-500/[0.04] disabled:opacity-50"
                        >
                          <span>{item}</span>
                          <ArrowRight
                            size={16}
                            className="shrink-0 text-gray-600 transition group-hover:translate-x-1 group-hover:text-violet-400"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Loading */}
            {loading && (
              <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/[0.08] bg-[#11111a] p-12 text-center">
                <Loader2 size={38} className="mx-auto mb-5 animate-spin text-violet-400" />
                <h3 className="text-lg font-semibold">
                  Preparing your debate
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Analyzing arguments, counterarguments and evidence quality.
                </p>
              </div>
            )}

            {/* Debate results */}
            {debate && (
              <section className="mx-auto max-w-4xl space-y-10">

                {/* Report heading */}
                <div className="border-b border-white/[0.08] pb-7">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs text-green-400">
                      <CheckCircle2 size={15} />
                      Analysis completed
                    </div>

                    <button
                      onClick={resetDebate}
                      className="flex items-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition hover:border-violet-500/40 hover:text-white"
                    >
                      <RotateCcw size={15} />
                      New debate
                    </button>
                  </div>

                  <h1 className="max-w-3xl text-2xl font-semibold leading-snug tracking-tight sm:text-3xl">
                    {debate.topic}
                  </h1>
                </div>

                {/* Overview */}
                <article>
                  <SectionHeading
                    icon={BookOpen}
                    title="Debate overview"
                    subtitle="Understanding the context behind the topic."
                  />

                  <p className="max-w-3xl text-sm leading-7 text-gray-300">
                    {debate.overview}
                  </p>
                </article>

                {/* Arguments */}
                <section>
                  <SectionHeading
                    icon={Scale}
                    title="Arguments and perspectives"
                    subtitle="A balanced examination of both sides."
                  />

                  <div className="grid gap-8 md:grid-cols-2">

                    <div>
                      <div className="mb-5 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-400" />
                        <h3 className="text-sm font-semibold text-green-400">
                          In favour
                        </h3>
                      </div>

                      <div className="space-y-6">
                        {debate.for_arguments?.map((item, index) => (
                          <article
                            key={index}
                            className="border-l-2 border-green-500/30 pl-4"
                          >
                            <p className="mb-2 text-xs text-gray-600">
                              ARGUMENT {String(index + 1).padStart(2, "0")}
                            </p>

                            <h4 className="mb-2 text-sm font-semibold leading-6 text-gray-200">
                              {item.argument}
                            </h4>

                            <p className="text-sm leading-7 text-gray-400">
                              {item.explanation}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="mb-5 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        <h3 className="text-sm font-semibold text-red-400">
                          Against
                        </h3>
                      </div>

                      <div className="space-y-6">
                        {debate.against_arguments?.map((item, index) => (
                          <article
                            key={index}
                            className="border-l-2 border-red-500/30 pl-4"
                          >
                            <p className="mb-2 text-xs text-gray-600">
                              ARGUMENT {String(index + 1).padStart(2, "0")}
                            </p>

                            <h4 className="mb-2 text-sm font-semibold leading-6 text-gray-200">
                              {item.argument}
                            </h4>

                            <p className="text-sm leading-7 text-gray-400">
                              {item.explanation}
                            </p>
                          </article>
                        ))}
                      </div>
                    </div>

                  </div>
                </section>

                <div className="border-t border-white/[0.07]" />

                {/* Counterargument map */}
                <section>
                  <SectionHeading
                    icon={Brain}
                    title="Counterargument map"
                    subtitle="Explore how opposing perspectives challenge each argument."
                  />

                  <div className="space-y-6">
                    {debate.counterarguments?.map((item, index) => (
                      <div key={index}>
                        <div className="mb-3 flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500/10 text-xs text-violet-400">
                            {index + 1}
                          </span>
                          <span className="text-xs text-gray-500">
                            Argument pair {index + 1}
                          </span>
                        </div>

                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="rounded-xl border border-green-500/15 bg-green-500/[0.035] p-5">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-green-400">
                              Original argument
                            </p>
                            <p className="text-sm leading-7 text-gray-300">
                              {item.original_argument}
                            </p>
                          </div>

                          <div className="rounded-xl border border-red-500/15 bg-red-500/[0.035] p-5">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-red-400">
                              Counterargument
                            </p>
                            <p className="text-sm leading-7 text-gray-300">
                              {item.opposing_response}
                            </p>
                          </div>
                        </div>

                        {index !== debate.counterarguments.length - 1 && (
                          <div className="mt-3 flex justify-center text-gray-600">
                            <ArrowDown size={16} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                <div className="border-t border-white/[0.07]" />

                {/* Evidence quality */}
                {debate.evidence_scorecard && (
                  <section>
                    <SectionHeading
                      icon={ShieldCheck}
                      title="Evidence quality scorecard"
                      subtitle="Preliminary assessment of the quality of the supporting evidence."
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <ScoreCard
                        title="Source credibility"
                        data={debate.evidence_scorecard.source_credibility}
                      />
                      <ScoreCard
                        title="Relevance"
                        data={debate.evidence_scorecard.relevance}
                      />
                      <ScoreCard
                        title="Recency"
                        data={debate.evidence_scorecard.recency}
                      />
                      <ScoreCard
                        title="Bias balance"
                        data={debate.evidence_scorecard.bias}
                      />
                    </div>

                    <div className="mt-5 rounded-xl border border-violet-500/20 bg-violet-500/[0.05] p-6">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">
                        Overall evidence quality
                      </p>

                      <div className="mt-3 flex items-end gap-2">
                        <span className="text-4xl font-semibold text-violet-400">
                          {debate.evidence_scorecard.overall_score}
                        </span>
                        <span className="mb-1 text-sm text-gray-500">/ 10</span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <h4 className="mb-2 flex items-center gap-2 text-sm font-semibold">
                        <Lightbulb size={16} className="text-violet-400" />
                        Evidence limitations
                      </h4>
                      <p className="text-sm leading-7 text-gray-400">
                        {debate.evidence_scorecard.limitations}
                      </p>
                    </div>
                  </section>
                )}

                <div className="border-t border-white/[0.07]" />

                {/* Conclusion */}
                <section>
                  <SectionHeading
                    icon={Sparkles}
                    title="Balanced conclusion"
                    subtitle="A synthesis of the arguments presented."
                  />

                  <div className="rounded-xl border border-violet-500/20 bg-violet-500/[0.045] p-6">
                    <p className="text-sm leading-7 text-gray-300">
                      {debate.conclusion}
                    </p>
                  </div>
                </section>

                {/* New debate action */}
                <div className="border-t border-white/[0.07] pt-7">
                  <button
                    onClick={resetDebate}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 p-4 text-sm font-semibold transition hover:bg-violet-500"
                  >
                    <PlusCircle size={18} />
                    Start another debate
                  </button>
                </div>

              </section>
            )}
          </>
        )}

        {/* Other pages */}
        {activePage !== "Dashboard" && activePage !== "New Debate" && (
          <section className="mx-auto mt-20 max-w-xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
              <History size={26} />
            </div>

            <h2 className="text-xl font-semibold">{activePage}</h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              This section will be available in a future development phase.
            </p>
          </section>
        )}

        <footer className="mx-auto mt-20 max-w-4xl border-t border-white/[0.05] pt-6 text-center text-xs text-gray-600">
          AI Debate Coach · Balanced thinking starts here.
        </footer>

      </main>
    </div>
  );
}

export default App;
