import dayjs, { Dayjs } from 'dayjs';
import React, { useRef } from 'react';
import { YearToMonthFormatStr } from '../assets/consts';

type MonthSelectProps = {
  currentMonth: Dayjs;
  minMonth: Dayjs;
  maxMonth: Dayjs;
  onMonthChanged: (newMonth: Dayjs) => void;
  displayFormatStr?: string;
};

const dateFormatStr = 'YYYY-MM-DD';

/**
 * A Component to display a time. and can select year and month.
 */
const MonthSelect = (props: MonthSelectProps): JSX.Element => {
  const {
    currentMonth,
    minMonth,
    maxMonth,
    onMonthChanged,
    displayFormatStr = YearToMonthFormatStr,
  } = props;

  const datePickerRef = useRef<HTMLInputElement>(null);
  const handleClickMonthText = () => {
    if (datePickerRef.current) {
      datePickerRef.current.click();
    }
  };
  return (
    <div className="MonthSelect">
      <span
        className="MonthSelect-datePickerCover"
        onClick={handleClickMonthText}
      >
        {currentMonth.format(displayFormatStr)}
      </span>
      <input
        ref={datePickerRef}
        hidden
        type="date"
        className="MonthSelect-datePicker"
        value={currentMonth.format(dateFormatStr)}
        min={minMonth.format(dateFormatStr)}
        max={maxMonth.format(dateFormatStr)}
        onChange={(e) => {
          onMonthChanged(dayjs(e.target.value));
        }}
      />
    </div>
  );
};

export default MonthSelect;
