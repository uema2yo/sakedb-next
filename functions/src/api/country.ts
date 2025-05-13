import { Request, Response } from "express";
import path from "path";
import fs from "fs/promises";

export const getCountryData = async (req: Request, res: Response) => {    
  try {
    const response = await fetch("https://restcountries.com/v3.1/all");
    const countries = await response.json() as any;
    const subregionPath = path.resolve(__dirname, "../public/subregions.json");
    const subregionData: { code: string; label: Record<string, string> }[] = JSON.parse(
      await fs.readFile(subregionPath, "utf8")
    );

    const subregionMap: Record<string, string> = {};
    console.log(subregionData);
    for (const s of subregionData) {
      subregionMap[s.label.en] = s.code;
      /*
      for (const label of Object.values(s.label)) {
        subregionMap[label] = s.code;
      }*/
    }

    const result = countries.map((country: any) => {
      const cca2 = country.cca2;
      const name = country.name?.common ?? "";
      const translations = country.translations ?? {};
      const subregion = country.subregion ?? country.region ?? "999";

      return {
        code: cca2,
        label: {
          en: name,
          ja: translations.jpn?.common ?? name,
          fr: translations.fra?.common ?? name,
          es: translations.spa?.common ?? name,
          zh: translations.zho?.common ?? name,
          ko: translations.kor?.common ?? name,
        },
        subregion: subregionMap[subregion] ?? null,
      };
    });
    res.status(200).json(result);

  } catch (error) {
    console.error("Error fetching or processing data:", error);
    res.status(500).json({ error: "Failed to fetch country data." });
  }
};
