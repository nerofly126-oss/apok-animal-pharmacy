import handler from '../[...path].js';

export default function notificationStatus(request, response) {
  request.query = { ...request.query, path: ['auth', 'notification-status'] };
  return handler(request, response);
}
