<template>
  <header class="bg-surface shadow-sm sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      <a href="/" class="flex items-center gap-2">
        <span class="w-9 h-9 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2 L19 9 L12 22 L5 9 Z"/>
            <circle cx="12" cy="9" r="2.5" fill="white" stroke="none"/>
          </svg>
        </span>
        <span class="font-display text-xl font-semibold text-neutral-900">Wayrest</span>
      </a>

      <nav class="flex items-center gap-2">
        <button type="button" class="text-neutral-800 hover:text-text px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-100 transition-colors">
          List your place
        </button>
        <button type="button" class="bg-neutral-white text-neutral-800 border border-neutral-300 px-4 py-2 rounded-md text-sm font-medium hover:bg-neutral-50 hover:border-neutral-700 transition-colors">
          Sign in
        </button>
      </nav>

    </div>
  </header>
</template>
