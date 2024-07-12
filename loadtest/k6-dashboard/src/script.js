import http from "k6/http";
import {Counter} from "k6/metrics";

/** @type {import('k6/options').Options} */
export let options = {
    vus: 5,
    duration: "10s",
    rps: 10,
}

let myCounter = new Counter('my_counter');

export default function () {
    http.get("http://localhost:5678");
    myCounter.add(1);
}
