import dayjs, { Dayjs } from 'dayjs';
import { sortBy } from 'lodash';
import intersectionBy from 'lodash/intersectionBy';
import { YearToDayFormatStr } from './assets/consts';
import { Event, EventGroup } from './types';

//固定week时候的 week 数固定设为6，这可以容纳所有情况下的当月日期。可以确保Calendar总高的稳定性。
const weekCount = 6;

export const getDaysbyMonthView = (
  currentDate: Dayjs,
  fixedWeekCount: boolean
): {
  pre: Dayjs[];
  cur: Dayjs[];
  next: Dayjs[];
} => {
  const pre: Dayjs[] = [],
    cur: Dayjs[] = [],
    next: Dayjs[] = [];
  const curYear = currentDate.year(),
    curMonth = currentDate.month();

  //calc cur month days
  const curMonthDays = currentDate.daysInMonth();
  for (let i = 1; i <= curMonthDays; i++) {
    cur.push(dayjs([curYear, curMonth, i]));
  }

  //calc pre month days
  const firstDayOfCurMonthsWeekday = cur[0].day();
  const preMonthDays = dayjs([curYear, curMonth - 1]).daysInMonth();

  for (
    let i = preMonthDays;
    i > preMonthDays - firstDayOfCurMonthsWeekday;
    i--
  ) {
    pre.unshift(dayjs([curYear, curMonth - 1, i]));
  }

  //calc next month days

  let lastDayOfCurMonthsWeekday = 7 - 1 - cur[cur.length - 1].day();
  if (
    fixedWeekCount &&
    Math.floor((pre.length + cur.length + lastDayOfCurMonthsWeekday) / 7) <
      weekCount
  ) {
    lastDayOfCurMonthsWeekday += 7;
  }

  for (let i = 1; i <= lastDayOfCurMonthsWeekday; i++) {
    next.push(dayjs([curYear, curMonth + 1, i]));
  }

  return {
    pre,
    cur,
    next,
  };
};

export const noop = () => {};

export const groupEventsByDate = (events: Event[]): EventGroup => {
  const eventsByDate: { [date: string]: Event[] } = {};
  events.forEach((event) => {
    const date = event.start.format('YYYY-MM-DD');
    if (!eventsByDate[date]) {
      eventsByDate[date] = [];
    }
    eventsByDate[date].push(event);
  });
  return eventsByDate;
};

export function chunk<T>(array: T[], chunkSize: number): T[][] {
  const chunks: any[] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

export const getCommonDayCount = (
  range1: [Dayjs, Dayjs],
  range2: [Dayjs, Dayjs]
): number => {
  const range1Dates: Dayjs[] = [],
    range2Dates: Dayjs[] = [];

  let startOfRange1 = range1[0];
  while (startOfRange1 <= range1[1]) {
    range1Dates.push(startOfRange1);
    startOfRange1 = startOfRange1.add(1, 'day');
  }

  let startOfRange2 = range2[0];
  while (startOfRange2 <= range2[1]) {
    range2Dates.push(startOfRange2);
    startOfRange2 = startOfRange2.add(1, 'day');
  }
  return intersectionBy(range1Dates, range2Dates, (item: Dayjs) => {
    return item.format(YearToDayFormatStr);
  }).length;
};

export const defaultSortDaysEvents = (events: Event[]): Event[] => {
  const sortedEvents = sortBy(events, ['end', 'start']);

  return sortedEvents;
};
