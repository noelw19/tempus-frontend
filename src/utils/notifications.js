
import React from 'react';
import {NotificationContainer, NotificationManager} from 'react-notifications';

/**
 * type 1=info, 2=success, 3=warning, 4=error.
 */
let notify = (type, title, content, callback) => {
    // console.log("notify called")
    let timeTillhide = 3500;
    
      switch (type) {
        case 1:
          return NotificationManager.info(content, title, timeTillhide);
        case 2:
          NotificationManager.success(content, title, timeTillhide);
          break;
        case 3:
          NotificationManager.warning(content, title, timeTillhide);
          break;
        case 4:
          NotificationManager.error(content, title, timeTillhide, callback);
          break;
          default:
            return
      
    };
  };

  export default notify;