import React from 'react';
import { Event, EventRender } from './types';

export const defaultEventRender = (
  event: Event,
  index: number,
  events: []
): JSX.Element => {
  return (
    <div>
      <span className="event-title" title={event.title}>
        {event.title}
      </span>
    </div>
  );
};
