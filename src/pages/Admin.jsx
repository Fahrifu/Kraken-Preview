
import { useEffect, useMemo, useState } from 'react';
import { LogOut, Plus, RefreshCw, Save, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import MediaField from '../components/MediaField';

const resources = [
  { key: 'teams', label: 'Teams' },
  { key: 'players', label: 'Players' },
  { key: 'matches', label: 'Matches' },
  { key: 'news', label: 'News' },
  { key: 'sponsors', label: 'Sponsors' },
  { key: 'staff', label: 'Staff' },
  { key: 'achievements', label: 'Achievements' },
  { key: 'tournaments', label: 'Tournaments' },
  { key: 'opponents', label: 'Opponents' },
  { key: 'matchMaps', label: 'Match Maps' },
  { key: 'matchLineups', label: 'Match Lineups' },
  { key: 'matchPlayerStats', label: 'Match Stats' },
  { key: 'rosterHistory', label: 'Roster History' },
  { key: 'integrationConfigs', label: 'Integration Config' },
  { key: 'syncRuns', label: 'Sync Runs' },
  { key: 'externalMatches', label: 'External Matches' }
];

const starter = {
  teams: { slug:'', name:'', short:'', tier:'flagship', region:'', record:'', ranking:'', summary:'', stats:[] },
  players: { slug:'', ign:'', name:'', role:'', country:'NO', number:'01', bio:'', stats:[], specialties:[], teamId:1 },
  matches: { opponent:'', event:'', date:'', time:'', status:'upcoming', score:null, teamId:1, opponentId:null, tournamentId:null },
  news: { tag:'ORG', date:'', title:'', text:'', imageUrl:'', published:true },
  sponsors: { name:'', websiteUrl:'', logoUrl:'', tier:'partner', description:'', displayOrder:0, active:true },
  staff: { slug:'', name:'', role:'', country:'NO', bio:'', imageUrl:'', socials:null, active:true, teamId:null },
  achievements: { title:'', tournament:'', placement:'', date:'', prize:'', description:'', imageUrl:'', featured:false, teamId:null },
  tournaments: { slug:'', name:'', organizer:'', region:'', tier:'', startDate:'', endDate:'', logoUrl:'', websiteUrl:'', status:'upcoming', teamId:null },
  opponents: { name:'', slug:'', region:'', logoUrl:'', websiteUrl:'' },
  matchMaps: { name:'', order:1, krakenScore:null, opponentScore:null, result:'', notes:'', matchId:1 },
  matchLineups: { side:'kraken', slot:1, role:'', playerName:'', matchId:1, playerId:null },
  matchPlayerStats: { label:'', value:'', category:'', sortOrder:0, matchId:1, playerId:1 },
  rosterHistory: { joinedAt:'', leftAt:'', role:'', notes:'', active:false, teamId:1, playerId:1 },
  integrationConfigs: { provider:'riot', game:'league-of-legends', enabled:false, region:'euw1', routing:'europe', teamExternalId:'', settings:null, teamId:null },
  syncRuns: { provider:'', game:'', status:'', imported:0, updated:0, skipped:0, errorMessage:'', metadata:null },
  externalMatches: { provider:'', externalId:'', game:'', payloadHash:'', raw:null, matchId:null }
};

function toTextarea(value) {
  if (typeof value === 'string') return value;
  return JSON.stringify(value ?? '', null, 2);
}

function parseField(key, value) {
  const jsonFields = [
    'stats',
    'specialties',
    'socials',
    'externalAccounts',
    'settings',
    'metadata',
    'raw'
  ];

  if (jsonFields.includes(key)) {
    if (value === '' || value === null) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  const numberFields = [
    'teamId',
    'playerId',
    'matchId',
    'tournamentId',
    'opponentId',
    'displayOrder',
    'sortOrder',
    'slot',
    'order',
    'krakenScore',
    'opponentScore'
  ];

  if (numberFields.includes(key)) {
    if (value === '' || value === null) {
      return null;
    }

    return Number(value);
  }

  if (key === 'score' && value === '') {
    return null;
  }

  return value;
}

export default function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem('kraken_admin_token') || '');
  const [email, setEmail] = useState('admin@kraken.local');
  const [password, setPassword] = useState('');
  const [resource, setResource] = useState('teams');
  const [items, setItems] = useState([]);
  const [overview, setOverview] = useState(null);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const editableKeys = useMemo(() => {
    const source = editing || starter[resource];
    return Object.keys(source).filter(k => !['id','createdAt','updatedAt'].includes(k));
  }, [editing, resource]);

  async function load() {
    if (!token) return;
    setBusy(true);
    try {
      const [list, counts] = await Promise.all([
        api.adminList(resource, token),
        api.adminOverview(token)
      ]);
      setItems(list);
      setOverview(counts);
      setMessage('');
    } catch (e) {
      setMessage(e.message);
      if (/401|Authentication|expired/i.test(e.message)) logout();
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => { load(); }, [token, resource]);

  async function login(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await api.login(email, password);
      localStorage.setItem('kraken_admin_token', result.token);
      setToken(result.token);
      setPassword('');
      setMessage('');
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }

  function logout() {
    localStorage.removeItem('kraken_admin_token');
    setToken('');
    setEditing(null);
  }

  function startCreate() {
    setEditing(structuredClone(starter[resource]));
  }

  async function save() {
    const payload = {};
    for (const key of editableKeys) payload[key] = editing[key];

    setBusy(true);
    try {
      if (editing.id) await api.adminUpdate(resource, editing.id, payload, token);
      else await api.adminCreate(resource, payload, token);
      setEditing(null);
      await load();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id) {
    if (!confirm('Delete this item?')) return;
    setBusy(true);
    try {
      await api.adminDelete(resource, id, token);
      if (editing?.id === id) setEditing(null);
      await load();
    } catch (e) {
      setMessage(e.message);
    } finally {
      setBusy(false);
    }
  }

  if (!token) {
    return <main className="admin-shell admin-login-shell">
      <section className="admin-login-card">
        <img src="/kraken-logo-transparent.png" alt="UiA Kraken" />
        <span className="eyebrow">KRAKEN CONTROL ROOM</span>
        <h1>Admin Login</h1>
        <p>Manage the public roster, competitive schedule and organization news.</p>
        <form onSubmit={login}>
          <label>Email<input value={email} onChange={e=>setEmail(e.target.value)} type="email" /></label>
          <label>Password<input value={password} onChange={e=>setPassword(e.target.value)} type="password" /></label>
          <button className="button button-primary" disabled={busy}>Sign in</button>
        </form>
        {message && <p className="admin-error">{message}</p>}
      </section>
    </main>;
  }

  return <main className="admin-shell">
    <header className="admin-topbar">
      <div>
        <span className="eyebrow">KRAKEN CONTROL ROOM</span>
        <h1>Organization Admin</h1>
      </div>
      <div className="admin-actions">
        <button className="icon-button" onClick={load} title="Refresh"><RefreshCw size={18}/></button>
        <button className="button button-ghost" onClick={logout}><LogOut size={16}/> Logout</button>
      </div>
    </header>

    {overview && <section className="admin-kpis">
      {Object.entries(overview).map(([key,value]) => <article key={key}><span>{key}</span><strong>{value}</strong></article>)}
    </section>}

    <section className="admin-workspace">
      <aside className="admin-sidebar">
        {resources.map(r => <button className={resource===r.key?'active':''} key={r.key}
          onClick={()=>{setResource(r.key);setEditing(null)}}>{r.label}</button>)}
      </aside>

      <div className="admin-list-panel">
        <div className="admin-panel-head">
          <div><span className="eyebrow">DATA</span><h2>{resources.find(r=>r.key===resource)?.label}</h2></div>
          <button className="button button-primary" onClick={startCreate}><Plus size={16}/> Add</button>
        </div>

        {message && <p className="admin-error">{message}</p>}
        {busy && <p className="muted">Loading…</p>}

        <div className="admin-record-list">
          {items.map(item => <button key={item.id} className={`admin-record ${editing?.id===item.id?'selected':''}`} onClick={()=>setEditing(structuredClone(item))}>
            <strong>{item.name || item.ign || item.title || item.opponentName || item.opponent}</strong>
            <span>{item.slug || item.role || item.event || item.tag}</span>
          </button>)}
        </div>
      </div>

      <div className="admin-editor">
        {!editing ? <div className="admin-empty">
          <span className="eyebrow">EDITOR</span>
          <h2>Select a record</h2>
          <p>Choose an item from the list or create a new one.</p>
        </div> : <>
          <div className="admin-panel-head">
            <div><span className="eyebrow">{editing.id ? `ID ${editing.id}` : 'NEW RECORD'}</span><h2>{editing.name || editing.ign || editing.title || editing.opponentName || editing.opponent || 'New item'}</h2></div>
            <div className="admin-actions">
              {editing.id && <button className="icon-button danger" onClick={()=>remove(editing.id)}><Trash2 size={18}/></button>}
              <button className="button button-primary" onClick={save}><Save size={16}/> Save</button>
            </div>
          </div>

          <div className="admin-form-grid">
            {editableKeys.map(key => {
              const value = editing[key];
              const isLong = [
                'summary',
                'bio',
                'text',
                'description',
                'notes',
                'stats',
                'specialties',
                'socials',
                'externalAccounts',
                'settings',
                'metadata',
                'raw'
              ].includes(key);
              if (['imageUrl','logoUrl','bannerUrl'].includes(key)) {
                return <MediaField key={key} label={key} value={value ?? ''} onChange={(next)=>setEditing({...editing,[key]:next})}/>;
              }
              if (typeof value === 'boolean') {
                return <label className="admin-check" key={key}><input type="checkbox" checked={value} onChange={e=>setEditing({...editing,[key]:e.target.checked})}/><span>{key}</span></label>;
              }
              return <label className={isLong?'span-2':''} key={key}>
                {key}
                {isLong
                  ? <textarea rows={key==='stats'||key==='specialties'?6:4}
                      value={toTextarea(value)}
                      onChange={e=>setEditing({...editing,[key]:parseField(key,e.target.value)})}/>
                  : <input value={value ?? ''} onChange={e=>setEditing({...editing,[key]:parseField(key,e.target.value)})}/>}
              </label>
            })}
          </div>
        </>}
      </div>
    </section>
  </main>;
}
