import { useEffect, useRef, useState } from "react";
import * as React from "react"

type Props = {
  ref: any
}

const useOutsideClick = (props: Props) => {
  const { ref } = props
  const [clickedOutside, setOutsideClick] = useState<boolean | null>(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!ref.current.contains(e.target)) {
        setOutsideClick(true);
      } else {
        setOutsideClick(false);
      }

      setOutsideClick(null);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [ref]);

  return clickedOutside
};

export default useOutsideClick
