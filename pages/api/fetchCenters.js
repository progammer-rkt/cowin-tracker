import sendRequest from "../../sendRequest";
import { formatDate } from "../../utility";

export default async (req, res) => {
  const absoluteURL = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/calendarByDistrict';
  const { query: { district, date } } = req;
  const URL = `${absoluteURL}?${new URLSearchParams({
    district_id: Number(district),
    date: formatDate(date),
  })}`

  try {
    const response  = await sendRequest(URL);
    console.log({ response })
    return res.status(200).json(response);
  } catch (error) {
    console.log({ error })
  }
}
