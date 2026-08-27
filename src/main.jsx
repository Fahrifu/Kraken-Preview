import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import PlayerDetail from './pages/PlayerDetail';
import Matches from './pages/Matches';
import MatchDetail from './pages/MatchDetail';
import RosterHistory from './pages/RosterHistory';
import News from './pages/News';
import About from './pages/About';
import Partners from './pages/Partners';
import Staff from './pages/Staff';
import Achievements from './pages/Achievements';
import Tournaments from './pages/Tournaments';
import Admin from './pages/Admin';
import AdminSync from './pages/AdminSync';
import NotFound from './pages/NotFound';
import { DataProvider } from './context/DataContext';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
      <Routes>
        <Route path="/admin" element={<Admin/>}/>
        <Route path="/admin/sync" element={<AdminSync/>}/>
        <Route element={<Layout/>}>
          <Route path="/" element={<Home/>}/>
          <Route path="/teams" element={<Teams/>}/>
          <Route path="/teams/:slug" element={<TeamDetail/>}/>
          <Route path="/players/:slug" element={<PlayerDetail/>}/>
          <Route path="/matches" element={<Matches/>}/>
          <Route path="/matches/:id" element={<MatchDetail/>}/>
          <Route path="/roster-history" element={<RosterHistory/>}/>
          <Route path="/news" element={<News/>}/>
          <Route path="/about" element={<About/>}/>
          <Route path="/partners" element={<Partners/>}/>
          <Route path="/staff" element={<Staff/>}/>
          <Route path="/achievements" element={<Achievements/>}/>
          <Route path="/tournaments" element={<Tournaments/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Route>
      </Routes>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>
);
