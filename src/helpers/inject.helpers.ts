import { inject, type InjectionKey } from 'vue'

/**
 * Safely injects a dependency from the current component's injection scope.
 * @param key - The key of the dependency to inject.
 * @param fallback - An optional fallback value to use if the dependency is
 * not found.
 * @returns The resolved dependency or throws an error if not found and
 * no fallback is provided.
 */

export function safeInject<T>(key: InjectionKey<T>, fallback?: T) {
  const resolved = inject(key, fallback)

  if (!resolved) {
    throw new Error(`Could not resolve ${key}`)
  }

  return resolved
}
