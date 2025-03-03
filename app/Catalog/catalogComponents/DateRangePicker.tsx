import { DateRangePicker as HerouiDateRangePicker, RangeValue } from "@heroui/react";
import { today, getLocalTimeZone, DateValue, CalendarDate } from "@internationalized/date";
import { Dispatch, SetStateAction } from "react";

import { reservationDetailsInterface } from "../catalogHooks/hook";


export interface ReservationInterface {
  reservations: reservationDetailsInterface[];
  selectedRange: RangeValue<DateValue> | null | undefined;
  setSelectedRange?: Dispatch<SetStateAction<RangeValue<DateValue> | null | undefined>>
}

export default function DateRangePicker({ reservations, selectedRange, setSelectedRange }: ReservationInterface) {

  let now = today(getLocalTimeZone());

  // Convert reservation dates to CalendarDate objects
  const disabledRanges = reservations?.filter(reservation => reservation.status === 'CONFIRMED').map((reservation) => {
    const startDate = new CalendarDate(
      new Date(reservation.startDate).getFullYear(),
      new Date(reservation.startDate).getMonth() + 1,
      new Date(reservation.startDate).getDate()
    );
    const endDate = new CalendarDate(
      new Date(reservation.endDate).getFullYear(),
      new Date(reservation.endDate).getMonth() + 1,
      new Date(reservation.endDate).getDate()
    );

    return [startDate, endDate];
  });

  let isDateUnavailable = (date: DateValue) =>
    disabledRanges ? disabledRanges.some(
      (interval) =>
        date.compare(interval[0]) >= 1 && date.compare(interval[1]) <= 1
    ) : false;

  // Save start and end date in state

  return (
    <HerouiDateRangePicker
      className="h-[40px]"
      isDateUnavailable={isDateUnavailable}
      minValue={now}
      value={selectedRange}
      visibleMonths={2}
      onChange={(range) => {
        if (setSelectedRange && range) {
          setSelectedRange(range);
        }
      }}
    />
  );
}
