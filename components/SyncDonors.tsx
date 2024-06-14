import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { RootStackParamList } from "@/types";

type SyncButtonProps = {
  onPress: () => void;
};

export default function SyncDonors({ onPress }: SyncButtonProps) {
  return <SyncButton onPress={onPress} />;
}

function SyncButton({ onPress }: SyncButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.6}
      style={{
        height: 40,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#007BFF20",
        borderRadius: 15,
        marginBottom: 15,
      }}
    >
      <MaterialIcons name="add-circle-outline" size={24} color="#007BFF" />
      <Text style={{ fontWeight: "700", color: "#007BFF", marginLeft: 5 }}>
        Sync Donors
      </Text>
    </TouchableOpacity>
  );
}
