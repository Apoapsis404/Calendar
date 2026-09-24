const BASE_URL: string = "http://localhost:8080/v1";

const headers = new Headers();
headers.append("Content-Type", "application/json");

interface Health {
  health: string;
}

export const getHealth = async (): Promise<Health> => {
  const response = await fetch(`${BASE_URL}/health`, { headers });
  const data = await response.json();
  console.log(data);
  return data;
};
