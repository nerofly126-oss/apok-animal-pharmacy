import handler from '../[...path].js';

export default function logout(request, response) {
  request.query = { ...request.query, path: ['auth', 'logout'] };
  return handler(request, response);
}
