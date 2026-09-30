import { http, saveBlob } from "./http";

/** @param {{projectId?, folderId?, fileType?, search?, page?, limit?}} params */
export const listFiles = (params) => http.list("/files", params);

export const getFile = (id) => http.get(`/files/${id}`);

/**
 * POST /files — multipart upload. The backend field name is `file`.
 * @param {File} file
 * @param {{projectId?, folderId?, clientId?, description?}} meta
 */
export function uploadFile(file, meta = {}) {
  const formData = new FormData();
  formData.append("file", file);
  Object.entries(meta).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  return http.upload("/files", formData);
}

export const updateFile = (id, payload) => http.patch(`/files/${id}`, payload);
export const deleteFile = (id) => http.delete(`/files/${id}`);

/**
 * The download route is behind the JWT guard, so a plain link won't work —
 * we fetch the blob with the auth header and then save it.
 */
export async function downloadFile(id, fallbackName) {
  const { blob, filename } = await http.blob(`/files/${id}/download`);
  saveBlob(blob, filename || fallbackName);
}

/** Object URL for previewing an image/PDF inline. Revoke it when unmounting. */
export async function getFilePreviewUrl(id) {
  const { blob } = await http.blob(`/files/${id}/download`);
  return URL.createObjectURL(blob);
}

/* Folders */
export const listFolders = (params) => http.list("/files/folders", params);
export const getFolder = (id) => http.get(`/files/folders/${id}`);
export const createFolder = (payload) => http.post("/files/folders", payload);
export const updateFolder = (id, payload) =>
  http.patch(`/files/folders/${id}`, payload);
export const deleteFolder = (id) => http.delete(`/files/folders/${id}`);
