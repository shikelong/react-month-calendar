import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';
import { Dayjs } from 'dayjs';
import { YearToDayFormatStr } from '../../assets/consts';
import { EventGroup, Event, EventRender } from '../../types';
import { renderEventChips } from './utils';

type DayProps = {
  day: Dayjs;
  eventGroup: EventGroup;
  events: Event[];
  currentDate: Dayjs;
  firstOfWeek: Dayjs;
  eventRender: EventRender;
  avaliableEventChipCount: number;
};

const today = dayjs();

const Day = ({
  day,
  eventGroup,
  events,
  currentDate,
  firstOfWeek,
  eventRender,
}: DayProps): JSX.Element => {
  const dateStr = day.format(YearToDayFormatStr);
  let curDatesEvents = eventGroup[dateStr] ?? [];
  //todo: improve performance.
  const eventsCurWeek = events.filter(
    (event) =>
      event.start.isSame(firstOfWeek, 'week') ||
      (event.end && event.end.isSame(firstOfWeek, 'week'))
  );

  //除了开始日是当天的之外，对于每周的开始的第一天，应该把 end 时间大于等于第一天的事件也按其当天的事件来进行渲染处理
  if (day.day() === 0) {
    const preWeekLongEvents = events.filter((event) => {
      return (
        !event.start.isSame(firstOfWeek, 'week') &&
        event.end &&
        event.end.isSameOrAfter(day)
      );
    });
    curDatesEvents = curDatesEvents.concat(preWeekLongEvents);
  }

  return (
    <div
      className={classNames('text-center dategrid__item', {
        'dategrid__item--curWeek': day.isSame(today, 'week'),
      })}
      key={day.day()}
      data-date={dateStr}
    >
      <span
        className={classNames('dategrid__dayTitle', {
          'dategrid__dayTitle--today': day.isSame(today, 'day'),
          'dategrid__dayTitle--otherMonth': !day.isSame(currentDate, 'month'),
          'dategrid__dayTitle--sunday': day.weekday() === 0,
          'dategrid__dayTitle--saturday': day.weekday() === 6,
        })}
      >
        {day.date()}
      </span>
      {renderEventChips(day, eventsCurWeek, curDatesEvents, eventRender)}
    </div>
  );
};

export default Day;
