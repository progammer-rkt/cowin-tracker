import React, { useEffect } from 'react';
import districtList from '../data/districtList.json';
import { isValidEmail } from '../utility';
import fetchCenters from '../utility/fetchCenters';
import Loader from './Loader';

function Form({ district, date, email, isLoading, err, actions }) {
  const {
    setError,
    setMonitor,
    setDistrict,
    setDate,
    setEmail,
    setIsLoading,
    notifyUser,
  } = actions;

  const handleSubmit = async () => {
    if (!email || !isValidEmail(email)) {
      setError('Please provide a valid email address');
      return;
    }

    if (!district) {
      setError('Please provide your district');
      return;
    }

    if (!date) {
      setError('Please pick your date');
      return;
    }

    setIsLoading(true);

    const response = await fetchCenters(district, date);

    if (response && response.centers && response.centers.length) {
      await notifyUser();
    }

    setIsLoading(false);
    setMonitor(true);
  };

  // auto turn off error message after some time
  useEffect(() => {
    if (err) {
      const timer = setTimeout(() => setError(''), 2000);
      return () => clearTimeout(timer);
    }
    return () => {};
  }, [err]);

  return (
    <>
      <p className="text-sm text-center text-white bg-red-700 rounded-sm">
        {err}
      </p>
      <div>
        <label>Email Address</label>
        <input
          type="email"
          className="w-full mt-1 form-input"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="eg: tom@doobie.com"
        />
      </div>
      <div>
      <label>Select your district</label>
        <select
          name="district"
          value={district}
          className="w-full mt-1 text-center form-select"
          onChange={event => setDistrict(event.target.value)}
        >
          <option value="">...Choose your district...</option>
          {districtList.map(({ districtId, districtName}) => (
            <option key={districtId} value={districtId}>{districtName}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Select your date</label>
        <input
          name="date"
          type="date"
          value={date}
          className="w-full mt-1 form-input"
          onChange={event => setDate(event.target.value)}
        />
      </div>

      <button
        type="button"
        className="px-3 py-2 font-bold text-white bg-yellow-900 rounded-md cursor-pointer"
        onClick={handleSubmit}
      >
        MONITOR
      </button>
      {isLoading && <Loader />}
    </>
  );
}

export default Form;
