import { api } from './api';
import { getUser, saveSession, getToken } from './auth';

export async function updateProfile({ name, university, phone }) {
  const data = await api.put('/users/me', { name, university, phone }, { auth: true });
  // Keep the locally cached user in sync so the sidebar/profile update
  // immediately without needing a re-login.
  saveSession(getToken(), data.user);
  return data.user;
}

export async function uploadAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const data = await api.uploadFormData('/users/me/avatar', formData);
  const user = { ...getUser(), avatar: data.avatar };
  saveSession(getToken(), user);
  return data.avatar;
}

export async function changePassword({ currentPassword, newPassword }) {
  return api.put('/auth/change-password', { currentPassword, newPassword }, { auth: true });
}

export async function deleteAccount() {
  return api.delete('/users/me', { auth: true });
}

export async function subscribePremium() {
  const data = await api.put('/users/me/premium', {}, { auth: true });
  saveSession(getToken(), data.user);
  return data.user;
}

export async function unsubscribePremium() {
  const data = await api.delete('/users/me/premium', { auth: true });
  saveSession(getToken(), data.user);
  return data.user;
}
