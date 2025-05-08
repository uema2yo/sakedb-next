import { updateCodes } from "@/lib/code/updateCodes";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function updateCountryCodes() {
  const countryCodes: {
    code: string | number;
    label: string;
    subregion: string;
  }[] = [];

  try {
    const country = await fetch(`${baseUrl}/api/country`);
    const countries = await country.json();

    countries.forEach((r: { code: number; name: string; subregion_code: string }) => {
      countryCodes.push({
        code: r.code,
        label: r.name,
        subregion: r.subregion_code
      });
    });

    updateCodes("b_code_country", countryCodes);
  } catch (error) {
    console.error("国一覧データ API の読み込みに失敗しました。");
  }
}
