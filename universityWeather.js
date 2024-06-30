import { fetchCurrentTemperature } from "./fetchCurrentTemperature.js";
import { fetchGeoCoord } from "./fetchGeoCoord.js";
import { fetchUniversities } from "./fetchUniversities.js";

export function fetchUniversityWeather(universityQuery, transformName) {
  // TODO
  const retobj = {};
  const uniOrder = []; // tracks universitites so that we may add their temperatures properly in the future
  return fetchUniversities(universityQuery) // transform names of universities if function is present. creates attributes for our return object a
    .then(universities => {
      for (const i of universities) {
        retobj[i] = 0;
        uniOrder.push(i);
      }
      if (transformName) {
        return universities.map(uni => transformName(uni));
      } else {
        return universities;
      }
    })
    .then(universities => universities.map(async uni => await fetchGeoCoord(uni)))
    .then(coords => coords.map(async coord => await coord.then(async c => await fetchCurrentTemperature(c)))) // gets the total average and university average
    .then(async temperatures => {
      let totalsum = 0;
      let runs = 0;
      for (const i of temperatures) {
        let sum = 0;
        let n = 0;
        await i.then(temp => {
          for (const j of temp.temperature_2m) {
            sum += j;
            n++;
          }
        });
        totalsum += sum / n;
        retobj[uniOrder[runs]] = sum / n;
        runs++;
      }
      retobj["totalAverage"] = totalsum / runs;
      return retobj;
    });
}

function stringCorrecter(place) {
  let retval = "";
  retval = place.replaceAll(" ", "+");
  retval = retval.replaceAll("at", "");
  return retval;
}

export function fetchUMassWeather() {
  return fetchUniversityWeather("University of Massachusetts", stringCorrecter);
}

export function fetchUMichWeather() {
  return fetchUniversityWeather("University of Michigan", stringCorrecter);
}
