import { jest } from "@jest/globals";
import { fetchGeoCoord, locationImportantEnough } from "./fetchGeoCoord.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);
const sample = [
  {
    lat: "50.8346962",
    lon: "6.0886835",
    importances: [0.18681062635799514, 0.1549472281276842, 0.194763561494054, 0.1555057273939338, 0.19916893973465954],
  },
];

describe("fetchGeoCoord", () => {
  // TODO
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("work well", async () => {
    fetchMock.mockResponse(JSON.stringify(sample));
    const res = await fetchGeoCoord("Kohlscheid");
    expect(res.lat).toBe(50.8346962);
    expect(typeof res.lat).toBe("number");
    expect(typeof res.lon).toBe("number");
    expect(typeof res.importances).toBe("object");
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("locationImportantEnough", () => {
  // TODO
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("work well", async () => {
    fetchMock.mockResponse(JSON.stringify(sample));
    const res = await locationImportantEnough("Kohlscheid", 0.19);
    expect(res).toBe(true);
  });

  it("work well when bad", async () => {
    fetchMock.mockResponse(JSON.stringify(sample));
    const res = await locationImportantEnough("Kohlscheid", 12);
    expect(res).toBe(false);
  });

  it("work well when not ok", async () => {
    fetchMock.mockResponse(Promise.resolve({ ok: false }));
    try {
      const res = await locationImportantEnough("id", 0.1);
      expect(res).toBe(false);
    } catch (error) {
      console.error("", error);
    }
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
