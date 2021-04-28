import sendRequest from "../../sendRequest";
import { formatDate } from "../../utility";

export default async (req, res) => {
  if (req.method == 'POST') {
    const { district, date, pincode, isPincode } = req.body;
    let absoluteURL = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict';
    let params = { district_id: Number(district), date: formatDate(date) };

    if (isPincode) {
      absoluteURL = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByPin';
      params = { pincode, date: formatDate(date) };
    }

    params = new URLSearchParams(params);
    const URL = `${absoluteURL}?${params}`

    try {
      const response  = await sendRequest(URL);
      return res.status(200).json(response);
    } catch (error) {
      console.log({ error })
    }
  }
}
