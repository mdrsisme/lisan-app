const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  url: (path: string) => `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`,

  get: async (path: string) => {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) throw new Error("Gagal mengambil data");
    return res.json();
  },

  post: async (path: string, body: any) => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) throw new Error("Gagal mengirim data");
    return res.json();
  }
};