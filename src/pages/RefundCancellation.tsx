import React from "react";
import LegalPageShell from "../components/LegalPageShell";

const MAPS_URL = "https://maps.app.goo.gl/uS2qsMHdiLBMYtXc7?g_st=awb";

const RefundCancellation: React.FC = () => {
  const toc = [
    { id: "cancellations", label: "1. Cancellations by Users" },
    { id: "eligibility", label: "2. Refund Eligibility" },
    { id: "timeline", label: "3. Refund Timeline" },
    { id: "barter", label: "4. Barter Deals Between Users" },
    { id: "bycompany", label: "5. Cancellation by Barter Adverts" },
    { id: "contact", label: "6. Contact for Refunds & Cancellations" },
  ];

  return (
    <LegalPageShell title="Refund & Cancellation Policy" effectiveDate="20/08/2025" toc={toc} theme="bwLight">
      <p>This Refund &amp; Cancellation Policy applies to all users of Barter Adverts, a brand owned and operated by Allmart Ecommerce LLP.</p>

      <section id="cancellations" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">1. Cancellations by Users</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Users may cancel their subscription, premium listing, or paid promotion request within 24 hours of purchase for a full refund.</li>
          <li>After 24 hours, cancellations will not be eligible for a refund, but services may continue until the end of the billing cycle (for subscriptions).</li>
        </ul>
      </section>

      <section id="eligibility" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">2. Refund Eligibility</h2>
        <p className="mb-2">Refunds are only applicable in the following cases:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>Double payment or duplicate transaction due to a technical error.</li>
          <li>Failure to deliver the paid premium service by Barter Adverts (not user-to-user barter deals).</li>
          <li>Cancellation requested within the defined refund timeline.</li>
        </ul>
        <div className="mt-4">
          <p className="font-semibold">Non-Refundable:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li>Fees paid for completed listings or ads already live.</li>
            <li>Transactional barter deals made between two users (since Barter Adverts is only a facilitator).</li>
          </ul>
        </div>
      </section>

      <section id="timeline" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">3. Refund Timeline</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>Refund requests must be raised to <a className="underline decoration-neutral-400 hover:decoration-neutral-900" href="mailto:support@barteradverts.com">support@barteradverts.com</a> within 7 days of the transaction.</li>
          <li>Once approved, refunds will be processed within 10–14 working days to the original payment method.</li>
          <li>The timeline may vary depending on the payment gateway or bank processing cycle.</li>
        </ul>
      </section>

      <section id="barter" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">4. Barter Deals Between Users</h2>
        <ul className="list-disc ml-6 space-y-2">
          <li>All barter transactions (media exchanges, services, or inventory trades) are final and non-refundable.</li>
          <li>Barter Adverts (Allmart Ecommerce LLP) is not responsible for refunds, cancellations, or disputes in barter deals.</li>
          <li>However, users may raise a complaint through the Dispute Resolution system, and Barter Adverts will facilitate communication between the parties.</li>
        </ul>
      </section>

      <section id="bycompany" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">5. Cancellation by Barter Adverts (Allmart Ecommerce LLP)</h2>
        <p>We reserve the right to cancel or suspend services if:</p>
        <ul className="list-disc ml-6 space-y-2">
          <li>A user violates our Terms &amp; Conditions.</li>
          <li>Fraudulent or unauthorized payment activity is detected.</li>
        </ul>
        <p className="mt-2">In such cases, refunds may not be issued.</p>
      </section>

      <section id="contact" className="scroll-mt-24">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">6. Contact for Refunds &amp; Cancellations</h2>
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
              title="View registered office on Google Maps"
            >
              A-605, Range Height, Link Road, Opp Kajupada, Near Oshiwara Metro Station, Behrambaug, Jogeshwari West, Mumbai 400102, India
            </a>
          </div>
        </div>
      </section>
    </LegalPageShell>
  );
};

export default RefundCancellation;
