import type { User } from "firebase/auth";

export async function createUser (user: User) {
  const timestamp = Date.now();

  try {
    const res = await fetch("/api/createUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ uid: user.uid, timestamp })
    });

    if (!res.ok) {
      const data = await res.json();
      console.error("API error:", data.error);
    } else {
      console.log("User document created");
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }

};
