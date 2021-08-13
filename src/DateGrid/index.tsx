import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { ONE_WEEK_DAYS, YearToDayFormatStr } from '../consts';
import { Direction, EventGroup, EventRender, Event } from '../types';
import { chunk, getCommonDayCount, getDaysbyMonthView } from '../utils';
import Weekdays from './Weekdays';

type DateGridProps = {
  currentDate: Dayjs;
  onDateChange: (direction: Direction) => void;
  onClickDay: (date: Dayjs) => void;
  eventGroup: EventGroup;
  events: Event[];
  eventRender: EventRender;
  fixedWeekCount: boolean;
};

const today = dayjs();

//渲染本周的 Event 数据。返回的是一个数组，[div[FirstEvents], div[Seconds], etc...] 长度是事件行数
//TODO 对于超出显示的事件行 应该不予显示
//需要考虑 allDay 等处理。
//index 确定规则：
// 1. 先看开始时间
// 2. 再看持续时间
const renderWeekEvents = (daysCurWeek: Dayjs[], eventsCurWeek: Event[]) => {
  // console.log(daysCurWeek, eventsCurWeek);
  //TODO:
  //Step1. 整理事件数据 计算事件的行号。
  //Step2. 根据 index 行号，对事件进行分组。然后按组生成 JSX 返回。注意要把放不下的组也返回，并且每 day 对应的放不下的事件数量。

  let weekEvents: Event[] = [];

  let displayIndexInWholeWeek = 0;

  daysCurWeek.forEach((day, index) => {
    let curDaysEvent = eventsCurWeek.filter(
      (event) =>
        event.start.isSame(day, 'day') ||
        (event.end && event.end.isSame(day, 'day'))
    );

    if (curDaysEvent.length === 0) {
      return;
    }

    curDaysEvent = curDaysEvent.sort((a, b) => {
      if (a.start.isSame(b.start, 'day') && a.end && b.end) {
        if (
          Number(a.end) - Number(a.start) >=
          Number(b.end) - Number(b.start)
        ) {
          return -1;
        } else {
          return 1;
        }
      }
      if (a.start.isBefore(b.start)) {
        return -1;
      }

      return 0;
    });

    curDaysEvent.forEach((event, index) => {
      if (displayIndexInWholeWeek in event) {
        return;
      } else {
        event.sortIndex = displayIndexInWholeWeek++;
      }
    });

    weekEvents = weekEvents.concat(curDaysEvent);
  });

  console.log(weekEvents);
};

const normalizeLength = (length: number) => {
  return length.toFixed(2) + '%';
};
const getEventChipWidth = (event: Event, day: Dayjs) => {
  const oneDayLength = 100 / (1 * ONE_WEEK_DAYS);

  const commonDayCounts = getCommonDayCount(
    [day.startOf('week'), day.endOf('week')],
    [event.start, event.end ?? event.start]
  );

  return normalizeLength(commonDayCounts * oneDayLength);
};

const maxRenderedEventChipCounts = 3;

const sortDaysEvents = (events: Event[]): Event[] => {
  return events;
};

const chipHeight = 20;
const chipMargin = 3;

const renderEventChips = (
  day: Dayjs,
  eventsCurWeak: Event[],
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
    eventsRenderedInToday = eventsCurWeak.filter((event) => {
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

  let moreEventCount = 0;
  if (emptyChipCount <= 0) {
    //今天无法渲染，需要返回今天不能渲染的个数。
    //TODO:

    moreEventCount += 0 - emptyChipCount + curDatesEvents.length;
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
    const eventWidth = getEventChipWidth(event, day);

    return (
      <div
        className="event-chip"
        style={{
          top: `${
            (1 + index + preEventsRenderedInTodayCount) *
            (chipHeight + chipMargin)
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
      {weeks.map((daysCurWeek, index) => {
        const firstOfWeek = daysCurWeek[2];
        //todo: improve performance.
        const eventsCurWeak = events.filter(
          (event) =>
            event.start.isSame(firstOfWeek, 'week') ||
            (event.end && event.end.isSame(firstOfWeek, 'week'))
        );

        return (
          <div className="dategrid__week">
            {daysCurWeek.map((day, index) => {
              const dateStr = day.format(YearToDayFormatStr);
              let curDatesEvents = eventGroup[dateStr] ?? [];

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
                    eventsCurWeak,
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

export { DateGrid };
