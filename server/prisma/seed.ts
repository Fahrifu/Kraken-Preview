import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.ts";
const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is not configured.");
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const teams = [
  { slug:'valorant', name:'VALORANT', short:'VAL', tier:'flagship', region:'EMEA', record:'18–6', ranking:'#12 EMEA', summary:'Structured round play, decisive entry pressure and disciplined utility usage.', stats:[{label:'WIN RATE',value:'75%'},{label:'MAPS',value:'41'},{label:'ROUNDS',value:'589'}] },
  { slug:'league-of-legends', name:'LEAGUE OF LEGENDS', short:'LOL', tier:'flagship', region:'NORDICS', record:'14–4', ranking:'#6 Nordics', summary:'A macro-focused roster built around coordinated objective control and flexible drafting.', stats:[{label:'WIN RATE',value:'78%'},{label:'GAMES',value:'18'},{label:'AVG KDA',value:'3.7'}] },
  { slug:'counter-strike', name:'COUNTER-STRIKE', short:'CS', tier:'flagship', region:'EUROPE', record:'21–9', ranking:'#28 Europe', summary:'High-tempo executes balanced by methodical mid-round adaptation and strong fundamentals.', stats:[{label:'WIN RATE',value:'70%'},{label:'MAPS',value:'52'},{label:'AVG RATING',value:'1.11'}] },
  { slug:'overwatch-2', name:'OVERWATCH 2', short:'OW2', tier:'secondary', region:'EUROPE', record:'10–7', ranking:'Development', summary:'A developing roster focused on tempo, composition flexibility and clean team-fight execution.', stats:[{label:'WIN RATE',value:'59%'},{label:'MATCHES',value:'17'},{label:'MAP DIFF',value:'+9'}] },
  { slug:'fortnite', name:'FORTNITE', short:'FN', tier:'secondary', region:'EUROPE', record:'—', ranking:'Development', summary:'Individual mechanics, duo chemistry and tournament consistency form the core of the division.', stats:[{label:'PLAYERS',value:'3'},{label:'FINALS',value:'6'},{label:'TOP 10',value:'14'}] }
];

const players = [
  ['nexus','valorant','NEXUS','Jonas Andersen','Duelist','NO','01','Explosive space creator who thrives when Kraken needs first contact.',[['K/D','1.31'],['ACS','284'],['ADR','172'],['HS%','27%']],['Jett','Raze','Neon']],
  ['void','valorant','VOID','Lucas Berg','Controller','SE','02','Calm mid-round voice specializing in smoke timing and site control.',[['KAST','74%'],['K/D','1.14'],['ADR','151'],['AST/R','0.42']],['Omen','Viper','Astra']],
  ['kai','valorant','KAI','Emil Madsen','Initiator','DK','03','Information-first initiator with a strong read on opponent tendencies.',[['ADR','167'],['K/D','1.18'],['KAST','76%'],['APR','0.39']],['Sova','Fade','Breach']],
  ['zero','valorant','ZERO','Elias Korhonen','Sentinel','FI','04','Reliable anchor with patient lurk timing and excellent clutch discipline.',[['HS%','27%'],['K/D','1.16'],['CLUTCH','22%'],['KAST','79%']],['Cypher','Killjoy','Veto']],
  ['nova','valorant','NOVA','Noah Strand','Flex','NO','05','Flexible fifth capable of filling gaps without sacrificing impact.',[['K/D','1.19'],['ACS','231'],['ADR','158'],['KAST','75%']],['Gekko','Sage','Viper']],
  ['fjord','league-of-legends','FJORD','Sander Nilsen','Top','NO','01','Stable weak-side top laner with strong team-fight positioning.',[['KDA','3.1'],['CS/M','8.4'],['KP%','62%'],['GOLD/M','418']],['Ornn','Kennen','Gnar']],
  ['pulse','league-of-legends','PULSE','Mikkel Sørensen','Jungle','DK','02','Proactive jungler who creates early tempo around lanes and objectives.',[['KDA','4.2'],['KP%','74%'],['GOLD/M','397'],['DMG%','19%']],['Vi','Sejuani','Viego']],
  ['echo','league-of-legends','ECHO','Anton Lind','Mid','SE','03','Control-mage specialist and central damage source in late fights.',[['KDA','4.5'],['CS/M','9.1'],['KP%','68%'],['DMG%','27%']],['Orianna','Azir','Syndra']],
  ['surge','league-of-legends','SURGE','Oliver Berg','Bot','NO','04','Scaling carry with a disciplined lane phase and confident positioning.',[['KDA','4.0'],['CS/M','9.7'],['KP%','71%'],['DMG%','31%']],['Kai\'Sa','Jinx','Ezreal']],
  ['ward','league-of-legends','WARD','Leo Niemi','Support','FI','05','Vision controller and primary engage coordinator for Kraken.',[['KDA','4.8'],['KP%','78%'],['VISION/M','2.1'],['ASSISTS','11.4']],['Rakan','Nautilus','Renata']],
  ['frost','counter-strike','FROST','Henrik Dahl','AWPer','NO','01','Primary sniper with a measured opening style and strong late-round value.',[['RATING','1.18'],['ADR','78.4'],['K/D','1.24'],['KAST','74%']],['AWP','Clutch','Opening']],
  ['rex','counter-strike','REX','Mathias Lund','IGL','DK','02','In-game leader responsible for tempo changes and mid-round structure.',[['RATING','1.02'],['ADR','71.2'],['KAST','72%'],['AST/R','0.18']],['IGL','Rifler','Utility']],
  ['ember','counter-strike','EMBER','Viktor Holm','Entry','SE','03','Aggressive first-contact rifler creating room for the trading pack.',[['RATING','1.13'],['ADR','84.7'],['K/D','1.10'],['OPEN K','0.15']],['Entry','AK-47','Space']],
  ['lock','counter-strike','LOCK','Aleksi Vala','Anchor','FI','04','Site anchor with disciplined utility and repeatable defensive protocols.',[['RATING','1.09'],['ADR','76.1'],['KAST','75%'],['HS%','51%']],['Anchor','M4','Utility']],
  ['rift','counter-strike','RIFT','Adrian Moen','Rifler','NO','05','Versatile rifler bridging aggressive and supportive responsibilities.',[['RATING','1.14'],['ADR','81.5'],['K/D','1.16'],['KAST','73%']],['Rifle','Trade','Lurk']],
  ['orbit','overwatch-2','ORBIT','Markus Solberg','Tank','NO','01','Frontline shotcaller built around controlled engages.',[['ELIM/10','18.2'],['DMG/10','8.9K'],['DEATH/10','5.1'],['WR','61%']],['Winston','Sigma','Ramattra']],
  ['prism','overwatch-2','PRISM','Ida Eriksen','DPS','NO','02','Hitscan specialist with strong target priority.',[['ELIM/10','21.4'],['DMG/10','10.7K'],['CRIT','18%'],['WR','58%']],['Sojourn','Cassidy','Tracer']],
  ['lumen','overwatch-2','LUMEN','Maja Lind','Support','SE','03','Flexible support balancing survivability with playmaking utility.',[['HEAL/10','9.4K'],['AST/10','13.1'],['DEATH/10','4.3'],['WR','60%']],['Ana','Kiriko','Juno']],
  ['tidal','fortnite','TIDAL','Kristian Moe','IGL / Duo','NO','01','Strategic caller focused on rotations and endgame layer control.',[['FINALS','4'],['AVG PTS','312'],['TOP 10','8'],['ELIMS','3.8']],['IGL','Rotations','Endgame']],
  ['snap','fortnite','SNAP','Aksel Berg','Fragger / Duo','NO','02','Mechanical fragger specializing in converting refresh opportunities.',[['FINALS','4'],['AVG PTS','327'],['TOP 10','9'],['ELIMS','5.1']],['Fighting','Edits','Refresh']],
  ['vex','fortnite','VEX','Nora Falk','Solo','SE','03','Consistent solo competitor with a risk-managed tournament style.',[['FINALS','2'],['AVG PTS','289'],['TOP 10','6'],['ELIMS','4.2']],['Solo','Surge','Placement']]
];

const matches = [
  ['valorant','Fnatic','VCT EMEA','22 AUG 2026','18:00 CEST','upcoming',null],
  ['league-of-legends','Nordic Forge','Nordic Championship','24 AUG 2026','19:00 CEST','upcoming',null],
  ['counter-strike','Apex Core','European Open','26 AUG 2026','20:00 CEST','upcoming',null],
  ['valorant','NAVI','VCT EMEA','15 AUG 2026','','win','2–1'],
  ['counter-strike','Northline','European Open','12 AUG 2026','','win','2–0'],
  ['league-of-legends','Polar Five','Nordic Championship','10 AUG 2026','','loss','0–1']
];

const staff = [
  { slug:'kraken-head-coach', name:'Head Coach Placeholder', role:'Head Coach', country:'NO', bio:'Replace with official Kraken staff information.', active:true, teamSlug:'valorant' },
  { slug:'kraken-analyst', name:'Analyst Placeholder', role:'Analyst', country:'NO', bio:'Competitive analyst supporting preparation and review.', active:true, teamSlug:'counter-strike' },
  { slug:'kraken-manager', name:'Team Manager Placeholder', role:'Team Manager', country:'NO', bio:'Supports scheduling, logistics and roster administration.', active:true, teamSlug:null }
];

const achievements = [
  { title:'Development Milestone', tournament:'Kraken Internal Showcase', placement:'1st', date:'2026', prize:null, description:'Placeholder achievement for testing the public trophy system.', featured:true, teamSlug:'valorant' }
];

const tournaments = [
  { slug:'vct-emea-demo', name:'VCT EMEA', organizer:'Riot Games', region:'EMEA', tier:'Tier 1', startDate:'2026-08-01', endDate:'2026-09-30', status:'active', teamSlug:'valorant' },
  { slug:'nordic-championship-demo', name:'Nordic Championship', organizer:'Demo Organizer', region:'Nordics', tier:'Regional', startDate:'2026-08-01', endDate:'2026-09-15', status:'active', teamSlug:'league-of-legends' }
];

const opponents = [
  { name:'Fnatic', slug:'fnatic', region:'EMEA' },
  { name:'NAVI', slug:'navi', region:'EMEA' },
  { name:'Northline', slug:'northline', region:'Europe' },
  { name:'Polar Five', slug:'polar-five', region:'Nordics' }
];

const sponsors = [
  { name:'University of Agder', websiteUrl:'https://www.uia.no/', logoUrl:null, tier:'institution', description:'UiA Kraken organization partner.', displayOrder:1, active:true },
  { name:'Partner Placeholder', websiteUrl:null, logoUrl:null, tier:'partner', description:'Replace with an official Kraken partner through the admin dashboard.', displayOrder:2, active:false }
];

const news = [
  ['VALORANT','18 AUG 2026','Kraken locks its starting five for the autumn split.','The flagship Valorant division enters the next competition block with a finalized five-player roster.'],
  ['ORG','12 AUG 2026','A competitive identity built around UiA Kraken.','Red, white and a recognizable Kraken mark anchor the visual language across every division.'],
  ['LEAGUE','05 AUG 2026','League division enters Nordic Championship qualifiers.','Kraken prepares its first full qualifier block with an emphasis on objective control and clean execution.']
];

async function main() {
  // Delete child/dependent records first.
  await prisma.externalMatch.deleteMany();
  await prisma.syncRun.deleteMany();
  await prisma.integrationConfig.deleteMany();
  await prisma.matchPlayerStat.deleteMany();
  await prisma.matchLineup.deleteMany();
  await prisma.matchMap.deleteMany();
  await prisma.rosterHistory.deleteMany();
  await prisma.player.deleteMany();
  await prisma.match.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.opponent.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.sponsor.deleteMany();
  await prisma.team.deleteMany();

  for (const team of teams) {
    await prisma.team.create({ data: team });
  }

  const teamMap = Object.fromEntries((await prisma.team.findMany()).map(t => [t.slug, t.id]));

  for (const p of players) {
    await prisma.player.create({
      data: {
        slug:p[0], teamId:teamMap[p[1]], ign:p[2], name:p[3], role:p[4],
        country:p[5], number:p[6], bio:p[7], stats:p[8], specialties:p[9]
      }
    });
  }

  for (const m of matches) {
    await prisma.match.create({
      data: {
        teamId: teamMap[m[0]],
        opponentName: m[1],
        event: m[2],
        date: m[3],
        time: m[4],
        status: m[5],
        score: m[6]
        }
    });
  } 

  for (const n of news) {
    await prisma.newsArticle.create({ data: { tag:n[0], date:n[1], title:n[2], text:n[3] } });
  }

  for (const sponsor of sponsors) {
    await prisma.sponsor.create({ data: sponsor });
  }

  for (const op of opponents) {
    await prisma.opponent.create({ data: op });
  }

  for (const item of tournaments) {
    const { teamSlug, ...data } = item;
    await prisma.tournament.create({ data: { ...data, teamId: teamSlug ? teamMap[teamSlug] : null } });
  }

  for (const item of staff) {
    const { teamSlug, ...data } = item;
    await prisma.staff.create({ data: { ...data, teamId: teamSlug ? teamMap[teamSlug] : null } });
  }

  for (const item of achievements) {
    const { teamSlug, ...data } = item;
    await prisma.achievement.create({ data: { ...data, teamId: teamSlug ? teamMap[teamSlug] : null } });
  }

  await prisma.integrationConfig.create({
    data: {
      provider: 'riot',
      game: 'league-of-legends',
      enabled: false,
      region: process.env.RIOT_PLATFORM_REGION || 'euw1',
      routing: process.env.RIOT_REGIONAL_ROUTING || 'europe',
      teamId: teamMap['league-of-legends'],
      settings: { note: 'Configure RIOT_API_KEY and player externalAccounts.riot.puuid before sync.' }
    }
  });

  const email = process.env.ADMIN_EMAIL || 'admin@kraken.local';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash }
  });

  console.log(`Seed complete. Admin: ${email}`);
}

main().finally(() => prisma.$disconnect());
