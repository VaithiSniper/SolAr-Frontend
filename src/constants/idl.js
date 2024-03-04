export const IDL = {
  "version": "0.1.0",
  "name": "solar",
  "instructions": [
    {
      "name": "setupCase",
      "accounts": [
        {
          "name": "case",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "admin",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "parties",
          "type": {
            "array": [
              "publicKey",
              2
            ]
          }
        }
      ]
    },
    {
      "name": "declareWinner",
      "accounts": [
        {
          "name": "case",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "party",
          "type": "publicKey"
        }
      ]
    },
    {
      "name": "setCaseState",
      "accounts": [
        {
          "name": "case",
          "isMut": true,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "caseState",
          "type": {
            "defined": "CaseState"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "Case",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "caseId",
            "type": "publicKey"
          },
          {
            "name": "parties",
            "type": {
              "array": [
                "publicKey",
                2
              ]
            }
          },
          {
            "name": "caseWinner",
            "type": {
              "option": {
                "defined": "Winner"
              }
            }
          },
          {
            "name": "caseState",
            "type": {
              "defined": "CaseState"
            }
          }
        ]
      }
    }
  ],
  "types": [
    {
      "name": "Winner",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Prosecutor"
          },
          {
            "name": "Defendant"
          }
        ]
      }
    },
    {
      "name": "CaseState",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "ToStart"
          },
          {
            "name": "WaitingForParticipants"
          },
          {
            "name": "Active"
          },
          {
            "name": "AwaitingRuling"
          },
          {
            "name": "Disposed"
          },
          {
            "name": "Completed"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "AlreadyStartedCase"
    },
    {
      "code": 6001,
      "name": "PubKeyNotFound"
    },
    {
      "code": 6002,
      "name": "NotAuthorized"
    },
    {
      "code": 6003,
      "name": "AlreadyReachedCaseState"
    },
    {
      "code": 6004,
      "name": "AlreadyDeclaredWinner"
    }
  ],
  "metadata": {
    "address": "D25GoHFNzhWrFciSxFxiTt6qEV93LYsv8vRZgqESQ9ni"
  }
}
