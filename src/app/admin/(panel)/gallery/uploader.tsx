"use client";

import { useState, useTransition } from "react";
import { FileUpload } from "@/components/file-upload";
import { addPhotos } from "@/lib/actions/admin";

export function GalleryUploader({ albums }: { albums: string[] }) {
  const [urls, setUrls] = useState<string[]>([]);
  const [album, setAlbum] = useState(albums[0]);
  const [key, setKey] = useState(0);
  const [pending, start] = useTransition();

  function save() {
    const f = new FormData();
    f.set("urls", JSON.stringify(urls));
    f.set("album", album);
    start(async () => {
      await addPhotos(f);
      setUrls([]);
      setKey((k) => k + 1);
    });
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-end gap-4">
        <label className="label min-w-48">Album<select className="field" value={album} onChange={(e) => setAlbum(e.target.value)}>{albums.map((a) => <option key={a}>{a}</option>)}</select></label>
        <p className="text-xs text-muted">Use only photos Lydia took or has rights to. Add a caption after uploading.</p>
      </div>
      <FileUpload key={key} name="urls" folder="gallery" maxFiles={20} maxMb={15} accept="image/jpeg,image/png,image/webp" label="Photos" hint="Up to 20 photos at a time" onChange={setUrls} />
      <button type="button" className="btn self-start" disabled={!urls.length || pending} onClick={save}>
        {pending ? "Saving…" : `Add ${urls.length || ""} photo${urls.length === 1 ? "" : "s"} to ${album}`}
      </button>
    </div>
  );
}
