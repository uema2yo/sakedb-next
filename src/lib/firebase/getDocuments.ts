import type { GetCollectionConfig } from "@/types/getDocumentsConfig";
import type { DocumentData } from "firebase/firestore";

export async function getDocuments(
  configs: GetCollectionConfig[]
): Promise<DocumentData[]> {
  try {
    const response = await fetch("/api/getDocuments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(configs),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}
