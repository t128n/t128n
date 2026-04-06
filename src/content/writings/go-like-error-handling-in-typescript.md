---
title: Go-like Error Handling in TypeScript
description: How treating errors as values will lead to cleaner code.
---

[Errors as Values in TypeScript](https://errore.org/)

Contrary to the popular opinion, I'm actually a big fan of Go's error handling. It makes error handling explicit while keeping the happy path clean.

## Examples

In the examples below, `example-2.ts` just reads much cleaner to me.

```ts
<!-- example-1.ts -->
try {
    const data = await fetchData();
    return console.log("Data:", data);
} catch (error) {
    if (error instanceof NetworkFailedError) return console.error("Network error:", error);
    if (error instanceof ValidationFailedError) return console.error("Validation error:", error);
    throw error;
}
```

<br/>

```ts
<!-- example-2.ts -->
const data = await fetchData();
if (data instanceof NetworkFailedError) return console.error("Network error:", data);
if (data instanceof ValidationFailedError) return console.error("Validation error:", data);
return console.log("Data:", data);
```

It prevents deeper nesting and makes the return-types consistent. If we e.g. did not yet cover `RateLimitError`, `data` will be of type `Data | RateLimitError`.

## Zero-Dependency Philosophy

The **[Zero-Dependency Philosophy](https://errore.org/#:~:text=Zero%2DDependency%20Philosophy)** advocated by
[Tommy D. Rossi](https://github.com/remorses) makes it even more appealing. Adding more dependencies to a project can cause unwanted side-effects, when one of these dependencies e.g. has security issues[^1]<sup>,</sup>[^2].

The core idea behind errore can be broken down to just 6 LOC

```ts {3,4,5,6,7,8}
<!-- errore.ts -->
// You can write this without installing errore at all
class NotFoundError extends Error {
  readonly _tag = 'NotFoundError'
  constructor(public id: string) {
    super(`User ${id} not found`)
  }
}

async function getUser(id: string): Promise<User | NotFoundError> {
  const user = await db.find(id)
  if (!user) return new NotFoundError(id)
  return user
}

const user = await getUser('123')
if (user instanceof Error) return user
console.log(user.name)
```

[^1]: [Post Mortem: axios npm supply chain compromise #10636](https://github.com/axios/axios/issues/10636)

[^2]: [Security Update: Suspected Supply Chain Incident](https://docs.litellm.ai/blog/security-update-march-2026)
