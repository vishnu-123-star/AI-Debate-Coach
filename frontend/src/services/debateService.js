
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export async function generateDebate(topic) {
    const response = await fetch(`${API_URL}/api/debate/generate`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.detail || "Failed to generate debate");
    }

    return result.data;
}
