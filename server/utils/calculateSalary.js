export const getAttendanceStatus = (checkIn, checkOut) => {
  if (!checkIn) return "Absent";

  if (!checkOut) return "Present"; // still working

  const inTime = new Date(checkIn);
  const outTime = new Date(checkOut);

  const hours = (outTime - inTime) / (1000 * 60 * 60);

  if (hours < 4) return "Half Day";
  return "Present";
};