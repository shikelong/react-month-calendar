import dayjs, { Dayjs } from 'dayjs';
import React from 'react';
import { Direction, Event, EventGroup, EventRender } from '../../types';
import Weekdays from './Weekdays';
import { DateGridContent } from './DateGridContent';

type DateGridProps = {
  currentDate: Dayjs;
  onClickDay: (date: Dayjs) => void;
  eventGroup: EventGroup;
  events: Event[];
  eventRender: EventRender;
  fixedWeekCount: boolean;
};

const DateGrid = (props: DateGridProps): JSX.Element => {
  const {
    currentDate,
    onClickDay,
    eventGroup,
    events,
    eventRender,
    fixedWeekCount,
  } = props;

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
      <DateGridContent
        events={events}
        eventGroup={eventGroup}
        eventRender={eventRender}
        currentDate={currentDate}
        fixedWeekCount={fixedWeekCount}
      />
    </div>
  );
};

export { DateGrid };
