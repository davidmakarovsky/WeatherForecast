export function fetchUniversities(query) {
  const url = `https://220.maxkuechen.com/universities/search?name=${query}`;

  return fetch(url)
    .then(response => (response.ok ? response.json() : new Error(response.statusText)))
    .then(data => data.map(uni => uni.name));
}

export function universityNameLengthOrderAscending(queryName) {
  return fetchUniversities(queryName).then(nameArr => {
    let max = 0;
    nameArr.forEach(uni => {
      if (uni.length < max) {
        max = uni.length;
      } else return false;
    });
    return true;
  });
}
