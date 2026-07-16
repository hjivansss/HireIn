import Navbar from '../components/navbar'
import Footer from '../components/Footer'
import heroImage from '../assets/hero.jpg'
import {
  Layers,
  Sparkles,
  ListChecks,
  Gauge,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react'

const AUDIENCES = [
  {
    tag: 'For Recruiters',
    title: 'Source once, evaluate everywhere',
    points: [
      'Paste a JD and get structured skills, seniority, and tools extracted automatically',
      'Pull matching candidates from resumes, LinkedIn, and GitHub in one pass',
      'Every candidate ranked with a fit score, matched skills, and a written justification',
      "See exactly which requirements a candidate is missing — and how critical each gap is",
    ],
    cta: { label: 'Generate a talent pool', href: '/discover' },
  },
  {
    tag: 'For Candidates',
    title: 'One upload, matched to relevant roles',
    points: [
      'Submit your resume or LinkedIn export in under a minute — no account needed',
      'Get matched to roles based on your actual skills and experience',
      'Mark yourself open to work and update your profile anytime',
      'Your profile is only visible to recruiters evaluating relevant roles',
    ],
    cta: { label: 'Upload your resume', href: '/apply' },
  },
]

const FEATURES = [
  {
    icon: Layers,
    title: 'One pool, every source',
    description:
      'Resumes, LinkedIn exports, and live GitHub search — unified into a single candidate pool instead of three separate tabs.',
  },
  {
    icon: Sparkles,
    title: 'Scores you can question',
    description:
      'Every match comes with a written justification, not just a number. See exactly why a candidate ranked where they did.',
  },
  {
    icon: ListChecks,
    title: 'Skill gaps, not guesswork',
    description:
      "Each candidate's missing skills are flagged by criticality, so you know what's a dealbreaker and what's a nice-to-have.",
  },
  {
    icon: Gauge,
    title: 'Fast where it can be, careful where it matters',
    description:
      'A quick rule-based pass narrows the pool first — full AI evaluation only runs on the candidates worth a closer look.',
  },
  {
    icon: Users,
    title: 'Built for both sides',
    description:
      'Recruiters get a ranked shortlist. Candidates get a simple, dedicated place to submit their resume — no account required.',
  },
  {
    icon: ShieldCheck,
    title: 'Not a black box',
    description:
      'HireIn is a sourcing aid, not a decision-maker. The reasoning is always visible, and the final call always stays with you.',
  },
]

const steps = [
  { n: 1, title: 'Post Your Job', body: 'Create detailed job listings with role requirements, skills, and qualifications in minutes.' },
  { n: 2, title: 'Discover Candidates', body: 'Search resumes, LinkedIn profiles, and GitHub repositories to build a strong candidate pool.' },
  { n: 3, title: 'Hire With Confidence', body: 'Shortlist, interview, and hire — all from one clean, focused workspace.' },
]

const Landing = () => {
  return (
    <>
      <Navbar />
    
      {/* Hero */}
      <section className="relative flex h-[80vh] min-h-[680px] max-h-[760px] items-center overflow-hidden bg-[#fafafa]">

        {/* Background Glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-emerald-100 blur-[140px] opacity-50" />
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 lg:grid-cols-12 lg:px-8">

          {/* LEFT */}
          <div className="lg:col-span-5 max-w-[520px]">

            {/* Badge */}
            <div className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-4 py-2 shadow-sm">
              <span className="mr-2 h-2 w-2 rounded-full bg-emerald-500" />

              <span className="text-sm font-medium text-emerald-700">
                AI-powered recruitment platform
              </span>
            </div>

            {/* Heading */}
            <h1 className="mt-6 text-5xl font-bold leading-[0.95] tracking-[-0.04em] text-slate-900 lg:text-[64px]">
              Hire smarter.
              <br />
              Build{" "}
              <span className="text-brand">
                stronger teams.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-5 max-w-[480px] text-lg leading-8 text-slate-600">
              AI-powered recruiting that unifies resumes, LinkedIn and GitHub into one intelligent hiring workflow
            </p>

            {/* CTA */}
            <div className="mt-8 flex items-center gap-5">

              <a
                href="/discover"
                className="rounded-xl bg-brand px-7 py-3.5 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-brand-hover"
              >
                Start Hiring
              </a>

              <a
                href="/about"
                className="font-medium text-slate-700 transition hover:text-brand"
              >
                Book Demo →
              </a>

            </div>
          </div>

          

          {/* RIGHT */}
          <div className="relative flex justify-end lg:col-span-7">

            {/* Decoration */}
            <div className="absolute top-5 right-5 h-[430px] w-[560px] rounded-[34px] bg-brand/10" />

            {/* Image */}
            <div className="relative w-full max-w-[560px] overflow-hidden rounded-[30px] bg-white shadow-2xl ring-1 ring-slate-200">

              <img
                src={heroImage}
                alt="Recruiters using HireIn"
                className="h-[430px] w-full object-cover object-center"
              />

            </div>

          </div>

        </div>

      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">

          {/* Heading */}

          <div className="mx-auto max-w-2xl text-center">

            <span className="text-sm font-semibold uppercase tracking-[0.18em] text-brand">
              HOW IT WORKS
            </span>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Hiring in three simple steps.
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-600">
              HireIn brings sourcing, AI screening and candidate ranking into one
              streamlined workflow.
            </p>

          </div>

          {/* Cards */}

          <div className="mt-14 grid gap-6 lg:grid-cols-3">

            {steps.map((step, index) => (

              <div
                key={step.n}
                className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              >

                {/* Number */}

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-white">

                  {step.n}

                </div>

                {/* Title */}

                <h3 className="mt-6 text-xl font-semibold text-slate-900">

                  {step.title}

                </h3>

                {/* Description */}

                <p className="mt-3 text-sm leading-7 text-slate-600">

                  {step.body}

                </p>

                {/* Mini UI */}

                <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                  {index === 0 && (

                    <>
                      <div className="h-3 w-24 rounded bg-slate-300" />

                      <div className="mt-4 space-y-2">

                        <div className="h-2 rounded bg-white" />

                        <div className="h-2 w-4/5 rounded bg-white" />

                        <div className="mt-3 h-12 rounded-xl border border-dashed border-slate-300 bg-white" />

                      </div>

                    </>

                  )}

                  {index === 1 && (

                    <div className="space-y-3">

                      {["Resume", "LinkedIn", "GitHub"].map((item) => (

                        <div
                          key={item}
                          className="flex items-center justify-between rounded-lg bg-white px-3 py-2 shadow-sm"
                        >

                          <span className="text-sm text-slate-700">

                            {item}

                          </span>

                          <span className="font-semibold text-brand">

                            ✓

                          </span>

                        </div>

                      ))}

                    </div>

                  )}

                  {index === 2 && (

                    <div className="rounded-xl bg-white p-4 shadow-sm">

                      <div className="flex items-center justify-between">

                        <span className="font-medium text-slate-800">

                          Top Candidate

                        </span>

                        <span className="font-bold text-brand">

                          96%

                        </span>

                      </div>

                      <div className="mt-3 h-2 rounded-full bg-slate-100">

                        <div className="h-2 w-[96%] rounded-full bg-brand" />

                      </div>

                    </div>

                  )}

                </div>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* Why Choose HireIn */}
      <section className="relative overflow-hidden bg-slate-50 py-20">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-brand/10 blur-[120px]" />
        </div>

        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">

          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex items-center rounded-full border border-brand/20 bg-white px-4 py-2 text-sm font-semibold text-brand shadow-sm">

              <span className="mr-2 h-2 w-2 rounded-full bg-brand" />

              Why HireIn

            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Built for
              <span className="text-brand"> modern recruiting teams</span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Everything recruiters need—from sourcing and AI evaluation to
              candidate comparison—in one simple platform.
            </p>

          </div>

          {/* Features */}

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">

            {FEATURES.map((feature) => {

              const Icon = feature.icon;

              return (

                <div
                  key={feature.title}
                  className="
                    group
                    rounded-3xl
                    border
                    border-slate-200
                    bg-white
                    p-7
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    hover:border-brand/30
                    hover:shadow-xl
                  "
                >

                  {/* Icon */}

                  <div
                    className="
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-brand/10
                      transition-all
                      duration-300
                      group-hover:bg-brand
                    "
                  >

                    <Icon
                      className="
                        h-7
                        w-7
                        text-brand
                        transition-colors
                        duration-300
                        group-hover:text-white
                      "
                    />

                  </div>

                  {/* Title */}

                  <h3 className="mt-6 text-lg font-semibold text-slate-900">

                    {feature.title}

                  </h3>

                  {/* Description */}

                  <p className="mt-3 text-sm leading-7 text-slate-600">

                    {feature.description}

                  </p>

                  {/* Bottom line */}

                  <div
                    className="
                      mt-6
                      h-1
                      w-10
                      rounded-full
                      bg-brand/20
                      transition-all
                      duration-300
                      group-hover:w-20
                      group-hover:bg-brand
                    "
                  />

                </div>

              );

            })}

          </div>

        </div>

      </section>

      {/* Recruiters / Candidates */}
      <section className="py-20">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-10">

          {/* Heading */}

          <div className="mx-auto max-w-3xl text-center">

            <span className="inline-flex rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
              Built for Everyone
            </span>

            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 lg:text-4xl">
              Whether you're hiring or getting hired
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              HireIn keeps the experience simple for candidates while giving
              recruiters the tools they need to build stronger teams.
            </p>

          </div>

          {/* Cards */}

          <div className="mt-14 grid gap-6 lg:grid-cols-2">

            {AUDIENCES.map((audience, index) => (

              <div
                key={audience.tag}
                className={`rounded-3xl border p-8 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${
                  index === 0
                    ? "border-slate-200 bg-white"
                    : "border-slate-200 bg-slate-50"
                }`}
              >

                <span className="inline-flex rounded-full bg-brand/10 px-4 py-1 text-sm font-medium text-brand">

                  {audience.tag}

                </span>

                <h3 className="mt-6 text-2xl font-bold text-slate-900">

                  {audience.title}

                </h3>

                <div className="mt-7 space-y-4">

                  {audience.points.map((point) => (

                    <div
                      key={point}
                      className="flex items-start gap-4"
                    >

                      <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand/10">

                        <CheckCircle2 className="h-4 w-4 text-brand" />

                      </div>

                      <p className="text-sm leading-7 text-slate-600">

                        {point}

                      </p>

                    </div>

                  ))}

                </div>

                <a
                  href={audience.cta.href}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 font-medium text-white transition-all duration-300 hover:gap-3 hover:bg-brand-hover"
                >

                  {audience.cta.label}

                  <ArrowRight className="h-4 w-4" />

                </a>

              </div>

            ))}

          </div>

        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">

        <div className="mx-auto max-w-6xl px-6 lg:px-10">

          <div className="overflow-hidden rounded-[32px] bg-gradient-to-r from-brand to-emerald-700 px-12 py-16 text-center text-white shadow-xl">

            <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
              Ready to build your shortlist?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-emerald-50">
              Add a job description and receive an AI-ranked, explainable
              candidate shortlist in minutes.
            </p>

            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">

              <a
                href="/discover"
                className="rounded-xl bg-white px-7 py-3.5 font-semibold text-brand transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Generate Talent Pool
              </a>

              <a
                href="/apply"
                className="rounded-xl border border-white/30 px-7 py-3.5 font-semibold transition-all duration-300 hover:bg-white/10"
              >
                Upload Resume
              </a>

            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  )
}

export default Landing
