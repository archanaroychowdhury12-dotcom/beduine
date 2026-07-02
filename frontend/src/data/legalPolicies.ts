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
      'At Beduine Tour & Travels, we value and respect your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information.'
    ],
    sections: [
      {
        num: 1,
        title: 'Information We Collect',
        content: `We may collect:\n• Full Name\n• Mobile Number\n• Email Address\n• Date of Birth\n• Address\n• Government ID Details (if required)\n• Payment Information\n• Travel Preferences\n• Device and Website Usage Information`
      },
      {
        num: 2,
        title: 'How We Use Your Information',
        content: `We use your information to:\n• Process subscriptions and bookings\n• Verify customer identity\n• Conduct winner selection\n• Send notifications, offers, and updates\n• Provide customer support\n• Improve our services and user experience`
      },
      {
        num: 3,
        title: 'Data Protection',
        content: `All customer information is securely stored and protected. We do not sell, rent, or share personal information with third parties except when required by law or for service fulfillment purposes.`
      },
      {
        num: 4,
        title: 'Marketing Communication',
        content: `By subscribing to Beduine Tour & Travels, you agree to receive promotional messages, emails, WhatsApp notifications, and travel-related offers.`
      },
      {
        num: 5,
        title: 'Policy Updates',
        content: `Beduine Tour & Travels reserves the right to update this Privacy Policy at any time.`
      }
    ]
  },
  {
    id: 'terms-and-conditions',
    title: 'Beduine Tour & Travels Website and Membership Terms',
    slug: 'terms-and-conditions',
    summary: 'Governs website use, subscription memberships, booking requests, and promotional selection rules.',
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
      'Selection-based promotional module will remain disabled until the client provides approved rules, eligibility criteria, privacy terms and written legal authorization.',
      'Purchasing a subscription membership does not guarantee selection, winner benefits, or travel.',
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
        content: `Users must register an account to access subscription plans and winner benefits. You agree to safeguard your credentials and remain responsible for all activities under your account.`
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
        content: `Members receive non-cash benefits: Discount Credits (DCs), eligibility for promotional selections, and special rates on paid tour bookings.`
      },
      {
        num: 14,
        title: 'Discount Credits',
        content: `Discount Credits provide member-only discounts on paid tours. Credits are non-cashable, non-transferable, and expire with the membership.`
      },
      {
        num: 15,
        title: 'Promotional Winner Benefits',
        content: `We conduct promotional programs providing travel benefits. These winner benefits are non-cashable, subject to itinerary limits, and cannot be traded.`
      },
      {
        num: 16,
        title: 'Travel-Winner Benefit Participation Disclaimer',
        content: `The promotional selection is an optional membership incentive. It uses a digital Random Number Generator (RNG) for fair selection.`
      },
      {
        num: 17,
        title: 'No Available Selection or Benefit',
        content: `Purchasing a membership does NOT guarantee selection in any promotional winner benefit or travel-winner benefit. Membership is not an investment for profit.`
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
    id: 'payment-policy',
    title: 'BEDUINE TOUR AND TRAVELS PVT LTD Payment, Cancellation & Travel Policy',
    slug: 'payment-policy',
    summary: 'Covers advance payment schedules, cancellation charges, refund timelines, credit adjustment, force majeure, child policy, and general booking terms.',
    icon: CreditCard,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' },
      { label: 'Refund Policy', slug: 'refund-policy' },
      { label: 'Cancellation Policy', slug: 'cancellation-policy' }
    ],
    importantNotices: [
      'Advance payments are generally non-refundable unless expressly approved under the applicable booking policy.',
      'Failure to complete payments within the stipulated timeline may result in automatic cancellation of the booking.',
      'Discount Credit is not cash and cannot be withdrawn. Eligible credits may only be adjusted against future bookings as per company policy.'
    ],
    sections: [
      {
        num: 1,
        title: 'Fixed Departure Group Tours — Booking Confirmation',
        content: `To confirm a fixed departure group tour booking, the guest must pay 25% of the total tour cost as an advance payment.`
      },
      {
        num: 2,
        title: 'Fixed Departure Group Tours — Payment Timeline',
        content: `30 Days Before Departure: An additional 25% of the total tour cost must be paid.\n\n15 Days Before Departure: An additional 30% of the total tour cost must be paid.\n\n7 Days Before Departure: The remaining 20% balance must be cleared before commencement of the tour.`
      },
      {
        num: 3,
        title: 'Fixed Departure Group Tours — Important Notes',
        content: `• Failure to complete payments within the stipulated timeline may result in automatic cancellation of the booking.\n• Train, flight, visa, permit, and insurance charges may require full or partial advance payment at the time of booking.\n• Prices are subject to change in case of airline fare hikes, government taxes, or supplier cost revisions.`
      },
      {
        num: 4,
        title: 'Customized / Tailor-Made Tours — Booking Confirmation',
        content: `A minimum of 50% advance payment is required to confirm a customized or tailor-made tour booking.`
      },
      {
        num: 5,
        title: 'Customized / Tailor-Made Tours — Payment Timeline',
        content: `7 Days Before Departure: An additional 25% payment must be made.\n\nBefore Departure: The remaining 25% balance must be paid before the start of the tour.`
      },
      {
        num: 6,
        title: 'Customized / Tailor-Made Tours — Important Notes',
        content: `• No customized tour booking will be confirmed without the required advance payment.\n• Customized itineraries are specially designed for individual guests and may be subject to separate terms and conditions.`
      },
      {
        num: 7,
        title: 'Instant Booking Charges',
        content: `For urgent bookings requiring immediate confirmation of hotels, transportation, or tickets, the following additional service charges may apply:\n\n• Domestic Tours: ₹2,000 per booking\n• International Tours: ₹5,000 per booking`
      },
      {
        num: 8,
        title: 'Cancellation 30 Days or More Before Departure',
        content: `No cancellation charge on the land package. A consultation and service charge of ₹500 per person will be deducted. Train and flight ticket cancellation charges will be applicable as per IRCTC, airline, or supplier rules.`
      },
      {
        num: 9,
        title: 'Cancellation Between 15–29 Days Before Departure',
        content: `25% of the total tour cost will be charged as cancellation fees.`
      },
      {
        num: 10,
        title: 'Cancellation Between 7–14 Days Before Departure',
        content: `50% of the total tour cost will be charged as cancellation fees.`
      },
      {
        num: 11,
        title: 'Cancellation Within 0–6 Days Before Departure',
        content: `100% of the total tour cost will be charged as cancellation fees.`
      },
      {
        num: 12,
        title: 'No Show Policy',
        content: `If a guest fails to report for the tour on the scheduled departure date, no refund will be provided.`
      },
      {
        num: 13,
        title: 'Refund Policy',
        content: `Advance payments are generally non-refundable. Refunds, if applicable, will be processed within 15–30 working days after approval.`
      },
      {
        num: 14,
        title: 'Credit Adjustment Policy',
        content: `Eligible credit amounts may be adjusted against future bookings. Credit must be utilized within 12 months from the date of issuance. Unused credit will automatically expire after 12 months and cannot be refunded or extended.`
      },
      {
        num: 15,
        title: 'Force Majeure Policy',
        content: `BEDUINE TOUR AND TRAVELS PVT LTD shall not be held responsible for any delay, modification, interruption, or cancellation of services due to circumstances beyond its control, including but not limited to:\n\n• Natural disasters\n• Landslides\n• Floods\n• Earthquakes\n• Political unrest\n• Strikes or bandhs\n• Pandemics or epidemics\n• Government restrictions\n• Adverse weather conditions\n• Transport disruptions\n\nAny additional costs arising from such situations shall be borne by the guest.`
      },
      {
        num: 16,
        title: 'Child Policy — Domestic Tours',
        content: `Children Below 5 Years: Complimentary tour participation. No separate seat, bed, or ticket will be provided.\n\nChildren Aged 5 Years to Below 8 Years: Charged at 75% of the adult tour cost.\n\nChildren Aged 8 Years and Above: Charged at 100% of the adult tour cost and treated as an adult.`
      },
      {
        num: 17,
        title: 'Child Policy — International Tours',
        content: `Children Below 3 Years: Charged at 50% of the adult tour cost.\n\nChildren Aged 3 Years to Below 6 Years: Charged at 75% of the adult tour cost.\n\nChildren Aged 6 Years and Above: Charged at 100% of the adult tour cost and treated as an adult.`
      },
      {
        num: 18,
        title: 'General Terms & Conditions',
        content: `• A valid government-issued photo ID is mandatory for all travelers.\n• Age proof may be required for children to avail child fares.\n• Hotel check-in and check-out timings shall be governed by the respective hotel policies.\n• Tour itineraries are subject to change due to operational requirements, weather conditions, or unforeseen circumstances.\n• BEDUINE TOUR AND TRAVELS PVT LTD reserves the right to modify tour schedules, accommodations, transportation, or sightseeing arrangements whenever necessary in the best interest of the tour operation.\n• All disputes shall be subject to the jurisdiction of the courts of West Bengal, India.\n\nBEDUINE TOUR AND TRAVELS PVT LTD\n“Safar Jo Yaad Rahe” ✈️🌍`
      }
    ]
  },
  {
    id: 'refund-policy',
    title: 'Beduine Tour & Travels Refund & Credit Adjustment Policy',
    slug: 'refund-policy',
    summary: 'Explains refund approval timelines, advance-payment treatment, and future booking credit adjustment rules.',
    icon: CreditCard,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Payment Policy', slug: 'payment-policy' },
      { label: 'Cancellation Policy', slug: 'cancellation-policy' },
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' }
    ],
    importantNotices: [
      'Advance payments are generally non-refundable.',
      'Approved refunds are processed only after internal approval and supplier reconciliation.',
      'Eligible credits are valid for 12 months and cannot be refunded or extended after expiry.'
    ],
    sections: [
      {
        num: 1,
        title: 'Refund Policy',
        content: `Advance payments are generally non-refundable. Refunds, if applicable, will be processed within 15–30 working days after approval.`
      },
      {
        num: 2,
        title: 'Credit Adjustment Policy',
        content: `Eligible credit amounts may be adjusted against future bookings. Credit must be utilized within 12 months from the date of issuance. Unused credit will automatically expire after 12 months and cannot be refunded or extended.`
      },
      {
        num: 3,
        title: 'Supplier and Ticket Charges',
        content: `Train, flight, visa, permit, insurance, hotel, transport, or supplier cancellation charges may be deducted as per the applicable third-party rules.`
      },
      {
        num: 4,
        title: 'No Show',
        content: `If a guest fails to report for the tour on the scheduled departure date, no refund will be provided.`
      },
      {
        num: 5,
        title: 'Reference to Payment Policy',
        content: `All refunds and credit adjustments must be read together with the full Payment, Cancellation & Travel Policy of BEDUINE TOUR AND TRAVELS PVT LTD.`
      }
    ]
  },
  {
    id: 'cancellation-policy',
    title: 'Beduine Tour & Travels Cancellation Policy',
    slug: 'cancellation-policy',
    summary: 'Outlines cancellation charges based on departure timeline, no-show rules, and force majeure exclusions.',
    icon: XCircle,
    version: '1.0.0',
    effectiveDate: LEGAL_CONTACTS.effectiveDate,
    lastUpdated: LEGAL_CONTACTS.lastUpdatedDate,
    relatedPolicies: [
      { label: 'Payment Policy', slug: 'payment-policy' },
      { label: 'Refund Policy', slug: 'refund-policy' },
      { label: 'Terms & Conditions', slug: 'terms-and-conditions' }
    ],
    importantNotices: [
      'Cancellation charges depend on the number of days remaining before departure.',
      'Ticket, permit, insurance, and supplier cancellation charges may apply separately.',
      'Force majeure events may require itinerary changes or additional guest-borne costs.'
    ],
    sections: [
      {
        num: 1,
        title: 'Cancellation 30 Days or More Before Departure',
        content: `No cancellation charge on the land package. A consultation and service charge of ₹500 per person will be deducted. Train and flight ticket cancellation charges will be applicable as per IRCTC, airline, or supplier rules.`
      },
      {
        num: 2,
        title: 'Cancellation Between 15–29 Days Before Departure',
        content: `25% of the total tour cost will be charged as cancellation fees.`
      },
      {
        num: 3,
        title: 'Cancellation Between 7–14 Days Before Departure',
        content: `50% of the total tour cost will be charged as cancellation fees.`
      },
      {
        num: 4,
        title: 'Cancellation Within 0–6 Days Before Departure',
        content: `100% of the total tour cost will be charged as cancellation fees.`
      },
      {
        num: 5,
        title: 'No Show Policy',
        content: `If a guest fails to report for the tour on the scheduled departure date, no refund will be provided.`
      },
      {
        num: 6,
        title: 'Force Majeure Policy',
        content: `BEDUINE TOUR AND TRAVELS PVT LTD shall not be held responsible for any delay, modification, interruption, or cancellation of services due to circumstances beyond its control, including natural disasters, landslides, floods, earthquakes, political unrest, strikes or bandhs, pandemics or epidemics, government restrictions, adverse weather conditions, or transport disruptions. Any additional costs arising from such situations shall be borne by the guest.`
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
      'Purchasing or renewing a membership does not guarantee selection in any promotional winner benefit or travel-winner benefit process.',
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
        content: `You must keep your account active to access member-only rates, promotional selections, and customer support.`
      },
      {
        num: 9,
        title: 'Membership Benefits',
        content: `Benefits include Discount Credits (DCs), eligibility for monthly/weekly selection winner benefits, and special booking rates.`
      },
      {
        num: 10,
        title: 'Discount Credits',
        content: `Discount Credits offer flat deductions on travel packages. DCs have no cash value and are non-refundable.`
      },
      {
        num: 11,
        title: 'Promotional Winner Benefits',
        content: `Members are entered into promotional selections. Selected members receive specified tour packages matching their plan tier.`
      },
      {
        num: 12,
        title: 'Travel-Winner Benefit Participation Requirements',
        content: `Only members with active accounts during the selection date are eligible for random selection.`
      },
      {
        num: 13,
        title: 'Selection Does Not Guarantee All Travel Expenses',
        content: `Promotional winner benefits cover specific tour itineraries, hotel stays, and guides. Flight fares, visas, and shopping are paid by the traveler unless specified.`
      },
      {
        num: 14,
        title: 'Selected-Member Verification Requirements',
        content: `Before tour booking, winners must submit valid identity verification to confirm membership ownership.`
      },
      {
        num: 15,
        title: 'Confirmation Deadline',
        content: `Winners must confirm travel dates and details within 15 days of notice, or the winner benefit is forfeited.`
      },
      {
        num: 16,
        title: 'Travel Availability',
        content: `Promotional tours operate on specific dates and block-out periods (festivals, peak seasons) determined by the company.`
      },
      {
        num: 17,
        title: 'Benefit Limitations',
        content: `Members can receive only one promotional tour winner benefit per active 12-month subscription term.`
      },
      {
        num: 18,
        title: 'Non-Transferability',
        content: `Memberships and credits are non-transferable. Gold and Platinum plans allow family name changes under specified conditions.`
      },
      {
        num: 19,
        title: 'Non-Cashability',
        content: `Discount Credits and promotional selections cannot be traded or redeemed for cash under any circumstances.`
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
        content: `We may suspend accounts under investigation for terms violations. Suspended accounts lose access to selections and credits.`
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
      'This Website Disclaimer clarifies limits of liability, winner benefit program terms, and general disclaimers for using our site.'
    ],
    sections: [
      {
        num: 1,
        title: 'Program Purpose',
        content: `Beduine Tour & Travels operates a travel membership and promotional winner benefit program designed to provide travel-related benefits to subscribers.`
      },
      {
        num: 2,
        title: 'Availability of Benefits',
        content: `All travel reward selections, discounts, tour destinations, schedules, and benefits are subject to availability and company policies.`
      },
      {
        num: 3,
        title: 'Modification Rights',
        content: `The company reserves the right to modify, suspend, replace, or discontinue any benefit, destination, or promotional offer when required for operational, legal, safety, or business reasons.`
      },
      {
        num: 4,
        title: 'No Selection Guarantee',
        content: `Participation in membership programs does not guarantee selection for a winner benefit.`
      },
      {
        num: 5,
        title: 'Agreement to Policies',
        content: `By using this website, purchasing a subscription, or booking any service, you agree to all applicable company policies, rules, and terms.`
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
      'Making available income claims or promising travel reward wins is strictly prohibited and results in immediate termination.'
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
        content: `Partners must describe our travel subscriptions accurately, outlining both membership features and the random nature of promotional selections.`
      },
      {
        num: 10,
        title: 'Mandatory Affiliate Disclosure',
        content: `Partners must clearly disclose their referral relationship on their promotional pages. Standard disclaimer: "I may receive a commission when an eligible membership or booking is completed through my referral. This does not increase the customer’s price unless clearly stated."`
      },
      {
        num: 11,
        title: 'Prohibited Claims',
        content: `Partners must not claim that membership guarantees travel reward wins, or promise specific financial returns.`
      },
      {
        num: 12,
        title: 'No Available Winner Benefits or Income Claims',
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
