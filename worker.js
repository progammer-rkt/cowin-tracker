import {
  getInterval,
  START_TRACKING,
  STOP_TRACKING,
  TRACKED_RESULT
} from './utility';
import fetchCenters from './utility/fetchCenters';

function establishVaccineChecker(data) {
  const { date, district, pincode, isPincode, interval } = data;

  if (date && ((isPincode && pincode) || (!isPincode && district))) {
    const intervalInMilliSec = getInterval(interval);

    return setInterval(() => {
      (async () => {
        const response = await fetchCenters(
          district,
          date,
          pincode,
          isPincode
        );
        const { centers = [] } = response || {};
        postMessage({
          type: TRACKED_RESULT,
          payload: [...centers]
        })
      })();
      }, intervalInMilliSec);
  }

  return null;
}

let timer;

addEventListener('message', event => {
  const {
    data: {
      type,
      payload,
    },
  } = event;

  if (type === START_TRACKING) {
    timer = establishVaccineChecker(payload);
  } else if (type === STOP_TRACKING) {
    clearInterval(timer);
  }
});
