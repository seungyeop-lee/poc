import http from "k6/http";
import { check } from "k6";
import {Counter} from "k6/metrics";

/** @type {import('k6/options').Options} */
export let options = {
    vus: 100,
    duration: "20s",
    rps: 1000,
}

let totalRequests = new Counter('total_requests');
let failRequests = new Counter('fail_requests');

export default function () {
    const res = http.get("http://reverse-proxy");
    const checkOutput = check(res, {
            'response code was 200': (res) => res.status === 200,
    });
    if (!checkOutput) {
        console.log("Failed check");
        console.log(res);
        failRequests.add(1);
    }
    totalRequests.add(1);
}
