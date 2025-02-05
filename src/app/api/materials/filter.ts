// pages/api/materials/filter.ts
import { NextApiRequest, NextApiResponse } from "next";
import { fetchFilteredStock } from "@/lib/data"; // Importar tu lógica de fetching

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { query } = req.query;
  try {
    const materials = await fetchFilteredStock(query as string);
    res.status(200).json(materials);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: "Error al obtener los materiales" });
  }
}
