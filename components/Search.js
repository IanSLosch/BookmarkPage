import { useState } from "react"
import { Linking, TextInput, StyleSheet, View } from "react-native"
import Constants from 'expo-constants'

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = () => {
    const url = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`
    Linking.openURL(url)
  }

  return (
    <View style={Styles.container}>
      <View style={Styles.inputWrapper}>
      <TextInput
        style={Styles.input}
        onChangeText={setSearchQuery}
        value={searchQuery}
        placeholder="Search"
        placeholderTextColor="white"
        onSubmitEditing={handleSearch}
      />
      </View>
    </View>
  )
}

const Styles = StyleSheet.create({
  container: {
    backgroundColor: '#050505',
    paddingHorizontal: 10,
    // paddingTop: Constants.statusBarHeight + 15
    paddingTop:
                Platform.OS === 'ios' ? 0 : Constants.statusBarHeight
  },
  inputWrapper: {
    height: 50,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    marginTop: 15,
    marginBottom: 5,
  },
  input: {
    height: 50,
    fontSize: 24,
    color: 'white',
    marginHorizontal: 20,
    paddingBottom: 5
  }
})

export default Search