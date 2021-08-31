import classNames from 'classnames';
import React from 'react';

type IconProps = Styling<{}>;

const LeftIcon = (props: IconProps): JSX.Element => {
  const { className = '', style = {} } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={classNames('icon', {
        [className]: !!className,
      })}
      viewBox="0 0 1024 1024"
    >
      <path d="M672 928c-8 0-16-3.2-22.4-9.6l-384-384c-12.8-12.8-12.8-32 0-44.8l384-384c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L332.8 512l361.6 361.6c12.8 12.8 12.8 32 0 44.8-6.4 6.4-14.4 9.6-22.4 9.6z"></path>
    </svg>
  );
};

const RightIcon = (props: IconProps): JSX.Element => {
  const { className = '', style = {} } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={style}
      className={classNames('icon', {
        [className]: !!className,
      })}
      viewBox="0 0 1024 1024"
    >
      <path d="M352 928c-8 0-16-3.2-22.4-9.6-12.8-12.8-12.8-32 0-44.8L691.2 512 329.6 150.4c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l384 384c12.8 12.8 12.8 32 0 44.8l-384 384C368 924.8 360 928 352 928z"></path>
    </svg>
  );
};

export { LeftIcon, RightIcon };
