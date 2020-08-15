import { useEffect, useState } from "react";
import { ScheduleDataModel } from "../../../../state/models";
import { useFileReader } from "./useFileReader";

export const useScheduleConverter = (): [ScheduleDataModel, (srcFile: File) => void] => {
  const [textContent, setSrcFile] = useFileReader();
  const [schedule, setSchedule] = useState({});

  useEffect(() => {
    const convertedContent = convertToSchedule(textContent);
    setSchedule(convertedContent);
  }, [textContent]);

  const convertToSchedule = (textContent: string): ScheduleDataModel => {
    return {
      schedule: [
        [1, 2, 3],
        [1, 2, 3],
      ],
    };
  };
  return [schedule, setSrcFile];
};
