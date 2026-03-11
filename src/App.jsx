import React, { useState } from 'react';

/**
 * ============================================================================
 * MIRO SPINE VISUALIZATION - Educational Tool
 * ============================================================================
 * 
 * PURPOSE:
 * Interactive visualization showing how different movements affect Miro's
 * spine disc regions (C4-C6, T12-T13, T13-L1). Helps understand which
 * activities to avoid and why.
 * 
 * ARCHITECTURE OVERVIEW:
 * 
 * 1. DATA MODELS (Classes)
 *    - Movement: Represents an activity (walking, jumping, etc.)
 *    - DiscRegion: Represents a spinal disc area that can be affected
 *    - DogAnatomy: Manages all SVG path definitions for dog visualization
 *    - SpineModel: Handles spine/vertebrae calculations and positioning
 *    - ColorTheme: Centralizes all color values for easy theme changes
 * 
 * 2. DATA INSTANCES (Constants)
 *    - MOVEMENTS: Array of Movement objects (6 different activities)
 *    - DISC_REGIONS: Array of DiscRegion objects (3 problem areas)
 *    - dogAnatomy, spineModel, theme: Singleton instances
 * 
 * 3. UI COMPONENTS (React Components)
 *    - Dog anatomy: DogEar, DogHead, DogBody, DogTail, DogLeg
 *    - Spine visualization: Vertebrae, DiscRegionLabels
 *    - Controls: MovementButton, MovementControls
 *    - Information: RegionDetail, RegionDetails, MovementDescription
 *    - Layout: Header, WarningFooter, DogVisualization
 *    - Main: MiroSpineViz (assembles everything)
 * 
 * HOW TO MODIFY:
 * 
 * Add a new movement:
 *   1. Add new Movement instance to MOVEMENTS array
 *   2. Specify which regions it affects
 *   3. Set spineOffset and headRotation for animation
 * 
 * Change dog appearance:
 *   1. Edit DogAnatomy class paths property
 *   2. Modify individual path strings or add new features
 *   3. Update component props if needed
 * 
 * Adjust colors/theme:
 *   1. Edit ColorTheme class colors property
 *   2. Use theme.get('path.to.color') in components
 * 
 * Add new disc region:
 *   1. Add new DiscRegion instance to DISC_REGIONS array
 *   2. Specify x,y coordinates in SVG space
 *   3. Reference in Movement.regions arrays as needed
 * 
 * Modify layout:
 *   1. Edit MiroSpineViz component JSX structure
 *   2. Adjust container styles
 *   3. Reorder or nest components as needed
 * 
 * ============================================================================
 */

// ============================================================================
// DATA MODELS - Define the structure of our domain objects
// ============================================================================

/**
 * Movement class - Represents a dog movement type with its effects
 * @property {string} id - Unique identifier for the movement
 * @property {string} label - Display name for the movement
 * @property {string} icon - Emoji icon representing the movement
 * @property {string} description - What happens during this movement
 * @property {string[]} regions - Which disc regions are affected (array of disc IDs)
 * @property {number} spineOffset - Vertical pixel offset for spine animation
 * @property {number} headRotation - Rotation angle in degrees for head
 */
class Movement {
  constructor({ id, label, icon, description, regions, spineOffset, headRotation }) {
    this.id = id;
    this.label = label;
    this.icon = icon;
    this.description = description;
    this.regions = regions;
    this.spineOffset = spineOffset;
    this.headRotation = headRotation;
  }

  /** Check if this movement affects a specific disc region */
  affectsRegion(regionId) {
    return this.regions.includes(regionId);
  }

  /** Check if this is a high-risk movement (affects multiple regions) */
  isHighRisk() {
    return this.regions.length >= 3;
  }
}

/**
 * DiscRegion class - Represents a spinal disc region that can be affected
 * @property {string} id - Unique identifier (e.g., 'c4-c6')
 * @property {string} label - Short display label
 * @property {string} fullName - Full anatomical name
 * @property {string} description - What this region controls and symptoms
 * @property {number} x - X coordinate in SVG space
 * @property {number} y - Y coordinate in SVG space
 */
class DiscRegion {
  constructor({ id, label, fullName, description, x, y }) {
    this.id = id;
    this.label = label;
    this.fullName = fullName;
    this.description = description;
    this.x = x;
    this.y = y;
  }

  /** Calculate label offset based on region index to prevent overlap */
  getLabelOffset(index) {
    const offsets = [10, 55, 20]; // Staggered offsets for 3 regions
    return offsets[index] || 18;
  }
}

/**
 * DogAnatomy class - Manages SVG path definitions for dog visualization
 * Provides methods to access and manipulate anatomical features
 */
class DogAnatomy {
  constructor() {
    this.paths = {
      ear: {
        outer: `
          M 78 65    Q 88 68 95 75   
          Q 98 82 96 90   Q 90 92 82 90   
          Q 76 85 73 75   Q 74 68 78 65   Z
        `,
        innerFold: `M 80 70  Q 87 73 91 80  Q 91 86 86 89`,
      },
      body: {
        full: `
          M 90 70
          C 100 65, 110 60, 130 58
          C 150 56, 170 56, 190 58
          C 210 60, 230 64, 250 70
          L 260 78
          C 260 95, 255 105, 245 110
          L 235 112
          C 220 115, 200 118, 180 118
          C 160 118, 140 116, 120 112
          L 105 110
          C 95 105, 88 95, 88 80
          Z
        `,
        // Individual sections for easy modification
        sections: {
          neck: 'M 90 70',
          backTop: 'C 100 65, 110 60, 130 58',
          backMid: 'C 150 56, 170 56, 190 58',
          backRear: 'C 210 60, 230 64, 250 70',
          rearDown: 'L 260 78',
          rearBottom: 'C 260 95, 255 105, 245 110',
          bellyRear: 'L 235 112',
          bellyMid: 'C 220 115, 200 118, 180 118',
          bellyFront: 'C 160 118, 140 116, 120 112',
          chestDown: 'L 105 110',
          chestUp: 'C 95 105, 88 95, 88 80',
          close: 'Z',
        },
      },
      tail: {
        outer: 'M 260 72 Q 280 55 295 60 Q 305 62 310 68',
        inner: 'M 262 70 Q 282 53 297 58 Q 306 60 310 66',
      },
      head: {
        main: { cx: 58, cy: 72, rx: 28, ry: 24 },
        snout: { cx: 35, cy: 75, rx: 14, ry: 11 },
        furDetail: { cx: 55, cy: 70, rx: 8, ry: 6 },
      },
      features: {
        eye: { cx: 50, cy: 68, r: 5 },
        eyeGlint: { cx: 51, cy: 67, r: 2 },
        eyeHighlight: { cx: 52, cy: 66, r: 1.5 },
        nose: { cx: 26, cy: 76, rx: 4, ry: 3.5 },
        noseGlint: { cx: 27, cy: 75, rx: 1, ry: 1 },
        mouth: 'M 26 79 L 26 82',
        smile: 'M 26 82 Q 30 84 33 82',
        furLines: [
          'M 40 62 Q 44 60 48 62',
          'M 42 64 Q 46 62 50 64',
        ],
      },
    };
  }

  /** Get ear path data */
  getEar() {
    return this.paths.ear;
  }

  /** Get body path data */
  getBody() {
    return this.paths.body;
  }

  /** Get tail path data */
  getTail() {
    return this.paths.tail;
  }

  /** Get head shape data */
  getHead() {
    return this.paths.head;
  }

  /** Get facial features data */
  getFeatures() {
    return this.paths.features;
  }
}

/**
 * SpineModel class - Manages spine/vertebrae calculations and rendering logic
 */
class SpineModel {
  constructor() {
    this.vertebraePositions = [50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275];
    this.discRegionProximity = 10; // How close a vertebra must be to be "at" a disc region
  }

  /** Calculate Y position for vertebra based on X position (creates curve) */
  calculateVertebraY(x) {
    return 72 - Math.sin((x - 50) / 40) * 20;
  }

  /** Check if vertebra at given X position is near an affected disc region */
  isVertebraAffected(x, discRegions, activeRegionIds) {
    return discRegions.some(region => 
      Math.abs(region.x - x) < this.discRegionProximity && 
      activeRegionIds.includes(region.id)
    );
  }

  /** Get all vertebrae positions */
  getPositions() {
    return this.vertebraePositions;
  }
}

/**
 * ColorTheme class - Centralizes all color definitions
 * Makes it easy to change color scheme or implement themes
 */
class ColorTheme {
  constructor() {
    this.colors = {
      active: '#ff4444',
      hover: '#ffaa44',
      inactive: '#666',
      activeText: '#ff6666',
      warning: '#ffaa44',
      background: {
        gradient: 'linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
        card: 'rgba(255,255,255,0.03)',
        cardBorder: 'rgba(255,255,255,0.06)',
      },
      dog: {
        bodyFill: '#2a2a3a',
        bodyStroke: '#3a3a4a',
        shadingFill: '#252535',
        darkDetail: '#1a1a2a',
      },
    };
  }

  get(path) {
    const keys = path.split('.');
    let value = this.colors;
    for (const key of keys) {
      value = value[key];
    }
    return value;
  }
}

// ============================================================================
// DATA INSTANCES - Create instances with actual data
// ============================================================================

const MOVEMENTS = [
  new Movement({
    id: 'resting',
    label: 'Resting',
    icon: '😴',
    description: 'Spine in neutral position. Minimal stress on discs.',
    regions: [],
    spineOffset: 0,
    headRotation: 0,
  }),
  new Movement({
    id: 'walking',
    label: 'Walking',
    icon: '🚶',
    description: 'Rhythmic flexion/extension. T13-L1 absorbs most motion as hind legs push forward.',
    regions: ['t13-l1'],
    spineOffset: 2,
    headRotation: 0,
  }),
  new Movement({
    id: 'looking-up',
    label: 'Looking Up',
    icon: '👆',
    description: 'Neck extension compresses C4-C6 discs. This may cause pain or reluctance.',
    regions: ['c4-c6'],
    spineOffset: 0,
    headRotation: 25,
  }),
  new Movement({
    id: 'looking-down',
    label: 'Looking Down',
    icon: '👇',
    description: 'Neck flexion stretches C4-C6. Eating from floor bowl activates this.',
    regions: ['c4-c6'],
    spineOffset: 0,
    headRotation: -25,
  }),
  new Movement({
    id: 'jumping',
    label: 'Jumping',
    icon: '⬆️',
    description: 'HIGH IMPACT: Landing compresses ALL affected discs. Avoid this movement.',
    regions: ['c4-c6', 't12-t13', 't13-l1'],
    spineOffset: -30,
    headRotation: -15,
  }),
  new Movement({
    id: 'climbing',
    label: 'Stairs/Climbing',
    icon: '🪜',
    description: 'Repeated stress on T12-T13 and T13-L1 as back legs push up.',
    regions: ['t12-t13', 't13-l1'],
    spineOffset: 4,
    headRotation: -5,
  }),
];

const DISC_REGIONS = [
  new DiscRegion({
    id: 'c4-c6',
    label: 'C4-C6',
    fullName: 'Cervical (Neck)',
    description: 'Controls front legs & all signals below. Compression here = wobbly front legs, neck pain.',
    x: 85,
    y: 68,
  }),
  new DiscRegion({
    id: 't12-t13',
    label: 'T12-T13',
    fullName: 'Thoracic (Mid-back)',
    description: 'Transition zone at end of ribcage. Vulnerable to rotational stress.',
    x: 200,
    y: 52,
  }),
  new DiscRegion({
    id: 't13-l1',
    label: 'T13-L1',
    fullName: 'Thoracolumbar Junction',
    description: 'Most common problem area. Controls hind legs. Issues = wobbly back end, mis-stepping.',
    x: 230,
    y: 55,
  }),
];

// Create singleton instances
const dogAnatomy = new DogAnatomy();
const spineModel = new SpineModel();
const theme = new ColorTheme();

// ============================================================================
// UI COMPONENTS - Presentational components for rendering
// ============================================================================

/**
 * Header Component
 * Purpose: Display title and subtitle information
 * Usage: <Header title="..." subtitle="..." />
 */
const Header = ({ title, subtitle }) => (
  <div style={{ textAlign: 'center', marginBottom: '32px' }}>
    <h1 style={{
      fontSize: '28px',
      fontWeight: '300',
      color: '#fff',
      margin: '0 0 8px 0',
      letterSpacing: '4px',
      textTransform: 'uppercase',
    }}>
      {title}
    </h1>
    <p style={{
      fontSize: '12px',
      color: '#888',
      margin: 0,
      letterSpacing: '2px',
    }}>
      {subtitle}
    </p>
  </div>
);

/**
 * DogEar Component
 * Purpose: Renders the floppy ear SVG paths
 * Structure: Outer shape + inner fold detail
 */
const DogEar = () => {
  const ear = dogAnatomy.getEar();
  return (
    <>
      <path 
        d={ear.outer}
        fill={theme.get('dog.bodyFill')}
        stroke={theme.get('dog.bodyStroke')}
        strokeWidth="1"
      />
      <path 
        d={ear.innerFold}
        fill="none" 
        stroke={theme.get('dog.shadingFill')}
        strokeWidth="2" 
        opacity="0.4"
      />
    </>
  );
};

/**
 * DogHead Component
 * Purpose: Renders the complete dog head with all features
 * Props: rotation - angle in degrees for head movement
 * Structure: Head shape, snout, ear, eyes, nose, mouth, fur texture
 */
const DogHead = ({ rotation }) => {
  const head = dogAnatomy.getHead();
  const features = dogAnatomy.getFeatures();
  
  return (
    <g 
      transform={`rotate(${rotation}, 70, 75)`}
      style={{ transition: 'transform 0.4s ease-out' }}
    >
      {/* Head shape */}
      <ellipse 
        {...head.main}
        fill={theme.get('dog.bodyFill')}
        stroke={theme.get('dog.bodyStroke')}
        strokeWidth="1"
      />
      
      {/* Snout */}
      <ellipse 
        {...head.snout}
        fill={theme.get('dog.bodyFill')}
        stroke={theme.get('dog.bodyStroke')}
        strokeWidth="1"
      />
      
      {/* Furry face detail */}
      <ellipse {...head.furDetail} fill={theme.get('dog.shadingFill')} opacity="0.4"/>
      
      {/* Ear */}
      <DogEar />
      
      {/* Eyes - layered circles for depth */}
      <circle {...features.eye} fill={theme.get('dog.darkDetail')}/>
      <circle {...features.eyeGlint} fill="#4a4a5a"/>
      <circle {...features.eyeHighlight} fill="#fff"/>
      
      {/* Nose */}
      <ellipse {...features.nose} fill={theme.get('dog.darkDetail')}/>
      <ellipse {...features.noseGlint} fill="#444"/>
      
      {/* Mouth */}
      <path d={features.mouth} stroke={theme.get('dog.darkDetail')} strokeWidth="1"/>
      <path d={features.smile} stroke={theme.get('dog.darkDetail')} strokeWidth="0.8" fill="none"/>
      
      {/* Fur texture lines */}
      {features.furLines.map((line, i) => (
        <path key={i} d={line} stroke={theme.get('dog.bodyStroke')} strokeWidth="0.5" opacity="0.5"/>
      ))}
    </g>
  );
};

/**
 * DogBody Component
 * Purpose: Renders the dog's body with shading
 * Structure: Main outline path + chest/hind quarter shading ellipses
 */
const DogBody = () => {
  const body = dogAnatomy.getBody();
  return (
    <>
      <path
        d={body.full}
        fill={theme.get('dog.bodyFill')}
        stroke={theme.get('dog.bodyStroke')}
        strokeWidth="1"
      />
      <ellipse cx="110" cy="90" rx="20" ry="25" fill={theme.get('dog.shadingFill')} opacity="0.5"/>
      <ellipse cx="240" cy="88" rx="22" ry="28" fill={theme.get('dog.shadingFill')} opacity="0.5"/>
    </>
  );
};

/**
 * DogTail Component
 * Purpose: Renders the fluffy curved tail
 * Structure: Outer curve + inner highlight for depth
 */
const DogTail = () => {
  const tail = dogAnatomy.getTail();
  return (
    <>
      <path 
        d={tail.outer}
        stroke={theme.get('dog.bodyStroke')}
        strokeWidth="10" 
        fill="none" 
        strokeLinecap="round"
      />
      <path 
        d={tail.inner}
        stroke={theme.get('dog.shadingFill')}
        strokeWidth="6" 
        fill="none" 
        strokeLinecap="round"
        opacity="0.7"
      />
    </>
  );
};

/**
 * DogLeg Component
 * Purpose: Renders a single leg (front or back)
 * Props:
 *   - x, y: Top-left position
 *   - width, height: Leg dimensions
 *   - zIndex: 'front' or 'back' determines color for depth perception
 * Structure: Rectangle for leg + ellipse for paw
 */
const DogLeg = ({ x, y, width, height, zIndex }) => {
  const fill = zIndex === 'front' ? theme.get('dog.bodyFill') : theme.get('dog.shadingFill');
  return (
    <>
      <rect 
        x={x} y={y} width={width} height={height} rx="5" 
        fill={fill} 
        stroke={theme.get('dog.bodyStroke')}
      />
      <ellipse 
        cx={x + width / 2} 
        cy={y + height + 2} 
        rx="7" ry="4" 
        fill={fill} 
        stroke={theme.get('dog.bodyStroke')}
      />
    </>
  );
};

/**
 * Vertebrae Component
 * Purpose: Renders all vertebrae dots along the spine
 * Props:
 *   - positions: Array of X coordinates for vertebrae
 *   - discRegions: Array of DiscRegion objects
 *   - activeRegionIds: Array of region IDs currently affected
 * Behavior: Highlights and enlarges vertebrae near affected disc regions
 */
const Vertebrae = ({ positions, discRegions, activeRegionIds }) => (
  <>
    {positions.map((x, i) => {
      const y = spineModel.calculateVertebraY(x);
      const isActive = spineModel.isVertebraAffected(x, discRegions, activeRegionIds);
      
      return (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={isActive ? "5" : "3"}
          fill={isActive ? theme.get('active') : theme.get('inactive')}
          stroke={isActive ? "#fff" : "none"}
          strokeWidth={isActive ? "1.5" : "0"}
          style={{
            transition: 'all 0.3s ease',
            filter: isActive ? `drop-shadow(0 0 6px ${theme.get('active')})` : 'none',
          }}
        />
      );
    })}
  </>
);

/**
 * DiscRegionLabels Component
 * Purpose: Renders text labels for each disc region
 * Props:
 *   - regions: Array of DiscRegion objects
 *   - activeRegionIds: Array of currently affected region IDs
 * Behavior: Changes color when region is active
 */
const DiscRegionLabels = ({ regions, activeRegionIds }) => (
  <>
    {regions.map((region, idx) => {
      const yOffset = region.getLabelOffset(idx);
      const isActive = activeRegionIds.includes(region.id);
      
      return (
        <text
          key={region.id}
          x={region.x}
          y={region.y + yOffset}
          textAnchor="middle"
          fontSize="10"
          fill={isActive ? theme.get('activeText') : '#888'}
          fontFamily="monospace"
          style={{ transition: 'fill 0.3s ease' }}
        >
          {region.label}
        </text>
      );
    })}
  </>
);

/**
 * DogVisualization Component
 * Purpose: Main SVG container that assembles all dog parts
 * Props:
 *   - movement: Movement object defining current animation state
 * Structure: SVG > animated group > body parts + spine + labels
 */
const DogVisualization = ({ movement }) => (
  <svg
    viewBox="0 0 400 180"
    style={{
      width: '100%',
      maxWidth: '500px',
      display: 'block',
      margin: '0 auto',
    }}
  >
    <g 
      transform={`translate(0, ${movement.spineOffset})`}
      style={{ transition: 'transform 0.4s ease-out' }}
    >
      <DogBody />
      <DogHead rotation={movement.headRotation} />
      <DogTail />
      
      {/* Front legs */}
      <DogLeg x={110} y={110} width={10} height={37} zIndex="front" />
      <DogLeg x={137} y={112} width={10} height={32} zIndex="back" />
      
      {/* Back legs */}
      <DogLeg x={223} y={111} width={11} height={37} zIndex="front" />
      <DogLeg x={246} y={112} width={11} height={33} zIndex="back" />
      
      <Vertebrae 
        positions={spineModel.getPositions()}
        discRegions={DISC_REGIONS} 
        activeRegionIds={movement.regions} 
      />
      <DiscRegionLabels 
        regions={DISC_REGIONS} 
        activeRegionIds={movement.regions} 
      />
    </g>
  </svg>
);

/**
 * MovementDescription Component
 * Purpose: Display current movement info below visualization
 * Props:
 *   - movement: Movement object to describe
 * Behavior: Changes background color for high-risk movements
 */
const MovementDescription = ({ movement }) => (
  <div style={{
    textAlign: 'center',
    marginTop: '20px',
    padding: '16px',
    background: movement.regions.length > 0 
      ? 'rgba(255, 68, 68, 0.1)' 
      : theme.get('background.card'),
    borderRadius: '8px',
    border: movement.regions.length > 0 
      ? '1px solid rgba(255, 68, 68, 0.3)'
      : `1px solid ${theme.get('background.cardBorder')}`,
    transition: 'all 0.3s ease',
  }}>
    <div style={{ fontSize: '24px', marginBottom: '8px' }}>
      {movement.icon}
    </div>
    <div style={{
      fontSize: '14px',
      fontWeight: '600',
      color: '#fff',
      marginBottom: '6px',
    }}>
      {movement.label}
    </div>
    <div style={{
      fontSize: '12px',
      color: movement.isHighRisk() ? theme.get('activeText') : '#aaa',
      lineHeight: '1.5',
    }}>
      {movement.description}
    </div>
  </div>
);

/**
 * MovementButton Component
 * Purpose: Individual button for selecting a movement
 * Props:
 *   - movement: Movement object to represent
 *   - isActive: Whether this movement is currently selected
 *   - onClick: Handler function when clicked
 */
const MovementButton = ({ movement, isActive, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: '14px 8px',
      background: isActive 
        ? 'linear-gradient(135deg, #ff4444 0%, #cc3333 100%)'
        : theme.get('background.card'),
      border: isActive 
        ? '1px solid #ff6666'
        : `1px solid ${theme.get('background.cardBorder')}`,
      borderRadius: '10px',
      color: '#fff',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      fontSize: '12px',
    }}
  >
    <div style={{ fontSize: '20px', marginBottom: '4px' }}>
      {movement.icon}
    </div>
    {movement.label}
  </button>
);

/**
 * MovementControls Component
 * Purpose: Grid of all movement selection buttons
 * Props:
 *   - movements: Array of Movement objects
 *   - activeMovementId: ID of currently selected movement
 *   - onMovementChange: Callback when movement is selected
 */
const MovementControls = ({ movements, activeMovementId, onMovementChange }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '10px',
    marginBottom: '24px',
  }}>
    {movements.map(movement => (
      <MovementButton
        key={movement.id}
        movement={movement}
        isActive={activeMovementId === movement.id}
        onClick={() => onMovementChange(movement.id)}
      />
    ))}
  </div>
);

/**
 * RegionDetail Component
 * Purpose: Display detailed information about a single disc region
 * Props:
 *   - region: DiscRegion object
 *   - isActive: Whether this region is currently affected
 * Structure: Card with label, full name, and description
 */
const RegionDetail = ({ region, isActive }) => (
  <div
    style={{
      padding: '14px',
      marginBottom: '10px',
      background: isActive 
        ? 'rgba(255, 68, 68, 0.15)'
        : theme.get('background.card'),
      borderRadius: '8px',
      borderLeft: `3px solid ${isActive ? theme.get('active') : '#444'}`,
      transition: 'all 0.3s ease',
    }}
  >
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '6px',
    }}>
      <span style={{
        fontWeight: '600',
        color: isActive ? theme.get('activeText') : '#ccc',
        fontSize: '13px',
      }}>
        {region.label}
      </span>
      <span style={{
        fontSize: '10px',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
      }}>
        {region.fullName}
      </span>
    </div>
    <p style={{
      margin: 0,
      fontSize: '11px',
      color: '#888',
      lineHeight: '1.5',
    }}>
      {region.description}
    </p>
  </div>
);

/**
 * RegionDetails Component
 * Purpose: Container for all disc region detail cards
 * Props:
 *   - regions: Array of DiscRegion objects
 *   - activeRegionIds: Array of currently affected region IDs
 */
const RegionDetails = ({ regions, activeRegionIds }) => (
  <div style={{
    background: theme.get('background.card'),
    borderRadius: '12px',
    padding: '20px',
    border: `1px solid ${theme.get('background.cardBorder')}`,
  }}>
    <h3 style={{
      fontSize: '11px',
      letterSpacing: '2px',
      color: '#888',
      margin: '0 0 16px 0',
      textTransform: 'uppercase',
    }}>
      Affected Disc Regions
    </h3>
    
    {regions.map(region => (
      <RegionDetail
        key={region.id}
        region={region}
        isActive={activeRegionIds.includes(region.id)}
      />
    ))}
  </div>
);

/**
 * WarningFooter Component
 * Purpose: Display important movement restriction warnings
 * Structure: Static warning banner with icon and text
 */
const WarningFooter = () => (
  <div style={{
    marginTop: '24px',
    padding: '16px',
    background: 'rgba(255, 170, 68, 0.1)',
    borderRadius: '10px',
    border: '1px solid rgba(255, 170, 68, 0.2)',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: '14px', marginBottom: '6px' }}>⚠️</div>
    <p style={{
      margin: 0,
      fontSize: '11px',
      color: theme.get('warning'),
      lineHeight: '1.5',
    }}>
      <strong>Movement Restrictions:</strong> Avoid jumping, stairs, and rough play. 
      Use ramps. Elevated food bowls reduce neck strain.
    </p>
  </div>
);

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================

/**
 * MiroSpineViz - Main application component
 * 
 * Purpose: Educational tool to visualize how different movements affect
 *          Miro's spine disc regions
 * 
 * State Management:
 *   - activeMovement: Currently selected movement ID (null = resting)
 *   - hoveredRegion: Currently hovered disc region ID (future use)
 * 
 * Data Flow:
 *   1. User clicks movement button
 *   2. activeMovement state updates
 *   3. currentMovement is looked up from MOVEMENTS array
 *   4. Components re-render with new movement data
 *   5. Dog visualization animates (head rotation, spine offset)
 *   6. Affected vertebrae highlight
 *   7. Region cards update active state
 * 
 * How to modify:
 *   - Add movements: Add to MOVEMENTS array
 *   - Change anatomy: Edit DogAnatomy class paths
 *   - Adjust colors: Modify ColorTheme class
 *   - Change layout: Edit JSX structure and styles below
 */
const MiroSpineViz = () => {
  // State: Track which movement is selected
  const [activeMovement, setActiveMovement] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  // Derived state: Get full movement object (defaults to resting if none selected)
  const currentMovement = MOVEMENTS.find(m => m.id === activeMovement) || MOVEMENTS[0];

  return (
    <div style={{
      minHeight: '100vh',
      background: theme.get('background.gradient'),
      color: '#e0e0e0',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: '24px',
    }}>
      {/* Page Header */}
      <Header 
        title="Miro's Spine" 
        subtitle="4.5 yr • Teacup Morkie • 4 lbs" 
      />

      {/* Main Visualization Card */}
      <div style={{
        background: theme.get('background.card'),
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: `1px solid ${theme.get('background.cardBorder')}`,
      }}>
        <DogVisualization movement={currentMovement} />
        <MovementDescription movement={currentMovement} />
      </div>

      {/* Movement Selection Grid */}
      <MovementControls 
        movements={MOVEMENTS}
        activeMovementId={activeMovement}
        onMovementChange={setActiveMovement}
      />

      {/* Disc Region Information Cards */}
      <RegionDetails 
        regions={DISC_REGIONS}
        activeRegionIds={currentMovement.regions}
      />

      {/* Warning Banner */}
      <WarningFooter />
    </div>
  );
};

export default MiroSpineViz;
