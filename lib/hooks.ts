import { useDispatch, useSelector, useStore } from 'react-redux';
import type { RootState, AppDispatch, AppStore } from '@/shared/store/store';


export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected>(
  selector: (state: RootState) => TSelected
) => useSelector<RootState, TSelected>(selector);
export const useAppStore = () => useStore<AppStore>();


// function for animation
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function useOnceInView(options = {}) {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: true,
    margin: "-120px",
    ...options
  });

  return { ref, isInView };
}

