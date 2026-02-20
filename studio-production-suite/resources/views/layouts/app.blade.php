<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $title ?? 'xrkr80hd Studio' }}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{{ asset('app.css') }}">
</head>
<body class="{{ request()->routeIs('home') ? 'page-home' : 'page-standard' }}">
    <header class="nav">
        <div class="container nav-inner">
            <a class="brand" href="{{ route('home') }}">xrkr80hd.studio</a>
            <button class="nav-toggle" type="button" aria-label="Toggle navigation" aria-expanded="false" aria-controls="site-nav">
                <span></span>
                <span></span>
                <span></span>
            </button>
            <nav class="nav-links" id="site-nav">
                <a class="nav-cool {{ request()->routeIs('home') ? 'active' : '' }}" href="{{ route('home') }}">Home</a>
                <a class="{{ request()->routeIs('hub.*') || request()->routeIs('music.*') || request()->routeIs('projects.*') || request()->routeIs('blog.*') || request()->routeIs('media.*') ? 'active' : '' }}" href="{{ route('hub.index') }}">
                    <span class="split-label"><span class="split-cool">XRKR</span><span class="split-80">80</span><span class="split-cool">HD</span><span class="split-space"> </span><span class="split-white">Hub</span></span>
                </a>
                <a class="{{ request()->routeIs('bands.archive') ? 'active' : '' }}" href="{{ route('bands.archive') }}">
                    <span class="split-label"><span class="split-cool">YourLocal</span><span class="split-space"> </span><span class="split-white">Legends</span></span>
                </a>
                <a class="{{ request()->routeIs('bands.scene') ? 'active' : '' }}" href="{{ route('bands.scene') }}">
                    <span class="split-label"><span class="split-cool">YourLocal</span><span class="split-space"> </span><span class="split-white">Scene</span></span>
                </a>
                <a class="{{ request()->routeIs('podcast.*') ? 'active' : '' }}" href="{{ route('podcast.index') }}">
                    <span class="split-label"><span class="split-cool">YourLocal</span><span class="split-space"> </span><span class="split-white">Podcast</span></span>
                </a>
                <a class="nav-cool {{ request()->routeIs('contact.*') ? 'active' : '' }}" href="{{ route('contact.index') }}">Contact</a>
            </nav>
        </div>
    </header>
    <main>
        <div class="container">
            @yield('content')
        </div>
    </main>
    <script>
    (() => {
        const toggle = document.querySelector('.nav-toggle');
        const nav = document.getElementById('site-nav');
        if (!toggle || !nav) return;

        toggle.addEventListener('click', () => {
            const open = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    })();

    (() => {
        const backgrounds = [
            '{{ asset('assets/bg/background_1.jpg') }}',
            '{{ asset('assets/bg/background_2.jpg') }}',
            '{{ asset('assets/bg/background_3.jpg') }}',
        ];
        if (!backgrounds.length) return;

        const key = 'yourlocal_bg_last_index';
        const previous = Number.parseInt(window.sessionStorage.getItem(key) ?? '', 10);
        let next = Math.floor(Math.random() * backgrounds.length);

        if (backgrounds.length > 1 && Number.isInteger(previous) && previous === next) {
            next = (next + 1) % backgrounds.length;
        }

        document.body.style.setProperty('--page-bg-image', `url("${backgrounds[next]}")`);
        window.sessionStorage.setItem(key, String(next));
    })();
    </script>
</body>
</html>
