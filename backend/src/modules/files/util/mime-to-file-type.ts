import { FileType } from '@/common/enums/index.enum';

export function mimeToFileType(mime: string | undefined | null): FileType {
  if (!mime) return FileType.OTHER;
  if (mime === 'application/pdf') return FileType.PDF;
  if (mime.startsWith('image/')) return FileType.IMAGE;
  if (mime.startsWith('video/')) return FileType.VIDEO;
  if (
    mime === 'application/vnd.ms-excel' ||
    mime ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    mime === 'text/csv'
  ) {
    return FileType.SPREADSHEET;
  }
  if (
    mime === 'application/msword' ||
    mime ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return FileType.DOC;
  }
  return FileType.OTHER;
}
