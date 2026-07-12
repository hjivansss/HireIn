import React from 'react'
import Navbar from '../components/navbar'
import heroImage from '../assets/hero.png'
import Footer from '../components/Footer'


const Landing = () => {
  return (<>
        <Navbar />
        <section className="relative mx-4 mt-6 overflow-hidden rounded-2xl sm:mx-6 sm:mt-8 lg:mx-auto lg:max-w-7xl">
            <div className="relative h-[420px] w-full sm:h-[460px] lg:h-[520px]">

              {/* Background Image */}
              <img
                src={heroImage} 
                alt="Recruiter reviewing candidate profiles on HireIn"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Single softened overlay — was two stacked pure-black layers */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/55 to-slate-900/10"></div>

              {/* Text Content */}
              <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-6 sm:px-10 lg:px-12">
                <h1 className="text-3xl font-bold leading-snug text-white sm:text-4xl lg:text-5xl lg:leading-tight">
                  Hire Smarter.
                  <br />
                  Build
                  <span className="text-emerald-300"> Stronger Teams.</span>
                </h1>

                <p className="mt-5 text-base leading-relaxed text-slate-200 sm:mt-6 sm:text-lg">
                  Discover qualified candidates faster with a streamlined recruitment
                  platform designed to help recruiters hire the right talent with confidence.
                </p>

                <button className="mt-7 w-fit rounded-lg bg-brand px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-brand-hover sm:mt-8">
                  Start Hiring
                </button>
              </div>
            </div>
          </section>

          <section className="bg-slate-50 py-16 sm:py-20">
            <div className="mx-auto max-w-7xl px-6">

              {/* Heading */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  Hire in <span className="text-brand">3 Simple Steps</span>
                </h2>

                <p className="mt-4 text-base text-slate-600 sm:text-lg">
                  From job posting to candidate selection, streamline your recruitment
                  process with HireIn.
                </p>
              </div>

              {/* Cards */}
              <div className="mt-12 grid gap-6 sm:mt-16 sm:gap-8 md:grid-cols-3">

                {/* Card 1 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-semibold text-white">
                    1
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    Post Your Job
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Create detailed job listings with role requirements, skills,
                    experience, and qualifications in minutes.
                  </p>

                </div>

                {/* Card 2 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-semibold text-white">
                    2
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    Discover Candidates
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Search across resumes, LinkedIn profiles, ZIP resume uploads, and GitHub
                    repositories to build a comprehensive candidate pool in one place.
                  </p>

                </div>

                {/* Card 3 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand font-semibold text-white">
                    3
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    Hire the Best
                  </h3>

                  <p className="mt-3 text-slate-600">
                    Review applications, shortlist candidates, schedule interviews,
                    and build your ideal team faster.
                  </p>

                </div>

              </div>

            </div>
          </section>
          <Footer/>
  </>)
}

export default Landing
