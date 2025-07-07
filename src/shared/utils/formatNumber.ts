export default function formatPhoneNumber(phoneNumber: string) {
  if (phoneNumber.length === 10) {
    // Formato: 1234567890
    return `+1 (${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6)}`;
  } else if (phoneNumber.length === 11 && phoneNumber.startsWith("1")) {
    // Formato: 11234567890
    return `+1 (${phoneNumber.slice(1, 4)}) ${phoneNumber.slice(
      4,
      7
    )}-${phoneNumber.slice(7)}`;
  } else {
    return phoneNumber;
  }
}
