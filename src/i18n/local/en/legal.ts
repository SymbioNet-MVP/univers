export default {
  legal: {
    updatedDate: '20 September 2026',
    updated: 'Last updated: {{date}}',
    tocTitle: 'On this page',
    disclaimer:
      'This page is provided for transparency and trust. It is not legal advice. Please have the final wording reviewed by a qualified lawyer before launch.',
    nav: {
      home: 'UniverS home',
      login: 'Log in',
      start: 'Get started free',
    },
    imprint: {
      seo: {
        title: 'Imprint & Legal Notice | UniverS',
        description:
          'Legal notice and provider information for UniverS, the international platform that matches learners with the right study partner.',
      },
      eyebrow: 'Legal',
      title: 'Imprint',
      subtitle: 'Provider information and legal notice for UniverS, as required by applicable law.',
      sections: [
        {
          id: 'provider',
          heading: 'Provider / Operator',
          blocks: [
            {
              type: 'rows',
              rows: [
                { label: 'Platform', value: 'UniverS' },
                { label: 'Legal form', value: 'Private individual (Switzerland)' },
                { label: 'Full legal name', value: 'Abraham Isaq' },
                { label: 'Postal address', value: 'Baslerstrasse 39, 4665 Oftringen, Switzerland' },
                { label: 'Country', value: 'Switzerland' },
                { label: 'Phone', value: '076 217 59 56' },
                { label: 'Website', value: 'https://getunivers.readdy.co' },
              ],
            },
            { type: 'mail', label: 'Email', email: 'hello@oloai.ch' },
          ],
        },
        {
          id: 'contact',
          heading: 'Contact',
          blocks: [
            {
              type: 'p',
              text: 'For any questions about UniverS, its content or this legal notice, please contact us by email. We aim to respond within a few business days.',
            },
          ],
        },
        {
          id: 'responsible',
          heading: 'Responsible for content',
          blocks: [
            {
              type: 'p',
              text: 'Responsible for the content of this website is the operator named above. Content published by users is the responsibility of the respective users.',
            },
          ],
        },
        {
          id: 'processors',
          heading: 'Data processing partners',
          blocks: [
            {
              type: 'p',
              text: 'To operate UniverS we use the following service providers. Both process personal data on our behalf and under contract.',
            },
            {
              type: 'ul',
              items: [
                'Supabase — authentication, database and file storage.',
                'Resend — delivery of transactional emails such as account confirmation, match notifications and message notifications.',
              ],
            },
          ],
        },
        {
          id: 'liability',
          heading: 'Liability for content and links',
          blocks: [
            {
              type: 'p',
              text: 'We create the content of this website with care, but we cannot guarantee that it is always complete, correct and up to date. As a service provider we are responsible for our own content, but we are not obliged to monitor transmitted or stored third-party information.',
            },
            {
              type: 'p',
              text: 'Our website may contain links to external third-party websites. We have no influence over their content and accept no liability for it. The respective provider or operator is always responsible for the content of linked pages.',
            },
          ],
        },
        {
          id: 'copyright',
          heading: 'Copyright',
          blocks: [
            {
              type: 'p',
              text: 'The content, design and structure of this website are protected by copyright. Any use beyond what is legally permitted requires our prior written consent.',
            },
          ],
        },
      ],
    },
    privacy: {
      seo: {
        title: 'Privacy Policy | UniverS',
        description:
          'How UniverS collects, uses and protects your personal data — GDPR and Swiss FADP compliant, with your rights to access, export and deletion.',
      },
      eyebrow: 'Legal',
      title: 'Privacy Policy',
      subtitle:
        'This policy explains what personal data UniverS collects, why we process it, and the rights you have over your data.',
      sections: [
        {
          id: 'overview',
          heading: 'Overview',
          blocks: [
            {
              type: 'p',
              text: 'This privacy policy explains how UniverS collects, uses and protects personal data when you use our website and platform. It applies to everyone who visits UniverS or creates an account.',
            },
            {
              type: 'p',
              text: 'We handle your data in line with the Swiss Federal Act on Data Protection (FADP) and the EU General Data Protection Regulation (GDPR), where applicable.',
            },
            { type: 'p', text: 'The data controller responsible for processing is:' },
            {
              type: 'rows',
              rows: [
                { label: 'Controller', value: 'Abraham Isaq' },
                { label: 'Address', value: 'Baslerstrasse 39, 4665 Oftringen, Switzerland' },
                { label: 'Country', value: 'Switzerland' },
                { label: 'Website', value: 'https://getunivers.readdy.co' },
              ],
            },
            { type: 'mail', label: 'Privacy contact', email: 'hello@oloai.ch' },
          ],
        },
        {
          id: 'data-we-collect',
          heading: 'Data we collect',
          blocks: [
            { type: 'p', text: 'We collect the following categories of data:' },
            {
              type: 'ul',
              items: [
                'Account data — your email address, your password (stored in hashed form) and the data required to authenticate you.',
                'Profile data — your name, country, institution, field of study, education level, languages, timezone, interests and learning goals.',
                'Matching and interaction data — match requests you send or receive, accepted matches, conversations and the messages you exchange with other learners.',
                'Community data — the posts and comments you publish in the community.',
                'Verification data — the institution email domain you provide if you choose to verify your institution.',
                'Usage data — first-party, event-based data about your activation path (for example signup, profile completion, first match and first message), used to improve the product.',
                'Technical data — the data required for authentication and to keep your session secure.',
              ],
            },
          ],
        },
        {
          id: 'purposes',
          heading: 'Why we process your data',
          blocks: [
            {
              type: 'p',
              text: 'We process your data only for the following purposes and on the following legal bases:',
            },
            {
              type: 'ul',
              items: [
                'Providing the service — creating your account, matching you with study partners, and enabling chat and the community (performance of a contract).',
                'Transactional emails — account confirmation, match requests, accepted matches, new message notifications and weekly match recommendations (performance of a contract and our legitimate interest in keeping you active).',
                'Product improvement — analysing activation and usage events in aggregated form to improve matching and onboarding (legitimate interest).',
                'Security and integrity — preventing misuse, spam and fraud (legitimate interest and legal obligation).',
              ],
            },
            {
              type: 'p',
              text: 'We do not use your data for advertising, for advertising profiles, or sell it to third parties.',
            },
          ],
        },
        {
          id: 'processors',
          heading: 'Service providers',
          blocks: [
            {
              type: 'p',
              text: 'We use the following processors, which handle personal data on our behalf under contractual data processing agreements:',
            },
            {
              type: 'ul',
              items: [
                'Supabase — authentication, database and file storage.',
                'Resend — delivery of transactional emails.',
              ],
            },
            {
              type: 'p',
              text: 'These providers process data only to the extent needed to deliver their service, and are bound to confidentiality and security obligations.',
            },
          ],
        },
        {
          id: 'cookies',
          heading: 'Cookies and local storage',
          blocks: [
            {
              type: 'p',
              text: 'UniverS does not use advertising or third-party tracking cookies. We store only what is technically necessary to run the platform:',
            },
            {
              type: 'ul',
              items: [
                'A login session so that you stay signed in.',
                'Your language and theme preference (light or dark), stored locally in your browser.',
                'A first-party identifier used to attribute referrals before you create an account.',
              ],
            },
            {
              type: 'p',
              text: 'Because only strictly necessary storage is used, no cookie consent banner is required. You can clear this local data at any time in your browser settings.',
            },
          ],
        },
        {
          id: 'emails',
          heading: 'Email notifications',
          blocks: [
            {
              type: 'p',
              text: 'Emails from UniverS are transactional only — they are triggered by your own actions or by your own matching activity. We do not send newsletters or marketing campaigns.',
            },
            {
              type: 'ul',
              items: [
                'Welcome — when you create your account.',
                'Match request — when another learner sends you a request.',
                'Match accepted — when a learner accepts your request.',
                'New message — when you receive a message in a conversation.',
                'Weekly match recommendations — a short summary of learners who match your profile.',
              ],
            },
            {
              type: 'p',
              text: 'You can ask us at any time to stop the non-essential emails, such as the weekly recommendations. Account and security emails that are part of the service remain necessary to operate your account.',
            },
          ],
        },
        {
          id: 'retention',
          heading: 'How long we keep your data',
          blocks: [
            {
              type: 'p',
              text: 'We keep your personal data for as long as your account is active. When you delete your account, your profile, messages and content are deleted or anonymised within a reasonable period, unless we are legally required to retain certain data.',
            },
            {
              type: 'p',
              text: 'Analysis events are stored in aggregated or pseudonymous form and are no longer linked to you once you delete your account.',
            },
          ],
        },
        {
          id: 'transfers',
          heading: 'International data transfers',
          blocks: [
            {
              type: 'p',
              text: 'Our processors may process data on servers located outside Switzerland or the EU/EEA. Where this happens, we rely on appropriate safeguards such as standard contractual clauses and equivalent protections.',
            },
          ],
        },
        {
          id: 'rights',
          heading: 'Your rights',
          blocks: [
            {
              type: 'p',
              text: 'Depending on where you live, you have the following rights over your personal data:',
            },
            {
              type: 'ul',
              items: [
                'Access — to receive a copy of the data we hold about you.',
                'Rectification — to have inaccurate data corrected.',
                'Erasure — to have your data deleted.',
                'Portability — to receive your data in a structured, commonly used format (data export).',
                'Restriction and objection — to restrict or object to certain processing.',
                'Withdrawal of consent — where processing is based on consent.',
              ],
            },
            {
              type: 'p',
              text: 'To exercise any of these rights, including data export and account deletion, contact us using the email below. We will respond within the period required by applicable law.',
            },
          ],
        },
        {
          id: 'age',
          heading: 'Age requirement',
          blocks: [
            {
              type: 'p',
              text: 'UniverS is intended for learners aged 18 and older. We do not knowingly collect personal data from anyone under 18. If you believe that a minor has provided us with personal data, please contact us and we will delete it.',
            },
          ],
        },
        {
          id: 'changes',
          heading: 'Changes to this policy',
          blocks: [
            {
              type: 'p',
              text: 'We may update this privacy policy from time to time. The current version is always available on this page, with the date of the last update shown above. Where a change is material, we will communicate it as required.',
            },
          ],
        },
        {
          id: 'contact',
          heading: 'Contact us',
          blocks: [
            {
              type: 'p',
              text: 'For any questions about this privacy policy or your personal data, contact us:',
            },
            { type: 'mail', label: 'Email', email: 'hello@oloai.ch' },
          ],
        },
      ],
    },
  },
};