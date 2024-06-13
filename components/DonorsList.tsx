import { TouchableOpacity, View } from "react-native";
import { Donor } from "@/types";
import DonorListItem from "./DonorListItem";

export default function DonorsList({
  donors,
  deleteDonors,
}: {
  donors: Donor[];
  deleteDonors: (id: number) => Promise<void>;
}) {
  return (
    <View style={{ gap: 15 }}>
      {donors.map((donor) => {
        return (
          <TouchableOpacity
            key={donor.id}
            activeOpacity={0.7}
            onLongPress={() => deleteDonors(donor.id)}
          >
            <DonorListItem donor={donor} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
