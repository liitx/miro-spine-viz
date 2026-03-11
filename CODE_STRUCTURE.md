# Miro Spine Visualization - Code Structure Guide

## Quick Reference

### 📦 Classes (Data Models)

| Class | Purpose | Key Methods/Properties |
|-------|---------|----------------------|
| `Movement` | Represents a movement type | `affectsRegion()`, `isHighRisk()` |
| `DiscRegion` | Represents a spinal disc area | `getLabelOffset()` |
| `DogAnatomy` | Manages SVG paths for dog parts | `getEar()`, `getBody()`, `getTail()`, `getHead()`, `getFeatures()` |
| `SpineModel` | Handles spine calculations | `calculateVertebraY()`, `isVertebraAffected()`, `getPositions()` |
| `ColorTheme` | Centralizes color definitions | `get(path)` |

### 🎨 Components

#### Dog Anatomy Components
- `DogEar` - Renders floppy ear
- `DogHead` - Complete head with rotation
- `DogBody` - Body outline with shading
- `DogTail` - Fluffy curved tail
- `DogLeg` - Single leg (front or back)

#### Spine Components
- `Vertebrae` - All vertebrae dots along spine
- `DiscRegionLabels` - Text labels for disc regions

#### UI Components
- `Header` - Title and subtitle
- `MovementButton` - Single movement selection button
- `MovementControls` - Grid of all movement buttons
- `MovementDescription` - Current movement info display
- `RegionDetail` - Single disc region info card
- `RegionDetails` - Container for all region cards
- `WarningFooter` - Warning banner
- `DogVisualization` - Main SVG container
- `MiroSpineViz` - Main app component

## Common Tasks

### Change ear shape
```javascript
// In DogAnatomy class
ear: {
  outer: `M 78 65 Q ...`,  // ← Edit this path
}
```

### Add new movement
```javascript
// In MOVEMENTS array
new Movement({
  id: 'running',
  label: 'Running',
  icon: '🏃',
  description: 'Fast movement...',
  regions: ['t13-l1'],  // ← Which discs affected
  spineOffset: 5,       // ← Vertical position
  headRotation: -10,    // ← Head angle
})
```

### Change color scheme
```javascript
// In ColorTheme class
this.colors = {
  active: '#ff4444',  // ← Change these
  hover: '#ffaa44',
  // ...
}
```

### Adjust leg positions
```javascript
// In DogVisualization component
<DogLeg 
  x={110}     // ← X position
  y={110}     // ← Y position
  width={10}  // ← Width
  height={37} // ← Height
  zIndex="front" 
/>
```

## File Organization

```
src/App.jsx
├── Documentation Header (lines 1-60)
├── Data Models (Classes)
│   ├── Movement
│   ├── DiscRegion
│   ├── DogAnatomy
│   ├── SpineModel
│   └── ColorTheme
├── Data Instances
│   ├── MOVEMENTS array
│   ├── DISC_REGIONS array
│   └── Singleton instances
├── UI Components
│   ├── Dog anatomy components
│   ├── Spine components
│   ├── Control components
│   └── Information components
└── Main Component (MiroSpineViz)
```

## Understanding the Data Flow

```
User clicks button
    ↓
setActiveMovement(id) updates state
    ↓
currentMovement = MOVEMENTS.find(m => m.id === id)
    ↓
Components receive movement prop
    ↓
├─ DogVisualization → Animates spine & head
├─ MovementDescription → Shows info
├─ Vertebrae → Highlights affected dots
└─ RegionDetails → Highlights affected regions
```

## SVG Path Syntax Quick Reference

- `M x y` - Move to position
- `L x y` - Line to position
- `Q cx cy x y` - Quadratic curve (1 control point)
- `C cx1 cy1 cx2 cy2 x y` - Cubic curve (2 control points)
- `Z` - Close path

## Testing Changes

After modifying:
1. Save the file
2. Check browser (hot reload should work)
3. Click through all movements to verify
4. Check console for errors

## Need to Split Into Multiple Files?

If the file gets too large, consider splitting:
- `models/` - Movement, DiscRegion, etc.
- `config/` - MOVEMENTS, DISC_REGIONS constants
- `components/dog/` - Dog anatomy components
- `components/ui/` - UI components
- `utils/` - SpineModel, ColorTheme
- `App.jsx` - Main component only
