import { useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Bookmarks from './components/Bookmarks'
import Search from './components/Search'
import { StatusBar } from 'expo-status-bar'
import * as SecureStore from 'expo-secure-store'

export default function App() {
  const [bookmarkData, setBookmarkData] = useState(null)

  const updateData = async () => {
    SecureStore.getItemAsync('bookmarks').then((result) => {
      const data = JSON.parse(result)
      console.log(data)
     setBookmarkData(data)
    })
  }

  useEffect(() => {
    updateData()
  }, [])

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Search />
      <Bookmarks data={bookmarkData} updateData={updateData} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
    position: 'relative',
  },
})
