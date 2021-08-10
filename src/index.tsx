import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { DateGrid } from './DateGrid/index';
import './styles/atom.css';
import './styles/index.css';
import { Direction, Event, EventRender } from './types';
import MonthSwitcher from './MonthSwitcher';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import arraySupport from 'dayjs/plugin/arraySupport';
import 'dayjs/locale/ja';
import { groupEventsByDate, noop } from './utils';
import { defaultEventRender } from './defaultRenders';

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(arraySupport);

export type MonthCalendarProps = {
  className?: string;
  style?: React.CSSProperties;
  onClickDay?: (day: Dayjs) => void;
  //locale string, should be standard locale just like ja, en, fr, etc.
  locale?: string;
  defaultDate: Dayjs;
  events: Event[];
  eventRender?: EventRender;
  //todo
  //extra row.
};

// Please do not use types off of a default export module or else Storybook Docs will suffer.
// see: https://github.com/storybookjs/storybook/issues/9556
/**
 * A custom Thing component. Neat!
 */
export const MonthCalendar = (props: MonthCalendarProps): JSX.Element => {
  const {
    className = '',
    style = {},
    defaultDate = dayjs(),
    onClickDay = noop,
    locale = 'en',
    events = [],
    eventRender = defaultEventRender,
  } = props;

  const [currentDate, setCurrentDate] = useState<Dayjs>(defaultDate);

  useEffect(() => {
    dayjs.locale(locale);
  }, [locale]);

  const onChangeDate = (direction: Direction) => {
    if (direction === Direction.FORWARD) {
      setCurrentDate(currentDate.add(1, 'month'));
    } else if (direction === Direction.BACKWARD) {
      setCurrentDate(currentDate.subtract(1, 'month'));
    }
  };

  const eventsGroup = useMemo(() => {
    return groupEventsByDate(events);
  }, [events]);

  return (
    <div className={`calendar-container ${className}`} style={style}>
      <MonthSwitcher currentDate={currentDate} onDateChange={onChangeDate} />
      <DateGrid
        onClickDay={onClickDay}
        currentDate={currentDate}
        onDateChange={onChangeDate}
        eventRender={eventRender}
        eventGroup={eventsGroup}
      />
    </div>
  );
};
