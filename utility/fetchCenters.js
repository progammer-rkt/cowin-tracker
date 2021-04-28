export default function fetchCenters(district, date, pincode, isPincode) {
  return fetch('/api/fetchCenters', {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify({ district, date, pincode, isPincode })
  }).then(response => {
    if (response.ok) {
      return response.json();
    }
    return { centers: [] };
  });
};
