import { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ONE_WEEK_DAYS } from '../../assets/consts';
import { Event, EventGroup, EventRender } from '../../types';
import { chunk, getDaysbyMonthView } from '../../utils';
import { getAvaliableEventChipCount } from './utils.tsx';
import Week from './Week';

export const DateGridContent = ({
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
  const [containerHeight, setContainerHeight] = useState(0);
  const gridContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridContentRef.current) {
      setContainerHeight(gridContentRef.current.offsetHeight);
    }
  }, []);

  const weeks: Dayjs[][] = useMemo(() => {
    const { pre, cur, next } = getDaysbyMonthView(currentDate, fixedWeekCount);
    return chunk<Dayjs>([...pre, ...cur, ...next], ONE_WEEK_DAYS);
  }, [currentDate]);

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
      {weeks.map((days) => (
        <Week
          eventGroup={eventGroup}
          events={events}
          eventRender={eventRender}
          days={days}
          currentDate={currentDate}
          avaliableEventChipCount={avaliableEventChipCount}
        />
      ))}
    </div>
  );
};
