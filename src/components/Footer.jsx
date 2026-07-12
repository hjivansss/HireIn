import {
  BriefcaseBusiness,
  Mail,
  Phone,
  MapPin,
  Globe,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-20 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-8 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <BriefcaseBusiness size={30} className="text-brand" />

              <h2 className="text-2xl font-bold text-white">
                Hire<span className="text-brand">In</span>
              </h2>
            </div>

            <p className="leading-7 text-slate-400">
              HireIn is a modern recruitment platform built to help recruiters
              discover exceptional talent, simplify hiring workflows, and build
              stronger teams with confidence.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-white">
              Quick Links
            </h3>

            <div className="flex flex-col gap-3">
              <Link className="hover:text-brand" to="/">
                Home
              </Link>

              <Link className="hover:text-brand" to="/recruiter">
                For Recruiters
              </Link>

              <Link className="hover:text-brand" to="/candidate">
                For Candidates
              </Link>

              <Link className="hover:text-brand" to="/about">
                About Us
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-white">
              Our Services
            </h3>

            <div className="flex flex-col gap-3">
              <p>Job Posting</p>
              <p>Candidate Search</p>
              <p>Resume Screening</p>
              <p>Interview Management</p>
              <p>Recruitment Analytics</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-xl font-semibold text-white">
              Contact Us
            </h3>

            <div className="space-y-4">

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-brand" />
                <span>support@hirein.com</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-brand" />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1 text-brand" />
                <span>
                  Bengaluru, Karnataka
                  <br />
                  India
                </span>
              </div>

              <div className="mt-6 flex gap-5">
                <Mail
                  className="cursor-pointer hover:text-brand"
                  size={22}
                />

                <Globe
                  className="cursor-pointer hover:text-brand"
                  size={22}
                />
              </div>

            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-14 border-t border-slate-700 pt-6 flex flex-col md:flex-row items-center justify-between">

          <p className="text-slate-400">
            © 2026 HireIn. All rights reserved.
          </p>

          <div className="mt-4 flex gap-6 md:mt-0">
            <Link className="hover:text-brand" to="/">
              Privacy Policy
            </Link>

            <Link className="hover:text-brand" to="/">
              Terms of Service
            </Link>

            <Link className="hover:text-brand" to="/">
              Cookies
            </Link>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;