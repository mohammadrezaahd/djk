import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setTitle } from "../../store/slices/attributesSlice";

interface TitleFieldProps {
  onChange: (value: string) => void;
  error?: boolean;
  helperText?: string;
}

const TitleField: React.FC<TitleFieldProps> = ({
  onChange,
  error,
  helperText,
}) => {
  const dispatch = useAppDispatch();
  const title = useAppSelector((state) => state.attributes.title);
  const [currentTitle, setCurrentTitle] = useState(title);

  useEffect(() => {
    setCurrentTitle(title);
  }, [title]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCurrentTitle(newValue);
    onChange(newValue);
    dispatch(setTitle(newValue));
  };

  return (
    <TextField
      fullWidth
      label="عنوان قالب ویژگی"
      value={currentTitle}
      onChange={handleChange}
      error={error}
      helperText={helperText}
      required
    />
  );
};

export default TitleField;