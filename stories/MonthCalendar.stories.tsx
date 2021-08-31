import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MonthCalendar, MonthCalendarProps } from '../src';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../src/types';
import classNames from 'classnames';
import './Story.css';

const meta: Meta = {
  title: 'Welcome',
  component: MonthCalendar,
};

export default meta;

const Template: Story<MonthCalendarProps> = (args) => (
  <div style={{ height: 700 }}>
    <MonthCalendar {...args} />
  </div>
);

// By passing using the Args format for exported stories, you can control the props for a component for reuse in a test
// https://storybook.js.org/docs/react/workflows/unit-testing
export const Default = Template.bind({});

enum EventType {
  Holiday = 1,
  Notification = 2,
  Reserve = 3,
}

const mockEvents: Event[] = [
  // {
  //   title: "Children's day",
  //   start: dayjs('2021-07-01'),
  //   type: EventType.Holiday,
  //   allDay: true,
  // },
  // {
  //   title: 'Home work abccd',
  //   start: dayjs('2021-07-08 13:00:00'),
  //   end: dayjs('2021-07-08 15:00:00'),
  //   type: EventType.Notification,
  //   allDay: false,
  // },
  {
    title: '开放日 7.23 ~ 8.7',
    start: dayjs('2021-07-23'),
    end: dayjs('2021-08-07'),
    type: EventType.Notification,
    allDay: true,
  },
  { title: '秋分日', start: dayjs('2021-08-04'), type: EventType.Holiday },
  {
    title: '英语课',
    start: dayjs('2021-08-05 19:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '你定的晚饭已经到了',
    start: dayjs('2021-08-05 20:00:00'),
    type: EventType.Notification,
  },
  {
    title: '你定的滴滴已经到了',
    start: dayjs('2021-08-05 21:00:00'),
    type: EventType.Notification,
  },
  {
    title: '😊日语课第二节',
    start: dayjs('2021-08-05 08:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '🍉日语课第三节',
    start: dayjs('2021-08-06 12:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '开崔终了 8.5 ~ 8.9',
    start: dayjs('2021-08-05 15:00:00'),
    end: dayjs('2021-08-09 16:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '月末会议4',
    start: dayjs('2021-08-31 20:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '月末会议3',
    start: dayjs('2021-08-31 19:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '月末会议2',
    start: dayjs('2021-08-31 12:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '月末会议1',
    start: dayjs('2021-08-31 08:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '月末会议5',
    start: dayjs('2021-08-31 22:00:00'),
    type: EventType.Reserve,
  },
  {
    title: '放假提醒',
    start: dayjs('2021-09-09'),
    end: dayjs('2021-09-15'),
    type: EventType.Notification,
  },
];

Default.args = {
  locale: 'ja',
  defaultDate: dayjs('2021-08'),
  onClickDay: (day: Dayjs) => {
    console.log('you clicked on : ' + day.format('YYYY/MM/DD'));
  },
  onMonthChange: (month: Dayjs) => {
    console.log('month changed to : ' + month.format('YYYY/MM/DD'));
  },
  eventRender: (event: Event, index: number, events: Event[]) => {
    return (
      <div
        className={classNames('custom-event-title', {
          reserve: event!.type === EventType.Reserve,
          holiday: event!.type === EventType.Holiday,
          notification: event!.type === EventType.Notification,
        })}
      >
        {event.title}
      </div>
    );
  },
  events: mockEvents,
};
