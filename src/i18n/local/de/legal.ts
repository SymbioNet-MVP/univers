export default {
  legal: {
    updatedDate: '20. September 2026',
    updated: 'Zuletzt aktualisiert: {{date}}',
    tocTitle: 'Auf dieser Seite',
    disclaimer:
      'Diese Seite dient der Transparenz und dem Vertrauen. Sie ist keine Rechtsberatung. Lass den finalen Wortlaut vor dem Launch von einer qualifizierten Anwältin oder einem Anwalt prüfen.',
    nav: {
      home: 'UniverS Startseite',
      login: 'Anmelden',
      start: 'Kostenlos starten',
    },
    imprint: {
      seo: {
        title: 'Impressum & rechtliche Hinweise | UniverS',
        description:
          'Impressum und Anbieterinformationen für UniverS, die internationale Plattform, die Lernende mit dem passenden Lernpartner verbindet.',
      },
      eyebrow: 'Rechtliches',
      title: 'Impressum',
      subtitle: 'Anbieterinformationen und rechtliche Hinweise für UniverS, wie gesetzlich erforderlich.',
      sections: [
        {
          id: 'provider',
          heading: 'Anbieter / Betreiber',
          blocks: [
            {
              type: 'rows',
              rows: [
                { label: 'Plattform', value: 'UniverS' },
                { label: 'Rechtsform', value: 'Privatperson (Schweiz)' },
                { label: 'Vollständiger Name', value: 'Abraham Isaq' },
                { label: 'Postadresse', value: 'Baslerstrasse 39, 4665 Oftringen, Schweiz' },
                { label: 'Land', value: 'Schweiz' },
                { label: 'Telefon', value: '076 217 59 56' },
                { label: 'Website', value: 'https://getunivers.readdy.co' },
              ],
            },
            { type: 'mail', label: 'E-Mail', email: 'hello@oloai.ch' },
          ],
        },
        {
          id: 'contact',
          heading: 'Kontakt',
          blocks: [
            {
              type: 'p',
              text: 'Bei Fragen zu UniverS, zu den Inhalten oder zu diesen rechtlichen Hinweisen kontaktiere uns bitte per E-Mail. Wir antworten in der Regel innerhalb weniger Werktage.',
            },
          ],
        },
        {
          id: 'responsible',
          heading: 'Verantwortlich für den Inhalt',
          blocks: [
            {
              type: 'p',
              text: 'Verantwortlich für die Inhalte dieser Website ist der oben genannte Betreiber. Von Nutzenden veröffentlichte Inhalte liegen in deren Verantwortung.',
            },
          ],
        },
        {
          id: 'processors',
          heading: 'Partner der Datenverarbeitung',
          blocks: [
            {
              type: 'p',
              text: 'Für den Betrieb von UniverS nutzen wir folgende Dienstleister. Beide verarbeiten personenbezogene Daten in unserem Auftrag und auf vertraglicher Grundlage.',
            },
            {
              type: 'ul',
              items: [
                'Supabase — Authentifizierung, Datenbank und Dateispeicher.',
                'Resend — Versand transaktionaler E-Mails wie Kontobestätigung, Match-Benachrichtigungen und Nachrichten-Benachrichtigungen.',
              ],
            },
          ],
        },
        {
          id: 'liability',
          heading: 'Haftung für Inhalte und Links',
          blocks: [
            {
              type: 'p',
              text: 'Wir erstellen die Inhalte dieser Website sorgfältig, können aber nicht garantieren, dass sie stets vollständig, korrekt und aktuell sind. Als Diensteanbieter sind wir für eigene Inhalte verantwortlich, jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen.',
            },
            {
              type: 'p',
              text: 'Unsere Website kann Links zu externen Websites Dritter enthalten. Auf deren Inhalte haben wir keinen Einfluss und übernehmen dafür keine Haftung. Für die Inhalte verlinkter Seiten ist stets der jeweilige Anbieter oder Betreiber verantwortlich.',
            },
          ],
        },
        {
          id: 'copyright',
          heading: 'Urheberrecht',
          blocks: [
            {
              type: 'p',
              text: 'Inhalte, Design und Struktur dieser Website sind urheberrechtlich geschützt. Jede Nutzung über das gesetzlich Erlaubte hinaus bedarf unserer vorherigen schriftlichen Zustimmung.',
            },
          ],
        },
      ],
    },
    privacy: {
      seo: {
        title: 'Datenschutzerklärung | UniverS',
        description:
          'Wie UniverS personenbezogene Daten erhebt, nutzt und schützt — DSGVO- und DSG-konform, inklusive deiner Rechte auf Auskunft, Datenexport und Löschung.',
      },
      eyebrow: 'Rechtliches',
      title: 'Datenschutzerklärung',
      subtitle:
        'Diese Erklärung beschreibt, welche personenbezogenen Daten UniverS erhebt, warum wir sie verarbeiten und welche Rechte du an deinen Daten hast.',
      sections: [
        {
          id: 'overview',
          heading: 'Überblick',
          blocks: [
            {
              type: 'p',
              text: 'Diese Datenschutzerklärung beschreibt, wie UniverS personenbezogene Daten erhebt, nutzt und schützt, wenn du unsere Website und Plattform nutzt. Sie gilt für alle, die UniverS besuchen oder ein Konto erstellen.',
            },
            {
              type: 'p',
              text: 'Wir verarbeiten deine Daten im Einklang mit dem Schweizer Datenschutzgesetz (DSG) und, soweit anwendbar, der EU-Datenschutz-Grundverordnung (DSGVO).',
            },
            { type: 'p', text: 'Verantwortlich für die Datenverarbeitung ist:' },
            {
              type: 'rows',
              rows: [
                { label: 'Verantwortliche Stelle', value: 'Abraham Isaq' },
                { label: 'Adresse', value: 'Baslerstrasse 39, 4665 Oftringen, Schweiz' },
                { label: 'Land', value: 'Schweiz' },
                { label: 'Website', value: 'https://getunivers.readdy.co' },
              ],
            },
            { type: 'mail', label: 'Datenschutz-Kontakt', email: 'hello@oloai.ch' },
          ],
        },
        {
          id: 'data-we-collect',
          heading: 'Welche Daten wir erheben',
          blocks: [
            { type: 'p', text: 'Wir erheben folgende Kategorien von Daten:' },
            {
              type: 'ul',
              items: [
                'Kontodaten — deine E-Mail-Adresse, dein Passwort (in gehashter Form gespeichert) und die zur Anmeldung nötigen Daten.',
                'Profildaten — Name, Land, Institution, Fachbereich, Bildungsniveau, Sprachen, Zeitzone, Interessen und Lernziele.',
                'Matching- und Interaktionsdaten — gesendete oder erhaltene Match-Anfragen, angenommene Matches, Gespräche und die Nachrichten, die du mit anderen Lernenden austauschst.',
                'Community-Daten — die Beiträge und Kommentare, die du in der Community veröffentlichst.',
                'Verifizierungsdaten — die E-Mail-Domain deiner Institution, wenn du deine Institution verifizieren möchtest.',
                'Nutzungsdaten — eigene, event-basierte Daten zu deinem Aktivierungspfad (z. B. Registrierung, Profilabschluss, erstes Match, erste Nachricht), die wir zur Produktverbesserung nutzen.',
                'Technische Daten — die für die Anmeldung und die Sicherheit deiner Sitzung notwendigen Daten.',
              ],
            },
          ],
        },
        {
          id: 'purposes',
          heading: 'Warum wir deine Daten verarbeiten',
          blocks: [
            {
              type: 'p',
              text: 'Wir verarbeiten deine Daten ausschließlich zu folgenden Zwecken und auf folgenden Rechtsgrundlagen:',
            },
            {
              type: 'ul',
              items: [
                'Bereitstellung des Dienstes — Kontoerstellung, Matching mit Lernpartnern sowie Chat und Community (Vertragserfüllung).',
                'Transaktionale E-Mails — Kontobestätigung, Match-Anfragen, angenommene Matches, Benachrichtigungen über neue Nachrichten und wöchentliche Match-Empfehlungen (Vertragserfüllung und unser berechtigtes Interesse, dich aktiv zu halten).',
                'Produktverbesserung — Auswertung von Aktivierungs- und Nutzungsereignissen in aggregierter Form zur Verbesserung von Matching und Onboarding (berechtigtes Interesse).',
                'Sicherheit und Integrität — Verhinderung von Missbrauch, Spam und Betrug (berechtigtes Interesse und rechtliche Verpflichtung).',
              ],
            },
            {
              type: 'p',
              text: 'Wir nutzen deine Daten nicht für Werbung, nicht für Werbeprofile und verkaufen sie nicht an Dritte.',
            },
          ],
        },
        {
          id: 'processors',
          heading: 'Dienstleister',
          blocks: [
            {
              type: 'p',
              text: 'Wir setzen folgende Auftragsverarbeiter ein, die personenbezogene Daten in unserem Auftrag auf Grundlage von Verträgen zur Datenverarbeitung bearbeiten:',
            },
            {
              type: 'ul',
              items: [
                'Supabase — Authentifizierung, Datenbank und Dateispeicher.',
                'Resend — Versand transaktionaler E-Mails.',
              ],
            },
            {
              type: 'p',
              text: 'Diese Anbieter verarbeiten Daten nur in dem Umfang, der für die Erbringung ihrer Leistung erforderlich ist, und sind an Vertraulichkeits- und Sicherheitspflichten gebunden.',
            },
          ],
        },
        {
          id: 'cookies',
          heading: 'Cookies und lokaler Speicher',
          blocks: [
            {
              type: 'p',
              text: 'UniverS verwendet keine Werbe- oder Tracking-Cookies Dritter. Wir speichern nur, was für den Betrieb der Plattform technisch notwendig ist:',
            },
            {
              type: 'ul',
              items: [
                'Eine Login-Sitzung, damit du angemeldet bleibst.',
                'Deine Sprach- und Design-Einstellung (hell oder dunkel), lokal in deinem Browser gespeichert.',
                'Eine eigene Kennung, mit der Empfehlungen zugeordnet werden, bevor du ein Konto erstellst.',
              ],
            },
            {
              type: 'p',
              text: 'Da ausschließlich technisch notwendige Speicherung verwendet wird, ist kein Cookie-Banner erforderlich. Du kannst diese lokalen Daten jederzeit in den Browsereinstellungen löschen.',
            },
          ],
        },
        {
          id: 'emails',
          heading: 'E-Mail-Benachrichtigungen',
          blocks: [
            {
              type: 'p',
              text: 'E-Mails von UniverS sind ausschließlich transaktional — sie werden durch deine eigenen Aktionen oder deine eigene Matching-Aktivität ausgelöst. Wir versenden keine Newsletter und keine Marketing-Kampagnen.',
            },
            {
              type: 'ul',
              items: [
                'Willkommen — wenn du dein Konto erstellst.',
                'Match-Anfrage — wenn dir eine andere Person eine Anfrage sendet.',
                'Match angenommen — wenn jemand deine Anfrage annimmt.',
                'Neue Nachricht — wenn du in einem Gespräch eine Nachricht erhältst.',
                'Wöchentliche Match-Empfehlungen — eine kurze Zusammenfassung von Lernenden, die zu deinem Profil passen.',
              ],
            },
            {
              type: 'p',
              text: 'Du kannst uns jederzeit bitten, die nicht notwendigen E-Mails wie die wöchentlichen Empfehlungen einzustellen. Konto- und Sicherheits-E-Mails, die Teil des Dienstes sind, bleiben für den Betrieb deines Kontos erforderlich.',
            },
          ],
        },
        {
          id: 'retention',
          heading: 'Wie lange wir deine Daten speichern',
          blocks: [
            {
              type: 'p',
              text: 'Wir speichern deine personenbezogenen Daten, solange dein Konto aktiv ist. Wenn du dein Konto löschst, werden dein Profil, deine Nachrichten und Inhalte innerhalb eines angemessenen Zeitraums gelöscht oder anonymisiert, sofern wir nicht gesetzlich zur Aufbewahrung bestimmter Daten verpflichtet sind.',
            },
            {
              type: 'p',
              text: 'Analyse-Ereignisse werden in aggregierter oder pseudonymer Form gespeichert und nach der Löschung deines Kontos nicht mehr mit dir verknüpft.',
            },
          ],
        },
        {
          id: 'transfers',
          heading: 'Internationale Datenübermittlung',
          blocks: [
            {
              type: 'p',
              text: 'Unsere Dienstleister können Daten auf Servern außerhalb der Schweiz oder der EU/EWR verarbeiten. Wo dies geschieht, stützen wir uns auf geeignete Garantien wie Standardvertragsklauseln und gleichwertige Schutzmaßnahmen.',
            },
          ],
        },
        {
          id: 'rights',
          heading: 'Deine Rechte',
          blocks: [
            {
              type: 'p',
              text: 'Je nach deinem Wohnort hast du folgende Rechte an deinen personenbezogenen Daten:',
            },
            {
              type: 'ul',
              items: [
                'Auskunft — eine Kopie der Daten zu erhalten, die wir über dich speichern.',
                'Berichtigung — unrichtige Daten korrigieren zu lassen.',
                'Löschung — deine Daten löschen zu lassen.',
                'Übertragbarkeit — deine Daten in einem strukturierten, gängigen Format zu erhalten (Datenexport).',
                'Einschränkung und Widerspruch — bestimmte Verarbeitungen einzuschränken oder ihnen zu widersprechen.',
                'Widerruf der Einwilligung — soweit die Verarbeitung auf einer Einwilligung beruht.',
              ],
            },
            {
              type: 'p',
              text: 'Um eines dieser Rechte auszuüben — einschließlich Datenexport und Kontolöschung — kontaktiere uns über die unten stehende E-Mail. Wir antworten innerhalb der gesetzlich vorgeschriebenen Frist.',
            },
          ],
        },
        {
          id: 'age',
          heading: 'Altersanforderung',
          blocks: [
            {
              type: 'p',
              text: 'UniverS richtet sich an Lernende ab 18 Jahren. Wir erheben wissentlich keine personenbezogenen Daten von Personen unter 18 Jahren. Wenn du glaubst, dass eine minderjährige Person uns personenbezogene Daten übermittelt hat, kontaktiere uns bitte — wir löschen sie.',
            },
          ],
        },
        {
          id: 'changes',
          heading: 'Änderungen dieser Erklärung',
          blocks: [
            {
              type: 'p',
              text: 'Wir können diese Datenschutzerklärung von Zeit zu Zeit aktualisieren. Die aktuelle Version ist stets auf dieser Seite verfügbar, mit dem Datum der letzten Aktualisierung oben. Bei wesentlichen Änderungen informieren wir, soweit erforderlich.',
            },
          ],
        },
        {
          id: 'contact',
          heading: 'Kontakt',
          blocks: [
            {
              type: 'p',
              text: 'Bei Fragen zu dieser Datenschutzerklärung oder zu deinen personenbezogenen Daten kontaktiere uns:',
            },
            { type: 'mail', label: 'E-Mail', email: 'hello@oloai.ch' },
          ],
        },
      ],
    },
  },
};