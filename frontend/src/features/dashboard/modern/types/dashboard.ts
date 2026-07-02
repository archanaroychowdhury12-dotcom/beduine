export interface Booking {
  id: string;
  tour: string;
  travelDate: string;
  amount: string;
  status: "Upcoming" | "Completed" | "Cancelled";
}

export interface Payment {
  id: string;
  bookingId: string;
  amount: string;
  date: string;
  status: "Success" | "Pending" | "Refunded";
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: "Open" | "In Progress" | "Closed";
  updatedOn: string;
}
