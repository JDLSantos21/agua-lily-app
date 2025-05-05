"use server";

import { QIKPOS_SERVER_URL } from "@/api/config";
import { revalidatePath } from "next/cache";
import { selectPrinter } from "qikpos"; // Assuming this function exists

export async function updatePrinter(printer: string): Promise<void> {
  try {
    await selectPrinter(printer, QIKPOS_SERVER_URL);

    // Revalidate the page to reflect the changes
    revalidatePath("/settings/printers");

    return Promise.resolve();
  } catch (error) {
    console.error("Error updating printer:", error);
    return Promise.reject(error);
  }
}
