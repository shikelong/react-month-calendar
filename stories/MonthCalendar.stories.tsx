import React from 'react';
import { Meta, Story } from '@storybook/react';
import { MonthCalendar, MonthCalendarProps } from '../src';
import dayjs, { Dayjs } from 'dayjs';
import { Event } from '../src/types';

const meta: Meta = {
  title: 'Welcome',
  component: MonthCalendar,
};

export default meta;

const Template: Story<MonthCalendarProps> = (args) => (
  <MonthCalendar {...args} />
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
  {
    title: "Children's day",
    start: dayjs('2021-07-01'),
    type: EventType.Holiday,
  },
  {
    title: 'Home work abccd',
    start: dayjs('2021-07-08'),
    type: EventType.Notification,
  },
  { title: '测试工作日', start: dayjs('2021-08-03'), type: EventType.Reserve },
  { title: '秋分日', start: dayjs('2021-08-05'), type: EventType.Holiday },
  {
    title: '开崔终了',
    start: dayjs('2021-08-05'),
    end: dayjs('2021-08-09'),
    type: EventType.Reserve,
  },
];

Default.args = {
  locale: 'ja',
  defaultDate: dayjs('2021-08'),
  onClickDay: (day: Dayjs) => {
    console.log('you clicked on : ' + day.format('YYYY/MM/DD'));
  },
  events: mockEvents,
};
