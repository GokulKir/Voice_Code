
import {
  Dimensions,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
  NativeEventEmitter,
  NativeModules,
  useWindowDimensions
} from "react-native";
import React, { useEffect, useState } from 'react'
import { GiftedChat, Message } from "react-native-gifted-chat";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import Icon1 from 'react-native-vector-icons/dist/MaterialIcons';
import Icon2 from 'react-native-vector-icons/dist/Ionicons';
import Tts from 'react-native-tts';
import { Modal, Portal, Provider, TouchableRipple } from 'react-native-paper';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
} from "react-native-responsive-dimensions";
import {
  BarIndicator,
} from 'react-native-indicators';
import firestore from '@react-native-firebase/firestore';
import Voice from '@react-native-community/voice';


export default function App() {
  const [visible, setVisible] = useState(false);
  const [result, setResult] = useState()
  const [error, setError] = useState()
  const [IsRecording, setIsRecording] = useState(false)

  const { height, width } = useWindowDimensions()

  Voice.onSpeechStart = () => setIsRecording(true)
  Voice.onSpeechEnd = () => setIsRecording(false)
  Voice.onSpeechError = err => setError(err.error)
  Voice.onSpeechResults = (result) => setResult(result.value[0])


  /*/Record Started /*/

  const startRecording = async () => {

    try {
      showModal()
      await Voice.start('en-US')

    } catch (err) {
      console.log(err);
      setError(err)


    }

  }


  /*/Record Started /*/

  let timerId;

  /*/Recording Stopped/*/

  const StopRecording = async () => {
    try {

      await Voice.stop()

    } catch (err) {
      console.log(err);
      setError(err)



    }
  }

  /*/Recording Stopped/*/


   ( async()=>{
    console.log(result);

    if (showModal()) {

      await Voice.start('en-US')


    }
  
    
    
  })



  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const containerStyle = { backgroundColor: 'white', padding: 20 };

  const TtsModule = NativeModules.TextToSpeech;

  const { SomeNativeModule } = NativeModules;

  const emitter = new NativeEventEmitter(SomeNativeModule);

  // Check if the object has the addListener method before creating the event emitter
  const eventEmitter = TtsModule.addListener
    ? new NativeEventEmitter(TtsModule)
    : {
      addListener: () => { },
      removeListeners: () => { },
    };

  // Now you can subscribe to the event using the eventEmitter object
  eventEmitter.addListener('tts-start', (utteranceId) => {
    console.log('TTS started for utterance ID:', utteranceId);
  });






  const [inputMessage, setInputMessage] = useState("");
  const [outputMessage, setOutputMessage] = useState("The output message");
  const [messages, setMessages] = useState([]); const handleButtonClick = () => {
    console.log(inputMessage.toLocaleLowerCase().startsWith("generate image") == true, "hhhhi");
    if (inputMessage.toLocaleLowerCase().startsWith("generate image")) {
      // console.log("generate images");
      generateImages()
    } else {
      // console.log("generate text");

      generateText()
    }

  };
  const handleTextInputMessage = (text) => {
    console.log(text);
    setInputMessage(text);
  };

  const generateText = () => {
    console.log('text generated********************************');
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    console.log(message);


    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [message])
    );

    fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        // "prompt": inputMessage,
        messages: [{ role: "user", content: inputMessage }],
        // "model": "text-davinci-003",
        model: "gpt-3.5-turbo",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.choices[0].message.content.trim(), "data");
        setOutputMessage(data.choices[0].message.content.trim());
        const message = {
          _id: Math.random().toString(36).substring(7),
          text: data.choices[0].message.content.trim(),
          createdAt: new Date(),
          user: { _id: 2, name: "Devlacus" },
        };

        setMessages((previousMessage) =>
          GiftedChat.append(previousMessage, [message])
        );
        options = {}
        Tts.speak(data.choices[0].message.content, options);
      });
    setInputMessage("");
  };
  const generateImages = () => {
    console.log('images,********************************');
    const message = {
      _id: Math.random().toString(36).substring(7),
      text: inputMessage,
      createdAt: new Date(),
      user: { _id: 1 },
    };
    setMessages((previousMessage) =>
      GiftedChat.append(previousMessage, [message])
    );
    fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer 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",
      },
      body: JSON.stringify({
        prompt: inputMessage,
        n: 2,
        size: "1024x1024",
      }),
    })
      .then((res) => res.json())


      .then((data) => {
        console.log(data.data, "data");
        setOutputMessage(data.data[0].url);
        data.data.forEach((item) => {
          console.log();
          const message = {
            _id: Math.random().toString(36).substring(7),
            text: "image",
            createdAt: new Date(),
            user: { _id: 2, name: "Devlacus" },
            image: item.url,
          };
          setMessages((previousMessage) =>
            GiftedChat.append(previousMessage, [message])
          );
        });
        setInputMessage("");
      });
  };


  const MyModal = () => {
    return (
      <Provider>
        <Portal >
          <Modal style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }} visible={visible} onDismiss={hideModal}  >


            <TouchableRipple onPress={() => console.log('Pressed')} style={{ width: responsiveWidth(13), height: responsiveWidth(13), backgroundColor: '#6005f2', borderRadius: 200, alignItems: "center", justifyContent: 'center', elevation: 3, marginTop: responsiveHeight(5) }}>
              <Icon2 name="mic-circle-outline" size={64} color="#fff" />
            </TouchableRipple>

            <BarIndicator color='white' size={34} />


            <View style={{ alignItems: 'center', top: 0 }}>




            </View>
          </Modal>
        </Portal>

      </Provider>
    )
  }


  return (
    <ImageBackground source={{ uri: 'https://i.pinimg.com/736x/b9/1d/c2/b91dc2113881469c07ac99ad9a024a01.jpg' }} resizeMode="cover" style={{ flex: 1, height: height, width: width }}>

      {visible == true ? <MyModal /> : null}

     
      {   result   ?
      <View style={{alignItems:'center' , justifyContent:'center'  , borderWidth : 1 , borderColor:'#fff' ,  padding : 0  , borderRadius : 100}}>
        <Text style={{ color: '#fff' }}>{result}</Text>
        </View>
        : null}

      <View style={styles.container}>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <GiftedChat
            messages={messages}
            renderInputToolbar={() => { }}
            user={{ _id: 1 }}
            minInputToolbarHeight={0}
          />

        </View>


        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            marginRight: 2,
            justifyContent: "center",
          }}
        >
          <View
            style={{
              flex: 1,
              marginLeft: 10,
              backgroundColor: "#fff",
              borderWidth: 1,
              borderColor: "gray",
              borderRadius: 5,
              height: 40,
              marginRight: 10,
              justifyContent: "space-between",
              flexDirection: 'row',

            }}
          >
            <TextInput
              placeholder=" 🔎 Enter The question"
              onChangeText={handleTextInputMessage}
              value={inputMessage}
              placeholderTextColor="#000"
            />
            <TouchableOpacity onPress={() => startRecording()}>
              <Icon1 style={{ top: 3, left: -5 }} name="keyboard-voice" size={29} color="#000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleButtonClick}>
            <View
              style={{
                backgroundColor: "#ff5615",
                padding: 5,
                borderRadius: 30,
                height: 40,
                width: 40,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {/* <Text style={{ color: "#fff" }}>Sent</Text> */}
              <Icon name="send-o" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>
      </View>


    </ImageBackground>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})