"use client";

import { useDatenschutzStore } from "@/lib/datenschutz/store";
import { Field } from "@/components/avv/field";
import {
  PAYMENT_LABELS,
  VERSAND_LABELS,
  BEWERTUNG_LABELS,
  AUSKUNFTEI_LABELS,
  type PaymentProvider,
  type Versanddienstleister,
  type Bewertungssystem,
  type Auskunftei,
} from "@/lib/datenschutz/types";

const PAYMENT_ORDER: PaymentProvider[] = [
  "stripe",
  "paypal",
  "klarna",
  "sofort",
  "amazon_pay",
  "apple_pay",
  "google_pay",
  "rechnung",
  "ueberweisung",
  "lastschrift",
];

const VERSAND_ORDER: Versanddienstleister[] = [
  "dhl",
  "hermes",
  "dpd",
  "gls",
  "ups",
  "fedex",
  "deutsche_post",
  "trans_o_flex",
  "andere",
];

const BEWERTUNG_ORDER: Bewertungssystem[] = [
  "keiner",
  "trusted_shops",
  "ekomi",
  "trustpilot",
  "google_reviews",
  "ausgezeichnet_org",
  "shopvote",
];

const AUSKUNFTEI_ORDER: Auskunftei[] = [
  "schufa",
  "creditreform",
  "infoscore",
  "crif_buergel",
  "boniversum",
];

export function StepEcommerce() {
  const data = useDatenschutzStore((s) => s.data);
  const patch = useDatenschutzStore((s) => s.patch);

  const updateE = <K extends keyof typeof data.ecommerce>(
    key: K,
    value: (typeof data.ecommerce)[K],
  ) => {
    patch({ ecommerce: { ...data.ecommerce, [key]: value } });
  };

  const togglePayment = (p: PaymentProvider) => {
    if (data.payment.includes(p)) {
      patch({ payment: data.payment.filter((x) => x !== p) });
    } else {
      patch({ payment: [...data.payment, p] });
    }
  };

  const toggleVersand = (v: Versanddienstleister) => {
    if (data.ecommerce.versand.includes(v)) {
      updateE("versand", data.ecommerce.versand.filter((x) => x !== v));
    } else {
      updateE("versand", [...data.ecommerce.versand, v]);
    }
  };

  const toggleAuskunftei = (a: Auskunftei) => {
    const current = data.ecommerce.auskunftei ?? [];
    if (current.includes(a)) {
      updateE("auskunftei", current.filter((x) => x !== a));
    } else {
      updateE("auskunftei", [...current, a]);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <p className="text-ink-dim font-body text-[14px] leading-[1.6]">
        Hast du einen Online-Shop oder nimmst du Bestellungen entgegen?
      </p>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={data.ecommerce.bestellungen}
          onChange={(e) => updateE("bestellungen", e.target.checked)}
          className="mt-1 h-4 w-4 accent-accent"
        />
        <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
          <strong className="text-ink">Wir verkaufen / nehmen Bestellungen entgegen</strong>
        </span>
      </label>

      {data.ecommerce.bestellungen && (
        <>
          {/* Payment */}
          <div className="border-t border-line pt-6">
            <Field label="Zahlungsanbieter" hint="Mehrfach-Auswahl möglich">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PAYMENT_ORDER.map((p) => {
                  const selected = data.payment.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePayment(p)}
                      className={
                        "px-3 py-2.5 text-left border transition flex items-center justify-between " +
                        (selected
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-bg-soft hover:border-accent")
                      }
                    >
                      <span className="font-body text-[14px] leading-[1.6] font-medium text-ink">
                        {PAYMENT_LABELS[p]}
                      </span>
                      {selected && (
                        <span className="font-mono text-[10px] text-accent">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Versand */}
          <div className="border-t border-line pt-6">
            <Field label="Versanddienstleister" hint="Mehrfach-Auswahl möglich">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {VERSAND_ORDER.map((v) => {
                  const selected = data.ecommerce.versand.includes(v);
                  return (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleVersand(v)}
                      className={
                        "px-3 py-2.5 text-left border transition flex items-center justify-between " +
                        (selected
                          ? "border-accent bg-accent-soft"
                          : "border-line bg-bg-soft hover:border-accent")
                      }
                    >
                      <span className="font-body text-[14px] leading-[1.6] font-medium text-ink">
                        {VERSAND_LABELS[v]}
                      </span>
                      {selected && (
                        <span className="font-mono text-[10px] text-accent">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Bewertungssystem */}
          <div className="border-t border-line pt-6">
            <Field label="Bewertungssystem">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {BEWERTUNG_ORDER.map((b) => {
                  const isActive = data.ecommerce.bewertungssystem === b;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => updateE("bewertungssystem", b)}
                      className={
                        "px-3 py-2.5 text-left border transition text-sm " +
                        (isActive
                          ? "border-accent bg-accent-soft text-ink"
                          : "border-line bg-bg-soft hover:border-accent")
                      }
                    >
                      {BEWERTUNG_LABELS[b]}
                    </button>
                  );
                })}
              </div>
            </Field>
          </div>

          {/* Bonitätsprüfung */}
          <div className="border-t border-line pt-6">
            <label className="flex items-start gap-3 cursor-pointer group mb-4">
              <input
                type="checkbox"
                checked={data.ecommerce.bonitaetspruefung}
                onChange={(e) => updateE("bonitaetspruefung", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <div>
                <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                  <strong className="text-ink">Bonitätsprüfung</strong> (z.B. bei Rechnungskauf oder
                  Lastschrift)
                </span>
              </div>
            </label>

            {data.ecommerce.bonitaetspruefung && (
              <Field label="Auskunftei" required hint="Mehrfach-Auswahl möglich">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {AUSKUNFTEI_ORDER.map((a) => {
                    const selected = (data.ecommerce.auskunftei ?? []).includes(a);
                    return (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAuskunftei(a)}
                        className={
                          "px-3 py-2.5 text-left border transition flex items-center justify-between " +
                          (selected
                            ? "border-accent bg-accent-soft"
                            : "border-line bg-bg-soft hover:border-accent")
                        }
                      >
                        <span className="font-body text-[14px] leading-[1.6] font-medium text-ink">
                          {AUSKUNFTEI_LABELS[a]}
                        </span>
                        {selected && (
                          <span className="font-mono text-[10px] text-accent">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </Field>
            )}
          </div>

          {/* Treueprogramm + BNPL */}
          <div className="border-t border-line pt-6 flex flex-col gap-3">
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.ecommerce.treueprogramm}
                onChange={(e) => updateE("treueprogramm", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Treueprogramm / Kundenkarte</strong>
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={data.ecommerce.bnpl_aktiv}
                onChange={(e) => updateE("bnpl_aktiv", e.target.checked)}
                className="mt-1 h-4 w-4 accent-accent"
              />
              <span className="font-body text-[14px] leading-[1.6] text-ink-dim group-hover:text-ink transition">
                <strong className="text-ink">Buy Now Pay Later (BNPL)</strong> aktiviert
                (z.B. Klarna Ratenkauf)
              </span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}
