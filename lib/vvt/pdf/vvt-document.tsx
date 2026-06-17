"use client";

import type { VvtFormData, Verarbeitungstaetigkeit } from "../types";
import {
  RECHTSGRUNDLAGEN_LABELS,
  DRITTLAND_GARANTIE_LABELS,
  DATENHERKUNFT_LABELS,
  DSFA_STATUS_LABELS,
  KI_RISIKO_LABELS,
} from "../types";

export async function renderVvtPdf(data: VvtFormData): Promise<Blob> {
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

  const istAuftragsverarbeiter = data.modus === "auftragsverarbeiter";
  const titel = istAuftragsverarbeiter
    ? "Verarbeitungsverzeichnis"
    : "Verarbeitungsverzeichnis";
  const untertitel = istAuftragsverarbeiter
    ? "nach Art. 30 Abs. 2 DSGVO (Auftragsverarbeiter)"
    : "nach Art. 30 Abs. 1 DSGVO (Verantwortlicher)";

  const C = {
    ink: "#15171B",
    accent: "#1F3D2F",
    accentLight: "#E8F0EC",
    dim: "#4F5359",
    faded: "#8B8E94",
    line: "#E2DDD1",
    warning: "#FFF8ED",
    warningBorder: "#E8A83A",
    warningText: "#9a5d1a",
  };

  const styles = StyleSheet.create({
    page: {
      fontSize: 9.5,
      fontFamily: "Helvetica",
      paddingTop: 0,
      paddingBottom: 52,
      paddingHorizontal: 0,
      color: C.ink,
      backgroundColor: "#ffffff",
    },
    // ── Header-Band ────────────────────────────────────────────
    headerBand: {
      backgroundColor: C.accent,
      padding: "22pt 36pt 18pt 36pt",
      marginBottom: 20,
    },
    headerBandTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    headerTitle: {
      fontSize: 22,
      fontFamily: "Helvetica-Bold",
      letterSpacing: -0.5,
      color: "#FFFFFF",
      marginBottom: 2,
    },
    headerSub: {
      fontSize: 8.5,
      color: "rgba(255,255,255,0.65)",
      letterSpacing: 2,
      textTransform: "uppercase",
    },
    headerBranding: {
      fontSize: 8,
      color: "rgba(255,255,255,0.5)",
      letterSpacing: 1.5,
      textTransform: "uppercase",
      textAlign: "right",
    },
    headerMeta: {
      flexDirection: "row",
      gap: 24,
      paddingTop: 12,
      borderTopWidth: 0.5,
      borderTopColor: "rgba(255,255,255,0.2)",
    },
    headerMetaLabel: {
      fontSize: 7.5,
      color: "rgba(255,255,255,0.55)",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    headerMetaValue: {
      fontSize: 9,
      color: "#FFFFFF",
      fontFamily: "Helvetica-Bold",
    },
    body: { paddingHorizontal: 36 },
    sectionLabel: {
      fontSize: 7.5,
      letterSpacing: 2,
      textTransform: "uppercase",
      color: C.faded,
      marginBottom: 8,
      marginTop: 18,
      paddingBottom: 5,
      borderBottomWidth: 0.5,
      borderBottomColor: C.line,
    },
    verantwortCard: {
      borderLeftWidth: 3,
      borderLeftColor: C.accent,
      paddingLeft: 12,
      marginBottom: 16,
      backgroundColor: C.accentLight,
      paddingRight: 12,
      paddingTop: 10,
      paddingBottom: 10,
    },
    verantwortRow: {
      flexDirection: "row",
      gap: 20,
      flexWrap: "wrap",
    },
    verantwortField: {
      minWidth: "45%",
      marginBottom: 6,
    },
    verantwortLabel: {
      fontSize: 7.5,
      color: C.faded,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 1,
    },
    verantwortValue: {
      fontSize: 9.5,
      color: C.ink,
      lineHeight: 1.4,
    },
    warningBox: {
      backgroundColor: C.warning,
      borderLeftWidth: 3,
      borderLeftColor: C.warningBorder,
      paddingHorizontal: 12,
      paddingVertical: 9,
      marginBottom: 16,
    },
    warningText: {
      fontSize: 8.5,
      color: C.warningText,
      lineHeight: 1.55,
    },
    activityCard: {
      borderWidth: 0.5,
      borderColor: C.line,
      marginBottom: 14,
    },
    activityHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: "#F9F7F4",
      borderBottomWidth: 0.5,
      borderBottomColor: C.line,
      paddingHorizontal: 12,
      paddingVertical: 8,
    },
    activityHeaderLeft: { flex: 1 },
    activityNumber: {
      fontSize: 7.5,
      color: C.faded,
      letterSpacing: 1.5,
      textTransform: "uppercase",
      marginBottom: 2,
    },
    activityTitle: {
      fontSize: 11.5,
      fontFamily: "Helvetica-Bold",
      color: C.ink,
      letterSpacing: -0.2,
    },
    activityBadge: {
      fontSize: 7.5,
      color: C.accent,
      letterSpacing: 0.8,
      borderWidth: 0.5,
      borderColor: C.accent,
      paddingHorizontal: 6,
      paddingVertical: 3,
      backgroundColor: C.accentLight,
      marginLeft: 4,
    },
    activityBody: {
      paddingHorizontal: 12,
      paddingVertical: 10,
    },
    fieldGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    field: { width: "47%", marginBottom: 8 },
    fieldFull: { width: "100%", marginBottom: 8 },
    fieldLabel: {
      fontSize: 7.5,
      color: C.faded,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      marginBottom: 3,
    },
    fieldValue: { fontSize: 9, lineHeight: 1.55, color: C.ink },
    chipRow: { flexDirection: "row", flexWrap: "wrap" },
    chip: {
      fontSize: 8,
      backgroundColor: "#F6F2EA",
      borderWidth: 0.5,
      borderColor: C.line,
      paddingHorizontal: 6,
      paddingVertical: 2.5,
      marginRight: 4,
      marginBottom: 4,
      color: C.ink,
    },
    // ── Übersichtsmatrix ────────────────────────────────────────
    matrixRow: {
      flexDirection: "row",
      borderBottomWidth: 0.5,
      borderBottomColor: C.line,
      paddingVertical: 5,
    },
    matrixHeaderRow: {
      flexDirection: "row",
      backgroundColor: C.accent,
      paddingVertical: 6,
      paddingHorizontal: 4,
    },
    matrixHeaderCell: {
      fontSize: 7,
      color: "#FFFFFF",
      letterSpacing: 1.2,
      textTransform: "uppercase",
      paddingHorizontal: 4,
    },
    matrixCell: {
      fontSize: 8.5,
      color: C.ink,
      paddingHorizontal: 4,
      lineHeight: 1.4,
    },
    // ── Auftraggeber-Card (Modus 2) ─────────────────────────────
    mandantCard: {
      borderWidth: 0.5,
      borderColor: C.line,
      backgroundColor: "#F9F7F4",
      padding: 10,
      marginBottom: 8,
    },
    // ── Footer ─────────────────────────────────────────────────
    footer: {
      position: "absolute",
      bottom: 20,
      left: 36,
      right: 36,
      borderTopWidth: 0.5,
      borderTopColor: C.line,
      paddingTop: 6,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    footerText: { fontSize: 7.5, color: C.faded, letterSpacing: 0.3 },
    pageNum: { fontSize: 7.5, color: C.faded },
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
          {value.map((val, i) => (
            <Text key={i} style={styles.chip}>
              {val}
            </Text>
          ))}
        </View>
      ) : (
        <Text style={styles.fieldValue}>{value || "—"}</Text>
      )}
    </View>
  );

  const renderActivity = (t: Verarbeitungstaetigkeit, idx: number) => {
    const rgLabels = t.rechtsgrundlagen.map(
      (rg) => RECHTSGRUNDLAGEN_LABELS[rg] || rg
    );
    const drittlandLabel =
      DRITTLAND_GARANTIE_LABELS[t.drittlandGarantie] || t.drittlandGarantie;
    const datenherkunftLabel =
      DATENHERKUNFT_LABELS[t.datenherkunft]?.kurz ?? t.datenherkunft;
    const dsfaLabel = DSFA_STATUS_LABELS[t.dsfaStatus] ?? t.dsfaStatus;

    return (
      <View key={t.id} style={styles.activityCard}>
        <View wrap={false}>
          <View style={styles.activityHeader}>
            <View style={styles.activityHeaderLeft}>
              <Text style={styles.activityNumber}>
                VVT-{String(idx + 1).padStart(2, "0")} ·{" "}
                {istAuftragsverarbeiter ? "Art. 30 Abs. 2" : "Art. 30 Abs. 1"} DSGVO
              </Text>
              <Text style={styles.activityTitle}>{t.bezeichnung}</Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              {t.besondereKategorien && (
                <Text style={styles.activityBadge}>ART. 9</Text>
              )}
              {t.kiSysteme.length > 0 &&
                t.kiSysteme.some((k) => k.risikoklasse === "hochrisiko") && (
                  <Text style={styles.activityBadge}>KI HOCHRISIKO</Text>
                )}
              {t.gemeinsamVerantwortlich?.istGemeinsam && (
                <Text style={styles.activityBadge}>ART. 26</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.activityBody}>
          <View style={styles.fieldGrid}>
            <FieldRow label="Zweck der Verarbeitung" value={t.zweck} full />
            <FieldRow label="Rechtsgrundlage(n)" value={rgLabels} full />
            {t.berechtigtesInteresseDetail && (
              <FieldRow
                label="Berechtigtes Interesse — Kurzbegründung"
                value={t.berechtigtesInteresseDetail}
                full
              />
            )}
            {t.lia &&
              (t.lia.zweckIdentifiziert ||
                t.lia.notwendigkeitBegruendet ||
                t.lia.interessenabwaegung) && (
                <View style={styles.fieldFull}>
                  <Text style={styles.fieldLabel}>
                    LIA (Drei-Stufen-Prüfung Art. 6 Abs. 1 lit. f)
                  </Text>
                  <Text style={styles.fieldValue}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>1. Interesse: </Text>
                    {t.lia.zweckIdentifiziert || "—"}
                    {"\n"}
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>2. Erforderlichkeit: </Text>
                    {t.lia.notwendigkeitBegruendet || "—"}
                    {"\n"}
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>3. Abwägung: </Text>
                    {t.lia.interessenabwaegung || "—"}
                  </Text>
                </View>
              )}
            <FieldRow
              label="Betroffene Personen"
              value={t.betroffenengruppen}
              full
            />
            <FieldRow label="Datenkategorien" value={t.datenkategorien} full />
            <FieldRow label="Datenherkunft (Art. 13/14)" value={datenherkunftLabel} />
            <FieldRow label="DSFA-Status (Art. 35)" value={dsfaLabel} />
            {t.gemeinsamVerantwortlich?.istGemeinsam && (
              <View style={styles.fieldFull}>
                <Text style={styles.fieldLabel}>
                  Gemeinsame Verantwortlichkeit (Art. 26 DSGVO)
                </Text>
                <Text style={styles.fieldValue}>
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Partner: </Text>
                  {t.gemeinsamVerantwortlich.partner || "—"}
                  {"\n"}
                  <Text style={{ fontFamily: "Helvetica-Bold" }}>Zuständigkeiten: </Text>
                  {t.gemeinsamVerantwortlich.zustaendigkeit || "—"}
                  {t.gemeinsamVerantwortlich.vereinbarungLink ? (
                    <>
                      {"\n"}
                      <Text style={{ fontFamily: "Helvetica-Bold" }}>Vereinbarung: </Text>
                      {t.gemeinsamVerantwortlich.vereinbarungLink}
                    </>
                  ) : null}
                </Text>
              </View>
            )}
            <FieldRow
              label="Empfänger / Auftragsverarbeiter"
              value={t.empfaenger.map(
                (e) =>
                  `${e.name} (${e.land})${e.istAuftragsverarbeiter ? " [AV]" : ""}${e.avvVorhanden ? " ✓AVV" : ""}${e.avvDokumentLink ? " · " + e.avvDokumentLink : ""}`
              )}
              full
            />
            <FieldRow
              label="Drittland-Garantie (Art. 44 ff.)"
              value={
                drittlandLabel +
                (t.drittlandDetail ? ` — ${t.drittlandDetail}` : "")
              }
              full
            />
            <FieldRow label="Löschfristen" value={t.loeschfristen} full />
            <FieldRow
              label="Technische und organisatorische Maßnahmen (Art. 32)"
              value={t.toms}
              full
            />
            {t.kiSysteme.length > 0 && (
              <View style={styles.fieldFull}>
                <Text style={styles.fieldLabel}>
                  KI-Systeme (EU AI Act)
                </Text>
                {t.kiSysteme.map((k, i) => (
                  <Text key={i} style={styles.fieldValue}>
                    • {k.bezeichnung || "—"} ({k.anbieter || "—"}) —{" "}
                    {KI_RISIKO_LABELS[k.risikoklasse] ?? k.risikoklasse}
                  </Text>
                ))}
              </View>
            )}
            {t.letztGeprueft && (
              <FieldRow
                label="Letzte interne Prüfung"
                value={new Date(t.letztGeprueft).toLocaleDateString("de-DE")}
              />
            )}
            {t.anmerkungen && (
              <FieldRow label="Anmerkungen" value={t.anmerkungen} full />
            )}
          </View>
        </View>
      </View>
    );
  };

  const doc = (
    <Document
      title={`Verarbeitungsverzeichnis — ${v.bezeichnung || "Unbekannt"}`}
      author="Compliflow · compliflow.de"
      subject={`Verarbeitungsverzeichnis nach Art. 30 ${istAuftragsverarbeiter ? "Abs. 2" : "Abs. 1"} DSGVO`}
      language="de"
    >
      <Page size="A4" style={styles.page}>
        {/* Header-Band */}
        <View style={styles.headerBand}>
          <View style={styles.headerBandTop}>
            <View>
              <Text style={styles.headerTitle}>{titel}</Text>
              <Text style={styles.headerSub}>{untertitel}</Text>
            </View>
            <Text style={styles.headerBranding}>compliflow.de{"\n"}made by DRVN</Text>
          </View>
          <View style={styles.headerMeta}>
            <View>
              <Text style={styles.headerMetaLabel}>
                {istAuftragsverarbeiter ? "Auftragsverarbeiter" : "Verantwortlicher"}
              </Text>
              <Text style={styles.headerMetaValue}>{v.bezeichnung || "—"}</Text>
            </View>
            <View>
              <Text style={styles.headerMetaLabel}>Erstellt</Text>
              <Text style={styles.headerMetaValue}>{erstellt}</Text>
            </View>
            <View>
              <Text style={styles.headerMetaLabel}>Stand</Text>
              <Text style={styles.headerMetaValue}>{today}</Text>
            </View>
            <View>
              <Text style={styles.headerMetaLabel}>Tätigkeiten</Text>
              <Text style={styles.headerMetaValue}>{data.taetigkeiten.length}</Text>
            </View>
          </View>
        </View>

        <View style={styles.body}>
          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              Hinweis: Dieses Verzeichnis wurde nach Art. 30{" "}
              {istAuftragsverarbeiter ? "Abs. 2" : "Abs. 1"} DSGVO erstellt. Es ersetzt
              keine Rechtsberatung. Prüfen Sie die Vollständigkeit gemeinsam mit einem
              Datenschutzexperten — insbesondere bei besonderen Kategorien (Art. 9),
              Drittlandübermittlungen (Art. 44 ff.) und KI-Systemen (ab 02.08.2026
              AI Act anwendbar).
            </Text>
          </View>

          {/* I. Verantwortliche / Auftragsverarbeitende Stelle */}
          <Text style={styles.sectionLabel}>
            I. {istAuftragsverarbeiter ? "Auftragsverarbeitende Stelle" : "Verantwortliche Stelle"}
          </Text>
          <View style={styles.verantwortCard}>
            <View style={styles.verantwortRow}>
              <View style={styles.verantwortField}>
                <Text style={styles.verantwortLabel}>Unternehmen</Text>
                <Text style={styles.verantwortValue}>{v.bezeichnung || "—"}</Text>
              </View>
              <View style={styles.verantwortField}>
                <Text style={styles.verantwortLabel}>Vertretung</Text>
                <Text style={styles.verantwortValue}>{v.name || "—"}</Text>
              </View>
              <View style={styles.verantwortField}>
                <Text style={styles.verantwortLabel}>Anschrift</Text>
                <Text style={styles.verantwortValue}>
                  {[v.strasse, `${v.plz || ""} ${v.ort || ""}`.trim(), v.land]
                    .filter(Boolean)
                    .join(", ")}
                </Text>
              </View>
              <View style={styles.verantwortField}>
                <Text style={styles.verantwortLabel}>Kontakt</Text>
                <Text style={styles.verantwortValue}>
                  {[v.email, v.telefon, v.website].filter(Boolean).join(" · ")}
                </Text>
              </View>
              {v.hatDsb && v.dsb && (
                <View style={[styles.verantwortField, { width: "100%" }]}>
                  <Text style={styles.verantwortLabel}>
                    Datenschutzbeauftragter (Art. 37 DSGVO)
                  </Text>
                  <Text style={styles.verantwortValue}>
                    {[v.dsb.name, v.dsb.email, v.dsb.telefon].filter(Boolean).join(" · ")}
                  </Text>
                </View>
              )}
              {v.hatEuVertreter && v.euVertreter && (
                <View style={[styles.verantwortField, { width: "100%" }]}>
                  <Text style={styles.verantwortLabel}>
                    EU-Vertreter (Art. 27 DSGVO)
                  </Text>
                  <Text style={styles.verantwortValue}>
                    {[v.euVertreter.bezeichnung, v.euVertreter.anschrift, v.euVertreter.email]
                      .filter(Boolean)
                      .join(" · ")}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* II. Auftraggeber-Liste (nur bei Modus 2) */}
          {istAuftragsverarbeiter && data.auftraggeber.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>
                II. Auftraggeber / Verantwortliche (Art. 30 Abs. 2 lit. a)
              </Text>
              {data.auftraggeber.map((m, i) => (
                <View key={m.id} style={styles.mandantCard} wrap={false}>
                  <Text style={[styles.verantwortLabel, { marginBottom: 4 }]}>
                    Auftraggeber {String(i + 1).padStart(2, "0")}
                  </Text>
                  <Text style={styles.verantwortValue}>
                    <Text style={{ fontFamily: "Helvetica-Bold" }}>{m.bezeichnung || "—"}</Text>
                    {m.ansprechpartner ? ` · ${m.ansprechpartner}` : ""}
                    {"\n"}
                    {m.anschrift}
                    {"\n"}
                    {m.email}
                    {m.hatDsb && m.dsbKontakt ? `\nDSB: ${m.dsbKontakt}` : ""}
                    {m.avvAbgeschlossen
                      ? `\nAVV abgeschlossen${m.avvDatum ? ` am ${new Date(m.avvDatum).toLocaleDateString("de-DE")}` : ""}`
                      : "\nAVV: ausstehend"}
                  </Text>
                  <Text style={[styles.fieldLabel, { marginTop: 6 }]}>
                    Kategorien der im Auftrag durchgeführten Verarbeitungen
                  </Text>
                  <Text style={styles.fieldValue}>
                    {m.verarbeitungsbeschreibung || "—"}
                  </Text>
                </View>
              ))}
            </>
          )}

          {/* III. Übersichtsmatrix (M5) */}
          {data.taetigkeiten.length > 0 && (
            <>
              <Text style={styles.sectionLabel}>
                {istAuftragsverarbeiter ? "III." : "II."} Übersicht der Verarbeitungstätigkeiten
              </Text>
              <View wrap={false}>
                <View style={styles.matrixHeaderRow}>
                  <Text style={[styles.matrixHeaderCell, { width: "8%" }]}>Nr.</Text>
                  <Text style={[styles.matrixHeaderCell, { width: "38%" }]}>
                    Bezeichnung
                  </Text>
                  <Text style={[styles.matrixHeaderCell, { width: "22%" }]}>
                    Rechtsgrundlage
                  </Text>
                  <Text style={[styles.matrixHeaderCell, { width: "16%" }]}>
                    Drittland
                  </Text>
                  <Text style={[styles.matrixHeaderCell, { width: "16%" }]}>
                    Status
                  </Text>
                </View>
                {data.taetigkeiten.map((t, i) => {
                  const rg = t.rechtsgrundlagen
                    .map((r) => r.replace("art6-1", "Art. 6 ").replace("art9-2", "Art. 9 ").replace("art88", "Art. 88"))
                    .join(", ");
                  const dl = t.drittlandGarantie === "keine-uebermittlung" ? "Nein" :
                    t.drittlandGarantie === "eu-ewr" ? "EU/EWR" : "Drittland";
                  const flags: string[] = [];
                  if (t.besondereKategorien) flags.push("A9");
                  if (t.gemeinsamVerantwortlich?.istGemeinsam) flags.push("A26");
                  if (t.kiSysteme.some((k) => k.risikoklasse === "hochrisiko")) flags.push("KI-HR");
                  if (t.dsfaStatus === "dsfa-ausstehend") flags.push("DSFA-OFFEN");
                  return (
                    <View key={t.id} style={styles.matrixRow} wrap={false}>
                      <Text style={[styles.matrixCell, { width: "8%" }]}>
                        {String(i + 1).padStart(2, "0")}
                      </Text>
                      <Text style={[styles.matrixCell, { width: "38%" }]}>
                        {t.bezeichnung || "—"}
                      </Text>
                      <Text style={[styles.matrixCell, { width: "22%" }]}>{rg || "—"}</Text>
                      <Text style={[styles.matrixCell, { width: "16%" }]}>{dl}</Text>
                      <Text style={[styles.matrixCell, { width: "16%" }]}>
                        {flags.length > 0 ? flags.join(" · ") : "OK"}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </>
          )}

          {/* IV. Detail-Tätigkeiten */}
          <Text style={styles.sectionLabel}>
            {istAuftragsverarbeiter ? "IV." : "III."} Detail der Verarbeitungstätigkeiten ({data.taetigkeiten.length})
          </Text>
          {data.taetigkeiten.map((t, idx) => renderActivity(t, idx))}
        </View>

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            {v.bezeichnung} · Verarbeitungsverzeichnis Art. 30{" "}
            {istAuftragsverarbeiter ? "Abs. 2" : "Abs. 1"} DSGVO · Stand {today}
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
