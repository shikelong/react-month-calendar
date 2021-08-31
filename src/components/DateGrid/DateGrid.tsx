import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { ONE_WEEK_DAYS } from '../../assets/consts';
import { Direction, Event, EventGroup, EventRender } from '../../types';
import { chunk, getDaysbyMonthView } from '../../utils';
import Weekdays from '../Weekdays';
import { DateGridContent } from './DateGridContent';

type DateGridProps = {
  currentDate: Dayjs;
  onDateChange: (direction: Direction) => void;
  onClickDay: (date: Dayjs) => void;
  eventGroup: EventGroup;
  events: Event[];
  eventRender: EventRender;
  fixedWeekCount: boolean;
};

export const today = dayjs();

const DateGrid = (props: DateGridProps): JSX.Element => {
  const {
    currentDate,
    onDateChange,
    onClickDay,
    eventGroup,
    events,
    eventRender,
    fixedWeekCount,
  } = props;

  const weeks = useMemo(() => {
    const { pre, cur, next } = getDaysbyMonthView(currentDate, fixedWeekCount);
    return chunk<Dayjs>([...pre, ...cur, ...next], ONE_WEEK_DAYS);
  }, [currentDate]);

  const handleDateGridClickProxy = (
    event: React.SyntheticEvent<HTMLDivElement>
  ) => {
    const clickedItem = (event.target as HTMLDivElement).closest(
      '.dategrid__item'
    );
    if (!clickedItem) {
      return;
    }
    const clickedDate = (clickedItem as HTMLDivElement).dataset.date;
    onClickDay(dayjs(clickedDate));
  };

  return (
    <div className="dategrid__container" onClick={handleDateGridClickProxy}>
      <Weekdays />
      <DateGridContent
        weeks={weeks}
        events={events}
        eventGroup={eventGroup}
        eventRender={eventRender}
        currentDate={currentDate}
        fixedWeekCount={fixedWeekCount}
      />
    </div>
  );
};

export { DateGrid };
