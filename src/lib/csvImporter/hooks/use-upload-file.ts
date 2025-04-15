import * as React from "react"
import type { UploadedFile } from "@/lib/csvImporter/type"
import { toast } from "sonner"
import type { UploadFilesOptions } from "uploadthing/types"

import { getErrorMessage } from "@/lib/sanitized/handle-error"
import { uploadFiles } from "@/lib/csvImporter/uploadthing"

type UploadFileOptions = {
  headers?: Record<string, string>;
  onUploadBegin?: (opts: { file: string }) => void;
  onUploadProgress?: (opts: { 
    file: File; 
    progress: number; 
    loaded: number; 
    delta: number; 
    totalLoaded: number; 
    totalProgress: number; 
  }) => void;
};

interface UseUploadFileProps extends UploadFileOptions {
  defaultUploadedFiles?: UploadedFile[];
}

export function useUploadFile(
  endpoint: "csvUploader",
  { defaultUploadedFiles = [], ...props }: UseUploadFileProps = {}
) {
  const [uploadedFiles, setUploadedFiles] =
    React.useState<UploadedFile[]>(defaultUploadedFiles);
  const [progresses, setProgresses] = React.useState<Record<string, number>>({});
  const [isUploading, setIsUploading] = React.useState(false);

  async function onUpload(files: File[]) {
    setIsUploading(true);
    try {
      const res = await uploadFiles(endpoint, {
        ...props,
        files,
        onUploadProgress: (opts) => {
          setProgresses((prev) => ({
            ...prev,
            [opts.file.name]: opts.progress,
          }));
        },
      });

      setUploadedFiles((prev) => (prev ? [...prev, ...res] : res));
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setProgresses({});
      setIsUploading(false);
    }
  }

  return {
    onUpload,
    uploadedFiles,
    progresses,
    isUploading,
  };
}
