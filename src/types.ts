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
  //default=true 对于跨天(!start.isSame(end, 'day))的事件来说，allDay 必定是 true, 程序内部也是这么考虑的。
  //if allDay=false, 事件的显示将会和 startTime 相关
  allDay?: boolean;
  [key: number]: any;
  [key: string]: any;
};

export type EventGroup = {
  [date: string]: Event[];
};

export type EventRender = (
  event: Event,
  index: number,
  events: Event[]
) => JSX.Element;
