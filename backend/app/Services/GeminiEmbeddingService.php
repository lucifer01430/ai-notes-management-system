<?php

namespace App\Services;

use App\Models\Note;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class GeminiEmbeddingService
{
    /**
     * @return array<int, float>
     */
    public function embedQuery(string $query): array
    {
        return $this->embed("task: search result | query: {$query}");
    }

    /**
     * @return array<int, float>
     */
    public function embedNote(Note $note): array
    {
        return $this->embed("title: {$note->title} | text: {$note->content}");
    }

    /**
     * @param  array<int, float>  $first
     * @param  array<int, float>  $second
     */
    public function cosineSimilarity(array $first, array $second): float
    {
        $dotProduct = 0.0;
        $firstMagnitude = 0.0;
        $secondMagnitude = 0.0;
        $length = min(count($first), count($second));

        for ($index = 0; $index < $length; $index++) {
            $firstValue = (float) $first[$index];
            $secondValue = (float) $second[$index];

            $dotProduct += $firstValue * $secondValue;
            $firstMagnitude += $firstValue ** 2;
            $secondMagnitude += $secondValue ** 2;
        }

        if ($firstMagnitude === 0.0 || $secondMagnitude === 0.0) {
            return 0.0;
        }

        return $dotProduct / (sqrt($firstMagnitude) * sqrt($secondMagnitude));
    }

    /**
     * @return array<int, float>
     */
    private function embed(string $text): array
    {
        $apiKey = config('services.gemini.key');

        if (blank($apiKey)) {
            throw new RuntimeException('Gemini API key is not configured.');
        }

        $model = config('services.gemini.model');
        $endpoint = sprintf(
            'https://generativelanguage.googleapis.com/v1beta/models/%s:embedContent',
            rawurlencode($model)
        );

        try {
            $response = Http::withHeaders([
                'x-goog-api-key' => $apiKey,
            ])
                ->acceptJson()
                ->timeout(30)
                ->post($endpoint, [
                    'model' => "models/{$model}",
                    'content' => [
                        'parts' => [
                            [
                                'text' => $text,
                            ],
                        ],
                    ],
                ]);
        } catch (ConnectionException $exception) {
            throw new RuntimeException('Unable to connect to Gemini embeddings.', previous: $exception);
        }

        if ($response->failed()) {
            $message = $response->json('error.message') ?? 'Unable to generate an embedding.';

            throw new RuntimeException("Gemini embeddings request failed with status {$response->status()}: {$message}");
        }

        $values = $response->json('embedding.values');

        if (! is_array($values) || $values === []) {
            throw new RuntimeException('Gemini returned an invalid embedding response.');
        }

        return array_map(static fn (mixed $value): float => (float) $value, array_values($values));
    }
}
