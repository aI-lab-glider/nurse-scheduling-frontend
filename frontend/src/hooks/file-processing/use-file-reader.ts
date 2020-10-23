import { useEffect, useState } from "react";

export function useFileReader(): [ArrayBuffer | undefined, (srcFile: File) => void] {
  const fileReader: FileReader = new FileReader();
  const [content, setContent] = useState<ArrayBuffer>();

  useEffect(() => {
    const updateContent = () => setContent(fileReader.result as ArrayBuffer);
    fileReader.addEventListener("loadend", updateContent);
    return () => fileReader.removeEventListener("loadend", updateContent);
  }, [fileReader]);

  function setSrcFile(file: File) {
    fileReader.readAsArrayBuffer(file);
  }
  return [content, setSrcFile];
}
