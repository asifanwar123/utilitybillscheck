import React, { useState } from 'react';
import { Printer } from 'lucide-react';
import { BillRecord, DISCO_COMPANIES } from '../data/discoBillsData';
import { DiscoLogoBadge, RaastQrCode } from './DiscoBrandAssets';

interface OfficialPitcBillSheetProps {
  bill: BillRecord;
  onPrint: () => void;
}

export const OfficialPitcBillSheet: React.FC<OfficialPitcBillSheetProps> = ({
  bill,
  onPrint
}) => {
  const [sheetTab, setSheetTab] = useState<'bill' | 'tax'>('bill');
  const [enlargeQr, setEnlargeQr] = useState<boolean>(false);

  const company =
    DISCO_COMPANIES.find(c => c.code === bill.discoCode) || DISCO_COMPANIES[1];

  const totalElectricityCharges =
    bill.electricityUsedCost + bill.fixedCharges + bill.surcharges + bill.subsidy;
  const netElectricityCharges = totalElectricityCharges - bill.subsidy;
  const currentBillBeforeFpa = netElectricityCharges + bill.taxes;

  return (
    <div className="rounded-xl overflow-hidden border border-[#B5CCBD] bg-[#eef2f6] shadow-sm">
      {/* Dark Slate Top Toolbar (Bill | Tax Certificate + Print icon) */}
      <div className="bg-[#343d4b] px-4 py-2.5 flex items-center justify-between">
        <div className="w-8" />
        <div
          className="inline-flex items-center bg-[#252c37] p-1 rounded-lg border border-white/10"
          role="tablist"
          aria-label="Official PITC document view"
        >
          <button
            type="button"
            role="tab"
            aria-selected={sheetTab === 'bill'}
            onClick={() => setSheetTab('bill')}
            className={`px-4 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              sheetTab === 'bill'
                ? 'bg-white text-[#0C1F14] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Bill
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={sheetTab === 'tax'}
            onClick={() => setSheetTab('tax')}
            className={`px-4 py-1 text-xs font-semibold rounded-md cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              sheetTab === 'tax'
                ? 'bg-white text-[#0C1F14] shadow-xs'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Tax Certificate
          </button>
        </div>

        <button
          type="button"
          onClick={onPrint}
          title="Print official PITC bill"
          className="w-8 h-8 rounded-md bg-white text-[#0C1F14] hover:bg-[#EAF3ED] flex items-center justify-center cursor-pointer transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
        </button>
      </div>

      {/* Main White Official PITC Sheet Container */}
      <div className="p-3 sm:p-6 overflow-x-auto">
        {sheetTab === 'bill' ? (
          <div className="min-w-[820px] max-w-[980px] mx-auto bg-white border border-slate-300 rounded-sm p-5 text-[#0C1F14] shadow-xs">
            {/* Official Bill Top Header */}
            <div className="grid grid-cols-12 items-center pb-3 border-b-2 border-slate-300 gap-4">
              {/* Left: DISCO Logo, GST, Website, Anti-Corruption slogan */}
              <div className="col-span-4 flex flex-col">
                <div className="flex items-center gap-2.5">
                  <span className="font-display font-bold text-3xl tracking-tight text-[#066B33]">
                    {company.code}
                  </span>
                  <DiscoLogoBadge code={company.code} size="md" />
                </div>
                <div className="text-[10px] font-semibold text-slate-800 mt-1">
                  {company.code} GST NO: {company.gstNo}
                </div>
                <div className="text-[10px] text-slate-600">{company.website}</div>
                <div className="text-[11px] font-bold text-red-600 mt-0.5">
                  Say No To Corruption
                </div>
              </div>

              {/* Center: Company Full Title */}
              <div className="col-span-4 text-center">
                <div className="font-display font-bold text-[16px] tracking-tight text-slate-900 uppercase">
                  {company.name}
                </div>
                <div className="text-[10px] font-bold tracking-widest text-[#19C26B] uppercase mt-0.5">
                  YOUR BETTER SERVICE - OUR PRIDE
                </div>
                <div className="text-[12px] font-bold text-slate-900 uppercase mt-0.5">
                  ELECTRICITY CONSUMER BILL
                </div>
              </div>

              {/* Right: Raast QR + Urdu Tagline */}
              <div className="col-span-4 flex items-center justify-end gap-3">
                <div className="p-1 border border-slate-300 bg-white">
                  <RaastQrCode seedText={`RAAST-TOP-${bill.rawReferenceNo}`} size={72} />
                </div>
                <div
                  className="text-right font-serif-editorial text-slate-900 leading-snug"
                  dir="rtl"
                >
                  <div className="text-[14px] font-bold">راست اپنائیں۔ QR کوڈ سے ادائیگی</div>
                  <div className="text-[14px] font-bold">کریں۔ انعام پائیں۔</div>
                </div>
              </div>
            </div>

            {/* Body Grid: Left 8 Columns (Consumer, Meter, Breakdown) + Right 4 Columns (Dates, Payable, QR) */}
            <div className="grid grid-cols-12 gap-3 mt-3">
              {/* Left 8 Columns */}
              <div className="col-span-8 flex flex-col gap-3">
                {/* 1. CONSUMER DETAIL */}
                <div className="border border-blue-900/40 rounded-xs overflow-hidden">
                  <div className="bg-[#1e3a8a] text-white px-3 py-1 text-[11px] font-bold tracking-wide flex items-center gap-2">
                    <span>☰ CONSUMER DETAIL</span>
                  </div>
                  <div className="p-2.5 grid grid-cols-12 gap-2 text-[10px] bg-white">
                    {/* Col 1: Reference, Customer ID, Name & Address */}
                    <div className="col-span-4 border-r border-slate-200 pr-2 flex flex-col gap-2">
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>REFERENCE NO</span>
                          <span dir="rtl">حوالہ نمبر</span>
                        </div>
                        <div className="font-mono-code font-bold text-[12px] text-slate-900 mt-0.5">
                          {bill.referenceNo}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>CUSTOMER ID</span>
                          <span dir="rtl">کسٹمر آئی ڈی</span>
                        </div>
                        <div className="font-mono-code font-bold text-[11px] text-slate-900 mt-0.5">
                          {bill.customerId}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>NAME & ADDRESS</span>
                          <span dir="rtl">نام و پتہ</span>
                        </div>
                        <div className="font-bold text-[10px] text-slate-900 mt-0.5 leading-tight">
                          {bill.consumerName}, S/O {bill.fatherName}, {bill.address}
                        </div>
                      </div>
                    </div>

                    {/* Col 2: Transformer, Feeder, Sub Division */}
                    <div className="col-span-3 border-r border-slate-200 pr-2 flex flex-col gap-2">
                      <div>
                        <div className="text-[9px] text-slate-500 font-semibold">TRANSFORMER</div>
                        <div className="font-bold text-[10px] text-slate-900 mt-0.5">
                          {bill.transformer}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>FEEDER</span>
                          <span dir="rtl">فیڈر کا نام</span>
                        </div>
                        <div className="font-bold text-[10px] text-slate-900 mt-0.5">
                          {bill.feeder}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>SUB DIVISION</span>
                          <span dir="rtl">سب ڈویژن</span>
                        </div>
                        <div className="font-bold text-[10px] text-slate-900 mt-0.5">
                          {bill.subDivision}
                        </div>
                      </div>
                    </div>

                    {/* Col 3: Category, Status, Tariff Category */}
                    <div className="col-span-3 border-r border-slate-200 pr-2 flex flex-col gap-2">
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>CATEGORY</span>
                          <span dir="rtl">قسم</span>
                        </div>
                        <div className="font-bold text-[10px] text-slate-900 mt-0.5">
                          {bill.unitsConsumed <= 200 ? 'Unprotected' : 'Unprotected'}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>STATUS</span>
                          <span dir="rtl">حالت میٹر</span>
                        </div>
                        <div className="font-bold text-[10px] text-slate-900 mt-0.5">Regular</div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>TARIFF CATEGORY</span>
                          <span dir="rtl">ٹیرف قسم</span>
                        </div>
                        <div className="font-bold text-[10px] text-slate-900 mt-0.5">Domestic</div>
                      </div>
                    </div>

                    {/* Col 4: San Load, Curr MDI, Tariff */}
                    <div className="col-span-2 flex flex-col gap-2">
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>SAN LOAD</span>
                          <span dir="rtl">لوڈ</span>
                        </div>
                        <div className="font-mono-code font-bold text-[11px] text-slate-900 text-center mt-0.5">
                          {bill.sanctionedLoadKw}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>CURR MDI</span>
                          <span dir="rtl">ایم ڈی آئی</span>
                        </div>
                        <div className="font-mono-code font-bold text-[11px] text-slate-900 text-center mt-0.5">
                          {bill.currMdi}
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                          <span>TARIFF</span>
                          <span dir="rtl">ٹیرف</span>
                        </div>
                        <div className="font-mono-code font-bold text-[10px] text-slate-900 mt-0.5">
                          {bill.tariff}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. METER INFO */}
                <div className="border border-blue-900/40 rounded-xs overflow-hidden">
                  <div className="bg-[#1e3a8a] text-white px-3 py-1 text-[11px] font-bold tracking-wide flex items-center justify-between">
                    <span>⏳ METER INFO</span>
                    <span dir="rtl" className="text-[11px]">میٹر کی تفصیلات</span>
                  </div>
                  <div className="grid grid-cols-5 divide-x divide-slate-200 text-[10px] p-2 bg-white">
                    <div className="px-2">
                      <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                        <span>METER NO</span>
                        <span dir="rtl">میٹر نمبر</span>
                      </div>
                      <div className="font-mono-code font-bold text-[11px] text-slate-900 mt-1">
                        {bill.meterNo}
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                        <span>MF</span>
                        <span dir="rtl">ضرب</span>
                      </div>
                      <div className="font-mono-code font-bold text-[11px] text-slate-900 text-center mt-1">
                        1
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                        <span>PREVIOUS READING</span>
                        <span dir="rtl">سابقہ ریڈنگ</span>
                      </div>
                      <div className="font-mono-code font-bold text-[11px] text-slate-900 text-center mt-1">
                        {bill.previousReading}
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                        <span>PRESENT READING</span>
                        <span dir="rtl">موجودہ ریڈنگ</span>
                      </div>
                      <div className="font-mono-code font-bold text-[11px] text-slate-900 text-center mt-1">
                        {bill.presentReading}
                      </div>
                    </div>
                    <div className="px-2">
                      <div className="flex justify-between text-[9px] text-slate-500 font-semibold">
                        <span>UNITS</span>
                        <span dir="rtl">یونٹ</span>
                      </div>
                      <div className="font-mono-code font-bold text-[11px] text-slate-900 text-center mt-1">
                        {bill.unitsConsumed}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. BILL CHARGES BREAKDOWN (RS.) */}
                <div className="border border-blue-900/40 rounded-xs overflow-hidden">
                  <div className="bg-[#1e3a8a] text-white px-3 py-1 text-[11px] font-bold tracking-wide">
                    BILL CHARGES BREAKDOWN (RS.)
                  </div>
                  <div className="p-2 bg-white">
                    <div className="grid grid-cols-2 gap-4 text-[10px]">
                      {/* Left breakdown column */}
                      <div className="divide-y divide-slate-200 border-r border-slate-200 pr-3">
                        <div className="py-1 flex items-center justify-between">
                          <span>Total Electricity Charges</span>
                          <span className="text-slate-400 text-[9px]" dir="rtl">کل بجلی چارجز</span>
                          <span className="font-mono-code font-bold">{totalElectricityCharges}</span>
                        </div>
                        <div className="py-1 flex items-center justify-between">
                          <span>Subsidies</span>
                          <span className="text-slate-400 text-[9px]" dir="rtl">سبسڈی</span>
                          <span className="font-mono-code font-bold">{bill.subsidy}</span>
                        </div>
                        <div className="py-1 flex items-center justify-between">
                          <span>Net Electricity Charges <strong>83.77 %</strong></span>
                          <span className="text-slate-400 text-[9px]" dir="rtl">نیٹ بجلی چارجز</span>
                          <span className="font-mono-code font-bold">{netElectricityCharges}</span>
                        </div>
                        <div className="py-1 flex items-center justify-between">
                          <span>Taxes <strong>16.23 %</strong></span>
                          <span className="text-slate-400 text-[9px]" dir="rtl">کل ٹیکس</span>
                          <span className="font-mono-code font-bold">{bill.taxes}</span>
                        </div>
                        <div className="py-1.5 flex items-center justify-between bg-slate-100 px-1.5 font-bold">
                          <span>Current Bill</span>
                          <span className="text-slate-500 text-[9px]" dir="rtl">موجودہ بل</span>
                          <span className="font-mono-code">{currentBillBeforeFpa}</span>
                        </div>
                      </div>

                      {/* Right breakdown column */}
                      <div className="divide-y divide-slate-200">
                        <div className="py-1 flex items-center justify-between">
                          <span className="font-semibold">Arrears</span>
                          <span className="text-slate-400 text-[9px]" dir="rtl">بقایاجات</span>
                          <span className="font-mono-code font-bold">0</span>
                        </div>
                        <div className="py-1 flex items-center justify-between">
                          <span className="font-semibold">Installment</span>
                          <span className="text-slate-400 text-[9px]" dir="rtl">قسط</span>
                          <span className="font-mono-code font-bold">0</span>
                        </div>
                        <div className="py-1 flex items-center justify-between">
                          <span className="font-semibold">Adjustments</span>
                          <span className="text-slate-400 text-[9px]" dir="rtl">ایڈجسٹمنٹ</span>
                          <span className="font-mono-code font-bold">0</span>
                        </div>
                        <div className="py-1 flex items-center justify-between">
                          <span className="font-semibold">W.E Credit</span>
                          <span className="font-mono-code font-bold">0</span>
                        </div>
                        <div className="py-1 flex items-center justify-between">
                          <span className="font-semibold">Lock Open Credit</span>
                          <span className="font-mono-code font-bold">0</span>
                        </div>
                        <div className="py-1 flex items-center justify-between font-bold">
                          <span>Total FPA</span>
                          <span className="font-mono-code">{bill.fpa}</span>
                        </div>
                      </div>
                    </div>

                    {/* Grand Total Bar */}
                    <div className="mt-2 pt-2 border-t-2 border-slate-300 flex items-center justify-between px-1 font-bold text-[12px]">
                      <span>Grand Total</span>
                      <div className="flex items-center gap-6">
                        <span className="text-slate-500 text-[10px]" dir="rtl">کل واجب الادا</span>
                        <span className="font-mono-code text-[13px]">{bill.payableWithinDue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urdu Subsidy & FPA Notice Box */}
                <div className="border border-amber-400 bg-amber-50/40 rounded-xs p-2.5 flex items-center justify-between gap-3">
                  <div className="text-right flex-1 leading-relaxed text-[11px] text-slate-800" dir="rtl">
                    <div className="font-bold">
                      آپ کے اس ماہ کے بل میں جولائی کے صرف شدہ یونٹس 202 پر فیول پرائس ایڈجسٹمنٹ (FPA) کے {bill.fpa} روپے بھی شامل ہیں
                    </div>
                    <div className="mt-1 text-[10px] text-slate-700">
                      آپ کے موجودہ بل کے کل واجبات میں حکومت پاکستان کی جانب سے {bill.subsidy} روپے کی سبسڈی دی گئی ہے۔ جملہ معلومات کی تصدیق کے لیے QR کوڈ کو اسکین کریں۔
                    </div>
                  </div>
                  <div className="p-1 bg-white border border-slate-300 shrink-0">
                    <RaastQrCode seedText={`SUBSIDY-${bill.rawReferenceNo}`} size={54} />
                  </div>
                </div>
              </div>

              {/* Right 4 Columns (Bill Month, Dates, Payable Within/After Due Date, PAID Stamp, Large QR) */}
              <div className="col-span-4 flex flex-col gap-2.5">
                {/* Bill Month & Dates Box */}
                <div className="border border-slate-300 bg-slate-50 rounded-xs p-2.5 text-center">
                  <div className="text-[10px] font-bold text-slate-600">
                    BILL MONTH <span dir="rtl">بل کا مہینہ</span>
                  </div>
                  <div className="font-display font-bold text-[16px] text-slate-900">
                    {bill.billMonth}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200 text-[10px]">
                    <div>
                      <div className="text-[9px] text-slate-500 font-semibold">READING DATE</div>
                      <div className="text-[8px] text-slate-400" dir="rtl">تاریخ ریڈنگ</div>
                      <div className="font-mono-code font-bold text-slate-900 mt-0.5">
                        {bill.readingDate}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] text-slate-500 font-semibold">ISSUE DATE</div>
                      <div className="text-[8px] text-slate-400" dir="rtl">تاریخ اجراء</div>
                      <div className="font-mono-code font-bold text-slate-900 mt-0.5">
                        {bill.issueDate}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-slate-200">
                    <div className="text-[9px] font-bold text-slate-600">
                      ▲ DUE DATE <span dir="rtl">مقررہ تاریخ</span>
                    </div>
                    <div className="font-mono-code font-bold text-[13px] text-slate-900">
                      {bill.dueDate}
                    </div>
                  </div>
                </div>

                {/* Payable Within Due Date + Red PAID Stamp */}
                <div className="border border-blue-900/30 bg-[#f5f8ff] rounded-xs p-2.5 relative flex items-center justify-between">
                  <div>
                    <div className="text-[9px] font-bold text-[#1e3a8a] leading-tight">
                      PAYABLE WITHIN<br />DUE DATE
                    </div>
                    <div className="text-[8px] text-slate-500" dir="rtl">مقررہ تاریخ تک واجب الادا</div>
                    <div className="font-mono-code font-bold text-[16px] text-slate-900 mt-1">
                      {bill.payableWithinDue.toLocaleString()}
                    </div>
                  </div>

                  <div className="text-center text-[9px] text-slate-700">
                    <div className="font-semibold">AMOUNT PAID:</div>
                    <div className="font-mono-code font-bold text-[11px]">
                      {bill.payableWithinDue.toLocaleString()}
                    </div>
                    <div className="font-semibold mt-1">PAYMENT DATE:</div>
                    <div className="font-mono-code font-bold">{bill.paidDate}</div>
                  </div>

                  {/* Authentic Circular Red PAID Stamp */}
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-red-600 flex flex-col items-center justify-center text-red-600 rotate-[-8deg] bg-white/80 shrink-0 select-none">
                    <span className="text-[6px] font-bold tracking-tighter uppercase">
                      BILL PAID BY RAAST
                    </span>
                    <span className="text-[12px] font-extrabold tracking-wide border-y border-red-600 px-1 my-0.5">
                      PAID
                    </span>
                    <span className="text-[6px] font-bold uppercase">THANK YOU</span>
                  </div>
                </div>

                {/* L.P. Surcharge Row */}
                <div className="border border-slate-300 bg-slate-50 rounded-xs p-2 grid grid-cols-3 items-center text-center text-[10px]">
                  <div className="text-left">
                    <div className="font-bold text-[9px] text-slate-700">L.P. SURCHARGE</div>
                    <div className="text-[8px] text-slate-500" dir="rtl">تاخیر ادائیگی سرچارج</div>
                  </div>
                  <div className="font-mono-code font-bold text-[12px] text-slate-900">
                    {bill.lpSurcharge1}
                  </div>
                  <div className="font-mono-code font-bold text-[12px] text-slate-900">
                    {bill.lpSurcharge2}
                  </div>
                </div>

                {/* Payable After Due Date Row */}
                <div className="border border-slate-300 bg-slate-50 rounded-xs p-2 grid grid-cols-3 items-center text-center text-[10px]">
                  <div className="text-left">
                    <div className="font-bold text-[9px] text-slate-700 leading-tight">
                      PAYABLE AFTER<br />DUE DATE
                    </div>
                    <div className="text-[8px] text-slate-500" dir="rtl">مقررہ تاریخ کے بعد واجب الادا</div>
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-500 font-semibold">
                      Till {bill.secondDueDate}
                    </div>
                    <div className="font-mono-code font-bold text-[12px] text-slate-900 mt-0.5">
                      {bill.payableAfterDue.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-[8px] text-slate-500 font-semibold">
                      After {bill.secondDueDate}
                    </div>
                    <div className="font-mono-code font-bold text-[12px] text-slate-900 mt-0.5">
                      {bill.payableAfterSecondDue.toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Large Bottom-Right QR Code */}
                <div className="border border-slate-300 bg-white rounded-xs p-3 flex flex-col items-center justify-center flex-1">
                  <button
                    type="button"
                    onClick={() => setEnlargeQr(!enlargeQr)}
                    className="cursor-pointer bg-white p-1 border border-slate-200 rounded-xs hover:border-[#066B33] transition-colors"
                    title="Click to toggle QR size"
                  >
                    <RaastQrCode
                      seedText={`OFFICIAL-PITC-${bill.discoCode}-${bill.rawReferenceNo}`}
                      size={enlargeQr ? 210 : 164}
                    />
                  </button>
                  <div
                    className="mt-2 pt-1.5 border-t border-slate-300 w-full text-center text-[11px] font-bold text-slate-800"
                    dir="rtl"
                  >
                    بل کی تفصیل دیکھنے کے لئے QR کوڈ اسکین کریں
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Tax Certificate View */
          <div className="max-w-[780px] mx-auto bg-white border border-slate-300 rounded-sm p-6 text-[#0C1F14] shadow-xs">
            <div className="flex items-center justify-between border-b pb-4 border-slate-200">
              <div className="flex items-center gap-3">
                <DiscoLogoBadge code={company.code} size="lg" />
                <div>
                  <h4 className="font-display font-bold text-base text-slate-900 m-0 uppercase">
                    {company.name} ({company.code})
                  </h4>
                  <p className="text-xs text-slate-500 m-0">
                    Annual / Monthly Tax Deduction Certificate under Section 235 of Income Tax Ordinance
                  </p>
                </div>
              </div>
              <span className="font-mono-code text-xs font-semibold text-[#066B33]">
                Tax Year 2026
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-4 p-3 bg-[#F3F7F4] rounded-lg border border-[#D3E3D8] text-xs">
              <div>
                <div className="text-slate-500">Reference No.</div>
                <div className="font-mono-code font-bold mt-0.5">{bill.referenceNo}</div>
              </div>
              <div>
                <div className="text-slate-500">Customer ID</div>
                <div className="font-mono-code font-bold mt-0.5">{bill.customerId}</div>
              </div>
              <div>
                <div className="text-slate-500">Consumer Name</div>
                <div className="font-bold mt-0.5">{bill.consumerName}</div>
              </div>
              <div>
                <div className="text-slate-500">Billing Month</div>
                <div className="font-mono-code font-bold mt-0.5">{bill.billMonth}</div>
              </div>
            </div>

            <table className="w-full text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-300 text-left">
                  <th className="py-2 px-3">Tax Head / Statutory Levy</th>
                  <th className="py-2 px-3">Ordinance Section</th>
                  <th className="py-2 px-3 text-right">Amount Deducted (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-2 px-3 font-medium">General Sales Tax (GST @ 18%)</td>
                  <td className="py-2 px-3 text-slate-500">Sales Tax Act 1990</td>
                  <td className="py-2 px-3 text-right font-mono-code font-semibold">
                    Rs {Math.round(bill.taxes * 0.82).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Electricity Duty & PTV License Fee</td>
                  <td className="py-2 px-3 text-slate-500">Provincial Finance Act</td>
                  <td className="py-2 px-3 text-right font-mono-code font-semibold">
                    Rs {Math.round(bill.taxes * 0.18).toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Advance Income Tax (u/s 235)</td>
                  <td className="py-2 px-3 text-slate-500">Income Tax Ordinance 2001</td>
                  <td className="py-2 px-3 text-right font-mono-code font-semibold">Rs 0</td>
                </tr>
                <tr className="bg-slate-50 font-bold">
                  <td className="py-2.5 px-3" colSpan={2}>
                    Total Verified Taxes & Statutory Duties ({bill.billMonth})
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono-code text-[#066B33]">
                    Rs {bill.taxes.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
