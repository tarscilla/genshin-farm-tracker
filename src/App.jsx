import { useState, useEffect } from 'react';
import './index.css';

const DOMAINS_BY_DAY = {
  1: { dayName: 'Segunda-feira', talents: ['Liberdade (Mondstadt)', 'Prosperidade (Liyue)', 'Transitoriedade (Inazuma)', 'Admoestação (Sumeru)', 'Equidade (Fontaine)', 'Disputa (Natlan)'], weapons: ['Decarabian', 'Guyun', 'Mar Distante', 'Talismã da Floresta', 'Cordas Ancestrais', 'Fogo Sagrado'] },
  2: { dayName: 'Terça-feira', talents: ['Resistência (Mondstadt)', 'Esforço (Liyue)', 'Cultura (Inazuma)', 'Engenhosidade (Sumeru)', 'Justiça (Fontaine)', 'Ignição (Natlan)'], weapons: ['Dente de Lobo', 'Elixir de Chumbo', 'Narukami', 'Oásis', 'Gota de Orvalho', 'Sabedoria Delirante'] },
  3: { dayName: 'Quarta-feira', talents: ['Poemas (Mondstadt)', 'Ouro (Liyue)', 'Luz (Inazuma)', 'Práxis (Sumeru)', 'Ordem (Fontaine)', 'Conflito (Natlan)'], weapons: ['Gladiador de Dandelion', 'Aerosiderite', 'Máscara', 'Poder Escaldante', 'Cálice Prateado', 'Vento Noturno'] },
  4: { dayName: 'Quinta-feira', talents: ['Liberdade (Mondstadt)', 'Prosperidade (Liyue)', 'Transitoriedade (Inazuma)', 'Admoestação (Sumeru)', 'Equidade (Fontaine)', 'Disputa (Natlan)'], weapons: ['Decarabian', 'Guyun', 'Mar Distante', 'Talismã da Floresta', 'Cordas Ancestrais', 'Fogo Sagrado'] },
  5: { dayName: 'Sexta-feira', talents: ['Resistência (Mondstadt)', 'Esforço (Liyue)', 'Cultura (Inazuma)', 'Engenhosidade (Sumeru)', 'Justiça (Fontaine)', 'Ignição (Natlan)'], weapons: ['Dente de Lobo', 'Elixir de Chumbo', 'Narukami', 'Oásis', 'Gota de Orvalho', 'Sabedoria Delirante'] },
  6: { dayName: 'Sábado', talents: ['Poemas (Mondstadt)', 'Ouro (Liyue)', 'Luz (Inazuma)', 'Práxis (Sumeru)', 'Ordem (Fontaine)', 'Conflito (Natlan)'], weapons: ['Gladiador de Dandelion', 'Aerosiderite', 'Máscara', 'Poder Escaldante', 'Cálice Prateado', 'Vento Noturno'] },
  0: { dayName: 'Domingo', talents: ['Todos os livros de talentos estão abertos hoje!'], weapons: ['Todos os materiais de armas estão abertos hoje!'] },
};

const ELEMENT_MAP = {
  Water: { label: 'Hydro', color: '#38bdf8' },
  Fire: { label: 'Pyro', color: '#f87171' },
  Dendro: { label: 'Dendro', color: '#4ade80' },
  Electro: { label: 'Electro', color: '#c084fc' },
  Anemo: { label: 'Anemo', color: '#2dd4bf' },
  Cryo: { label: 'Cryo', color: '#93c5fd' },
  Geo: { label: 'Geo', color: '#fbbf24' },
};

const FALLBACK_CHARACTERS = [
  { id: 'furina', name: 'Furina', rank: 5, element: 'Water', icon: 'UI_AvatarIcon_Furina' },
  { id: 'neuvillette', name: 'Neuvillette', rank: 5, element: 'Water', icon: 'UI_AvatarIcon_Neuvillette' },
  { id: 'nahida', name: 'Nahida', rank: 5, element: 'Dendro', icon: 'UI_AvatarIcon_Nahida' },
  { id: 'kazuha', name: 'Kaedehara Kazuha', rank: 5, element: 'Anemo', icon: 'UI_AvatarIcon_Kazuha' },
  { id: 'raiden', name: 'Raiden Shogun', rank: 5, element: 'Electro', icon: 'UI_AvatarIcon_Shougun' },
  { id: 'mavuika', name: 'Mavuika', rank: 5, element: 'Pyro', icon: 'UI_AvatarIcon_Mavuika' },
  { id: 'arlecchino', name: 'Arlecchino', rank: 5, element: 'Pyro', icon: 'UI_AvatarIcon_Arlecchino' },
  { id: 'lisa', name: 'Lisa', rank: 4, element: 'Electro', icon: 'UI_AvatarIcon_Lisa' },
  { id: 'fischl', name: 'Fischl', rank: 4, element: 'Electro', icon: 'UI_AvatarIcon_Fischl' },
  { id: 'bennett', name: 'Bennett', rank: 4, element: 'Pyro', icon: 'UI_AvatarIcon_Bennett' },
  { id: 'xingqiu', name: 'Xingqiu', rank: 4, element: 'Water', icon: 'UI_AvatarIcon_Xingqiu' },
  { id: 'xiangling', name: 'Xiangling', rank: 4, element: 'Pyro', icon: 'UI_AvatarIcon_Xiangling' },
  { id: 'zhongli', name: 'Zhongli', rank: 5, element: 'Geo', icon: 'UI_AvatarIcon_Zhongli' },
  { id: 'ayaka', name: 'Kamisato Ayaka', rank: 5, element: 'Cryo', icon: 'UI_AvatarIcon_Ayaka' },
];

const COMMUNITY_BUILDS = {
  Furina: { role: 'Sub-DPS / Buffer Universal', artifacts: '4x Trupe Dourada', stats: 'Areia: Vida% | Cálice: Bônus Hydro ou Vida% | Tiara: Taxa/Dano Crítico', weapons: 'Esplendor das Águas Silenciosas, Espada de Favonius, Cruzamento de Fleuve Cendre' },
  Neuvillette: { role: 'DPS Principal (Ataque Carregado)', artifacts: '4x Caçador das Sombras', stats: 'Areia: Vida% | Cálice: Bônus Hydro ou Vida% | Tiara: Taxa/Dano Crítico', weapons: 'Ritos do Fluxo Eterno, Protótipo Âmbar (F2P), Jade Sacrificial' },
  Nahida: { role: 'Sub-DPS / Aplicadora Dendro', artifacts: '4x Memórias das Florestas', stats: 'Areia: Proficiência | Cálice: Proficiência ou Dendro | Tiara: Proficiência ou Crítico', weapons: 'Sonhos Flutuantes das Mil Noites, Memórias de Sacrifício, Guia de Magia' },
  'Kaedehara Kazuha': { role: 'Suporte / Controle de Grupo', artifacts: '4x Sombra Verde', stats: 'Areia: Proficiência | Cálice: Proficiência | Tiara: Proficiência', weapons: 'Juramento pela Liberdade, Espinho de Ferro (F2P), Espada de Favonius' },
  'Raiden Shogun': { role: 'DPS / Bateria de Energia', artifacts: '4x Selo da Insulação', stats: 'Areia: Recarga de Energia | Cálice: ATQ% ou Electro | Tiara: Taxa/Dano Crítico', weapons: 'Luz do Cortador de Grama, A Fisgada (F2P), Lança de Favonius' },
  Lisa: { role: 'Sub-DPS / Redutora de DEF (Aceleração)', artifacts: '4x Trovão Furioso ou 4x Selo da Insulação', stats: 'Areia: ATQ% ou Proficiência | Cálice: Bônus Electro | Tiara: Taxa/Dano Crítico', weapons: 'Prova de Kagura, Sinfonia dos Indolentes, Histórias Extraordinárias de Caçadores de Dragões' },
  Fischl: { role: 'Sub-DPS Off-Field (Oz)', artifacts: '4x Trupe Dourada', stats: 'Areia: ATQ% ou Proficiência | Cálice: Bônus Electro | Tiara: Taxa/Dano Crítico', weapons: 'Estrela Invernal, Último Acorde, Arco de Favonius' },
  Mavuika: { role: 'DPS Principal / Sub-DPS Pyro', artifacts: '4x Códice de Obsidiana', stats: 'Areia: ATQ% ou Proficiência | Cálice: Bônus Pyro | Tiara: Taxa/Dano Crítico', weapons: 'Mil Sóis Ardentes, Túmulo do Lobo, Espinha Dorsal da Serpente' },
  Arlecchino: { role: 'DPS Principal (Contrato de Vida)', artifacts: '4x Fragmento da Harmonia Fantástica', stats: 'Areia: ATQ% | Cálice: Bônus Pyro | Tiara: Taxa/Dano Crítico', weapons: 'Semblante da Lua Carmesim, Lança de Jade Primitiva, Borla Branca (F2P)' },
  Bennett: { role: 'Suporte / Healer / Buffer de ATQ', artifacts: '4x Antigo Ritual Real', stats: 'Areia: Recarga de Energia | Cálice: Vida% | Tiara: Bônus de Cura ou Vida%', weapons: 'Falcão, Espada Celestial, Protótipo Rancor (F2P)' },
  Xingqiu: { role: 'Sub-DPS Hydro (Ataques Normais)', artifacts: '4x Selo da Insulação', stats: 'Areia: Recarga de Energia | Cálice: Bônus Hydro | Tiara: Taxa/Dano Crítico', weapons: 'Espada de Sacrifício, Espada de Favonius, Espada do Desterro' },
  Xiangling: { role: 'Sub-DPS Pyro (Pyronado)', artifacts: '4x Selo da Insulação', stats: 'Areia: Recarga ou Proficiência | Cálice: Bônus Pyro | Tiara: Taxa/Dano Crítico', weapons: 'A Fisgada (F2P), Perfurador de Nuvens, Lança de Favonius' },
  Zhongli: { role: 'Suporte / Escudo Absoluto', artifacts: '4x Antigo Ritual Real ou 2x Tenolitica / 2x Antiga Nobreza', stats: 'Areia: Vida% | Cálice: Vida% ou Geo | Tiara: Vida% ou Crítico', weapons: 'Tamoio, Lança de Favonius, Invencível de Ferro (F2P)' },
  'Kamisato Ayaka': { role: 'DPS Principal (Congelamento)', artifacts: '4x Herói Invernal', stats: 'Areia: ATQ% | Cálice: Bônus Cryo | Tiara: Dano Crítico', weapons: 'Maremoto da Lua de Komaishi, Espada Amenoma Kageuchi (F2P), Cortador de Jade' },
};

export default function App() {
  const [characters, setCharacters] = useState(FALLBACK_CHARACTERS);
  const [search, setSearch] = useState('');
  const [selectedElement, setSelectedElement] = useState('ALL');
  const [selectedChar, setSelectedChar] = useState(null);

  const [primogems, setPrimogems] = useState(0);
  const [fates, setFates] = useState(0);
  const [currentPity, setCurrentPity] = useState(0);

  useEffect(() => {
    async function fetchAllCharacters() {
      try {
        const response = await fetch('https://genshin-db-api.vercel.app/api/v5/characters?query=names&matchCategories=true&verboseCategories=true&resultLanguage=Portuguese');
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data
            .filter((char) => !char.name.includes('Viajante') && char.images?.filename_icon)
            .map((char) => ({
              id: char.id || char.name,
              name: char.name,
              rank: Number(char.rarity) || 4,
              element: char.elementText,
              icon: char.images.filename_icon,
            }));
          if (formatted.length > 0) {
            setCharacters(formatted);
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
    fetchAllCharacters();
  }, []);

  const handleSelectChar = (char) => {
    if (selectedChar?.id === char.id) {
      setSelectedChar(null); // Desmarca se clicar de novo no mesmo
    } else {
      setSelectedChar(char); // Seleciona o novo
    }
  };

  const filteredCharacters = characters.filter((char) => {
    const matchesName = char.name.toLowerCase().includes(search.toLowerCase());
    const matchesElement = selectedElement === 'ALL' || char.element === selectedElement;
    return matchesName && matchesElement;
  });

  const pullsFromPrimogems = Math.floor(Number(primogems) / 160);
  const totalNewPulls = pullsFromPrimogems + Number(fates);
  const totalPity = Number(currentPity) + totalNewPulls;
  const pullsToHardPity = Math.max(0, 90 - totalPity);
  const pityPercentage = Math.min(100, Math.round((totalPity / 90) * 100));

  const todayDomains = DOMAINS_BY_DAY[new Date().getDay()];
  const activeBuild = selectedChar ? COMMUNITY_BUILDS[selectedChar.name] : null;
  const selectedElementInfo = selectedChar ? ELEMENT_MAP[selectedChar.element] : null;

  return (
    <>
      <div className="sky-layer">
        <div className="cloud-shape cloud-a"></div>
        <div className="cloud-shape cloud-b"></div>
        <div className="cloud-shape cloud-c"></div>
        <div className="star-sparkle star-1"></div>
        <div className="star-sparkle star-2"></div>
        <div className="star-sparkle star-3"></div>
        <div className="star-sparkle star-4"></div>
        <div className="star-sparkle star-5"></div>
      </div>

      <div className="app-container">
        <header className="header">
          <h1 className="header-title">✦ Teyvat Build & Farm Companion ✦</h1>
          <p className="header-subtitle">Guia de Artefatos Recomendados pela Comunidade & Rotação Diária</p>
          <span className="day-badge">
            <svg className="badge-icon" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="9" />
              <polyline points="12 7 12 12 15 15" />
            </svg>
            Rotação de {todayDomains.dayName}
          </span>
        </header>

        <section className="genshin-card">
          <h2 className="section-title">
            <svg className="gold-icon" viewBox="0 0 24 24">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Enciclopédia de Builds Recomendadas
          </h2>

          <input
            type="text"
            className="search-input"
            placeholder="Digite o nome para filtrar (ex: Lisa, Furina, Raiden, Hu Tao)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="element-filters">
            <button
              className={`filter-btn ${selectedElement === 'ALL' ? 'active' : ''}`}
              onClick={() => setSelectedElement('ALL')}
            >
              Todos
            </button>
            {Object.entries(ELEMENT_MAP).map(([key, info]) => (
              <button
                key={key}
                className={`filter-btn ${selectedElement === key ? 'active' : ''}`}
                onClick={() => setSelectedElement(key)}
              >
                {info.label}
              </button>
            ))}
          </div>

          {selectedChar && (
            <div className="build-showcase">
              <div className="build-header" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <img
                    src={`https://enka.network/ui/${selectedChar.icon}.png`}
                    alt=""
                    className={`avatar-large ${selectedChar.rank === 5 ? 'rank-5' : 'rank-4'}`}
                  />
                  <div>
                    <h3 className="build-char-name">{selectedChar.name}</h3>
                    <div className="build-meta">
                      <span className="stars">{'★'.repeat(selectedChar.rank)}</span>
                      {selectedElementInfo && (
                        <span style={{ color: selectedElementInfo.color, fontWeight: '700' }}>
                          • {selectedElementInfo.label}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedChar(null)}
                  style={{ background: 'transparent', border: '1px solid rgba(211, 188, 142, 0.4)', color: '#d3bc8e', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontWeight: 'bold' }}
                  title="Fechar painel"
                >
                  ✕
                </button>
              </div>

              {activeBuild ? (
                <div className="build-grid">
                  <div className="build-stat-box">
                    <div className="build-stat-label">Função Ideal</div>
                    <div className="build-stat-value">{activeBuild.role}</div>
                  </div>
                  <div className="build-stat-box">
                    <div className="build-stat-label">Conjunto de Artefatos</div>
                    <div className="build-stat-value">{activeBuild.artifacts}</div>
                  </div>
                  <div className="build-stat-box">
                    <div className="build-stat-label">Atributos Principais</div>
                    <div className="build-stat-value">{activeBuild.stats}</div>
                  </div>
                  <div className="build-stat-box">
                    <div className="build-stat-label">Melhores Armas</div>
                    <div className="build-stat-value">{activeBuild.weapons}</div>
                  </div>
                </div>
              ) : (
                <div className="build-grid">
                  <div className="build-stat-box">
                    <div className="build-stat-label">Artefatos Recomendados</div>
                    <div className="build-stat-value">
                      4x Selo da Insulação (foco em Supremo) ou 2x +18% ATQ / 2x Bônus {selectedElementInfo?.label || selectedChar.element}
                    </div>
                  </div>
                  <div className="build-stat-box">
                    <div className="build-stat-label">Atributos Principais</div>
                    <div className="build-stat-value">
                      Areia: ATQ% ou Recarga | Cálice: Bônus {selectedElementInfo?.label || selectedChar.element} | Tiara: Taxa/Dano Crítico
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {filteredCharacters.length === 0 ? (
            <p style={{ color: '#9ba5b8', textAlign: 'center', padding: '16px 0' }}>
              Nenhum personagem encontrado com "{search}".
            </p>
          ) : (
            <div className="char-grid">
              {filteredCharacters.map((char) => (
                <button
                  key={char.id}
                  onClick={() => handleSelectChar(char)}
                  className={`char-card ${selectedChar?.id === char.id ? 'selected' : ''}`}
                >
                  <img
                    src={`https://enka.network/ui/${char.icon}.png`}
                    alt=""
                    className={`char-avatar ${char.rank === 5 ? 'rank-5' : 'rank-4'}`}
                  />
                  <div className="char-name">{char.name}</div>
                </button>
              ))}
            </div>
          )}
        </section>

        <section className="genshin-card">
          <h2 className="section-title">
            <svg className="gold-icon" viewBox="0 0 24 24">
              <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            </svg>
            Calculadora de Desejos & Pity
          </h2>
          <div className="pity-inputs">
            <div className="input-group">
              <label>Gemas Essenciais</label>
              <input type="number" min="0" value={primogems} onChange={(e) => setPrimogems(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Destinos Entrelaçados</label>
              <input type="number" min="0" value={fates} onChange={(e) => setFates(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Pity Atual no Banner</label>
              <input type="number" min="0" max="89" value={currentPity} onChange={(e) => setCurrentPity(e.target.value)} />
            </div>
          </div>

          <div className="pity-summary">
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem' }}>
              <span>Tiros totais acumulados: <strong>{totalNewPulls}</strong></span>
              <span>Progresso: <strong style={{ color: '#f3e5ab' }}>{totalPity} / 90</strong></span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${pityPercentage}%` }} />
            </div>
            <p style={{ margin: 0, fontSize: '0.88rem', color: pullsToHardPity === 0 ? '#4ade80' : '#9ba5b8' }}>
              {pullsToHardPity === 0
                ? 'Você já possui desejos suficientes para garantir um personagem 5 estrelas!'
                : `Faltam ${pullsToHardPity} desejos para atingir o Hard Pity (90).`}
            </p>
          </div>
        </section>

        <section className="genshin-card">
          <h2 className="section-title">
            <svg className="gold-icon" viewBox="0 0 24 24">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
            </svg>
            Domínios Abertos Hoje ({todayDomains.dayName})
          </h2>
          <div className="domains-grid">
            <div className="domain-box">
              <h3>Livros de Talento</h3>
              <ul className="domain-list">
                {todayDomains.talents.map((item) => (<li key={item}>{item}</li>))}
              </ul>
            </div>
            <div className="domain-box">
              <h3>Materiais de Ascensão de Armas</h3>
              <ul className="domain-list">
                {todayDomains.weapons.map((item) => (<li key={item}>{item}</li>))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}