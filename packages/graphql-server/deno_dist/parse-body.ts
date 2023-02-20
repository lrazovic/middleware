import { HonoRequest } from "https://deno.land/x/hono@v3.0.0/request.ts";

export async function parseBody(req: HonoRequest): Promise<Record<string, unknown>> {
  const contentType = req.headers.get('content-type')

  switch (contentType) {
    case 'application/graphql':
      return { query: await req.text() }
    case 'application/json':
      try {
        return await req.json()
      } catch (e) {
        if (e instanceof Error) {
          console.error(`${e.stack || e.message}`)
        }
        throw Error(`POST body sent invalid JSON: ${e}`)
      }
    case 'application/x-www-form-urlencoded':
      return parseFormURL(req)
  }

  return {}
}

const parseFormURL = async (req: HonoRequest) => {
  const text = await req.text()
  const searchParams = new URLSearchParams(text)
  const res: { [params: string]: string } = {}
  searchParams.forEach((v, k) => (res[k] = v))
  return res
}
