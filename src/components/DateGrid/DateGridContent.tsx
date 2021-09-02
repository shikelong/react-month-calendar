import { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ONE_WEEK_DAYS } from '../../assets/consts';
import { Event, EventGroup, EventRender } from '../../types';
import { chunk, getDaysbyMonthView } from '../../utils';
import { getAvailableEventChipCount, WeekLayoutStatusMachine } from './utils';
import Week from './Week';
import useDimensions from '../../hooks/useDimensions';

const dayTitleHeight = 24,
  eventChipHeight = 15,
  eventChipMargin = 2;

const DateGridContent = ({
  events,
  eventGroup,
  eventRender,
  currentDate,
  fixedWeekCount,
}: {
  eventGroup: EventGroup;
  events: Event[];
  eventRender: EventRender;
  currentDate: Dayjs;
  fixedWeekCount: boolean;
}): JSX.Element => {
  const [gridContentRef, { height: containerHeight }] = useDimensions({
    liveMeasure: true,
  });

  const weeks: Dayjs[][] = useMemo(() => {
    const { pre, cur, next } = getDaysbyMonthView(currentDate, fixedWeekCount);
    return chunk<Dayjs>([...pre, ...cur, ...next], ONE_WEEK_DAYS);
  }, [currentDate]);

  //cell Height
  let cellHeight = 0;
  if (fixedWeekCount) {
    cellHeight = (containerHeight ?? 0) / 6;
  } else {
    cellHeight = (containerHeight ?? 0) / weeks.length;
  }

  const availableEventChipCount = getAvailableEventChipCount(
    cellHeight,
    dayTitleHeight,
    eventChipHeight,
    eventChipMargin
  );

  return (
    <div ref={gridContentRef} className="dategrid__content">
      {weeks.map((days, index) => {
        let weekLayoutStatus = null;
        if (availableEventChipCount > 0) {
          weekLayoutStatus = new WeekLayoutStatusMachine(
            availableEventChipCount,
            days[0].startOf('week')
          );
        }
        return (
          <Week
            key={`week-${days[0].format('YYYY-MM-DD')}`}
            eventGroup={eventGroup}
            events={events}
            eventRender={eventRender}
            days={days}
            currentDate={currentDate}
            weekLayoutStatusMachineIns={weekLayoutStatus}
          />
        );
      })}
    </div>
  );
};

export default React.memo(DateGridContent);
