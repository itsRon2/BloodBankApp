import { AntDesign } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { Donor } from "../types";
import { AutoSizeText, ResizeTextMode } from "react-native-auto-size-text";
import Card from "./ui/Card";

interface DonorListItemProps {
  donor: Donor;
}

export default function DonorListItem({ donor }: DonorListItemProps) {
  const iconName = "checkcircle";
  const color = "green";
  return (
    <Card>
      <View style={styles.row}>
        <View style={{ width: "40%", gap: 3 }}>
          <DonorNumber iconName={iconName} color={color} donorNum={donor.id} />
        </View>
        <DonorInfo
          name={donor.name}
          description={donor.national_id}
          id={donor.id}
          date={donor.date}
        />
      </View>
    </Card>
  );
}

function DonorInfo({
  id,
  name,
  date,
  description,
}: {
  id: number;
  name: string;
  date: number;
  description: string;
}) {
  return (
    <View style={{ flexGrow: 1, gap: 6, flexShrink: 1 }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{name}</Text>
      <Text>Donor number {id}</Text>
      <Text style={{ fontSize: 12, color: "gray" }}>
        {new Date(date * 1000).toDateString()}
      </Text>
    </View>
  );
}

function DonorNumber({
  iconName,
  color,
  donorNum,
}: {
  iconName: "checkcircle";
  color: string;
  donorNum: number;
}) {
  return (
    <View style={styles.row}>
      <AntDesign name={iconName} size={18} color={color} />
      <AutoSizeText
        fontSize={32}
        mode={ResizeTextMode.max_lines}
        numberOfLines={1}
        style={[styles.amount, { maxWidth: "80%" }]}
      >
        D{donorNum}
      </AutoSizeText>
    </View>
  );
}

const styles = StyleSheet.create({
  amount: {
    fontSize: 32,
    fontWeight: "800",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  categoryContainer: {
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  categoryText: {
    fontSize: 12,
  },
});
