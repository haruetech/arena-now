# ARENA NOW weather + mobile update

- KMA current observation now first calls the official time-observation endpoint without `tm` (official default = current time), then retries recent completed hours, then a six-hour range endpoint.
- Legacy KMA text is decoded as EUC-KR and parsed with or without the help header.
- Weather UI no longer opens `/api/weather` when clicked; failure stays as a calm inline status instead of exposing a raw API error page.
- Mobile hero has its own weather card and 3x2 shortcut grid.
- Mobile bottom navigation is fixed to Home / 공연정보 / 지도 / AI 추천 / MY, with a compact extra-services drawer.
- Desktop one-view dashboard remains unchanged.
