'use client';

import "notificationapi-js-client-sdk/dist/styles.css";
import { memo, useEffect } from "react";

import type { PopupPosition } from "notificationapi-js-client-sdk/lib/interfaces";
const NotificationAPIComponent = memo((props) => {
  useEffect(() => {
    const loadNotificationAPI = async () => {
      const NotificationAPI = (await import("notificationapi-js-client-sdk")).default;
      const notificationapi = new NotificationAPI({
        clientId: '3tq4pv4bg6olvq0vfh94cpb2lt',
        userId: 'vaithi.genghiskhan@gmail.com',
      });
      notificationapi.showInApp({
          root: "CONTAINER_DIV_ID",
          popupPosition: "BottomLeft" as PopupPosition
      });
    };

    // Call the async function
    loadNotificationAPI();
  }, []);

  return <div id="CONTAINER_DIV_ID"></div>;
});

NotificationAPIComponent.displayName = 'NotificationAPIComponent';

export default NotificationAPIComponent;