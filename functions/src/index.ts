import * as dotenv from "dotenv";
dotenv.config();
import * as functions from "firebase-functions";
import axios from "axios";
import next from "next";
import express from "express";
import cors from "cors";
import { getCountryData } from "./api/country";

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const apiKey = process.env.MLIT_DATA_API_KEY || "";
const endPoint = process.env.MLIT_DATA_API_ENDPOINT || "";

const initPromise = (async () => {
  await nextApp.prepare();
  const app = express();

  app.use(cors({ origin: true }));

  app.get("/api/country", getCountryData);

  app.get("/api/prefecture", async (req, res) => {
    try {
      const response = await axios.post(
        endPoint,
        {
          query: `
            query {
              prefecture {
                code
                name
              }
            }
          `,
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
          },
        }
      );
      return res.json(response.data?.data?.prefecture);
    } catch (error: any) {
      console.error("MLIT API error:", error.response?.data || error.message);
      return res
        .status(500)
        .json({ error: "Failed to fetch prefecture data from MLIT." });
    }
  });

  app.get("/api/city", async (req, res) => {
    const prefCode = req.query.prefCode as string;
  
    if (!prefCode) {
      return res.status(400).json({ error: "prefCode is required" });
    }
  
    try {
      const response = await axios.post(
        endPoint,
        {
          query: `
            query ($prefCodes: [Any!]) {
              municipalities(prefCodes: $prefCodes) {
                code
                prefecture_code
                name
              }
            }
          `,
          variables: { prefCodes: [String(prefCode)] }
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
          },
        }
      );
      return res.json(response.data?.data?.municipalities);
    } catch (error: any) {
      console.error("MLIT API error detail:", {
        data: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
      });      
      return res.status(500).json({ error: "Failed to fetch municipalities data from MLIT." });
    }
  });

  app.all(/^.*$/, (req, res) => {

    console.log("🔁 Fallback route hit:", req.method, req.url);
    return handle(req, res);
  });
  return app;
})();

export const nextjs = functions.https.onRequest(async (req, res) => {
  const app = await initPromise;
  return app(req, res);
});
