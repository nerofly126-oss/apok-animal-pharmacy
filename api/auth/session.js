import handler from '../[...path].js';

export default function session(request, response) {
  request.query = { ...request.query, path: ['auth', 'session'] };
  return handler(request, response);
}
