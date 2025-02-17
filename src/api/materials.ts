import { fetcher } from "./fetcher";

export const fetchMaterials = async () => {
  return await fetcher("/materials");
};

export const fetchAdjustments = async () => {
  return await fetcher("/materials/adjustments");
};

export const fetchFilteredStock = async (query: string) => {
  return await fetcher(`/materials/filter?query=${query}`);
};

export const fetchFilteredAdjustments = async ({
  material_name,
  start_date,
  end_date,
}: {
  material_name: string;
  start_date: string;
  end_date: string;
}) => {
  return await fetcher(
    `/materials/adjustments/filter?materialName=${material_name}&startDate=${start_date}&endDate=${end_date}`
  );
};
