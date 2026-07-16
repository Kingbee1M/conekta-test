export enum AmenitiesEnum {
  GYM = "gym",
  PARKING = "parking",
  POOL = "pool",
  ELEVATOR = "elevator",
  GENERATOR = "generator",
}

// Map the backend keys to human-readable UI text
export const AMENITIES_OPTIONS = [
  { value: AmenitiesEnum.GYM, label: "Gym" },
  { value: AmenitiesEnum.PARKING, label: "Parking" },
  { value: AmenitiesEnum.POOL, label: "Pool" },
  { value: AmenitiesEnum.ELEVATOR, label: "Elevator" },
  { value: AmenitiesEnum.GENERATOR, label: "Generator" },
];