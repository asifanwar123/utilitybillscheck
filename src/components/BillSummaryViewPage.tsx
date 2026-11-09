import React, { useRef, useState, useEffect } from 'react';
import {
  Printer,
  FileText,
  Star,
  Calendar,
  Share2,
  Copy,
  Check,
  Download,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  RotateCcw,
  Clock,
  User,
  Zap,
  MapPin,
  ShieldCheck,
  BarChart3,
  Info,
  AlertTriangle,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { BillRecord, DISCO_COMPANIES } from '../data/discoBillsData';
import { DiscoLogoBadge, RaastQrCode } from './DiscoBrandAssets';
import { OfficialPitcBillSheet } from './OfficialPitcBillSheet';

interface BillSummaryViewPageProps {
  bill: BillRecord;
  showFullBillInitially?: boolean;
  isSaved: boolean;
  onToggleSave: (bill: BillRecord) => void;
  onCheckAnotherBill: () => void;
  onOpenFullBillChange?: (isOpen: boolean) => void;
}

export const BillSummaryViewPage: React.FC<BillSummaryViewPageProps> = ({
  bill,
  showFullBillInitially = false,
  isSaved,
  onToggleSave,
  onCheckAnotherBill,
  onOpenFullBillChange
}) => {
  const [isFullBillOpen, setIsFullBillOpen] = useState<boolean>(showFullBillInitially);
  const [copiedRefTop, setCopiedRefTop] = useState<boolean>(false);
  const [copiedRefPay, setCopiedRefPay] = useState<boolean>(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const officialBillSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsFullBillOpen(showFullBillInitially);
  }, [showFullBillInitially]);

  const company =
    DISCO_COMPANIES.find(d => d.code === bill.discoCode) || DISCO_COMPANIES[1];

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 2600);
  };

  const handleCopyRef = (which: 'top' | 'pay') => {
    navigator.clipboard.writeText(bill.rawReferenceNo);
    if (which === 'top') {
      setCopiedRefTop(true);
      setTimeout(() => setCopiedRefTop(false), 1800);
    } else {
      setCopiedRefPay(true);
      setTimeout(() => setCopiedRefPay(false), 1800);
    }
    triggerToast(`Copied reference number ${bill.rawReferenceNo}`);
  };

  const handleViewFullBillClick = () => {
    setIsFullBillOpen(true);
    onOpenFullBillChange?.(true);
    setTimeout(() => {
      officialBillSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 80);
  };

  const handleToggleAccordion = () => {
    const next = !isFullBillOpen;
    setIsFullBillOpen(next);
    onOpenFullBillChange?.(next);
  };

  const handlePrint = () => {
    setIsFullBillOpen(true);
    onOpenFullBillChange?.(true);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleSaveQrImage = () => {
    const svgEl = document.getElementById('pay-raast-qr-svg');
    if (!svgEl) {
      triggerToast('Raast QR saved to downloads');
      return;
    }
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgEl);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${bill.discoCode}-Raast-QR-${bill.rawReferenceNo}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Saved Raast QR image to your device');
  };

  const handleAddReminder = () => {
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `SUMMARY:Pay ${bill.discoCode} Electricity Bill (Rs ${bill.payableWithinDue.toLocaleString()})`,
      `DESCRIPTION:Reference No: ${bill.referenceNo} - Consumer: ${bill.consumerName}`,
      'DTSTART:20261028T090000Z',
      'DTEND:20261028T100000Z',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\n');
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${bill.discoCode}-Bill-Reminder.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerToast('Downloaded calendar reminder (.ics)');
  };

  const handleShareBill = () => {
    const shareText = `${bill.discoCode} Bill (${bill.billMonth}) for ${bill.consumerName} | Ref: ${bill.referenceNo} | Within Due Date: Rs ${bill.payableWithinDue.toLocaleString()} (Due ${bill.dueDate}) | After Due Date: Rs ${bill.payableAfterDue.toLocaleString()}`;
    navigator.clipboard.writeText(shareText);
    triggerToast('Bill summary copied to clipboard for sharing');
  };

  // Breakdown percentages
  const totalWithin = bill.payableWithinDue;
  const pctElec = Math.round((bill.electricityUsedCost / totalWithin) * 100);
  const pctFixed = Math.round((bill.fixedCharges / totalWithin) * 100);
  const pctSurcharges = Math.round((bill.surcharges / totalWithin) * 100);
  const pctTaxes = Math.round((bill.taxes / totalWithin) * 100);
  const pctFpa = Math.max(1, 100 - (pctElec + pctFixed + pctSurcharges + pctTaxes));
  const perUnitEffective = (totalWithin / Math.max(1, bill.unitsConsumed)).toFixed(2);

  // Usage stats
  const avgUnits = Math.round(
    bill.usageHistory.reduce((acc, m) => acc + m.units, 0) / bill.usageHistory.length
  );
  const maxUnits = Math.max(...bill.usageHistory.map(m => m.units), 300);
  const diffPct = Math.abs(Math.round(((bill.unitsConsumed - avgUnits) / avgUnits) * 100));
  const isBelowAvg = bill.unitsConsumed <= avgUnits;

  const last6Months = bill.usageHistory.slice(-6);
  const protectedMonthsCount = last6Months.filter(m => m.units <= 200).length;

  return (
    <div className="bg-[#F3F7F4] min-h-screen pb-16">
      {/* Toast Notification */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 bg-[#0C1F14] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#2B5640] text-xs font-semibold flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-[#4DFFA0]" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Dark Green Header Banner */}
      <div
        className="text-white pt-7 pb-10 px-4 sm:px-8 border-b border-[#2B5640]"
        style={{
          background:
            'radial-gradient(circle at 80% 20%, rgba(25, 194, 107, 0.18), transparent 45%), linear-gradient(135deg, #052e16 0%, #064e28 60%, #065f31 100%)'
        }}
      >
        <div className="max-w-[940px] mx-auto">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[11px] text-[#CFE3D6]"
          >
            <button
              type="button"
              onClick={onCheckAnotherBill}
              className="hover:text-white hover:underline cursor-pointer bg-transparent border-0 p-0 text-[#CFE3D6]"
            >
              Home
            </button>
            <span>›</span>
            <button
              type="button"
              onClick={onCheckAnotherBill}
              className="hover:text-white hover:underline cursor-pointer bg-transparent border-0 p-0 text-[#CFE3D6]"
            >
              {bill.discoCode} Online Bill Check
            </button>
            <span>›</span>
            <span className="text-white font-semibold">
              {bill.discoCode.charAt(0) + bill.discoCode.slice(1).toLowerCase()} Bill Summary
            </span>
          </nav>

          <h1 className="font-display font-bold text-2xl sm:text-3xl text-white mt-2 m-0">
            Your {bill.discoCode} bill
          </h1>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[940px] mx-auto px-4 sm:px-6 mt-6 flex flex-col gap-5">
        {/* CARD 1: Primary Bill Summary Card */}
        <section
          aria-label="Bill summary overview"
          className="bg-white rounded-2xl border border-[#D3E3D8] shadow-xs overflow-hidden relative"
        >
          {/* Top green progress accent bar */}
          <div className="h-1 w-full bg-[#D3E3D8]">
            <div className="h-full w-2/3 bg-[#19C26B] mx-auto rounded-full" />
          </div>

          <div className="p-5 sm:p-6">
            {/* Top Row: DISCO Identity & Overdue Pill */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <DiscoLogoBadge code={bill.discoCode} size="lg" />
                <div>
                  <div className="text-[10px] font-bold tracking-wider uppercase text-[#066B33]">
                    {company.code} • {company.name}
                  </div>
                  <h2 className="font-display font-bold text-xl text-[#0C1F14] m-0 mt-0.5">
                    Your bill for {bill.billMonth}
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-[#4B6155] mt-0.5">
                    <User className="w-3.5 h-3.5 text-[#6A8475]" />
                    <span>{bill.consumerName}</span>
                  </div>
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold">
                <Clock className="w-3.5 h-3.5 shrink-0" />
                <span>Due date passed {bill.daysOverdue} days ago</span>
              </div>
            </div>

            {/* Two-Column Payable Within / After Due Date Boxes */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 mt-5">
              {/* Left: Payable within due date (Deep Emerald Card) */}
              <div
                className="md:col-span-7 rounded-xl p-4 sm:p-5 text-white flex flex-col justify-between"
                style={{
                  background:
                    'linear-gradient(135deg, #052e16 0%, #065f31 70%, #044322 100%)'
                }}
              >
                <div className="text-[11px] font-medium text-[#CFE3D6]">
                  Payable within due date
                </div>
                <div className="font-display font-bold text-3xl sm:text-4xl tracking-tight tabular-nums my-1">
                  Rs {bill.payableWithinDue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#E6F2EA]">
                  <Calendar className="w-3.5 h-3.5 text-[#7DF0B2]" />
                  <span>
                    Due <strong>{bill.dueDate}</strong>
                  </span>
                </div>
              </div>

              {/* Right: After due date */}
              <div className="md:col-span-5 rounded-xl p-4 sm:p-5 bg-[#EAF3ED] border border-[#D3E3D8] flex flex-col justify-between">
                <div className="text-[11px] font-medium text-[#4B6155]">
                  After due date
                </div>
                <div className="font-display font-bold text-2xl sm:text-3xl text-[#b91c1c] tabular-nums my-1">
                  Rs {bill.payableAfterDue.toLocaleString()}
                </div>
                <div className="text-xs text-[#4B6155]">
                  Pay on time and save{' '}
                  <strong className="text-[#0C1F14]">Rs {bill.lpSurcharge1}</strong>
                </div>
              </div>
            </div>

            {/* 6-Item Metadata Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-4">
              {/* 1. Reference No */}
              <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-3 flex flex-col justify-between">
                <div className="text-[10px] font-semibold uppercase text-[#6A8475] flex items-center gap-1">
                  <span>#</span>
                  <span>REFERENCE NO.</span>
                </div>
                <div className="flex items-end justify-between gap-1 mt-1.5">
                  <span className="font-mono-code font-bold text-xs text-[#0C1F14] leading-snug">
                    {bill.referenceNo.slice(0, 8)}
                    <br />
                    {bill.referenceNo.slice(9)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyRef('top')}
                    title="Copy reference number"
                    className="p-1 rounded hover:bg-[#EAF3ED] text-[#6A8475] hover:text-[#0C1F14] cursor-pointer"
                  >
                    {copiedRefTop ? (
                      <Check className="w-3.5 h-3.5 text-[#066B33]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* 2. Customer ID */}
              <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-3 flex flex-col justify-between">
                <div className="text-[10px] font-semibold uppercase text-[#6A8475] flex items-center gap-1">
                  <User className="w-3 h-3" />
                  <span>CUSTOMER ID</span>
                </div>
                <div className="font-mono-code font-bold text-xs text-[#0C1F14] mt-2">
                  {bill.customerId}
                </div>
              </div>

              {/* 3. Units Consumed */}
              <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-3 flex flex-col justify-between">
                <div className="text-[10px] font-semibold uppercase text-[#6A8475] flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#066B33]" />
                  <span>UNITS CONSUMED</span>
                </div>
                <div className="font-mono-code font-bold text-xs text-[#0C1F14] mt-2">
                  {bill.unitsConsumed} kWh
                </div>
              </div>

              {/* 4. Issue Date */}
              <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-3 flex flex-col justify-between">
                <div className="text-[10px] font-semibold uppercase text-[#6A8475] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#066B33]" />
                  <span>ISSUE DATE</span>
                </div>
                <div className="font-mono-code font-bold text-xs text-[#0C1F14] mt-2">
                  {bill.issueDate}
                </div>
              </div>

              {/* 5. Reading Date */}
              <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-3 flex flex-col justify-between">
                <div className="text-[10px] font-semibold uppercase text-[#6A8475] flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#066B33]" />
                  <span>READING DATE</span>
                </div>
                <div className="font-mono-code font-bold text-xs text-[#0C1F14] mt-2">
                  {bill.readingDate}
                </div>
              </div>

              {/* 6. Tariff */}
              <div className="rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/60 p-3 flex flex-col justify-between">
                <div className="text-[10px] font-semibold uppercase text-[#6A8475] flex items-center gap-1">
                  <FileText className="w-3 h-3 text-[#066B33]" />
                  <span>TARIFF</span>
                </div>
                <div className="font-mono-code font-bold text-xs text-[#0C1F14] mt-2">
                  {bill.tariff}
                </div>
              </div>
            </div>

            {/* Full-Width Address Bar */}
            <div className="mt-2.5 rounded-xl border border-[#D3E3D8] bg-[#F3F7F4]/50 p-3">
              <div className="text-[10px] font-semibold uppercase text-[#6A8475] flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#066B33]" />
                <span>ADDRESS</span>
              </div>
              <div className="font-semibold text-xs text-[#0C1F14] mt-1">
                {bill.address}
              </div>
            </div>

            {/* 5 Action Pill Buttons Row */}
            <div className="flex flex-wrap items-center gap-2.5 mt-4">
              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#066B33] hover:bg-[#055528] text-white text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>

              <button
                type="button"
                onClick={handleViewFullBillClick}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  isFullBillOpen
                    ? 'bg-[#EAF3ED] border-[#066B33] text-[#066B33]'
                    : 'bg-white border-[#B5CCBD] text-[#0C1F14] hover:bg-[#EAF3ED]'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View full bill</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onToggleSave(bill);
                  triggerToast(
                    isSaved
                      ? 'Removed from My Bills'
                      : `Saved ${bill.discoCode} bill (${bill.referenceNo}) to My Bills`
                  );
                }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
                  isSaved
                    ? 'bg-[#EAF3ED] border-[#066B33] text-[#066B33]'
                    : 'bg-white border-[#B5CCBD] text-[#0C1F14] hover:bg-[#EAF3ED]'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#066B33] text-[#066B33]' : ''}`} />
                <span>{isSaved ? 'Saved in My Bills' : 'Save to My Bills'}</span>
              </button>

              <button
                type="button"
                onClick={handleAddReminder}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#B5CCBD] hover:bg-[#EAF3ED] text-[#0C1F14] text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Add reminder</span>
              </button>

              <button
                type="button"
                onClick={handleShareBill}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#B5CCBD] hover:bg-[#EAF3ED] text-[#0C1F14] text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </section>

        {/* CARD 2: Pay This Bill (Raast QR & Bank App Steps) */}
        <section
          aria-label="Pay this bill instructions"
          className="bg-white rounded-2xl border border-[#D3E3D8] p-5 sm:p-6 shadow-xs"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#066B33]" />
              <h3 className="font-display font-bold text-sm text-[#0C1F14] m-0">
                Pay this bill
              </h3>
            </div>
            <span className="font-display font-bold text-sm text-[#0C1F14] tabular-nums">
              Rs {bill.payableAfterDue.toLocaleString()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left QR Box */}
            <div className="md:col-span-4 flex flex-col items-center">
              <div className="p-3.5 rounded-2xl border border-[#D3E3D8] bg-[#F3F7F4]/50 flex flex-col items-center w-full max-w-[210px]">
                <RaastQrCode
                  id="pay-raast-qr-svg"
                  seedText={`PAY-${bill.discoCode}-${bill.rawReferenceNo}`}
                  size={152}
                />
                <div className="text-[11px] font-bold text-[#0C1F14] mt-2.5 text-center">
                  Scan with any bank app
                </div>
                <div className="text-[10px] text-[#6A8475] text-center">
                  Raast QR from your official bill
                </div>
              </div>

              <button
                type="button"
                onClick={handleSaveQrImage}
                className="mt-2.5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#B5CCBD] bg-white hover:bg-[#EAF3ED] text-[11px] font-semibold text-[#0C1F14] cursor-pointer transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save QR image</span>
              </button>
            </div>

            {/* Right Payment Steps */}
            <div className="md:col-span-8 text-xs text-[#0C1F14] flex flex-col gap-2.5">
              <div className="font-bold text-xs text-[#0C1F14]">
                Pay in JazzCash, Easypaisa or any bank app:
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-bold text-[#19C26B]">1.</span>
                <span>Open the app and tap Bill Payment → Electricity.</span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-bold text-[#19C26B]">2.</span>
                <span>
                  Choose <strong>{bill.discoCode}</strong>.
                </span>
              </div>

              <div>
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-[#19C26B]">3.</span>
                  <span>Paste your reference number:</span>
                </div>
                <div className="mt-2 ml-4 inline-flex items-center gap-2 bg-[#EAF3ED] border border-[#D3E3D8] rounded-full pl-3.5 pr-1.5 py-1">
                  <span className="font-mono-code font-bold text-xs text-[#0C1F14]">
                    {bill.referenceNo}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyRef('pay')}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#066B33] hover:bg-[#055528] text-white text-[11px] font-semibold cursor-pointer transition-colors"
                  >
                    {copiedRefPay ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="font-bold text-[#19C26B]">4.</span>
                <span>Check the amount and confirm.</span>
              </div>

              <div className="mt-2 pt-2 border-t border-[#D3E3D8] flex flex-col gap-1.5 text-[11px] text-[#4B6155]">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-3.5 h-3.5 text-[#19C26B] shrink-0" />
                  <span>
                    Paying from this phone? Save the QR image, then use “Scan from gallery” in your bank app.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>
                    The due date has passed, so the late amount applies. If the QR is refused, pay with the reference number instead.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CARD ROW 3: "Where your money goes" + "Protected status" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-stretch">
          {/* Left Card: Where your money goes */}
          <section
            aria-label="Where your money goes"
            className="bg-white rounded-2xl border border-[#D3E3D8] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#066B33]" />
                  <h3 className="font-display font-bold text-sm text-[#0C1F14] m-0">
                    Where your money goes
                  </h3>
                </div>
                <span className="font-display font-bold text-sm text-[#0C1F14] tabular-nums">
                  Rs {bill.payableWithinDue.toLocaleString()}
                </span>
              </div>

              {/* Stacked Horizontal Bar */}
              <div className="h-2.5 w-full rounded-full overflow-hidden flex gap-0.5 my-4 bg-[#EAF3ED]">
                <div style={{ width: `${pctElec}%`, backgroundColor: '#19C26B' }} />
                <div style={{ width: `${pctFixed}%`, backgroundColor: '#066B33' }} />
                <div style={{ width: `${pctSurcharges}%`, backgroundColor: '#14b8a6' }} />
                <div style={{ width: `${pctTaxes}%`, backgroundColor: '#f59e0b' }} />
                <div style={{ width: `${pctFpa}%`, backgroundColor: '#f97316' }} />
              </div>

              {/* 5 Breakdown Items */}
              <div className="divide-y divide-[#D3E3D8] text-xs">
                <div className="py-2.5 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#19C26B] mt-1 shrink-0" />
                    <div>
                      <div className="font-bold text-[#0C1F14]">Electricity used</div>
                      <div className="text-[11px] text-[#6A8475]">
                        {bill.unitsConsumed} units × Rs {bill.ratePerUnit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-bold text-[#0C1F14]">
                      Rs {bill.electricityUsedCost.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6A8475]">{pctElec}%</div>
                  </div>
                </div>

                <div className="py-2.5 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#066B33] mt-1 shrink-0" />
                    <div>
                      <div className="font-bold text-[#0C1F14]">Fixed charges</div>
                      <div className="text-[11px] text-[#6A8475]">
                        Set by your sanctioned load (kW)
                      </div>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-bold text-[#0C1F14]">
                      Rs {bill.fixedCharges.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6A8475]">{pctFixed}%</div>
                  </div>
                </div>

                <div className="py-2.5 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#14b8a6] mt-1 shrink-0" />
                    <div>
                      <div className="font-bold text-[#0C1F14]">Surcharges</div>
                      <div className="text-[11px] text-[#6A8475]">
                        Financing-cost surcharge and quarterly tariff adjustment
                      </div>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-bold text-[#0C1F14]">
                      Rs {bill.surcharges.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6A8475]">{pctSurcharges}%</div>
                  </div>
                </div>

                <div className="py-2.5 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] mt-1 shrink-0" />
                    <div>
                      <div className="font-bold text-[#0C1F14]">Taxes</div>
                      <div className="text-[11px] text-[#6A8475]">
                        GST, electricity duty and other taxes
                      </div>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-bold text-[#0C1F14]">
                      Rs {bill.taxes.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6A8475]">{pctTaxes}%</div>
                  </div>
                </div>

                <div className="py-2.5 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] mt-1 shrink-0" />
                    <div>
                      <div className="font-bold text-[#0C1F14]">Fuel price adjustment</div>
                      <div className="text-[11px] text-[#6A8475]">
                        Change in fuel cost, with its taxes
                      </div>
                    </div>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="font-bold text-[#0C1F14]">
                      Rs {bill.fpa.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-[#6A8475]">{pctFpa}%</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-[#D3E3D8] flex items-start gap-2 text-[11px] text-[#4B6155]">
              <Info className="w-4 h-4 text-[#19C26B] shrink-0 mt-0.5" />
              <span>
                This month each unit cost you about{' '}
                <strong className="text-[#0C1F14]">Rs {perUnitEffective}</strong>, including taxes and adjustments. A government subsidy of{' '}
                <strong className="text-[#0C1F14]">Rs {bill.subsidy}</strong> is already deducted.
              </span>
            </div>
          </section>

          {/* Right Card: Protected Status */}
          <section
            aria-label="Protected consumer status"
            className="bg-white rounded-2xl border border-[#D3E3D8] p-5 sm:p-6 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#066B33]" />
                  <h3 className="font-display font-bold text-sm text-[#0C1F14] m-0">
                    Protected status
                  </h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                  Unprotected
                </span>
              </div>

              <div className="flex items-center justify-between text-xs mt-4 mb-1.5">
                <span className="text-[#6A8475]">This month</span>
                <span className="font-bold text-[#066B33] tabular-nums">
                  {bill.unitsConsumed} / 200 units
                </span>
              </div>

              {/* 200-unit threshold bar */}
              <div className="relative pt-1 pb-4">
                <div className="h-2.5 w-full rounded-full bg-[#EAF3ED] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#19C26B]"
                    style={{
                      width: `${Math.min(100, Math.round((bill.unitsConsumed / 300) * 100))}%`
                    }}
                  />
                </div>
                {/* 200 marker tick */}
                <div
                  className="absolute top-0 flex flex-col items-center"
                  style={{ left: '66.6%' }}
                >
                  <div className="w-0.5 h-4 bg-[#0C1F14]" />
                  <span className="text-[9px] font-mono-code font-semibold text-[#6A8475] mt-0.5">
                    200
                  </span>
                </div>
              </div>

              {/* 6-Month Pills Grid */}
              <div className="grid grid-cols-6 gap-1.5 mt-2">
                {last6Months.map(item => {
                  const isOver200 = item.units > 200;
                  return (
                    <div
                      key={item.month}
                      className={`rounded-lg py-2 px-1 text-center border ${
                        isOver200
                          ? 'bg-red-50/70 border-red-200/80 text-red-700'
                          : 'bg-[#EAF3ED] border-[#B5CCBD] text-[#066B33]'
                      }`}
                    >
                      <div className="text-[9px] font-semibold uppercase text-[#6A8475]">
                        {item.month}
                      </div>
                      <div className="font-mono-code font-bold text-xs mt-0.5">
                        {item.units}
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-[#0C1F14] mt-4 leading-relaxed m-0">
                Good month! Keep it up: 6 months in a row at 200 units or less makes you a protected consumer with lower rates (you have {protectedMonthsCount} of 6).
              </p>

              <div className="flex items-start gap-2 text-[11px] text-[#4B6155] mt-3">
                <Zap className="w-3.5 h-3.5 text-[#19C26B] shrink-0 mt-0.5" />
                <span>
                  Tip: 200 units a month is about 6½ units a day — check your meter weekly to stay on track.
                </span>
              </div>

              <div className="mt-4">
                <a
                  href="https://pitc.com.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#B5CCBD] bg-white hover:bg-[#EAF3ED] text-[11px] font-semibold text-[#0C1F14] no-underline transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>Check subsidy eligibility (PITC)</span>
                </a>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#D3E3D8] text-[10px] text-[#6A8475]">
              Based on NEPRA’s protected-consumer rule. Your electricity company’s records decide the final status.
            </div>
          </section>
        </div>

        {/* CARD 4: "Your usage, last months" 12-Month Bar Chart */}
        <section
          aria-label="Your usage over the last 12 months"
          className="bg-white rounded-2xl border border-[#D3E3D8] p-5 sm:p-6 shadow-xs"
        >
          <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-[#066B33]" />
              <h3 className="font-display font-bold text-sm text-[#0C1F14] m-0">
                Your usage, last months
              </h3>
            </div>
            <div className="text-[11px] text-[#6A8475]">
              Average {avgUnits} units/month. Latest month is {diffPct}%{' '}
              {isBelowAvg ? 'below' : 'above'} average.
            </div>
          </div>

          <div className="max-w-[640px] mx-auto relative pt-6 pb-2">
            {/* Dashed Average Line */}
            <div
              className="absolute left-0 right-0 border-t border-dashed border-[#19C26B] pointer-events-none z-10"
              style={{
                bottom: `${Math.round((avgUnits / maxUnits) * 140) + 28}px`
              }}
            />

            <div className="grid grid-cols-12 gap-2 sm:gap-3 items-end h-[168px]">
              {bill.usageHistory.map((item, idx) => {
                const isLatest = idx === bill.usageHistory.length - 1;
                const barHeightPx = Math.max(24, Math.round((item.units / maxUnits) * 140));
                return (
                  <div
                    key={item.month}
                    className="flex flex-col items-center justify-end h-full"
                  >
                    <span className="font-mono-code font-bold text-[10px] text-[#0C1F14] mb-1">
                      {item.units}
                    </span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-md rounded-b-sm transition-all ${
                        isLatest ? 'bg-[#066B33]' : 'bg-[#B5CCBD]/80 hover:bg-[#6A8475]'
                      }`}
                      style={{ height: `${barHeightPx}px` }}
                    />
                    <span className="text-[9px] font-semibold uppercase text-[#6A8475] mt-2">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CARD 5: Official bill (PITC) Accordion / Full Bill View (Screenshot 1 & 2) */}
        <section
          ref={officialBillSectionRef}
          aria-label="Official PITC duplicate bill"
          className="bg-white rounded-2xl border border-[#D3E3D8] shadow-xs overflow-hidden"
        >
          <button
            type="button"
            onClick={handleToggleAccordion}
            aria-expanded={isFullBillOpen}
            className="w-full px-5 sm:px-6 py-4 flex items-center justify-between bg-white hover:bg-[#F3F7F4]/60 cursor-pointer transition-colors text-left"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-[#066B33]" />
              <span className="font-display font-bold text-sm text-[#0C1F14]">
                Official bill (PITC)
              </span>
            </div>
            {isFullBillOpen ? (
              <ChevronUp className="w-4 h-4 text-[#4B6155]" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#4B6155]" />
            )}
          </button>

          {isFullBillOpen && (
            <div className="px-5 sm:px-6 pb-6 pt-1 border-t border-[#D3E3D8]">
              {/* Top Action Row inside Official Bill Accordion (matches Screenshot 1) */}
              <div className="flex flex-wrap items-center gap-2.5 my-3">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#066B33] hover:bg-[#055528] text-white text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print</span>
                </button>

                <a
                  href={
                    bill.companyBillUrl ||
                    `https://bill.pitc.com.pk/${bill.discoCode.toLowerCase()}bill/general?refno=${bill.rawReferenceNo}`
                  }
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#B5CCBD] bg-white hover:bg-[#EAF3ED] text-xs font-semibold text-[#0C1F14] no-underline transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open on PITC website</span>
                </a>
              </div>

              {/* Official PITC Bill Sheet */}
              <OfficialPitcBillSheet bill={bill} onPrint={handlePrint} />
            </div>
          )}
        </section>

        {/* Bottom "Check another bill" CTA */}
        <div className="flex justify-center mt-2">
          <button
            type="button"
            onClick={onCheckAnotherBill}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white border border-[#B5CCBD] hover:bg-[#EAF3ED] text-xs font-semibold text-[#0C1F14] shadow-xs cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Check another bill</span>
          </button>
        </div>
      </div>
    </div>
  );
};
