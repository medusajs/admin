  export const formatNumber = n => {
    if(discount){
      return (
        ((1 + discount.region.tax_rate / 100) * n) / 100 
      ).toFixed(2)
    }
    return n
  }
