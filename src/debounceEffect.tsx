import { useEffect, DependencyList } from "react";
import { PixelCrop } from "react-image-crop";

export function useDebounceEffect(
  fn: () => void,
  waitTime: number,
  deps1: PixelCrop | undefined,
  deps2: number,
  deps3: number
) {
  useEffect(() => {
    const t = setTimeout(() => {
      fn();
    }, waitTime);

    return () => {
      clearTimeout(t);
    };
  }, [deps1, deps2, deps3, waitTime]);
}
