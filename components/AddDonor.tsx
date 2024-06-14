import * as React from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Card from "./ui/Card";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSQLiteContext } from "expo-sqlite/next";

import { Donor } from "@/types";

export default function AddDonor({
  insertDonor,
}: {
  insertDonor(donor: Donor): Promise<void>;
}) {
  const [isAddingDonor, setIsAddingDonor] = React.useState<boolean>(false);

  const [name, setName] = React.useState<string>("");
  const [national_id, setNationalId] = React.useState<string>("");
  const [height, setHeight] = React.useState<number>(0);
  const [mass, setMass] = React.useState<number>(0);
  const [packNumber, setPackNumber] = React.useState<number>(0);
  const [age, setAge] = React.useState<number>(0);
  const [sex, setSex] = React.useState<string>("");

  const db = useSQLiteContext();

  async function handleSave() {
    console.log({
      name,
      national_id,
      height: Number(height),
      mass: Number(mass),
      packNumber: Number(packNumber),
      age: Number(age),
      sex,
      date: new Date().getTime() / 1000,
    });

    // @ts-ignore
    await insertDonor({
      name,
      national_id,
      height: Number(height),
      mass: Number(mass),
      packNumber,
      age: Number(age),
      sex,
      date: new Date().getTime() / 1000,
    });
    setName("");
    setNationalId("");
    setHeight(0);
    setMass(0);
    setPackNumber(0);
    setAge(0);
    setSex("");
    setIsAddingDonor(false);
  }

  return (
    <View style={{ marginBottom: 15 }}>
      {isAddingDonor ? (
        <View>
          <Card>
            <TextInput
              placeholder="Full Name"
              style={{
                fontSize: 32,
                marginBottom: 15,
                fontWeight: "bold",
              }}
              onChangeText={setName}
            />
            <TextInput
              placeholder="XX-XXXXXXX X XX"
              style={{ marginBottom: 15 }}
              onChangeText={setNationalId}
            />
            <TextInput
              placeholder="Height cm"
              style={{ marginBottom: 15 }}
              onChangeText={(text) => {
                const height = Number(text);
                setHeight(height);
              }}
            />
            <TextInput
              placeholder="Mass kg"
              style={{ marginBottom: 15 }}
              onChangeText={(text) => {
                const mass = Number(text);
                setMass(mass);
              }}
            />
            <TextInput
              placeholder="Pack Number"
              style={{ marginBottom: 15 }}
              onChangeText={(text) => {
                const pack = Number(text);
                setPackNumber(pack);
              }}
            />
            <TextInput
              placeholder="Age years"
              style={{ marginBottom: 15 }}
              onChangeText={(text) => {
                const age = Number(text);
                setAge(age);
              }}
            />
            <TextInput
              placeholder="Sex"
              style={{ marginBottom: 15 }}
              onChangeText={setSex}
            />
          </Card>
          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <Button
              title="Cancel"
              color="red"
              onPress={() => setIsAddingDonor(false)}
            />
            <Button title="Save" onPress={handleSave} />
          </View>
        </View>
      ) : (
        <AddButton setIsAddingDonor={setIsAddingDonor} />
      )}
    </View>
  );
}

function AddButton({
  setIsAddingDonor,
}: {
  setIsAddingDonor: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <TouchableOpacity
      onPress={() => setIsAddingDonor(true)}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",

        justifyContent: "center",
        backgroundColor: "#007BFF20",
        borderRadius: 15,
      }}
    >
      <MaterialIcons name="add-circle-outline" size={24} color="#007BFF" />
      <Text style={{ fontWeight: "700", color: "#007BFF", marginLeft: 5 }}>
        New Donor Entry
      </Text>
    </TouchableOpacity>
  );
}
