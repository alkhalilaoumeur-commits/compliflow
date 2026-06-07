import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/legal/legal-layout";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung — Compliflow",
  description:
    "Widerrufsrecht für Verbraucher und Hinweise zum Erlöschen bei digitalen Inhalten.",
  alternates: { canonical: "/widerruf" },
  robots: { index: true, follow: true },
};

export default function WiderrufPage() {
  return (
    <LegalLayout title="Widerrufsbelehrung" lastUpdated="6. Juni 2026">
      <p className="text-ink">
        Diese Belehrung richtet sich an Verbraucher im Sinne des § 13 BGB.
        Unternehmer im Sinne des § 14 BGB haben kein Widerrufsrecht.
      </p>

      <LegalSection title="Widerrufsrecht">
        <p>
          Du hast das Recht, binnen <strong className="text-ink">vierzehn Tagen</strong>{" "}
          ohne Angabe von Gründen diesen Vertrag zu widerrufen.
        </p>
        <p>
          Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.
        </p>
        <p>
          Um dein Widerrufsrecht auszuüben, musst du uns —
          <br />
          <strong className="text-ink">Al-Khalil Aoumeur, Egilolfstraße 41, 70599 Stuttgart</strong>
          <br />
          E-Mail:{" "}
          <a href="mailto:hello@compliflow.de" className="text-accent hover:text-ink">
            hello@compliflow.de
          </a>
          <br />
          — mittels einer eindeutigen Erklärung (z.B. per E-Mail) über deinen Entschluss,
          diesen Vertrag zu widerrufen, informieren.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass du die Mitteilung über die
          Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absendest.
        </p>
      </LegalSection>

      <LegalSection title="Folgen des Widerrufs">
        <p>
          Wenn du diesen Vertrag widerrufst, haben wir dir alle Zahlungen, die wir von
          dir erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem
          Tag zurückzuzahlen, an dem die Mitteilung über deinen Widerruf dieses Vertrags
          bei uns eingegangen ist.
        </p>
        <p>
          Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das du bei der
          ursprünglichen Transaktion eingesetzt hast, es sei denn, mit dir wurde
          ausdrücklich etwas anderes vereinbart; in keinem Fall werden dir wegen dieser
          Rückzahlung Entgelte berechnet.
        </p>
      </LegalSection>

      <LegalSection title="Erlöschen des Widerrufsrechts bei digitalen Inhalten">
        <p className="bg-[rgba(31,61,47,0.05)] border-l-2 border-accent p-4">
          <strong className="text-ink">Wichtig:</strong> Das Widerrufsrecht{" "}
          <strong className="text-ink">erlischt vorzeitig</strong> bei einem Vertrag zur
          Lieferung von nicht auf einem körperlichen Datenträger befindlichen digitalen
          Inhalten (z.B. PDF-Download eines AVV-Vertrags), wenn du:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>
            ausdrücklich zugestimmt hast, dass wir mit der Ausführung des Vertrags vor
            Ablauf der Widerrufsfrist beginnen, und
          </li>
          <li>
            deine Kenntnis davon bestätigt hast, dass du durch deine Zustimmung mit Beginn
            der Ausführung des Vertrags dein Widerrufsrecht verlierst (§ 356 Abs. 5 BGB).
          </li>
        </ol>
        <p>
          Diese Bestätigung wirst du im Checkout-Prozess explizit abgeben müssen, bevor
          der Download des Dokuments freigegeben wird.
        </p>
      </LegalSection>

      <LegalSection title="Muster-Widerrufsformular">
        <p>
          Wenn du den Vertrag widerrufen willst, kannst du dieses Formular ausfüllen und
          an uns senden:
        </p>
        <div className="bg-bg-soft border border-line p-5 my-4 text-sm">
          <p>An: Al-Khalil Aoumeur, Egilolfstraße 41, 70599 Stuttgart</p>
          <p>E-Mail: hello@compliflow.de</p>
          <br />
          <p>
            Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag
            über den Kauf der folgenden Waren / die Erbringung der folgenden
            Dienstleistung (*):
          </p>
          <br />
          <p>__________________________________________</p>
          <p>__________________________________________</p>
          <br />
          <p>Bestellt am: ___________________ Erhalten am: ___________________</p>
          <p>Name des/der Verbraucher(s): _________________________________</p>
          <p>Anschrift des/der Verbraucher(s): _________________________________</p>
          <br />
          <p>Unterschrift: ____________________</p>
          <p>Datum: ____________________</p>
          <br />
          <p className="text-xs text-ink-faded">(*) Unzutreffendes streichen.</p>
        </div>
      </LegalSection>
    </LegalLayout>
  );
}
