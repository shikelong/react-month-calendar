import React from 'react';
import { Event, EventRender } from './types';

export const defaultEventRender = (
  event: Event,
  index: number,
  events: Event[]
): JSX.Element => {
  return (
    <div className="event-title" title={event.title}>
      <span className="truncate">{event.title}</span>
    </div>
  );
};
