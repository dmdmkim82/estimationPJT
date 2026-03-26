# SOFC Estimate Studio

Next.js rebuild of the original single-file SOFC estimation prototype.

## Run

```bash
npm install
npm run dev
```

## Structure

- `app/` - app router pages and global styles
- `components/` - header and estimate studio UI
- `lib/estimator.ts` - workbook-calibrated estimation logic

## Notes

- The new baseline uses the reviewed PJT workbook reference:
  - `9.9MW`
  - `2025` pricing year
  - `115.66 x100M KRW` reference total
- The legacy `index.html` remains as a reference artifact and is no longer the intended app entry point.
