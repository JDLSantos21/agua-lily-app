import {
  isPermissionGranted,
  requestPermission,
  sendNotification,
} from "@tauri-apps/plugin-notification";
export default function useNotification() {
  async function checkPermission() {
    const permission = await isPermissionGranted();
    console.log("Notification permission status:", permission);
    return permission;
  }

  async function requestNotificationPermission() {
    const permission = await requestPermission();
    console.log("Notification permission requested:", permission);
    return permission;
  }

  function notify(title: string, body: string) {
    sendNotification({
      title,
      body,
      icon: "/favicon.ico",
      attachments: [
        {
          id: "attachment-id",
          url: "/logo.png",
        },
      ],
    });
  }

  return { notify, checkPermission, requestNotificationPermission };
}
