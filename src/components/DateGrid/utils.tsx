import dayjs, { Dayjs } from 'dayjs';
import { ONE_WEEK_DAYS, YearToDayFormatStr } from '../../assets/consts';
import { Event, EventRender } from '../../types';
import React from 'react';
import { getCommonDayCount } from '../../utils';
import classNames from 'classnames';
import { sortBy } from 'lodash';

export const normalizeLength = (length: number) => {
  return length.toFixed(2) + '%';
};
export const getEventChipWidth = (event: Event, day: Dayjs) => {
  const oneDayLength = 100 / (1 * ONE_WEEK_DAYS);

  const commonDayCounts = getCommonDayCount(
    [day.startOf('week'), day.endOf('week')],
    [event.start, event.end ?? event.start]
  );

  return [normalizeLength(commonDayCounts * oneDayLength), commonDayCounts];
};

export const sortDaysEvents = (events: Event[]): Event[] => {
  const sortedEvents = sortBy(events, ['end', 'start']);

  // console.log('sortedEvents: ', sortedEvents);

  return sortedEvents;
};

//avaible content height = cellHeight - dayTitle's height
//avaible event chip count = avaible content height / (chipHeight + chipMargin)
export const getAvaliableEventChipCount = (
  cellHeight: number,
  dayTitleHeight: number,
  eventChipHeight: number,
  eventChipMargin: number
): number => {
  return Math.floor(
    (cellHeight - dayTitleHeight) / (eventChipHeight + eventChipMargin)
  );
};

const chipHeight = 17;
const chipMargin = 2;
const dayTitleHeight = 24;

const today = dayjs();

const DayTitle = ({
  otherEventCounts,
  day,
  currentDate,
}: {
  otherEventCounts: number;
  day: Dayjs;
  currentDate: Dayjs;
}) => {
  return (
    <span
      className={classNames('dategrid__dayTitle', {
        'dategrid__dayTitle--today': day.isSame(today, 'day'),
        'dategrid__dayTitle--otherMonth': !day.isSame(currentDate, 'month'),
        'dategrid__dayTitle--sunday': day.weekday() === 0,
        'dategrid__dayTitle--saturday': day.weekday() === 6,
      })}
    >
      {day.date()}
      {otherEventCounts > 0 && (
        <span className="daygrid__otherEventCount">+{otherEventCounts}</span>
      )}
    </span>
  );
};

export const renderDayAndEventChips = (
  day: Dayjs,
  curDatesEvents: Event[],
  eventRender: EventRender,
  weekLayoutStatusMachine: WeekLayoutStatusMachine,
  currentDate: Dayjs
) => {
  if (curDatesEvents.length === 0) {
    return (
      <DayTitle
        day={day}
        otherEventCounts={0}
        currentDate={currentDate}
      ></DayTitle>
    );
  }

  const dayInWeek = day.day();

  const curDatesEventsCanRender = sortDaysEvents(curDatesEvents);

  const curDaysLeft =
    dayInWeek === 0 ? 0 : ((dayInWeek / ONE_WEEK_DAYS) * 100).toFixed(2) + '%';

  let otherEventCounts = 0;
  const eventChips = curDatesEventsCanRender.map((event: Event, index) => {
    const [eventWidth, dayCounts] = getEventChipWidth(event, day);

    let emptyIndex = weekLayoutStatusMachine.getEmptyCellIndex(day);
    let renderIndex = emptyIndex;

    if (renderIndex === -1) {
      otherEventCounts++;
      return null;
    }

    weekLayoutStatusMachine.recordEvent(
      event.start,
      event.end ?? event.start,
      renderIndex
    );

    return dayCounts === 0 ? null : (
      <div
        className="event-chip"
        style={{
          top: `${dayTitleHeight + renderIndex * (chipHeight + chipMargin)}px`,
          left: curDaysLeft,
          width: eventWidth,
        }}
      >
        {eventRender(event, index, curDatesEvents)}
      </div>
    );
  });

  return (
    <>
      <DayTitle
        day={day}
        otherEventCounts={otherEventCounts}
        currentDate={currentDate}
      ></DayTitle>
      {eventChips}
    </>
  );
};

export type WeekLayoutStatus = boolean[][];

export class WeekLayoutStatusMachine {
  private status: WeekLayoutStatus = [];
  private weekFirstDay: Dayjs | null = null;
  constructor(everyDaysEventCounts: number, weekFirstDay: Dayjs) {
    this.weekFirstDay = weekFirstDay;
    this.status = Array.from({ length: ONE_WEEK_DAYS }, () =>
      Array(everyDaysEventCounts).fill(false)
    );
  }

  recordEvent(start: Dayjs, end: Dayjs, eventIndex: number): void {
    const startDayInWeek = this.getDayInWeek(start);
    const endDayInWeek = this.getDayInWeek(end);

    for (let i = startDayInWeek; i <= endDayInWeek; i++) {
      this.status[i][eventIndex] = true;
    }

    // console.log(
    //   'print after record: ',
    //   start.format('YYYY-MM-DD'),
    //   end.format('YYYY-MM-DD'),
    //   eventIndex
    // );
    // this.print();
  }

  getEmptyCellIndex(day: Dayjs): number {
    const dayInWeek = this.getDayInWeek(day);
    const dayInWeekEvents = this.status[dayInWeek];
    const dayInWeekEventsCount = dayInWeekEvents.length;

    for (let i = 0; i < dayInWeekEventsCount; i++) {
      if (!dayInWeekEvents[i]) {
        return i;
      }
    }

    return -1;
  }

  //获取dayjs 对象在当前周的 index, 对于溢出的情况会进行处理
  getDayInWeek(day: Dayjs) {
    if (this.weekFirstDay === null) {
      throw 'error';
    }
    if (day.isBefore(this.weekFirstDay)) {
      return 0;
    } else if (day.isAfter(this.weekFirstDay.endOf('week'))) {
      return ONE_WEEK_DAYS - 1;
    }

    return day.day();
  }

  print(): void {
    if (console.table) {
      console.table(this.status);
    } else {
      console.log(JSON.stringify(this.status));
    }
  }
}
