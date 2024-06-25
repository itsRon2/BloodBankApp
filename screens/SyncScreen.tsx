// screens/SyncScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import axios from "axios";
import { useSQLiteContext } from "expo-sqlite/next";
import { Donor } from "@/types";
import Card from "@/components/ui/Card";
import * as Network from "expo-network";

const SyncScreen = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [localDonors, setLocalDonors] = useState<Donor[]>([]);

  const db = useSQLiteContext();

  useEffect(() => {
    // Check network status
    const checkNetwork = async () => {
      const networkState = await Network.getNetworkStateAsync();
      networkState.isConnected ? setIsConnected(true) : setIsConnected(false);
    };

    // Fetch donors from local database
    db.withTransactionAsync(async () => {
      await getDonorData();
      console.log(localDonors);
    });

    checkNetwork();
  }, [db]);

  async function getDonorData() {
    const result = await db.getAllAsync<Donor>(
      `SELECT * FROM donors ORDER BY date DESC;`
    );
    setLocalDonors(result);
  }

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

      const response = await axios.post(
        "http://172.20.10.8:3000/sync",
        localDonors
      );

      if (response.status === 200) {
        Alert.alert("Sync Complete", "Data synced successfully.");
        console.log(`local donors: ${JSON.stringify(localDonors)}`);
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
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 150 }}>
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
            <Card style={styles.row} key={donor.id}>
              <View key={donor.id} style={styles.donorCard}>
                <Text>ID: {donor.id}</Text>
                <Text>Name: {donor.name}</Text>
                <Text>Height: {donor.height}</Text>
                <Text>Weight: {donor.mass}</Text>
                <Text>Age: {donor.age}</Text>
                <Text>Sex: {donor.sex}</Text>
                <Text>Pack Number: {donor.packNumber}</Text>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 1,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    marginTop: 0,
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
    gap: 6,
  },
  row: {
    gap: 6,
    margin: 5,
  },
});

export default SyncScreen;
