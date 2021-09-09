import dayjs, { Dayjs } from 'dayjs';
import React, { useEffect, useMemo, useState } from 'react';
import { YearToDayFormatStr } from '../../assets/consts';
import { Event, EventGroup, EventRender } from '../../types';
import Day from './Day';
import { WeekLayoutStatusMachine } from './utils';

type WeekProps = {
  days: Dayjs[];
  events: Event[];
  currentDate: Dayjs;
  eventRender: EventRender;
  eventGroup: EventGroup;
  weekLayoutStatusMachineIns: WeekLayoutStatusMachine | null;
  sortDaysEvents: (events: Event[]) => Event[];
};

const Week = ({
  days,
  events,
  currentDate,
  eventRender,
  eventGroup,
  weekLayoutStatusMachineIns,
  sortDaysEvents,
}: WeekProps): JSX.Element => {
  const firstOfWeek = days[0].startOf('week');

  return (
    <div className="dategrid__week">
      {days.map((day) => (
        <Day
          key={day.format(YearToDayFormatStr)}
          day={day}
          firstOfWeek={firstOfWeek}
          eventGroup={eventGroup}
          eventRender={eventRender}
          events={events}
          currentDate={currentDate}
          weekLayoutStatusMachine={weekLayoutStatusMachineIns}
          sortDaysEvents={sortDaysEvents}
        />
      ))}
    </div>
  );
};

export default Week;
