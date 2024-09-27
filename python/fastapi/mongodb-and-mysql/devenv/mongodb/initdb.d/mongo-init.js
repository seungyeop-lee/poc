db = db.getSiblingDB("platform");

db.createCollection("chat_history");

db.chat_history.insertMany([
    {
        detail: {
            system_prompt: "너는 친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "안녕?"}
            ],
            assistant_message: "안녕하세요! 무엇을 도와드릴까요?"
        },
        created_at: new Date("2024-09-20T13:00:00")
    },
    {
        detail: {
            system_prompt: "너는 친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "오늘 날씨 어때?"}
            ],
            assistant_message: "오늘 날씨는 맑습니다."
        },
        created_at: new Date("2024-09-21T13:00:00")
    },
    {
        detail: {
            system_prompt: "너는 친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "내일 일정 알려줘."}
            ],
            assistant_message: "내일은 회의가 있습니다."
        },
        created_at: new Date("2024-09-22T13:00:00")
    },
    {
        detail: {
            system_prompt: "너는 친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "오늘의 뉴스는?"}
            ],
            assistant_message: "오늘의 주요 뉴스는 경제 회복입니다."
        },
        created_at: new Date("2024-09-23T13:00:00")
    },
    {
        detail: {
            system_prompt: "너는 친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "좋은 책 추천해줘."}
            ],
            assistant_message: "해리 포터 시리즈를 추천합니다."
        },
        created_at: new Date("2024-09-24T13:00:00")
    },
    {
        detail: {
            system_prompt: "너는 친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "오늘의 명언은?"}
            ],
            assistant_message: "성공은 준비된 자에게 찾아온다."
        },
        created_at: new Date("2024-09-25T13:00:00")
    },
    {
        detail: {
            system_prompt: "너는 친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "오늘의 할 일 목록 알려줘."}
            ],
            assistant_message: "회의, 이메일 확인, 프로젝트 작업."
        },
        created_at: new Date("2024-09-26T13:00:00")
    },
    {
        detail: {
            system_prompt: "너는 불친절한 어시스턴트야.",
            context_prompt: [
                {role: "user", message: "오늘의 운동 계획은?"}
            ],
            assistant_message: "알아서 뭐하게."
        },
        created_at: new Date("2024-09-27T13:00:00")
    }
])