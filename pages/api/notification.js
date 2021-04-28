import { getDistrictName } from '../../utility';

const webPush = require('web-push')

export default (req, res) => {
  if (req.method == 'POST') {
    const { subscription, email, district } = req.body;

    webPush.setVapidDetails(
      `mailto:${email}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );

    console.log({ subscription, email, webPush })

    webPush
      .sendNotification(subscription, JSON.stringify({
        title: `Vaccine Available In ${getDistrictName(district)}`,
        message: `You have vaccine availability at ${getDistrictName(district)}. Grab it soon!!!`
      }))
      .then(response => {
        res.writeHead(response.statusCode, response.headers).end(response.body)
      })
      .catch(err => {
        if ('statusCode' in err) {
          res.writeHead(err.statusCode, err.headers).end(err.body)
        } else {
          console.error(err)
          res.statusCode = 500
          res.end()
        }
      })
  } else {
    res.statusCode = 405
    res.end()
  }
}
