export type Solar = {
  "version": "0.1.0",
  "name": "solar",
  "constants": [
    {
      "name": "USER_TAG",
      "type": "bytes",
      "value": "[85, 83, 69, 82, 95, 83, 84, 65, 84, 69]"
    },
    {
      "name": "CASE_TAG",
      "type": "bytes",  
      "value": "[67, 65, 83, 69, 95, 83, 84, 65, 84, 69]"
    },
    {
      "name": "ADMIN_PUB_KEY",
      "type": "bytes",
      "value": "[54, 103, 72, 78, 100, 84, 89, 54, 74, 104, 66, 53, 120, 53, 83, 110, 65, 114, 103, 54, 88, 107, 111, 84, 78, 72, 55, 111, 110, 101, 55, 97, 85, 66, 121, 87, 121, 89, 87, 77, 50, 65, 74, 106]"
    }
  ],
  "instructions": [
    {
      "name": "verifyUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setupUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
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
          "name": "username",
          "type": "string"
        },
        {
          "name": "userType",
          "type": {
            "defined": "UserType"
          }
        }
      ]
    },
    {
      "name": "setupUserProfile",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
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
          "name": "email",
          "type": "string"
        },
        {
          "name": "firstName",
          "type": "string"
        },
        {
          "name": "lastName",
          "type": "string"
        },
        {
          "name": "phone",
          "type": "string"
        }
      ]
    },
    {
      "name": "setupCase",
      "accounts": [
        {
          "name": "case",
          "isMut": true,
          "isSigner": false
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
      "name": "case",
      "type": {
        "kind": "struct",
        "fields": [
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
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "email",
            "type": "string"
          },
          {
            "name": "firstName",
            "type": "string"
          },
          {
            "name": "lastName",
            "type": "string"
          },
          {
            "name": "phone",
            "type": "string"
          },
          {
            "name": "typeOfUser",
            "type": {
              "defined": "UserType"
            }
          },
          {
            "name": "verified",
            "type": "bool"
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
    },
    {
      "name": "UserType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Admin"
          },
          {
            "name": "Judge"
          },
          {
            "name": "Lawyer"
          },
          {
            "name": "Client"
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
  ]
};

export const IDL: Solar = {
  "version": "0.1.0",
  "name": "solar",
  "constants": [
    {
      "name": "USER_TAG",
      "type": "bytes",
      "value": "[85, 83, 69, 82, 95, 83, 84, 65, 84, 69]"
    },
    {
      "name": "CASE_TAG",
      "type": "bytes",
      "value": "[67, 65, 83, 69, 95, 83, 84, 65, 84, 69]"
    },
    {
      "name": "ADMIN_PUB_KEY",
      "type": "bytes",
      "value": "[54, 103, 72, 78, 100, 84, 89, 54, 74, 104, 66, 53, 120, 53, 83, 110, 65, 114, 103, 54, 88, 107, 111, 84, 78, 72, 55, 111, 110, 101, 55, 97, 85, 66, 121, 87, 121, 89, 87, 77, 50, 65, 74, 106]"
    }
  ],
  "instructions": [
    {
      "name": "verifyUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "admin",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": []
    },
    {
      "name": "setupUser",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
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
          "name": "username",
          "type": "string"
        },
        {
          "name": "userType",
          "type": {
            "defined": "UserType"
          }
        }
      ]
    },
    {
      "name": "setupUserProfile",
      "accounts": [
        {
          "name": "user",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "authority",
          "isMut": false,
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
          "name": "email",
          "type": "string"
        },
        {
          "name": "firstName",
          "type": "string"
        },
        {
          "name": "lastName",
          "type": "string"
        },
        {
          "name": "phone",
          "type": "string"
        }
      ]
    },
    {
      "name": "setupCase",
      "accounts": [
        {
          "name": "case",
          "isMut": true,
          "isSigner": false
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
      "name": "case",
      "type": {
        "kind": "struct",
        "fields": [
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
    },
    {
      "name": "userProfile",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "publicKey"
          },
          {
            "name": "username",
            "type": "string"
          },
          {
            "name": "email",
            "type": "string"
          },
          {
            "name": "firstName",
            "type": "string"
          },
          {
            "name": "lastName",
            "type": "string"
          },
          {
            "name": "phone",
            "type": "string"
          },
          {
            "name": "typeOfUser",
            "type": {
              "defined": "UserType"
            }
          },
          {
            "name": "verified",
            "type": "bool"
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
    },
    {
      "name": "UserType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "Admin"
          },
          {
            "name": "Judge"
          },
          {
            "name": "Lawyer"
          },
          {
            "name": "Client"
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
  ]
};
