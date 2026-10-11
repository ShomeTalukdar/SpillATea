import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import { IconBack, BrandWordmark } from '../components/icons/Icons';

export default function TermsPage() {
  return (
    <div className="flex min-h-screen bg-[#0D0D0F] text-[#F0F0F2]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-8">
          <article className="w-full max-w-2xl flex flex-col gap-6 text-left leading-relaxed">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-medium text-[#A0A0A8] hover:text-[#F0F0F2] transition-smooth mb-2"
            >
              <IconBack size={16} />
              <span>Back to Campus Feed</span>
            </Link>

            <div className="flex flex-col gap-1 pb-4 border-b border-[#2A2A2F]">
              <h1 className="text-2xl font-bold text-[#F0F0F2]">Terms of Service</h1>
              <p className="text-xs text-[#777780]">Effective Date: October 2026. Version 1.0</p>
            </div>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">1. Community Purpose and Eligibility</h2>
              <p className="text-xs text-[#A0A0A8]">
                CampusEcho is an anonymous and public digital forum designed exclusively for enrolled college students. By participating in this platform, you affirm that you are an active student and agree to uphold mutual respect, civil discussion, and personal accountability.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">2. Acceptable Use and Community Standards</h2>
              <p className="text-xs text-[#A0A0A8]">
                Students are encouraged to share authentic opinions, confessions, academic advice, and campus questions. You agree not to post content that:
              </p>
              <ul className="list-disc pl-5 text-xs text-[#A0A0A8] flex flex-col gap-1">
                <li>Harasses, bullies, threatens, or demeans any individual student or campus employee.</li>
                <li>Reveals private contact numbers, personal residence addresses, or unredacted confidential records (doxxing).</li>
                <li>Promotes academic dishonesty, such as selling unreleased examination solutions.</li>
                <li>Engages in hate speech targeting protected characteristics.</li>
                <li>Distributes commercial advertisements, unsolicited promotions, or automated spam.</li>
              </ul>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">3. Reporting and Content Moderation</h2>
              <p className="text-xs text-[#A0A0A8]">
                All discussions and comments are subject to automated filtering and human moderator review. Profanity is masked in public feeds to preserve readable discourse without unnecessary censorship. Any user can submit a post or reply for review using the in-app reporting button.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">4. Warning System, Suspensions, and Appeals</h2>
              <p className="text-xs text-[#A0A0A8]">
                To maintain a healthy platform culture, confirmed infractions result in recorded warnings:
              </p>
              <div className="bg-[#151518] border border-[#2A2A2F] p-3.5 rounded-lg text-xs text-[#A0A0A8] flex flex-col gap-1.5">
                <p><strong className="text-[#F0F0F2]">Minor violations:</strong> Formal warning and automatic masking.</p>
                <p><strong className="text-[#F0F0F2]">Repeated infractions:</strong> Account restriction and temporary posting lock.</p>
                <p><strong className="text-[#F0F0F2]">Five confirmed warnings or severe threats:</strong> Three-month platform suspension.</p>
              </div>
              <p className="text-xs text-[#A0A0A8]">
                Students may appeal an action by submitting an inquiry to campus moderators via the designated appeal channel.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">5. Account Termination</h2>
              <p className="text-xs text-[#A0A0A8]">
                CampusEcho administrators reserve the right to suspend or terminate access for any account found in persistent violation of these terms or local university conduct codes.
              </p>
            </section>
          </article>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
