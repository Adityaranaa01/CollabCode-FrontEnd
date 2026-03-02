import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 font-sans selection:bg-brand-purple/30">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-40 px-6 py-8 flex justify-between items-center bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
        <Link href="/" className="text-xl font-bold tracking-tighter text-white">
          COLLABCODE<span className="text-brand-purple">.</span>
        </Link>
        <Link
          href="/auth?mode=login"
          className="px-5 py-2 rounded-full glass text-sm font-medium hover:bg-white/10 transition-all text-white"
        >
          Log In
        </Link>
      </nav>

      <main className="max-w-4xl mx-auto pt-40 pb-20 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
          Terms of Service
        </h1>
        <p className="text-zinc-500 mb-12">Last updated: March 02, 2026</p>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              1. Acceptance of Terms
            </h2>
            <p className="leading-relaxed">
              By accessing or using CollabCode ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              2. User Accounts
            </h2>
            <p className="leading-relaxed mb-4">
              To access certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
            </p>
            <p className="leading-relaxed">
              You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password. We encourage you to use "strong" passwords with your account. CollabCode cannot and will not be liable for any loss or damage arising from your failure to comply with the above.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              3. Subscription & Billing
            </h2>
            <p className="leading-relaxed">
              Some parts of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              4. Acceptable Use
            </h2>
            <p className="leading-relaxed mb-4">
              You agree not to use the Service for any purpose that is prohibited by these Terms. You are responsible for all of your activity in connection with the Service.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li>No illegal or unauthorized purpose</li>
              <li>No interference with or disruption of the Service</li>
              <li>No attempt to gain unauthorized access to the Service or its related systems</li>
              <li>No transmission of any worms, viruses, or any code of a destructive nature</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              5. Intellectual Property
            </h2>
            <p className="leading-relaxed">
              The Service and its original content (excluding Content provided by users), features, and functionality are and will remain the exclusive property of CollabCode and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of CollabCode.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              6. Limitation of Liability
            </h2>
            <p className="leading-relaxed">
              In no event shall CollabCode, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-xl font-bold tracking-tighter text-white">
            COLLABCODE<span className="text-brand-purple">.</span>
          </div>
          <div className="flex gap-12 text-zinc-500 text-sm font-medium">
            <Link href="/" className="hover:text-brand-purple transition-all duration-300">Home</Link>
            <Link href="/privacy" className="hover:text-brand-purple transition-all duration-300">Privacy</Link>
            <Link href="/auth?mode=signup" className="hover:text-brand-purple transition-all duration-300">Sign Up</Link>
          </div>
          <div className="text-zinc-600 text-[10px] uppercase tracking-[0.2em] font-bold">
            © 2026 CollabCode Inc.
          </div>
        </div>
      </footer>
    </div>
  );
}
