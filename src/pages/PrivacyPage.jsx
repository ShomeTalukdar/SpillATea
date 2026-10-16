import React from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/navigation/Sidebar';
import MobileHeader from '../components/navigation/MobileHeader';
import MobileNav from '../components/navigation/MobileNav';
import { IconBack, IconLock } from '../components/icons/Icons';

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen bg-[#050506] text-[#F5F5F5]">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
        <MobileHeader />

        <main className="flex-1 flex justify-center px-4 sm:px-6 py-8">
          <article className="w-full max-w-2xl flex flex-col gap-6 text-left leading-relaxed">
            <Link
              to="/"
              className="flex items-center gap-2 text-xs font-medium text-[#92929A] hover:text-[#F5F5F5] transition-smooth mb-2"
            >
              <IconBack size={16} />
              <span>Back to Campus Feed</span>
            </Link>

            <div className="flex flex-col gap-1 pb-4 border-b border-white/[0.07]">
              <h1 className="text-2xl font-bold text-[#F5F5F5]">Privacy Policy</h1>
              <p className="text-xs text-[#92929A]">Effective Date: October 2026. Version 2.0</p>
            </div>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">1. Information We Collect</h2>
              <p className="text-xs text-[#A0A0A8]">
                To verify college student status and operate the platform securely, SpillATea collects your institutional email address (e.g., student@college.edu), public display name, account credentials, and timestamped actions such as posted submissions and reaction interactions.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">2. How Anonymous Posting Operates</h2>
              <p className="text-xs text-[#A0A0A8]">
                Public anonymity is strictly maintained across our application layer and database views. When you publish a confession or reply with Anonymous Mode enabled:
              </p>
              <ul className="list-disc pl-5 text-xs text-[#A0A0A8] flex flex-col gap-1">
                <li>Your name, handle, and email address are excluded from all public API queries and frontend payloads.</li>
                <li>Other students and campus peers cannot see or deduce your account identity.</li>
                <li>Your account ID is retained privately within restricted database tables strictly for moderation accountability and conduct enforcement.</li>
              </ul>
              <div className="p-3 bg-[#151518] border border-[#2A2A2F] rounded-lg text-xs text-[#777780]">
                Important clarification: Anonymity is public-facing. In accordance with safety policies, posts are not untraceable to university safety administrators in cases of verified emergency threats, doxxing, or court orders.
              </div>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">3. Administrator Access and Audit Requirements</h2>
              <p className="text-xs text-[#A0A0A8]">
                Platform moderators cannot browse author identities at will. De-anonymization requests require specific authorization tied to an active, severe safety investigation. Every author lookup is permanently recorded in an immutable audit log detailing who performed the lookup, for what reason, and at what timestamp.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">4. Data Retention and Deletion</h2>
              <p className="text-xs text-[#A0A0A8]">
                Students may delete individual posts or request complete account closure at any time. When a post is deleted, its body text and public serial records are expunged from active database feeds. Moderation history logs are archived for a limited period in compliance with campus audit schedules.
              </p>
            </section>

            <section className="flex flex-col gap-2">
              <h2 className="text-base font-semibold text-[#F0F0F2]">5. Contact and Data Inquiries</h2>
              <p className="text-xs text-[#A0A0A8]">
                For questions regarding your data privacy, account deletion, or policy clarifications, please contact the campus privacy liaison or submit a ticket through the student portal.
              </p>
            </section>
          </article>
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
