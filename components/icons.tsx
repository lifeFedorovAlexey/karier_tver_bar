type IconProps = { size?: number; className?: string };

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
  "aria-hidden": true,
});

export function PinIcon({ size = 24, className }: IconProps) {
  return <svg {...base(size, className)}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>;
}
export function ClockIcon({ size = 24, className }: IconProps) {
  return <svg {...base(size, className)}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
}
export function PhoneIcon({ size = 20, className }: IconProps) {
  return <svg {...base(size, className)}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c1 .3 1.9.6 2.9.7a2 2 0 0 1 1.7 2Z" /></svg>;
}
export function WaterIcon({ size = 34, className }: IconProps) {
  return <svg {...base(size, className)}><path d="M2 7c3 3 5 3 8 0s5-3 8 0 4 2 4 2M2 13c3 3 5 3 8 0s5-3 8 0 4 2 4 2M2 19c3 3 5 3 8 0s5-3 8 0 4 2 4 2" /></svg>;
}
export function LeafIcon({ size = 34, className }: IconProps) {
  return <svg {...base(size, className)}><path d="M21 3C12 3 5 7 5 14c0 4 3 7 7 7 7 0 9-10 9-18Z" /><path d="M3 21c4-6 8-9 14-12" /></svg>;
}
export function SteamIcon({ size = 34, className }: IconProps) {
  return <svg {...base(size, className)}><path d="M8 3c-3 4 3 5 0 9M13 2c-3 4 3 5 0 9M18 4c-3 4 3 5 0 9" /><path d="M4 17h16M6 21h12" /></svg>;
}

