import axios from "axios";
export function isAbort(e: any) {
  return (
    axios.isCancel?.(e) ||
    e?.name === "CanceledError" ||
    e?.code === "ERR_CANCELED" ||
    e?.message === "canceled"
  );
}
