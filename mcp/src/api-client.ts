import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.API_C_URL || "http://localhost:3000";

class ApiClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({ baseURL: BASE_URL });
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  login(email: string, password: string): Promise<{ user: any; access_token: string }> {
    return this.post("/auth/login", { email, password });
  }

  register(email: string, password: string): Promise<{ user: any; access_token: string }> {
    return this.post("/auth/register", { email, password });
  }

  setToken(token: string) {
    this.token = token;
  }

  clearToken() {
    this.token = null;
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }

  async autoLogin(): Promise<boolean> {
    const email = process.env.API_C_EMAIL;
    const password = process.env.API_C_PASSWORD;
    if (!email || !password) {
      return false;
    }
    try {
      const res = await this.login(email, password);
      this.setToken(res.access_token);
      return true;
    } catch {
      return false;
    }
  }

  async get(path: string, config?: any): Promise<any> {
    const res = await this.client.get(path, config);
    return res.data;
  }

  async post(path: string, data?: any): Promise<any> {
    const res = await this.client.post(path, data);
    return res.data;
  }

  async put(path: string, data?: any): Promise<any> {
    const res = await this.client.put(path, data);
    return res.data;
  }

  async patch(path: string, data?: any): Promise<any> {
    const res = await this.client.patch(path, data);
    return res.data;
  }

  async del(path: string, config?: any): Promise<any> {
    const res = await this.client.delete(path, config);
    return res.data;
  }
}

export const api = new ApiClient();
