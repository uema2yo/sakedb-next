import { updateCodes } from "@/lib/code/updateCodes";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

interface Label {
  [key: string]: string
}

interface RegionCode {
  code: string | number;
  label: Label;
  order: string;
}

export async function updateRegionCodes() {
  const regionCodes: RegionCode[] = [];

  try {
    const region = await fetch(`${baseUrl}/api/subregion`);
    const regions = await region.json();
    regions.forEach((r: {
      order: string; code: string; label: Label; 
}) => {
      regionCodes.push({
        code: r.code,
        label: r.label,
        order: r.order
      });
    });

    updateCodes("b_code_region", regionCodes);
  } catch (error) {
    console.error("地域一覧データ API の読み込みに失敗しました。");
  }
}
