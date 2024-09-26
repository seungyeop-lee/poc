db = db.getSiblingDB("platform");

db.createUser({
    user: "fastapi",
    pwd: "fastapi",
    roles: [
        {
            role: 'readWrite',
            db: 'platform'
        },
    ],
});

db.createCollection("chat_history");
