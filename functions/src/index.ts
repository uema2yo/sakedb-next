import * as dotenv from "dotenv";
dotenv.config();

import * as functions from "firebase-functions";
import axios from "axios";
import next from "next";
import express from "express";
import cors from "cors";

const app = express();
const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
const apiKey = process.env.MLIT_DATA_API_KEY || "";
const endPoint = process.env.MLIT_DATA_API_ENDPOINT || "";
let isReady = false;

app.use(cors({ origin: true }));
nextApp.prepare().then(() => {
  console.log("api", apiKey, endPoint);
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
      res.json(response.data?.data?.prefecture);
    } catch (error: any) {
      console.error("MLIT API error:", error.response?.data || error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch prefecture data from MLIT." });
    }
  });

  app.get("/api/city", async (req, res):Promise<void> => {

    const prefCode = req.query.prefCode as string;

    if (!prefCode) {
      res.status(400).json({ error: "prefCode is required" });
    }
  
    try {
      const response = await axios.post(
        endPoint,
        {
          query: `
            query{
              municipalities(prefCodes:["${prefCode}"]) {
                code
                prefecture_code
                name
              }
            }
          `
        },
        {
          headers: {
            "Content-Type": "application/json",
            apikey: apiKey,
          },
        }
      );
      res.json(response.data?.data?.municipalities);
    } catch (error: any) {
      console.error("MLIT API error:", error.response?.data || error.message);
      res
        .status(500)
        .json({ error: "Failed to fetch municipalities data from MLIT." });
    }
  });

  app.use((req, res) => {
    return handle(req, res);
  });

  isReady = true;
});

exports.nextjs = functions.https.onRequest((req, res) => {
  if (!isReady) {
    res.status(503).send("Server not ready");
  } else {
    app(req, res); // ← app を呼び出す
  }
});
