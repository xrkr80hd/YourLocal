<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ $title ?? 'Admin | xrkr80hd Studio' }}</title>
    <link rel="stylesheet" href="{{ asset('app.css') }}">
</head>
<body>
    <header class="nav">
        <div class="container nav-inner">
            <a class="brand" href="{{ route('admin.dashboard') }}">Admin Suite</a>
            <nav class="nav-links">
                <a class="{{ request()->routeIs('admin.dashboard') ? 'active' : '' }}" href="{{ route('admin.dashboard') }}">Dashboard</a>
                <a class="{{ request()->routeIs('admin.bio.*') ? 'active' : '' }}" href="{{ route('admin.bio.edit') }}">Bio</a>
                <a class="{{ request()->routeIs('admin.bands.*') ? 'active' : '' }}" href="{{ route('admin.bands.index') }}">Bands</a>
                <a class="{{ request()->routeIs('admin.podcasts.*') ? 'active' : '' }}" href="{{ route('admin.podcasts.index') }}">Podcast</a>
                <a class="{{ request()->routeIs('admin.tracks.*') ? 'active' : '' }}" href="{{ route('admin.tracks.index') }}">Music</a>
                <a class="{{ request()->routeIs('admin.projects.*') ? 'active' : '' }}" href="{{ route('admin.projects.index') }}">Projects</a>
                <a class="{{ request()->routeIs('admin.posts.*') ? 'active' : '' }}" href="{{ route('admin.posts.index') }}">Blog</a>
                <a class="{{ request()->routeIs('admin.media.*') ? 'active' : '' }}" href="{{ route('admin.media.index') }}">Media</a>
                <a href="{{ route('home') }}">View Site</a>
                <form method="POST" action="{{ route('admin.logout') }}">
                    @csrf
                    <button class="button" type="submit">Logout</button>
                </form>
            </nav>
        </div>
    </header>
    <main>
        <div class="container">
            @if(session('status'))
                <div class="alert">{{ session('status') }}</div>
            @endif
            @if($errors->any())
                <div class="alert" style="border-color: rgba(255, 120, 120, 0.45); background: rgba(255, 120, 120, 0.14); color: #ffd1d1;">
                    <strong>Save failed.</strong>
                    <ul style="margin:0.45rem 0 0; padding-left:1rem;">
                        @foreach($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif
            @yield('content')
        </div>
    </main>
    <script>
    (() => {
        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        const uploadEndpoint = '{{ route('admin.upload') }}';
        if (!csrf || !uploadEndpoint) return;

        const resolveKind = (input) => {
            const kind = input.dataset.uploadKind;
            if (kind && kind !== 'media-from-type') return kind;

            if (kind === 'media-from-type') {
                const form = input.closest('form');
                const typeSelect = form?.querySelector('select[name="type"]');
                const type = typeSelect?.value;
                if (type === 'photo') return 'image';
                if (type === 'video') return 'video';
                if (type === 'music') return 'audio';
            }

            return 'file';
        };

        const uploadFile = async (file, input, statusNode) => {
            if (!file) return;
            statusNode.textContent = 'Uploading...';
            const formData = new FormData();
            const kind = resolveKind(input);
            formData.append('kind', kind);
            formData.append('file', file);

            try {
                const response = await fetch(uploadEndpoint, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrf,
                        'Accept': 'application/json',
                    },
                    body: formData,
                });

                const contentType = response.headers.get('content-type') || '';
                const payload = contentType.includes('application/json')
                    ? await response.json()
                    : { message: await response.text() };

                if (!response.ok) {
                    const message = payload.message || `Upload failed (HTTP ${response.status}).`;
                    throw new Error(message);
                }

                input.value = payload.url || '';
                input.dispatchEvent(new Event('input', { bubbles: true }));
                input.dispatchEvent(new Event('change', { bubbles: true }));
                statusNode.textContent = 'Uploaded';
            } catch (error) {
                statusNode.textContent = error.message || 'Upload error.';
            }
        };

        document.querySelectorAll('input[data-upload-kind]').forEach((input) => {
            const widget = document.createElement('div');
            widget.className = 'upload-widget';

            const dropzone = document.createElement('button');
            dropzone.type = 'button';
            dropzone.className = 'upload-dropzone';
            dropzone.textContent = 'Drag and drop file here or click to upload';

            const status = document.createElement('small');
            status.className = 'upload-status';
            status.textContent = '';

            const filePicker = document.createElement('input');
            filePicker.type = 'file';
            filePicker.className = 'upload-file-input';
            const kind = resolveKind(input);
            if (kind === 'image') filePicker.accept = '.jpg,.jpeg,.png,.webp,.gif,.avif,.jfif,.heic,.heif';
            if (kind === 'audio') filePicker.accept = '.mp3,.wav,.ogg,.m4a,.flac';
            if (kind === 'video') filePicker.accept = '.mp4,.webm,.mov';
            filePicker.hidden = true;

            dropzone.addEventListener('click', () => filePicker.click());
            filePicker.addEventListener('change', () => uploadFile(filePicker.files?.[0], input, status));

            dropzone.addEventListener('dragover', (event) => {
                event.preventDefault();
                dropzone.classList.add('is-dragover');
            });

            dropzone.addEventListener('dragleave', () => {
                dropzone.classList.remove('is-dragover');
            });

            dropzone.addEventListener('drop', (event) => {
                event.preventDefault();
                dropzone.classList.remove('is-dragover');
                uploadFile(event.dataTransfer?.files?.[0], input, status);
            });

            widget.appendChild(dropzone);
            widget.appendChild(status);
            widget.appendChild(filePicker);
            input.insertAdjacentElement('afterend', widget);
        });
    })();
    </script>
</body>
</html>
