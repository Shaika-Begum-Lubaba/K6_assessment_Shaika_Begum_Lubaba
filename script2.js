import http from 'k6/http';
import {sleep, check} from 'k6';
import {htmlReport} from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import {textSummary} from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

export const options = {
    scenarios: {
      constant_vus: {
        executor: 'constant-vus',
        vus: 30,      
        duration: '2m',
      },
    },
  thresholds: {

        http_req_duration: ['p(95)<5000'],
        http_req_failed: ['rate<0.05'],
        http_reqs: ['rate>25'],
    },

};


export default function () {
    const baseUrl = "https://bs23-test.ferdia.app";
    const endPoint = "/api/crm/query-form/";
    const token="AIzaSyA5tbpLQV5SlJv7z7A2Hdrl471L1o8y17AcQ3jOgK"; 
    const payload = JSON.stringify({
        
    travel_from: "Oslo, Norway",
    travel_to: "Oslo Airport (OSL), Edvard Munchs veg, Gardermoen, Norway",
    type: "Single",
    availability: "false",
    travel_datetime: "2023-08-25 16:41:00",
    pax: "20",
    query_source: "cp",
    org_id: 553,
    customer_message: "test message",
    poc_first_name: "M",
    poc_last_name: "H",
    poc_email: "abv@mailinator.com",
    poc_mobile_no: "+8801742173673",
    cp_first_name: "First name",
    cp_last_name: "Last name",
    cp_mobile_no: "+8801712345679",
    cp_email: "a@mailinator.com"

      });
      const params = {
        headers:{
  
            'Authorization': `Token ${token}`,
            "Content-Type": "application/json",
            domain: "bs23-test"
        }
    }
    const res = http.post(`${baseUrl}${endPoint}`,payload,params);

    check(res, {'is status 200': (r) => r.status === 200});

    sleep(1);
}

export function handleSummary(data) {
    return {
        "script2Report.html": htmlReport(data),
        stdout: textSummary(data, {indent: " ", enableColors: true}),
    };
}