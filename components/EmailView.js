import { Text, TextInput, Stylesheet, View } from "react-native"
import { Icon } from "react-native-elements"
import { sendEmail } from "../utility/sendEmail"

const EmailView = () => {
  <ScrollView style={styles.scrollView} >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
      <View style={styles.container}>
        <TouchableOpacity>
          <TextInput>

          </TextInput>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  </ScrollView>
}

const Styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',


  }


})