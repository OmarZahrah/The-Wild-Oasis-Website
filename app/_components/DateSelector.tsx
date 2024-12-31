"use client";

import {
  differenceInDays,
  isPast,
  isSameDay,
  isWithinInterval,
} from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState, useEffect } from "react";
import { useReservationContext } from "./ReservationContext";

function isAlreadyBooked(range, datesArr) {
  return (
    range.from &&
    range.to &&
    datesArr.some((date) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    )
  );
}

function DateSelector({ settings, cabin, bookedDates }) {
  const { range, setRange, resetRange } = useReservationContext();

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Check screen size on the client side
  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    checkScreenSize(); // Initial check
    window.addEventListener("resize", checkScreenSize); // Listen to window resize
    return () => window.removeEventListener("resize", checkScreenSize); // Cleanup
  }, []);

  const displayRange = isAlreadyBooked(range, bookedDates)
    ? { from: undefined, to: undefined }
    : range || { from: undefined, to: undefined };

  const { regularPrice, discount } = cabin;
  const numNights = differenceInDays(
    displayRange.to ?? new Date(),
    displayRange.from ?? new Date()
  );
  const cabinPrice = numNights * (regularPrice - discount);

  const { minBookingLength, maxBookingLength } = settings;

  return (
    <div className="flex flex-col justify-between space-y-6 md:space-y-0">
      <DayPicker
        className="pt-6 md:pt-12 self-center w-full md:w-auto"
        mode="range"
        onSelect={setRange}
        selected={displayRange}
        min={minBookingLength + 1}
        max={maxBookingLength}
        fromMonth={new Date()}
        fromDate={new Date()}
        toYear={new Date().getFullYear() + 5}
        captionLayout="dropdown"
        numberOfMonths={isSmallScreen ? 1 : 2} // Use screen size state
        disabled={(curDate) =>
          isPast(curDate) ||
          bookedDates.some((date) => isSameDay(date, curDate))
        }
      />

      <div className="flex flex-col md:flex-row items-center justify-between bg-accent-500 text-primary-800 p-4 md:px-8 md:h-[72px] space-y-4 md:space-y-0">
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <p className="flex gap-2 items-baseline">
            {discount > 0 ? (
              <>
                <span className="text-xl md:text-2xl">
                  ${regularPrice - discount}
                </span>
                <span className="line-through font-semibold text-primary-700 text-sm md:text-base">
                  ${regularPrice}
                </span>
              </>
            ) : (
              <span className="text-xl md:text-2xl">${regularPrice}</span>
            )}
            <span className="text-sm md:text-base">/night</span>
          </p>
          {numNights ? (
            <div className="flex flex-col md:flex-row items-center gap-2">
              <p className="bg-accent-600 px-2 py-1 text-base md:text-xl">
                <span>&times;</span> <span>{numNights}</span>
              </p>
              <p className="text-sm md:text-lg font-bold uppercase">
                Total{" "}
                <span className="text-lg md:text-2xl font-semibold">
                  ${cabinPrice}
                </span>
              </p>
            </div>
          ) : null}
        </div>

        {range?.from || range?.to ? (
          <button
            className="border border-primary-800 py-2 px-3 text-sm font-semibold w-full md:w-auto"
            onClick={resetRange}
          >
            Clear
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default DateSelector;
