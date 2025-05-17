export const USERS_WITH_CASHIER_ACCESS: number[] = [10];

export const hasSpecialCashierAccess = (userId: number | null): boolean => {
  if (!userId) return false;
  return USERS_WITH_CASHIER_ACCESS.includes(userId);
};
