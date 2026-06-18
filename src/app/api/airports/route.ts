import { NextRequest, NextResponse } from "next/server";
import airportsData from "@/data/airports.json";

type RawAirport = {
  id: string;
  iata_code: string;
  name: string | null;
  municipality: string | null;
  iso_country: string | null;
};

type ProcessedAirport = {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
};

// Pre-process and cache airports with iata_code
let cachedAirports: ProcessedAirport[] | null = null;

function getProcessedAirports(): ProcessedAirport[] {
  if (cachedAirports) {
    return cachedAirports;
  }

  cachedAirports = (airportsData as RawAirport[])
    .filter((airport) => airport.iata_code && airport.name && airport.municipality && airport.iso_country)
    .map((airport) => ({
      id: airport.id,
      code: airport.iata_code,
      name: airport.name!,
      city: airport.municipality!,
      country: airport.iso_country!,
    }));

  return cachedAirports;
}

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get("q")?.trim().toLowerCase();

  if (!search || search.length < 2) {
    return NextResponse.json([]);
  }

  const airports = getProcessedAirports();

  const results = airports
    .filter((airport) => {
      return (
        airport.code.toLowerCase().includes(search) ||
        airport.name.toLowerCase().includes(search) ||
        airport.city.toLowerCase().includes(search)
      );
    })
    .slice(0, 20);

  return NextResponse.json(results);
}