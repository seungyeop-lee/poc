import http from "k6/http";
import { randomString } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

/** @type {import('k6/options').Options} */
export const options = {
    vus: 100,
    duration: '1h',
}

export default function () {
    let groupSuffix = randomString(10);
    let res = http.post(
        'http://localhost:8080/group',
        JSON.stringify({
            name: 'group-' + groupSuffix,
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );

    const groupId = res.json().id;

    let userSuffix = randomString(10);
    http.post(
        'http://localhost:8080/user',
        JSON.stringify({
            name: 'user-' + userSuffix,
            email: 'user-' + userSuffix + '@example.com',
            groupId: groupId,
        }),
        {
            headers: {
                'Content-Type': 'application/json'
            }
        }
    );
};
