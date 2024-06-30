export function fetchGeoCoord(query) {
  const searchURL = "https://220.maxkuechen.com/geoCoord/search?q=" + query;

  return fetch(searchURL.toString()).then(res =>
    res.ok
      ? res.json().then(json => {
          return {
            lon: Number.parseFloat(json[0].lon),
            lat: Number.parseFloat(json[0].lat),
            importances: json[0].importances,
          };
        })
      : new Error(res.statusText)
  );
}

export function locationImportantEnough(place, importanceThreshold) {
  const p1 = fetchGeoCoord(place);
  return p1.then(loc => (loc.importances ? loc.importances.some(x => x > importanceThreshold) : p1));
}
