export function apiError(err) {
  return err.response?.data?.message || "Something went wrong";
}
