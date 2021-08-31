import { Dayjs } from 'dayjs';
import { ONE_WEEK_DAYS, YearToDayFormatStr } from '../../assets/consts';
import { Event, EventRender } from '../../types';
import React from 'react';
import { getCommonDayCount } from '../../utils';

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
  return events;
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

const maxRenderedEventChipCounts = 3;
const chipHeight = 17;
const chipMargin = 2;
const weekPaddingBottom = 5;

export const renderEventChips = (
  day: Dayjs,
  eventsCurWeek: Event[],
  curDatesEvents: Event[],
  eventRender: EventRender
) => {
  if (curDatesEvents.length === 0) {
    return;
  }

  const dayInWeek = day.day();

  let eventsRenderedInToday = [];

  if (dayInWeek !== 0) {
    //查找前面日期的事件有没有和今天产生交叉的。此类事件也会在今天渲染。
    eventsRenderedInToday = eventsCurWeek.filter((event) => {
      return (
        event.start.isBefore(day, 'day') &&
        event.end &&
        event.end.isSameOrAfter(day, 'day')
      );
    });
  }

  const preEventsRenderedInTodayCount = eventsRenderedInToday.length;

  const emptyChipCount =
    maxRenderedEventChipCounts - preEventsRenderedInTodayCount;

  console.log(day.format(YearToDayFormatStr), preEventsRenderedInTodayCount);

  let moreEventCount = 0;
  if (emptyChipCount <= 0) {
    //今天无法渲染，需要返回今天不能渲染的个数。
    //TODO:

    moreEventCount += 0 - emptyChipCount + curDatesEvents.length;
    console.log('moreEventCount: ', moreEventCount);
    return;
  }

  //Take today's events can rendered...
  const curDatesEventsCanRender = sortDaysEvents(curDatesEvents).slice(
    0,
    emptyChipCount
  );

  const curDaysLeft =
    dayInWeek === 0 ? 0 : ((dayInWeek / ONE_WEEK_DAYS) * 100).toFixed(2) + '%';

  return curDatesEventsCanRender.map((event: Event, index) => {
    const [eventWidth, dayCounts] = getEventChipWidth(event, day);

    return dayCounts === 0 ? null : (
      <div
        className="event-chip"
        style={{
          top: `${
            (1 + index + preEventsRenderedInTodayCount) *
              (chipHeight + chipMargin) +
            weekPaddingBottom
          }px`,
          left: curDaysLeft,
          width: eventWidth,
        }}
      >
        {eventRender(event, index, curDatesEvents)}
      </div>
    );
  });
};
