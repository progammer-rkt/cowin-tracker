export default function pushNotification(subscription, email, district) {
  return fetch('/api/notification', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ subscription, email, district })
  });
}
