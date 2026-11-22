import type { Metadata } from "next";
import { RentalBooking } from "@/components/rental-booking";
import { PageHero } from "@/components/ui";
import { getRentalItems } from "@/lib/data";
import { paystackEnabled } from "@/lib/paystack";

export const metadata: Metadata = { title: "Book Rentals" };

export default async function RentalsPage() {
  const items = await getRentalItems();
  return (
    <>
      <PageHero
        crumb="Home / Services / Rentals"
        title="Book Rentals"
        intro="Tents, seating, tables, tableware and décor. Choose your items and dates, then pay in full online. Your dates are reserved for you and not offered to other clients."
      />
      <section className="container-x py-8 pb-20">
        <RentalBooking items={items} paymentsOn={paystackEnabled()} />
      </section>
    </>
  );
}
