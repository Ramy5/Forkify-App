import { async } from "regenerator-runtime";
import { TIMEOUT_SEC } from "./config";

// FOR STOP GETTING DATA IN CASE SLOW INTERNET AFTER CERTAIN TIME.
const timeout = (s) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

/**
 * Function that help us to send our data to the api and get data from api
 * then render it to page.
 * @param {String}} url api
 * @param {undefined | Object} dataUpload data we sent to api
 * @returns data from api
 */
export const ajax = async (url, dataUpload = undefined) => {
  try {
    const fetchData = !dataUpload
      ? fetch(url)
      : fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataUpload),
        });
    const res = await Promise.race([fetchData, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
