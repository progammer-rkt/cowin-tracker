import { useEffect, useState } from 'react';

import Form from '../components/Form';
import Header from '../components/Header';
import Monitor from '../components/Monitor';
import { base64ToUint8Array } from '../utility';
import pushNotification from '../utility/pushNotification';

export default function Home() {
  const [district, setDistrict] = useState('');
  const [date, setDate] = useState('');
  const [email, setEmail] = useState('');
  const [err, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [minitor, setMonitor] = useState(false);
  const [subscription, setSubscription] = useState(null);

  const handleCancel = () => {
    setDistrict('');
    setDate('');
    setMonitor(false);
  };

  useEffect(() => {
    // Let's check if the browser supports notifications
    if (!("Notification" in window)) {
      alert("This browser does not support desktop notification");
    }

    // Let's check whether notification permissions have already been granted
    else if (Notification.permission === "granted") {
      // If it's okay let's create a notification
      new Notification("If you can see me, then you are good to go!!!");
    }

    // Otherwise, we need to ask the user for permission
    else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {
        // If the user accepts, let's create a notification
        if (permission === "granted") {
          new Notification("If you can see me, then you are good to go!!!");
        }
      });
    }
  }, []);

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      window.workbox !== undefined
    ) {
      // run only in browser
      navigator.serviceWorker.ready.then(reg => {
        reg.pushManager.getSubscription()
        .then(sub => {
          if (!sub) {
            return reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: base64ToUint8Array(
                process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY
              )
            })
          }
          return sub;
        })
        .then(sub => {
          if (sub) {
            setSubscription(sub);
          }
        })
      })
    }
  }, []);

  const notifyUser = async () => {
    if (subscription == null) {
      console.error('web push not subscribed');
      return;
    }

    await pushNotification(subscription, email, district);
  }

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
        <div
          style={{ height: '26rem' }}
          className="relative mx-6 border border-yellow-900 rounded-md shadow-md md:w-64"
        >
          <div className="flex flex-col justify-center mx-4 my-2 space-y-4">
            <h1 className="inline-block text-xl text-center text-yellow-900 uppercase">
              Lookout Vaccine
            </h1>
            {minitor ? (
              <Monitor
                cancel={handleCancel}
                district={district}
                date={date}
                email={email}
                notifyUser={notifyUser}
              />
            ) : (
              <Form
                district={district}
                date={date}
                err={err}
                email={email}
                isLoading={isLoading}
                actions={{
                  setDate,
                  setDistrict,
                  setMonitor,
                  setError,
                  setEmail,
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
