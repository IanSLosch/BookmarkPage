import { Linking } from "react-native"

export const sendEmail = async (to, subject, body) => {

  let url = `mailto:${to}`

  const query = qs.stringify({
    subject: subject,
    body: body,
    cc: cc,
    bcc: bcc
  })

  if (query.length) {
    url += `?${query}`
  }

  const canOpen = await Linking.canOpenURL(url)

  if (!canOpen) {
    throw new Error('Provided URL can not be handled')
  }

  return Linking.openURL(url);
}
