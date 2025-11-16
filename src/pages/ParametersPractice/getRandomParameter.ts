import { parameters } from "./parameters";
import type { Parameter } from "./types";

export function getRandomParameter(): Parameter {
    const index = Math.floor(Math.random() * parameters.length);
    return parameters[index];
}