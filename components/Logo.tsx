interface LogoProps {
  className?: string;
}

/**
 * SplitWrite mark: a coin with a division sign — "divide the money".
 * Scales cleanly from favicon size up to the header logo.
 */
export default function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="SplitWrite logo"
    >
      <rect width="32" height="32" rx="8" fill="url(#splitwrite-grad)" />
      <circle
        cx="16"
        cy="16"
        r="8.5"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <circle cx="16" cy="11.4" r="1.5" fill="white" />
      <rect x="10.3" y="15" width="11.4" height="2" rx="1" fill="white" />
      <circle cx="16" cy="20.6" r="1.5" fill="white" />
      <defs>
        <linearGradient
          id="splitwrite-grad"
          x1="0"
          y1="0"
          x2="32"
          y2="32"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2f6fed" />
          <stop offset="1" stopColor="#1748ad" />
        </linearGradient>
      </defs>
    </svg>
  );
}
