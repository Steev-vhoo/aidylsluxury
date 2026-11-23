"use client";

import { useState } from "react";
import type { CatalogPhoto } from "@/lib/data";
import { SocialLinks } from "./social-links";
import { Photo } from "./ui";

export function PortfolioGrid({ photos, albums }: { photos: CatalogPhoto[]; albums: string[] }) {
  const [album, setAlbum] = useState("All");
  const shown = album === "All" ? photos : photos.filter((p) => p.album === album);

  return (
    <div className="flex flex-col gap-6">
      {photos.length > 0 && <div role="group" aria-label="Filter by event type" className="flex flex-wrap justify-center gap-2">
        {["All", ...albums].map((a) => (
          <button
            key={a}
            type="button"
            aria-pressed={album === a}
            onClick={() => setAlbum(a)}
            className={`min-h-11 cursor-pointer rounded-full border-[1.5px] border-gold px-4 text-sm font-semibold ${album === a ? "bg-gold text-ink" : "bg-white text-body"}`}
          >
            {a}
          </button>
        ))}
      </div>}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-white px-6 py-14 text-center">
          <p className="max-w-xl leading-relaxed text-muted">Our full gallery is on its way. In the meantime, see our latest set-ups and gift packages on Instagram and TikTok.</p>
          <SocialLinks tone="onLight" size={48} includeWhatsApp={false} className="justify-center" />
        </div>
      ) : shown.length === 0 ? (
        <p className="rounded-2xl bg-white p-10 text-center text-muted">No photos in this album yet.</p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {shown.map((p, i) => (
            <figure key={p.id} className="mb-4 break-inside-avoid">
              <Photo src={p.url} alt={p.caption || `${p.album} event`} className={`rounded-2xl ${["h-80", "h-60", "h-72"][i % 3]}`} />
              <figcaption className="mt-2 flex justify-between gap-3 text-[13px]">
                <strong>{p.caption}</strong>
                <span className="text-muted">{p.album}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </div>
  );
}
