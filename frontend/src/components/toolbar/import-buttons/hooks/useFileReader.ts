import { useEffect, useState } from "react";

export const useFileReader = (): [ArrayBuffer | undefined, (srcFile: File) => void] => {
  const fileReader: FileReader = new FileReader();
  const [content, setContent] = useState<ArrayBuffer>();

  useEffect(() => {
    const updateContent = () => {
      setContent(fileReader.result as ArrayBuffer);
    };

    fileReader.addEventListener("loadend", updateContent);
    return () => fileReader.removeEventListener("loadend", updateContent);
  }, [fileReader]);

  const setSrcFile = (file: File) => {
    fileReader.readAsArrayBuffer(file);
  };

  return [content, setSrcFile];
};
