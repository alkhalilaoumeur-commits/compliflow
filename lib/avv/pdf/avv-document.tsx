"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AvvFormData } from "../types";
import { buildContract, buildAnlagen } from "../contract";
import { formatDateDE } from "@/lib/utils";

const COLOR = {
  ink: "#15171B",
  accent: "#1F3D2F",
  accentLight: "#E8F0EC",
  dim: "#4F5359",
  faded: "#8B8E94",
  line: "#E2DDD1",
  bg: "#FDFBF6",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 52,
    fontFamily: "Helvetica",
    fontSize: 10.5,
    color: COLOR.ink,
    lineHeight: 1.6,
    backgroundColor: "#ffffff",
  },
  // ── Cover ──────────────────────────────────────────────────────────
  accentBar: {
    height: 4,
    backgroundColor: COLOR.accent,
    marginBottom: 40,
  },
  coverTopLabel: {
    fontSize: 8,
    letterSpacing: 2.5,
    color: COLOR.faded,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.8,
    color: COLOR.ink,
    lineHeight: 1.1,
    marginBottom: 8,
  },
  coverSubtitle: {
    fontSize: 12,
    color: COLOR.dim,
    lineHeight: 1.5,
  },
  parteienBox: {
    marginTop: 48,
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderLeftWidth: 3,
    borderLeftColor: COLOR.accent,
    backgroundColor: COLOR.accentLight,
  },
  parteiRow: {
    flexDirection: "row",
    gap: 20,
  },
  parteiCol: { flex: 1 },
  parteiLabel: {
    fontSize: 7.5,
    color: COLOR.accent,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  parteiName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    color: COLOR.ink,
  },
  parteiInfo: {
    fontSize: 9,
    color: COLOR.dim,
    lineHeight: 1.5,
  },
  parteiDivider: {
    width: 1,
    backgroundColor: COLOR.line,
    marginHorizontal: 4,
  },
  coverMeta: {
    marginTop: 36,
    flexDirection: "row",
    gap: 32,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: COLOR.line,
  },
  coverMetaLabel: {
    fontSize: 7.5,
    color: COLOR.faded,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  coverMetaValue: {
    fontSize: 9.5,
    color: COLOR.ink,
    fontFamily: "Helvetica-Bold",
  },
  coverBranding: {
    marginTop: "auto",
    paddingTop: 20,
    borderTopWidth: 0.5,
    borderTopColor: COLOR.line,
  },
  coverBrandingText: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLOR.faded,
    textTransform: "uppercase",
  },
  // ── TOC ────────────────────────────────────────────────────────────
  tocTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.5,
    marginBottom: 24,
    color: COLOR.ink,
  },
  tocSection: {
    marginBottom: 4,
  },
  tocItem: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 7,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.line,
  },
  tocNum: {
    width: 40,
    fontSize: 9,
    color: COLOR.accent,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  tocText: {
    flex: 1,
    fontSize: 10.5,
    color: COLOR.ink,
  },
  tocAnlageLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 7.5,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: COLOR.faded,
  },
  // ── Vertragstext ───────────────────────────────────────────────────
  sectionBreak: {
    marginTop: 6,
    marginBottom: 6,
    height: 0.5,
    backgroundColor: COLOR.line,
  },
  blockHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 7,
    backgroundColor: COLOR.accentLight,
    marginTop: 20,
    marginBottom: 8,
  },
  blockNum: {
    fontSize: 8.5,
    fontFamily: "Helvetica-Bold",
    color: COLOR.accent,
    letterSpacing: 0.5,
    width: 32,
    paddingTop: 1,
  },
  blockTitle: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: COLOR.ink,
    letterSpacing: -0.2,
    lineHeight: 1.3,
  },
  blockPara: {
    marginBottom: 7,
    textAlign: "justify",
    fontSize: 10.5,
    lineHeight: 1.65,
    color: COLOR.ink,
  },
  // ── Unterschriften ─────────────────────────────────────────────────
  sigSection: {
    marginTop: 40,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: COLOR.line,
  },
  sigSectionLabel: {
    fontSize: 7.5,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    color: COLOR.faded,
    marginBottom: 20,
  },
  sigWrap: {
    flexDirection: "row",
    gap: 24,
  },
  sigCol: { flex: 1 },
  sigDateText: {
    fontSize: 9,
    color: COLOR.dim,
    marginBottom: 6,
  },
  sigLine: {
    borderBottomWidth: 1,
    borderColor: COLOR.ink,
    marginBottom: 8,
    height: 36,
  },
  sigLabel: {
    fontSize: 8.5,
    color: COLOR.dim,
    lineHeight: 1.5,
  },
  sigName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLOR.ink,
    marginTop: 2,
  },
  // ── Anlagen ────────────────────────────────────────────────────────
  anlageAccentBar: {
    height: 3,
    backgroundColor: COLOR.accent,
    marginBottom: 28,
  },
  anlageTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.3,
    marginBottom: 4,
    color: COLOR.ink,
  },
  anlageSubtitle: {
    fontSize: 9,
    color: COLOR.dim,
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  anlageGroupLabel: {
    fontSize: 8,
    color: COLOR.accent,
    letterSpacing: 1.8,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginTop: 14,
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.line,
  },
  anlageListItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingVertical: 2,
  },
  anlageBullet: {
    width: 14,
    color: COLOR.accent,
    fontSize: 10.5,
  },
  anlageItemText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.5,
    color: COLOR.ink,
  },
  // Table
  table: { marginTop: 10 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: COLOR.accent,
    padding: 6,
    marginBottom: 2,
  },
  tableHeaderCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#FFFFFF",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: COLOR.line,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  tableRowAlt: {
    backgroundColor: "#F9F7F4",
  },
  tableCell: {
    fontSize: 9,
    paddingRight: 8,
    color: COLOR.ink,
    lineHeight: 1.4,
  },
  // Disclaimer
  disclaimerBox: {
    backgroundColor: "#FFF8ED",
    borderLeftWidth: 3,
    borderLeftColor: "#E8A83A",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  disclaimerTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#9a5d1a",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  disclaimerText: {
    fontSize: 9,
    color: "#9a5d1a",
    lineHeight: 1.6,
  },
  disclaimerList: {
    marginTop: 6,
    paddingLeft: 4,
  },
  disclaimerItem: {
    fontSize: 9,
    color: "#9a5d1a",
    lineHeight: 1.5,
    marginBottom: 2,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 24,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: COLOR.line,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7.5,
    color: COLOR.faded,
    letterSpacing: 0.5,
  },
  footerPage: {
    fontSize: 7.5,
    color: COLOR.faded,
  },
});

function PageFooter({ data }: { data: AvvFormData }) {
  const ag = data.auftraggeber.firma || "—";
  const an = data.auftragnehmer.firma || "—";
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        AVV · {ag} × {an} · {formatDateDE(new Date())}
      </Text>
      <Text
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

export function AvvPdfDocument({
  data,
  noBranding = false,
}: {
  data: AvvFormData;
  noBranding?: boolean;
}) {
  const blocks = buildContract(data);
  const anlagen = buildAnlagen(data);
  const anlageLetters = ["A", "B", "C", "D", "E", "F"];

  return (
    <Document
      title={`AVV ${data.auftraggeber.firma || "Vertrag"}`}
      author={
        noBranding
          ? data.auftraggeber.firma || "Verantwortlicher"
          : "Compliflow · compliflow.de"
      }
      subject="Auftragsverarbeitungsvertrag nach Art. 28 DSGVO"
      language="de"
    >
      {/* ── Deckblatt ────────────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.accentBar} />

        <Text style={styles.coverTopLabel}>
          Auftragsverarbeitungsvertrag · Art. 28 DSGVO
        </Text>
        <Text style={styles.coverTitle}>AVV nach{"\n"}Art. 28 DSGVO</Text>
        <Text style={styles.coverSubtitle}>
          Vertrag zur Auftragsverarbeitung gemäß Datenschutz-Grundverordnung
        </Text>

        <View style={styles.parteienBox}>
          <View style={styles.parteiRow}>
            <View style={styles.parteiCol}>
              <Text style={styles.parteiLabel}>Verantwortlicher</Text>
              <Text style={styles.parteiName}>
                {data.auftraggeber.firma || "—"}
              </Text>
              <Text style={styles.parteiInfo}>
                {[
                  data.auftraggeber.strasse,
                  `${data.auftraggeber.plz || ""} ${data.auftraggeber.ort || ""}`.trim(),
                  data.auftraggeber.land,
                  data.auftraggeber.vertretung
                    ? `Vertreten durch: ${data.auftraggeber.vertretung}`
                    : null,
                  data.auftraggeber.email,
                ]
                  .filter(Boolean)
                  .join("\n")}
              </Text>
            </View>
            <View style={styles.parteiDivider} />
            <View style={styles.parteiCol}>
              <Text style={styles.parteiLabel}>Auftragsverarbeiter</Text>
              <Text style={styles.parteiName}>
                {data.auftragnehmer.firma || "—"}
              </Text>
              <Text style={styles.parteiInfo}>
                {[
                  data.auftragnehmer.strasse,
                  `${data.auftragnehmer.plz || ""} ${data.auftragnehmer.ort || ""}`.trim(),
                  data.auftragnehmer.land,
                  data.auftragnehmer.vertretung
                    ? `Vertreten durch: ${data.auftragnehmer.vertretung}`
                    : null,
                  data.auftragnehmer.email,
                ]
                  .filter(Boolean)
                  .join("\n")}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.coverMeta}>
          <View>
            <Text style={styles.coverMetaLabel}>Datum</Text>
            <Text style={styles.coverMetaValue}>
              {data.abschlussDatum
                ? formatDateDE(data.abschlussDatum)
                : "Nicht festgelegt"}
            </Text>
          </View>
          {data.abschlussOrt && (
            <View>
              <Text style={styles.coverMetaLabel}>Ort</Text>
              <Text style={styles.coverMetaValue}>{data.abschlussOrt}</Text>
            </View>
          )}
          <View>
            <Text style={styles.coverMetaLabel}>Anlagen</Text>
            <Text style={styles.coverMetaValue}>{anlagen.length}</Text>
          </View>
        </View>

        {!noBranding && (
          <View style={styles.coverBranding}>
            <Text style={styles.coverBrandingText}>
              Generiert mit Compliflow · compliflow.de
            </Text>
          </View>
        )}
        <PageFooter data={data} />
      </Page>

      {/* ── Inhaltsverzeichnis ───────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.tocTitle}>Inhalts­verzeichnis</Text>

        {blocks.map((b) => (
          <View key={b.id} style={styles.tocItem}>
            <Text style={styles.tocNum}>{b.number || "—"}</Text>
            <Text style={styles.tocText}>{b.title}</Text>
          </View>
        ))}

        {anlagen.length > 0 && (
          <>
            <Text style={styles.tocAnlageLabel}>Anlagen</Text>
            {anlagen.map((a, idx) => (
              <View key={a.id} style={styles.tocItem}>
                <Text style={styles.tocNum}>
                  Anlage {anlageLetters[idx] ?? String(idx + 1)}
                </Text>
                <Text style={styles.tocText}>{a.title}</Text>
              </View>
            ))}
          </>
        )}

        <PageFooter data={data} />
      </Page>

      {/* ── Vertragstext ─────────────────────────────────────────── */}
      <Page size="A4" style={styles.page} wrap>
        {blocks.map((block, idx) => (
          <View key={block.id} style={{ marginBottom: 2 }}>
            {idx > 0 && <View style={styles.sectionBreak} />}
            {/* Header bleibt zusammen mit erstem Absatz — verhindert verwaiste Überschrift */}
            <View wrap={false}>
              <View style={styles.blockHeader}>
                {block.number && (
                  <Text style={styles.blockNum}>{block.number}</Text>
                )}
                <Text style={styles.blockTitle}>{block.title}</Text>
              </View>
              {block.paragraphs[0] && (
                <Text style={styles.blockPara}>{block.paragraphs[0]}</Text>
              )}
            </View>
            {block.paragraphs.slice(1).map((p, i) => (
              <Text key={i + 1} style={styles.blockPara}>
                {p}
              </Text>
            ))}
          </View>
        ))}

        {/* Unterschriften */}
        <View style={styles.sigSection} wrap={false}>
          <Text style={styles.sigSectionLabel}>Unterschriften der Vertragsparteien</Text>
          <View style={styles.sigWrap}>
            <View style={styles.sigCol}>
              <Text style={styles.sigDateText}>
                {data.abschlussOrt || "Ort"}, den{" "}
                {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : "—"}
              </Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>Unterschrift</Text>
              <Text style={styles.sigName}>
                {data.auftraggeber.vertretung || "—"}
              </Text>
              <Text style={styles.sigLabel}>{data.auftraggeber.firma || ""}</Text>
              <Text style={[styles.sigLabel, { color: COLOR.faded, marginTop: 2 }]}>
                Verantwortlicher
              </Text>
            </View>
            <View style={styles.sigCol}>
              <Text style={styles.sigDateText}>
                {data.abschlussOrt || "Ort"}, den{" "}
                {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : "—"}
              </Text>
              <View style={styles.sigLine} />
              <Text style={styles.sigLabel}>Unterschrift</Text>
              <Text style={styles.sigName}>
                {data.auftragnehmer.vertretung || "—"}
              </Text>
              <Text style={styles.sigLabel}>{data.auftragnehmer.firma || ""}</Text>
              <Text style={[styles.sigLabel, { color: COLOR.faded, marginTop: 2 }]}>
                Auftragsverarbeiter
              </Text>
            </View>
          </View>
        </View>

        <PageFooter data={data} />
      </Page>

      {/* ── Wichtiger Hinweis ─────────────────────────────────────── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.anlageAccentBar} />
        <Text style={styles.anlageTitle}>Rechtlicher Hinweis</Text>
        <Text style={styles.anlageSubtitle}>
          Zur Verwendung dieser Vertragsvorlage
        </Text>

        <View style={styles.disclaimerBox}>
          <Text style={styles.disclaimerTitle}>WICHTIG — Kein Ersatz für Rechtsberatung</Text>
          <Text style={styles.disclaimerText}>
            Diese Vorlage wurde nach den Anforderungen des Art. 28 Abs. 3 DSGVO sowie
            unter Berücksichtigung gängiger Mustertexte (Bitkom, GDD, DSK) erstellt und
            deckt die in Art. 28 Abs. 3 lit. a–h DSGVO genannten Pflichtinhalte ab.
          </Text>
          <View style={styles.disclaimerList}>
            <Text style={styles.disclaimerItem}>
              • Vor Unterzeichnung sollten beide Parteien den Inhalt durch einen Rechtsanwalt oder Datenschutzbeauftragten prüfen lassen, insbesondere wenn besondere Kategorien personenbezogener Daten (Art. 9 DSGVO) verarbeitet werden.
            </Text>
            <Text style={styles.disclaimerItem}>
              • Daten werden in Länder außerhalb der EU/des EWR übermittelt (Drittlandübermittlung, Art. 44 ff. DSGVO).
            </Text>
            <Text style={styles.disclaimerItem}>
              • Branchenspezifische Sonderregelungen gelten (z. B. Gesundheitswesen, Finanzdienstleistungen).
            </Text>
          </View>
        </View>

        <Text style={{ fontSize: 10.5, lineHeight: 1.65, marginBottom: 10, color: COLOR.dim }}>
          Der Anbieter Compliflow übernimmt keine Haftung für die Richtigkeit,
          Vollständigkeit oder Aktualität dieser Vorlage im Einzelfall. Die Verwendung
          erfolgt auf eigene Verantwortung der Vertragsparteien.
        </Text>

        {!noBranding && (
          <Text style={{ marginTop: 20, fontSize: 8, color: COLOR.faded }}>
            Generiert mit Compliflow am{" "}
            {data.abschlussDatum
              ? formatDateDE(data.abschlussDatum)
              : formatDateDE(new Date())}{" "}
            · compliflow.de
          </Text>
        )}
        <PageFooter data={data} />
      </Page>

      {/* ── Anlagen ──────────────────────────────────────────────── */}
      {anlagen.map((anlage, idx) => (
        <Page key={anlage.id} size="A4" style={styles.page} wrap>
          <View style={styles.anlageAccentBar} />
          <Text style={[styles.coverTopLabel, { marginBottom: 4 }]}>
            Anlage {anlageLetters[idx] ?? String(idx + 1)}
          </Text>
          <Text style={styles.anlageTitle}>{anlage.title}</Text>
          <Text style={styles.anlageSubtitle}>
            Anhang zum AVV zwischen {data.auftraggeber.firma || "—"} und{" "}
            {data.auftragnehmer.firma || "—"}
          </Text>

          {anlage.content.type === "tom-table" &&
            anlage.content.groups.map((g) => (
              <View key={g.kategorie} wrap={false}>
                <Text style={styles.anlageGroupLabel}>{g.kategorie}</Text>
                {g.items.map((it, i) => (
                  <View key={i} style={styles.anlageListItem}>
                    <Text style={styles.anlageBullet}>·</Text>
                    <Text style={styles.anlageItemText}>{it}</Text>
                  </View>
                ))}
              </View>
            ))}

          {anlage.content.type === "sub-table" && (
            <View style={styles.table}>
              <View style={styles.tableHeader} fixed>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Firma</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Sitz</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Zweck</Text>
                <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Land</Text>
                <Text style={[styles.tableHeaderCell, { flex: 2 }]}>Garantie</Text>
              </View>
              {anlage.content.rows.map((r, i) => (
                <View
                  key={i}
                  style={[styles.tableRow, i % 2 === 1 ? styles.tableRowAlt : {}]}
                  wrap={false}
                >
                  <Text style={[styles.tableCell, { flex: 2 }]}>{r.firma}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{r.sitz}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{r.zweck}</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>{r.land}</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>{r.garantie}</Text>
                </View>
              ))}
            </View>
          )}

          {anlage.content.type === "data-categories" && (
            <View>
              <Text style={styles.anlageGroupLabel}>Datenkategorien</Text>
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 1.6,
                  marginBottom: 16,
                  color: COLOR.ink,
                }}
              >
                {anlage.content.daten.join(", ") || "—"}
              </Text>
              <Text style={styles.anlageGroupLabel}>Betroffene Personen</Text>
              <Text
                style={{
                  fontSize: 10,
                  lineHeight: 1.6,
                  marginBottom: 16,
                  color: COLOR.ink,
                }}
              >
                {anlage.content.personen.join(", ") || "—"}
              </Text>
              <Text style={styles.anlageGroupLabel}>Verarbeitungsarten</Text>
              <Text style={{ fontSize: 10, lineHeight: 1.6, color: COLOR.ink }}>
                {anlage.content.arten.join(", ") || "—"}
              </Text>
            </View>
          )}

          <PageFooter data={data} />
        </Page>
      ))}
    </Document>
  );
}
