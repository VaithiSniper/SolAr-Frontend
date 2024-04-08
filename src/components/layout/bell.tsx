import "notificationapi-js-client-sdk/dist/styles.css";
import { memo, useEffect } from "react";
import type { MarkAsReadModes, PopupPosition } from "notificationapi-js-client-sdk/lib/interfaces";
import { useProgram } from "src/hooks/programHooks";
// import styles from '../../styles.module.css'

const NotificationAPIComponent = memo(() => {

  const clientId = process.env.NEXT_PUBLIC_NOTIFICATION_API_CLIENT_ID as string;
  const { publicKey } = useProgram();
  const userId = publicKey?.toBase58() as string;

  useEffect(() => {
    const loadNotificationAPI = async () => {
      const NotificationAPI = (await import("notificationapi-js-client-sdk")).default;
      console.log("In notificationapi with -> ", clientId, userId)
      const notificationapi = new NotificationAPI({
        clientId,
        userId,
      });
      notificationapi.showInApp({
        root: "CONTAINER_DIV_ID",
        popupPosition: "bottomLeft" as PopupPosition,
        markAsReadMode: "MANUAL_AND_CLICK" as MarkAsReadModes,
      });
    };

    // Call the async function
    loadNotificationAPI();
  }, [clientId, userId]);

  return <div id="CONTAINER_DIV_ID"></div>;
});

NotificationAPIComponent.displayName = 'NotificationAPIComponent';

export default NotificationAPIComponent;
