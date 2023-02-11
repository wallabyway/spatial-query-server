# spatial-query-server
Spatial Query Service for Forge Viewer.  Get minimal DBIDs for a floor/room/section-box 

## Demo:

- Forge Viewer Demo:  https://spatial-query-server.cyclic.app/

- API endpoint: https://spatial-query-server.cyclic.app/api?  ^parameters go here^

### URL parameter inputs:

- minPolyCount
- minBoxSize
- sectionBox : of the form [3040047,919000,9.1],[3140147,919900,15]
- urn : urn of SVF2 asset
- token : access token

## Example:

https://spatial-query-server.herokuapp.com/api?minPolyCount=0&minBoxSize=1.5&sectionBox=[3040047,919000,9.1],[3140147,919900,15]&urn=dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6YXV0b2NhZC13ZXMvSG9ydG9uJTIwUGxhemElMjAxMC4yNy4yMi5ud2Q&token=eyJhbGciOiJSUzI1NiIsImtpZCI6IlU3c0dGRldUTzlBekNhSzBqZURRM2dQZXBURVdWN2VhIn0.eyJzY29wZSI6WyJkYXRhOnJlYWQiXSwiY2xpZW50X2lkIjoiTmk5STVpSFM1QVpHTXB0b2NsbDFWWGdldXM4V2R1VUMiLCJhdWQiOiJodHRwczovL2F1dG9kZXNrLmNvbS9hdWQvYWp3dGV4cDYwIiwianRpIjoiQXpFR3FzQk9lUkdSSjE2TUhQUlhDWU5JZnpZTU8xN1pxSE43SnJCMEtyYmhucXg1Sk1KVFY1RGVCRUszNmVONSIsImV4cCI6MTY3NTgzNDA4MH0.KJyvkoUI6D7OvPSpMyofF3dypTZ7jEhcA74IB1cwmYExeJyXOgSeKxAonVAaf8-rXCK3iq5eIazzq6kPmX1JqYyALZr7srcOt0to3FDJ_83wplTbfL2WbEIXZdCoR3_4WGSnrKDc1lC62Vr6JrDUGIuraPePRLT_hB35WeFh0YUDLisaOZAXExwpklW8pDgKn7_D9h2mn78RsBnKw1P4inimbeuKDjpNjihNgVNJdwuMwGjet1ufmwyOurEJY4_YQvB5HddnJjS_aAaEHRQdy0enqauTktEDnQEmut6mt69uq9vYBh4WUp0Qfj8QkJutlEh89FvTkovZ2hNlqtE6nw
