import { useState } from "react";

const useFormState = <T>(initialState: T) => {
  const [state, setState] = useState(initialState);

  const handleChange =
    (field: keyof T) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setState((prev) => ({ ...prev, [field]: value }));
    };

  return { state, handleChange };
};

export default useFormState;
