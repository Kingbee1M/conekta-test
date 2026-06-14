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


export function getNameInitials(fullName: string): string {
  if (!fullName || typeof fullName !== 'string') return '';
  const nameParts = fullName.trim().split(/\s+/);

  if (nameParts.length === 0 || nameParts[0] === '') return '';

  const firstInitial = nameParts[0].charAt(0).toUpperCase();

  if (nameParts.length > 1) {
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  }

  return firstInitial;
}