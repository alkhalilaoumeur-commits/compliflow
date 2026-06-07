"use client";

import type { VvtFormData } from "../types";
import { RECHTSGRUNDLAGEN_LABELS, DRITTLAND_GARANTIE_LABELS } from "../types";

// Diese Datei wird lazy geladen (import("@react-pdf/renderer")) — nur client-side

export async function renderVvtPdf(data: VvtFormData, noBranding = false): Promise<Blob> {
  const { Document, Page, Text, View, StyleSheet, pdf, Font } = await import(
    "@react-pdf/renderer"
  );

  Font.registerHyphenationCallback((word) => [word]);

  const v = data.verantwortlicher;
  const today = new Date(data.letztAktualisiert).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const erstellt = new Date(data.erstelltAm).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const styles = StyleSheet.create({
    page: {
      fontSize: 9,
      fontFamily: "Helvetica",
      padding: "32pt 36pt 40pt 36pt",
      color: "#15171B",
      backgroundColor: "#ffffff",
    },
    // Header
    header: {
      borderBottom: "1.5pt solid #15171B",
      paddingBottom: 10,
      marginBottom: 18,
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: "Helvetica-Bold",
      letterSpacing: -0.5,
      marginBottom: 2,
    },
    headerSub: {
      fontSize: 8.5,
      color: "#4F5359",
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    headerMeta: {
      marginTop: 8,
      flexDirection: "row",
      gap: 24,
    },
    headerMetaItem: {
      fontSize: 7.5,
      color: "#4F5359",
    },
    headerMetaValue: {
      fontSize: 8,
      color: "#15171B",
      fontFamily: "Helvetica-Bold",
    },
    // Section
    sectionLabel: {
      fontSize: 7,
      letterSpacing: 1.8,
      textTransform: "uppercase",
      color: "#8B8E94",
      marginBottom: 6,
      marginTop: 16,
    },
    sectionTitle: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      marginBottom: 8,
    },
    // Verantwortlicher
    verantwortCard: {
      borderLeft: "2pt solid #1F3D2F",
      paddingLeft: 10,
      marginBottom: 16,
    },
    verantwortLabel: {
      fontSize: 7,
      color: "#8B8E94",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 1,
    },
    verantwortValue: {
      fontSize: 9,
      marginBottom: 4,
    },
    // Activity
    activityCard: {
      border: "0.5pt solid #E2DDD1",
      marginBottom: 14,
      padding: "10pt 12pt",
    },
    activityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      borderBottom: "0.5pt solid #E2DDD1",
      paddingBottom: 6,
      marginBottom: 8,
    },
    activityNumber: {
      fontSize: 7,
      color: "#8B8E94",
      letterSpacing: 1.5,
      textTransform: "uppercase",
    },
    activityTitle: {
      fontSize: 11,
      fontFamily: "Helvetica-Bold",
      marginTop: 2,
    },
    activityBadge: {
      fontSize: 7,
      color: "#1F3D2F",
      letterSpacing: 0.8,
      border: "0.5pt solid #1F3D2F",
      paddingHorizontal: 5,
      paddingVertical: 2,
    },
    // Fields inside activity
    fieldGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 8,
    },
    field: {
      width: "47%",
      marginBottom: 8,
    },
    fieldFull: {
      width: "100%",
      marginBottom: 8,
    },
    fieldLabel: {
      fontSize: 7,
      color: "#8B8E94",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    fieldValue: {
      fontSize: 8.5,
      lineHeight: 1.5,
    },
    chip: {
      fontSize: 7.5,
      backgroundColor: "#F6F2EA",
      border: "0.5pt solid #E2DDD1",
      paddingHorizontal: 5,
      paddingVertical: 1.5,
      marginRight: 3,
      marginBottom: 3,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    // Footer
    footer: {
      position: "absolute",
      bottom: 24,
      left: 36,
      right: 36,
      borderTop: "0.5pt solid #E2DDD1",
      paddingTop: 6,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerText: {
      fontSize: 7,
      color: "#8B8E94",
    },
    pageNum: {
      fontSize: 7,
      color: "#8B8E94",
    },
    warningBox: {
      backgroundColor: "#FFF8ED",
      border: "0.5pt solid #E8A83A",
      padding: "6pt 8pt",
      marginBottom: 12,
    },
    warningText: {
      fontSize: 8,
      color: "#9a5d1a",
    },
  });

  const FieldRow = ({
    label,
    value,
    full = false,
  }: {
    label: string;
    value: string | string[];
    full?: boolean;
  }) => (
    <View style={full ? styles.fieldFull : styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {Array.isArray(value) ? (
        <View style={styles.chipRow}>
          {value.map((v, i) => (
            <Text key={i} style={styles.chip}>
              {v}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>{value || "—"}</Text>
      )}
    </View>
  );

  const doc = (
    <Document
      title={`Verarbeitungsverzeichnis — ${v.bezeichnung || "Unbekannt"}`}
      author={noBranding ? (v.bezeichnung || "Unbekannt") : "Compliflow · compliflow.de"}
      subject="Verarbeitungsverzeichnis nach Art. 30 DSGVO"
      language="de"
    >
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Verarbeitungsverzeichnis</Text>
          <Text style={styles.headerSub}>nach Art. 30 Abs. 1 DSGVO · Compliflow</Text>
          <View style={styles.headerMeta}>
            <View>
              <Text style={styles.headerMetaItem}>Verantwortlicher</Text>
              <Text style={styles.headerMetaValue}>{v.bezeichnung || "—"}</Text>
            </View>
            <View>
              <Text style={styles.headerMetaItem}>Erstellt am</Text>
              <Text style={styles.headerMetaValue}>{erstellt}</Text>
            </View>
            <View>
              <Text style={styles.headerMetaItem}>Stand</Text>
              <Text style={styles.headerMetaValue}>{today}</Text>
            </View>
            <View>
              <Text style={styles.headerMetaItem}>Tätigkeiten</Text>
              <Text style={styles.headerMetaValue}>{data.taetigkeiten.length}</Text>
            </View>
          </View>
        </View>

        {/* Legal Warning */}
        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            {noBranding
              ? "Hinweis: Dieses Verzeichnis ersetzt keine Rechtsberatung. Prüfen Sie die Vollständigkeit gemeinsam mit einem Datenschutzexperten. Anwaltlich geprüfte Vorlagen — Stand: Art. 30 DSGVO, Fassung 2024."
              : "Hinweis: Dieses Verzeichnis wurde mit Compliflow (compliflow.de) erstellt. Es ersetzt keine Rechtsberatung. Prüfen Sie die Vollständigkeit gemeinsam mit einem Datenschutzexperten. Anwaltlich geprüfte Vorlagen — Stand: Art. 30 DSGVO, Fassung 2024."}
          </Text>
        </View>

        {/* Verantwortlicher */}
        <Text style={styles.sectionLabel}>I. Verantwortliche Stelle</Text>
        <View style={styles.verantwortCard}>
          <Text style={styles.verantwortLabel}>Unternehmen / Bezeichnung</Text>
          <Text style={styles.verantwortValue}>{v.bezeichnung || "—"}</Text>
          <Text style={styles.verantwortLabel}>Vertretungsberechtigte Person</Text>
          <Text style={styles.verantwortValue}>{v.name || "—"}</Text>
          <Text style={styles.verantwortLabel}>Anschrift</Text>
          <Text style={styles.verantwortValue}>
            {[v.strasse, `${v.plz || ""} ${v.ort || ""}`.trim(), v.land]
              .filter(Boolean)
              .join(", ")}
          </Text>
          <Text style={styles.verantwortLabel}>Kontakt</Text>
          <Text style={styles.verantwortValue}>
            {[v.email, v.telefon, v.website].filter(Boolean).join(" · ")}
          </Text>
          {v.hatDsb && v.dsb && (
            <>
              <Text style={[styles.verantwortLabel, { marginTop: 6 }]}>
                Datenschutzbeauftragter (Art. 37 DSGVO)
              </Text>
              <Text style={styles.verantwortValue}>
                {[v.dsb.name, v.dsb.email, v.dsb.telefon].filter(Boolean).join(" · ")}
              </Text>
            </>
          )}
        </View>

        <Text style={styles.sectionLabel}>II. Verarbeitungstätigkeiten</Text>

        {data.taetigkeiten.map((t, idx) => {
          const rgLabels = t.rechtsgrundlagen.map(
            (rg) => RECHTSGRUNDLAGEN_LABELS[rg] || rg
          );
          const drittlandLabel =
            DRITTLAND_GARANTIE_LABELS[t.drittlandGarantie] || t.drittlandGarantie;

          return (
            <View key={t.id} style={styles.activityCard} wrap={false}>
              <View style={styles.activityHeader}>
                <View>
                  <Text style={styles.activityNumber}>
                    VVT-{String(idx + 1).padStart(2, "0")} · Art. 30 Abs. 1 DSGVO
                  </Text>
                  <Text style={styles.activityTitle}>{t.bezeichnung}</Text>
                </View>
                {t.besondereKategorien && (
                  <Text style={styles.activityBadge}>ART. 9 DSGVO</Text>
                )}
              </View>

              <View style={styles.fieldGrid}>
                <FieldRow label="Zweck der Verarbeitung" value={t.zweck} full />
                <FieldRow
                  label="Rechtsgrundlage(n)"
                  value={rgLabels}
                  full
                />
                {t.berechtigtesInteresseDetail && (
                  <FieldRow
                    label="Berechtigtes Interesse (Art. 6 Abs. 1 lit. f)"
                    value={t.berechtigtesInteresseDetail}
                    full
                  />
                )}
                <FieldRow
                  label="Betroffene Personen"
                  value={t.betroffenengruppen}
                  full
                />
                <FieldRow
                  label="Datenkategorien"
                  value={t.datenkategorien}
                  full
                />
                <FieldRow
                  label="Empfänger / Auftragsverarbeiter"
                  value={t.empfaenger.map(
                    (e) =>
                      `${e.name} (${e.land})${e.istAuftragsverarbeiter ? " [AV]" : ""}${e.avvVorhanden ? " ✓AVV" : ""}`
                  )}
                  full
                />
                <FieldRow
                  label="Drittland-Garantie (Art. 44 ff.)"
                  value={drittlandLabel + (t.drittlandDetail ? ` — ${t.drittlandDetail}` : "")}
                  full
                />
                <FieldRow label="Löschfristen" value={t.loeschfristen} full />
                <FieldRow
                  label="Technische und organisatorische Maßnahmen (Art. 32)"
                  value={t.toms}
                  full
                />
                {t.anmerkungen && (
                  <FieldRow label="Anmerkungen" value={t.anmerkungen} full />
                )}
              </View>
            </View>
          );
        })}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {v.bezeichnung} · Verarbeitungsverzeichnis Art. 30 DSGVO · Stand {today}
          </Text>
          <Text
            style={styles.pageNum}
            render={({ pageNumber, totalPages }) =>
              `Seite ${pageNumber} / ${totalPages}`
            }
          />
        </View>
      </Page>
    </Document>
  );

  return await pdf(doc).toBlob();
}
