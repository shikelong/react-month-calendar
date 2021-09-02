import classNames from 'classnames';
import { Dayjs } from 'dayjs';
import 'dayjs/locale/ja';
import arraySupport from 'dayjs/plugin/arraySupport';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import localeData from 'dayjs/plugin/localeData';
import minMax from 'dayjs/plugin/minMax';
import weekday from 'dayjs/plugin/weekday';
import * as React from 'react';
import 'react-app-polyfill/ie11';
import * as ReactDOM from 'react-dom';
import '../dist/react-month-calendar.css';
import { MonthCalendar } from '../src/index';
import './index.css';
import dayjs = require('dayjs');
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(arraySupport);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(minMax);
enum EventType {
  Holiday = 1,
  Notification = 2,
  Reserve = 3,
}

const mockEvents = [
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
    title: '开放日 7.23 ~ 8.3',
    start: dayjs('2021-07-23'),
    end: dayjs('2021-08-03'),
    type: EventType.Notification,
    allDay: true,
  },
  {
    title: '开放日2 8.3 ~ 8.10',
    start: dayjs('2021-08-3'),
    end: dayjs('2021-08-10'),
    type: EventType.Notification,
    allDay: true,
  },
  {
    title: '开放日3 8.3 ~ 8.9',
    start: dayjs('2021-08-3'),
    end: dayjs('2021-08-9'),
    type: EventType.Notification,
    allDay: true,
  },
  {
    title: '开放日4 8.3 ~ 8.9',
    start: dayjs('2021-08-3'),
    end: dayjs('2021-08-9'),
    type: EventType.Notification,
    allDay: true,
  },
  {
    title: '开放日5 8.3 ~ 8.9',
    start: dayjs('2021-08-3'),
    end: dayjs('2021-08-9'),
    type: EventType.Notification,
    allDay: true,
  },
  { title: '秋分日', start: dayjs('2021-08-04'), type: EventType.Holiday },
  { title: '秋分日2', start: dayjs('2021-08-04'), type: EventType.Holiday },
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

const App = () => {
  return (
    <div>
      <MonthCalendar
        style={{ height: '80vh' }}
        locale={'ja'}
        defaultDate={dayjs('2021-08')}
        onClickDay={(day: Dayjs) => {
          console.log('you clicked on : ' + day.format('YYYY/MM/DD'));
        }}
        onMonthChange={(month: dayjs.Dayjs) => {
          console.log('month changed to : ' + month.format('YYYY/MM/DD'));
        }}
        eventRender={(event, index, events) => {
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
        }}
        events={mockEvents}
      />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
