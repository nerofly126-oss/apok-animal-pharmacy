import handler from '../[...path].js';

export default function changePassword(request, response) {
  request.query = { ...request.query, path: ['auth', 'change-password'] };
  return handler(request, response);
}
