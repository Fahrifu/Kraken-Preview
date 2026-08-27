
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';
import { teams as fallbackTeams, players as fallbackPlayers, matches as fallbackMatches, news as fallbackNews } from '../data/esportsData';

const DataContext = createContext(null);

function normalizePlayer(player) {
  return {
    ...player,
    game: player.game || player.team?.slug || '',
    stats: Array.isArray(player.stats) ? player.stats : [],
    specialties: Array.isArray(player.specialties) ? player.specialties : [],
  };
}

function normalizeMatch(match) {
  return { ...match, game: match.game || match.team?.slug || '' };
}

export function DataProvider({ children }) {
  const [data, setData] = useState({
    teams: fallbackTeams,
    players: fallbackPlayers,
    matches: fallbackMatches,
    news: fallbackNews,
  });
  const [source, setSource] = useState('fallback');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [teams, players, matches, news] = await Promise.all([
        api.getTeams(), api.getPlayers(), api.getMatches(), api.getNews()
      ]);
      setData({
        teams,
        players: players.map(normalizePlayer),
        matches: matches.map(normalizeMatch),
        news,
      });
      setSource('database');
      setError('');
      setLastUpdated(new Date());
    } catch (err) {
      setData({ teams: fallbackTeams, players: fallbackPlayers, matches: fallbackMatches, news: fallbackNews });
      setSource('fallback');
      setError(err.message || 'Unable to reach Kraken API');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const value = useMemo(() => ({ ...data, source, loading, error, lastUpdated, refresh }), [data, source, loading, error, lastUpdated, refresh]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useKrakenData() {
  const value = useContext(DataContext);
  if (!value) throw new Error('useKrakenData must be used inside DataProvider');
  return value;
}
