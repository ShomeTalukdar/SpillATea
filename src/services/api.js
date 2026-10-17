// Express & MongoDB REST API Client for SpillATea

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || `HTTP error ${response.status}`);
  }

  return data;
}

export const api = {
  // Health
  async checkHealth() {
    try {
      const res = await fetch(`${API_BASE}/health`, { signal: AbortSignal.timeout(2000) });
      if (!res.ok) return { isAvailable: false, database: 'disconnected' };
      const data = await res.json();
      return { isAvailable: true, ...data };
    } catch (e) {
      return { isAvailable: false, database: 'disconnected', error: e.message };
    }
  },

  // Confessions
  async getConfessions(params = {}) {
    const searchParams = new URLSearchParams();
    if (params.day && params.day !== 'all') searchParams.set('day', params.day);
    if (params.category && params.category !== 'All' && params.category !== 'all') {
      searchParams.set('category', params.category);
    }
    if (params.search) searchParams.set('search', params.search);
    if (params.sort) searchParams.set('sort', params.sort);
    if (params.page) searchParams.set('page', params.page);
    if (params.limit) searchParams.set('limit', params.limit);

    const qs = searchParams.toString();
    return request(`/confessions${qs ? `?${qs}` : ''}`);
  },

  async getConfessionById(id) {
    return request(`/confessions/${id}`);
  },

  async createConfession(postData) {
    return request('/confessions', {
      method: 'POST',
      body: JSON.stringify(postData)
    });
  },

  async likeConfession(id, delta = 1) {
    return request(`/confessions/${id}/like`, {
      method: 'POST',
      body: JSON.stringify({ delta })
    });
  },

  async deleteConfession(id) {
    return request(`/confessions/${id}`, {
      method: 'DELETE'
    });
  },

  // Comments
  async getComments(postId) {
    return request(`/comments/${postId}`);
  },

  async addComment(postId, commentData) {
    return request(`/comments/${postId}`, {
      method: 'POST',
      body: JSON.stringify(commentData)
    });
  },

  // Reports & Moderation
  async submitReport({ postId, reason, notes }) {
    return request('/reports', {
      method: 'POST',
      body: JSON.stringify({ postId, reason, notes })
    });
  },

  async getReports(status = 'pending') {
    return request(`/reports?status=${status}`);
  },

  async takeReportAction(reportId, action, notes) {
    return request(`/reports/${reportId}/action`, {
      method: 'PATCH',
      body: JSON.stringify({ action, notes })
    });
  },

  // Identity reveal & Audit
  async revealIdentity(postId, moderatorName = 'Verified Moderator', role = 'admin') {
    return request('/admin/reveal', {
      method: 'POST',
      body: JSON.stringify({ postId, moderatorName, role })
    });
  },

  async getAuditLogs() {
    return request('/admin/audit-logs');
  },

  // Analytics
  async getStats() {
    return request('/stats/today');
  }
};
