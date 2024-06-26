import * as React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  View,
  Alert,
} from "react-native";
import { Donor, DonorsBled } from "@/types";
import { useSQLiteContext } from "expo-sqlite/next";
import DonorsList from "@/components/DonorsList";
import Card from "@/components/ui/Card";
import AddDonor from "@/components/AddDonor";
import SyncDonors from "@/components/SyncDonors";
import { RootStackParamList } from "@/types";
import { StackNavigationProp } from "@react-navigation/stack";

type SyncScreenNavigationProp = StackNavigationProp<RootStackParamList, "Sync">;
type Props = {
  navigation: SyncScreenNavigationProp;
};

export default function Home({ navigation }: Props) {
  const [donors, setDonors] = React.useState<Donor[]>([]);
  const [donorsBled, setDonorsBled] = React.useState<DonorsBled>({
    maleDonors: 0,
    femaleDonors: 0,
  });

  const db = useSQLiteContext();

  React.useEffect(() => {
    db.withTransactionAsync(async () => {
      await getData();
    });
  }, [db]);

  async function getData() {
    const result = await db.getAllAsync<Donor>(
      `SELECT * FROM donors ORDER BY date DESC;`
    );
    setDonors(result);

    const now = new Date();
    // Set to the first day of the current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    // Get the first day of the next month, then subtract one millisecond to get the end of the current month
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endOfMonth.setMilliseconds(endOfMonth.getMilliseconds() - 1);

    // Convert to Unix timestamps (seconds)
    const startOfMonthTimestamp = Math.floor(startOfMonth.getTime() / 1000);
    const endOfMonthTimestamp = Math.floor(endOfMonth.getTime() / 1000);

    const numberDonors = await db.getAllAsync<DonorsBled>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN sex = 'Male'   THEN 1 ELSE 0 END ), 0) AS maleDonors,
        COALESCE(SUM(CASE WHEN sex = 'Female' THEN 1 ELSE 0 END ), 0) AS femaleDonors
      FROM donors
      WHERE date >= ? AND date <= ?;
    `,
      [startOfMonthTimestamp, endOfMonthTimestamp]
    );
    setDonorsBled(numberDonors[0]);
  }

  async function deleteDonor(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM donors WHERE id = ?;`, [id]);
      await getData();
    });
  }

  async function insertDonor(donor: Donor) {
    // Check if all fields are filled
    if (
      !donor.name ||
      !donor.national_id ||
      donor.height === null ||
      donor.mass === null ||
      donor.packNumber === null ||
      donor.age === null ||
      !donor.sex
    ) {
      Alert.alert("Error", "All fields must be filled.");
      return;
    }
    // Validate National ID format (12-character alphanumeric string)
    const nationalIdRegex = /^[0-9a-z]{12}$/;
    if (!nationalIdRegex.test(donor.national_id)) {
      Alert.alert(
        "Error",
        "National ID format is invalid. It should be a 12-character alphanumeric string like 632244057b80"
      );
      return;
    }

    // Validate Age between 50 and 100
    if (donor.age < 50 || donor.age > 80) {
      Alert.alert("Error", "Age of the donor should be between 50 and 80");
      return;
    }

    // Validate Pack Number format (exactly 8 digits)
    const packNumberRegex = /^\d{8}$/;
    if (!packNumberRegex.test(String(donor.packNumber))) {
      Alert.alert("Error", "Pack Number must be exactly 8 digits.");
      return;
    }

    // All validations passed, proceed with saving to the database
    try {
      await db.withTransactionAsync(async () => {
        await db.runAsync(
          `
        INSERT INTO donors (name, date, national_id, height, mass, packNumber, age, sex) VALUES (?, ?, ?, ?, ?, ?, ?, ?);
        `,
          [
            donor.name,
            donor.date,
            donor.national_id,
            donor.height,
            donor.mass,
            donor.packNumber,
            donor.age,
            donor.sex,
          ]
        );
        await getData();
      });
      Alert.alert("Success", "Data saved successfully!");
    } catch (error) {
      Alert.alert("Error", "Failed to save data. Please try again.");
      console.error(error);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 170 }}>
      <AddDonor insertDonor={insertDonor} />
      <SyncDonors onPress={() => navigation.navigate("Sync")} />
      <DonorsSummary
        maleDonors={donorsBled.maleDonors}
        femaleDonors={donorsBled.femaleDonors}
      />
      <DonorsList donors={donors} deleteDonors={deleteDonor} />
    </ScrollView>
  );
}

function DonorsSummary({ maleDonors, femaleDonors }: DonorsBled) {
  const totalDonors = maleDonors + femaleDonors;
  const readablePeriod = new Date().toLocaleDateString("default", {
    month: "long",
    year: "numeric",
  });

  // Function to determine the style based on the value (positive or negative)
  const getDonorsTextStyle = (value: number): TextStyle => ({
    fontWeight: "bold",
    color: value < 0 ? "#ff4500" : "#2e8b57", // Red for negative, custom green for positive
  });

  return (
    <Card style={styles.container}>
      <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
      <Text style={styles.summaryText}>
        Male Donors:{" "}
        <Text style={getDonorsTextStyle(maleDonors)}>{maleDonors}</Text>
      </Text>
      <Text style={styles.summaryText}>
        Female Donors:{" "}
        <Text style={getDonorsTextStyle(femaleDonors)}>{femaleDonors}</Text>
      </Text>
      <Text style={styles.summaryText}>
        Total Donors Bled:{" "}
        <Text style={getDonorsTextStyle(totalDonors)}>{totalDonors}</Text>
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingBottom: 7,
  },
  periodTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  summaryText: {
    fontSize: 18,
    color: "#333",
    marginBottom: 10,
  },
});
