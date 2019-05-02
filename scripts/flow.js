/*
   {
       videoid:,
       choice1:,
       choice2:,
       isEnding:
   } 
   access those by array number
*/ 
var flow = []
//     {
//         videoid: 'anmdGj2v2WI',
//         choice1: 1,
//         choice1text: "1번 선택지",
//         choice2: 1,
//         choice2text: "2번 선택지",
//         isEnding: false
//     },
//     {   
//         videoid: 'ZCpoj4flXnM',
//         choice1: 2,
//         choice1text: "1번",
//         choice2: 2,
//         choice2text: "2번",
//         isEnding: false
//     },
//     {
//         videoid: 'mo-oirPG_oQ',
//         choice1: 3,
//         choice1text: "첫번째",
//         choice2: 3,
//         choice2text: "두번째",
//         isEnding: false
//     },
//     {
//         videoid: '6DN2xc7X_-U',
//         choice1: 4,
//         choice1text: "왼쪽 선택",
//         choice2: 4,
//         choice2text: "오른쪽 선택",
//         isEnding: false
//     },
//     {
//         videoid: '1zDd-3J1nTg',
//         choice1: 5,
//         choice1text: "선택",
//         choice2: 5,
//         choice2text: "다른 선택",
//         isEnding: true
//     }
// ];

flow['1'] = {
    videoid: 'anmdGj2v2WI',
    choice1: '2',
    choice1text: "1번 선택지",
    choice2: '2',
    choice2text: "2번 선택지",
    isChoice: true,
    isEnding: false
}
flow['2'] = {
    videoid: 'ZCpoj4flXnM',
    choice1: '3',
    choice1text: "1번",
    choice2: '3',
    choice2text: "2번",
    isChoice: true,
    isEnding: false
}
flow['3'] = {
    videoid: '1zDd-3J1nTg',
    choice1: '4',
    choice1text: "선택",
    choice2: '4',
    choice2text: "다른 선택",
    isChoice: false,
    isEnding: false
}
flow['4'] = {
    videoid: 'mo-oirPG_oQ',
    choice1: '5',
    choice1text: "첫번째",
    choice2: '5',
    choice2text: "두번째",
    isChoice: false,
    isEnding: true
}