import React from 'react';

export enum ButtonType {
  primary = 'primary',
  secondary = 'secondary'
}

type Props = {
  type?: ButtonType,
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const classMap = {
  [ButtonType.primary]: 'flex justify-center rounded-md bg-primary px-6 py-1 leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
  [ButtonType.secondary]: 'flex justify-center rounded-md bg-white px-6 py-1 leading-6 border border-solid border-gray-400 text-black shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
}

const disabledClassMap = {
  [ButtonType.primary]: 'flex justify-center rounded-md bg-primary-d px-6 py-1 leading-6 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600',
  [ButtonType.secondary]: "flex justify-center rounded-md bg-gray-400 px-6 py-1 leading-6 text-white shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
}

const Button = ({ type = ButtonType.primary, disabled = false, onClick, children }: Props) => (
  <button
    disabled={disabled}
    className={disabled ? disabledClassMap[type] : classMap[type]}
    onClick={onClick}
  >
    {children}
  </button>
)


export default Button;
