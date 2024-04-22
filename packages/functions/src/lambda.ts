import { ApiHandler } from "sst/node/api";

export const handler = ApiHandler(async (_evt) => {

  let body;
  const { queryStringParameters } = _evt;

  if (!queryStringParameters)
    return {
      statusCode: 400,
      body: 'No query string parameters',
    };

  const l = Number(queryStringParameters.l)
  const f = Number(queryStringParameters.f)
  const n = Number(queryStringParameters.n)

  body = calculateInterest(l,f,n);

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
});

/**
 * Returns the annual interest given loan, monthly fee and quantity of months
 * @param {number} l loan or cash price
 * @param {number} f monthly fee
 * @param {number} n quantity of months
 * @returns {number} Interest
 */
function calculateInterest(l: number, f: number, n: number){

  let curr_i = 0.01; // start trying with 1% interest per month
  let i_is_gt, i_is_lt, curr_l;

  const max_iter = 100;
  let j = 0, exact = false;
  for (; j < max_iter; j++) {
    console.log(`Trying with interest ${curr_i}`);
    curr_l = f/curr_i*(1-Math.pow(1+curr_i, -n));

    if (curr_l === l) {
      exact = true;
      break;
    } else if (curr_l > l) {
      i_is_gt = curr_i;
      if (i_is_lt) {
        curr_i += (i_is_lt-curr_i)/2;
      } else {
        curr_i *= 2;
      }
    } else {
      i_is_lt = curr_i;
      if (i_is_gt) {
        curr_i -= (curr_i-i_is_gt)/2;
      } else {
        curr_i /= 2;
      }
    }
  }

  const res = {
    monthly: curr_i,
    nominal_anual: 12*curr_i,
    effective_annual: Math.pow(1+curr_i, 12)-1,
    exact,
    iterations: j,
    total_payments: f*n,
    total_interest: f*n-l,
    last_month_effective: Math.pow(1+curr_i, n) - 1,
    input: {
      l,
      f,
      n,
    }
  };
  console.log(res);
  return res;
}

// Useful formulas:
// l = f/i*(1-Math.pow(1+i,-n))
// f = l*i/(1-Math.pow(1+i,-n))
