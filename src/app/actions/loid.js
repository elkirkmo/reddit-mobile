export const SET_LOID = 'SET_LOID';

export const setLOID = ({ loid, loidCookie, loidCreated, loidCreatedCookie }) => ({
  type: SET_LOID,
  loid,
  loidCookie,
  loidCreated,
  loidCreatedCookie,
});

export const SET_EDGE_BUCKET = 'SET_EDGE_BUCKET';

export const setEdgeBucket = ({ edgeBucket }) => ({
  type: SET_EDGE_BUCKET,
  edgeBucket,
});
