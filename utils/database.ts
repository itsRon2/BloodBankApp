import { useSQLiteContext } from "expo-sqlite/next";
import { Donor } from "@/types";

const db = useSQLiteContext();


export const getDonorData = (){
    const result = await db.getAllAsync<Donor>(
        `SELECT * FROM donors ORDER BY date DESC;`
      );
    console.log(result)
    return result
}

// Clear local donors after sync
// export const clearDonors = () => {
//   db.transaction((tx) => {
//     tx.executeSql(
//       `DELETE FROM donors;`,
//       [],
//       () => console.log("Local donors cleared"),
//       (_, error) => {
//         console.log("Error clearing donors:", error);
//         return false;
//       }
//     );
//   });
// };
