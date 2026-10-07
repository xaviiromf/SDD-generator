import type { Configuration } from '../domain/models';
import { targetProfile } from './targetProfile';
export function targetTree(c: Configuration): string[] { return targetProfile(c).paths; }
