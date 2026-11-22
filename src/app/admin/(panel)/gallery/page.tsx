import { asc, desc } from "drizzle-orm";
import { deletePhoto, updatePhoto } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/auth";
import { portfolioAlbums } from "@/lib/content";
import { db, schema } from "@/lib/db";
import { GalleryUploader } from "./uploader";

export const metadata = { title: "Portfolio photos" };

export const instant = false;

export default async function GalleryAdmin() {
  await requireAdmin();
  if (!db) return null;
  const photos = await db.select().from(schema.galleryPhotos).orderBy(asc(schema.galleryPhotos.sort), desc(schema.galleryPhotos.createdAt));
  const albums = [...portfolioAlbums, "Homepage hero"];
  return (
    <div className="flex flex-col gap-5">
      <div><h1 className="text-2xl font-bold">Portfolio photos</h1><p className="text-sm text-muted">Photos shown on the Portfolio page. Featured photos also appear on the homepage (the first one is the hero image).</p></div>
      <GalleryUploader albums={albums} />
      {photos.length === 0 ? (
        <p className="rounded-2xl bg-white p-8 text-center text-muted">No photos yet.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="flex flex-col gap-2.5 rounded-2xl border border-line bg-white p-2.5">
              <img src={p.url} alt={p.caption} className="aspect-[4/3] w-full rounded-xl object-cover" />
              <form action={updatePhoto} className="flex flex-col gap-2">
                <input type="hidden" name="id" value={p.id} />
                <label className="label text-xs">Caption<input className="field min-h-10 text-sm" name="caption" defaultValue={p.caption} placeholder="Event name, venue" /></label>
                <div className="flex gap-2">
                  <label className="label flex-1 text-xs">Album<select className="field min-h-10 text-sm" name="album" defaultValue={p.album}>{albums.map((a) => <option key={a}>{a}</option>)}</select></label>
                  <label className="label w-20 text-xs">Order<input className="field min-h-10 text-sm" type="number" name="sort" defaultValue={p.sort} /></label>
                </div>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="featured" defaultChecked={p.featured} className="size-4.5 accent-gold-text" />Feature on homepage</label>
                <button className="btn min-h-10">Save</button>
              </form>
              <form action={deletePhoto}><input type="hidden" name="id" value={p.id} /><button className="min-h-10 w-full cursor-pointer text-sm font-semibold text-red-700">Delete</button></form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
