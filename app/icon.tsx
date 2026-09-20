import { ImageResponse } from "next/og";
import { AppMark } from "@/components/AppMark";

export const size = { width: 48, height: 48 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<AppMark size={size.width} />, size);
}
