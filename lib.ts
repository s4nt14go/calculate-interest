/**
 * Returns the annual interest given loan, monthly fee and quantity of months
 * @param {number} l loan or cash price
 * @param {number} f monthly fee
 * @param {number} n quantity of months
 * @returns {number} Interest
 */
export function calculateInterest(l, f, n){

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
    annual: 12*curr_i,
    exact,
    iterations: j,
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

export function wrapper(lambda: any) {
  return async function (event: any, context: any) {
    let body, statusCode;

    try {
      body = await lambda(event, context);
      statusCode = 200;
    } catch (e) {
      console.log('error', e);
      body = { error: e.message || e.toString()};
      statusCode = 500;
    }

    return {
      statusCode,
      body: JSON.stringify(body),
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": true,
      },
    };
  };
}
