import { Dayjs } from 'dayjs';
import React from 'react';
import { Direction } from './types';
import { YearToMonthFormatStr } from './consts';
import LeftIconUrl from './assets/left.svg';
import RightIconUrl from './assets/right.svg';

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
        <img src={LeftIconUrl}></img>
      </button>
      <h4>{currentDate.format(YearToMonthFormatStr)}</h4>
      <button
        onClick={() => {
          onDateChange(Direction.FORWARD);
        }}
      >
        <img src={RightIconUrl}></img>
      </button>
    </div>
  );
};

export default MonthSwitcher;
