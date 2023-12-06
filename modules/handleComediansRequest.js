import { sendData, sendError } from "./send.js";
export const handleComediansRequest = async (req, res, comedians, segments) => {
  if (segments.length === 2) {
    const comedian = comedians.find((c) => c.id === segments[1]);

    if (!comedian) {
      throw new Error("Stand up комик не найден");
    }

    sendData(res, comedian);
  }

  sendData(res, comedians);
};
