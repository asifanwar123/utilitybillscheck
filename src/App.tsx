/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Zap,
  Moon,
  Mail,
  MapPin,
  Clock,
  ArrowUp
} from 'lucide-react';
import {
  DISCO_COMPANIES,
  DiscoCompany,
  BillRecord,
  buildBillRecord,
  fetchBillFromCompanyWebsite
} from './data/discoBillsData';
import { BijliPkLogo, DiscoLogoBadge } from './components/DiscoBrandAssets';
import { HomePageView } from './components/HomePageView';
import { BillSummaryViewPage } from './components/BillSummaryViewPage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactUsPage } from './components/ContactUsPage';

type ViewMode = 'home' | 'summary' | 'full-bill' | 'about' | 'contact';

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('home');
  const [selectedDisco, setSelectedDisco] = useState<DiscoCompany['code']>('LESCO');
  const [activeBill, setActiveBill] = useState<BillRecord>(() =>
    buildBillRecord('MEPCO', '07154291113202', 'reference')
  );
  const [recentBills, setRecentBills] = useState<BillRecord[]>(() => [
    buildBillRecord('MEPCO', '07154291113202', 'reference')
  ]);
  const [savedBillIds, setSavedBillIds] = useState<string[]>(['MEPCO-07154291113202']);
  const [checkBillsDropdownOpen, setCheckBillsDropdownOpen] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCheckBillsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchBill = async (
    discoCode: DiscoCompany['code'],
    rawInput: string,
    mode: 'reference' | 'customerId' = 'reference'
  ) => {
    const initialRecord = buildBillRecord(discoCode, rawInput, mode);
    setSelectedDisco(discoCode);
    setActiveBill(initialRecord);
    setRecentBills(prev => {
      const filtered = prev.filter(b => b.id !== initialRecord.id);
      return [initialRecord, ...filtered].slice(0, 5);
    });
    setViewMode('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const liveRecord = await fetchBillFromCompanyWebsite(discoCode, rawInput, mode);
    setActiveBill(liveRecord);
    setRecentBills(prev => {
      const filtered = prev.filter(b => b.id !== liveRecord.id && b.id !== initialRecord.id);
      return [liveRecord, ...filtered].slice(0, 5);
    });
  };

  const handleSelectRecentBill = (bill: BillRecord) => {
    setSelectedDisco(bill.discoCode);
    setActiveBill(bill);
    setViewMode('summary');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRemoveRecentBill = (id: string) => {
    setRecentBills(prev => prev.filter(b => b.id !== id));
  };

  const handleClearRecentBills = () => {
    setRecentBills([]);
  };

  const handleToggleSaveBill = (bill: BillRecord) => {
    setSavedBillIds(prev =>
      prev.includes(bill.id) ? prev.filter(id => id !== bill.id) : [...prev, bill.id]
    );
    setRecentBills(prev => {
      if (prev.some(b => b.id === bill.id)) return prev;
      return [bill, ...prev];
    });
  };

  const handleSelectDiscoFromMenu = (code: DiscoCompany['code']) => {
    setCheckBillsDropdownOpen(false);
    const comp = DISCO_COMPANIES.find(d => d.code === code) || DISCO_COMPANIES[0];
    handleSearchBill(code, comp.sampleRef, 'reference');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F7F4] text-[#0C1F14]">
      {/* Sticky Top Header Bar (Matches Screenshots 1, 2, 3) */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#D3E3D8] px-4 sm:px-8 h-14 flex items-center justify-between gap-4">
        {/* Left: BIJLIPK Brand Logo */}
        <button
          type="button"
          onClick={() => {
            setViewMode('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="cursor-pointer bg-transparent border-0 p-0 text-left shrink-0"
        >
          <BijliPkLogo variant="dark" />
        </button>

        {/* Center Navigation Links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1 text-xs font-medium text-[#0C1F14]"
        >
          <button
            type="button"
            onClick={() => {
              setViewMode('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'home'
                ? 'bg-[#EAF3ED] text-[#066B33] font-semibold'
                : 'text-[#3C4043] hover:bg-[#F3F7F4]'
            }`}
          >
            Home
          </button>

          {/* Check Bills Dropdown (All 10 Electric Companies) */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setCheckBillsDropdownOpen(!checkBillsDropdownOpen)}
              aria-expanded={checkBillsDropdownOpen}
              className={`px-3 py-1.5 rounded-full inline-flex items-center gap-1 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                viewMode !== 'home' || checkBillsDropdownOpen
                  ? 'bg-[#EAF3ED] text-[#066B33] font-semibold'
                  : 'text-[#3C4043] hover:bg-[#F3F7F4]'
              }`}
            >
              <span>Check Bills</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {checkBillsDropdownOpen && (
              <div className="absolute left-0 mt-2 w-[320px] bg-white rounded-2xl border border-[#D3E3D8] shadow-xl p-2 grid grid-cols-2 gap-1 z-50">
                {DISCO_COMPANIES.map(disco => (
                  <button
                    key={disco.code}
                    type="button"
                    onClick={() => handleSelectDiscoFromMenu(disco.code)}
                    className="flex items-center gap-2 p-2 rounded-xl hover:bg-[#EAF3ED] text-left cursor-pointer transition-colors"
                  >
                    <DiscoLogoBadge code={disco.code} size="sm" />
                    <div className="min-w-0">
                      <div className="font-display font-bold text-xs text-[#0C1F14]">
                        {disco.code}
                      </div>
                      <div className="text-[10px] text-[#6A8475] truncate">
                        {disco.shortCity}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              setViewMode('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'about'
                ? 'bg-[#EAF3ED] text-[#066B33] font-semibold'
                : 'text-[#3C4043] hover:bg-[#F3F7F4]'
            }`}
          >
            About Us
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              viewMode === 'contact'
                ? 'bg-[#EAF3ED] text-[#066B33] font-semibold'
                : 'text-[#3C4043] hover:bg-[#F3F7F4]'
            }`}
          >
            Contact Us
          </button>
        </nav>

        {/* Right Actions: Theme / View Quick Switch + Green "Check Bill" Pill */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (viewMode === 'home') {
                setViewMode('summary');
              } else if (viewMode === 'summary') {
                setViewMode('full-bill');
              } else {
                setViewMode('home');
              }
            }}
            title="Cycle view (Home → Summary View → Full Bill View)"
            className="w-8 h-8 rounded-full hover:bg-[#EAF3ED] text-[#4B6155] flex items-center justify-center cursor-pointer transition-colors"
          >
            <Moon className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              setViewMode('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#066B33] hover:bg-[#055528] text-white text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Check Bill</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {viewMode === 'home' ? (
          <HomePageView
            selectedDisco={selectedDisco}
            onSelectDisco={setSelectedDisco}
            onSearchBill={handleSearchBill}
            recentBills={recentBills}
            onSelectRecentBill={handleSelectRecentBill}
            onRemoveRecentBill={handleRemoveRecentBill}
            onClearRecentBills={handleClearRecentBills}
          />
        ) : viewMode === 'about' ? (
          <AboutUsPage
            onNavigateHome={() => {
              setViewMode('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateContact={() => {
              setViewMode('contact');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDisco={code => handleSelectDiscoFromMenu(code)}
          />
        ) : viewMode === 'contact' ? (
          <ContactUsPage
            onNavigateHome={() => {
              setViewMode('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDisco={code => handleSelectDiscoFromMenu(code)}
          />
        ) : (
          <BillSummaryViewPage
            bill={activeBill}
            showFullBillInitially={viewMode === 'full-bill'}
            isSaved={savedBillIds.includes(activeBill.id)}
            onToggleSave={handleToggleSaveBill}
            onCheckAnotherBill={() => {
              setViewMode('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenFullBillChange={isOpen => {
              setViewMode(isOpen ? 'full-bill' : 'summary');
            }}
          />
        )}
      </main>

      {/* Floating Scroll-To-Top Button (Matches Screenshot 1 right margin) */}
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        title="Back to top"
        className="fixed right-4 bottom-6 z-30 w-9 h-9 rounded-full bg-white border border-[#B5CCBD] shadow-md hover:bg-[#EAF3ED] text-[#0C1F14] flex items-center justify-center cursor-pointer transition-colors"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      {/* Dark Green Footer (Matches Screenshots 1, 2, 3) */}
      <footer className="bg-[#041f10] text-[#CFE3D6] pt-12 pb-6 px-4 sm:px-8 border-t border-[#2B5640]">
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-white/10">
          {/* Col 1: Brand Description */}
          <div className="lg:col-span-4">
            <BijliPkLogo variant="light" />
            <p className="text-xs text-[#A9C7B5] leading-relaxed mt-3 max-w-[34ch]">
              BijliPK is your trusted platform for checking and managing electricity bills online. Simplifying bill access across Pakistan.
            </p>
          </div>

          {/* Col 2: Quick links */}
          <div className="lg:col-span-2">
            <h3 className="font-display font-bold text-xs text-white m-0 mb-3">
              Quick links
            </h3>
            <ul className="list-none p-0 m-0 space-y-2 text-xs text-[#A9C7B5]">
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  Blog
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('home');
                    setTimeout(() => {
                      document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('contact');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  Contact Us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('about');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => {
                    setViewMode('home');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  Duplicate Bill Guide
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Check bill by region (All 10 Electric Companies) */}
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-xs text-white m-0 mb-3">
              Check bill by region
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-[#A9C7B5]">
              {DISCO_COMPANIES.map(disco => (
                <button
                  key={disco.code}
                  type="button"
                  onClick={() => handleSelectDiscoFromMenu(disco.code)}
                  className="text-left hover:text-white cursor-pointer bg-transparent border-0 p-0 text-xs text-[#A9C7B5]"
                >
                  {disco.shortCity} ({disco.code})
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Contact us */}
          <div className="lg:col-span-3">
            <h3 className="font-display font-bold text-xs text-white m-0 mb-3">
              Contact us
            </h3>
            <div className="space-y-2.5 text-xs text-[#A9C7B5]">
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#19C26B] shrink-0" />
                <a
                  href="mailto:support@bijlipk.com"
                  className="text-white font-semibold hover:underline no-underline"
                >
                  support@bijlipk.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#19C26B] shrink-0" />
                <span>Karachi, Pakistan</span>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-3.5 h-3.5 text-[#19C26B] shrink-0 mt-0.5" />
                <div>
                  <div>Monday – Friday: 09:00 am – 09:00 pm</div>
                  <div>Saturday – Sunday: Closed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer Bar */}
        <div className="max-w-[1140px] mx-auto pt-5 flex flex-wrap items-center justify-between gap-4 text-[10px] text-[#6A8475]">
          <div>© 2026 BijliPK. All rights reserved.</div>
          <div>
            BijliPK is an independent service and is not affiliated with PITC, WAPDA or any DISCO. Bill data is fetched live from the official PITC bill server.
          </div>
        </div>
      </footer>
    </div>
  );
}
