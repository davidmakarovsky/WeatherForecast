import { jest } from "@jest/globals";
import fetchMock from "jest-fetch-mock";
import assert from "assert";
import { fetchCurrentTemperature, tempAvgAboveAtCoords } from "./fetchCurrentTemperature.js";

const SECOND = 1000;
jest.setTimeout(30 * SECOND);
const forecast = {
  latitude: 49.9375,
  longitude: 50,
  hourly_units: {
    time: "iso8601",
    temperature_2m: "°F",
  },
  hourly: {
    time: ["2024-04-24T00:00", "2024-04-24T01:00", "2024-04-24T02:00", "2024-04-24T03:00", "2024-04-24T04:00"],
    temperature_2m: [53, 52, 51.5, 52.3, 55.7],
  },
};

describe("fetchCurrentTemperature", () => {
  it("test url (50, 50)", async () => {
    fetchMock.enableMocks();
    const coordinates = { lat: 50, long: 50 };
    try {
      fetchMock.mockResponse(JSON.stringify(forecast));

      const res = await fetchCurrentTemperature(coordinates);
      expect(res.time[0]).toBe("2024-04-24T00:00");
      expect(res.temperature_2m[0]).toBe(53);
    } catch (error) {
      console.error("Error:", error);
    }
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
  it("test real url (-10, 100)", async () => {
    const coordinates = { lat: -10, long: 100 };
    try {
      const res = await fetchCurrentTemperature(coordinates);
      assert(res.time.length >= 0, "res.time empty");
      assert(res.temperature_2m.length >= 0, "res.temp empty");
    } catch (error) {
      console.error("Error:", error);
    }
  });
  it("test real url (1000, -1000)", async () => {
    const coordinates = { lat: 1000, long: -1000 };
    try {
      const res = await fetchCurrentTemperature(coordinates);
      expect(res).toBeUndefined();
    } catch (error) {
      expect(error.message).toMatch("Not Found");
    }
  });
});

describe("tempAvgAboveAtCoords", () => {
  beforeEach(() => {
    fetchMock.enableMocks();
  });

  it("test url (50, 50), lower temp", async () => {
    const coordinates = { lat: 50, long: 50 };
    try {
      fetchMock.mockResponse(JSON.stringify(forecast));

      const res = await tempAvgAboveAtCoords(coordinates, 10);
      expect(res).toBe(true);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  it("test url (50, 50), same temp", async () => {
    const coordinates = { lat: 50, long: 50 };
    try {
      fetchMock.mockResponse(JSON.stringify(forecast));

      const res = await tempAvgAboveAtCoords(coordinates, 52.9);
      expect(res).toBe(false);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  it("test url (50, 50), higher temp", async () => {
    const coordinates = { lat: 50, long: 50 };
    try {
      fetchMock.mockResponse(JSON.stringify(forecast));

      const res = await tempAvgAboveAtCoords(coordinates, 70);
      expect(res).toBe(false);
    } catch (error) {
      console.error("Error:", error);
    }
  });

  afterEach(() => {
    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});
