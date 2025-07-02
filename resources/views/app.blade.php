<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
      (function() {
        const appearance = '{{ $appearance ?? "system" }}';

        if (appearance === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

          if (prefersDark) {
            document.documentElement.classList.add('dark');
          }
        }
      })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
      html {
        background-color: oklch(0.9755 0.0045 258.3245);
      }

      html.dark {
        background-color: oklch(0.2204 0.0198 275.8439);
      }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/favicon.png" sizes="any">
    <link rel="apple-touch-icon" href="/favicon.png">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx', 'resources/js/echo.js', "resources/js/pages/{$page['component']}.tsx"])
    @inertiaHead
  </head>
  <body class="font-sans antialiased">
    @inertia
  </body>
</html>
