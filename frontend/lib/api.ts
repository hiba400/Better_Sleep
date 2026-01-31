const envBaseUrl = process.env.NEXT_PUBLIC_API_URL;
const runtimeHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const runtimeBaseUrl = `http://${runtimeHost}:8080`;
const API_BASE_URL =
  !envBaseUrl
    ? runtimeBaseUrl
    : (typeof window !== 'undefined' && envBaseUrl.includes('localhost') && runtimeHost !== 'localhost')
      ? runtimeBaseUrl
      : envBaseUrl;

export const apiClient = {
  async handleError(response: Response): Promise<never> {
    let details = '';
    try {
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const json = await response.json().catch(() => null as any);
        if (json && typeof json === 'object') {
          details =
            (json.message as string) ||
            (json.error as string) ||
            (json.details as string) ||
            JSON.stringify(json);
        }
      }
      if (!details) {
        details = await response.text().catch(() => '');
      }
    } catch {
      // ignore
    }

    const suffix = details ? ` - ${details}` : '';
    throw new Error(`HTTP error! status: ${response.status}${suffix}`);
  },

  async parseJsonIfPresent<T>(response: Response): Promise<T> {
    if (response.status === 204) {
      return null as unknown as T;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return null as unknown as T;
    }

    const text = await response.text();
    if (!text) {
      return null as unknown as T;
    }

    return JSON.parse(text) as T;
  },

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return this.handleError(response);
    }

    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }

    const text = await response.text();
    return text as unknown as T;
  },

  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      return this.handleError(response);
    }

    return this.parseJsonIfPresent<T>(response);
  },

  async postText<T>(endpoint: string, text: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: text,
    });
    
    if (!response.ok) {
      return this.handleError(response);
    }

    return this.parseJsonIfPresent<T>(response);
  },

  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      return this.handleError(response);
    }

    return this.parseJsonIfPresent<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      return this.handleError(response);
    }

    return this.parseJsonIfPresent<T>(response);
  },
};

export const api = {
  test: {
    getHome: () => apiClient.get<string>('/'),
    getTest: () => apiClient.get<string>('/api/test'),
  },
  users: {
    getAll: () => apiClient.get<any[]>('/api/users'),
    getById: (id: number) => apiClient.get<any>(`/api/users/${id}`),
    getByEmail: (email: string) => apiClient.get<any>(`/api/users/email/${email}`),
    create: (user: any) => apiClient.post<any>('/api/users', user),
    update: (id: number, user: any) => apiClient.put<any>(`/api/users/${id}`, user),
    delete: (id: number) => apiClient.delete<void>(`/api/users/${id}`),
  },
  alertes: {
    getAlertes: (userId: number) => apiClient.get<any[]>(`/api/alertes/${userId}`),
    createAlerte: (userId: number, message: string) => apiClient.postText<any>(`/api/alertes/${userId}`, message),
    createAlerteJson: (userId: number, payload: any) => apiClient.post<any>(`/api/alertes/${userId}`, payload),
    markAsViewed: (idAlerte: number) => apiClient.put<void>(`/api/alertes/${idAlerte}/vue`),
  },
  sleepEntries: {
    getAll: () => apiClient.get<any[]>('/api/sleep-entries'),
    getById: (id: number) => apiClient.get<any>(`/api/sleep-entries/${id}`),
    getByUserId: (userId: number) => apiClient.get<any[]>(`/api/sleep-entries/user/${userId}`),
    getByDateRange: (userId: number, startDate: string, endDate: string) => 
      apiClient.get<any[]>(`/api/sleep-entries/user/${userId}/range?startDate=${startDate}&endDate=${endDate}`),
    create: (sleepEntry: any) => apiClient.post<any>('/api/sleep-entries', sleepEntry),
    update: (id: number, sleepEntry: any) => apiClient.put<any>(`/api/sleep-entries/${id}`, sleepEntry),
    delete: (id: number) => apiClient.delete<void>(`/api/sleep-entries/${id}`),
    getStats: (userId: number) => apiClient.get<any>(`/api/sleep-entries/user/${userId}/stats`),
  },
  advice: {
    getAdvice: (userId: number) => apiClient.get<any>(`/api/advice/${userId}`),
  },
};
