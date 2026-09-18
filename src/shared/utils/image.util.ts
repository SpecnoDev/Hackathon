/** TECH_STACK.md: photos are resized on the device before upload, max 1280 px. */
export const PHOTO_MAX_EDGE_PX = 1280;
const PHOTO_JPEG_QUALITY = 0.7;
const PHOTO_MIME = 'image/jpeg';
const BYTES_PER_KB = 1024;
const KB_PER_MB = 1024;

/** Runs in the browser only. Falls back to the original file if the device cannot decode or encode it. */
export const compressImage = async (file: Blob, maxEdge: number = PHOTO_MAX_EDGE_PX): Promise<Blob> => {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext('2d')?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const compressed = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, PHOTO_MIME, PHOTO_JPEG_QUALITY));
    return compressed && compressed.size < file.size ? compressed : file;
  } catch {
    return file;
  }
};

/** "0.6 MB" or "180 KB", for telling a host roughly what an upload will cost in data. */
export const formatDataSize = (bytes: number): string => {
  const kb = bytes / BYTES_PER_KB;
  return kb >= KB_PER_MB ? `${(kb / KB_PER_MB).toFixed(1)} MB` : `${Math.max(1, Math.round(kb))} KB`;
};
