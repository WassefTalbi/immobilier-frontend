import { MenuItem } from "./menu.model";

export const MENU: MenuItem[] = [
  {
    id: 1,
    label: 'GESTION-EXPERTISE',
    icon: 'ph-gear',
    subItems: [
      { 
        id: 6,
        label: 'Missions',
        link: '/gestion-expertise/mission',
        parentId: 1,
        icon: 'ph-briefcase'
      },
      {
        id: 7,
        label: 'Users',
        link: '/gestion-expertise/user',
        parentId: 1,
        icon: 'ph-users'
      },
    ]
  },
  {
    id: 2,
    label: 'CONSULTER LES RAPPORT',
    link: '/gestion-expertise/rapport',
    icon: 'ph-file-text'
  },
  {
    id: 3,
    label: 'CONSULTER POWER BI',
    link: '/gestion-expertise/powerbi',
    icon: 'ph-chart-bar'
  },
  {
    id: 4,
    label: 'CHATBOT',
    link: '/gestion-expertise/chatbot',
    icon: 'ph-robot'
  },
  {
    id: 5,
    label: 'EXTRACTION PDF ',
    link: '/gestion-expertise/extraction',
    icon: 'ph-file-arrow-down'
  },
  {
    id: 6,
    label: 'RESUME PDF ',
    link: '/gestion-expertise/resume',
    icon: 'ph-file-search'
  },
  {
    id: 7,
    label: 'DETECTION CONTAMINATION',
    link: '/gestion-expertise/contamination',
    icon: 'ph-warning-circle'
  },
  {
    id: 8,
    label: 'DETECTION CONTENEUR ',
    link: '/gestion-expertise/conteneur',
    icon: 'ph-truck'
  },
  {
    id: 9,
    label: 'MEETING',
    link: '/gestion-expertise/meeting',
    icon: 'ph-calendar-check'
  },
];
