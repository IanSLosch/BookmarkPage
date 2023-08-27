import { Linking, Text, TextInput, StyleSheet, View } from "react-native"
import { Icon } from "react-native-elements"

const Toolbar = ({openModal}) => {

  return (
    <View style={Styles.container}>
      <Icon
        name="heart"
        type="evilicon"
        color="#fff"
        size={50}
        onPress={openModal}
      />
    </View>
  )
}

const Styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',

  }
})

export default Toolbar