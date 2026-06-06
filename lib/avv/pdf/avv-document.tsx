"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { AvvFormData } from "../types";
import { buildContract, buildAnlagen } from "../contract";
import { formatDateDE } from "@/lib/utils";

// React-PDF nutzt eingebaute Helvetica — keine externe Font-Abhängigkeit, robust offline.

const COLOR = {
  ink: "#0A0906",
  accent: "#FF4D00",
  dim: "#5C5447",
  line: "#D4CFC7",
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 60,
    paddingBottom: 60,
    paddingHorizontal: 56,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: COLOR.ink,
    lineHeight: 1.5,
  },
  // Deckblatt
  coverWrap: {
    flex: 1,
    justifyContent: "space-between",
  },
  coverTopLabel: {
    fontSize: 8,
    letterSpacing: 2,
    color: COLOR.dim,
    textTransform: "uppercase",
  },
  coverTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.5,
    marginTop: 8,
  },
  coverSubtitle: {
    fontSize: 13,
    color: COLOR.dim,
    marginTop: 6,
  },
  parteienBox: {
    marginTop: 60,
    paddingTop: 24,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLOR.line,
  },
  parteiRow: {
    flexDirection: "row",
    gap: 24,
    marginBottom: 12,
  },
  parteiCol: { flex: 1 },
  parteiLabel: {
    fontSize: 8,
    color: COLOR.accent,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 4,
    fontFamily: "Helvetica-Bold",
  },
  parteiName: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  parteiInfo: {
    fontSize: 9,
    color: COLOR.dim,
    lineHeight: 1.4,
  },
  coverBottom: {
    marginTop: "auto",
  },
  coverDate: {
    fontSize: 9,
    color: COLOR.dim,
    marginBottom: 4,
  },
  coverFooter: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: COLOR.dim,
    textTransform: "uppercase",
  },
  // Inhaltsverzeichnis
  tocTitle: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.3,
    marginBottom: 20,
  },
  tocItem: {
    flexDirection: "row",
    marginBottom: 6,
    fontSize: 11,
  },
  tocNum: {
    width: 36,
    color: COLOR.accent,
    fontFamily: "Helvetica-Bold",
  },
  tocText: { flex: 1 },
  // Vertragstext
  blockTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.2,
    marginTop: 18,
    marginBottom: 8,
  },
  blockNum: {
    color: COLOR.accent,
    fontFamily: "Helvetica-Bold",
  },
  blockPara: {
    marginBottom: 6,
    textAlign: "justify",
  },
  // Anlagen
  anlageTitle: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.3,
    marginBottom: 16,
    marginTop: 4,
  },
  anlageGroupLabel: {
    fontSize: 9,
    color: COLOR.accent,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
    marginTop: 10,
    marginBottom: 4,
  },
  anlageListItem: {
    flexDirection: "row",
    marginBottom: 3,
  },
  anlageBullet: { width: 12 },
  anlageItemText: { flex: 1 },
  table: {
    marginTop: 8,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1.5,
    borderColor: COLOR.ink,
    paddingBottom: 4,
    marginBottom: 4,
  },
  tableHeaderCell: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: COLOR.line,
    paddingVertical: 5,
  },
  tableCell: {
    fontSize: 9,
    paddingRight: 6,
  },
  // Unterschriften
  sigWrap: {
    marginTop: 30,
    flexDirection: "row",
    gap: 24,
  },
  sigCol: {
    flex: 1,
  },
  sigLine: {
    borderBottomWidth: 1,
    borderColor: COLOR.ink,
    marginBottom: 6,
    height: 28,
  },
  sigLabel: {
    fontSize: 8,
    color: COLOR.dim,
    lineHeight: 1.4,
  },
  // Footer
  footer: {
    position: "absolute",
    bottom: 30,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
    color: COLOR.dim,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});

function PageFooter({ data }: { data: AvvFormData }) {
  return (
    <View style={styles.footer} fixed>
      <Text>
        AVV · {data.auftraggeber.firma || "—"} × {data.auftragnehmer.firma || "—"} ·{" "}
        {formatDateDE(new Date())}
      </Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
    </View>
  );
}

export function AvvPdfDocument({ data }: { data: AvvFormData }) {
  const blocks = buildContract(data);
  const anlagen = buildAnlagen(data);

  return (
    <Document
      title={`AVV ${data.auftraggeber.firma || "Vertrag"}`}
      author="Compliflow"
      subject="Auftragsverarbeitungsvertrag nach Art. 28 DSGVO"
    >
      {/* Deckblatt */}
      <Page size="A4" style={styles.page}>
        <View style={styles.coverWrap}>
          <View>
            <Text style={styles.coverTopLabel}>Auftragsverarbeitungsvertrag</Text>
            <Text style={styles.coverTitle}>AVV nach Art. 28 DSGVO</Text>
            <Text style={styles.coverSubtitle}>
              Vertrag zur Auftragsverarbeitung gemäß Datenschutz-Grundverordnung
            </Text>

            <View style={styles.parteienBox}>
              <View style={styles.parteiRow}>
                <View style={styles.parteiCol}>
                  <Text style={styles.parteiLabel}>Verantwortlicher</Text>
                  <Text style={styles.parteiName}>{data.auftraggeber.firma || "—"}</Text>
                  <Text style={styles.parteiInfo}>
                    {data.auftraggeber.strasse || ""}
                    {"\n"}
                    {data.auftraggeber.plz || ""} {data.auftraggeber.ort || ""}
                    {"\n"}
                    {data.auftraggeber.land || ""}
                    {"\n"}
                    {data.auftraggeber.vertretung ? `Vertreten durch: ${data.auftraggeber.vertretung}` : ""}
                    {"\n"}
                    {data.auftraggeber.email || ""}
                  </Text>
                </View>
                <View style={styles.parteiCol}>
                  <Text style={styles.parteiLabel}>Auftragsverarbeiter</Text>
                  <Text style={styles.parteiName}>{data.auftragnehmer.firma || "—"}</Text>
                  <Text style={styles.parteiInfo}>
                    {data.auftragnehmer.strasse || ""}
                    {"\n"}
                    {data.auftragnehmer.plz || ""} {data.auftragnehmer.ort || ""}
                    {"\n"}
                    {data.auftragnehmer.land || ""}
                    {"\n"}
                    {data.auftragnehmer.vertretung ? `Vertreten durch: ${data.auftragnehmer.vertretung}` : ""}
                    {"\n"}
                    {data.auftragnehmer.email || ""}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.coverBottom}>
            <Text style={styles.coverDate}>
              Vorgesehenes Datum: {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : "—"}
              {data.abschlussOrt ? ` · ${data.abschlussOrt}` : ""}
            </Text>
            <Text style={styles.coverFooter}>Generiert mit Compliflow · compliflow.de</Text>
          </View>
        </View>
        <PageFooter data={data} />
      </Page>

      {/* Inhaltsverzeichnis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.tocTitle}>Inhaltsverzeichnis</Text>
        {blocks.map((b) => (
          <View key={b.id} style={styles.tocItem}>
            <Text style={styles.tocNum}>{b.number || "—"}</Text>
            <Text style={styles.tocText}>{b.title}</Text>
          </View>
        ))}
        {anlagen.map((a) => (
          <View key={a.id} style={styles.tocItem}>
            <Text style={styles.tocNum}></Text>
            <Text style={styles.tocText}>{a.title}</Text>
          </View>
        ))}
        <PageFooter data={data} />
      </Page>

      {/* Vertragstext */}
      <Page size="A4" style={styles.page} wrap>
        {blocks.map((block) => (
          <View key={block.id} wrap={false} style={{ marginBottom: 4 }}>
            <Text style={styles.blockTitle}>
              {block.number && <Text style={styles.blockNum}>{block.number} </Text>}
              {block.title}
            </Text>
            {block.paragraphs.map((p, i) => (
              <Text key={i} style={styles.blockPara}>
                {p}
              </Text>
            ))}
          </View>
        ))}

        {/* Unterschriften am Ende des Vertragstexts */}
        <View style={styles.sigWrap} wrap={false}>
          <View style={styles.sigCol}>
            <Text style={{ fontSize: 9, marginBottom: 4, color: COLOR.dim }}>
              {data.abschlussOrt || "—"}, den {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : "—"}
            </Text>
            <View style={styles.sigLine} />
            <Text style={styles.sigLabel}>
              Unterschrift Verantwortlicher{"\n"}
              {data.auftraggeber.vertretung || "—"}{"\n"}
              {data.auftraggeber.firma || ""}
            </Text>
          </View>
          <View style={styles.sigCol}>
            <Text style={{ fontSize: 9, marginBottom: 4, color: COLOR.dim }}>
              {data.abschlussOrt || "—"}, den {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : "—"}
            </Text>
            <View style={styles.sigLine} />
            <Text style={styles.sigLabel}>
              Unterschrift Auftragsverarbeiter{"\n"}
              {data.auftragnehmer.vertretung || "—"}{"\n"}
              {data.auftragnehmer.firma || ""}
            </Text>
          </View>
        </View>

        <PageFooter data={data} />
      </Page>

      {/* Disclaimer / Haftungshinweis */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.anlageTitle}>Wichtiger Hinweis</Text>
        <Text style={{ marginBottom: 10 }}>
          Diese Vorlage eines Auftragsverarbeitungsvertrags wurde nach den Anforderungen
          des Art. 28 Abs. 3 DSGVO sowie unter Berücksichtigung gängiger Mustertexte
          (Bitkom, GDD) erstellt. Sie deckt die in Art. 28 Abs. 3 lit. a-h DSGVO
          genannten Pflichtinhalte ab.
        </Text>
        <Text style={{ marginBottom: 10, fontWeight: 700 }}>
          Diese Vorlage ersetzt keine individuelle Rechtsberatung.
        </Text>
        <Text style={{ marginBottom: 10 }}>
          Vor Unterzeichnung sollten beide Vertragsparteien den Inhalt durch einen
          Rechtsanwalt, Datenschutzbeauftragten oder qualifizierte Berater prüfen
          lassen, insbesondere wenn:
        </Text>
        <View style={{ marginBottom: 10, paddingLeft: 8 }}>
          <Text style={styles.anlageListItem}>
            • besondere Kategorien personenbezogener Daten (Art. 9 DSGVO) verarbeitet werden,
          </Text>
          <Text style={styles.anlageListItem}>
            • Daten in Länder außerhalb der EU/des EWR übermittelt werden,
          </Text>
          <Text style={styles.anlageListItem}>
            • der Hauptvertrag besondere Haftungs- oder Geheimhaltungsregelungen enthält,
          </Text>
          <Text style={styles.anlageListItem}>
            • Subunternehmer eingesetzt werden, die selbst sensible Verarbeitungen vornehmen,
          </Text>
          <Text style={styles.anlageListItem}>
            • branchenspezifische Sonderregelungen gelten (z.B. Gesundheitswesen, Finanzdienstleistungen).
          </Text>
        </View>
        <Text style={{ marginBottom: 10 }}>
          Der Anbieter Compliflow übernimmt keine Haftung für die Richtigkeit, Vollständigkeit
          oder Aktualität dieser Vorlage im Einzelfall. Die Verwendung erfolgt auf eigene
          Verantwortung der Vertragsparteien.
        </Text>
        <Text style={{ marginTop: 20, fontSize: 8, color: COLOR.dim }}>
          Generiert mit Compliflow am{" "}
          {data.abschlussDatum ? formatDateDE(data.abschlussDatum) : formatDateDE(new Date())} ·
          compliflow.de
        </Text>
        <PageFooter data={data} />
      </Page>

      {/* Anlagen */}
      {anlagen.map((anlage) => (
        <Page key={anlage.id} size="A4" style={styles.page} wrap>
          <Text style={styles.anlageTitle}>{anlage.title}</Text>

          {anlage.content.type === "tom-table" &&
            anlage.content.groups.map((g) => (
              <View key={g.kategorie} wrap={false}>
                <Text style={styles.anlageGroupLabel}>{g.kategorie}</Text>
                {g.items.map((it, i) => (
                  <View key={i} style={styles.anlageListItem}>
                    <Text style={styles.anlageBullet}>•</Text>
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
                <View key={i} style={styles.tableRow} wrap={false}>
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
              <Text style={{ marginBottom: 12 }}>
                {anlage.content.daten.join(", ") || "—"}
              </Text>
              <Text style={styles.anlageGroupLabel}>Betroffene Personen</Text>
              <Text style={{ marginBottom: 12 }}>
                {anlage.content.personen.join(", ") || "—"}
              </Text>
              <Text style={styles.anlageGroupLabel}>Verarbeitungsarten</Text>
              <Text>{anlage.content.arten.join(", ") || "—"}</Text>
            </View>
          )}

          <PageFooter data={data} />
        </Page>
      ))}
    </Document>
  );
}
