import { useState } from "react";
import "./_group.css";

type Bilingual = { en: string; mn: string };
type Member = { dept: string; role: Bilingual; name: string; bio: Bilingual };

const tx = (value: Bilingual) => value.en;
const b = (en: string, mn: string): Bilingual => ({ en, mn });

const teamMembers: Member[] = [
  { dept: "leadership", role: b("Organizer", "Зохион байгуулагч"), name: "Munkhtushig", bio: b("Directing strategic operations, licensing compliance, and overarching vision for the event.", "Арга хэмжээний стратеги, франчайз зөвшөөрөл болон ерөнхий чиглэлийг удирдан чиглүүлэгч.") },
  { dept: "leadership", role: b("Co-Organizer", "Хамтран зохион байгуулагч"), name: "Munkherdene", bio: b("Coordinating department workflows, operational planning, and venue execution.", "Албадын үйл ажиллагаа, операци төлөвлөлт болон талбайн зохион байгуулалтыг зохицуулагч.") },
  { dept: "curation", role: b("Curation Lead", "Куратор багийн ахлагч"), name: "Anar", bio: b("Leading speaker discovery, talk shaping, and editorial coaching for the stage.", "Илтгэгчдийг сонгон шалгаруулах, илтгэл бэлтгэх болон зөвлөн чиглүүлэх баг.") },
  { dept: "curation", role: b("Curation Team", "Куратор баг"), name: "?", bio: b("Team member to be revealed soon.", "Багийн гишүүн удахгүй зарлагдана.") },
  { dept: "media-design", role: b("Designer", "Дизайнер"), name: "Munkhjin", bio: b("Directing visual branding, digital media assets, stage production aesthetics, and creative direction.", "Арга хэмжээний визуал брэнд, дижитал контент, тайзны дизайн болон бүтээлч чиглэлийг хариуцагч.") },
  { dept: "media-design", role: b("Media & Design", "Медиа ба Дизайн"), name: "?", bio: b("Team member to be revealed soon.", "Багийн гишүүн удахгүй зарлагдана.") },
  { dept: "logistics", role: b("Logistics", "Логистик"), name: "?", bio: b("Team member to be revealed soon.", "Багийн гишүүн удахгүй зарлагдана.") },
  { dept: "logistics", role: b("Operations", "Үйл ажиллагаа"), name: "?", bio: b("Team member to be revealed soon.", "Багийн гишүүн удахгүй зарлагдана.") },
];

const departments: [string, Bilingual][] = [
  ["leadership", b("Leadership", "Удирдлага")],
  ["curation", b("Curation", "Куратор")],
  ["media-design", b("Media & Design", "Медиа ба Дизайн")],
  ["logistics", b("Logistics", "Логистик")],
];

export function Current() {
  const [filter, setFilter] = useState("all");
  const visible = filter === "all" ? teamMembers : teamMembers.filter((member) => member.dept === filter);

  return (
    <div className="teams-current">
      <header className="teams-nav">
        <div className="teams-logo"><span>TEDx Ulaanbaatar</span>EMPATHY SCHOOL YOUTH</div>
        <nav className="teams-nav-links"><span>About</span><span>Seats</span><span>Speakers</span><b>Team</b><span>Contact</span></nav>
      </header>
      <main>
        <section className="teams-hero">
          <div className="teams-wrap">
            <div className="teams-eyebrow">Behind the Stage</div>
            <h1>Meet the visionaries.</h1>
            <p>The dedicated team working behind the scenes to make this event happen.</p>
            <div className="teams-stats">
              <div className="teams-stat"><strong>?</strong><span>Total members</span></div>
              <div className="teams-stat"><strong>04</strong><span>Departments</span></div>
              <div className="teams-stat"><strong>100%</strong><span>Volunteer driven</span></div>
              <div className="teams-stat"><strong>2026</strong><span>Edition team</span></div>
            </div>
          </div>
        </section>
        <div className="teams-filter"><div className="teams-filters">{[["all", b("All Departments", "Бүх алба")], ...departments].map(([id, label]) => <button key={id as string} className={filter === id ? "active" : ""} onClick={() => setFilter(id as string)}>{tx(label as Bilingual)}</button>)}</div></div>
        <div className="teams-wrap teams-content">
          {departments.filter(([id]) => filter === "all" || id === filter).map(([id, label]) => {
            const members = visible.filter((member) => member.dept === id);
            return <section className="teams-dept" key={id}><div className="teams-dept-heading"><h2>{tx(label)}</h2><i /><span>{members.length} Members</span></div><div className="teams-grid">{members.map((member, index) => <article className="teams-member" key={`${id}-${index}`}><div className="teams-member-visual"><span>{member.name === "?" ? "?" : member.name.slice(0, 1)}</span></div><div className="teams-member-info"><div className="teams-member-role">{tx(member.role)}</div><h3>{member.name}</h3><p>{tx(member.bio)}</p></div></article>)}</div></section>;
          })}
        </div>
      </main>
    </div>
  );
}