export const msgAdapter = (msg) => {
  if(!msg.coordinates){
    return msg;
  }
  return {
    ...msg,
    location: toLatLonArray(msg.coordinates),
  };
};

function toLatLonArray(obj) {
  return [obj.lat, obj.lon];
}
