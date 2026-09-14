import handler from '../[...path].js';

export default function booking(request, response) {
  request.query = { ...request.query, path: ['bookings', request.query.id] };
  return handler(request, response);
}
