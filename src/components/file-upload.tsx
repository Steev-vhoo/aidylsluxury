"use client";

import { upload } from "@vercel/blob/client";
import { useId, useState } from "react";
import { CloseIcon, UploadIcon } from "./icons";

type Props = {
  name: string; // hidden input name; value is JSON array of URLs
  folder: "inquiries" | "products" | "gallery" | "rentals";
  maxFiles?: number;
  maxMb?: number;
  accept?: string;
  label: string;
  hint?: string;
  initial?: string[];
  onChange?: (urls: string[]) => void;
};

export function FileUpload({ name, folder, maxFiles = 3, maxMb = 10, accept = "image/*,application/pdf", label, hint, initial = [], onChange }: Props) {
  const id = useId();
  const [urls, setUrls] = useState<string[]>(initial);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(next: string[]) {
    setUrls(next);
    onChange?.(next);
  }

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setError(null);
    const list = Array.from(files).slice(0, maxFiles - urls.length);
    if (list.some((f) => f.size > maxMb * 1024 * 1024)) {
      setError(`Each file must be ${maxMb} MB or smaller.`);
      return;
    }
    setBusy(true);
    try {
      const done: string[] = [];
      for (const f of list) {
        const safe = f.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const res = await upload(`${folder}/${safe}`, f, { access: "public", handleUploadUrl: "/api/upload" });
        done.push(res.url);
      }
      update([...urls, ...done]);
    } catch (e) {
      setError((e as Error).message.includes("not configured") ? "Uploads aren’t switched on yet. You can send pictures on WhatsApp instead." : "Upload failed. Please try again or send pictures on WhatsApp.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[13px] font-semibold">{label}</span>
      <input type="hidden" name={name} value={JSON.stringify(urls)} />
      {urls.length < maxFiles && (
        <label htmlFor={id} className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-[1.5px] border-dashed border-[#bfa77f] bg-cream/40 p-6 text-center text-sm text-muted hover:bg-cream">
          <UploadIcon className="text-gold-text" size={26} />
          <span>{busy ? "Uploading…" : <>Drag files here or <span className="font-semibold text-gold-text">browse</span></>}</span>
          <span className="text-xs">{hint ?? `Up to ${maxFiles} files, ${maxMb} MB each`}</span>
          <input id={id} type="file" multiple={maxFiles > 1} accept={accept} className="sr-only" disabled={busy} onChange={(e) => onFiles(e.target.files)} />
        </label>
      )}
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {urls.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {urls.map((u, i) => (
            <li key={u} className="flex items-center gap-2 rounded-full border border-line py-1 pr-1 pl-3 text-xs">
              File {i + 1}
              <button type="button" aria-label={`Remove file ${i + 1}`} onClick={() => update(urls.filter((x) => x !== u))} className="flex size-7 cursor-pointer items-center justify-center rounded-full hover:bg-cream">
                <CloseIcon size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
