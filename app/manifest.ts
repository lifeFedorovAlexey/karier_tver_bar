import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Карьер — кафе, баня и прокат в Твери",
    short_name: "Карьер",
    description:
      "Кафе, баня и сезонный прокат на Константиновских карьерах в Твери.",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf8f1",
    theme_color: "#17241f",
    lang: "ru-RU",
    icons: [
      {
        src: "/icon.png",
        sizes: "48x48",
        type: "image/png",
      },
      {
        src: "/apple-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
