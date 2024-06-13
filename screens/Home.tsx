import * as React from "react";
import { ScrollView, StyleSheet, Text, TextStyle, View } from "react-native";
import { Donor, DonorsBled } from "../types";
import { useSQLiteContext } from "expo-sqlite/next";
import DonorsList from "@/components/DonorsList";
import Card from "@/components/ui/Card";
import AddDonor from "@/components/AddDonor";

export default function Home() {
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

    const donorsBled = await db.getAllAsync<DonorsBled>(
      `
      SELECT
        COALESCE(SUM(CASE WHEN sex = 'Male' THEN 1 ELSE 0 END ), 0) AS maleDonors,
        COALESCE(SUM(CASE WHEN sex = 'Female' THEN 1 ELSE 0 END ), 0) AS femaleDonors
      FROM donors
      WHERE date >= ? AND date <= ?;
    `,
      [startOfMonthTimestamp, endOfMonthTimestamp]
    );
    setDonorsBled(donorsBled[0]);
  }

  async function deleteDonor(id: number) {
    db.withTransactionAsync(async () => {
      await db.runAsync(`DELETE FROM donors WHERE id = ?;`, [id]);
      await getData();
    });
  }

  async function insertDonor(donor: Donor) {
    db.withTransactionAsync(async () => {
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
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 15, paddingVertical: 170 }}>
      <AddDonor insertDonor={insertDonor} />
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

  // Helper function to format values
  const formatValue = (value: number) => {
    const absValue = Math.abs(value).toFixed(2);
    return `${value < 0 ? "-" : ""}$${absValue}`;
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.periodTitle}>Summary for {readablePeriod}</Text>
      <Text style={styles.summaryText}>
        Male Donors:{" "}
        <Text style={getDonorsTextStyle(maleDonors)}>
          {formatValue(maleDonors)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Female Donors:{" "}
        <Text style={getDonorsTextStyle(femaleDonors)}>
          {formatValue(femaleDonors)}
        </Text>
      </Text>
      <Text style={styles.summaryText}>
        Total Donors Bled:{" "}
        <Text style={getDonorsTextStyle(totalDonors)}>
          {formatValue(totalDonors)}
        </Text>
      </Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
    paddingBottom: 7,
    // Add other container styles as necessary
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
  // Removed moneyText style since we're now generating it dynamically
});
