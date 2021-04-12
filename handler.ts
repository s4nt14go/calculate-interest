import { Context, APIGatewayEvent, APIGatewayProxyHandler } from "aws-lambda";
import { calculateInterest, wrapper } from './lib';

export const calculate: APIGatewayProxyHandler = wrapper(async (event: APIGatewayEvent, _context: Context) => {
  console.log('event', event);


  const { queryStringParameters } = event;
  const l = Number(queryStringParameters.l)
  const f = Number(queryStringParameters.f)
  const n = Number(queryStringParameters.n)

  console.log('l', l);
  console.log('f', f);
  console.log('n', n);

  const res = calculateInterest(l,f,n)
  console.log(res);

  return res;
})
