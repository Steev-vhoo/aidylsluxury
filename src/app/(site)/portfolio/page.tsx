import { media } from "@/lib/media";
import type { Metadata } from "next";
import { PortfolioGrid } from "@/components/portfolio-grid";
import { CtaBand, PageHero } from "@/components/ui";
import { portfolioAlbums } from "@/lib/content";
import { getGalleryPhotos } from "@/lib/data";

export const metadata: Metadata = { title: "Portfolio", description: "Corporate events, weddings, NGO launches and private celebrations planned and styled by Aidyl’s Luxury." };

export default async function PortfolioPage() {
  const photos = await getGalleryPhotos();
  return (
    <>
      <PageHero image={media.goldTable} title="Our Work" intro="Conferences, launches, weddings and celebrations we’ve planned and styled." />
      <section className="bg-cream py-16">
        <div className="container-x">
          <PortfolioGrid photos={photos} albums={portfolioAlbums} />
        </div>
      </section>
      <CtaBand title="Like what you see? Let's create yours." />
    </>
  );
}
