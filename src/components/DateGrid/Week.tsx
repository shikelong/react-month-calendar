import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { Event, EventGroup, EventRender } from '../../types';
import Day from './Day';
import { WeekLayoutStatusMachine } from './utils';

type WeekProps = {
  days: Dayjs[];
  avaliableEventChipCount: number;
  events: Event[];
  currentDate: Dayjs;
  eventRender: EventRender;
  eventGroup: EventGroup;
};

const today = dayjs();

const Week = ({
  days,
  events,
  currentDate,
  eventRender,
  eventGroup,
  avaliableEventChipCount,
}: WeekProps): JSX.Element => {
  const firstOfWeek = days[2];

  const [
    weekLayoutStatusMachineIns,
    setWeekLayoutStatusMachineIns,
  ] = useState<WeekLayoutStatusMachine | null>(null);

  useEffect(() => {
    if (avaliableEventChipCount > 0) {
      setWeekLayoutStatusMachineIns(
        new WeekLayoutStatusMachine(
          avaliableEventChipCount,
          firstOfWeek.startOf('week')
        )
      );
    }
  }, [avaliableEventChipCount, currentDate]);

  return (
    <div className="dategrid__week">
      {weekLayoutStatusMachineIns &&
        days.map((day) => (
          <Day
            day={day}
            firstOfWeek={firstOfWeek}
            eventGroup={eventGroup}
            eventRender={eventRender}
            events={events}
            currentDate={currentDate}
            avaliableEventChipCount={avaliableEventChipCount}
            weekLayoutStatusMachine={weekLayoutStatusMachineIns}
          />
        ))}
    </div>
  );
};

export default Week;
