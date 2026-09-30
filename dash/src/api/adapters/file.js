export function adaptFile(raw) {
  if (!raw) return null;
  return {
    id: raw.id,
    name: raw.name,
    fileType: raw.fileType,
    sizeBytes: raw.sizeBytes ?? null,
    version: raw.version ?? null,
    projectId: raw.projectId ?? null,
    folderId: raw.folderId ?? null,
    uploaderName: raw.uploader
      ? [raw.uploader.firstName, raw.uploader.lastName].filter(Boolean).join(" ")
      : null,
    createdAt: raw.createdAt ?? raw.created_at ?? null,
    raw,
  };
}
