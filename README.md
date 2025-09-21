

## Seed (dati di esempio)
Esegui **una sola volta** (sostituisci dominio e chiave):
```
curl -X POST https://TUO_DOMINIO/api/seed -H "x-seed-secret: LA_TUA_SEED_SECRET"
```

## Cron promemoria scadenze (Vercel)
Questo repo include `vercel.json` con una schedulazione giornaliera:
- Percorso: `/api/cron/expiry-check`
- Orario: `08:00 UTC` (≈ 09:00 CET / 10:00 CEST)
