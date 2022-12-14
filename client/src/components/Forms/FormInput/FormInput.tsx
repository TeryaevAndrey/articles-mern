import React from "react";
import styled from "styled-components";
import { RegularExpressionLiteral } from "typescript";

const Wrapper = styled.input`
  width: 100%;
  min-height: 70px;
  background-color: #fff;
  padding: 25px 30px;
  font-size: 16px;
  font-weight: 600;
  color: #4d3d3d;
  border-radius: 10px;
  outline: none;
  border: none;
  border-bottom: 1px solid #4d3d3d;
  transition: all 0.3s ease;

  &::placeholder {
    color: #4d3d3d;
  }

  &:focus {
    border-bottom: 1px solid #31a54b;
  }

  &.error::placeholder {
    color: red;
  }

  &.error {
    border-bottom: 1px solid red;
  }
`;

interface FormInputProps {
  type: string;
  placeholder: string;
  name?: string;
  onChange?: React.ChangeEventHandler;
  value?: string | string[];
  className?: string;
}

function FormInput({
  type,
  placeholder,
  name,
  onChange,
  value,
  className,
}: FormInputProps) {
  return (
    <Wrapper
      className={className}
      onChange={onChange}
      value={value}
      type={type}
      placeholder={placeholder}
      name={name}
    />
  );
}

export default FormInput;
