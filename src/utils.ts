import dayjs, { Dayjs } from 'dayjs';
import { Event, EventGroup } from './types';

export const getDaysbyMonthView = (
  currentDate: Dayjs
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
  const lastDayOfCurMonthsWeekday = 7 - 1 - cur[cur.length - 1].day();
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
