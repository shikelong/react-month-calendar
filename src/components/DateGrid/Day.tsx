import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { YearToDayFormatStr } from '../../assets/consts';
import { Event, EventGroup, EventRender } from '../../types';
import { renderDayAndEventChips, WeekLayoutStatusMachine } from './utils';

type DayProps = {
  day: Dayjs;
  eventGroup: EventGroup;
  events: Event[];
  currentDate: Dayjs;
  firstOfWeek: Dayjs;
  eventRender: EventRender;
  avaliableEventChipCount: number;
  weekLayoutStatusMachine: WeekLayoutStatusMachine;
};

const today = dayjs();

const Day = ({
  day,
  eventGroup,
  events,
  currentDate,
  firstOfWeek,
  eventRender,
  weekLayoutStatusMachine,
  avaliableEventChipCount,
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
        event.end.isSameOrAfter(day) &&
        event.start.isSameOrBefore(firstOfWeek, 'week')
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
      {renderDayAndEventChips(
        day,
        curDatesEvents,
        eventRender,
        weekLayoutStatusMachine,
        currentDate
      )}
    </div>
  );
};

export default Day;
