import React from "react";
import { Link } from "react-router-dom";
import LegalPageShell from "../components/LegalPageShell";

const MAPS_URL = "https://maps.app.goo.gl/uS2qsMHdiLBMYtXc7?g_st=awb";

const Terms: React.FC = () => {
  const toc = [
    { id: "acceptance", label: "1. Acceptance of Terms" },
    { id: "about", label: "2. About Barter Adverts" },
    { id: "obligations", label: "3. User Obligations" },
    { id: "transactions", label: "4. Transactions & Deals" },
    { id: "fees", label: "5. Fees & Premium Services" },
    { id: "verification", label: "6. Verification & Trust" },
    { id: "ip", label: "7. Intellectual Property" },
    { id: "liability", label: "8. Limitation of Liability" },
    { id: "termination", label: "9. Termination" },
    { id: "law", label: "10. Governing Law & Jurisdiction" },
    { id: "changes", label: "11. Changes to Terms" },
    { id: "contact", label: "12. Contact Us" },
  ];

  return (
    <LegalPageShell title="Terms & Conditions" effectiveDate="20/08/2025" toc={toc} theme="bwLight">
      <p>
        Welcome to Barter Adverts, a platform owned and operated by Allmart Ecommerce LLP (“Company”,
        “we”, “our”, “us”). By accessing or using our website, services, or marketplace, you (“User”,
        “you”, “your”) agree to be bound by the following Terms &amp; Conditions. Please read them carefully.
      </p>

      <section id="acceptance" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">1. Acceptance of Terms</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Are at least 18 years old or a legally registered business.</li>
          <li>Have the authority to represent your company in transactions.</li>
          <li>
            Have read, understood, and agreed to these Terms &amp; Conditions and our{" "}
            <Link to="/privacy-policy" className="underline decoration-neutral-400 hover:decoration-neutral-900">
              Privacy Policy
            </Link>.
          </li>
        </ul>
      </section>

      <section id="about" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">2. About Barter Adverts</h2>
        <p>
          Barter Adverts, operated under Allmart Ecommerce LLP, is a global media barter marketplace that
          enables businesses to exchange advertising spaces, media assets, and marketing services without direct
          cash transactions.
        </p>
        <p className="mt-2">
          We act solely as a facilitator of connections between parties and are not directly involved in the execution of barter deals.
        </p>
      </section>

      <section id="obligations" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">3. User Obligations</h2>
        <p>Users agree to:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Provide accurate and up-to-date information during registration.</li>
          <li>Use the platform strictly for lawful business purposes.</li>
          <li>Not misuse the platform for fraud, false representation, or spamming.</li>
          <li>Ensure that they own the rights and authority to barter the media, inventory, or service they list.</li>
        </ul>
      </section>

      <section id="transactions" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">4. Transactions &amp; Deals</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>All barter deals are negotiated directly between users.</li>
          <li>Barter Adverts (Allmart Ecommerce LLP) does not guarantee pricing, valuation, delivery, or service quality.</li>
          <li>A deal is considered complete only when both parties confirm fulfillment.</li>
          <li>Users are solely responsible for honoring their commitments.</li>
        </ul>
      </section>

      <section id="fees" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">5. Fees &amp; Premium Services</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Basic access to the marketplace may be free.</li>
          <li>Premium listings, promotions, or value-added services may involve fees, which will be communicated clearly before purchase.</li>
          <li>Allmart Ecommerce LLP may introduce transaction/commission-based models in the future with prior notice to users.</li>
        </ul>
      </section>

      <section id="verification" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">6. Verification &amp; Trust</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Users may be required to undergo KYC/verification checks.</li>
          <li>Fraudulent or suspicious accounts may be suspended or permanently removed.</li>
          <li>Barter Adverts may provide rating, review, and dispute support tools but does not guarantee outcomes.</li>
        </ul>
      </section>

      <section id="ip" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">7. Intellectual Property</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>All rights, trademarks, and platform content belong to Allmart Ecommerce LLP.</li>
          <li>Users may not copy, modify, distribute, or use platform content without written consent.</li>
          <li>User-submitted content (logos, ads, creatives) remains their property but grants Barter Adverts the right to display it for platform use.</li>
        </ul>
      </section>

      <section id="liability" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">8. Limitation of Liability</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Barter Adverts (Allmart Ecommerce LLP) is not a party to barter transactions and is not responsible for disputes, defaults, or financial losses.</li>
          <li>We do not guarantee the accuracy, quality, or performance of services exchanged.</li>
          <li>Our liability is limited to the maximum extent permitted under Indian law.</li>
        </ul>
      </section>

      <section id="termination" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">9. Termination</h2>
        <p>We may suspend or terminate accounts without notice if:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>A user breaches these Terms.</li>
          <li>Engages in fraudulent, illegal, or abusive activities.</li>
          <li>Misuses the platform in any way that harms other users or the company.</li>
        </ul>
      </section>

      <section id="law" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">10. Governing Law &amp; Jurisdiction</h2>
        <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, where Allmart Ecommerce LLP is registered.</p>
      </section>

      <section id="changes" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">11. Changes to Terms</h2>
        <p>We may revise these Terms &amp; Conditions at any time. Continued use of the platform after updates constitutes your acceptance of the revised Terms.</p>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">12. Contact Us</h2>
        <address className="not-italic">
          <div>Allmart Ecommerce LLP</div>
          <div>(Owner of Barter Adverts)</div>
          <div>A-605, Range Height, Link Road</div>
          <div>Opp Kajupada, Near Oshiwara Metro Station</div>
          <div>Behrambaug, Jogeshwari West</div>
          <div>Mumbai 400102, India</div>
          <div className="mt-2">
            📧{" "}
            <a href="mailto:support@barteradverts.com" className="underline decoration-neutral-400 hover:decoration-neutral-900">
              support@barteradverts.com
            </a>
          </div>
          <div className="mt-1">
            📍{" "}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-neutral-400 hover:decoration-neutral-900"
              title="View registered office on Google Maps"
            >
              A-605, Range Height, Link Road, Opp Kajupada, Near Oshiwara Metro Station, Behrambaug, Jogeshwari West, Mumbai 400102, India
            </a>
          </div>
        </address>
      </section>
    </LegalPageShell>
  );
};

export default Terms;
