const GeoJSON = {
  type: {
    type: String,
    validators: {
      In: ['Point', 'MultiPoint', 'LineString', 'Polygon', 'MultiPolygon']
    }
  },
  coordinates: {
    type: Number,
    validators: {
      Required: true,
      MinLength: 2
    }
  }
};

module.exports = GeoJSON;