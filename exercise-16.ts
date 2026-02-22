/**
 * EXERCISE 16: Error Handling Patterns
 *
 * SCENARIO: A blog post publishing pipeline.
 * The code "works" most of the time, but the error handling is a disaster.
 * Bugs are silently swallowed, callers have no idea what failed or why,
 * and the whole pipeline is one bad input away from returning garbage.
 *
 * CODE SMELLS TO FIND AND FIX:
 * 1. Throwing strings instead of Error objects  →  throw 'oops' vs throw new Error('oops')
 * 2. Silent error swallowing  →  catch(e) { console.log(e) }  or  catch(e) {}
 * 3. Inconsistent failure signals  →  null / -1 / false / undefined / void all mean "it failed"
 * 4. Validation returns boolean  →  caller knows it failed but not WHY
 * 5. Mutating input objects as a side effect  →  function modifies data passed to it
 * 6. Pipeline returns void  →  caller has zero idea if the operation succeeded
 *
 * GOALS FOR THE REFACTORED VERSION:
 * 1. Introduce a Result<T, E> type — the single consistent way to signal success or failure
 * 2. Use proper `throw new Error(...)` only for truly unexpected/programmer errors
 * 3. Never silently swallow errors — always propagate or report them
 * 4. Validation should return WHY it failed, not just false
 * 5. No mutation — return new objects instead of modifying inputs
 * 6. Pipeline should return Result<PublishedPost, string> so the caller can react
 *
 * TIPS:
 * - Define Result<T, E> as a discriminated union first
 * - Add ok() and fail() helper functions to create Results cleanly
 * - Fix each function one at a time, from the bottom up
 * - The pipeline ties everything together last
 *
 * Run with: npx tsx exercise-16.ts
 */

// ============================================================================
// THE MESSY CODE — Refactor everything below this line
// ============================================================================

// Simulated "database"
const POST_DB: Record<number, any> = {
    1: { id: 1, title: 'Hello World', content: 'My very first post ever written.', authorId: 42, status: 'draft' },
    2: { id: 2, title: '', content: 'No title on this one.', authorId: 42, status: 'draft' },
    3: { id: 3, title: 'Short', content: 'Too short.', authorId: 42, status: 'draft' },
    4: { id: 4, title: 'Good Post', content: 'This post is complete and ready.', authorId: 99, status: 'draft' },
    5: { id: 5, title: 'Already Live', content: 'This post is already published.', authorId: 42, status: 'published' },
};

const AUTHOR_DB: Record<number, any> = {
    42: { id: 42, name: 'Jane Doe', email: 'jane@example.com' },
};

// SMELL 1: throws a string, not an Error object
// SMELL 3: returns null for "not found" but throws for "invalid" — two different signals for failure
function loadPost(id: number) {
    if (id <= 0) throw 'Invalid post ID'; // ← should be: throw new Error(...)
    return POST_DB[id] || null;           // ← null means "not found" — inconsistent with throw above
}

// SMELL 4: returns boolean — caller sees false but has no idea what rule failed
function validatePost(post: any): boolean {
    if (!post.title || post.title.trim() === '') return false;
    if (!post.content || post.content.length < 20) return false;
    if (!post.authorId) return false;
    return true;
}

// SMELL 2: catches the error and logs it, then returns undefined implicitly
// Caller receives undefined and doesn't know something went wrong
function enrichWithAuthor(post: any) {
    try {
        const author = AUTHOR_DB[post.authorId];
        if (!author) throw 'Author not found'; // ← string throw again
        return { ...post, author };
    } catch (e) {
        console.log('enrichWithAuthor error:', e); // ← logged but swallowed
        // returns undefined — caller will likely crash or pass undefined downstream
    }
}

// SMELL 3: returns -1 on error (magic number), a completely different type from the success case
// SMELL 5: mutates the post object directly instead of returning a new one
function publishPost(post: any): number {
    if (post.status === 'published') return -1; // ← -1 means "already published" but caller has to know that
    post.status = 'published';                  // ← mutating input! side effect
    post.publishedAt = new Date().toISOString(); // ← mutating input!
    return post.id;
}

// SMELL 2: completely swallows the error — subscribers might not be notified and nobody knows
function notifySubscribers(post: any): void {
    try {
        const subscribers = AUTHOR_DB[post.authorId]
            ? ['subscriber1@mail.com', 'subscriber2@mail.com']
            : [];
        if (subscribers.length === 0) throw 'No subscribers found';
        // simulate sending
        console.log(`  [notify] Emailed ${subscribers.length} subscribers about "${post.title}"`);
    } catch (e) {
        // ← silent! if this fails, nobody knows
    }
}

// SMELL 6: returns void — caller cannot tell success from failure
// All errors are printed to console instead of returned to caller
function publishPipeline(postId: number): void {
    const post = loadPost(postId);
    if (!post) {
        console.log(`Pipeline failed: post ${postId} not found`);
        return; // ← void — caller gets nothing
    }

    if (!validatePost(post)) {
        console.log('Pipeline failed: post is invalid'); // ← which rule failed?
        return;
    }

    const enriched = enrichWithAuthor(post); // ← could be undefined, not checked!

    const publishedId = publishPost(enriched);
    if (publishedId === -1) {
        console.log('Pipeline failed: post is already published');
        return;
    }

    notifySubscribers(enriched);
    console.log(`Pipeline succeeded: post ${publishedId} published`);
}

// ============================================================================
// MESSY VERSION — Tests
// ============================================================================

console.log('=== MESSY VERSION ===\n');

// Each test wrapped in try/catch so all smells are visible even when one crashes
const messyTests = [
    { label: 'Test 1: valid post', id: 1 },
    { label: 'Test 2: post with no title', id: 2 },
    { label: 'Test 3: content too short', id: 3 },
    { label: 'Test 4: unknown author (silent crash ahead!)', id: 4 },
    { label: 'Test 5: already published', id: 5 },
    { label: 'Test 6: post not found', id: 999 },
    { label: 'Test 7: invalid id (string throw, no stack)', id: -1 },
];

for (const { label, id } of messyTests) {
    console.log(`-- ${label} --`);
    try {
        publishPipeline(id);
    } catch (e) {
        // Notice: e might be a string (no .stack, no .message), or a TypeError from an undefined crash
        console.log('Uncaught exception:', e);
    }
    console.log();
}


// ============================================================================
// YOUR REFACTORED CODE HERE
// ============================================================================

/**
 * SUGGESTED APPROACH:
 *
 * Step 1 — Define the Result type:
 *   type Result<T, E = string> =
 *     | { ok: true;  value: T }
 *     | { ok: false; error: E };
 *
 *   And two tiny helpers:
 *   function ok<T>(value: T): Result<T, never>
 *   function fail<E>(error: E): Result<never, E>
 *
 * Step 2 — Fix each function:
 *   - loadPost       → Result<Post, string>    (not found = fail, not throw)
 *   - validatePost   → Result<Post, string>    (return WHY it failed)
 *   - enrichWithAuthor → Result<EnrichedPost, string>  (no more silent catch)
 *   - publishPost    → Result<PublishedPost, string>   (no mutation, no -1)
 *   - notifySubscribers → Result<number, string>  (return how many notified, or why not)
 *
 * Step 3 — Fix the pipeline:
 *   publishPostPipeline(postId: number): Result<PublishedPost, string>
 *   Each step checks ok/error and early-returns on failure.
 *   No console.log inside functions — just return Results. Let the caller decide what to print.
 *
 * Step 4 — Update the test calls:
 *   const result = publishPostPipeline(1);
 *   if (result.ok) console.log('Success:', result.value);
 *   else           console.log('Failed:', result.error);
 */

// Write your refactored code here:

type Result<T, E = string> =
    | { ok: true; value: T }
    | { ok: false; error: E };

function ok<T>(value: T): Result<T, never> {
    return { ok: true, value };
}

function fail<E>(error: E): Result<never, E> {
    return { ok: false, error };
}

interface Post {
    id: number;
    title: string;
    content: string;
    authorId: number;
    status: 'draft' | 'published';
}

interface Author {
    id: number;
    name: string;
    email: string;
}

interface EnrichedPost extends Post {
    author: Author;
}

interface PublishedPost extends EnrichedPost {
    publishedAt: Date;
}

function loadPostRefactored(postId: number): Result<Post, string> {
    const post = POST_DB[postId];
    if (!post) return fail(`Post ${postId} not found`);
    return ok(post);
}

function validatePostRefactored(post: Post): Result<Post, string> {
    if (!post.title || post.title.trim() === '') {
        return fail('Post has no title');
    }
    if (post.content.length < 20) {
        return fail('Post content is too short (min 20 characters)');
    }
    return ok(post);
}

function enrichWithAuthorRefactored(post: Post): Result<EnrichedPost, string> {
    const author = AUTHOR_DB[post.authorId];
    if (!author) {
        return fail(`Author ${post.authorId} not found`);
    }
    return ok({ ...post, author });
}

function publishPostRefactored(enrichedPost: EnrichedPost): Result<PublishedPost, string> {
    if (enrichedPost.status === 'published') {
        return fail('Post is already published');
    }
    const publishedPost: PublishedPost = {
        ...enrichedPost,
        status: 'published',
        publishedAt: new Date(),
    };
    return ok(publishedPost);
}

function getSubscribers(authorId: number): string[] {
    // Simulate fetching subscribers from a database
    return AUTHOR_DB[authorId] ? ['subscriber1@example.com', 'subscriber2@example.com'] : [];
}

function sendNotification(subscriber: string, post: EnrichedPost): void {
    // Simulate sending a notification (e.g., email)
    console.log(`  [notify] Sent notification to ${subscriber} about "${post.title}"`);
}

function notifySubscribersRefactored(enriched: EnrichedPost): Result<number, string> {
    const subscribers = getSubscribers(enriched.author.id);
    if (subscribers.length === 0) return fail(`No subscribers found for author ${enriched.author.id}`);
    for (const sub of subscribers) {
        sendNotification(sub, enriched);
    }
    return ok(subscribers.length);
}

function publishPostPipelineRefactored(postId: number): Result<PublishedPost, string> {
    const postResult = loadPostRefactored(postId);
    if (!postResult.ok) return postResult;

    const validatedResult = validatePostRefactored(postResult.value);
    if (!validatedResult.ok) return validatedResult;

    const enrichedResult = enrichWithAuthorRefactored(validatedResult.value);
    if (!enrichedResult.ok) return enrichedResult;

    const publishedResult = publishPostRefactored(enrichedResult.value);
    if (!publishedResult.ok) return publishedResult;

    const notifiedCount = notifySubscribersRefactored(enrichedResult.value);
    if (!notifiedCount.ok) {
        // Log the notification failure but don't fail the whole pipeline
        console.log('Notification failed:', notifiedCount.error);
    }

    return publishedResult;
}

// ============================================================================
// REFACTORED VERSION — Tests (uncomment when ready)
// ============================================================================

console.log('\n\n=== REFACTORED VERSION ===\n');

const testIds = [1, 2, 3, 4, 5, 999, -1];
for (const id of testIds) {
    console.log(`-- Test postId: ${id} --`);
    const result = publishPostPipelineRefactored(id);
    if (result.ok) console.log('  Success:', result.value.title, `@ ${result.value.publishedAt}`);
    else console.log('  Failed: ', result.error);
    console.log();
}

export { };
