import React, { useState } from 'react';
import {
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Copy,
  Check,
  PhoneCall,
  AlertTriangle,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { DISCO_COMPANIES, DiscoCompany, formatReference14 } from '../data/discoBillsData';
import { DiscoLogoBadge } from './DiscoBrandAssets';

interface ContactUsPageProps {
  onNavigateHome: () => void;
  onSelectDisco: (code: DiscoCompany['code']) => void;
}

export const ContactUsPage: React.FC<ContactUsPageProps> = ({
  onNavigateHome,
  onSelectDisco
}) => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [selectedDisco, setSelectedDisco] = useState<string>('General Inquiry');
  const [referenceNo, setReferenceNo] = useState<string>('');
  const [topic, setTopic] = useState<string>('Help finding reference number');
  const [message, setMessage] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<{
    ticketId: string;
    name: string;
    email: string;
    disco: string;
    topic: string;
  } | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<boolean>(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@bijlipk.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 1800);
  };

  const handleRefInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '').slice(0, 14);
    setReferenceNo(formatReference14(digits));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) {
      setFormError('Please fill in your name, email address, and message before submitting.');
      return;
    }
    setFormError(null);
    const randomId = `BPK-${Math.floor(100000 + Math.random() * 900000)}`;
    setSubmittedTicket({
      ticketId: randomId,
      name: fullName.trim(),
      email: email.trim(),
      disco: selectedDisco,
      topic
    });
  };

  const handleResetForm = () => {
    setFullName('');
    setEmail('');
    setSelectedDisco('General Inquiry');
    setReferenceNo('');
    setTopic('Help finding reference number');
    setMessage('');
    setSubmittedTicket(null);
    setFormError(null);
  };

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
            <span className="text-white font-semibold">Contact Us</span>
          </nav>

          <h1 className="font-display font-bold text-2xl sm:text-4xl text-white mt-2 m-0">
            Contact Us
          </h1>
          <p className="text-xs sm:text-sm text-[#CFE3D6] mt-2.5 max-w-[64ch] leading-relaxed m-0">
            Need help finding your 14-digit reference number, printing a duplicate bill, or reporting a technical issue on BijliPK? Reach out to our team below.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[980px] mx-auto px-4 sm:px-6 mt-8 flex flex-col gap-6">
        {/* Top Two-Column Grid: Contact Info on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left Column (5 cols): Direct Contact Channels */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Email Support Card */}
            <div className="bg-white rounded-2xl border border-[#D3E3D8] p-5 shadow-xs">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF3ED] text-[#066B33] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#6A8475]">
                      EMAIL SUPPORT
                    </div>
                    <a
                      href="mailto:support@bijlipk.com"
                      className="font-display font-bold text-sm text-[#0C1F14] hover:text-[#066B33] no-underline"
                    >
                      support@bijlipk.com
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EAF3ED] hover:bg-[#D3E3D8] text-[11px] font-semibold text-[#066B33] cursor-pointer transition-colors"
                >
                  {copiedEmail ? (
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
              <p className="text-xs text-[#4B6155] mt-3 mb-0 leading-relaxed">
                We respond to all website support and duplicate bill inquiries within 1 business day.
              </p>
            </div>

            {/* Office & Operating Hours Card */}
            <div className="bg-white rounded-2xl border border-[#D3E3D8] p-5 shadow-xs space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF3ED] text-[#066B33] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6A8475]">
                    OFFICE LOCATION
                  </div>
                  <div className="font-display font-bold text-sm text-[#0C1F14] mt-0.5">
                    Karachi, Pakistan
                  </div>
                  <div className="text-xs text-[#4B6155] mt-0.5">
                    Digital Utility Platform Operations
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#D3E3D8] flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF3ED] text-[#066B33] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6A8475]">
                    SUPPORT HOURS (PKT)
                  </div>
                  <div className="font-semibold text-xs text-[#0C1F14] mt-1">
                    Monday – Friday: 09:00 am – 09:00 pm
                  </div>
                  <div className="text-xs text-[#6A8475] mt-0.5">
                    Saturday – Sunday: Closed (Online bill checker runs 24/7)
                  </div>
                </div>
              </div>
            </div>

            {/* Power Outage / Meter Fault Advisory Card */}
            <div className="rounded-2xl bg-amber-50/90 border border-amber-200 p-5">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-display font-bold text-xs text-amber-950 m-0">
                    Reporting a power outage or meter fault?
                  </h3>
                  <p className="text-xs text-amber-900/90 mt-1.5 leading-relaxed m-0">
                    BijliPK is an online bill checking service and cannot dispatch linemen or alter official meter readings. For power outages, transformer faults, or billing disputes, dial <strong>118</strong> or text your 14-digit reference number to <strong>8118</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Interactive Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-[#D3E3D8] p-6 sm:p-7 shadow-xs flex flex-col justify-between">
            {submittedTicket ? (
              <div className="py-6 text-center max-w-[440px] mx-auto my-auto">
                <div className="w-12 h-12 rounded-full bg-[#EAF3ED] text-[#066B33] flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-[10px] font-mono-code font-bold uppercase tracking-wider text-[#066B33]">
                  TICKET #{submittedTicket.ticketId} RECEIVED
                </div>
                <h2 className="font-display font-bold text-xl text-[#0C1F14] mt-1 m-0">
                  Thank you, {submittedTicket.name}
                </h2>
                <p className="text-xs text-[#4B6155] leading-relaxed mt-2.5">
                  We have received your message regarding <strong>{submittedTicket.topic}</strong> ({submittedTicket.disco}) and sent a confirmation to <strong>{submittedTicket.email}</strong>. Our support team will reply shortly.
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="px-4 py-2 rounded-full border border-[#B5CCBD] bg-white hover:bg-[#EAF3ED] text-xs font-semibold text-[#0C1F14] cursor-pointer transition-colors"
                  >
                    Send another message
                  </button>
                  <button
                    type="button"
                    onClick={onNavigateHome}
                    className="px-4 py-2 rounded-full bg-[#066B33] hover:bg-[#055528] text-white text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Back to Bill Checker
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
                    SEND A MESSAGE
                  </div>
                  <h2 className="font-display font-bold text-xl text-[#0C1F14] mt-0.5 m-0">
                    How can we help you today?
                  </h2>
                </div>

                {formError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-700">
                    {formError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-name"
                      className="block text-xs font-semibold text-[#0C1F14] mb-1.5"
                    >
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Anwar Ali"
                      className="w-full rounded-xl border border-[#B5CCBD] bg-white px-3.5 py-2.5 text-xs text-[#0C1F14] placeholder-slate-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      className="block text-xs font-semibold text-[#0C1F14] mb-1.5"
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. anwar@example.com"
                      className="w-full rounded-xl border border-[#B5CCBD] bg-white px-3.5 py-2.5 text-xs text-[#0C1F14] placeholder-slate-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="contact-disco"
                      className="block text-xs font-semibold text-[#0C1F14] mb-1.5"
                    >
                      Electricity Company (DISCO)
                    </label>
                    <select
                      id="contact-disco"
                      value={selectedDisco}
                      onChange={e => setSelectedDisco(e.target.value)}
                      className="w-full rounded-xl border border-[#B5CCBD] bg-white px-3.5 py-2.5 text-xs text-[#0C1F14]"
                    >
                      <option value="General Inquiry">General Inquiry / All DISCOs</option>
                      {DISCO_COMPANIES.map(d => (
                        <option key={d.code} value={d.code}>
                          {d.code} — {d.shortCity}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-ref"
                      className="block text-xs font-semibold text-[#0C1F14] mb-1.5"
                    >
                      14-Digit Reference No. <span className="text-[#6A8475] font-normal">(Optional)</span>
                    </label>
                    <input
                      id="contact-ref"
                      type="text"
                      inputMode="numeric"
                      value={referenceNo}
                      onChange={handleRefInput}
                      placeholder="e.g. 07 15429 1113202"
                      className="w-full rounded-xl border border-[#B5CCBD] bg-white px-3.5 py-2.5 text-xs font-mono-code text-[#0C1F14] placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="contact-topic"
                    className="block text-xs font-semibold text-[#0C1F14] mb-1.5"
                  >
                    Topic
                  </label>
                  <select
                    id="contact-topic"
                    value={topic}
                    onChange={e => setTopic(e.target.value)}
                    className="w-full rounded-xl border border-[#B5CCBD] bg-white px-3.5 py-2.5 text-xs text-[#0C1F14]"
                  >
                    <option value="Help finding reference number">Help finding my 14-digit reference number</option>
                    <option value="Bill display or printing issue">Duplicate bill display or PDF printing issue</option>
                    <option value="Protected status calculation question">200-unit protected status question</option>
                    <option value="Raast QR payment question">Raast QR / bank app payment question</option>
                    <option value="Feedback or feature request">Website feedback or feature request</option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-xs font-semibold text-[#0C1F14] mb-1.5"
                  >
                    Message *
                  </label>
                  <textarea
                    id="contact-message"
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Tell us how we can help you..."
                    className="w-full rounded-xl border border-[#B5CCBD] bg-white px-3.5 py-2.5 text-xs text-[#0C1F14] placeholder-slate-400"
                  />
                </div>

                <div className="pt-1 flex items-center justify-between gap-4">
                  <span className="text-[11px] text-[#6A8475]">
                    We never share your email with third parties.
                  </span>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#066B33] hover:bg-[#055528] text-white text-xs font-semibold cursor-pointer transition-colors whitespace-nowrap shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Section: Official DISCO Helpline & Website Directory */}
        <section className="bg-white rounded-2xl border border-[#D3E3D8] p-6 sm:p-8 shadow-xs">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase text-[#066B33]">
                OFFICIAL UTILITY HELPLINES
              </div>
              <h2 className="font-display font-bold text-xl text-[#0C1F14] mt-1 m-0">
                Official DISCO complaint numbers & portals
              </h2>
              <p className="text-xs text-[#4B6155] mt-1 m-0">
                For transformer faults, unscheduled load-shedding, or official bill corrections, contact your regional electricity company directly:
              </p>
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EAF3ED] text-[#066B33] text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              <span>National Power Helpline: 118 / SMS: 8118</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#D3E3D8] bg-[#F3F7F4] text-[#4B6155]">
                  <th className="py-2.5 px-3 font-semibold">Company</th>
                  <th className="py-2.5 px-3 font-semibold">Coverage Cities</th>
                  <th className="py-2.5 px-3 font-semibold">Helpline</th>
                  <th className="py-2.5 px-3 font-semibold">Official Portal</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Online Bill</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D3E3D8]">
                {DISCO_COMPANIES.map(disco => (
                  <tr key={disco.code} className="hover:bg-[#F3F7F4]/60">
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <DiscoLogoBadge code={disco.code} size="sm" />
                        <div>
                          <div className="font-display font-bold text-xs text-[#0C1F14]">
                            {disco.code}
                          </div>
                          <div className="text-[10px] text-[#6A8475]">{disco.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#4B6155]">{disco.citiesList}</td>
                    <td className="py-2.5 px-3 font-mono-code font-semibold text-[#0C1F14]">
                      118 / SMS 8118
                    </td>
                    <td className="py-2.5 px-3">
                      <a
                        href={`https://${disco.website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[#066B33] font-semibold hover:underline no-underline"
                      >
                        <span>{disco.website}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => onSelectDisco(disco.code)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#EAF3ED] hover:bg-[#066B33] text-[#066B33] hover:text-white text-[11px] font-semibold cursor-pointer transition-colors"
                      >
                        <span>Check Bill</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
};
