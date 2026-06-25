export const getErrorMessage = (err, fallback = "Something went wrong") => {
  if (!err) return fallback;

  const data = err.response?.data;

  if (!data) {
    return err.message || fallback;
  }

  if (typeof data === "string") {
    return data;
  }

  return (
    data.detail ||
    data.error ||
    Object.values(data)[0]?.[0] ||
    fallback
  );
};