import React from "react"
import IIconProps from "./icon-interface"

interface IBellNotiIconProps extends IIconProps {
  accentColor?: string
}
const BellNotiIcon: React.FC<IBellNotiIconProps> = ({
  size = "24px",
  color = "currentColor",
  accentColor = "#F43F5E",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M14 20C13.7968 20.3042 13.505 20.5566 13.154 20.7321C12.803 20.9076 12.4051 21 12 21C11.5949 21 11.197 20.9076 10.846 20.7321C10.495 20.5566 10.2032 20.3042 10 20"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M18.4735 11.7793C18.0077 11.9228 17.5129 12 17.0001 12C16.9947 12 16.9894 12 16.9841 12C17.2526 13.1526 17.6265 14.0517 18.0122 14.7412C18.1157 14.9262 18.2197 15.0955 18.3223 15.25H5.67782C5.78041 15.0955 5.88443 14.9262 5.98793 14.7412C6.72391 13.4256 7.41673 11.347 7.41673 8.2C7.41673 7.026 7.89488 5.89613 8.7524 5.06004C9.61057 4.22333 10.7784 3.75 12.0001 3.75C12.372 3.75 12.7391 3.79389 13.0938 3.87856C13.4571 3.42462 13.8978 3.03537 14.3959 2.73085C13.6453 2.41632 12.831 2.25 12.0001 2.25C10.3927 2.25 8.84747 2.87238 7.70525 3.98604C6.56238 5.10034 5.91673 6.61575 5.91673 8.2C5.91673 8.46632 5.9114 8.7235 5.90126 8.97181L3.58406 15.3759C3.31067 15.5581 3.18742 15.8975 3.28099 16.2132C3.37538 16.5316 3.66795 16.75 4.00006 16.75H20.0001C20.3322 16.75 20.6247 16.5316 20.7191 16.2132C20.8127 15.8975 20.6895 15.5582 20.4161 15.376M3.59055 15.3713L3.59037 15.3718L3.58947 15.3724L3.58787 15.3734L3.58537 15.3751L3.58406 15.3759L3.58945 15.3721C3.5898 15.3718 3.59017 15.3716 3.59055 15.3713ZM3.59055 15.3713L5.90099 8.97837C5.79921 11.4485 5.22124 13.0393 4.67886 14.0088C4.37901 14.5448 4.08562 14.8989 3.87883 15.1117C3.77524 15.2183 3.69289 15.29 3.6417 15.3316C3.61711 15.3516 3.5997 15.3646 3.59055 15.3713ZM20.4108 15.3725L20.4123 15.3734L20.4148 15.3751L20.4157 15.3757C20.4146 15.3749 20.413 15.3737 20.4107 15.3721C20.4019 15.3657 20.384 15.3524 20.3584 15.3316C20.3072 15.29 20.2249 15.2183 20.1213 15.1117C19.9145 14.8989 19.6211 14.5448 19.3213 14.0088C19.0206 13.4713 18.7089 12.7428 18.4735 11.7793M5.90099 8.97837L7.70525 3.98604L5.90126 8.97181C5.90117 8.974 5.90108 8.97619 5.90099 8.97837Z"
        fill={color}
      />
      <circle cx="17" cy="7" r="3" fill={accentColor} />
    </svg>
  )
}

export default BellNotiIcon
