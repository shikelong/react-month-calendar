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
};

const Week = ({
  days,
  events,
  currentDate,
  eventRender,
  eventGroup,
  weekLayoutStatusMachineIns,
}: WeekProps): JSX.Element => {
  const firstOfWeek = days[0].startOf('week');

  return (
    <div className="dategrid__week">
      {weekLayoutStatusMachineIns &&
        days.map((day) => (
          <Day
            key={day.format(YearToDayFormatStr)}
            day={day}
            firstOfWeek={firstOfWeek}
            eventGroup={eventGroup}
            eventRender={eventRender}
            events={events}
            currentDate={currentDate}
            weekLayoutStatusMachine={weekLayoutStatusMachineIns}
          />
        ))}
    </div>
  );
};

export default Week;
