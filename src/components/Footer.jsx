import { Mail, Phone, MapPin } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#162033] text-slate-300">

      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-10">

        {/* Top */}

        <div className="grid gap-14 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">

          {/* Brand */}

          <div>

            <Link
              to="/"
              className="flex items-center gap-3"
            >

              <Logo className="h-10 w-10" />

              <span className="text-xl font-semibold text-white">
                Hire<span className="text-brand">In</span>
              </span>

            </Link>

            <p className="mt-6 max-w-sm text-[15px] leading-7 text-slate-400">
              AI-powered recruitment platform helping recruiters discover,
              evaluate and hire exceptional talent faster.
            </p>

          </div>

          {/* Product */}

          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Platform
            </h3>

            <ul className="space-y-3 text-[15px]">

              <li>
                <Link
                  to="/recruiters"
                  className="transition hover:text-white"
                >
                  Recruiters
                </Link>
              </li>

              <li>
                <Link
                  to="/candidates"
                  className="transition hover:text-white"
                >
                  Candidates
                </Link>
              </li>

              <li>
                <Link
                  to="/dashboard"
                  className="transition hover:text-white"
                >
                  Dashboard
                </Link>
              </li>

              <li>
                <Link
                  to="/discover"
                  className="transition hover:text-white"
                >
                  AI Matching
                </Link>
              </li>

            </ul>

          </div>

          {/* Company */}

          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Company
            </h3>

            <ul className="space-y-3 text-[15px]">

              <li>
                <Link
                  to="/about"
                  className="transition hover:text-white"
                >
                  About
                </Link>
              </li>

              <li>
                <Link
                  to="/contact"
                  className="transition hover:text-white"
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  to="/careers"
                  className="transition hover:text-white"
                >
                  Careers
                </Link>
              </li>

            </ul>

          </div>

          {/* Contact */}

          <div>

            <h3 className="mb-5 text-sm font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>

            <ul className="space-y-4 text-[15px]">

              <li className="flex items-center gap-3">

                <Mail className="h-4 w-4 text-brand" />

                support@hirein.com

              </li>

              <li className="flex items-center gap-3">

                <Phone className="h-4 w-4 text-brand" />

                +91 98765 43210

              </li>

              <li className="flex items-start gap-3">

                <MapPin className="mt-1 h-4 w-4 text-brand" />

                Bengaluru, India

              </li>

            </ul>

          </div>

        </div>

        {/* Divider */}

        <div className="my-12 h-px bg-slate-800" />

        {/* Bottom */}

        <div className="flex flex-col items-center justify-between gap-5 text-sm text-slate-500 md:flex-row">

          <p>
            © 2026 HireIn. All rights reserved.
          </p>

          <div className="flex items-center gap-6">

            <Link
              to="/privacy"
              className="transition hover:text-white"
            >
              Privacy
            </Link>

            <Link
              to="/terms"
              className="transition hover:text-white"
            >
              Terms
            </Link>

            <Link
              to="/cookies"
              className="transition hover:text-white"
            >
              Cookies
            </Link>

            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              <FaGithub className="h-5 w-5" />
            </a>

          </div>

        </div>

      </div>

    </footer>
  );
}