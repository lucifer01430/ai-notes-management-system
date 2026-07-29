<?php

namespace Database\Seeders;

use App\Models\Note;
use Illuminate\Database\Seeder;

class DeveloperNotesSeeder extends Seeder
{
    /**
     * Seed realistic software engineering notes for the AI notes workspace.
     */
    public function run(): void
    {
        Note::query()->delete();

        $now = now();

        $notes = collect($this->noteSpecifications())->map(function (array $note) use ($now): array {
            return [
                'title' => $note['title'],
                'content' => $this->content(
                    title: $note['title'],
                    topic: $note['topic'],
                    principle: $note['principle'],
                    practice: $note['practice'],
                    caution: $note['caution'],
                ),
                'summary' => null,
                'embedding' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ];
        })->all();

        Note::insert($notes);
    }

    /**
     * @return array<int, array<string, string>>
     */
    private function noteSpecifications(): array
    {
        return [
            [
                'title' => 'Laravel Request Lifecycle and Route Organization',
                'topic' => 'Laravel',
                'principle' => 'A Laravel application is easiest to maintain when route files stay small, controllers stay focused, and framework conventions are used instead of custom plumbing.',
                'practice' => 'Group related API routes by resource, keep validation inside Form Request classes, and let controllers coordinate models and services instead of doing every task inline. In larger applications, route names, middleware groups, and explicit controller methods make onboarding much easier.',
                'caution' => 'Avoid placing business logic directly in route closures. It becomes difficult to test, hard to reuse, and easy to break when authentication, authorization, or background jobs are introduced later.',
            ],
            [
                'title' => 'Modern PHP Practices for Maintainable Applications',
                'topic' => 'PHP',
                'principle' => 'Modern PHP works best when code is explicit, typed, and organized around small classes with clear responsibilities.',
                'practice' => 'Use strict method signatures, constructor injection, value objects where they improve clarity, and framework collections only when they make transformations easier to read. Prefer named methods over clever inline expressions when future debugging matters.',
                'caution' => 'Do not hide failures with broad catch blocks or silent null returns. Production PHP applications should make invalid states visible through validation, exceptions, logs, and predictable API responses.',
            ],
            [
                'title' => 'MySQL Schema Design for Notes and Search Data',
                'topic' => 'MySQL',
                'principle' => 'Good MySQL design starts with simple tables, correct data types, and indexes that match real access patterns.',
                'practice' => 'Store note content in long text fields, keep generated summaries nullable, and persist embeddings in a JSON column when the dataset is small enough for application-level comparison. Add indexes only after identifying frequent filters and joins.',
                'caution' => 'Do not normalize prematurely or store derived AI data without understanding refresh behavior. If content changes, summaries and embeddings may become stale unless the application regenerates them intentionally.',
            ],
            [
                'title' => 'Designing Predictable REST API Responses',
                'topic' => 'REST APIs',
                'principle' => 'A REST API becomes easier to consume when resources, status codes, and response bodies are consistent across endpoints.',
                'practice' => 'Use resource-oriented URLs, meaningful HTTP verbs, validation errors with 422 status codes, 404 responses for missing models, and JSON envelopes that include success, message, and data where appropriate.',
                'caution' => 'Avoid returning different shapes from similar endpoints. Frontend code becomes fragile when one success response returns an object, another returns a string, and another hides errors behind a 200 status.',
            ],
            [
                'title' => 'Authentication Strategy for API-First Products',
                'topic' => 'Authentication',
                'principle' => 'Authentication answers who the user is, and API-first products should make that identity available consistently to every protected endpoint.',
                'practice' => 'Choose session authentication for first-party browser apps or token authentication for external API clients. In Laravel, Sanctum is often a practical option because it supports SPA authentication and personal access tokens with minimal ceremony.',
                'caution' => 'Never treat authentication as a UI-only concern. Backend routes must enforce identity checks even when frontend navigation hides protected screens from unauthenticated users.',
            ],
            [
                'title' => 'Authorization Rules Beyond Logged-In Checks',
                'topic' => 'Authorization',
                'principle' => 'Authorization decides whether an authenticated user is allowed to perform a specific action on a specific resource.',
                'practice' => 'Use policies for model-level decisions such as viewing, updating, deleting, or sharing notes. Keep role checks readable and centralize permission logic so controllers do not become scattered with conditional access rules.',
                'caution' => 'Do not assume ownership from a route parameter or hidden form field. Always verify permissions against trusted database records on the server before mutating data.',
            ],
            [
                'title' => 'Middleware as an Application Boundary',
                'topic' => 'Middleware',
                'principle' => 'Middleware is best used for cross-cutting request concerns that should run before or after controller logic.',
                'practice' => 'Place authentication, rate limiting, CORS, request trimming, and tenant resolution in middleware when they apply consistently across routes. Keep middleware small and avoid mixing unrelated concerns in a single class.',
                'caution' => 'Do not use middleware as a dumping ground for business workflows. If the behavior depends heavily on a specific model or action, it probably belongs in a controller, service, policy, or event listener.',
            ],
            [
                'title' => 'Using Eloquent ORM Without Losing Query Clarity',
                'topic' => 'Eloquent ORM',
                'principle' => 'Eloquent is powerful when relationships and scopes describe the domain, but the generated SQL should still be easy to reason about.',
                'practice' => 'Define fillable fields, casts, relationships, and query scopes on models. Use eager loading to prevent N+1 queries and move repeated filters into named scopes so intent remains visible in controllers and services.',
                'caution' => 'Avoid deeply nested lazy loading in loops. It may look clean in PHP while producing dozens or hundreds of queries in production.',
            ],
            [
                'title' => 'Queue Design for Slow and Unreliable Work',
                'topic' => 'Queues',
                'principle' => 'Queues protect user-facing requests from slow work and unreliable external systems.',
                'practice' => 'Move email sending, report generation, AI embedding refreshes, imports, and notification fan-out into queued jobs. Design jobs to be idempotent, retryable, and safe to run more than once after a worker crash.',
                'caution' => 'Do not enqueue jobs without monitoring failures. A queue silently filling with failed jobs is a production incident, even if the web application appears healthy.',
            ],
            [
                'title' => 'Caching Strategies That Improve Performance Safely',
                'topic' => 'Caching',
                'principle' => 'Caching is most effective when the application knows what data is expensive, how long it can be stale, and how it will be invalidated.',
                'practice' => 'Cache read-heavy dashboard counts, external API responses, permissions, and expensive computed values with clear keys and reasonable TTLs. In Laravel, cache tags and remember patterns can keep common cases concise.',
                'caution' => 'Do not cache user-specific data with global keys. Incorrect cache boundaries can leak private information or show stale authorization decisions.',
            ],
            [
                'title' => 'Next.js App Router Patterns for Product Interfaces',
                'topic' => 'Next.js',
                'principle' => 'Next.js works well for product interfaces when routing, layouts, and client interactivity are separated intentionally.',
                'practice' => 'Use the App Router for nested pages, shared layouts, and route-level loading states. Keep browser-only behavior such as forms, theme toggles, and toast actions inside client components while preserving clean server-rendered structure where possible.',
                'caution' => 'Avoid marking every component as client-side by default. It increases bundle size and makes it harder to take advantage of framework rendering optimizations.',
            ],
            [
                'title' => 'React Component Design for Reusable Workflows',
                'topic' => 'React',
                'principle' => 'React components stay maintainable when presentation, state, and side effects are separated by responsibility.',
                'practice' => 'Extract reusable cards, buttons, forms, dialogs, and hooks when patterns repeat across pages. Keep props explicit, make loading and empty states first-class, and avoid duplicating API calls inside multiple components.',
                'caution' => 'Do not over-abstract early. A component should become reusable because two or more real screens need the same behavior, not because the code might be useful someday.',
            ],
            [
                'title' => 'TypeScript Contracts Between Frontend and API',
                'topic' => 'TypeScript',
                'principle' => 'TypeScript is most valuable when it documents real contracts between UI state, forms, and backend responses.',
                'practice' => 'Define interfaces for API envelopes, note resources, request payloads, and validation errors. Use schema validation for forms and keep unknown API errors narrowed before reading response fields.',
                'caution' => 'Do not use broad any types to silence errors. They remove the safety that TypeScript is supposed to provide and often hide integration bugs until runtime.',
            ],
            [
                'title' => 'Tailwind CSS for Consistent SaaS Interfaces',
                'topic' => 'Tailwind CSS',
                'principle' => 'Tailwind is productive when utility classes express a consistent design system rather than random one-off styling.',
                'practice' => 'Reuse spacing scales, typography patterns, border radii, focus states, and color tokens across buttons, cards, forms, and navigation. Use dark variants intentionally so both themes feel designed instead of merely inverted.',
                'caution' => 'Do not let class lists replace design judgment. If similar components drift visually, create a shared component or helper to keep the interface coherent.',
            ],
            [
                'title' => 'Git Workflow for Safe Collaboration',
                'topic' => 'Git',
                'principle' => 'A good Git workflow makes changes reviewable, reversible, and understandable months later.',
                'practice' => 'Commit focused units of work, write meaningful messages, keep generated files out of commits when appropriate, and review diffs before pushing. Branch names should describe the feature or fix clearly.',
                'caution' => 'Avoid mixing unrelated refactors with feature work. Large unfocused commits make regressions harder to isolate and reviews harder to trust.',
            ],
            [
                'title' => 'Docker for Repeatable Local Development',
                'topic' => 'Docker',
                'principle' => 'Docker reduces environment drift by making services, ports, and runtime dependencies explicit.',
                'practice' => 'Containerize PHP, Node, MySQL, queues, and cache services when a project has multiple contributors or complicated setup. Keep Dockerfiles lean and use compose files to document how services communicate locally.',
                'caution' => 'Do not treat Docker as a substitute for understanding the application. Developers should still know how logs, volumes, networks, and environment variables affect runtime behavior.',
            ],
            [
                'title' => 'CI/CD Checks That Protect Main Branch',
                'topic' => 'CI/CD',
                'principle' => 'CI/CD should catch predictable problems before code reaches production or a shared branch.',
                'practice' => 'Run backend tests, frontend linting, production builds, static analysis, and migration checks in pull requests. Keep pipelines fast enough that developers trust them and run the same commands locally when possible.',
                'caution' => 'Avoid pipelines that only deploy. Without tests and quality gates, automation can ship broken code faster than a manual process would.',
            ],
            [
                'title' => 'Design Patterns in Everyday Application Code',
                'topic' => 'Design Patterns',
                'principle' => 'Design patterns are useful when they clarify responsibilities, not when they add ceremony.',
                'practice' => 'Use service classes for external integrations, repositories only when they simplify persistence complexity, factories for object creation, and strategy objects when behavior must vary behind a common interface.',
                'caution' => 'Do not force patterns into simple CRUD code. Over-engineering can make a small feature harder to read than a direct, conventional implementation.',
            ],
            [
                'title' => 'System Design Tradeoffs for Notes Applications',
                'topic' => 'System Design',
                'principle' => 'Even simple notes applications involve tradeoffs around consistency, search, privacy, and background processing.',
                'practice' => 'Start with a relational database for canonical note data, then introduce search indexes, queues, object storage, and vector databases only when scale or product requirements justify them. Keep write paths reliable and reads optimized for common workflows.',
                'caution' => 'Do not prematurely design for massive scale while ignoring core correctness. Users care first that their notes are saved, searchable, private, and recoverable.',
            ],
            [
                'title' => 'API Security Essentials for AI-Enabled Applications',
                'topic' => 'API Security',
                'principle' => 'AI-enabled APIs need the same security fundamentals as any application, plus careful handling of prompts, provider keys, and generated output.',
                'practice' => 'Validate every request, authenticate protected routes, authorize resource access, rate limit expensive endpoints, store provider keys only in environment variables, and avoid returning raw exception details to clients.',
                'caution' => 'Do not trust AI output as automatically safe or correct. Treat generated summaries as derived content and keep original user data as the source of truth.',
            ],
        ];
    }

    private function content(string $title, string $topic, string $principle, string $practice, string $caution): string
    {
        return trim(<<<TEXT
{$title}

This engineering note focuses on {$topic} from the perspective of a production-minded software developer. {$principle} In real projects, the most reliable solutions are usually the ones that make intent obvious to the next person reading the code. A team should be able to open the relevant file, understand the flow, and identify where validation, persistence, errors, and integration boundaries are handled.

The practical approach is to design the feature around small responsibilities. {$practice} A senior engineer should also think about how the feature behaves after the happy path: what happens when input is invalid, when a dependency is unavailable, when data changes, or when a user repeats an action. Good implementation details are not only about making the first request succeed. They are about making the system predictable during maintenance, debugging, and future extension.

When documenting or reviewing this area, I look for naming that matches the domain, tests or manual checks that prove the main behavior, and code paths that fail in a controlled way. Logs should help diagnose issues without exposing secrets. Configuration should live in environment variables or framework config files. Data should be stored in a format that matches how it will be queried and updated. If the feature touches an external service, the integration should be isolated behind a service class so controllers and UI layers are not coupled to provider-specific details.

The main risk to avoid is accidental complexity. {$caution} A clean implementation leaves room for improvement without making the current version difficult to understand. Before merging, I would verify the feature from the API boundary, inspect database changes, run the relevant test command, and confirm that the user experience communicates loading, success, and failure states clearly.
TEXT);
    }
}
