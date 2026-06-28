"use client";

import Link from "next/link";
import {
  FiMail,
  FiPhone,
  FiMapPin,
  FiTwitter,
  FiLinkedin,
  FiGithub,
  FiInstagram,
} from "react-icons/fi";

const quickLinks = [
  { name: "Home", path: "/" },
  { name: "Browse Startups", path: "/startups" },
  { name: "Opportunities", path: "/opportunities" },
  { name: "Success Stories", path: "/success-stories" },
  { name: "Pricing", path: "/pricing" },
];

const legalLinks = [
  { name: "Privacy Policy", path: "/privacy" },
  { name: "Terms of Service", path: "/terms" },
  { name: "Cookie Policy", path: "/cookies" },
];

const socialLinks = [
  { icon: <FiTwitter className="text-xl" />, path: "https://twitter.com" },
  { icon: <FiLinkedin className="text-xl" />, path: "https://linkedin.com" },
  { icon: <FiGithub className="text-xl" />, path: "https://github.com" },
  { icon: <FiInstagram className="text-xl" />, path: "https://instagram.com" },
];

export default function Footer() {
  return (
    <footer className="bg-slate-900 pt-20 pb-10 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="text-3xl font-extrabold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
                StartupForge
              </span>
            </Link>
            <p className="text-slate-400 leading-relaxed text-sm">
              The ultimate platform connecting visionary startup founders with
              talented collaborators. Build your dream team and bring your ideas
              to life.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-slate-400 hover:text-blue-400 transition-colors duration-300 flex items-center gap-2 group text-sm"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Contact Info
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-5 text-sm">
              <li className="flex items-start gap-3 text-slate-400 group">
                <FiMapPin className="text-xl text-blue-500 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>
                  123 Innovation Drive,
                  <br />
                  Tech Valley, CA 94043
                </span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 group">
                <FiPhone className="text-xl text-blue-500 group-hover:scale-110 transition-transform" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3 text-slate-400 group">
                <FiMail className="text-xl text-blue-500 group-hover:scale-110 transition-transform" />
                <span>hello@startupforge.com</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-6 relative inline-block">
              Newsletter
              <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-blue-500 rounded-full"></span>
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Subscribe to get the latest startup opportunities and news.
            </p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-sm placeholder:text-slate-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-blue-500/20 text-sm"
              >
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} StartupForge. All rights reserved.
          </p>
          <div className="flex gap-6">
            {legalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-slate-500 hover:text-blue-400 text-sm transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
