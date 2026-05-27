"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useSearchParams } from "next/navigation";
import {
  FaCrown,
  FaCheckCircle,
  FaCoins,
  FaSpinner,
  FaGoogle,
  FaBolt,
} from "react-icons/fa";
import { Suspense } from "react";

const PLANS = [
  {
    id: "basic",
    name: "Basic Pack",
    credits: 1000,
    price: 5,
    priceInCents: 500,
    emails: 250,
    badge: null,
    accent: "zinc",
    features: ["1,000 Credits", "~250 Business Emails", "All Tones & Length Presets", "CTA & Subject Toggles", "One-Click Body Copy"],
  },
  {
    id: "standard",
    name: "Standard Pack",
    credits: 2000,
    price: 10,
    priceInCents: 1000,
    emails: 500,
    badge: "Popular",
    accent: "purple",
    features: ["2,000 Credits", "~500 Business Emails", "All Tones & Length Presets", "CTA & Subject Toggles", "One-Click Body Copy", "Priority Customer Support"],
  },
  {
    id: "pro",
    name: "Pro Pack",
    credits: 4000,
    price: 20,
    priceInCents: 2000,
    emails: 1000,
    badge: "Best Value",
    accent: "purple",
    features: ["4,000 Credits", "~1,000 Business Emails", "All Tones & Length Presets", "CTA & Subject Toggles", "One-Click Body Copy", "Priority Customer Support"],
  },
  {
    id: "business",
    name: "Business Pack",
    credits: 10000,
    price: 50,
    priceInCents: 5000,
    emails: 2500,
    badge: "Enterprise",
    accent: "zinc",
    features: ["10,000 Credits", "~2,500 Business Emails", "All Tones & Length Presets", "CTA & Subject Toggles", "One-Click Body Copy", "Priority Customer Support", "Bulk Volume Discount"],
  },
];

function PricingContent() {
  const { data: session } = useSession();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const canceled = searchParams.get("canceled");
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (planId) => {
    if (!session?.user) { signIn("google"); return; }
    setLoading(planId);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Failed to start checkout. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-10">
        {/* Success/Canceled Banners */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-800 flex items-center gap-3 animate-slide-up">
            <FaCheckCircle className="text-emerald-600" />
            <div>
              <p className="text-sm font-bold">Payment successful!</p>
              <p className="text-xs opacity-90">Credits have been added to your account.</p>
            </div>
          </div>
        )}
        {canceled && (
          <div className="mb-6 p-4 rounded-2xl bg-slate-100 border border-slate-200 text-slate-700 text-sm animate-slide-up">
            Payment was canceled. You can try again anytime.
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold mb-4">
            <FaBolt className="text-[10px]" />
            One-Time Purchase · No Subscription
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 mb-3">
            Acquire Generation <span className="text-purple-650">Credits</span>
          </h1>
          <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
            Each professional business email costs just <strong className="text-purple-700 font-extrabold">4 credits ($0.02)</strong>. Buy once, use anytime. Credits never expire.
          </p>
          {session?.user && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-white border border-slate-200 text-sm shadow-sm">
              <FaCoins className="text-purple-600 text-xs" />
              <span className="text-slate-500 font-medium">Your balance:</span>
              <span className="text-purple-700 font-extrabold">{session.user.credits} credits</span>
              <span className="text-slate-400 text-xs">({Math.floor((session.user.credits ?? 0) / 4)} emails remaining)</span>
            </div>
          )}
        </div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map((plan) => {
            const isPopular = plan.badge === "Popular";
            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-5 flex flex-col border transition-all hover:scale-[1.02] ${
                  isPopular
                    ? "bg-white border-purple-400 shadow-md shadow-purple-100/50"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
                }`}
              >
                {plan.badge && (
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[10px] font-bold shadow-sm ${
                    isPopular ? "bg-purple-600 text-white" : "bg-slate-100 text-slate-700 border border-slate-200"
                  }`}>
                    {plan.badge}
                  </div>
                )}

                <div className="mb-4">
                  <h2 className="text-sm font-bold text-slate-700">{plan.name}</h2>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-extrabold text-slate-800">${plan.price}</span>
                    <span className="text-slate-400 text-[10px]">one-time</span>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <FaCoins className="text-purple-600 text-[10px]" />
                    <span className="text-purple-700 font-extrabold text-xs">{plan.credits.toLocaleString()} Credits</span>
                    <span className="text-slate-450 text-[9px]">= {plan.emails.toLocaleString()} emails</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2 mb-5 flex-1 border-t border-slate-100 pt-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[10px] text-slate-600 font-medium">
                      <FaCheckCircle className="text-emerald-500 text-[9px] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  id={`checkout-${plan.id}-btn`}
                  onClick={() => handleCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className={`w-full py-2.5 rounded-full font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isPopular
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-sm hover:shadow-purple-200"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-250 hover:border-slate-300"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loading === plan.id ? (
                    <><FaSpinner className="animate-spin text-xs" /> Processing…</>
                  ) : !session ? (
                    <><FaGoogle className="text-[10px]" /> Sign in to Buy</>
                  ) : (
                    <><FaCrown className="text-[10px]" /> Get {plan.credits.toLocaleString()} Credits</>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {/* FAQs */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { q: "How much is 1 business email?", a: "Each email generation costs 4 credits, which is just $0.02. Very high value outreach!" },
            { q: "Do credits expire?", a: "No! Credits are yours forever. Buy once and generate pitches whenever you like." },
            { q: "What template formats are supported?", a: "We support specialized presets for cold sales outreach, Demo follow-ups, coffee chats, meeting requests, apologetic refunds, thank you notes, and custom prompts." },
          ].map((faq) => (
            <div key={faq.q} className="p-4.5 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <h3 className="text-xs font-bold text-slate-700 mb-2">{faq.q}</h3>
              <p className="text-[10px] text-slate-500 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense>
      <PricingContent />
    </Suspense>
  );
}
