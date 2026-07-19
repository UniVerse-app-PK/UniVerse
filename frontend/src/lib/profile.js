import { api } from './api';
import { getUser, getToken, saveSession } from './auth';

// Merges only the fields the backend actually returned into the existing
// session user, instead of overwriting it outright - the backend's raw
// user object uses `_id` while the session (from login/verify) uses `id`,
// so blindly overwriting would silently break every `getUser()?.id` check
// across the app.
function mergeIntoSession(patch) {
  const current = getUser() || {};
  const merged = { ...current, ...patch };
  saveSession(getToken(), merged);
  return merged;
}

export async function updateMyProfile({ name, university, phone }) {
  const data = await api.put('/users/me', { name, university, phone }, { auth: true });
  return mergeIntoSession({
    name: data.user.name,
    university: data.user.university,
    phone: data.user.phone,
  });
}

export async function uploadMyAvatar(file) {
  const formData = new FormData();
  formData.append('avatar', file);
  const data = await api.uploadFormData('/users/me/avatar', formData);
  return mergeIntoSession({ avatar: data.avatar });
}

export async function changeMyPassword({ currentPassword, newPassword }) {
  return api.put('/auth/change-password', { currentPassword, newPassword }, { auth: true });
}
