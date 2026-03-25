# ClimaSphere Weather

## Current State
The Motoko backend has all four methods (setApiKey, getWeather, getForecast, getAirQuality) but the generated frontend bindings (backend.did.js, backend.did.d.ts, backend.ts) are empty — IDL.Service({}) with no methods exposed. The frontend's `useActor` hook returns a `Backend` class instance that has no methods, causing the `weatherActor.getWeather is not a function` error.

## Requested Changes (Diff)

### Add
- Nothing new

### Modify
- Regenerate backend bindings so all four Motoko methods are properly exposed in the frontend

### Remove
- Nothing

## Implementation Plan
1. Re-run generate_motoko_code with the same functional requirements to regenerate correct wasm + bindings
2. No frontend changes needed — the hook and components are already correct
