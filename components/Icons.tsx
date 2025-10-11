import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

// A highly-stylized adversary mask icon, using the app's primary "warning" color (amber-500).
const AdversaryMaskIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 32 28">
        <path
            fill="#f59e0b" // Tailwind CSS amber-500
            d="M2 8 C 2 8 16 -2 30 8 L 16 28 Z M9 13 L12 16 L15 13 Z M17 13 L20 16 L23 13 Z M9 19 L16 22 L23 19 Z"
            fillRule="evenodd" // Creates the "cutout" effect for eyes and mouth
        />
    </svg>
);

// A stylized user icon designed with colors that match the app's primary theme color.
// Both the head and body use the primary green color.
const StylizedUserIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 20 28" preserveAspectRatio="xMidYMin meet">
        {/* Color uses Tailwind green-500 for a thematic look */}
        <circle cx="10" cy="8" r="8" fill="#22c55e" />
        {/* Color uses Tailwind green-500 */}
        <path d="M2 18 L2 28 L18 28 L18 22 L10 22 L10 18 L2 18 Z" fill="#22c55e" />
    </svg>
);


// The final ADversaryLogo component, composed to match the user's reference layout.
export const ADversaryLogo: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 64 56">
        {/* Adversary mask icon floating above the users */}
        <g transform="translate(16, 0)">
            <AdversaryMaskIcon width="32" height="28" />
        </g>
        {/* Two stylized user icons positioned below */}
        <g transform="translate(4, 28)">
            <StylizedUserIcon width="20" height="28" />
        </g>
        <g transform="translate(40, 28)">
            <StylizedUserIcon width="20" height="28" />
        </g>
    </svg>
);


export const CogIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15.5a3.5 3.5 0 100-7 3.5 3.5 0 000 7z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06-.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
    </svg>
);

export const EmptyStateIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" d="M3.75 4.75h16.5v14.5H3.75z" />
    </svg>
);

export const PlayIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

export const ImportIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
  </svg>
);

export const ExportIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
  </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

export const DomainControllerIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        {/* Server Body - A solid, professional blue, matching the reference image */}
        <path d="M16 8C16 5.79 17.79 4 20 4H44C46.21 4 48 5.79 48 8V60H16V8Z" fill="#002EA7"/>
        
        {/* White Bars on Server */}
        <rect x="21" y="10" width="22" height="4" fill="#FFFFFF"/>
        <rect x="21" y="52" width="22" height="4" fill="#FFFFFF"/>

        {/* Triangle Overlay */}
        <path d="M36 34 L 62 60 L 32 60 Z" fill="#002EA7" stroke="#FFFFFF" strokeWidth="2.5" strokeLinejoin="round"/>

        {/* Hierarchy Diagram inside Triangle */}
        <g fill="#FFFFFF" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round">
            {/* Boxes */}
            <rect x="45" y="42" width="6" height="5"/>
            <rect x="38" y="53" width="6" height="5"/>
            <rect x="52" y="53" width="6" height="5"/>
            
            {/* Connecting Lines */}
            <line x1="48" y1="47" x2="48" y2="50"/>
            <line x1="41" y1="50" x2="55" y2="50"/>
            <line x1="41" y1="50" x2="41" y2="53"/>
            <line x1="55" y1="50" x2="55" y2="53"/>
        </g>
    </svg>
);

export const ServerIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="8" width="36" height="48" rx="2" fill="#6B7280" stroke="#374151" strokeWidth="2" />
    <path d="M20 16h24" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    <path d="M20 24h24" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    <path d="M20 32h24" stroke="#D1D5DB" strokeWidth="3" strokeLinecap="round"/>
    <rect x="20" y="44" width="8" height="4" rx="1" fill="#374151" />
    <circle cx="40" cy="46" r="1.5" fill="#A3E635"/>
  </svg>
);

export const WorkstationIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="10" width="56" height="34" rx="4" fill="#3B82F6" stroke="#1E40AF" strokeWidth="2" />
        <rect x="8" y="14" width="48" height="26" fill="#000" />
        <path d="M20 44h24" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        <path d="M32 44v10" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
        <path d="M24 54h16" stroke="#9CA3AF" strokeWidth="4" strokeLinecap="round" />
    </svg>
);

export const FirewallIcon: React.FC<IconProps> = (props) => (
    <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 32H62" stroke="#F59E0B" strokeWidth="4"/>
        <path d="M10 8V56" stroke="#9CA3AF" strokeWidth="4"/>
        <path d="M54 8V56" stroke="#9CA3AF" strokeWidth="4"/>
        <rect x="10" y="8" width="44" height="48" fill="none" stroke="#9CA3AF" strokeWidth="4"/>
        <rect x="18" y="16" width="12" height="12" fill="#DC2626"/>
        <rect x="34" y="16" width="12" height="12" fill="#DC2626"/>
        <rect x="18" y="36" width="12" height="12" fill="#DC2626"/>
        <rect x="34" y="36" width="12" height="12" fill="#DC2626"/>
    </svg>
);

export const CloudIcon: React.FC<IconProps> = (props) => (
  <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
    <path d="M41.42,18.83A15,15,0,0,0,14.5,23.33a11,11,0,0,0-1.08,21.91H47.58a12,12,0,0,0,.42-24.34Z" fill="#BFDBFE"/>
    <path d="M41.42,18.83a15,15,0,0,0-13.46-8.5A15.21,15.21,0,0,0,14.5,23.33a11,11,0,0,0-1.08,21.91H47.58a12,12,0,0,0,.42-24.34Z" fill="#FFFFFF" transform="translate(4,4)"/>
  </svg>
);

export const MitreIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 20.944a11.955 11.955 0 0118-8.618c0-2.162-.612-4.18-1.618-5.984z" />
    </svg>
);

export const ShieldIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

export const TerminalIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);

export const AlertIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

export const WarningIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export const InfoIcon: React.FC<IconProps> = (props) => (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const ChevronRightIcon: React.FC<IconProps> = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);