import React from 'react'
import Navbar from '../components/navbar'
import heroImage from '../assets/hero.png'
import Footer from '../components/footer'


const Landing = () => {
  return (<>
        <Navbar />
        <section className="relative mx-auto mt-8 h-[315px] w-[1180px] overflow-hidden rounded-3xl">

            {/* Background Image */}
            <img
              src={heroImage} 
              alt="HireIn Hero"
              className="absolute inset-0 h-full w-full object-cover"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Left-to-Right Fade */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>

            {/* Text Content */}
            <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-12">
              <h1 className="text-4xl font-bold leading-tight text-white">
                Hire Smarter.
                <br />
                Build
                <span className="text-[#00674F]"> Stronger Teams.</span>
              </h1>

              <p className="mt-6 text-lg text-gray-200">
                Discover qualified candidates faster with a streamlined recruitment
                platform designed to help recruiters hire the right talent with confidence.
              </p>

              <button className="mt-8 w-fit rounded-lg bg-[#00674F] px-6 py-3 font-semibold text-white hover:opacity-90 transition">
                Start Hiring
              </button>
            </div>

          </section>

          <section className="bg-slate-50 py-20">
            <div className="mx-auto max-w-7xl px-6">

              {/* Heading */}
              <div className="text-center">
                <h2 className="text-4xl font-bold text-slate-900">
                  Hire in <span className="text-[#00674F]">3 Simple Steps</span>
                </h2>

                <p className="mt-4 text-lg text-slate-600">
                  From job posting to candidate selection, streamline your recruitment
                  process with HireIn.
                </p>
              </div>

              {/* Cards */}
              <div className="mt-16 grid gap-8 md:grid-cols-3">

                {/* Card 1 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00674F] text-white font-semibold">
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
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00674F] text-white font-semibold">
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
                <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#00674F] text-white font-semibold">
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
