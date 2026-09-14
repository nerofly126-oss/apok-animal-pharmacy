import handler from '../[...path].js';

export default function login(request, response) {
  request.query = { ...request.query, path: ['auth', 'login'] };
  return handler(request, response);
}
