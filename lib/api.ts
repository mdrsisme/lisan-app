const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const api = {
  url: (path: string) => `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`,

  get: async (path: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json" 
      }
    });
    if (!res.ok) throw new Error("Gagal mengambil data");
    return res.json();
  },

  post: async (path: string, body: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengirim data");
    return data;
  },

  put: async (path: string, body: any) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal memperbarui data");
    return data;
  },

  delete: async (path: string) => {
    const token = localStorage.getItem("token");
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus data");
    return data;
  }
};