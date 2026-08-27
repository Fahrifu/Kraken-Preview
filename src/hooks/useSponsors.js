import { useEffect, useState } from 'react';
import { api } from '../services/api';

export function useSponsors() {
  const [sponsors, setSponsors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    api.getSponsors()
      .then((data) => { if (active) setSponsors(Array.isArray(data) ? data : []); })
      .catch((err) => { if (active) setError(err instanceof Error ? err.message : 'Unable to load partners'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  return { sponsors, loading, error };
}
