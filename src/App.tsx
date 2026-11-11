import { useEffect, useState } from 'react';
import { FoundationSmoke } from '@/dev/FoundationSmoke';
import { WordmarkLab } from '@/dev/WordmarkLab';

function useHash() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return hash;
}

// Temporary: dev pages switched by the URL hash (not a router). Replaced by the router and app shell in Step 5.
export function App() {
  return useHash() === '#wordmark' ? <WordmarkLab /> : <FoundationSmoke />;
}
