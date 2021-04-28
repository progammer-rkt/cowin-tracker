export default function sendRequest(url, queryParams = {}) {
  const headers = { 'Content-Type': 'application/json' };

  return fetch(url, {
    method: 'GET',
    headers,
    // body: JSON.stringify({ ...queryParams }),
  })
    .then(response => response.json())
    .catch(exception => {
      console.error(exception);
      throw exception;
    });
}
