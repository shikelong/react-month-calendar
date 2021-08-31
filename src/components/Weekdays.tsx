import classNames from 'classnames';
import dayjs from 'dayjs';
import React from 'react';

type WeekdaysProps = {};

//first day in the week is sunday
const Weekdays = (props: WeekdaysProps): JSX.Element => {
  const _weekdayMinNames = dayjs.localeData().weekdaysMin() ?? [];

  return (
    <div className="dategrid__header">
      {_weekdayMinNames.map((weekdayName, index) => (
        <label
          key={weekdayName}
          className={classNames('text-center', {
            'dategrid__dayTitle--sunday': index === 0,
            'dategrid__dayTitle--saturday': index === 6,
          })}
        >
          {weekdayName}
        </label>
      ))}
    </div>
  );
};

export default Weekdays;
