import Link from "next/link";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-zinc-500 mb-12">Last updated: March 02, 2026</p>

        <div className="space-y-12">
          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              1. Information We Collect
            </h2>
            <p className="leading-relaxed mb-4">
              We collect information you provide directly to us when you create an account, update your profile, use the Service, or communicate with us.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li>Registration information: email, password, display name.</li>
              <li>Content: code snippets, chat messages, and room data.</li>
              <li>Subscription data: payment details and billing information.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              2. Use of Information
            </h2>
            <p className="leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-zinc-400">
              <li>Provide, maintain, and improve our Service.</li>
              <li>Process transactions and send related information.</li>
              <li>Send technical notices, updates, security alerts, and support messages.</li>
              <li>Respond to your comments, questions, and requests.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              3. Cookies
            </h2>
            <p className="leading-relaxed">
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain information. Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              4. Data Security
            </h2>
            <p className="leading-relaxed">
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              5. Third-Party Services
            </h2>
            <p className="leading-relaxed">
              We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              6. Your Rights
            </h2>
            <p className="leading-relaxed">
              Depending on your location, you may have certain rights regarding your personal information, including the right to access, correct, or delete the data we have on you. To exercise these rights, please contact us.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
              <span className="w-1.5 h-6 bg-brand-purple rounded-full" />
              7. Contact Us
            </h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at: support@collabcode.inc
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
            <Link href="/terms" className="hover:text-brand-purple transition-all duration-300">Terms</Link>
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
