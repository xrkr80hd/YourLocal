<?php

namespace App\Services;

use Illuminate\Http\Client\Response;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use RuntimeException;

class SupabaseStorageService
{
    public function isEnabled(): bool
    {
        return (bool) config('supabase.storage.enabled', false);
    }

    public function isConfigured(): bool
    {
        return $this->baseUrl() !== '' && $this->bucket() !== '' && $this->apiKey() !== '';
    }

    public function configurationError(): string
    {
        return 'Supabase Storage is enabled but missing SUPABASE_URL, SUPABASE_STORAGE_BUCKET, or SUPABASE_SERVICE_ROLE_KEY.';
    }

    public function upload(UploadedFile $file, string $kind, string $extension): string
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException($this->configurationError());
        }

        $contents = @file_get_contents($file->getRealPath());
        if ($contents === false) {
            throw new RuntimeException('Unable to read file contents before upload.');
        }

        $objectPath = $this->buildObjectPath($kind, $extension);
        $uploadUrl = $this->uploadUrl($objectPath);
        $mimeType = (string) ($file->getMimeType() ?: 'application/octet-stream');

        $response = Http::timeout((int) config('supabase.http_timeout_seconds', 5))
            ->withHeaders([
                'apikey' => $this->apiKey(),
                'Authorization' => 'Bearer '.$this->apiKey(),
                'x-upsert' => 'false',
            ])
            ->withBody($contents, $mimeType)
            ->post($uploadUrl);

        if (! $response->successful()) {
            throw new RuntimeException($this->failedUploadMessage($response));
        }

        return $this->publicUrl($objectPath);
    }

    private function buildObjectPath(string $kind, string $extension): string
    {
        $prefix = (string) config('supabase.storage.path_prefix', 'uploads');
        $kindDirectory = match ($kind) {
            'image' => 'images',
            'audio' => 'audio',
            'video' => 'video',
            default => 'files',
        };

        $segments = array_values(array_filter([
            trim($prefix, '/'),
            $kindDirectory,
            date('Y'),
            date('m'),
            Str::uuid()->toString().'.'.$extension,
        ], static fn (string $segment): bool => $segment !== ''));

        return implode('/', $segments);
    }

    private function uploadUrl(string $objectPath): string
    {
        return sprintf(
            '%s/storage/v1/object/%s/%s',
            $this->baseUrl(),
            rawurlencode($this->bucket()),
            $this->encodeObjectPath($objectPath),
        );
    }

    private function publicUrl(string $objectPath): string
    {
        return sprintf(
            '%s/storage/v1/object/public/%s/%s',
            $this->baseUrl(),
            rawurlencode($this->bucket()),
            $this->encodeObjectPath($objectPath),
        );
    }

    private function encodeObjectPath(string $objectPath): string
    {
        $segments = explode('/', trim($objectPath, '/'));

        return implode('/', array_map(
            static fn (string $segment): string => rawurlencode($segment),
            $segments
        ));
    }

    private function failedUploadMessage(Response $response): string
    {
        $payload = $response->json();
        if (is_array($payload)) {
            $message = (string) ($payload['message'] ?? $payload['error'] ?? '');
            if ($message !== '') {
                return 'Supabase upload failed: '.$message;
            }
        }

        return 'Supabase upload failed with HTTP '.$response->status().'.';
    }

    private function baseUrl(): string
    {
        return rtrim((string) config('supabase.url', ''), '/');
    }

    private function bucket(): string
    {
        return trim((string) config('supabase.storage.bucket', ''));
    }

    private function apiKey(): string
    {
        $serviceRoleKey = trim((string) config('supabase.service_role_key', ''));
        if ($serviceRoleKey !== '') {
            return $serviceRoleKey;
        }

        return trim((string) config('supabase.anon_key', ''));
    }
}
