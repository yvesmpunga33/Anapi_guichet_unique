const fs = require('fs');

const data = JSON.parse(fs.readFileSync('./public/data/drc-provinces.geojson', 'utf8'));

// Simplify polygon by taking every nth point
function simplifyPolygon(polygon, factor = 8) {
  return polygon.map(ring => {
    const simplified = ring.filter((_, i) => i % factor === 0);
    // Ensure ring is closed
    if (simplified.length > 0) {
      const first = simplified[0];
      const last = simplified[simplified.length - 1];
      if (first[0] !== last[0] || first[1] !== last[1]) {
        simplified.push([first[0], first[1]]);
      }
    }
    return simplified.length >= 4 ? simplified : ring.filter((_, i) => i % 3 === 0);
  });
}

const simplified = {
  type: 'FeatureCollection',
  features: data.features.map(f => ({
    type: 'Feature',
    properties: {
      name: f.properties.name,
      code: f.properties['ISO3166-2']
    },
    geometry: {
      type: f.geometry.type,
      coordinates: f.geometry.type === 'MultiPolygon'
        ? f.geometry.coordinates.map(poly => simplifyPolygon(poly, 8))
        : simplifyPolygon(f.geometry.coordinates, 8)
    }
  }))
};

fs.writeFileSync('./public/data/drc-provinces-simple.json', JSON.stringify(simplified));
console.log('Simplified:', data.features.length, 'provinces');
console.log('Original size:', fs.statSync('./public/data/drc-provinces.geojson').size);
console.log('New size:', fs.statSync('./public/data/drc-provinces-simple.json').size);
