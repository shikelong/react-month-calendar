import { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ONE_WEEK_DAYS } from '../../assets/consts';
import { Event, EventGroup, EventRender } from '../../types';
import { chunk, getDaysbyMonthView } from '../../utils';
import { getAvailableEventChipCount, WeekLayoutStatusMachine } from './utils';
import Week from './Week';
import useDimensions from '../../hooks/useDimensions';

const DateGridContent = ({
  events,
  eventGroup,
  eventRender,
  currentDate,
  fixedWeekCount,
  sortDaysEvents,
}: {
  eventGroup: EventGroup;
  events: Event[];
  eventRender: EventRender;
  currentDate: Dayjs;
  fixedWeekCount: boolean;
  sortDaysEvents: (events: Event[]) => Event[];
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
    cellHeight = Math.floor((containerHeight ?? 0) / 6);
  } else {
    cellHeight = Math.floor((containerHeight ?? 0) / weeks.length);
  }

  const availableEventChipCount = getAvailableEventChipCount(cellHeight);

  return (
    <div ref={gridContentRef} className="dategrid__content">
      {weeks.map((days, index) => {
        let weekLayoutStatus = null;
        if (availableEventChipCount > 0) {
          weekLayoutStatus = new WeekLayoutStatusMachine(
            availableEventChipCount ?? 1,
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
            sortDaysEvents={sortDaysEvents}
          />
        );
      })}
    </div>
  );
};

export default React.memo(DateGridContent);
