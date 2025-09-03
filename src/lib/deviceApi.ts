// Utility to fetch devices for a user
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function fetchDevices(userId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/devices/?user_id=${userId}`, {
    headers: {
      "accept": "application/json",
      "Authorization": token
    }
  });
  if (!res.ok) throw new Error("Failed to fetch devices");
  return res.json();
}

export async function fetchDashboard(email: string, deviceId: string, token: string) {
  const res = await fetch(`${API_BASE_URL}/dashboards/realtime/${email}/${deviceId}`, {
    headers: {
      "accept": "application/json",
      "Authorization": token
    }
  });
  if (!res.ok) throw new Error("Failed to fetch dashboard data");
  return res.json();
}