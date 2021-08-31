import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import React, { useEffect, useRef, useState } from 'react';
import { YearToDayFormatStr } from '../../assets/consts';
import { Event, EventGroup, EventRender } from '../../types';
import { getAvaliableEventChipCount, renderEventChips } from './utils.tsx';
import { today } from './DateGrid';

export const DateGridContent = ({
  weeks,
  events,
  eventGroup,
  eventRender,
  currentDate,
  fixedWeekCount,
}: {
  weeks: Dayjs[][];
  eventGroup: EventGroup;
  events: Event[];
  eventRender: EventRender;
  currentDate: Dayjs;
  fixedWeekCount: boolean;
}): JSX.Element => {
  const [containerHeight, setContainerHeight] = useState(0);
  const gridContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridContentRef.current) {
      setContainerHeight(gridContentRef.current.offsetHeight);
    }
  }, []);

  //cell Height
  let cellHeight = 0;
  if (fixedWeekCount) {
    cellHeight = containerHeight / 6;
  } else {
    cellHeight = containerHeight / weeks.length;
  }

  const dayTitleHeight = 24,
    eventChipHeight = 15,
    eventChipMargin = 2;

  const avaliableEventChipCount = getAvaliableEventChipCount(
    cellHeight,
    dayTitleHeight,
    eventChipHeight,
    eventChipMargin
  );

  return (
    <div ref={gridContentRef} className="dategrid__content">
      {weeks.map((daysCurWeek, index) => {
        const firstOfWeek = daysCurWeek[2];
        //todo: improve performance.
        const eventsCurWeek = events.filter(
          (event) =>
            event.start.isSame(firstOfWeek, 'week') ||
            (event.end && event.end.isSame(firstOfWeek, 'week'))
        );

        return (
          <div className="dategrid__week">
            {daysCurWeek.map((day, index) => {
              const dateStr = day.format(YearToDayFormatStr);
              let curDatesEvents = eventGroup[dateStr] ?? [];

              //包含在当天的事件和跨日穿过当天的事件
              const curDaysEventsCount = curDatesEvents.length;

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
                  {renderEventChips(
                    day,
                    eventsCurWeek,
                    curDatesEvents,
                    eventRender
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
