// hooks/useDebounce.js — debounces the search input so we don't fire an API call
// on every keystroke. Use in HomePage for the search bar.
// Phase 3 ticket: TICKET-FE-04

import { useEffect, useState } from "react";

export function useDebounce(value, delayMs = 400) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const t = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(t);
    }, [value, delayMs]);
    return debounced;
}