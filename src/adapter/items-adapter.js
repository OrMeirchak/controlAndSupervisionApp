export const msgAdapter = (msg) => {
  if(!msg.coordinates || !msg.coordinates.lat || !msg.coordinates.lon){
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
