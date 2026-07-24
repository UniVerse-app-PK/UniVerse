import { api } from './api';

export async function verifyAdminPassword(password) {
  return api.post('/admin/verify-password', { password }, { auth: true });
}

export async function fetchAllUsers({ search = '', page = 1, limit = 10, filter = 'all' } = {}) {
  const queryParams = new URLSearchParams({
    search,
    page: page.toString(),
    limit: limit.toString(),
    filter,
  }).toString();
  return api.get(`/admin/users?${queryParams}`, { auth: true });
}

export async function toggleUserPremium(userId) {
  return api.put(`/admin/users/${userId}/premium`, {}, { auth: true });
}

export async function warnUser(userId, reason) {
  return api.put(`/admin/users/${userId}/warn`, { reason }, { auth: true });
}

export async function banUser(userId, duration, reason) {
  return api.put(`/admin/users/${userId}/ban`, { duration, reason }, { auth: true });
}

export async function unbanUser(userId) {
  return api.put(`/admin/users/${userId}/unban`, {}, { auth: true });
}

export async function deleteUser(userId) {
  return api.delete(`/admin/users/${userId}`, { auth: true });
}

export async function fetchReports(status = 'all') {
  return api.get(`/admin/reports?status=${status}`, { auth: true });
}

export async function reviewReport(reportId, status, adminNote = '') {
  return api.put(`/admin/reports/${reportId}`, { status, adminNote }, { auth: true });
}

export async function sendCustomNotification({ recipients, text, type = 'system' }) {
  return api.post('/admin/notifications', { recipients, text, type }, { auth: true });
}
