'use client';

export function ChatLauncher({ className = 'button button-gold', children = 'Chat with us' }: { className?: string; children?: React.ReactNode }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new CustomEvent('matka-chat-open'))}>
      {children}
    </button>
  );
}
