import * as React from "react";
import { SQLiteProvider } from "expo-sqlite/next";
import { ActivityIndicator, Text, View } from "react-native";
import * as FileSystem from "expo-file-system";
import { Asset } from "expo-asset";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Home from "@/screens/Home";
import "expo-router/entry";
import SyncScreen from "@/screens/SyncScreen";
import { RootStackParamList } from "@/types";
import SplashScreenComponent from "@/screens/SplashScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const loadDatabase = async () => {
  const dbName = "BloodBankDB.db";
  const dbAsset = require("@/assets/BloodBankDB.db");
  const dbUri = Asset.fromModule(dbAsset).uri;
  const dbFilePath = `${FileSystem.documentDirectory}SQLite/${dbName}`;

  const fileInfo = await FileSystem.getInfoAsync(dbFilePath);
  if (!fileInfo.exists) {
    await FileSystem.makeDirectoryAsync(
      `${FileSystem.documentDirectory}SQLite`,
      { intermediates: true }
    );
    await FileSystem.downloadAsync(dbUri, dbFilePath);
  }
};

export default function App() {
  const [dbLoaded, setDbLoaded] = React.useState<boolean>(false);

  React.useEffect(() => {
    loadDatabase()
      .then(() => setDbLoaded(true))
      .catch((e) => console.error(e));
  }, []);

  if (!dbLoaded)
    return (
      <View style={{ flex: 1 }}>
        <ActivityIndicator size={"large"} />
        <Text>Loading Database...</Text>
      </View>
    );
  return (
    <React.Suspense
      fallback={
        <View style={{ flex: 1 }}>
          <ActivityIndicator size={"large"} />
          <Text>Loading Database...</Text>
        </View>
      }
    >
      <SQLiteProvider databaseName="BloodBankDB.db" useSuspense>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerTitle: "Donor Tool",
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="Sync"
            component={SyncScreen}
            options={{
              headerTitle: "Donor Tool",
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen name="SplashScreen" component={SplashScreenComponent} />
        </Stack.Navigator>
      </SQLiteProvider>
    </React.Suspense>
  );
}
