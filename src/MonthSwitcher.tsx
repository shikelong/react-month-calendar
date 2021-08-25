import { Dayjs } from 'dayjs';
import React, { useMemo, useState } from 'react';
import { Direction } from './types';
import { YearToMonthFormatStr } from './consts';
import { LeftIcon, RightIcon } from './components/Icon';
import MonthSelect from './components/MonthSelect';

type MonthSwitcherProps = {
  currentDate: Dayjs;
  onDateChange: (directionOrNewDate: Direction | Dayjs) => void;
  minMonth: Dayjs;
  maxMonth: Dayjs;
};

const MonthSwitcher = (props: MonthSwitcherProps): JSX.Element => {
  const { currentDate, onDateChange, minMonth, maxMonth } = props;

  const isMonthCanNotGoPre = currentDate.isSame(minMonth, 'month');
  const isMonthCanNotGoNext = currentDate.isSame(maxMonth, 'month');

  return (
    <div className="monthSwitcher text-center">
      <button
        disabled={isMonthCanNotGoPre}
        onClick={() => {
          onDateChange(Direction.BACKWARD);
        }}
      >
        <LeftIcon
          style={{ color: isMonthCanNotGoPre ? '#eee' : '#333' }}
        ></LeftIcon>
      </button>
      <MonthSelect
        maxMonth={maxMonth}
        minMonth={minMonth}
        currentMonth={currentDate}
        onMonthChanged={(month: Dayjs) => {
          onDateChange(month);
        }}
      />
      <button
        disabled={isMonthCanNotGoNext}
        onClick={() => {
          onDateChange(Direction.FORWARD);
        }}
      >
        <RightIcon
          style={{ color: isMonthCanNotGoNext ? '#eee' : '#333' }}
        ></RightIcon>
      </button>
    </div>
  );
};

export default MonthSwitcher;
