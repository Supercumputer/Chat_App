import { useEffect, useState } from "react";

function Debounce(value, time) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, time);

    // Xóa bộ đếm khi giá trị thay đổi hoặc khi component bị unmount
    return () => clearTimeout(timer);
  }, [value, time]);

  return debouncedValue;
}

export default Debounce;
