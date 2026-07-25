import { api } from './api';

export async function submitReport({ targetType, targetId, targetName, reason, description }) {
  return api.post(
    '/reports',
    { targetType, targetId, targetName, reason, description },
    { auth: true }
  );
}
