import { api } from "@/services/api";

export const getPresignedUrl = async (
  fileName: string,
  fileType: string,
  assignmentId: number,
): Promise<{ signedUrl: string; key: string }> => {
  const res = await api.post("/storage/presigned-url", {
    fileName,
    fileType,
    assignmentId,
  });
  return res.data;
};

export const confirmUpload = async (
  assignmentId: number,
  key: string,
  fileName: string,
  mimeType: string,
  size: number,
): Promise<{ success: boolean; id: number }> => {
  const res = await api.post("/storage/confirm-upload", {
    assignmentId,
    key,
    fileName,
    mimeType,
    size,
  });
  return res.data;
};

export const getReadUrl = async (
  fileKey: string,
): Promise<{ signedUrl: string }> => {
  const res = await api.get("/storage/read-url", {
    params: { fileKey },
  });
  return res.data;
};

export const deleteFile = async (
  key: string,
): Promise<{ success: boolean }> => {
  const res = await api.delete("/storage/delete-file", { data: { key } });
  return res.data;
};
