import React from 'react';
import {
  Zap,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Lock,
  Smartphone,
  FileText,
  BarChart3,
  ArrowRight,
  Info
} from 'lucide-react';
import { DISCO_COMPANIES, DiscoCompany } from '../data/discoBillsData';
import { DiscoLogoBadge } from './DiscoBrandAssets';

interface AboutUsPageProps {
  onNavigateHome: () => void;
  onNavigateContact: () => void;
  onSelectDisco: (code: DiscoCompany['code']) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  onNavigateHome,
  onNavigateContact,
  onSelectDisco
}) => {
  return (
    <div className="bg-[#F3F7F4] text-[#0C1F14] pb-16">
      {/* Dark Green Header Banner */}
      <div
        className="text-white pt-8 pb-12 px-4 sm:px-8 border-b border-[#2B5640]"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(25, 194, 107, 0.18), transparent 45%), linear-gradient(135deg, #052e16 0%, #064e28 60%, #065f31 100%)'
        }}
      >
        <div className="max-w-[980px] mx-auto">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#CFE3D6]"
          >
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:text-white hover:underline cursor-pointer bg-transparent border-0 p-0 text-[#CFE3D6]"
            >
              Home
            </button>
            <span>›</span>
            <span className="text-white font-semibold">About Us</span>
          </nav>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-white mt-2 m-0">
            About BijliPK
          </h1>
          <p className="text-xs sm:text-sm text-[#CFE3D6] mt-2.5 max-w-[64ch] leading-relaxed m-0">
            Pakistan’s fast, clear, and consumer-friendly platform for checking, understanding, and managing duplicate electricity bills online across all 10 WAPDA distribution companies.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6">
        {/* Card 1: Our Mission & Story */}
        <section className="bg-white rounded-2xl border border-[#D3E3D8] p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
                OUR MISSION
              </div>
              <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0C1F14] mt-1 m-0">
                Making electricity bills easy to read on any screen
              </h2>
              <p className="text-xs sm:text-sm text-[#4B6155] leading-relaxed mt-3 mb-0">
                Traditional paper electricity bills are packed with dense tables, tiny numbers, and technical abbreviations that are difficult to read on a mobile phone. When you only want to know how much is due, when to pay, and why your bill went up, zooming in on an oversized bill sheet is frustrating.
              </p>
              <p className="text-xs sm:text-sm text-[#4B6155] leading-relaxed mt-3 mb-0">
                <strong>BijliPK.com</strong> was built to solve this for Pakistani households and businesses. The moment you enter your 14-digit reference number or 10-digit Customer ID, we show you a clean <strong>Bill Summary View</strong> first — highlighting your payable amount, due date, Raast QR payment steps, tax and surcharge breakdown, and 200-unit protected status — while keeping your full printable <strong>Official PITC Bill</strong> one click away.
              </p>
            </div>

            {/* 2x2 Key Metrics Grid */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-[#EAF3ED] border border-[#D3E3D8] p-4">
                <div className="w-8 h-8 rounded-lg bg-[#066B33] text-white flex items-center justify-center mb-2.5">
                  <Zap className="w-4 h-4" />
                </div>
                <div className="font-display font-bold text-2xl text-[#0C1F14]">10</div>
                <div className="text-[11px] text-[#4B6155] mt-0.5">
                  Pakistani WAPDA DISCOs supported
                </div>
              </div>

              <div className="rounded-xl bg-[#EAF3ED] border border-[#D3E3D8] p-4">
                <div className="w-8 h-8 rounded-lg bg-[#066B33] text-white flex items-center justify-center mb-2.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="font-display font-bold text-2xl text-[#0C1F14]">Rs 0</div>
                <div className="text-[11px] text-[#4B6155] mt-0.5">
                  100% free utility service forever
                </div>
              </div>

              <div className="rounded-xl bg-[#EAF3ED] border border-[#D3E3D8] p-4">
                <div className="w-8 h-8 rounded-lg bg-[#066B33] text-white flex items-center justify-center mb-2.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="font-display font-bold text-2xl text-[#0C1F14]">24/7</div>
                <div className="text-[11px] text-[#4B6155] mt-0.5">
                  Live bill access on phone or desktop
                </div>
              </div>

              <div className="rounded-xl bg-[#EAF3ED] border border-[#D3E3D8] p-4">
                <div className="w-8 h-8 rounded-lg bg-[#066B33] text-white flex items-center justify-center mb-2.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="font-display font-bold text-2xl text-[#0C1F14]">PITC</div>
                <div className="text-[11px] text-[#4B6155] mt-0.5">
                  Official duplicate bill & tax certificate
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: What Makes BijliPK Different */}
        <section className="bg-white rounded-2xl border border-[#D3E3D8] p-6 sm:p-8 shadow-xs">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
            BUILT FOR CONSUMERS
          </div>
          <h2 className="font-display font-bold text-xl text-[#0C1F14] mt-1 m-0">
            What you get with every bill check
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-4">
              <div className="flex items-center gap-2 font-display font-bold text-xs text-[#0C1F14]">
                <FileText className="w-4 h-4 text-[#066B33]" />
                <span>Clear Bill Breakdown</span>
              </div>
              <p className="text-xs text-[#4B6155] mt-2 leading-relaxed m-0">
                See exactly how much of your payment goes toward base electricity units, fixed load charges, GST & taxes, surcharges, and Fuel Price Adjustment (FPA).
              </p>
            </div>

            <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-4">
              <div className="flex items-center gap-2 font-display font-bold text-xs text-[#0C1F14]">
                <ShieldCheck className="w-4 h-4 text-[#066B33]" />
                <span>200-Unit Protected Status Tracker</span>
              </div>
              <p className="text-xs text-[#4B6155] mt-2 leading-relaxed m-0">
                Track your last 6 months of consumption against NEPRA’s 200-unit protected consumer threshold so you can avoid crossing into higher unprotected tariff slabs.
              </p>
            </div>

            <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-4">
              <div className="flex items-center gap-2 font-display font-bold text-xs text-[#0C1F14]">
                <BarChart3 className="w-4 h-4 text-[#066B33]" />
                <span>12-Month Usage History & Raast QR</span>
              </div>
              <p className="text-xs text-[#4B6155] mt-2 leading-relaxed m-0">
                Compare your monthly kWh usage across the past year and pay effortlessly via Raast QR in JazzCash, Easypaisa, or any Pakistani banking app.
              </p>
            </div>
          </div>
        </section>

        {/* Card 3: Privacy & Security Commitment */}
        <section className="bg-white rounded-2xl border border-[#D3E3D8] p-6 sm:p-8 shadow-xs">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
            PRIVACY & SECURITY
          </div>
          <h2 className="font-display font-bold text-xl text-[#0C1F14] mt-1 m-0">
            How we handle your bill information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/40">
              <Lock className="w-5 h-5 text-[#066B33] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-xs text-[#0C1F14] m-0">
                  No account or registration required
                </h3>
                <p className="text-xs text-[#4B6155] mt-1 leading-relaxed m-0">
                  We never ask for your phone number, CNIC, email address, or password to check a bill. Your bill data is fetched on demand from the official PITC server.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/40">
              <Smartphone className="w-5 h-5 text-[#066B33] shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-bold text-xs text-[#0C1F14] m-0">
                  Saved numbers stay on your device
                </h3>
                <p className="text-xs text-[#4B6155] mt-1 leading-relaxed m-0">
                  When you save a reference number to “My Bills” or “Recent Numbers”, it is stored locally in your browser on your own phone or computer — and you can clear it anytime in one tap.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Card 4: All 10 Supported Electric Companies */}
        <section className="bg-white rounded-2xl border border-[#D3E3D8] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
                COVERAGE ACROSS PAKISTAN
              </div>
              <h2 className="font-display font-bold text-xl text-[#0C1F14] mt-1 m-0">
                Supported electricity distribution companies (DISCOs)
              </h2>
            </div>
            <span className="text-xs text-[#6A8475]">
              Click any company to check its bill
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {DISCO_COMPANIES.map(disco => (
              <div
                key={disco.code}
                className="rounded-xl border border-[#D3E3D8] hover:border-[#066B33] p-3.5 flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <DiscoLogoBadge code={disco.code} size="md" />
                  <div className="min-w-0">
                    <div className="font-display font-bold text-xs text-[#0C1F14]">
                      {disco.code} — {disco.name}
                    </div>
                    <div className="text-[11px] text-[#6A8475] truncate mt-0.5">
                      {disco.citiesList}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectDisco(disco.code)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#EAF3ED] hover:bg-[#066B33] text-[#066B33] hover:text-white text-[11px] font-semibold cursor-pointer transition-colors shrink-0"
                >
                  <span>Check Bill</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Disclaimer & Bottom CTA */}
        <section className="rounded-2xl bg-[#EAF3ED] border border-[#B5CCBD] p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#066B33] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display font-bold text-xs text-[#0C1F14] m-0">
                Independent Service Disclaimer
              </h3>
              <p className="text-xs text-[#4B6155] mt-1 leading-relaxed m-0 max-w-[64ch]">
                BijliPK is an independent consumer utility platform and is not affiliated with PITC, WAPDA, NEPRA, or any electricity distribution company (DISCO). All official bill records are fetched live from the official PITC bill server.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onNavigateContact}
              className="px-4 py-2 rounded-full bg-white border border-[#B5CCBD] hover:bg-[#F3F7F4] text-xs font-semibold text-[#0C1F14] cursor-pointer transition-colors"
            >
              Contact Support
            </button>
            <button
              type="button"
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#066B33] hover:bg-[#055528] text-white text-xs font-semibold cursor-pointer transition-colors"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Check Bill Now</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
