// screens/SplashScreen.tsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as SplashScreen from "expo-splash-screen";

import { RootStackParamList } from "@/types";
import { StackNavigationProp } from "@react-navigation/stack";

type SyncScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;
type Props = {
  navigation: SyncScreenNavigationProp;
};

SplashScreen.preventAutoHideAsync();

const SplashScreenComponent = ({ navigation }: Props) => {
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
      navigation.replace("Home");
    }, 3000); // Show splash screen for 2 seconds
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Blood Bank App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E57373",
  },
  text: {
    fontSize: 24,
    color: "#FFFFFF",
  },
});

export default SplashScreenComponent;
