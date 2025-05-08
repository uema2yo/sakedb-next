import { Request, Response } from "express";
import fs from "fs/promises";
import path from "path";

export const getCountryData = async (req: Request, res: Response) => {    
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json() as any;
    const subregionPath = path.resolve(__dirname, "../public/subregions.json");
    const subregionData: { code: string; label: Record<string, string> }[] = JSON.parse(
      await fs.readFile(subregionPath, "utf8")
    );

    const subregionMap: Record<string, string> = {};
    for (const s of subregionData) {
      for (const label of Object.values(s.label)) {
        subregionMap[label] = s.code;
      }
    }

    const result = countries.map((country: any) => {
      const name = country.name?.common ?? "";
      const translations = country.translations ?? {};
      const subregion = country.subregion ?? "";

      return {
        code: name,
        label: {
          en: name,
          ja: translations.jpn?.common ?? name,
          fr: translations.fra?.common ?? name,
          es: translations.spa?.common ?? name,
          zh: translations.zho?.common ?? name,
          ko: translations.kor?.common ?? name,
        },
        subregion_code: subregionMap[subregion] ?? null,
      };
    });
    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).json({ error: "Failed to fetch country data." });
  }
};
