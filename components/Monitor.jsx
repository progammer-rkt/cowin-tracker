import React, { useEffect } from 'react';

import fetchCenters from '../utility/fetchCenters';
import { formatDate, getDistrictName, intervalList } from '../utility';

function Monitor({
  cancel,
  district,
  date,
  pincode,
  isPincode,
  interval,
  notifyUser
}) {

  useEffect(() => {
    if (date && ((isPincode && pincode) || (!isPincode && district))) {
      const intItem = (intervalList().find(i => i.value === interval) || {});
      const intervalInMilliSec = intItem.interval || 600000;
      const timer = setInterval(() => {
        (async () => {
          const response = await fetchCenters(district, date, pincode, isPincode);
          const { centers = [] } = response || {};
          notifyUser(centers);
        })();
       }, intervalInMilliSec);

      return () => clearInterval(timer);
    }

    return () => {};
  }, [district, date, pincode, isPincode, notifyUser, interval]);

  return (
    <div className="flex flex-col justify-center">
      <p className="text-center">We are watching...</p>
      <ul className="flex flex-col justify-center m-0 mt-4 space-y-3">
        <li className="flex">
          <span className="w-16 font-bold">District</span>
          <span className="w-4">:</span>
          <span className="flex-grow">{getDistrictName(district)}</span>
        </li>
        <li className="flex">
          <span className="w-16 font-bold">Date</span>
          <span className="w-4">:</span>
          <span className="flex-grow">{formatDate(date)}</span>
        </li>
      </ul>
      <p className="mt-4 text-center">You will get a notifiction when vaccine available.</p>
      <p className="mt-4 text-center">Keep this page in your browser</p>
      <button
        type="button"
        className="px-3 py-2 mt-4 font-bold text-white bg-red-700 rounded-md cursor-pointer"
        onClick={cancel}
      >
        CANCEL
      </button>
    </div>
  );
}

export default Monitor;
