import React, { useEffect } from 'react';

import Loader from './Loader';
import districtList from '../data/districtList.json';
import fetchCenters from '../utility/fetchCenters';

function Form({
  district,
  date,
  keywords,
  pincode,
  isPincode,
  isLoading,
  err,
  actions
}) {
  const {
    setError,
    setMonitor,
    setDistrict,
    setDate,
    setKeywords,
    setPincode,
    setIsPincode,
    setIsLoading,
    notifyUser,
  } = actions;

  const handleSubmit = async () => {
    if (!district && !isPincode) {
      setError('Please provide your district');
      return;
    }

    if (!pincode && isPincode) {
      setError('Please provide your pincode');
      return;
    }

    if (isPincode && pincode.length !== 6) {
      setError('Please provide a valid pincode');
      return;
    }

    if (!date) {
      setError('Please pick your date');
      return;
    }

    setIsLoading(true);

    const { centers = [] } = await fetchCenters(district, date, pincode, isPincode) || {};

    await notifyUser(centers);

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
      {isPincode ? (
        <div>
          <label>Provide your pincode</label>
          <input
            type="number"
            name="pincode"
            className="w-full mt-1 form-input"
            value={pincode}
            placeholder="eg: 686101"
            onChange={event => {
              if (event.target.value.length <= 6) {
                setPincode(event.target.value);
              }
            }}
          />
        </div>
      ) : (
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
      )}
      <div title={`You can either choose district wise search or pincode wise search. Not both.`}>
        <span
          className="inline-block w-full text-sm text-center text-blue-500 cursor-pointer hover:underline"
          onClick={() => setIsPincode(pc => !pc)}
        >
          {`Use ${isPincode ? 'district' : 'pincode'}`}
        </span>
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
      <div title="if keywords provided, then you will get notification only when result contains provided keywords.">
        <label>Keywords (comma separated)</label>
        <textarea
          name="keywords"
          value={keywords}
          className="w-full mt-1 form-textarea h-36"
          placeholder="eg: Karukachal, Thomas, ayarkunnam, govt"
          onChange={event => {
            if (event.target.value.length <= 50) {
              setKeywords(event.target.value);
            }
          }}
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
