export interface ClientPhoto {
  id: string;
  src: string;
  name: string;
  event: string;
}

type PhotoRecord = Record<string, unknown>;

function isRecord(value: unknown): value is PhotoRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function photoList(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload;
  if (!isRecord(payload)) return [];

  for (const key of ['photos', 'images', 'items', 'media']) {
    if (Array.isArray(payload[key])) return payload[key] as unknown[];
  }

  return [];
}

function firstString(record: PhotoRecord, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return undefined;
}

function imageUrl(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value.trim()) return undefined;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

function toClientPhoto(value: unknown, index: number): ClientPhoto | undefined {
  const record = typeof value === 'string' ? { url: value } : isRecord(value) ? value : undefined;
  if (!record) return undefined;

  const src = imageUrl(firstString(record, ['src', 'url', 'imageUrl', 'image', 'thumbnailUrl', 'thumbnail']));
  if (!src) return undefined;

  return {
    id: firstString(record, ['id', 'key']) ?? `${src}-${index}`,
    src,
    name: firstString(record, ['name', 'title', 'alt']) ?? '',
    event: firstString(record, ['event', 'description', 'caption']) ?? '',
  };
}

export async function fetchClientPhotos(sourceUrl: string, signal?: AbortSignal): Promise<ClientPhoto[]> {
  const source = new URL(sourceUrl);
  if (source.protocol !== 'https:' && source.protocol !== 'http:') {
    throw new Error('The photo feed URL must use HTTP or HTTPS.');
  }

  const response = await fetch(source, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`Photo feed request failed (${response.status}).`);

  const payload: unknown = await response.json();
  return photoList(payload)
    .map(toClientPhoto)
    .filter((photo): photo is ClientPhoto => Boolean(photo));
}
