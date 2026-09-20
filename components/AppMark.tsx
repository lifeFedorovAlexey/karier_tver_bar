export function AppMark({ size }: { size: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      role="img"
      aria-label="Карьер"
    >
      <rect width="100" height="100" rx="18" fill="#17241f" />
      <path
        d="M50 16 35 43h9L31 62h13L30 82h40L56 62h13L56 43h9L50 16Z"
        fill="#f4dfb8"
      />
      <path d="M47 82h6V55h-6z" fill="#ddc39a" />
      <path
        d="M19 85c10-4 18-4 28 0 10 4 18 4 34 0"
        fill="none"
        stroke="#ddc39a"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
