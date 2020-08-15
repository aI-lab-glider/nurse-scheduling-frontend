import { useEffect, useState } from "react";

export const useFileReader = (): [string, (srcFile: File) => void] => {
  const fileReader: FileReader = new FileReader();
  const [content, setContent] = useState("");

  useEffect(() => {
    const updateContent = () => {
      setContent(fileReader.result as string);
    };

    fileReader.addEventListener("loadend", updateContent);
    return () => fileReader.removeEventListener("loadend", updateContent);
  }, [fileReader]);

  const setSrcFile = (file: File) => {
    fileReader.readAsText(file);
  };

  return [content, setSrcFile];
};
