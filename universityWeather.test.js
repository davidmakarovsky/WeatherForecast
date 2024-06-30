import { jest } from "@jest/globals";
import { fetchUMichWeather, fetchUMassWeather, fetchUniversityWeather } from "./universityWeather.js";

const SECOND = 1000;
jest.setTimeout(100 * SECOND);

describe("fetchUMichWeather",  () => {
  it("works for mich", async () => {
    const res = await fetchUMichWeather();
    expect(res.totalAverage).toBe(61.75019841269841);
  })
});

describe("fetchUMassWeather", () => {
  it("works for mass", async () => {
    const res = await fetchUMassWeather();
    expect(res.totalAverage).toBe(53.54419642857144);
  })

  it("do thing good when bad input", async () => {
    try {
      await fetchUMichWeather();
    } catch (error) {
      console.error("",error);
    }
  })
});

describe("fetchUniversityWeather", () => {
  it("work well", async () => {
    function stringCorrecter(place) {
      let retval = "";
      retval = place.replace(" ", "+");
      retval.replace("at", "");
      return retval;
    }
    const res = await fetchUniversityWeather("Aachen", stringCorrecter);
    expect(res.totalAverage).toBe(53.78571428571429);
  });
});
