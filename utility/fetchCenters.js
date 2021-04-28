export default function fetchCenters(district, date) {
  return fetch(`/api/fetchCenters?${new URLSearchParams({ district, date })}`)
    .then(response => response.json())
};
