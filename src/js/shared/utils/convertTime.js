export default time => {
  let minutes = 0,
    seconds = 0;
  if (time) {
    minutes = Math.floor(time / 60000);
    seconds = Math.floor(time / 1000) % 60;
  }
  return { minutes, seconds };
};
