
import { Question } from './types';

export const COLORS = {
  mainPink: '#F693A8',
  lightPink: '#F0C1C9',
  dustyRose: '#C0808D',
  offWhite: '#FFF4F8',
  mintGreen: '#6FBE98',
  sageGreen: '#A1C4B1',
  darkGreen: '#2D4B3E',
  cream: '#F4F2ED',
  black: '#22201E',
};

export const QUESTIONS: Question[] = [
  {
    id: 1,
    title: "1. Paleta de Cores: Qual base cromática mais te agrada?",
    multiselect: true,
    options: [
      { id: '1a', label: 'Neutros & Naturais', imageUrl: '/images/1.1.jpg', styleProfile: 'Calma, acolhedora, minimalista, off-white, areia', visualPrompt: 'neutral and natural beige color tones' },
      { id: '1c', label: 'Terrosos & Acolhedores', imageUrl: '/images/1.3.jpg', styleProfile: 'Quente, conectada com a terra, artesanal, terracota', visualPrompt: 'warm terracotta and earthy reddish tones' },
      { id: '1d', label: 'Pastéis Vintage', imageUrl: '/images/1.4.jpeg', styleProfile: 'Nostalgia, delicadeza, retrô, tons pastéis', visualPrompt: 'soft pastel vintage colors, mint and pink' },
      { id: '1e', label: 'Urbano & Industrial', imageUrl: '/images/1.5.jpg', styleProfile: 'Jovial, despojada, cosmopolita, cimento queimado', visualPrompt: 'cool grey urban industrial tones' },
      { id: '1f', label: 'Solar & Tropical', imageUrl: '/images/1.6.jpg', styleProfile: 'Energética, fresca, iluminada, verde folha, amarelo', visualPrompt: 'vibrant solar yellow and tropical green tones' }
    ]
  },
  {
    id: 2,
    title: "2. Metais: Qual acabamento deve dar o toque final nos detalhes?",
    multiselect: true,
    options: [
      { id: '2a', label: 'Dourado & Latão', imageUrl: '/images/2.1.jpg', styleProfile: 'Sofisticação, calor, toque clássico, luxo', visualPrompt: 'a close-up photo of a luxurious brushed gold faucet' },
      { id: '2b', label: 'Preto Fosco', imageUrl: '/images/2.2.jpg', styleProfile: 'Modernidade, contraste, estilo industrial, urbano', visualPrompt: 'a close-up photo of a modern matte black faucet' },
      { id: '2c', label: 'Inox & Cromado', imageUrl: '/images/2.3.jpg', styleProfile: 'Minimalismo, limpeza visual, atemporalidade, frescor', visualPrompt: 'a close-up photo of a sleek stainless steel silver faucet' },
      { id: '2d', label: 'Cobre & Rosé', imageUrl: '/images/2.4.jpg', styleProfile: 'Acolhimento, delicadeza, romantismo, toque vintage', visualPrompt: 'a close-up photo of a vintage rose gold copper faucet' }
    ]
  },
  {
    id: 3,
    title: "3. Uso da Madeira: Como você prefere a presença desse material?",
    multiselect: true,
    options: [
      { id: '3a', label: 'Madeira Clara', imageUrl: '/images/3.1.jpg', styleProfile: 'Leveza, escandinavo, minimalismo, natural', visualPrompt: 'a physical square sample block of light oak wood texture' },
      { id: '3b', label: 'Madeira Média', imageUrl: '/images/3.2.jpg', styleProfile: 'Aconchego, brasilidade, equilíbrio, freijó', visualPrompt: 'a physical square sample block of medium tone freijo wood texture' },
      { id: '3c', label: 'Madeira Escura', imageUrl: '/images/3.3.jpg', styleProfile: 'Sofisticação, sobriedade, luxo, ébano', visualPrompt: 'a physical square sample block of dark elegant wood texture' },
      { id: '3d', label: 'Madeira Avermelhada', imageUrl: '/images/3.4.jpg', styleProfile: 'Memória, vintage, clássico, cerejeira', visualPrompt: 'a physical square sample block of reddish cherry wood texture' }
    ]
  },
  {
    id: 4,
    title: "4. Iluminação: Qual atmosfera você deseja criar à noite?",
    multiselect: true,
    options: [
      { id: '4a', label: 'Indireta e Oculta', imageUrl: '/images/4.1.jpg', styleProfile: 'Acolhimento, intimista, sanca, relaxamento', visualPrompt: 'a photo of a cozy room with hidden indirect led lighting' },
      { id: '4b', label: 'Focal & Trilhos', imageUrl: '/images/4.2.jpg', styleProfile: 'Moderno, galeria, contraste, cênico', visualPrompt: 'a photo of modern track lighting spots on a ceiling' },
      { id: '4c', label: 'Pendentes de Design', imageUrl: '/images/4.3.jpg', styleProfile: 'Sofisticação, artístico, personalidade, ponto focal', imagePosition: 'bottom', visualPrompt: 'a photo of a sculptural design pendant lamp' },
      { id: '4d', label: 'Difusa & Geral', imageUrl: '/images/4.4.jpg', styleProfile: 'Naturalidade, suavidade, amplo, diurno', visualPrompt: 'a photo of a room with bright soft diffuse general lighting' }
    ]
  },
  {
    id: 5,
    title: "5. Revestimentos e Paredes: O que deve vestir as superfícies?",
    multiselect: true,
    options: [
      { id: '5a', label: 'Réguas Amadeiradas', imageUrl: '/images/5.1.jpg', styleProfile: 'Aconchego, natural, térmico, linearidade', visualPrompt: 'a physical material sample of wooden floor planks' },
      { id: '5b', label: 'Cimentício', imageUrl: '/images/5.2.jpg', styleProfile: 'Moderno, urbano, textura, industrial', visualPrompt: 'a physical material sample of grey concrete texture' },
      { id: '5c', label: 'Cerâmicas Coloridas', imageUrl: '/images/5.3.jpg', styleProfile: 'Artesanal, vibrante, retrô, brilho', visualPrompt: 'a physical material sample of glossy colorful ceramic tiles' },
      { id: '5d', label: 'Ladrilho Hidráulico', imageUrl: '/images/5.4.jpg', styleProfile: 'Memória, estampa, personalizado, vintage', visualPrompt: 'a physical material sample of patterned hydraulic tiles' }
    ]
  },
  {
    id: 6,
    title: "6. Hobby Caseiro: O que você mais gosta de fazer em casa?",
    multiselect: true,
    options: [
      { id: '6a', label: 'Ler', imageUrl: '/images/creation_2301882413.jpg', styleProfile: 'Leitura, estantes, poltrona, iluminação focada, silêncio', imagePosition: 'center 70%', visualPrompt: 'a simple loose pencil sketch of an open book drawn on a small piece of white paper' },
      { id: '6b', label: 'Ver Séries/Filmes', imageUrl: '/images/creation_2301884751.jpg', styleProfile: 'Cinema em casa, sofá retrátil, blackout, imersão, conforto', visualPrompt: 'a simple loose pencil sketch of a tv screen drawn on a small piece of white paper' },
      { id: '6c', label: 'Cozinhar', imageUrl: '/images/creation_2301886747.jpg', styleProfile: 'Gourmet, receber, prático, equipamentos, convivência', visualPrompt: 'a simple loose pencil sketch of a chef hat drawn on a small piece of white paper' },
      { id: '6d', label: 'Jogos de Tabuleiro', imageUrl: '/images/creation_2301899189.jpg', styleProfile: 'Jogos, mesa grande, social, diversão, conforto', visualPrompt: 'a simple loose pencil sketch of a dice drawn on a small piece of white paper' },
      { id: '6e', label: 'Artesanato', imageUrl: '/images/creation_2301901835.jpg', styleProfile: 'Ateliê, manual, criativo, organização, bancada', visualPrompt: 'a simple loose pencil sketch of a scissor drawn on a small piece of white paper' }
    ]
  },
  {
    id: 7,
    title: "7. O Detalhe Afetivo: O que não pode faltar na decoração?",
    multiselect: true,
    options: [
      { id: '7a', label: 'Plantas (Urban Jungle)', imageUrl: '/images/creation_2301935942.jpg', styleProfile: 'Biofilia, natureza, frescor, vida, verde', visualPrompt: 'a polaroid photo of lush green plants' },
      { id: '7b', label: 'Instrumento Musical', imageUrl: '/images/creation_2301938207.jpg', styleProfile: 'Música, hobby, arte, sensibilidade, acústica', visualPrompt: 'a polaroid photo of a musical instrument' },
      { id: '7c', label: 'Galeria de Arte/Fotos', imageUrl: '/images/creation_2301944238.jpg', styleProfile: 'Memórias, curadoria, pessoal, história, quadros', visualPrompt: 'a polaroid photo of framed art on a wall' },
      { id: '7d', label: 'Móveis com História', imageUrl: '/images/creation_2301946984.jpg', styleProfile: 'Herança, vintage, madeira, nostalgia, relíquia', visualPrompt: 'a polaroid photo of an antique vintage furniture piece' }
    ]
  }
];
