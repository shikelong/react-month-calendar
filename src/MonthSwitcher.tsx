import { Dayjs } from 'dayjs';
import React from 'react';
import { Direction } from './types';
import { YearToMonthFormatStr } from './consts';

type MonthSwitcherProps = {
  currentDate: Dayjs;
  onDateChange: (direction: Direction) => void;
};

const MonthSwitcher = (props: MonthSwitcherProps): JSX.Element => {
  const { currentDate, onDateChange } = props;
  return (
    <div className="monthSwitcher text-center">
      <button
        onClick={() => {
          onDateChange(Direction.BACKWARD);
        }}
      >
        {'<'}
      </button>
      <h4>{currentDate.format(YearToMonthFormatStr)}</h4>
      <button
        onClick={() => {
          onDateChange(Direction.FORWARD);
        }}
      >
        {'>'}
      </button>
    </div>
  );
};

export default MonthSwitcher;
