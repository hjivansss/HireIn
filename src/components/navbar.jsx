import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo  from "./Logo";
const navLinks = [
  { name: "Home", path: "/" },
  { name: "For Candidates", path: "/candidates" },
  { name: "For Recruiters", path: "/recruiters" },
  { name: "About", path: "/about" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-sm"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-10">

        {/* Logo */}

        <Link
          to="/"
          className="transition-transform duration-300 hover:scale-[1.02] flex items-center "
        >
          <Logo />
          <span className="text-xl font-semibold tracking-tight text-slate-900">
            Hire<span className="text-brand">In</span>
          </span>
        </Link>

        {/* Desktop Navigation */}

        <ul className="hidden items-center gap-2 lg:flex">
          {navLinks.map((link) => {
            const active = location.pathname === link.path;

            return (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    active
                      ? scrolled
                        ? "bg-slate-100 text-slate-900"
                        : "bg-white/70 text-slate-900 backdrop-blur"
                      : scrolled
                      ? "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      : "text-slate-700 hover:bg-white/60 hover:text-slate-900"
                  }`}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Side */}

        <div className="hidden items-center gap-5 lg:flex">

          <Link
            to="/login"
            className={`text-sm font-medium transition ${
              scrolled
                ? "text-slate-600 hover:text-slate-900"
                : "text-slate-700 hover:text-black"
            }`}
          >
            Sign in
          </Link>

          <Link
            to="/signup"
            className="rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Start Hiring
          </Link>

        </div>

        {/* Mobile Button */}

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-slate-700 lg:hidden"
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

      </nav>

      {/* Mobile Menu */}

      <div
        className={`overflow-hidden transition-all duration-300 lg:hidden ${
          isOpen ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="space-y-2 border-t border-slate-200 bg-white px-6 py-6">

          {navLinks.map((link) => {
            const active = location.pathname === link.path;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`block rounded-xl px-4 py-3 text-sm font-medium ${
                  active
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          <div className="space-y-3 pt-4">

            <Link
              to="/login"
              className="block rounded-xl border border-slate-200 py-3 text-center font-medium text-slate-700"
            >
              Sign in
            </Link>

            <Link
              to="/signup"
              className="block rounded-xl bg-brand py-3 text-center font-semibold text-white"
            >
              Start Hiring
            </Link>

          </div>

        </div>
      </div>
    </header>
  );
}