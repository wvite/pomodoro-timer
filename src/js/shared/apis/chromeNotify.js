import MESSAGE from "./notificationTypes";

export default type => {
  chrome.notifications.create(null, MESSAGE[type], arg => arg);
};
