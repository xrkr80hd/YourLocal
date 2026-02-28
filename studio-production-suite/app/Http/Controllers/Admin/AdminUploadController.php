<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\SupabaseStorageService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Throwable;

class AdminUploadController extends Controller
{
    public function __construct(
        private readonly SupabaseStorageService $supabaseStorage,
    ) {}

    public function __invoke(Request $request): JsonResponse
    {
        $request->validate([
            'kind' => ['required', 'in:image,audio,video,file'],
            'file' => ['required', 'file', 'max:51200'],
        ]);

        $kind = $request->string('kind')->value();
        $file = $request->file('file');

        $allowed = match ($kind) {
            'image' => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'jfif', 'heic', 'heif'],
            'audio' => ['mp3', 'wav', 'ogg', 'm4a', 'flac'],
            'video' => ['mp4', 'webm', 'mov'],
            default => ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'jfif', 'heic', 'heif', 'mp3', 'wav', 'ogg', 'm4a', 'flac', 'mp4', 'webm', 'mov', 'pdf', 'txt'],
        };

        $extension = strtolower($file->getClientOriginalExtension() ?: '');
        if ($extension === '') {
            $extension = strtolower((string) ($file->guessExtension() ?: ''));
        }
        if (!in_array($extension, $allowed, true)) {
            return response()->json([
                'message' => 'File type not allowed for this field. Allowed: ' . implode(', ', $allowed),
            ], 422);
        }

        if ($this->supabaseStorage->isEnabled()) {
            if (! $this->supabaseStorage->isConfigured()) {
                return response()->json([
                    'message' => $this->supabaseStorage->configurationError(),
                ], 500);
            }

            try {
                return response()->json([
                    'url' => $this->supabaseStorage->upload($file, $kind, $extension),
                ]);
            } catch (Throwable $e) {
                report($e);

                return response()->json([
                    'message' => 'Upload failed while sending file to Supabase Storage.',
                ], 500);
            }
        }

        $directory = match ($kind) {
            'image' => 'uploads/images',
            'audio' => 'uploads/audio',
            'video' => 'uploads/video',
            default => 'uploads/files',
        };

        $targetDirectory = public_path($directory);
        if (!is_dir($targetDirectory)) {
            mkdir($targetDirectory, 0755, true);
        }

        $filename = Str::uuid()->toString() . '.' . $extension;
        try {
            $file->move($targetDirectory, $filename);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'message' => 'Upload failed while writing file. Please retry or use a different file format.',
            ], 500);
        }

        $publicPath = '/' . $directory . '/' . $filename;

        return response()->json([
            'url' => $publicPath,
        ]);
    }
}
