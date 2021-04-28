import moment from 'moment';

import districtList from '../data/districtList.json';

export function formatDate(date) {
  return moment(date, 'YYYYY-MM-DD').format('DD-MM-YYYY')
}

export function getDistrictName(districtId) {
  const district = (districtList.find(d => d.districtId == districtId) || {});

  return district.districtName || districtId;
}

export function createCentersId(newCenters) {
  return (newCenters || []).map(c => c.center_id).join('__');
}

export function resultHoldsAnyKeyword(keywords, centers) {
  const searchKeywordsArray = keywords.split(',').map(w => w.trim());
  const searchDB = (centers || [])
    .map(c => [
        c.name.toLowerCase(),
        c.block_name.toLowerCase(),
        c.pincode.toString()
      ].join(' ')
    ).join(' ');

  console.log({ searchKeywordsArray, searchDB })

  return searchKeywordsArray.some(searchWord => {
    if (searchDB.includes(searchWord)) {
      return true;
    }
  });
}

export function intervalList() {
  return [
    { label: '5min', value: 5, interval: 300000 },
    { label: '10min', value: 10, interval: 600000 },
    { label: '15min', value: 15, interval: 900000 },
    { label: '20min', value: 20, interval: 1200000 },
    { label: '30min', value: 30, interval: 1800000 },
    { label: '45min', value: 45, interval: 2700000 },
    { label: '1hr', value: 100, interval: 3600000 },
  ];
}
