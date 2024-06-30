import { jest } from "@jest/globals";
import { fetchUniversities, universityNameLengthOrderAscending } from "./fetchUniversities.js";
import fetchMock from "jest-fetch-mock";

const SECOND = 1000;
jest.setTimeout(10 * SECOND);

describe("fetchUniversities", () => {
  it("Returns an empty array when no results appear", async () => {
    fetchMock.enableMocks();

    const json = [];
    fetchMock.mockResponseOnce(JSON.stringify(json));

    const result = await fetchUniversities("WTF IS A COLLEGE EDUCATION!!!!!!!!!!");
    expect(result).toEqual([]);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("Gets the university containing Massachuesetts", async () => {
    fetchMock.enableMocks();

    const json = [
      { name: "Massachusetts Bay Community College" },
      { name: "Massachusetts Institute of Technology" },
      { name: "University of Massachusetts at Amherst" },
      { name: "University of Massachusetts Boston" },
      { name: "University of Massachusetts at Dartmouth" },
      { name: "University of Massachusetts at Lowell" },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(json));

    const result = await fetchUniversities("Go UMass!... And MIT I guess...");
    expect(result).toEqual([
      "Massachusetts Bay Community College",
      "Massachusetts Institute of Technology",
      "University of Massachusetts at Amherst",
      "University of Massachusetts Boston",
      "University of Massachusetts at Dartmouth",
      "University of Massachusetts at Lowell",
    ]);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("Throws an error when response fails", async () => {
    fetchMock.enableMocks();

    fetchMock.mockReject(new Error("Womp womp"));

    let exCaught = false;

    try {
      await fetchUniversities("ERROR!");
    } catch (error) {
      exCaught = true;
      expect(error.message).toEqual("Womp womp");
    }

    expect(exCaught).toEqual(true);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });
});

describe("universityNameLengthOrderAscending", () => {
  it("Returns true when nameArr is empty", async () => {
    fetchMock.enableMocks();

    const json = [];
    fetchMock.mockResponseOnce(JSON.stringify(json));

    const result = await universityNameLengthOrderAscending("Empty");

    expect(result).toEqual(true);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("Returns true when in acsending order", async () => {
    fetchMock.enableMocks();

    const jsonGood = [
      { name: "Umass at Lowell" },
      { name: "Boston University" },
      { name: "Massachusetts Bay Community College" },
      { name: "University of Massachusetts at Amherst" },
      { name: "University of Massachusetts at Dartmouth" },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(jsonGood));
    const result = await universityNameLengthOrderAscending("Good result");

    expect(result).toEqual(true);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("Returns false when not in acsending order", async () => {
    fetchMock.enableMocks();

    const jsonBad = [
      { name: "University of Massachusetts at Dartmouth" },
      { name: "Massachusetts Bay Community College" },
      { name: "Massachusetts Institute of Technology" },
      { name: "University of Massachusetts at Amherst" },
      { name: "University of Massachusetts Boston" },
      { name: "University of Massachusetts at Lowell" },
    ];

    fetchMock.mockResponseOnce(JSON.stringify(jsonBad));
    const result = await universityNameLengthOrderAscending("Bad result");

    expect(result).toEqual(true);

    fetchMock.resetMocks();
    fetchMock.disableMocks();
  });

  it("Throws an error if probelm with getting the json", async () => {
    fetchMock.enableMocks();
    fetchMock.mockRejectOnce(new Error("Nah"));

    let exCaught = false;
    try {
      await universityNameLengthOrderAscending("Whoops");
    } catch (error) {
      exCaught = true;
      expect(error.message).toEqual("Nah");
    }

    expect(exCaught).toEqual(true);
  });
});
