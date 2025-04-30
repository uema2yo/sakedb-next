import { checkLogin, loginInfo } from "@/lib/checkLogin";

export async function addDocument(
  collectionName: string,
  document: Record<string, unknown>
) {

  try {
		await checkLogin();
		const uid = loginInfo.uid;
console.log("logininfo",loginInfo);
    if (!uid) {
      throw new Error("Not logged in");
    }

    const response = await fetch("/api/addDocument", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        collectionName,
        document,
        uid,
      }),
    });


    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Failed to add document");
    }

    return {
      status: 200,
      body: {
        message: data.message,
      },
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: 500,
        body: {
          message: error.message,
        },
      };
    } else {
      return {
        status: 500,
        body: {
          message: "An unknown error occurred",
        },
      };
    }
  }
}
