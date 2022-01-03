import React from 'react'

const SidebarCompanyLogo = ({ imageUrl, StoreName }) => {
  return (
    <div className='flex px-2 mb-3.5 items-center'>
      <img className='object-contain h-7 w-7 mb-0' src={imageUrl} />
      <span className='font-semibold ml-2.5'>{StoreName}</span>
    </div>
  )
}

export default SidebarCompanyLogo