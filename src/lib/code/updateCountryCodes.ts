import { updateCodes } from "@/lib/code/updateCodes";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Label {
  [key: string]: string
}

interface CountryCode {
  code: string | number;
  label: Label;
  subregion: string;
}

export async function updateCountryCodes() {
  const countryCodes: CountryCode[] = [];

  try {
    const country = await fetch(`${baseUrl}/api/country`);
    const countries = await country.json();
    countries.forEach((r: { code: string; label: Label; subregion: string }) => {
      countryCodes.push({
        code: r.code,
        label: r.label,
        subregion: r.subregion
      });
    });

    updateCodes("b_code_country", countryCodes);
  } catch (error) {
    console.error("国一覧データ API の読み込みに失敗しました。");
  }
}
