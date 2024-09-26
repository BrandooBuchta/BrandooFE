import {nextui} from '@nextui-org/react'

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './layouts/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'text-primary-500', 'text-primary-900', 'text-primary-300',
    'text-danger-500', 'text-danger-900', 'text-danger-300',
    'text-warning-500', 'text-warning-900', 'text-warning-300',
    'text-success-500', 'text-success-900', 'text-success-300',
    'text-blue-500', 'text-blue-900', 'text-blue-300',
    'text-purple-500', 'text-purple-900', 'text-purple-300',
    'text-green-500', 'text-green-900', 'text-green-300',
    'text-red-500', 'text-red-900', 'text-red-300',
    'text-pink-500', 'text-pink-900', 'text-pink-300',
    'text-yellow-500', 'text-yellow-900', 'text-yellow-300',
    'text-cyan-500', 'text-cyan-900', 'text-cyan-300',
    'text-zinc-500', 'text-zinc-900', 'text-zinc-300',
    'bg-primary-500', 'bg-primary-900', 'bg-primary-300',
    'bg-danger-500', 'bg-danger-900', 'bg-danger-300',
    'bg-warning-500', 'bg-warning-900', 'bg-warning-300',
    'bg-success-500', 'bg-success-900', 'bg-success-300',
    'bg-blue-500', 'bg-blue-900', 'bg-blue-300',
    'bg-purple-500', 'bg-purple-900', 'bg-purple-300',
    'bg-green-500', 'bg-green-900', 'bg-green-300',
    'bg-red-500', 'bg-red-900', 'bg-red-300',
    'bg-pink-500', 'bg-pink-900', 'bg-pink-300',
    'bg-yellow-500', 'bg-yellow-900', 'bg-yellow-300',
    'bg-cyan-500', 'bg-cyan-900', 'bg-cyan-300',
    'bg-zinc-500', 'bg-zinc-900', 'bg-zinc-300',
    'text-lg', 'text-sm', 'text-md'
  ],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [nextui({
    addCommonColors: true,
  })],
}
