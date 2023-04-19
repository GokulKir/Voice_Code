
import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import App from "./App";
import { NativeBaseProvider, Box } from "native-base";
import { Provider as PaperProvider } from 'react-native-paper';

export default function Main() {
  return (
  <PaperProvider>
    <App/>
  </PaperProvider>
  )
}

const styles = StyleSheet.create({})