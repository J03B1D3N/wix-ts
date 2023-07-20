const {CONCAT, IF, OR, AND, NOT, EQ, GT, DIVIDE, SUM, MULTIPLY, isNotBoolean, isNotString, isNotNumber, returnArguments, spreadsheetProcessor} = require('../index.js')



describe('handles every kind of case I can think of', () => {

    it('returns correctly solved spreadsheets in the A1 notation', async () => {
    
    const blueprint = [
            {
              "id": "sheet-0",
              "data": []
            },
            {
              "id": "sheet-1",
              "data": [
                [
                  2,
                  4,
                  8,
                  16
                ]
              ]
            }
    ]
   

    
     expect(spreadsheetProcessor(blueprint).results).toEqual(blueprint)

     
    
     const request1 = [
        {
          "id": "sheet-0",
          "data": [
            [
                1,
                2,
                3,
                "=C1"
            ],
            [
                "=GT(A1, D1)",
                "=A2",
                "=A1",
                "=C2"
            ],
            [
                "=B3",
                "=C3",
                "=D3",
                "=E3",
                "=F3",
                "=G3",
                "=H3",
                "Last"
              ],
              [
                "=CONCAT(F3, ' and ', D3, ' and ', A3)"
              ]
          ]
        }
    ]
    
    const answer1 = [
        {
          "id": "sheet-0",
          "data": [
            [
                1,
                2,
                3,
                3
            ],
            [
                false,
                false,
                1,
                1
            ],
            [
                "Last",
                "Last",
                "Last",
                "Last",
                "Last",
                "Last",
                "Last",
                "Last"
              ],
              [
                "Last and Last and Last"
              ]
          ]
        }
    ]
    
     expect(spreadsheetProcessor(request1).results).toEqual(answer1)
    
     const request2 = [
        {
          "id": "sheet-0",
          "data": [
            [
                1,
                2,
                3,
                "=C1"
            ],
            [
                "=GT(A1, D1)",
                "=GREATER('lol', 5)",
                "=A1",
                "=C2"
            ],
          ]
        }
    ]
    
    const answer2 = [
        {
          "id": "sheet-0",
          "data": [
            [
              1,
              2,
              3,
              3
            ],
            [
              false,
              "ReferenceError: GREATER is not defined",
              1,
              1
            ]
          ]
        }
      ]
    
     expect(spreadsheetProcessor(request2).results).toEqual(answer2)
    
     const request3 = [
        {
          "id": "sheet-0",
          "data": [
            [
              "=A0",
              2,
              3,
              3
            ],
            [
              false,
              "=CONCAT(A1, A2)",
              1,
              1
            ]
          ]
        }
      ]
    
      const answer3 = [
        {
          "id": "sheet-0",
          "data": [
            [
            "ReferenceError: A0 is not defined",
              2,
              3,
              3
            ],
            [
              false,
              "#ERROR: type does not match",
              1,
              1
            ]
          ]
        }
      ]
    
     expect(spreadsheetProcessor(request3).results).toEqual(answer3)
    
     const request4 = [
        {
          "id": "sheet-0",
          "data": [
            [
              
            ],
            [
              
            ],
            [
    
            ],
            [
    
            ],
            [
    
            ]
          ]
        }
      ]
      const answer4 = [
        {
          "id": "sheet-0",
          "data": [
            [
              
            ],
            [
              
            ],
            [
    
            ],
            [
    
            ],
            [
    
            ]
          ]
        }
      ]
    
     expect(spreadsheetProcessor(request4).results).toEqual(answer4)
    
     const request5 = [
        {
          "id": "sheet-0",
          "data": [
            [
              "=A2"
            ],
            [
              "=A3"
            ],
            [
              "=A4"
            ],
            [
              "=A5"
            ],
            [
              "=A6"
            ],
            [
              "=A7"
            ],
            [
              "Last"
            ]
          ]
        }
      ]
      const answer5 = [
        {
          "id": "sheet-0",
          "data": [
            [
              "Last"
            ],
            [
              "Last"
            ],
            [
              "Last"
            ],
            [
              "Last"
            ],
            [
              "Last"
            ],
            [
              "Last"
            ],
            [
              "Last"
            ]
          ]
        }
      ]
    
     expect(spreadsheetProcessor(request5).results).toEqual(answer5)
    
    })
    
    })