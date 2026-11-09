import React, { useState, useRef } from 'react';
import {
  ArrowRight,
  Check,
  Printer,
  ShieldCheck,
  LayoutGrid,
  Hash,
  FileText,
  BarChart3,
  Star,
  Calendar,
  MessageCircle,
  Lock,
  Plus,
  Minus,
  X,
  Zap
} from 'lucide-react';
import {
  DISCO_COMPANIES,
  DiscoCompany,
  BillRecord,
  ELECTRICITY_GUIDES,
  FAQ_ITEMS,
  GuideArticle,
  formatReference14
} from '../data/discoBillsData';
import { DiscoLogoBadge } from './DiscoBrandAssets';

interface HomePageViewProps {
  selectedDisco: DiscoCompany['code'];
  onSelectDisco: (code: DiscoCompany['code']) => void;
  onSearchBill: (disco: DiscoCompany['code'], rawInput: string, mode: 'reference' | 'customerId') => void;
  recentBills: BillRecord[];
  onSelectRecentBill: (bill: BillRecord) => void;
  onRemoveRecentBill: (id: string) => void;
  onClearRecentBills: () => void;
}

export const HomePageView: React.FC<HomePageViewProps> = ({
  selectedDisco,
  onSelectDisco,
  onSearchBill,
  recentBills,
  onSelectRecentBill,
  onRemoveRecentBill,
  onClearRecentBills
}) => {
  const [searchMode, setSearchMode] = useState<'reference' | 'customerId'>('reference');
  const [inputValue, setInputValue] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [openFaqIdx, setOpenFaqIdx] = useState<number | null>(0);
  const [activeGuide, setActiveGuide] = useState<GuideArticle | null>(null);

  const checkerCardRef = useRef<HTMLDivElement>(null);
  const refInputRef = useRef<HTMLInputElement>(null);

  const currentCompany =
    DISCO_COMPANIES.find(d => d.code === selectedDisco) || DISCO_COMPANIES[0];

  const rawDigits = inputValue.replace(/[^0-9]/g, '');
  const maxDigits = searchMode === 'reference' ? 14 : 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, maxDigits);
    if (searchMode === 'reference') {
      setInputValue(formatReference14(digits));
    } else {
      setInputValue(digits);
    }
    if (errorMsg) setErrorMsg(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // If user left input blank, use the selected DISCO's sample reference so they can test immediately,
    // or if they typed partial digits (<10 for Customer ID or <14 for Reference), validate or complete:
    if (rawDigits.length > 0 && rawDigits.length < maxDigits) {
      setErrorMsg(
        searchMode === 'reference'
          ? `Please enter all 14 digits (${14 - rawDigits.length} digits remaining) or click a recent bill below.`
          : `Please enter your 10-digit Customer ID (${10 - rawDigits.length} digits remaining).`
      );
      return;
    }
    const effectiveInput =
      rawDigits.length === maxDigits
        ? rawDigits
        : searchMode === 'reference'
        ? currentCompany.sampleRef
        : currentCompany.sampleCustomerId;

    onSearchBill(selectedDisco, effectiveInput, searchMode);
  };

  const handleCompanyCardClick = (code: DiscoCompany['code']) => {
    onSelectDisco(code);
    const comp = DISCO_COMPANIES.find(c => c.code === code);
    if (comp) {
      setInputValue(formatReference14(comp.sampleRef));
      setSearchMode('reference');
      setErrorMsg(null);
    }
    checkerCardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      refInputRef.current?.focus();
    }, 300);
  };

  return (
    <div className="bg-[#F3F7F4] text-[#0C1F14]">
      {/* SECTION 1: DARK GREEN HERO WITH INTERACTIVE BILL CHECKER */}
      <section
        className="text-white py-12 sm:py-16 px-4 sm:px-8 border-b border-[#2B5640]"
        style={{
          background:
            'radial-gradient(circle at 75% 25%, rgba(25, 194, 107, 0.22), transparent 45%), linear-gradient(135deg, #042411 0%, #053b1c 55%, #065529 100%)'
        }}
      >
        <div className="max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-6 flex flex-col items-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] font-semibold text-[#E6F2EA]">
              <span className="w-2 h-2 rounded-full bg-[#4DFFA0]" />
              <span>Official PITC Data • 100% Free Utility Service</span>
            </div>

            <h1 className="font-display font-bold text-3xl sm:text-5xl leading-[1.12] tracking-tight text-white mt-5 m-0">
              Electricity Bill Online Check in Pakistan
            </h1>

            <p className="text-sm sm:text-[15px] text-[#CFE3D6] leading-relaxed mt-4 mb-6 max-w-[54ch]">
              Check, view, download and print duplicate electricity bills for all 10 Pakistani WAPDA companies (LESCO, MEPCO, FESCO, IESCO, GEPCO, PESCO, HESCO, SEPCO, QESCO, TESCO) — instantly and free.
            </p>

            <div className="w-full max-w-[420px] pt-5 border-t border-white/15 grid grid-cols-3 gap-4">
              <div>
                <div className="font-display font-bold text-2xl text-white">10</div>
                <div className="text-[11px] text-[#A9C7B5]">electricity companies</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-white">Rs 0</div>
                <div className="text-[11px] text-[#A9C7B5]">free forever</div>
              </div>
              <div>
                <div className="font-display font-bold text-2xl text-white">24/7</div>
                <div className="text-[11px] text-[#A9C7B5]">on any phone</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Bill Checker Card */}
          <div className="lg:col-span-6" ref={checkerCardRef}>
            <form
              onSubmit={handleFormSubmit}
              className="rounded-3xl p-5 sm:p-6 border border-[#2B5640] shadow-2xl"
              style={{
                background:
                  'linear-gradient(180deg, rgba(9, 58, 31, 0.92) 0%, rgba(6, 41, 22, 0.96) 100%)'
              }}
            >
              {/* Step 1: Choose your electricity company */}
              <div className="flex items-center gap-2 text-xs font-bold text-white mb-3">
                <span className="w-5 h-5 rounded-full bg-[#19C26B] text-[#0C1F14] flex items-center justify-center text-[11px] font-extrabold">
                  1
                </span>
                <span>Choose your electricity company</span>
              </div>

              {/* 5x2 Grid of 10 WAPDA DISCOs */}
              <div
                className="grid grid-cols-5 gap-2"
                role="group"
                aria-label="Choose your electricity company"
              >
                {DISCO_COMPANIES.map(disco => {
                  const active = selectedDisco === disco.code;
                  return (
                    <button
                      key={disco.code}
                      type="button"
                      onClick={() => {
                        onSelectDisco(disco.code);
                        if (errorMsg) setErrorMsg(null);
                      }}
                      className={`rounded-xl py-2 px-1 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        active
                          ? 'bg-[#0d522c] border-2 border-[#4DFFA0] shadow-md'
                          : 'bg-white/8 border border-white/12 hover:bg-white/15'
                      }`}
                    >
                      <DiscoLogoBadge code={disco.code} size="sm" />
                      <span className="font-display font-bold text-[10px] text-white mt-1 leading-none">
                        {disco.code}
                      </span>
                      <span className="text-[8px] text-[#CFE3D6] truncate max-w-full mt-0.5">
                        {disco.shortCity}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Reference No. | Customer ID Toggle */}
              <div className="mt-4 inline-flex items-center bg-[#042211] p-1 rounded-full border border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('reference');
                    setInputValue('');
                    setErrorMsg(null);
                  }}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                    searchMode === 'reference'
                      ? 'bg-white text-[#0C1F14]'
                      : 'text-[#CFE3D6] hover:text-white'
                  }`}
                >
                  Reference No.
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('customerId');
                    setInputValue('');
                    setErrorMsg(null);
                  }}
                  className={`px-3.5 py-1 rounded-full text-[11px] font-semibold cursor-pointer transition-colors ${
                    searchMode === 'customerId'
                      ? 'bg-white text-[#0C1F14]'
                      : 'text-[#CFE3D6] hover:text-white'
                  }`}
                >
                  Customer ID
                </button>
              </div>

              {/* Step 2: Enter your 14-digit reference number */}
              <div className="flex items-center justify-between mt-3.5 mb-2">
                <label
                  htmlFor="hero-ref-input"
                  className="flex items-center gap-2 text-xs font-bold text-white"
                >
                  <span className="w-5 h-5 rounded-full bg-[#19C26B] text-[#0C1F14] flex items-center justify-center text-[11px] font-extrabold">
                    2
                  </span>
                  <span>
                    {searchMode === 'reference'
                      ? 'Enter your 14-digit reference number'
                      : 'Enter your 10-digit Customer ID'}
                  </span>
                </label>
              </div>

              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-slate-400 font-mono-code font-bold text-sm pointer-events-none">
                  #
                </span>
                <input
                  id="hero-ref-input"
                  ref={refInputRef}
                  type="text"
                  inputMode="numeric"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={
                    searchMode === 'reference'
                      ? `e.g. ${formatReference14(currentCompany.sampleRef)}`
                      : `e.g. ${currentCompany.sampleCustomerId}`
                  }
                  className="w-full bg-white text-[#0C1F14] placeholder-slate-400 font-mono-code font-semibold text-sm rounded-xl py-3 pl-8 pr-14 border border-white focus:outline-none"
                />
                <span className="absolute right-3 text-[11px] font-mono-code font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {rawDigits.length}/{maxDigits}
                </span>
              </div>

              {errorMsg && (
                <div className="mt-2 text-[11px] font-semibold text-[#7DF0B2] bg-black/30 px-3 py-1.5 rounded-lg border border-[#4DFFA0]/40">
                  {errorMsg}
                </div>
              )}

              {/* RECENT NUMBERS Box (Matches Screenshot 3) */}
              {recentBills.length > 0 && (
                <div className="mt-2.5 bg-white rounded-xl p-3 text-[#0C1F14] shadow-sm">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#6A8475] mb-2">
                    <span>RECENT NUMBERS</span>
                    <button
                      type="button"
                      onClick={onClearRecentBills}
                      className="text-[#066B33] hover:underline cursor-pointer bg-transparent border-0 p-0 text-[10px] font-semibold normal-case"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {recentBills.slice(0, 3).map(item => (
                      <div
                        key={item.id}
                        className="py-1.5 flex items-center justify-between gap-2 group"
                      >
                        <button
                          type="button"
                          onClick={() => onSelectRecentBill(item)}
                          className="flex items-center gap-2.5 text-left flex-1 cursor-pointer bg-transparent border-0 p-0"
                        >
                          <DiscoLogoBadge code={item.discoCode} size="sm" />
                          <div>
                            <div className="font-mono-code font-bold text-xs text-[#0C1F14] group-hover:text-[#066B33]">
                              {item.referenceNo}
                            </div>
                            <div className="text-[10px] text-[#6A8475]">
                              {item.discoCode} • {item.consumerName.split(' ')[0]} • Rs{' '}
                              {item.payableWithinDue.toLocaleString()} ({item.billMonth})
                            </div>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveRecentBill(item.id)}
                          title="Remove saved number"
                          className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] text-slate-400 mt-1.5 pt-1 border-t border-slate-100">
                    Saved only on this device
                  </div>
                </div>
              )}

              <div className="text-[11px] text-[#CFE3D6] mt-2.5">
                Printed at the top of your paper bill. Spaces are added for you.
              </div>

              {/* Submit Button: Check Bill → */}
              <button
                type="submit"
                className="mt-3.5 w-full py-3 px-5 rounded-xl bg-[#19C26B] hover:bg-[#15a85c] text-[#0C1F14] font-display font-bold text-sm flex items-center justify-center gap-2 shadow-lg cursor-pointer transition-all"
              >
                <span>Check Bill</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Trust Footer Row */}
              <div className="mt-3.5 flex flex-wrap items-center justify-center gap-4 text-[10px] text-[#CFE3D6]">
                <span className="inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#4DFFA0]" />
                  <span>Official PITC bill</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Check className="w-3 h-3 text-[#4DFFA0]" />
                  <span>Free, no sign-up</span>
                </span>
                <span className="inline-flex items-center gap-1">
                  <Printer className="w-3 h-3 text-[#4DFFA0]" />
                  <span>Print or save PDF</span>
                </span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* SECTION 2: ALL OF PAKISTAN — Choose your electricity company */}
      <section className="py-14 px-4 sm:px-8 max-w-[1140px] mx-auto">
        <div className="text-center max-w-[600px] mx-auto">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
            ALL OF PAKISTAN
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0C1F14] mt-1 m-0">
            Choose your electricity company
          </h2>
          <p className="text-xs sm:text-sm text-[#4B6155] mt-2">
            Not sure which one? It is printed at the top of your bill — or pick your city below.
          </p>
        </div>

        {/* 10 WAPDA DISCO Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-8">
          {DISCO_COMPANIES.map(disco => (
            <div
              key={disco.code}
              className="bg-white rounded-2xl border border-[#D3E3D8] hover:border-[#066B33] p-4 flex items-center justify-between gap-3 shadow-2xs transition-all"
            >
              <button
                type="button"
                onClick={() => handleCompanyCardClick(disco.code)}
                className="flex items-center gap-3 text-left flex-1 cursor-pointer bg-transparent border-0 p-0 min-w-0"
              >
                <DiscoLogoBadge code={disco.code} size="md" />
                <div className="min-w-0">
                  <div className="font-display font-bold text-sm text-[#0C1F14]">
                    {disco.code}
                  </div>
                  <div className="text-[11px] text-[#4B6155] truncate">
                    {disco.name}
                  </div>
                  <div className="text-[10px] text-[#6A8475] truncate mt-0.5">
                    {disco.citiesList}
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSearchBill(disco.code, disco.sampleRef, 'reference')}
                title={`Check ${disco.code} sample bill`}
                className="w-7 h-7 rounded-full bg-[#EAF3ED] hover:bg-[#066B33] text-[#066B33] hover:text-white flex items-center justify-center shrink-0 cursor-pointer transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS — Your bill in three steps */}
      <section className="py-10 px-4 sm:px-8 max-w-[1140px] mx-auto">
        <div className="text-center">
          <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
            HOW IT WORKS
          </div>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0C1F14] mt-1 m-0">
            Your bill in three steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-8">
          <div className="bg-white rounded-2xl border border-[#D3E3D8] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#066B33] text-white flex items-center justify-center">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-3xl text-[#EAF3ED] select-none">
                01
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-[#0C1F14] m-0">
              Pick your company
            </h3>
            <p className="text-xs text-[#4B6155] mt-1.5 leading-relaxed m-0">
              LESCO, MEPCO, IESCO... choose the one printed on your bill.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D3E3D8] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#066B33] text-white flex items-center justify-center">
                <Hash className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-3xl text-[#EAF3ED] select-none">
                02
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-[#0C1F14] m-0">
              Enter your reference number
            </h3>
            <p className="text-xs text-[#4B6155] mt-1.5 leading-relaxed m-0">
              14 digits from the top of your bill — or use your customer ID.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-[#D3E3D8] p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#066B33] text-white flex items-center justify-center">
                <Printer className="w-5 h-5" />
              </div>
              <span className="font-display font-bold text-3xl text-[#EAF3ED] select-none">
                03
              </span>
            </div>
            <h3 className="font-display font-bold text-base text-[#0C1F14] m-0">
              View, print or save
            </h3>
            <p className="text-xs text-[#4B6155] mt-1.5 leading-relaxed m-0">
              See the amount and due date instantly, then print or save a PDF.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: WHERE IS MY REFERENCE NUMBER? */}
      <section className="py-10 px-4 sm:px-8 max-w-[1140px] mx-auto">
        <div className="bg-white rounded-3xl border border-[#D3E3D8] p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
              WHERE IS MY REFERENCE NUMBER?
            </div>
            <h2 className="font-display font-bold text-xl sm:text-2xl text-[#0C1F14] mt-1 m-0">
              It is printed at the top-left of every bill
            </h2>
            <p className="text-xs sm:text-sm text-[#4B6155] leading-relaxed mt-3">
              The reference number has 14 digits, usually shown in three groups like{' '}
              <span className="font-mono-code font-semibold text-[#0C1F14]">
                07 11526 1234567
              </span>
              . Some bills add a letter (U or R) at the end — you can leave it out.
            </p>

            <div className="mt-4 flex flex-col gap-2 text-xs text-[#0C1F14]">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#19C26B] shrink-0" />
                <span>Lost your bill? Use the Customer ID option (10 digits) instead.</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#19C26B] shrink-0" />
                <span>Save it in “My Bills” and never type it again on this device.</span>
              </div>
            </div>
          </div>

          {/* Right Diagram of Paper Bill Header */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="w-full max-w-[420px] bg-[#F3F7F4] rounded-2xl border border-[#D3E3D8] p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#D3E3D8]">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#066B33] text-white flex items-center justify-center">
                    <Zap className="w-3.5 h-3.5" />
                  </div>
                  <div className="space-y-1">
                    <div className="w-24 h-2 rounded bg-[#B5CCBD]" />
                    <div className="w-16 h-1.5 rounded bg-[#D3E3D8]" />
                  </div>
                </div>
                <div className="w-14 h-4 rounded bg-[#D3E3D8]" />
              </div>

              {/* Highlighted Reference Box */}
              <div className="mt-4 rounded-xl border-2 border-[#19C26B] bg-[#E9F5EE] p-3 shadow-xs">
                <div className="text-[9px] font-bold tracking-wider uppercase text-[#066B33]">
                  REFERENCE NO
                </div>
                <div className="font-mono-code font-bold text-base sm:text-lg text-[#0C1F14] tracking-wider mt-0.5">
                  07 11526 1234567 U
                </div>
              </div>

              {/* Mock Columns Below */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-[#D3E3D8] text-[8px] font-bold uppercase text-[#6A8475]">
                <div>
                  <div>BILL MONTH</div>
                  <div className="w-10 h-2 rounded bg-[#B5CCBD] mt-1" />
                </div>
                <div>
                  <div>DUE DATE</div>
                  <div className="w-12 h-2 rounded bg-[#B5CCBD] mt-1" />
                </div>
                <div>
                  <div>UNITS</div>
                  <div className="w-8 h-2 rounded bg-[#B5CCBD] mt-1" />
                </div>
                <div>
                  <div>PAYABLE</div>
                  <div className="w-12 h-2 rounded bg-[#066B33]/50 mt-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: BUILT FOR PAKISTAN — More than a bill checker */}
      <section
        className="py-16 px-4 sm:px-8 text-white mt-6"
        style={{
          background:
            'linear-gradient(135deg, #042411 0%, #053b1c 60%, #064e28 100%)'
        }}
      >
        <div className="max-w-[1140px] mx-auto">
          <div className="text-center">
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#7DF0B2]">
              BUILT FOR PAKISTAN
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-white mt-1 m-0">
              More than a bill checker
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
            <div className="rounded-2xl bg-white/6 border border-white/12 p-5">
              <div className="w-9 h-9 rounded-lg bg-[#19C26B]/20 text-[#4DFFA0] flex items-center justify-center mb-3.5">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white m-0">
                Amount & due date first
              </h3>
              <p className="text-xs text-[#CFE3D6] mt-1.5 leading-relaxed m-0">
                No hunting through a crowded bill — the numbers that matter are at the top.
              </p>
            </div>

            <div className="rounded-2xl bg-white/6 border border-white/12 p-5">
              <div className="w-9 h-9 rounded-lg bg-[#19C26B]/20 text-[#4DFFA0] flex items-center justify-center mb-3.5">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white m-0">
                Usage history chart
              </h3>
              <p className="text-xs text-[#CFE3D6] mt-1.5 leading-relaxed m-0">
                See your units for the last months and spot a high bill before it arrives.
              </p>
            </div>

            <div className="rounded-2xl bg-white/6 border border-white/12 p-5">
              <div className="w-9 h-9 rounded-lg bg-[#19C26B]/20 text-[#4DFFA0] flex items-center justify-center mb-3.5">
                <Star className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white m-0">
                My Bills
              </h3>
              <p className="text-xs text-[#CFE3D6] mt-1.5 leading-relaxed m-0">
                Save your home, shop or parents’ bills on your phone and check them in one tap.
              </p>
            </div>

            <div className="rounded-2xl bg-white/6 border border-white/12 p-5">
              <div className="w-9 h-9 rounded-lg bg-[#19C26B]/20 text-[#4DFFA0] flex items-center justify-center mb-3.5">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white m-0">
                Due-date reminder
              </h3>
              <p className="text-xs text-[#CFE3D6] mt-1.5 leading-relaxed m-0">
                Add the due date to your phone’s calendar and never pay a late surcharge.
              </p>
            </div>

            <div className="rounded-2xl bg-white/6 border border-white/12 p-5">
              <div className="w-9 h-9 rounded-lg bg-[#19C26B]/20 text-[#4DFFA0] flex items-center justify-center mb-3.5">
                <MessageCircle className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white m-0">
                Share on WhatsApp
              </h3>
              <p className="text-xs text-[#CFE3D6] mt-1.5 leading-relaxed m-0">
                Send the amount and due date to family in one tap.
              </p>
            </div>

            <div className="rounded-2xl bg-white/6 border border-white/12 p-5">
              <div className="w-9 h-9 rounded-lg bg-[#19C26B]/20 text-[#4DFFA0] flex items-center justify-center mb-3.5">
                <Lock className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white m-0">
                Private & safe
              </h3>
              <p className="text-xs text-[#CFE3D6] mt-1.5 leading-relaxed m-0">
                No account needed. Bills come straight from PITC and are kept on our server for only a few minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: GUIDES & NEWS — Latest electricity guides */}
      <section className="py-14 px-4 sm:px-8 max-w-[1140px] mx-auto">
        <div className="flex items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
              GUIDES & NEWS
            </div>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0C1F14] mt-1 m-0">
              Latest electricity guides
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setActiveGuide(ELECTRICITY_GUIDES[2])}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#B5CCBD] bg-white hover:bg-[#EAF3ED] text-xs font-semibold text-[#0C1F14] cursor-pointer transition-colors"
          >
            <span>All guides</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ELECTRICITY_GUIDES.map(guide => (
            <article
              key={guide.id}
              className="bg-white rounded-2xl border border-[#D3E3D8] overflow-hidden flex flex-col justify-between shadow-2xs hover:border-[#066B33] transition-colors"
            >
              <div>
                {/* Visual Thumbnail */}
                {guide.imageType === 'bolt' ? (
                  <div
                    className="h-44 flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, #042e16 0%, #065f31 100%)'
                    }}
                  >
                    <Zap className="w-10 h-10 text-[#4DFFA0]" />
                  </div>
                ) : (
                  <div className="h-44 bg-gradient-to-br from-slate-800 via-emerald-950 to-slate-900 flex flex-col items-center justify-center p-4 text-center relative overflow-hidden">
                    <DiscoLogoBadge
                      code={(guide.tag as DiscoCompany['code']) || 'FESCO'}
                      size="lg"
                    />
                    <span className="font-display font-bold text-sm text-white mt-2">
                      {guide.title}
                    </span>
                    <span className="text-[10px] text-[#CFE3D6] mt-0.5">
                      Consumer Utility Guide • BijliPK
                    </span>
                  </div>
                )}

                <div className="p-5">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EAF3ED] text-[#066B33] text-[10px] font-bold">
                    {guide.tag}
                  </span>
                  <h3 className="font-display font-bold text-sm text-[#0C1F14] mt-2.5 m-0 leading-snug">
                    {guide.title}
                  </h3>
                  <p className="text-xs text-[#4B6155] mt-2 leading-relaxed m-0">
                    {guide.excerpt}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-2 flex items-center justify-between text-[11px]">
                <span className="text-[#6A8475]">{guide.date}</span>
                <button
                  type="button"
                  onClick={() => setActiveGuide(guide)}
                  className="inline-flex items-center gap-1 font-bold text-[#066B33] hover:underline cursor-pointer bg-transparent border-0 p-0"
                >
                  <span>Read</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* SECTION 7: FREQUENTLY ASKED QUESTIONS */}
      <section id="faq-section" className="py-12 px-4 sm:px-8 max-w-[760px] mx-auto">
        <div className="text-center mb-8">
          <div className="w-6 h-0.5 bg-[#066B33] mx-auto mb-2" />
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-[#0C1F14] m-0">
            Frequently asked questions
          </h2>
        </div>

        <div className="flex flex-col gap-2.5">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaqIdx === idx;
            return (
              <div
                key={item.q}
                className="bg-white rounded-xl border border-[#D3E3D8] overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 cursor-pointer bg-white hover:bg-[#F3F7F4]/60 transition-colors"
                >
                  <span className="font-display font-bold text-xs sm:text-sm text-[#0C1F14]">
                    {item.q}
                  </span>
                  <span className="w-6 h-6 rounded-full bg-[#EAF3ED] text-[#066B33] flex items-center justify-center shrink-0">
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-xs text-[#4B6155] leading-relaxed border-t border-[#D3E3D8]/60">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Guide Article Reader Modal */}
      {activeGuide && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          onClick={() => setActiveGuide(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-[560px] w-full p-6 shadow-xl border border-[#D3E3D8]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#D3E3D8]">
              <span className="px-2.5 py-0.5 rounded-full bg-[#EAF3ED] text-[#066B33] text-[10px] font-bold">
                {activeGuide.tag} • {activeGuide.date}
              </span>
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <h3 className="font-display font-bold text-lg text-[#0C1F14] mt-3 m-0">
              {activeGuide.title}
            </h3>
            <div className="mt-3 space-y-2.5 text-xs text-[#4B6155] leading-relaxed">
              <p className="m-0">{activeGuide.excerpt}</p>
              {activeGuide.content.map((p, i) => (
                <p key={i} className="m-0">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-5 pt-3 border-t border-[#D3E3D8] flex justify-end">
              <button
                type="button"
                onClick={() => setActiveGuide(null)}
                className="px-4 py-1.5 rounded-full bg-[#066B33] text-white text-xs font-semibold cursor-pointer"
              >
                Close guide
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
