import { useEffect, useRef, useState } from 'react';

export function useAutoSave<T>(data: T, storageKey: string, interval = 30000) {
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const prevDataRef = useRef<string>(JSON.stringify(data));
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentData = JSON.stringify(data);
    const hasChanges = currentData !== prevDataRef.current;
    
    setIsDirty(hasChanges);

    if (hasChanges) {
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      // Set new timeout for auto-save
      saveTimeoutRef.current = setTimeout(() => {
        localStorage.setItem(storageKey, currentData);
        setLastSaved(new Date());
        prevDataRef.current = currentData;
        setIsDirty(false);
      }, interval);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data, storageKey, interval]);

  // Manual save function
  const saveNow = () => {
    const currentData = JSON.stringify(data);
    localStorage.setItem(storageKey, currentData);
    setLastSaved(new Date());
    prevDataRef.current = currentData;
    setIsDirty(false);
  };

  return { lastSaved, isDirty, saveNow };
}
