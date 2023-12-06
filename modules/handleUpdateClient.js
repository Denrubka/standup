import fs from "node:fs/promises";
import { sendData, sendError } from "./send.js";
import { CLIENTS } from "../index.js";

export const handleUpdateClient = (req, res, segments) => {
  let body = "";
  const ticketNumber = segments[1];
  try {
    req.on("data", (chunk) => {
      body += chunk;
    });
  } catch (error) {
    console.log(`Ошибка при чтении запроса`);
    sendError(res, 500, `Ошибка сервера при чтении запроса ${error}`);
  }

  req.on("end", async () => {
    try {
      const updateDataClient = JSON.parse(body);

      if (
        !updateDataClient.fullName ||
        !updateDataClient.phone ||
        !updateDataClient.ticketNumber ||
        !updateDataClient.booking
      ) {
        sendError(res, 400, "Неверные основные данные");
        return;
      }

      if (
        updateDataClient.booking &&
        (!updateDataClient.booking.length ||
          !Array.isArray(updateDataClient.booking) ||
          !updateDataClient.booking.every((item) => item.comedian && item.time))
      ) {
        sendError(res, 400, "Неверно заполнены поля бронирования");
        return;
      }

      const clientData = await fs.readFile(CLIENTS, "utf8");
      const clients = JSON.parse(clientData);
      const clientIndex = clients.findIndex(
        (c) => c.ticketNumber === ticketNumber
      );

      if (clientIndex === -1) {
        sendError(res, 404, `Клиент с данным номером билета не найден`);
        return;
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateDataClient,
      };

      await fs.writeFile(CLIENTS, JSON.stringify(clients));

      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.error(`error: ${error}`);
      sendError(res, 500, `Ошибка сервера при обновлении данных`);
    }
  });
};