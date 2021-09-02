/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck TS2339
import { useState, useCallback, useLayoutEffect } from 'react';

export interface DimensionObject {
  width: number;
  height: number;
  top: number;
  left: number;
  x: number;
  y: number;
  right: number;
  bottom: number;
}

export type UseDimensionsHook = [
  (node: any) => void,
  DimensionObject,
  HTMLElement | undefined
];

export interface UseDimensionsArgs {
  liveMeasure?: boolean;
}

function getDimensionObject(node: HTMLElement): DimensionObject {
  const rect = node.getBoundingClientRect();

  return {
    width: rect.width,
    height: rect.height,
    top: 'x' in rect ? rect.x : rect.top,
    left: 'y' in rect ? rect.y : rect.left,
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top,
    right: rect.right,
    bottom: rect.bottom,
  };
}

function useDimensions({
  liveMeasure = true,
}: UseDimensionsArgs = {}): UseDimensionsHook {
  const [dimensions, setDimensions] = useState<DimensionObject>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    x: 0,
    y: 0,
    right: 0,
    bottom: 0,
  });
  const [node, setNode] = useState();

  const ref = useCallback((node) => {
    setNode(node);
  }, []);

  useLayoutEffect(() => {
    if (node) {
      let timerId = -1;
      const measure = () => {
        window.requestAnimationFrame(() => {
          clearTimeout(timerId);
          if (document.readyState === 'complete') {
            setDimensions(getDimensionObject(node));
          } else {
            timerId = setTimeout(() => {
              measure();
            }, 100);
          }
        });
      };

      measure();

      if (liveMeasure) {
        window.addEventListener('resize', measure);

        return () => {
          window.removeEventListener('resize', measure);
        };
      }
    }
  }, [node]);

  return [ref, dimensions, node];
}

export default useDimensions;
