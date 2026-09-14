import handler from './[...path].js';

export default function bookings(request, response) {
  request.query = { ...request.query, path: ['bookings'] };
  return handler(request, response);
}
