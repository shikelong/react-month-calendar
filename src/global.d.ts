declare module '*.svg' {
  const content: any;
  export default content;
  const ReactComponent: any;
  export { ReactComponent };
}

type Styling<T> = T & {
  className?: string;
  style?: React.CSSProperties;
};
