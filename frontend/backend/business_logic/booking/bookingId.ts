export function createBookingId(tourId: string) {
  const randomIdNum = Math.floor(10000 + Math.random() * 90000);
  return {
    randomIdNum,
    bookingId: `BED-${tourId.slice(0, 3).toUpperCase()}-${randomIdNum}`,
    transactionId: `BED-TXN-${randomIdNum}`,
  };
}
