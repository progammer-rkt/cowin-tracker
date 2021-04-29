import React, { useEffect, useState } from 'react';

import {
  formatDate,
  getDistrictName,
  START_TRACKING,
  STOP_TRACKING,
  TRACKED_RESULT
} from '../utility';

function Monitor({
  cancel,
  district,
  date,
  pincode,
  isPincode,
  interval,
  notifyUser
}) {
  const [webWorker, setWebWorker] = useState(null);

  useEffect(() => {
    const newWebWorker = new Worker('/worker.js', { type: 'module' });
    setWebWorker(newWebWorker);
  }, []);

  useEffect(() => {
    if (webWorker) {
      webWorker.onmessage = event => {
        const { data: { type, payload } } = event;

        if (type === TRACKED_RESULT) {
          notifyUser(payload);
        }
      };

      webWorker.postMessage({
        type: START_TRACKING,
        payload: { date, district, pincode, isPincode, interval }
      });

      return () => {
        webWorker.postMessage({ type: STOP_TRACKING });
        webWorker.terminate();
      };
    }

    return () => {};
  }, [webWorker, date, district, pincode, isPincode, interval, notifyUser]);

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
