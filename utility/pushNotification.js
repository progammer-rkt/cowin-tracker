export default function pushNotification(subscription, email, district) {
  console.log('pushNotification')
  return fetch('/api/notification', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ subscription, email, district })
  });
}
