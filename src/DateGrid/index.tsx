import React, { useMemo } from 'react';
import { Direction, Event, EventGroup, EventRender } from '../types';
import { getDaysbyMonthView } from '../utils';
import Weekdays from './Weekdays';
import { YearToDayFormatStr } from '../consts';
import dayjs, { Dayjs } from 'dayjs';
import classNames from 'classnames';

type DateGridProps = {
  currentDate: Dayjs;
  onDateChange: (direction: Direction) => void;
  onClickDay: (date: Dayjs) => void;
  eventGroup: EventGroup;
  eventRender: EventRender;
};

const today = dayjs();

const DateGrid = (props: DateGridProps): JSX.Element => {
  const {
    currentDate,
    onDateChange,
    onClickDay,
    eventGroup,
    eventRender,
  } = props;
  const days = useMemo(() => {
    const { pre, cur, next } = getDaysbyMonthView(currentDate);
    return [...pre, ...cur, ...next];
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
    <div>
      <Weekdays />
      <div className="dategrid__content" onClick={handleDateGridClickProxy}>
        {days.map((day, index) => {
          const dateStr = day.format(YearToDayFormatStr);
          const curDatesEvents = eventGroup[dateStr] ?? [];
          return (
            <div
              className={classNames('text-center dategrid__item', {
                'dategrid__item--curWeek': day.isSame(today, 'week'),
              })}
              key={index}
              data-date={dateStr}
            >
              <span
                className={classNames('dategrid__dayTitle', {
                  'dategrid__dayTitle--today': day.isSame(today, 'day'),
                  'dategrid__dayTitle--otherMonth': !day.isSame(
                    currentDate,
                    'month'
                  ),
                  'dategrid__dayTitle--sunday': day.weekday() === 0,
                  'dategrid__dayTitle--saturday': day.weekday() === 6,
                })}
              >
                {day.date()}
              </span>
              {curDatesEvents.map(eventRender)}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { DateGrid };
