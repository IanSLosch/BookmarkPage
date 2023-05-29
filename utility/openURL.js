import { Alert, Linking } from "react-native"

const openURI = async (url) => {
  const supported = await Linking.canOpenURL(url)

  supported ? await Linking.openURL(url) : Alert.alert(`Don't know how to open this URL: ${url}`)
}

export default openURI