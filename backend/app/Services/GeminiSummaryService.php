<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiSummaryService
{
    public function generate(string $content): string
    {
        $apiKey = config('services.gemini.key');

        if (blank($apiKey)) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $model = config('services.gemini.model');
        $endpoint = sprintf(
            'https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent',
            rawurlencode($model)
        );

        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => $apiKey,
            ])
                ->acceptJson()
                ->timeout(30)
                ->post($endpoint, [
                    'systemInstruction' => [
                        'parts' => [
                            [
                                'text' => 'Summarize the note content for a notes app. Return only a concise plain-text summary in 2-4 sentences.',
                            ],
                        ],
                    ],
                    'contents' => [
                        [
                            'role' => 'user',
                            'parts' => [
                                [
                                    'text' => $content,
                                ],
                            ],
                        ],
                    ],
                ]);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Unable to connect to Gemini.', previous: $exception);
        }

        if ($response->failed()) {
            $message = $response->json('error.message') ?? 'Unable to generate a summary.';

            throw new RuntimeException("Gemini API request failed with status {$response->status()}: {$message}");
        }

        $payload = $response->json();

        if (! is_array($payload)) {
            throw new RuntimeException('Gemini returned an invalid response.');
        }

        $summary = $this->extractSummary($payload);

        if (blank($summary)) {
            throw new RuntimeException('Gemini returned an empty summary.');
        }

        return trim($summary);
    }

    /**
     * @param  array<string, mixed>  $payload
     */
    private function extractSummary(array $payload): ?string
    {
        foreach ($payload['candidates'] ?? [] as $candidate) {
            if (! is_array($candidate)) {
                continue;
            }

            foreach ($candidate['content']['parts'] ?? [] as $part) {
                if (isset($part['text']) && is_string($part['text'])) {
                    return $part['text'];
                }
            }
        }

        return null;
    }
}
