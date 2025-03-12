// export async function fetchFilteredStock(query: string) {
//   const response = await fetch(
//     `http://localhost:5000/api/materials/filter?query=${query}`
//   );
//   return response.json();
// }

// export const fetchMaterials = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/materials");
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.log("Error fetching materials", error);
//   }
// };

// export const fetchAdjustments = async () => {
//   try {
//     const res = await fetch("http://localhost:5000/api/materials/adjustments");
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.log("Error fetching adjustments:", error);
//   }
// };

// export const fetchFilteredAdjustments = async ({
//   material_name,
//   start_date,
//   end_date,
// }: {
//   material_name: string;
//   start_date: string;
//   end_date: string;
// }) => {
//   try {
//     const res = await fetch(
//       `http://localhost:5000/api/materials/adjustments/filter?materialName=${material_name}&startDate=${start_date}&endDate=${end_date}`
//     );
//     const data = await res.json();
//     return data;
//   } catch (error) {
//     console.log("Error fetching adjustments:", error);
//   }
// };
