# Bundled fonts

These normal-style variable fonts are bundled locally so development and production builds do not require a Google Fonts connection.

Sources: the official [google/fonts repository](https://github.com/google/fonts), downloaded 2026-10-30:

- `ofl/ibmplexsans/IBMPlexSans[wdth,wght].ttf`
- `ofl/inter/Inter[opsz,wght].ttf`
- `ofl/jetbrainsmono/JetBrainsMono[wght].ttf`

The files were converted to WOFF2 with fontTools and subset to Latin, common punctuation, currency symbols, and arrows. Variable weights and OpenType layout features were retained. Non-Latin text uses the existing CSS fallback fonts. The corresponding SIL Open Font License files are included beside each font.
