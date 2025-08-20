import React from "react";
import LegalPageShell from "../components/LegalPageShell";

const MAPS_URL = "https://maps.app.goo.gl/uS2qsMHdiLBMYtXc7?g_st=awb";

const PrivacyPolicy: React.FC = () => {
  const toc = [
    { id: "collect", label: "1. Information We Collect" },
    { id: "use", label: "2. How We Use Your Information" },
    { id: "share", label: "3. Data Sharing & Disclosure" },
    { id: "retention", label: "4. Data Retention" },
    { id: "cookies", label: "5. Cookies & Tracking" },
    { id: "security", label: "6. Security of Your Information" },
    { id: "rights", label: "7. Your Rights" },
    { id: "links", label: "8. Third-Party Links" },
    { id: "children", label: "9. Children’s Privacy" },
    { id: "changes", label: "10. Changes to This Policy" },
    { id: "contact", label: "11. Contact Us" },
  ];

  return (
    <LegalPageShell title="Privacy Policy" effectiveDate="20/08/2025" toc={toc} theme="bwLight">
      {/* content unchanged except neutral link classes */}
      <p>
        Barter Adverts (“we,” “our,” “us”), a brand owned and operated by Allmart Ecommerce LLP, respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, and safeguard your data when you use our website, mobile application, or services.
      </p>

      <section id="collect" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">1. Information We Collect</h2>
        <p className="mb-2">We may collect the following types of information:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li><span className="font-semibold">Personal Information:</span> Name, email, phone number, company name, billing address, payment details.</li>
          <li><span className="font-semibold">Business Information:</span> Media inventory, advertising preferences, barter deal details.</li>
          <li><span className="font-semibold">Usage Data:</span> IP address, browser type, device information, pages visited, and interaction history.</li>
          <li><span className="font-semibold">Cookies &amp; Tracking:</span> Data collected via cookies, analytics tools, and third-party integrations.</li>
        </ul>
      </section>

      <section id="use" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide and improve our platform services.</li>
          <li>Enable barter transactions and communication between users.</li>
          <li>Process payments for subscriptions, promotions, or premium listings.</li>
          <li>Send updates, offers, and marketing communications (with opt-out option).</li>
          <li>Ensure platform security, fraud detection, and legal compliance.</li>
        </ul>
      </section>

      <section id="share" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">3. Data Sharing &amp; Disclosure</h2>
        <p>We do not sell your personal data. However, we may share information with:</p>
        <ul className="list-disc ml-6 space-y-2 mt-2">
          <li><span className="font-semibold">Other Users:</span> Limited information necessary to complete barter transactions.</li>
          <li><span className="font-semibold">Service Providers:</span> Payment gateways, analytics providers, hosting partners.</li>
          <li><span className="font-semibold">Legal Authorities:</span> If required by law, regulation, or government request.</li>
        </ul>
      </section>

      <section id="retention" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">4. Data Retention</h2>
        <p>We retain your data only for as long as necessary to provide services, comply with legal obligations, or resolve disputes. Users may request account deletion and data removal at any time (see Section 7).</p>
      </section>

      <section id="cookies" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">5. Cookies &amp; Tracking Technologies</h2>
        <p>We use cookies to improve your browsing experience, track user preferences, and enable targeted advertising. You may disable cookies in your browser, but some features of the platform may not function properly.</p>
      </section>

      <section id="security" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">6. Security of Your Information</h2>
        <p>We implement industry-standard security measures (encryption, firewalls, access controls) to protect your data. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.</p>
      </section>

      <section id="rights" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">7. Your Rights</h2>
        <p>As a user, you have the right to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Access, update, or correct your personal information.</li>
          <li>Request deletion of your account and personal data.</li>
          <li>Opt out of marketing communications.</li>
          <li>Request a copy of the personal data we hold about you.</li>
        </ul>
        <p className="mt-2">
          To exercise these rights, contact us at{" "}
          <a className="underline decoration-neutral-400 hover:decoration-neutral-900" href="mailto:support@barteradverts.com">
            support@barteradverts.com
          </a>.
        </p>
      </section>

      <section id="links" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">8. Third-Party Links</h2>
        <p>Our platform may contain links to third-party websites. We are not responsible for the privacy practices or content of external sites.</p>
      </section>

      <section id="children" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">9. Children’s Privacy</h2>
        <p>Barter Adverts is intended for business users. We do not knowingly collect data from children under 18.</p>
      </section>

      <section id="changes" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">10. Changes to This Policy</h2>
        <p>We may update this Privacy Policy from time to time. The revised version will be posted on our website with a new effective date.</p>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">11. Contact Us</h2>
        <div className="space-y-1">
          <div>Allmart Ecommerce LLP</div>
          <div>(Owner of Barter Adverts)</div>
          <div>
            📧{" "}
            <a className="underline decoration-neutral-400 hover:decoration-neutral-900" href="mailto:support@barteradverts.com">
              support@barteradverts.com
            </a>
          </div>
          <div>
            📍{" "}
            <a
              className="underline decoration-neutral-400 hover:decoration-neutral-900"
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
            >
              A-605, Range Height, Link Road, Opp Kajupada, Near Oshiwara Metro Station, Behrambaug, Jogeshwari West, Mumbai 400102, India
            </a>
          </div>
        </div>
      </section>
    </LegalPageShell>
  );
};

export default PrivacyPolicy;
