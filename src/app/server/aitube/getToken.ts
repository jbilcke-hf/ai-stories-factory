import { createSecretKey } from "crypto"
import { SignJWT } from "jose"

// https://jmswrnr.com/blog/protecting-next-js-api-routes-query-parameters

export async function getToken(data: Record<string, any> = {}): Promise<string> {
  const secretKey = createSecretKey(`${process.env.AI_TUBE_API_SECRET_JWT_KEY || ""}`, 'utf-8');

  const jwtToken = await new SignJWT(data)
   .setProtectedHeader({
    alg: 'HS256'
   }) // algorithm
   .setIssuedAt()
   .setIssuer(`${process.env.AI_TUBE_API_SECRET_JWT_ISSUER || ""}`) // issuer
   .setAudience(`${process.env.AI_TUBE_API_SECRET_JWT_AUDIENCE || ""}`) // audience
   .setExpirationTime("1 day") // token expiration time - to prevent hackers from re-using our URLs more than a day
   .sign(secretKey); // secretKey generated from previous step

  return jwtToken
}
