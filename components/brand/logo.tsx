type LogoProps = {
  variant?: "mark" | "wordmark" | "lockup";
  className?: string;
  size?: number;
};

export function Logo({ variant = "lockup", className, size = 40 }: LogoProps) {
  if (variant === "mark") {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width={size}
        height={size}
        fill="none"
        role="img"
        aria-label="Compliflow"
        className={className}
      >
        <path
          d="M203.37 75.23 A 92 92 0 1 0 203.37 180.77"
          stroke="#FF4D00"
          strokeWidth={20}
          strokeLinecap="round"
        />
        <path
          d="M173.88 95.88 A 56 56 0 1 0 173.88 160.12"
          stroke="currentColor"
          strokeWidth={20}
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (variant === "wordmark") {
    return (
      <span
        className={className}
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          fontSize: size,
          lineHeight: 1,
          color: "currentColor",
        }}
        aria-label="Compliflow"
      >
        complif<span style={{ color: "#FF4D00" }}>l</span>ow
      </span>
    );
  }

  return (
    <span
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: size * 0.3 }}
      aria-label="Compliflow"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 256"
        width={size}
        height={size}
        fill="none"
      >
        <path
          d="M203.37 75.23 A 92 92 0 1 0 203.37 180.77"
          stroke="#FF4D00"
          strokeWidth={20}
          strokeLinecap="round"
        />
        <path
          d="M173.88 95.88 A 56 56 0 1 0 173.88 160.12"
          stroke="currentColor"
          strokeWidth={20}
          strokeLinecap="round"
        />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          fontSize: size * 0.78,
          lineHeight: 1,
          color: "currentColor",
        }}
      >
        complif<span style={{ color: "#FF4D00" }}>l</span>ow
      </span>
    </span>
  );
}
