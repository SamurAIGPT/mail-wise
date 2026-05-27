"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaTimes, FaImages, FaTag, FaCoins, FaPaperPlane, FaMagic } from "react-icons/fa";
import { SiVercel } from "react-icons/si";

const DEPLOY_URL =
  "https://vercel.com/new/clone?repository-url=https://github.com/SamurAIGPT/mail-wise";

const NAV_LINKS = [
  { href: "/", label: "Studio", icon: <FaPaperPlane className="text-[10px]" /> },
  { href: "/gallery", label: "Gallery", icon: <FaImages className="text-[10px]" /> },
  { href: "/pricing", label: "Pricing", icon: <FaTag className="text-[10px]" /> },
];

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center shadow-sm">
            <FaPaperPlane className="text-white text-[10px]" />
          </div>
          <span className="font-extrabold text-sm text-slate-800 tracking-tight hidden sm:block">
            Mail-<span className="text-purple-600">Wise</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                pathname === link.href
                  ? "bg-purple-50 text-purple-700 border border-purple-100/50"
                  : "text-slate-650 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-2">
          {/* Deploy Button */}
          <a
            href={DEPLOY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 transition-all border border-slate-200"
          >
            <SiVercel className="text-xs" />
            Deploy
          </a>

          {session ? (
            <div className="flex items-center gap-2">
              {/* Credits badge */}
              <Link
                href="/pricing"
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold hover:bg-purple-100 transition-all"
              >
                <FaCoins className="text-[10px]" />
                {session.user.credits ?? 0}
              </Link>
              {/* Avatar */}
              <div className="relative group">
                <img
                  src={session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                  alt={session.user.name || "User"}
                  className="w-7 h-7 rounded-full border border-slate-200 cursor-pointer hover:border-purple-500 transition-all object-cover"
                />
                <div className="absolute right-0 top-full mt-1.5 hidden group-hover:block bg-white border border-slate-200 rounded-2xl shadow-xl p-3 w-44 z-50 animate-slide-up">
                  <p className="text-xs text-slate-700 font-bold truncate mb-2">{session.user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate mb-3">{session.user.email}</p>
                  <button
                    onClick={() => signOut()}
                    className="w-full text-xs text-red-600 hover:text-red-700 hover:bg-red-50 py-1.5 px-2.5 rounded-full transition-all text-left font-bold"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              id="navbar-signin-btn"
              onClick={() => signIn("google")}
              className="px-4.5 py-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-sm"
            >
              Sign in with Google
            </button>
          )}
        </div>

        {/* Mobile: Credits + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          {session && (
            <Link
              href="/pricing"
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold"
            >
              <FaCoins className="text-[10px]" />
              {session.user.credits ?? 0}
            </Link>
          )}
          <button
            id="navbar-hamburger-btn"
            onClick={() => setMenuOpen((p) => !p)}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-all"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 z-[200] bg-white border-b border-slate-200 shadow-xl md:hidden">
          <div className="px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-bold transition-all ${
                  pathname === link.href
                    ? "bg-purple-50 text-purple-700 border border-purple-100/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {link.icon}
                {link.label}
              </Link>
            ))}

            <div className="border-t border-slate-100 my-2" />

            {session ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={session.user.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"}
                    alt={session.user.name || ""}
                    className="w-8 h-8 rounded-full border border-slate-200 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-700">{session.user.name}</p>
                    <p className="text-[10px] text-slate-400">{session.user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="text-xs text-red-600 hover:text-red-700 px-3 py-1.5 rounded-full hover:bg-red-50 transition-all font-bold"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                onClick={() => { signIn("google"); setMenuOpen(false); }}
                className="w-full py-2.5 rounded-full bg-purple-600 text-white text-sm font-bold"
              >
                Sign in with Google
              </button>
            )}

            {/* Deploy button in mobile */}
            <a
              href={DEPLOY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-all mt-1 border border-slate-200"
            >
              <SiVercel className="text-sm" />
              Deploy to Vercel
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
