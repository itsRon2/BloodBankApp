// screens/SyncScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { getDonorData } from "@/utils/database";

const SyncScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [localDonors, setLocalDonors] = useState<any[]>([]);

  useEffect(() => {
    // Check network status
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connectionStatus = state.isConnected ?? false;
      const wifiStatus = state.isWifiEnabled ?? false;
      setIsConnected(connectionStatus && wifiStatus);
    });

    // Fetch donors from local database
    setLocalDonors(getDonorData);
    console.log(`local donors: ${localDonors}`);

    return () => {
      unsubscribe();
    };
  }, []);

  const syncDataToServer = async () => {
    if (!isConnected) {
      Alert.alert("Network Error", "Please connect to Wi-Fi to sync data.");
      return;
    }

    if (localDonors.length === 0) {
      Alert.alert("No Data", "No local data to sync.");
      return;
    }

    setSyncInProgress(true);

    try {
      // Send data to server
      const response = await axios.post("http://your-server-address/api/sync", {
        donors: localDonors,
      });

      if (response.status === 200) {
        Alert.alert("Sync Complete", "Data synced successfully.");
      } else {
        Alert.alert("Sync Failed", "Failed to sync data.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "An error occurred during synchronization.");
    } finally {
      setSyncInProgress(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Sync Data</Text>
      <Button
        title="Sync to Server"
        onPress={syncDataToServer}
        disabled={syncInProgress}
      />
      {syncInProgress && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.syncingText}>Syncing in progress...</Text>
        </View>
      )}

      <Text style={styles.localDataHeader}>Local Donors:</Text>
      {localDonors.length === 0 ? (
        <Text>No local data available</Text>
      ) : (
        localDonors.map((donor) => (
          <View key={donor.id} style={styles.donorCard}>
            <Text>ID: {donor.id}</Text>
            <Text>Name: {donor.name}</Text>
            <Text>Height: {donor.height}</Text>
            <Text>Weight: {donor.weight}</Text>
            <Text>Age: {donor.age}</Text>
            <Text>Sex: {donor.sex}</Text>
            <Text>Pack Number: {donor.packNumber}</Text>
          </View>
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  syncingText: {
    marginTop: 10,
    textAlign: "center",
    color: "gray",
  },
  localDataHeader: {
    marginTop: 20,
    fontSize: 18,
    textAlign: "center",
  },
  donorCard: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
});

export default SyncScreen;
