import { useEffect, useState } from 'react';

import Form from '../components/Form';
import Header from '../components/Header';
import Monitor from '../components/Monitor';
import {
  createCentersId,
  getDistrictName,
  intervalList,
  resultHoldsAnyKeyword
} from '../utility';

export default function Home() {
  const [district, setDistrict] = useState('');
  const [date, setDate] = useState('');
  const [keywords, setKeywords] = useState('');
  const [pincode, setPincode] = useState('');
  const [isPincode, setIsPincode] = useState(false);
  const [interval, setTimeInterval] = useState(10);
  const [err, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [monitor, setMonitor] = useState(false);
  const [reservedCenterIds, setReservedCenterIds] = useState('');
  const [registration, setRegistration] = useState(null);
  const [hasPermission, setPermission] = useState(false);

  const handleCancel = () => {
    setDistrict('');
    setDate('');
    setKeywords('');
    setPincode('');
    setIsPincode(false);
    setMonitor(false);
    setTimeInterval(10);
    setReservedCenterIds('');
  };

  const notifyUser = async (centers) => {
    if (!hasPermission || !registration) {
      alert('Push notifications facility is not available.')
      return;
    }

    const newCenterIds = createCentersId(centers);

    if (newCenterIds === reservedCenterIds) {
      return;
    }

    setReservedCenterIds(newCenterIds);

    if (keywords && !resultHoldsAnyKeyword(keywords, centers)) {
      return;
    }

    registration.showNotification(
      `Vaccine Available In ${getDistrictName(district)}`,
      {
        body: 'New vaccine centers are available in your district. Grab your vaccine ASAP!!!',
        icon: '/icons/icon-192x192.png',
        vibrate: [200, 100, 200, 100, 200, 100, 200],
      }
    );
  }

  useEffect(() => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    else if (typeof window === 'undefined' || !'serviceWorker' in navigator) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      setPermission(true);
      navigator.serviceWorker.ready.then(registration => {
        setRegistration(registration);
        registration.showNotification('If you can see me, then you are good to go!!!', {
          body: 'Buzz! Buzz!',
          icon: '/icons/icon-192x192.png',
          vibrate: [200, 100, 200, 100, 200, 100, 200],
        });
      });
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          setPermission(true);
          navigator.serviceWorker.ready.then(function(registration) {
            setRegistration(registration);
            registration.showNotification('If you can see me, then you are good to go!!!', {
              body: 'Buzz! Buzz!',
              icon: '/icons/icon-192x192.png',
              vibrate: [200, 100, 200, 100, 200, 100, 200],
            });
          });
        }
      });
    } else {
      alert('You really want to turn ON your notifications to use this app')
    }
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
        <div
          style={{ height: '35rem' }}
          className="relative mx-6 border border-yellow-900 rounded-md shadow-md md:w-80"
        >
          <div className="flex flex-col justify-center mx-4 my-2 space-y-4">
            <div className="flex items-center justify-between w-full pb-3 border-b border-gray-400">
              <h1 className="flex-grow inline-block text-lg text-center text-yellow-900 uppercase">
                Lookout Vaccine
              </h1>
              {!monitor && (
                <select
                  title="Duration in which the vaccine availability is enquired"
                  className="form-select"
                  value={interval}
                  onChange={event => setTimeInterval(Number(event.target.value))}
                >
                  {intervalList().map(ivl => (
                    <option key={ivl.value} value={ivl.value}>
                      {ivl.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
            {monitor ? (
              <Monitor
                cancel={handleCancel}
                district={district}
                date={date}
                pincode={pincode}
                interval={interval}
                isPincode={isPincode}
                notifyUser={notifyUser}
              />
            ) : (
              <Form
                district={district}
                date={date}
                err={err}
                keywords={keywords}
                pincode={pincode}
                isPincode={isPincode}
                isLoading={isLoading}
                actions={{
                  setDate,
                  setDistrict,
                  setMonitor,
                  setError,
                  setKeywords,
                  setPincode,
                  setIsPincode,
                  setIsLoading,
                  notifyUser,
                }}
              />
            )}
          </div>
        </div>
      </div>
    </>
  )
}
