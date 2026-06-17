import { LEGAL_CONTACTS } from './legalContacts';
import {
  ShieldAlert,
  Scale,
  CreditCard,
  XCircle,
  Users,
  AlertTriangle,
  Cookie,
  Award,
  HelpCircle
} from 'lucide-react';

export interface PolicySection {
  num: number;
  title: string;
  content: string;
}

export interface LegalPolicy {
  id: string;
  title: string;
  slug: string;
  summary: string;
  icon: any;
  version: string;
  effectiveDate: string;
  lastUpdated: string;
  sections: PolicySection[];
  importantNotices?: string[];
  relatedPolicies: { label: string; slug: string }[];
}

export const LEGAL_POLICIES: LegalPolicy[] = [
  {
    id: 'privacy-policy',
    title: 'Beduine Tour & Travels Privacy Policy',
    slug: 'privacy-policy',
    summary: 'Explains what information we collect, why we collect it, how it is used, when it may be shared, and your rights.',
    icon: ShieldAlert,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
      { label: 'Cookie Policy', slug: 'cookie-policy' },
      { label: 'Grievance Redressal', slug: 'grievance-redressal' }
    ],
    importantNotices: [
      'We do not sell, rent, or trade your personal data to third parties for marketing purposes.',
      'We collect sensitive government documents (only when legally required) with strict security, and we never store complete card details on our servers.',
      'Account deletion does not remove information that we are legally required to retain for tax, accounting, or anti-fraud regulatory compliance.'
    ],
    sections: [
      {
        num: 1,
        title: 'Introduction and Scope',
        content: `At ${LEGAL_CONTACTS.tradingName}, we respect your privacy and are committed to handling personal information responsibly, transparently, and securely. This Privacy Policy explains what information we collect, why we collect it, how it is used, when it may be shared, how long it may be retained, and the choices available to users. This policy applies to all users of our website, subscription memberships, travel bookings, and related services.`
      },
      {
        num: 2,
        title: 'Company and Data-Controller Details',
        content: `The data controller responsible for your personal information is ${LEGAL_CONTACTS.legalCompanyName} (operating as "${LEGAL_CONTACTS.tradingName}"), located at registered address: ${LEGAL_CONTACTS.registeredOfficeAddress}. If you have questions about your data privacy or want to exercise your rights, contact us at ${LEGAL_CONTACTS.privacyEmail}.`
      },
      {
        num: 3,
        title: 'Information Provided Directly by Users',
        content: `We collect information you provide directly to us when creating an account, buying a membership, making a booking, or contacting customer support. This may include: Full Name, mobile number, email address, date of birth, billing address, profile photograph, traveler profiles, and correspondence history.`
      },
      {
        num: 4,
        title: 'Information Collected Automatically',
        content: `When you visit our website, we automatically log certain usage and device details. This includes your IP address, browser type, device information, operating system, referrer URL, pages visited, click activity, and date/time stamps.`
      },
      {
        num: 5,
        title: 'Information Received from Third Parties',
        content: `We may receive information about you from partners or third-party services, such as payment gateways, identity verification providers, airlines, hotels, or social media connections when you link accounts.`
      },
      {
        num: 6,
        title: 'Purposes for Processing Information',
        content: `We process your data to deliver services, manage memberships, process transactions, facilitate travel bookings, provide customer support, verify identity, prevent fraud, comply with laws, and send updates or marketing communications with your consent.`
      },
      {
        num: 7,
        title: 'User Consent and Communication Preferences',
        content: `We separate marketing consent from transactional or service communications. You can choose whether to receive marketing materials, and you can change your preferences or opt out at any time through your account settings or email links.`
      },
      {
        num: 8,
        title: 'Payment and Financial Information',
        content: `Payments are handled by secure external payment gateways (such as ${LEGAL_CONTACTS.paymentGatewayNames}). We do not store complete card details on our servers. We only store transaction reference IDs, plans purchased, and billing metadata for accounting and compliance.`
      },
      {
        num: 9,
        title: 'Identity-Verification Information',
        content: `For verification and regulatory compliance (KYC), we may collect government ID details (e.g. Passport, Aadhaar, PAN) only where legally required. These sensitive documents are securely stored and deleted once verification is complete, unless laws require retention.`
      },
      {
        num: 10,
        title: 'Travel Preferences and Booking Details',
        content: `To process and complete bookings, we collect travel preferences, passenger and guest details, destination preferences, dietary requirements, and special accommodations requested.`
      },
      {
        num: 11,
        title: 'Device, Browser, IP Address, Cookies, and Usage Information',
        content: `We use cookies and tracking tools to monitor system performance, remember user settings, analyze traffic, and personalize your experience. Details on managing these settings can be found in our Cookie Policy.`
      },
      {
        num: 12,
        title: 'Marketing Communications',
        content: `With your explicit permission, we may send you offers and news about our travel products. These are optional, and you can withdraw marketing consent at any time.`
      },
      {
        num: 13,
        title: 'WhatsApp, SMS, Telephone, Push, and Email Notifications',
        content: `We send updates through WhatsApp, SMS, phone calls, and email. Service notices (booking confirmations, security alerts, draw results) are sent automatically. Optional marketing alerts require your active consent.`
      },
      {
        num: 14,
        title: 'Service Providers and Third-Party Disclosures',
        content: `We share data with trusted service providers who perform work for us (such as hosting, analytics, and messaging). These providers are contractually required to protect your information and cannot use it for other purposes.`
      },
      {
        num: 15,
        title: 'Payment Gateways',
        content: `Transactions are processed via external gateways. Your financial information is collected directly by the gateway and is subject to their privacy policies.`
      },
      {
        num: 16,
        title: 'Hotels, Airlines, Transport Providers, and Tour Operators',
        content: `When you request a travel booking, we share passenger details with the chosen hotels, airlines, and local tour operators to reserve your travel. Their handling of your data is governed by their respective policies.`
      },
      {
        num: 17,
        title: 'Legal and Regulatory Disclosures',
        content: `We may disclose your personal data if required by law, court order, or government authority, or when we believe disclosure is necessary to protect our rights, safety, or prevent fraud.`
      },
      {
        num: 18,
        title: 'Business Restructuring or Transfer',
        content: `If our business is involved in a merger, sale of assets, or restructuring, customer databases containing personal information may be transferred as part of the transaction.`
      },
      {
        num: 19,
        title: 'International or Cross-Border Processing',
        content: `For international travel bookings, your data may be transferred to and processed in destinations outside your home country. By making a booking, you acknowledge this international transfer.`
      },
      {
        num: 20,
        title: 'Data Security Measures',
        content: `We use industry-standard technical and organizational security measures to protect your data from unauthorized access, loss, alteration, or disclosure. This includes encryption, firewalls, and access control.`
      },
      {
        num: 21,
        title: 'Data Retention',
        content: `We retain your personal data for as long as necessary to fulfill the services, or for a period of up to ${LEGAL_CONTACTS.dataRetentionPeriod} as required to comply with financial, tax, and legal record-keeping obligations.`
      },
      {
        num: 22,
        title: 'User Rights and Requests',
        content: `You have the right to request access to your personal data, ask for corrections, object to processing, request deletion, or ask for a copy of your data. Requests can be submitted via our Privacy Request Form.`
      },
      {
        num: 23,
        title: 'Correction and Updating of Personal Information',
        content: `You can update your account details directly through the dashboard or by contacting us. We will make reasonable efforts to keep your information accurate.`
      },
      {
        num: 24,
        title: 'Consent Withdrawal',
        content: `You may withdraw your consent for optional data processing (such as marketing) at any time. This will not affect the lawfulness of processing based on consent before its withdrawal.`
      },
      {
        num: 25,
        title: 'Account Deletion',
        content: `You can request account deletion at any time. When deleted, we remove all personal data that we are not legally required to retain for regulatory, tax, or fraud-prevention compliance.`
      },
      {
        num: 26,
        title: 'Marketing Opt-Out',
        content: `To stop receiving marketing emails, click the "unsubscribe" link at the bottom of our emails. For SMS/WhatsApp, reply with "STOP" or update your account preferences.`
      },
      {
        num: 27,
        title: 'Children and Age Restrictions',
        content: `Our subscription memberships and promotional programs are restricted to individuals aged 18 years and above. We do not knowingly collect personal data from minors without parent or guardian consent for travel bookings.`
      },
      {
        num: 28,
        title: 'Cookies and Tracking Technologies',
        content: `We use cookies to enhance website performance, remember settings, and analyze traffic. You can configure cookie consents at any time using our Cookie Settings.`
      },
      {
        num: 29,
        title: 'External Links',
        content: `Our website may contain links to external sites not operated by us. We are not responsible for the privacy practices of external websites.`
      },
      {
        num: 30,
        title: 'Data-Breach Response',
        content: `In the event of a security breach involving your personal data, we will notify you and relevant regulators in accordance with applicable laws.`
      },
      {
        num: 31,
        title: 'Policy Changes',
        content: `We may update this Privacy Policy from time to time. Material changes will be communicated via website notices or email, and the "Last Updated" date will reflect the revision.`
      },
      {
        num: 32,
        title: 'Grievance and Contact Information',
        content: `If you have privacy concerns or complaints, contact our Grievance Officer at ${LEGAL_CONTACTS.grievanceOfficerEmail} or send mail to: ${LEGAL_CONTACTS.grievanceOfficerAddress}.`
      }
    ]
  },
  {
    id: 'terms-and-conditions',
    title: 'Beduine Tour & Travels Website and Membership Terms',
    slug: 'terms-and-conditions',
    summary: 'Governs website use, subscription memberships, booking requests, and promotional draw rules.',
    icon: Scale,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Privacy Policy', slug: 'privacy-policy' },
      { label: 'Membership Rules', slug: 'membership-rules' },
      { label: 'Website Disclaimer', slug: 'website-disclaimer' }
    ],
    importantNotices: [
      'Purchasing a subscription membership does not guarantee selection, rewards, or travel.',
      'Subscription memberships are promotional in nature, are not investments, and do not yield financial returns.',
      'Discount Credits have no independent cash value and cannot be redeemed for cash or transferred.'
    ],
    sections: [
      {
        num: 1,
        title: 'Acceptance of Terms',
        content: `By accessing this website, purchasing a subscription, or using our services, you agree to be bound by these Website and Membership Terms, along with all applicable policies.`
      },
      {
        num: 2,
        title: 'Company Details',
        content: `This website is operated by ${LEGAL_CONTACTS.legalCompanyName} under trading name "${LEGAL_CONTACTS.tradingName}" (GST: ${LEGAL_CONTACTS.gstNumber}), with its registered office located at ${LEGAL_CONTACTS.registeredOfficeAddress}.`
      },
      {
        num: 3,
        title: 'Eligibility and Minimum Age',
        content: `To purchase a subscription membership or participate in our programs, you must be an individual of at least 18 years of age and hold the legal capacity to enter contract agreements.`
      },
      {
        num: 4,
        title: 'Account Registration',
        content: `Users must register an account to access subscription plans and member benefits. You agree to safeguard your credentials and remain responsible for all activities under your account.`
      },
      {
        num: 5,
        title: 'Accurate Information Requirement',
        content: `You represent that all details provided (name, email, phone, verification documents) are accurate and complete. Providing false details violates these terms.`
      },
      {
        num: 6,
        title: 'Account Security',
        content: `Notify us immediately if you suspect unauthorized access. We are not liable for losses caused by unauthorized access to your account.`
      },
      {
        num: 7,
        title: 'Membership Plans',
        content: `We offer Silver, Gold, and Platinum subscriptions. Details of plan costs, destinations, and promotional benefits are listed on the website.`
      },
      {
        num: 8,
        title: 'Membership Activation',
        content: `Subscriptions activate only upon successful payment verification and validation of registration information.`
      },
      {
        num: 9,
        title: 'Twelve-Month Validity',
        content: `Unless specified otherwise in writing, memberships remain valid for a period of 12 (Twelve) months from the date of activation.`
      },
      {
        num: 10,
        title: 'Subscription Fees',
        content: `Subscription fees are displayed on the website. We reserve the right to modify pricing, but changes will not affect active memberships.`
      },
      {
        num: 11,
        title: 'Payment Authorization',
        content: `By purchasing, you authorize us to charge the selected payment method for the full membership fee.`
      },
      {
        num: 12,
        title: 'Taxes and Payment-Gateway Charges',
        content: `Subscription fees include applicable GST and taxes unless stated otherwise. Payment gateway processing charges are non-refundable.`
      },
      {
        num: 13,
        title: 'Membership Benefits',
        content: `Members receive non-cash benefits: Discount Credits (DCs), eligibility for promotional draws, and special rates on paid tour bookings.`
      },
      {
        num: 14,
        title: 'Discount Credits',
        content: `Discount Credits provide member-only discounts on paid tours. Credits are non-cashable, non-transferable, and expire with the membership.`
      },
      {
        num: 15,
        title: 'Promotional Rewards',
        content: `We conduct promotional programs providing travel benefits. These rewards are non-cashable, subject to itinerary limits, and cannot be traded.`
      },
      {
        num: 16,
        title: 'Lucky-Draw Participation Disclaimer',
        content: `The promotional draw is an optional membership incentive. The draw uses a digital Random Number Generator (RNG) for fair selection.`
      },
      {
        num: 17,
        title: 'No Guaranteed Selection or Benefit',
        content: `Purchasing a membership does NOT guarantee selection in any promotional reward or lucky-draw. Membership is not an investment for profit.`
      },
      {
        num: 18,
        title: 'Travel Booking Requests',
        content: `Members may request booking services for flights, trains, hotels, and custom packages. All requests depend on third-party availability.`
      },
      {
        num: 19,
        title: 'Booking Confirmation',
        content: `Booking requests are not confirmed until payment is processed and a booking confirmation voucher is issued.`
      },
      {
        num: 20,
        title: 'Availability and Price Changes',
        content: `Travel pricing and availability change dynamically. Displayed rates are estimates until final confirmation.`
      },
      {
        num: 21,
        title: 'Third-Party Travel Providers',
        content: `Travel services are supplied by third-party hotels, airlines, and transport agencies. You agree to abide by their separate terms.`
      },
      {
        num: 22,
        title: 'Passport, Visa, Health, and Travel-Document Responsibility',
        content: `Travelers must obtain valid visas, passports (minimum 6 months validity), and health certifications. We are not liable for boarding rejections.`
      },
      {
        num: 23,
        title: 'Refund and Cancellation References',
        content: `All refunds and cancellations for paid bookings and memberships are strictly governed by our Refund Policy and Cancellation Policy.`
      },
      {
        num: 24,
        title: 'Promotional Communications',
        content: `By creating an account, you consent to receive service notices. Optional marketing offers require separate permission.`
      },
      {
        num: 25,
        title: 'Website Acceptable Use',
        content: `You agree to use this website only for lawful travel searches, registration, and bookings. You will not disrupt website security.`
      },
      {
        num: 26,
        title: 'Prohibited Activity',
        content: `You may not crawl our site, scrape content, upload malicious code, or engage in activity that degrades user access.`
      },
      {
        num: 27,
        title: 'Fraud and Duplicate Accounts',
        content: `Users are prohibited from creating duplicate accounts to exploit promotional credits. Suspected accounts will be terminated.`
      },
      {
        num: 28,
        title: 'Suspension and Termination',
        content: `We reserve the right to suspend accounts engaged in fraud, payment disputes, or breach of terms, following reasonable notice.`
      },
      {
        num: 29,
        title: 'Intellectual Property',
        content: `All design systems, trademarks, copy, images, code, and logos are owned by us or licensed, and cannot be used without consent.`
      },
      {
        num: 30,
        title: 'Website Content',
        content: `Content on the website (including destination photographs) is for illustrative purposes. Actual services and standards may vary.`
      },
      {
        num: 31,
        title: 'External Links',
        content: `We are not responsible for the content, privacy, or security of external websites linked on our platform.`
      },
      {
        num: 32,
        title: 'Service Availability',
        content: `We aim to keep the website active but are not liable for downtime caused by technical issues or maintenance.`
      },
      {
        num: 33,
        title: 'Limitation of Liability',
        content: `We are not liable for indirect, incidental, or consequential losses, or any third-party failures during travel.`
      },
      {
        num: 34,
        title: 'User Indemnity',
        content: `You agree to indemnify us against claims, liabilities, or expenses arising from your violation of these terms or misuse of services.`
      },
      {
        num: 35,
        title: 'Force Majeure',
        content: `We are not liable for failures or booking cancellations caused by weather, war, pandemics, or government restrictions.`
      },
      {
        num: 36,
        title: 'Changes to Services',
        content: `We may modify membership layouts or benefits for operational, safety, or legal reasons. Contractual benefits will not be unreasonably removed.`
      },
      {
        num: 37,
        title: 'Policy Updates',
        content: `Terms may be updated periodically. Material updates will be communicated on our website, and continued use constitutes acceptance.`
      },
      {
        num: 38,
        title: 'Governing Law',
        content: `These terms are governed by the laws of India. Any legal dispute shall be subject to courts in ${LEGAL_CONTACTS.courtJurisdiction}.`
      },
      {
        num: 39,
        title: 'Dispute Resolution',
        content: `Before filing a formal claim, you agree to submit disputes to our Grievance Officer to seek amicable settlement.`
      },
      {
        num: 40,
        title: 'Grievance Contact Information',
        content: `Send formal legal notices or grievances to: ${LEGAL_CONTACTS.grievanceOfficerName}, Email: ${LEGAL_CONTACTS.grievanceOfficerEmail}.`
      }
    ]
  },
  {
    id: 'refund-policy',
    title: 'Beduine Tour & Travels Refund Policy',
    slug: 'refund-policy',
    summary: 'Details our refund conditions for subscription memberships, duplicate payments, and tour bookings.',
    icon: CreditCard,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
      { label: 'Cancellation Policy', slug: 'cancellation-policy' }
    ],
    importantNotices: [
      `Approved refunds are generally processed within ${LEGAL_CONTACTS.refundProcessingPeriod} business days. Banks and payment providers may require additional time.`,
      'Subscription fees are non-refundable after membership activation.',
      'Unused Discount Credits or lucky draw benefits cannot be converted to cash.'
    ],
    sections: [
      {
        num: 1,
        title: 'Policy Scope',
        content: `This policy outlines the guidelines and procedures for refund requests regarding subscription membership fees, booking deposits, and paid tour packages.`
      },
      {
        num: 2,
        title: 'Subscription-Fee Policy',
        content: `Fees paid for subscription memberships (Silver, Gold, Platinum) are promotional purchase fees and are strictly non-refundable once membership is active.`
      },
      {
        num: 3,
        title: 'Activation Status',
        content: `A membership is considered active as soon as credentials are sent and benefits are credited. No refunds are provided for active accounts.`
      },
      {
        num: 4,
        title: 'Non-Refundable Membership Fees',
        content: `Subscribers acknowledge that membership benefits, including discount credits and draw entry rights, are immediately provisioned, making the purchase non-refundable.`
      },
      {
        num: 5,
        title: 'Cooling-Off or Statutory Rights',
        content: `If cooling-off periods apply under local consumer regulations in ${LEGAL_CONTACTS.operatingJurisdiction}, refund requests will be reviewed according to those laws.`
      },
      {
        num: 6,
        title: 'Duplicate Payments',
        content: `If a system error causes duplicate charges for a single membership, we will verify the transactions and refund the duplicate payment.`
      },
      {
        num: 7,
        title: 'Failed but Debited Transactions',
        content: `If payment is debited but registration fails, the gateway usually reverses this automatically. If not, contact us with payment receipts.`
      },
      {
        num: 8,
        title: 'Unauthorized Transactions',
        content: `In cases of unauthorized card use, contact your bank. We will assist authorities with transaction logs but do not directly issue card refunds.`
      },
      {
        num: 9,
        title: 'Paid Tour-Booking Refunds',
        content: `Refunds for paid customized tours are governed by supplier cancellation policies (hotels, airlines). Final refund amounts depend on these third parties.`
      },
      {
        num: 10,
        title: 'Provider Cancellation Charges',
        content: `Airlines and rail lines charge cancellation fees. These external deductions are subtracted from any traveler refund.`
      },
      {
        num: 11,
        title: 'Hotel and Transportation Deductions',
        content: `Hotels and car operators charge no-show or late cancellation fees. These are passed on to the customer and deducted from refunds.`
      },
      {
        num: 12,
        title: 'Company-Cancelled Tours',
        content: `If we cancel a tour due to operational, safety, or logistical reasons, we will offer alternative dates, travel credit, or a refund of the amount paid.`
      },
      {
        num: 13,
        title: 'Travel-Credit Alternatives',
        content: `In lieu of a cash refund, travelers can opt for travel vouchers or credits valid for 12 months toward any future booking.`
      },
      {
        num: 14,
        title: 'Refund Method',
        content: `Refunds are processed back to the original payment source (bank account, card, wallet) used during the transaction.`
      },
      {
        num: 15,
        title: 'Refund-Processing Period',
        content: `Approved refunds are generally processed within ${LEGAL_CONTACTS.refundProcessingPeriod} business days. Banks and payment providers may require additional time.`
      },
      {
        num: 16,
        title: 'Bank and Payment-Gateway Delays',
        content: `Once we release a refund, it may take 5 to 7 additional bank days to credit, depending on your bank's processing cycles.`
      },
      {
        num: 17,
        title: 'Currency-Conversion Charges',
        content: `For international transactions, currency conversion fluctuations and card charges are absorbed by the buyer and not refunded.`
      },
      {
        num: 18,
        title: 'Non-Cashable Membership Benefits',
        content: `Membership benefits, including RNG selection rewards, have no cash equivalent and cannot be exchanged for currency.`
      },
      {
        num: 19,
        title: 'Discount Credits',
        content: `Unused discount credits cannot be converted to cash or refunded upon subscription expiry.`
      },
      {
        num: 20,
        title: 'Promotional Rewards',
        content: `Selected promotional tour rewards are non-cashable and forfeit if the selected winner fails to travel.`
      },
      {
        num: 21,
        title: 'Disputes and Supporting Documents',
        content: `To request a refund, submit a request via our Refund Request Form including transaction details and bank statement copies.`
      },
      {
        num: 22,
        title: 'Refund Contact Process',
        content: `Send all inquiries about pending refunds to ${LEGAL_CONTACTS.supportEmail} or call us at ${LEGAL_CONTACTS.supportPhone}.`
      }
    ]
  },
  {
    id: 'cancellation-policy',
    title: 'Beduine Tour & Travels Cancellation Policy',
    slug: 'cancellation-policy',
    summary: 'Outlines cancellation guidelines, supplier fees, name changes, and force majeure events.',
    icon: XCircle,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Refund Policy', slug: 'refund-policy' },
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' }
    ],
    importantNotices: [
      'Cancellation terms for specific tour packages vary; always check the package terms before payment.',
      'Auto-renewing memberships (if activated) can be cancelled at any time to prevent the next cycle charge.'
    ],
    sections: [
      {
        num: 1,
        title: 'Subscription Cancellation',
        content: `Members can cancel their membership. Because subscription fees are non-refundable, cancellation prevents renewal but does not result in a refund.`
      },
      {
        num: 2,
        title: 'Effect of Membership Cancellation',
        content: `Upon cancellation, your membership remains active until its 12-month expiry, allowing access to benefits until that date.`
      },
      {
        num: 3,
        title: 'Access Until Validity Expiry',
        content: `Your profile, active discount credits, and draw eligibility remain active for the remaining months of your term even after cancelling auto-renewal.`
      },
      {
        num: 4,
        title: 'Auto-Renewal Cancellation',
        content: `If your membership is set to auto-renew, you can toggle renewal off in account settings. This must be done 48 hours before the billing date.`
      },
      {
        num: 5,
        title: 'Promotional Reward Cancellation',
        content: `If you are selected for a promotional tour benefit, you must confirm travel details within 15 days or request a name change if permitted.`
      },
      {
        num: 6,
        title: 'Winner Confirmation Period',
        content: `If a selected member fails to confirm participation within 15 days of announcement, the reward is cancelled.`
      },
      {
        num: 7,
        title: 'Failure to Respond',
        content: `Failure to respond to selection invitations results in cancellation of the draw reward, which will not be re-issued.`
      },
      {
        num: 8,
        title: 'Voluntary Cancellation After Confirmation',
        content: `If you confirm a selected reward tour and subsequently cancel, the reward is forfeited and cannot be rescheduled or converted.`
      },
      {
        num: 9,
        title: 'Paid Tour Cancellation',
        content: `Paid bookings are subject to cancellation charges. Cancellation terms depend on when the request is made relative to departure.`
      },
      {
        num: 10,
        title: 'Cancellation Slabs',
        content: `Standard cancellation charges (unless booking terms state otherwise):
• More than [X] days before departure: [CHARGE]
• Between [X] and [Y] days: [CHARGE]
• Fewer than [X] days: [CHARGE]
• No-show: [CHARGE]`
      },
      {
        num: 11,
        title: 'Supplier Deductions',
        content: `Airlines, cruise lines, and railways charge separate cancellation fees. These third-party deductions are added to our cancellation charges.`
      },
      {
        num: 12,
        title: 'Hotel Cancellation',
        content: `Hotel bookings are subject to cancellation windows. Non-refundable rooms receive no refund in the event of cancellation.`
      },
      {
        num: 13,
        title: 'Airline or Transport Cancellation',
        content: `Airlines cancel tickets based on fare rules. Promo fares are often completely non-refundable and non-changeable.`
      },
      {
        num: 14,
        title: 'No-Show Policy',
        content: `If you do not show up for a flight, train, or hotel check-in, the booking is classified as a no-show and receives zero refund.`
      },
      {
        num: 15,
        title: 'Partial Cancellation',
        content: `If one traveler in a group cancels, the booking will be updated. Additional room charges (single supplement) may apply to remaining travelers.`
      },
      {
        num: 16,
        title: 'Guest-Name Change',
        content: `Name changes on bookings are subject to airline and hotel approvals. Gold and Platinum memberships allow certain family name changes.`
      },
      {
        num: 17,
        title: 'Rescheduling',
        content: `Rescheduling requests are subject to price differences and supplier fees. Requests must be sent at least 7 days before travel.`
      },
      {
        num: 18,
        title: 'Company Cancellation',
        content: `We reserve the right to cancel bookings if minimum passenger counts are not met, or if travel is deemed unsafe.`
      },
      {
        num: 19,
        title: 'Destination Substitution',
        content: `In operational emergencies, we may offer a comparable destination. Travelers can accept the substitution or request rescheduling.`
      },
      {
        num: 20,
        title: 'Force Majeure',
        content: `We are not liable for cancellations caused by events beyond control, including natural disasters, weather, wars, or strikes.`
      },
      {
        num: 21,
        title: 'Government Restrictions',
        content: `Cancellations forced by travel bans, closed borders, or government travel warnings are subject to supplier refund limits.`
      },
      {
        num: 22,
        title: 'Weather-Related Disruption',
        content: `Flight or tour delays caused by weather (cyclones, heavy snow) will be rescheduled. We are not liable for additional meal or lodging costs.`
      },
      {
        num: 23,
        title: 'Natural Disasters',
        content: `In cases of earthquakes, floods, or volcanic eruptions, safety comes first. We will cancel active tours and issue credits.`
      },
      {
        num: 24,
        title: 'Political Unrest',
        content: `Tours in areas experiencing sudden riots or civil conflict will be suspended, and alternative itineraries will be provided.`
      },
      {
        num: 25,
        title: 'Pandemics and Health Emergencies',
        content: `Cancellations due to pandemics or quarantine restrictions are processed in line with government mandates and supplier credits.`
      },
      {
        num: 26,
        title: 'Safety Concerns',
        content: `We prioritize traveler safety. If our local operators flag safety risks, we reserve the right to cancel tours.`
      },
      {
        num: 27,
        title: 'Refund or Credit Process',
        content: `Refunds resulting from cancellation are calculated after deductions and processed back to your payment account.`
      },
      {
        num: 28,
        title: 'Cancellation Request Procedure',
        content: `To cancel a booking, log in to your dashboard and submit a request, or email ${LEGAL_CONTACTS.supportEmail} with booking IDs.`
      }
    ]
  },
  {
    id: 'membership-rules',
    title: 'Beduine Tour & Travels Membership Rules',
    slug: 'membership-rules',
    summary: 'Details eligibility, validity, discount credits rules, and member obligations.',
    icon: Users,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
      { label: 'Refund Policy', slug: 'refund-policy' }
    ],
    importantNotices: [
      'Purchasing or renewing a membership does not guarantee selection in any promotional reward or lucky-draw process.',
      'Members are limited to one active subscription account. Duplicate profiles are subject to suspension.'
    ],
    sections: [
      {
        num: 1,
        title: 'Eligibility',
        content: `Subscriptions are open to individuals. Corporates or agents cannot buy individual plans for resale.`
      },
      {
        num: 2,
        title: 'Minimum Age of 18 Years',
        content: `You must be at least 18 years of age to purchase a membership. Minor travel bookings require parent supervision.`
      },
      {
        num: 3,
        title: 'Identity and Account Verification',
        content: `We verify member profiles. You may be asked to provide proof of identity (such as a driving license or voter ID) for verification.`
      },
      {
        num: 4,
        title: 'One Account Per Person',
        content: `Members are limited to one account. Creating multiple profiles to abuse discount codes will result in account suspension.`
      },
      {
        num: 5,
        title: 'Membership Activation',
        content: `Your subscription and benefits are activated as soon as payment is confirmed by the gateway.`
      },
      {
        num: 6,
        title: 'Twelve-Month Membership Validity',
        content: `Memberships are valid for 12 months from activation. Unused discount credits expire at the end of the term.`
      },
      {
        num: 7,
        title: 'Renewal',
        content: `Memberships can be renewed during the final month of the term to maintain active status and keep booking discounts.`
      },
      {
        num: 8,
        title: 'Active Membership Requirements',
        content: `You must keep your account active to access member-only rates, promotional draws, and customer support.`
      },
      {
        num: 9,
        title: 'Membership Benefits',
        content: `Benefits include Discount Credits (DCs), eligibility for monthly/weekly selection rewards, and special booking rates.`
      },
      {
        num: 10,
        title: 'Discount Credits',
        content: `Discount Credits offer flat deductions on travel packages. DCs have no cash value and are non-refundable.`
      },
      {
        num: 11,
        title: 'Promotional Rewards',
        content: `Members are entered into promotional draws. Winners receive specified tour packages matching their plan tier.`
      },
      {
        num: 12,
        title: 'Lucky-Draw Participation Requirements',
        content: `Only members with active accounts during the draw date are eligible for random selection.`
      },
      {
        num: 13,
        title: 'Selection Does Not Guarantee All Travel Expenses',
        content: `Promotional rewards cover specific tour itineraries, hotel stays, and guides. Flight fares, visas, and shopping are paid by the traveler unless specified.`
      },
      {
        num: 14,
        title: 'Winner-Verification Requirements',
        content: `Before tour booking, selected winners must submit valid identity verification to confirm membership ownership.`
      },
      {
        num: 15,
        title: 'Confirmation Deadline',
        content: `Selected winners must confirm travel dates and details within 15 days of notice, or the reward is forfeited.`
      },
      {
        num: 16,
        title: 'Travel Availability',
        content: `Promotional tours operate on specific dates and block-out periods (festivals, peak seasons) determined by the company.`
      },
      {
        num: 17,
        title: 'Benefit Limitations',
        content: `Members can receive only one promotional tour reward per active 12-month subscription term.`
      },
      {
        num: 18,
        title: 'Non-Transferability',
        content: `Memberships and credits are non-transferable. Gold and Platinum plans allow family name changes under specified conditions.`
      },
      {
        num: 19,
        title: 'Non-Cashability',
        content: `Discount Credits and promotional draws cannot be traded or redeemed for cash under any circumstances.`
      },
      {
        num: 20,
        title: 'Credit Expiry',
        content: `Unused Discount Credits automatically expire when the 12-month membership validity ends and do not roll over.`
      },
      {
        num: 21,
        title: 'Account Accuracy',
        content: `Members must maintain accurate profile data. We are not responsible for booking failures caused by incorrect details.`
      },
      {
        num: 22,
        title: 'Prohibited Misuse',
        content: `Members must not share account credentials, resell discount codes, or scrape listings from our website.`
      },
      {
        num: 23,
        title: 'False Information',
        content: `Providing false names or fabricated documents during registration violates rules and results in termination.`
      },
      {
        num: 24,
        title: 'Duplicate Accounts',
        content: `Creating duplicate profiles to secure additional discount codes violates our policies and results in closures.`
      },
      {
        num: 25,
        title: 'Fraudulent Activity',
        content: `Any account linked to chargeback fraud, fake payment records, or database manipulation will be closed immediately.`
      },
      {
        num: 26,
        title: 'Unauthorized Resale',
        content: `Members must not sell or trade booking slots. Doing so results in booking cancellations and account closure.`
      },
      {
        num: 27,
        title: 'Suspension',
        content: `We may suspend accounts under investigation for terms violations. Suspended accounts lose access to draws and credits.`
      },
      {
        num: 28,
        title: 'Termination',
        content: `Violations of membership guidelines will result in permanent account termination. Terminated accounts forfeit all credits.`
      },
      {
        num: 29,
        title: 'Appeal or Complaint Procedure',
        content: `If your membership is suspended or closed, you can appeal by writing to our Grievance Officer within 14 days.`
      },
      {
        num: 30,
        title: 'Changes to Membership Rules',
        content: `We may modify membership rules to align with regulation updates. We will notify active members of changes.`
      },
      {
        num: 31,
        title: 'Communication of Material Changes',
        content: `Material changes to subscription structures will be posted on the website homepage and emailed to subscribers.`
      },
      {
        num: 32,
        title: 'Contact Information',
        content: `For questions about membership levels, email ${LEGAL_CONTACTS.supportEmail} or call ${LEGAL_CONTACTS.supportPhone}.`
      }
    ]
  },
  {
    id: 'website-disclaimer',
    title: 'Beduine Tour & Travels Website Disclaimer',
    slug: 'website-disclaimer',
    summary: 'Explains limits of liability, information accuracy, and third-party supplier responsibilities.',
    icon: AlertTriangle,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
      { label: 'Grievance Redressal', slug: 'grievance-redressal' }
    ],
    importantNotices: [
      'We do not guarantee selection in any promotional reward draws.',
      'Actual hotels and itineraries may vary from photographs due to updates or availability.'
    ],
    sections: [
      {
        num: 1,
        title: 'General Information',
        content: `The information on this website is provided for general guidance and informational purposes. While we try to keep information accurate, we make no representations of any kind about completeness.`
      },
      {
        num: 2,
        title: 'Travel Membership Program',
        content: `${LEGAL_CONTACTS.tradingName} operates a travel membership and promotional reward program. Membership provides access to discounts and draw eligibility.`
      },
      {
        num: 3,
        title: 'Promotional Reward Disclaimer',
        content: `Promotional draws use a digital Random Number Generator (RNG). Draw schedules and counts are operational and can be modified.`
      },
      {
        num: 4,
        title: 'No Guarantee of Selection',
        content: `Purchasing a membership does NOT guarantee selection in any promotional draw. Selection is random.`
      },
      {
        num: 5,
        title: 'Destination Availability',
        content: `Tours and destinations listed depend on local conditions, availability, and supplier operations, and may change.`
      },
      {
        num: 6,
        title: 'Price and Schedule Changes',
        content: `Flight fares, train schedules, hotel rates, and tour packages vary. Quotes are estimates until booking confirmation.`
      },
      {
        num: 7,
        title: 'Third-Party Suppliers',
        content: `We arrange travel services through independent hotels, airlines, and transport operators. These suppliers are not our agents.`
      },
      {
        num: 8,
        title: 'Hotel and Transport Standards',
        content: `Hotel star ratings and vehicle conditions are based on local standards in the destination country, and may vary.`
      },
      {
        num: 9,
        title: 'Travel-Document Responsibility',
        content: `Travelers are responsible for securing passports with at least 6 months validity, valid visas, and entry approvals.`
      },
      {
        num: 10,
        title: 'Visa and Immigration Responsibility',
        content: `Visa approvals are decided by the respective embassy. We are not liable for visa rejections or immigration delays.`
      },
      {
        num: 11,
        title: 'Health and Vaccination Responsibility',
        content: `Travelers must verify destination health protocols, vaccinations, and negative test requirements before departure.`
      },
      {
        num: 12,
        title: 'Travel Insurance Recommendation',
        content: `We recommend all travelers purchase travel insurance covering cancellations, medical emergencies, and lost luggage.`
      },
      {
        num: 13,
        title: 'Weather and Safety Conditions',
        content: `We monitor weather and local safety. We are not liable for delays, rerouting, or cancellations caused by safety advisories.`
      },
      {
        num: 14,
        title: 'Accuracy of Photographs',
        content: `Destination images are illustrative. Actual hotels, rooms, vehicles, and scenery may differ from pictures.`
      },
      {
        num: 15,
        title: 'Website Availability',
        content: `We try to ensure uninterrupted website access. We are not liable for temporary downtime due to maintenance or hosting issues.`
      },
      {
        num: 16,
        title: 'Technical Interruptions',
        content: `We are not liable for transaction errors caused by internet disruptions, payment gateway issues, or bank outages.`
      },
      {
        num: 17,
        title: 'External Websites',
        content: `Our website may link to external websites. We do not endorse or assume liability for the content of linked sites.`
      },
      {
        num: 18,
        title: 'User-Generated Information',
        content: `Reviews, testimonials, and forum posts are written by users and do not represent our official views.`
      },
      {
        num: 19,
        title: 'Force Majeure',
        content: `We are not liable for travel disruptions caused by strikes, civil unrest, war, floods, cyclones, epidemics, or government shutdowns.`
      },
      {
        num: 20,
        title: 'Limitation of Liability',
        content: `Under no circumstances will we be liable for direct, indirect, or consequential damages arising from website use or travel bookings.`
      },
      {
        num: 21,
        title: 'Policy Acceptance',
        content: `By using this website, you acknowledge that you have read and agreed to all disclaimers, terms, and policies.`
      },
      {
        num: 22,
        title: 'Contact Details',
        content: `For clarification on these terms, contact us at ${LEGAL_CONTACTS.supportEmail} or write to our office address.`
      }
    ]
  },
  {
    id: 'cookie-policy',
    title: 'Beduine Tour & Travels Cookie Policy',
    slug: 'cookie-policy',
    summary: 'Details how we use cookies, tracking pixels, and how you can manage your preferences.',
    icon: Cookie,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Privacy Policy', slug: 'privacy-policy' },
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' }
    ],
    importantNotices: [
      `Optional cookies are disabled by default. You can manage or update your cookie consent settings at any time in the footer.`,
      `Cookies help us store your search history to recommend travel packages and personalize your experience.`
    ],
    sections: [
      {
        num: 1,
        title: 'What Cookies Are',
        content: `Cookies are small text files stored on your device when you visit websites. They help websites recognize your browser, remember preferences, and log usage statistics.`
      },
      {
        num: 2,
        title: 'Why the Website Uses Cookies',
        content: `We use cookies to keep you logged in, secure transactions, understand site traffic, compile analytics, and deliver travel recommendations.`
      },
      {
        num: 3,
        title: 'Essential Cookies',
        content: `These cookies are required to run the site (e.g. security tokens, login sessions). Disabling them in your browser will break site functionality.`
      },
      {
        num: 4,
        title: 'Security and Authentication Cookies',
        content: `These cookies verify users, prevent fraud, and secure transactions while processing membership activations.`
      },
      {
        num: 5,
        title: 'Preference Cookies',
        content: `These cookies remember settings like your preferred language (Hindi, Bengali, English) or search filters.`
      },
      {
        num: 6,
        title: 'Analytics Cookies',
        content: `These cookies collect anonymous, aggregated data about how visitors interact with the site, helping us identify and fix bugs.`
      },
      {
        num: 7,
        title: 'Performance Cookies',
        content: `These cookies measure page load speeds and database queries to help us optimize site performance.`
      },
      {
        num: 8,
        title: 'Advertising or Marketing Cookies',
        content: `These cookies track your browsing history to display relevant travel offers on search engines and social media networks.`
      },
      {
        num: 9,
        title: 'Third-Party Cookies',
        content: `We use third-party services like Google Analytics and payment processors that set their own cookies to enable their features.`
      },
      {
        num: 10,
        title: 'Cookie Duration',
        content: `Cookies are classified as either session cookies (deleted when the browser closes) or persistent cookies (which remain on your device).`
      },
      {
        num: 11,
        title: 'Session and Persistent Cookies',
        content: `Session cookies keep you logged in during a single visit. Persistent cookies remain for up to ${LEGAL_CONTACTS.cookieRetentionPeriod} to remember settings for your next visit.`
      },
      {
        num: 12,
        title: 'Consent Management',
        content: `When you first visit, our Cookie Consent Banner asks you to choose which cookie categories you want to allow. Optional cookies are disabled by default.`
      },
      {
        num: 13,
        title: 'Rejecting Optional Cookies',
        content: `You can reject optional cookies. Rejcting optional cookies will not block access to our website or booking services.`
      },
      {
        num: 14,
        title: 'Withdrawing Consent',
        content: `You can update your choices at any time by clicking the "Cookie Settings" link in the footer of any page.`
      },
      {
        num: 15,
        title: 'Browser Controls',
        content: `Most web browsers allow you to block or delete cookies through browser settings. Check your browser's help menu for details.`
      },
      {
        num: 16,
        title: 'Effect of Disabling Cookies',
        content: `If you block all cookies, key parts of our site (such as registration and payment flows) may not work.`
      },
      {
        num: 17,
        title: 'Do Not Track or Similar Browser Signals',
        content: `We respect Do Not Track (DNT) signals where supported, and do not place marketing cookies when a DNT signal is present.`
      },
      {
        num: 18,
        title: 'Cookie-List Updates',
        content: `We update our cookie list as we add new tools. We recommend checking this policy periodically for updates.`
      },
      {
        num: 19,
        title: 'Contact Information',
        content: `For questions about our cookie usage, email ${LEGAL_CONTACTS.privacyEmail} or contact our data protection officer.`
      }
    ]
  },
  {
    id: 'affiliate-agent-policy',
    title: 'Beduine Tour & Travels Affiliate and Agent Partner Policy',
    slug: 'affiliate-agent-policy',
    summary: 'Governs our marketing partners, commission attribution rules, and brand representation guidelines.',
    icon: Award,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
      { label: 'Privacy Policy', slug: 'privacy-policy' }
    ],
    importantNotices: [
      'Affiliates and Agents are independent contractors; they are not employees and have no authority to bind the company.',
      'Affiliates must display our mandatory disclosure statement clearly on all marketing material.',
      'Making guaranteed income claims or promising lucky draw wins is strictly prohibited and results in immediate termination.'
    ],
    sections: [
      {
        num: 1,
        title: 'Purpose and Scope',
        content: `This policy outlines the guidelines and requirements for affiliates, sales agents, and marketing partners promoting our memberships and tour packages.`
      },
      {
        num: 2,
        title: 'Partner Eligibility',
        content: `Applicants must be at least 18 years old and hold a valid tax registration (GST/PAN) to be eligible for commissions.`
      },
      {
        num: 3,
        title: 'Application and Approval',
        content: `Partnership applications are reviewed by our team. We reserve the right to approve or reject any application for any reason.`
      },
      {
        num: 4,
        title: 'Independent-Contractor Relationship',
        content: `Partners are independent contractors. This agreement does not create a partnership, joint venture, agency, franchise, or employment relationship.`
      },
      {
        num: 5,
        title: 'No Employment Relationship',
        content: `Partners are not employees of the company. You cannot claim company benefits, health insurance, or represent yourself as an employee.`
      },
      {
        num: 6,
        title: 'No Authority to Bind the Company',
        content: `Partners cannot sign contracts, offer custom refunds, make pricing promises, or issue guarantees on behalf of the company.`
      },
      {
        num: 7,
        title: 'Approved Promotional Materials',
        content: `Partners must use only company-approved banner graphics, logos, and descriptions. Custom branding requires written approval.`
      },
      {
        num: 8,
        title: 'Brand and Trademark Use',
        content: `You are granted a non-exclusive, revocable license to use our brand marks solely for referring customers. Misuse of trademark assets is prohibited.`
      },
      {
        num: 9,
        title: 'Accurate Representation',
        content: `Partners must describe our travel subscriptions accurately, outlining both membership features and the random nature of promotional draws.`
      },
      {
        num: 10,
        title: 'Mandatory Affiliate Disclosure',
        content: `Partners must clearly disclose their referral relationship on their promotional pages. Standard disclaimer: "I may receive a commission when an eligible membership or booking is completed through my referral. This does not increase the customer’s price unless clearly stated."`
      },
      {
        num: 11,
        title: 'Prohibited Claims',
        content: `Partners must not claim that membership guarantees lucky draw wins, or promise specific financial returns.`
      },
      {
        num: 12,
        title: 'No Guaranteed Rewards or Income Claims',
        content: `Marketing materials must not present the travel membership as a lottery, investment, passive income, or guaranteed travel scheme.`
      },
      {
        num: 13,
        title: 'Prohibition on Misleading Advertisements',
        content: `Partners must not create misleading ads, use fake countdown timers, or make false scarcity claims to pressure customers.`
      },
      {
        num: 14,
        title: 'Prohibition on Impersonation',
        content: `Partners must not create social profiles or domains that mimic official company pages or mislead customers into thinking they are interacting with official support.`
      },
      {
        num: 15,
        title: 'Prohibition on Collecting Unauthorized Payments',
        content: `Partners must never collect cash or card payments directly from customers. All transactions must be completed on the official website.`
      },
      {
        num: 16,
        title: 'Customer-Data Protection',
        content: `Partners must never collect customer passwords, OTPs, or government IDs. All user registration details must be entered by the customer.`
      },
      {
        num: 17,
        title: 'Consent and Marketing Communication',
        content: `Partners must not send unsolicited bulk emails (spam) or make cold calls. All marketing must comply with anti-spam regulations.`
      },
      {
        num: 18,
        title: 'Confidentiality',
        content: `Partners must keep proprietary sales materials, campaign metrics, and company communication confidential during and after the partnership.`
      },
      {
        num: 19,
        title: 'Lead Attribution',
        content: `Commissions are tracked using referral links and browser cookies. We are not liable for tracking failures caused by cookie blockers.`
      },
      {
        num: 20,
        title: 'Commission Eligibility',
        content: `Commissions are paid only on verified, active subscriptions. Pending or disputed registrations do not qualify for commission.`
      },
      {
        num: 21,
        title: 'Commission Calculation',
        content: `Commissions are calculated as a percentage of the subscription fee. Payout terms: ${LEGAL_CONTACTS.affiliateCommissionTerms}.`
      },
      {
        num: 22,
        title: 'Payment Schedule',
        content: `Commission balances are paid monthly after a hold period to account for potential payment reversals.`
      },
      {
        num: 23,
        title: 'Taxes',
        content: `Partners are responsible for reporting and paying taxes on their commission earnings in accordance with local regulations.`
      },
      {
        num: 24,
        title: 'Chargebacks and Refunded Sales',
        content: `If a referred membership is refunded or disputed, any associated commission will be deducted from the partner's account.`
      },
      {
        num: 25,
        title: 'Fraud Investigation',
        content: `We audit transactions. Suspected self-referrals or commission fraud will result in account suspension during investigation.`
      },
      {
        num: 26,
        title: 'Duplicate or Self-Referrals',
        content: `Partners cannot use their own referral links to buy memberships. Self-referrals will not receive commissions.`
      },
      {
        num: 27,
        title: 'Customer Complaints',
        content: `We track customer complaints. Multiple complaints about a partner's misleading marketing will result in termination.`
      },
      {
        num: 28,
        title: 'Record Keeping',
        content: `Partners must keep records of their marketing channels and provide them to us upon request for compliance checks.`
      },
      {
        num: 29,
        title: 'Anti-Bribery and Ethical Conduct',
        content: `Partners must act ethically, complying with anti-bribery regulations. Do not offer gifts to customers to secure signups.`
      },
      {
        num: 30,
        title: 'Social-Media Guidelines',
        content: `Partners can share referral links on social media, but must not post spam comments on official company channels.`
      },
      {
        num: 31,
        title: 'Website and Domain Restrictions',
        content: `Partners must not register domain names containing "Beduine" or trademark variations (e.g. beduinediscounts.com).`
      },
      {
        num: 32,
        title: 'Paid-Advertising Restrictions',
        content: `Partners must not run PPC search ads bidding on our brand keywords (e.g., "Beduine Tour Travels"). Doing so results in account closure.`
      },
      {
        num: 33,
        title: 'Termination',
        content: `Either party can terminate the agreement at any time with 7 days written notice. We reserve the right to terminate accounts immediately for terms violations.`
      },
      {
        num: 34,
        title: 'Post-Termination Obligations',
        content: `Upon termination, partners must remove all company graphics, logos, and affiliate links from their websites and marketing channels.`
      },
      {
        num: 35,
        title: 'Dispute Resolution',
        content: `Any dispute arising from the affiliate program will be subject to arbitration under courts in ${LEGAL_CONTACTS.courtJurisdiction}.`
      },
      {
        num: 36,
        title: 'Contact Information',
        content: `For affiliate support, email ${LEGAL_CONTACTS.supportEmail} or contact our affiliate program manager.`
      }
    ]
  },
  {
    id: 'grievance-redressal',
    title: 'Beduine Tour & Travels Grievance Redressal Policy',
    slug: 'grievance-redressal',
    summary: 'Detailed procedure to submit complaints, support contacts, escalation, and resolution times.',
    icon: HelpCircle,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
      { label: 'Privacy Policy', slug: 'privacy-policy' }
    ],
    importantNotices: [
      'Grievance Redressal is for formal disputes or complaints. For urgent travel support during a tour, contact our 24/7 hotline.',
      `Formal grievances are acknowledged within 48 hours and resolved in accordance with the timelines below.`
    ],
    sections: [
      {
        num: 1,
        title: 'Grievance Officer details',
        content: `In accordance with applicable IT laws and consumer rules, the designated Grievance Officer is:
Name: ${LEGAL_CONTACTS.grievanceOfficerName}
Designation: Grievance Officer
Email: ${LEGAL_CONTACTS.grievanceOfficerEmail}
Address: ${LEGAL_CONTACTS.grievanceOfficerAddress}
Telephone: ${LEGAL_CONTACTS.supportPhone}`
      },
      {
        num: 2,
        title: 'Designation and Mandate',
        content: `The Grievance Officer is tasked with reviewing customer complaints regarding payment failures, membership issues, fraud, and privacy concerns.`
      },
      {
        num: 3,
        title: 'Support Hours',
        content: `Our grievance team operates Monday through Saturday, from 10:00 AM to 6:00 PM IST (excluding national holidays).`
      },
      {
        num: 4,
        title: 'Complaint Categories',
        content: `Complaints are categorized into: Payments, Memberships, Travel Booking, Partner Affiliates, Privacy, and Technical issues.`
      },
      {
        num: 5,
        title: 'Required Complaint Information',
        content: `To submit a complaint, you must provide: your Full Name, registered email/phone number, booking/membership ID, category, description, and supporting documents.`
      },
      {
        num: 6,
        title: 'Complaint Acknowledgment',
        content: `You will receive a email acknowledgment with a unique ticket number within 48 hours of submitting a grievance.`
      },
      {
        num: 7,
        title: 'Investigation Process',
        content: `Our team will review your ticket, check database records, and consult relevant suppliers (hotels, payment gateways) as needed.`
      },
      {
        num: 8,
        title: 'Expected Response Period',
        content: `We aim to resolve grievances within 15 business days of acknowledgment. Complex disputes may take up to 30 days.`
      },
      {
        num: 9,
        title: 'Escalation Procedure',
        content: `If you are unsatisfied with the resolution, you can escalate the ticket to management by replying with your ticket number.`
      },
      {
        num: 10,
        title: 'Privacy Complaints',
        content: `Privacy complaints are prioritized. The officer will review logs to ensure compliance with our Privacy Policy.`
      },
      {
        num: 11,
        title: 'Booking Complaints',
        content: `Booking disputes (e.g. hotel standards, itinerary changes) will be reviewed against our travel rules and booking confirmations.`
      },
      {
        num: 12,
        title: 'Payment Complaints',
        content: `Payment failures or double charges will be verified with the payment gateway before issuing a resolution.`
      },
      {
        num: 13,
        title: 'Membership Complaints',
        content: `Issues regarding credit balances or selection draws are reviewed against our Membership Rules.`
      },
      {
        num: 14,
        title: 'Affiliate Complaints',
        content: `Complaints regarding partner misrepresentations are investigated, and violating partner accounts will be suspended.`
      },
      {
        num: 15,
        title: 'Emergency Travel-Support Distinction',
        content: `This grievance procedure is not for operational emergencies. If you are stranded or need urgent support, call our 24/7 hotline.`
      }
    ]
  }
];
