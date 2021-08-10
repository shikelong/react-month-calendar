import { Dayjs } from 'dayjs';

export enum Direction {
  //past
  BACKWARD = 0,
  //future
  FORWARD = 1,
}

export type Event = {
  title: string;
  start: Dayjs;
  end?: Dayjs;
  [key: string | number]: any;
};

export type EventGroup = {
  [date: string]: Event[];
};

export type EventRender = (
  event: Event,
  index: number,
  events: Event[]
) => JSX.Element;
