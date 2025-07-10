// "use server";

// import { revalidatePath } from "next/cache";
// import { selectPrinter } from "qikpos";

// export async function updatePrinter(printer: string): Promise<void> {
//   try {
//     await selectPrinter(printer);

//     // Revalidate the page to reflect the changes
//     revalidatePath("/settings/printers");

//     return Promise.resolve();
//   } catch (error) {
//     console.error("Error updating printer:", error);
//     return Promise.reject(error);
//   }
// }
