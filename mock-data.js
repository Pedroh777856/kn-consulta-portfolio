/* Dados criados do zero, sem origem operacional. */
const KNMock = [
  {
    "id": "DEMO-001",
    "events": [
      {
        "at": "2026-01-15T08:00:00Z",
        "status": "Recebido",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T08:30:00Z",
        "status": "Em triagem",
        "actor": "Operador B",
        "group": "Equipe Beta"
      },
      {
        "at": "2026-01-15T09:00:00Z",
        "status": "Para despacho",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T10:00:00Z",
        "status": "Despachado",
        "actor": "Operador C",
        "group": "Equipe Alfa"
      }
    ],
    "labels": [
      {
        "at": "2026-01-15T09:00:00Z",
        "actor": "Operador A"
      }
    ],
    "inventory": {
      "location": "Área fictícia A",
      "at": "2026-01-15T08:10:00Z"
    }
  },
  {
    "id": "DEMO-002",
    "events": [
      {
        "at": "2026-01-15T08:00:00Z",
        "status": "Recebido",
        "actor": "Operador B",
        "group": "Equipe Beta"
      },
      {
        "at": "2026-01-15T08:45:00Z",
        "status": "Em análise",
        "actor": "Operador C",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T12:00:00Z",
        "status": "Em análise",
        "actor": "Operador C",
        "group": "Equipe Alfa"
      },
      {
        "at": "2026-01-15T13:00:00Z",
        "status": "Para despacho",
        "actor": "Operador B",
        "group": "Equipe Beta"
      },
      {
        "at": "2026-01-15T14:00:00Z",
        "status": "Devolvido",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      }
    ],
    "labels": [
      {
        "at": "2026-01-15T12:55:00Z",
        "actor": "Operador C"
      }
    ],
    "inventory": {
      "location": "Área fictícia B",
      "at": "2026-01-15T08:15:00Z"
    }
  },
  {
    "id": "DEMO-003",
    "events": [
      {
        "at": "2026-01-15T08:00:00Z",
        "status": "Recebido",
        "actor": null,
        "group": null
      },
      {
        "at": "2026-01-15T08:20:00Z",
        "status": "Em triagem",
        "actor": "Operador A",
        "group": "Equipe Alfa"
      }
    ],
    "labels": [],
    "inventory": null
  }
];
if(typeof module!=="undefined") module.exports=KNMock;
