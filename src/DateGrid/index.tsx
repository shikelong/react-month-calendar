import classNames from 'classnames';
import dayjs, { Dayjs } from 'dayjs';
import React, { useMemo } from 'react';
import { ONE_WEEK_DAYS, YearToDayFormatStr } from '../consts';
import { Direction, EventGroup, EventRender, Event } from '../types';
import { chunk, getDaysbyMonthView } from '../utils';
import Weekdays from './Weekdays';

type DateGridProps = {
  currentDate: Dayjs;
  onDateChange: (direction: Direction) => void;
  onClickDay: (date: Dayjs) => void;
  // eventGroup: EventGroup;
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

const DateGrid = (props: DateGridProps): JSX.Element => {
  const {
    currentDate,
    onDateChange,
    onClickDay,
    // eventGroup,
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
            <div className="dategrid__rowBg">
              {daysCurWeek.map((day, index) => {
                const dateStr = day.format(YearToDayFormatStr);
                return (
                  <div
                    className={classNames('text-center dategrid__itemBg', {
                      'dategrid__itemBg--curWeek': day.isSame(today, 'week'),
                    })}
                    key={index}
                    data-date={dateStr}
                  ></div>
                );
              })}
            </div>
            <div className="dategrid_content">
              <div className="dategrid_contentRow">
                {daysCurWeek.map((day, index) => {
                  return (
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
                  );
                })}
              </div>
              {renderWeekEvents(daysCurWeek, eventsCurWeak)}
            </div>
          </div>
        );
      })}

      {/* {curDatesEvents.map(eventRender)} */}
    </div>
  );
};

export { DateGrid };
