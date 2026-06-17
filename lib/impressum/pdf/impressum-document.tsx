"use client";

import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type { ImpressumData } from "../types";
import { buildSections } from "../contract";
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
  accentBar: {
    height: 4,
    backgroundColor: COLOR.accent,
    marginBottom: 32,
  },
  topLabel: {
    fontSize: 8,
    letterSpacing: 2.5,
    color: COLOR.faded,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 38,
    fontFamily: "Helvetica-Bold",
    letterSpacing: -0.8,
    color: COLOR.ink,
    lineHeight: 1.1,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 11,
    color: COLOR.dim,
    lineHeight: 1.5,
    marginBottom: 28,
  },
  metaRow: {
    flexDirection: "row",
    gap: 32,
    paddingTop: 14,
    paddingBottom: 14,
    borderTopWidth: 0.5,
    borderTopColor: COLOR.line,
    borderBottomWidth: 0.5,
    borderBottomColor: COLOR.line,
    marginBottom: 32,
  },
  metaLabel: {
    fontSize: 7.5,
    letterSpacing: 1.4,
    color: COLOR.faded,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  metaValue: {
    fontSize: 10,
    color: COLOR.ink,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: COLOR.accent,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  sectionBody: {
    fontSize: 10.5,
    color: COLOR.ink,
    lineHeight: 1.6,
  },
  divider: {
    height: 0.5,
    backgroundColor: COLOR.line,
    marginVertical: 16,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 52,
    right: 52,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 0.5,
    borderTopColor: COLOR.line,
    paddingTop: 6,
  },
  footerText: {
    fontSize: 7.5,
    color: COLOR.faded,
    letterSpacing: 0.5,
  },
  footerBranding: {
    fontSize: 7,
    color: COLOR.accent,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    opacity: 0.55,
  },
  footerPage: {
    fontSize: 7.5,
    color: COLOR.faded,
  },
});

function PageFooter({ data }: { data: ImpressumData }) {
  const name = data.firma || `${data.vorname} ${data.nachname}`.trim() || "—";
  return (
    <View style={styles.footer} fixed>
      <Text style={styles.footerText}>
        Impressum · {name} · Stand: {formatDateDE(new Date(data.letztAktualisiert))}
      </Text>
      <Text style={styles.footerBranding}>compliflow.de · made by DRVN</Text>
      <Text
        style={styles.footerPage}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  );
}

export function ImpressumPdfDocument({ data }: { data: ImpressumData }) {
  const sections = buildSections(data);
  const name = data.firma || `${data.vorname} ${data.nachname}`.trim() || "Unbekannt";

  return (
    <Document
      title={`Impressum ${name}`}
      author="Compliflow · compliflow.de"
      subject="Impressum nach § 5 DDG"
      language="de"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.accentBar} />

        <Text style={styles.topLabel}>Impressumsangaben</Text>
        <Text style={styles.title}>Impressum</Text>
        <Text style={styles.subtitle}>
          gemäß § 5 DDG (Digitale-Dienste-Gesetz), ggf. § 18 MStV (Medienstaatsvertrag),
          § 27a UStG und Verbraucherstreitbeilegungsgesetz (VSBG)
        </Text>

        <View style={styles.metaRow}>
          <View>
            <Text style={styles.metaLabel}>Anbieter</Text>
            <Text style={styles.metaValue}>{name}</Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Stand</Text>
            <Text style={styles.metaValue}>
              {formatDateDE(new Date(data.letztAktualisiert))}
            </Text>
          </View>
          <View>
            <Text style={styles.metaLabel}>Sektionen</Text>
            <Text style={styles.metaValue}>{sections.length}</Text>
          </View>
        </View>

        {sections.map((sec, idx) => (
          <View key={sec.id} style={styles.section} wrap={false}>
            {sec.title && <Text style={styles.sectionTitle}>{sec.title}</Text>}
            <Text style={styles.sectionBody}>{sec.body}</Text>
            {idx < sections.length - 1 && !sec.title && (
              <View style={styles.divider} />
            )}
          </View>
        ))}

        <PageFooter data={data} />
      </Page>
    </Document>
  );
}

export async function renderImpressumPdf(data: ImpressumData): Promise<Blob> {
  const { pdf } = await import("@react-pdf/renderer");
  const doc = <ImpressumPdfDocument data={data} />;
  return await pdf(doc).toBlob();
}
