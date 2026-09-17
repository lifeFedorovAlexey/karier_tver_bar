import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { RentalSeasons } from "@/components/RentalSeasons";

export const metadata: Metadata = {
  title: "Прокат зимой и летом",
  description:
    "Сезонный прокат на Константиновском карьере: коньки, лыжи, SUP, jet-board и отдых на воде.",
  alternates: { canonical: "/rental" },
};

export default function RentalPage() {
  return (
    <main className="rentalPage">
      <Header overlay />
      <RentalSeasons />
    </main>
  );
}
