import moment from 'moment';

import districtList from '../data/districtList.json';


export function base64ToUint8Array(base64) {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const b64 = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')

  const rawData = window.atob(b64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function isValidEmail(email) {
  const mailformat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if ((email || '').match(mailformat)) {
    return true;
  }

  return false;
}

export function formatDate(date) {
  return moment(date, 'YYYYY-MM-DD').format('DD-MM-YYYY')
}

export function getDistrictName(districtId) {
  const district = (districtList.find(d => d.districtId == districtId) || {});

  return district.districtName || districtId;
}
