import React, { useState } from 'react';

const MiroSpineViz = () => {
  const [activeMovement, setActiveMovement] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const movements = [
    {
      id: 'resting',
      label: 'Resting',
      icon: '😴',
      description: 'Spine in neutral position. Minimal stress on discs.',
      regions: [],
      spineOffset: 0,
      headRotation: 0,
    },
    {
      id: 'walking',
      label: 'Walking',
      icon: '🚶',
      description: 'Rhythmic flexion/extension. T13-L1 absorbs most motion as hind legs push forward.',
      regions: ['t13-l1'],
      spineOffset: 2,
      headRotation: 0,
    },
    {
      id: 'looking-up',
      label: 'Looking Up',
      icon: '👆',
      description: 'Neck extension compresses C4-C6 discs. This may cause pain or reluctance.',
      regions: ['c4-c6'],
      spineOffset: 0,
      headRotation: -25,
    },
    {
      id: 'looking-down',
      label: 'Looking Down',
      icon: '👇',
      description: 'Neck flexion stretches C4-C6. Eating from floor bowl activates this.',
      regions: ['c4-c6'],
      spineOffset: 0,
      headRotation: 20,
    },
    {
      id: 'jumping',
      label: 'Jumping',
      icon: '⬆️',
      description: 'HIGH IMPACT: Landing compresses ALL affected discs. Avoid this movement.',
      regions: ['c4-c6', 't12-t13', 't13-l1'],
      spineOffset: -8,
      headRotation: -10,
    },
    {
      id: 'climbing',
      label: 'Stairs/Climbing',
      icon: '🪜',
      description: 'Repeated stress on T12-T13 and T13-L1 as back legs push up.',
      regions: ['t12-t13', 't13-l1'],
      spineOffset: 4,
      headRotation: -5,
    },
  ];

  const discRegions = [
    {
      id: 'c4-c6',
      label: 'C4-C6',
      fullName: 'Cervical (Neck)',
      description: 'Controls front legs & all signals below. Compression here = wobbly front legs, neck pain.',
      x: 85,
      y: 68,
    },
    {
      id: 't12-t13',
      label: 'T12-T13',
      fullName: 'Thoracic (Mid-back)',
      description: 'Transition zone at end of ribcage. Vulnerable to rotational stress.',
      x: 200,
      y: 52,
    },
    {
      id: 't13-l1',
      label: 'T13-L1',
      fullName: 'Thoracolumbar Junction',
      description: 'Most common problem area. Controls hind legs. Issues = wobbly back end, mis-stepping.',
      x: 230,
      y: 55,
    },
  ];

  const currentMovement = movements.find(m => m.id === activeMovement) || movements[0];

  const isRegionActive = (regionId) => {
    return currentMovement.regions.includes(regionId);
  };

  const getRegionColor = (regionId) => {
    if (isRegionActive(regionId)) {
      return '#ff4444';
    }
    if (hoveredRegion === regionId) {
      return '#ffaa44';
    }
    return '#666';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(145deg, #0a0a0f 0%, #1a1a2e 50%, #0f0f1a 100%)',
      color: '#e0e0e0',
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      padding: '24px',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: '300',
          color: '#fff',
          margin: '0 0 8px 0',
          letterSpacing: '4px',
          textTransform: 'uppercase',
        }}>
          Miro's Spine
        </h1>
        <p style={{
          fontSize: '12px',
          color: '#888',
          margin: 0,
          letterSpacing: '2px',
        }}>
          4.5 yr • Teacup Morkie • 4 lbs
        </p>
      </div>

      {/* Main Visualization */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <svg
          viewBox="0 0 400 180"
          style={{
            width: '100%',
            maxWidth: '500px',
            display: 'block',
            margin: '0 auto',
          }}
        >
          {/* Dog silhouette - simplified side view */}
          <g transform={`translate(0, ${currentMovement.spineOffset})`}
             style={{ transition: 'transform 0.4s ease-out' }}>
            
            {/* Body outline */}
            <ellipse cx="180" cy="85" rx="90" ry="45" fill="#2a2a3a" stroke="#3a3a4a" strokeWidth="1"/>
            
            {/* Head */}
            <g transform={`rotate(${currentMovement.headRotation}, 70, 75)`}
               style={{ transition: 'transform 0.4s ease-out' }}>
              <ellipse cx="55" cy="70" rx="35" ry="28" fill="#2a2a3a" stroke="#3a3a4a" strokeWidth="1"/>
              {/* Ear */}
              <ellipse cx="35" cy="50" rx="12" ry="18" fill="#2a2a3a" stroke="#3a3a4a" strokeWidth="1"/>
              {/* Eye */}
              <circle cx="42" cy="65" r="4" fill="#1a1a2a"/>
              {/* Nose */}
              <circle cx="25" cy="72" r="5" fill="#1a1a2a"/>
            </g>

            {/* Tail */}
            <path d="M 270 70 Q 300 50 310 65" stroke="#3a3a4a" strokeWidth="8" fill="none" strokeLinecap="round"/>

            {/* Legs */}
            <rect x="110" y="115" width="12" height="40" rx="4" fill="#2a2a3a" stroke="#3a3a4a"/>
            <rect x="140" y="115" width="12" height="35" rx="4" fill="#252535" stroke="#3a3a4a"/>
            <rect x="220" y="115" width="12" height="40" rx="4" fill="#2a2a3a" stroke="#3a3a4a"/>
            <rect x="245" y="115" width="12" height="35" rx="4" fill="#252535" stroke="#3a3a4a"/>

            {/* SPINE - The main feature */}
            <path
              d="M 50 72 
                 C 70 68, 90 60, 120 55 
                 C 150 50, 180 48, 210 50 
                 C 240 52, 260 58, 275 65"
              stroke="#888"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              style={{ transition: 'all 0.3s ease' }}
            />

            {/* Vertebrae markers along the spine */}
            {[50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275].map((x, i) => {
              const y = 72 - Math.sin((x - 50) / 40) * 20;
              
              // Check if this vertebra is at a disc region position
              const isAtDiscRegion = discRegions.some(region => 
                Math.abs(region.x - x) < 10 && isRegionActive(region.id)
              );
              
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r={isAtDiscRegion ? "5" : "3"}
                  fill={isAtDiscRegion ? "#ff4444" : "#555"}
                  stroke={isAtDiscRegion ? "#fff" : "none"}
                  strokeWidth={isAtDiscRegion ? "1.5" : "0"}
                  style={{
                    transition: 'all 0.3s ease',
                    filter: isAtDiscRegion ? 'drop-shadow(0 0 6px #ff4444)' : 'none',
                  }}
                />
              );
            })}

            {/* Labels for disc regions */}
            {discRegions.map((region, idx) => {
              // Stagger labels to prevent overlap
              const yOffset = idx === 0 ? 10 : (idx === 1 ? 55 : 20);
              
              return (
                <text
                  key={region.id}
                  x={region.x}
                  y={region.y + yOffset}
                  textAnchor="middle"
                  fontSize="10"
                  fill={isRegionActive(region.id) ? '#ff6666' : '#888'}
                  fontFamily="monospace"
                  style={{ transition: 'fill 0.3s ease' }}
                >
                  {region.label}
                </text>
              );
            })}
          </g>
        </svg>

        {/* Pulse animation */}
        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.1); }
          }
        `}</style>

        {/* Movement description */}
        <div style={{
          textAlign: 'center',
          marginTop: '20px',
          padding: '16px',
          background: currentMovement.regions.length > 0 
            ? 'rgba(255, 68, 68, 0.1)' 
            : 'rgba(255,255,255,0.03)',
          borderRadius: '8px',
          border: currentMovement.regions.length > 0 
            ? '1px solid rgba(255, 68, 68, 0.3)'
            : '1px solid rgba(255,255,255,0.05)',
          transition: 'all 0.3s ease',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '8px' }}>
            {currentMovement.icon}
          </div>
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: '#fff',
            marginBottom: '6px',
          }}>
            {currentMovement.label}
          </div>
          <div style={{
            fontSize: '12px',
            color: currentMovement.regions.length === 3 ? '#ff6666' : '#aaa',
            lineHeight: '1.5',
          }}>
            {currentMovement.description}
          </div>
        </div>
      </div>

      {/* Movement Controls */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        marginBottom: '24px',
      }}>
        {movements.map(movement => (
          <button
            key={movement.id}
            onClick={() => setActiveMovement(movement.id)}
            style={{
              padding: '14px 8px',
              background: activeMovement === movement.id 
                ? 'linear-gradient(135deg, #ff4444 0%, #cc3333 100%)'
                : 'rgba(255,255,255,0.05)',
              border: activeMovement === movement.id 
                ? '1px solid #ff6666'
                : '1px solid rgba(255,255,255,0.1)',
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
        ))}
      </div>

      {/* Region Details */}
      <div style={{
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(255,255,255,0.06)',
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
        
        {discRegions.map(region => (
          <div
            key={region.id}
            style={{
              padding: '14px',
              marginBottom: '10px',
              background: isRegionActive(region.id) 
                ? 'rgba(255, 68, 68, 0.15)'
                : 'rgba(255,255,255,0.02)',
              borderRadius: '8px',
              borderLeft: `3px solid ${isRegionActive(region.id) ? '#ff4444' : '#444'}`,
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
                color: isRegionActive(region.id) ? '#ff6666' : '#ccc',
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
        ))}
      </div>

      {/* Warning Footer */}
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
          color: '#ffaa44',
          lineHeight: '1.5',
        }}>
          <strong>Movement Restrictions:</strong> Avoid jumping, stairs, and rough play. 
          Use ramps. Elevated food bowls reduce neck strain.
        </p>
      </div>
    </div>
  );
};

export default MiroSpineViz;
