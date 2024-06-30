export function fetchCurrentTemperature(coords) {
  const url = `https://220.maxkuechen.com/currentTemperature/forecast?latitude=${coords.lat}&longitude=${coords.lon}&hourly=temperature_2m&temperature_unit=fahrenheit`;

  return fetch(url)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(new Error(response.statusText));
      }
      return response.json();
    })
    .then(data => {
      return { time: data.hourly.time, temperature_2m: data.hourly.temperature_2m };
    });
}

export function tempAvgAboveAtCoords(coords, temp) {
  return fetchCurrentTemperature(coords).then(tempArr => {
    if (!Array.isArray(tempArr.temperature_2m)) {
      throw new Error("Temperature data is not in the expected format");
    }

    const validTemperatures = tempArr.temperature_2m.filter(temp => typeof temp === "number");
    const count = validTemperatures.length;

    const sum = validTemperatures.reduce((acc, temp) => acc + temp, 0);

    return sum / count > temp;
  });
}
