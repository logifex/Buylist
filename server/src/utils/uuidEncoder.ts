export const encodeUuidToBase64Url = (uuid: string) => {
  const undecoratedUuid = uuid.replace(/-/g, "");
  const buffer = Buffer.from(undecoratedUuid, "hex");
  const base64UrlUuid = buffer.toString("base64url");

  return base64UrlUuid;
};

export const decodeUuidFromBase64Url = (encodedUuid: string) => {
  const hex = Buffer.from(encodedUuid, "base64url").toString("hex");
  const uuid = `${hex.substring(0, 8)}-${hex.substring(8, 12)}-${hex.substring(
    12,
    16
  )}-${hex.substring(16, 20)}-${hex.substring(20)}`;

  return uuid;
};
