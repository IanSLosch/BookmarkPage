import { useState } from "react"
import {
  Button,
  Keyboard,
  Modal,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback
} from "react-native"
import * as Haptics from 'expo-haptics'
import * as SecureStore from 'expo-secure-store'
import openURI from "../utility/openURL"
import formValidation from "../utility/formValidation"

const Bookmarks = ({ data, updateData }) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [link, setLink] = useState('')
  const [blockColor, setBlockColor] = useState('')
  const [modalMode, setModalMode] = useState('modify')
  const [bookmarkToEdit, setBookmarkToEdit] = useState(0)
  const [titleError, setTitleError] = useState('')
  const [urlError, setUrlError] = useState('')
  const [colorError, setColorError] = useState('')

  const setModal = (item) => {
    setTitle(item.text)
    setLink(item.url.toLowerCase())
    setBlockColor(item.color)
  }

  const clearErrors = () => {
    setTitleError('')
    setUrlError('')
    setColorError('')
  }

  const setModalButtons = (button) => {
    if (button === 'edit') {
      setModalMode('edit')
    } else {
      setModalMode('add')
    }
  }

  const openLink = (url) => {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const newUrl = `https://${url}`
      openURI(newUrl)
    } else {
      openURI(url)
    }
  }

  const deleteBookmark = async (indexToRemove) => {
    const existingBookmarks = await SecureStore.getItemAsync('bookmarks')
    const bookmarks = JSON.parse(existingBookmarks)

    if (indexToRemove !== -1) {
      bookmarks.splice(indexToRemove, 1)
      await SecureStore.setItemAsync('bookmarks', JSON.stringify(bookmarks))

      updateData()
      console.log('Bookmark Successfully Deleted')
    } else {
      console.log('Bookmark Not Found')
    }
  }

  const handleEditBookmark = async (indexToEdit) => {
    console.log({
      text: title,
      url: link,
      color: blockColor
    })
    const errors = formValidation({
      text: title,
      url: link,
      color: blockColor
    })

    clearErrors()

    if (Object.keys(errors).length > 0) {
      if (errors.text) {
        setTitleError(errors.text)
      }
      if (errors.url) {
        setUrlError(errors.url)
      }

      if (errors.color) {
        setColorError(errors.color)
      }
    } else {
      setModalVisible(!modalVisible)

      const existingBookmarks = await SecureStore.getItemAsync('bookmarks')
      const bookmarks = JSON.parse(existingBookmarks)
      let newColor = blockColor

      if (newColor === '') { newColor = '#' + Math.floor(Math.random() * 16777215).toString(16) }

      if (indexToEdit !== -1) {
        bookmarks[indexToEdit] = {
          text: title,
          url: link,
          color: newColor
        }
        await SecureStore.setItemAsync('bookmarks', JSON.stringify(bookmarks))

        updateData()
        console.log('Bookmark Successfully Edited')
      } else {
        console.log('Bookmark Not Found')
      }
    }
  }

  const handleAddBookmark = () => {
    console.log({
      text: title,
      url: link,
      color: blockColor
    })
    const errors = formValidation({
      text: title,
      url: link,
      color: blockColor
    })

    clearErrors()

    if (Object.keys(errors).length > 0) {
      if (errors.text) {
        setTitleError(errors.text)
      }
      if (errors.url) {
        setUrlError(errors.url)
      }

      if (errors.color) {
        setColorError(errors.color)
      }
    } else {
      setModalVisible(!modalVisible)

      let newColor = blockColor

      if (newColor === '') { newColor = '#' + Math.floor(Math.random() * 16777215).toString(16) }

      if (data) {
        SecureStore.setItemAsync(
          'bookmarks',
          JSON.stringify([
            ...data,
            {
              text: title,
              url: link,
              color: newColor
            }])
        )
          .then(() => console.log('Bookmark saved successfully'))
          .catch((error) => console.log('Could not save bookmark', error))
      } else {
        SecureStore.setItemAsync(
          'bookmarks',
          JSON.stringify([
            {
              text: title,
              url: link,
              color: blockColor
            }])
        )
          .then(() => console.log('Bookmark saved successfully'))
          .catch((error) => console.log('Could not save bookmark', error))
      }

      updateData()
    }
  }

  const RenderSquares = () => {
    return data.map((item, index) => {
      return (
        <View key={index} style={styles.squareContainer} >
          <TouchableOpacity
            style={{ flex: 1 }}
            onPress={() => openLink(item.url)}
            onLongPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
              setModal(item)
              setModalButtons('edit')
              setBookmarkToEdit(index)
              setModalVisible(true)
            }}
            delayLongPress={1000}
          >
            <View style={{
              flex: 1,
              backgroundColor: item.color,
              alignItems: 'center',
              justifyContent: 'center',
            }} >
              <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.bookmarkText} >
                {item.text}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      )
    })
  }


  return (
    <ScrollView style={styles.scrollView}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false} >
        <View style={styles.container}>
          {data && <RenderSquares data={data} />}
          <View style={styles.squareContainer}>
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                setModal({
                  text: '',
                  url: '',
                  color: ''
                })
                setModalButtons('add')
                setModalVisible(true)
              }}
            >
              <View style={{
                flex: 1,
                backgroundColor: 'grey',
                alignItems: 'center',
                justifyContent: 'center',
              }} >
                <Text adjustsFontSizeToFit={true} numberOfLines={1} style={styles.addBookmarkText} >
                  +
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { setModalVisible(!modalVisible) }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalTitle}>Bookmark</Text>
                <TextInput
                  placeholder='Title'
                  onChangeText={(text) => setTitle(text)}
                  value={title}
                  style={styles.formInput}
                />
                {titleError &&
                  <Text style={styles.errorMsg}>{titleError}</Text>
                }
                <TextInput
                  placeholder='URL'
                  onChangeText={(text) => setLink(text)}
                  value={link}
                  style={styles.formInput}
                />
                {urlError &&
                  <Text style={styles.errorMsg}>{urlError}</Text>
                }
                <TextInput
                  placeholder='Color'
                  onChangeText={(text) => setBlockColor(text)}
                  value={blockColor}
                  style={styles.formInput}
                />
                {colorError &&
                  <Text style={styles.errorMsg}>{colorError}</Text>
                }
                {modalMode === 'edit' &&
                  <View style={{ flexDirection: "row" }}>
                    <View style={styles.modalButtons}>
                      <Button
                        title='Delete'
                        color='#f54298'
                        onPress={() => {
                          setModalVisible(!modalVisible)
                          deleteBookmark(bookmarkToEdit)
                        }}
                      />
                    </View>
                    <View style={styles.modalButtons}>
                      <Button
                        title='Save'
                        color='#08c4c7'
                        onPress={() => {
                          handleEditBookmark(bookmarkToEdit)
                        }}
                      />
                    </View>
                  </View>
                }
                {modalMode === 'add' && <Button
                  title='Add'
                  color='#08c4c7'
                  onPress={() => {
                    handleAddBookmark()
                  }}
                />}
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#050505'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingTop: 20
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 35,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  squareContainer: {
    width: '50%',
    height: undefined,
    aspectRatio: 1 / 1,
    padding: 8
  },
  bookmarkText: {
    fontSize: 120
  },
  addBookmarkText: {
    fontSize: 120,
    marginBottom: 15
  },
  modalTitle: {
    fontSize: 22,
    marginBottom: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formInput: {
    fontSize: 14,
    padding: 5,
    marginBottom: 15,
    backgroundColor: '#f2f2f2'
  },
  modalButtons: {
    flex: 1
  },
  errorMsg: {
    color: 'red',
    fontSize: 10,
    marginBottom: 14
  }
})

export default Bookmarks