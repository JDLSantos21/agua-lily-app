// components/SocketProvider.tsx
"use client";
import { useSocket } from "@/hooks/useSocket";
import { DisconnectModal } from "@/components/DisconnectModal";

export function SocketProvider() {
  const { showDisconnectPopup, isReconnecting, reconnect } = useSocket();

  return (
    <DisconnectModal
      isOpen={showDisconnectPopup}
      isReconnecting={isReconnecting}
      onReconnect={reconnect}
    />
  );
}
