const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const api = {
  url: (path: string) => `${BASE_URL}${path.startsWith("/") ? path : "/" + path}`,

  get: async (path: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
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
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const isFormData = body instanceof FormData;
    
    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
    
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal mengirim data");
    return data;
  },

  put: async (path: string, body: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const isFormData = body instanceof FormData;

    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
    };
    if (!isFormData) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal memperbarui data");
    return data;
  },

  delete: async (path: string, body?: any) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem("token") : null;
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Gagal menghapus data");
    return data;
  }
};