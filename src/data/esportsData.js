export const organization = {
  name: 'Kraken',
  fullName: 'UiA Kraken',
  established: 2026,
  region: 'Norway',
  primary: '#a00024',
  bright: '#ff003c',
};

export const teams = [
  {
    slug: 'valorant',
    name: 'VALORANT',
    short: 'VAL',
    tier: 'flagship',
    region: 'EMEA',
    record: '18–6',
    ranking: '#12 EMEA',
    summary: 'Structured round play, decisive entry pressure and disciplined utility usage.',
    stats: [{ label: 'WIN RATE', value: '75%' }, { label: 'MAPS', value: '41' }, { label: 'ROUNDS', value: '589' }],
  },
  {
    slug: 'league-of-legends',
    name: 'LEAGUE OF LEGENDS',
    short: 'LOL',
    tier: 'flagship',
    region: 'NORDICS',
    record: '14–4',
    ranking: '#6 Nordics',
    summary: 'A macro-focused roster built around coordinated objective control and flexible drafting.',
    stats: [{ label: 'WIN RATE', value: '78%' }, { label: 'GAMES', value: '18' }, { label: 'AVG KDA', value: '3.7' }],
  },
  {
    slug: 'counter-strike',
    name: 'COUNTER-STRIKE',
    short: 'CS',
    tier: 'flagship',
    region: 'EUROPE',
    record: '21–9',
    ranking: '#28 Europe',
    summary: 'High-tempo executes balanced by methodical mid-round adaptation and strong fundamentals.',
    stats: [{ label: 'WIN RATE', value: '70%' }, { label: 'MAPS', value: '52' }, { label: 'AVG RATING', value: '1.11' }],
  },
  {
    slug: 'overwatch-2',
    name: 'OVERWATCH 2',
    short: 'OW2',
    tier: 'secondary',
    region: 'EUROPE',
    record: '10–7',
    ranking: 'Development',
    summary: 'A developing roster focused on tempo, composition flexibility and clean team-fight execution.',
    stats: [{ label: 'WIN RATE', value: '59%' }, { label: 'MATCHES', value: '17' }, { label: 'MAP DIFF', value: '+9' }],
  },
  {
    slug: 'fortnite',
    name: 'FORTNITE',
    short: 'FN',
    tier: 'secondary',
    region: 'EUROPE',
    record: '—',
    ranking: 'Development',
    summary: 'Individual mechanics, duo chemistry and tournament consistency form the core of the division.',
    stats: [{ label: 'PLAYERS', value: '3' }, { label: 'FINALS', value: '6' }, { label: 'TOP 10', value: '14' }],
  },
];

export const players = [
  { slug:'nexus', game:'valorant', ign:'NEXUS', name:'Jonas Andersen', role:'Duelist', country:'NO', number:'01', bio:'Explosive space creator who thrives when Kraken needs first contact.', stats:[['K/D','1.31'],['ACS','284'],['ADR','172'],['HS%','27%']], specialties:['Jett','Raze','Neon'] },
  { slug:'void', game:'valorant', ign:'VOID', name:'Lucas Berg', role:'Controller', country:'SE', number:'02', bio:'Calm mid-round voice specializing in smoke timing and site control.', stats:[['KAST','74%'],['K/D','1.14'],['ADR','151'],['AST/R','0.42']], specialties:['Omen','Viper','Astra'] },
  { slug:'kai', game:'valorant', ign:'KAI', name:'Emil Madsen', role:'Initiator', country:'DK', number:'03', bio:'Information-first initiator with a strong read on opponent tendencies.', stats:[['ADR','167'],['K/D','1.18'],['KAST','76%'],['APR','0.39']], specialties:['Sova','Fade','Breach'] },
  { slug:'zero', game:'valorant', ign:'ZERO', name:'Elias Korhonen', role:'Sentinel', country:'FI', number:'04', bio:'Reliable anchor with patient lurk timing and excellent clutch discipline.', stats:[['HS%','27%'],['K/D','1.16'],['CLUTCH','22%'],['KAST','79%']], specialties:['Cypher','Killjoy','Veto'] },
  { slug:'nova', game:'valorant', ign:'NOVA', name:'Noah Strand', role:'Flex', country:'NO', number:'05', bio:'Flexible fifth capable of filling gaps without sacrificing impact.', stats:[['K/D','1.19'],['ACS','231'],['ADR','158'],['KAST','75%']], specialties:['Gekko','Sage','Viper'] },

  { slug:'fjord', game:'league-of-legends', ign:'FJORD', name:'Sander Nilsen', role:'Top', country:'NO', number:'01', bio:'Stable weak-side top laner with strong team-fight positioning.', stats:[['KDA','3.1'],['CS/M','8.4'],['KP%','62%'],['GOLD/M','418']], specialties:['Ornn','Kennen','Gnar'] },
  { slug:'pulse', game:'league-of-legends', ign:'PULSE', name:'Mikkel Sørensen', role:'Jungle', country:'DK', number:'02', bio:'Proactive jungler who creates early tempo around lanes and objectives.', stats:[['KDA','4.2'],['KP%','74%'],['GOLD/M','397'],['DMG%','19%']], specialties:['Vi','Sejuani','Viego'] },
  { slug:'echo', game:'league-of-legends', ign:'ECHO', name:'Anton Lind', role:'Mid', country:'SE', number:'03', bio:'Control-mage specialist and central damage source in late fights.', stats:[['KDA','4.5'],['CS/M','9.1'],['KP%','68%'],['DMG%','27%']], specialties:['Orianna','Azir','Syndra'] },
  { slug:'surge', game:'league-of-legends', ign:'SURGE', name:'Oliver Berg', role:'Bot', country:'NO', number:'04', bio:'Scaling carry with a disciplined lane phase and confident positioning.', stats:[['KDA','4.0'],['CS/M','9.7'],['KP%','71%'],['DMG%','31%']], specialties:['Kai\'Sa','Jinx','Ezreal'] },
  { slug:'ward', game:'league-of-legends', ign:'WARD', name:'Leo Niemi', role:'Support', country:'FI', number:'05', bio:'Vision controller and primary engage coordinator for Kraken.', stats:[['KDA','4.8'],['KP%','78%'],['VISION/M','2.1'],['ASSISTS','11.4']], specialties:['Rakan','Nautilus','Renata'] },

  { slug:'frost', game:'counter-strike', ign:'FROST', name:'Henrik Dahl', role:'AWPer', country:'NO', number:'01', bio:'Primary sniper with a measured opening style and strong late-round value.', stats:[['RATING','1.18'],['ADR','78.4'],['K/D','1.24'],['KAST','74%']], specialties:['AWP','Clutch','Opening'] },
  { slug:'rex', game:'counter-strike', ign:'REX', name:'Mathias Lund', role:'IGL', country:'DK', number:'02', bio:'In-game leader responsible for tempo changes and mid-round structure.', stats:[['RATING','1.02'],['ADR','71.2'],['KAST','72%'],['AST/R','0.18']], specialties:['IGL','Rifler','Utility'] },
  { slug:'ember', game:'counter-strike', ign:'EMBER', name:'Viktor Holm', role:'Entry', country:'SE', number:'03', bio:'Aggressive first-contact rifler creating room for the trading pack.', stats:[['RATING','1.13'],['ADR','84.7'],['K/D','1.10'],['OPEN K','0.15']], specialties:['Entry','AK-47','Space'] },
  { slug:'lock', game:'counter-strike', ign:'LOCK', name:'Aleksi Vala', role:'Anchor', country:'FI', number:'04', bio:'Site anchor with disciplined utility and repeatable defensive protocols.', stats:[['RATING','1.09'],['ADR','76.1'],['KAST','75%'],['HS%','51%']], specialties:['Anchor','M4','Utility'] },
  { slug:'rift', game:'counter-strike', ign:'RIFT', name:'Adrian Moen', role:'Rifler', country:'NO', number:'05', bio:'Versatile rifler bridging aggressive and supportive responsibilities.', stats:[['RATING','1.14'],['ADR','81.5'],['K/D','1.16'],['KAST','73%']], specialties:['Rifle','Trade','Lurk'] },

  { slug:'orbit', game:'overwatch-2', ign:'ORBIT', name:'Markus Solberg', role:'Tank', country:'NO', number:'01', bio:'Frontline shotcaller built around controlled engages.', stats:[['ELIM/10','18.2'],['DMG/10','8.9K'],['DEATH/10','5.1'],['WR','61%']], specialties:['Winston','Sigma','Ramattra'] },
  { slug:'prism', game:'overwatch-2', ign:'PRISM', name:'Ida Eriksen', role:'DPS', country:'NO', number:'02', bio:'Hitscan specialist with strong target priority.', stats:[['ELIM/10','21.4'],['DMG/10','10.7K'],['CRIT','18%'],['WR','58%']], specialties:['Sojourn','Cassidy','Tracer'] },
  { slug:'lumen', game:'overwatch-2', ign:'LUMEN', name:'Maja Lind', role:'Support', country:'SE', number:'03', bio:'Flexible support balancing survivability with playmaking utility.', stats:[['HEAL/10','9.4K'],['AST/10','13.1'],['DEATH/10','4.3'],['WR','60%']], specialties:['Ana','Kiriko','Juno'] },

  { slug:'tidal', game:'fortnite', ign:'TIDAL', name:'Kristian Moe', role:'IGL / Duo', country:'NO', number:'01', bio:'Strategic caller focused on rotations and endgame layer control.', stats:[['FINALS','4'],['AVG PTS','312'],['TOP 10','8'],['ELIMS','3.8']], specialties:['IGL','Rotations','Endgame'] },
  { slug:'snap', game:'fortnite', ign:'SNAP', name:'Aksel Berg', role:'Fragger / Duo', country:'NO', number:'02', bio:'Mechanical fragger specializing in converting refresh opportunities.', stats:[['FINALS','4'],['AVG PTS','327'],['TOP 10','9'],['ELIMS','5.1']], specialties:['Fighting','Edits','Refresh'] },
  { slug:'vex', game:'fortnite', ign:'VEX', name:'Nora Falk', role:'Solo', country:'SE', number:'03', bio:'Consistent solo competitor with a risk-managed tournament style.', stats:[['FINALS','2'],['AVG PTS','289'],['TOP 10','6'],['ELIMS','4.2']], specialties:['Solo','Surge','Placement'] },
];

export const matches = [
  { id:1, game:'valorant', opponent:'Fnatic', event:'VCT EMEA', date:'22 AUG 2026', time:'18:00 CEST', status:'upcoming' },
  { id:2, game:'league-of-legends', opponent:'Nordic Forge', event:'Nordic Championship', date:'24 AUG 2026', time:'19:00 CEST', status:'upcoming' },
  { id:3, game:'counter-strike', opponent:'Apex Core', event:'European Open', date:'26 AUG 2026', time:'20:00 CEST', status:'upcoming' },
  { id:4, game:'valorant', opponent:'NAVI', event:'VCT EMEA', date:'15 AUG 2026', time:'', status:'win', score:'2–1' },
  { id:5, game:'counter-strike', opponent:'Northline', event:'European Open', date:'12 AUG 2026', time:'', status:'win', score:'2–0' },
  { id:6, game:'league-of-legends', opponent:'Polar Five', event:'Nordic Championship', date:'10 AUG 2026', time:'', status:'loss', score:'0–1' },
];

export const news = [
  { tag:'VALORANT', date:'18 AUG 2026', title:'Kraken locks its starting five for the autumn split.', text:'The flagship Valorant division enters the next competition block with a finalized five-player roster.' },
  { tag:'ORG', date:'12 AUG 2026', title:'A competitive identity built around UiA Kraken.', text:'Red, white and a recognizable Kraken mark anchor the visual language across every division.' },
  { tag:'LEAGUE', date:'05 AUG 2026', title:'League division enters Nordic Championship qualifiers.', text:'Kraken prepares its first full qualifier block with an emphasis on objective control and clean execution.' },
];

export const getTeam = (slug) => teams.find((team) => team.slug === slug);
export const getPlayer = (slug) => players.find((player) => player.slug === slug);
export const getTeamPlayers = (teamSlug) => players.filter((player) => player.game === teamSlug);
export const getTeamMatches = (teamSlug) => matches.filter((match) => match.game === teamSlug);
